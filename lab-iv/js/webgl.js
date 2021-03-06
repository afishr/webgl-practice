let gl, program, canvas, toDraw = [];
let vertexShaderSource, fragmentShaderSource, externalMesh, externalTexture;

function initWebGl() {
	loadResource('./shaders/vertexShader.glsl')
	.then(result => {
		vertexShaderSource = result;
		return loadResource('./shaders/fragmentShader.glsl');
	})
	.then(result => {
		fragmentShaderSource = result;
		return loadMeshes('./obj/darkDragon.obj');
	})
	.then(result => {
		externalMesh = result.model;
		return loadImage('./obj/darkDragon.jpg');
	})
	.then(result => {
		externalTexture = result;
		return startWebGl();
	})
	.catch(err => {
		console.error(err);
	})
}


function startWebGl() {
	canvas = document.getElementById('gl-canvas');
	gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL. U mad bro');
		return;
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, window.innerWidth, window.innerHeight);

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, innerWidth, innerHeight);

	gl.enable(gl.DEPTH_TEST);

	gl.clearColor(0.75, 0.85, 0.8, 1.0);

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	program = createProgram(gl, vertexShader, fragmentShader);
	gl.useProgram(program);	

	let a = new GlObject(externalMesh, externalTexture, program);

	toDraw.push(a);
	loop();
}

function loop() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// let angle = performance.now() / 1000 / 6 * 2 * Math.PI;
	
	toDraw.map(e => {
		e.setRotation(rotY, rotX, 0);
		e.setCameraPos(0, 0, movZ);
	});

	toDraw.map(e => {
		e.draw();
	});

	requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
	initWebGl();
})