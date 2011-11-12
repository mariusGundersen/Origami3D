


Key.init(document);


function playGame(time){
	if(Key.isPressed(13)){
		Game.isPaused = !Game.isPaused;
	}else if(time > 1000){
		Game.isPaused = true;
	}
	if(Game.isPaused){
		Origami.ctx.textAlign = "center";
		Origami.ctx.textBaseline = "middle";
		Origami.ctx.font = '24pt arial,sans-serif';
		Origami.ctx.fillStyle = "#FFAA00";
		Origami.ctx.strokeStyle = "#000000";
		Origami.ctx.strokeText("PAUSED",Origami.size.hw,Origami.size.hh);
		Origami.ctx.fillText("PAUSED",Origami.size.hw,Origami.size.hh);
	}else{
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
		
		if(Origami.world.videos[0].video.duration > 0){
			Origami.world.canvas.video.context2d.drawImage(Origami.world.videos[0].video, 0, 0);	
		}
		var speed = time/20;
		
		moveEnemy(speed);
		
		var forward = (Key.isDown(87) - Key.isDown(83))*Game.walkSpeed*speed;
		var strafe = (Key.isDown(65) - Key.isDown(68))*Game.strafeSpeed*speed;
		var rotate = Mouse.pos.xh/Origami.size.hw;
		rotate = rotate<-1 ? -1 : (rotate > 1 ? 1 : rotate); 
		Game.hero.ry -= rotate*Math.abs(rotate)*Game.rotateSpeed*speed;
		var vect = {};
		vect.x = Game.hero.x;
		vect.z = Game.hero.z;
		vect.dx= Math.sin(Game.hero.ry)*forward + Math.cos(Game.hero.ry)*strafe;
		vect.dz = Math.cos(Game.hero.ry)*forward - Math.sin(Game.hero.ry)*strafe;
		hitTest(vect, Origami.world.raycasting.map, Origami.world.raycasting.tile);
		Game.hero.x = vect.x;
		Game.hero.z = vect.z;
		
		
		
		
		
		Origami.render();
		FPS.frameComplete();
		Origami.ctx.fillText(Game.log, 0, 15);
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
					//src.setAttribute("src", url.src);
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
