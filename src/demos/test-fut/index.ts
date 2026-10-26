import initOpenCascade from "opencascade.js";
import { MeshBasicMaterial, Mesh, SphereGeometry } from "three";

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
const readNumber = (id: string): number =>
  // @ts-ignore
  parseFloat(document.getElementById(id).value) || 0;

const getParams = (): FutParams => {
  // @ts-ignore
  const nbOpenings = parseInt(document.getElementById("nbOpenings").value) || 0;
  const D = readNumber("D");
  const t = readNumber("t");
  const Di = D - 2 * t;
  const params: FutParams = {
    nbOpenings,
    D,
    t,
    Di,
    T1: readNumber("T1"),
    T2: 0,
    T3: readNumber("T3"),
    T4: readNumber("T4"),
    T5: readNumber("T5"),
    theta: readNumber("theta"),
  };
  return params;
};

const valueFormat = new Intl.NumberFormat("fr-CA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const ratioFormat = new Intl.NumberFormat("fr-CA", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const setOutput = (id: string, text: string): HTMLElement => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
  return el;
};
const setValue = (id: string, val: number) =>
  setOutput(id, Number.isFinite(val) ? valueFormat.format(val) : "–");
const setRatio = (id: string, val: number) => {
  const ok = Number.isFinite(val);
  const el = setOutput(id, ok ? ratioFormat.format(val) : "–");
  // Ratio is shown with 4 decimals; compare at that precision.
  if (el) el.dataset.state = !ok ? "" : +val.toFixed(4) <= 1 ? "ok" : "warn";
};

// @ts-ignore
let comObj = undefined;
const name = "fut-shape";

export const initOc = () =>
  initOpenCascade().then((openCascade) => {
    console.log("Open Cascade inited.");

    const render = () => {
      const previous = scene.getObjectByName(name);
      if (previous) scene.remove(previous);

      const r = makeFut2D(openCascade, getParams());
      addShapeToScene(openCascade, r.shape, scene, name);

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

      setValue("area", r.area);
      setValue("Sx", r.Sx);
      setValue("Sy", r.Sy);
      setValue("Ixx", r.Ixx);
      setValue("Iyy", r.Iyy);
      setValue("levierX", r.levierX);
      setValue("levierY", r.levierY);
      setValue("areaFut", r.areaFut);
      setValue("SxFut", r.SxFut);
      setValue("SyFut", r.SyFut);
      setValue("IxxFut", r.IxxFut);
      setValue("IyyFut", r.IyyFut);
      setValue("levierXFut", r.levierXFut);
      setValue("levierYFut", r.levierYFut);
      setRatio("AreaRatio", r.AreaRatio);
      setRatio("SxRatio", r.SxRatio);
      setRatio("SyRatio", r.SyRatio);
    };

    render();
    document.getElementById("loading")?.classList.add("done");
    console.log("Shape added to scene.");

    window.addEventListener("input", (e) => {
      e.preventDefault();
      e.stopPropagation();
      render();
    });
  });
initOc();
