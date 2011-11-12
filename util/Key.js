var Key = {
	keys:[],
	keysPrev:[],
	last:-1,
	isDown:function(key){
		return Key.keys[key] == 1;
	},
	lastKey:function(){
		return Key.last;
	},
	listener:function(event){
		Key.last = event.keyCode || event.which;
		Key.keys[event.keyCode || event.which] = event.type == "keydown";
		event.preventDefault();
		return false;
	},
	isPressed:function(key){
		if(Key.keys[key] && !Key.keysPrev[key]){
			Key.keysPrev[key] = true;
			return true;
		}
		Key.keysPrev[key] = Key.keys[key];
		return false;
	},
	isReleased:function(key){
		if(!Key.keys[key] && Key.keysPrev[key]){
			Key.keysPrev[key] = false;
			return true;
		}
		return false;
	},
	init:function(source){
		source.addEventListener("keydown", Key.listener, true);
		source.addEventListener("keyup", Key.listener, true);
	},
	unit:function(source){
		source.removeEventListener("keydown", Key.listener, true);
		source.removeEventListener("keyup", Key.listener, true);
	},
};
