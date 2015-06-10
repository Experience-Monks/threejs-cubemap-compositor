var BaseOneMaterial = require('./BaseOne');

var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
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
	"uniform float flipX;",

	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	gl_FragColor = textureCube( cubeMap, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) );",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"	gl_FragColor.rgb *= (1.0 - gl_FragColor.a) * 255.0 + 1.0;",

	"	gl_FragColor.a = 1.0;",

	"}"

].join("\n");

function CubeMapDecodeFakeHdriMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms),
		side: THREE.DoubleSide
	});
	BaseOneMaterial.call(this, params);

}

CubeMapDecodeFakeHdriMaterial.prototype = Object.create(BaseOneMaterial.prototype);

module.exports = CubeMapDecodeFakeHdriMaterial;