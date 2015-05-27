var defaults = require('lodash.defaults');
var CubeMapNodeBase = require('./Base');

function CubeMapNodeBaseOne(renderer, input, MaterialClass, params) {
	params = params || {};

	defaults(params, {
		cubeMap: input.texture
	});

	this.renderer = renderer;
	
	var cubeMaterial = new MaterialClass(params);

	CubeMapNodeBase.call(this, renderer, cubeMaterial);

	input.updateSignal.add(this.update);
}

CubeMapNodeBaseOne.prototype = Object.create(CubeMapNodeBase.prototype);

module.exports = CubeMapNodeBaseOne;