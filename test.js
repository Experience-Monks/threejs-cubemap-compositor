THREE = require('three');
var View = require('threejs-managed-view').View;
var Pointers = require('input-unified-pointers');
var CheckerRoom = require('threejs-checkerroom');
var ReflectionSuite = require('./ReflectionSuite');

var view = new View({
	useRafPolyfill: false,
	rendererSettings: { 
		alpha: true, //needs to be true for firefox on windows to not render black rectangles in garage cubbies
		antialias: true, 
		premultipliedAlpha: true, 
		preserveDrawingBuffer: true
	}
});

view.renderManager.onEnterFrame.add(function(){
	// fpsController.rotationSpeed = originalRotationSpeed * view.camera.fov / originalFov;
	view.renderer.clear(true, true, true);
	reflectionSuite.processQueue();
	counter++;
	view.camera.position.x = Math.cos(counter * 0.01) * radius;
	view.camera.position.z = Math.sin(counter * 0.01) * radius;
	view.camera.lookAt(sphere.position);
})

view.renderManager.onExitFrame.add(function() {
})

view.renderer.autoClear = false;
var pointers = new Pointers(view.canvas);

var scene = view.scene;
view.camera.position.multiplyScalar(0.3);

var checkerRoom = new CheckerRoom(16, 12, 8);
scene.add(checkerRoom);

var sphereGeometry = new THREE.SphereGeometry(1, 64, 32);

var lightMesh = new THREE.Mesh(
	sphereGeometry,
	new THREE.MeshBasicMaterial({
		color: new THREE.Color(0.8, 0.8, 0.8)
	})
);

// lightMesh.position.x = 1.3;
lightMesh.position.y = 3;
lightMesh.scale.multiplyScalar(0.2);
scene.add(lightMesh);

var light = new THREE.AmbientLight(0x7f7f7f);
scene.add(light);

var reflectionSuite = new ReflectionSuite(view.renderer, view.camera, scene, pointers);

var sphereMaterial = new THREE.MeshBasicMaterial({
	color: 0,
	envMap: reflectionSuite.cubeMapNodeMaskedExposed.texture,
	combine: THREE.AddOperation
})
var sphere = new THREE.Mesh(
	sphereGeometry,
	sphereMaterial
);

reflectionSuite.addMesh(sphere);
reflectionSuite.addMaterial(sphereMaterial);

scene.add(sphere);
sphere.position.y = 1;
view.camera.lookAt(sphere.position);

reflectionSuite.cubeMapNodeInput.update();

// var fpsController = new FpsController(view.camera, view.canvas);
// view.renderManager.onEnterFrame.add(fpsController.update);
var counter = 0;
var radius = 2.5;
// var originalRotationSpeed = fpsController.rotationSpeed;
// var originalFov = view.camera.fov;
