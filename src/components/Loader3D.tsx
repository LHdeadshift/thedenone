import { useEffect, useRef, useState } from "react";

/**
 * 3D loader — low-poly rotating mountain on obsidian background.
 * Three.js via CDN, under 150KB geometry-only, capped at 2.5s.
 * sessionStorage flag so it only runs once per session.
 * CSS fallback if WebGL is unavailable.
 */
export function Loader3D({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const doneRef = useRef(false);

  const triggerExit = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setExiting(true);
    setTimeout(() => {
      onDone();
    }, 900); // match curtain animation duration
  };

  useEffect(() => {
    // Check WebGL
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglOk(false);
      // Fallback: show wordmark for 1.5s then exit
      setTimeout(triggerExit, 1500);
      return;
    }

    // Hard cap: never hold user longer than 2.5s
    const capTimer = setTimeout(triggerExit, 2500);

    // Simulate progress while loading
    let progTimer: ReturnType<typeof setInterval>;
    let currentProg = 0;
    progTimer = setInterval(() => {
      currentProg = Math.min(currentProg + Math.random() * 18, 90);
      setProgress(currentProg);
    }, 200);

    // Dynamic import Three.js from CDN
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";
      window.__THREE__ = THREE;
      window.dispatchEvent(new Event("three-loaded"));
    `;
    document.head.appendChild(script);

    function initScene() {
      // @ts-expect-error dynamic global
      const THREE = window.__THREE__;
      if (!THREE || !canvasRef.current) return;

      clearInterval(progTimer);
      setProgress(85);

      const canvas = canvasRef.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Get obsidian color
      const obsidianColor = 0x1a1c2a;
      renderer.setClearColor(obsidianColor);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 1.2, 5);
      camera.lookAt(0, 0.6, 0);

      // Low-poly mountain geometry
      const geo = new THREE.ConeGeometry(2, 2.8, 6, 3);
      // Slightly randomize vertices for organic feel
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y > -1.3 && y < 1.3) {
          pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 0.15);
          pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.15);
        }
      }
      geo.computeVertexNormals();

      // Ember-tinted material (flat shading for low-poly look)
      const mat = new THREE.MeshStandardMaterial({
        color: 0xc08050,
        roughness: 0.8,
        metalness: 0.1,
        flatShading: true,
      });
      const mountain = new THREE.Mesh(geo, mat);
      mountain.position.y = -0.4;
      scene.add(mountain);

      // Second smaller peak offset
      const geo2 = new THREE.ConeGeometry(1.2, 2, 5, 2);
      const pos2 = geo2.attributes.position;
      for (let i = 0; i < pos2.count; i++) {
        const y = pos2.getY(i);
        if (y > -0.9 && y < 0.9) {
          pos2.setX(i, pos2.getX(i) + (Math.random() - 0.5) * 0.1);
          pos2.setZ(i, pos2.getZ(i) + (Math.random() - 0.5) * 0.1);
        }
      }
      geo2.computeVertexNormals();
      const mountain2 = new THREE.Mesh(geo2, mat);
      mountain2.position.set(1.8, -0.8, -0.5);
      scene.add(mountain2);

      // Lights — minimal
      const ambient = new THREE.AmbientLight(0xffffff, 0.35);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xc08050, 1.2);
      dir.position.set(3, 4, 2);
      scene.add(dir);
      const dir2 = new THREE.DirectionalLight(0x6088a0, 0.4);
      dir2.position.set(-2, 2, -1);
      scene.add(dir2);

      setProgress(100);

      let frame: number;
      function animate() {
        frame = requestAnimationFrame(animate);
        mountain.rotation.y += 0.004;
        mountain2.rotation.y += 0.003;
        renderer.render(scene, camera);
      }
      animate();

      // Assets "loaded" — trigger exit after a brief moment to see 100%
      setTimeout(triggerExit, 400);

      return () => {
        cancelAnimationFrame(frame);
        renderer.dispose();
        geo.dispose();
        geo2.dispose();
        mat.dispose();
      };
    }

    const onThreeLoaded = () => initScene();
    window.addEventListener("three-loaded", onThreeLoaded);

    return () => {
      clearTimeout(capTimer);
      clearInterval(progTimer);
      window.removeEventListener("three-loaded", onThreeLoaded);
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebGL fallback
  if (!webglOk) {
    return (
      <div className={`loader-fallback ${exiting ? "exit" : ""}`}>
        <div className="curtain-left" />
        <div className="curtain-right" />
        <div className="wordmark" style={{ zIndex: 10001, position: "relative" }}>
          The Den
        </div>
      </div>
    );
  }

  return (
    <div className={`loader-curtain ${exiting ? "exit" : ""}`}>
      <div className="curtain-left" />
      <div className="curtain-right" />
      <canvas
        ref={canvasRef}
        style={{
          width: "min(400px, 80vw)",
          height: "min(300px, 50vh)",
          zIndex: 10001,
          position: "relative",
        }}
      />
      <div className="loader-progress" style={{ zIndex: 10001, position: "relative" }}>
        <div
          className="loader-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
