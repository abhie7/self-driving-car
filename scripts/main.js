const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d"); // ctx is the object that allows us to draw on the canvas
const car = new Car(100, 100, 30, 50); // x, y, width, height
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight; // resize the canvas
  car.draw(ctx);
  requestAnimationFrame(animate);
}
