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
var playerAlive = true;
var jetY=225;
var deltaY = 0;
var newEnemy;
var enemyX = 977;
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



/**
 * drawSprite is the bulkiest method, as it will handle the drawing of all sprites within the game(harambe[the player], banana, and the three SWAT enemies)
 * Along with this, it will handle the collision detection of the sprites, deciding whether a user has scored a point or lost the game.
 * */
function drawPlayer(currentTime){
    if(playerAlive == false){
        //print death message
    }
    else{
        spriteMove();
        graphicsContext.drawImage(sprite, 20, jetY);
        graphicsContext.drawImage(enemySprite, enemyX, 100);
    }

}
function drawEnemies(currentTime) {

    graphicsContext.drawImage(enemySprite, enemyX, 300);
}
/**
 * naiveGameLoop will loop while the game is running, altering the coordinates of sprites as they move around the screen.
 * */
function spriteMove(){
    jetY = jetY + deltaY;

    enemyX = enemyX -1;
    //newEnemy.enemyX = newEnemy.enemyX - 3;
    //for (i = 0; i < enemies.length; i++){
      //  enemies[i].enemyX = enemies[i].enemyX - 3;
    //}
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
        case (keyboardEvent.keyCode == 32):
            console.log("space");
            if (shotCheck == 0) {
                drawMissile(jetY);
                shotCheck = 1;
            }
            break;
    }
}

function drawMissile(jetYPos){
        graphicsContext.drawImage(missile, 20, jetYPos);
}
/**
 * drawComponents() will draw our background on the canvas as well as our sprites
 *SOURCE: SimpleMove.js, as given to us in class
 * */
function drawComponents(currentTime) {
    updateBackgroundOffset(currentTime);
    drawBackground(currentTime);
    drawPlayer(currentTime);
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