var exported_scene = {
    id : "phaser",
	onPresent : function() { 
		
		var game = new Phaser.Game(700, 500, Phaser.AUTO, 'holder', { preload: preload, create: create, update: update });
		
		function preload() {
		    game.load.image('redBlock', 'phaser.scene/small-red-block.png');
		    game.load.image('blueBlock', 'phaser.scene/small-blue-block.png');
		    game.load.image('ladderBlock', 'phaser.scene/ladder-block.png');
		    game.load.image('window', 'phaser.scene/windows.png');
		    game.load.spritesheet('gebu', 'phaser.scene/gebusheet.png',71, 79);
		}
		
		var platforms;
		var player;
		var cursors;
		var ladder;
		var windows;
		
		function create() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			platforms = game.add.group();
			platforms.enableBody = true;
			
			var ground; 
			for (var i = 0; i < game.world.width/20; i++) {
				ground = platforms.create(i*20, game.world.height - 50, 'redBlock');
				ground.body.immovable = true;
			}
			
			var ledge;
			
			for (i = 0; i < game.world.width/(20*5); i++) {
				ledge = platforms.create(400 + i*20,350,'redBlock');
				ledge.body.immovable = true;
			}
			for (i = 0; i < game.world.width/(20*5); i++) {
				ledge = platforms.create(i*20, 250, 'redBlock');
				ledge.body.immovable = true;
			}
			
			// Ladder
			ladder = game.add.group();
			ladder.enableBody = true;
			for (var i = 0; i < game.world.height - 50; i++) {
				ladder1 = ladder.create(game.world.width - 30, i*25, 'ladderBlock');
				ladder1.body.immovable = true;
			}
			
			// Windows
			windows = game.add.group();
			windows.enableBody = true;
			
			//  Here we'll create 12 of them evenly spaced apart
		    for (var i = 0; i < 5; i++) {
		        var window = windows.create(i * 150, 0, 'window');

		        //  Let gravity do its thing
		        window.body.gravity.y = 500;

		        //  This just gives each star a slightly random bounce value
		        window.body.bounce.y = 0.1 + Math.random() * 0.2;
		    }
			
			// Player
			player = game.add.sprite(32, game.world.height - 200, 'gebu');
			game.physics.arcade.enable(player);
			player.body.bounce.y = 0.2;
		    player.body.gravity.y = 300;
		    player.body.collideWorldBounds = true;
		    player.animations.add('left', [0, 1, 2, 3], 10, true);
		    player.animations.add('right', [5, 6, 7, 8], 10, true);
		    player.animations.add('climb', [9, 10, 11, 12], 10, true);
		    
		    //  Our controls.
		    cursors = game.input.keyboard.createCursorKeys();
		}
		
		function upLadder(player, ladder) {
			if (cursors.up.isDown) {
				player.animations.play('climb');
				player.body.velocity.y = -300;
			} else if (cursors.down.isDown) {
				player.animations.play('climb');
				player.body.velocity.y = 300;
			} else {
				player.body.velocity.y = -5;
			}
		}
		
		function collectWindow(player, window) {
			window.kill();
		}
		
		function update() {
			game.physics.arcade.collide(player, platforms);
			game.physics.arcade.collide(windows, platforms);
			game.physics.arcade.overlap(player, ladder, upLadder, null, this);
			game.physics.arcade.overlap(player, windows, collectWindow, null, this);
			
			//  Reset the players velocity (movement)
		    player.body.velocity.x = 0;

		    if (cursors.left.isDown) {
		        //  Move to the left
		        player.body.velocity.x = -150;

		        player.animations.play('left');
		    }
		    else if (cursors.right.isDown) {
		        //  Move to the right
		        player.body.velocity.x = 150;

		        player.animations.play('right');
		    }
		    else if (!(cursors.up.isDown || cursors.down.isDown)) {
		        //  Stand still
		        player.animations.stop();

		        player.frame = 4;
		    }
		    
		    //  Allow the player to jump if they are touching the ground.
		    if (cursors.up.isDown && player.body.touching.down) {
		        player.body.velocity.y = -350;
		    }
		}
		
		
	},
	onDestroy: function() {
	},
	getHTML : function() {
		return "phaser.scene/game.html"
	}
};







