/*
my.namespace.ColorEnum = {
    RED : 0,
    GREEN : 1,
    BLUE : 2
}

// later on

if(currentColor == my.namespace.ColorEnum.RED) {
 

 var DaysEnum = Object.freeze({"monday":1, "tuesday":2, "wednesday":3, ...})

 var SIZE = {
  SMALL : {value: 0, name: "Small", code: "S"}, 
  MEDIUM: {value: 1, name: "Medium", code: "M"}, 
  LARGE : {value: 2, name: "Large", code: "L"}
};

var currentSize = SIZE.MEDIUM;
if (currentSize == SIZE.MEDIUM) {
  // this alerts: "1: Medium"
  alert(currentSize.value + ": " + currentSize.name);
} 
*/

var CellState = Object.freeze({ CLOSED: 0, FLAGGED: 1, QUESTIONED: 2, REVEALED: 3 });

class Cell{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.value = 0;
		this.cx = Cell.DX * x + ((y % 2 == 0) ? Cell.DX / 2 : Cell.DX);
		this.cy = Cell.DY * y + Cell.RADIUS;
		this.state = CellState.CLOSED;
		this.isMined = false;
		this.minesAround = 0;
	}

	isPointInside(x,y){
		let angle = PI / Cell.VERTEX_NUMBER;
		if(x >= this.cx - Cell.DX / 2 && x < this.cx + Cell.DX / 2 &&
			y < this.cy + tan(angle) * (x - this.cx) + Cell.RADIUS &&
			y > this.cy + tan(angle) * (x - this.cx) - Cell.RADIUS &&
		    y < this.cy + tan(-angle) * (x - this.cx) + Cell.RADIUS &&
			y > this.cy + tan(-angle) * (x - this.cx) - Cell.RADIUS){
			return true;
		}
		return false;
	}

	nextState(){
		if(this.state === CellState.CLOSED){
			this.state = CellState.FLAGGED;
		} else if(this.state === CellState.FLAGGED){
			this.state = CellState.QUESTIONED;
		} else if(this.state === CellState.QUESTIONED){
			this.state = CellState.CLOSED;
		} else if(this.state === CellState.REVEALED){
			return;
		}
	}

	reveal(){
		if(this.state === CellState.CLOSED){
			this.state = CellState.REVEALED;
		}
	}

	render(){
		if( this.state === CellState.REVEALED){
			fill("#fed85f");
		} else {
			fill("#008080");
		}

		beginShape();
		for(let i = 0; i < Cell.VERTEX_NUMBER; ++i){
			let angle = map(i,0,Cell.VERTEX_NUMBER,0,TWO_PI) + 0.5 * PI;
			let x = this.cx + Cell.RADIUS * cos(angle);
			let y = this.cy + Cell.RADIUS * sin(angle);
			vertex(x,y);
		}
		endShape(CLOSE);
		
		if( this.state === CellState.FLAGGED){
			fill(255,0,0);
			textSize(32);
			text("F", this.cx - 10, this.cy + 10);
		} else if( this.state === CellState.QUESTIONED){
			fill(255,0,0);
			textSize(32)
			text("?", this.cx - 10, this.cy + 10);
		} else if( this.state === CellState.REVEALED){
			if(this.isMined){
				fill("#66023c");
				ellipse(this.cx,this.cy,20);
			} else {
				if(this.minesAround > 0){
					fill(255,0,0);
					textSize(32)
					text(this.minesAround, this.cx - 10, this.cy + 10);	
				}
			}
		}
		
	}
}

Cell.VERTEX_NUMBER = 6;
Cell.RADIUS = 25;
Cell.DX = 2 * Cell.RADIUS * Math.cos(Math.PI / Cell.VERTEX_NUMBER);
Cell.DY = Cell.RADIUS * (1 + Math.sin(Math.PI / Cell.VERTEX_NUMBER));
