function initWebGl() {
	let vertexShaderSource, fragmentShaderSource;
	loadResource('./shaders/vertexShader.glsl')
	.then((result) => {
		vertexShaderSource = result;
		return loadResource('./shaders/fragmentShader.glsl');
	})
	.then((result) => {
		fragmentShaderSource = result;
		return startWebGl(vertexShaderSource, fragmentShaderSource);
	})
	.catch((err) => {
		console.error(err);
	})
}

var gl, program, canvas,
	vertexArray = [
	//X      Y     Z      R    G    B
	 0.0,  0.5, 0.0,   1.0, 1.0, 0.0,
	-0.5, -0.5, 0.0,   0.7, 0.0, 1.0,
	 0.5, -0.5, 0.0,   0.1, 1.0, 0.6,
	];

var boxVertices = 
[ // X, Y, Z           R, G, B
	// Top
	-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
	-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
	1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
	1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

	// Left
	-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
	-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
	-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
	-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

	// Right
	1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
	1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
	1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
	1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

	// Front
	1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
	1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

	// Back
	1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
	1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

	// Bottom
	-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
	-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
	1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
	1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
];

var boxIndices =
[
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];

function startWebGl(vertexShaderSource, fragmentShaderSource) {
	canvas = document.getElementById('gl-canvas');
	gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL. U mad bro');
		return;
	}

	canvas.width = window.innerWidth
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, window.innerWidth, window.innerHeight);

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	program = createProgram(gl, vertexShader, fragmentShader);
	
	draw();
}

function draw() {
	let vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	let indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	let verticesNumber = vertexArray.length / 6;

	gl.enable(gl.DEPTH_TEST);

	gl.useProgram(program);
	
	let positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // ссылка на атрибут
		3, // кол-во элементов на 1 итерацию
		gl.FLOAT, // тип данных
		gl.FALSE, // нормализация
		6 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
		0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	var colorAttribLocation = gl.getAttribLocation(program, 'vertexColor');
	gl.vertexAttribPointer(
		colorAttribLocation, // ссылка на атрибут
		3, // кол-во элементов на 1 итерацию
		gl.FLOAT, // тип данных
		gl.FALSE, // нормализация
		6 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
		3 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
	);
	gl.enableVertexAttribArray(colorAttribLocation);

	let matWorldUniformLocation = gl.getUniformLocation(program, 'matWorld');
	let matViewUniformLocation = gl.getUniformLocation(program, 'matView');
	let matProjUniformLocation = gl.getUniformLocation(program, 'matProjection');
	let worldMatrix = new Float32Array(16);
	let viewMatrix = new Float32Array(16);
	let projMatrix = new Float32Array(16);

	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
		
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	let angle = 0;
	let identity = new Float32Array(16);
	glMatrix.mat4.identity(identity);

	function loop() {

		angle = 3.9;
		// angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		
		glMatrix.mat4.rotate(worldMatrix, identity, angle, [1, 1, 0]);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.9, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		// requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);

}

document.addEventListener('DOMContentLoaded', () => {
	initWebGl();
})