package edu.brown.cs.experienceMaker;

import com.google.common.collect.ImmutableMap;
import edu.brown.cs.experience.Experience;
import spark.*;
import spark.template.freemarker.FreeMarkerEngine;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author abchapin
 */
public class Maker {
  public void run() {
    Spark.externalStaticFileLocation("src/main/resources/static");
    Spark.post("/set", new SetHandler());
  }

  public class SetHandler implements Route {
    @Override
    public Object handle(Request req, Response res) {
      QueryParamsMap qm = req.queryMap();
      return null;
    }
  }
}
