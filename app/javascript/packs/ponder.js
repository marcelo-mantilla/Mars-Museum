import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer ({
  canvas: document.querySelector('#bg')
})

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.setZ(50)

renderer.render (scene, camera)

const geometry = new THREE.IcosahedronGeometry(10, 1)
const geometry2 = new THREE.TorusGeometry(10, 3, 16, 100)

const material = new THREE.MeshStandardMaterial( {color: 0xFF6347 })
const icosahedron = new THREE.Mesh(geometry, material)
const torus = new THREE.Mesh(geometry2, material)

// scene.add(icosahedron)
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0,-5,20)
scene.add(pointLight)

//HELPERS
const pointLightHelper = new THREE.PointLightHelper( pointLight, 2 )
const axesHelper = new THREE.AxesHelper( 100 ) //X = RED, Y = GREEN, Z = BLUE
const gridHelper = new THREE.GridHelper(200,50)
scene.add(axesHelper)
scene.add(pointLightHelper)
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

const spaceTexture = new THREE.TextureLoader().load('assets/images/universe-images/7058.jpeg')


animate()
Array(200).fill().forEach(addStars)


//FUNCTIONS

function addStars(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material )
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 150 ))
  
  star.position.set(x, y, z)
  scene.add(star)
}

function animate(){
  requestAnimationFrame( animate )
  torus.rotation.x += 0.01
  torus.rotation.y += 0.01
  torus.rotation.z += 0.01

  controls.update()

  renderer.render (scene, camera)
}

function moveCamera(){
  
  const t = document.body.getBoundingClientRect().top //Allows us to see how far from the top of the page we are
  
  camera.position.z = t * -0.01
  camera.position.x = t * 0.0002
}

document.body.onscroll = moveCamera
