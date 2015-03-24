package edu.brown.cs.abjj.experience;


public class Experience {

	public final String name;
	public final ExperienceDatabase db;

	public Experience(String filename) {
		this.name = filename; // TODO update this constructor
		boolean orderScoresHighToLow = true;
		this.db = new ExperienceDatabase(filename + "/" + filename + ".sqlite3",
				orderScoresHighToLow);
	}
}
