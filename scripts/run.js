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
		delay: 25
	};
	
	var layer = new Konva.Layer();	
	
	stage.on('contentClick', function(e){
		var g = 1000; //acceleration due to gravity;
		var pos = stage.getPointerPosition();
		var circle = new Konva.Circle({
			x: pos.x,
			y: pos.y,
			fill: Konva.Util.getRandomColor(),
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
			lastPos,
			ui = Math.sqrt(2 * g * h),
			reverse = function() {
				if(g > 0) {
					u = ui					
				}
				else {
					u = 0;
				}
				g = -g;
			},
			T = Math.sqrt(2 * h / g) * 1000;

		var anim = new Konva.Animation(function(frame){
			if(!start) { console.log('time reset'); start = getTime(); }
			var now = getTime();
			var diff = now - start;

			if(diff > params.delay) {

				var y = distance(diff);
				var ypos;
				//debug({state: 'before', u: u, g: g, y: circle.position().y, dist: y});				
				if(u === 0) {					
					ypos = pos.y + y;
					circle.y(ypos);					
					debug({ d: 'down', g: g, ypos: ypos, u: u });
				}
				else { // when u with initial value...
					ypos = bounds.max.y - y - circle.radius();
					circle.y(ypos);
					var cc = circle.y();
					if(ypos <= pos.y) {						
						circle.y(pos.y);
					}
					debug({ d: 'up', g: g, ypos: ypos, u : u, 'pos.y': pos.y });					
				}
				if(diff >= T) {
					if(g > 0) {
						circle.y(bounds.max.y - circle.radius());						
					}
					else {
						circle.y(pos.y);
					}
					reverse();
					start = null;
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
	//console.log(JSON.stringify(obj, null, 2));
}

function getTime() {
	return new Date().getTime();
}