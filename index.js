import * as THREE from "https://cdn.skypack.dev/three@0.148.0";
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise';

//VARIABLES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const white = 0xffffff;
const yellow = 0xffc800;
const red = 0xff0000;
const purple = 0xa200ff;
const green = 0x03fc2c;
const blue = 0x031cfc;
const cyan = 0x03d3fc;
const black = 0x000000;
const pink = 0xff7dcd;
const lightYellow = 0xffe97d;
const violet = 0x6a00ff;

//SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(black);
scene.fog = new THREE.Fog(black, 4, 6);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper)

//LIGHT SCENE1
const lightTop = new THREE.PointLight(yellow, 10);
lightTop.position.set(5, 5, 2);
lightTop.castShadow = true;
lightTop.shadow.mapSize.width = 10000;
lightTop.shadow.mapSize.height = 10000;
lightTop.penumbra = 0.5;

const lightBack = new THREE.SpotLight(red, 2);
lightBack.position.set(0, -3, -1);

const rectLight = new THREE.RectAreaLight(purple, 20, 2, 2);
rectLight.position.set(1, 1, 1);
rectLight.lookAt(0, 0, 0);

scene.add(lightTop, lightBack, rectLight);

//LIGHT SCENE2
const targetScene2 = new THREE.Object3D();
targetScene2.position.set(0, -10, 0);
scene.add(targetScene2);

const lightRight = new THREE.SpotLight(pink, 1);
lightRight.position.set(8, 0, 0);
lightRight.target = targetScene2;

const lightLeft = new THREE.SpotLight(pink, 1);
lightLeft.position.set(-8, 0, 0);
lightLeft.target = targetScene2;

const lightMidSpot = new THREE.SpotLight(lightYellow, 2);
lightMidSpot.position.set(0, -5, 20);
lightMidSpot.target = targetScene2;

const lightMidPoint = new THREE.PointLight(lightYellow, 0.05);
lightMidPoint.position.set(0, 0, -23);

scene.add(lightRight,lightLeft, lightMidSpot, lightMidPoint);


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

//SCENE1 OBJECTS
//Cubes
const cubesGroup = new THREE.Object3D();
scene.add(cubesGroup);
function mathRandom(num = 1) {
  var setNumber = -Math.random() * num + Math.random() * num;
  return setNumber;
}
function generateCube(number) {
  for (let i = 0; i < number; i++) {
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
      roughness: 0.4,
      metalness: 0.5,
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
    cubesGroup.add(cube);
  }
}
//Particles
const particlesGroup = new THREE.Object3D();
scene.add(particlesGroup);
function generateParticle(number, spaceSize) {
  const geometry = new THREE.CircleGeometry(0.1, 5);
  const material = new THREE.MeshPhysicalMaterial({
    color: white,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < number; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(mathRandom(spaceSize), mathRandom(spaceSize), mathRandom(spaceSize));
    particle.rotation.set(mathRandom(), mathRandom(), mathRandom());
    const scale = 0.001 + Math.abs(mathRandom(0.03));
    particle.scale.set(scale, scale, scale);
    particle.speedValue = mathRandom(1);
    particlesGroup.add(particle);
  }
}

//SCENE2 OBJECTS
//globe
const earthGroup = new THREE.Object3D();
earthGroup.position.set(0, 0, -10);
earthGroup.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));
scene.add(earthGroup);
let v3Earth = new THREE.Vector3();
function generateEarth() {
  const geometry = new THREE.CylinderGeometry(4,3,10,40,10,true);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffa6,
    roughness: 0.5,
    metalness: 1,
    flatShading: true,
    fog: false,
  });
  geometry.positionData = [];
  for (let i = 0; i < geometry.attributes.position.count; i++){
    v3Earth.fromBufferAttribute(geometry.attributes.position, i);
    geometry.positionData.push(v3Earth.clone());
  }
  const earth = new THREE.Mesh(geometry, material);
  earth.castShadow = true;
  earth.receiveShadow = true;
  earthGroup.add(earth);
}
//Clouds
function generateCloud(number) {
  const shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, 10 );
  shape.lineTo( 10, 10 );
  shape.lineTo( 10, 0 );
  shape.lineTo( 0, 0 );
  const extrudeSettings = {
    steps: 1,
    depth: 12,
    bevelEnabled: true,
    bevelThickness: 3,
    bevelSize: 2,
    bevelOffset: 3,
    bevelSegments: 1
  };
  const material = new THREE.MeshStandardMaterial({
    color: 0xffd000,
    roughness: 0.5,
    metalness: 1,
    fog: false,
  });
  for (let i = 0; i < number; i++ ) {
    const cloudGroup = new THREE.Object3D();
    const cloudAmount = Math.floor(Math.random()*4+1);
    for (let i = 0; i < cloudAmount; i++ ) {
      const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
      const cloud = new THREE.Mesh(geometry, material);
      const scale = 0.015/Math.floor(Math.random()*2+1);
      cloud.scale.set(scale, scale, scale);
      cloud.position.set(Math.random()/2, Math.random()/2, 0)
      cloud.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2);
      cloud.castShadow = true;
      cloud.receiveShadow = true;
      cloudGroup.add(cloud);
    }
    cloudGroup.position.set(0, Math.random()*4+3, Math.random()+5);
    cloudGroup.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI*2*(Math.random()*10)));
    earthGroup.add(cloudGroup);
  }
}
//Airplane
const airPlaneGroup = new THREE.Object3D();
airPlaneGroup.position.set(0,-5,-5);
airPlaneGroup.scale.set(0.5,0.5,0.5),
scene.add(airPlaneGroup);
function generateAirPlane() {
  const matWhite = new THREE.MeshStandardMaterial({
    color: white,
    roughness: 0.5,
    metalness: 1,
    flatShading: true,
    fog: false,
  });
  const matPurple = new THREE.MeshStandardMaterial({
    color: violet,
    roughness: 0.5,
    metalness: 1,
    flatShading: true,
    fog: false,
  });
  const matBlack = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.5,
    metalness: 1,
    flatShading: true,
    fog: false,
  });

  const fan1Geo = new THREE.BoxGeometry( 0.05, 1.2, 0.2);
  const fan1 = new THREE.Mesh(fan1Geo,matWhite);
  fan1.position.set(1, 0, 0);
  airPlaneGroup.add(fan1);

  const fan2Geo = new THREE.BoxGeometry( 0.05, 0.2, 1.2);
  const fan2 = new THREE.Mesh(fan2Geo,matWhite);
  fan2.position.set(1, 0, 0);
  airPlaneGroup.add(fan2);

  const headGeo = new THREE.TorusGeometry(0.35, 0.2, 12, 18);
  const head = new THREE.Mesh(headGeo,matWhite);
  head.rotation.set( 0, Math.PI/2, 0);
  head.position.set(0.65, 0, 0);
  airPlaneGroup.add(head);

  const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 20, 1, true);
  const body = new THREE.Mesh(bodyGeo,matPurple);
  body.rotation.set( 0, 0, Math.PI/2);
  body.position.set(0.3, 0, 0);
  airPlaneGroup.add(body);

  const tailGeo = new THREE.CylinderGeometry(0.3, 0.5, 0.7, 20, 1, true);
  const tail = new THREE.Mesh(tailGeo,matPurple);
  tail.rotation.set( 0, 0, Math.PI/2);
  tail.position.set(-0.3, 0, 0);
  airPlaneGroup.add(tail);

  const endGeo = new THREE.ConeGeometry(0.3, 0.3, 20, 1, true);
  const end = new THREE.Mesh(endGeo,matPurple);
  end.rotation.set( 0, 0, Math.PI/2);
  end.position.set(-0.8, 0, 0);
  airPlaneGroup.add(end);

  const fanCenGeo = new THREE.ConeGeometry(0.2, 0.3, 20, 1, true);
  const fanCen = new THREE.Mesh(fanCenGeo,matPurple);
  fanCen.rotation.set( 0, 0, -Math.PI/2);
  fanCen.position.set(1, 0, 0);
  airPlaneGroup.add(fanCen);

  const wingGeo = new THREE.BoxGeometry( 0.7, 0.06, 4);
  const wing = new THREE.Mesh(wingGeo,matWhite);
  wing.position.set(0.2, 0.15, 0);
  airPlaneGroup.add(wing);

  const wingTailGeo = new THREE.BoxGeometry( 0.3, 0.06, 0.8);
  const wingTail = new THREE.Mesh(wingTailGeo,matWhite);
  wingTail.position.set(-0.7, 0, 0);
  airPlaneGroup.add(wingTail);

  const wingTailCenGeo = new THREE.BoxGeometry( 0.3, 0.3, 0.06);
  const wingTailCen = new THREE.Mesh(wingTailCenGeo,matWhite);
  wingTailCen.rotation.set( 0, 0, Math.PI/10);
  wingTailCen.position.set(-0.8, 0.2, 0);
  airPlaneGroup.add(wingTailCen);

  const wheelGeo = new THREE.TorusGeometry(0.1, 0.1, 10, 10);
  const wheel1 = new THREE.Mesh(wheelGeo,matBlack);
  wheel1.position.set(0.1, -0.3, 1);
  airPlaneGroup.add(wheel1);
  const wheel2 = new THREE.Mesh(wheelGeo,matBlack);
  wheel2.position.set(0.1, -0.3, -1);
  airPlaneGroup.add(wheel2);
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
const mouse = new THREE.Vector2();
const mouseScene2 = new THREE.Vector2();
function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("mousemove", onMouseMove, false);

//TOUCH EVENT FOR MOBILE
function onTouchMove(event) {
  event.preventDefault();
  mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("touchmove", onTouchMove, false);

//UPDATE ACTIVE SECTION ON SCREEN
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

//EXPAND NAVBAR HAMBURGER
document
  .querySelector(".hamburger")
  .addEventListener("click", function(event) {
    event.preventDefault();
    if (document.querySelector(".subMenu").style.display === "block") {
      this.classList.remove("is-active");
      document.querySelector(".subMenu").style.display = "none";
    } else {
      this.classList.add("is-active");
      document.querySelector(".subMenu").style.display = "block";
    }
});

//COLLAPSE SUBMENU ON CHOOSE
const navLinks = document.querySelectorAll(".navEach");
navLinks.forEach((each) => {
  each.addEventListener("click", function(event) {
    if (document.querySelector(".subMenu").style.display === "block") {
      document.querySelector(".subMenu").style.display = "none";
      document.querySelector(".hamburger").classList.remove("is-active");
    } 
  })
})

//BUTTON PAGE UP
document
  .querySelector(".moveUp")
  .addEventListener("click", function(event) {
    if (staticSectionNumber === 2) {
      this.getAttribute("href");
      this.setAttribute("href", "#section1");
    }
    if (staticSectionNumber === 3) {
      this.getAttribute("href");
      this.setAttribute("href", "#section2");
    }
    if (staticSectionNumber === 4) {
      this.getAttribute("href");
      this.setAttribute("href", "#section3");
    }
});

//BACK TO TOP BUTTON
document
  .querySelector(".backToTop")
  .addEventListener("click", function(event) {
    changeColor(green, yellow, purple);
    moveCam(1);
    changeFooter(2);
});

//SOUND TOGGLE
const backgroundSound = new Audio("./audios/Gratitude_Spiritual-Moment.mp3");
let soundOn = false;
document
  .querySelector(".sound")
  .addEventListener("click", function(event) {
    event.preventDefault();
    if (soundOn === true) {
      this.style.opacity = 1;
      backgroundSound.pause();
      this.style.backgroundImage = "url('./icons/icon-mute-96.png')";
      soundOn = false;
    } else {
      this.style.opacity = 0.2;
      backgroundSound.play();
      backgroundSound.volume = 0.5;
      backgroundSound.loop = true;
      this.style.backgroundImage = "url('./icons/icon-sound-96.png')";
    soundOn = true;
    }
});

//WHOOSH SOUND
document.querySelectorAll("a").forEach((each) => {
  each.addEventListener("click", function(event) {
    const whoosh = new Audio("./audios/Whoosh.mp3");
    whoosh.play();
  });
});

//FUNCTIONS FOR ANIMATION
let noise = openSimplexNoise.makeNoise4D(Date.now());
let clock = new THREE.Clock();
//highlight navlink according to section
let sections = document.querySelectorAll("section");
let staticSectionNumber = 1;
function highLightNavLink(number) {
  navLinks.forEach((each) => {
    each.style.color = "beige";
    each.style.fontStyle = "normal";
  });
  navLinks[number - 2].style.color = "goldenrod";
  navLinks[number - 2].style.fontStyle = "italic";
  navLinks[number + 2].style.color = "goldenrod";
  navLinks[number + 2].style.fontStyle = "italic";
}
//change color of lights
function changeColor(spotLight, backLight, ambLight) {
  lightTop.color.setHex(spotLight);
  lightBack.color.setHex(backLight);
  rectLight.color.setHex(ambLight);
}
//move camera to another scene
function moveCam(setting) {
  if (setting === 0) {
    camera.position.set(0, -4.5, 10);
  } else {
    camera.position.set(-0.3, 0, 5);
  }
}
//Foot page end
function changeFooter(setting) {
  if (setting === 0) {
    document.querySelector(".foot").style.justifyContent = "center";
    document.querySelector(".backToTop").style.display = "block";
    document.querySelector(".moveUp").style.display = "none";
  } else if (setting === 1) {
    document.querySelector(".foot").style.justifyContent = "flex-end";
    document.querySelector(".backToTop").style.display = "none";
    document.querySelector(".moveUp").style.display = "block";
  } else if (setting === 2) {
    document.querySelector(".foot").style.justifyContent = "flex-end";
    document.querySelector(".backToTop").style.display = "none";
    document.querySelector(".moveUp").style.display = "none";
  } else  {
    document.querySelector(".foot").style.justifyContent = "flex-end";
    document.querySelector(".backToTop").style.display = "none";
    if (window.innerWidth <= 768) {
      document.querySelector(".moveUp").style.display = "block";
    } else {
      document.querySelector(".moveUp").style.display = "none";
    }
  }
}


//ANIMATION
const animate = () => {
  //Scene1
  //Particles spin around
  particlesGroup.rotation.y += 0.004;
  //Particles rotate
  const time = performance.now() * 0.0003;
  for (let i = 0; i < particlesGroup.children.length; i++) {
    const particle = particlesGroup.children[i];
    particle.rotation.x += particle.speedValue / 10;
    particle.rotation.y += particle.speedValue / 10;
    particle.rotation.z += particle.speedValue / 10;
  }
  //Cubes rotate & fly around
  for (let i = 0; i < cubesGroup.children.length; i++) {
    const cube = cubesGroup.children[i];
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.002;
    cube.rotation.z += 0.003;
    cube.position.x =
      Math.sin(time * cube.positionZ) * cube.positionY;
    cube.position.y =
      Math.cos(time * cube.positionX) * cube.positionZ;
    cube.position.z =
      Math.sin(time * cube.positionY) * cube.positionX;
  }
  //Cube group rotate follow mouse
  cubesGroup.rotation.y -= (mouse.x * 4 + cubesGroup.rotation.y) * 0.1;
  cubesGroup.rotation.x -= (-mouse.y * 4 + cubesGroup.rotation.x) * 0.1;
  
  //Scene2
  //Earth spin around
  earthGroup.rotation.y -= 0.005;
  //Earth wave
  const earth = earthGroup.children[0];
  let t = clock.getElapsedTime();
  earth.geometry.positionData.forEach((p, idx) => {
    let setNoise = noise(p.x, p.y, p.z, t);
    v3Earth.copy(p).addScaledVector(p, setNoise);
    // earth.geometry.attributes.position.setXYZ(idx, v3Earth.x, v3Earth.y, v3Earth.z);
    earth.geometry.attributes.position.setY(idx, v3Earth.y);
  })
  earth.geometry.computeVertexNormals();
  earth.geometry.attributes.position.needsUpdate = true;
  //Airplane fan
  const fan1 = airPlaneGroup.children[0];
  const fan2 = airPlaneGroup.children[1];
  fan1.rotation.x += 0.3;
  fan2.rotation.x += 0.3;
  //Airplane move follow mouse
  
  //Check current section on screen
  let currentSection = document.querySelector(".is-visible");
  if (currentSection === sections[0]) {
    const sectionNumber = 1;
    if (sectionNumber !== staticSectionNumber) {
      document.querySelectorAll(".navEach").forEach((each) => {
        each.style.color = "beige";
        each.style.fontStyle = "normal";
      });
      changeColor(yellow, red, purple);
      changeFooter(2)
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[1]) {
    const sectionNumber = 2;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      changeColor(green, yellow, purple);
      moveCam(1);
      changeFooter(1)
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[2]) {
    const sectionNumber = 3;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      changeColor(cyan, purple, blue);
      moveCam(1);
      changeFooter(3)
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[3]) {
    const sectionNumber = 4;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      changeColor(red, purple, blue);
      moveCam(1);
      changeFooter(3)
      staticSectionNumber = sectionNumber;
    }
  }
  if (currentSection === sections[4]) {
    const sectionNumber = 5;
    if (sectionNumber !== staticSectionNumber) {
      highLightNavLink(sectionNumber);
      changeColor(black, black, black);
      moveCam(0);
      changeFooter(0)
      staticSectionNumber = sectionNumber;
    }
  }

  //Update screen
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

window.scrollTo({ top: 0, behavior: "smooth" });
generateParticle(200, 2);
generateCube(30);
generateEarth();
generateCloud(50);
generateAirPlane();
animate();
