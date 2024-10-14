import { useRef } from "react";

import { pages } from "./UI";

//page component

const Page = ({ number, front, back, ...props }) => {
  const group = useRef();

  return (
    <group {...props} ref={group}>
      <mesh scale={0.1}>
        <boxGeometry />

        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};
export const Book = ({ ...props }) => {
  return (
    <group {...props}>
      {[...pages].map((pageDat, index) => (
        <Page key={index} number={index} {...pageData} />
      ))}
    </group>
  );
};
