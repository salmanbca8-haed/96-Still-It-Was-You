/* ==========================================================================
   96 (2018) — INTERACTIVE 3D MEMORY WALL (Three.js & Canvas)
   Floating photographs in 3D space with depth, drift, and cursor exploration
   ========================================================================== */

class MemoryWall3D {
  constructor() {
    this.container = document.getElementById('memory-wall-canvas-container');
    if (!this.container) return;

    this.photos = [
      { src: 'assets/images/mid_night_walk.jpg', title: 'Midnight Walk in Chennai', date: '2018', category: 'ROMANCE' },
      { src: 'assets/images/school_days.jpg', title: 'Tanjore High School Days', date: '1996', category: 'SCHOOL' },
      { src: 'assets/images/reunion_dinner.jpg', title: 'Class of 1996 Reunion', date: '2018', category: 'REUNION' },
      { src: 'assets/images/ram_portrait.jpg', title: 'Ram — The Photographer', date: '2018', category: 'RAM' },
      { src: 'assets/images/jaanu_portrait.jpg', title: 'Jaanu — The Yellow Dupatta', date: '2018', category: 'JAANU' },
      { src: 'assets/images/vintage_camera.jpg', title: 'Ram\'s Camera & 35mm Negatives', date: '1996–2018', category: 'MEMORIES' },
      { src: 'assets/images/her_memories.png', title: 'The Folded Yellow Cloth', date: '2018', category: 'MEMORIES' },
      { src: 'assets/images/classroom_desk.jpg', title: 'The Carved Wooden Desk', date: '1996', category: 'SCHOOL' },
      { src: 'assets/images/metro_train.png', title: 'Midnight Metro Journey', date: '2018', category: 'NIGHT' },
      { src: 'assets/images/late_night_barber_shop.png', title: 'Late Night Salon Conversation', date: '2018', category: 'JOURNEY' },
      { src: 'assets/images/airport_farewell.jpg', title: 'Early Morning Departure', date: '2018', category: 'EMOTIONAL' },
      { src: 'assets/images/travel_mountains.png', title: 'Solitude in Western Ghats', date: '2010', category: 'TRAVEL' }
    ];

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.meshGroup = null;
    this.meshes = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.raycaster = null;
    this.mouseVector = null;
    this.isHovered = false;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, fallback to CSS 3D');
      this.initCSSFallback();
      return;
    }

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0908, 0.0012);

    // Camera
    this.camera = new THREE.PerspectiveCamera(55, width / height, 1, 3000);
    this.camera.position.z = 1000;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xdfb15b, 2.2, 1800);
    pointLight.position.set(0, 200, 800);
    this.scene.add(pointLight);

    // Group
    this.meshGroup = new THREE.Group();
    this.scene.add(this.meshGroup);

    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector2();

    // Textures & Meshes
    const textureLoader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(220, 150);

    // Position coordinates in 3D room
    const positions = [
      { x: -380, y: 160, z: 200, rotZ: -0.06 },
      { x: 340, y: 180, z: 100, rotZ: 0.05 },
      { x: 0, y: 30, z: 450, rotZ: -0.02 },
      { x: -480, y: -160, z: -100, rotZ: 0.08 },
      { x: 420, y: -140, z: -50, rotZ: -0.05 },
      { x: -160, y: 260, z: -200, rotZ: 0.04 },
      { x: 180, y: 240, z: -150, rotZ: -0.03 },
      { x: -280, y: -40, z: 280, rotZ: -0.07 },
      { x: 260, y: -20, z: 240, rotZ: 0.06 },
      { x: 0, y: -240, z: 50, rotZ: 0.02 },
      { x: -550, y: 80, z: -350, rotZ: -0.04 },
      { x: 550, y: 60, z: -300, rotZ: 0.05 }
    ];

    this.photos.forEach((photo, idx) => {
      const pos = positions[idx] || { x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 500, z: (Math.random() - 0.5) * 600, rotZ: 0 };
      
      textureLoader.load(photo.src, (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        const mat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.35,
          metalness: 0.1,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(planeGeo, mat);
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.rotation.z = pos.rotZ;
        mesh.userData = {
          originalPos: { ...pos },
          photoData: photo,
          floatOffset: Math.random() * Math.PI * 2,
          floatSpeed: Math.random() * 0.0015 + 0.0008
        };

        // Subtle frame border
        const frameGeo = new THREE.PlaneGeometry(232, 162);
        const frameMat = new THREE.MeshBasicMaterial({ color: 0x181512 });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        frameMesh.position.z = -1;
        mesh.add(frameMesh);

        this.meshGroup.add(mesh);
        this.meshes.push(mesh);
      });
    });

    // Listeners
    window.addEventListener('resize', () => this.onResize());
    
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      this.mouseVector.x = (clientX / rect.width) * 2 - 1;
      this.mouseVector.y = -(clientY / rect.height) * 2 + 1;

      this.targetRotY = this.mouseVector.x * 0.35;
      this.targetRotX = -this.mouseVector.y * 0.25;
    });

    this.container.addEventListener('click', () => {
      if (!this.raycaster || this.meshes.length === 0) return;
      this.raycaster.setFromCamera(this.mouseVector, this.camera);
      const intersects = this.raycaster.intersectObjects(this.meshes, false);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (clickedMesh.userData && clickedMesh.userData.photoData && window.lightboxInstance) {
          window.lightboxInstance.openWithData(clickedMesh.userData.photoData);
        }
      }
    });

    this.animate();
  }

  initCSSFallback() {
    // If WebGL fails, fallback provides a rich 3D perspective gallery
    this.container.innerHTML = `
      <div class="css3d-room" style="display:flex; flex-wrap:wrap; justify-content:center; gap:24px; padding:40px;">
        ${this.photos.slice(0, 6).map(p => `
          <div class="polaroid-frame" style="width:280px; cursor:pointer;" onclick="window.lightboxInstance && window.lightboxInstance.openWithData(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <img src="${p.src}" alt="${p.title}" style="width:100%; height:180px; object-fit:cover; border-radius:2px;">
            <div class="polaroid-caption">${p.title}</div>
            <div class="polaroid-meta">${p.date} • ${p.category}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.meshGroup) return;

    // Smooth camera/group tilt rotation
    this.meshGroup.rotation.y += (this.targetRotY - this.meshGroup.rotation.y) * 0.05;
    this.meshGroup.rotation.x += (this.targetRotX - this.meshGroup.rotation.x) * 0.05;

    // Idle drifting of each photograph
    const time = Date.now();
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i];
      const data = mesh.userData;
      mesh.position.y = data.originalPos.y + Math.sin(time * data.floatSpeed + data.floatOffset) * 15;
      mesh.position.x = data.originalPos.x + Math.cos(time * data.floatSpeed * 0.8 + data.floatOffset) * 8;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.MemoryWall3D = MemoryWall3D;
