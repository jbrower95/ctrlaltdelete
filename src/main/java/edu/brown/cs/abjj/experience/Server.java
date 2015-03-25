package edu.brown.cs.abjj.experience;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;

import edu.brown.cs.joengelm.sqldb.Database;

public class Server {
	Map<String, Experience> experiences = new HashMap<>();
	private final static Gson GSON = new Gson();

	public Server(String experiencesDirectory) {
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
				} catch (FileNotFoundException e) {
					System.err.println(experienceFile.getName()
							+ " is missing its config file. It will be omitted.");
				} catch (JsonParseException e) {
					System.err.println(experienceFile.getName()
							+ " has errors in its config file. It will be omitted.");
					System.err.println(e.getMessage());
				}
			}
		} else {
			throw new IllegalArgumentException(experiencesDirectory
					+ " is not a directory");
		}
	}

	public void run() {
		Spark.externalStaticFileLocation("src/main/resources/static");
		Spark.externalStaticFileLocation("/Users/joeengelman/Desktop");
		Spark.get("/", new IndexHandler(), new FreeMarkerEngine());
		Spark.get("/:experience", new ExperienceMenuHandler(),
				new FreeMarkerEngine());
		Spark.get("/:experience/content/*", new ContentHandler());
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
			Experience exp = experiences.get(req.params(":experience"));

			return req.splat().toString();
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
