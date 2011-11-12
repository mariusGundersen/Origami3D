var Kart = function(speed, weight, shape){
	this.mass = 1+weight/3;
	this.maxSpeed = Kart.MAX_SPEED + speed/10;
	this.steer = Kart.STEER*this.mass;
	this.shape = shape;
	this.velocity = 0;
	this.throttlePos = 0;
	this.steeringWheel = 0;
	this.newPos = {dr:0, dx:0, dz:0}
	this.width = this.shape.texture.w/2*this.shape.texture.s;
}
Kart.STEER = Math.PI/180*0.2;
Kart.MAX_STEER = 7;
Kart.MAX_THROTTLE = 3;
Kart.MAX_SPEED = 4;
Kart.MIN_SPEED = 0.1
Kart.FRICTION = -0.1;
Kart.TRACTION = 0.09;
Kart.prototype.step = function(throttle, steer, brake, time){


	//Throttle position
	if(throttle == 0 && this.throttlePos != 0){
		throttle = -this.throttlePos/Math.abs(this.throttlePos);
	}
	if(Math.abs(this.throttlePos + throttle) < Kart.MAX_THROTTLE){
		this.throttlePos += throttle;
	}
	
	//Steering wheel rotation
	if(steer == 0 && this.steeringWheel != 0){
		steer = this.steeringWheel/Math.abs(this.steeringWheel);
	}
	if(Math.abs(this.steeringWheel - steer) < Kart.MAX_STEER){
		this.steeringWheel -= steer;
	}
	
		
	//Accelerate when the throttle is down
	//Decelerate due to friction when it is not
	//Decelerate when turning
	var acceleration = Kart.TRACTION*this.throttlePos/this.mass;
	if(Math.abs(this.velocity) > Kart.MIN_SPEED && acceleration == 0){
		acceleration = Kart.FRICTION*this.velocity/Math.abs(this.velocity)/this.mass;
	}
	if(Math.abs(this.velocity + acceleration*time/16) <= this.maxSpeed){
		this.velocity += acceleration*time/16;
	}
	if(Math.abs(this.velocity) < Kart.MIN_SPEED && this.throttlePos == 0){
		this.velocity = 0;
	}
	
	
	
	
	
	if(this.velocity != 0){
		this.shape.zeroSide = 24 - Math.round(this.steeringWheel/Kart.MAX_SPEED*this.velocity);
	}else{
		this.shape.zeroSide = 24;
	}
	
	this.newPos.dr = this.steeringWheel*this.velocity/this.maxSpeed*this.steer*time/16;
	this.newPos.dx = Math.sin(this.shape.ry + this.newPos.dr)*this.velocity*time/16;
	this.newPos.dz = Math.cos(this.shape.ry + this.newPos.dr)*this.velocity*time/16;
	
}
Kart.prototype.move = function(){
	this.shape.ry += this.newPos.dr;
	this.shape.ry += Math.PI*2;
	this.shape.ry %= Math.PI*2;
	
	this.shape.x += this.newPos.dx;
	this.shape.z += this.newPos.dz;
	
}

Kart.prototype.hitTestAndMove = function(walls, shapes){
	var moveRay = new Line(this.shape.x, this.shape.x + this.newPos.dx, this.shape.z, this.shape.z + this.newPos.dz);
	var hit = false;
	for(var i in walls){
		if(moveRay.intersects(walls[i])){
			hit = true;
			break;
		}
	}
	for(var i in shapes){
		var shape = shapes[i];
		if(shape != this.shape && moveRay.distanceToPoint(shape.x, shape.z, 0) < this.width ){
			if(shape.type == "2DSprite"){
				hit = true;
				break;
			}
		}
	}
	if(hit){
		this.velocity *= -0.8
	}else{
		this.move();
	}

}
