(function(){

	function transform(alpha, beta, gamma){
		alpha -= window.orientation;
		while(alpha < 0) alpha += 360;
		while(alpha > 360) alpha -= 360;
		if(window.orientation === 180){
			return {alpha: alpha,
					beta: -beta,
					gamma: -gamma};
		}else if(window.orientation === 90){
			return {alpha: alpha,
					beta: -gamma,
					gamma: beta};
		}else if(window.orientation === -90){
			return {alpha: alpha,
					beta: gamma,
					gamma: -beta};
		}else{
			return {alpha: alpha,
					beta: beta,
					gamma: gamma};
		}
	}

	function dispatch(alpha, beta, gamma){
		var event = document.createEvent("Event");
		
		event.initEvent("interfaceorientation", true, true);
		
		var orientation = transform(alpha, beta, gamma);
		event.alpha = orientation.alpha;
		event.beta = orientation.beta;
		event.gamma = orientation.gamma;
		
		window.dispatchEvent(event);
	}

	function onDeviceOrientationChange(e){
		
		dispatch(e.alpha, e.beta, e.gamma);
	}



	window.addEventListener("deviceorientation", onDeviceOrientationChange, false);


})();