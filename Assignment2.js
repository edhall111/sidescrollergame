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
var enemyBigSprite = new Image();
var alien = new Image();
var laser = new Image();
var playerAlive = true;
var jetY=225;
var deltaY = 0;
var newEnemy;
var newShot;
var bigEnemySpawn = false;
var newPlayerShot;
var enemies = [];
var aliens = [];
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
    enemyBigSprite.src = 'images/bigship.png';
    alien.src = 'images/alien.png';
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

function Enemy(size, x, y, health){
    this.enemySize = size;
    this.enemyX = x;
    this.enemyY = y;
    this.enemyHealth = health;
}
function Alien(x, y){
    this.alienX = x;
    this.alienY = y;
}
function Shot(type, x, y){
    this.shotType = type;
    this.shotX = x;
    this.shotY = y;
}
/**
 * drawSprite is the bulkiest method, as it will handle the drawing of all sprites within the game(harambe[the player], banana, and the three SWAT enemies)
 * Along with this, it will handle the collision detection of the sprites, deciding whether a user has scored a point or lost the game.
 * */
function drawPlayer(currentTime){
    var newAlien;
    if((Math.floor(Math.random() * 150) + 1) == 5){
        bigEnemySpawn = true;
    }
    //checks to see if player is alive
    if(playerAlive == false){
        document.getElementById("score").innerHTML = "YOU HAVE FAILED TO SAVE EARTH...FINAL SCORE: "+score;
    }
    //if player is alive
    else{
        //draw player, jet sprite
        graphicsContext.drawImage(sprite, 20, jetY);
        var rectJet = {x: 20, y: jetY, width: 50, height: 36};
        //for every shot in the shot list
        for(z = 0; z < shotList.length; z++){
            //puts a rectangle behind it
            var rectBadShot = {x: shotList[z].shotX, y: shotList[z].shotY, width: 40, height: 10};
            //if there is a collision
            if(rectJet.x < rectBadShot.x + rectBadShot.width &&
                rectJet.x + rectJet.width > rectBadShot.x &&
                rectJet.y < rectBadShot.y + rectBadShot.height &&
                rectJet.height + rectJet.y > rectBadShot.y){
                //if the shot came from an enemy
                if(shotList[z].shotType == 'enemy'){
                    playerAlive = false;
                    shotList.splice(l, 1);
                }
            }
        }
        for(a = 0; a<aliens.length; a++){
            var rectAlien = {x: aliens[a].alienX, y: aliens[a].alienY, width: 30, height: 50};
            if(rectJet.x < rectAlien.x + rectAlien.width &&
                rectJet.x + rectJet.width > rectAlien.x &&
                rectJet.y < rectAlien.y + rectAlien.height &&
                rectJet.height + rectJet.y > rectAlien.y){
                aliens.splice(a, 1);
                score = score + 10;
                document.getElementById("score").innerHTML = "Score: " + score;
            }
        }
        //only six enemies at one time, if less then will spawn more
        if(enemies.length < 6) {
            //
            if(bigEnemySpawn == true) {
                newEnemy = new Enemy('big', 977, Math.floor(Math.random() * 506) + 1, 2);
                enemies.push(newEnemy);
                bigEnemySpawn = false;
            }
            else {
                newEnemy = new Enemy('small', 977, Math.floor(Math.random() * 506) + 1, 1);
                enemies.push(newEnemy);
            }
        }
        if(enemies.length > 6){
            enemies.length = 6;
        }
        for (i = 0; i < enemies.length; i++) {
            if (enemies[i].enemySize == 'big') {
                graphicsContext.drawImage(enemyBigSprite, enemies[i].enemyX, enemies[i].enemyY);
            }
            else {
                graphicsContext.drawImage(enemySprite, enemies[i].enemyX, enemies[i].enemyY);
            }
        }

        for(j = 0; j < enemies.length; j++) {
            if(enemies[j].enemyX < 0){
                enemies.splice(j, 1);
            }
            if(enemies[j].enemyX == 977){
                newShot = new Shot('enemy', enemies[j].enemyX, enemies[j].enemyY+22);
                shotList.push(newShot);
            }
            if(enemies[j].enemyX == 500){
                newShot = new Shot('enemy', enemies[j].enemyX, enemies[j].enemyY+22);
                shotList.push(newShot);

            }
            //creates rectangle behind small enemy for collision detection
            if(enemies[j].enemySize == 'small') {
                var rectEnemy = {x: enemies[j].enemyX, y: enemies[j].enemyY, width: 50, height: 44};
                for (l = 0; l < shotList.length; l++) {
                    var rectShot = {x: shotList[l].shotX, y: shotList[l].shotY, width: 40, height: 20};
                    if (rectEnemy.x < rectShot.x + rectShot.width &&
                        rectEnemy.x + rectEnemy.width > rectShot.x &&
                        rectEnemy.y < rectShot.y + rectShot.height &&
                        rectEnemy.height + rectEnemy.y > rectShot.y) {
                        if (shotList[l].shotType == 'player') {
                            enemies[j].enemyHealth = enemies[j].enemyHealth - 1;
                            if(enemies[j].enemyHealth == 0) {
                                score = score+1;

                                //when enemy is destroyed, chance for alien to spawn
                                if((Math.floor(Math.random() * 10)+ 1) == 8){
                                    newAlien = new Alien(enemies[j].enemyX, enemies[j].enemyY);
                                    aliens.push(newAlien);
                                }
                                enemies.splice(j, 1);
                            }
                            shotList.splice(l, 1);
                            document.getElementById("score").innerHTML = "Score: " + score;
                        }
                    }
                    //if the player collides with an enemy, then the player dies
                    else if (rectEnemy.x < rectJet.x + rectJet.width &&
                        rectEnemy.x + rectEnemy.width > rectJet.x &&
                        rectEnemy.y < rectJet.y + rectJet.height &&
                        rectEnemy.height + rectEnemy.y > rectJet.y) {
                        //change playerAlive to false
                        playerAlive = false;
                    }
                }
            }
            else{
                var rectBigEnemy = {x: enemies[j].enemyX, y: enemies[j].enemyY, width: 100, height: 59};
                for (l = 0; l < shotList.length; l++) {
                    var rectShot = {x: shotList[l].shotX, y: shotList[l].shotY, width: 40, height: 20};
                    if (rectBigEnemy.x < rectShot.x + rectShot.width &&
                        rectBigEnemy.x + rectBigEnemy.width > rectShot.x &&
                        rectBigEnemy.y < rectShot.y + rectShot.height &&
                        rectBigEnemy.height + rectBigEnemy.y > rectShot.y) {
                        if (shotList[l].shotType == 'player') {
                            enemies[j].enemyHealth = enemies[j].enemyHealth - 1;
                            if(enemies[j].enemyHealth == 0) {
                                score = score + 2;
                                //when enemy is destroyed, chance for alien to spawn
                                if((Math.floor(Math.random() * 5)+ 1) == 4){
                                    newAlien = new Alien(enemies[j].enemyX, enemies[j].enemyY);
                                    aliens.push(newAlien);
                                }
                                enemies.splice(j, 1);
                            }
                            shotList.splice(l, 1);
                            document.getElementById("score").innerHTML = "Score: " + score;
                        }
                    }
                    //if the player collides with an enemy, then the player dies
                    else if (rectBigEnemy.x < rectJet.x + rectJet.width &&
                        rectBigEnemy.x + rectBigEnemy.width > rectJet.x &&
                        rectBigEnemy.y < rectJet.y + rectJet.height &&
                        rectBigEnemy.height + rectBigEnemy.y > rectJet.y) {
                        //change playerAlive to false
                        playerAlive = false;
                    }
                }
            }
        }
        //draw aliens
        for(m = 0; m < aliens.length; m++){
            graphicsContext.drawImage(alien, aliens[m].alienX, aliens[m].alienY);
        }


        //draw shots
        for(k = 0; k <shotList.length; k++){
            if(shotList[k].shotType == 'player'){
                graphicsContext.drawImage(missile, shotList[k].shotX, shotList[k].shotY);
            }
            else if(shotList[k].shotType == 'enemy'){
                graphicsContext.drawImage(laser, shotList[k].shotX, shotList[k].shotY);
            }
        }
    }

}
/**
 * naiveGameLoop will loop while the game is running, altering the coordinates of sprites as they move around the screen.
 * */
function spriteMove(currentTime){
    jetY = jetY + deltaY;
    for (i = 0; i < enemies.length; i++){
        enemies[i].enemyX = enemies[i].enemyX - 2;
    }
    for(k = 0; k < aliens.length; k++){
        aliens[k].alienX = aliens[k].alienX - 2;
    }
    for (j = 0; j < shotList.length; j++){
        if(shotList[j].shotType == 'player'){
            shotList[j].shotX = shotList[j].shotX + 5;
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