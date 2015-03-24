package edu.brown.cs.abjj.experience;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import edu.brown.cs.joengelm.sqldb.Database;

/**
 * An ExperienceDatabase extends Database and provides additional methods for
 * finding scores and other data pertaining to the experience.
 *
 * @author joengelm
 *
 */
public class ExperienceDatabase extends Database {

	private final String scoreOrder;

	/**
	 * Create a new ExperienceDatabase.
	 *
	 * @param dbFileName
	 *          the filename and location of this database
	 */
	public ExperienceDatabase(String dbFileName, boolean orderScoresHighToLow) {
		super(dbFileName);
		this.scoreOrder = orderScoresHighToLow ? "DESC" : "ASC";
	}

	/**
	 * Add a new score to this database. Duplicate scores are permitted.
	 *
	 * @param score
	 *          the score to add to this database
	 */
	public void addScore(Score score) {
		execute(conn -> {
			String command = "INSERT INTO score VALUES (?, ?, ?);";
			PreparedStatement prep = conn.prepareStatement(command);
			prep.setString(1, score.name);
			prep.setDouble(2, score.value);
			prep.setTimestamp(3, getCurrentTimestamp());
			prep.executeUpdate();
			return null;
		});
	}

	public List<Score> getBestNScores(int n) {
		if (n < 0) {
			throw new IllegalArgumentException(
					"n must be greater than or equal to zero");
		}

		List<Score> bestNScores = new ArrayList<>();
		execute(conn -> {
			String query = "SELECT name, value, timestamp FROM score ORDER BY value "
					+ scoreOrder + " LIMIT ?;";
			PreparedStatement prep = conn.prepareStatement(query);
			prep.setInt(1, n);
			ResultSet rs = prep.executeQuery();

			while (rs.next()) {
				bestNScores.add(new Score(rs.getString(1), rs.getDouble(2), rs
						.getTimestamp(3)));
			}
			return null;
		});
		return bestNScores;
	}
}