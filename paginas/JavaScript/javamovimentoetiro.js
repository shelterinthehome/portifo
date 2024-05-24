var myGamePiece;
var myBullets = [];
var naveImage = new Image();
naveImage.src = './imagens/Nave.png';
var lastFireTime = 0;
var fireCooldown = 150; 

function startGame() {
    myGamePiece = new component(50, 50, naveImage, 375, 275);
    myGameArea.start();
    console.log("Game started"); 
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false;
        });
        console.log("Game area started"); 
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, image, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.image = image;
    this.update = function() {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if (myGameArea.keys && myGameArea.keys[65]) {this.x -= 2; console.log("Moving left");} 
        if (myGameArea.keys && myGameArea.keys[68]) {this.x += 2; console.log("Moving right");} 
        if (myGameArea.keys && myGameArea.keys[38]) {fireBullet(); console.log("Firing bullet");} 
        this.x = Math.max(0, Math.min(this.x, myGameArea.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, myGameArea.canvas.height - this.height));
    }
}

function bullet(x, y) {
    this.x = x;
    this.y = y;
    this.length = 30;
    this.speed = 5;
    this.update = function() {
        var ctx = myGameArea.context;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.length);
        ctx.stroke();
    }
    this.newPos = function() {
        this.y -= this.speed;
    }
}

function fireBullet() {
    var now = new Date().getTime();
    if (now - lastFireTime > fireCooldown) {
        lastFireTime = now;
        var x = myGamePiece.x + myGamePiece.width / 2;
        var y = myGamePiece.y;
        var newBullet = new bullet(x, y);
        myBullets.push(newBullet);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
    
    for (var i = 0; i < myBullets.length; i++) {
        myBullets[i].newPos();
        myBullets[i].update();
        
 
        if (myBullets[i].y < -myBullets[i].length) {
            myBullets.splice(i, 1);
            i--;
        }
    }

    // Adicionar o texto "1 + 9 = 10 / 5 = 2 Resto Zero" no canvas
    var ctx = myGameArea.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("1 + 9 = 10 / 5 = 2 Resto Zero", 500, 590);
}