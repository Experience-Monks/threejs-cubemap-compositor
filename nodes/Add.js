var CubeMapAddMaterial = require('./materials/Add');
var BaseNodeTwo = require('./BaseTwo');

function CubeMapNodeAdd(renderer, inputA, inputB) {
	BaseNodeTwo.call(this, renderer, inputA, inputB, CubeMapAddMaterial);
}

CubeMapNodeAdd.prototype = Object.create(BaseNodeTwo.prototype);
module.exports = CubeMapNodeAdd;