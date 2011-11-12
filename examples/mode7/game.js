
Key.init(document);


Origami.canvas = document.getElementById("c");

Mouse.init(window, document.getElementById("c"));




var Game = {};
Game.isPaused = false;
Game.friction = 0.96;
Game.acceleration = 0.2;
Game.turnSpeed = 0.007;
Game.camDist = 60;
Game.log = "";
Game.raceTime = 0;
Game.hero = new Kart(3, 1, Origami.world.shapes[0]);
Game.opponents = [
	new Kart(1, 1, Origami.world.shapes[1]),
	new Kart(1, 3, Origami.world.shapes[2]),
	new Kart(1, 3, Origami.world.shapes[3]),
	new Kart(1, 3, Origami.world.shapes[4]),
	new Kart(1, 3, Origami.world.shapes[5]),
	new Kart(1, 3, Origami.world.shapes[6]),
	new Kart(1, 3, Origami.world.shapes[7])
];
Game.cam = {};
Game.gui = {};
Game.state = "spiral";

Game.ai = function(kart, time){
	kart.nextWaypoint = kart.nextWaypoint || 0;
	var waypoint = Origami.world.mode7.track.waypoints[kart.nextWaypoint];
	var dx = waypoint.x - kart.shape.x;
	var dz = waypoint.y - kart.shape.z;
	var dr = Math.atan2(dx, dz);
	dr = kart.shape.ry - dr;
	if(dr > Math.PI){
		dr -= Math.PI*2;
	}
	var steer = Math.floor(dr/Math.PI/60);
	//console.log(kart.nextWaypoint+" dr: "+kart.shape.ry + " -- " + dr + " => "+steer);
	kart.step(1, steer, 0, time);
	kart.move();
	
	var prevWaypoint = Origami.world.mode7.track.waypoints[(kart.nextWaypoint || Origami.world.mode7.track.waypoints.length) - 1];
	var v1 = new Vector(kart.shape.x - prevWaypoint.x, kart.shape.z - prevWaypoint.y);
	var v2 = new Vector(waypoint.x - prevWaypoint.x, waypoint.y - prevWaypoint.y);
	if(v1.projectOnto(v2) >= v2.length()){
		kart.nextWaypoint = (kart.nextWaypoint + 1)%Origami.world.mode7.track.waypoints.length;
	}
};


Game.doFrameReady = function(time){

	if(Game.state == "spiral"){
		Game.spiralCamera(time);
	}else if(Game.state == "countdown"){
		Game.countdown(time);
	}else if(Game.state == "playing"){
		if(Key.isPressed(13)){
			Game.isPaused = !Game.isPaused;
		}else if(time > 1000){
			Game.isPaused = true;
		}
		if(Game.isPaused){
			Game.pausedScreen(time);
		}else{
			Game.playGame(time);
		}
	}
	Origami.render();
	var w = Origami.world.images.background.image.width;
	Origami.ctx.globalCompositeOperation = "destination-over";
	Origami.ctx.drawImage(Origami.world.images.background.image, w/2 - w/2*(Game.cam.ry%(Math.PI*2))/Math.PI/2+240, 0, 240, 160, 0, 0, 240, 160);
	Origami.ctx.globalCompositeOperation = "source-over";
	Game.gui.render(Origami.ctx);
	FPS.frameComplete();

}

Game.spiralCamera = function(time){
	Game.cam.ry += time/1000;
	if(Game.cam.ry < Game.hero.shape.ry){
		Game.cam.z = Game.hero.shape.z - Math.cos(Game.cam.ry)*(1.5*(Game.hero.shape.ry - Game.cam.ry) + 1)*Game.camDist;
		Game.cam.y = Game.hero.shape.y + 17 + (Game.hero.shape.ry - Game.cam.ry)*5;
		Game.cam.x = Game.hero.shape.x - Math.sin(Game.cam.ry)*(1.5*(Game.hero.shape.ry - Game.cam.ry) + 1)*Game.camDist;
	}else{
		Game.cam.ry = Game.hero.shape.ry;
		Game.cam.z = Game.hero.shape.z - Math.cos(Game.cam.ry)*Game.camDist;
		Game.cam.y = 17;
		Game.cam.x = Game.hero.shape.x - Math.sin(Game.cam.ry)*Game.camDist;
		Game.state = "playing";
	}
	
	
}
Game.countdown = function(time){
	Game.countdown.timeLeft = Game.countdown.timeLeft || 3000;
	Game.countdown.timeLeft -= time;
};
Game.drawTime = function(){
	function twoDigits(val){
		if(val < 10){
			return "0"+val;
		}else{
			return (val+"").substr(-2);
		}
	}
	var hundreds = Math.round(Game.raceTime/10);
	var seconds = Math.round(hundreds/100);
	var minutes = Math.round(seconds/60);
	Game.gui.drawText(minutes+"="+twoDigits(seconds)+"<"+twoDigits(hundreds), Origami.canvas.width - 9*8, 8);
}; 

Game.pausedScreen = function(time){
	Game.gui.drawText("hit enter to unpause", 40, 64);
}
Game.playGame = function(time){

	Game.raceTime += time;
	Game.drawTime( );

	Game.hero.step(Key.isDown(38), Key.isDown(39) - Key.isDown(37), Key.isDown(40), time);
	Game.hero.hitTestAndMove(Origami.world.mode7.track.walls, Origami.world.shapes);
	Game.cam.ry = Game.hero.shape.ry;
	Game.cam.z = Game.hero.shape.z - Math.cos(Game.cam.ry)*Game.camDist*(1+Game.hero.velocity/30);
	Game.cam.x = Game.hero.shape.x - Math.sin(Game.cam.ry)*Game.camDist*(1+Game.hero.velocity/30);
	
	for(var i in Game.opponents){
		Game.ai(Game.opponents[i], time);
	}
	
	

}


Origami.initWorld(function(){
	Game.cam = Origami.cam;
	Game.gui = new GUI(Origami.ctx, Origami.world.images.text.image);
	Animation.start(Game.doFrameReady);
});
