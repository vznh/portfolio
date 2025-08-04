// components/Background
import Image from "next/image";
import { useEffect, useRef } from "react";

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrain = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Generate sparse random noise
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.40) {
          const noise = Math.random() * 255;
          data[i] = noise;
          data[i + 1] = noise;
          data[i + 2] = noise;
          data[i + 3] = Math.random() * 70; // change da opacity here
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (lastFrameTime.current || 0);

      if (elapsed > 200) {
        // ~12 fps — I have no idea how this works, at all.
        drawGrain();
        lastFrameTime.current = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={"/images/bg/tex.png"}
          alt="background"
          className="opacity-15"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>
  );
};

export default Background;
