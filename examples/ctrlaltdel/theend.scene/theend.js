var exported_scene = {
	id : "theend",
	onPresent : function() {
		//TODO: perform scene initialization / do things
      alert('Hey!');
	},
	onDestroy : function() {
		//TODO: perform some cleanup
	},
	preload : function() {
		//TODO: establish any resources this scene needs. Can return a promise for async actions.
	}, 
	
	/* If this scene follows another scene and doesn't need its own HTML, uncomment 'requires'*/
	requires : 'windows95'
};