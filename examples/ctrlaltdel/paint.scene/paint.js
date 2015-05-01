var exported_scene = {
    id : "paint",
	onPresent : function() {
		console.log("Paint!");
		var manager = this.exportedVariables.windowManager;
		console.log("Printing exported variables: ");
		if (!this.exportedVariables['windowManager']) {
			console.error("Shit didn't transition properly.");
		}
		if (!this.exportedVariables['clippyAgent']) {
			console.error("Async shit didn't transition properly.");
		}
		console.log(this.exportedVariables);
		var clippyAgent = this.exportedVariables.clippyAgent;
		console.log(clippyAgent);
		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);

		var game = new Phaser.Game(618, 411, Phaser.AUTO, 'holder');

		var paint = function(game) {
			console.log("Starting game state paint");
			this.platforms;
			this.player;
			this.cursors;
			this.ladder;
			this.windows;
			this.blueBlocks;
			this.map;
			this.base;
			this.firingTimer = 0;
			this.clippy;
			this.spikes;
		}		

		paint.prototype = {
			preload : function() {
				game.load.image('redBlock', 'paint.scene/small-red-block.png');
				game.load.image('blueBlock', 'paint.scene/small-blue-block.png');
				game.load.image('bigBlueBlock', 'paint.scene/blue-block.png');
				game.load.image('ladderBlock', 'paint.scene/ladder-block.png');
				game.load.image('window', 'paint.scene/windows.png');
				game.load.image('clippy', 'paint.scene/pixel-clippy.png');
				game.load.image('spike', 'paint.scene/spike.png');
				game.load.image('spikeTop', 'paint.scene/spike-top.png');
				game.load.spritesheet('gebu', 'paint.scene/gebusheet.png',71, 79);
				game.load.tilemap('map', 'paint.scene/paint.json', null, Phaser.Tilemap.TILED_JSON);
			},
			create : function() {
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

				// Clippy
				clippy = game.add.sprite(1760, 300, 'clippy');
				game.physics.arcade.enable(clippy);
				clippy.body.gravity.y = 300;

				// Windows Bullets
				windows = game.add.group();
			    windows.enableBody = true;
			    windows.physicsBodyType = Phaser.Physics.ARCADE;
			    windows.createMultiple(1, 'window');
			    windows.setAll('outOfBoundsKill', true);
	    		windows.setAll('checkWorldBounds', true);

				// Blue Blocks
				blueBlocks = game.add.group();
				blueBlocks.enableBody = true;

				var b = blueBlocks.create(450, 0, 'bigBlueBlock');
				b.body.gravity.y = 500;
				b = blueBlocks.create(1300, 0, 'bigBlueBlock');
				b.body.gravity.y = 500;
				b = blueBlocks.create(1840, 800, 'bigBlueBlock');
				b.body.gravity.y = 500;
				b = blueBlocks.create(2140, 1090, 'bigBlueBlock');
				b.body.gravity.y = 500;

				// Spikes
				spikes = game.add.group();
				spikes.enableBody = true;
				var s;
				s = spikes.create(0, 420, 'spike');
				for (var i = 0; i <= 10; i++) {
					s = spikes.create(1640 + i*20, 760, 'spike');
				}
				for (i = 0; i <= 13; i++) {
					s = spikes.create(1140 + i*20, 880, 'spike');
				}
				for (i = 0; i <= 4; i++) {
					s = spikes.create(860 + i*20, 880, 'spike');
				}
				for (i = 0; i <= 6; i++) {
					s = spikes.create(620 + i*20, 880, 'spike');
				}
				for (i = 0; i <= 3; i++) {
					s = spikes.create(460 + i*20, 880, 'spike');
				}
				for (i = 0; i <= 4; i++) {
					s = spikes.create(1640 + i*20, 1380, 'spike');
				}
				for (i = 0; i <= 3; i++) {
					s = spikes.create(1920 + i*20, 1380, 'spike');
				}
				for (i = 0; i <= 13; i++) {
					s = spikes.create(280 + i*20, 920, 'spikeTop');
				}
				for (i = 0; i <= 8; i++) {
					s = spikes.create(600 + i*20, 920, 'spikeTop');
				}

				// Ladder
				ladder = game.add.group();
				ladder.enableBody = true;
				var l;
				for (i = 0; i <= 43; i++) {
					l = ladder.create(2300, i*20, 'ladderBlock');
				}

				// Player
				player = game.add.sprite(150, 300, 'gebu');
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
			},
			upLadder : function(player, ladder) {
				if (cursors.up.isDown) {
					player.animations.play('climb');
					player.body.velocity.y = -300;
				} else if (cursors.down.isDown) {
					player.animations.play('climb');
					player.body.velocity.y = 300;
				} else {
					player.body.velocity.y = -5;
				}
			},
			killWindow : function(win, other) {
				win.kill();
			},
			killPlayer : function(player, thing) {
				player.kill();
				game.state.start("Paint");
			},
			update : function() {
				game.physics.arcade.collide(player, base);
				game.physics.arcade.collide(player, blueBlocks);
				game.physics.arcade.collide(blueBlocks, base);
				game.physics.arcade.collide(clippy, base);
				game.physics.arcade.collide(clippy, blueBlocks);
				game.physics.arcade.collide(blueBlocks, blueBlocks);

				game.physics.arcade.overlap(player, spikes, this.killPlayer, null, this);
				game.physics.arcade.overlap(windows, base, this.killWindow, null, this);
				game.physics.arcade.overlap(windows, blueBlocks, this.killWindow, null, this);
				game.physics.arcade.overlap(player, windows, this.killPlayer, null, this);
				game.physics.arcade.overlap(player, ladder, this.upLadder, null, this);

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
				if (cursors.up.isDown && (player.body.blocked.down || player.body.touching.down)) {
					player.body.velocity.y = -350;
				}

				// Check for enemy fire
				if (game.time.now > this.firingTimer) {
					this.enemyFire();
				}
			},
			enemyFire : function() {
				var bullet = windows.getFirstExists(false);
				if (bullet) {
					bullet.reset(clippy.body.x,clippy.body.y);
					bullet.body.velocity.x = -150;
					firingTimer = game.time.now + 2000;
				}
			}
		}

		$(document).ready(function(){
			var win = manager.inflate("paint");
			win.setTitle("untitled - Paint");
			win.setCancellable(false);
			win.setIcon('images/paint_icon.png')
			manager.addWindow(win);
			
			game.state.add("Paint",paint);
			game.state.start("Paint");
		});
	},
	getHTML : function() {
		return null;
	},
	requires : "windows95"
};