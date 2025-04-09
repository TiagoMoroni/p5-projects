const FACES = {
  FRONT: "FRONT",
  BACK: "BACK",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "TOP",
  DOWN: "DOWN",
};
const ROTATION_DIRECTIONS = {
  CLOCKWISE: "CLOCKWISE",
  COUNTERCLOCKWISE: "COUNTERCLOCKWISE",
};
const FACE_COLORS = {
  FRONT: "red",
  BACK: "orange",
  LEFT: "green",
  RIGHT: "blue",
  UP: "yellow",
  DOWN: "white",
}

let cubeSize = 50;
let cubeSquareAmount = 3; //not implemented yet
let animationSpeed = 10;
let showFps = false;

let cubes = [];

let isAnimating = false;
let rotatingFace = null;
let rotationDirection = null;
let rotationAngle = 0;

let camera;

let font;

function preload() {
  font = loadFont("assets/Poppins-Regular.ttf"); // Ensure the font file exists in the 'assets' folder
}

function setup() {
  createCanvas(windowWidth / 2, windowHeight, WEBGL);
  camera = createCamera();
  createRubikCube();
  textFont(font); // Set the font after loading
  shuffleCube();
}

function draw() {
  background(50);

  orbitControl();
  lights();

  // Display FPS
  if (showFps) {
    push();
    fill(255);
    text(`FPS: ${Math.round(frameRate())}`, 10 - width / 2, 20 - height / 2);
    pop();
  }

  drawRubikCube();

  if (isAnimating) {
    rotationAngle += animationSpeed;
    if (rotationAngle > 90) {
      for (let cube of cubes) {
        if (cube.shouldRotate()) {
          cube.spin(rotatingFace);
        }
      }
      isAnimating = false;
      rotationAngle = 0;
      rotationDirection = null;
    }
  }
}

function createRubikCube() {
  for (let x = 0; x < cubeSquareAmount; x++) {
    for (let y = 0; y < cubeSquareAmount; y++) {
      for (let z = 0; z < cubeSquareAmount; z++) {
        // Skip the center cube
        if (x === 1 && y === 1 && z === 1) continue;

        cubes.push(
          new IndividualCube(
            x - 1,
            y - 1,
            z - 1,
            z === 2 ? FACE_COLORS.FRONT : "white",
            z === 0 ? FACE_COLORS.BACK : "white",
            x === 0 ? FACE_COLORS.LEFT : "white",
            x === 2 ? FACE_COLORS.RIGHT : "white",
            y === 0 ? FACE_COLORS.UP : "white",
            y === 2 ? FACE_COLORS.DOWN : "white"
          )
        );
      }
    }
  }
}

function drawRubikCube() {
  for (let cube of cubes) {
    cube.draw();
  }
}

function shuffleCube(moves = 500) {
  let moveCount = 0;

  const shuffleInterval = setInterval(() => {
    if (isAnimating || moveCount >= moves) {
      if (moveCount >= moves) clearInterval(shuffleInterval);
      return;
    }

    const faceKeys = Object.keys(FACES);
    rotatingFace = FACES[faceKeys[Math.floor(Math.random() * faceKeys.length)]];
    rotationDirection = ROTATION_DIRECTIONS.CLOCKWISE;
    isAnimating = true;
    moveCount++;
  }, 0);
}

function solveCube() {
  // Placeholder for Kociemba's algorithm implementation
  // Kociemba's algorithm is a two-phase algorithm to solve a Rubik's Cube optimally.
  // Implementing it fully requires significant effort and understanding of the cube's state representation.

  const solutionSteps = []; // Array to store the steps to solve the cube

  // Step 1: Represent the cube's current state
  // You need to encode the cube's current state into a format that Kociemba's algorithm can process.
  // This typically involves creating a string representation of the cube's stickers.

  const cubeState = getCubeState(); // Function to extract the cube's current state

  // Step 2: Use a Kociemba solver library or implement the algorithm
  // Instead of implementing the algorithm from scratch, you can use an existing library.
  // For example, you can use the 'cubejs' library in JavaScript.

  // Example using cubejs:
  // const Cube = require('cubejs'); // Ensure you install this library via npm
  // const solver = new Cube();
  // solver.fromString(cubeState);
  // const solution = solver.solve(); // This returns a sequence of moves

  // For demonstration purposes, we'll assume the solution is a sequence of moves
  const solution = ["F", "R", "U", "R'", "U'", "F'"]; // Replace with actual solution from the library

  // Step 3: Convert the solution into steps for the animation
  for (const move of solution) {
    const face = parseMoveFace(move[0]);
    const direction = move.includes("'")
      ? ROTATION_DIRECTIONS.COUNTERCLOCKWISE
      : ROTATION_DIRECTIONS.CLOCKWISE;
    solutionSteps.push({ face, direction });
  }

  let moveCount = 0;

  const solveInterval = setInterval(() => {
    if (isAnimating || moveCount >= solutionSteps.length) {
      if (moveCount >= solutionSteps.length) clearInterval(solveInterval);
      return;
    }

    const { face, direction } = solutionSteps[moveCount];
    rotatingFace = face;
    rotationDirection = direction;
    isAnimating = true;
    moveCount++;
  }, 0);
}

function getCubeState() {
  // Extract the current state of the cube
  // This function should return a string representation of the cube's stickers
  // For example: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
  // Implement this based on your cube's data structure
  return "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"; // Placeholder
}

function parseMoveFace(move) {
  // Map the move notation to the corresponding face
  switch (move) {
    case "F":
      return FACES.FRONT;
    case "B":
      return FACES.BACK;
    case "L":
      return FACES.LEFT;
    case "R":
      return FACES.RIGHT;
    case "U":
      return FACES.UP;
    case "D":
      return FACES.DOWN;
    default:
      throw new Error(`Unknown move: ${move}`);
  }
}

// setInterval(() => {
//   if (isAnimating) return;

//   const faceKeys = Object.keys(FACES);
//   rotatingFace = FACES[faceKeys[Math.floor(Math.random() * faceKeys.length)]];
//   // rotatingFace = FACES.FRONT;
//   const rotationKeys = Object.keys(ROTATION_DIRECTIONS);
//   // rotationDirection = ROTATION_DIRECTIONS[rotationKeys[Math.floor(Math.random() * rotationKeys.length)]];
//   rotationDirection = ROTATION_DIRECTIONS.CLOCKWISE;
//   isAnimating = true;
// }, 0);
