var BaseOneMaterial = require('./BaseOne');

var defaults = require('lodash.defaults');
var clonedeep = require('lodash.clonedeep');

var uniforms = {
	"cubeMap": { type: "t", value: null },
	"saturation": { type: "f", value: 2 },
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
	"uniform float saturation;",
	"uniform float flipX;",

	"varying vec3 vWorldPosition;",

	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

	"void main() {",

	"	vec4 color = textureCube( cubeMap, vec3( flipX * vWorldPosition.x, vWorldPosition.yz ) );",
	"	vec3 average = vec3((color.r + color.g + color.b) / 3.0 );",
	"	gl_FragColor = vec4(average + (color.rgb - average) * saturation, color.a);",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],

	"}"

].join("\n");

function CubeMapSaturationMaterial(params) {
	params = params || {};
	defaults(params, {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: clonedeep(uniforms),
		side: THREE.DoubleSide
	});
	BaseOneMaterial.call(this, params);

}

CubeMapSaturationMaterial.prototype = Object.create(BaseOneMaterial.prototype);

module.exports = CubeMapSaturationMaterial;