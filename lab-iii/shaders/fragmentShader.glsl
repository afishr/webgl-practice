precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};

varying vec3 fragColor;
varying vec3 fragNormal;
varying vec3 fragPosition;


void main(){
	DirectionalLight flashLight;
	flashLight.direction = normalize(vec3(0.0, 0.0, -1.0));
	flashLight.color = vec3(1, 1, 0);
	vec3 ambientLightIntesity = vec3(0.2, 0.2, 0.2);
	// vec3 lightIntensity = ambientLightIntesity + flashLight.color * max(dot(fragNormal, flashLight.direction), 0.0);


  vec3 lightVector0 = flashLight.direction;
  
  float diffuseValue0 = max(dot(lightVector0, fragNormal), 0.0) / 20.0; 

  float specularValue0 = pow(max(dot(lightVector0, fragNormal), 0.0), 20.0); 

	vec3 lightIntensity = vec3(1, 1, 1) * diffuseValue0 + (flashLight.color * vec3(1, 1, 1)) * specularValue0 + ambientLightIntesity;


	gl_FragColor = vec4(fragColor * lightIntensity, 1.0);
	// gl_FragColor = vec4(fragNormal, 1.0);
}