import { LoadingManager } from "three";

export const manager = new LoadingManager();
const progressContainer = document.getElementById("progress-container")!;
const loaderPattern = document.querySelector(".loader-pattern")! as HTMLElement;
const loader = document.querySelector(".loader")! as HTMLElement;
const app = document.getElementById("app")!;

// manager.onStart = (url, itemsLoaded, itemsTotal) => {
//   console.log(`Started loading file: ${url}`);
// };

manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
  const progress = (itemsLoaded / itemsTotal) * 100;

  // console.log(`Loading ${url}: ${itemsLoaded} of ${itemsTotal}`);
  loader.style.width = `${progress}%`;

  if (progress >= 70) {
    loaderPattern.setAttribute("sub-text", "Politechniki Łódzkej");
  }
};

manager.onLoad = () => {
  progressContainer.style.display = "none";
  app.style.cursor = "pointer";

  // console.log("Loaded");
};
