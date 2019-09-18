attribute vec3 vertexPosition;
attribute vec3 vertexColor;

varying vec4 fragColor;

void main(){
	fragColor = vec4(vertexColor, 1.0);
	gl_Position = vec4(vertexPosition, 1);
} 