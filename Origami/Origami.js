var Origami = (function(){
	var _canvas;
	var o = {
		//A reference to the canvas on which to draw the world
		get canvas() {return _canvas;},
		
		set canvas(canvas){
			_canvas  = canvas;
			Origami.ctx = _canvas.getContext("2d");
			Origami.size = {w: _canvas.width, 
					h: _canvas.height, 
					hw: _canvas.width/2, 
					hh: _canvas.height/2};
			//Speed up rendering in firefox
			Origami.ctx.mozImageSmoothingEnabled = false;
		}
	};
	//This is the world that will be rendered.
	o.world = {
		mode7:{},
		raycasting:{
			tile:{},
			map:[]
		},
		shapes:[
			{
				type:"wireframe",
				vertices:[],
				lines:[]
			},
			{
				type:"polygon",
				vertices:[],
				polygons:[]
			},
			{
				type:"2DSprite",
				texture:0,
				x:0, y:0, z:0
			},
			{
				type:"3DSprite",
				texture:0,
				ry:0,
				x:0, y:0, z:0
			}
		],
		textures:[],
		images:[],
		canvas:[]
		
	};
	
	//This is the camera that will render the world
	o.cam = { 
		x:0, 
		y:0, 
		z:0, 
		rx:0, 
		ry:0, 
		rz:0, 
		cosx:1, 
		sinx:0, 
		cosy:1, 
		siny:0, 
		cosz:1, 
		sinz:0, 
		depth:0,
		horizon:0
	};
	
	//A reference to the context used to draw the world
	o.ctx;
	
	//Stores the size of the canvas (width and height) 
	//along with the center of the canvas (half-width and half-height)
	o.size = {w:0, h:0, hw:0, hh:0};
	
	//Used by raycasting engine to draw sprites and shapes behind walls
	o.depthMap = new Array();
	
	//Statistics about the current frame
	o.statistics = {polyCount:0};
	
	/**
	* This functions sets up the canvas that will be used
	*
	* argument: canvas - The canvas to use for rendering the world
	*
	*/
	
	o.initWorld = function(arg0, arg1){
		var callback;
		var i;
		if(typeof(arg0) === 'function'){
			callback = arg0;
		}else{
			Origami.world = arg0 || Origami.world;
			callback = arg1;
		}
		Origami.cam.rx = Origami.cam.rx || 0;
		Origami.cam.ry = Origami.cam.ry || 0;
		Origami.cam.rz = Origami.cam.rz || 0;
		
		Origami.imageLoader(function(){
			if("raycasting" in Origami.world){
				if("tile" in Origami.world.raycasting){
					Origami.world.raycasting.tile.h2 = Origami.world.raycasting.tile.h/2;
				}
				if("map" in Origami.world.raycasting){
					var map = Origami.world.raycasting.map;
					for(var y=0; y<map.length; y++){
						for(var x=0; x<map.length; x++){
							var t = map[y][x];
							if(typeof(t) === 'string'){
								map[y][x] = Origami.world.textures[t];
							}else if(t>0){
								map[y][x] = Origami.world.textures[t-1];
							}else{
								map[y][x] = false;
							}
						}
					}
				}
			}
			if("canvas" in Origami.world){
				if(document.createElement("canvas").toString() == "[object HTMLCanvasElement]"){
					for(i in Origami.world.canvas){
						var canvas = Origami.world.canvas[i];
						canvas.canvas = document.createElement("canvas");
						canvas.canvas.width = canvas.width || canvas.w;
						canvas.canvas.height = canvas.height || canvas.h;
						canvas.context2d = canvas.canvas.getContext("2d");
						if("image" in canvas){
							if(canvas.image in Origami.world.images){
								canvas.context2d.drawImage(Origami.world.images[canvas.image].image, 0, 0);
							}else{
								Origami.log("missing image: "+canvas.image);
							}
						}
					}
				}
			}
			if("textures" in Origami.world){
				for(i in Origami.world.textures){
					var texture = Origami.world.textures[i];
					if("image" in texture){
						if(texture.image in Origami.world.images){
							texture.image = Origami.world.images[texture.image];
						}else{
							Origami.log("missing image: "+texture.image);
						}
						texture.gfx = texture.image.image;
						
						texture.w = texture.w || texture.gfx.width;
						texture.h = texture.h || texture.gfx.height;
						texture.sx = texture.sx || 0;
						texture.sy = texture.sy || 0;
						texture.dx = texture.dx || -texture.gfx.width/2;
						texture.dy = texture.dy || -texture.gfx.height/2;
						texture.s = texture.s || 1;
						
						if("p1" in texture){
							Origami.normalizeTexture(texture);
						}
					}
					if("canvas" in texture){
						texture.image = Origami.world.canvas[texture.canvas];
						texture.gfx = texture.image.canvas;
					}
				}
			}
			if("mode7" in Origami.world){
				var mode7 = Origami.world.mode7;
				mode7.texture = Origami.world.textures[mode7.texture];
				mode7.canvas = document.createElement("canvas");
				mode7.ctx = mode7.canvas.getContext("2d");
				mode7.canvas.width = mode7.texture.w;
				mode7.canvas.height = mode7.texture.h;
				
			}
			if("shapes" in Origami.world){
				for(i in Origami.world.shapes){
					var shape = Origami.world.shapes[i];
					if(shape.type == "2DSprite" || shape.type == "3DSprite"){
						shape.texture = Origami.world.textures[shape.texture];
						if(!("frame" in shape)){
							shape.frame = 0;
						}
						if(shape.type == "3DSprite"){
							shape.sideAngle = (360/shape.sides);
							shape.halfSides = shape.sides/2;
							shape.zeroSide = shape.zeroSide || 0;
						}
					}else if(shape.type == "wireframe"){
						for(var l in shape.lines){
							var line = shape.lines[l];
							line.v1 = shape.verts[line.v1];
							line.v2 = shape.verts[line.v2];
							line.type = "line";
						}
					}else if(shape.type == "polygon"){
						for(var p in shape.polygons){
							var polygon = shape.polygons[p];
							polygon.type = "polygon";
							polygon.v1 = shape.verts[polygon.v1];
							polygon.v2 = shape.verts[polygon.v2];
							polygon.v3 = shape.verts[polygon.v3];
							polygon.texture = Origami.world.textures[polygon.texture];
							if(Origami.world.light){
								if(polygon.v2 == undefined || polygon.v1 == undefined || polygon.v3 == undefined){
									console.log({polygon:polygon, p:p});
								}
								//(Calculate normal of polygon by using cross product of vector v2-v1 and v3-v1.
								polygon.normal = {x:(polygon.v2.y - polygon.v1.y)*(polygon.v3.z - polygon.v1.z) - (polygon.v2.z - polygon.v1.z)*(polygon.v3.y - polygon.v1.y), 
												  y:(polygon.v2.z - polygon.v1.z)*(polygon.v3.x - polygon.v1.x) - (polygon.v2.x - polygon.v1.x)*(polygon.v3.z - polygon.v1.z),
												  z:(polygon.v2.x - polygon.v1.x)*(polygon.v3.y - polygon.v1.y) - (polygon.v2.y - polygon.v1.y)*(polygon.v3.x - polygon.v1.x)};
								l = Math.sqrt(polygon.normal.x*polygon.normal.x + polygon.normal.y*polygon.normal.y + polygon.normal.z*polygon.normal.z);
								polygon.normal.x/=l;
								polygon.normal.y/=l;
								polygon.normal.z/=l;
							}
						}
					}
				}
				
			}
			callback();
		});
	};
	return o;
})();
