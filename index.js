import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

//Scene
const scene = new THREE.Scene();

//Create sphere
const geometry = new THREE.SphereGeometry(3,64,64)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Sizes
const sizes = {
  width: window.innerWidth,
  heith: window.innerHeight
}

//Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.heith, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.heith);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

//Resize
window.addEventListener('resize', () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.heith = window.innerHeight;
  //Update Camera
  camera.aspect = sizes.width / sizes.heith;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.heith);
})

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop()