
var downPos = {x:0, y:0};
var intval;


function render(){
	/*var sun = Origami.world.light.sun;
	sun.yr -= 1/90;
	sun.x = Math.sin(sun.yr);
	sun.z = Math.cos(sun.yr);
	if(Origami.world.shapes.length > 1){
		Origami.world.shapes[1].x = sun.x*1000;
		Origami.world.shapes[1].z = sun.z*1000;
	}*/
	/*var radius = Mouse.pos.z;
	if(Mouse.isPressed(0)){
		downPos.x = Mouse.pos.x;
		downPos.y = Mouse.pos.y;
	}
	if(Mouse.isDown(0)){
		Origami.cam.ry += (downPos.x-Mouse.pos.x)/Origami.size.hw*Math.PI;
		Origami.cam.rx -= (downPos.y-Mouse.pos.y)/Origami.size.h*Math.PI;
		downPos.x = Mouse.pos.x;
		downPos.y = Mouse.pos.y;
	}
	Origami.cam.y = Math.sin(Origami.cam.rx)*radius;
	var r = Math.cos(Origami.cam.rx)*radius;
	Origami.cam.x = -Math.sin(Origami.cam.ry)*r;
	Origami.cam.z = -Math.cos(Origami.cam.ry)*r;*/
	
	
	Origami.cam.ry = currentOrientation.alpha;
	Origami.cam.rx = Math.PI/2 - currentOrientation.beta;
	
	
	
	Origami.render();
	FPS.frameComplete();
	Origami.ctx.fillText(Origami.statistics.polyCount+" Polygons", 0, 15);

};


function worldLoaded(world, cam){
	
	splitWorld(Origami.world, 5);
	
	downPos = {x:0, y:0};
	Origami.initWorld(function(){
		Animation.start(render);
	});
};

var currentOrientation = {alpha:0,beta:0, gamma:0};
function setRotation(e){
	currentOrientation.alpha = e.alpha*Math.PI/180;
	currentOrientation.beta = e.beta*Math.PI/180;
	currentOrientation.gamma = e.gamma*Math.PI/180;
}

function splitWorld(world, divisions){
	function buildRect(corner, vector1, vector2, divisions, image, width, height, world){
		function splitRect(p1, p2, p3, p4, divisions){
			function splitTriangle(p1, p2, p3, divisions){
				function buildTriangle(p1, p2, p3){
					return {p1:{a:p1.x, b:p1.y},
							p2:{a:p2.x, b:p2.y},
							p3:{a:p3.x, b:p3.y}};
				}
				if(divisions <= 0){
					return [buildTriangle(p1, p2, p3)];
				}else{
					var p4 = {x:(p2.x + p3.x)/2,
							  y:(p2.y + p3.y)/2};
					var triangles = [];
					triangles = triangles.concat(splitTriangle(p4, p1, p2, divisions - 1));
					triangles = triangles.concat(splitTriangle(p4, p3, p1, divisions - 1));
					return triangles;
				}
			}
			var triangles = [];
			triangles = triangles.concat(splitTriangle(p1, p2, p4, divisions - 1));
			triangles = triangles.concat(splitTriangle(p3, p4, p2, divisions - 1));
			return triangles
		}
		var shape = {};
		shape.type = "polygon";
		var verts = shape.verts = [];
		var polygons = shape.polygons = [];
		var textures = world.textures;
		
		
		var triangles = splitRect({x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:0, y:1}, divisions);
		for(var i=0; i<triangles.length; i++){
			var t = triangles[i];
			for(var p in t){
				verts.push({x:corner.x + t[p].a*vector1.x + t[p].b*vector2.x, 
							y:corner.y + t[p].a*vector1.y + t[p].b*vector2.y, 
							z:corner.z + t[p].a*vector1.z + t[p].b*vector2.z})
			}
			polygons.push({v1: verts.length - 3,
							v2: verts.length - 2,
							v3: verts.length - 1,
							texture: image+i});
			textures[image+i] = ({
				p1:{x:width*t.p1.a, y:height*t.p1.b},
				p2:{x:width*t.p2.a, y:height*t.p2.b},
				p3:{x:width*t.p3.a, y:height*t.p3.b},
				image: image
			});
		}
		
		world.shapes.push(shape);
	}
	buildRect({x:1000, y:1000, z:1000},
				{x:-2000, y:0, z:0},
				{x:0, y:-2000, z:0},
				divisions,
				"north",
				512, 512, world);
				
	buildRect({x:-1000, y:1000, z:1000},
				{x:0, y:0, z:-2000},
				{x:0, y:-2000, z:0},
				divisions,
				"east",
				512, 512, world);
				
	buildRect({x:-1000, y:1000, z:-1000},
				{x:2000, y:0, z:0},
				{x:0, y:-2000, z:0},
				divisions,
				"south",
				512, 512, world);
				
	buildRect({x:1000, y:1000, z:-1000},
				{x:0, y:0, z:2000},
				{x:0, y:-2000, z:0},
				divisions,
				"west",
				512, 512, world);
				
	buildRect({x:-1000, y:1000, z:-1000},
				{x:0, y:0, z:2000},
				{x:2000, y:0, z:0},
				divisions,
				"up",
				512, 512, world);
				
	buildRect({x:1000, y:-1000, z:-1000},
				{x:0, y:0, z:2000},
				{x:-2000, y:0, z:0},
				divisions,
				"down",
				512, 512, world);
				
	
	
	
}

Origami.canvas = document.getElementById("c");

Origami.ctx.fillStyle = "#000000";
Origami.ctx.fillRect(0, 0, Origami.size.w, Origami.size.h);


Mouse.init(window, document.getElementById("c"));
Mouse.pos.z = 300;
FPS.color = "#FFFFFF";
window.addEventListener("interfaceorientation", setRotation, false);
window.addEventListener("load", worldLoaded, false);