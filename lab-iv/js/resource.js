function loadResource(url) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.responseText);
			} else {
				reject(new Error(xhr.status));
			}
		}
		xhr.send();
	})
}

function loadImage(url) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.src = url;
		img.onload = () => resolve(img);
	})
}

function loadMeshes(url) {
	return new Promise((resolve, reject) => {
		OBJ.downloadMeshes({
			'model': url
		}, resolve)
	})
}

function createShader(gl, type, source) {
	let shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error compiling shader");
		console.error('Shader error info: ', gl.shaderInfoLog(shader));
		return false;
	}

	return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
	let program = gl.createProgram();

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.validateProgram(program);

	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('Error validating program ', gl.getProgramInfoLog(program));
		return false;
	}

	return program;
}