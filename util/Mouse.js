var Mouse = (function(){
	var that = this;
	var element = false;
	var offset = {x:0, y:0};
	var pos = {x:-1, y:-1, z:0, xh:0, yh:0};
	var keys = [];
	var keysPrev = [];
	var last = -1;
	var getPos = function(event){
		var e;
		if(event.targetTouches && event.targetTouches.length){
			e = event.targetTouches[0];
		}else{
			e = event;
		}
		var pos = {x:0, y:0};
		if (e.pageX || e.pageY) {
			pos.x = e.pageX;
			pos.y = e.pageY;
		} else if (e.x || e.y) 	{
			pos.x = e.clientX;// + document.body.scrollLeft + document.documentElement.scrollLeft;
			pos.y = e.clientY;// + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return pos;
	};
	
	var listener = function(event){
		var epos = getPos(event);
		if(event.type !== "touchend"){
			pos.x = epos.x - offset.x;
			pos.y = epos.y - offset.y;
			pos.xh = pos.x - element.clientWidth/2;
			pos.yh = pos.y - element.clientHeight/2;
		}
		if(event.type == "DOMMouseScroll"){
			pos.z += event.detail/Math.abs(event.detail)*5;
		}else if(event.type == "mousewheel"){
			pos.z += event.wheelDelta/Math.abs(event.wheelDelta)*5;
		}else if(event.type == "mousedown" || event.type == "mouseup"){
			last = event.button;
			keys[event.button] = event.type == "mousedown";
		}else if(event.type == "touchstart" || event.type == "touchend"){
			last = 0;
			keys[0] = event.type == "touchstart";
		}
		if(event.target == element){
			event.preventDefault();
			return false;
		}
	};
	function findOffset(elm){
		if(elm){
			var pos = findOffset(elm.offsetParent);
			pos.x += elm.offsetLeft;
			pos.y += elm.offsetTop;
			return pos;
		}else{
			return {x:0, y:0};
		}
	};
	return {
		pos:pos,
		calculateOffset:function(){
			offset = findOffset(element);
		},
		isDown:function(key){
			return keys[key] == 1;
		},
		lastKey:function(){
			return last;
		},
		isPressed:function(key){
			if(keys[key] && !keysPrev[key]){
				keysPrev[key] = true;
				return true;
			}
			keysPrev[key] = keys[key];
			return false;
		},
		isReleased:function(key){
			if(!keys[key] && keysPrev[key]){
				keysPrev[key] = false;
				return true;
			}
			return false;
		},
		init:function(source, elm){
			element = elm || source;
			offset = findOffset(element);
			source.ontouchmove = source.ontouchstart = source.ontouchend = listener;
			source.addEventListener("mousedown", listener, true);
			source.addEventListener("mousemove", listener, true);
			source.addEventListener("mouseup", listener, true);
			source.addEventListener("DOMMouseScroll", listener, true);
			source.addEventListener("mousewheel", listener, true);
		}
	};
})();
