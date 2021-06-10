import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Interaction } from 'three.interaction';
import * as TWEEN from "@tweenjs/tween.js"

// ====================== INITIALIZERS ======================
var dx = .05;
var dy = -.01;
var dz = -.05;
var projects = document.getElementById("projects")
var ponderMars = document.getElementById("ponder-mars")
console.log(ponderMars)

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
var muteButton = document.getElementsByClassName('mute-button')[0]

muteButton.addEventListener("click", function() {
  muteButton.classList.toggle("fa-volume-mute")
  muteButton.classList.toggle("fa-volume-up")
  muteButton.classList.toggle("text-dark")

  if (muteButton.classList.contains("fa-volume-mute")) {
    toBloom.pause()
  } else if (muteButton.classList.contains("fa-volume-up")){
    toBloom.play()
  }
  ponderMars.classList.remove("none")
  ponderMars.style.animation = "logo-animation"
  ponderMars.style.animationDuration = "7s"
  ponderMars.style.animationDelay = "10s"
  ponderMars.style.animationFillMode = "forwards"
})

window.addEventListener("wheel", function (){
  projects.classList.add("none")
})

// ====================== SUN ======================
const sunGeo = new THREE.OctahedronGeometry(10, 1)
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe6c0,
  roughness: 0,
  metalness: 1,
  emissive: 0xffe6c0
})
const sun = new THREE.Mesh(sunGeo, sunMaterial)
sun.position.set(728,0,600)
scene.add(sun)

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
  
  setTimeout(function(){}, 2200)
  projects.classList.remove("none")
})

// ====================== MOONS OF MARS ======================
var deimosVector = new THREE.Vector3(0,0,0)
var phobosVector = new THREE.Vector3(0,0,0)

const loaderDeimos = new GLTFLoader()
loaderDeimos.load('/images/3d-models/Deimos_1_1000.glb', function ( gltf ){
  var deimos = gltf.scene
  let fileAnimations = gltf.animations

  deimos.position.x = 52
  deimos.position.y = 1
  deimos.scale.set(0.09, 0.09, 0.09)

  scene.add(deimos)

  let r = 52
  let theta = 0
  let dTheta = 2 * Math.PI / 4430

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
})

const loaderPhobos = new GLTFLoader()
loaderPhobos.load('/images/3d-models/Phobos_1_1000.glb', function ( gltf ){
  var phobos = gltf.scene
  let fileAnimations = gltf.animations

  phobos.position.x = 35
  phobos.scale.set(0.13, 0.14, 0.13)
  scene.add(phobos)

  let r = 35
  let theta = 0
  let dTheta = 2 * Math.PI / 2850

  var render = function() {
    mars.rotation.y += .001

    theta += dTheta
    phobos.position.x = r * Math.cos(theta)
    phobos.position.z = r * Math.sin(theta)

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
})

// ====================== Lights ======================
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(50,0,40)
scene.add(pointLight)

//====================== HELPERS ======================
// const pointLightHelper = new THREE.PointLightHelper( pointLight, 2 )
// const axesHelper = new THREE.AxesHelper( 100 ) //X = RED, Y = GREEN, Z = BLUE
// const gridHelper = new THREE.GridHelper(200,50)
// // scene.add(axesHelper)
// scene.add(pointLightHelper)
// // scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false;

//====================== STARS BACKGROUND ====================== add with button in home!
function toggleStars() {
// var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
// var starMaterial = new THREE.MeshPhongMaterial({
//   map: new THREE.ImageUtils.loadTexture("/images/universe-images/nebula.jpeg"),
//   side: THREE.DoubleSide,
//   shininess: 0
// });
// var starField = new THREE.Mesh(starGeometry, starMaterial);
// scene.add(starField);
}

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
  const geometry = new THREE.IcosahedronGeometry(0.2, 0)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material )

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 480 ))

  star.position.set(x, y, z)
  scene.add(star)
}
Array(70).fill().forEach(addStars)

//Responsive window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight

  camera.updateProjectionMatrix()
})

function animate(){
  requestAnimationFrame( animate )
  mars.rotation.y += 0.0002
  mars.rotation.x += 0.0
  mars.rotation.z += 0.0
  controls.update()
  renderer.render (scene, camera)
  TWEEN.update()
}
animate()
