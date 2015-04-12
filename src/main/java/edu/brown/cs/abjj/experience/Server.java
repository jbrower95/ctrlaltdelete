package edu.brown.cs.abjj.experience;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;

import edu.brown.cs.joengelm.sqldb.Database;

public class Server {
	Map<String, Experience> experiences = new HashMap<>();
	private final static Gson GSON = new Gson();

	private final static Map<String, String> contentTypes = getContentTypes();
	private final static Set<String> typesWithoutBytes = ImmutableSet.of(
			"text/html", "text/css", "application/javascript");

	public static Map<String, String> getContentTypes() {
		Map<String, String> types = new HashMap<>();

		// typical web files
		types.put("html", "text/html");
		types.put("htm", "text/html");
		types.put("css", "text/css");
		types.put("js", "application/javascript");

		// media (image)
		types.put("png", "image/png");
		types.put("jpg", "image/jpeg");
		types.put("jpeg", "image/jpeg");
		types.put("gif", "image/gif");

		// media (video)
		types.put("mp4", "video/mp4");
		types.put("webm", "video/webm");

		return types;
	}

	public Server(String experiencesDirectory) {
		System.out.println("[server] Binding file directory: "
				+ experiencesDirectory);
		Spark.externalStaticFileLocation(experiencesDirectory);
		File dir = new File(experiencesDirectory);
		File[] directoryListing = dir.listFiles();
		if (directoryListing != null) {
			for (File experienceFile : directoryListing) {
				if (experienceFile.isHidden()) {
					continue;
				}
				try {
					Experience exp = new Experience(experienceFile.getPath());

					experiences.put(exp.filename, exp);
					System.out.println("[server] Binding directory for experience: "
							+ experienceFile.getPath());
					Spark.externalStaticFileLocation(experienceFile.getPath());
					System.out.println("Successfully loaded experience: "
							+ experienceFile.getName());
				} catch (FileNotFoundException e) {
					System.err.println(experienceFile.getName()
							+ " is missing its config file. It will be omitted.");
				} catch (JsonParseException e) {
					System.err.println(experienceFile.getName()
							+ " has errors in its config file. It will be omitted.");
					System.err.println(e.getMessage());
				} catch (IllegalArgumentException e) {
					System.err.println(experienceFile.getName() + " - " + e.getMessage());
				}
			}
		} else {
			throw new IllegalArgumentException(experiencesDirectory
					+ " is not a directory");
		}
	}

	public void run() {
		Spark.externalStaticFileLocation("src/main/resources/static");
		Spark.get("/", new IndexHandler(), new FreeMarkerEngine());
		Spark.get("/:experience", new ExperienceMenuHandler(),
				new FreeMarkerEngine());
		Spark.get("/:experience/content/*", new ContentHandler());

		Spark.get("/:experience/play", new PlayHandler());
		Spark.get("/:experience/:asset", new GameHandler());
		Spark.get("/:experience/lib/:asset", new LibHandler());
		Spark.get("/:experience/:scene/:asset", new SceneContentHandler());

		Spark.post("/:experience/score", new PostScoreHandler());
		Spark.get("/:experience/score", new GetScoreHandler());
	}

	/**
	 * Handle requests directed to this site's index.
	 *
	 * @author joengelm
	 */
	public class IndexHandler implements TemplateViewRoute {
		@Override
		public ModelAndView handle(Request req, Response res) {
			List<String> experienceNames = new ArrayList<>();
			List<String> experienceFileNames = new ArrayList<>();
			for (Experience exp : experiences.values()) {
				experienceFileNames.add(exp.filename);
				experienceNames.add(exp.name);
			}

			Map<String, Object> variables = ImmutableMap.of("expFileNames",
					experienceFileNames, "expNames", experienceNames);
			return new ModelAndView(variables, "index.ftl");
		}
	}

	/**
	 * Handle requests directed to each experience's main menu.
	 *
	 * @author joengelm
	 */
	public class ExperienceMenuHandler implements TemplateViewRoute {
		@Override
		public ModelAndView handle(Request req, Response res) {
			String experienceFileName = req.params(":experience");
			if (!experiences.containsKey(experienceFileName)) {
				res.status(404);
				return new ModelAndView(new HashMap<>(), "error.ftl");
			}

			Experience exp = experiences.get(experienceFileName);

			Map<String, Object> variables = ImmutableMap.of("title", exp.name,
					"description", exp.description, "playLink", "/" + exp.filename
					+ "/play", "scoresLink", "/" + exp.filename + "/scores");
			return new ModelAndView(variables, "menu.ftl");
		}
	}

	/**
	 * Handle requests directed to each experience's content database.
	 *
	 * @author joengelm
	 */
	public class ContentHandler implements Route {
		@Override
		public Object handle(Request req, Response res) {
			// TODO idek
			return req.splat().toString();
		}
	}

	/**
	 * Handle requests directed to each experience's content database.
	 *
	 * @author joengelm
	 */
	public class LibHandler implements Route {
		@Override
		public Object handle(Request req, Response res) {
			String asset = req.params(":asset");

			String path = ("src/main/resources/static/js/" + asset);

			System.out.println("Serving library: " + path);

			try {
				res.type("application/javascript");
				String[] contents = Files.readAllLines(Paths.get(path)).toArray(
						new String[1]);
				StringBuilder result = new StringBuilder();
				// flatten contents
				for (String x : contents) {
					result.append(x + "\n");
				}
				return result.toString();
			} catch (Exception e) {
				e.printStackTrace();
				return e.getMessage();
			}
		}
	}

	/**
	 * Handle requests directed to each experience's small files.
	 *
	 * @author joengelm
	 */
	public class GameHandler implements Route {
		@Override
		public Object handle(Request req, Response res)
				throws IllegalArgumentException {
			Experience exp = experiences.get(req.params(":experience"));
			String asset = req.params(":asset");

			String path = (exp.directory + "/" + asset);

			System.out.println("Trying to get asset: " + asset);

			if (!exp.files.contains(new JsonPrimitive(asset))) {
				throw new IllegalArgumentException("Error: Can't access asset " + asset
						+ " -  Not declared in manifest.");
			}

			System.out.println("Experience: " + exp.directory);

			try {
				String[] assetParts = asset.split("[.]");
				String type = contentTypes.getOrDefault(
						assetParts[assetParts.length - 1], "application/octet-stream");
				if (typesWithoutBytes.contains(type)) {
					String[] contents = Files.readAllLines(Paths.get(path)).toArray(
							new String[1]);
					StringBuilder result = new StringBuilder();
					// flatten contents
					for (String x : contents) {
						result.append(x + '\n');
					}
					return result.toString();
				} else {
					final FileInputStream in = new FileInputStream(path);
					Response response = res;
					byte[] contents = Files.readAllBytes(Paths.get(path));
					System.out.println("Serving asset: " + asset);
					response.header("Content-Disposition",
							String.format("attachment; filename=\"%s\"", asset));
					response.header("Connection", "close");
					response.raw().setContentLength(contents.length);

					final OutputStream os = response.raw().getOutputStream();

					for (byte b : contents) {
						os.write(b);
					}

					in.close();
					os.close();

					return null;
				}
			} catch (Exception e) {
				e.printStackTrace();
				return "Error: Couldn't load asset.";
			}
		}
	}

	/**
	 * Handle requests directed to each experience's small files.
	 *
	 * @author joengelm
	 */
	public class SceneContentHandler implements Route {
		@Override
		public Object handle(Request req, Response res)
				throws IllegalArgumentException {
			Experience exp = experiences.get(req.params(":experience"));
			String scene = req.params(":scene");
			String asset = req.params(":asset");

			String path = (exp.directory + "/" + scene + "/" + asset);

			System.out.println("Trying to get asset: " + asset);

			if (!exp.files.contains(new JsonPrimitive(scene + "/" + asset))) {
				throw new IllegalArgumentException("Error: Can't access asset " + asset
						+ " -  Not declared in manifest.");
			}

			System.out.println("Experience: " + exp.directory);

			try {
				String[] assetParts = asset.split("[.]");
				String type = contentTypes.getOrDefault(
						assetParts[assetParts.length - 1], "application/octet-stream");
				System.out.println("Asset: " + asset + " is of type: " + type);
				if (typesWithoutBytes.contains(type)) {
					String[] contents = Files.readAllLines(Paths.get(path)).toArray(
							new String[1]);
					StringBuilder result = new StringBuilder();
					// flatten contents
					for (String x : contents) {
						result.append(x + '\n');
					}
					return result.toString();
				} else {
					final FileInputStream in = new FileInputStream(path);
					Response response = res;
					byte[] contents = Files.readAllBytes(Paths.get(path));
					System.out.println("Serving asset: " + asset);
					response.header("Content-Disposition",
							String.format("attachment; filename=\"%s\"", asset));
					response.header("Connection", "close");
					response.raw().setContentLength(contents.length);

					final OutputStream os = response.raw().getOutputStream();

					for (byte b : contents) {
						os.write(b);
					}

					in.close();
					os.close();

					return null;
				}
			} catch (Exception e) {
				e.printStackTrace();
				return "Error: Couldn't load asset.";
			}
		}
	}

	/**
	 * Handle requests directed to each experience's content database.
	 *
	 * @author joengelm
	 */
	public class PlayHandler implements Route {
		@Override
		public Object handle(Request req, Response res) {
			Experience exp = experiences.get(req.params(":experience"));
			res.redirect(exp.mainFile);
			return res;
		}
	}

	/**
	 * Handle requests posting new scores to each experience's score database.
	 *
	 * @author joengelm
	 */
	public class PostScoreHandler implements Route {
		@Override
		public Object handle(Request req, Response res) {
			Experience exp = experiences.get(req.params(":experience"));
			QueryParamsMap qm = req.queryMap();

			String name = qm.value("name");
			String score = qm.value("score");

			try {
				double value = Double.parseDouble(score);
				exp.db.addScore(new Score(name, value, Database.getCurrentTimestamp()));
			} catch (NumberFormatException e) {
				res.status(400);
				return false;
			}
			return true;
		}
	}

	/**
	 * Handle requests getting best scores from each experience's score database.
	 *
	 * @author joengelm
	 */
	public class GetScoreHandler implements Route {
		@Override
		public Object handle(Request req, Response res) {
			Experience exp = experiences.get(req.params(":experience"));
			String limitString = req.params("limit");
			try {
				int limit = Integer.parseInt(limitString);
				return GSON.toJson(exp.db.getBestNScores(limit));
			} catch (NumberFormatException e) {
				res.status(400);
				return false;
			}
		}
	}
}
