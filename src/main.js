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
	
	var stage = new Konva.Stage({
		container: el,
		height: d.canvasHeight,
		width: d.canvasWidth
	});

	var center = {
		x: stage.width()/2,
		y: stage.height()/2
	};

	var bounds = {
		center: center,
		max: {
			x: stage.getWidth(),
			y: stage.getHeight()
		}
	};

	console.log(bounds);
	var g = 10; //acceleration due to gravity;
	var delay = 0; // ms
	
	var uniform = function(x) {
		return x * 100 / 5000;
	};
	var layer = new Konva.Layer();	
	//layer.add(rect);
	var mousedown = false;
	var start, end;	
	//layer.add(rect);
	stage.on('contentClick', function(e){
		var pos = stage.getPointerPosition();
		var circle = new Konva.Circle({
			x: pos.x,
			y: pos.y,
			fill: 'red',
			radius: 20
		});
		var distance = (function(y) {
			return function(time) {
				var ts = time/1000;
				if(g < 0) { return bounds.max.y - 0.5 * ts * ts}
				return y + 0.5 * ts * ts * g;
			}
		})(pos.y);
		var h = bounds.max.y - pos.y - circle.radius();
		
		layer.add(circle).draw();
		var last;
		var anim = new Konva.Animation(function(frame) {
			if(!last) {
				last = frame.time;
			}
			if(frame.time - last > delay) {
				var y = distance(frame.time);
				//var y = uniform(frame.time);
				console.log('y:', y + pos.y, 'max.y:', bounds.max.y);
				circle.y(y);				
				if((y + pos.y) > bounds.max.y) {
					console.log('stop');										
				}
				last = frame.time;
				return;
			}			
			return false;
		}, layer);
		anim.start();
	});

	
	var line = new Konva.Line({
		stroke: 'blue',
		x: stage.getWidth() / 2,
		y: stage.getHeight() /2,
		points: [0,-10, 0,10, 0,0, -10,0, 10, 0]
	});
	layer.add(line);
	//console.log(k);
	stage.add(layer);		
	
}