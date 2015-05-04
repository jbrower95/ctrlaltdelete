var exported_scene = {
    id : "killbill",
    preload : function() {

    	AssetManager.getSharedInstance().preloadNamed("killbill.scene/gunshot.mp3", "gunshot");

    },
	onPresent : function() { 

		var sceneReference = this;
		
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		var renderer = new THREE.WebGLRenderer({ antialias: true });
		//var gui = new dat.GUI();
		scene.add(new THREE.AmbientLight('#ffffff'));
		console.log("Adding light to scene...");
		camera.position.set(0, 0, 100);
		scene.add(new THREE.AreaLight( 0xffffff, 1 ));

		var light = new THREE.DirectionalLight(0x888888);
		light.position.set(1, 1, 1);
		scene.add(light);

		scene.add(new THREE.AmbientLight("#ffffff"));

		light = new THREE.PointLight( 0xff0000, 1, 2800 );
		light.position.set( 50, 50, 50 );
		scene.add( light );

		light = new THREE.PointLight( 0xffffff, 1, 1800 );
		light.position.set( 50, 60, 60 );
		scene.add( light );

		function de2ra(de) {
			return de * (Math.PI / 180);
		}

		// instantiate a loader
		var loader = new THREE.TextureLoader();

		/* Floor  */    
		//var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
		//floor.material.side = THREE.DoubleSide;
		//floor.rotation.x = de2ra(90);
		//scene.add( floor );


		loader.load(
			// resource URL
			'killbill.scene/win95.png',
			// Function when resource is loaded
			function ( texture ) {
				texture.wrapS = THREE.ClampToEdgeWrapping;
				texture.wrapT = THREE.ClampToEdgeWrapping;
				texture.minFilter = THREE.NearestFilter;
				// do something with the texture
				var material = new THREE.MeshBasicMaterial( {
					map: texture
				 } );
				material.side = THREE.DoubleSide;
				var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
				var floor = new THREE.Mesh( geometry, material );
				
				floor.material = material;
				scene.add(floor);
				render();
			},
			// Function called when download progresses
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			function ( xhr ) {
				console.log( 'An error happened' );
			}
		);

		

		var canvas = document.getElementById('killbillcanvas');
		var context = document.getElementById('context2d');

		var loader = new THREE.OBJMTLLoader();
		loader.load( 'killbill.scene/sandman/sandman.obj', 'killbill.scene/sandman/sandman.mtl', function(object) {
		  //console.log(object);
		  object.traverse(function(child) {
		    if(child instanceof THREE.Mesh) {
		      child.material.shininess = 0;
		      //console.log(child.material);
		    }
		  });
		  object.position.y = 7;
		  object.position.x = 10;
		  object.position.z = 10;
		  scene.add(object);
		  console.log("Added sandman to scene...");
		});
		this.gunPresent = false;
		function killbill() {
			if (sceneReference.gunPresent) {
				AssetManager.getSharedInstance().playNamed('gunshot');
			}
		} 

		$(window).click(killbill);

		
		console.log("Adding element for threejs...");
		document.getElementById("contentDiv2").appendChild(renderer.domElement);
		console.log("Good.");

		var step = 0;
		var render = function() {
		  step += 0.01;
		  
		  /*
		  scene.traverse(function(child) {
		    if(child instanceof THREE.Mesh) {
		      child.rotation.y += 0.02;
		      child.rotation.x += 0.01;
		    }
		  });*/

		  renderer.render(scene, camera);
		};

		var resize = function() {
		  camera.aspect = window.innerWidth / window.innerHeight;
		  camera.updateProjectionMatrix();
		  renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', resize);

		resize();
		render();

		var count = 0;

		var introduction = function() {
			if (count < 220) {
				camera.position.z = camera.position.z + .5;
				camera.position.y = camera.position.y + .5;
				render();
				count = count + 1;
				render();
				window.requestAnimationFrame(introduction);
			} else {
				
				console.log("finished animation");
				console.log("x: " + camera.position.x);
				console.log("y: " + camera.position.y);
				console.log("z: " + camera.position.z);

				/*var floodLight = new THREE.AmbientLight(0x404040); 
				floodLight.position.set(camera.position.x+5, camera.position.y+5, camera.position.z+5);
				scene.add(floodLight);*/

				//load the pistol.
				var loader = new THREE.OBJMTLLoader();
				loader.load("killbill.scene/pistol/pistol.obj", "killbill.scene/pistol/pistol.mtl", function( object ) {
					object.position.z = 10;
					object.position.x = 15;
					object.position.y = 10;
					object.traverse(function(child) {
					    if(child instanceof THREE.Mesh) {
					      child.material.shininess = 0;
					      //console.log(child.material);
					    }
				  	});
					object.scale.x = 20;
					object.scale.y = 20;
					object.scale.z = 20;
					sceneReference.gunPresent = true;
					camera.position.z = camera.position.z + 5;
					scene.add( object );
					console.log("Adding pistol...");
					console.log("camera position: ");
					camera.lookAt(object.position);

					render();
				});
			}
		}

		introduction();
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "killbill.scene/killbill.html"
	}

};







