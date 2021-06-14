let layer, others = null, state = "play", gameStarted = false, noOfLines = 20, startSize = 50;
let database, myID, gameLoading = false, spawnBorder = 0, warningImg, lasteatableSpawned = 10;
let eatables = null, ringRad = null, eatablesInRad = 0, minEatablesInRad = null;
let loadingState = 0, loadingSwitch = true;

function setup() {
  createCanvas(0, 0);
  database = firebase.database();
  warningImg = loadImage('warning.png');
}

function playGam() {
  createCanvas(window.innerWidth, window.innerHeight);
  layer = new player(width / 2, height / 2, startSize);
  DatabaseFuncs.updateOtherPlayers();
  DatabaseFuncs.setSpawnBorder();
  DatabaseFuncs.loadEatables();
  DatabaseFuncs.loadMinEatablesInRad();
  gameLoading = true;
}

function draw() {
  background(100);
  stroke(220);

  for (let y = -spawnBorder / 20; y < spawnBorder / 20; y++) {
    line(-spawnBorder / 2, (y * 20), -spawnBorder / 2, -spawnBorder / 2 + (y * 20));
  }
  eatablesInRad = 0;
  if (gameLoading && others != null && spawnBorder != 0 && eatables != null && minEatablesInRad != null) {
    let i = 0;
    while (i < others.length + 1) {
      if (i == others.length) {
        myID = i;
        break;
      }
      if (others[i][3]) {
        myID = i;
        others[i][3] = false;
        break;
      }
      i++;
    }
    ringRad = dist(0, 0, width / 2, height / 2);
    layer.position = {
      x: sin(random(0, 10000)) * random(0, spawnBorder / 2),
      y: cos(random(0, 10000)) * random(0, spawnBorder / 2)
    };
    DatabaseFuncs.updateMyPlayer();
    gameLoading = false;
    gameStarted = true;
    draw();
  }

  if (!gameStarted || others == null || spawnBorder == 0 || eatables == null || minEatablesInRad == null) {
    showLoadingScreen();
    return;
  }
  scale(1 - layer.diameter / 1000);

  push();
  translate(-layer.position.x + width / 2, -layer.position.y + height / 2);
  fill(100);
  stroke('red');
  ellipse(0, 0, spawnBorder, spawnBorder);
  pop();

  fill('white');
  textSize(20);
  text('Press escape to exit', 100, 30);

  layer.isInBorder(spawnBorder / 2, 'image', warningImg)
  layer.isInBorder(spawnBorder / 2 + 200, 'end');

  translate(-layer.position.x + width / 2, -layer.position.y + height / 2);

  checkPlayers();
  stroke(0);
  layer.display();
  checkEatables();

  if (others[myID] && others[myID][3]) {
    gameEnded();
  }

  DatabaseFuncs.setInOthers();
  DatabaseFuncs.updateMyPlayer();
  spawnEatables();
  DatabaseFuncs.updateEatables();
  DatabaseFuncs.loadEatables();
  DatabaseFuncs.updateOtherPlayers();
  layer.checkMovementKeys();
}

function showLoadingScreen() {
  textSize(40);
  textAlign(CENTER);
  textFont('Century Gothic');
  fill(255)
  text('Loading', width / 2, height / 3);
  if (loadingSwitch) {
    fill('green');
    ellipse(width / 3 + loadingState, height * 2 / 3, 70, 70);
    fill('grey');
    ellipse(width * 2 / 3, height * 2 / 3, 50, 50);
    loadingState += 5;
    if ((width * 2 / 3) - (width / 3 + loadingState) < 50) {
      loadingSwitch = false;
    }
  }
  else {
    fill('green');
    ellipse(width / 3 + loadingState, height * 2 / 3, 70, 70);
    loadingState -= 5;
    if (loadingState < 1) {
      loadingSwitch = true;
    }
  }
}

function keyPressed() {
  if (keyCode == 27) {
    DatabaseFuncs.removeMyPlayer();
    gameStarted = false;
    gameEnded();
  }
}

function checkEatables() {
  fill('cyan');
  stroke('black');
  eatables.forEach((val, ind) => {
    ellipse(val[0], val[1], val[2]);
    if (dist(val[0], val[1], layer.position.x, layer.position.y) < ringRad) {
      eatablesInRad++;
      if (dist(val[0], val[1], layer.position.x, layer.position.y) < val[2] / 2 + layer.diameter / 2) {
        layer.diameter += val[2] / 10;
        layer.speed *= 1 - val[2] / 10000;
        eatables.splice(ind, 1);
      }
    }
  });
}

function checkPlayers() {
  fill(255);
  for (let ind = 0; ind < others.length; ind++) {
    let val = others[ind];

    if (ind == myID || val[3] == true)
      continue;

    ellipse(val[1][0], val[1][1], val[2], val[2]);
    if (dist(layer.position.x, layer.position.y, val[1][0], val[1][1]) <= (val[2] + layer.diameter) / 2) {
      if (val[2] > layer.diameter) {
        layer.gotEaten();
      }
      else if (val[2] != layer.diameter) {
        layer.diameter += val[2] / 10;
        layer.speed *= 1 - val[2] / 10000;
        val[3] = true;
      }
    }
    stroke('white');
    text(val[0], val[1][0], val[1][1] + val[2]);
  }
}

function spawnEatables() {
  if (eatablesInRad < minEatablesInRad && round(random(0, 1)) == 0) {
    eatables.push([
      layer.diameter + sin(random(0, 360)) * random(layer.diameter, layer.diameter + ringRad),
      layer.diameter + cos(random(0, 360)) * random(layer.diameter, layer.diameter + ringRad),
      round(random(10, 30))
    ]);
  }
}