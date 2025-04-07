class IndividualCube {
  constructor(
    x,
    y,
    z,
    frontColor = "red",
    backColor = "red",
    leftColor = "red",
    rightColor = "red",
    topColor = "red",
    bottomColor = "red"
  ) {
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
      [FACES.BOTTOM]: bottomColor,
    };
  }

  draw() {
    push();

    const actions = {
      [FACES.TOP]: rotateY,
      [FACES.BOTTOM]: rotateY,
      [FACES.RIGHT]: rotateX,
      [FACES.LEFT]: rotateX,
      [FACES.FRONT]: rotateZ,
      [FACES.BACK]: rotateZ,
    };

    if (rotatingFace && this.shouldRotate()) {
      actions[rotatingFace](
        radians(rotationAngle) *
          (rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? 1 : -1)
      );
    }

    //Render all 6 individual cubes faces
    translate(this.x * cubeSize, this.y * cubeSize, this.z * cubeSize);

    let faces = [
      {
        faceSide: FACES.FRONT,
        color: this.faces[FACES.FRONT],
        vertices: [
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ],
      },
      {
        faceSide: FACES.BACK,
        color: this.faces[FACES.BACK],
        vertices: [
          [-1, -1, -1],
          [-1, 1, -1],
          [1, 1, -1],
          [1, -1, -1],
        ],
      },
      {
        faceSide: FACES.LEFT,
        color: this.faces[FACES.LEFT],
        vertices: [
          [-1, -1, -1],
          [-1, -1, 1],
          [-1, 1, 1],
          [-1, 1, -1],
        ],
      },
      {
        faceSide: FACES.RIGHT,
        color: this.faces[FACES.RIGHT],
        vertices: [
          [1, -1, -1],
          [1, 1, -1],
          [1, 1, 1],
          [1, -1, 1],
        ],
      },
      {
        faceSide: FACES.TOP,
        color: this.faces[FACES.TOP],
        vertices: [
          [-1, -1, -1],
          [1, -1, -1],
          [1, -1, 1],
          [-1, -1, 1],
        ],
      },
      {
        faceSide: FACES.BOTTOM,
        color: this.faces[FACES.BOTTOM],
        vertices: [
          [-1, 1, -1],
          [-1, 1, 1],
          [1, 1, 1],
          [1, 1, -1],
        ],
      },
    ];

    for (const face of faces) {
      fill(face.color);
      beginShape();
      for (const [vx, vy, vz] of face.vertices) {
        if (
          (this.z === 1 &&
            (face.faceSide == FACES.FRONT || rotatingFace == FACES.FRONT)) ||
          (this.z === -1 &&
            (face.faceSide == FACES.BACK || rotatingFace == FACES.BACK)) ||
          (this.x === -1 &&
            (face.faceSide == FACES.LEFT || rotatingFace == FACES.LEFT)) ||
          (this.x === 1 &&
            (face.faceSide == FACES.RIGHT || rotatingFace == FACES.RIGHT)) ||
          (this.y === -1 &&
            (face.faceSide == FACES.TOP || rotatingFace == FACES.TOP)) ||
          (this.y === 1 &&
            (face.faceSide == FACES.BOTTOM || rotatingFace == FACES.BOTTOM)) ||
          rotatingFace == face.faceSide
        ) {
          vertex((vx * cubeSize) / 2, (vy * cubeSize) / 2, (vz * cubeSize) / 2);
        }
      }
      endShape(CLOSE);
    }

    pop();
  }

  spin(rotatingFace) {
    if (rotatingFace == FACES.TOP || rotatingFace == FACES.BOTTOM) {
      const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
      const newX = Math.round(-this.z * angle);
      const newZ = Math.round(this.x * angle);
      this.x = newX;
      this.z = newZ;

      const temp = this.faces[FACES.FRONT];
      this.faces[FACES.FRONT] = this.faces[FACES.LEFT];
      this.faces[FACES.LEFT] = this.faces[FACES.BACK];
      this.faces[FACES.BACK] = this.faces[FACES.RIGHT];
      this.faces[FACES.RIGHT] = temp;
    } else if (rotatingFace == FACES.RIGHT || rotatingFace == FACES.LEFT) {
      const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
      const newY = Math.round(this.z * angle);
      const newZ = Math.round(-this.y * angle);
      this.y = newY;
      this.z = newZ;

      const temp = this.faces[FACES.FRONT];
      this.faces[FACES.FRONT] = this.faces[FACES.BOTTOM];
      this.faces[FACES.BOTTOM] = this.faces[FACES.BACK];
      this.faces[FACES.BACK] = this.faces[FACES.TOP];
      this.faces[FACES.TOP] = temp;
    } else if (rotatingFace == FACES.FRONT || rotatingFace == FACES.BACK) {
      const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
      const newX = Math.round(this.y * angle);
      const newY = Math.round(-this.x * angle);
      this.x = newX;
      this.y = newY;

      const temp = this.faces[FACES.TOP];
      this.faces[FACES.TOP] = this.faces[FACES.LEFT];
      this.faces[FACES.LEFT] = this.faces[FACES.BOTTOM];
      this.faces[FACES.BOTTOM] = this.faces[FACES.RIGHT];
      this.faces[FACES.RIGHT] = temp;
    }
  }

  shouldRotate() {
    if (rotatingFace == FACES.TOP) {
      return this.y == -1;
    }
    if (rotatingFace == FACES.RIGHT) {
      return this.x == 1;
    }
    if (rotatingFace == FACES.FRONT) {
      return this.z == 1;
    }
    if (rotatingFace == FACES.BACK) {
      return this.z == -1;
    }
    if (rotatingFace == FACES.LEFT) {
      return this.x == -1;
    }
    if (rotatingFace == FACES.BOTTOM) {
      return this.y == 1;
    }
    return false;
  }
}
