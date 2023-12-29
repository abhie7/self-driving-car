class Sensor {
  // sensor class
  constructor(car) {
    this.car = car; // car object
    this.rayCount = 5; // number of rays
    this.rayLength = 150; // length of each ray
    this.raySpread = Math.PI / 2; // spread of the rays

    this.rays = []; // array of rays
    this.readings = []; // array of readings
  }

  update(roadBorders) {
    // update the sensor
    this.#castRays(); // cast the rays
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders)); // get the readings
    }
  }

  #getReading(ray, roadBorders) {
    // private method
    let touches = []; // array of points where the ray touches the road borders

    for (let i = 0; i < roadBorders.length; i++) {
      // for each road border
      const touch = getIntersection(
        // get the intersection of the ray and the road border
        ray[0], // start of the ray
        ray[1], // end of the ray
        roadBorders[i][0], // start of the road border
        roadBorders[i][1] // end of the road border
      );
      if (touch) {
        // if the ray touches the road border
        touches.push(touch); // add the touch to the array
      }
    }
    if (touches.length == 0) {
      // if the ray doesn't touch any road border
      return null; // return null
    } else {
      // if the ray touches at least one road border
      const offsets = touches.map((e) => e.offset); // get the offsets of the touches
      const minOffset = Math.min(...offsets); // get the minimum offset
      return touches.find((e) => e.offset == minOffset); // return the touch with the minimum offset
    }
  }

  #castRays() {
    // private method
    this.rays = []; // reset the rays array
    for (let i = 0; i < this.rayCount; i++) {
      // for each ray
      const rayAngle =
        lerp(
          // get the angle of the ray
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle; // rotate the sensors with the car

      const start = {
        // start of the ray
        x: this.car.x,
        y: this.car.y,
      };
      const end = {
        // end of the ray
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]); // add the ray to the array
    }
  }

  draw(ctx) {
    // draw the sensor
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1]; // end of the ray
      if (this.readings[i]) {
        // if the ray touches the road border
        end = this.readings[i]; // end of the ray = the touch
      }

      ctx.beginPath(); // begin drawing
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(
        // move to the start of the ray
        this.rays[i][0].x, // x
        this.rays[i][0].y // y
      );
      ctx.lineTo(end.x, end.y);
      ctx.stroke(); // finish drawing

      ctx.beginPath(); // begin drawing
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(
        // move to the start of the ray
        this.rays[i][1].x, // x
        this.rays[i][1].y // y
      );
      ctx.lineTo(end.x, end.y);
      ctx.stroke(); // finish drawing
    }
  }
}
