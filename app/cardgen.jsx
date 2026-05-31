/* 分享圖卡 — <canvas> 即時生成可下載 PNG，中文自動換行。
   提供三種風格：暖光漸層 / 極簡留白 / 光圈居中。 */
const { useEffect, useRef } = React;

const CARD_W = 1080, CARD_H = 1350;

// CJK 換行：逐字測寬，避免行首標點
const NO_LEAD = "，。、！？：；」』）】"; 
function wrapCJK(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const ch of [...text]) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      if (NO_LEAD.includes(ch)) { line = test; } // 標點不另起一行
      else { lines.push(line); line = ch; }
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawGiftCard(canvas, { word, source, style }) {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, CARD_W, CARD_H);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // 背景
  ctx.fillStyle = "#15140f";
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const cx = CARD_W / 2;

  if (style === "warm") {
    const g = ctx.createRadialGradient(cx, 430, 40, cx, 430, 720);
    g.addColorStop(0, "rgba(247,217,192,0.42)");
    g.addColorStop(0.4, "rgba(230,180,137,0.18)");
    g.addColorStop(1, "rgba(230,180,137,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  } else if (style === "halo") {
    const g = ctx.createRadialGradient(cx, CARD_H / 2 - 40, 30, cx, CARD_H / 2 - 40, 520);
    g.addColorStop(0, "rgba(247,217,192,0.5)");
    g.addColorStop(0.45, "rgba(230,180,137,0.16)");
    g.addColorStop(1, "rgba(230,180,137,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.strokeStyle = "rgba(230,180,137,0.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, CARD_H / 2 - 40, 360, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 話語
  const maxW = CARD_W - 280;
  ctx.font = "600 66px 'Noto Serif TC', serif";
  const lines = wrapCJK(ctx, word, maxW);
  const lh = 104;
  const blockH = lines.length * lh;
  let cy;
  if (style === "minimal") cy = CARD_H / 2 - blockH / 2 - 10;
  else if (style === "halo") cy = CARD_H / 2 - 40 - blockH / 2 + lh * 0.7;
  else cy = 430 - blockH / 2 + lh * 0.72;

  // minimal 上方細線
  if (style === "minimal") {
    ctx.strokeStyle = "rgba(230,180,137,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 36, cy - lh); ctx.lineTo(cx + 36, cy - lh);
    ctx.stroke();
  }

  ctx.fillStyle = "#f4ede1";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 18;
  lines.forEach((ln, i) => ctx.fillText(ln, cx, cy + i * lh));
  ctx.shadowBlur = 0;

  // 出處
  if (source) {
    ctx.font = "400 30px 'Noto Sans TC', sans-serif";
    ctx.fillStyle = "rgba(154,143,128,0.95)";
    ctx.fillText("— " + source, cx, cy + lines.length * lh + 18);
  }

  // 品牌標記
  ctx.font = "500 30px 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "rgba(230,180,137,0.92)";
  // 小光點
  const by = CARD_H - 96;
  ctx.beginPath();
  const dotGrad = ctx.createRadialGradient(cx, by - 56, 0, cx, by - 56, 22);
  dotGrad.addColorStop(0, "#f7d9c0");
  dotGrad.addColorStop(1, "rgba(230,180,137,0)");
  ctx.fillStyle = dotGrad;
  ctx.arc(cx, by - 56, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(230,180,137,0.92)";
  ctx.font = "500 30px 'Noto Sans TC', sans-serif";
  ctx.fillText("幸福的禮物", cx, by);
  ctx.font = "400 22px 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "rgba(154,143,128,0.8)";
  ctx.fillText("先被照顧，再把溫柔傳下去", cx, by + 38);
}

async function ensureCardFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load("600 66px 'Noto Serif TC'"),
      document.fonts.load("500 30px 'Noto Sans TC'"),
      document.fonts.load("400 30px 'Noto Sans TC'"),
    ]);
    await document.fonts.ready;
  } catch (e) {}
}

// 預覽 + 下載元件
function ShareCard({ word, source, style, canvasRef, className }) {
  const fallback = useRef(null);
  const innerRef = canvasRef || fallback;
  useEffect(() => {
    let alive = true;
    (async () => {
      await ensureCardFonts();
      if (!alive || !innerRef.current) return;
      drawGiftCard(innerRef.current, { word, source, style });
    })();
    return () => { alive = false; };
  }, [word, source, style]);

  return (
    <canvas
      ref={innerRef}
      className={cn("block w-full rounded-[18px] border border-border/60 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]", className)}
      style={{ aspectRatio: "1080 / 1350" }}
    />
  );
}

async function downloadCard(canvas, name = "幸福的禮物.png") {
  if (!canvas) return;
  const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

Object.assign(window, { ShareCard, drawGiftCard, downloadCard, ensureCardFonts });
