let edges = [];
let nodeRadius = 20;
let circles = [];
let intersectionPoints = [];

let showStructure = false;
let circleRadius;
let trianglePoints;


function setup() {
  createCanvas(windowWidth / 2, windowHeight);
  textAlign(CENTER, CENTER);
  calcCircleOrigins();
  createCircles();
  circles.forEach((circle) => {
    calculateIntersections(circle);
  });
}

function draw() {
  push();

  noFill();
  stroke(0);
  if (showStructure) {
    drawStructure();
  }

  drawGrid();
  drawNodes();

  pop();
}

function drawGrid() {
  // Draw the circles
  circles.forEach((circle) => {
    ellipse(circle.x, circle.y, circle.radius);
  });

  // Draw the intersection nodes
  intersectionPoints.forEach((point) => {
    push();
    fill(255, 0, 0);
    ellipse(point.x, point.y, 24);
    pop();
  });
}



function drawNodes() {}

function calculateIntersections(circle) {
  circles.forEach((otherCircle) => {
    if (circle !== otherCircle) {
      let dx = otherCircle.x - circle.x;
      let dy = otherCircle.y - circle.y;
      let dSquared = dx * dx + dy * dy;
      let radiusSum = circle.radius / 2 + otherCircle.radius / 2;
      if (dSquared > 0 && dSquared <= radiusSum * radiusSum) {
        let d = sqrt(dSquared);
        let a =
          (sq(circle.radius / 2) - sq(otherCircle.radius / 2) + dSquared) /
          (2 * d);
        let h = sqrt(sq(circle.radius / 2) - sq(a));
        let px = circle.x + (a * dx) / d;
        let py = circle.y + (a * dy) / d;
        let intersection1 = {
          x: px + (h * dy) / d,
          y: py - (h * dx) / d,
        };
        intersectionPoints.push(intersection1);
      }
    }
  });
}

function calcCircleOrigins() {
  circleRadius = sqrt(sq(((2 / 3) * width) / 8) + sq(((2 / 3) * height) / 8));
  // Adjust triangle to touch the circle
  let angleOffset = -PI / 2; // Start at the top of the circle
  trianglePoints = [];
  let angleStep = TWO_PI / 3; // Precompute
  for (let i = 0; i < 3; i++) {
    let angle = angleOffset + angleStep * i;
    let x = width / 2 + circleRadius * cos(angle);
    let y = height / 2 + circleRadius * sin(angle);
    trianglePoints.push({ x, y });
  }
}

function createCircles() {
  trianglePoints.forEach((point) => {
    // Precompute circles
    for (let i = 0; i < 3; i++) {
      circles.push({
        x: point.x,
        y: point.y,
        radius: circleRadius * 4 - 60 * i,
      });
    }
  });
}

function drawStructure() {
  ellipse(width / 2, height / 2, circleRadius * 2);

  triangle(
    trianglePoints[0].x,
    trianglePoints[0].y,
    trianglePoints[1].x,
    trianglePoints[1].y,
    trianglePoints[2].x,
    trianglePoints[2].y
  );
}
