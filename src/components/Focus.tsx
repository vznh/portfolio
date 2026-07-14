// components/Focus.tsx
import Image from 'next/image';
import React from 'react';

const isVideo = (src: string) => /\.(mp4|mov|webm)$/i.test(src);

// Progressive blur — banded stack inspired by ProgressiveBlurHeader (variable
// blur). Each layer applies a single blur radius confined to a soft trapezoidal
// band; bands tile from strongest-at-edge to weakest-at-content. A subtle bg
// tint at the outermost edge dissolves the strongest blur into the dialog bg.
// Strongest first (closest to outer edge), weakest last (closest to content).
const BLURS = [40, 24, 14, 8, 4.5, 2.5, 1.25, 0.5];

const ProgressiveBlur: React.FC<{ position: 'top' | 'bottom' }> = ({ position }) => {
  const n = BLURS.length;
  const step = 100 / n;
  const dir = position === 'top' ? 'to bottom' : 'to top';
  const tintDir = position === 'top' ? 'to top' : 'to bottom';
  const posClass = position === 'top' ? '-top-px' : '-bottom-px';
  return (
    <div className={`md:hidden pointer-events-none absolute inset-x-0 h-10 z-10 ${posClass}`}>
      {BLURS.map((blur, i) => {
        const a = Math.max(0, (i - 1) * step);
        const b = i * step;
        const c = (i + 1) * step;
        const d = Math.min(100, (i + 2) * step);
        const mask = `linear-gradient(${dir}, black ${a}%, black ${b}%, black ${c}%, transparent ${d}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              WebkitMaskImage: mask,
              maskImage: mask,
            }}
          />
        );
      })}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${tintDir}, rgba(255,255,255,0) 55%, rgba(255,255,255,0.65) 85%, rgba(255,255,255,1) 100%)`,
        }}
      />
    </div>
  );
};

const LoopingVideo: React.FC<{ src: string; width?: number; height?: number; className?: string }> = ({ src, width, height, className }) => {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = React.useState(1);
  const FADE_MS = 350;

  const onTimeUpdate = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    if (v.duration - v.currentTime <= FADE_MS / 1000) setOpacity(0);
  };

  const onEnded = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    requestAnimationFrame(() => setOpacity(1));
  };

  return (
    <video
      ref={ref}
      src={src}
      width={width}
      height={height}
      autoPlay
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      className={`w-auto ${className ?? ''}`}
      style={{ opacity, transition: `opacity ${FADE_MS}ms ease-in-out`, ...(height ? { height } : {}), ...(width ? { width } : {}) }}
    />
  );
};

interface FocusProps {
  visible: boolean;
  date?: string; // Jun 2024 - Aug 2024
  role?: string; // Software Engineer (focus role)
  images?: string[];
  desc?: string; // long desc
}

const Focus: React.FC<FocusProps> = ({ visible, date, role, images, desc }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 2;
    setCanScrollUp(el.scrollTop > threshold);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - threshold);
  }, []);

  React.useEffect(() => {
    if (!visible) return;
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [visible, images, updateScrollState]);

  const renderImages = () => {
    if (!images || images.length === 0) return null;
    const H = 112;
    return (
      <div className="relative w-full md:w-[640px]">
        {canScrollUp && <ProgressiveBlur position="top" />}
        {canScrollDown && <ProgressiveBlur position="bottom" />}
      <div ref={scrollRef} className="flex flex-col md:flex-row md:flex-wrap gap-2 md:justify-between items-center w-full max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible py-12 md:py-0">
        {images.map((src) => {
          const h = /Footer/i.test(src) ? Math.round(H * 0.85) : H;
          const heightClass = /Footer/i.test(src) ? 'h-[190px] md:h-[95px]' : 'h-[224px] md:h-[112px]';
          if (isVideo(src)) return <LoopingVideo key={src} src={src} className={heightClass} />;
          const img = (
            <Image
              key={src}
              src={src}
              alt=""
              width={200}
              height={h}
              className={`w-auto object-contain ${heightClass}`}
            />
          );
          const linkMap: Record<string, string> = {
            Kim: 'https://davidkimjs.space',
            Coinvest: 'https://liquid.trade',
          };
          const matchedHref = Object.entries(linkMap).find(([k]) => new RegExp(k, 'i').test(src))?.[1];
          if (matchedHref) {
            return (
              <a key={src} href={matchedHref} target="_blank" rel="noopener noreferrer">
                {img}
              </a>
            );
          }
          return img;
        })}
        </div>
      </div>
    );
  };

  const hasImages = !!images && images.length > 0;

  return (
    <div
      className={`absolute top-1/2 left-1/2 bg-white border-black border-opacity-20 border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out z-50 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      style={{
        minWidth: '240px',
        maxWidth: hasImages ? 'min(720px, calc(100vw - 32px))' : '320px',
        width: 'max-content',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col text-black text-xs font-medium p-4 gap-y-3">
        {(date || role) && (
          <div className="flex flex-row justify-between gap-x-4">
            {date && <span className="text-xs font-jb opacity-50">{date}</span>}
            {role && <span className="text-xs font-jb text-right opacity-50">{role}</span>}
          </div>
        )}

        {hasImages && (
          <div className="flex">
            {renderImages()}
          </div>
        )}

        <div className="text-xs font-jb whitespace-pre-line">
          {desc || 'No description available.'}
        </div>
      </div>
    </div>
  );
};

export default Focus;
