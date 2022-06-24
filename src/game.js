//MVP:

//the game
class Game {
    constructor() {
        this.player = null; // Player
        this.enemyArr = []; // all Enemys
        //helper to iterate with less timers
        this.counter = 0;
        //non MVP:
        //these would have an different behauvior then the Enemys so i keep them seperated now
        // this.BulletArr = [];
        // this.massiveItemArr = [];
        // this.backgroundItemArr = [];
        // image in the Background that would scroll down, repeat itself
        //this.scrollBackgroundImg = null;
    }

    //non MVP: give attribuetes, like for level easy, med, hard -->diff speed, amount of enemys
    startGame(){
        this.player = new Player();
        this.addEventListeners();

        //use as refresh rate
        setInterval(() => { //get attr from possible startmenue(easy,med, hard...)
            // create/add new Enemy@ every 60 iterations
            if(this.counter % 60 === 0){
                const newEnemy = new Enemy();
                this.enemyArr.push(newEnemy);
            }

            // move Enemys, remove Enemys out of Viewport
            this.enemyArr.forEach((enemyInstance) => {
                enemyInstance.moveDown();
                // remove Enemys out of the Viewport, from Arr& Dom@instance of iteration (when the're complete out of sight)
                if( (enemyInstance.posY + enemyInstance.height) === 0){
                    this.enemyArr.shift();
                    enemyInstance.domElement.remove();
                }
            });
            this.counter++;
        }, 30);
    }

    addEventListeners(){
        document.addEventListener("keydown", (event) => {
            //is it a good practice to order clockwise like in shorthands???
            if     (event.key === "ArrowUp")    this.player.moveUp();
            else if(event.key === "ArrowRight") this.player.moveRight();
            else if(event.key === "ArrowDown")  this.player.moveDown();
            else if(event.key === "ArrowLeft")  this.player.moveLeft();
            // else if(event.key  === "Escape")  console.log("will quite/restart the Game");
            // else if(event.key  === "Space")  console.log("will pause the game");
        });
    }
}

//class for all items in the Game
class GameItem {
    constructor(width, height, posX, posY, itemClass) {
        this.width  = width;
        this.height = height;
        this.posX   = posX;
        this.posY   = posY;

        //itemClass: player, enemy, bullet,....
        this.itemClass  = itemClass;
        this.domElement = this.createDomElement();
    }

    createDomElement(){
        let newDomElm = document.createElement("div");

        newDomElm.className    = this.itemClass;

        newDomElm.style.width  = this.width  + "vw";
        newDomElm.style.height = this.height + "vh";
        newDomElm.style.left   = this.posX   + "vw";
        newDomElm.style.bottom = this.posY   + "vh";

        document.getElementById("gamefield").appendChild(newDomElm);
        return newDomElm;
    }

    moveUp(){
        if(this.posY +this.height < 100){
        this.posY++;
        this.domElement.style.bottom = this.posY + "vh";
        }
    }
    moveRight(){
        if(this.posX + this.width < 100){
        this.posX++;
        this.domElement.style.left = this.posX + "vw";
        }  
    }
    moveDown(){
        if(this.posY > 0){
        this.posY--;
        this.domElement.style.bottom = this.posY + "vh";
        }
    }
    moveLeft(){
        if(this.posX > 0){
        this.posX--;
        this.domElement.style.left = this.posX + "vw";
        }
    }
}

//the player
class Player extends GameItem {
    constructor(width=5, height=5, posX=50-width/2, posY=0, className="player"){       
        super(width, height, posX, posY, className);
    }
}

//the Enemy's
class Enemy extends GameItem {
    constructor(width = 5,height = 5, posX = Math.floor(Math.random() * (100 - width + 1)), posY = 95, className="enemy"){
        super(width, height, posX, posY, className);
    }
}

const game = new Game();
game.startGame();





// for later: non MVP
//
// class Bullet extends GameItem {}
// //player (or maybe foes) shoting that will remove elements on collision
// //(or decrease health later)

// //a item scrolling down with the background at same speed
// //that will block the players movement
// class massiveItem {}

// //a item just to dekorate the scrolling background
// class backgroundItem {}

//extra non MVP:
// maybe healthpoint, weapon, points for Highscore(also non MVP)... this kind
// class BonusItem {}