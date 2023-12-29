const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS"); // car position on lane, y, width, height
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)]; // array of cars (traffic)

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight; // resize the canvas

  ctx.save(); // save the current state of the canvas
  ctx.translate(0, -car.y + canvas.height * 0.7); // move the canvas to the car's position

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, "red");
  }
  car.draw(ctx, "blue");

  ctx.restore(); // restore the canvas to its original state
  requestAnimationFrame(animate);
}
