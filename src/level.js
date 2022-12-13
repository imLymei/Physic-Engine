import { Ball } from './ball.js';
import {
	createCircleNoFill,
	createCircleNoFillOnClick,
	createRectangleNoFill,
} from './canvas.js';
import { FpsShow } from './fpsShow.js';
import { Pointer } from './pointer.js';

export let balls = [];
let lastClick;

export class Level {
	constructor() {
		this.setup();
	}

	setup = async () => {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');
		this.radiusValue = document.getElementById('radiusValue');
		this.bounceValue = document.getElementById('bounceValue');
		this.reset = document.getElementById('reset');
		this.fps = new FpsShow();

		this.setScreenSize();
	};

	run() {
		this.context.clearRect(0, 0, this.width, this.height);

		if (this.width != window.innerWidth || this.height != window.innerHeight) {
			this.setScreenSize();
		}

		createRectangleNoFill(
			this.context,
			this.width * 0.1,
			this.height - 20,
			this.width * 0.8,
			20
		);

		this.ball(
			this.context,
			Pointer.status.X,
			Pointer.status.Y,
			+this.radiusValue.value,
			3000,
			10,
			+this.bounceValue.value,
			2 / 3
		);
		balls.forEach((ball, index) => {
			ball.update(index);
		});

		FpsShow.run();
		if (balls == []) {
			this.reset.disabled = true;
		} else {
			this.reset.disabled = false;
			this.reset.onclick = function () {
				balls = [];
			};
		}
	}

	setScreenSize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	ball(
		context,
		x,
		y,
		radius,
		acceleration,
		maxAcceleration,
		increase,
		bounce,
		angle
	) {
		if (Pointer.status.button === 1 && lastClick != 1) {
			if (
				!(
					Pointer.status.X > 20 &&
					Pointer.status.X < 185 &&
					Pointer.status.Y > 20 &&
					Pointer.status.Y < 360
				)
			) {
				balls.push(
					new Ball(
						context,
						x,
						y,
						radius,
						acceleration,
						maxAcceleration,
						increase,
						bounce,
						angle
					)
				);
			}
		}
		lastClick = Pointer.status.button;
	}
}
