import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

var w = 320;
var h = 480;

var scene, camera, renderer, container;
var cube, sphere, logo, logoMesh, can_lime, controls;

var assets = {
	cur: 0,
	tot: 3,
	textures: {},
	models: {},
}

function init(){
	initTHREE();
	initLoader();
}

function initLoader(){

	// TEXTURE LOADING
	const loader = new THREE.TextureLoader();

	loader.load(
		'images/eskimi_logo_1024x512.png',
		function ( texture ) {
			assets.textures.logo = texture;
			assetLoaded();
		},
		undefined,
		function ( err ) {
			console.error( 'An error happened.' );
		}
	);

	// MODEL LOADING
	const GLBloader = new GLTFLoader();
	GLBloader.load(
		'images/logo_geo_02.glb',
		function ( gltf ) {

			assets.models.logoMesh = gltf.scene;

			assetLoaded();
		},
		function ( xhr ) {
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);

	GLBloader.load(
		'images/Lime.glb',
		function ( gltf ) {

			assets.models.can_lime = gltf.scene;

			assetLoaded();
		},
		function ( xhr ) {
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);

	// ENV LIGHT
	const pmremGenerator = new THREE.PMREMGenerator( renderer );
	const hdriLoader = new RGBELoader()
	hdriLoader.load( 'images/illovo_beach_balcony_1k.hdr', function ( texture ) {
	  const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
	  texture.dispose(); 
	  scene.environment = envMap
	} );

}

function assetLoaded(){
	assets.cur++;
	if(assets.cur == assets.tot){
		afterAllLoaded();
	}
}


function afterAllLoaded(){
	addObjects();
	addLights();
	prepScene();
	events();

	renderer.setAnimationLoop( animate );
}

function events(){
}

function prepScene(){
}

function initAnim(){
}

function initTHREE(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, w / h, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	});
	renderer.setSize( w, h );
	renderer.shadowMap.enabled = true;
	container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	camera.position.z = 4;
	camera.position.y = 3;
	camera.lookAt( 0, 2, 0 );

	controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 1.5, 0 );

}

function addObjects(){
	// ground
	var groundGeo = new THREE.PlaneGeometry( 5, 5 );
	var groundMat = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	const ground = new THREE.Mesh( groundGeo, groundMat );
	ground.rotation.x = 90 * Math.PI/180;
	ground.receiveShadow = true;
	scene.add( ground );

	// logo
	var logoGeo = new THREE.BoxGeometry( 1, 0.5, 1 );

	var logoTex = assets.textures.logo;
	logoTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
	logoTex.needsUpdate = true;

	var logoMat = new THREE.MeshPhongMaterial( {
		color: 0xffffff, 
		side: THREE.DoubleSide,
		transparent: true,
		map: logoTex,
	} );

	logo = new THREE.Mesh( logoGeo, logoMat );
	logo.rotation.x = 0 * Math.PI/180;
	logo.position.y = 1;
	logo.position.z = -2;

	logo.castShadow = true;

	scene.add( logo );

	// logo mesh
	logoMesh = assets.models.logoMesh;

	logoMesh.position.y = 2.5;
	logoMesh.scale.set(0.6, 0.6, 0.6)
	

	logoMesh.traverse( function(child) {
		if ( child.isMesh ) {
			child.castShadow = true;
		}
	})

	scene.add(logoMesh)

	// can
	can_lime = assets.models.can_lime;

	can_lime.position.y = 0.5;
	var s = 10;
	can_lime.scale.set(s, s, s)
	

	can_lime.traverse( function(child) {
		if ( child.isMesh ) {
			child.castShadow = true;
		}
	})

	scene.add(can_lime)

}

function addLights(){
	const light = new THREE.AmbientLight( 0x2e2e2e );
	scene.add( light );

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.25 );
	directionalLight.position.set(10, 4, 7)
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	scene.add( directionalLight )
	const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	scene.add( helper );

	var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.7 );
	directionalLight2.position.set(-10, 10, -2)
	directionalLight2.castShadow = true;
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	scene.add( directionalLight2 )
	// var helper2 = new THREE.DirectionalLightHelper( directionalLight2, 5 );
	// scene.add( helper2 );
}

var count = 0;

function animate() {
	count++;

	logo.rotation.y = count * 0.03;
	logoMesh.rotation.y = count * 0.03;
	can_lime.rotation.y = count * 0.03;


	controls.update();
	renderer.render( scene, camera );


}


init()