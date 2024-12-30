// import { useCursor, useTexture } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { useAtom } from "jotai";
// import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import { pages } from "./UI";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
// import { degToRad } from "three/src/math/MathUtils.js";
// import { pageAtom, pages } from "./UI";

const easingFactor = 0.5; // Controls the speed of the easing
const easingFactorFold = 0.3; // Controls the speed of the easing
const insideCurveStrength = 0.18; // Controls the strength of the curve
const outsideCurveStrength = 0.05; // Controls the strength of the curve
const turningCurveStrength = 0.09; // Controls the strength of the curve

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0); //set page geometry to shift it to a relevant position
const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  //ITERATING ALL THE VERTICES VERTEX.
  vertex.fromBufferAttribute(position, i); //get the vertex
  const x = vertex.x; // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; //setting up the skin indexes

  skinIndex.push(skinIndex, skinIndex + 1, 0, 0); //we use two bones per vertex here

  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); //impact of the bone

  //attaching the skin wieght to the geometry
}
pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);

pageGeometry.setAttribute(
  "skinIndex",
  new Float32BufferAttribute(skinWeights, 4)
); //float because it is a value between 0 and 1

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
];

//todo load textures with the same format of image here
// pages.forEach((page) => {
//   useTexture.preload(`/textures/${page.front}.jpg`);
//   useTexture.preload(`/textures/${page.back}.jpg`);
//   useTexture.preload(`/textures/book-cover-roughness.jpg`);
// });

//page component

const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [picture, picture2, pictureRoughness] = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`,
    ...(number === 0 || number === pages.length - 1
      ? [`/textures/book-cover-roughness.jpg`]
      : []),
  ]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const SkinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];

    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      //we'll have as many bones as the segments

      let bone = new Bone();
      bones.push(bone);
      //for each segment we need to have a new bone

      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
        //attach the new bone to the previous
      }
    }

    const skeleton = new Skeleton(bones);
    const materials = pageGeometryaterials;
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []);

  return (
    <group {...props} ref={group}>
      <mesh scale={0.1}>
        {" "}
        {/*because we want to be able to bend our pages, we wont be using mesh directly, instead we will be using skinned mesh. A skinned mesh has a skeleton with bones to animate the vertices of the geometry*/}
        <primitive object={pageGeometry} attach={"geometry"} />
        {/*primitive object instead of the boxgeometry */}
        <meshBasicMaterial color="black" />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};

export const Book = ({ ...props }) => {
  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};
