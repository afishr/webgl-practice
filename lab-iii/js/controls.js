let controls = {};
function initControls() {
	let controlsEl = document.getElementsByClassName('controls');	

	for (const i of controlsEl) {
		controls[i.id] = i.value;

		i.addEventListener('input', (e) => {
			controls[e.target.id] = e.target.value;
		});
	}	

	// staticMove();
}

function toRGB(hex) {
	return hex.match(/[A-Za-z0-9]{2}/g).map((v) => {
		return parseInt(v, 16) / 255 
	});
}

function staticMove() {
	let angle = performance.now() / 1000 / 6 * 2 * Math.PI;

	controls.l1x = Math.sin(angle);
	controls.l1y = Math.sin(angle);

	controls.l2x = Math.cos(angle * 2);
	controls.l2y = Math.cos(angle * 2);

	controls.l3x = Math.sin(angle * 2);
	controls.l3y = Math.cos(angle * 2);

	requestAnimationFrame(staticMove);
}