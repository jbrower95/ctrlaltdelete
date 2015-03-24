package edu.brown.cs.joengelm.sqldb;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Date;

/**
 * A database object that provides useful methods to connect to and interact
 * with the database.
 *
 * @author joengelm
 *
 */
public class Database {
	private final String urlToDB;
	private Connection conn;

	/**
	 * Create a new database from a database file.
	 *
	 * @param dbFileName
	 *          the filename and location of this database
	 */
	public Database(String dbFileName) {
		this.urlToDB = "jdbc:sqlite:" + dbFileName;
		conn = getConnection();
	}

	/**
	 * Attempt to get a connection with the database. If the connection cannot be
	 * acquired, throw a new runtime exception and close any open objects
	 * gracefully.
	 *
	 * @return a connection to the database
	 */
	public Connection getConnection() throws RuntimeException {
		if (conn != null) {
			return conn;
		}

		try {
			Class.forName("org.sqlite.JDBC");
		} catch (ClassNotFoundException e) {
			throw new RuntimeException(e.getMessage());
		}

		try {
			Connection c = DriverManager.getConnection(urlToDB);
			Statement stat = c.createStatement();
			stat.executeUpdate("PRAGMA foreign_keys = ON;");
			stat.close();
			return c;
		} catch (SQLException e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	/**
	 * An operation is an encapsulated database interaction that defines one
	 * method, withConnection(), which describes what actions to perform on the
	 * database given some connection.
	 *
	 * @author joengelm
	 *
	 * @param <T>
	 *          the return type of the operation
	 */
	public interface Operation<T> {

		/**
		 * Execute an operation with a certain connection.
		 *
		 * @param c
		 *          the connection to use
		 * @return the return value of this operation (can be null)
		 * @throws SQLException
		 *           if the database is unreachable or the operation is illegal
		 */
		T withConnection(Connection c) throws SQLException;
	}

	/**
	 * Execute an operation on this database repackage any exceptions as
	 * RuntimeExceptions.
	 *
	 * @param op
	 *          the operation to perform on this database
	 * @param <T>
	 *          the return type of op
	 * @return the result(s) of op
	 */
	public <T> T execute(Operation<T> op) {
		try {
			return op.withConnection(getConnection());
		} catch (SQLException e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	/**
	 * Close any number of AutoCloseables quietly. Ignore any errors upon closing
	 * and ignore closeables which are null.
	 *
	 * @param closeables
	 *          a number of AutoCloseable objects
	 */
	public static void closeQuietly(AutoCloseable... closeables) {
		for (AutoCloseable closeable : closeables) {
			try {
				closeable.close();
			} catch (Exception e) {
				// quietly ignore errors upon closing
			}
		}
	}

	/**
	 * @return the timestamp of the current time
	 */
	public static Timestamp getCurrentTimestamp() {
		Date today = new Date();
		return new Timestamp(today.getTime());
	}
}
