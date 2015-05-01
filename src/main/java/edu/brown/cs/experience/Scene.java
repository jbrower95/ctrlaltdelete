package edu.brown.cs.experience;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

/**
 * A low level abstraction of a scene. (SceneManager.js' concept of a scene.)
 * @author Justin
 */
public class Scene {
	
	//the unique ID of the scene.
	private String id;
	
	//the contents of the javascript for this scene.
	private String js;
	private transient String jsFile;
	
	//the contents of the css for this scene.
	private String css;
	private transient String cssFile;
	
	//the contents for the HTML for this scene. Can be null.
	private String html;
	private transient String htmlFile;
	
	/**
	 * Initializes a Scene.
	 * @param id The unique id of the scene. 
	 * @param js The javascript CONTENTS of the scene.
	 * @param css The CSS CONTENTS of the scene.
	 * @param html The HTML CONTENTS of the scene.
	 */
	public Scene(final String id, final String js, final String css, final String html) {
		this.setId(id);
		this.setJs(js);
		this.setCss(css);
		this.setHtml(html);
	}
	
	/**
	 * Given the location of a scene (the File object referring to its directory)
	 * instantiates a scene.
	 * @param location The file object who references the scene's containing directory.
	 */
	public Scene(File location) {
		
		//System.out.println("Initializing scene: ");
		//System.out.println("Name: " + location.getName());
		String name = location.getName();
		File[] files = location.listFiles();
		try {
			
			this.id = name.split("\\.")[0];
		} catch (ArrayIndexOutOfBoundsException e) {
			throw new IllegalArgumentException("Error: Invalid scene directory [AIOOBE]. " + location.toPath().toAbsolutePath().toString());
		}
		
		for (File file : files) {
			
			if (file.getName().endsWith(".js")) {
				jsFile = file.getName();
			
				try {
					byte[] encoded = Files.readAllBytes(file.toPath());
					js = new String(encoded, Charset.defaultCharset());
				} catch (IOException e) {
					System.err.println("Error: Couldn't read javascript for scene: " + this.id);
				}
				
			} else if (file.getName().endsWith(".css")) {
				cssFile = file.getName();
				
				try {
					byte[] encoded = Files.readAllBytes(file.toPath());
					css = new String(encoded, Charset.defaultCharset());
				} catch (IOException e) {
					System.err.println("Error: Couldn't read css for scene: " + this.id);
				}
				
			} else if (file.getName().endsWith(".html")) {
				htmlFile = file.getName();
				
				try {
					byte[] encoded = Files.readAllBytes(file.toPath());
					html = new String(encoded, Charset.defaultCharset());
				} catch (IOException e) {
					System.err.println("Error: Couldn't read html for scene: " + this.id);
				}
			}
			
			
		}
		
		
	}


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getJs() {
		return js;
	}


	public void setJs(String js) {
		this.js = js;
	}


	public String getCss() {
		return css;
	}


	public void setCss(String css) {
		this.css = css;
	}


	public String getHtml() {
		return html;
	}


	public void setHtml(String html) {
		this.html = html;
	}
	
}
