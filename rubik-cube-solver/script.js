class Cube {
  constructor(x, y, z, frontColor = 'red', backColor = 'red', leftColor = 'red', rightColor = 'red', topColor = 'red', bottomColor = 'red') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle = 0;
    this.faces = {
      [FACES.FRONT]: frontColor,
      [FACES.BACK]: backColor,
      [FACES.LEFT]: leftColor,
      [FACES.RIGHT]: rightColor,
      [FACES.TOP]: topColor,
      [FACES.BOTTOM]: bottomColor
    };
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}

const FACES = {
  FRONT: 'FRONT',
  BACK: 'BACK',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};
const ROTATION_DIRECTIONS = {
  CLOCKWISE: 'CLOCKWISE',
  COUNTERCLOCKWISE: 'COUNTERCLOCKWISE'
};

let cubeSize = 50;
let cubeSquareAmount = 3 //not implemented yet
let animationSpeed = 10;
let showFps = false

let cubes = [];

let isAnimating = false;
let rotatingFace = null;
let rotationDirection = null;
let rotationAngle = 0;

let camera;

let font;

function preload() {
  font = loadFont('assets/Poppins-Regular.ttf'); // Ensure the font file exists in the 'assets' folder
}

function setup() {
  createCanvas(500, 500, WEBGL);
  camera = createCamera();
  createRubikCube();
  textFont(font); // Set the font after loading
}

function draw() {
  background(50);

  orbitControl();
  lights();
  noStroke();
  
  // Display FPS
  if(showFps){
    push();
    fill(255);
    text(`FPS: ${Math.round(frameRate())}`, 10 - width / 2, 20 - height / 2);
    pop();
  }
  
  drawRubikCube();

  if (isAnimating) {
    rotationAngle += animationSpeed;
    if(rotationAngle > 90){
      for (let cube of cubes) {
        if (shouldRotate(cube)) {
          if (rotatingFace == FACES.TOP || rotatingFace == FACES.BOTTOM) {
            const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
            const newX = Math.round(-cube.z * angle);
            const newZ = Math.round(cube.x * angle);
            cube.x = newX;
            cube.z = newZ;

            const temp = cube.faces[FACES.FRONT];
            cube.faces[FACES.FRONT] = cube.faces[FACES.LEFT];
            cube.faces[FACES.LEFT] = cube.faces[FACES.BACK];
            cube.faces[FACES.BACK] = cube.faces[FACES.RIGHT];
            cube.faces[FACES.RIGHT] = temp;
          } else if (rotatingFace == FACES.RIGHT || rotatingFace == FACES.LEFT) {
            const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
            const newY = Math.round(cube.z * angle);
            const newZ = Math.round(-cube.y * angle);
            cube.y = newY;
            cube.z = newZ;

            const temp = cube.faces[FACES.FRONT];
            cube.faces[FACES.FRONT] = cube.faces[FACES.BOTTOM];
            cube.faces[FACES.BOTTOM] = cube.faces[FACES.BACK];
            cube.faces[FACES.BACK] = cube.faces[FACES.TOP];
            cube.faces[FACES.TOP] = temp;
          } else if (rotatingFace == FACES.FRONT || rotatingFace == FACES.BACK) {
            const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
            const newX = Math.round(cube.y * angle);
            const newY = Math.round(-cube.x * angle);
            cube.x = newX;
            cube.y = newY;

            const temp = cube.faces[FACES.TOP];
            cube.faces[FACES.TOP] = cube.faces[FACES.LEFT];
            cube.faces[FACES.LEFT] = cube.faces[FACES.BOTTOM];
            cube.faces[FACES.BOTTOM] = cube.faces[FACES.RIGHT];
            cube.faces[FACES.RIGHT] = temp;
          }
        }
      }
      isAnimating = false;
      rotationAngle = 0;
      rotationDirection = null;
    } 
  }
}

function createRubikCube(){
  cubes = [];
  for (let x = 0; x < cubeSquareAmount; x++) {
    for (let y = 0; y < cubeSquareAmount; y++) {
      for (let z = 0; z < cubeSquareAmount; z++) {
        cubes.push(new Cube(
          x - 1, 
          y - 1, 
          z - 1,
          z === 2 ? 'red' : 'white', // Front face
          z === 0 ? 'orange' : 'white', // Back face
          x === 0 ? 'green' : 'white', // Left face
          x === 2 ? 'blue' : 'white', // Right face
          y === 0 ? 'yellow' : 'white', // Top face
          y === 2 ? 'white' : 'white', // Bottom face
        ));
      }
    }
  }
}

function drawRubikCube() {
  for(let cube of cubes){
    push();
    
    if(rotatingFace && shouldRotate(cube)){
      if(rotatingFace == FACES.TOP){
        rotateY(radians(rotationAngle) * (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1));
      } 
      if(rotatingFace == FACES.RIGHT){
        rotateX(radians(rotationAngle) * (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1));
      } 
      if(rotatingFace == FACES.FRONT){
        rotateZ(radians(rotationAngle) * (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1));
      } 
      if(rotatingFace == FACES.BACK){
        rotateZ(radians(rotationAngle) * (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1));
      } 
      if(rotatingFace == FACES.LEFT){
        rotateX(radians(rotationAngle) * (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1));
      } 
      if(rotatingFace == FACES.BOTTOM){
        rotateY(radians(rotationAngle) * (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1));
      } 
    }
    
    translate(cube.x * cubeSize, cube.y  * cubeSize, cube.z  * cubeSize)

    // Paint each face individually
    beginShape();
    // Front face
    fill(cube.faces[FACES.FRONT]);
    
    vertex(-cubeSize / 2, -cubeSize / 2, cubeSize / 2);
    vertex(cubeSize / 2, -cubeSize / 2, cubeSize / 2);
    vertex(cubeSize / 2, cubeSize / 2, cubeSize / 2);
    vertex(-cubeSize / 2, cubeSize / 2, cubeSize / 2);
    endShape(CLOSE);

    beginShape();
    // Back face
    fill(cube.faces[FACES.BACK]);

    vertex(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2);
    vertex(-cubeSize / 2, cubeSize / 2, -cubeSize / 2);
    vertex(cubeSize / 2, cubeSize / 2, -cubeSize / 2);
    vertex(cubeSize / 2, -cubeSize / 2, -cubeSize / 2);
    endShape(CLOSE);

    beginShape();
    // Left face
    fill(cube.faces[FACES.LEFT]);

    vertex(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2);
    vertex(-cubeSize / 2, -cubeSize / 2, cubeSize / 2);
    vertex(-cubeSize / 2, cubeSize / 2, cubeSize / 2);
    vertex(-cubeSize / 2, cubeSize / 2, -cubeSize / 2);
    endShape(CLOSE);

    beginShape();
    // Right face
    fill(cube.faces[FACES.RIGHT]);

    vertex(cubeSize / 2, -cubeSize / 2, -cubeSize / 2);
    vertex(cubeSize / 2, cubeSize / 2, -cubeSize / 2);
    vertex(cubeSize / 2, cubeSize / 2, cubeSize / 2);
    vertex(cubeSize / 2, -cubeSize / 2, cubeSize / 2);
    endShape(CLOSE);

    beginShape();
    // Top face
    fill(cube.faces[FACES.TOP]);

    vertex(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2);
    vertex(cubeSize / 2, -cubeSize / 2, -cubeSize / 2);
    vertex(cubeSize / 2, -cubeSize / 2, cubeSize / 2);
    vertex(-cubeSize / 2, -cubeSize / 2, cubeSize / 2);
    endShape(CLOSE);

    beginShape();
    // Bottom face
    fill(cube.faces[FACES.BOTTOM]);

    vertex(-cubeSize / 2, cubeSize / 2, -cubeSize / 2);
    vertex(-cubeSize / 2, cubeSize / 2, cubeSize / 2);
    vertex(cubeSize / 2, cubeSize / 2, cubeSize / 2);
    vertex(cubeSize / 2, cubeSize / 2, -cubeSize / 2);
    endShape(CLOSE);

    // box(cubeSize);
    pop();
  }
}

function shouldRotate(cube){
  if(rotatingFace == FACES.TOP){
    return cube.y == -1;
  }
  if(rotatingFace == FACES.RIGHT) {
    return cube.x == 1;
  }
  if(rotatingFace == FACES.FRONT) {
    return cube.z == 1;
  }
  if(rotatingFace == FACES.BACK) {
    return cube.z == -1;
  }
  if(rotatingFace == FACES.LEFT) {
    return cube.x == -1;
  }
  if(rotatingFace == FACES.BOTTOM) {
    return cube.y == 1;
  }
  return false;
}

// Trigger rotation when key is pressed
// function keyPressed() {
//   if (!isAnimating) {
//     if (keyCode === RIGHT_ARROW) {
//       rotatingFace = FACES.TOP;
//       isAnimating = true;
//     }
//     if (keyCode === UP_ARROW) {
//       rotatingFace = FACES.RIGHT;
//       isAnimating = true;
//     }
//   }
// }

setInterval(() => {
  if(isAnimating) return;

  const faceKeys = Object.keys(FACES);
  rotatingFace = FACES[faceKeys[Math.floor(Math.random() * faceKeys.length)]];
  // rotatingFace = FACES.BACK;
  const rotationKeys = Object.keys(ROTATION_DIRECTIONS);
  // rotationDirection = ROTATION_DIRECTIONS[rotationKeys[Math.floor(Math.random() * rotationKeys.length)]];
  rotationDirection = ROTATION_DIRECTIONS.CLOCKWISE;
  isAnimating = true;
}, 0);

