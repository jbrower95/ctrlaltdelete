package edu.brown.cs.abjj.experience;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Experience {

	public final String name;
	public final String filename;
	public final String description;
	public final ExperienceDatabase db;
	public final boolean orderScoresHighToLow;

	public Experience(String filename) throws FileNotFoundException {
		String[] parts = filename.split("/");
		this.filename = parts[parts.length - 1];

		File config = new File(filename + "/.config");
		JsonParser parser = new JsonParser();
		JsonObject root = parser.parse(new BufferedReader(new FileReader(config)))
				.getAsJsonObject();
		name = root.get("name").getAsString();
		orderScoresHighToLow = root.get("orderScoresHighToLow").getAsBoolean();
		description = root.get("description").getAsString();

		db = new ExperienceDatabase(filename + "/meta.db", orderScoresHighToLow);
	}
}
