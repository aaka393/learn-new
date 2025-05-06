import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { animationData } from './controlanimation';

const StickFigureScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === Scene Setup ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black sky

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 2;

    // === Lights ===
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 10, 5);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // === Starfield ===
    // Starfield (only in the sky hemisphere, smaller size)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starVertices = [];

    for (let i = 0; i < starCount; i++) {
      const radius = Math.random() * 150 + 50; // distance from center
      const theta = Math.random() * 2 * Math.PI; // horizontal angle
      const phi = Math.random() * Math.PI / 2;  // vertical angle (0 to π/2 for upper dome)

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi); // y is always positive (sky only)
      const z = radius * Math.sin(phi) * Math.sin(theta);

      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3, // smaller star size
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);


    // === Ground ===
    const gridTexture = new THREE.TextureLoader().load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set(20, 20);
    gridTexture.anisotropy = 16;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshLambertMaterial({ map: gridTexture })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // === Stick Figure ===
    const stickFigure = new THREE.Group();

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(animationData.head.radius, 32, 32),
      new THREE.MeshLambertMaterial({ color: animationData.head.color })
    );
    head.position.set(0, animationData.head.y, 0);
    stickFigure.add(head);

    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(animationData.body.radius, animationData.body.radius, animationData.body.height, 32),
      new THREE.MeshLambertMaterial({ color: animationData.body.color })
    );
    body.position.set(0, animationData.body.y, 0);
    stickFigure.add(body);

    // Arms
    const createLimb = (length: number) => {
      return new THREE.Mesh(
        new THREE.CylinderGeometry(animationData.limb.radius, animationData.limb.radius, length, 32),
        new THREE.MeshLambertMaterial({ color: animationData.limb.color })
      );
    };

    const leftArmPivot = new THREE.Object3D();
    leftArmPivot.position.set(animationData.leftArm.x, animationData.leftArm.y, 0);
    const leftArm = createLimb(animationData.armLength);
    leftArm.position.y = -animationData.armLength / 2;
    leftArmPivot.add(leftArm);
    stickFigure.add(leftArmPivot);

    const rightArmPivot = new THREE.Object3D();
    rightArmPivot.position.set(animationData.rightArm.x, animationData.rightArm.y, 0);
    const rightArm = createLimb(animationData.armLength);
    rightArm.position.y = -animationData.armLength / 2;
    rightArmPivot.add(rightArm);
    stickFigure.add(rightArmPivot);

    // Legs
    const leftLegPivot = new THREE.Object3D();
    leftLegPivot.position.set(animationData.leftLeg.x, animationData.leftLeg.y, 0);
    const leftLeg = createLimb(animationData.legLength);
    leftLeg.position.y = -animationData.legLength / 2;
    leftLegPivot.add(leftLeg);
    stickFigure.add(leftLegPivot);

    const rightLegPivot = new THREE.Object3D();
    rightLegPivot.position.set(animationData.rightLeg.x, animationData.rightLeg.y, 0);
    const rightLeg = createLimb(animationData.legLength);
    rightLeg.position.y = -animationData.legLength / 2;
    rightLegPivot.add(rightLeg);
    stickFigure.add(rightLegPivot);

    stickFigure.position.set(-10, 0, 0);
    stickFigure.castShadow = true;
    scene.add(stickFigure);

    // === Animation ===
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Limb swinging
      const swing = Math.sin(t * animationData.swingSpeed) * animationData.swingRange;
      leftArmPivot.rotation.x = swing;
      rightArmPivot.rotation.x = -swing;
      leftLegPivot.rotation.x = -swing;
      rightLegPivot.rotation.x = swing;

      // Move stick figure forward
      stickFigure.position.x += animationData.moveSpeed;
      if (stickFigure.position.x > 10) {
        stickFigure.position.x = -10;
      }

      // Scroll ground texture
      gridTexture.offset.y += 0.015;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // === Resize ===
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default StickFigureScene;
