import {
  Scene,
  TextureLoader,
  Color,
  AmbientLight,
  Mesh,
  Raycaster,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import assets from "./Utils/assets";
import { setupScene } from "./Utils/setupScene";
import { manager } from "./Utils/preloader";
// import Stats from "three/addons/libs/stats.module.js";

const scene = new Scene();
const textureLoader = new TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);
let { camera, controls, renderer, pointer } = setupScene();

scene.background = new Color(0xd6d2ca);

// Lights
const ambientLight = new AmbientLight(0xffffff, 3.5);
scene.add(ambientLight);

// Stats
// const stats = new Stats();
// document.body.appendChild(stats.dom);

// Load assets
assets.forEach((asset) => {
  gltfLoader.load(
    asset.path,
    (glb) => {
      glb.scene.traverse((child) => {
        if (child instanceof Mesh) {
          const texture = textureLoader.load(asset.texture);
          texture.flipY = false;

          child.name = asset.id;

          if (asset.id === "Entrance") {
            child.material.color.setHex(0x747bff);
            child.material.emissive.setHex(0x5156b2);
          }

          child.material.map = texture;
        }
      });

      scene.add(glb.scene);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
});

// Animate
function animate() {
  let isFocus = 1;
  const fps = 60;

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / (isFocus * fps));

  window.onblur = function () {
    isFocus = 0.5; /// reduce FPS to half
  };

  window.onfocus = function () {
    isFocus = 1; /// full FPS
  };

  controls.update();
  // stats.update();

  render();
}

const raycaster = new Raycaster();
let INTERSECTED: any;
const section = document.getElementById("info")!;
const header = document.getElementById("info-header")!;
const content = document.getElementById("info-content")!;

function render() {
  if (window.innerWidth < 1024) {
    controls.minZoom = 0.3;
  } else {
    controls.minZoom = 0.7;
  }

  raycaster.setFromCamera(pointer, camera);
  const unFilteredIntersects = raycaster.intersectObjects(scene.children, true);
  const intersects = unFilteredIntersects.filter(
    (intersect) => intersect.object.name !== "Ground"
  );

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0x777777);
      controls.autoRotate = false;

      assets.forEach((asset) => {
        if (asset.id === INTERSECTED.name) {
          header.innerHTML = asset.header;
          content.innerHTML = asset.content;
        }
      });
      section.style.opacity = "1";
    }
  } else {
    if (INTERSECTED)
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    controls.autoRotate = true;

    section.style.opacity = "0";

    INTERSECTED = null;
  }

  renderer.render(scene, camera);
}

animate();
