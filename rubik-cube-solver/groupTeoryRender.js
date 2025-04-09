const groupTheory = (p) => {
  let edges = [];
  let nodes = [];
  let nodeRadius = 20;
  let circles = [];
  let intersectionPoints = [];

  let showStructure = false;
  let circleRadius;
  let trianglePoints;

  p.setup = () => {
    p.createCanvas(p.windowWidth / 2, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    calcCircleOrigins();
    createCircles();
    circles.forEach((circle) => {
      calculateIntersections(circle);
    });

    // Create nodes with colors and push to nodes array
    intersectionPoints.forEach((point, index) => {
      let color = FACE_COLORS[point.face];
      nodes.push({
        x: point.x,
        y: point.y,
        color: color,
        id: index,
      });
    });
  };

  p.draw = () => {
    p.push();

    p.noFill();
    p.stroke(0);
    if (showStructure) 
      drawStructure();

    drawGrid();
    drawNodes();

    p.pop();
  };

  const drawGrid = () => {
    // Draw the circles
    circles.forEach((circle) => {
      p.ellipse(circle.x, circle.y, circle.radius);
    });
  };

  const drawNodes = () => {
    // Draw the intersection nodes
    nodes.forEach((node) => {
      p.push();
      p.fill(node.color || "white");
      p.ellipse(node.x, node.y, 26);
      p.pop();
    });
  };

  const calculateIntersections = (circle) => {
    circles.forEach((otherCircle) => {
      if (circle !== otherCircle) {
        let dx = otherCircle.x - circle.x;
        let dy = otherCircle.y - circle.y;
        let dSquared = dx * dx + dy * dy;
        let radiusSum = circle.radius / 2 + otherCircle.radius / 2;
        if (dSquared > 0 && dSquared <= radiusSum * radiusSum) {
          let d = p.sqrt(dSquared);
          let a =
            (p.sq(circle.radius / 2) -
              p.sq(otherCircle.radius / 2) +
              dSquared) /
            (2 * d);
          let h = p.sqrt(p.sq(circle.radius / 2) - p.sq(a));
          let px = circle.x + (a * dx) / d;
          let py = circle.y + (a * dy) / d;
          let face;

          const tolerance = 0.1; // Define a small tolerance for floating-point comparisons
          if (
            circle.x < otherCircle.x &&
            Math.abs(circle.y - otherCircle.y) < tolerance
          ) {
            face = FACES.LEFT;
          } else if (
            circle.x > otherCircle.x &&
            Math.abs(circle.y - otherCircle.y) < tolerance
          ) {
            face = FACES.RIGHT;
          } else if (circle.x < otherCircle.x && circle.y < otherCircle.y) {
            face = FACES.FRONT;
          } else if (circle.x > otherCircle.x && circle.y > otherCircle.y) {
            face = FACES.BACK;
          } else if (
            circle.y < otherCircle.y
          ) {
            face = FACES.UP;
          } else if (
            circle.y > otherCircle.y
          ) {
            face = FACES.DOWN;
          }
          let intersection1 = {
            x: px + (h * dy) / d,
            y: py - (h * dx) / d,
            face,
          };
          intersectionPoints.push(intersection1);
        }
      }
    });
  };

  const calcCircleOrigins = () => {
    circleRadius = p.sqrt(
      p.sq(((2 / 3) * p.width) / 8) + p.sq(((2 / 3) * p.height) / 8)
    );
    // Adjust triangle to touch the circle
    let angleOffset = -p.PI / 2; // Start at the top of the circle
    trianglePoints = [];
    let angleStep = p.TWO_PI / 3; // Precompute
    for (let i = 0; i < 3; i++) {
      let angle = angleOffset + angleStep * i;
      let x = p.width / 2 + circleRadius * p.cos(angle);
      let y = p.height / 2 + circleRadius * p.sin(angle);
      trianglePoints.push({ x, y });
    }
  };

  const createCircles = () => {
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
  };

  const drawStructure = () => {
    p.ellipse(p.width / 2, p.height / 2, circleRadius * 2);

    p.triangle(
      trianglePoints[0].x,
      trianglePoints[0].y,
      trianglePoints[1].x,
      trianglePoints[1].y,
      trianglePoints[2].x,
      trianglePoints[2].y
    );
  };
};

new p5(groupTheory, "groupTheoryHolder");
