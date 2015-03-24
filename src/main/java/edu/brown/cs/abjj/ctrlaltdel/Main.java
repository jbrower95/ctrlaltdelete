package edu.brown.cs.abjj.ctrlaltdel;

import java.util.Arrays;

import edu.brown.cs.abjj.experience.Server;

public class Main {

	public static void main(String[] args) {
		if (args.length != 1) {
			printUsage();
			return;
		}

		new Server(Arrays.asList(args)).run();
	}

	private static void printUsage() {
		StringBuilder usage = new StringBuilder();
		usage.append("Usage:  ./run <experience1> <experience2> ...");
		usage.append("\texperience: a folder with all files for an experience");
		System.out.println(usage);
	}
}
