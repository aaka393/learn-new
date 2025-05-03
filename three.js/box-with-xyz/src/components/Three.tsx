import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/orbitControls.js';

const Three = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cubeMesh)

    cubeMesh.rotation.reorder('YXZ') 

    cubeMesh.rotation.y = THREE.MathUtils.degToRad(90)
    cubeMesh.rotation.x = THREE.MathUtils.degToRad(45)

    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Animate
    const animate = () => {
      requestAnimationFrame(animate)



      controls.update() 
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} className="threejs" />
    </div>
  )
}

export default Three