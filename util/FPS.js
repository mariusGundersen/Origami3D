var FPS = {};
FPS.fps = 1;
FPS.start = Number(new Date());
FPS.count = 0;
FPS.color = "#000000";
FPS.frameComplete = function(){
	var now = Number(new Date());
	if(now - FPS.start>1000){
		FPS.fps = Math.round(FPS.count/(now-FPS.start)*100000)/100;
		FPS.start = now;
		FPS.count = 0;
	}
	FPS.count++;
	Origami.ctx.fillStyle = FPS.color;
	Origami.ctx.textAlign = "left";
	Origami.ctx.textBaseline = "top";
	Origami.ctx.font = "12px arial, sans-serif";
	Origami.ctx.fillText(FPS.fps+"fps", 0, 0);
};