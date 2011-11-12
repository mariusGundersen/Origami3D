
var downPos = {x:0, y:0};
var intval;


function render(){
	var sun = Origami.world.light.sun;
	sun.yr -= 1/90;
	sun.x = Math.sin(sun.yr);
	sun.z = Math.cos(sun.yr);
	if(Origami.world.shapes.length > 1){
		Origami.world.shapes[1].x = sun.x*1000;
		Origami.world.shapes[1].z = sun.z*1000;
	}
	var radius = Mouse.pos.z;
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
	Origami.cam.z = -Math.cos(Origami.cam.ry)*r;
	Origami.render();
	FPS.frameComplete();
	Origami.ctx.fillText(Origami.statistics.polyCount+" Polygons", 0, 15);

};


function worldLoaded(world, cam){
	Origami.world = world;
	Origami.cam = cam;
	Origami.world.light.sun.yr = 0;
	
	downPos = {x:0, y:0};
	Origami.initWorld(function(){
		Animation.start(render);
	});
};

function loadWorld(file){
	Animation.stop();
	Origami.world = null;
	Origami.cam = null;
	
	var x = Origami.size.w/10;
	var w = Origami.size.w*8/10;
	var y = Origami.size.hh-5;
	var h = 10;
	Origami.ctx.fillStyle = "#000000";
	Origami.ctx.fillRect(0, 0, Origami.size.w, Origami.size.h);
	Origami.ctx.strokeStyle = "#4C64F0";
	Origami.ctx.fillStyle = "#0042F4";
	Origami.ctx.strokeRect(x, y, w, h);
	Origami.ctx.textAlign = "center";
	Origami.ctx.textBaseline = "bottom";
	Origami.ctx.font = "15px sans-serif";
	Origami.ctx.fillText("Loading...", (x+w)/2, y, w);
	Loader.unload("json");
	Loader.load(file, "json");
	
}
Origami.canvas = document.getElementById("c");

Origami.ctx.fillStyle = "#000000";
Origami.ctx.fillRect(0, 0, Origami.size.w, Origami.size.h);


Mouse.init(window, document.getElementById("c"));
Mouse.pos.z = 300;
FPS.color = "#FFFFFF";
	
