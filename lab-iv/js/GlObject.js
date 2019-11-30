class GlObject {
	constructor(mesh, program) {
		this.program = program;
		this.mesh = mesh;

		this.translation = [0, 0, 0];
		this.scale = [1, 1, 1];
		this.rotation = [0, 0, 0];
		this.colors = [1, 0, 0];

		this.center = [0, 0, 0];
		this.cameraPos = [0, 0, -13];
		this.cameraRot = [0, 0, 0];
		this.near = 0.1;
		this.far = 1000.0;
		this.fov = 45;

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), gl.STATIC_DRAW);

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);

		this.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);				
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);

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

		this.diff0UniformLocation = gl.getUniformLocation(program, 'diffProduct');
		this.spec0UniformLocation = gl.getUniformLocation(program, 'specProduct');

		this.sunDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
		this.sunDisUniformLocation = gl.getUniformLocation(program, 'sun.distanc');
		this.sunShiUniformLocation = gl.getUniformLocation(program, 'sun.shiness');
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
		
		gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix);
		gl.uniformMatrix4fv(this.matViewUniformLocation, gl.FALSE, this.viewMatrix);
		gl.uniformMatrix4fv(this.matProjUniformLocation, gl.FALSE, this.projMatrix);

		gl.uniform3f(this.ambientUniformLocation, 0.2, 0.2, 0.2);

		gl.uniform3f(this.diff0UniformLocation, ...mult( vec3(...toRGB('#ffffff')), vec3(...toRGB('#ffffff')) ));
		gl.uniform3f(this.spec0UniformLocation, ...mult( vec3(...toRGB('#ffffff')), vec3(...toRGB('#ffffff')) ));

		gl.uniform3f(this.sunDirUniformLocation, -1, 0, -1);
		gl.uniform1f(this.sunDisUniformLocation, 5);
		gl.uniform1f(this.sunShiUniformLocation, 10);


		// gl.drawArrays(gl.TRIANGLES, 0, this.mesh.vertices.length / 3);
		gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
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
