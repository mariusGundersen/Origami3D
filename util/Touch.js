var TouchStick = (function(){
	
	var OUTER_RADIUS = 80;
	var INNER_RADIUS = 40;
	var DELTA_RADIUS = OUTER_RADIUS - INNER_RADIUS;
	
	var _canvas, _touches = {};
	
	
	function init(canvas){
		_canvas = canvas;
		_canvas.addEventListener("touchstart", onTouchStart, false);
		_canvas.addEventListener("touchmove", onTouchMove, false);
		_canvas.addEventListener("touchend", onTouchEnd, false);
	}
	
	function draw(ctx){
		
		for(var i in _touches){
			var touch = _touches[i];
			console.log("draw", touch);
			var start = unOffset(touch.startX, touch.startY, ctx.canvas);
			var move = unOffset(touch.moveX, touch.moveY, ctx.canvas);
			var scaleX = ctx.canvas.width/ctx.canvas.clientWidth;
			var scaleY = ctx.canvas.height/ctx.canvas.clientHeight;
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#FFFFFF";
			ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
			ctx.beginPath();
			ctx.arc(start.x*scaleX, start.y*scaleY, (INNER_RADIUS)*scaleX, 0, Math.PI*2, true);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.moveTo(move.x*scaleX + INNER_RADIUS*scaleX, move.y*scaleY);
			ctx.arc(move.x*scaleX, move.y*scaleY, INNER_RADIUS*scaleX, 0, Math.PI*2, true);
			ctx.fill();
		}
	}
	
	function count(){
		var ret = 0;
		for(var i in _touches){
			ret++;
		}
		return ret;
	}
	
	function get(item){
		var ret = [];
		for(var i in _touches){
			var touch = _touches[i];
			ret.push({x:(touch.moveX - touch.startX)/DELTA_RADIUS,
					  y:(touch.moveY - touch.startY)/DELTA_RADIUS,
					  id:i});
		}
		console.log("get", ret);
		if(item === undefined){
			return ret;
		}else{
			return ret[item];
		}
	}
	
	function unOffset(x, y, elm){
		if(elm.offsetParent){
			var u = unOffset(x, y, elm.offsetParent);
			return {x:u.x - elm.offsetLeft, 
					y:u.y - elm.offsetTop};
		}else{
			return {x:x - elm.offsetLeft, 
					y:y - elm.offsetTop};
		}
	}
	
	function onTouchStart(e){
		var changedTouches = e.changedTouches;
		for(var i=0; i<changedTouches.length; i++){
			var touch = changedTouches[i];
			_touches["t"+touch.identifier] = {startX:touch.pageX, startY:touch.pageY, moveX:touch.pageX, moveY:touch.pageY};
		}
		
		e.preventDefault();
		return false;
	}
	function onTouchMove(e){
	
		var changedTouches = e.changedTouches;
		for(var i=0; i<changedTouches.length; i++){
			var touch = changedTouches[i];
			var t = _touches["t"+touch.identifier];
			limit(t, touch.pageX, touch.pageY, DELTA_RADIUS);
		}
	
		e.preventDefault();
		return false;
	}
	function onTouchEnd(e){
	
		var changedTouches = e.changedTouches;
		for(var i=0; i<changedTouches.length; i++){
			var touch = changedTouches[i];
			delete _touches["t"+touch.identifier];
		}
	
		e.preventDefault();
		return false;
	}


	function limit(stick, x, y, limit){
		var dist = Math.sqrt((stick.startX - x)*(stick.startX - x) + (stick.startY - y)*(stick.startY - y));
		if(dist > limit){
			stick.moveX = (x - stick.startX)/dist*limit + stick.startX;
			stick.moveY = (y - stick.startY)/dist*limit + stick.startY;
		}else{
			stick.moveX = x;
			stick.moveY = y;
		}
	}

	return {init:init,
			draw:draw,
			get:get,
			count:count};

	
})();