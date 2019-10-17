class GlObject {
	constructor(vertices, indicies, program) {
		this.program = program;

		this.translation = [0, 0, 0];
		this.scale = [1, 1, 1];
		this.rotation = [0, 0, 0];
		this.vertices = vertices;
		this.indicies = indicies;

		this.center = [0, 0, 0];
		this.cameraPos = [0, 0, -10];
		this.cameraRot = [0, 0, 0];
		this.near = 0.1;
		this.far = 1000.0;
		this.fov = 45;

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies), gl.STATIC_DRAW);

		
		this.identity = new Float32Array(16);
		this.worldMatrix = new Float32Array(16);
		this.viewMatrix = new Float32Array(16);
		this.projMatrix = new Float32Array(16);

		glMatrix.mat4.identity(this.worldMatrix);
		glMatrix.mat4.identity(this.viewMatrix);
		glMatrix.mat4.identity(this.projMatrix);
		glMatrix.mat4.identity(this.identity);

		this.positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');
		this.colorAttribLocation = gl.getAttribLocation(program, 'vertexColor');

		this.matWorldUniformLocation = gl.getUniformLocation(program, 'matWorld');
		this.matViewUniformLocation = gl.getUniformLocation(program, 'matView');
		this.matProjUniformLocation = gl.getUniformLocation(program, 'matProjection');
		
	}

	draw() {
		glMatrix.mat4.perspective(this.projMatrix, glMatrix.glMatrix.toRadian(this.fov), canvas.clientWidth / canvas.clientHeight, this.near, this.far);
		glMatrix.mat4.lookAt(this.viewMatrix, this.cameraPos, this.center, [0, 1, 0]);
		glMatrix.mat4.rotate(this.viewMatrix, this.viewMatrix, this.cameraRot[0], [1, 0, 0]);
		glMatrix.mat4.rotate(this.viewMatrix, this.viewMatrix, this.cameraRot[1], [0, 1, 0]);
		glMatrix.mat4.rotate(this.viewMatrix, this.viewMatrix, this.cameraRot[2], [0, 0, 1]);

		glMatrix.mat4.scale(this.worldMatrix, this.identity, this.scale);
		glMatrix.mat4.translate(this.worldMatrix, this.worldMatrix, this.translation);
		glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotation[0], [1, 0, 0]);
		glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotation[1], [0, 1, 0]);
		glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotation[2], [0, 0, 1]);

		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(
			this.positionAttribLocation, // ссылка на атрибут
			3, // кол-во элементов на 1 итерацию
			gl.FLOAT, // тип данных
			gl.FALSE, // нормализация
			6 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
			0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
		);
		gl.enableVertexAttribArray(this.positionAttribLocation);

		gl.vertexAttribPointer(
			this.colorAttribLocation, // ссылка на атрибут
			3, // кол-во элементов на 1 итерацию
			gl.FLOAT, // тип данных
			gl.FALSE, // нормализация
			6 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
			3 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
		);
		gl.enableVertexAttribArray(this.colorAttribLocation);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix);
		gl.uniformMatrix4fv(this.matViewUniformLocation, gl.FALSE, this.viewMatrix);
		gl.uniformMatrix4fv(this.matProjUniformLocation, gl.FALSE, this.projMatrix);

		gl.drawElements(gl.TRIANGLES, this.indicies.length, gl.UNSIGNED_SHORT, 0);
	}

	setTranslation(x, y, z)	{
		this.translation = [x, y, z];
	}

	setScale(x, y, z)	{
		this.scale = [x, y, z];
	}

	setRotation(x, y, z) {
		this.rotation = [x, y, z];
	}
}

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

var gl, program, canvas, toDraw = [];

function startWebGl(vertexShaderSource, fragmentShaderSource) {
	canvas = document.getElementById('gl-canvas');
	gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL. U mad bro');
		return;
	}

	/* canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, window.innerWidth, window.innerHeight); */

	canvas.width = 1280;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, 1280, innerHeight);

	gl.enable(gl.DEPTH_TEST);

	gl.clearColor(0.75, 0.9, 1.0, 1.0);

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	program = createProgram(gl, vertexShader, fragmentShader);
	gl.useProgram(program);

/* 	let a = new GlObject(cubeVertices, cubeIndices, program);
	a.setTranslation(-4, 0, 0);

	let b = new GlObject(crystalVertices, crystalIndices, program);
	b.setTranslation(0, 0, 0);

	let c = new GlObject(pyramidVertices, pyramidIndices, program);
	c.setTranslation(4, 0, 0);

	toDraw.push(a, b, c); */

	loop();
}

function loop() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//let angle = performance.now() / 1000 / 6 * 2 * Math.PI;

	/* toDraw.forEach(e => {
		e.setRotation(angle, angle * 2, angle * 5);
	}); */

	toDraw.forEach(e => {
		e.draw();
	});

	requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
	initWebGl();
})