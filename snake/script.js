const gridSize = 20;
const gridLength = 30;
const mapSize = gridSize * gridLength;
let points = 0;

let posX = Math.floor((mapSize / gridSize) / 2);
let posY = Math.floor((mapSize / gridSize) / 2);
let sectionArray = [
    { posX, posY, prevX: posX, prevY: posY },
];

let movementTimer = 0;
let appleSpawnTimer = 0;
const startMovementSpeed = 100;
let movementSpeed = 100;
let appleSpawnSpeed = 100;

let applePosArray = [];
const maxAppleAmount = 3;

function setup() {
    createCanvas(mapSize, mapSize);
}

function draw() {
    background(180);
    text(points, 10, 10)
    applePosArray.forEach(apple => {
        fill(255, 0, 0)
        rect(apple[0] * gridSize, apple[1] * gridSize, gridSize, gridSize, gridSize / 2)
    });
    fill(255)
    if (millis() >= movementSpeed + movementTimer) {
        updateDirection();
        movementTimer = millis();
    }
    drawSections();
    if (millis() >= appleSpawnSpeed + appleSpawnTimer && applePosArray.length < maxAppleAmount) {
        spawnApple();
        appleSpawnTimer = millis();
    }
}

function drawSections() {
    sectionArray.forEach(section => {
        rect(section.posX * gridSize, section.posY * gridSize, gridSize, gridSize);
    })
}

function spawnApple() {
    applePosArray.push([Math.floor(Math.random() * ((gridLength - 1) - 0 + 1) + 0), Math.floor(Math.random() * ((gridLength - 1) - 0 + 1) + 0)])
}

function updateDirection() {
    const keyValue = { 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right' }
    const direction = keyValue[key]

    sectionArray[0].prevX = sectionArray[0].posX;
    sectionArray[0].prevY = sectionArray[0].posY;
    if (direction == "up") {
        sectionArray[0].posY -= 1;
    } else if (direction == "down") {
        sectionArray[0].posY += 1;
    } else if (direction == "left") {
        sectionArray[0].posX -= 1;
    } else if (direction == "right") {
        sectionArray[0].posX += 1;
    }
    if(sectionArray[0].posX == 30 || sectionArray[0].posX == -1 || sectionArray[0].posY == 30 || sectionArray[0].posY == -1 || sectionArray.some((section, i) => i > 0 ? section.posX == sectionArray[0].posX && section.posY == sectionArray[0].posY : false)){
        startOver();
    }
    sectionArray.forEach((section, i) => {
        if (i > 0) {
            section.prevX = section.posX;
            section.prevY = section.posY;
            section.posX = sectionArray[i - 1].prevX;
            section.posY = sectionArray[i - 1].prevY;
        }
    });

    applePosArray.forEach((apple, i) => {
        if (apple[0] == sectionArray[0].posX && apple[1] == sectionArray[0].posY) {
            points++;
            movementSpeed /= 1.05;
            applePosArray.splice(i, 1);
            const lastSection = sectionArray[sectionArray.length - 1];
            const lastSectionX = lastSection.posX;
            const lastSectionY = lastSection.posY;
            sectionArray.push({ posX: lastSectionX, posY: lastSectionY, prevX: lastSectionX, prevY: lastSectionY });
        };
    })
}

function startOver(){
    sectionArray = [
        { posX, posY, prevX: posX, prevY: posY },
    ];
    movementSpeed = startMovementSpeed;
    applePosArray = [];
    points = 0;
    key = null;
}
