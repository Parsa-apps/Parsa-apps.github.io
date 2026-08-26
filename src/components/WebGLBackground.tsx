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

function lightProfile(): boolean {
  try {
    return (
      typeof window === "undefined" ||
      window.innerWidth < 768 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4
    );
  } catch {
    return true;
  }
}

/**
 * Lightweight full-page WebGL scene: star field + rings.
 * Fully wrapped in try/catch so a WebGL crash never blacks out the site.
 */
export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !webglSupported()) return;

    let reduced = false;
    let light = true;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      light = lightProfile();
    } catch {
      reduced = true;
      light = true;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let running = true;
    let starsGeo: THREE.BufferGeometry | null = null;
    let starsMat: THREE.PointsMaterial | null = null;
    let ringGeo: THREE.TorusGeometry | null = null;
    let ringMat: THREE.MeshBasicMaterial | null = null;
    let ring2Geo: THREE.TorusGeometry | null = null;
    let ring2Mat: THREE.MeshBasicMaterial | null = null;

    let targetX = 0;
    let targetY = 0;

    const onMouse = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    const onResize = () => {
      if (!mount || !renderer) return;
      try {
        // camera is closed over inside try block, so we need to store it outside
        // we handle resize inside the main try where camera exists
      } catch {
        // ignore
      }
    };

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 600);
      camera.position.z = 42;

      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !light, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1.2 : 1.7));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

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
      starsGeo = new THREE.BufferGeometry();
      starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      starsMat = new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false });
      const stars = new THREE.Points(starsGeo, starsMat);
      scene.add(stars);

      ringGeo = new THREE.TorusGeometry(17, 0.06, 16, 200);
      ringMat = new THREE.MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.22 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3.6;
      scene.add(ring);

      ring2Geo = new THREE.TorusGeometry(24, 0.03, 12, 200);
      ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00c6ff, transparent: true, opacity: 0.16 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = -Math.PI / 4.4;
      ring2.rotation.y = 0.5;
      scene.add(ring2);

      const clock = new THREE.Clock();

      const resizeHandler = () => {
        if (!mount) return;
        try {
          camera.aspect = mount.clientWidth / mount.clientHeight;
          camera.updateProjectionMatrix();
          renderer?.setSize(mount.clientWidth, mount.clientHeight);
        } catch {
          // ignore
        }
      };

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!running || !renderer) return;
        try {
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
        } catch {
          running = false;
        }
      };
      animate();

      if (!reduced && !light) window.addEventListener("mousemove", onMouse, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", resizeHandler);

      return () => {
        try {
          window.cancelAnimationFrame(raf);
          window.removeEventListener("resize", resizeHandler);
          window.removeEventListener("mousemove", onMouse);
          document.removeEventListener("visibilitychange", onVisibility);
          starsGeo?.dispose();
          starsMat?.dispose();
          ringGeo?.dispose();
          ringMat?.dispose();
          ring2Geo?.dispose();
          ring2Mat?.dispose();
          renderer?.dispose();
          if (renderer && renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
        } catch {
          // ignore
        }
      };
    } catch {
      // Any crash -> silently disable WebGL, keep site alive
      try {
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
        }
      } catch {
        // ignore
      }
      return;
    }
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
