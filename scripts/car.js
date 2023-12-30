class Car {
  constructor(
    x,
    y,
    width,
    height,
    controlType,
    maxSpeed = 3,
    color = "#4242f5"
  ) {
    this.x = x; // x position
    this.y = y; // y position
    this.width = width; // width of the car
    this.height = height; // height of the car

    this.speed = 0; // speed of the car
    this.acceleration = 0.2; // acceleration of the car
    this.maxSpeed = maxSpeed; // maximum speed of the car
    this.friction = 0.05; // friction of the car
    this.angle = 0; // angle of the car
    this.damaged = false; // is the car damaged?

    this.useBrain = controlType == "AI"; // is the car controlled by the AI?

    if (controlType != "DUMMY") {
      // if the car is not a dummy
      this.sensor = new Sensor(this); // sensor object
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, 6, 4] // neural network object
      );
    }
    this.controls = new Controls(controlType); // controls object

    this.img = new Image(); // image of the car
    this.img.src = "./self-driving-car/styles/car.png";

    this.mask = document.createElement("canvas");
    this.mask.width = this.width;
    this.mask.height = this.height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
  }

  update(roadBorders, traffic) {
    // update the car's position (method)
    if (!this.damaged) {
      // if the car is damaged, it will stop moving
      this.#move();
      this.polygon = this.#createPolygon(); // create the polygon
      this.damaged = this.#assessDamage(roadBorders, traffic); // assess the damage
    }
    if (this.sensor) {
      // if the car is not a dummy
      this.sensor.update(roadBorders, traffic); // update the sensor
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      ); // get the offsets
      const outputs = NeuralNetwork.feedForward(offsets, this.brain); // feed forward the offsets
      // console.log(outputs);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic = []) {
    // private method
    for (let i = 0; i < roadBorders.length; i++) {
      // for each road border
      if (polysIntersect(this.polygon, roadBorders[i])) {
        // if the car intersects the road border
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    // private method
    const points = []; // array of points
    const radius = Math.hypot(this.width, this.height) / 2; // get the radius
    const alpha = Math.atan2(this.width, this.height); // get the angle between the center of the car and the top right corner
    points.push({
      // add the points to the array
      x: this.x - Math.sin(this.angle - alpha) * radius, // x position
      y: this.y - Math.cos(this.angle - alpha) * radius, // y position
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });
    return points; // return the array
  }

  #move() {
    // private method
    if (this.controls.forward) {
      this.speed += this.acceleration; // increase the speed
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration; // decrease the speed
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; // speed = maxSpeed
    }
    if (this.speed < -this.maxSpeed / 2) {
      //for reverse
      this.speed = -this.maxSpeed / 2; // limit speed
    }

    if (this.speed > 0) {
      this.speed -= this.friction; // apply friction
    }
    if (this.speed < 0) {
      this.speed += this.friction; // apply friction
    }
    if (Math.abs(this.speed) < this.friction) {
      // if the speed is less than the friction
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? -1 : 1; // if the speed is positive, flip = 1, else flip = -1
      if (this.controls.right) {
        this.angle += 0.03 * flip; // rotate the car
      }
      if (this.controls.left) {
        this.angle -= 0.03 * flip; // rotate the car
      }
    }

    this.x -= Math.sin(this.angle) * this.speed; // move the car
    this.y -= Math.cos(this.angle) * this.speed; // move the car
    // this.y -= this.speed; // move the car
  }

  // draw the car (method)
  draw(ctx, drawSensor = false) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    if (!this.damaged) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
