import * as THREE from "three";

//VARIABLES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const yellow = 0xffc800;
const red = 0xff0000;
const purple = 0xa200ff;
const green = 0x03fc2c;
const blue = 0x031cfc;
const cyan = 0x03d3fc;

//SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 4, 6);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper)

//LIGHT
const light = new THREE.SpotLight(yellow, 10);
light.position.set(5, 5, 2);
light.castShadow = true;
light.shadow.mapSize.width = 10000;
light.shadow.mapSize.height = light.shadow.mapSize.width;
light.penumbra = 0.5;
const lightBack = new THREE.PointLight(red, 2);
lightBack.position.set(0, -3, -1);
const rectLight = new THREE.RectAreaLight(purple, 20, 2, 2);
rectLight.position.set(1, 1, 1);
rectLight.lookAt(0, 0, 0);
scene.add(light, lightBack, rectLight);
// const lightHelper1 = new THREE.SpotLightHelper(light);
// const lightHelper2 = new THREE.PointLightHelper(lightBack);
// scene.add(lightHelper1, lightHelper2);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  1,
  500
);
camera.position.set(-0.3, 0, 5);
scene.add(camera);

//RENDERER
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.needsUpdate = true;

//SPACE OBJECTS
const sceneGroup = new THREE.Object3D();
const particularGroup = new THREE.Object3D();
const modularGroup = new THREE.Object3D();

function generateParticle(num, amp = 2) {
  const gmaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const gparticular = new THREE.CircleGeometry(0.1, 5);
  for (let i = 1; i < num; i++) {
    const pscale = 0.001 + Math.abs(mathRandom(0.03));
    const particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(amp), mathRandom(amp), mathRandom(amp));
    particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
    particular.scale.set(pscale, pscale, pscale);
    particular.speedValue = mathRandom(1);
    particularGroup.add(particular);
  }
}
generateParticle(200, 2);

sceneGroup.add(particularGroup);
scene.add(modularGroup);
scene.add(sceneGroup);

function mathRandom(num = 1) {
  var setNumber = -Math.random() * num + Math.random() * num;
  return setNumber;
}

function init() {
  for (let i = 0; i < 30; i++) {
    //Throw random shape
    const oneOrZero = Math.round(Math.random());
    let geometry;
    if (oneOrZero === 0) {
      geometry = new THREE.IcosahedronGeometry(1);
    } else {
      geometry = new THREE.DodecahedronGeometry(1);
    }
    //Init object
    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      transparent: false,
      roughness: 0.4,
      metalness: 0.5,
      opacity: 1,
      wireframe: false,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.speedRotation = Math.random() * 0.1;
    cube.positionX = mathRandom();
    cube.positionY = mathRandom();
    cube.positionZ = mathRandom();
    cube.castShadow = true;
    cube.receiveShadow = true;
    //Behavior
    const newScaleValue = mathRandom(0.3);
    cube.scale.set(newScaleValue, newScaleValue, newScaleValue);
    cube.rotation.x = mathRandom((180 * Math.PI) / 180);
    cube.rotation.y = mathRandom((180 * Math.PI) / 180);
    cube.rotation.z = mathRandom((180 * Math.PI) / 180);
    cube.position.set(cube.positionX, cube.positionY, cube.positionZ);
    modularGroup.add(cube);
  }
}

//RESIZE WINDOW
function handleWindowResize() {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", handleWindowResize, false);

//MOUSE EVENT
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersected, touchedObject;
function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function onMouseDown(event) {
  event.preventDefault();
  onMouseMove(event);
  raycaster.setFromCamera(mouse, camera);
  intersected = raycaster.intersectObjects(modularGroup.children);
  if (intersected.length > 0) {
    if (touchedObject != intersected[0].object) {
      if (touchedObject)
        touchedObject.material.emissive.setHex(touchedObject.currentHex);
      touchedObject = intersected[0].object;
      touchedObject.currentHex = touchedObject.material.emissive.getHex();
      touchedObject.material.emissive.setHex(0xffff00);
    } else {
      if (touchedObject)
        touchedObject.material.emissive.setHex(touchedObject.currentHex);
      touchedObject = null;
    }
  }
}
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown", onMouseDown, false);

//TOUCH EVENT FOR MOBILE
function onTouchMove(event) {
  event.preventDefault();
  mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("touchmove", onTouchMove, false);

//SCROLL JUMP SECTION
let options = {
  rootMargin: "0px",
  threshold: 0.75,
};
const callback = (entries) => {
  entries.forEach((entry) => {
    const { target } = entry;
    if (entry.intersectionRatio >= 0.75) {
      target.classList.add("is-visible");
    } else {
      target.classList.remove("is-visible");
    }
  });
};
const observer = new IntersectionObserver(callback, options);
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

//EXPAND HAMBURGER NAVBAR
document
  .querySelector(".hamburger")
  .addEventListener("click", function (event) {
    event.preventDefault();
    this.classList.toggle("is-active");
    if (document.querySelector(".subMenu").style.display === "block") {
      document.querySelector(".subMenu").style.display = "none";
    } else {
      document.querySelector(".subMenu").style.display = "block";
    }
  });

//Function for Animation
//check body position
let sections = document.querySelectorAll("section");
let staticSectionNumber = 1;
function highLightNavLink(number) {
  const navLinks = document.querySelectorAll(".navEach");
  navLinks.forEach((each) => {
    each.style.color = "beige";
    each.style.fontStyle = "normal";
  });
  navLinks[number - 3].style.color = "goldenrod";
  navLinks[number - 3].style.fontStyle = "italic";
  navLinks[number].style.color = "goldenrod";
  navLinks[number].style.fontStyle = "italic";
}
function changeColor(spotLight, backLight, ambLight) {
  light.color.setHex(spotLight);
  lightBack.color.setHex(backLight);
  rectLight.color.setHex(ambLight);
}
//move camera
function moveCam(setting) {
  if (setting === 0) {
    camera.translateX(0.3);
    camera.translateY(-10);
    // camera.position.lerp(new THREE.Vector3(0, -10, 5), 1);
  } else {
    if (camera.position.y === 0) {
      return;
    } else {
      camera.translateX(-0.3);
      camera.translateY(10);
      // camera.position.lerp(new THREE.Vector3(-0.3, 0, 5), 1);
    }
  }
}

//ANIMATION
const animate = () => {
  //Rotate background
  const time = performance.now() * 0.0003;
  for (let i = 0; i < particularGroup.children.length; i++) {
    const newObject = particularGroup.children[i];
    newObject.rotation.x += newObject.speedValue / 10;
    newObject.rotation.y += newObject.speedValue / 10;
    newObject.rotation.z += newObject.speedValue / 10;
  }
  for (let i = 0; i < modularGroup.children.length; i++) {
    const newCubes = modularGroup.children[i];
    newCubes.rotation.x += 0.008;
    newCubes.rotation.y += 0.005;
    newCubes.rotation.z += 0.003;
    newCubes.position.x =
      Math.sin(time * newCubes.positionZ) * newCubes.positionY;
    newCubes.position.y =
      Math.cos(time * newCubes.positionX) * newCubes.positionZ;
    newCubes.position.z =
      Math.sin(time * newCubes.positionY) * newCubes.positionX;
  }
  particularGroup.rotation.y += 0.004;
  modularGroup.rotation.y -= (mouse.x * 4 + modularGroup.rotation.y) * 0.1;
  modularGroup.rotation.x -= (-mouse.y * 4 + modularGroup.rotation.x) * 0.1;
  //Update navLinks & background color
  let currentSection = document.querySelector(".is-visible");
  if (currentSection === sections[0]) {
    const sectionNumber = 1;
    if (sectionNumber !== staticSectionNumber) {
      document.querySelectorAll(".navEach").forEach((each) => {
        each.style.color = "beige";
        each.style.fontStyle = "normal";
      });
      changeColor(yellow, red, purple);
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[1]) {
    const sectionNumber = 2;
    if (sectionNumber !== staticSectionNumber) {
      document.querySelectorAll(".navEach").forEach((each) => {
        each.style.color = "beige";
        each.style.fontStyle = "normal";
      });
      changeColor(green, yellow, purple);
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[2]) {
    const sectionNumber = 3;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      changeColor(cyan, purple, blue);
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[3]) {
    const sectionNumber = 4;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      changeColor(red, purple, blue);
      moveCam(1);
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[4]) {
    const sectionNumber = 5;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      moveCam(0);
      staticSectionNumber = sectionNumber;
    }
  }
  //Update to screen
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

window.scrollTo({ top: 0, behavior: "smooth" });
init();
animate();
