import { gp_Ax2, OpenCascadeInstance, TopoDS_Shape } from "opencascade.js";
import {
  AmbientLight,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FutParams } from "./oc";
import openCascadeHelper from "./openCascadeHelper";

// const loadFileAsync = (file) => {
//   return new Promise((resolve, reject) => {
//     let reader = new FileReader();
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsText(file);
//   });
// };

// const loadSTEPorIGES = async (openCascade, inputFile, addFunction, scene) => {
//   await loadFileAsync(inputFile).then(async (fileText) => {
//     const fileType = (() => {
//       switch (inputFile.name.toLowerCase().split(".").pop()) {
//         case "step":
//         case "stp":
//           return "step";
//         case "iges":
//         case "igs":
//           return "iges";
//         default:
//           return undefined;
//       }
//     })();
//     // Writes the uploaded file to Emscripten's Virtual Filesystem
//     openCascade.FS.createDataFile(
//       "/",
//       `file.${fileType}`,
//       fileText,
//       true,
//       true
//     );

//     // Choose the correct OpenCascade file parsers to read the CAD file
//     var reader = null;
//     if (fileType === "step") {
//       reader = new openCascade.STEPControl_Reader_1();
//     } else if (fileType === "iges") {
//       reader = new openCascade.IGESControl_Reader_1();
//     } else {
//       console.error("opencascade.js can't parse this extension! (yet)");
//     }
//     const readResult = reader.ReadFile(`file.${fileType}`); // Read the file
//     if (readResult === openCascade.IFSelect_ReturnStatus.IFSelect_RetDone) {
//       console.log("file loaded successfully!     Converting to OCC now...");
//       const numRootsTransferred = reader.TransferRoots(
//         new openCascade.Message_ProgressRange_1()
//       ); // Translate all transferable roots to OpenCascade
//       const stepShape = reader.OneShape(); // Obtain the results of translation in one OCCT shape
//       console.log(
//         inputFile.name + " converted successfully!  Triangulating now..."
//       );

//       // Out with the old, in with the new!
//       scene.remove(scene.getObjectByName("shape"));
//       await addFunction(openCascade, stepShape, scene);
//       console.log(inputFile.name + " triangulated and added to the scene!");

//       // Remove the file when we're done (otherwise we run into errors on reupload)
//       openCascade.FS.unlink(`/file.${fileType}`);
//     } else {
//       console.error(
//         "Something in OCCT went wrong trying to read " + inputFile.name
//       );
//     }
//   });
// };
// export { loadSTEPorIGES };
export { setupThreeJSViewport };
// export { makeBottle };
export { addShapeToScene };

const setupThreeJSViewport = () => {
  var scene = new Scene();
  var camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  var renderer = new WebGLRenderer({ antialias: true });
  const viewport = document.getElementById("viewport");
  // @ts-ignore
  const viewportRect = viewport.getBoundingClientRect();
  renderer.setSize(viewportRect.width, viewportRect.height);
  // @ts-ignore
  viewport.appendChild(renderer.domElement);

  const light = new AmbientLight(0x404040);
  scene.add(light);
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0.5, 0.5, 0.5);
  scene.add(directionalLight);

  camera.position.set(0, 500, 0);

  const axesHelper = new AxesHelper(200);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.screenSpacePanning = true;
  controls.target.set(0, 0, 0);

  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return scene;
};

const makeCircleFace = (
  oc: OpenCascadeInstance,
  axis: gp_Ax2,
  radius: number
): TopoDS_Shape => {
  const circ = new oc.gp_Circ_2(axis, radius);
  const edge = new oc.BRepBuilderAPI_MakeEdge_8(circ);
  const wire = new oc.BRepLib_MakeWire_2(edge.Edge());
  const face = new oc.BRepBuilderAPI_MakeFace_15(wire.Wire(), false);
  const shape = face.Shape();
  return shape;
};
const makeRecFace = (
  oc: OpenCascadeInstance,
  x: number,
  y: number
): TopoDS_Shape => {
  // p3 --- p2
  // |      |
  // p0 --- p1
  const p0 = new oc.gp_Pnt_3(0, 0, 0);
  const p1 = new oc.gp_Pnt_3(x, 0, 0);
  const p2 = new oc.gp_Pnt_3(x, y, 0);
  const p3 = new oc.gp_Pnt_3(0, y, 0);
  const e01 = new oc.BRepBuilderAPI_MakeEdge_3(p0, p1);
  const e12 = new oc.BRepBuilderAPI_MakeEdge_3(p1, p2);
  const e23 = new oc.BRepBuilderAPI_MakeEdge_3(p2, p3);
  const e30 = new oc.BRepBuilderAPI_MakeEdge_3(p3, p0);

  const wire = new oc.BRepLib_MakeWire_5(
    e01.Edge(),
    e12.Edge(),
    e23.Edge(),
    e30.Edge()
  );
  const face = new oc.BRepBuilderAPI_MakeFace_15(wire.Wire(), false);
  const shape = face.Shape();
  return shape;
};
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}
const translate = (
  oc: OpenCascadeInstance,
  shape: TopoDS_Shape,
  vec: Vec3
): TopoDS_Shape => {
  const translate = new oc.gp_Trsf_1();
  translate.SetTranslation_1(new oc.gp_Vec_4(vec.x, vec.y, vec.z));
  return new oc.BRepBuilderAPI_Transform_2(shape, translate, false).Shape();
};

const rotate = (
  oc: OpenCascadeInstance,
  shape: TopoDS_Shape,
  point: Vec3,
  dir: Vec3,
  radAngle: number
): TopoDS_Shape => {
  const rot = new oc.gp_Trsf_1();
  rot.SetRotation_1(
    new oc.gp_Ax1_2(
      new oc.gp_Pnt_3(point.x, point.y, point.z),
      new oc.gp_Dir_4(dir.x, dir.y, dir.z)
    ),
    radAngle
  );
  return new oc.BRepBuilderAPI_Transform_2(shape, rot, false).Shape();
};
const degToRad = (deg: number): number => (2 * Math.PI * deg) / 360;
const radToDeg = (rad: number): number => (360 * rad) / (2 * Math.PI);

export interface ResultShape {
  shape: TopoDS_Shape;
  Ixx: number;
  Iyy: number;
  bbXMin: number;
  bbXMax: number;
  bbYMin: number;
  bbYMax: number;
  levierX: number;
  levierY: number;
  area: number;
  com: [number, number, number];
  Sx: number;
  Sy: number;
}
export const makeFut2D = (
  oc: OpenCascadeInstance,
  params: FutParams
): ResultShape => {
  console.log("starting makeFut2D...");

  console.log("Params : ", params);

  const origin = new oc.gp_Pnt_3(0, 0, 0);
  const dir = new oc.gp_Dir_4(0, 0, 1);
  const axis = new oc.gp_Ax2_3(origin, dir);
  const outerCir = makeCircleFace(oc, axis, params.D / 2);
  const innerCir = makeCircleFace(oc, axis, params.Di / 2);

  const cut = new oc.BRepAlgoAPI_Cut_3(
    outerCir,
    innerCir,
    new oc.Message_ProgressRange_1()
  );
  let shape = cut.Shape();

  let openingCutterShape = makeRecFace(oc, params.T3, params.D);
  openingCutterShape = translate(oc, openingCutterShape, {
    x: -params.T3 / 2,
    y: -params.D,
    z: 0,
  });
  for (let i = 1; i <= params.nbOpenings; i++) {
    const rot = new oc.gp_Trsf_1();
    rot.SetRotation_1(
      new oc.gp_Ax1_2(new oc.gp_Pnt_3(0, 0, 0), new oc.gp_Dir_4(0, 0, 1)),
      (i * 2 * Math.PI) / params.nbOpenings
    );
    var cutterShape = new oc.BRepBuilderAPI_Transform_2(
      openingCutterShape,
      rot,
      false
    ).Shape();

    shape = new oc.BRepAlgoAPI_Cut_3(
      shape,
      cutterShape,
      new oc.Message_ProgressRange_1()
    ).Shape();

    // add panels
    // panel 1
    let p1Shape = makeRecFace(oc, params.T4, params.T5);
    p1Shape = translate(oc, p1Shape, {
      x: params.T3 / 2,
      y: -params.D / 2 - params.T1,
      z: 0,
    });
    p1Shape = new oc.BRepBuilderAPI_Transform_2(p1Shape, rot, false).Shape();
    shape = new oc.BRepAlgoAPI_Fuse_3(
      shape,
      p1Shape,
      new oc.Message_ProgressRange_1()
    ).Shape();

    // panel 2
    let p2Shape = makeRecFace(oc, params.T4, params.T5);
    p2Shape = translate(oc, p2Shape, {
      x: -(params.T3 / 2 + params.T4),
      y: -params.D / 2 - params.T1,
      z: 0,
    });
    p2Shape = new oc.BRepBuilderAPI_Transform_2(p2Shape, rot, false).Shape();
    shape = new oc.BRepAlgoAPI_Fuse_3(
      shape,
      p2Shape,
      new oc.Message_ProgressRange_1()
    ).Shape();
  }

  // rotate shape
  if (params.theta != 0) {
    shape = rotate(
      oc,
      shape,
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      degToRad(params.theta)
    );
  }

  let gProps = new oc.GProp_GProps_1();
  oc.BRepGProp.SurfaceProperties_1(shape, gProps, false, false);
  let com = gProps.CentreOfMass();

  // move shape to CoM
  shape = translate(oc, shape, { x: -com.X(), y: -com.Y(), z: -com.Z() });
  gProps = new oc.GProp_GProps_1();
  oc.BRepGProp.SurfaceProperties_1(shape, gProps, false, false);
  com = gProps.CentreOfMass();

  let Mass = gProps.Mass();
  let MomentOfInertia = gProps.MomentOfInertia(new oc.gp_Ax1_2(com, dir));
  let mat = gProps.MatrixOfInertia();
  const props = {
    com: `[${com.X().toFixed(4)}, ${com.Y().toFixed(4)}, ${com
      .Z()
      .toFixed(4)}]`,
    Mass,
    MomentOfInertia,
  };

  // bounding box
  const bb = new oc.Bnd_Box_1();
  oc.BRepBndLib.Add(shape, bb, true);
  let x0 = { current: 0 };
  let x1 = { current: 0 };
  let y0 = { current: 0 };
  let y1 = { current: 0 };
  let z0 = { current: 0 };
  let z1 = { current: 0 };
  // @ts-ignore
  bb.Get(x0, y0, z0, x1, y1, z1);

  console.log(props);
  let nbRow = 3;
  console.log("MatrixOfInertia");
  for (var i = 0; i < nbRow; i++) {
    let row = mat.Row(i);
    console.log(`[${row.X()}, ${row.Y()}, ${row.Z()}]`);
  }
  console.log("makeFut2D completed");
  const Ixx = mat.Row(1).X();
  const Iyy = mat.Row(2).Y();
  const levierX = Math.max(Math.abs(y1.current), Math.abs(y0.current));
  const levierY = Math.max(Math.abs(x1.current), Math.abs(x0.current));
  return {
    shape,
    Ixx,
    Iyy,
    bbXMin: x0.current,
    bbXMax: x1.current,
    bbYMin: y0.current,
    bbYMax: y1.current,
    levierX,
    levierY,
    area: Mass,
    // @ts-ignore
    com: [com.X().toFixed(4), com.Y().toFixed(4), com.Z().toFixed(4)],
    Sx: Ixx / Math.abs(levierX),
    Sy: Iyy / Math.abs(levierY),
  };
};
// @ts-ignore
const addShapeToScene = async (openCascade, shape, scene, name = "shape") => {
  openCascadeHelper.setOpenCascade(openCascade);
  const facelist = await openCascadeHelper.tessellate(shape);
  const [locVertexcoord, locNormalcoord, locTriIndices] =
    await openCascadeHelper.joinPrimitives(facelist);
  const tot_triangle_count = facelist.reduce(
    (a, b) => a + b.number_of_triangles,
    0
  );
  const [vertices] = await openCascadeHelper.generateGeometry(
    tot_triangle_count,
    locVertexcoord,
    locNormalcoord,
    locTriIndices
  );
  const objectMat = new MeshStandardMaterial({
    color: new Color(0.9, 0.9, 0.9),
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(vertices), 3)
  );
  const object = new Mesh(geometry, objectMat);
  object.name = name;
  object.rotation.x = -Math.PI / 2;
  scene.add(object);
  //scene.add(new BoxHelper(object, 0xffff00));
};
