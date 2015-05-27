var BaseTwoMaterial = require('./BaseTwo');

var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"cubeMap2": { type: "t", value: null },
	"blurStrength": { type: "f", value: 0.03 },
	"flipX": { type: "f", value: - 1 }
}

var vertexShader = [
	"varying vec4 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

	"void main() {",

	"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
	"	vWorldPosition = worldPosition;",

	"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		THREE.ShaderChunk[ "logdepthbuf_vertex" ],

	"}"

].join("\n");

var fragmentShader = [

	require('./glslRotationMatrix'),
	"uniform samplerCube cubeMap;",
	"uniform samplerCube cubeMap2;",
	"uniform float blurStrength;",
	"uniform float flipX;",
	"varying vec4 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",
	"	float blur = blurStrength * textureCube( cubeMap2, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) ).r;",
	"	vec3 worldPosition = (vWorldPosition * rotationMatrix( vec3(1.0, 0.0, 0.0), blur)).xyz;",
	"	vec3 worldPosition2 = (vWorldPosition * rotationMatrix( vec3(1.0, 0.0, 0.0), -blur)).xyz;",
	"	vec3 worldPosition3 = (vWorldPosition * rotationMatrix( vec3(0.0, 1.0, 0.0), blur)).xyz;",
	"	vec3 worldPosition4 = (vWorldPosition * rotationMatrix( vec3(0.0, 1.0, 0.0), -blur)).xyz;",
	"	vec3 worldPosition5 = (vWorldPosition * rotationMatrix( vec3(0.0, 0.0, 1.0), blur)).xyz;",
	"	vec3 worldPosition6 = (vWorldPosition * rotationMatrix( vec3(0.0, 0.0, 1.0), -blur)).xyz;",

	"	gl_FragColor = textureCube( cubeMap, vec3( flipX * worldPosition.x, worldPosition.yz ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * worldPosition2.x, worldPosition2.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * worldPosition3.x, worldPosition3.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * worldPosition4.x, worldPosition4.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * worldPosition5.x, worldPosition5.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * worldPosition6.x, worldPosition6.yz ) ) );",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"}"

].join("\n");

function CubeMapMultiSampleMinimumMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms)
	});

	BaseTwoMaterial.call(this, params);
}

CubeMapMultiSampleMinimumMaterial.prototype = Object.create(BaseTwoMaterial.prototype);

module.exports = CubeMapMultiSampleMinimumMaterial;