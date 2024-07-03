import * as THREE from 'three';

var w = 320;
var h = 480;

var scene, camera, renderer, container;
var cube, sphere;

function init(){
	initTHREE();
	addObjects();
	addLights();
	prepScene();
	events();

	renderer.setAnimationLoop( animate );
}

function events(){
	document.getElementById('btn').onclick = initAnim;
}

function prepScene(){
	cube.visible = false;
	sphere.visible = false;
}

function initAnim(){
	cube.visible = true;
	sphere.visible = true;
	gsap.from(cube.position, 1, {delay: 0.1, y: 7, ease: 'bounce.out'})
	gsap.from(sphere.position, 1, {delay: 1.1, y: 7, ease: 'bounce.out'})
}

function initTHREE(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, w / h, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	});
	renderer.setSize( w, h );
	container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	camera.position.z = 4;
	camera.position.y = 1.4;
	camera.lookAt( 0, 0.8, 0 );
}

function addObjects(){
	// ground
	var groundGeo = new THREE.PlaneGeometry( 5, 5 );
	var groundMat = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	const ground = new THREE.Mesh( groundGeo, groundMat );
	ground.rotation.x = 90 * Math.PI/180;
	scene.add( ground );

	// box
	const boxGeo = new THREE.BoxGeometry( 1, 1, 1 );
	const boxMat = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( boxGeo, boxMat );
	cube.position.y = 0.5;
	cube.rotation.y = 45 * Math.PI/180;
	scene.add( cube );

	// sphere
	const sphereGeo = new THREE.SphereGeometry( 0.5, 32, 16 ); 
	const sphereMat = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); 
	sphere = new THREE.Mesh( sphereGeo, sphereMat ); 
	sphere.position.y = 1.5;
	scene.add( sphere );
}

function addLights(){
	const light = new THREE.AmbientLight( 0x494949 );
	scene.add( light );

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
	directionalLight.position.set(10, 4, 7)
	scene.add( directionalLight )
	const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	scene.add( helper );

	var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.7 );
	directionalLight2.position.set(-10, 10, -2)
	scene.add( directionalLight2 )
	var helper2 = new THREE.DirectionalLightHelper( directionalLight2, 5 );
	scene.add( helper2 );
}

var count = 0;

function animate() {

	count += 0.2;
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	var radius = 4;
	var angle  = count;

	var x = radius * Math.cos(Math.PI * 2 * angle / 360);
	var z = radius * Math.sin(Math.PI * 2 * angle / 360);

	camera.position.x = x;
	camera.position.z = z;
	camera.lookAt( 0, 0.8, 0 );


	renderer.render( scene, camera );


}


init()