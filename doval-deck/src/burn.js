/* The finale: the closing sheet burns away (WebGL) and the closing poster shows through.
   Exposes window.DovalBurn. Drawn at 1600 x 900 stage pixels. */
(function () {
'use strict';
const W = 1600, H = 900;

/* ---------- deterministic noise ---------- */
function makeNoise(seed) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  const perm = new Uint8Array(512); for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + (b - a) * t;
  const grad = (h, x, y) => ((h & 1) ? x : -x) + ((h & 2) ? y : -y);
  const noise = (x, y) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y), a = perm[X] + Y, b = perm[X + 1] + Y;
    return lerp(lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u), lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u), v);
  };
  return { rnd, fbm: (x, y, oct) => { let f = 0, amp = .5, fr = 1; for (let i = 0; i < (oct || 5); i++) { f += amp * noise(x * fr, y * fr); fr *= 2; amp *= .5; } return f; } };
}

/* ---------- burn map: when each point of the page catches fire (0..1) ---------- */
const BW = 320, BH = 180;
function burnMap() {
  const N = makeNoise(1945), out = new Float32Array(BW * BH);
  const ign = [{ x: .04, y: .98, d: 0 }, { x: .97, y: .95, d: .07 }, { x: .58, y: 1.04, d: .2 }, { x: 1.03, y: .35, d: .34 }];
  let lo = 1e9, hi = -1e9;
  for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) {
    const u = i / (BW - 1), v = j / (BH - 1);
    let m = 1e9; for (const p of ign) m = Math.min(m, Math.hypot((u - p.x) * 1.78, v - p.y) + p.d);
    const val = m + N.fbm(u * 3.5, v * 3.5, 5) * .34 + N.fbm(u * 16, v * 16, 3) * .06;
    out[j * BW + i] = val; lo = Math.min(lo, val); hi = Math.max(hi, val);
  }
  for (let k = 0; k < out.length; k++) out[k] = (out[k] - lo) / (hi - lo);
  return out;
}
const sampleMap = (map, u, v) => { const i = Math.min(BW - 1, Math.max(0, Math.round(u * (BW - 1)))), j = Math.min(BH - 1, Math.max(0, Math.round(v * (BH - 1)))); return map[j * BW + i]; };

/* ---------- textures drawn in 2D ---------- */
function paperTexture(fonts) {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1152;
  const x = c.getContext('2d'); const k = c.width / W; x.scale(k, k);
  const N = makeNoise(15);
  x.fillStyle = '#efe6d2'; x.fillRect(0, 0, W, H);
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n * .9; }
  x.putImageData(id, 0, 0);
  x.globalAlpha = .07; x.strokeStyle = '#6b5a3e'; x.lineWidth = .7;
  for (let i = 0; i < 1600; i++) { const px = N.rnd() * W, py = N.rnd() * H, a = N.rnd() * 6.28, l = 6 + N.rnd() * 22; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + .5) * l / 2, py + Math.sin(a + .5) * l / 2, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  x.globalAlpha = 1;
  const vg = x.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 950); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,60,25,.32)'); x.fillStyle = vg; x.fillRect(0, 0, W, H);
  x.beginPath(); x.arc(1290, 250, 92, 0, 6.283); x.lineWidth = 9; x.strokeStyle = 'rgba(120,80,30,.12)'; x.stroke();
  // typed content
  x.fillStyle = '#4d463b'; x.font = `400 22px ${fonts.type}`; x.textBaseline = 'alphabetic';
  x.fillText('CASE FILE AD/1945', 140, 112); x.fillText('SHEET 15', 720, 112); x.fillText('PART III', 1340, 112);
  x.fillStyle = 'rgba(43,38,31,.6)'; x.fillRect(140, 128, 1320, 2);
  x.fillStyle = '#3d372e'; x.font = `400 24px ${fonts.type}`; x.fillText('Subject: A. K. Doval · closing', 140, 176);
  x.fillStyle = '#1b1813'; x.font = `400 150px ${fonts.type}`; x.fillText('THANK YOU.', 132, 350);
  const lines = ['From a village in Garhwal to India’s top security post.', 'He won many battles with conversations, not guns.', 'Calm, courage and keeping your word: lessons for all of us.'];
  lines.forEach((l, i) => { x.fillStyle = '#1d2a6b'; x.font = `700 44px ${fonts.hand}`; x.fillText('✓', 140, 452 + i * 64); x.fillStyle = '#221d16'; x.font = `400 30px ${fonts.type}`; x.fillText(l, 196, 446 + i * 64); });
  x.save(); x.translate(150, 760); x.rotate(-.05); x.fillStyle = '#b3171d'; x.font = `700 92px ${fonts.hand}`; x.fillText('Questions?', 0, 0); x.restore();
  const stamp = (txt, cx, cy, rot, size, w, h) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.globalAlpha = .78; x.strokeStyle = '#b3171d'; x.lineWidth = 6; x.strokeRect(-w / 2, -h / 2, w, h); x.lineWidth = 2; x.strokeRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18); x.fillStyle = '#b3171d'; x.font = `400 ${size}px ${fonts.type}`; x.textAlign = 'center'; x.fillText(txt, 0, size * .34); x.restore(); };
  stamp('CONFIDENTIAL', 1300, 200, .12, 34, 330, 72);
  stamp('CASE CLOSED', 1120, 690, -.17, 66, 560, 130);
  return c;
}

function gradeImage(img, w, h, focusY) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  const r = Math.max(w / img.width, h / img.height), dw = img.width * r, dh = img.height * r;
  x.drawImage(img, (w - dw) / 2, (h - dh) * (focusY || .2), dw, dh);
  const id = x.getImageData(0, 0, w, h), d = id.data;
  const s = v => { v = v / 255; v = v < .5 ? 2 * v * v : 1 - 2 * (1 - v) * (1 - v); return v; };
  for (let i = 0; i < d.length; i += 4) {
    let g = s((.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]) * 1.05);
    g = Math.min(1, Math.max(0, (g - .06) * 1.12));
    const sh = [10, 6, 6], md = [128, 26, 22], hi = [246, 234, 214];
    const t = g < .5 ? g * 2 : (g - .5) * 2, a = g < .5 ? sh : md, b = g < .5 ? md : hi;
    d[i] = a[0] + (b[0] - a[0]) * t; d[i + 1] = a[1] + (b[1] - a[1]) * t; d[i + 2] = a[2] + (b[2] - a[2]) * t;
  }
  x.putImageData(id, 0, 0);
  return c;
}

function drawPoster(cv, img, fonts) {
  const pr = cv.width / W, x = cv.getContext('2d'); x.setTransform(pr, 0, 0, pr, 0, 0);
  const N = makeNoise(26);
  x.fillStyle = '#080505'; x.fillRect(0, 0, W, H);
  let g = x.createRadialGradient(380, 560, 0, 380, 560, 760); g.addColorStop(0, 'rgba(170,24,18,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  g = x.createRadialGradient(1250, 120, 0, 1250, 120, 700); g.addColorStop(0, 'rgba(120,70,40,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // smoke
  const sm = document.createElement('canvas'); sm.width = 320; sm.height = 180; const sx = sm.getContext('2d'), sd = sx.createImageData(320, 180);
  for (let j = 0; j < 180; j++) for (let i = 0; i < 320; i++) { const v = Math.max(0, N.fbm(i / 70, j / 70, 5) + .15) * 255; const k = (j * 320 + i) * 4; sd.data[k] = sd.data[k + 1] = sd.data[k + 2] = v; sd.data[k + 3] = 255; }
  sx.putImageData(sd, 0, 0); x.globalAlpha = .22; x.globalCompositeOperation = 'screen'; x.drawImage(sm, 0, 0, W, H); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
  // portrait, graded and faded into the dark
  if (img) {
    const pw = 760, ph = 1010, px = W - pw + 30, py = -60;
    const gi = gradeImage(img, pw, ph, .25);
    const m = document.createElement('canvas'); m.width = pw; m.height = ph; const mx = m.getContext('2d');
    mx.drawImage(gi, 0, 0);
    mx.globalCompositeOperation = 'destination-in';
    let mg = mx.createLinearGradient(0, 0, pw, 0); mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(.38, 'rgba(0,0,0,1)'); mx.fillStyle = mg; mx.fillRect(0, 0, pw, ph);
    mx.globalCompositeOperation = 'destination-in';
    mg = mx.createLinearGradient(0, 0, 0, ph); mg.addColorStop(.7, 'rgba(0,0,0,1)'); mg.addColorStop(1, 'rgba(0,0,0,0)'); mx.fillStyle = mg; mx.fillRect(0, 0, pw, ph);
    x.drawImage(m, px, py);
    const rim = x.createLinearGradient(px, 0, W, 0); rim.addColorStop(0, 'rgba(200,30,20,0)'); rim.addColorStop(.6, 'rgba(200,30,20,0)'); rim.addColorStop(1, 'rgba(200,30,20,.28)');
    x.globalCompositeOperation = 'screen'; x.fillStyle = rim; x.fillRect(px, 0, W - px, H); x.globalCompositeOperation = 'source-over';
  }
  // brush slash behind the title
  x.save(); x.globalAlpha = .9; x.fillStyle = '#9e1a17';
  for (let i = 0; i < 70; i++) { const t = i / 70, cx = 70 + t * 760, cy = 470 - t * 70 + (N.rnd() - .5) * 14, w = 30 + N.rnd() * 30, h = 70 + N.rnd() * 36; x.globalAlpha = .05 + N.rnd() * .09; x.beginPath(); x.ellipse(cx, cy, w, h / 2, -.09, 0, 6.283); x.fill(); }
  x.restore();
  // type
  x.textBaseline = 'alphabetic';
  x.fillStyle = '#c9bfae'; x.font = `400 22px ${fonts.type}`; spaced(x, 'CASE FILE AD/1945  ·  DECLASSIFIED', 92, 150, 4);
  x.fillStyle = '#f2e8d8'; x.font = `600 70px ${fonts.poster}`; spaced(x, "INDIA'S REAL", 88, 262, 6);
  x.save(); x.shadowColor = 'rgba(200,20,20,.55)'; x.shadowBlur = 40;
  const tg = x.createLinearGradient(0, 270, 0, 450); tg.addColorStop(0, '#fff7ea'); tg.addColorStop(1, '#d9c7aa'); x.fillStyle = tg; x.font = `700 196px ${fonts.poster}`; spaced(x, 'DHURANDHAR', 80, 448, 2);
  x.restore();
  x.save(); x.shadowColor = 'rgba(230,30,30,.6)'; x.shadowBlur = 30; x.fillStyle = '#d8262a'; x.font = `700 138px ${fonts.poster}`; x.fillText('धुरंधर', 92, 610); x.restore();
  x.fillStyle = '#f2e8d8'; x.font = `600 72px ${fonts.poster}`; spaced(x, 'AJIT DOVAL', 92, 716, 10);
  x.fillStyle = '#d7b26a'; x.font = `italic 500 36px ${fonts.title}`; x.fillText('The Quiet Guardian of India', 94, 764);
  x.fillStyle = '#e3d9c7'; x.font = `700 30px ${fonts.hand}`; x.fillText('Thank you  ·  Questions?', 94, 846);
  // distress: knock tiny holes out of everything, then grain and scratches
  x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 2600; i++) { x.globalAlpha = .25 + N.rnd() * .6; x.beginPath(); x.arc(N.rnd() * 900, 180 + N.rnd() * 700, N.rnd() * 1.6 + .3, 0, 6.283); x.fill(); }
  x.globalCompositeOperation = 'destination-over'; x.globalAlpha = 1; x.fillStyle = '#080505'; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'source-over';
  const gr = x.createImageData(cv.width, cv.height); for (let i = 0; i < gr.data.length; i += 4) { const v = Math.random() * 255; gr.data[i] = gr.data[i + 1] = gr.data[i + 2] = v; gr.data[i + 3] = 14; }
  const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height; tmp.getContext('2d').putImageData(gr, 0, 0);
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'overlay'; x.drawImage(tmp, 0, 0); x.globalCompositeOperation = 'source-over'; x.setTransform(pr, 0, 0, pr, 0, 0);
  x.strokeStyle = 'rgba(255,240,220,.05)'; for (let i = 0; i < 9; i++) { const sx2 = N.rnd() * W; x.lineWidth = .6 + N.rnd(); x.beginPath(); x.moveTo(sx2, 0); x.lineTo(sx2 + (N.rnd() - .5) * 30, H); x.stroke(); }
}
function spaced(x, t, px, py, sp) { let cx = px; for (const ch of t) { x.fillText(ch, cx, py); cx += x.measureText(ch).width + sp; } }

/* ---------- WebGL fire ---------- */
const VERT = `
uniform sampler2D uBurn; uniform float uT; varying vec2 vUv; varying float vLift;
void main(){
  vUv = uv; vec3 p = position;
  float b = texture2D(uBurn, uv).r; float d = b - uT;
  float e = 1.0 / 320.0;
  vec2 g = vec2(texture2D(uBurn, uv + vec2(e, 0.)).r - texture2D(uBurn, uv - vec2(e, 0.)).r, texture2D(uBurn, uv + vec2(0., e)).r - texture2D(uBurn, uv - vec2(0., e)).r);
  float lift = (d > 0.0) ? pow(clamp(1.0 - d / 0.075, 0.0, 1.0), 2.4) : 1.0;
  vec2 dir = length(g) > 1e-5 ? -normalize(g) : vec2(0.0);
  p.xy += dir * lift * 34.0;
  p.z += lift * (70.0 + 40.0 * sin(uv.x * 37.0 + uv.y * 23.0));
  vLift = lift;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const FRAG = `
uniform sampler2D uPaper; uniform sampler2D uBurn; uniform float uT; uniform float uTime; varying vec2 vUv; varying float vLift;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main(){
  float b = texture2D(uBurn, vUv).r + (n(vUv * 260.0) - 0.5) * 0.006;
  float d = b - uT;
  if (d < -0.016) discard;
  vec3 paper = texture2D(uPaper, vUv).rgb;
  float scorch = smoothstep(0.11, 0.0, d);
  vec3 col = mix(paper, paper * vec3(0.78, 0.52, 0.26), scorch * 0.9);
  col = mix(col, vec3(0.20, 0.10, 0.04), smoothstep(0.05, 0.012, d));
  col = mix(col, vec3(0.04, 0.03, 0.025), smoothstep(0.016, 0.004, d));
  float fl = 0.65 + 0.35 * n(vUv * 70.0 + vec2(uTime * 2.5, -uTime * 3.1));
  float ember = smoothstep(0.009, 0.0, abs(d + 0.004));
  vec3 hot = mix(vec3(1.0, 0.32, 0.04), vec3(1.0, 0.86, 0.45), ember * fl);
  col = mix(col, hot * 1.4, ember * fl);
  float sp = step(0.985, n(vUv * 420.0 + uTime * 0.3)) * smoothstep(0.012, -0.012, d) * fl;
  col += vec3(1.0, 0.45, 0.1) * sp;
  col *= 1.0 - vLift * 0.32;
  gl_FragColor = vec4(col, 1.0);
}`;
const PVERT = `
uniform float uNow, uStart, uDur, uPR; attribute vec2 aUv; attribute float aThr; attribute vec4 aR; attribute float aKind;
varying float vA; varying float vKind; varying float vR;
void main(){
  float age = uNow - (uStart + aThr * uDur);
  float life = aKind < 0.5 ? 2.4 + aR.x * 2.2 : (aKind < 1.5 ? 0.7 + aR.x * 1.5 : (aKind < 2.5 ? 3.2 + aR.x * 2.6 : 0.5 + aR.x * .4));
  if (age < 0.0 || age > life) { gl_Position = vec4(2., 2., 2., 1.); gl_PointSize = 0.; vA = 0.; vKind = aKind; vR = aR.z; return; }
  float k = age / life;
  vec3 p = vec3((aUv.x - 0.5) * 1600.0, (0.5 - aUv.y) * 900.0, 40.0);
  if (aKind < 0.5) { p.x += (aR.y - 0.5) * 90.0 * age + sin(age * 3.0 + aR.z * 6.28) * 20.0; p.y += 70.0 * age * (0.4 + aR.w) - 170.0 * age * age; p.z += 140.0 * age * aR.z; }
  else if (aKind < 1.5) { p.x += (aR.y - 0.5) * 130.0 * age + sin(age * 7.0 + aR.z * 10.0) * 22.0; p.y += (150.0 + aR.w * 230.0) * age; p.z += 220.0 * age; }
  else if (aKind < 2.5) { p.x += (aR.y - 0.5) * 70.0 * age + sin(age * .8 + aR.z * 6.0) * 46.0; p.y += (70.0 + aR.w * 80.0) * age; p.z += 90.0 * age; }
  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
  float size = aKind < 0.5 ? 3.0 + aR.w * 8.0 : (aKind < 1.5 ? 2.2 + aR.y * 4.0 : (aKind < 2.5 ? 70.0 + aR.w * 110.0 * (0.4 + k) : 90.0 + aR.w * 60.0));
  gl_PointSize = size * uPR * (1200.0 / -mv.z);
  vA = aKind < 0.5 ? (1.0 - k) : (aKind < 1.5 ? (1.0 - k) : (aKind < 2.5 ? sin(k * 3.14159) * 0.13 : sin(k * 3.14159) * 0.16));
  vKind = aKind; vR = aR.z;
}`;
const PFRAG = `
varying float vA; varying float vKind; varying float vR;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d = length(c); vec4 o;
  if (vKind < 0.5) { float a = step(abs(c.x) * (1.0 + vR) + abs(c.y), 0.48); o = vec4(mix(vec3(0.07, 0.06, 0.05), vec3(0.46, 0.43, 0.39), vR), a * vA); }
  else if (vKind < 1.5) { float a = smoothstep(0.5, 0.0, d); o = vec4(mix(vec3(1.0, 0.42, 0.06), vec3(1.0, 0.92, 0.6), a) * 1.4, a * vA); }
  else if (vKind < 2.5) { float a = smoothstep(0.5, 0.05, d); o = vec4(vec3(0.15, 0.14, 0.13), a * vA); }
  else { float a = smoothstep(0.5, 0.0, d); o = vec4(1.0, 0.45, 0.12, a * a * vA); }
  if (o.a < 0.004) discard; gl_FragColor = o;
}`;

let state = null;
function start(opts) {
  const T = window.THREE, root = opts.root;
  const fonts = opts.fonts, sfx = opts.sfx || {}, reduce = !!opts.reduce;
  const pr = Math.min(2, Math.max(1, (window.devicePixelRatio || 1) * (opts.scale || 1)));
  const poster = root.querySelector('#poster'), fire = root.querySelector('#fire');
  poster.width = Math.round(W * pr); poster.height = Math.round(H * pr);
  drawPoster(poster, opts.portrait, fonts);
  poster.classList.remove('lit');
  root.classList.remove('done');
  const st = { stop: false, phase: 'burn' };
  state = st;

  const finishBurn = () => {
    if (st.stop || st.phase !== 'burn') return;
    st.phase = 'done'; fire.style.opacity = 0;
    poster.classList.add('lit'); root.classList.add('done');
    if (sfx.reveal) sfx.reveal();
  };

  if (!T || reduce) { fire.style.opacity = 0; finishBurn(); return st; }
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas: fire, alpha: true, antialias: true, premultipliedAlpha: false }); }
  catch (e) { fire.style.opacity = 0; finishBurn(); return st; }
  fire.style.opacity = 1;
  renderer.setPixelRatio(pr); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(2 * Math.atan(450 / 1200) * 180 / Math.PI, W / H, 10, 6000); camera.position.set(0, 0, 1200);
  const map = burnMap(), bytes = new Uint8Array(BW * BH * 4);
  for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) { const v = Math.round(map[j * BW + i] * 255), o = ((BH - 1 - j) * BW + i) * 4; bytes[o] = bytes[o + 1] = bytes[o + 2] = v; bytes[o + 3] = 255; }
  const burnTex = new T.DataTexture(bytes, BW, BH, T.RGBAFormat); burnTex.magFilter = burnTex.minFilter = T.LinearFilter; burnTex.needsUpdate = true;
  const paperTex = new T.CanvasTexture(paperTexture(fonts)); paperTex.anisotropy = 4;
  const U = { uPaper: { value: paperTex }, uBurn: { value: burnTex }, uT: { value: -0.05 }, uTime: { value: 0 } };
  const page = new T.Mesh(new T.PlaneGeometry(W, H, 220, 124), new T.ShaderMaterial({ uniforms: U, vertexShader: VERT, fragmentShader: FRAG }));
  scene.add(page);
  // particles
  const D = 7.2, t0 = performance.now() / 1000 + 1.4;
  const PU = { uNow: { value: 0 }, uStart: { value: t0 }, uDur: { value: D / 1.05 }, uPR: { value: pr } };
  const N = makeNoise(5);
  const mk = (count, kinds, additive) => {
    const uv = [], thr = [], r = [], kind = [];
    for (let i = 0; i < count; i++) {
      const u = N.rnd(), v = N.rnd(), b = sampleMap(map, u, v), kd = kinds[(N.rnd() * kinds.length) | 0];
      uv.push(u, v); thr.push(b + (kd === 0 ? .014 : -.004)); r.push(N.rnd(), N.rnd(), N.rnd(), N.rnd()); kind.push(kd);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(new Array(count * 3).fill(0), 3));
    g.setAttribute('aUv', new T.Float32BufferAttribute(uv, 2));
    g.setAttribute('aThr', new T.Float32BufferAttribute(thr, 1)); g.setAttribute('aR', new T.Float32BufferAttribute(r, 4)); g.setAttribute('aKind', new T.Float32BufferAttribute(kind, 1));
    const m = new T.ShaderMaterial({ uniforms: PU, vertexShader: PVERT, fragmentShader: PFRAG, transparent: true, depthTest: false, depthWrite: false, blending: additive ? T.AdditiveBlending : T.NormalBlending });
    const pts = new T.Points(g, m); pts.frustumCulled = false; scene.add(pts);
  };
  mk(2600, [0, 0, 0, 2], false);
  mk(1500, [1, 1, 1, 3], true);

  if (sfx.whoosh) setTimeout(() => !st.stop && sfx.whoosh(), 1300);
  let crackleT = 0;
  const loop = () => {
    if (st.stop) { renderer.dispose(); return; }
    const now = opts.fixedT !== undefined ? t0 + opts.fixedT / 1.05 * D + .35 : performance.now() / 1000;
    const k = (now - t0) / D;
    U.uT.value = Math.min(1.08, k * 1.05) - (k < 0 ? .05 : 0);
    U.uTime.value = now; PU.uNow.value = now;
    renderer.render(scene, camera);
    if (k > 0 && k < 1 && sfx.crackle && now > crackleT) { sfx.crackle(); crackleT = now + .05 + Math.random() * .18; }
    if (k > .97 && st.phase === 'burn' && opts.fixedT === undefined) finishBurn();
    if (k < 1.6 || opts.fixedT !== undefined) requestAnimationFrame(loop); else { renderer.dispose(); }
  };
  requestAnimationFrame(loop);
  return st;
}

window.DovalBurn = {
  start,
  next() { return false; },
  phase() { return state ? state.phase : null; },
  stop() { if (state) state.stop = true; state = null; }
};
})();
