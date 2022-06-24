//MVP:

//the game
class Game {
    constructor() {

        this.player = null; // Player
        this.EnemyArr = []; // all Enemys

        //non MVP:
        //these would have an different behauvior then the Enemys so i keep them seperated now
        // this.BulletArr = [];
        // this.massiveItemArr = [];
        // this.backgroundItemArr = [];
        // image in the Background that would scroll down, repeat itself
        //this.scrollBackgroundImg = null;

        //helper to iterate with less timers
        this.counter = 0;
    }

    //non MVP: give attribuetes, like for level easy, med, hard -->diff speed, amount of enemys
    startGame(){}

    addEventListeners(){
        document.addEventListener("keydown", (event) => {
            //is it a good practice to order clockwise like in shorthands???
            if     (event.key === "ArrowUp")    this.player.moveUp();
            else if(event.key === "ArrowRight") this.player.moveRight();
            else if(event.key === "ArrowDown")  this.player.moveUp();
            else if(event.key === "ArrowLeft")  this.player.moveDown();
                                                    //add moveXY to GameItem class!

            // else if(event.key  === "Escape")  console.log("will quite/restart the Game");
            // else if(event.key  === "Space")  console.log("will pause the game");
        });
    }
}

//class for all items in the Game
class GameItem {
    constructor() {
        this.width  = null;
        this.height = null;
        this.posX   = null;
        this.posY   = null;

        //player, enemy, bullet,....
        this.itemClass  = null;
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
        if(this.positionY +this.height < 100){
            this.positionY++;
            this.domElement.style.bottom = this.posY + "vh";
        }
    }
    moveRight(){
        if(this.positionX + this.width < 100){
        this.positionX++;
        this.domElement.style.left = this.posX + "vw";
        }  
    }
    moveDown(){
        if(this.positionY > 0){
        this.positionY--;
        this.domElement.style.bottom = this.posY + "vh";
        }
    }
    moveLeft(){
        if(this.positionX > 0){
        this.positionX--;
        this.domElement.style.left = this.posX + "vw";
        }
    }
}




//the player
class Player extends GameItem {}

//the Enemy's
class Enemy extends GameItem {}







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