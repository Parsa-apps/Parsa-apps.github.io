import { useEffect, useRef } from "react";
import * as THREE from "three";

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

/** True when we should keep the scene intentionally light (small screens, low-power). */
function lightProfile(): boolean {
  return (
    typeof window === "undefined" ||
    window.innerWidth < 768 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator.hardwareConcurrency ?? 8) <= 4
  );
}

/**
 * Lightweight full-page WebGL scene: a slowly drifting star field with a
 * translucent wireframe ring for a subtle premium "orbit" feel.
 */
export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !webglSupported()) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const light = lightProfile();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 600);
    camera.position.z = 42;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !light, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1.2 : 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Star particles (fewer on light profiles)
    const starsCount = light ? 520 : 1100;
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

    // Subtle mouse parallax for depth (skipped on light/reduced profiles)
    let targetX = 0;
    let targetY = 0;
    const onMouse = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced && !light) window.addEventListener("mousemove", onMouse, { passive: true });

    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!running) return;
      const t = clock.getElapsedTime();
      if (!reduced) {
        stars.rotation.y = t * 0.018;
        stars.rotation.x = Math.sin(t * 0.1) * 0.04;
        ring.rotation.z = t * 0.05;
        ring2.rotation.z = -t * 0.04;
        camera.position.x += (targetX * 1.4 - camera.position.x) * 0.04;
        camera.position.y += (-targetY * 1.2 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
      }
      renderer.render(scene, camera);
    };
    animate();

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running && !reduced) clock.getDelta();
    };
    document.addEventListener("visibilitychange", onVisibility);

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
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
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
