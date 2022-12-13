import { fpsRun } from './fpsHandler.js';

const canvas = document.getElementById('canvas');
const fps = document.getElementById('fps');
const context = canvas.getContext('2d');

let ballsArray = [];

let left, up, right, down;

class Ball {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.player = false;
		ballsArray.push(this);
	}

	drawBall() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
		ball.x--;
	}
	if (right) {
		ball.x++;
	}
	if (up) {
		ball.y--;
	}
	if (down) {
		ball.y++;
	}
}

function update() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	ballsArray.forEach((b) => {
		b.drawBall();
		if (b.player) {
			controller(b);
		}
	});
	fpsRun(fps);
	requestAnimationFrame(update);
}

let ball1 = new Ball(200, 200, 20);
let ball2 = new Ball(500, 500, 10);
ball1.player = true;

update();
