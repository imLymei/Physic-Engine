import { fpsRun } from './fpsHandler.js';

const canvas = document.getElementById('canvas');
const fps = document.getElementById('fps');
const context = canvas.getContext('2d');

let ballsArray = [];

let left, up, right, down;

let friction = 0.1;

function round(value, precision) {
	let factor = 10 ** precision;

	return Math.round(value * factor) / factor;
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	subtract(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	magnitude() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	multiply(amount) {
		return new Vector(this.x * amount, this.y * amount);
	}

	normal() {
		return new Vector(-this.y, this.x).unit();
	}

	unit() {
		if (this.magnitude() != 0) {
			return new Vector(this.x / this.magnitude(), this.y / this.magnitude());
		} else return new Vector(0, 0);
	}

	static dot(vector1, vector2) {
		return vector1.x * vector2.x + vector1.y * vector2.y;
	}

	drawVector(initialX, initialY, multiplier, color) {
		context.beginPath();
		context.moveTo(initialX, initialY);
		context.lineTo(
			initialX + this.x * multiplier,
			initialY + this.y * multiplier
		);
		context.strokeStyle = color;
		context.stroke();
	}
}

class Ball {
	constructor(x, y, radius) {
		this.position = new Vector(x, y);
		this.radius = radius;

		this.accelerationVector = new Vector(0, 0);
		this.velocityVector = new Vector(0, 0);
		this.acceleration = 0.8;

		this.player = false;
		ballsArray.push(this);
	}

	drawBall() {
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.strokeStyle = 'white';
		context.stroke();
	}

	display() {
		this.velocityVector.drawVector(700, 700, 10, 'red');
		this.accelerationVector.unit().drawVector(700, 700, 50, 'blue');
		context.beginPath();
		context.arc(700, 700, 50, 0, Math.PI * 2);
		context.strokeStyle = 'white';
		context.stroke();
	}
}

function controller(ball) {
	canvas.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') {
			left = true;
		}
		if (e.key === 'ArrowRight') {
			right = true;
		}
		if (e.key === 'ArrowUp') {
			up = true;
		}
		if (e.key === 'ArrowDown') {
			down = true;
		}
	});

	canvas.addEventListener('keyup', (e) => {
		if (e.key === 'ArrowLeft') {
			left = false;
		}
		if (e.key === 'ArrowRight') {
			right = false;
		}
		if (e.key === 'ArrowUp') {
			up = false;
		}
		if (e.key === 'ArrowDown') {
			down = false;
		}
	});

	if (left) {
		ball.accelerationVector.x = -ball.acceleration;
	}
	if (right) {
		ball.accelerationVector.x = ball.acceleration;
	}
	if (up) {
		ball.accelerationVector.y = -ball.acceleration;
	}
	if (down) {
		ball.accelerationVector.y = ball.acceleration;
	}
	if (!up && !down) {
		ball.accelerationVector.y = 0;
	}
	if (!right && !left) {
		ball.accelerationVector.x = 0;
	}

	ball.accelerationVector = ball.accelerationVector
		.unit()
		.multiply(ball.acceleration);

	ball.velocityVector = ball.velocityVector.add(ball.accelerationVector);

	ball.velocityVector = ball.velocityVector.multiply(1 - friction);

	ball.position = ball.position.add(ball.velocityVector);
}

function ballsCollision(ball1, ball2) {
	if (
		ball1.radius + ball2.radius >=
		ball2.position.subtract(ball1.position).magnitude()
	) {
		return true;
	} else return false;
}

function ballsPenetrationResolution(ball1, ball2) {
	let distancie = ball1.position.subtract(ball2.position);
	let penetrationDepth = ball1.radius + ball2.radius - distancie.magnitude();
	let penetrationResolution = distancie.unit().multiply(penetrationDepth / 2);
	ball1.position = ball1.position.add(penetrationResolution);
	ball2.position = ball2.position.add(penetrationResolution.multiply(-1));
}

function update() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	ballsArray.forEach((ball, index) => {
		ball.drawBall();
		if (ball.player) {
			controller(ball);
		}

		for (let i = index + 1; i < ballsArray.length; i++) {
			if (ballsCollision(ballsArray[index], ballsArray[i])) {
				ballsPenetrationResolution(ballsArray[index], ballsArray[i]);
			}
		}

		ball.display();
	});
	fpsRun(fps);

	requestAnimationFrame(update);
}

let ball1 = new Ball(200, 200, 20);
let ball2 = new Ball(500, 500, 40);
let ball3 = new Ball(501, 500, 40);
let ball4 = new Ball(500, 510, 40);
let ball5 = new Ball(502, 503, 40);
ball1.player = true;

update();
