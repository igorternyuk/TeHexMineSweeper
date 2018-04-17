const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
var isGamePaused = false;
var isGameOver = false;
const ROWS = 10;
const COLS = 10;
const MINE_NUMBER = 10;
var grid;
var isFirstMove = true;
var GameState = Object.freeze({ PLAY: 0, VICTORY: 1, DEFEAT: 2 });
var gameState = GameState.PLAY;

function preload(){
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(5);
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

function setMines(number){
	for(let i = 0; i < number; ++i){
		let counter = 0;
		inner:
		while(counter < 200){
			randX = floor(random(0,COLS));
			randY = floor(random(0,ROWS));
			console.log("randX = ", randX, " randY = ", randY);
			if(isGridCoordinatesValid(randX, randY)) {
				first = (grid[randY][randX].state !== CellState.REVEALED);
				second = !grid[randY][randX].isMined;
				console.log("first = ", first, " second = ", second);
				console.log("grid[randY][randX].state = ", grid[randY][randX].state);
				if((grid[randY][randX].state !== CellState.REVEALED) && !grid[randY][randX].isMined){
					grid[randY][randX].isMined = true;
					break inner;
				}
			}
			++counter;
		}
	}
	countMinesAround();
}

function clearField(){
	for(let y = 0; y < grid.length; ++y){
		for(let x = 0; x < grid[y].length; ++x){
			grid[y][x].state = CellState.CLOSED;
			grid[y][x].isMined = false;
		}
	}
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
	clearField();
	gameState = GameState.PLAY;
	isFirstMove = true;
}

function mouseClicked(){
	//console.log("mouseX = ", mouseX, " mouseY = ", mouseY);
	if(gameState !== GameState.PLAY){
		console.log("gameState = ", gameState);
		return;
	}
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
				if( mouseButton === LEFT){
					reveal(x,y);
					
				} else if(mouseButton === CENTER){
					grid[y][x].nextState();
				}
				break outer;
			}
		}
	}

}

function reveal(x,y){
	console.log("reveal x = ", x, " y = ", y);
	if(isGridCoordinatesValid(x,y)){
		if(grid[y][x].state === CellState.REVEALED){
			return;
		}
		grid[y][x].reveal();
		if(grid[y][x].isMined){
			gameState = GameState.DEFEAT;
			return;
		}
		if(isFirstMove){
			isFirstMove = false;
			setMines(MINE_NUMBER);
		}
		
		if(grid[y][x].minesAround > 0){
			return;
		}
		neighbours = getNeighbours(x,y);
		for(let i = 0; i < neighbours.length; ++i){
			reveal(neighbours[i].x, neighbours[i].y);
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

function renderScore(){

}

function renderGameStatus(){
	if(gameState === GameState.VICTORY){
		fill(0,255,0);
		textSize(64);
		text("You won!!!", CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2);
	} else if(gameState === GameState.DEFEAT){
		fill(255,0,0);
		textSize(64);
		text("You lost!!!", CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2);
	}
}

function draw() {
	background(200);
	drawHexGrid(grid);
	renderGameStatus();
}

function drawHexGrid(grid){	
	for (let y = 0; y < grid.length; ++y) {
		for(let x = 0; x < grid[y].length; ++x){
			fill(0, 0, 255);
			grid[y][x].render();
		}
	}
}