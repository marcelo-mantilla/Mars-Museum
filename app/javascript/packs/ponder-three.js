import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Interaction } from 'three.interaction';
import * as TWEEN from "@tweenjs/tween.js"

//Set position increments for later
var dx = .05;
var dy = -.01;
var dz = -.05;

// ====================== INITIALIZERS ======================

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer ({
  canvas: document.querySelector('#bg')
})
const interaction = new Interaction(renderer, scene, camera);

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.setZ(55)

renderer.render (scene, camera)

// ====================== Site Functionality ======================

var toBloom = new Audio('/audio/pondermars-tobloom.mp3')


var muteButton = document.getElementById("mute-unmute")
muteButton.addEventListener("click", () => {
  console.log("Hello!")
})
//Steps:
// Find a way to toggle the different SVG's. Look it up.
// have the music auto play on page load
// have the toggler mute and unmute the audio within the function
//
// bonus: resize the SVG on hover.
//
// NEXT:
// Set the two buttons, one for Mars Museum (for now).
// have the buttons appear after 5 seconds
// reference that to the next page on your website. Use RUBY!


// ====================== MARS ======================

const marsTexture = new THREE.TextureLoader().load('/images/texture-maps/mars/5672_marsmap2k.jpg')
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(12, 32, 28),
  new THREE.MeshStandardMaterial( {
    map: marsTexture
  })
)
scene.add(mars)
var marsVector = new THREE.Vector3(0,0,0)

mars.cursor = 'pointer'
mars.on('click', ev => {
  console.log("Mars click!")
  dx = 0
  dy = 0
  dz = 0
  const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
  new TWEEN.Tween(coords).to({x: mars.position.x, y: mars.position.y, z: (mars.position.z + 30)}).onUpdate(() =>
      camera.position.set(coords.x, coords.y, coords.z)
    ).start()

  var tween = new TWEEN.Tween(coords)
  tween.to({x: 0}, 500)
  tween.to({y: 0}, 800)
  tween.to({z: 32}, 500)
  tween.start()
  // camera.position.set(0, 0, 32)
})
// mars.on('mouseover', function(ev) {
//   console.log("Mars mouseover!")
//   camera.lookAt(marsVector);
// })

// ====================== MOONS OF MARS ======================

var deimosVector = new THREE.Vector3(0,0,0)
var phobosVector = new THREE.Vector3(0,0,0)

const loaderDeimos = new GLTFLoader()
loaderDeimos.load('/images/3d-models/Deimos_1_1000.glb', function ( gltf ){
  var deimos = gltf.scene
  let fileAnimations = gltf.animations

  deimos.position.x = 49
  deimos.scale.set(0.2, 0.2, 0.2)

  scene.add(deimos)

  let r = 47
  let theta = 0
  let dTheta = 2 * Math.PI / 1550

  var render = function() {
    mars.rotation.y += .0002

    //Increment theta, and update moon x and y
    //position based off new theta value
    theta += dTheta
    deimos.position.x = r * Math.cos(theta)
    deimos.position.z = r * Math.sin(theta)

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()

  // deimos.cursor = 'pointer'
  // deimos.on('click', ev => {
  //   console.log("Deimos click!")
  // })
  // deimos.on('mouseover', function(ev) {
  //   console.log("Deimos mouseover!")
  // })
})

const loaderPhobos = new GLTFLoader()
loaderPhobos.load('/images/3d-models/Phobos_1_1000.glb', function ( gltf ){
  var phobos = gltf.scene
  let fileAnimations = gltf.animations

  phobos.position.x = 30
  phobos.scale.set(0.18, 0.18, 0.18)

  scene.add(phobos)

  let r = 30
  let theta = 0
  let dTheta = 2 * Math.PI / 1000

  var render = function() {
    mars.rotation.y += .001

    //Increment theta, and update moon x and y
    //position based off new theta value
    theta += dTheta
    phobos.position.x = r * Math.cos(theta)
    phobos.position.z = r * Math.sin(theta)

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
  // phobos.cursor = 'pointer'
  // phobos.on('click', ev => {
  //   console.log("Phobos click!")
  // })
  // phobos.on('mouseover', function(ev) {
  //   console.log("Phobos mouseover!")
  // })
})

// ====================== Lights ======================
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(50,0,40)
scene.add(pointLight)

//====================== HELPERS ======================
const pointLightHelper = new THREE.PointLightHelper( pointLight, 2 )
const axesHelper = new THREE.AxesHelper( 100 ) //X = RED, Y = GREEN, Z = BLUE
const gridHelper = new THREE.GridHelper(200,50)
// scene.add(axesHelper)
// scene.add(pointLightHelper)
// scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false;

//====================== STARS BACKGROUND ======================
// var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
// var starMaterial = new THREE.MeshPhongMaterial({
//   map: new THREE.ImageUtils.loadTexture("/images/universe-images/nebula.jpeg"),
//   side: THREE.DoubleSide,
//   shininess: 0
// });
// var starField = new THREE.Mesh(starGeometry, starMaterial);
// scene.add(starField);


////====================== FUNCTIONS ======================
//Render loop
var render = function() {
  mars.rotation.y += .0009;

  //Update the camera position
  camera.position.x += dx;
  camera.position.y += dy;
  camera.position.z += dz;

  //Flyby reset
  if (camera.position.z < -70) {
    camera.position.set(0,25,70);
  }

  //Point the camera towards the earth
  camera.lookAt(marsVector);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
render();

function addStars(){
  const geometry = new THREE.SphereGeometry(0.2, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material )

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 480 ))

  star.position.set(x, y, z)
  scene.add(star)
}
Array(320).fill().forEach(addStars)

//Responsive window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight

  camera.updateProjectionMatrix()
})

function animate(){
  requestAnimationFrame( animate )
  mars.rotation.y += 0.001
  mars.rotation.x += 0.0
  mars.rotation.z += 0.0

  controls.update()

  renderer.render (scene, camera)
  TWEEN.update()
}
animate()

// function moveCamera(){
//
//   const t = document.body.getBoundingClientRect().top //Allows us to see how far from the top of the page we are
//
//   camera.position.z = t * -0.01
//   camera.position.x = t * 0.0002
// }
// document.body.onscroll = moveCamera
