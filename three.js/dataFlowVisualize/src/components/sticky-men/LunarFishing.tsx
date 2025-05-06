import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Config {
  numStickFigures: number;
  walkingSpeed: number;
  fishingArea: { x: number; y: number; z: number };
  fishingLineLength: number;
  fish: { model: string; texture: string };
  fishingAnimationDuration: number;
}

const LunarFishing = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let stickFigures: { mesh: THREE.Group; isFishing: boolean }[] = [];
    let config: Config;
    let animationFrameId: number;

    const init = async () => {
      try {
        const response = await fetch('/config.json');
        config = await response.json() as Config;
      } catch (e) {
        console.error("Failed to load config.json", e);
        return;
      }

      // Init Three.js scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current?.appendChild(renderer.domElement);
      

      // Lunar surface
      const lunarGeometry = new THREE.PlaneGeometry(50, 50);
      const lunarMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
      const lunarSurface = new THREE.Mesh(lunarGeometry, lunarMaterial);
      lunarSurface.rotation.x = -Math.PI / 2;
      scene.add(lunarSurface);

      // Add stick figures
      for (let i = 0; i < config.numStickFigures; i++) {
        const mesh = createStickFigure();
        mesh.position.set(-5 + i * 3, 0, 10); // start from z=10
        stickFigures.push({ mesh, isFishing: false });
        scene.add(mesh);
      }

      animate();

      // Resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
      
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      
        // Handle high-DPI or zoom
        const pixelRatio = window.devicePixelRatio || 1;
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        mountRef.current?.removeChild(renderer.domElement);
      };
    };

    const createStickFigure = () => {
      const stickFigure = new THREE.Group();

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      stickFigure.add(head);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 2),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      body.position.y = -1.5;
      stickFigure.add(body);

      const createLimb = (x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
        const limb = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 1),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        limb.position.set(x, y, z);
        limb.rotation.set(rx, ry, rz);
        return limb;
      };

      stickFigure.add(createLimb(-0.7, -1, 0, 0, 0, Math.PI / 3)); // left arm
      stickFigure.add(createLimb(0.7, -1, 0, 0, 0, -Math.PI / 3)); // right arm
      stickFigure.add(createLimb(-0.3, -3, 0, -Math.PI / 12)); // left leg
      stickFigure.add(createLimb(0.3, -3, 0, -Math.PI / 12)); // right leg

      return stickFigure;
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      stickFigures.forEach((figure) => {
        if (!figure.isFishing) {
          figure.mesh.position.z -= config.walkingSpeed;

          // Stop walking and start "fishing"
          if (figure.mesh.position.z <= config.fishingArea.z) {
            figure.mesh.position.z = config.fishingArea.z;
            figure.isFishing = true;

            // Simulate fishing animation (you can extend this)
            setTimeout(() => {
              figure.isFishing = false;
              figure.mesh.position.z = 10; // reset
            }, config.fishingAnimationDuration);
          }
        }
      });

      renderer.render(scene, camera);
    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-screen" />;
};

export default LunarFishing;
