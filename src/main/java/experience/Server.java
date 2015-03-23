package experience;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import spark.ModelAndView;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

import com.google.common.collect.ImmutableMap;

public class Server {
	Map<String, Experience> experiences = new HashMap<>();

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
		public ModelAndView handle(Request req, Response res) {
			Experience exp = experiences.get(req.params(":experience"));
			String id = req.queryParams("id");

			// exp.getContentById(id);
			return null;
		}
	}
}
