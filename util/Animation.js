var Animation = (function(){
	var requestFrame = (function(){
		return window.requestAnimationFrame	|| 
		window.webkitRequestAnimationFrame	|| 
		window.mozRequestAnimationFrame		|| 
		window.oRequestAnimationFrame		|| 
		window.msRequestAnimationFrame		|| 
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	var cancelRequestFrame = (function() {
		return window.cancelAnimationFrame	||
		window.webkitCancelRequestAnimationFrame||
		window.mozCancelRequestAnimationFrame	||
		window.oCancelRequestAnimationFrame	||
		window.msCancelRequestAnimationFrame	||
		clearTimeout;
	})();
	var isPaused = false;
	var previousFrame = +new Date();
	var animationReference = undefined;
	var callbackFunction = undefined;
	var onFrameReady = function(time){
		time = time || +new Date();

		callbackFunction(time-previousFrame);
		previousFrame = time;
		
		if(!isPaused){
			animationReference = requestFrame(onFrameReady);
		}
		
	};
	return {
		isPaused: function(){
			return isPaused;
		},
		start: function(callback){
			isPaused = false;
			previousFrame = +new Date();
			callbackFunction = callback;
			animationReference = requestFrame(onFrameReady);
		},
		stop: function(){
			isPaused = true;
			callbackFunction = undefined;
			cancelRequestFrame(animationReference);
		},
		unpause: function(){
			if(callbackFunction){
				isPaused = false;
				previousFrame = +new Date();
				animationReference = requestFrame(onFrameReady);
			}
		},
		pause: function(){
			isPaused = true;
			cancelRequestFrame(animationReference);
		}
		
	};
})();

