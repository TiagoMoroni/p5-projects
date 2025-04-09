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
      [FACES.UP]: topColor,
      [FACES.DOWN]: bottomColor,
    };
  }

  draw() {
    push();
    console.log(cubes)
    const actions = {
      [FACES.UP]: rotateY,
      [FACES.DOWN]: rotateY,
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
        faceSide: FACES.UP,
        color: this.faces[FACES.UP],
        vertices: [
          [-1, -1, -1],
          [1, -1, -1],
          [1, -1, 1],
          [-1, -1, 1],
        ],
      },
      {
        faceSide: FACES.DOWN,
        color: this.faces[FACES.DOWN],
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
      for (const [x, y, z] of face.vertices) {
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
            (face.faceSide == FACES.UP || rotatingFace == FACES.UP)) ||
          (this.y === 1 &&
            (face.faceSide == FACES.DOWN || rotatingFace == FACES.DOWN)) ||
          rotatingFace == face.faceSide
        ) {
          vertex((x * cubeSize) / 2, (y * cubeSize) / 2, (z * cubeSize) / 2);
        }
      }
      endShape(CLOSE);
    }

    pop();
  }

  spin(rotatingFace) {
    if (rotatingFace == FACES.UP || rotatingFace == FACES.DOWN) {
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
      this.faces[FACES.FRONT] = this.faces[FACES.DOWN];
      this.faces[FACES.DOWN] = this.faces[FACES.BACK];
      this.faces[FACES.BACK] = this.faces[FACES.UP];
      this.faces[FACES.UP] = temp;
    } else if (rotatingFace == FACES.FRONT || rotatingFace == FACES.BACK) {
      const angle = rotationDirection == ROTATION_DIRECTIONS.CLOCKWISE ? -1 : 1;
      const newX = Math.round(this.y * angle);
      const newY = Math.round(-this.x * angle);
      this.x = newX;
      this.y = newY;

      const temp = this.faces[FACES.UP];
      this.faces[FACES.UP] = this.faces[FACES.LEFT];
      this.faces[FACES.LEFT] = this.faces[FACES.DOWN];
      this.faces[FACES.DOWN] = this.faces[FACES.RIGHT];
      this.faces[FACES.RIGHT] = temp;
    }
  }

  shouldRotate() {
    const faceConditions = {
      [FACES.UP]: this.y == -1,
      [FACES.RIGHT]: this.x == 1,
      [FACES.FRONT]: this.z == 1,
      [FACES.BACK]: this.z == -1,
      [FACES.LEFT]: this.x == -1,
      [FACES.DOWN]: this.y == 1,
    };

    return faceConditions[rotatingFace];
  }
}
