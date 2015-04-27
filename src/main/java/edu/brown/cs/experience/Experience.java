package edu.brown.cs.experience;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

public class Experience {

  public final String name;
  public final String filename;
  public final String description;
  public final String color;
  public final ExperienceDatabase db;
  public final boolean orderScoresHighToLow;
  public final JsonArray files;
  public final String mainFile;
  public final String directory;

  public Experience(String directory) throws FileNotFoundException,
    IllegalArgumentException {
    File file = new File(directory);
    filename = file.getName();
    this.directory = directory;

    File config = new File(directory + "/.config");

    JsonObject root = new JsonParser().parse(
      new BufferedReader(new FileReader(config))).getAsJsonObject();
    try {
      files = root.get("files").getAsJsonArray();
      mainFile = root.get("mainFile").getAsString();
    } catch (NullPointerException e) {
      throw new IllegalArgumentException(
        "Error: Manifest does not have correct 'files' and 'mainFile' components.");
    }

    if (!files.contains(new JsonPrimitive(mainFile))) {
      throw new IllegalArgumentException(
        "Error: Your main file must be declared in your list of files.");
    }

    name = root.get("name").getAsString();
    color = root.get("themeColor").getAsString();
    orderScoresHighToLow = root.get("orderScoresHighToLow").getAsBoolean();
    description = root.get("description").getAsString();

    db = new ExperienceDatabase(directory + "/meta.db",
      orderScoresHighToLow);
  }
}
