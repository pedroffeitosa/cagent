import React from 'react';
import { useTheme, ThemePreset } from './ThemeProvider';

/**
 * Cada preset de tema tem um "modo" de fundo ambiente próprio:
 * Dark/Light = Aurora (gradiente mesh animado), Midnight = Grid técnico,
 * Royal = Grain editorial. Isso é o que torna a troca de tema perceptível
 * em qualquer tela do app, não só um reskin de cores.
 */
const PRESET_MODE: Record<ThemePreset, 'aurora' | 'grid' | 'paper'> = {
  default: 'aurora',
  light: 'aurora',
  midnight: 'grid',
  royal: 'paper',
};

interface AmbientBackgroundProps {
  /**
   * 'viewport' fixa o fundo na tela (para shells de app que não rolam como
   * página única, ex: o storefront). 'page' acompanha a altura real do
   * elemento pai (para páginas longas de rolagem única, ex: a Landing Page) —
   * o pai precisa ser `position: relative` e não ter altura fixa.
   */
  variant?: 'viewport' | 'page';
  className?: string;
}

export function AmbientBackground({ variant = 'viewport', className = '' }: AmbientBackgroundProps) {
  const { themePreset } = useTheme();
  const mode = PRESET_MODE[themePreset];
  const positionClass = variant === 'viewport' ? 'fixed' : 'absolute';

  return (
    <div
      aria-hidden="true"
      className={`${positionClass} inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {mode === 'aurora' && <AuroraLayer />}
      {mode === 'grid' && <GridLayer />}
      {mode === 'paper' && <PaperLayer />}
    </div>
  );
}

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const GRAIN_SVG_DENSE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/** 01 — Aurora: manchas de cor animadas + grain fino. Usado em Dark e Light. */
function AuroraLayer() {
  const blobs = [
    { top: '-6%', left: '-8%', size: 640, hue: 'a', duration: 26, reverse: false },
    { top: '6%', left: '78%', size: 480, hue: 'c', duration: 32, reverse: false },
    { top: '32%', left: '6%', size: 420, hue: 'd', duration: 24, reverse: false },
    { top: '54%', left: '70%', size: 520, hue: 'b', duration: 30, reverse: true },
    { top: '78%', left: '-6%', size: 400, hue: 'c', duration: 22, reverse: true },
    { top: '92%', left: '55%', size: 460, hue: 'a', duration: 28, reverse: true },
  ];

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, hsl(var(--gradient-a) / 0.14), transparent 60%)',
        }}
      />
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full ambient-motion"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `hsl(var(--gradient-${b.hue}) / 0.22)`,
            filter: 'blur(70px)',
            animation: `ambient-drift ${b.duration}s ease-in-out infinite ${b.reverse ? 'reverse' : 'normal'}`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: '140px 140px' }}
      />
    </>
  );
}

/** 02 — Grid técnico: grade estruturada + halos pontuais. Usado em Midnight. */
function GridLayer() {
  const glows = [
    { top: '-4%', left: '-4%', hue: 'a' },
    { top: '38%', left: '82%', hue: 'c' },
    { top: '74%', left: '4%', hue: 'd' },
  ];

  return (
    <>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, transparent, black 8%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%)',
        }}
      />
      {glows.map((g, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: g.top,
            left: g.left,
            width: 520,
            height: 520,
            background: `radial-gradient(circle, hsl(var(--gradient-${g.hue}) / 0.14), transparent 70%)`,
          }}
        />
      ))}
    </>
  );
}

/** 03 — Grain editorial: papel + linhas finas. Usado em Royal. */
function PaperLayer() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.11] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_SVG_DENSE, backgroundSize: '180px 180px' }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_260px_hsl(var(--foreground)/0.06)]" />
      {['18%', '46%', '74%'].map((top) => (
        <div key={top} className="absolute inset-x-6 border-t border-border-strong" style={{ top }} />
      ))}
    </>
  );
}
