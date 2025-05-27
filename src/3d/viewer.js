// src/3d/viewer.js

function loadAvatarModel(containerId = "avatar-3d", level = 1) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 3);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);

  // ❗️Используем глобальный GLTFLoader, а не THREE.GLTFLoader
  const loader = new GLTFLoader();
  loader.load(`/models/level${level}.glb`, gltf => {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    model.rotation.y = Math.PI;
    scene.add(model);

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

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  });
}
