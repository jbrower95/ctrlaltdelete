/**
 * Creates an Asset Manager which is capable of playing any sound.
 *
 * Types of sounds:
 *
 *      Prespecified:
 *
 *              These are specified by calling their numbers. That is, to play sounds/1.mp3, pass in 1.
 *              These are ONE INDEXED. Sorry.
 *
 *
 *      Named:
 *
 *              You can arbitrarily load any browser-capable audio piece by using preloadNamed(path, name).
 *              When you're ready to play, call 'playNamed' with the id of the sound you want to play.
 *
 *              ex:
 *
 *                        AssetManager.getSharedInstance().preloadNamed("sounds/dog.mp3", "dog");
 *
 *                        ...
 *
 *                        AssetManager.getSharedInstance().playNamed("dog");
 *
 *              To check if a sound has already been loaded:
 *
 *                        if (AssetManager.getSharedInstance().isLoaded("dog")) {
 *                              //dog has already been loaded.
 *                        }
 *
 *              That being said, a preload will be a no-op if the sound has already been loaded.
 *
 * @constructor
 */
function AssetManager() {

    //load all of the sounds
    this.sounds = [
        new buzz.sound("sounds/1.mp3"),
        new buzz.sound("sounds/2.mp3"),
        new buzz.sound("sounds/3.mp3"),
        new buzz.sound("sounds/4.mp3"),
        new buzz.sound("sounds/5.mp3"),
        new buzz.sound("sounds/6.mp3"),
        new buzz.sound("sounds/7.mp3"),
        new buzz.sound("sounds/8.mp3"),
        new buzz.sound("sounds/9.mp3"),
        new buzz.sound("sounds/10.mp3"),
        new buzz.sound("sounds/11.mp3"),
        new buzz.sound("sounds/12.mp3"),
        new buzz.sound("sounds/13.mp3"),
        new buzz.sound("sounds/14.mp3"),
        new buzz.sound("sounds/15.mp3")
    ];

    this.namedSounds = {};

}

/**
 * Preloads a specific sound from the set of pre-specified sounds.
 * @param id
 */
AssetManager.prototype.preload = function(id) {
    this.sounds[id-1].load();
};


/**
 * Preloads a specific sound and binds it to a name.
 * @param soundPath A valid path to the sound
 * @param soundName The name to bind this sound to.
 * @param reload If you want the sound to be reloaded.
 * note: If reload is omitted and the sound has already been loaded, this will be a no op. (no work will be done)
 */
AssetManager.prototype.preloadNamed = function(soundPath, soundName, reload) {

    if (this.namedSounds[soundName] && (!reload)) {
        //this sound has already been loaded.
        return;
    }
    console.log("Loading sound: " + soundPath);
    this.namedSounds[soundName] = new buzz.sound(soundPath);
    this.namedSounds[soundName].load();
};

/**
 * Returns true if a named sound has already been loaded.
 * Use this to avoid reloading sounds.
 */
AssetManager.prototype.isLoaded = function(soundName) {
    return (this.namedSounds[soundName]);
};

/**
 * Returns the shared asset manager.
 * @returns {AssetManager}
 */
AssetManager.getSharedInstance = function() {

    if (!__asset_manager) {
        __asset_manager = new AssetManager();
    }

    return __asset_manager;
};

//the shared asset manager instance.
var __asset_manager = null;

//plays a sound that is preloaded. these are the 15 voiceovers (named 1-
AssetManager.prototype.play = function(soundID) {

    if (!this.sounds[soundID-1]) {
        console.error("[assetmanager/play] Error: Tried to play non-loaded sound: " + soundID);
        return;
    }

    this.sounds[soundID-1].play();
};

//stops a sound.
AssetManager.prototype.stopNamed = function(soundID) {
    if (!this.namedSounds[soundID]) {
        console.error("[assetmanager/play] Error: Tried to play non-loaded sound: " + soundID);
        return;
    }

    this.namedSounds[soundID].stop();
};

/**
  * Allows you to fade out a specific named sound with a duration and callback function.
  */
AssetManager.prototype.fadeOutNamed = function(soundID, duration, callback) {

    if (!this.namedSounds[soundID]) {
        console.error("[assetmanager/play] Error: Tried to play non-loaded sound: " + soundID);
        return;
    }

    this.namedSounds[soundID].fadeOut(duration, callback);
};

/**
  * Allows you to fade out a specific named sound with a duration and callback function.
  */
AssetManager.prototype.fadeInNamed = function(soundID, duration, callback) {

    if (!this.namedSounds[soundID]) {
        console.error("[assetmanager/play] Error: Tried to play non-loaded sound: " + soundID);
        return;
    }

    this.namedSounds[soundID].fadeIn(duration, callback);
};


/**
 * Plays a named sound.
 * @param soundName
 */
AssetManager.prototype.playNamed = function(soundName) {

    if (!this.namedSounds[soundName]) {
        console.error("[assetmanager/play] Error: Tried to play non-loaded sound: " + soundID);
        return;
    }

    console.log("Playing sound: " + soundName);

    this.namedSounds[soundName].play();
};