var exported_scene = {
  id : "paint",
  preload : function() {
    if (!this.exportedVariables) {
      console.error("[paint.js] Did not receive exported variables! This sucks...");
      this.exportedVariables = {};
    }

    if (this.exportedVariables.windowManager == null) {
      console.error("[paint.js] The window manager is missing!");
    }

    var manager = this.exportedVariables.windowManager;
    console.log("[paint.js] Windows in the manager:");
    console.log(manager.windows);
    var taskManager = manager.getWindowWithId("taskManager");
    if (taskManager) {
      taskManager.setXHandler(function() {
        $(this.element).remove();
        manager.removeWindow(taskManager);
      });
      taskManager.xHandler();
      manager.removeWindow(taskManager);
    }
  },
  onPresent : function() {
    console.log("Paint!");
    var manager = this.exportedVariables.windowManager;
    console.log("Printing exported variables: ");
    if (!this.exportedVariables['windowManager']) {
      console.error("Shit didn't transition properly.");
    }
    console.log(this.exportedVariables);

    var paintWindow = manager.getWindowWithId("paint");
    paintWindow.setEnabled(true);
    paintWindow.setActive(true);

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
      this.clippyActor;
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
        game.load.spritesheet('gebu', 'paint.scene/gebusheet.png', 71, 79);
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
        clippyActor = game.add.sprite(1760, 300, 'clippy');
        game.physics.arcade.enable(clippyActor);
        clippyActor.body.gravity.y = 300;

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
          player.body.velocity.y = -200;
        } else if (cursors.down.isDown) {
          player.animations.play('climb');
          player.body.velocity.y = 200;
        } else {
          player.body.velocity.y = -5;
        }
        if (player.y == 0) {
          game.destroy();
          AssetManager.getSharedInstance().fadeOutNamed("paintparty");
          SceneManager.getSharedInstance().presentScene("explorer95");
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
        game.physics.arcade.collide(clippyActor, base);
        game.physics.arcade.collide(clippyActor, blueBlocks);
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
          bullet.reset(clippyActor.body.x,clippyActor.body.y);
          bullet.body.velocity.x = -150;
          firingTimer = game.time.now + 2000;
        }
      }
    }

    $(document).keydown(function(e) {
      var code = e.keyCode || e.which;
      if (code == 85) { // 85 == 'u'
        AssetManager.getSharedInstance().fadeOutNamed("paintparty");
        SceneManager.getSharedInstance().presentScene("explorer95");
      }
    });

    AssetManager.getSharedInstance().preloadNamed("sounds/paintparty.mp3", "paintparty", true);
    AssetManager.getSharedInstance().playNamed("paintparty");

    $(document).ready(function() {
      game.state.add("Paint", paint);
      game.state.start("Paint");
    });
  },
  getHTML : function() {
    return null;
  },
  requires : "clickthexs"
};