/*
*
*
	 _____                _           
	|  __ \              | |          
	| |__) |___ _ __   __| | ___ _ __ 
	|  _  // _ \ '_ \ / _` |/ _ \ '__|
	| | \ \  __/ | | | (_| |  __/ |   
	|_|  \_\___|_| |_|\__,_|\___|_|   
	                                  
	                                  
	 ______                _   _                 
	|  ____|              | | (_)                
	| |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
	|  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
	| |  | |_| | | | | (__| |_| | (_) | | | \__ \
	|_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

*
*/

(function(){
	
	
	/**
	Sets up the world for rendering
	
	*/
	function preRender(){
		Origami.statistics.polyCount = 0;
		Origami.canvas.width = Origami.canvas.width;
		//Origami.ctx.clearRect(0, 0, Origami.canvas.width, Origami.canvas.height);
		if("preRender" in Origami.world){
			Origami.world.preRender();
		}
		Origami.ctx.globalCompositeOperation = "destination-over";
		Origami.cam.cosx = Math.cos(Origami.cam.rx);
		Origami.cam.sinx = Math.sin(Origami.cam.rx);
		Origami.cam.cosy = Math.cos(Origami.cam.ry);
		Origami.cam.siny = Math.sin(Origami.cam.ry);
		Origami.cam.cosz = Math.cos(Origami.cam.rz);
		Origami.cam.sinz = Math.sin(Origami.cam.rz);
		Origami.raycasting = false;
		Origami.depthMap = new Array();
	};
	

	function postRender(){
		Origami.ctx.globalCompositeOperation = "source-over";


	};
	
	/**
	Render a mode7 ground
	
	Known errors: can only render ground, not sky
	
	*/
	
	
	function renderMode7(toDraw){
	
		Origami.world.mode7.canvas.width = Origami.world.mode7.canvas.width;
		Origami.world.mode7.ctx.save();
		Origami.world.mode7.ctx.beginPath();
		Origami.world.mode7.ctx.moveTo(Origami.world.mode7.canvas.width/2, Origami.world.mode7.canvas.height);
		Origami.world.mode7.ctx.lineTo(0, 0);
		Origami.world.mode7.ctx.lineTo(Origami.world.mode7.canvas.width, 0);		
		Origami.world.mode7.ctx.clip();
		Origami.world.mode7.ctx.translate(Origami.world.mode7.canvas.width/2, Origami.world.mode7.canvas.height);
		Origami.world.mode7.ctx.rotate(Math.PI+Origami.cam.ry);
		Origami.world.mode7.ctx.translate(-Origami.cam.x, -Origami.cam.z);
		Origami.world.mode7.ctx.drawImage(Origami.world.mode7.texture.gfx, 0, 0);
		
		Origami.world.mode7.ctx.restore();
	
		//DEBUG
		//document.getElementById("mode7Canvas").getContext("2d").drawImage(Origami.world.mode7.canvas, 0, 0);
		
		//for(var y=1; y<Origami.size.h - Origami.cam.horizon; y+=Origami.world.mode7.step){
		for(var y = Origami.size.h; y > Origami.size.hh; y-= Origami.world.mode7.step){
			var r = Origami.cam.y/(y-Origami.size.hh);
			var z = Origami.cam.depth*r;
			//var z = Origami.cam.y*Origami.cam.depth/y;
			
			//z/d = cam.y/y;
			var x = Origami.size.hw*r;
			if(Origami.world.mode7.canvas.width/2-x>=0 && z>0 && Origami.world.mode7.canvas.width/2+x<Origami.world.mode7.canvas.width){
				toDraw.push({
					type: "gfx",
					zpos: Infinity,
					gfx: Origami.world.mode7.canvas,
					sx: Origami.world.mode7.canvas.width/2 - x,
					sy: Origami.world.mode7.canvas.height - z,
					sw: 2*x,
					sh: Origami.world.mode7.step,
					
					dx: 0,
					dy: y,
					dw: Origami.size.w,
					dh: Origami.world.mode7.step

				});	

			



			}
		}
	}
	
	
	/** 
	Render raycasting walls
	*/
	
	function renderRaycasting(toDraw){
		
		Origami.raycasting = true;
		
		var tile = Origami.world.raycasting.tile;
		
		Origami.cam.tx = Math.floor(Origami.cam.x/tile.w);
		Origami.cam.tz = Math.floor(Origami.cam.z/tile.l);
		
		
		//The screen object is used to cast the rays from the camera through the screen and onto the walls of the map
		//(screen.dx, screen.dz) is a unit vector which is perpendictular to the direction the camera is facing.
		//(screen.x, screen.z) is the position of a vertical slice of the screen. 
		//It is initated with the very right of the screen, and iterates over the entire screen inside the loop
		var screen = {};
		screen.dx = -Origami.cam.cosy;
		screen.dz = Origami.cam.siny;
		screen.x = Origami.cam.x + (Origami.cam.siny*Origami.cam.depth - Origami.cam.cosy*Origami.size.hw) - Origami.size.w*screen.dx;
		screen.z = Origami.cam.z + (Origami.cam.siny*Origami.size.hw + Origami.cam.cosy*Origami.cam.depth) - Origami.size.w*screen.dz;
		
		
		
		
		var step = Origami.world.raycasting.step;
		for(var i=0; i<Origami.size.w; i+=step){
			screen.x += screen.dx*step;
			screen.z += screen.dz*step;
			//v holds the vector of the current ray emitted from the camera in the direction of a sector on the screen. 
			//dx, dz is the unit vector direction the ray is moving
			//tx, tz is the current tile the ray is in. 
			// x,  z is the coordinates inside the current tile. 
			//sx, sz is the distance to the nearest wall in the x and z direction.
			//wx, wz is the wall in the direction the ray is moving, ie if dx>0, then wx = tileWidth, else it is 0.
			var v = {
				x:0,
				z:0,
				tx:Origami.cam.tx, 
				tz:Origami.cam.tz,
				sx:0,
				sz:0,
				dx:0,
				dz:0
			};
			v.dx = (screen.x-Origami.cam.x);
			v.dz = (screen.z-Origami.cam.z);
			var d = Math.sqrt(v.dx*v.dx + v.dz*v.dz);
			v.dx /= d;
			v.dz /= d;
			v.x = Origami.cam.x - v.tx*tile.w;
			v.z = Origami.cam.z - v.tz*tile.l;
			v.wx = v.dx < 0 ? 0 : tile.w;
			v.wz = v.dz < 0 ? 0 : tile.l;
			while(v.tx>=0 && v.tx<Origami.world.raycasting.map[0].length && v.tz>=0 && v.tz<Origami.world.raycasting.map.length){
				if(Origami.world.raycasting.map[v.tz][v.tx]){
					//x and y distance between camera and point on wall the ray hit
					var dx = v.tx*tile.w + v.x - Origami.cam.x;
					var dz = v.tz*tile.l + v.z - Origami.cam.z;
					
					//normal distance from camera to point on wall the ray hit
					var dz2 = Origami.cam.depth/(Origami.cam.siny*dx + Origami.cam.cosy*dz);
					//texture of the wall
					//var t = Origami.world.textures[Origami.world.raycasting.map[v.tz][v.tx]];
					var t = Origami.world.raycasting.map[v.tz][v.tx];
					//scaling of image
					var s = t.w/tile.w;
					
					Origami.depthMap[i/step] = {depth: dz2,
												dist: Origami.cam.depth/dz2,
												x: dx + Origami.cam.x,
												z: dz + Origami.cam.z};
					
					var sX = t.sx + s*(v.sx>v.sz ? (v.dz>0 ? tile.w - v.x : v.x): 
												(v.dx<0 ? tile.l - v.z : v.z));
					
					//TODO:Add scaling based on wall projected onto normal of trajectory
					var sW = s*step/dz2/(v.sx>v.sz ? Math.abs(v.dz) :
													Math.abs(v.dx) )
													
					//Limit sourceWidth + sourceX to be less than imageWidth
					sW = sW+sX-t.sx >= t.w ? t.w-sX+t.sx-1e-5 : sW;
					
					
					toDraw.push({
							type: "gfx",
							zpos: Origami.cam.depth/dz2,
							gfx: t.gfx, 
							sx: sX,
							sy: t.sy,
							sw: sW < 0.0001 ? step : sW,
							sh: t.h,
											
							dx: i,
							dy: (Origami.size.hh - (tile.h - Origami.cam.y)*dz2),
							dw: step,
							dh: dz2*tile.h
					});
					break;
				}
				v.sx = (v.wx - v.x)/v.dx;
				v.sz = (v.wz - v.z)/v.dz;
				if(v.sx < v.sz){
					v.x = tile.w - v.wx;
					v.z += v.dz*v.sx;
					v.tx += v.dx < 0 ? -1 : 1;
				}else if(v.sx > v.sz){
					v.z = tile.l - v.wz;
					v.x += v.dx*v.sz;
					v.tz += v.dz < 0 ? -1 : 1;
				}else{
					v.z = tile.l - v.wz;
					v.x = tile.w - v.wx;
					v.tx += v.dx < 0 ? -1 : 1;
					v.tz += v.dz < 0 ? -1 : 1;
				}
			}
		}
	};
	
	/**
	Render sprites and shapes
	*/
	function renderShapes(toDraw){
		var i, shape, dir;
		for(i in Origami.world.shapes){
			shape = Origami.world.shapes[i];
			if(shape.type == "wireframe" || shape.type == "polygon"){
				for(var v in shape.verts){
					Origami.project3D(shape.verts[v], Origami.cam);
				}
				if(shape.type == "wireframe"){
					for(var l in shape.lines){
						var line = shape.lines[l];
						if(line.v1.zpos > 0 && line.v2.zpos > 0){
							line.zpos = (line.v1.zpos + line.v2.zpos)/2;
							toDraw.push(line);
						}
					}
				}else{
					for(var p in shape.polygons){
						var polygon = shape.polygons[p];
						if(polygon.v1.zpos > 0 && polygon.v2.zpos > 0 && polygon.v3.zpos > 0){
							polygon.zpos = (polygon.v1.zpos + polygon.v2.zpos + polygon.v3.zpos)/3;
							toDraw.push(polygon);
						}
					}
				}
			}else if(shape.type == "2DSprite" || shape.type == "3DSprite" || shape.type == "Disc"){
				Origami.project3D(shape, Origami.cam);
				if(shape.zpos > 0){
					toDraw.push(shape);
				}
			}
		}
		
	}
	
	Origami.render = function(){
		var toDraw = [];
		var i, shape, dir;
		preRender();
		if("mode7" in Origami.world){	
			renderMode7(toDraw);
		}
		if("raycasting" in Origami.world){	
			renderRaycasting(toDraw);
		}
		if("shapes" in Origami.world){	
			renderShapes(toDraw);
		}
		toDraw.sort(function(a,b){
			return a.zpos-b.zpos;
		});
		for(i=0; i<toDraw.length; i++){
			shape = toDraw[i];
			if(shape.type == "3DSprite"){
				dir = Math.atan2(shape.xpos-Origami.size.hw, Origami.cam.depth);
				Origami.draw3DSprite(shape, dir);
			}else if(shape.type == "2DSprite"){
				Origami.draw2DSprite(shape);
			}else if(shape.type == "Disc"){
				Origami.drawDisc(shape);
			}else if(shape.type == "gfx"){
				Origami.drawTexture(shape);
			}else if(shape.type == "wireframe"){
				Origami.ctx.beginPath();
				Origami.ctx.strokeStyle = shape.color;
				Origami.ctx.moveTo(shape.v1.xpos, shape.v1.ypos);
				Origami.ctx.lineTo(shape.v2.xpos, shape.v2.ypos);
				Origami.ctx.stroke();
			}else{
				Origami.drawPolygon(shape);
			}
		}
		postRender();
	}
})();


