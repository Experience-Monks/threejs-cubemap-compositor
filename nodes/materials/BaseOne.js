var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"tFlip": { type: "f", value: - 1 }
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
	"uniform float tFlip;",

	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	gl_FragColor = textureCube( cubeMap, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) ) + textureCube( cubeMap2, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"}"

].join("\n");

function CubeMapBaseOneMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms),
		side: THREE.DoubleSide,
		flipX: 1
	});

	Object.keys(params.uniforms).forEach(function(key){
		if(params[key]) params.uniforms[key].value = params[key];
	});

	THREE.ShaderMaterial.call(this, params);
}

CubeMapBaseOneMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

module.exports = CubeMapBaseOneMaterial;