




function doResize(event){
	//Fullscreen canvas
	function ensure(a, b, c){
		if(a[b] != c){
			a[b] = c;
		}
	}
	ensure(document.body,"scrollTop", window.outerHeight - window.innerHeight);
	ensure(Origami.canvas.style,"width", window.outerWidth+"px");
	ensure(Origami.canvas.style,"height", window.outerHeight+"px");
	
};



var downPos = {x:-100, y:-100};

function playGame(time){
	if(Game.isPaused){
		Origami.ctx.textAlign = "center";
		Origami.ctx.textBaseline = "middle";
		Origami.ctx.font = '24pt arial,sans-serif';
		Origami.ctx.fillStyle = "#FFAA00";
		Origami.ctx.strokeStyle = "#000000";
		Origami.ctx.strokeText("PAUSED",Origami.size.hw,Origami.size.hh);
		Origami.ctx.fillText("PAUSED",Origami.size.hw,Origami.size.hh);
		if(Mouse.isDown(0)){
			downPos.x = Mouse.pos.x;
			downPos.y = Mouse.pos.y;
			Game.isPaused = false;
			doResize();
		}
	}else{
		if(!Mouse.isDown(0)){
			Game.isPaused = true;
			//return;
		}
		
		var speed = time/20;
		
		moveEnemy(speed);
		
		var forward = (downPos.y - Mouse.pos.y)*speed/10;//(Key.isDown(87) - Key.isDown(83))*Game.walkSpeed*speed;
		var strafe = 0;//(Key.isDown(65) - Key.isDown(68))*Game.strafeSpeed*speed;
		var rotate =  (Mouse.pos.x - downPos.x)*speed/50;//Mouse.pos.xh/Origami.size.hw;
		rotate = rotate<-1 ? -1 : (rotate > 1 ? 1 : rotate); 
		Game.hero.ry -= rotate*Math.abs(rotate)*Game.rotateSpeed;
		var vect = {};
		vect.x = Game.hero.x;
		vect.z = Game.hero.z;
		vect.dx = Math.sin(Game.hero.ry)*forward + Math.cos(Game.hero.ry)*strafe;
		vect.dz = Math.cos(Game.hero.ry)*forward - Math.sin(Game.hero.ry)*strafe;
		hitTest(vect, Origami.world.raycasting.map, Origami.world.raycasting.tile);
		Game.hero.x = vect.x;
		Game.hero.z = vect.z;
		
		
		
		
		
		Origami.render();
		Origami.ctx.strokeStyle = "#FFFFFF";
		Origami.ctx.beginPath();
		if(!Game.isPaused){
			Origami.ctx.arc(downPos.x*Origami.size.w/Origami.canvas.clientWidth, downPos.y*Origami.size.h/Origami.canvas.clientHeight, 50, 0, Math.PI*2, true);
		}
		Origami.ctx.stroke();
		FPS.frameComplete();
		Origami.ctx.fillText(Game.log, 0, 15);
	}
}

Origami.initWorld(function(){
	Game.hero = Origami.cam;
	Game.hero.ys = 0;
	Enemy.shape = Origami.world.shapes[0];
	doResize();
	Animation.start(playGame);
});
