/* 呼吸視覺 — 定案為柔光圈，另提供幾種變化供探索。
   純 CSS/SVG，4 秒一循環，吸氣慢、吐氣慢（克制）。 */
const { useEffect } = React;

const BREATH_CSS = `
@keyframes gift-breath {
  0%, 100% { opacity: .5; transform: scale(.86); }
  50%      { opacity: 1;  transform: scale(1.04); }
}
@keyframes gift-breath-soft {
  0%, 100% { opacity: .38; transform: scale(.92); }
  50%      { opacity: .85; transform: scale(1.0); }
}
@keyframes gift-ripple {
  0%   { opacity: .55; transform: scale(.35); }
  80%  { opacity: 0;   transform: scale(1.25); }
  100% { opacity: 0;   transform: scale(1.25); }
}
@keyframes gift-float {
  0%, 100% { transform: translateY(0) scale(1);   opacity: .5; }
  50%      { transform: translateY(-7px) scale(1.25); opacity: 1; }
}
@keyframes gift-drift {
  0%, 100% { transform: translate(0,0); }
  50%      { transform: translate(var(--dx), var(--dy)); }
}
.gift-breath-core { animation: gift-breath 5.4s ease-in-out infinite; will-change: opacity, transform; }
`;

function useBreathCss() {
  useEffect(() => {
    if (document.getElementById("gift-breath-css")) return;
    const el = document.createElement("style");
    el.id = "gift-breath-css";
    el.textContent = BREATH_CSS;
    document.head.appendChild(el);
  }, []);
}

// 中央柔光（共用）
function CoreGlow({ size, dim }) {
  return (
    <div
      className="gift-breath-core absolute inset-0 m-auto rounded-full"
      style={{
        width: size, height: size,
        background:
          "radial-gradient(circle at 50% 48%, #f7d9c0 0%, #ecc49f 30%, rgba(230,180,137,0.55) 52%, rgba(230,180,137,0) 72%)",
        filter: "blur(2px)",
        opacity: dim ? 0.8 : 1,
      }}
    />
  );
}

function BreathingVisual({ variant = "glow", size = 220, className }) {
  useBreathCss();
  const box = size * 1.7;

  return (
    <div className={cn("relative mx-auto", className)} style={{ width: box, height: box }}>
      {/* ambient halo, always present, very soft */}
      {variant !== "stars" && (
        <div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: box, height: box,
            background: "radial-gradient(circle, rgba(230,180,137,0.10) 0%, rgba(230,180,137,0) 62%)",
          }}
        />
      )}

      {variant === "glow" && <CoreGlow size={size} />}

      {variant === "rings" && (
        <>
          <CoreGlow size={size * 0.62} />
          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute inset-0 m-auto rounded-full"
              style={{
                width: size * (0.86 + i * 0.34),
                height: size * (0.86 + i * 0.34),
                border: "1px solid rgba(230,180,137,0.32)",
                animation: `gift-breath-soft ${6 + i * 1.2}s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {variant === "ripple" && (
        <>
          <CoreGlow size={size * 0.7} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 m-auto rounded-full"
              style={{
                width: size, height: size,
                border: "1.5px solid rgba(230,180,137,0.4)",
                animation: `gift-ripple 5.4s ease-out ${i * 1.8}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {variant === "stardust" && (
        <>
          <CoreGlow size={size * 0.78} dim />
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.r, height: s.r,
                background: "#f7d9c0",
                boxShadow: "0 0 6px 1px rgba(247,217,192,0.7)",
                animation: `gift-float ${s.d}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {variant === "stars" && (
        <>
          {HOME_STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.r, height: s.r,
                background: "#f7d9c0",
                opacity: 0.45 + (i % 3) * 0.2,
                boxShadow: "0 0 5px 1px rgba(247,217,192,0.65)",
                animation: `gift-float ${s.d}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

const STARS = [
  { x: 24, y: 30, r: 3, d: 4.5, delay: 0 },
  { x: 70, y: 26, r: 2, d: 5.2, delay: 0.6 },
  { x: 80, y: 60, r: 3, d: 4.8, delay: 1.1 },
  { x: 30, y: 70, r: 2, d: 5.6, delay: 0.3 },
  { x: 52, y: 18, r: 2, d: 4.2, delay: 1.4 },
  { x: 18, y: 54, r: 2, d: 5.0, delay: 0.9 },
  { x: 64, y: 78, r: 2.5, d: 4.6, delay: 1.7 },
  { x: 46, y: 84, r: 2, d: 5.4, delay: 0.5 },
];

// 首頁專用：有機散落、不受圓形拘束，與歡迎頁完全不同
const HOME_STARS = [
  { x: 88, y: 8,  r: 1.5, d: 5.8, delay: 0.0 },
  { x: 62, y: 14, r: 3,   d: 4.4, delay: 0.7 },
  { x: 97, y: 26, r: 2,   d: 5.2, delay: 1.3 },
  { x: 74, y: 33, r: 1.5, d: 6.0, delay: 0.4 },
  { x: 44, y: 22, r: 2.5, d: 4.8, delay: 1.6 },
  { x: 90, y: 48, r: 2.5, d: 5.5, delay: 0.2 },
  { x: 55, y: 47, r: 1.5, d: 6.2, delay: 1.0 },
  { x: 80, y: 64, r: 2,   d: 4.6, delay: 1.9 },
  { x: 33, y: 40, r: 1.5, d: 5.6, delay: 0.6 },
  { x: 99, y: 70, r: 1.5, d: 5.0, delay: 1.4 },
  { x: 68, y: 80, r: 2,   d: 5.9, delay: 0.9 },
  { x: 50, y: 67, r: 1.5, d: 4.3, delay: 2.1 },
];

window.BreathingVisual = BreathingVisual;
