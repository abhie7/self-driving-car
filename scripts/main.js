const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50); // car position on lane, y, width, height
// car.draw(ctx);

animate();

function animate() {
  car.update(road.borders);
  canvas.height = window.innerHeight; // resize the canvas

  ctx.save(); // save the current state of the canvas
  ctx.translate(0, -car.y + canvas.height * 0.7); // move the canvas to the car's position

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore(); // restore the canvas to its original state
  requestAnimationFrame(animate);
}
