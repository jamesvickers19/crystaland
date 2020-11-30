
const canvas = this.document.getElementById("canvas"); 
const graphics = canvas.getContext('2d');

// paint canvas black
for (x = 0; x < canvas.width; x++) {
  for (y = 0; y < canvas.height; y++) {
    paintCanvasWithPixelAt(graphics, x, y, {});
  }
}

let currentX = canvas.width / 2;
let currentY = canvas.height / 2;
paintAtCurrent(graphics);
[currentX, currentY] = randomOpenPosition(graphics, canvas.width, canvas.height);
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
  [currentX, currentY] = randomNeighbor(currentX, currentY, canvas.width, canvas.height);
  paintAtCurrent(graphics);
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

function paintAtCurrent(graphics) {
  paintCanvasWithPixelAt(graphics, currentX, currentY, {red: 255});
}

function nearParticle(graphics, x, y, width, height) {
  for (const [neighborX, neighborY] of neighbors(x, y, width, height)) {
    if (isParticle(graphics, neighborX, neighborY)) {
      return true;
    }
  }
  return false;
}

function isParticle(graphics, x, y) {
  return getPixelAt(graphics, x, y).data.slice(0, 3).some(p => p > 0);
}

function neighbors(x, y, width, height) {
  let neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
  return neighbors.filter(n => inBox(n, width, height));
}

function randomNeighbor(x, y, width, height) {
  return randomElement(neighbors(x, y, width, height));
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
  const {red = 0, green = 0, blue = 0, alpha = 255} = pixelData;
  curImgData.data[0] = red;
  curImgData.data[1] = green;
  curImgData.data[2] = blue;
  curImgData.data[3] = alpha;
  graphics.putImageData(curImgData, x, y);
}

function paintCanvasWithPixels(ctx, pixelData) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
  var newImageData = ctx.createImageData(width, height);
  let i = 0;
  for (const {red = 0, green = 0, blue = 0, alpha = 255} of pixelData) {
    newImageData.data[i] = red;
    newImageData.data[i + 1] = green;
    newImageData.data[i + 2] = blue;
    newImageData.data[i + 3] = alpha;
    i += 4; 
  }
  ctx.putImageData(newImageData, 0, 0);
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}