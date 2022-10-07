import initOpenCascade from "opencascade.js";
import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

import { addShapeToScene, makeFut2D, setupThreeJSViewport } from "./oc-library";

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
  // @ts-ignore
  const nbOpenings = parseInt(document.querySelector("#nbOpenings").value) || 0;
  // @ts-ignore
  const D = parseFloat(document.querySelector("#D").value) || 0;
  // @ts-ignore
  const t = parseFloat(document.querySelector("#t").value) || 0;
  // @ts-ignore
  const T1 = parseFloat(document.querySelector("#T1").value) || 0;
  // @ts-ignore
  const T3 = parseFloat(document.querySelector("#T3").value) || 0;
  // @ts-ignore
  const T4 = parseFloat(document.querySelector("#T4").value) || 0;
  // @ts-ignore
  const T5 = parseFloat(document.querySelector("#T5").value) || 0;
  // @ts-ignore
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
// @ts-ignore
let scene: any;
export const initOc = () =>
  initOpenCascade().then((openCascade) => {
    scene = setupThreeJSViewport();

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
      Sx,
      Sy,
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
    comObj.position.set(com[0], com[2], -com[1]);
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
      { id: "Sx", val: Sx },
      { id: "Sy", val: Sy },
      { id: "com", val: `[${com.join(",")}]` },
    ]);
    console.log("Shape added to scene.");
    // @ts-ignore
    document.getElementById("controls-form").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      refresh();
    });
    // @ts-ignore
    document.getElementById("controls-form").addEventListener("input", (e) => {
      e.preventDefault();
      e.stopPropagation();
      refresh();
    });

    function refresh() {
      document.getElementById("refreshFut");
      // @ts-ignore
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
        Sx,
        Sy,
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
      comObj.position.set(com[0], com[2], -com[1]);
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
        { id: "Sx", val: Sx },
        { id: "Sy", val: Sy },
        { id: "com", val: `[${com.join(",")}]` },
      ]);
    }
  });
