var exported_scene = {
    id : "scores",
	onPresent : function() {
        var getScores = function() {
            var params = {limit: 10};
            $.get("scores", params, function(scores) {
                console.log(scores);
                var parsed = JSON.parse(scores);
                console.log(parsed);
                for (var i = 0; i < parsed.length; i++) {
                    var name = parsed[i].name;
                    var value = parsed[i].value;
                    var el = "<p>" + name + " -> " + value + "</p>";
                    $("#scores").append(el);
                }
            });
        }
        getScores();

        $("#back").click(function() {
            SceneManager.getSharedInstance().presentScene("mainMenu");
        });
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "scores.scene/scores.html"
	}

};
