precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	float distanc;
	float shiness;
};

uniform DirectionalLight flashLight;
uniform DirectionalLight sun;
uniform DirectionalLight lamp;
uniform vec3 ambientLightIntesity;
uniform vec3 diffProduct0;
uniform vec3 diffProduct1;
uniform vec3 diffProduct2;
uniform vec3 specProduct0;
uniform vec3 specProduct1;
uniform vec3 specProduct2;

varying vec3 fragColor;
varying vec3 fragNormal;
varying vec3 fragPosition;


void main(){

	// vec3 lightIntensity = ambientLightIntesity + flashLight.color * max(dot(fragNormal, flashLight.direction), 0.0);

  float diffuseValue0 = max(dot(normalize(flashLight.direction), fragNormal), 0.0) / flashLight.distanc; 
  float specularValue0 = pow(max(dot(normalize(flashLight.direction), fragNormal), 0.0), flashLight.shiness);

	float diffuseValue1 = max(dot(normalize(sun.direction), fragNormal), 0.0) / sun.distanc; 
  float specularValue1 = pow(max(dot(normalize(sun.direction), fragNormal), 0.0), sun.shiness);  

	float diffuseValue2 = max(dot(normalize(lamp.direction), fragNormal), 0.0) / lamp.distanc; 
  float specularValue2 = pow(max(dot(normalize(lamp.direction), fragNormal), 0.0), lamp.shiness);  

	vec3 lightIntensity = diffProduct0 * diffuseValue0 + diffProduct1 * diffuseValue1 + diffProduct2 * diffuseValue2
	 	+ specProduct0 * specularValue0 + specProduct1 * specularValue1 + specProduct2 * specularValue2
		+ ambientLightIntesity;


	gl_FragColor = vec4(fragColor * lightIntensity, 1.0);
	// gl_FragColor = vec4(fragNormal, 1.0);
}