package edu.brown.cs.experience;

import java.io.*;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.jetty.io.EofException;

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
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import edu.brown.cs.joengelm.sqldb.Database;

public class Server {
  Map<String, Experience> experiences = new HashMap<>();
  private final static Gson GSON = new Gson();
  private final String directory;
  private int newExpId;
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

    Spark.get("/:experience/play", new PlayHandler());
    Spark.post("/:experience/scores", new PostScoresHandler());
    Spark.get("/:experience/scores", new GetScoresHandler());
    Spark.post("/:experience/scores", new PostScoresHandler());
    Spark.post("/:experience/saveedit", new SaveEditedExperienceHandler());
    Spark.get("/:experience/:asset", new GameHandler());
    Spark.get("/:experience/lib/:asset", new LibHandler());
    Spark.get("/:experience/:scene/:asset", new SceneContentHandler());
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

          experiences.put(exp.filename, exp);

          System.out.println("[server] Binding directory for experience: "
            + experienceFile.getPath());
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
   * Takes a URL string and decodes usign UTF-8.
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
      System.out.println("GameHandler");
      Experience exp = experiences.get(req.params(":experience"));
      String asset = req.params(":asset");
      System.out.println(req.params(":experience") + ", "
        + req.params(":asset"));
      String path = (exp.directory + "/" + asset);

      System.out.println("Trying to get asset: " + asset);

      if (!experienceCanAccessAsset(exp, asset)) {
        throw new IllegalArgumentException("Error: Can't access asset "
          + asset + " -  Not declared in manifest.");
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

          try {
            for (byte b : contents) {
              os.write(b);
            }
          } catch (EofException e) {
            System.err.println("[server/write] EOF exception.");
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
      Path currentRelativePath = Paths.get("");
      String s = currentRelativePath.toAbsolutePath().toString();
      System.out.println("Current relative path is: " + s);

      Experience exp = experiences.get(req.params(":experience"));
      String scene = req.params(":scene");
      String asset = req.params(":asset");

      String path = (exp.directory + "/" + scene + "/" + asset);

      System.out.println("Trying to get asset: " + asset);

      // access control
      if (!experienceCanAccessAsset(exp, scene, asset)) {
        throw new IllegalArgumentException("Error: Can't access asset "
          + path + " -  Not declared in manifest.");
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
      System.out.println("PlayHandler");
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

      Map<String, Object> variables = ImmutableMap.of("title",
        exp.getName(), "color", exp.getColor(), "description",
        exp.getDescription(), "highToLow",
        GSON.toJson(exp.hasScoresHighToLow()), "isNew", "false");
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

      Map<String, Object> variables = ImmutableMap.of("title", name,
        "color", color, "description", description, "highToLow",
        GSON.toJson(highToLow), "isNew", "true");
      return new ModelAndView(variables, "editor.ftl");
    }
  }

  // TODO: In editor handlers, send some bool so we know if it's
  // new or not--use this to set oldTitle appropriately.
  // Check for existing experiences with the same name/filename
  // to avoid overwriting.
  // Send back error messages if doesn't work.
  public class SaveEditedExperienceHandler implements Route {
    @Override
    public String handle(Request req, Response res) {
      System.out.println("SaveEditedExperienceHandler");
      String filename = req.params(":experience");
      Experience exp = experiences.get(filename);

      // Get data
      QueryParamsMap qm = req.queryMap();
      String oldTitle = qm.value("oldTitle");
      String title = qm.value("title");
      String color = qm.value("color");
      String description = qm.value("description");
      String highToLow = qm.value("highToLow");
      Boolean htl = Boolean.parseBoolean(highToLow);

      // Set up config object
      Config config = new Config(title, color, description, htl);

      // Set up directory path
      String dirPath = directory + File.separator
              + filename;

      // If experience not in hashtable, make directory
      // and add to hashtable
      if (exp == null) {
        System.out.println("Experience " + title + " not in hashtable.");
        // If the title changed, we need to change the
        // directory name
        if (oldTitle != null && !oldTitle.equals("") && !oldTitle.equals(title)) {
          System.out.println("Old title " + oldTitle + " is different!");
          exp = experiences.get(getURLFromTitle(oldTitle));
          if (exp != null) {
            System.out.println("Found old experience " + getURLFromTitle(oldTitle) + ".");

            // Rename old directory
            dirPath = renameDirectory(oldTitle, filename);
            if (dirPath == null) {
              return GSON.toJson(false);
            }
          } else {
            System.err.println("ERROR: Couldn't find old experience " + getURLFromTitle(oldTitle) + " in hashtable.");
            return GSON.toJson(false);
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
                    .println("ERROR: IOException in SaveEditedExperienceHandler");
            return GSON.toJson(null);
          }

          saveExperience(cfig, config, dirPath);
          System.out.println("Experience saved!");
          return GSON.toJson(true);
        }
      }

      System.out.println("Removing old version of experience, saving new version.");
      experiences.remove(exp.filename);
      File cfig = new File(dirPath + File.separator + ".config");
      saveExperience(cfig, config, dirPath);

      System.out.println("Experience saved!");
      return GSON.toJson(true);
    }

    /**
     * Renames the old directory to a new directory
     * name based on the given filename,
     * @param oldTitle The old title of the experience.
     * @param filename The new title of the experience.
     * @return The resulting directory path of the experience.
     */
    private String renameDirectory(String oldTitle, String filename) {
      String path = directory + File.separator;
      File oldDir = new File(path + getURLFromTitle(oldTitle));
      File newDir = new File(path + filename);

      System.out.println(filename);

      // If the old directory exists as a directory,
      // rename it to the new directory path
      if (oldDir.isDirectory()) {
        System.out.println("Found old directory. Renaming...");
        boolean worked = oldDir.renameTo(newDir);
        if (worked) {
          System.out.println("Renaming fucking WORKED!");
        } else {
          System.out.println("The world sucks and renaming didn't work.");
        }

        return newDir.getPath();
      } else {
        System.err.println("ERROR: Old directory " + getURLFromTitle(oldTitle) + " not found.");
        return null;
      }
    }

    /**
     * Takes a name and removes all spaces.
     * @param n The name.
     * @return The name without the spaces.
     */
    private String removeTitleSpaces(String n) {
      String[] s = n.split(" ");
      StringBuilder builder = new StringBuilder();
      for (String str : s) {
        builder.append(str);
      }
      return builder.toString();
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
        experiences.put(exp.filename, exp);
      } catch (FileNotFoundException e) {
        System.out
                .println("ERROR: FileNotFoundException in SaveEditedExperienceHandler");
        return false;
      }

      return true;
    }

    private class Config {
      private final String name, themeColor, description, mainFile;
      private final boolean orderScoresHighToLow;
      private final List<String> files;

      public Config(String title, String color, String cDescription,
        boolean highToLow) {
        name = title;
        themeColor = color;
        description = cDescription;
        orderScoresHighToLow = highToLow;
        files = new ArrayList<>();
        mainFile = "";
      }
    }
  }
}
