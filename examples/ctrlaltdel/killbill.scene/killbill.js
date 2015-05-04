var exported_scene = {
    id : "killbill",
    preload : function() {

    	return null;


    },
	onPresent : function() { 


		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		var renderer = new THREE.WebGLRenderer({ antialias: true });
		//var gui = new dat.GUI();
		scene.add(new THREE.AmbientLight('#ffffff'));
		console.log("Adding light to scene...");
		camera.position.set(0, 0, 100);
		scene.add(new THREE.AreaLight( 0xffffff, 1 ));

		var light = new THREE.DirectionalLight(0x888888);
		light.position.set(40, -100, 0);
		scene.add(light);

		scene.add(new THREE.AmbientLight("#ffffff"));

		light = new THREE.PointLight( 0xff0000, 1, 100 );
		light.position.set( 50, 50, 50 );
		scene.add( light );

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
		  object.position.y = 0;
		  scene.add(object);
		  console.log("Added sandman to scene...");
		});

		console.log("Adding element for threejs...");
		document.getElementById("contentDiv2").appendChild(renderer.domElement);
		console.log("Good.");

		var step = 0;
		var render = function() {
		  window.requestAnimationFrame(render);

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
				setTimeout(introduction, 10);
			} else {
				
				console.log("finished animation");
				console.log("x: " + camera.position.x);
				console.log("y: " + camera.position.y);
				console.log("z: " + camera.position.z);

				var floodLight = new THREE.AmbientLight(0x000044); 
				floodLight.position.set(camera.position.x, camera.position.y, camera.position.z).normalize();
				scene.add(floodLight);

				//load the pistol.
				var loader = new THREE.OBJLoader();
				loader.load("killbill.scene/pistol/pistol.obj", function( object ) {
					object.position.x = camera.position.x + 15;
					object.position.z = camera.position.z;
					object.position.y = camera.position.y;
					object.scale.x = 10;
					object.scale.y = 10;
					object.scale.z = 10;


					camera.position.z = camera.position.z + 5;

					scene.add( object );
					render();
				});


			}
		}

		setTimeout(introduction, 10);

	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "killbill.scene/killbill.html"
	}

};







