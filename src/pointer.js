export class Pointer {
	static #X;
	static #Y;
	static #button;

	// * Initializing the pointer class functions
	static init() {
		this.#X = 0; // ? set #X and #Y values to zero
		this.#Y = 0;
		this.#button = 0; // ? set button to zero
		window.addEventListener('mousemove', this.mouseMove); // ? Starts a event listener for mouse movement and execute mouseMove()
		window.addEventListener('mousedown', this.mouseDown); // ? Starts a event listener for mouse mouseDown and execute mouseDown()
		window.addEventListener('mouseup', this.mouseUp); // ? Starts a event listener for mouse mouseup and execute mouseUp()
	}

	// * Configuring how the status value is set
	static set status({ X, Y, button, click }) {
		this.#X = X; // ? Set #X value to X parameter
		this.#Y = Y; // ? Set #Y value to Y parameter
		this.#button = button; // ? Set #button value to button parameter
	}
	// * Configuring how te status value is get
	static get status() {
		return {
			X: this.#X,
			Y: this.#Y,
			button: this.#button,
		}; // ? return X and Y value as #X and #Y
	}

	// * Saving the new cursor status
	static mouseMove = (e) => {
		this.status = {
			X: e.pageX,
			Y: e.pageY,
			button: this.#button,
		}; // ? Update the status value with the nem status of the cursor
	};

	static mouseDown = (e) => {
		this.status = {
			X: this.#X,
			Y: this.#Y,
			button: e.buttons,
		}; // ? Update the button value
	};

	static mouseUp = (e) => {
		if (e.buttons === this.#button) {
			this.status = { X: this.#X, Y: this.#Y, button: 0 }; // ? Resets the button value
		} else {
			this.status = {
				X: this.#X,
				Y: this.#Y,
				button: e.buttons,
			}; // ? Maintain the button value
		}
	};
}
