import * as THREE from './three.module.js';
import { OBJLoader } from './OBJLoader.js';
import { OrbitControls } from './OrbitControls.js';
import { MTLLoader } from './MTLLoader.js';



// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a directional light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Set up OrbitControls for mouse interaction
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();


// Load the MTL file and set up materials
const mtlLoader = new MTLLoader();
mtlLoader.load(
  './poly.mtl', // Replace with the path to your .mtl file
  (materials) => {
    materials.preload();

    // Load the OBJ file
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
      './poly.obj',
      (object) => {
        scene.add(object);
      },
      (xhr) => {
        console.log(`OBJLoader: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error('OBJLoader: An error occurred', error);
      }
    );
  },
  (xhr) => {
    console.log(`MTLLoader: ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error('MTLLoader: An error occurred', error);
  }
);



// Position the camera and start the render loop
camera.position.z = 5;
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate();

// Handle window resize events
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});