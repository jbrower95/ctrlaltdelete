package edu.brown.cs.experience;

import java.io.*;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletResponse;
import javax.servlet.http.Part;

import org.eclipse.jetty.io.EofException;
import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;

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
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import edu.brown.cs.joengelm.sqldb.Database;

public class Server {
  Map<String, Experience> experiences = new HashMap<>();
  private final static Gson GSON = new Gson();
  private final String directory;
  private int newExpId;
  
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
    this.directory = experiencesDirectory;
    newExpId = 0;
    senseChanges();
  }

  public void run() {
    Spark.externalStaticFileLocation(directory);

    Spark.get("/", new IndexHandler(), new FreeMarkerEngine());
    Spark.get("/maker", new MakerHandler(), new FreeMarkerEngine());
    Spark.get("/reload", new ReloadHandler());
    Spark.get("/make", new NewEditorHandler(), new FreeMarkerEngine());
    Spark.get("/:experience", new ExperienceMenuHandler(),
      new FreeMarkerEngine());
    Spark.get("/:experience/editor", new EditorHandler(),
      new FreeMarkerEngine());

    /* Maker Endpoints */
    Spark.get("/:experience/scenes", new ListAllScenesHandler());
    Spark.get("/:experience/main/edit", new SceneIndexHandler());
    Spark.post("/:experience/:scene/edit", new SceneEditHandler());
    Spark.get("/:experience/:scene/edit", new SceneGetterHandler());
    Spark.delete("/:experience/:scene/edit", new DeleteSceneHandler());
    Spark.post("/:experience", new AssetUploadHandler());
    Spark.delete("/:experience", new DeleteExperienceHandler());
    Spark.put("/:experience/newscene", new SceneTemplateHandler());

    Spark.get("/:experience/play", new PlayHandler());
    Spark.post("/:experience/scores", new PostScoresHandler());
    Spark.get("/:experience/scores", new GetScoresHandler());
    Spark.post("/:experience/scores", new PostScoresHandler());
    Spark.post("/:experience/saveedit", new SaveEditedExperienceHandler());
    Spark.get("/:experience/lib/*", new LibHandler());
    Spark.get("/lib/*", new LibHandler());
    Spark.get("/:experience/:asset", new GameHandler());
    Spark.get("/:experience/:scene/:asset", new SceneContentHandler());
    
  }
  
  /**
   * Deletes an experience. Does this by removing the directory and then sensing changes.
   * @author Justin
   */
  public class DeleteExperienceHandler implements Route {

	@Override
	public Object handle(Request request, Response response) {
		System.out.println("DeleteExperienceHandler!");
		String experienceName = request.params(":experience");
		
		if (experienceName == "ctrlaltdel") {
			System.err.println("Don't delete this, you idiot.");
			return GSON.toJson(ImmutableMap.of("success", "false", "error", "Protected resource."));
		}
		
		Path expPath = Paths.get(directory + File.separator + experienceName);
		
		try {
			FileUtils.deleteDirectory(new File(expPath.toAbsolutePath().toString()));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			response.status(404);
			return GSON.toJson(ImmutableMap.of("success", "false", "error", "Couldn't delete experience!"));
		}
		
		int numExperiences = experiences.size();
		
		senseChanges();
		
		assert (experiences.size() < numExperiences);
		
		return GSON.toJson(ImmutableMap.of("success", "true"));
	}
  }
  
  
  /**
   * Lists all of the scenes associated with an experience.
   * @author Justin
   */
  public class ListAllScenesHandler implements Route {

	@Override
	public Object handle(Request request, Response response) {
		System.out.println("ListAllScenesHandler!");
		String experienceName = request.params(":experience");
		senseChanges();
		Experience experience = experiences.get(experienceName);
		String output = GSON.toJson(experience.getScenes().stream().map(scene -> ImmutableMap.of("id",scene.getId())).collect(Collectors.toList()));
		System.out.println("Output: " + output);
		return output;
	}
  }
  
  /**
   * SceneTemplateHandler is responsible for copying in the template files for a new scene, as well as determining a name for a new scene.
   * This creates a new scene.
   * PUT /:experience/newscene
   * 
   * returns: JSON of the scene object that was created.
   * 
   * @author Justin
   *
   */
  public class SceneTemplateHandler implements Route {

	@Override
	public Object handle(Request request, Response response) {
		System.out.println("SceneTemplateHandler!");
		String experience = request.params(":experience");
		String expDirectory = directory + File.separator + experience;
		
		int uniqueId = 1;
		
		Path tentativeSpot;
		
		while (true) {
			//see if this file exists
			tentativeSpot = Paths.get(expDirectory + "/newScene" + uniqueId + ".scene");
			
			if (!Files.exists(tentativeSpot)) {
				//awesome.
				break;
			} else {
				uniqueId++;
			}
			
			if (uniqueId > 500) {
				System.err.println("There are 500 'newScene' instances. This is getting a bit excessive.");
				response.status(503);
				return GSON.toJson(ImmutableMap.of("success", "false", "error", "Error: You have too many default 'newScene' instances. Please make room for more."));
			}
		}
		
		//create the directory for the scene.
		new File(tentativeSpot.toAbsolutePath().toString()).mkdirs();
		
		//copy the files in this directory.
		String baseName = "newScene" + uniqueId;
		
		String sceneTemplateDirectory = "src/main/resources/static/template/scene";
		
		try {
			
			File[] files = new File(sceneTemplateDirectory).listFiles();
			
			//copy all of the template files.
			for (File file : files) {
				
				String fileExtension = file.getName().split("\\.")[1];
				
				String location = tentativeSpot.resolve(baseName + "." + fileExtension).toAbsolutePath().toString();
				
				InputStream inputStream = new FileInputStream(file);
				FileOutputStream outputStream = new FileOutputStream(new File(location));
				
				byte[] input = Files.readAllBytes(file.toPath());
				
				String result = new String(input, Charset.defaultCharset());
				result = result.replaceAll("SCENENAME", baseName);
				
				byte[] outputData = result.getBytes();
				outputStream.write(outputData, 0, outputData.length);
				
				inputStream.close();
				outputStream.close();
			}
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		senseChanges();
		System.out.println("Got templates");
		Experience e = experiences.get(experience);
		
		Optional<Scene> createdScene = e.getScenes().stream().filter(scene -> scene.getId().equals(baseName)).findAny();
		
		if (createdScene.isPresent()) {
			return GSON.toJson(ImmutableMap.of("success", "true", "scene", createdScene.get()));
		} else {
			return GSON.toJson(ImmutableMap.of("success", "false", "error", "Couldn't create scene!"));
		}
	}
  }
  
  /**
   * Deletes a scene.
   * 
   * DELETE /:experience/:scene/edit
   * 
   * @author Justin
   */
  public class DeleteSceneHandler implements Route {

	@Override
	public Object handle(Request request, Response response) {
		System.out.println("DeleteSceneHandler!");
		String experienceName = request.params(":experience");
		String sceneName = request.params(":scene");
		Experience exp = experiences.getOrDefault(experienceName, null);
		
		if (exp == null) {
			response.status(404);
			return GSON.toJson(ImmutableMap.of("success", "false", "error", "Unknown experience!"));
		}
		
		try {
			FileUtils.deleteDirectory(new File(directory + File.separator + experienceName + File.separator + sceneName));
			senseChanges();
			return GSON.toJson(ImmutableMap.of("success", "true"));
		} catch (IOException e) {
			e.printStackTrace();
			response.status(404);
			//TODO: update status code to real status code for this operation failing
			return GSON.toJson(ImmutableMap.of("success", "false", "error", "Deletion failed!"));
		}
	}
  }
  
  /**
   * Allows edits to a scenes content by simply uploading files and replacing the 
   * existing scene.
   * 
   * POST /:experience/:scene/edit
   * 
   * @author Justin
   */
  public class SceneEditHandler implements Route {

	  class Edit {
		  
		  String text;
		  String type;
		  
		  public Edit(String text, String type) {};
	  }
	  
	@Override
	public Object handle(Request request, Response response) {
		System.out.println("SceneEditHandler!");
		String experienceName = request.params(":experience");
		String sceneName = request.params(":scene");
		System.out.println("Handling file upload...");
		System.out.println("Current directory: " + Paths.get(".").toAbsolutePath().toString());
		Path sceneDir = Paths.get(directory + File.separator + experienceName + File.separator + sceneName);

		
		
		Map<String, String> bodyObject = new HashMap<String, String>();
		
		bodyObject = GSON.fromJson(request.body(), bodyObject.getClass());
		
		QueryParamsMap qm = request.queryMap();
		String type = qm.value("type");
		String text = qm.value("text");
		
		
		
		
		
		File file = new File(sceneDir.resolve(sceneName + "." + type).toAbsolutePath().toString());

		if (file.getAbsoluteFile().exists()) {
			try {
				System.out.println("[sceneeditor] Creating file: " + file.getAbsolutePath());
				file.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
				System.out
						.println("ERROR: IOException in SceneEditHandler. Couldn't create file -" + file.getPath());
				return GSON.toJson(false);
			}
		}

		try {
			FileWriter fw = new FileWriter(file.getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(text);
			bw.close();
		} catch (IOException e) {
			e.printStackTrace();
			System.out
					.println("ERROR: IOException in SceneEditHandler. Couldn't write over " + file.getPath());
			return GSON.toJson(false);
		}

		return GSON.toJson(true);
	}
  }
  
  /**
   * Should return detailed and updated information about a specific scene.
   * @author Justin
   *
   */
  public class SceneGetterHandler implements Route {

	@Override
	public Object handle(Request request, Response response) {
		System.out.println("SceneGetterHandler!");
		String experienceName = request.params(":experience");
		String sceneName = request.params(":scene");
		senseChanges();
		Experience experience = experiences.get(experienceName);
		
		Optional<Scene> scene = experience.getScenes().stream().filter(anyScene -> anyScene.getId().equals(sceneName)).findAny();
		
		if (scene.isPresent()) {
			return GSON.toJson(scene);
		} else {
			response.status(404);
			return GSON.toJson(response);
		}
	}
  }

	/**
	 * Should return detailed and updated information about a specific scene.
	 * @author Justin
	 *
	 */
	public class SceneIndexHandler implements Route {

		@Override
		public Object handle(Request request, Response response) {
			System.out.println("SceneIndexHandler!");
			String experienceName = request.params(":experience");
			senseChanges();
			Experience experience = experiences.get(experienceName);

			File inJs = new File(directory + File.separator + experience.filename + File.separator + "index.js");
			File inHtml = new File(directory + File.separator + experience.filename + File.separator + "index.html");
			File inCss = new File(directory + File.separator + experience.filename + File.separator + "index.css");

			String js = "";
			String html = "";
			String css = "";

			if (inJs.exists()) {
				System.out.println("Found js file.");
				try {
					byte[] encoded = Files.readAllBytes(inJs.toPath());
					js = new String(encoded, Charset.defaultCharset());
				} catch (IOException e) {
					System.err.println("Error: Couldn't read index.js");
				}
			}

			if (inHtml.exists()) {
				System.out.println("Found html file.");
				try {
					byte[] encoded = Files.readAllBytes(inHtml.toPath());
					html = new String(encoded, Charset.defaultCharset());
				} catch (IOException e) {
					System.err.println("Error: Couldn't read html for index.html");
				}
			}

			if (inCss.exists()) {
				System.out.println("Found css file.");
				try {
					byte[] encoded = Files.readAllBytes(inCss.toPath());
					css = new String(encoded, Charset.defaultCharset());
				} catch (IOException e) {
					System.err.println("Error: Couldn't read css for index.css");
				}
			}
			Map<String, Object> files = ImmutableMap.of("js", js, "html", html, "css", css);
			return GSON.toJson(files);
		}
	}
  
  /**
   * Handles uploading assets to an experience.
   * @author Justin
   *
   */
  public class AssetUploadHandler implements Route {

	@Override
	public Object handle(Request request, Response response) {
		
		System.out.println("Handling file upload...");
		
		 System.out.println("Current directory: " + Paths.get(".").toAbsolutePath().toString());
		String experienceName = request.params(":experience");
		Path assetsDir = Paths.get(directory + File.separator + experienceName + File.separator + "assets");
		
		MultipartConfigElement multipartConfigElement = new MultipartConfigElement(assetsDir.toAbsolutePath().toString());
		   request.raw().setAttribute("org.eclipse.multipartConfig", multipartConfigElement);
		
		try {
			Part file = request.raw().getPart("file");
			if (!Files.exists(assetsDir)) {
				System.out.println("Creating assets directory...: " + assetsDir.toString());
				//create the directory for assets
				Files.createDirectories(assetsDir);
			}
			
			System.out.println("Uploading file: " + getFileName(file));
			file.write(getFileName(file));
			
		} catch (IOException | ServletException e) {
			System.err.println("Failed.");
			e.printStackTrace();
			return GSON.toJson(ImmutableMap.of("success", "false"));
		} 
		System.out.println("Sweet.");
		return GSON.toJson(ImmutableMap.of("success", "true"));
	}
  }
  
  
  /**
   * This has been proposed to be part of the javax.servlet.http.Part spec,
   * but they never added it. This simply gets the filename of a part.
   * 
   * (source: https://java.net/jira/browse/SERVLET_SPEC-57)
   * 
   * @param filePart The part object
   * @return The filename associated with the part.
   */
  public static String getFileName(Part filePart)
  {
      String header = filePart.getHeader("content-disposition");
      for(String headerPart : header.split(";"))
      {
          if(headerPart.trim().startsWith("filename"))
          {
              return headerPart.substring(headerPart.indexOf('=') + 1).trim()
                               .replace("\"", "");
          }
      }
      return null;
  }
  

  public void senseChanges() {
    System.out.println("[server] Binding file directory: " + directory);
    File dir = new File(directory);
    File[] directoryListing = dir.listFiles();
    if (directoryListing != null) {
      for (File experienceFile : directoryListing) {
        if (experienceFile.isHidden()) {
          continue;
        }
        try {
          Experience exp = new Experience(experienceFile.getPath());

          experiences.put(exp.getId(), exp);

          /*System.out.println("[server] Binding directory for experience: "
            + experienceFile.getPath());
          System.out.println("Successfully loaded experience: "
            + experienceFile.getName());*/
        } catch (FileNotFoundException e) {
          System.err.println(experienceFile.getName()
            + " is missing its config file. It will be omitted.");
        } catch (JsonParseException e) {
          System.err.println(experienceFile.getName()
            + " has errors in its config file. It will be omitted.");
          System.err.println(e.getMessage());
        } catch (IllegalArgumentException e) {
          System.err.println(experienceFile.getName() + " - "
            + e.getMessage());
        }
      }
    } else {
      throw new IllegalArgumentException(directory + " is not a directory");
    }
  }

  public class ReloadHandler implements Route {
    @Override
    public Object handle(Request request, Response response) {
      senseChanges();
      return GSON.toJson(ImmutableMap.of("success", "true"));
    }
  }

  /**
   * Takes a URL string and decodes using UTF-8.
   * @param url The given url.
   * @return The decoded url, if available, else null.
   */
  public String getTitleFromURL(String url) {
    String s = null;
    try {
      s = URLDecoder.decode(url, "UTF-8");
    } catch (UnsupportedEncodingException e) {
      System.err.println("ERROR: UTF-8 encoding is unsupported.");
    }

    return s;
  }

  /**
   * Gets an encoded URL from a title.
   * @param title The given title.
   * @return If able to encode, the encoded title,
   * else null.
   */
  public String getURLFromTitle(String title) {
    String s = null;
    try {
      s = URLEncoder.encode(title, "UTF-8")
              .replaceAll("\\+", "%20")
              .replaceAll("\\%21", "!")
              .replaceAll("\\%27", "'")
              .replaceAll("\\%28", "(")
              .replaceAll("\\%29", ")")
              .replaceAll("\\%7E", "~");;
    } catch (UnsupportedEncodingException e) {
      System.err.println("ERROR: UTF-8 encoding is unsupported.");
    }

    return s;
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
      List<String> experienceColors = new ArrayList<>();
      for (Experience exp : experiences.values()) {
        experienceFileNames.add(exp.filename);
        experienceNames.add(getTitleFromURL(exp.getName()));
        experienceColors.add(exp.getColor());
      }

      Map<String, Object> variables = ImmutableMap.of("expFileNames",
        experienceFileNames, "expNames", experienceNames, "expColors",
        experienceColors);
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

      Map<String, Object> variables = ImmutableMap.of("title",
        exp.getName(), "color", exp.getColor(), "description",
        exp.getDescription(), "playLink", "/" + exp.filename + "/play",
        "scoresLink", "/" + exp.filename + "/scores");
      return new ModelAndView(variables, "menu.ftl");
    }
  }

  /**
   * Handle requests directed to each experience's content database.
   *
   * @author joengelm
   */
  public class LibHandler implements Route {
    @Override
    public Object handle(Request request, Response response) {
      String asset = request.splat()[0];
      Path assetPath = Paths.get("src").resolve("main").resolve("resources").resolve("static").resolve(asset);
      return serveAsset(response, assetPath);
    }
  }
  
  private final Tika tika = new Tika();
  
    /**
     * Serves a file to the connection.
     * @param response The response which must contain the file.
     * @param assetPath The path to the asset to serve.
     * @return
     */
  private String serveAsset(Response response, Path assetPath) {
	  try {
      byte[] contents = Files.readAllBytes(assetPath);
      
      System.out.println("[serveAsset] " + assetPath);
      
      response.header("Content-Type", tika.detect(assetPath.toFile()));
      response.header("Connection", "close");
      response.raw().setContentLength(contents.length);

      ServletOutputStream servletoutputstream = ((ServletResponse) response.raw()).getOutputStream();
      try {
    	  servletoutputstream.write(contents); // this throws EofException
      } catch (EofException e) {
    	  e.printStackTrace();
    	  System.err.println("Client closed connection early.");
      } finally {
    	  servletoutputstream.flush();
      }
      
      return GSON.toJson(ImmutableMap.of("success", "true"));
    } catch (Exception e) {
      e.printStackTrace();
      response.status(404);
      return GSON.toJson(ImmutableMap.of("success", "false", "error", "Couldn't locate asset."));
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
      System.out.println("GameHandler");
      Experience exp = experiences.get(req.params(":experience"));
      String asset = req.params(":asset");
      System.out.println(req.params(":experience") + ", "
        + req.params(":asset"));
      String pathName = (exp.directory + File.separator + asset);
      Path path = Paths.get(pathName);
      System.out.println("[gamehandler] Trying to get asset: " + asset);

      if (!experienceCanAccessAsset(exp, asset)) {
        throw new IllegalArgumentException("Error: Can't access asset "
          + asset + " -  Not declared in manifest.");
      }

      return serveAsset(res, path);
    }
  }
  
  /**
   * Returns true if an experience can access a file.
   *
   * @param experience
   *          The experience in question
   * @param scene
   *          The name of the requesting scene
   * @param asset
   *          The requested asset.
   * @return True if the asset should be served, otherwise false.
   *
   *         Precondition: This must be called while the current working
   *         directory is the directory for this experience.
   */
  public boolean experienceCanAccessAsset(Experience experience,
    String scene, String asset) {
    String sceneDirectory = scene;

    Path filename = FileSystems.getDefault()
      .getPath(sceneDirectory, asset);

    for (JsonElement item : experience.files) {

      String value = item.getAsString();

      PathMatcher matcher = FileSystems.getDefault().getPathMatcher(
        "glob:" + value);
      if (matcher.matches(filename)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns true if an experience can access any asset inside of its folder.
   *
   * @param experience
   *          The experience object in question.
   * @param asset
   *          The requested asset's relative path (to the root of the
   *          experience).
   * @return True if the asset is allowed read access, otherwise false.
   *
   *         Precondition: This must be called while the current working
   *         directory is the directory for this experience.
   */
  public boolean experienceCanAccessAsset(Experience experience,
    String asset) {
    // note: the cwd (current working directory) is the experience directory.
    Path filename = FileSystems.getDefault().getPath("", asset);
    System.out.println("Determining accessibility of asset " + asset);
    for (JsonElement item : experience.files) {

      String value = item.getAsString();

      PathMatcher matcher = FileSystems.getDefault().getPathMatcher(
        "glob:" + value);
      if (matcher.matches(filename)) {
        return true;
      }
    }

    return false;
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

      String path = (exp.directory + File.separator + scene + File.separator + asset);
      Path p = Paths.get(path);
      System.out.println("[scenecontenthandler] Trying to get asset: " + asset);

      // access control
      if (!experienceCanAccessAsset(exp, scene, asset)) {
        throw new IllegalArgumentException("Error: Can't access asset "
          + path + " -  Not declared in manifest.");
      }
      
      return serveAsset(res, p);
  }
 }

  /**
   * Handle requests to start each experience. Return the experience's mainFile.
   *
   * @author joengelm
   */
  public class PlayHandler implements Route {
    @Override
    public Object handle(Request req, Response res) {
      System.out.println("PlayHandler");
      Experience exp = experiences.get(req.params(":experience"));
      String path = exp.directory + '/' + exp.mainFile;
      try {
	      String[] contents = Files.readAllLines(Paths.get(path)).toArray(
	        new String[1]);
	      StringBuilder result = new StringBuilder();
	      // flatten contents
	      for (String x : contents) {
	        result.append(x + '\n');
	      }
	      return result.toString();
	    } catch (IOException e) {
	    	e.printStackTrace();
	    	res.status(500);
	    	return "Error! Notify the author of this story that everything is broken.";
	    }
    }
  }

  /**
   * Handle requests posting new scores to each experience's score database.
   *
   * @author joengelm
   */
  public class PostScoresHandler implements Route {
    @Override
    public Object handle(Request req, Response res) {
      System.out.println("PostScoreHandler");
      Experience exp = experiences.get(req.params(":experience"));
      QueryParamsMap qm = req.queryMap();

      String name = qm.value("name");
      String score = qm.value("score");

      try {
        double value = Double.parseDouble(score);
        exp.db.addScore(new Score(name, value, Database
          .getCurrentTimestamp().toString()));
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
  public class GetScoresHandler implements Route {
    @Override
    public String handle(Request req, Response res) {
      System.out.println("GetScoreHandler");
      Experience exp = experiences.get(req.params(":experience"));
      String limitString = req.params("limit");
      int limit;
      try {
        limit = Integer.parseInt(limitString);
      } catch (NumberFormatException e) {
        limit = 10;
      }
      return GSON.toJson(exp.db.getNBestScores(limit));
    }
  }

  /**
   * Handle the Experience Maker index.
   *
   * @author abchapin
   */
  public class MakerHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(Request req, Response res) {
      List<String> experienceNames = new ArrayList<>();
      List<String> experienceFileNames = new ArrayList<>();
      List<String> experienceColors = new ArrayList<>();
      for (Experience exp : experiences.values()) {
        experienceFileNames.add(exp.filename);
        experienceNames.add(exp.getName());
        experienceColors.add(exp.getColor());
      }

      Map<String, Object> variables = ImmutableMap.of("expFileNames",
        experienceFileNames, "expNames", experienceNames, "expColors",
        experienceColors);
      return new ModelAndView(variables, "makerIndex.ftl");
    }
  }

  /**
   * Handle the experience editor.
   *
   * @author abchapin
   */
  public class EditorHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(Request req, Response res) {
      String experienceFileName = req.params(":experience");

      if (!experiences.containsKey(experienceFileName)) {
        res.status(404);
        return new ModelAndView(new HashMap<>(), "error.ftl");
      }

      Experience exp = experiences.get(experienceFileName);

      Map<String, Object> variables = new ImmutableMap.Builder<String, Object>()
              .put("title", exp.getName())
              .put("color", exp.getColor())
              .put("description", exp.getDescription())
              .put("highToLow", GSON.toJson(exp.hasScoresHighToLow()))
              .put("isNew", "false")
              .put("id", exp.getId())
              .build();
      return new ModelAndView(variables, "editor.ftl");
    }
  }

  /**
   * Handle the experience editor, if a new experience is being made. This
   * avoids making any experience names off-limits.
   *
   * @author abchapin
   */
  public class NewEditorHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(Request req, Response res) {

      String name;
      if (newExpId > 0) {
        name = "New Experience " + newExpId;
      } else {
        name = "New Experience";
      }
      String description = "Enter a description about your experience...";
      String color = "00bad6";
      boolean highToLow = true;

      Map<String, Object> variables = new ImmutableMap.Builder<String, Object>()
              .put("title", name)
              .put("color", color)
              .put("description", description)
              .put("highToLow", GSON.toJson(highToLow))
              .put("isNew", "true")
              .put("id", "")
              .build();
      return new ModelAndView(variables, "editor.ftl");
    }
  }

  public class SaveEditedExperienceHandler implements Route {
    @Override
    public String handle(Request req, Response res) {
      System.out.println("SaveEditedExperienceHandler");
      String filename = req.params(":experience");
      Experience exp = experiences.get(filename);

      // Get data
      QueryParamsMap qm = req.queryMap();
      String oldId = sanitize(qm.value("oldId"));
      String title = sanitize(qm.value("title"));
      String id = sanitize(qm.value("id"));
      String color = sanitize(qm.value("color"));
      String description = sanitize(qm.value("description"));
      String highToLow = sanitize(qm.value("highToLow"));
      Boolean htl = Boolean.parseBoolean(highToLow);

      // Check for id overwriting existing experience
      if (((oldId == null || oldId.equals("")) || !oldId.equals(id)) && exp != null) {
        return GSON.toJson(getReturnVariables(false, "There already exists an experience with id " + id + "."));
      }

      // Set up config object
      Config config = new Config(title, id, color, description, htl);

      System.out.println(filename);

      // TODO: Check that id is valid as filename
      // Set up directory path
      String dirPath = directory + File.separator
              + id;

      // If experience not in hashtable, make directory
      // and add to hashtable
      if (exp == null) {
        System.out.println("Experience " + title + " not in hashtable.");
        // If the title changed, we need to change the
        // directory name
        if (oldId != null && !oldId.equals("") && !oldId.equals(id)) {
          System.out.println("Old id " + oldId + " is different!");
          exp = experiences.get(oldId);
          if (exp != null) {
            System.out.println("Found old experience " + oldId + ".");

            // Rename old directory
            dirPath = renameDirectory(oldId, id, exp);
            if (dirPath == null) {
              return GSON.toJson(getReturnVariables(false, "Couldn't find the old directory with id " + oldId + "."));
            }
          } else {
            System.err.println("ERROR: Couldn't find old experience " + oldId + " in hashtable.");
            return GSON.toJson(getReturnVariables(false, "Couldn't find old experience " + oldId + " to save over."));
          }
        } else {
          System.out.println("Making new experience " + title + ".");
          // Make new directory
          File dir = new File(dirPath);
          dir.mkdir();

          // Create new config file
          File cfig = new File(dirPath + File.separator + ".config");
          try {
            cfig.createNewFile();
          } catch (IOException e) {
            System.out
                    .println("ERROR: IOException in SaveEditedExperienceHandler. No .config file created.");
            return GSON.toJson(getReturnVariables(false, "Couldn't create a new .config file for your experience."));
          }

          saveExperience(cfig, config, dirPath);
          System.out.println("Experience saved!");
          return GSON.toJson(getReturnVariables(true, ""));
        }
      }

      System.out.println("Removing old version of experience, saving new version.");
      experiences.remove(exp.filename);
      File cfig = new File(dirPath + File.separator + ".config");
      boolean worked = saveExperience(cfig, config, dirPath);

      if (worked) {
        System.out.println("Experience saved!");
        return GSON.toJson(getReturnVariables(true, ""));
      } else {
        return GSON.toJson(getReturnVariables(false, "Experience couldn't be saved."));
      }
    }

    /**
     * Makes a map of the given return data.
     * @param worked Whether or not saving fully worked.
     * @param error The error message, if it did work.
     * @return The Map of variables.
     */
    private Map<String, Object> getReturnVariables(boolean worked, String error) {
      Map<String, Object> variables = ImmutableMap.of("worked",
        GSON.toJson(worked), "error", error);
      return variables;
    }

    /**
     * Renames the old directory to a new directory
     * name based on the given filename,
     * @param oldId The old id of the experience.
     * @param filename The new id of the experience.
     * @return The resulting directory path of the experience.
     */
    private String renameDirectory(String oldId, String filename, Experience oldExp) {
      String path = directory + File.separator;
      File oldDir = new File(path + oldId);
      File newDir = new File(path + filename);

      System.out.println(filename);

      // If the old directory exists as a directory,
      // rename it to the new directory path
      if (oldDir.isDirectory()) {
        System.out.println("Found old directory. Renaming...");

        boolean worked = oldDir.renameTo(newDir);
        if (worked) {
          System.out.println("Renaming WORKED!");
        } else {
          System.out.println("Renaming didn't work.");
          newDir.mkdir();
          oldExp.db.disconnect();
          try {
            FileUtils.deleteDirectory(oldDir);
          } catch (IOException e) {
            e.printStackTrace();
            System.err.println("ERROR: IOException when moving old directory to new directory.");
          }
        }

        return newDir.getPath();
      } else {
        System.err.println("ERROR: Old directory " + oldId + " not found.");
        return null;
      }
    }
    
    /**
     * Escape '<' and '>' characters in a string for display in an HTML 
     * web page. Every '<' in the original string becomes '&lt;' and every
     * '>' becomes '&gt;'. Also, escape '&' and '"' characters.
     * 
     * @param original the string to sanitize
     * @return the original string with '<', '"', '&', and '>' characters 
     * 		escaped
     */
    private String sanitize(String original) {
    	String fixed = original.replaceAll("&", "&amp;")
    						   .replaceAll(">", "&gt;")
    						   .replaceAll("<", "&lt;")
    						   .replaceAll("\"", "&quot;");
    	return fixed;
    }

    /**
     * Takes a Config object, serializes it, and writes it to
     * a given config file, then adds the resulting experience
     * to the hashtable.
     * @param file The .config file to write to.
     * @param config The Config object.
     * @param dirPath The path of the directory.
     * @return True if it worked, false otherwise.
     */
    private boolean saveExperience(File file, Config config, String dirPath) {
      String json = GSON.toJson(config);

      try {
        FileWriter fw = new FileWriter(file.getAbsoluteFile());
        BufferedWriter bw = new BufferedWriter(fw);
        bw.write(json);
        bw.close();
      } catch (IOException e) {
    	  e.printStackTrace();
        System.out
                .println("ERROR: IOException in SaveEditedExperienceHandler");
        return false;
      }

      try {
        System.out.println(dirPath);
        Experience exp = new Experience(dirPath);
        experiences.put(exp.getId(), exp);
      } catch (FileNotFoundException e) {
        e.printStackTrace();
        System.out
                .println("ERROR: FileNotFoundException in SaveEditedExperienceHandler");
        return false;
      }

      return true;
    }

    private class Config {
      private final String name, themeColor, description, mainFile, id;
      private final boolean orderScoresHighToLow;
      private final List<String> files;

      public Config(final String title, final String eyed, final String color, final String cDescription,
        boolean highToLow) {
        name = title;
        id = eyed;
        themeColor = color;
        description = cDescription;
        orderScoresHighToLow = highToLow;
        files = new ArrayList<>();
        mainFile = "index.html";
      }
    }
  }
}
