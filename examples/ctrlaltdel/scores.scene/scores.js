var exported_scene = {
    id : "scores",
	onPresent : function() {
        var getScores = function() {
            var params = {limit: 10};
            $.get("scores", params, function(scores) {
                console.log("Getting!");
                var parsed = JSON.parse(scores);
                for (var i = 0; i < parsed.length; i++) {
                    var name = parsed[i].name;
                    var shortened_name = name;
                    if (name.length > 15) {
                        shortened_name = name.substring(0, 12);
                        shortened_name += "...";
                    }
                    var value = parsed[i].value;
                    var shortened_value = value;
                    if (value > 99999999) {
                        shortened_value = '99999999';
                    }
                    var el = "<span class='name' title='"+name+"'>" + shortened_name + "</span><span class='value'>" + shortened_value + "</span><br />";
                    $("#scores").append(el);
                }
            });
        }
        getScores();

        var numWindows = 0;
        var cap = 7;

        function rain(win, dur) {
            var height = $(window).height();
            win.animate({ top: '+=' + height }, {
              duration: dur,
              easing: 'linear',
              step: function(now, fx){
                win.css("top", now);
              },
              complete: function() {
                win.remove();
                numWindows--;
              }
            });

        }

        function updateWindows() {
            while (numWindows < cap) {
                var win = $(document.createElement('div'));
                win.addClass("window");
                var left = Math.floor((Math.random() * ($(window).width() - 75)) + 1);
                win.css('left', left + 'px');
                $('.container').append(win);
                numWindows++;
                var dur = Math.floor((Math.random() * 4000) + 2000);
                rain(win, dur);
            }
        }

        setInterval(function(){updateWindows()},1000);

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
