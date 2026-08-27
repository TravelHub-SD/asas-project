/**
 * يولّد صورة الـ Open Graph (public/og.png) وأيقونة الموقع (app/icon.png).
 *
 * الاستخدام:
 *   npm run build          # لتنزيل خطوط Tajawal إلى ذاكرة next/font
 *   npm run og
 *
 * السبب في الاعتماد على مخرجات البناء: خط Tajawal يُنزَّل عبر next/font،
 * فنعيد استخدام نفس الملفات بدل تنزيلها مرة أخرى، ونضمّنها في الصفحة
 * كـ base64 لأن بيئة التوليد قد لا يكون فيها خط عربي مثبّت.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const MEDIA = path.join(ROOT, ".next", "static", "media");
const CSS_DIR = path.join(ROOT, ".next", "static", "css");

const BRAND_AR = "مُدَرِّسة خصوصية";
const HEADLINE = "نخبة من المعلمين والمعلمات المتميّزين لجميع المراحل";
const SUBLINE = "معلمات ومعلمون خصوصيون في جدة والرياض — حصص حضورية وأونلاين";
const CHIPS = ["تأسيس انترناشونال", "قدرات", "تحصيلي"];

/** علامة البراند — رسم مستقل، لا حرف من الاسم (تفاديًا لقراءة «ممدرسة»). */
const capPath =
  '<path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"/>' +
  '<path d="M6 10.8v4.4c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9v-4.4"/>' +
  '<path d="M21.5 8.5v5"/>';
const markSvg = (size, stroke) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${capPath}</svg>`;
const MARK_SVG = `<div class="badge">${markSvg(38, "#1d5449")}</div>`;
const MARK_SVG_LARGE = markSvg(300, "#ffffff");

/** يستخرج ملفات Tajawal الخاصة بالنطاق العربي من CSS المُولَّد. */
function arabicFontFiles() {
  if (!fs.existsSync(CSS_DIR)) {
    throw new Error("لم يُعثر على مخرجات البناء. شغّل `npm run build` أولًا.");
  }
  const css = fs
    .readdirSync(CSS_DIR)
    .filter((f) => f.endsWith(".css"))
    .map((f) => fs.readFileSync(path.join(CSS_DIR, f), "utf8"))
    .join("\n");

  const faces = new Map();
  for (const block of css.split("@font-face")) {
    if (!block.includes("Tajawal") || !block.includes("u+06??")) continue;
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
    const file = block.match(/media\/([^)"']+\.woff2)/)?.[1];
    if (weight && file) faces.set(Number(weight), file);
  }
  if (faces.size === 0) throw new Error("لم يُعثر على خطوط Tajawal العربية في مخرجات البناء.");
  return faces;
}

function fontFaceCss(faces) {
  return [...faces.entries()]
    .map(([weight, file]) => {
      const data = fs.readFileSync(path.join(MEDIA, file)).toString("base64");
      return `@font-face{font-family:Tajawal;font-weight:${weight};src:url(data:font/woff2;base64,${data}) format("woff2")}`;
    })
    .join("\n");
}

function findChromium() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
    ...fs
      .readdirSync("/opt/pw-browsers", { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith("chromium"))
      .map((d) => path.join("/opt/pw-browsers", d.name, "chrome-linux", "headless_shell"))
      .concat(
        fs
          .readdirSync("/opt/pw-browsers", { withFileTypes: true })
          .filter((d) => d.isDirectory() && d.name.startsWith("chromium"))
          .map((d) => path.join("/opt/pw-browsers", d.name, "chrome-linux", "chrome"))
      ),
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error("لم يُعثر على متصفح Chromium. حدّد المسار في متغيّر CHROMIUM_PATH.");
}

function shoot(chromium, html, out, width, height) {
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "asas-og-")), "page.html");
  fs.writeFileSync(tmp, html);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync(
    chromium,
    [
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      `file://${tmp}`,
    ],
    { stdio: "ignore" }
  );
  console.log(`✓ ${path.relative(ROOT, out)} (${width}×${height})`);
}

const fonts = fontFaceCss(arabicFontFiles());
const chromium = findChromium();

const ogHtml = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
${fonts}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{font-family:Tajawal,sans-serif;color:#fff;display:flex;flex-direction:column;
  padding:60px 70px;position:relative;overflow:hidden;
  background:linear-gradient(135deg,#1d5449 0%,#236a5a 55%,#2f8570 100%)}
.glow{position:absolute;border-radius:50%;background:rgba(255,255,255,.06)}
.g1{width:460px;height:460px;top:-170px;right:-120px}
.g2{width:320px;height:320px;bottom:-150px;right:300px;background:rgba(201,138,31,.16)}
.mark{display:flex;align-items:center;gap:14px;position:relative}
.badge{width:62px;height:62px;border-radius:16px;background:#fff;color:#1d5449;
  font-size:34px;font-weight:800;display:flex;align-items:center;justify-content:center}
.name{font-size:42px;font-weight:800}
h1{position:relative;font-size:52px;font-weight:800;line-height:1.35;margin-top:38px;max-width:1010px}
p{position:relative;font-size:26px;font-weight:400;margin-top:22px;color:#d3ebe4}
.row{position:relative;margin-top:auto;display:flex;align-items:center;gap:14px}
.chip{border:2px solid rgba(255,255,255,.35);border-radius:999px;padding:9px 22px;
  font-size:21px;font-weight:700;white-space:nowrap}
.chip.solid{background:#c98a1f;border-color:#c98a1f}
</style></head><body>
<div class="glow g1"></div><div class="glow g2"></div>
<div class="mark">${MARK_SVG}<div class="name">${BRAND_AR}</div></div>
<h1>${HEADLINE}</h1>
<p>${SUBLINE}</p>
<div class="row">${CHIPS.map((c, i) => `<div class="chip${i === 0 ? " solid" : ""}">${c}</div>`).join("")}</div>
</body></html>`;

const iconHtml = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
${fonts}
*{margin:0;padding:0}
html,body{width:512px;height:512px}
body{font-family:Tajawal,sans-serif;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#1d5449 0%,#2f8570 100%);color:#fff;
  font-size:340px;font-weight:800;line-height:1}
span{transform:translateY(60px)}
</style></head><body><span>${MARK_SVG_LARGE}</span></body></html>`;

shoot(chromium, ogHtml, path.join(ROOT, "public", "og.png"), 1200, 630);
shoot(chromium, iconHtml, path.join(ROOT, "app", "icon.png"), 512, 512);
