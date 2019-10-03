attribute vec3 vertexPosition;
attribute vec3 vertexColor;

uniform mat4 matWorld;
uniform mat4 matView;
uniform mat4 matProjection;

varying vec3 fragColor;

void main(){
	fragColor = vertexColor;
	gl_Position = matProjection * matView * matWorld * vec4(vertexPosition, 1);
} 