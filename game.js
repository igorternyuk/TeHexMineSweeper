const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
var isGamePaused = false;
var isGameOver = false;
//const RADIUS = 25;
//const VERTEX_NUMBER = 6;
//const DX = 2 * RADIUS * Math.cos(Math.PI / VERTEX_NUMBER);
//const DY = RADIUS * (1 + Math.sin(Math.PI / VERTEX_NUMBER));
const ROWS = 10;
const COLS = 10;
const TILE_SIZE = 40;
var grid;

function preload(){
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(2);
  grid = createGrid(ROWS, COLS);
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


function startNewGame(){

}


function gameOver(){}


function mouseClicked(){
	if( mouseButton === LEFT){
		console.log("mouseX = ", mouseX, " mouseY = ", mouseY);
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
					grid[y][x].value = 1;
					heighbours = getNeighbours(x,y);
					for(let i = 0; i < neighbours.length; ++i){
						neighbours[i].value = 3;
					}
					break outer;
				}
			}
		}
	} else if(mouseButton === RIGHT){

	} else if(mouseButton === CENTER){

	}
}

function getNeighbours(x,y){
	neighbours = [];
	if( y % 2 === 0){
		for(let dy = -1; dy <= 1; ++dy){
			for(let dx = -1; dx <= 0; ++dx){
				if(dx === 0 && dy === 0) continue;
				nx = x + dx;
				ny = y + dy;
				if(isGridCoordinatesValid(nx,ny)){
					neighbours.push(grid[ny][nx]);
				}
			}		
		}
		if(isGridCoordinatesValid(x + 1,y)){
			neighbours.push(grid[y][x + 1]);
		}
	} else {
		for(let dy = -1; dy <= 1; ++dy){
			for(let dx = 0; dx <= 1; ++dx){
				if(dx === 0 && dy === 0) continue;
				nx = x + dx;
				ny = y + dy;
				if(isGridCoordinatesValid(nx,ny)){
					neighbours.push(grid[ny][nx]);
				}
			}		
		}
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