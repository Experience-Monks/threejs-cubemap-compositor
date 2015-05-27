var CubeMapMultiplyMaterial = require('./materials/Multiply');
var BaseNodeTwo = require('./BaseTwo');

function CubeMapNodeMultiply(renderer, inputA, inputB, strength) {
	strength = strength || 2;
	BaseNodeTwo.call(this, renderer, inputA, inputB, CubeMapMultiplyMaterial, {strength: strength});
}

CubeMapNodeMultiply.prototype = Object.create(BaseNodeTwo.prototype);
module.exports = CubeMapNodeMultiply;