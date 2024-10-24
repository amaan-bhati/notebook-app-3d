import { useMemo, useRef } from "react";
import { pages } from "./UI";
import {
  Bone,
  BoxGeometry,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
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

//page component

const Page = ({ number, front, back, ...props }) => {
  const group = useRef();
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
    <group {...props}>
      {[...pages].map((pageDat, index) =>
        index === 0 ? (
          <Page
            position-x={index * 0.15}
            key={index}
            number={index}
            {...pageData}
          />
        ) : null
      )}
    </group>
  );
};
