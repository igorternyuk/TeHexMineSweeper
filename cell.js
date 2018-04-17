class Cell{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.value = 0;
		this.cx = Cell.DX * x + ((y % 2 == 0) ? Cell.DX / 2 : Cell.DX);
		this.cy = Cell.DY * y + Cell.RADIUS;
	}

	isPointInside(x,y){
		let angle = PI / Cell.VERTEX_NUMBER;
		/*console.log("this.x = ", this.cx, " this.y = ", this.cy);
		console.log("x >= this.x - Cell.DX / 2 -> ", (x >= this.cx - Cell.DX / 2));
		console.log("x < this.x + Cell.DX / 2 -> ", (x < this.cx + Cell.DX / 2));
		console.log("y < this.y + tan(angle) * (x - this.x) + Cell.RADIUS -> ",(y < this.cy + tan(angle) * (x - this.cx) + Cell.RADIUS));
		console.log("y > this.y + tan(angle) * (x - this.y) - Cell.RADIUS -> ",(y > this.cy + tan(angle) * (x - this.cx) - Cell.RADIUS));
		console.log("y < this.y + tan(angle + 0.5 * PI) * (x - this.x) + Cell.RADIUS -> ", (y < this.cy + tan(-angle) * (x - this.cx) + Cell.RADIUS));
		console.log("y > this.y + tan(angle + 0.5 * PI) * (x - this.x) - Cell.RADIUS -> ",(y > this.cy + tan(-angle) * (x - this.cx) - Cell.RADIUS));*/
		if(x >= this.cx - Cell.DX / 2 && x < this.cx + Cell.DX / 2 &&
			y < this.cy + tan(angle) * (x - this.cx) + Cell.RADIUS &&
			y > this.cy + tan(angle) * (x - this.cx) - Cell.RADIUS &&
		    y < this.cy + tan(-angle) * (x - this.cx) + Cell.RADIUS &&
			y > this.cy + tan(-angle) * (x - this.cx) - Cell.RADIUS){
			return true;
		}
		return false;
	}

	render(){
		if(this.value === 1){
			fill(255,0,0);
		} else if(this.value === 3) {
			fill(0,255,0);
		} else {
			fill(0,0,255);
		}
		beginShape();
		for(let i = 0; i < Cell.VERTEX_NUMBER; ++i){
			let angle = map(i,0,Cell.VERTEX_NUMBER,0,TWO_PI) + 0.5 * PI;
			let x = this.cx + Cell.RADIUS * cos(angle);
			let y = this.cy + Cell.RADIUS * sin(angle);
			vertex(x,y);
		}
		endShape(CLOSE);
	}
}

Cell.VERTEX_NUMBER = 6;
Cell.RADIUS = 25;
Cell.DX = 2 * Cell.RADIUS * Math.cos(Math.PI / Cell.VERTEX_NUMBER);
Cell.DY = Cell.RADIUS * (1 + Math.sin(Math.PI / Cell.VERTEX_NUMBER));
