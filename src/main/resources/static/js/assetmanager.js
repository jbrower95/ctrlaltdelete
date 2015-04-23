/**
 * Creates an Asset Manager which is capable of playing any sound.
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

}

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

//plays a sound.
AssetManager.prototype.play = function(soundID) {
    this.sounds[soundID].play();
};