import initOpenCascade, { StepRepr_MakeFromUsageOption } from "opencascade.js";

import {
  loadSTEPorIGES,
  makeBottle,
  makeFut,
  setupThreeJSViewport,
  addShapeToScene,
} from "./library";

const scene = setupThreeJSViewport();

initOpenCascade().then((openCascade) => {
  //document.getElementById("step-file").addEventListener('input', async (event) => { await loadSTEPorIGES(openCascade, event.srcElement.files[0], addShapeToScene, scene); });

  let width = 50,
    height = 70,
    thickness = 30;
  //let bottle = makeBottle(openCascade, width, height, thickness);
  const cyl = makeFut(openCascade);
  addShapeToScene(openCascade, cyl, scene);
  console.log("Cyl added to scene.");

  // window.changeSliderWidth = (value) => {
  //   width = parseInt(value);
  //   width = parseInt(value);
  //   scene.remove(scene.getObjectByName("shape"));
  //   let bottle = makeBottle(openCascade, width, height, thickness);
  //   const now = Date.now();
  //   addShapeToScene(openCascade, bottle, scene);
  //   console.log(Date.now() - now);
  // };
  // window.changeSliderHeight = (value) => {
  //   height = parseInt(value);
  //   scene.remove(scene.getObjectByName("shape"));
  //   let bottle = makeBottle(openCascade, width, height, thickness);
  //   addShapeToScene(openCascade, bottle, scene);
  // };
  // window.changeSliderThickness = (value) => {
  //   thickness = parseInt(value);
  //   scene.remove(scene.getObjectByName("shape"));
  //   let bottle = makeBottle(openCascade, width, height, thickness);
  //   addShapeToScene(openCascade, bottle, scene);
  // };
});
