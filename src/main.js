// import { fpsRun } from './fpsHandler.js';

const canvas = document.getElementById('canvas');
const fps = document.getElementById('fps');
const context = canvas.getContext('2d');

let clickPoints = 0;
let clickPointsPosition = [];

let ballsArray = [];
let wallsArray = [];

let left, up, right, down;

let friction = 0.05;

canvas.addEventListener('click', (e) => {
	clickPoints++;

	clickPointsPosition.push(e.x - e.target.offsetLeft, e.y - e.target.offsetTop);

	if (clickPoints === 2) {
		clickPoints = 0;

		if (
			clickPointsPosition[0] != clickPointsPosition[2] &&
			clickPointsPosition[1] != clickPointsPosition[3]
		) {
			let newWall = new Wall(
				clickPointsPosition[0],
				clickPointsPosition[1],
				clickPointsPosition[2],
				clickPointsPosition[3]
			);
		}

		clickPointsPosition = [];
	}
});

canvas.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	let newBall = new Ball(
		e.x - e.target.offsetLeft,
		e.y - e.target.offsetTop,
		randomInt(10, 40),
		randomInt(0, 10)
	);
	newBall.elasticity = randomInt(0, 10) / 10;
});

function round(value, precision) {
	let factor = 10 ** precision;

	return Math.round(value * factor) / factor;
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

let gravityVector = new Vector(0, 0.3);

class Ball {
	constructor(x, y, radius, mass) {
		this.position = new Vector(x, y);
		this.radius = radius;
		this.mass = mass;
		if (this.mass === 0) {
			this.inverseMass = 0;
		} else {
			this.inverseMass = 1 / this.mass;
		}
		this.elasticity = 1;

		this.accelerationVector = new Vector(0, 0);
		this.velocityVector = new Vector(0, 0);
		this.acceleration = 0.5;

		this.player = false;
		ballsArray.push(this);
	}

	drawBall() {
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.strokeStyle = 'white';
		context.stroke();

		if (this.mass === 0) {
			context.beginPath();
			context.arc(
				this.position.x,
				this.position.y,
				this.radius * 0.2,
				0,
				Math.PI * 2
			);
			context.strokeStyle = 'white';
			context.stroke();
		}
	}

	display() {
		this.velocityVector.drawVector(this.position.x, this.position.y, 10, 'red');
		this.accelerationVector
			.unit()
			.drawVector(this.position.x, this.position.y, 50, 'blue');
		// context.beginPath();
		// context.arc(700, 700, 50, 0, Math.PI * 2);
		// context.strokeStyle = 'white';
		// context.stroke();
	}

	reposition() {
		this.accelerationVector = this.accelerationVector
			.unit()
			.multiply(this.acceleration);

		this.velocityVector = this.velocityVector.add(this.accelerationVector);

		this.velocityVector = this.velocityVector.multiply(1 - friction);
		// this.velocityVector = this.velocityVector.add(gravityVector);

		this.position = this.position.add(this.velocityVector);
	}
}

class Wall {
	constructor(x1, y1, x2, y2) {
		this.start = new Vector(x1, y1);
		this.end = new Vector(x2, y2);
		wallsArray.push(this);
	}

	drawWall() {
		context.beginPath();
		context.moveTo(this.start.x, this.start.y);
		context.lineTo(this.end.x, this.end.y);
		context.strokeStyle = 'white';
		context.stroke();
	}

	wallUnit() {
		return this.end.subtract(this.start).unit();
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
		ball.accelerationVector.x -= ball.acceleration;
	}
	if (right) {
		ball.accelerationVector.x += ball.acceleration;
	}
	if (up) {
		ball.accelerationVector.y -= ball.acceleration;
	}
	if (down) {
		ball.accelerationVector.y += ball.acceleration;
	}
	if (!up && !down) {
		ball.accelerationVector.y = 0;
	}
	if (!right && !left) {
		ball.accelerationVector.x = 0;
	}
}

function closestPointBallAndWall(ball, wall) {
	let ballToWallStart = wall.start.subtract(ball.position);
	if (Vector.dot(wall.wallUnit(), ballToWallStart) > 0) {
		return wall.start;
	}

	let wallEndToBall = ball.position.subtract(wall.end);
	if (Vector.dot(wall.wallUnit(), wallEndToBall) > 0) {
		return wall.end;
	}

	let closestDistance = Vector.dot(wall.wallUnit(), ballToWallStart);
	let closestVector = wall.wallUnit().multiply(closestDistance);
	return wall.start.subtract(closestVector);
}

function ballCollisionWithWall(ball, wall) {
	let ballToClosest = closestPointBallAndWall(ball, wall).subtract(
		ball.position
	);
	if (ballToClosest.magnitude() < ball.radius) {
		return true;
	}
}

function ballsCollision(ball1, ball2) {
	if (
		ball1.radius + ball2.radius >=
		ball2.position.subtract(ball1.position).magnitude()
	) {
		return true;
	} else return false;
}

function wallPenetrationResolution(ball, wall) {
	let penetrationVector = ball.position.subtract(
		closestPointBallAndWall(ball, wall)
	);

	ball.position = ball.position.add(
		penetrationVector
			.unit()
			.multiply(ball.radius - penetrationVector.magnitude())
	);
}

function ballsPenetrationResolution(ball1, ball2) {
	let distancie = ball1.position.subtract(ball2.position);
	let penetrationDepth = ball1.radius + ball2.radius - distancie.magnitude();
	let penetrationResolution = distancie
		.unit()
		.multiply(penetrationDepth / (ball1.inverseMass + ball2.inverseMass));

	if (distancie.magnitude() === 0) {
		ball1.position.x += 1;
	}
	ball1.position = ball1.position.add(
		penetrationResolution.multiply(ball1.inverseMass)
	);
	ball2.position = ball2.position.add(
		penetrationResolution.multiply(-ball2.inverseMass)
	);
}

function wallCollisionResolution(ball, wall) {
	let normal = ball.position
		.subtract(closestPointBallAndWall(ball, wall))
		.unit();
	let separateVelocity = Vector.dot(ball.velocityVector, normal);
	let newSeparateVelocity = -separateVelocity * ball.elasticity;
	let vectorSeparateDifference = separateVelocity - newSeparateVelocity;

	ball.velocityVector = ball.velocityVector.add(
		normal.multiply(-vectorSeparateDifference)
	);
}

function ballsCollisionResolution(ball1, ball2) {
	let normal = ball1.position.subtract(ball2.position).unit();
	let relativeVelocity = ball1.velocityVector.subtract(ball2.velocityVector);
	let sepVelocity = Vector.dot(relativeVelocity, normal);
	let newSepVelocity =
		-sepVelocity * Math.min(ball1.elasticity, ball2.elasticity);

	let sepVelocityDiference = newSepVelocity - sepVelocity;
	let impulse = sepVelocityDiference / (ball1.inverseMass + ball2.inverseMass);
	let impulseVector = normal.multiply(impulse);

	ball1.velocityVector = ball1.velocityVector.add(
		impulseVector.multiply(ball1.inverseMass)
	);
	ball2.velocityVector = ball2.velocityVector.add(
		impulseVector.multiply(-ball2.inverseMass)
	);
}

function momentumDisplay() {
	let momentum = ball1.velocityVector.add(ball2.velocityVector).magnitude();
	context.fillStyle = 'white';
	context.fillText('Momentum: ' + round(momentum, 3), 400, 50);
}

function update() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	ballsArray.forEach((ball, index) => {
		ball.drawBall();
		if (ball.player) {
			controller(ball);
		}

		// context.fillStyle = 'white';
		// context.fillText(
		// 	ball.accelerationVector.x + ' ' + ball.accelerationVector.y,
		// 	ball.position.x,
		// 	ball.position.y - ball.radius * 1.2
		// );

		wallsArray.forEach((wall) => {
			if (ballCollisionWithWall(ballsArray[index], wall)) {
				wallPenetrationResolution(ballsArray[index], wall);
				wallCollisionResolution(ballsArray[index], wall);
			}
		});

		for (let i = index + 1; i < ballsArray.length; i++) {
			if (ballsCollision(ballsArray[index], ballsArray[i])) {
				ballsPenetrationResolution(ballsArray[index], ballsArray[i]);
				ballsCollisionResolution(ballsArray[index], ballsArray[i]);
			}
		}

		ball.reposition();
		ball.display();
	});
	// fpsRun(fps);

	// momentumDisplay();

	context.fillStyle = 'white';
	context.font = 'bold 12px verdana, sans-serif';
	context.fillText('Left click(2 clicks): Creates wall', 10, 20);
	context.fillText('Right click: Creates ball', 10, 40);
	context.fillText('Use arrows keys to move your main ball', 10, 60);

	wallsArray.forEach((wall, index) => {
		wall.drawWall();
	});

	requestAnimationFrame(update);
}

for (let i = 0; i < 10; i++) {
	let newBall = new Ball(
		randomInt(100, 700),
		randomInt(100, 700),
		randomInt(20, 40),
		randomInt(0, 10)
	);
	newBall.elasticity = randomInt(0, 10) / 10;
}

let edgeLeft = new Wall(0, 0, 0, canvas.clientHeight);
let edgeRight = new Wall(
	canvas.clientWidth,
	0,
	canvas.clientHeight,
	canvas.clientHeight
);
let edgeTop = new Wall(0, 0, canvas.clientWidth, 0);
let edgeBottom = new Wall(
	0,
	canvas.clientWidth,
	canvas.clientHeight,
	canvas.clientHeight
);

ballsArray[0].player = true;
if (ballsArray[0].mass == 0) {
	ballsArray[0].mass = randomInt(1, 10);
}

update();
