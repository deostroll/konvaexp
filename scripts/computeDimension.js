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