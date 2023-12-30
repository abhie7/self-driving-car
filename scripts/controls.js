class Controls {
  constructor(type) {
    this.forward = false; // forward key
    this.left = false; // left key
    this.right = false; // right key
    this.reverse = false; // backward key

    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners(); // add keyboard listeners
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      // when a key is pressed
      switch (
        event.key // check which key was pressed
      ) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
      // console.table(this);
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
      // console.table(this);
    };
  }
}
