const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
var isGamePaused = false;
var isGameOver = false;
const ROWS = 10;
const COLS = 10;
const TILE_SIZE = 40;
var grid;

function preload(){
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(5);
  grid = createGrid(ROWS, COLS);
  setMines(50);
}

function createGrid(rows, cols){
	let grid = new Array(rows);
	for(let i = 0; i < grid.length; ++i){
		grid[i] = new Array(cols);
	}
	for (let y = 0; y < rows; y++) {
		for(let x = 0; x < cols; ++x){
			grid[y][x] = new Cell(x,y);
		}
	}
	return grid;
}

function setMines(number){
	for(let i = 0; i < number; ++i){
		inner:
		while(true){
			randX = floor(random(0,ROWS));
			randY = floor(random(0,COLS));
			if(!grid[randY][randX].isMined){
				grid[randY][randX].isMined = true;
				break inner;
			}
		}
	}
	countMinesAround();
}

function countMinesAround(){
	for(let y = 0; y < grid.length; ++y){
		for(let x = 0; x < grid[y].length; ++x){
			neighbours = getNeighbours(x,y);
			let minesTotal = 0;
			for(let i = 0; i < neighbours.length; ++i){
				if(neighbours[i].isMined){
					++minesTotal;
				}
			}
			grid[y][x].minesAround = minesTotal;
		}
	}
}

function startNewGame(){

}


function gameOver(){}


function mouseClicked(){
	console.log("mouseX = ", mouseX, " mouseY = ", mouseY);
	var clickedRow, clickedCol;
	mx = floor(mouseX / Cell.DX);
	my = floor(mouseY / Cell.DY);
	min_x = mx - 1;
	max_x = mx + 1;
	min_y = my - 1;
	max_y = my + 1;		
	outer:
	for (let y = min_y; y <= max_y; y++) {
		for(let x = min_x; x <= max_x; ++x){
			if(isGridCoordinatesValid(x,y) && 
				grid[y][x].isPointInside(mouseX,mouseY)){
				clickedRow = y;
				clickedCol = x;
				if( mouseButton === LEFT){
					grid[clickedRow][clickedCol].reveal();
				} else if(mouseButton === CENTER){
					grid[clickedRow][clickedCol].nextState();
				}
			}
		}
	}

}

function getNeighbours(x,y){
	neighbours = [];
	var dx_min, dx_max;
	if( y % 2 === 0){
		dx_min = -1;
		dx_max = 0;
	} else {
		dx_min = 0;
		dx_max = 1;		
	}
	for(let dy = -1; dy <= 1; ++dy){
		for(let dx = dx_min; dx <= dx_max; ++dx){
			if(dx === 0 && dy === 0) continue;
			nx = x + dx;
			ny = y + dy;
			if(isGridCoordinatesValid(nx,ny)){
				neighbours.push(grid[ny][nx]);
			}
		}		
	}
	if(y % 2 === 0){
		if(isGridCoordinatesValid(x + 1,y)){
			neighbours.push(grid[y][x + 1]);
		}
	} else {
		if(isGridCoordinatesValid(x - 1,y)){
			neighbours.push(grid[y][x - 1]);
		}	
	}
	return neighbours;
}

function mouseToGridCoords(mousePos){
	mx = mousePos.x;
	my = mousePos.y;
}

function isGridCoordinatesValid(row, col){
	return row >= 0 && row < grid.length
	 && col >= 0 && col < grid[row].length;
}


function keyPressed(){
	if(key === ' '){
		for(let y = 0; y < grid.length; ++y){
			for (var x = 0; x < grid[y].length; ++x) {
				grid[y][x].reveal();
			}
		}
	}
	switch(key){
		default:
			break;
	}
}

function update(){

}

function renderScore(){

}

function renderGameStatus(){

}

function draw() {
	background(200);
	drawHexGrid(grid);
}

function drawHexGrid(grid){	
	for (let y = 0; y < grid.length; ++y) {
		for(let x = 0; x < grid[y].length; ++x){
			fill(0, 0, 255);
			grid[y][x].render();
		}
	}
}