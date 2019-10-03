var cubeVertices = 
[ // X, Y, Z           R, G, B
	/* CUBE */
	// Top
	-4.0, 1.0, -1.0,   1.0, 0.0, 0.0,
	-4.0, 1.0, 1.0,    0.0, 1.0, 0.0,
	-2.0, 1.0, 1.0,     1.0, 0.4, 0.3,
	-2.0, 1.0, -1.0,    0.0, 0.0, 0.0,

	// Bottom
	-4.0, -1.0, -1.0,   1.0, 0.0, 0.0,
	-4.0, -1.0, 1.0,    0.0, 1.0, 0.0,
	-2.0, -1.0, 1.0,     1.0, 0.4, 0.3,
	-2.0, -1.0, -1.0,    0.0, 0.0, 0.0,
];

var pyramidVertices = [
	/* Pyramid */
	2.0, 1.0, 0.0,     0.5, 0.8, 0.25,
	1.0, -1.0, -1.0,   0.76, 0.76, 0.76,
	3.0, -1.0, -1.0,    0.3, 0.6, 0.3,
	2.0, -1.0, 1.0,     1.0, 0.0, 0.0,
];

var crystalVertices = [
	/* Crystal */
	// Base
	-1.0, 0.0, -1.0,	1.0, 0.0, 0.0,
	-1.0, 0.0,  1.0,	0.0, 1.0, 0.0,
	 1.0, 0.0,  1.0,	0.0, 0.0, 1.0,
	 1.0, 0.0, -1.0,	1.0, 1.0, 0.0,
	
	// Peaks
	0.0,  1.0, 0.0,	  1.0, 0.0, 1.0,
	0.0, -2.0, 0.0,	  0.0, 0.1, 0.1,
];

var cubeIndices =
[
	/* CUBE */
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	0, 1, 5,
	0, 4, 5,

	// Right
	3, 2, 6,
	3, 7, 6,

	// Front
	0, 4, 7,
	0, 3, 7,

	// Back
	1, 2, 6,
	1, 5, 6,

	// Bottom
	4, 5, 6,
	4, 6, 7,
];

var pyramidIndices = [
	/* Pyramid */
	// Front
	0, 1, 2,

	// Left
	0, 1, 3,

	// Right
	0, 2, 3,

	// Bottom
	1, 2, 3,
];

var crystalIndices = [
	0, 1, 4,
	0, 3, 4,
	2, 3, 4,
	1, 2, 4,

	0, 3, 5,
	0, 1, 5,
	1, 2, 5,
	2, 3, 5
];

function prepareVertices() {
	let mainVertices = [];
	mainVertices = mainVertices.concat(cubeVertices, pyramidVertices, crystalVertices);
	
	let offset1 = cubeVertices.length / 6;
	let offset2 = (pyramidVertices.length / 6) + offset1;

	console.log(offset1);
	console.log(offset2);
	

	for (let i = 0; i < pyramidIndices.length; i++) {
		pyramidIndices[i] += offset1;
	}

	for (let i = 0; i < crystalIndices.length; i++) {
		crystalIndices[i] += offset2;
	}

	let mainIndices = [];
	mainIndices = mainIndices.concat(cubeIndices, pyramidIndices, crystalIndices);

	return {
		mainVertices,
		mainIndices
	}
}