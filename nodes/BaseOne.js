var defaults = require('lodash.defaults');
var CubeMapNodeBase = require('./Base');

function CubeMapNodeBaseOne(renderer, input, MaterialClass, params) {
	params = params || {};

	if(input === undefined) throw new Error("You must provide a valid input.");

	defaults(params, {
		cubeMap: input.texture
	});

	this.renderer = renderer;
	
	var cubeMaterial = new MaterialClass(params);

	CubeMapNodeBase.call(this, renderer, cubeMaterial, params.format, params.type);

	this.input = input;

	input.updateSignal.add(this.update);
}

CubeMapNodeBaseOne.prototype = Object.create(CubeMapNodeBase.prototype);

CubeMapNodeBaseOne.prototype.setInput = function(input) {
	this.input.updateSignal.remove(this.update);
	this.input = input;
	this.material.uniforms.cubeMap.value = input.texture;
	input.updateSignal.add(this.update);
}


module.exports = CubeMapNodeBaseOne;