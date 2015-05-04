var exported_scene = {
    id : "choosescore",
    preload : function() {
        var desktop = document.createElement("div");
        desktop.id = "desktop";
        this.element.appendChild(desktop);

        var manager = new WindowManager("desktop");
        var scoreWindow = manager.inflate("scoreWindow");
        scoreWindow.setTitle("Choose Your Score");
        scoreWindow.setIcon("images/windows.png");
        scoreWindow.moveTo(200, 120);
        scoreWindow.setActive(true);
        scoreWindow.setCancellable(false);
        manager.addWindow(scoreWindow);

        $('#okButton').click(function() {
            $.post('scores', $('form#scoreForm').serialize(), function(data) {
                if (data == 'true') {
                    SceneManager.getSharedInstance().presentScene("mainMenu");
                } else {
                    alert("Uh oh! Your score couldn't be saved.");
                }
            });
        });
    },
    getHTML : function() {
        return "choosescore.scene/choosescore.html"
    }
};