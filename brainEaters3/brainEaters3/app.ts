// sets up number of index blocks in the game, and how each movement affects the index number of whatever's moving.
const grid = 110,
    up = -10,
    down = 10,
    left = -1,
    right = 1;

// creates canvas and sets movement states to false(changes when button is pressed)
let canvas = <HTMLCanvasElement>document.getElementById("brainEaters"),
    cx = canvas.getContext("2d"),
    leftState = false,
    downState = false,
    upState = false,
    rightState = false,

    // declares png variables
    zomImg = new Image(),
    manImg = new Image(),
    wallImg = new Image(),

    // initializes first zombie, player and zombie class
    player: Player,
    numOfZoms = 1,
    zom: Zombie[] = [];

// img sources
zomImg.src = "/Content/zombie.png";
manImg.src = "/Content/Male-zombie-hunter.png";
wallImg.src = "/Content/rbricks_large_shop_thumb.png";

// enum class for what is contained in an index or assigning something to an index
enum fullOf {
    empty,
    zombie,
    hero,
    wall,
}

// initializing index array that holds the fullOf state for each index number in the game grid
let arr = [];

class Player {
    public x: number;
    public y: number;
    public index: number;
    // method that checks the selected player movement state from the update game function and and makes sure that the index you want to move
    // to does not contain anything else before it updates the player index 
    public updatePosition(value) {
        if (arr[this.index + value] == fullOf.empty) {
            arr[this.index + value] = fullOf.hero;
            arr[this.index] = fullOf.empty;
            this.index = this.index + value;
            this.updateCoord(this.index);
        }
    }

    // gets the index from the update position method, after it has checked that it is okay to move there, and does the calculation to determine 
    // the x and y coordinates, and the index number that they match.
    protected updateCoord(index) {
        this.x = index % 10;
        this.y = Math.floor(index / 10);
    }
    //same as above but actually creates the character in the new index?
    constructor(indexP: number) {
        this.x = indexP % 10;
        this.y = Math.floor(indexP / 10);
        this.index = indexP;
    }
}

class Zombie extends Player {
    // declares coordinate variables and super grabs the constructor info from the parent Player class
    public x; //zombieX
    public y; // zombieY
    public index; //zombie index
    constructor(index) {
        super(index);
    }
    public zomAI(targetX, targetY) {
        // if spawn point was index 0 (how it originally was), not random. It's saying that if there's already a zombie in index zero, 
        // spawn the next one, one index up (prevents zombies spawning on each other and the game crashing) 
        if (this.index == 0) {
            arr[this.index + 1] = fullOf.zombie;
            arr[this.index] = fullOf.empty;
            this.index = this.index + 1;
            this.updateCoord(this.index);

        }
        // if zombie is on the first row (y = 0) and the y coordinate below zombie is empty, move zombie y coordinate down one (+10 is down)
        else if (this.y == 0 && arr[this.index + 10] == fullOf.empty && targetY != 0) {
            arr[this.index + 10] = fullOf.zombie;
            arr[this.index] = fullOf.empty;
            this.index = this.index + 10;
            this.updateCoord(this.index);

        }
        // if player is below zombie and there is nothing below zombie, move zombie down (add 10 index)
        else if (this.y < targetY) {
            if (arr[this.index + 10] == fullOf.empty) {
                arr[this.index + 10] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index + 10;
                this.updateCoord(this.index);
            }
            // if there is a wall below, 
            else if (arr[this.index + 10] == fullOf.wall) {
                // if the zombie x coord is less than player, move zombie one index right
                if (this.x < targetX && arr[this.index + 1] == fullOf.empty) {
                    arr[this.index + 1] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = this.index + 1;
                    this.updateCoord(this.index);
                }
                // if x coord is more than player, move zombie left
                else if (this.x > targetX && arr[this.index - 1] == fullOf.empty) {
                    arr[this.index - 1] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = this.index - 1;
                    this.updateCoord(this.index);
                }
            }
            // My bug-fixing AI (nope)
            else if (arr[this.index - 10] == fullOf.wall) {
                if (targetX < this.x) {
                    if ((arr[this.index - 1] != fullOf.wall || arr[this.index - 1] != fullOf.zombie)) {
                        arr[this.index - 1] = fullOf.zombie;
                        arr[this.index] = fullOf.empty;
                        this.index = this.index - 1;
                        this.updateCoord(this.index);
                    } else if ((arr[this.index + 1] != fullOf.wall || arr[this.index + 1] != fullOf.zombie)) {
                        arr[this.index + 1] = fullOf.zombie;
                        arr[this.index] = fullOf.empty;
                        this.index = this.index + 1;
                        this.updateCoord(this.index);
                    }
                }
                else if (targetX > this.x) {
                    if ((arr[this.index + 1] != fullOf.wall || arr[this.index + 1] != fullOf.zombie)) {
                        arr[this.index + 1] = fullOf.zombie;
                        arr[this.index] = fullOf.empty;
                        this.index = this.index + 1;
                        this.updateCoord(this.index);
                    } else if ((arr[this.index - 1] != fullOf.wall || arr[this.index - 1] != fullOf.zombie)) {
                        arr[this.index - 1] = fullOf.zombie;
                        arr[this.index] = fullOf.empty;
                        this.index = this.index - 1;
                        this.updateCoord(this.index);
                    }
                }
            }
        }
        
        // if zombie coord is to the left of player, 
        else if (this.x < targetX) {
            //move zombie one index right
            if (arr[this.index + 1] == fullOf.empty) {
                arr[this.index + 1] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index + 1;
                this.updateCoord(this.index);
            }
            // if the right has a wall, go up or down, chosen at random
            else if (arr[this.index + 1] == fullOf.wall) {
                let randomOfTwoChoices = Math.floor(Math.random() * 2);
                if (randomOfTwoChoices == 1) {
                    randomOfTwoChoices = this.index - 10;
                }
                else if (randomOfTwoChoices == 0) {
                    randomOfTwoChoices = this.index + 10;
                }
                // if player is left of zom and the randomly generated index is empty, move zom to that random index
                if (this.x < targetX && arr[randomOfTwoChoices] == fullOf.empty) {
                    arr[randomOfTwoChoices] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = randomOfTwoChoices;
                    this.updateCoord(this.index);
                }
                // if zombie coord is to the right of player and index to the left is empty, move zombie left
                else if (this.x > targetX && arr[this.index - 1] == fullOf.empty) {
                    arr[this.index - 1] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = this.index - 1;
                    this.updateCoord(this.index);
                }
            }
        }
        // if zom is below player, then if the y coord above is empty, move zom
        else if (this.y > targetY) {
            if (arr[this.index - 10] == fullOf.empty) {
                arr[this.index - 10] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index - 10;
                this.updateCoord(this.index);
            } 
        }
        // if zom is right of the player, if left index is empty, move zom left
        else if (this.x > targetX) {
            if (arr[this.index - 1] == fullOf.empty) {
                arr[this.index - 1] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index - 1;
                this.updateCoord(this.index);
            }
        }
    }
}
    
// loops through coordinates and if an index contains something, it will be filled with the appropriate png
function drawing() {
    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 10; x++) {
            if (arr[y * 10 + x] == fullOf.empty) {
                cx.fillStyle = '#000000';
                cx.fillRect(50 * x, 50 * y, 50, 50);
            } else if (arr[y * 10 + x] == fullOf.wall) {
                cx.drawImage(wallImg, 50 * x, 50 * y, 50, 50);
            } else if (arr[y * 10 + x] == fullOf.zombie) {
                cx.drawImage(zomImg, 50 * x, 50 * y, 50, 50);
            } else if (arr[y * 10 + x] == fullOf.hero) {
                cx.drawImage(manImg, 50 * x, 50 * y, 50, 50);
            }
        }
    }
}

function heroMoves(sender) {
    switch (sender.keyCode) {
        case 38:
            upState = true;
            break;
        case 37:
            leftState = true;
            break;
        case 39:
            rightState = true;
            break;
        case 40:
            downState = true;
            break;
    }
}

// initial random level construction, creates walls and sets the players random spawn point
function fillSpot() {
    // calculates random spawn spot for player
    let spawnSpot = Math.floor(Math.random() * 109);
    // creates new player from player class and passes in the spawnspot as an arguament to the Player class parameter
    player = new Player(spawnSpot);
    // for every x and y coordinate, if the spawnspot matches that coordinate, push the player into that array index.
    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 10; x++) {
            if (spawnSpot == (y * 10 + x)) {
                arr.push(fullOf.hero);
                // creates blocks in every second row only, not the first one at all (y + 1), 
                // creates a random chance for each array that it will be a wall or else it will be an empty array
            } else if ((y + 1) % 2 == 0) {
                let chance = Math.floor(Math.random() * 14);
                if (chance < 8) {
                    arr.push(fullOf.wall);
                } else {
                    arr.push(fullOf.empty);
                }
            } else {
                arr.push(fullOf.empty);
            }
        }
    }
}

// creates random spawn point for zombie, keeps creating them every 5 seconds until there are 5.
function createEnemies() {
    let zomSpawn;
    let random = Math.floor(Math.random() * grid);
    if (numOfZoms <= 5) {
        do {
            zomSpawn = random;
            // zombie will be spawned if the zom spawn point is not already filled
        } while (arr[zomSpawn] != fullOf.empty && arr[zomSpawn] != fullOf.wall && arr[zomSpawn] != fullOf.hero) {
            arr[zomSpawn] = fullOf.zombie;
            zom.push(new Zombie(zomSpawn));
        }
        numOfZoms++;
    }
}

//keeps updating the player and enemy position based on input
function updateGame() {
    if (leftState) {
        // if the index % 10 has no remainder, it means that player is at a border and can't move left
        if (player.index % 10 != 0) {
            player.updatePosition(left);
        }
        leftState = false;
    } else if (upState) {
        player.updatePosition(up);
        upState = false;
    } else if (downState) {
        player.updatePosition(down);
        downState = false;
        //same as leftstate
    } else if (rightState) {
        if (player.index % 10 != 9) {
            player.updatePosition(right);
        }
        rightState = false;
    }
    drawing();
    // for each zombie, if zombie + or - Y or X coords are the same as the player, end the game. [Good comment]
    for (let i = 0; i < zom.length; i++) {
        if (zom[i].index + 1 == player.index || zom[i].index + 10 == player.index || zom[i].index - 1 == player.index || zom[i].index - 10 == player.index) {
            endGame();
            // if not the same index, keep running AI and chasing player.
        } else {
            zom[i].zomAI(player.x, player.y);
        }
    }
}

function endGame() {
    cx.globalAlpha = 0.5;
    cx.fillRect(0, 0, 500, 550);
    clearInterval(intervalDraw);
}

let buttonHandler = window.onkeydown = (e) => {
    heroMoves(e);
};

fillSpot();
drawing();
createEnemies();
let makeEnemies = window.setInterval(createEnemies, 5000);
let intervalDraw = window.setInterval(updateGame, 250);


