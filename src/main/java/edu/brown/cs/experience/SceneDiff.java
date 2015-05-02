package edu.brown.cs.experience;

import java.util.ArrayList;

class Location {
	//the character
	int ch;
	
	//the line
	int line;
	
	public Location(int ch, int line) {};
}


public class SceneDiff {

	String origin;
	
	Location from;
	Location to;
	
	//the list of changes
	ArrayList<String> text;
}
