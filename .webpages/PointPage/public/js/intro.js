document.onclick = () => points.length < 100 ? spawnRandomPointNearCursor() : 0

setTimeout(function(){
	startBackground()
}, 1200)