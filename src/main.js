import { FpsShow } from './fpsShow.js';
import { Level } from './level.js';
import { Pointer } from './pointer.js';
import { Settings } from './settings.js';

// ! Main class for the Engine
class Engine {
	// * Initializing function for create a new Level class and run the ticker counter (run function)
	constructor() {
		this.level = new Level(); // ? Create a new Level class
		this.previousTime = Date.now(); // ? Save the time for the tick time calculation

		Pointer.init();
		FpsShow.init();

		this.run();
	}

	// * Run the level infinitely while saving the tick between recalls in the settings.js
	run = () => {
		let newTime = Date.now(); // ? Save actual time
		Settings.dt = (newTime - this.previousTime) / 1000; // ? Compare the time between run()'s executions
		this.previousTime = newTime; // ? Set new previous time

		this.level.run(); // ? Run run() in the Level class

		requestAnimationFrame(this.run); // ? Ask for a new animation frame for the navigator and rerun run()
	};
}

// * Creating a Engine class when the HTML and Module Scripts are fully loaded
window.addEventListener('DOMContentLoaded', () => {
	new Engine(); // ? Create a new Engine class
});
