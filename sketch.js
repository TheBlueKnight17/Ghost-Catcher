let ghost;
let ghostImg;
let bgImg;
let popSound;
let startSound;

let score = 0;
let level = 1;
let duration = 30;
let startTime;
let state = 'start';

async function setup() {
  createCanvas(480, 360);
  textFont('Times New Roman');
  imageMode(CENTER);
  
  popSound = new Audio('pop.mp3');
  startSound = new Audio('start.mp3');

  ghostImg = await loadImage('resized-60x60.png');
  bgImg = await loadImage('resized-480x360.png');
  
  spawnGhost();
}

function draw() {
  background(15, 10, 25);
  
  if (bgImg && bgImg.width > 0) {
    image(bgImg, width/2, height/2, width, height);
  }

  if (state === 'start') {
    textAlign(CENTER, CENTER);
    fill(173, 216, 230);
    textSize(28);
    text('Click to start', width / 2, height / 2);
    return;
  }

  if (state === 'over') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(22);
    text('Game over\nScore: ' + score + '\nClick to retry', width / 2, height / 2);
    return;
  }

  if (score >= 20 && level === 2) {
    level = 3;
    duration = 20;
  } else if (score >= 10 && level === 1) {
    level = 2;
    duration = 25;
  }

  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, duration - elapsed);
  if (timeLeft <= 0) {
    state = 'over';
    return;
  }

  let jumpRate = 60 - (level - 1) * 15;
  if (frameCount % jumpRate === 0) {
    spawnGhost();
  }

  let ghostSize = 60 - (level - 1) * 10;
  if (ghostImg && ghostImg.width > 0) {
    image(ghostImg, ghost.x, ghost.y, ghostSize, ghostSize);
  }

  textAlign(LEFT, TOP);
  fill(255);
  textSize(16);
  text('Level: ' + level + '  Score: ' + score, 12, 10);
  textAlign(RIGHT, TOP);
  text('Time: ' + ceil(timeLeft), width - 12, 10);
}

function mousePressed() {
  if (state === 'start' || state === 'over') {
    if (startSound) {
      startSound.currentTime = 0;
      startSound.play().catch(e => {});
    }
    state = 'play';
    score = 0;
    level = 1;
    duration = 30;
    startTime = millis();
    spawnGhost();
    return;
  }

  let ghostSize = 60 - (level - 1) * 10;
  if (dist(mouseX, mouseY, ghost.x, ghost.y) < ghostSize / 2) {
    score++;
    if (popSound) {
      popSound.currentTime = 0;
      popSound.play().catch(e => {});
    }
    spawnGhost();
  }
}

function spawnGhost() {
  ghost = { x: random(40, width - 40), y: random(40, height - 40) };
}