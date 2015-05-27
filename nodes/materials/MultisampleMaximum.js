var BaseOneMaterial = require('./BaseOne');

var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"blurStrength": { type: "f", value: 0.03 },
	"flipX": { type: "f", value: - 1 }
}

var vertexShader = [
	require('./glslRotationMatrix'),
	"varying vec3 vWorldPosition;",
	"varying vec3 vWorldPosition2;",
	"varying vec3 vWorldPosition3;",
	"varying vec3 vWorldPosition4;",
	"varying vec3 vWorldPosition5;",
	"varying vec3 vWorldPosition6;",
	"uniform float blurStrength;",

	THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

	"void main() {",

	"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
	"	vWorldPosition = (worldPosition * rotationMatrix( vec3(1.0, 0.0, 0.0), blurStrength)).xyz;",
	"	vWorldPosition2 = (worldPosition * rotationMatrix( vec3(1.0, 0.0, 0.0), -blurStrength)).xyz;",
	"	vWorldPosition3 = (worldPosition * rotationMatrix( vec3(0.0, 1.0, 0.0), blurStrength)).xyz;",
	"	vWorldPosition4 = (worldPosition * rotationMatrix( vec3(0.0, 1.0, 0.0), -blurStrength)).xyz;",
	"	vWorldPosition5 = (worldPosition * rotationMatrix( vec3(0.0, 0.0, 1.0), blurStrength)).xyz;",
	"	vWorldPosition6 = (worldPosition * rotationMatrix( vec3(0.0, 0.0, 1.0), -blurStrength)).xyz;",

	// "	vWorldPosition.x += blurStrength;",
	// "	vWorldPosition2.x -= blurStrength;",
	// "	vWorldPosition3.y += blurStrength;",
	// "	vWorldPosition4.y -= blurStrength;",
	// "	vWorldPosition5.z += blurStrength;",
	// "	vWorldPosition6.z -= blurStrength;",

	"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		THREE.ShaderChunk[ "logdepthbuf_vertex" ],

	"}"

].join("\n");

var fragmentShader = [

	"uniform samplerCube cubeMap;",
	"uniform float flipX;",

	"varying vec3 vWorldPosition;",
	"varying vec3 vWorldPosition2;",
	"varying vec3 vWorldPosition3;",
	"varying vec3 vWorldPosition4;",
	"varying vec3 vWorldPosition5;",
	"varying vec3 vWorldPosition6;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	gl_FragColor = textureCube( cubeMap, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * vWorldPosition2.x, vWorldPosition2.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * vWorldPosition3.x, vWorldPosition3.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * vWorldPosition4.x, vWorldPosition4.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * vWorldPosition5.x, vWorldPosition5.yz ) ) );",
	"	gl_FragColor = max(gl_FragColor, textureCube( cubeMap, vec3( flipX * vWorldPosition6.x, vWorldPosition6.yz ) ) );",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"}"

].join("\n");

function CubeMapMultiSampleMaximumMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms)
	});

	BaseOneMaterial.call(this, params);
}

CubeMapMultiSampleMaximumMaterial.prototype = Object.create(BaseOneMaterial.prototype);

module.exports = CubeMapMultiSampleMaximumMaterial;