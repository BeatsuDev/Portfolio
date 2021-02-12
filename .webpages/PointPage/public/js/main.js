document.onclick = () => points.length < 100 ? spawnRandomPointNearCursor() : 0

setTimeout(startBackground, 500, 0.7);
setTimeout(() => canvas.style.transitionDuration = '.4s', 1500)

const container = document.getElementById('container');
container.style.transform = `translateY(${window.innerHeight}px)`;

// Scroller function
window.addEventListener('wheel', e => {
	if (e.deltaY > 0) {
		container.style.transform = 'translateY(150px)';
		canvas.style.opacity = 0.1;
	} else {
		container.style.transform = `translateY(${window.innerHeight}px)`;
		canvas.style.opacity = 0.7;
	}
})