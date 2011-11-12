var Line = function(x1, x2, y1, y2, z1, z2){
	this.x1 = x1 || 0;
	this.x2 = x2 || 0;
	this.y1 = y1 || 0;
	this.y2 = y2 || 0;
	this.z1 = z1 || 0;
	this.z2 = z2 || 0;
};
Line.prototype.toVector = function(){
	return new Vector(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1);
};
Line.prototype.vectorToStart = function(){
	return new Vector(this.x1, this.y1, this.z1);
};
Line.prototype.vectorToEnd = function(){
	return new Vector(this.x2, this.y2, this.z2);
};
Line.prototype.intersects = function(line){
	var v1 = this.toVector();
	var v2 = line.toVector();
	var v3 = line.vectorToStart().subtract(this.vectorToStart());
	
	var alongThis = v3.projectOnto(v2.left2DNormal())/v1.projectOnto(v2.left2DNormal());
	if(alongThis >= 0 && alongThis <= 1){
		v3 = v3.reverse();
		var alongLine = v3.projectOnto(v1.left2DNormal()) / v2.projectOnto(v1.left2DNormal());
		if(alongLine >= 0 && alongLine <= 1){
			return true;
		}
	}
	return false;
};
Line.prototype.distanceToPoint = function(x, y, z){
	var v1 = this.toVector();
	var v2 = new Vector(x, y, z).subtract(this.vectorToStart());
	var alongThis = v2.projectOnto(v1)/v1.length();
	if(alongThis < 0){
		return v2.length();
	}else if(alongThis > 1){
		return v2.subtract(v1).length();
	}else{
		return v2.projectOnto(v1.left2DNormal());
	}
}
