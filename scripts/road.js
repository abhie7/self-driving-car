class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount; // number of lanes

    this.left = x - width / 2; // left side of the road
    this.right = x + width / 2; // right side of the road

    const infinity = 1000000;
    this.top = -infinity; // top of the road
    this.bottom = infinity; // bottom of the road

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex) {
    // get the center of the lane
    const laneWidth = this.width / this.laneCount; // width of each lane
    return (
      // return the center of the lane
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth // get the center of the lane
    );
  }

  draw(ctx) {
    // draw the road
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      //for each lane
      const x = lerp(this.left, this.right, i / this.laneCount); // get the x position of the line

      ctx.setLineDash([20, 20]); // set the line dash
      ctx.beginPath(); // begin drawing
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke(); // finish drawing
    }

    ctx.setLineDash([]); // reset the line dash
    this.borders.forEach((border) => {
      // draw the borders
      ctx.beginPath(); // begin drawing
      ctx.moveTo(border[0].x, border[0].y); // move to the first point
      ctx.lineTo(border[1].x, border[1].y); // draw a line to the second point
      ctx.stroke(); // finish drawing
    });
  }
}
