precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	float distanc;
	float shiness;
};

uniform DirectionalLight sun;
uniform vec3 ambientLightIntesity;
uniform vec3 diffProduct;
uniform vec3 specProduct;

varying vec3 fragColor;
varying vec3 fragNormal;
varying vec3 fragPosition;


void main(){

	// vec3 lightIntensity = ambientLightIntesity + flashLight.color * max(dot(fragNormal, flashLight.direction), 0.0);

	float diffuseValue = max(dot(normalize(sun.direction), fragNormal), 0.0) / sun.distanc; 
  float specularValue = pow(max(dot(normalize(sun.direction), fragNormal), 0.0), sun.shiness);  

	vec3 lightIntensity = diffProduct * diffuseValue + specProduct * specularValue + ambientLightIntesity;

	gl_FragColor = vec4(fragColor * lightIntensity, 1.0);
	// gl_FragColor = vec4(fragNormal, 1.0);
}