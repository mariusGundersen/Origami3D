


Key.init(document);
Mouse.init(window, document.getElementById("c"));



function shouldUnpause(){
	return Key.isPressed(13);
}
function shouldPause(time){
	return Key.isPressed(13) || time > 1000;
}

function getUserInput(speed){

	if(Game.isJumping){
		Game.hero.ys -= Game.gravity;
		Game.hero.y += Game.hero.ys;
		if(Game.hero.y < Origami.world.raycasting.tile.h/2){
			Game.hero.y = Origami.world.raycasting.tile.h/2;
			Game.hero.ys = 0;
			Game.isJumping = false;
		}
	}else if(Key.isDown(32)){
		Game.hero.ys = 12;
		Game.isJumping = true;
	}
	
	var forward = (Key.isDown(87) - Key.isDown(83))*Game.walkSpeed*speed;
	var strafe = (Key.isDown(65) - Key.isDown(68))*Game.strafeSpeed*speed;
	var rotate = -Mouse.pos.xh/Origami.size.hw*Game.rotateSpeed*speed;
	rotate = rotate<-1 ? -1 : (rotate > 1 ? 1 : rotate); 
	rotate = rotate*Math.abs(rotate);
	

	return {forward: forward, 
			strafe: strafe, 
			rotate: rotate};
}

function drawGUI(){
	
		if(Origami.world.videos[0].video.duration > 0){
			Origami.world.canvas.video.context2d.drawImage(Origami.world.videos[0].video, 0, 0);	
		}
	
	
}



Origami.initWorld(function(){
	Game.hero = Origami.cam;
	Game.hero.ys = 0;
	Enemy.shape = Origami.world.shapes[0];
	if("videos" in Origami.world){
		for(var i in Origami.world.videos){
			var video = Origami.world.videos[i];	
			video.video = document.createElement("video");
			video.video.autoplay = true;
			video.video.width = video.width;
			video.video.height = video.height;
			if("url" in video){
				for(var j in video.url){
					var url = video.url[j];
					var src = document.createElement("source");
					src.src = url.src;
					if("type" in url){
						src.setAttribute("type", url.type);
					}
					video.video.appendChild(src);
				}
			}
			video.video.play();
			
		}
	}
	Animation.start(playGame);
});
