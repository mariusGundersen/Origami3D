/*
*
*
	 _____                     _             
	|  __ \                   (_)            
	| |  | |_ __ __ ___      ___ _ __   __ _ 
	| |  | | '__/ _` \ \ /\ / / | '_ \ / _` |
	| |__| | | | (_| |\ V  V /| | | | | (_| |
	|_____/|_|  \__,_| \_/\_/ |_|_| |_|\__, |
	                                    __/ |
	                                   |___/ 
	 ______                _   _                 
	|  ____|              | | (_)                
	| |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
	|  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
	| |  | |_| | | | | (__| |_| | (_) | | | \__ \
	|_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

*
*/

/**
Draws a 2D Sprite

*/
Origami.draw2DSprite = function(item){
	var x = item.xpos;
	var y = item.ypos;
	var t = item.texture;
	var m = item.m;
	var animate = item.frame*t.h;
	//Origami.ctx.save();
	Origami.ctx.drawImage(t.gfx, t.sx, t.sy+animate, t.w, t.h, x+t.dx*m*t.s, y+t.dy*m*t.s, t.w*m*t.s, t.h*m*t.s);
	//Origami.ctx.restore();
};

/**
Draws a 3D Sprite

Needs work: This function assumes the sprite rotates around the y axis, and has 36 steps (each step is 10 degrees)
*/

Origami.draw3DSprite = function(item,d){
	var x = item.xpos;
	var y = item.ypos;
	var t = item.texture;
	var m = item.m;
	var animate = item.frame*t.h;
	var a = Math.round((Origami.cam.ry-d-item.ry)%(Math.PI*2)*180/Math.PI/item.sideAngle)+item.zeroSide;
	a = a<0 ? a+item.sides : (a >= item.sides ? a-item.sides : a);
	Origami.ctx.drawImage(t.gfx, t.sx + t.w*a, t.sy+animate, t.w, t.h, (x)+t.dx*m*t.s, y+t.dy*m*t.s, t.w*m*t.s, t.h*m*t.s);
	

};

/**
Draws a texture without any processing.
*/

Origami.drawTexture = function(item){
	try{
		Origami.ctx.drawImage(item.gfx, item.sx, item.sy, item.sw, item.sh, item.dx, item.dy, item.dw, item.dh);
	}catch(e){
		/*Origami.log({
			date:new Date(), 
			item: item,		
			e: e
		});*/
	}
	

};


/**
Draws a colored disc

*/
Origami.drawDisc = function(shape){
	Origami.ctx.fillStyle = shape.texture.color;
	Origami.ctx.beginPath();
	Origami.ctx.arc(shape.xpos, shape.ypos, shape.radius, 0, Math.PI*2, true);
	Origami.ctx.fill();
};

/**
Draws a polygon

*/
Origami.drawPolygon = function(polygon){
	if(polygon.v1.zpos<0 || polygon.v2.zpos<0 || polygon.v3.zpos<0){
		return;
	}
	var n = {dx:polygon.v2.ypos - polygon.v1.ypos, dy:polygon.v1.xpos - polygon.v2.xpos};
	
	var dp = (polygon.v3.xpos-polygon.v1.xpos)*(n.dx) + (polygon.v3.ypos-polygon.v1.ypos)*(n.dy);
	if(dp<0){
		Origami.statistics.polyCount++;
		Origami.ctx.beginPath();
		if("color" in polygon.texture){
			Origami.ctx.fillStyle = polygon.texture.color;
			Origami.ctx.strokeStyle = polygon.texture.color;
		}
		Origami.ctx.moveTo(polygon.v1.xpos, polygon.v1.ypos);
		Origami.ctx.lineTo(polygon.v2.xpos, polygon.v2.ypos);
		Origami.ctx.lineTo(polygon.v3.xpos, polygon.v3.ypos);
		Origami.ctx.lineTo(polygon.v1.xpos, polygon.v1.ypos);
		if("light" in Origami.world){
			var sun = Origami.world.light.sun;
			var v = {x:sun.x, y:sun.y, z:sun.z};
			dp = -(v.x*polygon.normal.x + v.y*polygon.normal.y + v.z*polygon.normal.z);
			dp /= Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			dp = dp<0 ? 0 : dp;
			dp = ((1-dp*Origami.world.light.sun.power)-Origami.world.light.ambient);
			Origami.ctx.fillStyle = "rgba(0%, 0%, 0%, "+dp+")";
			Origami.ctx.fill();
		}
		if("color" in polygon.texture){
			Origami.ctx.fill();
			//Origami.ctx.stroke();
		}else{
			var dx = polygon.v2.xpos - polygon.v1.xpos;
			var dy = polygon.v3.ypos - polygon.v1.ypos;
			if(dx == 0){
				dx = 1E-5;
			}
			if(dy == 0){
				dy = 1E-5;
			}
			Origami.ctx.save();
			/*Origami.ctx.beginPath();
			Origami.ctx.moveTo(polygon.v1.xpos, polygon.v1.ypos);
			Origami.ctx.lineTo(polygon.v2.xpos, polygon.v2.ypos);
			Origami.ctx.lineTo(polygon.v3.xpos, polygon.v3.ypos);
			Origami.ctx.lineTo(polygon.v1.xpos, polygon.v1.ypos);*/
			Origami.ctx.clip();
			Origami.ctx.translate(polygon.v1.xpos, polygon.v1.ypos);
			Origami.ctx.transform(1, (polygon.v2.ypos - polygon.v1.ypos)/dx, (polygon.v3.xpos - polygon.v1.xpos)/dy, 1, 0, 0);
			Origami.ctx.scale(dx/polygon.texture.gfx.width, dy/polygon.texture.gfx.height);
			Origami.ctx.drawImage(polygon.texture.gfx, 0, 0);
			Origami.ctx.restore();
		}
	}
};
