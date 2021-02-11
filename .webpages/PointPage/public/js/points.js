var points = []
Array.prototype.drawConnections = function(thickness=1){
	for (var i = 0; i < this.length-1; i++) {
			for (var j = i+1; j < this.length; j++) {
				a = this[i];
				b = this[j];

				if (!a.connections.includes(b)) continue

				ctx.lineWidth = thickness
				ctx.strokeStyle = 'white'

				ctx.beginPath()
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}
		}	
}

mouse = {x:0, y:0, out:false}
document.onmousemove = e => {
	mouse = {x: e.pageX, y: e.pageY, out:false}
}


document.addEventListener("mouseout", function(e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
        	mouse.out = true
        }
    });

class Point {
	constructor(x, y, speed=1, direction=1) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.direction = direction;
		this.connections = [];
		this.colour = ['red', 'green', 'blue'][Math.floor(Math.random()*3)];
	}

	move() {
		this.x += Math.cos(this.direction)*this.speed;
		this.y -= Math.sin(this.direction)*this.speed;
	}

	draw(size=5) {
		ctx.fillStyle = this.colour;

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x, this.y, size, 0, 2*Math.PI)
		ctx.fill()
	}

	updateConnections(radius) {
		var closePoints = points.filter( p => {
			return Math.sqrt((p.x-this.x)**2 + (p.y-this.y)**2) <= radius
		});



		// Add points that are close enough
		closePoints.forEach(point => {
			if (this.connections.includes(point)) return
			this.connections.push(point);
		})

		// Remove points that aren't close enough
		this.connections = this.connections.filter(p => closePoints.includes(p));
	}
}
spawnRandomPoint = () => {
	points.push(new Point(
		Math.random() * window.innerWidth,
		Math.random() * window.innerHeight,
		Math.random()*0.9 + 0.1,
		Math.random()*Math.PI*2
	))
}

spawnRandomPointNearCursor = () => {
	points.push(new Point(
		Math.random() * 100 + mouse.x - 50,
		Math.random() * 100 + mouse.y - 50,
		Math.random()*0.9 + 0.1,
		Math.random()*Math.PI*2
	))
}


function backgroundAnimationLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	points.drawConnections();
	points.forEach( point => {
		if ( (point.x < 0 || point.x > window.innerWidth) || (point.y < 0 || point.y > window.innerHeight) ) {
			// The point is out of bounds

			// So OBLITERATE it from existence >:(
			points.splice(points.indexOf(point), 1);

			// Max 50 points sustainable to avoid clutter
			if (points.length >= 50) return;

			// Spawn around cursor if mouse is within the window and the window is focused
			document.hasFocus() && !mouse.out ? spawnRandomPointNearCursor() : spawnRandomPoint();
			return;
		}
		point.move();
		point.updateConnections(200);
		point.draw();
	}) 

	requestAnimationFrame(backgroundAnimationLoop);
}


function startBackground(opacity=0.2, startcount=50) {
	canvas.style.opacity = opacity;
	Array(startcount).fill().forEach(spawnRandomPoint)
	requestAnimationFrame(backgroundAnimationLoop);
}
