var CubeMapNodeAdd = require('./Add');
var CubeMapNodeSub = require('./Sub');
var CubeMapNodeMultiply = require('./Multiply');
var CubeMapNodeMultiplyScalar = require('./MultiplyScalar');
var CubeMapNodeSaturation = require('./Saturation');
var CubeMapNodeSuperMultisampleBlur = require('./SuperMultisampleBlur');
var CubeMapNodeMultisampleMinimaxVariedStrength = require('./SuperMultisampleMinimaxVariedStrength');
var CubeMapNodeInputFiles = require('./InputFiles');
var DecodeFakeHdri = require('./DecodeFakeHdri');

// Takes static image files in fake HDRI format
// "graph.outputs" -> blur levels [ 0, 1, 2 ]
module.exports = StaticReflectionGraph
function StaticReflectionGraph (renderer, input, options) {
  options = options || {}

  var cubeMapNodePainterBaseline = new CubeMapNodeInputFiles(renderer, options.baseline)
  var cubeMapNodePainterPhysicalLight = new CubeMapNodeInputFiles(renderer, options.physicalLight)
  var cubeMapNodePainterExtraLight = new CubeMapNodeInputFiles(renderer, options.extraLight)
  var cubeMapNodePainterLightMask = new CubeMapNodeInputFiles(renderer, options.lightMask)

  var inputBaseline = new DecodeFakeHdri(renderer, cubeMapNodePainterBaseline);
  var inputPhysicalLight = new DecodeFakeHdri(renderer, cubeMapNodePainterPhysicalLight);
  var inputExtraLight = new DecodeFakeHdri(renderer, cubeMapNodePainterExtraLight);
  var inputLightMask = new DecodeFakeHdri(renderer, cubeMapNodePainterLightMask);

  var cubeMapBaseline = new CubeMapNodeMultisampleMinimaxVariedStrength(renderer, input, inputBaseline, 0.5);
  var cubeMapNodeBaseLineSaturation = new CubeMapNodeSaturation(renderer, cubeMapBaseline, 0.5);
  var cubeMapNodeLightDetails = new CubeMapNodeSub(renderer, input, cubeMapNodeBaseLineSaturation);
  
  var cubeMapNodePhysicalLight = new CubeMapNodeMultiply(renderer, cubeMapNodeLightDetails, inputPhysicalLight, 20);
  var cubeMapNodePhysicalLightSaturation = new CubeMapNodeSaturation(renderer, cubeMapNodePhysicalLight, 0.5);
  var cubeMapNodePhysicalLightComposite = new CubeMapNodeAdd(renderer, cubeMapNodeBaseLineSaturation, cubeMapNodePhysicalLightSaturation);

  var cubeMapNodeCombineGlamourizedLight = new CubeMapNodeAdd(renderer, inputPhysicalLight, inputExtraLight);
  var cubeMapNodeGlamourizedLight = new CubeMapNodeMultiply(renderer, cubeMapNodeLightDetails, cubeMapNodeCombineGlamourizedLight, 20);
  var cubeMapNodeGlamourizedLightSaturation = new CubeMapNodeSaturation(renderer, cubeMapNodeGlamourizedLight, 0.5);
  var cubeMapNodeGlamourizedLightComposite = new CubeMapNodeAdd(renderer, cubeMapNodeBaseLineSaturation, cubeMapNodeGlamourizedLightSaturation);

  var cubeMapNodeMaskedPhysicalLight = new CubeMapNodeMultiply(renderer, cubeMapNodePhysicalLightComposite, inputLightMask, 0.5, 0.1);
  var cubeMapNodeBlurredALittle = new CubeMapNodeSuperMultisampleBlur(renderer, cubeMapNodeMaskedPhysicalLight, 0.01, 2);
  var cubeMapNodeBlurred = new CubeMapNodeSuperMultisampleBlur(renderer, cubeMapNodeGlamourizedLightComposite, 0.5, 4);
  var cubeMapNodeBlurredALot = new CubeMapNodeSuperMultisampleBlur(renderer, cubeMapNodeGlamourizedLightComposite, 0.9, 5);

  var cubeMapNodeMaskedExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeMaskedPhysicalLight, 0.5);
  var cubeMapNodeBlurredALittleExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeBlurredALittle, 0.5);
  var cubeMapNodeBlurredExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeBlurred, 0.5);
  var cubeMapNodeBlurredALotExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeBlurredALot, 0.5);

  this.mask = cubeMapNodeMaskedExposed;
  this.outputs = [ 
    cubeMapNodeBlurredALittleExposed,
    cubeMapNodeBlurredExposed,
    cubeMapNodeBlurredALotExposed
  ];
}