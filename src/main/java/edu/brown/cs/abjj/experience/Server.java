package edu.brown.cs.abjj.experience;

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

import edu.brown.cs.joengelm.sqldb.Database;

public class Server {
	Map<String, Experience> experiences = new HashMap<>();
	private final static Gson GSON = new Gson();

	public Server(List<String> experienceFiles) {
		for (String experienceFile : experienceFiles) {
			experiences.put(experienceFile, new Experience(experienceFile));
		}
	}

	public void run() {
		Spark.externalStaticFileLocation("src/main/resources/static");
		Spark.externalStaticFileLocation("/Users/joeengelman/Desktop");
		Spark.get("/", new IndexHandler(), new FreeMarkerEngine());
		Spark.get("/:experience", new ExperienceMenuHandler(),
				new FreeMarkerEngine());
		Spark.get("/:experience/content", new ContentHandler());
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
			for (Experience exp : experiences.values()) {
				experienceNames.add(exp.name);
			}

			Map<String, Object> variables = ImmutableMap.of("experiences",
					experienceNames);
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
			String experienceName = req.params(":experience");
			if (!experiences.containsKey(experienceName)) {
				res.status(404);
				return new ModelAndView(new HashMap<>(), "error.ftl");
			}
			Map<String, Object> variables = ImmutableMap.of("title",
					req.params(":experience"));
			return new ModelAndView(variables, "menu.ftl"); // this FTL should be from
			// experience package
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
			String id = req.queryParams("id");

			// exp.getContentById(id);
			return null;
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
