var CubeMapCombineMaterial = require('./materials/Combine');
var BaseNodeTwo = require('./BaseTwo');

function CubeMapNodeCombine(renderer, inputA, inputB) {
	BaseNodeTwo.call(this, renderer, inputA, inputB, CubeMapCombineMaterial);
}

CubeMapNodeCombine.prototype = Object.create(BaseNodeTwo.prototype);
module.exports = CubeMapNodeCombine;