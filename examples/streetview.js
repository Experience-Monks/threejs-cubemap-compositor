/*globals google*/
var THREE = global.THREE = require('three')

var config = require('../config');
config.textureType = THREE.FloatType;

var equirect = require('google-panorama-equirectangular')
var panorama = require('google-panorama-by-location')
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var streetview = require('awesome-streetview')

var InputTexture = require('../nodes/InputEquirectangularTexture')
var SuperMultisampleBlur = require('../nodes/SuperMultisampleBlur')
var StaticReflectionGraph = require('../nodes/StaticReflectionGraph')

var app = createOrbitViewer({
  clearColor: 0xffffff,
  clearAlpha: 1.0,
  fov: 45,
  near: 0.0001,
  position: new THREE.Vector3(0, 0, -0.1)
})

var texture = new THREE.Texture()
texture.minFilter = THREE.LinearFilter
texture.generateMipmap = false

// transparent canvas to start (white)
var canvas = document.createElement('canvas')
texture.needsUpdate = true
texture.image = canvas

// add a double-sided sphere
var cubeTex = new THREE.CubeTexture()
var geo = new THREE.SphereGeometry(1, 84, 84)
var mat = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
})
var sphere = new THREE.Mesh(geo, mat)

var itemGeo = new THREE.TorusKnotGeometry(0.02, 0.008, 128, 128)
var itemMat = new THREE.MeshPhongMaterial({
  // transparent: true,
  // shininess: 20,
  // metal: true,
  color: 0xffffff,
  combine: THREE.AddOperation,
  reflectivity: 0.6
})
var item = new THREE.Mesh(itemGeo, itemMat)

// var light = new THREE.PointLight( 0xffffff, 1, 500 )
// light.position.set( 0.025, 0.1, -0.025 )
// app.scene.add( light )

var ambient = new THREE.AmbientLight( 0x404040 )
// app.scene.add(ambient)
app.scene.add(sphere)
sphere.material.map = texture

// load a random panosphere / streetview
var location = streetview()
// location=[-26.938312, -68.74491499999999]

console.log(location)
panorama(location, function (err, result) {
  if (err) throw err
  // load the equirectangular image
  equirect(result.id, {
    tiles: result.tiles,
    canvas: canvas,
    crossOrigin: 'Anonymous',
    zoom: 4
  })
    .on('progress', function () {
      texture.needsUpdate = true
    })
    .on('complete', function (image) {
      texture.needsUpdate = true
      var renderer = app.renderer
      var input = new InputTexture(renderer, texture)
      var graph = new StaticReflectionGraph(renderer, input, {
        baseline: 'panosphere-baseLine.png',
        physicalLight: 'panosphere-physicalLight.png',
        extraLight: 'panosphere-extraLight.png',
        lightMask: 'panosphere-lightMask.png'
      })

      var blur = graph.outputs[0]
      // var blur = new SuperMultisampleBlur(renderer, input, 0.01, 2)
      // decodeBaseline.update()
      // setTimeout(function() {
        input.update()
      // }, 2000)
      item.material.envMap = blur.texture
      app.scene.add(item)
    })
})
