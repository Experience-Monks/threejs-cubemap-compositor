var BaseTwoMaterial = require('./BaseTwo');
var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"cubeMap2": { type: "t", value: null },
	"strength": { type: "f", value: 2 },
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
	"uniform float strength;",
	"uniform float flipX;",

	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	gl_FragColor = textureCube( cubeMap, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) ) * (1.0 + strength * textureCube( cubeMap2, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) ));",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"}"

].join("\n");

function CubeMapMultiplyMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms)
	});

	BaseTwoMaterial.call(this, params);
}

CubeMapMultiplyMaterial.prototype = Object.create(BaseTwoMaterial.prototype);

module.exports = CubeMapMultiplyMaterial;