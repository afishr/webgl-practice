var cube = {
	color: [
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
		1.0, 0.0, 0.2,
	],
	points: {
		'1': vec3(-1.0, -1.0, -1.0),
		'2': vec3(1.0, -1.0, -1.0),
		'3': vec3(1.0, -1.0, 1.0),
		'4': vec3(-1.0, -1.0, 1.0),
		'5': vec3(-1.0, 1.0, -1.0),
		'6': vec3(-1.0, 1.0, 1.0),
		'7': vec3(1.0, 1.0, 1.0),
		'8': vec3(1.0, 1.0, -1.0),
	},
	inverse: false
}

cube.vertices = [
	...cube.points[4], ...cube.points[3], ...cube.points[2],
	...cube.points[2], ...cube.points[1], ...cube.points[4],
	...cube.points[1], ...cube.points[2], ...cube.points[5],
	...cube.points[5], ...cube.points[2], ...cube.points[8],
	...cube.points[2], ...cube.points[3], ...cube.points[8],
	...cube.points[8], ...cube.points[3], ...cube.points[7],
	...cube.points[7], ...cube.points[3], ...cube.points[4],
	...cube.points[4], ...cube.points[6], ...cube.points[7],
	...cube.points[6], ...cube.points[4], ...cube.points[1],
	...cube.points[1], ...cube.points[5], ...cube.points[6],
	...cube.points[8], ...cube.points[7], ...cube.points[6],
	...cube.points[6], ...cube.points[5], ...cube.points[8],
]

var sphere = {
	points: [],
	color: [],
	vertices: [],
	inverse: true
}

var atom = new PhiloGL.O3D.Sphere({ nlat: 175, nlong: 175, radius: 2.5, colors: [1, 0, 0, 1] });

sphere.points = atom.vertices;
sphere.normals = atom.normals;
sphere.color.push( ...atom.colors );
sphere.color.push( ...atom.colors );
sphere.color.push( ...atom.colors );
sphere.color.push( ...atom.colors );
sphere.color.push( ...atom.colors );

for (let index = 0; index < atom.indices.length; index++) {
	const element = atom.indices[index];
	
	sphere.vertices.push( sphere.points[element * 3] );
	sphere.vertices.push( sphere.points[element * 3 + 1] );
	sphere.vertices.push( sphere.points[element * 3 + 2] );
}