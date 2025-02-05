# [PORTFOLIO](https://hovinhthanh7893.github.io/portfolio)

[https://hovinhthanh7893.github.io/portfolio](https://hovinhthanh7893.github.io/portfolio)

Updated February 2025

This is my portfolio website, created using pure HTML, CSS, JavaScript and deployed with GitHub Pages. No framework and No external deployment platform needed. Integrated Three.js for 3D animated background, responsive for different user's devices. Use EmailJS to send email directly from Javascript

## Setup repo
- A standard repo should look like this:
```
/
├── index.html
├── index.js
├── style.css
├── icons/
│   │   ├── favicon/
│   │   │   ├── favicon.ico
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-512x512.png
├── .gitignore
├── README.md
├── manifest.webmanifest
```
- Link javascript, css and webmanifest in the \<head> of html
```
<script type="module" src="./index.js"></script>
<link rel="manifest" href="./manifest.webmanifest"/>
<link rel="stylesheet" type="text/css" href="./style.css"/>
```
- Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (esbenp.prettier-vscode) in Extensions for better view

## Run localhost
- Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (ritwickdey.LiveServer) in Extensions
- Click button "Go Live" on the right bottom corner of VS Code to run localhost
- Access localhost on brownser at http://127.0.0.1:5500/
- Click button "Port:5500" on the right bottom corner of VS Code to close localhost

## Lighthouse checklist
- \<button> always has id and aria-label, min size 24x24 px
- \<a> always has aria-label
- \<img> always has alt
- only use webp or svg

## How to deploy a GitHub Pages?
- A GitHub Pages must be a public repo
- Create new folder .github/workflows/deploy.yml
```
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        publish_branch: gh-pages
```
- Make a new branch name "gh-pages" as a production branch
- On Github repo > Settings > Pages > Branch > choose branch "gh-pages", folder "/(root)" > Save
- Everytime you commit to "main" branch, GitHub will automatically deploy to "gh-pages" branch
- Access your live page at "https://\<your-account-id>.github.io/\<github-repo-name>/"

## How to intergrate Three.js?
- Create visual canvas in html
```
<canvas class="webgl"></canvas>
```
- Import ThreeJS in index.js
```
import * as THREE from "https://cdn.skypack.dev/three@0.148.0"
```
- Create scene & camera
```
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.z = 5;
scene.add(camera);
```
- Create object
```
const geometry = new THREE.SphereGeometry(1, 32, 16); 
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);
```
- Create renderer
```
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
```
- Create animate function
```
const animate = () => {
  window.requestAnimationFrame(animate);
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
};
```
- Initiate ThreeJS
```
animate();
```

## How to set up EmailJS?
- Go to [emailjs.com](https://www.emailjs.com/) and create a free account
- Click on "Email Services" > "Add New Servive" and follow to connect to your personal email. In the tab you can find your "SERVICE_ID"
- Click on "Email Templates" > "Create New Template" and follow to create a template for the mail that send to you. In the tab you can find your "TEMPLATE_ID"
- Click on "Account" > "Public Key" is your "USER_ID"
- In Javascript, send the email by fetching POST to emailjs api:
```
fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      user_id: <USER_ID>,
      service_id: <SERVICE_ID>,
      template_id: <TEMPLATE_ID>,
      template_params: {
        'name': <name-input>,
        'email': <email-input>,
        'subject': <subject-input>,
        'message': <message-input>
      }
    })
  })
  .then((httpResponse) => {
    if (httpResponse.ok) {
      <your-success-handle-function>
    } else {
      <your-fail-handle-function>
    }
  })
  .catch((error) => {
    <your-error-handle-function>
  })
```

---
More questions? Please send email to [hovinhthanh7893@gmail.com](mailto:hovinhthanh7893@gmail.com) or text me on [LinkedIn](https://www.linkedin.com/in/hovinhthanh7893/)