// src/3d/viewer.js

// ✅ Импорты из CDN — обязательно использовать именно так:
import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

export async function loadAvatarModel(containerId = "avatar-3d", level = 1) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[3D Viewer] Контейнер с ID "${containerId}" не найден.`);
    return;
  }

  container.innerHTML = ""; // Очистка

  // 📦 Сцена и камера
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 3);

  // 🎥 Рендер
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // 💡 Свет
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);

  // 📦 Загрузка модели
  const loader = new GLTFLoader();
  loader.load(`/models/level${level}.glb`, gltf => {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    model.rotation.y = Math.PI; // Повернуть к камере
    scene.add(model);

    // 🔄 Вращение мышкой
    let isDragging = false;
    let previousX = 0;

    renderer.domElement.addEventListener("mousedown", e => {
      isDragging = true;
      previousX = e.clientX;
    });

    renderer.domElement.addEventListener("mouseup", () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener("mousemove", e => {
      if (isDragging) {
        const deltaX = e.clientX - previousX;
        model.rotation.y += deltaX * 0.01;
        previousX = e.clientX;
      }
    });

    // 🔁 Анимация
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, undefined, error => {
    console.error(`[3D Viewer] Ошибка загрузки модели level${level}.glb:`, error);
  });
}
