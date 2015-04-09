package edu.brown.cs.abjj.experience;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.common.net.MediaType;
import com.sun.tools.doclets.internal.toolkit.util.DocFinder;
import jdk.net.SocketFlow;
import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;
import java.nio.file.Paths;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;

import edu.brown.cs.joengelm.sqldb.Database;
import com.google.gson.JsonPrimitive;
import spark.utils.IOUtils;

import javax.servlet.ServletOutputStream;
import java.net.URL;
import java.net.URLConnection;
public class Server {
	Map<String, Experience> experiences = new HashMap<>();
	private final static Gson GSON = new Gson();

	public Server(String experiencesDirectory) {
        System.out.println("[server] Binding file directory: " + experiencesDirectory);
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
                    System.out.println("[server] Binding directory for experience: " + experienceFile.getPath());
                    Spark.externalStaticFileLocation(experienceFile.getPath());
                    System.out.println("Successfully loaded experience: " + experienceFile.getName());
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
		//Spark.externalStaticFileLocation("/Users/joeengelman/Desktop");
		Spark.get("/", new IndexHandler(), new FreeMarkerEngine());
		Spark.get("/:experience", new ExperienceMenuHandler(),
				new FreeMarkerEngine());
		Spark.get("/:experience/content/*", new ContentHandler());


        for (Experience exp : experiences.values()) {
            Spark.get("/:experience/:asset", new GameHandler());
            Spark.get("/:experience/lib/:asset", new LibHandler());
            Spark.get("/:experience/:scene/:asset", new SceneContentHandler());
        }




        Spark.get("/:experience/play", new PlayHandler());
		Spark.post("/:experience/score", new PostScoreHandler());
		Spark.get("/:experience/score", new GetScoreHandler());

        //Spark.get("/:experience/:asset", new GameHandler());
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
			Experience exp = experiences.get(req.params(":experience"));
            //TODO: fix content handler
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
            Experience exp = experiences.get(req.params(":experience"));
            String asset = req.params(":asset");

            String path = ("src/main/resources/static/js/" + asset);

            System.out.println("Serving library: " + path);

            try {
                res.type("application/javascript");
                String[] contents = Files.readAllLines(Paths.get(path)).toArray(new String[1]);
                StringBuilder result = new StringBuilder();
                //flatten contents
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
        public Object handle(Request req, Response res) throws IllegalArgumentException {
            Experience exp = experiences.get(req.params(":experience"));
            String asset = req.params(":asset");

            String path = (exp.directory + "/" + asset);

            System.out.println("Trying to get asset: " + asset);

            if (!exp.files.contains(new JsonPrimitive(asset))) {
                throw new IllegalArgumentException("Error: Can't access asset " + asset + " -  Not declared in manifest.");
            }

            System.out.println("Experience: " + exp.directory);

            try {
                boolean doBytes = false;
                if (asset.endsWith(".html") || asset.endsWith(".htm")) {
                    res.type("text/html");
                } else if (asset.endsWith(".css")) {
                  res.type("text/css");
                } else if (asset.endsWith(".js")) {
                    res.type("application/javascript");
                } else if (asset.endsWith(".png")) {
                    res.type("image/png");
                } else if (asset.endsWith(".jpg") || asset.endsWith(".jpeg")) {
                    res.type("image/jpeg");
                } else if (asset.endsWith(".gif")) {
                    res.type("image/gif");
                } else if (asset.endsWith(".mp4")) {
                    System.out.println("Serving an MP4");
                    res.type("video/mp4");
                    doBytes = true;
                } else if (asset.endsWith(".webm")) {
                    res.type("video/webm");
                    doBytes = true;
                } else {
                    res.type("application/octet-stream");
                    doBytes = true;
                }

                if (!doBytes) {
                    String[] contents = Files.readAllLines(Paths.get(path)).toArray(new String[1]);
                    StringBuilder result = new StringBuilder();
                    //flatten contents
                    for (String x : contents) {
                        result.append(x + '\n');
                    }
                    return result.toString();
                } else {

                    final FileInputStream in = new FileInputStream(path);
                    Response response = res;
                    byte[] contents = Files.readAllBytes(Paths.get(path));
                    System.out.println("Serving asset: " + asset);
                    response.header("Content-Disposition", String.format("attachment; filename=\"%s\"", asset));
                    response.header("Connection", "close");
                    //response.type(Files.probeContentType(Paths.get(path)));
                    response.raw().setContentLength(contents.length);

                    final OutputStream os = response.raw().getOutputStream();
                    //spark.utils.IOUtils.copy(in, new OutputStreamWriter(os));

                    for (byte b : contents) {
                        os.write(b);
                    }
                    //os.write(contents);


                    in.close();
                    //os.write(contents);
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
        public Object handle(Request req, Response res) throws IllegalArgumentException {
            Experience exp = experiences.get(req.params(":experience"));
            String scene = req.params(":scene");
            String asset = req.params(":asset");

            String path = (exp.directory + "/" + scene + "/" + asset);

            System.out.println("Trying to get asset: " + asset);

            if (!exp.files.contains(new JsonPrimitive(scene + "/" + asset))) {
                throw new IllegalArgumentException("Error: Can't access asset " + asset + " -  Not declared in manifest.");
            }

            System.out.println("Experience: " + exp.directory);

            try {
                boolean doBytes = false;
                if (asset.endsWith(".html") || asset.endsWith(".htm")) {
                    res.type("text/html");
                } else if (asset.endsWith(".css")) {
                    res.type("text/css");
                } else if (asset.endsWith(".js")) {
                    res.type("application/javascript");
                } else if (asset.endsWith(".png")) {
                    res.type("image/png");
                } else if (asset.endsWith(".jpg") || asset.endsWith(".jpeg")) {
                    res.type("image/jpeg");
                } else if (asset.endsWith(".gif")) {
                    res.type("image/gif");
                } else if (asset.endsWith(".mp4")) {
                    System.out.println("Serving an MP4");
                    res.type("video/mp4");
                    doBytes = true;
                } else if (asset.endsWith(".webm")) {
                    res.type("video/webm");
                    doBytes = true;
                } else {
                    res.type("application/octet-stream");
                    doBytes = true;
                }

                if (!doBytes) {
                    String[] contents = Files.readAllLines(Paths.get(path)).toArray(new String[1]);
                    StringBuilder result = new StringBuilder();
                    //flatten contents
                    for (String x : contents) {
                        result.append(x + '\n');
                    }
                    return result.toString();
                } else {

                    final FileInputStream in = new FileInputStream(path);
                    Response response = res;
                    byte[] contents = Files.readAllBytes(Paths.get(path));
                    System.out.println("Serving asset: " + asset);
                    response.header("Content-Disposition", String.format("attachment; filename=\"%s\"", asset));
                    response.header("Connection", "close");
                    //response.type(Files.probeContentType(Paths.get(path)));
                    response.raw().setContentLength(contents.length);

                    final OutputStream os = response.raw().getOutputStream();
                    //spark.utils.IOUtils.copy(in, new OutputStreamWriter(os));

                    for (byte b : contents) {
                        os.write(b);
                    }
                    //os.write(contents);


                    in.close();
                    //os.write(contents);
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
