/*
*
*
	 _    _ _   _ _ _ _         
	| |  | | | (_) (_) |        
	| |  | | |_ _| |_| |_ _   _ 
	| |  | | __| | | | __| | | |
	| |__| | |_| | | | |_| |_| |
	 \____/ \__|_|_|_|\__|\__, |
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
Make a triangular texture rightangled, and rotate it so the rightangled corner is at 0,0

*/
Origami.normalizeTexture = function(texture){
	var x2 = (texture.p2.x-texture.p1.x);
	var y2 = (texture.p1.y-texture.p2.y);
	var x3 = (texture.p1.x-texture.p3.x);
	var y3 = (texture.p3.y-texture.p1.y);

	//console.log({x2:x2, y2: y2, x3:x3, y3: y3});

	var d2 = Math.sqrt(x2*x2+y2*y2);
	var d3 = Math.sqrt(x3*x3+y3*y3);
	
	var l2 = {x:texture.p1.x, y:texture.p1.y, dx:x2, dy:-y2, l:d2};
	var l3 = {x:texture.p1.x, y:texture.p1.y, dx:-x3, dy:y3, l:d3};
	
	var i2 = {x:l2.x, y:l2.y, dx:-l2.dy, dy:l2.dx, l:d2};
	
	function project(a, b){
		return (a.dx*b.dx + a.dy*b.dy)/a.l;
	}
	
	var px3 = project(l2, l3);
	var py3 = project(i2, l3);

	x2 = x2 || 1e-5;
	y3 = y3 || 1e-5;

	var sy = d3/py3;

	var kx = -px3/py3;

	var yr = Math.atan2(y2,x2);

	var dx = -texture.p1.x;
	var dy = -texture.p1.y;
	
	var c = document.createElement("canvas");
	c.width = d2;
	c.height = d3;
	var ctx = c.getContext("2d");
	
	ctx.save();
	
	ctx.moveTo(0, 0);
	ctx.lineTo(d2, 0);
	ctx.lineTo(0, d3);
	ctx.lineTo(0, 0);
	
	
	ctx.scale(1, sy);
	ctx.transform(1,0,kx,1, 0, 0);
	ctx.rotate(yr);
	ctx.translate(dx, dy);
	//ctx.strokeStyle = "transparent";
	ctx.clip();
	ctx.drawImage(texture.gfx, 0, 0);
	//ctx.stroke();
	ctx.restore();
	//console.log("draw went fine");
	texture.gfx = c;
}



Origami.imageLoader = function(callback){
	if("images" in Origami.world){
		var images = Origami.world.images;
		var imageCount = 0;
		var imagesLeft = 0;
		var onComplete = callback;
		var loaded = function(){
			imagesLeft--;
			loadingBar();
			if(imagesLeft == 0){
				onComplete();
			}
		};
		function loadingBar(missingURL){
			var x = Origami.size.w/10;
			var w = Origami.size.w*8/10;
			var y = Origami.size.hh-5;
			var h = 10;
			Origami.ctx.fillStyle = "#000000";
			Origami.ctx.fillRect(0, 0, Origami.size.w, Origami.size.h);
			Origami.ctx.strokeStyle = "#4C64F0";
			Origami.ctx.fillStyle = "#0042F4";
			Origami.ctx.strokeRect(x, y, w, h);
			Origami.ctx.fillRect(x, y, w*(imageCount-imagesLeft)/imageCount, h);
			Origami.ctx.textAlign = "center";
			Origami.ctx.textBaseline = "bottom";
			Origami.ctx.font = "15px sans-serif";
			Origami.ctx.fillText((imageCount-imagesLeft)+" of "+imageCount+" images loaded...", (x+w)/2, y, w);
			if(missingURL){
				Origami.ctx.textAlign = "left";
				Origami.ctx.textBaseline = "top";
				Origami.ctx.fillStyle = "#FF3309";
				Origami.ctx.fillText("Could not load "+missingURL, x,y+h*1.5);
			}
		}
		for(var i in images){
			var image = images[i];
			image.image = new Image();
			image.image.onload = loaded;
			image.image.onerror = function(){loadingBar(image.url);};
			image.image.src = image.url;
			imageCount++;
		}
		imagesLeft = imageCount;

	}else{
		callback();
	}
};

Origami.project3D = function(item, cam){
	var dx1 = item.x - cam.x;
	var dy1 = cam.y - item.y;
	var dz1 = item.z - cam.z;

	
	var dx2 = cam.siny*dz1 - cam.cosy*dx1;
	var dz2 = cam.siny*dx1 + cam.cosy*dz1;
	
	var dy2 = cam.sinx*dz2 - cam.cosx*dy1;
	var dz3 = cam.sinx*dy1 + cam.cosx*dz2;
	
	var dy3 = cam.sinz*dx2 - cam.cosz*dy2;
	var dx3 = cam.sinz*dy2 + cam.cosz*dx2;	
	
	item.m = cam.depth/(dz3);
	item.xpos = (dx3)*item.m + Origami.size.hw;
	item.ypos = (dy3)*item.m + Origami.size.hh;
	item.zpos = dz3;
}


Origami.log = function(a){
	if(console){
		console.log(a);
	}
}
