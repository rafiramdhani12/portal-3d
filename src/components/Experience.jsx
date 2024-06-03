import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useTexture,
} from "@react-three/drei";

import * as THREE from "three";
import {Fish} from "./Fish";
import {Dragon} from "./Dragon_Evolved";
import {Cactoro} from "./Cactoro";
import {useEffect, useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {easing} from "maath";

export const Experience = () => {
  const [active, setActive] = useState();
  const [hovered, setHovered] = useState();
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targePosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targePosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targePosition.x,
        targePosition.y,
        targePosition.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <MonsterStage
        texture={
          "textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"
        }
        active={active}
        setActive={setActive}
        name="Fish"
        color="#38adcf"
        hover={hovered}
        setHovered={setHovered}>
        <Fish scale={0.6} position-y={-1} hovered={hovered === "Fish"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_lava_world.jpg"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        name="Dragon"
        color={"#df8d52"}
        active={active}
        setActive={setActive}
        hover={hovered}
        setHovered={setHovered}>
        <Dragon scale={0.5} position-y={-1} hovered={hovered === "Dragon"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_cactus_forest.jpg"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        name="Cactoro"
        color="#739d3c"
        active={active}
        setActive={setActive}
        hover={hovered}
        setHovered={setHovered}>
        <Cactoro scale={0.45} position-y={-1} hovered={hovered === "Cactoro"} />
      </MonsterStage>
    </>
  );
};

// torus bulet donat sphere bulet bola mesh kotak??

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const PortalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(PortalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
        anchorY={"bottom"}>
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}>
        {/* <planeGeometry args={[2, 3]} /> */}
        <MeshPortalMaterial ref={PortalMaterial} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            {/* side membuat perspektif berubah seakan masuk di dlam object */}
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
