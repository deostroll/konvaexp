window.addEventListener('load', function() {
	var el = document.getElementById('stage');
	run(el);
}, false);
function computeDimensions(el) {
	var offset = {
		top: el.offsetTop,
		left: el.offsetLeft
	};

	var width = el.parentNode.clientWidth;
	var height = window.innerHeight - offset.top - offset.left;
	return {
		canvasWidth: width,
		canvasHeight: height
	}
}
function run(el) {
	var d = computeDimensions(el);
	console.log(d);
	var stage = new Konva.Stage({
		container: el,
		height: d.canvasHeight,
		width: d.canvasWidth
	});

	var center = {
		x: stage.width()/2,
		y: stage.height()/2
	};

	console.log(center);

	var layer = new Konva.Layer();
	var rect = new Konva.Rect({
		x: center.x,
		y: center.y,
		width: 100,
		height: 100,
		stroke: 'blue',
		offset: {
			x: 50,
			y: 50
		}
	});
	layer.add(rect);
	stage.add(layer);
	var last;
	var delay = 0;
	var degree = 3;
	var anim = new Konva.Animation(function (frame){
		if(!last) {
			last = frame.time
		}

		if((frame.time - last) > delay) {
			rect.rotate(degree);
			last = frame.time;
			return;
		}

		return false;
	}, layer);

	anim.start();
}