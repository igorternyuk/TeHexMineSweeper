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
		this.exploded = false;
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

	getColorByMineCount(mineCount){
		switch(mineCount){
			case 1:
				return "#9a0606";
			case 2:
				return "#ff5079";
			case 3:
				return "#723584";
			case 4:
				return "#0a8d27";
			case 5:
				return "#d2210d";
			default:
				return "#c87d5d";
		}
	}

	render(){
		if( this.state === CellState.REVEALED){
			if(this.exploded){
				fill(255,0,0);
			} else {
				fill("#beeeef");
			}
			
		} else {
			fill("#104e8b");
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
			if(gameState === GameState.DEFEAT && !this.isMined){
				image(imageFalseSuggestedMine, this.cx - SCALE_IMAGE * IMAGE_SIZE / 2,
				 this.cy - SCALE_IMAGE * IMAGE_SIZE / 2, SCALE_IMAGE * IMAGE_SIZE,
				 SCALE_IMAGE * IMAGE_SIZE, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
			} else {
				image(imageSuggestMine, this.cx - SCALE_IMAGE * IMAGE_SIZE / 2,
				 this.cy - SCALE_IMAGE * IMAGE_SIZE / 2, SCALE_IMAGE * IMAGE_SIZE,
				  SCALE_IMAGE * IMAGE_SIZE, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
			}
			
			/*fill(255,255,0);
			//textSize(32);
			//text("F", this.cx - 10, this.cy + 10);
			push();
			translate(this.cx, this.cy);
			rect(-5, -10, 3, 20);
			fill(255,0,0);
			triangle(-5, -10, 10, -10, -5, 0);
			pop();*/
		} else if( this.state === CellState.QUESTIONED){
			fill(255,0,0);
			textSize(48);
			text("?", this.cx - 17, this.cy + 17);
		} else if( this.state === CellState.REVEALED){
			if(this.isMined){
				if(this.exploded){
					//fill(255,0,0);
					image(imageGameOverMine, this.cx - SCALE_IMAGE * IMAGE_SIZE / 2,
					 this.cy - SCALE_IMAGE * IMAGE_SIZE / 2, SCALE_IMAGE * IMAGE_SIZE,
					  SCALE_IMAGE * IMAGE_SIZE, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

				} else {
					//fill("#2f1c26");
					image(imageFinishMine, this.cx - SCALE_IMAGE * IMAGE_SIZE / 2,
					 this.cy - SCALE_IMAGE * IMAGE_SIZE / 2, SCALE_IMAGE * IMAGE_SIZE,
					  SCALE_IMAGE * IMAGE_SIZE, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
				}

				/*strokeWeight(0);
				push();
				translate(this.cx,this.cy - 2);
				triangle(0, -10, -12, 10, 12, 10);
				rotate(PI);
				translate(0, -6);
				triangle(0, -10, -12, 10, 12, 10);
				pop();
				strokeWeight(1);*/
			} else {
				if(this.minesAround > 0){
					fill(this.getColorByMineCount(this.minesAround));
					textSize(48)
					text(this.minesAround, this.cx - 17, this.cy + 17);	
				}
			}
		}
		
	}
}

Cell.VERTEX_NUMBER = 6;
Cell.RADIUS = 40;
Cell.DX = 2 * Cell.RADIUS * Math.cos(Math.PI / Cell.VERTEX_NUMBER);
Cell.DY = Cell.RADIUS * (1 + Math.sin(Math.PI / Cell.VERTEX_NUMBER));
