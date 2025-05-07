export const animationData = {
  scene: {
    backgroundColor: 0x000000
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 5, z: 15 }
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    enablePan: false,
    enableZoom: false,
    maxPolarAngleDivisor: 2
  },
  lights: {
    directional: {
      color: 0xffffff,
      intensity: 0.8,
      position: { x: 5, y: 10, z: 5 },
      castShadow: true
    },
    ambient: {
      color: 0x404040
    }
  },
  starfield: {
    count: 1000,
    radiusRange: { min: 50, max: 150 },
    phiDivisor: 2,
    color: 0xffffff,
    size: 0.3,
    sizeAttenuation: true
  },
  ground: {
    textureURL: 'https://threejsfundamentals.org/threejs/resources/images/checker.png',
    repeat: { x: 20, y: 20 },
    anisotropy: 16,
    size: { x: 200, y: 200 },
    receiveShadow: true,
    textureOffsetSpeed: 0.015
  },
  head: {
    radius: 0.7,
    y: 5.5,
    color: 0xff6600,
    widthSegments: 32,
    heightSegments: 32
  },
  body: {
    radius: 0.2,
    height: 3,
    y: 3.5,
    color: 0xff6600,
    radialSegments: 32
  },
  limb: {
    radius: 0.15,
    color: 0xff6600,
    radialSegments: 32
  },
  armLength: 2.5,
  legLength: 3,
  leftArm: {
    x: -1.2,
    y: 4.8
  },
  rightArm: {
    x: 1.2,
    y: 4.8
  },
  leftLeg: {
    x: -0.5,
    y: 2
  },
  rightLeg: {
    x: 0.5,
    y: 2
  },
  swingSpeed: 6,
  swingRange: 0.8,
  moveSpeed: 0.01,
  moveBounds: 10,
  stickFigure: {
    position: { x: -10, y: 0, z: 0 },
    castShadow: true
  }
};