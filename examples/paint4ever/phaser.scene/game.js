var exported_scene = {
    id : "phaser",
	onPresent : function() {
		$(document).ready(function(){
			var wm = new WindowManager("container");
			var win = wm.inflate("windowTemplate");
			wm.addWindow(win);



		});
		var game = new Phaser.Game(618, 411, Phaser.AUTO, 'holder', { preload: preload, create: create, update: update });

        			function preload() {
        				game.load.image('redBlock', 'phaser.scene/small-red-block.png');
        				game.load.image('blueBlock', 'phaser.scene/small-blue-block.png');
        				game.load.image('bigBlueBlock', 'phaser.scene/blue-block.png');
        				game.load.image('ladderBlock', 'phaser.scene/ladder-block.png');
        				game.load.image('window', 'phaser.scene/windows.png');
        				game.load.spritesheet('gebu', 'phaser.scene/gebusheet.png',71, 79);
        				game.load.tilemap('map', 'phaser.scene/paint.json', null, Phaser.Tilemap.TILED_JSON);
        			}

        			var platforms;
        			var player;
        			var cursors;
        			var ladder;
        			var windows;
        			var blueBlocks;
        			var map;
        			var base;

        			function create() {
        				game.physics.startSystem(Phaser.Physics.ARCADE);
        				game.stage.backgroundColor = "#ffffff";

						// Set up the tilemap
        				map = game.add.tilemap('map');
        				map.addTilesetImage('small-red-block', 'redBlock');
        				base = map.createLayer('Base Layer');
        				base.enableBody = true;
        				base.resizeWorld();
        				map.setCollision(1);

        				// Windows
        				windows = game.add.group();
        				windows.enableBody = true;

        				//  Here we'll create 12 of them evenly spaced apart
        				for (var i = 0; i < 5; i++) {
        					var window = windows.create(i * 150, 0, 'window');

        					//  Let gravity do its thing
        					window.body.gravity.y = 500;

        					//  Bouncing windows
        					window.body.bounce.y = 0.1 + Math.random() * 0.2;
        				}

        				// Blue Blocks
						blueBlocks = game.add.group();
						blueBlocks.enableBody = true;

						var b = blueBlocks.create(450, 0, 'bigBlueBlock');
						b.body.gravity.y = 500;

        				// Player
        				player = game.add.sprite(250, game.world.height - 300, 'gebu');
        				game.physics.arcade.enable(player);
        				player.body.bounce.y = 0.2;
        				player.body.gravity.y = 300;
        				player.body.collideWorldBounds = true;
        				player.animations.add('left', [0, 1, 2, 3], 10, true);
        				player.animations.add('right', [5, 6, 7, 8], 10, true);
        				player.animations.add('climb', [9, 10, 11, 12], 10, true);
        				game.camera.follow(player);

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
        				game.physics.arcade.collide(player, base);
        				game.physics.arcade.collide(windows, base);
        				game.physics.arcade.collide(blueBlocks, base);
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
        				if (cursors.up.isDown && player.body.blocked.down) {
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







