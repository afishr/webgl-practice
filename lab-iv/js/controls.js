let canv = document.getElementById('gl-canvas');
let mouse = false;

let cX = 0, cY = 0;
let rotX = 0, rotY = 0;
let movZ = -10;

document.body.style.cursor = 'grab';

window.addEventListener('mouseup', () => {
	mouse = false;
	document.body.style.cursor = 'grab';
});

window.addEventListener('mousedown', () => {
	mouse = true;
	document.body.style.cursor = 'grabbing';
});

canv.addEventListener('mousemove', e => {
	if (mouse) {
		cX = e.movementX / 100;
		cY = -1 * e.movementY / 100;

		rotX += cX;
		rotY += cY;
	}
});

window.addEventListener('keypress', e => {
	let code = e.which || e.keyCode;
	if (code == 45)
		movZ--;
	
	if (code == 61)
		movZ++;	
})