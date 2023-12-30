const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas
const networkCtx = networkCanvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1;
const cars = generateCars(N); // array of cars (traffic)
let bestCar = cars[0]; // the best car
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.05); //mutation amount
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2), // array of cars (traffic)
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2), // array of cars (traffic)
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
]; // array of cars (traffic)

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // get the best car which has gone the longest distance
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight; // resize the canvas
  networkCanvas.height = window.innerHeight; // resize the canvas

  carCtx.save(); // save the current state of the canvas
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); // move the canvas to the car's position

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore(); // restore the canvas to its original state

  networkCtx.lineDashOffset = -time / 69;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
