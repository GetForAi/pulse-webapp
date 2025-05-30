function loadAvatarModel(containerId = "avatar-3d", level = 1) {
  const container = document.getElementById(containerId);
  if (!container) return console.error("❌ Контейнер не найден");

  if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
    console.error("❌ THREE или GLTFLoader не загружены");
    return;
  }

  container.innerHTML = "";
  const width = container.clientWidth || 300;
  const height = container.clientHeight || 200;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
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
  }, undefined, error => {
    console.error("❌ Ошибка загрузки GLB:", error);
  });
}
