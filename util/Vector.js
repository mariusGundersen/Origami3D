var Vector = function(x, y, z){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}

Vector.prototype.length = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
};
Vector.prototype.lengthSquared = function(){
	return this.x*this.x + this.y*this.y + this.z*this.z;
};

Vector.prototype.clone = function(){
	return new Vector(this.x, this.y, this.z);
}
Vector.prototype.add = function(vector){
	return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
}
Vector.prototype.subtract = function(vector){
	return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
}
Vector.prototype.multiply = function(scalar){
	return new Vector(this.x*scalar, this.y*scalar, this.z*scalar);
}
Vector.prototype.unit = function(){
	var ret = this.clone();
	var len = ret.length();
	ret.x /= len;
	ret.y /= len;
	ret.z /= len;
	return ret;
};
Vector.prototype.left2DNormal = function(){
	return new Vector(-this.y, this.x, 0);
};
Vector.prototype.right2DNormal = function(){
	return new Vector(this.y, -this.x, 0);
};
Vector.prototype.reverse = function(){
	return new Vector(-this.x, -this.y, -this.z);
};
Vector.prototype.dotProduct = function(vector){
	return this.x*vector.x + this.y*vector.y + this.z*vector.z;
};
Vector.prototype.crossProduct = function(vector){
	return new Vector(this.y*vector.z - this.z*vector.y, 
			  this.z*vector.x - this.x*vector.z,
			  this.x*vector.y - this.y*vector.x);
};
Vector.prototype.projectOnto = function(vector){
	var ret = vector.unit();
	return ret.dotProduct(this);
};

