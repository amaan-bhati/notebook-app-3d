import { useRef } from "react";
import { pages } from "./UI";
import { BoxGeometry } from "three";

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

//page component

const Page = ({ number, front, back, ...props }) => {
  const group = useRef();

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
