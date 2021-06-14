class player {
    constructor(posX, posY, diameter) {
        this.position = { x: posX, y: posY };
        this.speed = diameter / 10;
        this.diameter = diameter;
        this.nowDiameter = diameter;
    }

    display() {
        this.nowDiameter = lerp(this.nowDiameter, this.diameter, .5);
        fill("lime");
        ellipse(this.position.x, this.position.y, this.nowDiameter, this.nowDiameter);
    }

    isInBorder(borderRad, runFunc, funcArg) {
        if (dist(0, 0, this.position.x, this.position.y) > borderRad) {
            if (runFunc == 'image') {
                image(funcArg, width - 90, 10, 80, 60);
            }
            else if (runFunc == 'end') {
                this.gotEaten();
            }
        }
    }


    gotEaten() {
        gameStarted = false;
        gameEnded();
    }


    checkMovementKeys() {
        if (keyIsDown(65)) {
            layer.position.x -= layer.speed;
        }
        if (keyIsDown(83)) {
            layer.position.y += layer.speed;
        }
        if (keyIsDown(68)) {
            layer.position.x += layer.speed;
        }
        if (keyIsDown(87)) {
            layer.position.y -= layer.speed;
        }
    }

}