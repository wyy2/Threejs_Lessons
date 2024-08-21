import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

var w = 300;
var h = 250;

var d;
var scene, camera, renderer, container, candy;
var cube, sphere, logo, logoMesh, cup1, cup2, cup3, controls;

var assets = {
	cur: 0,
	tot: 3,
	textures: {},
	models: {},
}

d = {
	cup: {
		y0: 0.52,
		dx: 0.9,
	},
	list: [0, 1, 2],
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
		'images/strawberry.glb',
		function ( gltf ) {

			assets.models.candy = gltf.scene;

			assetLoaded();
		},
		function ( xhr ) {
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);

	GLBloader.load(
		'images/plastic_disposable_cup.glb',
		function ( gltf ) {

			assets.models.cup = gltf.scene;

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
	document.getElementById('startGame').addEventListener('click', startGame);
	document.getElementById('container').addEventListener('click', contClick);
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
	renderer.setPixelRatio(2);
	renderer.setSize( w, h );
	renderer.shadowMap.enabled = true;
	container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	camera.position.z = 3.5;
	camera.position.y = 1;
	// camera.lookAt( 0, 0.75, 0 );

	controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0.5, 0 );

	renderer.toneMapping = THREE.NeutralToneMapping;
	renderer.toneMappingExposure = 0.25;

}

function addObjects(){
	// ground
	var groundGeo = new THREE.PlaneGeometry( 5, 5 );
	var groundMat = new THREE.MeshPhongMaterial( {color: 0xb27dea, side: THREE.DoubleSide} );
	const ground = new THREE.Mesh( groundGeo, groundMat );
	ground.rotation.x = 90 * Math.PI/180;
	ground.receiveShadow = true;
	scene.add( ground );


	// cup
	cup1 = assets.models.cup;

	cup1.position.y = d.cup.y0;
	var s = 0.05;
	cup1.scale.set(s, s, s)
	cup1.rotation.x = 180 * Math.PI / 180;
	cup1.position.x = -d.cup.dx;
	
	cup1.traverse( function(child) {
		if ( child.isMesh ) {
			child.castShadow = true;
		}
	})
	cup1.children[0].name = 'cup1';

	scene.add(cup1)

	//
	cup2 = cup1.clone();
	cup2.position.x = 0;
	cup2.children[0].name = 'cup2';
	scene.add(cup2)

	cup3 = cup1.clone();
	cup3.children[0].name = 'cup3';
	cup3.position.x = d.cup.dx;
	scene.add(cup3)

	// candy

	candy = assets.models.candy;
	var s = 0.65;
	candy.scale.set(s, s, s)
	candy.position.y = -0;
	scene.add(candy)

	console.log(cup1)



	cup1.traverse( function(child) {
		if ( child.isMesh ) {
			child.name = 'cup1';

			console.log( child )

			// child.material.opacity = 0.2;
			// child.material.transparent = true;
		}
	})
	cup2.traverse( function(child) {
		if ( child.isMesh ) {
			child.name = 'cup2';
		}
	})
	cup3.traverse( function(child) {
		if ( child.isMesh ) {
			child.name = 'cup3';
		}
	})

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

function startGame(){
	gsap.to(cup2.position, 0.4, {y: "+="+0.5, yoyo: true, repeat: 1})
	gsap.to(cup2.rotation, 0.4, {x: "+="+(-30*Math.PI/180), z: "+="+(-15*Math.PI/180), yoyo: true, repeat: 1})
	
	setTimeout( startMix, 1000 );
}

function startMix(){
	var amm = 3;
	var del = 1;

	console.log( candy )
	candy.visible = false;

	for(var i=0; i<amm; i++){
		doSwap(i, i*del);
	}

	setTimeout(startGues, 1000)
}

function doSwap(num, del){
	// 01, 02, 12, 
	// d.list
	var cups = [cup1, cup2, cup3];
	var swapOrders = [[0, 1], [0, 2], [1,2]];
	var xPos = [-d.cup.dx, 0, d.cup.dx];
	var swapAmm = 3;
	var rn = Math.floor( swapAmm * Math.random() ) // 0 1 2
	var order = swapOrders[rn]; // [0, 1]

	var hand1 = cups[ order[0] ]; // cup1
	var hand2 = cups[ order[1] ]; // cup2


	gsap.to(hand1.position, 0.5, {delay: del, x: xPos[order[1]]})
	gsap.to(hand2.position, 0.5, {delay: del, x: xPos[order[0]]})

	switch(rn){
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
	}
}

function startGues(){
	candy.visible = false;
	// change candy position where it was before (inside the cup)
	candy.position.x = cup2.position.x;


}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function contClick(event){
	console.log('click')

	pointer.x = ( event.clientX / w ) * 2 - 1;
	pointer.y = - ( event.clientY / h ) * 2 + 1;

	// -0.5 -> 0.5

	console.log( pointer )

	raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects( [cup1, cup2, cup3] );
	console.log(cup1)
	console.log( intersects );
	var clickName;
	for ( let i = 0; i < intersects.length; i ++ ) {
		// intersects[ i ].object.material.color.set( 0xff0000 );

		var name = intersects[ i ].object.name;

		console.log('name', name)

		// name
		clickName = name;
	}

	var cupEl;
	if(clickName == 'cup1'){
		cupEl = cup1;
	} else if(clickName == 'cup2'){
		cupEl = cup2;
	} else if(clickName == 'cup3'){
		cupEl = cup3;
	}

	if(cupEl){
		var rep = 1;

		if(clickName == 'cup2'){
			// we won
			endGame();
			rep = 0;
		}

		gsap.to(cupEl.position, 0.4, {y: "+="+0.5, yoyo: true, repeat: rep})
		gsap.to(cupEl.rotation, 0.4, {x: "+="+(-30*Math.PI/180), z: "+="+(-15*Math.PI/180), yoyo: true, repeat: rep})


	}


}

function endGame(){
	gsap.to(candy.position, 1, {delay: 0.5, z: 2, y: 0.75, onComplete: function(){
		
		console.log('particles start')

		var orig_mat;

		candy.traverse( function(child) {
			if ( child.isMesh ) {
				orig_mat = child.material;
			}
		})


		var amm = 20;
		for(var i=0; i<amm; i++){
			var p = candy.clone()

			p.traverse( function(child) {
				if ( child.isMesh ) {
					child.material = orig_mat.clone();
				}
			})

			var s = 0.1;
			p.scale.set(s, s, s);
			scene.add(p);

			var dur = 0.4 + 0.4 * Math.random();
			var dist = 1.2;
			var x = 0 + dist * (0.5 - Math.random())
			var y = 0.75 + dist * (0.5 - Math.random())
			var z = 2 + dist * (0.5 - Math.random())

			gsap.to(p.position, dur, {y: y, ease: 'back.out'})
			gsap.to(p.position, dur, {x: x, z: z})

			gsap.to(p.rotation, dur, {y: 90 * (0.5-Math.random()) * Math.PI / 180})




			p.traverse( function(child) {
				if ( child.isMesh ) {
					child.material.transparent = true;
					gsap.to(child.material, 0.5, {delay: Math.random(), opacity: 0});
				}
			})

		}


		// candy.visible = false;

	}})

}


// function onPointerMove( event ) {
// 	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }

// function render() {

// 	raycaster.setFromCamera( pointer, camera );

// 	const intersects = raycaster.intersectObjects( scene.children );
// 	for ( let i = 0; i < intersects.length; i ++ ) {
// 		intersects[ i ].object.material.color.set( 0xff0000 );
// 	}

// }

var count = 0;

function animate() {
	count++;

	// logo.rotation.y = count * 0.03;
	// logoMesh.rotation.y = count * 0.03;
	// cup.rotation.y = count * 0.03;


	controls.update();
	renderer.render( scene, camera );


}


init()