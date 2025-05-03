import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three-stdlib';

import serverImg from '../../assets/serverImg.png';
import faFileExcelImg from '../../assets/faFileExcelImg.png';
import faFilePdfImg from '../../assets/faFilePdfImg.png';
import botImg from '../../assets/botImg.png';

import { GraphData } from '../../types/nodes';


interface ThreeGraphProps {
  data: GraphData;
}

type CustomNode = THREE.Object3D<THREE.Object3DEventMap> & {
  userData: { type: string };
};

const ThreeGraph: React.FC<ThreeGraphProps> = ({ data }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [aigizmoLabel, setAigizmoLabel] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      74,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.dynamicDampingFactor = 0.3;
    controls.update();

    const connectionMaterial = new THREE.LineBasicMaterial({ color: 0x94A3B8 });

    const textureLoader = new THREE.TextureLoader();
    const positions = data.nodes.map(
      (n) => new THREE.Vector3(n.x / 50, n.y / 40, (n.z || 0) / 50)
    );
    const boundingBox = new THREE.Box3().setFromPoints(positions);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const nodes: { [id: string]: CustomNode } = {};

    data.nodes.forEach((nodeData) => {
      const pos = new THREE.Vector3(nodeData.x / 50, nodeData.y / 37, (nodeData.z || 0) / 50);
      pos.sub(center);

      let imgUrl = serverImg;
      if (nodeData.type === 'excel') imgUrl = faFileExcelImg;
      else if (nodeData.type === 'pdf') imgUrl = faFilePdfImg;
      else if (nodeData.type === 'aigizmo') imgUrl = botImg;

      const texture = textureLoader.load(imgUrl);
      texture.anisotropy = 16;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const geometry = new THREE.SphereGeometry(1.2, 32, 32);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      mesh.rotation.y = Math.PI / 0.6;

      // Assign type to userData and cast explicitly
      (mesh as unknown as CustomNode).userData = { type: nodeData.type };

      scene.add(mesh);
      nodes[nodeData.id] = mesh as unknown as CustomNode;
    });

    data.connections.forEach((conn) => {
      const source = nodes[conn.source];
      const target = nodes[conn.target];
      if (!source || !target) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        source.position,
        target.position,
      ]);
      const line = new THREE.Line(geometry, connectionMaterial);
      scene.add(line);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current) return;

      const bounds = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(nodes));

      const hit = intersects.find(
        (i) => (i.object as CustomNode).userData.type === 'aigizmo'
      );

      if (hit) {
        const screenPosition = hit.object.position.clone().project(camera);
        const x = ((screenPosition.x + 1) / 2) * bounds.width;
        const y = ((-screenPosition.y + 1) / 2) * bounds.height;
        setAigizmoLabel({ x, y });
      } else {
        setAigizmoLabel(null);
      }
    };

    mountRef.current.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [data]);

  return (
    <div ref={mountRef} style={{ position: 'relative', width: '100%', height: '600px' }}>
      {aigizmoLabel && (
        <div
          style={{
            position: 'absolute',
            left: `${aigizmoLabel.x}px`,
            top: `${aigizmoLabel.y}px`,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%)',
          }}
        >
          aigizmo
        </div>
      )}
    </div>
  );
};

export default ThreeGraph;
