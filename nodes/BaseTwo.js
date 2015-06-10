var defaults = require('lodash.defaults');
var CubeMapNodeBase = require('./Base');

function CubeMapNodeBaseTwo(renderer, inputA, inputB, MaterialClass, params, format) {
	params = params || {};
	if(inputA === undefined || inputB === undefined) throw new Error("You must provide a valid input.");


	defaults(params, {
		cubeMap: inputA.texture,
		cubeMap2: inputB.texture
	});
	
	this.renderer = renderer;

	var cubeMaterial = new MaterialClass(params);

	CubeMapNodeBase.call(this, renderer, cubeMaterial, format);

	inputA.updateSignal.add(this.update);
	inputB.updateSignal.add(this.update);

	this.inputA = inputA;
	this.inputB = inputB;
}

CubeMapNodeBaseTwo.prototype = Object.create(CubeMapNodeBase.prototype);

CubeMapNodeBaseTwo.prototype.setInput = function(input) {
	this.inputA.updateSignal.remove(this.update);
	this.inputA = input;
	this.material.uniforms.cubeMap.value = input.texture;
	input.updateSignal.add(this.update);
}

module.exports = CubeMapNodeBaseTwo;