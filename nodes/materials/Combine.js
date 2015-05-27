var BaseTwoMaterial = require('./BaseTwo');
var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"cubeMap2": { type: "t", value: null },
	"flipX": { type: "f", value: - 1 }
}

var vertexShader = [
	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

	"void main() {",

	"	vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;",

	"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		THREE.ShaderChunk[ "logdepthbuf_vertex" ],

	"}"

].join("\n");

var fragmentShader = [

	"uniform samplerCube cubeMap;",
	"uniform samplerCube cubeMap2;",
	"uniform float flipX;",

	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	vec4 layer1 = textureCube( cubeMap, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) );",
	"	vec4 layer2 = textureCube( cubeMap2, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) );",
	"	gl_FragColor = vec4(layer2.rgb + vec3(1.0 - layer2.a) * layer1.rgb, 1.0);",
	// "	gl_FragColor = layer2;",
	// "	gl_FragColor.r = gl_FragColor.a;",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"}"

].join("\n");

function CubeMapAddMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms)
	});

	BaseTwoMaterial.call(this, params);
}

CubeMapAddMaterial.prototype = Object.create(BaseTwoMaterial.prototype);

module.exports = CubeMapAddMaterial;