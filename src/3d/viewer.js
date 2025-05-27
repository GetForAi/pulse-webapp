import * as THREE from "https://cdn.skypack.dev/three";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { avatarModels } from "./models.js";

let scene, camera, renderer, model, container;
let isDragging = false, previousX = 0;

export async function loadAvatarModel(level) {
  const modelPath = avatarModels[level] || avatarModels[1];
  if (!container) container = document.getElementById("avatar-3d");

  // Очистка
  container.innerHTML = "";

  // Инициализация сцены
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load(modelPath, gltf => {
    model = gltf.scene;
    scene.add(model);
    animate();
  });

  // Вращение по drag
  renderer.domElement.addEventListener("mousedown", e => {
    isDragging = true;
    previousX = e.clientX;
  });

  renderer.domElement.addEventListener("mousemove", e => {
    if (isDragging && model) {
      const deltaX = e.clientX - previousX;
      model.rotation.y += deltaX * 0.01;
      previousX = e.clientX;
    }
  });

  window.addEventListener("mouseup", () => isDragging = false);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

