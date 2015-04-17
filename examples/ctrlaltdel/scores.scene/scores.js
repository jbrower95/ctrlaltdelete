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
                    console.log("[scores] " + parsed[i]);
                }
            });
        }
        getScores();
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "scores.scene/scores.html"
	}

};
