function initWebGl() {
	let vertexShaderSource, fragmentShaderSource;
	loadResource('/shaders/vertexShader.glsl')
	.then((result) => {
		vertexShaderSource = result;
		return loadResource('/shaders/fragmentShader.glsl');
	})
	.then((result) => {
		fragmentShaderSource = result;
		return startWebGl(vertexShaderSource, fragmentShaderSource);
	})
	.catch((err) => {
		console.error(err);
	})
}

function startWebGl(vertexShaderSource, fragmentShaderSource) {
	let canvas = document.getElementById('gl-canvas');
	let gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL. U mad bro');
		return;
	}

	canvas.width = gl.canvas.clientWidth;
	canvas.height = gl.canvas.clientHeight;
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.shaderSource(fragmentShader, fragmentShaderSource);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(vertexShader));
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(fragmentShader));
	}
	
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.validateProgram(program);

	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error(gl.getProgramInfoLog(program));
		return;
	}

	let vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	let vertexArray = [
		0.0, 0.5, 1.0, 0.0, 0.0,
		0.4, -0.5, 0.0, 1.0, 0.0,
		-0.4, -0.5, 0.0, 0.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	let positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');
	
	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		0 * Float32Array.BYTES_PER_ELEMENT
	)

	gl.enableVertexAttribArray(positionAttribLocation);

	var colorAttribLocation = gl.getAttribLocation(program, 'vertexColor');

	gl.vertexAttribPointer(
		colorAttribLocation, // ссылка на атрибут
		3, // кол-во элементов на 1 итерацию
		gl.FLOAT, // тип данных
		gl.FALSE, // нормализация
		5 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
		2 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
	);

	gl.enableVertexAttribArray(colorAttribLocation);

	gl.clearColor(0.75, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

document.addEventListener('DOMContentLoaded', () => {
	initWebGl();
})