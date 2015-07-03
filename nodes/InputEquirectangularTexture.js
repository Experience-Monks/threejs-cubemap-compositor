var Signal = require('signals').Signal;
var config = require('../config');

function CubeMapNodeEquirectangularTexture (renderer, texture, opt) {
  opt = opt || {};
  this.renderer = renderer;
  this.update = this.update.bind(this);

  var scene = new THREE.Scene();
  var camera = new THREE.CubeCamera(0.1, 1000, 256, config.textureType);
  scene.add(camera);
  var updateSignal = new Signal();

  var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
  var sphereMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  if (opt.flipX) {
    sphere.scale.x *= -1;
  }
  scene.add(sphere);

  this._sphereMaterial = sphereMaterial
  this.updateSignal = updateSignal;
  this.camera = camera;
  this.scene = scene;
  this.texture = camera.renderTarget;
}

CubeMapNodeEquirectangularTexture.prototype.setTexture = function(texture) {
  this._sphereMaterial.map = texture
}

CubeMapNodeEquirectangularTexture.prototype.update = function() {
  this.camera.updateCubeMap(this.renderer, this.scene);
  this.updateSignal.dispatch();
}

module.exports = CubeMapNodeEquirectangularTexture ;