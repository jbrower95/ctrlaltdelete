package edu.brown.cs.experience;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Experience {

  private String name;
  private String id;
  public final String filename;
  private String description;
  private String color;
  public final ExperienceDatabase db;
  private boolean orderScoresHighToLow;
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

    name = root.get("name").getAsString();
    color = root.get("themeColor").getAsString();
    orderScoresHighToLow = root.get("orderScoresHighToLow").getAsBoolean();
    description = root.get("description").getAsString();
    id = root.get("id").getAsString();
    System.out.println("Experience " + name + " has id " + id + " and filename " + filename);
    db = new ExperienceDatabase(directory + "/meta.db",
      orderScoresHighToLow);
  }

  public String getId() {
    return id;
  }

  public void setName(String newName) {
    name = newName;
  }

  public String getName() {
    return name;
  }

  public void setColor(String newColor) {
    color = newColor;
  }

  public String getColor() {
    return color;
  }

  public void setDescription(String newDescription) {
    description = newDescription;
  }

  public String getDescription() {
    return description;
  }

  public void setScoreRanking(boolean newHighToLow) {
    orderScoresHighToLow = newHighToLow;
  }

  public boolean hasScoresHighToLow() {
    return orderScoresHighToLow;
  }
}
