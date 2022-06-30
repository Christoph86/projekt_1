class Game {
    constructor() {
        this.player = null;
        this.enemyArr = [];
        this.labelHealthPoints = null;
        this.labelHighscore = null;
        this.playerImgArr = []

        this.movingBackgroundArr = [];
        this.backgroundItemArr = [];
        this.BackgroundItemArrImageSrc= [];
        this.backgroundMassiveItemArr = [];
        this.backgroundMassiveItemArrImageSrc= null;

        this.counter = 0;
    }

    startGame(){
        //initialize Game Vars, add Listeners
        this.backgroundMassiveItemAImageSrcArr = [
            `./img/tree1.png`, `./img/tree2.png`, `./img/tree3.png`, `./img/tree4.png`];
        this.backgroundItemImageSrcArr = [
            `./img/deco1.png`, `./img/deco2.png`, `./img/deco3.png`, `./img/deco4.png`, `./img/deco5.png`, `./img/deco6.png`, `./img/deco7.png`, `./img/deco8.png`];
        this.playerImgSrcArr = [
            `./img/player_pacman_ghost.png`,`./img/player_pacman_ghost1.png`,`./img/player_pacman_ghost2.png`];

        this.player = new Player(this.playerImgSrcArr);
        this.labelHealthPoints = new Label(null,null,null,null,"label healthPoints");
        this.labelHighscore    = new Label(null,null,null,null,"label highscore");
        this.movingBackgroundArr.push(new MovingBackground);
            //need a instance to use .height for counter to create further slices/rows by timer
            //will fix itself even if you use an other height in the interfal(), when this [0]

        this.addEventListeners();


        setInterval(() => {

            //update labels for HP and Highscore, check gameover?
            this.labelHighscore.domElement.innerText = this.player.highscore + "☃️ Pts.";
            if(this.player.healthPoints > 0) {this.labelHealthPoints.domElement.innerText = "❤️ " + this.player.healthPoints;} 
            else {
                alert("☠️☠️GAMEOVER☠️☠️ \n sorry, you're gone \n try it aggain!")
                this.player.healthPoints=100;
                this.labelHighscore.domElement.innerText="☃️";
                location.reload();
            }


            //creating new Items
            if(this.counter % 60 === 0){this.enemyArr.push(new Enemy());}
            if(this.counter % 10 === 0){this.backgroundItemArr.push(new BackgroundItem(this.backgroundItemImageSrcArr));}
            if(this.counter % 40 === 0){this.backgroundMassiveItemArr.push(new BackgroundMassiveItem(this.backgroundMassiveItemAImageSrcArr));}
            if(this.counter % this.movingBackgroundArr[0].height === 0){this.movingBackgroundArr.push(new MovingBackground);}
                //add new background sclice one by one when fully in viewport

            //move items and check if they're out of Viewport, then delete
            this.moveAndCheckViewportToRemove(this.movingBackgroundArr,      "down");
            this.moveAndCheckViewportToRemove(this.backgroundItemArr,        "down");
            this.moveAndCheckViewportToRemove(this.backgroundMassiveItemArr, "down");
            this.moveAndCheckViewportToRemove(this.enemyArr,                 "down");
            this.moveAndCheckViewportToRemove(this.player.bulletArr,         "up"  );


            //handle Collision of elements
            if(this.handleCollisionOfGameItems([this.player],  this.enemyArr, "delSecond")) {this.player.healthPoints -= 40;}
            if(this.handleCollisionOfGameItems(this.player.bulletArr, this.enemyArr, "delBoth")) {this.player.highscore += 25;}
            this.handleCollisionOfGameItems(this.player.bulletArr, this.backgroundMassiveItemArr, "delFirst")
            this.handleCollisionOfGameItems([this.player], this.backgroundMassiveItemArr, "block")
                //blocks the player to go further an MassiveItem (push player down with/before the item)

            this.counter++;
        }, 40);
    }

    handleCollisionOfGameItems(firstItemsArr, secondItemsArr, task="none"){
        let resultOfCollision = false;
        //however need a helping var,... maybe because of the scope in the forEach...
        //but why a return in the nested for Each don't worked?? maybe killed just the nested loop... 
        firstItemsArr.forEach((firstItem, firstItemIndex)=>{
            secondItemsArr.forEach((secondItem, secondItemIndex)=> {

                if(firstItem.posX    < secondItem.posX + secondItem.width &&
                    firstItem.posX   + firstItem.width > secondItem.posX &&
                    firstItem.posY   < secondItem.posY + secondItem.height &&
                    firstItem.height + firstItem.posY  > secondItem.posY){
                
                if      (task === "delFirst")  {firstItem. domElement.remove(); firstItemsArr.splice(firstItemIndex,1);}
                else if (task === "delSecond") {secondItem.domElement.remove(); secondItemsArr.splice(secondItemIndex,1);}
                else if (task === "delBoth")  {
                    firstItem. domElement.remove();
                    secondItem.domElement.remove();
                    firstItemsArr.splice(firstItemIndex,1);
                    secondItemsArr.splice(secondItemIndex,1);
                }
                else if (task === "block")    {firstItem.moveDown();}

                
                firstItem.collisionWith  = secondItem;
                secondItem.collisionWith = firstItem;
                console.log(`collision between ${firstItem.itemClass} and ${secondItem.itemClass}`);
                resultOfCollision = [firstItem, secondItem];
                } else {//no collision detected
                        resultOfCollision = false
                        // iteration 1 --> a1 hits b1 !! next iteration: a1 !hits b2 so a1.collisionWith would be "" even it may still in contact with b1
                        // so i check eachother if both elements are a pair and only then set ""
                        if(firstItem.collisionWith === secondItem && secondItem.collisionWith === firstItem){
                            firstItem.collisionWith  = "";
                            secondItem.collisionWith = "";
                        }
                }
            })
        }) 
        return resultOfCollision;
    };

    moveAndCheckViewportToRemove(gameItemArr, movementDirection){
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
        })
    }
        
    addEventListeners(){
        document.addEventListener("keydown", (event) => {
            //is it a good practice to order clockwise like in shorthands???
            if     (event.key === "ArrowUp"   ) this.player.moveUp();
            else if(event.key === "ArrowRight") this.player.moveRight();
            else if(event.key === "ArrowDown" ) this.player.moveDown();
            else if(event.key === "ArrowLeft" ) this.player.moveLeft();
            else if(event.key === "s"         ) this.player.shoot(); 
            else if(event.key === "p"         ) alert("You're taking a break!\n would the space snowmens do it to??\n...Hurry Up!!"); 

        });
    }
}

//class for all items in the Game
class GameItem {
    constructor(width, height, posX, posY, itemClass, collisionWith="") {
        this.width  = width;
        this.height = height;
        this.posX   = posX;
        this.posY   = posY;
        this.collisionWith = collisionWith;
        // this.imgSrcArr = imgSrcArr;
            //array with all the src/url of all possible images for this class

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

        document.getElementById("snowmen-invasion").appendChild(newDomElm);
        return newDomElm;
    }

    moveUp(){
        if(this.posY +this.height < 100){
        this.posY++;
        // //try for transitions....
        // this.domElement.style.transition = "bottom 2s linear";
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
    constructor(
        imgSrcArr = [],
        imgIndex = Math.floor(Math.random() * (imgSrcArr.length)),
        width=5,
        height=5,
        posX=50-width/2,
        posY=0,
        className="player",
        healthPoints=100,
        highscore=0)
    {       
    super(width, height, posX, posY, className);
    this.bulletArr = [];
    this.healthPoints = healthPoints;
    this.highscore = highscore;
    this.imgSrcArr = imgSrcArr;
    this.imgIndex = imgIndex;
    this.domElement.innerHTML = `<img src="${imgSrcArr[imgIndex]}" alt="🌲"></img>`
    }

    moveUp() {
        if(this.posY +this.height < 100 && this.collisionWith.itemClass !== "backgroundMassiveItem"){
            this.posY++;
            this.domElement.style.bottom = this.posY + "vh";
            }
    }

    //overwrites moveDown() of GameItem class, add condition so the player can't go outside viewport
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
    constructor(
        width = 8,
        height = 16,
        posX = Math.floor(Math.random() * (100 - width + 1)),
        posY = 100, className="enemy")
    {
        super(width, height, posX, posY, className);
        this.domElement.innerHTML = `<img src="./img/snowman1.png" alt="🍧"></img>`
    }
}

class Bullet extends GameItem {
    constructor(
        width=1,
        height=1,
        posX=null,
        posY=null,
        className="bullet")
    {
        super(width, height, posX, posY, className);
        this.domElement.innerHTML = `<img src="./img/carrot_bullet.png" alt="🥕"></img>`
    }
}

class MovingBackground extends GameItem {
    constructor(
        width=100,
        height=20,
        posX=0,
        posY=100,
        className="movingBackground")
    {
        super(width, height, posX, posY, className);
    }
}

class BackgroundItem extends GameItem {
    constructor(
        imgSrcArr = [],
        imgIndex = Math.floor(Math.random() * (imgSrcArr.length)),
        width=6,
        height=10,
        posX= Math.floor(Math.random() * (100 - width + 1)),
        posY=100, className="backgroundItem")
    {
        super(width, height, posX, posY, className);
        this.imgSrcArr = imgSrcArr;
        this.imgIndex = imgIndex;
        this.domElement.innerHTML = `<img src="${imgSrcArr[imgIndex]}" alt="🌲"></img>`
    }
}

class BackgroundMassiveItem extends GameItem {
    constructor(
        imgSrcArr =[],
        imgIndex = Math.floor(Math.random() * (imgSrcArr.length)),
        width = 15,
        height = 30,
        posX = Math.floor(Math.random() * (100 - width + 1)),
        posY = 100,
        className="backgroundMassiveItem"
 )
    {
        super(width, height, posX, posY, className);
        this.imgSrcArr = imgSrcArr;
        this.imgIndex = imgIndex;
        this.domElement.innerHTML = `<img src="${imgSrcArr[imgIndex]}" alt="🌲"></img>`
    }
}

class Label extends GameItem {
    constructor(width=null, height=null, posX=null, posY=null, className="label"){
        super(width, height, posX, posY, className);
    }
}


const game = new Game();
game.startGame();