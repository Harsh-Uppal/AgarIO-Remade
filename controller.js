let docSave = '', playerName;

function playGame() {
    playerName = document.getElementById('playerName').value;
    clearDocAndStoreToDocSave();
    playGam();
}

function HTP(){
    window.location = "./howToPlay.html";
}

function gameEnded() {
    document.body.innerHTML =
        '<div class="GameOverText">Game Over</div>' +
        '<div class="highscore">Your score : ' + layer.diameter + '</div>' +
        '<button class="menuBtn" onclick="menuBtnPressed()">Go to Menu</button>';

    document.body.setAttribute('bgcolor', 'gray');
}

function loadScript(path) {
    document.body.innerHTML += "<script src=\"" + path + "\"></script>";
}

function clearDocAndStoreToDocSave() {
    docSave = document.body.innerHTML;
    document.body.innerHTML = '';
}

function menuBtnPressed() {
    document.body.innerHTML = docSave;
    document.body.setAttribute('bgcolor', '#383838');
}

function openCredits(){
    window.location = ('./credits.html');
}