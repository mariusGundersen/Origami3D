var Loader = (function(){
	var files = [];
	var nextLoad = function(){
		if(files.length > 0){
			
			loadFile(files.shift());
		}
	
	};
	var loadFile = function(file, id){
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", file);
		if(id){
			script.setAttribute("id", id);
		}
		script.onload = nextLoad;
		document.body.appendChild(script);
	};
	return {
		load: function(toLoad, id){
			if(typeof(toLoad) === 'string'){
				loadFile(toLoad, id);
			}else{
				files = toLoad;
				nextLoad();
			}
		},
		unload: function(id){
			var elm = document.getElementById(id);
			if(elm){
				elm.parentNode.removeChild(elm);
			}
		}
	};

})();
