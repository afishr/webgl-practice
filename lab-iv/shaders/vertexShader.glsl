precision mediump float;

attribute vec3 vertexPosition;
attribute vec2 vertexTexCoord;
attribute vec3 vertexNormal;

uniform mat4 matWorld;
uniform mat4 matView;
uniform mat4 matProjection;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fragPosition;

void main(){
	fragNormal = (matWorld * vec4(vertexNormal, 0)).xyz;
	fragTexCoord = vertexTexCoord;
	fragPosition = vertexPosition;
	gl_Position = matProjection * matView * matWorld * vec4(vertexPosition, 1);
} 