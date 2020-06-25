let canvas = document.querySelector('canvas');

canvas.width = 500;
canvas.height = 500;

let ctx = canvas.getContext('2d');

let cols = 25;
let rows = 25;
let nodeSize = canvas.width / cols;

let stack = new Array(cols);
for (let i = 0; i < cols; i++) {
    stack[i] = new Array(rows);
}

class Node {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.visited = false;
        this.walls = [false, true, true, true];
    }
    highlight() {
        ctx.fillStyle = '#EAF616';
            ctx.fillRect(this.i * nodeSize, this.j * nodeSize, nodeSize, nodeSize);
    }
    draw(color) {
        if (this.visited) {
            ctx.fillStyle = '#7FB515';
            ctx.fillRect(this.i * nodeSize, this.j * nodeSize, nodeSize, nodeSize);
        }

        let x = this.i * nodeSize;
        let y = this.j * nodeSize;
        ctx.beginPath();
        if (this.walls[0]) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + nodeSize, y);
        }
        if (this.walls[1]) {
            ctx.moveTo(x + nodeSize, y);
            ctx.lineTo(x + nodeSize, y + nodeSize);
        }
        if (this.walls[2]) {
            ctx.moveTo(x + nodeSize, y + nodeSize);
            ctx.lineTo(x, y + nodeSize);
        }
        if (this.walls[3]) {
            ctx.moveTo(x, y + nodeSize);
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = '#4A6E1C';
        ctx.stroke();
        ctx.closePath();   
    }
    checkNeighbors() {
        let neighbors = [];
        let top, right, bottom, left;
        if (this.j > 0) {
            top = grid[this.i][this.j - 1];
        }
        if (this.i < cols-1) {
            right = grid[this.i + 1][this.j];
        }
        if (this.j < rows - 1) {
            bottom = grid[this.i][this.j + 1];
        }
        if (this.i > 0) {
            left = grid[this.i - 1][this.j];
        }

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            return neighbors[Math.floor(Math.random() * neighbors.length)];
        } else {
            return undefined;
        }
    }
}

removeWalls = function(a, b) {
    if (a.i - b.i === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }else if (a.i - b.i === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    }else if (a.j - b.j === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }else if (a.j - b.j === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    }
} 

let grid = new Array(cols);
for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
}

for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        grid[i][j] = new Node(i, j);
    }
}

let current = grid[0][0];

animation = function() {
    requestAnimationFrame(animation);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].draw();
        }
    }

    current.visited = true;
    current.highlight();
    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0) {
        let node = stack.pop();
        current = node;
    }
}

animation();