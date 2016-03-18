var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// sets up number of index blocks in the game, and how each movement affects the index number of whatever's moving.
var grid = 110, up = -10, down = 10, left = -1, right = 1;
// creates canvas and sets movement states to false(changes when button is pressed)
var canvas = document.getElementById("brainEaters"), cx = canvas.getContext("2d"), leftState = false, downState = false, upState = false, rightState = false, 
// declares png variables
zomImg = new Image(), manImg = new Image(), wallImg = new Image(), 
// initializes first zombie, player and zombie class
player, numOfZoms = 1, zom = [];
// img sources
zomImg.src = "/Content/zombie.png";
manImg.src = "/Content/Male-zombie-hunter.png";
wallImg.src = "/Content/rbricks_large_shop_thumb.png";
// enum class for what is contained in an index or assigning something to an index
var fullOf;
(function (fullOf) {
    fullOf[fullOf["empty"] = 0] = "empty";
    fullOf[fullOf["zombie"] = 1] = "zombie";
    fullOf[fullOf["hero"] = 2] = "hero";
    fullOf[fullOf["wall"] = 3] = "wall";
})(fullOf || (fullOf = {}));
// initializing index array that holds the fullOf state for each index number in the game grid
var arr = [];
var Player = (function () {
    //same as above but actually creates the character in the new index?
    function Player(indexP) {
        this.x = indexP % 10;
        this.y = Math.floor(indexP / 10);
        this.index = indexP;
    }
    // method that checks the selected player movement state from the update game function and and makes sure that the index you want to move
    // to does not contain anything else before it updates the player index 
    Player.prototype.updatePosition = function (value) {
        if (arr[this.index + value] == fullOf.empty) {
            arr[this.index + value] = fullOf.hero;
            arr[this.index] = fullOf.empty;
            this.index = this.index + value;
            this.updateCoord(this.index);
        }
    };
    // gets the index from the update position method, after it has checked that it is okay to move there, and does the calculation to determine 
    // the x and y coordinates, and the index number that they match.
    Player.prototype.updateCoord = function (index) {
        this.x = index % 10;
        this.y = Math.floor(index / 10);
    };
    return Player;
})();
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    function Zombie(index) {
        _super.call(this, index);
    }
    Zombie.prototype.zomAI = function (targetX, targetY) {
        // if spawn point was index 0 (how it originally was), not random. It's saying that if there's already a zombie in index zero, 
        // spawn the next one, one index up (prevents zombies spawning on each other and the game crashing) 
        if (this.index == 0) {
            arr[this.index + 1] = fullOf.zombie;
            arr[this.index] = fullOf.empty;
            this.index = this.index + 1;
            this.updateCoord(this.index);
        }
        else if (this.y == 0 && arr[this.index + 10] == fullOf.empty && targetY != 0) {
            arr[this.index + 10] = fullOf.zombie;
            arr[this.index] = fullOf.empty;
            this.index = this.index + 10;
            this.updateCoord(this.index);
        }
        else if (this.y < targetY) {
            if (arr[this.index + 10] == fullOf.empty) {
                arr[this.index + 10] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index + 10;
                this.updateCoord(this.index);
            }
            else if (arr[this.index + 10] == fullOf.wall) {
                // if the zombie x coord is less than player, move zombie one index right
                if (this.x < targetX && arr[this.index + 1] == fullOf.empty) {
                    arr[this.index + 1] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = this.index + 1;
                    this.updateCoord(this.index);
                }
                else if (this.x > targetX && arr[this.index - 1] == fullOf.empty) {
                    arr[this.index - 1] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = this.index - 1;
                    this.updateCoord(this.index);
                }
            }
            else if (arr[this.index - 10] == fullOf.wall) {
                if (targetX < this.x) {
                    if ((arr[this.index - 1] != fullOf.wall || arr[this.index - 1] != fullOf.zombie)) {
                        arr[this.index - 1] = fullOf.zombie;
                        arr[this.index] = fullOf.empty;
                        this.index = this.index - 1;
                        this.updateCoord(this.index);
                    }
                    else if ((arr[this.index + 1] != fullOf.wall || arr[this.index + 1] != fullOf.zombie)) {
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
                    }
                    else if ((arr[this.index - 1] != fullOf.wall || arr[this.index - 1] != fullOf.zombie)) {
                        arr[this.index - 1] = fullOf.zombie;
                        arr[this.index] = fullOf.empty;
                        this.index = this.index - 1;
                        this.updateCoord(this.index);
                    }
                }
            }
        }
        else if (this.x < targetX) {
            //move zombie one index right
            if (arr[this.index + 1] == fullOf.empty) {
                arr[this.index + 1] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index + 1;
                this.updateCoord(this.index);
            }
            else if (arr[this.index + 1] == fullOf.wall) {
                var randomOfTwoChoices = Math.floor(Math.random() * 2);
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
                else if (this.x > targetX && arr[this.index - 1] == fullOf.empty) {
                    arr[this.index - 1] = fullOf.zombie;
                    arr[this.index] = fullOf.empty;
                    this.index = this.index - 1;
                    this.updateCoord(this.index);
                }
            }
        }
        else if (this.y > targetY) {
            if (arr[this.index - 10] == fullOf.empty) {
                arr[this.index - 10] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index - 10;
                this.updateCoord(this.index);
            }
        }
        else if (this.x > targetX) {
            if (arr[this.index - 1] == fullOf.empty) {
                arr[this.index - 1] = fullOf.zombie;
                arr[this.index] = fullOf.empty;
                this.index = this.index - 1;
                this.updateCoord(this.index);
            }
        }
    };
    return Zombie;
})(Player);
// loops through coordinates and if an index contains something, it will be filled with the appropriate png
function drawing() {
    for (var y = 0; y < 11; y++) {
        for (var x = 0; x < 10; x++) {
            if (arr[y * 10 + x] == fullOf.empty) {
                cx.fillStyle = '#000000';
                cx.fillRect(50 * x, 50 * y, 50, 50);
            }
            else if (arr[y * 10 + x] == fullOf.wall) {
                cx.drawImage(wallImg, 50 * x, 50 * y, 50, 50);
            }
            else if (arr[y * 10 + x] == fullOf.zombie) {
                cx.drawImage(zomImg, 50 * x, 50 * y, 50, 50);
            }
            else if (arr[y * 10 + x] == fullOf.hero) {
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
    var spawnSpot = Math.floor(Math.random() * 109);
    // creates new player from player class and passes in the spawnspot as an arguament to the Player class parameter
    player = new Player(spawnSpot);
    // for every x and y coordinate, if the spawnspot matches that coordinate, push the player into that array index.
    for (var y = 0; y < 11; y++) {
        for (var x = 0; x < 10; x++) {
            if (spawnSpot == (y * 10 + x)) {
                arr.push(fullOf.hero);
            }
            else if ((y + 1) % 2 == 0) {
                var chance = Math.floor(Math.random() * 14);
                if (chance < 8) {
                    arr.push(fullOf.wall);
                }
                else {
                    arr.push(fullOf.empty);
                }
            }
            else {
                arr.push(fullOf.empty);
            }
        }
    }
}
// creates random spawn point for zombie, keeps creating them every 5 seconds until there are 5.
function createEnemies() {
    var zomSpawn;
    var random = Math.floor(Math.random() * grid);
    if (numOfZoms <= 5) {
        do {
            zomSpawn = random;
        } while (arr[zomSpawn] != fullOf.empty && arr[zomSpawn] != fullOf.wall && arr[zomSpawn] != fullOf.hero);
        {
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
    }
    else if (upState) {
        player.updatePosition(up);
        upState = false;
    }
    else if (downState) {
        player.updatePosition(down);
        downState = false;
    }
    else if (rightState) {
        if (player.index % 10 != 9) {
            player.updatePosition(right);
        }
        rightState = false;
    }
    drawing();
    // for each zombie, if zombie + or - Y or X coords are the same as the player, end the game. [Good comment]
    for (var i = 0; i < zom.length; i++) {
        if (zom[i].index + 1 == player.index || zom[i].index + 10 == player.index || zom[i].index - 1 == player.index || zom[i].index - 10 == player.index) {
            endGame();
        }
        else {
            zom[i].zomAI(player.x, player.y);
        }
    }
}
function endGame() {
    cx.globalAlpha = 0.5;
    cx.fillRect(0, 0, 500, 550);
    clearInterval(intervalDraw);
}
var buttonHandler = window.onkeydown = function (e) {
    heroMoves(e);
};
fillSpot();
drawing();
createEnemies();
var makeEnemies = window.setInterval(createEnemies, 5000);
var intervalDraw = window.setInterval(updateGame, 250);
//# sourceMappingURL=app.js.map