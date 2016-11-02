/**
 * Created by Ed Hall on 10/12/2016.
*/
//sets the HTML element with the id "game-area" to the canvas, and then sets it's graphics context
var canvas = document.getElementById('game-area');
var graphicsContext = canvas.getContext('2d');
//variable that will hold the image of the background and all sprites
var background = new Image();
var enemySprite = new Image();
var enemyBigSprite = new Image();
var sprite = new Image();
var missile = new Image();
var alien = new Image();
var laser = new Image();
//player alive bool
var playerAlive = true;
//initial position of jet is middle of screen
var jetY=225;
//movement var
var deltaY = 0;
//big enemy bool
var bigEnemySpawn = false;
//var for scrolling background
var backgroundDx = 0;
//arrays for enemies, aliens, shots
var enemies = [];
var aliens = [];
var shotList = [];
//score var
var score = 0;
/**
 * loadImages will load all of our images, setting them with the sprites that they will represent
 * SOURCE: SimpleMove.js, as given to us in class
 * */
function loadImages() {
    background.src = 'images/landscape.png';
    sprite.src = 'images/jet.png';
    enemySprite.src = 'images/ship.png';
    missile.src = 'images/missile.png';
    laser.src = 'images/laser.png';
    enemyBigSprite.src = 'images/bigship.png';
    alien.src = 'images/alien.png';
}
/**
 * updateBackgroundOffset will update our backgroundDx variable accordingly to produce a scrolling background.
 * SOURCE: as given to us in class
 * */
function updateBackgroundOffset(currentTime){
    //increases backgroundDx by 2 each time
    backgroundDx = backgroundDx +2;
    //if it becomes greater than the width or less than zero, set back to 0
    if(backgroundDx >= background.width || backgroundDx <0)
        backgroundDx = 0;
}
/**
 * drawBackground will draw the image that I have selected for the background over the canvas. It will also draw it again, and translate
 * the coordinates to produce the scrolling background effect.
 * SOURCE: as given to us in class
 * */
function drawBackground(currentTime) {
    graphicsContext.translate(-backgroundDx, 0);
    //draw first background
    graphicsContext.drawImage(background, 0, 0);
    //draw second background next to it
    graphicsContext.drawImage(background, background.width, 0);
    graphicsContext.translate(backgroundDx, 0);
}
/**
 * Enemy will create a new enemy object with the given parameters as attributes.
 * size - size of enemy, either big or small
 * x - enemy's x coordinate
 * y - enemy's y coordinate
 * health - health of enemies, big have 2 and small have 1
 * */
function Enemy(size, x, y, health){
    //contructor type function
    //sets all parameters equal to this.attribute
    this.enemySize = size;
    this.enemyX = x;
    this.enemyY = y;
    this.enemyHealth = health;
}
/**
 * Alien will create a new alien object with the given parameters as attributes
 * x - alien's x coordinate
 * y - alien's y coordinate
 * */
function Alien(x, y){
    //contructor type function
    //sets all parameters equal to this.attribute
    this.alienX = x;
    this.alienY = y;
}
/**
 * Shot will create a new shot object with the given parameters as attributes
 * type - type of shot, either player or enemy
 * x - shot's x coordinate
 * y - shot's y coordinate
 * */
function Shot(type, x, y){
    //contructor type function
    //sets all parameters equal to this.attribute
    this.shotType = type;
    this.shotX = x;
    this.shotY = y;
}
/**
 * drawPlayers is the bulkiest method, as it will handle the drawing of all sprites within the
 * game(player jet, shots, enemies and aliens). Along with this, it will handle the collision detection of the sprites,
 * deciding whether a user has scored a point or lost the game.
 * */
function drawPlayers(currentTime){
    //sound vars
    var deathSound = new Audio('sounds/death.wav');
    var enemyHit = new Audio('sounds/hit.wav');
    var enemyDead = new Audio('sounds/enemydeath.wav');
    //new object vars
    var newEnemy;
    var newShot;
    var newAlien;
    //randomization statement for the spawning of big enemies
    if((Math.floor(Math.random() * 150) + 1) == 5){
        //if the random value equals 5, then spawn big enemy becomes true
        bigEnemySpawn = true;
    }
    //checks to see if player is alive
    if(playerAlive == false){
        //if the case is false, print death message and final score
        document.getElementById("score").innerHTML = "YOU HAVE FAILED TO SAVE EARTH...FINAL SCORE: "+score;
    }
    //if player is alive
    else{
        //draw player, jet sprite
        graphicsContext.drawImage(sprite, 20, jetY);
        //create a rectangle behind the player for collision detection
        var rectJet = {x: 20, y: jetY, width: 50, height: 36};
        //for every shot in the shot list
        for(z = 0; z < shotList.length; z++){
            //puts a rectangle behind it for collision detection
            var rectBadShot = {x: shotList[z].shotX, y: shotList[z].shotY, width: 40, height: 10};
            //checks if there is a collision between the player and a shot
            if(rectJet.x < rectBadShot.x + rectBadShot.width &&
                rectJet.x + rectJet.width > rectBadShot.x &&
                rectJet.y < rectBadShot.y + rectBadShot.height &&
                rectJet.height + rectJet.y > rectBadShot.y){
                //checks if the shot came from an enemy
                if(shotList[z].shotType == 'enemy'){
                    //change player alive status to false
                    playerAlive = false;
                    //play the player death sound
                    deathSound.play();
                    //remove shot from shotList
                    shotList.splice(l, 1);
                }
            }
        }
        //for every alien object in the alien list
        for(a = 0; a<aliens.length; a++){
            //create a rectangle behind them for collision detection
            var rectAlien = {x: aliens[a].alienX, y: aliens[a].alienY, width: 30, height: 50};
            //if the player collides with the alien(touches it)
            if(rectJet.x < rectAlien.x + rectAlien.width &&
                rectJet.x + rectJet.width > rectAlien.x &&
                rectJet.y < rectAlien.y + rectAlien.height &&
                rectJet.height + rectJet.y > rectAlien.y){
                //remove the alien from the alien list
                aliens.splice(a, 1);
                //increse the player score by 10
                score = score + 10;
                //display new score
                document.getElementById("score").innerHTML = "Score: " + score;
            }
        }
        //only six enemies at one time, if less then will spawn more
        if(enemies.length < 6) {
            //if bigEnemySpawn is true
            if(bigEnemySpawn == true) {
                //create new enemy object with type set to big, at random y position
                newEnemy = new Enemy('big', 977, Math.floor(Math.random() * 506) + 1, 2);
                //push new enemy on enemy array
                enemies.push(newEnemy);
                //set big enemy spawn to false
                bigEnemySpawn = false;
            }
            //if big enemy spawn is false
            else {
                //create new enemy object with type set to small, at random y position
                newEnemy = new Enemy('small', 977, Math.floor(Math.random() * 506) + 1, 1);
                //push new enemy on enemy array
                enemies.push(newEnemy);
            }
        }
        //if statement checks to see if more than six enemies at once
        if(enemies.length > 6){
            //if more set value back, to keep it at only 6
            enemies.length = 6;
        }
        //for loop iterates over every enemy within the enemy array
        for (i = 0; i < enemies.length; i++) {
            //if the enemySize is big
            if (enemies[i].enemySize == 'big') {
                //draw a big enemy(black ship)
                graphicsContext.drawImage(enemyBigSprite, enemies[i].enemyX, enemies[i].enemyY);
            }
            //else enemy must be small
            else {
                //draw a small enemy(red ship)
                graphicsContext.drawImage(enemySprite, enemies[i].enemyX, enemies[i].enemyY);
            }
        }
        //for loop iterates over every enemy within the enemy array
        for(j = 0; j < enemies.length; j++) {
            //if an enemy reachs the left side of the screen
            if(enemies[j].enemyX < 0){
                //remove it from enemy array, makes it disappear
                enemies.splice(j, 1);
            }
            //when the enemy spawns
            if(enemies[j].enemyX == 977){
                //create a new shot of type enemy
                newShot = new Shot('enemy', enemies[j].enemyX, enemies[j].enemyY+22);
                // add that shot to the shot list
                shotList.push(newShot);
            }
            //if the enemy is a small enemy
            if(enemies[j].enemySize == 'small') {
                //creates rectangle behind small enemy for collision detection
                var rectEnemy = {x: enemies[j].enemyX, y: enemies[j].enemyY, width: 50, height: 44};
                //for loop iterates over every shot in the shot list
                for (l = 0; l < shotList.length; l++) {
                    //creates a rectangle behind every shot for collision detection
                    var rectShot = {x: shotList[l].shotX, y: shotList[l].shotY, width: 40, height: 20};
                    //checks for collision between shot and enemy
                    if (rectEnemy.x < rectShot.x + rectShot.width &&
                        rectEnemy.x + rectEnemy.width > rectShot.x &&
                        rectEnemy.y < rectShot.y + rectShot.height &&
                        rectEnemy.height + rectEnemy.y > rectShot.y) {
                        //checks if shot is of type player
                        if (shotList[l].shotType == 'player') {
                            //removes one from enemy health on hit
                            enemies[j].enemyHealth = enemies[j].enemyHealth - 1;
                            //checks if enemy health is at 0
                            if(enemies[j].enemyHealth == 0) {
                                //if true, increase score by 1
                                score = score+1;
                                //play death sound
                                enemyDead.play();
                                //when enemy is destroyed, chance for alien to spawn
                                if((Math.floor(Math.random() * 10)+ 1) == 8){
                                    //creates new alien at enemy death spot
                                    newAlien = new Alien(enemies[j].enemyX, enemies[j].enemyY);
                                    //adds to the aliens array
                                    aliens.push(newAlien);
                                }
                                //removes enemy from the enemy list
                                enemies.splice(j, 1);
                            }
                            //removes the shot from the shot list
                            shotList.splice(l, 1);
                            //updates score on screen
                            document.getElementById("score").innerHTML = "Score: " + score;
                        }
                    }
                    //if the player collides with a small enemy, then the player dies
                    else if (rectEnemy.x < rectJet.x + rectJet.width &&
                        rectEnemy.x + rectEnemy.width > rectJet.x &&
                        rectEnemy.y < rectJet.y + rectJet.height &&
                        rectEnemy.height + rectEnemy.y > rectJet.y) {
                        //change playerAlive to false
                        playerAlive = false;
                        //play player death sound.
                        deathSound.play();
                    }
                }
            }
            //else if enemy is big
            else{
                //create rect behind big enemy for collision detection
                var rectBigEnemy = {x: enemies[j].enemyX, y: enemies[j].enemyY, width: 100, height: 59};
                //for every shot in the shotList
                for (l = 0; l < shotList.length; l++) {
                    //create rect behind shot for collision detection
                    var rectShot = {x: shotList[l].shotX, y: shotList[l].shotY, width: 40, height: 20};
                    //checks to see if shot hits enemy
                    if (rectBigEnemy.x < rectShot.x + rectShot.width &&
                        rectBigEnemy.x + rectBigEnemy.width > rectShot.x &&
                        rectBigEnemy.y < rectShot.y + rectShot.height &&
                        rectBigEnemy.height + rectBigEnemy.y > rectShot.y) {
                        //checks if shot is of type player
                        if (shotList[l].shotType == 'player') {
                            //removes health from enemy
                            enemies[j].enemyHealth = enemies[j].enemyHealth - 1;
                            //if health hits 0
                            if(enemies[j].enemyHealth == 0) {
                                //add 2 to score
                                score = score + 2;
                                //play enemy death sound
                                enemyDead.play();
                                //when enemy is destroyed, chance for alien to spawn
                                if((Math.floor(Math.random() * 5)+ 1) == 4){
                                    //create new alien object at enemy death spot
                                    newAlien = new Alien(enemies[j].enemyX, enemies[j].enemyY);
                                    //add to aliens array
                                    aliens.push(newAlien);
                                }
                                //remove enemy from enemy list
                                enemies.splice(j, 1);
                            }
                            else{
                                //play hit sound
                                enemyHit.play();
                            }
                            //remove shot from shotList
                            shotList.splice(l, 1);
                            //update score on screen
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
                        //play player death Sound
                        deathSound.play();
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
            //the shot is of type player, draws a missile
            if(shotList[k].shotType == 'player'){
                graphicsContext.drawImage(missile, shotList[k].shotX, shotList[k].shotY);
            }
            //if the shot is an enemy shot, draws a laser
            else if(shotList[k].shotType == 'enemy'){
                graphicsContext.drawImage(laser, shotList[k].shotX, shotList[k].shotY);
            }
        }
    }
}
/**
 * spriteMove will run to update the locations and produce movement for our sprites. It will update every time within
 * the game loop.
 * */
function spriteMove(currentTime){
    //updates the jetY variable to move our jet up and down the y axis based on deltaY
    jetY = jetY + deltaY;
    //if the jet moves up off the screen
    if(jetY < 0){
        //move the jet back to yPosition 0
        jetY = 0;
    }
    //if the jet moves beneath the lower edge of the screen
    else if(jetY > 514){
        //set the jet back to yPosition 514
        jetY = 514;
    }
    //updates the X coordinates for each enemy in the enemy array to move them to the left 2
    for (i = 0; i < enemies.length; i++){
        enemies[i].enemyX = enemies[i].enemyX - 2;
    }
    //updates the x coordinates for each alien in the aliens array to move them to the left
    for(k = 0; k < aliens.length; k++){
        aliens[k].alienX = aliens[k].alienX - 2;
    }
    //for loop that will iterate over the entire shotList array
    for (j = 0; j < shotList.length; j++){
        //the shot is of type 'player'
        if(shotList[j].shotType == 'player'){
            //move them to the right at a fast rate
            shotList[j].shotX = shotList[j].shotX + 5;
        }
        //else if the shot is an enemy shot
        else{
            //move them to the left
            shotList[j].shotX = shotList[j].shotX - 3;
        }
    }
}
/**
 * handleKeyUp will set our deltaY to 0 whenever the arrow keys are released.
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
 * handleKeyDown will change our deltaY in accordance to the arrow key pressed down. The end result will be the user moving the sprite.
 * If will also create shots and push them onto the shotList array
 * SOURCE: SimpleMove.js, as given to us in class
 */
function handleKeyDown(keyboardEvent){
    var newPlayerShot;
    var missileSound = new Audio('sounds/missile.wav');
    switch (keyboardEvent.key)
    {
        //if the arrow down or up is pressed will update our deltaY accordingly
        case 'ArrowDown':
            deltaY = 10;
            break;
        case 'ArrowUp':
            deltaY = -10;
            break;
        case 'ArrowRight':
            //if the right arrow is pressed, a newPlayerShot will be made at those coordinates
            newPlayerShot = new Shot('player', 20, jetY+18);
            //pushes the shot onto the shotList
            shotList.push(newPlayerShot);
            //play player shot sound
            missileSound.play();
            break;
    }
}
/**
 * drawComponents() will draw our background on the canvas as well as our sprites. It will include requestAnimationFrame, which will
 * produce our game loop and continually iterate. It will also move our sprites, and update the background to produce the scrolling
 * background.
 *SOURCE: SimpleMove.js, as given to us in class
 * */
function drawComponents(currentTime) {
    //update the background
    updateBackgroundOffset(currentTime);
    //draw the background
    drawBackground(currentTime);
    //draw our players, shots, enemies, aliens
    drawPlayers(currentTime);
    //move all the sprites
    spriteMove(currentTime);
    //requestAnimationFrame to produce game loop
    requestAnimationFrame(drawComponents);
}
/**
 * runGame() will start our game loop by calling requestAnimationFrame(drawComponents)
 * */
function runGame(){
    requestAnimationFrame(drawComponents);
}
/**
 * startGame() will load our images, add event listeners for key presses and then call the runGame() function
 * SOURCE: SimpleMove.js, as given to us in class
 * */
function startGame(){
    loadImages();
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    runGame();
} startGame();