import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

//Variables
const sizes = {
  width: window.innerWidth,
  heith: window.innerHeight
};
let mousePosition = { x: 0, y: 0 };
const fov = 40;
const aspectRatio = sizes.width / sizes.heith;
const near = 1;
const far = 100;

//Scene
const scene = new THREE.Scene();

//Create sphere
const moonAlbedo = new THREE.TextureLoader().load('moon_Albedo.jpeg');
const moonNormal = new THREE.TextureLoader().load('moon_Normal.jpeg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4, 64, 64),
  new THREE.MeshStandardMaterial({
    map: moonAlbedo,
    normalMap: moonNormal,
    // color: "#ffffff",
    // roughness: 0.5,
  })
)
scene.add(moon);

//Light
const hemisphereLight = new THREE.HemisphereLight(0xffffff,0x000000, 0.5);
const globalLight = new THREE.AmbientLight(0xffffff, 0.9);
const shadowLight = new THREE.DirectionalLight(0xff8f16, 0.4);
shadowLight.position.set(0, 450, 350);
shadowLight.castShadow = true;
shadowLight.shadow.camera.left = -400;
shadowLight.shadow.camera.right = 400;
shadowLight.shadow.camera.top = 400;
shadowLight.shadow.camera.bottom = -400;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 2000;
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;
scene.add(hemisphereLight, shadowLight, globalLight);

// const lightHelper = new THREE.DirectionalLightHelper(shadowLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

//Camera
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
camera.position.set( 40, 10, 8 );
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha:true });
renderer.setSize(sizes.width, sizes.heith);
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.render(scene, camera);




//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set( 0, 0.5, 0 );
controls.enableDamping = true;
controls.enablePan = false;
// controls.enableZoom = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 5;

//Resize
window.addEventListener('resize', handleWindowResize, false);
function handleWindowResize() {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.heith = window.innerHeight;
  //Update Camera
  renderer.setSize(sizes.width, sizes.heith);
  camera.aspect = sizes.width / sizes.heith;
  camera.updateProjectionMatrix();
}

//Mouse track
// document.addEventListener('mousemove', handleMouseMove, false);
// function handleMouseMove(event) {
//   var tx = -1 + (event.clientX / sizes.width)*2;
//   var ty = 1 - (event.clientY / sizes.heith)*2;
//   mousePosition = {x:tx, y:ty};
// }


const animate = () => {
  moon.rotation.y += 0.01;
  // controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate()