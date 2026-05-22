"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const section = canvas.parentElement as HTMLElement;
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };
    let animationId: number;
    let isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    class Particle {
      x: number; y: number; size: number;
      baseX: number; baseY: number; density: number;
      vx: number; vy: number; opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      draw() {
        ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        if (!isReducedMotion) {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            this.opacity = Math.min(1, this.opacity + 0.05);
            if (!isReducedMotion) {
              const fx = dx / dist;
              const fy = dy / dist;
              const force = (mouse.radius - dist) / mouse.radius;
              this.x += fx * force * 2;
              this.y += fy * force * 2;
            }
          } else if (this.opacity > 0.3) {
            this.opacity -= 0.01;
          }
        }
      }
    }

    let particles: Particle[] = [];

    function init() {
      particles = [];
      const count = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.1;
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    function resize() {
      canvas.width = section?.offsetWidth ?? window.innerWidth;
      canvas.height = section?.offsetHeight ?? window.innerHeight;
      init();
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    const onMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onMotionChange);
    window.addEventListener("resize", resize);
    section?.addEventListener("mousemove", onMouseMove);
    section?.addEventListener("mouseleave", onMouseLeave);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      section?.removeEventListener("mousemove", onMouseMove);
      section?.removeEventListener("mouseleave", onMouseLeave);
      mq.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
