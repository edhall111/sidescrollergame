/**
 * Created by Ed on 10/12/2016.
 * Created by Ed Hall on 9/14/2016.
*/
//Sprites for the player, the banana, and 3 swat team "enemies"
var sprite = new Image();
var missile = new Image();
//sets the HTML element with the id "game-area" to the canvas, and then sets it's graphics context
var canvas = document.getElementById('game-area');
var graphicsContext = canvas.getContext('2d');
//variable that will hold the image of the background
var background = new Image();
var enemySprite = new Image();
var laser = new Image();
var playerAlive = true;
var jetY=225;
var deltaY = 0;
var newEnemy;
var newShot;
var newPlayerShot;
var enemies = [];
var score = 0;
var shotList = [];
/**
 * loadImages will load all of our images, setting them with the sprites that they will represent
 * SOURCE: SimpleMove.js, as given to us in class
 * */
var backgroundDx = 0;
function loadImages() {
    background.src = 'images/landscape.png';
    sprite.src = 'images/jet.png';
    enemySprite.src = 'images/ship.png';
    missile.src = 'images/missile.png';
    laser.src = 'images/laser.png';
}
function updateBackgroundOffset(currentTime){
    backgroundDx = backgroundDx +2;
    if(backgroundDx >= background.width || backgroundDx <0)
        backgroundDx = 0;
}
/**
 * drawBackground will draw the image that I have selected for the background over the canvas
 * SOURCE: SimpleMove.js, as given to us in class
 * */
function drawBackground(currentTime) {
    graphicsContext.translate(-backgroundDx, 0);

    graphicsContext.drawImage(background, 0, 0);
    graphicsContext.drawImage(background, background.width, 0);
    graphicsContext.translate(backgroundDx, 0);
}

function Enemy(size, x, y){
    this.enemySize = size;
    this.enemyX = x;
    this.enemyY = y;
}

function Shot(type, x, y){
    this.shotType = type;
    this.shotX = x;
    this.shotY = y;
}
var timeForEnemy = true;
/**
 * drawSprite is the bulkiest method, as it will handle the drawing of all sprites within the game(harambe[the player], banana, and the three SWAT enemies)
 * Along with this, it will handle the collision detection of the sprites, deciding whether a user has scored a point or lost the game.
 * */
function drawPlayer(currentTime){
    if(playerAlive == false){
        document.getElementById("score").innerHTML = "YOU HAVE FAILED...FINAL SCORE: "+score;
    }
    else{
        graphicsContext.drawImage(sprite, 20, jetY);
        if(enemies.length < 6) {
            newEnemy = new Enemy('small', 977, Math.floor(Math.random() * 506) + 1);
            enemies.push(newEnemy);
        }
        if(enemies.length > 6){
            enemies.length = 6;
        }
        for (i = 0; i < enemies.length; i++) {
            graphicsContext.drawImage(enemySprite, enemies[i].enemyX, enemies[i].enemyY);
        }

        for(j = 0; j < enemies.length; j++) {
            if(enemies[j].enemyX < 0){
                enemies.splice(j, 1);
            }
            if(enemies[j].enemySize == 'small'){
                if(enemies[j].enemyX == 977 || enemies[j].enemyX == 977*0.8 ||
                    enemies[j].enemyX == 977 * 0.6 || enemies[j].enemyX == 977 * 0.4 || enemies[j].enemyX == 977 * 0.2){
                    //shoot once
                    newShot = new Shot('enemy', enemies[j].enemyX, enemies[j].enemyY+22);
                    shotList.push(newShot);
                }
            }
            var rectEnemy = {x: enemies[j].enemyX, y: enemies[j].enemyY, width: 50, height: 44};
            for(l = 0; l < shotList.length; l++){
                var rectShot = {x: shotList[l].shotX, y: shotList[l].shotY, width: 40, height: 20};
                if(rectEnemy.x < rectShot.x + rectShot.width &&
                    rectEnemy.x + rectEnemy.width > rectShot.x &&
                    rectEnemy.y < rectShot.y + rectShot.height &&
                    rectEnemy.height + rectEnemy.y > rectShot.y){
                    if(shotList[l].shotType == 'player'){
                        score++;
                        enemies.splice(j, 1);
                        shotList.splice(l, 1);
                    }


                }
            }
            /*else if (enemies[j].enemySize == 'large'){
                if(enemies[j].enemyX == 977 || enemies[j].enemyX == 977*0.9 ||
                    enemies[j].enemyX == 977 * 0.8 || enemies[j].enemyX == 977 * 0.7 || enemies[j].enemyX == 977 * 0.6 ||
                    enemies[j].enemyX == 977 * 0.5 || enemies[j].enemyX == 977* 0.4 ||
                    enemies[j].enemyX == 977 * 0.3 || enemies[j].enemyX == 977 * 0.2 || enemies[j].enemyX == 977 * 0.1){
                    //shoot once
                }
            }*/

        }
        //draw shots
        for(k = 0; k <shotList.length; k++){
            if(shotList[k].shotType == 'player'){
                graphicsContext.drawImage(missile, shotList[k].shotX, shotList[k].shotY);
            }
            else if(shotList[k].shotType ==  'enemy'){
                graphicsContext.drawImage(laser, shotList[k].shotX, shotList[k].shotY);
            }
        }
    }

}

var bigEnemyTicker = 0;

/**
 * naiveGameLoop will loop while the game is running, altering the coordinates of sprites as they move around the screen.
 * */
function spriteMove(currentTime){
    jetY = jetY + deltaY;
    for (i = 0; i < enemies.length; i++){
        enemies[i].enemyX = enemies[i].enemyX - 2;
    }

    for (j = 0; j < shotList.length; j++){
        if(shotList[j].shotType == 'player'){
            shotList[j].shotX = shotList[j].shotX + 3;
        }
        else{
            shotList[j].shotX = shotList[j].shotX - 3;
        }
    }
}
/**
 * handleKeyUp will set our deltaY and deltaX to 0 whenever the arrow keys are released.
 * SOURCE: SimpleMove.js, as given to us in class
 * */
function handleKeyUp(keyboardEvent){
    switch (keyboardEvent.key)
    {
        case 'ArrowDown':
            deltaY = 0;
            break;
        case 'ArrowUp':
            deltaY = 0;
            break;
    }
}
/***
 * handleKeyDown will change our deltaX or deltaY in accordance to the arrow key pressed down. The end result will be the user moving the sprite.
 * SOURCE: SimpleMove.js, as given to us in class
 */
function handleKeyDown(keyboardEvent){
    var shotCheck = 0;
    switch (keyboardEvent.key)
    {
        case 'ArrowDown':
            deltaY = 10;
            break;
        case 'ArrowUp':
            console.log("up");
            deltaY = -10;
            break;
        case 'ArrowRight':
            if(shotCheck == 0){
                newPlayerShot = new Shot('player', 20, jetY+18);
                shotList.push(newPlayerShot);
                shotCheck = 1;
            }
            break;
    }
}
/**
 * drawComponents() will draw our background on the canvas as well as our sprites
 *SOURCE: SimpleMove.js, as given to us in class
 * */
function drawComponents(currentTime) {
    updateBackgroundOffset(currentTime);
    drawBackground(currentTime);
    drawPlayer(currentTime);
    spriteMove(currentTime);
    //drawEnemies(currentTime);
    requestAnimationFrame(drawComponents);
}
/**
 * startGame() will call our functions, and then start a gameLoop that will keep running, redrawing the screen and updating values
 * SOURCE: SimpleMove.js, as given to us in class
 * */
function runGame(){

    requestAnimationFrame(drawComponents);
}
function startGame(){
    loadImages();
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    runGame();
} startGame();