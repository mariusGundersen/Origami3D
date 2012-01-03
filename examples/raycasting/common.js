

Origami.canvas = document.getElementById("c");

FPS.color = "#FFFFFF";

var Game = {};
Game.isPaused = false;
Game.walkSpeed = 15;
Game.strafeSpeed = 5;
Game.rotateSpeed = 0.2;
Game.gravity = 0.7;
Game.walking = 0;
Game.isJumping = false;
Game.characterRadius = 60;
Game.log = "";
Game.hero = {};


var Enemy = {};
Enemy.path = [
	{x:512*2.5, z:512*13.5},
	{x:512*4.5, z:512*13.5},
	{x:512*5.5, z:512*11.5},
	{x:512*7.5, z:512*11.5},
	{x:512*7.5, z:512*8.5},
	{x:512*2.5, z:512*8.5}
];
Enemy.shape = Origami.world.shapes[0];
Enemy.nextPos = 0;
Enemy.speed = 15;
Enemy.animation = 0;

function moveEnemy(s){
	var dest = Enemy.path[Enemy.nextPos];
	var dx = dest.x - Enemy.shape.x;
	var dz = dest.z - Enemy.shape.z;
	var dist = Math.sqrt(dx*dx + dz*dz);
	if(dist<Enemy.speed*s){
		Enemy.nextPos++;
		Enemy.nextPos %= Enemy.path.length;
	}else{
		Enemy.shape.ry = Math.PI + Math.atan2(dx,dz);
		Enemy.shape.x += (dx/dist)*s*Enemy.speed;
		Enemy.shape.z += (dz/dist)*s*Enemy.speed;
	}
	Enemy.animation+=s;
	Enemy.shape.y = Enemy.shape.texture.sy/16;
	if(Enemy.animation>10){
		Enemy.animation = 0;
		if(Enemy.shape.texture.sy == 128){
			Enemy.shape.texture.sy = 0;
		}else{
			Enemy.shape.texture.sy += 64;
		}
	}
}



function hitTest(hero, map, tile){
	var oldPos = {};
	oldPos.tx = Math.floor(hero.x/tile.w);
	oldPos.tz = Math.floor(hero.z/tile.l);

	var newPos = {};
	newPos.x = hero.x + hero.dx;
	newPos.z = hero.z + hero.dz;
	
	
	var txm1 = Math.floor((hero.x+hero.dx-Game.characterRadius)/tile.w);
	var txp1 = Math.floor((hero.x+hero.dx+Game.characterRadius)/tile.w);
	var tzm1 = Math.floor((hero.z+hero.dz-Game.characterRadius)/tile.l);
	var tzp1 = Math.floor((hero.z+hero.dz+Game.characterRadius)/tile.l);	
	if(txp1 > oldPos.tx){
		if(map[oldPos.tz][txp1]){
			newPos.x = txp1*tile.w - Game.characterRadius;
		}
	}else if(txm1 < oldPos.tx){
		if(map[oldPos.tz][txm1]){
			newPos.x = (txm1+1)*tile.w + Game.characterRadius;
		}
	}
	if(tzp1 > oldPos.tz){
		if(map[tzp1][oldPos.tx]){
			newPos.z = tzp1*tile.l - Game.characterRadius;
		}
	}else if(tzm1 < oldPos.tz){
		if(map[tzm1][oldPos.tx]){
			newPos.z = (tzm1+1)*tile.l + Game.characterRadius;
		}
	}
	
	newPos.tx = Math.floor(newPos.x/tile.w);
	newPos.tz = Math.floor(newPos.z/tile.l);
	newPos.xt = newPos.x - newPos.tx*tile.w;
	newPos.zt = newPos.z - newPos.tz*tile.l;
	var r = 0;
	if(map[newPos.tz-1][newPos.tx-1]){
		r = Game.characterRadius/Math.sqrt(newPos.xt*newPos.xt + newPos.zt*newPos.zt);
		if(r > 1){
			newPos.x = newPos.tx*tile.w + newPos.xt*r;
			newPos.z = newPos.tz*tile.l + newPos.zt*r;
		}
	}else if(map[newPos.tz+1][newPos.tx-1]){
		r = Game.characterRadius/Math.sqrt(newPos.xt*newPos.xt + (tile.l - newPos.zt)*(tile.l - newPos.zt));
		if(r > 1){
			newPos.x = newPos.tx*tile.w + newPos.xt*r;
			newPos.z = (newPos.tz+1)*tile.l - (tile.l - newPos.zt)*r;
		}
	}else if(map[newPos.tz+1][newPos.tx+1]){
		r = Game.characterRadius/Math.sqrt((tile.w - newPos.xt)*(tile.w - newPos.xt) + (tile.l - newPos.zt)*(tile.l - newPos.zt));
		if(r > 1){
			newPos.x = (newPos.tx+1)*tile.w - (tile.w - newPos.xt)*r;
			newPos.z = (newPos.tz+1)*tile.l - (tile.l - newPos.zt)*r;
		}
	}else if(map[newPos.tz-1][newPos.tx+1]){
		r = Game.characterRadius/Math.sqrt((tile.w - newPos.xt)*(tile.w - newPos.xt) + newPos.zt*newPos.zt);
		if(r > 1){
			newPos.x = (newPos.tx+1)*tile.w - (tile.w - newPos.xt)*r;
			newPos.z = newPos.tz*tile.l + newPos.zt*r;
		}
	}
	
	hero.x = newPos.x;
	hero.z = newPos.z;
	
		
}



function playGame(time){
	if(Game.isPaused){
		Origami.ctx.textAlign = "center";
		Origami.ctx.textBaseline = "middle";
		Origami.ctx.font = '24pt arial,sans-serif';
		Origami.ctx.fillStyle = "#FFAA00";
		Origami.ctx.strokeStyle = "#000000";
		Origami.ctx.strokeText("PAUSED",Origami.size.hw,Origami.size.hh);
		Origami.ctx.fillText("PAUSED",Origami.size.hw,Origami.size.hh);
		
		if(shouldUnpause()){
			Game.isPaused = false;
		}
	}else{
		if(shouldPause(time)){
			Game.isPaused = true;
		}
		
		var speed = time/20;
		
		
		moveEnemy(speed);
				
		var input = getUserInput(speed);
		
		Game.hero.ry += input.rotate;
		
		var vect = {};
		vect.x = Game.hero.x;
		vect.z = Game.hero.z;
		vect.dx = Math.sin(Game.hero.ry)*input.forward + Math.cos(Game.hero.ry)*input.strafe;
		vect.dz = Math.cos(Game.hero.ry)*input.forward - Math.sin(Game.hero.ry)*input.strafe;
		hitTest(vect, Origami.world.raycasting.map, Origami.world.raycasting.tile);
		Game.hero.x = vect.x;
		Game.hero.z = vect.z;
		
		
		
		
		
		Origami.render();
		drawGUI();
		FPS.frameComplete();
		Origami.ctx.fillText(Game.log, 0, 15);
	}
}
