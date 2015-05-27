var CubeMapSubMaterial = require('./materials/Sub');
var BaseNodeTwo = require('./BaseTwo');

function CubeMapNodeSub(renderer, inputA, inputB) {
	BaseNodeTwo.call(this, renderer, inputA, inputB, CubeMapSubMaterial, {flipX: 1});
}

CubeMapNodeSub.prototype = Object.create(BaseNodeTwo.prototype);
module.exports = CubeMapNodeSub;