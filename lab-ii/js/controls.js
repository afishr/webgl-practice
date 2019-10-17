window.onload = function() {
	let selectedIndex = 0;
	let translateControls = document.getElementsByClassName('control-translate');
	let translate = {};
	let rotateControls = document.getElementsByClassName('control-rotate');
	let rotate = {};
	let scaleControls = document.getElementsByClassName('control-scale');
	let scale = {};
	let listObjects = document.getElementById('list-objects');
	let addButtons = document.getElementsByClassName('add-button');
	let resetButton = document.getElementById('reset');
	let deleteButton = document.getElementById('delete');
	let cameraMovControls = document.getElementsByClassName('control-camera-mov');
	let cameraMov = {};
	let cameraRotControls = document.getElementsByClassName('control-camera-rot');
	let cameraRot = {};
	let cameraPerControls = document.getElementsByClassName('control-camera-per');
	let cameraPer = {};

	resetButton.addEventListener('click', () => {
		for (const i of translateControls) {
			i.value = 50;
		}

		for (const i of rotateControls) {
			i.value = 0;
		}

		for (const i of scaleControls) {
			i.value = 10;
		}

		getTranslateValues();
		getRotateValues();
		getScaleValues();
	})

	deleteButton.addEventListener('click', () => {
		toDraw.splice(selectedIndex, 1);

		listObjects.innerHTML = "";
		toDraw.map((val, index) => {
			let select = document.createElement('option');
			select.innerText = 'Object ' + index;
			select.dataset.index = index;
			listObjects.appendChild(select);			
		});
		listObjects.selectedIndex = toDraw.length - 1;
		selectedIndex = listObjects.selectedIndex;
	})

	for (const i of addButtons) {
		i.addEventListener('click', addObject);
	}

	listObjects.addEventListener('change', (e) => {
		selectedIndex = e.target.selectedIndex;
	})	

	for (const i of translateControls) {
		i.addEventListener('input', getTranslateValues);
	}

	for (const i of rotateControls) {
		i.addEventListener('input', getRotateValues);
	}

	for (const i of scaleControls) {
		i.addEventListener('input', getScaleValues);
	}

	for (const i of cameraMovControls) {
		i.addEventListener('input', getCameraMovValues);
	}

	for (const i of cameraRotControls) {
		i.addEventListener('input', getCameraRotValues);
	}

	for (const i of cameraPerControls) {
		i.addEventListener('input', getCameraPerValues);
	}

	function getTranslateValues() {
		for (const i of translateControls) {
			translate[i.id] = (i.value - 50) * 0.2;
		}

		toDraw[selectedIndex].setTranslation(translate['translate-x'] * -1, translate['translate-y'], translate['translate-z'])
	}	

	function getRotateValues() {
		for (const i of rotateControls) {
			rotate[i.id] = (i.value * 3.6) * Math.PI / 180;
		}

		toDraw[selectedIndex].setRotation(rotate['rotate-x'], rotate['rotate-y'], rotate['rotate-z']);
		
	}	

	function getScaleValues() {
		for (const i of scaleControls) {
			scale[i.id] = i.value * 0.1 + 0,1;
		}

		toDraw[selectedIndex].setScale(scale['scale-x'], scale['scale-y'], scale['scale-z']);		
	}

	function getCameraMovValues() {
		for (const i of cameraMovControls) {
			cameraMov[i.id] = (i.value - 50) * 0.1;
		}

		cameraMov['camera-mov-z'] *= -10;

		toDraw.map((e) => {
			e.cameraPos = [cameraMov['camera-mov-x'], cameraMov['camera-mov-y'], cameraMov['camera-mov-z']]
		})

	}

	function getCameraRotValues() {
		for (const i of cameraRotControls) {
			cameraRot[i.id] = (i.value * 3.6) * Math.PI / 180;
		}

		toDraw.map((e) => {
			e.cameraRot = [cameraRot['camera-rot-x'], cameraRot['camera-rot-y'], cameraRot['camera-rot-z']]
		})
		
	}

	function getCameraPerValues() {
		for (const i of cameraPerControls) {
			cameraPer[i.id] = i.value;
		}

		cameraPer['camera-fov'] *= 3.6;
		cameraPer['camera-near'] *= 10;
		cameraPer['camera-far'] *= 10;

		toDraw.map((e) => {
			e.fov = cameraPer['camera-fov'];
			e.near = cameraPer['camera-near'];
			e.far = cameraPer['camera-far'];
		})	
	}

	function addObject(e) {
		let id = e.target.id;

		switch (id) {
			case 'add-cube':
				toDraw.push(new GlObject(cubeVertices, cubeIndices, program));
			break;

			case 'add-pyramid':
				toDraw.push(new GlObject(pyramidVertices, pyramidIndices, program));
			break;

			case 'add-crystal':
				toDraw.push(new GlObject(crystalVertices, crystalIndices, program));
			break;
		}

		listObjects.innerHTML = "";
		toDraw.map((val, index) => {
			let select = document.createElement('option');
			select.innerText = 'Object ' + index;
			select.dataset.index = index;
			listObjects.appendChild(select);			
		});
		listObjects.selectedIndex = toDraw.length - 1;
		selectedIndex = listObjects.selectedIndex;
	}
}