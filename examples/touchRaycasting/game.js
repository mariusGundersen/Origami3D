




function doResize(event){
	//Fullscreen canvas, correct aspect ratio
	var w = document.body.clientWidth;

	var h = Origami.canvas.height/Origami.canvas.width*w;
	if(h > document.body.clientHeight){
		h = document.body.clientHeight;
		w = Origami.canvas.width/Origami.canvas.height*h;
	}

	Origami.canvas.style.width = w + "px";	
	Origami.canvas.style.height = h + "px"
};


var currentOrientation = {alpha: false, beta:0, gamma:0};
var downPos = {x:-100, y:-100, alpha:0, beta:0, gamma:0};

function shouldUnpause(){
	if(Mouse.isDown(0)){
		downPos.x = Mouse.pos.x;
		downPos.y = Mouse.pos.y;
		downPos.alpha = currentOrientation.alpha;
		downPos.beta = currentOrientation.beta;
		downPos.gamma = currentOrientation.gamma;
		doResize();
		return true;
	}else{
		return false;
	}
}
function shouldPause(){
	return !Mouse.isDown(0);
}

function getUserInput(speed){
	var forward, strafe, rotate;
	if(currentOrientation.alpha !== false){
		forward = -(currentOrientation.beta - downPos.beta)*100;
		strafe = -(currentOrientation.gamma - downPos.gamma)*100;
		rotate = -Game.hero.ry + currentOrientation.alpha;
	}else{
		forward = (downPos.y - Mouse.pos.y)*speed/10;
		strafe = 0;
		rotate = (Mouse.pos.x - downPos.x)*speed/500;
		rotate = rotate<-1 ? -1 : (rotate > 1 ? 1 : rotate); 
		rotate = - rotate*Math.abs(rotate)*Game.rotateSpeed;
	}

	return {forward: forward, 
			strafe: strafe, 
			rotate: rotate};
}

function drawGUI(){
	if(!Game.isPaused){
		Origami.ctx.lineWidth = 3;
		Origami.ctx.strokeStyle = "#FFFFFF";
		Origami.ctx.beginPath();
		Origami.ctx.arc(downPos.x*Origami.size.w/Origami.canvas.clientWidth, downPos.y*Origami.size.h/Origami.canvas.clientHeight, 25, 0, Math.PI*2, true);
		if(currentOrientation.alpha === false){
			Origami.ctx.moveTo(Mouse.pos.x*Origami.size.w/Origami.canvas.clientWidth + 15, Mouse.pos.y*Origami.size.h/Origami.canvas.clientHeight);
			Origami.ctx.arc(Mouse.pos.x*Origami.size.w/Origami.canvas.clientWidth, Mouse.pos.y*Origami.size.h/Origami.canvas.clientHeight, 15, 0, Math.PI*2, true);
		}
		Origami.ctx.stroke();
	}
	
}
function setRotation(e){
	currentOrientation.alpha = e.alpha*Math.PI/180;
	currentOrientation.beta = e.beta*Math.PI/180;
	currentOrientation.gamma = e.gamma*Math.PI/180;
}

Origami.initWorld(function(){
	Game.hero = Origami.cam;
	Game.hero.ys = 0;
	Enemy.shape = Origami.world.shapes[0];
	setTimeout(doResize, 1);
	setTimeout(function(){scrollTo(0,1);},1);
	if("DeviceOrientationEvent" in window){
		window.addEventListener("interfaceorientation", setRotation, false);
	}
	Animation.start(playGame);
});
