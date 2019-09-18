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

var gl, program, 
	vertexArray = [
	//  X     Y    Z    R    G    B
		 0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
		-0.5,  0.0, 0.0, 1.0, 0.0, 0.0,
		 0.5,  0.0, 0.0, 1.0, 0.0, 0.0,

		-0.5,  0.5, 0.0, 0.0, 1.0, 0.0,
		 0.5,  0.5, 0.0, 0.0, 1.0, 0.0,
		 0.0,  0.0,-0.5, 0.0, 1.0, 0.0,
	];

function startWebGl(vertexShaderSource, fragmentShaderSource) {
	let canvas = document.getElementById('gl-canvas');
	gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL. U mad bro');
		return;
	}

	canvas.width = gl.canvas.clientWidth;
	canvas.height = gl.canvas.clientHeight;
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	program = createProgram(gl, vertexShader, fragmentShader);
	
	draw();
}

function draw() {
	let vertexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	let verticesNumber = vertexArray.length / 6;
	
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

	gl.clearColor(0.75, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, verticesNumber);
}

document.addEventListener('DOMContentLoaded', () => {
	initWebGl();
})