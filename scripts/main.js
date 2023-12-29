const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas
const networkCtx = networkCanvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); // car position on lane, y, width, height
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)]; // array of cars (traffic)

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight; // resize the canvas
  networkCanvas.height = window.innerHeight; // resize the canvas

  carCtx.save(); // save the current state of the canvas
  carCtx.translate(0, -car.y + carCanvas.height * 0.7); // move the canvas to the car's position

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  car.draw(carCtx, "blue");

  carCtx.restore(); // restore the canvas to its original state

  Visualizer.drawNetwork(networkCtx, car.brain);
  requestAnimationFrame(animate);
}
