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
export const initOc = () =>
  initOpenCascade().then((openCascade) => {
    console.log("Open Cascade inited.");
    const name = "fut-shape";

    interface ResVal {
      id: string;
      val: string | number;
    }
    const updateResult = (data: ResVal[]): void => {
      data.forEach(({ id, val }) => {
        try {
          // @ts-ignore
          document.getElementById(id).value = val;
        } catch (e) {
          console.error(e);
        }
      });
    };
    const {
      shape,
      Ixx,
      Iyy,
      area,
      // com,
      levierX,
      levierY,
      Sx,
      Sy,
      IxxFut,
      IyyFut,
      areaFut,
      levierXFut,
      levierYFut,
      SxFut,
      SyFut,
      AreaRatio,
      SxRatio,
      SyRatio,
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
    comObj.position.set(0, 0, 0);
    scene.add(comObj);
    // { id: "bbXMin", val: bbXMin },
    // { id: "bbXMax", val: bbXMax },
    // { id: "bbYMin", val: bbYMin },
    // { id: "bbYMax", val: bbYMax },
    updateResult([
      { id: "Ixx", val: Ixx.toFixed(4) },
      { id: "Iyy", val: Iyy.toFixed(4) },
      { id: "area", val: area.toFixed(4) },
      { id: "levierX", val: levierX.toFixed(4) },
      { id: "levierY", val: levierY.toFixed(4) },
      { id: "Sx", val: Sx.toFixed(4) },
      { id: "Sy", val: Sy.toFixed(4) },
      { id: "IxxFut", val: IxxFut.toFixed(4) },
      { id: "IyyFut", val: IyyFut.toFixed(4) },
      { id: "areaFut", val: areaFut.toFixed(4) },
      { id: "levierXFut", val: levierXFut.toFixed(4) },
      { id: "levierYFut", val: levierYFut.toFixed(4) },
      { id: "SxFut", val: SxFut.toFixed(4) },
      { id: "SyFut", val: SyFut.toFixed(4) },
      { id: "AreaRatio", val: AreaRatio.toFixed(4) },
      { id: "SxRatio", val: SxRatio.toFixed(4) },
      { id: "SyRatio", val: SyRatio.toFixed(4) },
      // { id: "com", val: `[${com.join(",")}]` },
    ]);
    console.log("Shape added to scene.");
    // @ts-ignore
    const onInput = (e) => {
      e.preventDefault();
      e.stopPropagation();
      refresh();
    };
    window.addEventListener("input", onInput);

    function refresh() {
      document.getElementById("refreshFut");
      // @ts-ignore
      scene.remove(scene.getObjectByName(name));
      const {
        shape,
        Ixx,
        Iyy,
        area,
        // com,
        levierX,
        levierY,
        Sx,
        Sy,
        IxxFut,
        IyyFut,
        areaFut,
        levierXFut,
        levierYFut,
        SxFut,
        SyFut,
        AreaRatio,
        SxRatio,
        SyRatio,
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
      comObj.position.set(0, 0, 0);
      scene.add(comObj);
      updateResult([
        { id: "Ixx", val: Ixx.toFixed(4) },
        { id: "Iyy", val: Iyy.toFixed(4) },
        { id: "area", val: area.toFixed(4) },
        { id: "levierX", val: levierX.toFixed(4) },
        { id: "levierY", val: levierY.toFixed(4) },
        { id: "Sx", val: Sx.toFixed(4) },
        { id: "Sy", val: Sy.toFixed(4) },
        { id: "IxxFut", val: IxxFut.toFixed(4) },
        { id: "IyyFut", val: IyyFut.toFixed(4) },
        { id: "areaFut", val: areaFut.toFixed(4) },
        { id: "levierXFut", val: levierXFut.toFixed(4) },
        { id: "levierYFut", val: levierYFut.toFixed(4) },
        { id: "SxFut", val: SxFut.toFixed(4) },
        { id: "SyFut", val: SyFut.toFixed(4) },
        { id: "AreaRatio", val: AreaRatio.toFixed(4) },
        { id: "SxRatio", val: SxRatio.toFixed(4) },
        { id: "SyRatio", val: SyRatio.toFixed(4) },
      ]);
    }
  });
initOc();
