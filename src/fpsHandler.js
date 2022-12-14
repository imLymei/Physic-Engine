let lastTime = Date.now();
let dt;
let fpsNumber = 0;
let counter = 0;

export function fpsRun(fps) {
	let newTime = Date.now();
	dt = (newTime - lastTime) / 1000;
	lastTime = newTime;

	if (counter * dt >= 1) {
		fpsNumber = counter;
		counter = 0;
	} else {
		counter++;
	}
	return (fps.innerHTML = 'FPS: ' + fpsNumber);
}
