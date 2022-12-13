import { Settings } from './settings.js';

export class FpsShow {
	static #fps;
	static #count;
	static fpsText;

	static init() {
		this.fpsText = document.getElementById('fps');
		this.#fps = 0;
		this.#count = 0;
	}

	static run() {
		if (this.#count * Settings.dt >= 1) {
			this.#fps = this.#count;
			this.#count = 0;
		} else this.#count++;
		this.fpsText.innerHTML = 'FPS: ' + this.#fps;
	}
}
