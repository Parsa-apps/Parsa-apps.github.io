import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Cheap up-front probe: does this environment give us a WebGL context at all? */
function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      typeof window.WebGLRenderingContext !== "undefined" &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Lightweight full-page WebGL scene: a slowly drifting star field with a
 * translucent wireframe ring for a subtle premium "orbit" feel.
 */
export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    // Skip silently (no crash, no black screen) when WebGL is unavailable —
    // e.g. software-rendering VMs, blocked GPUs, or hardened browsers.
    if (!mount || !webglSupported()) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 600);
    camera.position.z = 42;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      // Context creation can still fail after the support probe — degrade quietly.
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Star particles
    const starsCount = 1100;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const palette = [new THREE.Color("#b4a0ff"), new THREE.Color("#00c6ff"), new THREE.Color("#00ffd0")];
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starsMat = new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Orbit ring
    const ringGeo = new THREE.TorusGeometry(17, 0.06, 16, 200);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.22 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3.6;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(24, 0.03, 12, 200);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00c6ff, transparent: true, opacity: 0.16 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4.4;
    ring2.rotation.y = 0.5;
    scene.add(ring2);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!reduced) {
        const t = clock.getElapsedTime();
        stars.rotation.y = t * 0.018;
        stars.rotation.x = Math.sin(t * 0.1) * 0.04;
        ring.rotation.z = t * 0.05;
        ring2.rotation.z = -t * 0.04;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      starsGeo.dispose();
      starsMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
