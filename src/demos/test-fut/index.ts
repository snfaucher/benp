import initOpenCascade, { StepRepr_MakeFromUsageOption } from "opencascade.js";

import {
  loadSTEPorIGES,
  makeBottle,
  makeFut,
  setupThreeJSViewport,
  addShapeToScene,
  makeFut2D,
} from "./library";

const scene = setupThreeJSViewport();

const getParams = (): object => {
  const nbOpenings = parseInt(document.querySelector("#nbOpenings").value) || 0;
  const D = parseInt(document.querySelector("#D").value) || 0;
  const t = parseInt(document.querySelector("#t").value) || 0;
  const T2 = parseInt(document.querySelector("#T2").value) || 0;
  const T3 = parseInt(document.querySelector("#T3").value) || 0;
  const T4 = parseInt(document.querySelector("#T4").value) || 0;
  const T5 = parseInt(document.querySelector("#T5").value) || 0;

  const Di = D - 2 * t;
  const params = {
    nbOpenings,
    D,
    t,
    Di,
    T2,
    T3,
    T4,
    T5,
  };
  return params;
};
initOpenCascade().then((openCascade) => {
  //document.getElementById("step-file").addEventListener('input', async (event) => { await loadSTEPorIGES(openCascade, event.srcElement.files[0], addShapeToScene, scene); });

  let width = 50,
    height = 70,
    thickness = 30;
  //let bottle = makeBottle(openCascade, width, height, thickness);
  const name = "fut-shape";

  const { shape, Ixx, Iyy, bbXMax, bbYMax } = makeFut2D(
    openCascade,
    getParams()
  );
  addShapeToScene(openCascade, shape, scene, name);
  document.getElementById("Ixx").value = Ixx;
  document.getElementById("Iyy").value = Iyy;
  document.getElementById("bbXMax").value = bbXMax;
  document.getElementById("bbYMax").value = bbYMax;
  console.log("Shape added to scene.");
  document.getElementById("controls-form").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    document.getElementById("refreshFut");
    scene.remove(scene.getObjectByName(name));
    const { shape, Ixx, Iyy, bbXMax, bbYMax } = makeFut2D(
      openCascade,
      getParams()
    );
    addShapeToScene(openCascade, shape, scene, name);
    document.getElementById("Ixx").value = Ixx;
    document.getElementById("Iyy").value = Iyy;
    document.getElementById("bbXMax").value = bbXMax;
    document.getElementById("bbYMax").value = bbYMax;
  });

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
