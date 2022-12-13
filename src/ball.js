import { balls } from './level.js';
import { Settings } from './settings.js';

export class Ball {
	constructor(context, x, y, radius, maxAcceleration, increase, bounce, angle) {
		this.radius = 15;
		this.angle = Math.atan2(200, 400);
		this.mass = this.radius;
		this.x = x;
		this.y = y;
		this.context = context;
		this.radius = radius;
		this.accelerationY = 0;
		this.accelerationX = 0;
		this.deceleration = 0.01;
		this.maxAcceleration = maxAcceleration;
		this.maxAccelerationHorizontal = maxAcceleration * 0.1;
		this.increase = increase;
		this.isOnGround = false;
		this.visible = true;
		this.bounce = -bounce;
		this.dX = Math.cos(this.angle) * 7;
		this.dY = Math.sin(this.angle) * 7;
		this.counter = 0;
		this.movementVertical = this.dX * Settings.dt * this.accelerationY;
		this.movementHorizontal = this.dY * Settings.dt + this.accelerationX;

		this.update();
	}

	move() {
		this.verticalMovement();
		this.horizontalMovement();
		this.movementVertical = Settings.dt * this.accelerationY;
		this.movementHorizontal = Settings.dt + this.accelerationX;
		this.y += this.movementVertical;
		this.x += this.movementHorizontal;
	}

	draw() {
		this.context.strokeStyle = '#000';
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		this.context.closePath();
		this.context.stroke();
	}

	collision(index) {
		this.verticalCollision();
		for (let i = index + 1; i < balls.length; i++) {
			let ball2 = i;
			let testBallX = balls[i].x;
			let testBallY = balls[i].y;
			let testBallDX = balls[i].dX;
			let testBallDY = balls[i].dY;
			let testBallRadius = balls[i].radius;
			let testBallMass = balls[i].mass;
			if (this.ballHitBall(index, testBallX, testBallY, testBallRadius)) {
				this.colideBalls(
					index,
					testBallX,
					testBallY,
					testBallRadius,
					testBallDX,
					testBallDY,
					testBallMass,
					ball2
				);
			}
		}
	}

	ballHitBall(index, ballX, ballY, ballRadius) {
		let collision = false;
		let directionX = balls[index].x - ballX;
		let directionY = balls[index].y - ballY;

		let distance = directionX * directionX + directionY * directionY;

		if (
			distance <=
			(balls[index].radius + ballRadius) * (balls[index].radius + ballRadius)
		) {
			collision = true;
		}
		return collision;
	}

	colideBalls() {}

	horizontalMovement() {
		if (this.accelerationX < this.maxAccelerationHorizontal) {
			if (this.isOnGround) {
				if (this.movementHorizontal < 0.1 && this.movementHorizontal > -0.1) {
					// this.movementHorizontal = 0;
				} else if (this.movementHorizontal != 0) {
					this.accelerationX -=
						this.deceleration * Math.sign(this.movementHorizontal);
				}
			}
		} else this.accelerationX = this.maxAccelerationHorizontal;
	}

	verticalMovement() {
		if (this.accelerationY < this.maxAcceleration) {
			if (!this.isOnGround) {
				this.accelerationY += 20;
			} else {
				if (this.accelerationY < 1 && this.accelerationY > -1) {
					// this.accelerationY = 0;
				}
				// this.accelerationY = 0;
				this.y = window.innerHeight - 19 - this.radius;
			}
		} else this.accelerationY = this.maxAcceleration;
	}

	verticalCollision() {
		if (
			this.y + (this.radius - 1) + this.accelerationY * Settings.dt >
				window.innerHeight - 19 &&
			!this.isOnGround
		) {
			if (
				this.x < window.innerWidth * 0.9 &&
				this.x > window.innerWidth * 0.1
			) {
				this.accelerationY *= this.bounce;
				this.y = window.innerHeight - 19 - this.radius;
			} else {
				this.isOnGround = false;
			}
		} else {
			if (
				this.y + this.radius + 1 > window.innerHeight - 19 &&
				this.x < window.innerWidth * 0.9 &&
				this.x > window.innerWidth * 0.1
			) {
				if (this.counter < 0.1) {
					this.counter += Settings.dt;
				} else {
					this.isOnGround = true;
				}
			} else {
				this.isOnGround = false;
				this.counter = 0;
			}
		}
		if (this.y > window.innerHeight) {
			this.visible = false;
		}
	}

	update(index) {
		if (this.visible) {
			this.draw();
			this.collision(index);
			this.move();
		}
	}

	getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}
}
