import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// ─── Constants ──────────────────────────────────────────────────
export const DEFAULT_PARTICLE_COUNT  = 12;
export const DEFAULT_SPOTLIGHT_RADIUS = 300;
export const DEFAULT_GLOW_COLOR      = '102, 115, 255';
const MOBILE_BREAKPOINT = 768;

// ─── Helpers ────────────────────────────────────────────────────
const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'mb-particle';
  el.style.cssText = `
    position:absolute; width:4px; height:4px; border-radius:50%;
    background:rgba(${color},1); box-shadow:0 0 6px rgba(${color},0.6);
    pointer-events:none; z-index:100; left:${x}px; top:${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity:    radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlow = (card, mouseX, mouseY, intensity, radius) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x',         `${((mouseX - rect.left) / rect.width)  * 100}%`);
  card.style.setProperty('--glow-y',         `${((mouseY - rect.top)  / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', intensity.toString());
  card.style.setProperty('--glow-radius',    `${radius}px`);
};

// ─── useMobileDetection hook ────────────────────────────────────
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// ─── ParticleCard (named export) ────────────────────────────────
export const ParticleCard = ({
  children,
  className     = '',
  style,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor     = DEFAULT_GLOW_COLOR,
  enableTilt    = false,
  clickEffect   = true,
  enableMagnetism = false,
  innerGlow     = true,
}) => {
  const cardRef   = useRef(null);
  const partRef   = useRef([]);
  const timerRef  = useRef([]);
  const hovRef    = useRef(false);
  const memoRef   = useRef([]);
  const initRef   = useRef(false);
  const magRef    = useRef(null);

  const initParticles = useCallback(() => {
    if (initRef.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoRef.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    initRef.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    magRef.current?.kill();
    partRef.current.forEach(p =>
      gsap.to(p, { scale:0, opacity:0, duration:0.3, ease:'back.in(1.7)',
        onComplete: () => p.parentNode?.removeChild(p) })
    );
    partRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    if (!cardRef.current || !hovRef.current) return;
    if (!initRef.current) initParticles();
    memoRef.current.forEach((p, i) => {
      const id = setTimeout(() => {
        if (!hovRef.current || !cardRef.current) return;
        const clone = p.cloneNode(true);
        cardRef.current.appendChild(clone);
        partRef.current.push(clone);
        gsap.fromTo(clone, { scale:0, opacity:0 }, { scale:1, opacity:1, duration:0.3, ease:'back.out(1.7)' });
        gsap.to(clone, { x:(Math.random()-.5)*100, y:(Math.random()-.5)*100,
          rotation:Math.random()*360, duration:2+Math.random()*2, ease:'none', repeat:-1, yoyo:true });
        gsap.to(clone, { opacity:0.3, duration:1.5, ease:'power2.inOut', repeat:-1, yoyo:true });
      }, i * 100);
      timerRef.current.push(id);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const onEnter = () => {
      hovRef.current = true;
      spawnParticles();
      if (enableTilt) gsap.to(el, { rotateX:5, rotateY:5, duration:0.3, ease:'power2.out', transformPerspective:1000 });
    };

    const onLeave = () => {
      hovRef.current = false;
      clearParticles();
      el.style.setProperty('--glow-intensity', '0');
      if (enableTilt)     gsap.to(el, { rotateX:0, rotateY:0, duration:0.3, ease:'power2.out' });
      if (enableMagnetism) gsap.to(el, { x:0, y:0, duration:0.3, ease:'power2.out' });
    };

    const onMove = e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2,       cy = rect.height / 2;
      el.style.setProperty('--glow-x', `${(x / rect.width)  * 100}%`);
      el.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
      el.style.setProperty('--glow-intensity', '1');
      if (enableTilt)
        gsap.to(el, { rotateX:((y-cy)/cy)*-10, rotateY:((x-cx)/cx)*10,
          duration:0.1, ease:'power2.out', transformPerspective:1000 });
      if (enableMagnetism)
        magRef.current = gsap.to(el, { x:(x-cx)*0.05, y:(y-cy)*0.05, duration:0.3, ease:'power2.out' });
    };

    const onClick = e => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const d = Math.max(Math.hypot(x,y), Math.hypot(x-rect.width,y),
        Math.hypot(x,y-rect.height), Math.hypot(x-rect.width,y-rect.height));
      const rip = document.createElement('div');
      rip.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;z-index:1000;
        width:${d*2}px;height:${d*2}px;left:${x-d}px;top:${y-d}px;
        background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);`;
      el.appendChild(rip);
      gsap.fromTo(rip, { scale:0, opacity:1 },
        { scale:1, opacity:0, duration:0.8, ease:'power2.out', onComplete:() => rip.remove() });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove',  onMove);
    el.addEventListener('click',      onClick);
    return () => {
      hovRef.current = false;
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('click',      onClick);
      clearParticles();
    };
  }, [spawnParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`mb-pc ${className}`}
      style={{
        '--glow-x': '50%', '--glow-y': '50%',
        '--glow-intensity': '0', '--glow-radius': '260px',
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
    >
      {innerGlow && (
        <div style={{
          position:'absolute', inset:0, borderRadius:'inherit', pointerEvents:'none', zIndex:0,
          background:'radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(102,115,255,calc(var(--glow-intensity)*0.07)) 0%,transparent 70%)',
        }} />
      )}
      {/* ensure content sits above inner glow */}
      <div style={{ position:'relative', zIndex:1, display:'contents' }}>{children}</div>
    </div>
  );
};

// ─── GlobalSpotlight (named export) ─────────────────────────────
export const GlobalSpotlight = ({
  containerRef,
  /* legacy alias kept for backward compat */
  gridRef,
  disableAnimations = false,
  enabled           = true,
  spotlightRadius   = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor         = DEFAULT_GLOW_COLOR,
}) => {
  const ref = containerRef ?? gridRef;

  useEffect(() => {
    if (disableAnimations || !ref?.current || !enabled) return;

    const spot = document.createElement('div');
    spot.style.cssText = `
      position:fixed; width:800px; height:800px; border-radius:50%;
      pointer-events:none; z-index:200; opacity:0;
      transform:translate(-50%,-50%); mix-blend-mode:screen;
      background:radial-gradient(circle,
        rgba(${glowColor},0.15) 0%, rgba(${glowColor},0.08) 15%,
        rgba(${glowColor},0.04) 25%, rgba(${glowColor},0.02) 40%,
        rgba(${glowColor},0.01) 65%, transparent 70%);
    `;
    document.body.appendChild(spot);

    const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);

    // support both .mb-pc (new) and .card (legacy) selectors
    const getCards = () => ref.current?.querySelectorAll('.mb-pc, .card') ?? [];

    const onMove = e => {
      if (!ref.current) return;

      // detect if mouse is inside the container
      const container = ref.current.closest?.('.mb-section') ?? ref.current;
      const rect = container.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top  && e.clientY <= rect.bottom;

      const cards = getCards();
      if (!inside) {
        gsap.to(spot, { opacity:0, duration:0.3 });
        cards.forEach(c => c.style.setProperty('--glow-intensity','0'));
        return;
      }

      let minDist = Infinity;
      cards.forEach(card => {
        const cr   = card.getBoundingClientRect();
        const cx   = cr.left + cr.width  / 2;
        const cy   = cr.top  + cr.height / 2;
        const dist = Math.max(0, Math.hypot(e.clientX-cx, e.clientY-cy) - Math.max(cr.width,cr.height)/2);
        minDist = Math.min(minDist, dist);
        const intensity = dist <= proximity ? 1
          : dist <= fadeDistance ? (fadeDistance-dist)/(fadeDistance-proximity) : 0;
        updateCardGlow(card, e.clientX, e.clientY, intensity, spotlightRadius);
      });

      gsap.to(spot, { left:e.clientX, top:e.clientY, duration:0.1, ease:'power2.out' });
      const tOp = minDist <= proximity ? 0.8
        : minDist <= fadeDistance ? ((fadeDistance-minDist)/(fadeDistance-proximity))*0.8 : 0;
      gsap.to(spot, { opacity:tOp, duration: tOp>0 ? 0.2 : 0.5 });
    };

    const onLeave = () => {
      getCards().forEach(c => c.style.setProperty('--glow-intensity','0'));
      gsap.to(spot, { opacity:0, duration:0.3 });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spot.parentNode?.removeChild(spot);
    };
  }, [ref, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

// ─── Standalone bento card data ─────────────────────────────────
const cardData = [
  { title:'BCC Tracking',  description:'Auto-capture every reply silently via BCC',   label:'Capture'  },
  { title:'Outlook Sync',  description:'Real-time inbox sync across all accounts',    label:'Sync'     },
  { title:'Engagement',    description:'Opens, clicks and downloads — all tracked',   label:'Insights' },
  { title:'Compose',       description:'Send to any client in one click',             label:'Send'     },
  { title:'Notifications', description:'Smart alerts for every client interaction',   label:'Alerts'   },
  { title:'Reports',       description:'Export client analytics and activity logs',   label:'Export'   },
];

// ─── MagicBento (default export) ────────────────────────────────
const MagicBento = ({
  textAutoHide      = true,
  enableStars       = true,
  enableSpotlight   = true,
  enableBorderGlow  = true,
  disableAnimations = false,
  spotlightRadius   = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount     = DEFAULT_PARTICLE_COUNT,
  enableTilt        = false,
  glowColor         = DEFAULT_GLOW_COLOR,
  clickEffect       = true,
  enableMagnetism   = false,
}) => {
  const gridRef  = useRef(null);
  const isMobile = useMobileDetection();
  const noAnim   = disableAnimations || isMobile;

  return (
    <>
      <style>{`
        /* ── container ── */
        .mb-section {
          width:100%; padding:0; gap:8px; margin:0;
          --glow-color: ${glowColor};
        }
        .mb-grid {
          display:grid; gap:8px; width:100%;
          grid-template-columns: 1fr;
        }
        @media(min-width:600px)  { .mb-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px) {
          .mb-grid { grid-template-columns:repeat(4,1fr); }
          .mb-grid .mb-pc:nth-child(3) { grid-column:span 2; grid-row:span 2; }
          .mb-grid .mb-pc:nth-child(4) { grid-column:1/span 2; grid-row:2/span 2; }
          .mb-grid .mb-pc:nth-child(6) { grid-column:4; grid-row:3; }
        }

        /* ── base card (dark default) ── */
        .mb-card-inner {
          min-height:160px; border-radius:16px;
          border:1px solid rgba(102,115,255,0.15);
          background:#06061a;
          color:#fff;
          padding:18px;
          display:flex; flex-direction:column; justify-content:space-between;
          transition:transform .2s, box-shadow .2s;
          cursor:default;
          background-image:radial-gradient(ellipse at 20% 20%,rgba(102,115,255,0.06) 0%,transparent 60%);
        }
        .mb-card-inner:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 30px rgba(102,115,255,0.18),0 2px 8px rgba(0,0,0,0.3);
        }

        /* ── light mode overrides ── */
        [data-theme="light"] .mb-card-inner {
          background:#f4f3ff;
          border-color:rgba(102,115,255,0.2);
          color:#15136B;
          background-image:radial-gradient(ellipse at 20% 20%,rgba(102,115,255,0.04) 0%,transparent 60%);
        }
        [data-theme="light"] .mb-card-inner:hover {
          box-shadow:0 8px 24px rgba(102,115,255,0.12),0 2px 6px rgba(0,0,0,0.06);
        }

        /* ── border glow ── */
        .mb-border-glow::after {
          content:''; position:absolute; inset:0; border-radius:inherit; padding:6px;
          background:radial-gradient(
            var(--glow-radius,200px) circle at var(--glow-x,50%) var(--glow-y,50%),
            rgba(${glowColor},calc(var(--glow-intensity,0)*0.85)) 0%,
            rgba(${glowColor},calc(var(--glow-intensity,0)*0.4))  30%,
            transparent 60%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask-composite:exclude;
          pointer-events:none; z-index:2;
        }
        [data-theme="light"] .mb-border-glow::after {
          background:radial-gradient(
            var(--glow-radius,200px) circle at var(--glow-x,50%) var(--glow-y,50%),
            rgba(${glowColor},calc(var(--glow-intensity,0)*0.5))  0%,
            rgba(${glowColor},calc(var(--glow-intensity,0)*0.22)) 30%,
            transparent 60%);
        }

        /* ── label pill ── */
        .mb-label {
          font-size:.625rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em;
          color:rgba(102,115,255,0.9); background:rgba(102,115,255,0.12);
          border:1px solid rgba(102,115,255,0.2); border-radius:99px;
          padding:2px 8px; display:inline-block; width:fit-content;
        }
        [data-theme="light"] .mb-label { color:#2F2CCB; background:rgba(102,115,255,0.08); }

        /* ── text ── */
        .mb-title { font-size:1.0625rem; font-weight:700; margin:0 0 4px; letter-spacing:-.01em; line-height:1.2; }
        .mb-desc  { font-size:.75rem; line-height:1.5; color:rgba(255,255,255,0.55); margin:0; }
        [data-theme="light"] .mb-desc { color:rgba(47,44,203,0.5); }

        /* ── 3rd card larger text ── */
        .mb-grid .mb-pc:nth-child(3) .mb-title { font-size:1.375rem; }
        .mb-grid .mb-pc:nth-child(3) .mb-desc  { font-size:.8125rem; }

        /* ── clamp helpers ── */
        .tc1 { display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden; }
        .tc2 { display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden; }

        /* ── particle dot halo ── */
        .mb-particle::before {
          content:''; position:absolute; top:-2px;left:-2px;right:-2px;bottom:-2px;
          background:rgba(${glowColor},0.2); border-radius:50%; z-index:-1;
        }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          containerRef={gridRef}
          disableAnimations={noAnim}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="mb-section" ref={gridRef}>
        <div className="mb-grid">
          {cardData.map((card, i) => {
            const glowClass = enableBorderGlow ? 'mb-border-glow' : '';
            const cardStyle = { '--glow-x':'50%','--glow-y':'50%','--glow-intensity':'0','--glow-radius':'200px' };
            const content = (
              <div className={`mb-card-inner ${glowClass}`} style={{ height:'100%' }}>
                <div><span className="mb-label">{card.label}</span></div>
                <div>
                  <h3 className={`mb-title${textAutoHide?' tc1':''}`}>{card.title}</h3>
                  <p  className={`mb-desc${textAutoHide?' tc2':''}`}>{card.description}</p>
                </div>
              </div>
            );

            return enableStars ? (
              <ParticleCard key={i} style={cardStyle}
                disableAnimations={noAnim} particleCount={particleCount}
                glowColor={glowColor} enableTilt={enableTilt}
                clickEffect={clickEffect} enableMagnetism={enableMagnetism}
                innerGlow={false}>
                {content}
              </ParticleCard>
            ) : (
              <div key={i} className="mb-pc" style={cardStyle}>{content}</div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MagicBento;