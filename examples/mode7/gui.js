var GUI = function(ctx, textImage){
	this.ctx = ctx
	this.textImage = textImage
	this.textToDraw = [];
}

GUI.prototype.drawCharAt = function(character, x, y){
	if(character > 96){
		this.ctx.drawImage(this.textImage, (character-96)*8, 67, 8, 8, x, y, 8, 8);
		return 8;
	}else if(character > 64){
		this.ctx.drawImage(this.textImage, (character-65)*15 + 42, 26, 15, 16, x, y, 15, 16);
		return 15;
	}else if(character > 57){
		this.ctx.drawImage(this.textImage, (character-26)*8-1, 67, 8, 8, x, y, 8, 8);
		return 8;
	}else if(character > 47){
		this.ctx.drawImage(this.textImage, (character-48)*8, 76, 8, 8, x, y, 8, 8);
		return 8;
	}else if(character == 32){
		return 8;
	}else{
		return 8;
	}
};
GUI.prototype.drawText = function(text, x, y){
	this.textToDraw.push({text:text, x:x, y:y});
};
GUI.prototype.renderText = function(text){
	for(var i=0; i<text.text.length; i++){
		text.x += this.drawCharAt(text.text.charCodeAt(i), text.x, text.y);
	}
}; 
GUI.prototype.render = function(){
	for(var i in this.textToDraw){
		this.renderText(this.textToDraw[i]);
	}
	this.textToDraw = [];
};
