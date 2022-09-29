import initOpenCascade from "opencascade.js";
import {
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  SphereGeometry,
  Color,
} from "three";

import { addShapeToScene, makeFut2D, setupThreeJSViewport } from "./library";

const scene = setupThreeJSViewport();
export interface FutParams {
  D: number;
  t: number;
  Di: number;
  T1: number;
  T2: number;
  T3: number;
  T4: number;
  T5: number;
  nbOpenings: number;
  theta: number; // deg
}
const getParams = (): FutParams => {
  const nbOpenings = parseInt(document.querySelector("#nbOpenings").value) || 0;
  const D = parseFloat(document.querySelector("#D").value) || 0;
  const t = parseFloat(document.querySelector("#t").value) || 0;
  const T1 = parseFloat(document.querySelector("#T1").value) || 0;
  const T3 = parseFloat(document.querySelector("#T3").value) || 0;
  const T4 = parseFloat(document.querySelector("#T4").value) || 0;
  const T5 = parseFloat(document.querySelector("#T5").value) || 0;
  const theta = parseFloat(document.querySelector("#theta").value) || 0;

  const Di = D - 2 * t;
  const params: FutParams = {
    nbOpenings,
    D,
    t,
    Di,
    T1,
    T2: 0,
    T3,
    T4,
    T5,
    theta,
  };
  return params;
};
// @ts-ignore
let comObj = undefined;
initOpenCascade().then((openCascade) => {
  //document.getElementById("step-file").addEventListener('input', async (event) => { await loadSTEPorIGES(openCascade, event.srcElement.files[0], addShapeToScene, scene); });

  let width = 50,
    height = 70,
    thickness = 30;
  //let bottle = makeBottle(openCascade, width, height, thickness);
  const name = "fut-shape";

  interface ResVal {
    id: string;
    val: string | number;
  }
  const updateResult = (data: ResVal[]): void => {
    data.forEach(({ id, val }) => {
      // @ts-ignore
      document.getElementById(id).value = val;
    });
  };
  const {
    shape,
    Ixx,
    Iyy,
    area,
    bbXMin,
    bbXMax,
    bbYMin,
    bbYMax,
    com,
    levierX,
    levierY,
  } = makeFut2D(openCascade, getParams());
  addShapeToScene(openCascade, shape, scene, name);

  // @ts-ignore
  if (comObj != undefined) {
    // @ts-ignore
    scene.remove(comObj);
  }
  const geometry = new SphereGeometry(10, 32, 32);
  const material = new MeshBasicMaterial({ color: "#FF0000" });
  comObj = new Mesh(geometry, material);
  comObj.position.set(com[0], com[1], com[2]);
  scene.add(comObj);

  updateResult([
    { id: "Ixx", val: Ixx },
    { id: "Iyy", val: Iyy },
    { id: "area", val: area },
    { id: "bbXMin", val: bbXMin },
    { id: "bbXMax", val: bbXMax },
    { id: "bbYMin", val: bbYMin },
    { id: "bbYMax", val: bbYMax },
    { id: "levierX", val: levierX },
    { id: "levierY", val: levierY },
    { id: "com", val: `[${com.join(",")}]` },
  ]);
  console.log("Shape added to scene.");
  document.getElementById("controls-form").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    refresh();
  });
  document.getElementById("controls-form").addEventListener("input", (e) => {
    e.preventDefault();
    e.stopPropagation();
    refresh();
  });

  function refresh() {
    document.getElementById("refreshFut");
    scene.remove(scene.getObjectByName(name));
    const {
      shape,
      Ixx,
      Iyy,
      area,
      bbXMin,
      bbXMax,
      bbYMin,
      bbYMax,
      com,
      levierX,
      levierY,
    } = makeFut2D(openCascade, getParams());

    addShapeToScene(openCascade, shape, scene, name);

    // @ts-ignore
    if (comObj != undefined) {
      // @ts-ignore
      scene.remove(comObj);
    }
    const geometry = new SphereGeometry(10, 32, 32);
    const material = new MeshBasicMaterial({ color: "#FF0000" });
    comObj = new Mesh(geometry, material);
    comObj.position.set(com[0], com[1], 0);
    scene.add(comObj);
    updateResult([
      { id: "Ixx", val: Ixx },
      { id: "Iyy", val: Iyy },
      { id: "area", val: area },
      { id: "bbXMin", val: bbXMin },
      { id: "bbXMax", val: bbXMax },
      { id: "bbYMin", val: bbYMin },
      { id: "bbYMax", val: bbYMax },
      { id: "levierX", val: levierX },
      { id: "levierY", val: levierY },
      { id: "com", val: `[${com.join(",")}]` },
    ]);
  }
});
