class GlObject {
	constructor(object, program) {
		this.program = program;

		this.translation = [0, 0, 0];
		this.scale = [1, 1, 1];
		this.rotation = [0, 0, 0];
		this.obj = object;
		this.normals = [];

		this.center = [0, 0, 0];
		this.cameraPos = [0, 0, -10];
		this.cameraRot = [0, 0, 0];
		this.near = 0.1;
		this.far = 1000.0;
		this.fov = 45;

		if (this.obj.inverse) {
			this.calculateInverseNormals();
		} else {
			this.calculateNormals();
		}

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.obj.vertices), gl.STATIC_DRAW);

		this.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.obj.color), gl.STATIC_DRAW);

		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);				
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

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
		this.normalAttribLocation = gl.getAttribLocation(program, 'vertexNormal');

		this.matWorldUniformLocation = gl.getUniformLocation(program, 'matWorld');
		this.matViewUniformLocation = gl.getUniformLocation(program, 'matView');
		this.matProjUniformLocation = gl.getUniformLocation(program, 'matProjection');

		this.ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntesity');

		this.diff0UniformLocation = gl.getUniformLocation(program, 'diffProduct0');
		this.diff1UniformLocation = gl.getUniformLocation(program, 'diffProduct1');
		this.diff2UniformLocation = gl.getUniformLocation(program, 'diffProduct2');

		this.spec0UniformLocation = gl.getUniformLocation(program, 'specProduct0');
		this.spec1UniformLocation = gl.getUniformLocation(program, 'specProduct1');
		this.spec2UniformLocation = gl.getUniformLocation(program, 'specProduct2');

		this.sunDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
		this.sunDisUniformLocation = gl.getUniformLocation(program, 'sun.distanc');
		this.sunShiUniformLocation = gl.getUniformLocation(program, 'sun.shiness');

		this.lampDirUniformLocation = gl.getUniformLocation(program, 'lamp.direction');
		this.lampDisUniformLocation = gl.getUniformLocation(program, 'lamp.distanc');
		this.lampShiUniformLocation = gl.getUniformLocation(program, 'lamp.shiness');

		this.flashLightDirUniformLocation = gl.getUniformLocation(program, 'flashLight.direction');
		this.flashLightDisUniformLocation = gl.getUniformLocation(program, 'flashLight.distanc');
		this.flashLightShiUniformLocation = gl.getUniformLocation(program, 'flashLight.shiness');
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
			3 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
			0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
		);
		gl.enableVertexAttribArray(this.positionAttribLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.vertexAttribPointer(
			this.colorAttribLocation, // ссылка на атрибут
			3, // кол-во элементов на 1 итерацию
			gl.FLOAT, // тип данных
			gl.FALSE, // нормализация
			3 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
			0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
		);
		gl.enableVertexAttribArray(this.colorAttribLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.vertexAttribPointer(
			this.normalAttribLocation, // ссылка на атрибут
			3, // кол-во элементов на 1 итерацию
			gl.FLOAT, // тип данных
			gl.TRUE, // нормализация
			3 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
			0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
		);
		gl.enableVertexAttribArray(this.normalAttribLocation);

		console.log(this.projMatrix);
		
		gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix);
		gl.uniformMatrix4fv(this.matViewUniformLocation, gl.FALSE, this.viewMatrix);
		gl.uniformMatrix4fv(this.matProjUniformLocation, gl.FALSE, this.projMatrix);

		gl.uniform3f(this.ambientUniformLocation, 0.2, 0.2, 0.2);

		gl.uniform3f(this.flashLightDirUniformLocation, controls.l1x, controls.l1y, controls.l1z);		
		gl.uniform3f(this.diff0UniformLocation, ...mult( vec3(...toRGB(controls.l1diff)), vec3(...toRGB(controls.mdiff)) ));
		gl.uniform3f(this.spec0UniformLocation, ...mult( vec3(...toRGB(controls.l1spec)), vec3(...toRGB(controls.mspec)) ));
		gl.uniform1f(this.flashLightDisUniformLocation, controls.l1dst);
		gl.uniform1f(this.flashLightShiUniformLocation, controls.l1shns);

		gl.uniform3f(this.sunDirUniformLocation, controls.l2x, controls.l2y, controls.l2z);
		gl.uniform3f(this.diff1UniformLocation, ...mult( vec3(...toRGB(controls.l2diff)), vec3(...toRGB(controls.mdiff)) ));
		gl.uniform3f(this.spec1UniformLocation, ...mult( vec3(...toRGB(controls.l2spec)), vec3(...toRGB(controls.mspec)) ));
		gl.uniform1f(this.sunDisUniformLocation, controls.l2dst);
		gl.uniform1f(this.sunShiUniformLocation, controls.l2shns);

		gl.uniform3f(this.lampDirUniformLocation, controls.l3x, controls.l3y, controls.l3z);
		gl.uniform3f(this.diff2UniformLocation, ...mult( vec3(...toRGB(controls.l3diff)), vec3(...toRGB(controls.mdiff)) ));
		gl.uniform3f(this.spec2UniformLocation, ...mult( vec3(...toRGB(controls.l3spec)), vec3(...toRGB(controls.mspec)) ));
		gl.uniform1f(this.lampDisUniformLocation, controls.l3dst);
		gl.uniform1f(this.lampShiUniformLocation, controls.l3shns);


		gl.drawArrays(gl.TRIANGLES, 0, this.obj.vertices.length / 3);		
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

	calculateNormals() {
		for (let i = 0; i < this.obj.vertices.length - 8; i += 9) {
			const normal = this.calculateNormal(
				[ this.obj.vertices[i], this.obj.vertices[i + 1], this.obj.vertices[i + 2], ],
				[ this.obj.vertices[i + 3], this.obj.vertices[i + 4], this.obj.vertices[i + 5], ],
				[ this.obj.vertices[i + 6], this.obj.vertices[i + 7], this.obj.vertices[i + 8], ],
			)

			this.normals.push(...normal);
			this.normals.push(...normal);
			this.normals.push(...normal);
		}				
	}

	calculateInverseNormals() {
		for (let i = 0; i < this.obj.vertices.length - 8; i += 9) {
			const normal = this.calculateNormal(
				[ this.obj.vertices[i + 6], this.obj.vertices[i + 7], this.obj.vertices[i + 8], ],
				[ this.obj.vertices[i + 3], this.obj.vertices[i + 4], this.obj.vertices[i + 5], ],
				[ this.obj.vertices[i], this.obj.vertices[i + 1], this.obj.vertices[i + 2], ],
			)

			this.normals.push(...normal);
			this.normals.push(...normal);
			this.normals.push(...normal);
		}				
	}

	calculateNormal(a, b, c) {
		// 3 main lines of NORMALS CALCULATION FOR 1 TRIANGLE WITH VERTICES a, b, c!
		var t1 = [], t2 =[], normal = [];

		/* var t1 = subtract(b, a);
		var t2 = subtract(c, a);
		var normal = normalize(cross(t2, t1)); */

		glMatrix.vec3.subtract(t1, b, a);
		glMatrix.vec3.subtract(t2, c, a);
		glMatrix.vec3.cross(normal, t2, t1);
		glMatrix.vec3.normalize(normal, normal);
				
		return normal;
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

	gl.clearColor(0.2, 0.3, 0.3, 1.0);

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	program = createProgram(gl, vertexShader, fragmentShader);
	gl.useProgram(program);	

	let a = new GlObject(sphere, program);

	/*let b = new GlObject(crystalVertices, crystalIndices, program);
	b.setTranslation(0, 0, 0);

	let c = new GlObject(pyramidVertices, pyramidIndices, program);
	c.setTranslation(4, 0, 0);*/

	toDraw.push(a);
	loop();
}

function loop() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	let angle = performance.now() / 1000 / 6 * 2 * Math.PI;

	staticMove(angle);
	
	toDraw.map(e => {
		e.setRotation(0, angle/4, 0);
	});

	toDraw.map(e => {
		e.draw();
	});

	requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
	initControls();	
	initWebGl();
})