import { Scene, OrthographicCamera, WebGLRenderer, Vector2 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const scene = new Scene();
let camera: OrthographicCamera;
let renderer: WebGLRenderer;
let controls: OrbitControls;
let pointer: Vector2;

export const setupScene = () => {
  const frustumSize = 75;
  const aspect = window.innerWidth / window.innerHeight;
  pointer = new Vector2();

  renderer = new WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById("app")!.appendChild(renderer.domElement);

  // Set up camera
  camera = new OrthographicCamera(
    (frustumSize * aspect) / -10,
    (frustumSize * aspect) / 10,
    frustumSize / 10,
    frustumSize / -10,
    0.1,
    100
  );

  camera.updateProjectionMatrix();
  camera.position.set(30, 15, 20);
  camera.zoom = window.innerWidth / 2000;

  // Set up controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxZoom = 3;
  controls.minZoom = 0.7;
  controls.listenToKeyEvents(window);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
  controls.update();

  // Resize event
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = (frustumSize * aspect) / -10;
    camera.right = (frustumSize * aspect) / 10;
    camera.top = frustumSize / 10;
    camera.bottom = frustumSize / -10;
    camera.zoom = window.innerWidth / 1500;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Pointer move event
  document.addEventListener("pointermove", onPointerMove);

  function onPointerMove(e: {
    preventDefault: () => void;
    clientX: number;
    clientY: number;
  }) {
    e.preventDefault();

    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  return { camera, controls, renderer, pointer };
};
