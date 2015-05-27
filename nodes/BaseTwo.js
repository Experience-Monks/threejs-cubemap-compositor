var defaults = require('lodash.defaults');
var CubeMapNodeBase = require('./Base');

function CubeMapNodeBaseTwo(renderer, inputA, inputB, MaterialClass, params, format) {
	params = params || {};

	defaults(params, {
		cubeMap: inputA.texture,
		cubeMap2: inputB.texture
	});
	
	this.renderer = renderer;

	var cubeMaterial = new MaterialClass(params);

	CubeMapNodeBase.call(this, renderer, cubeMaterial, format);

	inputA.updateSignal.add(this.update);
	inputB.updateSignal.add(this.update);
}

CubeMapNodeBaseTwo.prototype = Object.create(CubeMapNodeBase.prototype);

module.exports = CubeMapNodeBaseTwo;