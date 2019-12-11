let canv = document.getElementById('gl-canvas');
let meshLoader = document.getElementById('mesh-loader');
let textureLoader = document.getElementById('texture-loader');
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
	
	if (code == 111)
		meshLoader.click();

	if (code == 116)
		textureLoader.click();

})

meshLoader.addEventListener('input', e => {
	let file = e.target.files[0];
	
	loadMeshes('./obj/' + file.name)
	.then(result => {
		externalMesh = result.model;
		delete toDraw[0];
		toDraw[0] = new GlObject(externalMesh, externalTexture, program);
	})	
});

textureLoader.addEventListener('input', e => {
	let file = e.target.files[0];

	loadImage('./obj/' + file.name)
	.then(result => {
		externalTexture = result;
		console.log(result);
		
		delete toDraw[0];
		toDraw[0] = new GlObject(externalMesh, result, program);
	})
})