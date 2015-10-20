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

	var params = {
		delay: 100
	};
	
	var g = 10; //acceleration due to gravity;
	
	
	var layer = new Konva.Layer();	
	
	stage.on('contentClick', function(e){
		var pos = stage.getPointerPosition();
		var circle = new Konva.Circle({
			x: pos.x,
			y: pos.y,
			fill: 'red',
			radius: 20
		});
		var h = bounds.max.y - pos.y - circle.radius();		
		layer.add(circle).draw();
		var last,
			start,
			u = 0,
			distance = function(time) {
				var ts = time/1000;
				return u * ts + 0.5 * g * ts *  ts;
			},
			lastPos;

		var anim = new Konva.Animation(function(frame){
			if(!start) { start = getTime(); }
			var now = getTime();
			var diff = now - start;

			if(diff > params.delay) {

				var y = distance(diff);
				//debug({state: 'before', u: u, g: g, y: circle.position().y, dist: y});				
				if(u === 0) {					
					var cl = circle.y() + circle.radius();
					circle.y(pos.y + y);
					if(cl >= bounds.max.y) {
						circle.move({
							y: bounds.max.y - cl
						});
						layer.draw();						
						console.log('reverse u > 0');
						u = Math.sqrt(2 * g * h);
						g = -g;												
						start = null;
						return false;
					}
				}
				else { // when u < 0
					console.log(diff, y, circle.y());
					var cc = circle.y()
					cc = cc - y;
					circle.y(cc);
					if(cc <= pos.y) {
						circle.y(pos.y);
						layer.draw();						
						console.log('reverse u = 0');
						u = 0;
						g = -g;
						start = null;
						return false;
					}
				}				
				
				return;
			}
			return false;
		}, layer);
		start = getTime();
		anim.start();
	});

	
	var line = new Konva.Line({
		stroke: 'blue',
		x: stage.getWidth() / 2,
		y: stage.getHeight() /2,
		points: [0,-10, 0,10, 0,0, -10,0, 10, 0]
	});
	layer.add(line);
	
	stage.add(layer);		
	
}

function debug(obj) {
	console.log(JSON.stringify(obj, null, 2));
}

function getTime() {
	return new Date().getTime();
}