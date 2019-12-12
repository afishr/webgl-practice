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

uniform sampler2D sampler;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fragPosition;


void main(){
	// vec3 lightIntensity = ambientLightIntesity + flashLight.color * max(dot(fragNormal, flashLight.direction), 0.0);

	vec4 texel = texture2D(sampler, fragTexCoord);

	float diffuseValue = max(dot(normalize(sun.direction), fragNormal), 0.0) / sun.distanc; 
  float specularValue = pow(max(dot(normalize(sun.direction), fragNormal), 0.0), sun.shiness);  

	vec3 lightIntensity = diffProduct * diffuseValue + specProduct * specularValue + ambientLightIntesity;

	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
	// gl_FragColor = vec4(fragNormal, 1.0);
}