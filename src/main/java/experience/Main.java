package experience;

import java.util.List;

import joptsimple.OptionParser;
import joptsimple.OptionSet;
import joptsimple.OptionSpec;

public class Main {

	public static void main(String[] args) {
		OptionParser parser = new OptionParser();
		OptionSpec<String> experiences = parser.nonOptions().ofType(String.class);
		OptionSet options = parser.parse(args);

		List<String> experienceFiles = experiences.values(options);

		if (experienceFiles.size() == 0) {
			printUsage();
			return;
		}

		new Server(experienceFiles).run();
	}

	private static void printUsage() {
		StringBuilder usage = new StringBuilder();
		usage.append("Usage:  ./run <experience1> <experience2> ...");
		usage.append("\texperience: a folder with all files for an experience");
		System.out.println(usage);
	}
}
