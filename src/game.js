class Game {
    constructor() {
        this.player = null; // Player
        this.enemyArr = []; // all Enemys
        this.bulletArr = null; // all Bullets shoot from Player -get ref from player instance
        
        this.movingBackgroundArr = [];
        this.backgroundItemArr = [];
        this.backgroundMassiveItemArr = [];
        //helper to iterate with less timers
        this.counter = 0;
    }

    //non MVP: give attribuetes, like for level easy, med, hard -->diff speed, amount of enemys
    startGame(){
        this.player = new Player();
        //connect bulletArr ref of game with the one from player
        this.bulletArr = this.player.bulletArr;
        //need a instance to use .height for counter to create further slices/rows by timer
        //will fix itself even if you use an other height in the interfal(), when this [0]
        this.movingBackgroundArr.push(new movingBackground());

        this.addEventListeners();

        //use as refresh rate -set as attribute for easy,med,hard +multiplier for amount of enemys, massiveItems
        setInterval(() => { //get attr from possible startmenue(easy,med, hard...)
            // create/add new Enemy@ every 60 iterations
            if(this.counter % 60 === 0){
                const newEnemy = new Enemy();
                this.enemyArr.push(newEnemy);
            }

            if(this.counter % 50 === 0){
                const newBackgroundItem = new BackgroundItem();
                this.backgroundItemArr.push(newBackgroundItem);
            }

            if(this.counter % 40 === 0){
                const newBackgroundMassiveItem = new BackgroundMassiveItem();
                this.backgroundMassiveItemArr.push(newBackgroundMassiveItem);
            }

            //add new background sclice one by one when fully in viewport
            if(this.counter % this.movingBackgroundArr[0].height === 0){
                const newMovingBackGroundRow = new movingBackground();
                this.movingBackgroundArr.push(newMovingBackGroundRow);
            }

            //remove "moving" background    @going "down" out viewport
            this.removeOnLeaveViewport(this.movingBackgroundArr, "down");
            //remove backgroundItems        @going "down" out viewport
            this.removeOnLeaveViewport(this.backgroundItemArr, "down");
            //remove backgroundMassiveItems @going "down" out viewport
            this.removeOnLeaveViewport(this.backgroundMassiveItemArr, "down");
            //remove enemys                 @going "down" out viewport
            this.removeOnLeaveViewport(this.enemyArr, "down");
            //remove Bulllets               @going "up" out viewporst
            this.removeOnLeaveViewport(this.bulletArr, "up");


            //remove enemy when hits player
            this.deleteAtCollisionOfGameItems([this.player],  this.enemyArr, "second")
            //remove bullet and enemy when collide
            this.deleteAtCollisionOfGameItems(this.bulletArr, this.enemyArr, "both")

            this.counter++;
        }, 40);
    }

    deleteAtCollisionOfGameItems(firstItemsArr, secondItemsArr, deleteWich="none"){
        firstItemsArr.forEach((firstItem)=>{
            secondItemsArr.forEach((secondItem)=> {

                if(firstItem.posX    < secondItem.posX + secondItem.width &&
                    firstItem.posX   + firstItem.width > secondItem.posX &&
                    firstItem.posY   < secondItem.posY + secondItem.height &&
                    firstItem.height + firstItem.posY  > secondItem.posY){
                
                if      (deleteWich === "first")  firstItem. domElement.remove()
                else if (deleteWich === "second") secondItem.domElement.remove()
                else if (deleteWich === "both")  {firstItem. domElement.remove(); secondItem.domElement.remove();}
                //else if (deleteWich === "none" {}
                console.log(`collision between ${firstItem.itemClass} and ${secondItem.itemClass}`);
                //return [firstItem.domElement, secondItem.domElement]; maybe for later??
                }
            })
        }) 
    };

    removeOnLeaveViewport(gameItemArr, movementDirection){
        gameItemArr.forEach((gameItemInstance)=>{
            if(      movementDirection === "up")    
            {        gameItemInstance.moveUp();
                if(  (gameItemInstance.posY + gameItemInstance.height) === 100){
                     gameItemArr.shift();
                     gameItemInstance.domElement.remove();
                }            
            }
            else if (movementDirection === "down")  
            {        gameItemInstance.moveDown();
                if( (gameItemInstance.posY + gameItemInstance.height) === 0){
                     gameItemArr.shift();
                     gameItemInstance.domElement.remove();
                }
            }         
            // +double check for left/right (+prior)...
            // -left& right @ single cond. not necessary@ gameStyle now
        })
    }
        

    addEventListeners(){
        document.addEventListener("keydown", (event) => {
            //is it a good practice to order clockwise like in shorthands???
            if     (event.key === "ArrowUp"   ) this.player.moveUp();
            else if(event.key === "ArrowRight") this.player.moveRight();
            else if(event.key === "ArrowDown" ) this.player.moveDown();
            else if(event.key === "ArrowLeft" ) this.player.moveLeft();
            else if(event.key === "s"         ) this.player.shoot(); //look@problems with "Space" key, choose other key
            // else if(event.key  === "Escape")  console.log("will pause+ option to quite/restart the Game");
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
        //free to get outside viewpoport
        this.posY--;
        this.domElement.style.bottom = this.posY + "vh";
    }
    moveLeft(){
        if(this.posX > 0){
        this.posX--;
        this.domElement.style.left = this.posX + "vw";
        }
    }
}

class Player extends GameItem {
    constructor(width=5, height=5, posX=50-width/2, posY=0, className="player"){       
        super(width, height, posX, posY, className);
    this.bulletArr = []
    }

    //overwrites moveDown() of GameItem class,
    //add condition so the playery can't go outside viewport
    moveDown(){ 
    if(this.posY > 0){
        this.posY--;
        this.domElement.style.bottom = this.posY + "vh";
        }
    }

    shoot() {
        const newBullet = new Bullet(1, 1, (this.posX+this.width/2), (this.posY+this.height), "bullet");
        this.bulletArr.push(newBullet);
        console.log("shoting!!!");
    }
}

class Enemy extends GameItem {
    constructor(width = 5,height = 5, posX = Math.floor(Math.random() * (100 - width + 1)), posY = 100, className="enemy"){
        super(width, height, posX, posY, className);
    }
}

class Bullet extends GameItem {
    constructor(width=1, height=1, posX=null, posY=null, className="bullet"){
        //need position from player,... maybe a way to call player as parent?? -later
        //think won't exist till constructor not finished, try with dom-selector for player
        super(width, height, posX, posY, className);
    }
}

class movingBackground extends GameItem {
    constructor(width=100, height=20, posX=0, posY=100, className="movingBackground"){
        //--> will need to fill whole backgrouind before start!
        super(width, height, posX, posY, className);
    }
}

class BackgroundItem extends GameItem {
    constructor(width=15, height=15, posX= Math.floor(Math.random() * (100 - width + 1)), posY=100, className="backgroundItem"){
        super(width, height, posX, posY, className);
    }
}

class BackgroundMassiveItem extends GameItem {
    constructor(width=15, height=15, posX= Math.floor(Math.random() * (100 - width + 1)), posY=100, className="backgroundMassiveItem"){
        super(width, height, posX, posY, className);
    }
}


const game = new Game();
game.startGame();


// for later: non MVP
// bug: enemys removes multiple bullets,
// some of these don't run outside viewport, remains
//
//add linear transition@refreshrate to movements
//
//player goes with the background! more intense playing exp
//set start of player at least @posY25 for this
//
// health points for player, highscore, increased by time +inc@ shot enemy, get bonusItem
//
// class MassiveItems//that will block the players movement
//
//avoid items created on the same x-pos-range(ofElm.width) 
