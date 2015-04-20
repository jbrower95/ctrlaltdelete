package edu.brown.cs.experience;

public class Main {

  public static void main(String[] args) {
    if (args.length != 1) {
      printUsage();
      return;
    }

    try {
      new Server(args[0]).run();
    } catch (IllegalArgumentException e) {
      System.out.println("ERROR: " + e.getMessage());
      return;
    }
  }

  /**
   * Print the usage information for this program.
   */
  private static void printUsage() {
    StringBuilder usage = new StringBuilder();
    usage.append("Usage:  ./run <exp_folder>");
    usage.append("\texp_folder: a folder with all experience directories");
    System.out.println(usage);
  }
}
