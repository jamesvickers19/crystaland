
const canvas = this.document.getElementById("canvas"); 
const graphics = canvas.getContext('2d');

// paint canvas black
for (x = 0; x < canvas.width; x++) {
  for (y = 0; y < canvas.height; y++) {
    paintCanvasWithPixelAt(graphics, x, y, {});
  }
}

paintParticle(graphics, canvas.width / 2, canvas.height / 2); // seed at center
let [currentX, currentY] = randomOpenPosition(graphics, canvas.width, canvas.height);
animLoop(graphics, crystalize);

function crystalize(graphics) {
  if (nearParticle(graphics, currentX, currentY, canvas.width, canvas.height)) {
    let newXY = randomOpenPosition(graphics, canvas.width, canvas.height);
    if (newXY != null) {
      [currentX, currentY] = newXY;
    }
  }
  else {
    wander(graphics);
  }
}

function wander(graphics) {
  paintCanvasWithPixelAt(graphics, currentX, currentY, {});
  [currentX, currentY] = randomCardinalNeighbor(currentX, currentY, canvas.width, canvas.height);
  paintParticle(graphics, currentX, currentY);
}

function randomOpenPosition(graphics, width, height) {
  for (i = 0; i < width * height; i++) {
    let x = randomInteger(0, width - 1);
    let y = randomInteger(0, height - 1);
    if (!isParticle(graphics, x, y)) {
      return [x, y];
    }
  }
  return null;
}

function paintParticle(graphics, x, y) {
  paintCanvasWithPixelAt(graphics, x, y, {red: 255});
}

function nearParticle(graphics, x, y, width, height) {
  return squareNeighbors(x, y, width, height).some(n => isParticle(graphics, n[0], n[1]));
}

function isParticle(graphics, x, y) {
  return getPixelAt(graphics, x, y).data.slice(0, 3).some(p => p > 0);
}

function squareNeighbors(x, y, width, height) {
  return cardinalNeighbors(x, y, width, height)
    .concat(validNeighbors([[x + 1, y + 1], [x - 1, y - 1]], width, height));
}

function cardinalNeighbors(x, y, width, height) {
  return validNeighbors([[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]], width, height);
}

function validNeighbors(neighbors, width, height) {
  return neighbors.filter(n => inBox(n, width, height));
}

function randomCardinalNeighbor(x, y, width, height) {
  return randomElement(cardinalNeighbors(x, y, width, height));
}

function inBox(coords, width, height) {
  let [x, y] = coords;
  return x >= 0 && x < width && y >= 0 && y < height;
}

function randomElement(arr) {
  return arr[randomInteger(0, arr.length - 1)];
}

// https://gist.github.com/louisremi/1114293#file_anim_loop_x.js
function animLoop(graphics, renderFunc) {
  function loop() {
    requestAnimationFrame(loop);
    renderFunc(graphics);
  }
  loop();
}

function getPixelAt(graphics, x, y) {
  return graphics.getImageData(x, y, 1, 1);
}

function paintCanvasWithPixelAt(graphics, x, y, pixelData) {
  let curImgData = getPixelAt(graphics, x, y);
  curImgData.data[0] = pixelData.red || 0;
  curImgData.data[1] = pixelData.green || 0;
  curImgData.data[2] = pixelData.blue || 0;
  curImgData.data[3] = pixelData.alpha || 255;
  graphics.putImageData(curImgData, x, y);
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}