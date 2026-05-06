'use client';

import { useTheme } from '../../lib/theme';
import { useEffect, useRef } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

/** Sanfter Pixel-Schimmer (Canvas); bei „reduzierte Bewegung“ nur statisches Raster. */
export function PixelBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvasNode = canvasRef.current;
    if (!wrap || !canvasNode) return;
    const canvasEl: HTMLCanvasElement = canvasNode;

    let reduced = false;
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      reduced = false;
    }

    const ctxRaw = canvasEl.getContext('2d');
    if (!ctxRaw) return;
    const c2d: CanvasRenderingContext2D = ctxRaw;

    const COLS = 48;
    const ROWS = 32;
    const grid = new Float32Array(COLS * ROWS);

    let w = 0;
    let h = 0;
    let cw = 0;
    let ch = 0;
    let raf = 0;

    function readRgb() {
      const accentCss = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const rgb = hexToRgb(accentCss) || { r: 59, g: 130, b: 246 };
      return rgb;
    }

    function readBgFallback() {
      return theme === 'dark' ? '#08090a' : '#f7f8f9';
    }

    function resize() {
      const shell = wrapRef.current;
      if (!shell || !canvasEl) return;
      const rect = shell.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(rect.width * dpr);
      h = Math.floor(rect.height * dpr);
      if (w < 8 || h < 8) return;
      canvasEl.width = w;
      canvasEl.height = h;
      cw = w / COLS;
      ch = h / ROWS;
    }

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    const spark = () => {
      const n = 4 + Math.floor(Math.random() * 7);
      for (let i = 0; i < n; i++) {
        const x = Math.floor(Math.random() * COLS);
        const y = Math.floor(Math.random() * ROWS);
        const base = y * COLS + x;
        grid[base] = 0.42 + Math.random() * 0.58;
        if (Math.random() < 0.4 && x + 1 < COLS) grid[base + 1] = Math.max(grid[base + 1], 0.35);
        if (Math.random() < 0.35 && y + 1 < ROWS) grid[base + COLS] = Math.max(grid[base + COLS], 0.28);
      }
    };

    function drawStaticChess(rgb: { r: number; g: number; b: number }) {
      const bg = readBgFallback();
      c2d.fillStyle = bg;
      c2d.fillRect(0, 0, w || canvasEl.width, h || canvasEl.height);
      const ww = canvasEl.width;
      const hh = canvasEl.height;
      const gx = ww / COLS;
      const gy = hh / ROWS;
      c2d.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.06)`;
      for (let y = 0; y < ROWS; y += 2) {
        for (let x = y % 4 === 0 ? 0 : 1; x < COLS; x += 2) {
          c2d.fillRect(Math.floor(x * gx), Math.floor(y * gy), Math.ceil(gx), Math.ceil(gy));
        }
      }
    }

    function loop() {
      const rgb = readRgb();
      for (let i = 0; i < grid.length; i++) grid[i] *= 0.875;
      if (Math.random() < 0.7) spark();

      c2d.fillStyle = readBgFallback();
      c2d.fillRect(0, 0, w, h);

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const v = grid[y * COLS + x];
          if (v < 0.025) continue;
          c2d.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.min(0.52, v * 0.48)})`;
          c2d.fillRect(Math.floor(x * cw), Math.floor(y * ch), Math.max(1, Math.ceil(cw)), Math.max(1, Math.ceil(ch)));
        }
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    const rgb0 = readRgb();
    if (reduced) {
      resize();
      drawStaticChess(rgb0);
      return () => ro.disconnect();
    }

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [theme]);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
