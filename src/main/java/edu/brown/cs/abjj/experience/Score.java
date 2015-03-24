package edu.brown.cs.abjj.experience;

import java.sql.Timestamp;
import java.util.Objects;

public class Score {

	public final String name;
	public final double value;
	public final Timestamp timestamp;

	public Score(String name, double value, Timestamp timestamp) {
		this.name = checkName(name);
		this.value = value;
		this.timestamp = timestamp;
	}

	/**
	 * Check that the scorer's name is between 1 and 6 characters (inclusive)
	 *
	 * @param name
	 *          the name to check
	 * @return up to the first 6 characters of name
	 */
	private static String checkName(String name) {
		if (name.length() == 0 || name.length() > 6) {
			name = name.substring(0, 6);
		}
		return name;
	}

	@Override
	public String toString() {
		return "Name: " + name + ", Score: " + value;
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Score)) {
			return false;
		}

		Score other = (Score) o;
		return Objects.equals(name, other.name)
				&& Objects.equals(value, other.value);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, value);
	}
}
