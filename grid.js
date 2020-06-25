let removeFromArray = function(arr, element) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === element) {
            arr.splice(i, 1);
        }
    }
}

let heuristic = function(a, b) {
    // return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    let x = a.i - a.j;
    let y = b.i - b.j;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let cols, rows, nodeSize;
let grid = [];

let openSet = [];
let closedSet = [];
let path = [];
let start, target;
let noSolution = false;

const createGrid = function(width, height, cols_l, rows_l) {
    canvas.width = width;
    canvas.height = height;
    cols = cols_l;
    rows = rows_l;
    nodeSize = canvas.height / rows;
    let style = canvas.style;
    style.marginLeft = "auto";
    style.marginRight = "auto";
    let parentStyle = canvas.parentElement.style;
    parentStyle.textAlign = "center";
    parentStyle.width = "100%";
}

const initialiseNodes = function() {
    grid = new Array(cols);
    for (let x = 0; x < cols; x++) {
        grid[x] = new Array(rows);
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid[x][y] = new Node(x, y);

            if (x === 0 && y === 0) {
                start = grid[x][y];
                start.wall = false;
            } else if (x === cols-1 && y === rows-1) {
                target = grid[x][y];
                target.wall = false;
            }
        }
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid[x][y].addNeighbors();
        }
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = null;
        this.wall = Math.random() < 0.1;
    }
    draw(color = 'white') {
        ctx.fillStyle = this.wall ? '#0D0208' : color;
        ctx.fillRect(this.x * nodeSize, this.y * nodeSize, nodeSize, nodeSize);
        ctx.strokeStyle = '#0D0208';
        ctx.strokeRect(this.x * nodeSize, this.y * nodeSize, nodeSize, nodeSize);
    }
    addNeighbors() {
        let x = this.x;
        let y = this.y;
        if (x < cols - 1) {
            this.neighbors.push(grid[x+1][y]);
        }
        if (x > 0) {
            this.neighbors.push(grid[x-1][y]);
        }
        if (y < rows - 1) {
            this.neighbors.push(grid[x][y+1]);
        }
        if (y > 0) {
            this.neighbors.push(grid[x][y-1]);
        }
        if (x > 0 && y > 0) {
            this.neighbors.push(grid[x-1][y-1]);
        }
        if (x < cols - 1 && y > 0) {
            this.neighbors.push(grid[x+1][y-1]);
        }
        if (x > 0 && y < rows - 1) {
            this.neighbors.push(grid[x-1][y+1]);
        }
        if (x < cols - 1 && y < rows - 1) {
            this.neighbors.push(grid[x+1][y+1]);
        }
    }
}

createGrid(1600, 800, 50, 25);
initialiseNodes();
openSet.push(start);

function vizualizeAStart() {
    let id = requestAnimationFrame(vizualizeAStart);
    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        removeFromArray(openSet, current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + heuristic(neighbor, current);

                let newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, target);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }

    } else {
        console.log('no path available');
        noSolution = true;
        cancelAnimationFrame(id);
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].draw('#003B00');
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].draw('#00FF41');
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].draw('#008F11');
    }

    if (!noSolution) {
        path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
    }

    for (let i = 0; i < path.length; i++) {
        path[i].draw('#93A537');
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    for (let i = 0; i < path.length; i++) {
        
        ctx.lineTo(path[i].i * (nodeSize * 1.5), path[i].j * (nodeSize * 1.5));
    }
    
    ctx.stroke();
    ctx.closePath();

    if (current === target) {
        cancelAnimationFrame(id);
    }
}

vizualizeAStart();