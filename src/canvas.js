import { Ball } from './ball.js';
import { Pointer } from './pointer.js';

let lastClick = 0;

export const createRectangleNoFill = (context, x, y, width, height) => {
	context.strokeStyle = '#000';
	context.strokeRect(x, y, width, height);
};

export const createCircleNoFill = (context, x, y, radius) => {
	context.strokeStyle = '#000';
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, true);
	context.closePath();
	context.stroke();
};

export const createCircleNoFillOnClick = (context, x, y, radius) => {
	if (Pointer.status.button === 1 && lastClick != 1) {
		new Ball(context, x, y, radius);
	}
	lastClick = Pointer.status.button;
};
