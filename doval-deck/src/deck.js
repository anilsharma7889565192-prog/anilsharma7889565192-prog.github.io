(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const viewport = $('#viewport');
const stage = $('#stage');
viewport.classList.remove('nojs');

/* =================== content =================== */
const PAGES = [
  { t: 'Introduction', h: 'The Quiet Guardian of India', m: 1, done: true },
  { t: 'Who He Is Today', h: 'The man India turns to in a crisis', m: 1 },
  { t: 'Roots', h: 'A soldier’s son from the hills', m: 1 },
  { t: 'The Young Officer', h: 'A riot ended in one week', m: 1 },
  { t: 'Into the Shadows', h: 'The spy who talked rebels into peace', m: 1 },
  { t: 'Behind Enemy Lines', h: 'Seven years in Pakistan', m: 2 },
  { t: 'Operation Black Thunder', h: 'Inside the Golden Temple', m: 2 },
  { t: 'The Negotiator', h: 'Talking down hijackers and militants', m: 2 },
  { t: 'At the Top', h: 'From field agent to India’s spy chief', m: 2 },
  { t: 'The Doval Doctrine', h: 'Defensive offence', m: 2 },
  { t: 'The NSA Years', h: 'One crisis after another', m: 3 },
  { t: 'Operation Sindoor', h: '23 minutes. 9 targets.', m: 3 },
  { t: 'Honours', h: 'A nation’s thank-you', m: 3 },
  { t: 'Why We Chose Him', h: 'Why we chose Ajit Doval', m: 3 },
  { t: 'Thank You', h: 'Thank you.', m: 3 }
];
const NOTES = [
  'Good morning. Imagine living for years in an enemy country under a false identity. Walking into the Golden Temple while militants held it. Negotiating with hijackers. And then becoming the person the Prime Minister turns to first in every national crisis. That is one man’s life: Ajit Doval, India’s National Security Advisor. Today our team will take you from a small village in Garhwal to the centre of India’s security, and show what his story teaches us about leadership and communication.',
  'Today, Ajit Doval is India’s National Security Advisor. He is the Prime Minister’s top adviser on everything from terrorism to China. Every report from the IB, R&AW and the armed forces comes together on his desk. He is the fifth person to hold this post, he has held it since 2014, and he is now in his third term, making him the longest-serving NSA India has ever had. He was also the first NSA given the rank of a Cabinet Minister. And at 81, he is still on duty. But this story did not begin in Delhi. It began in a small village in the hills of Uttarakhand.',
  'Ajit Doval was born in 1945 in a small village in Garhwal. His father was an Army officer, so he grew up moving from posting to posting, and studied at the Ajmer Military School, where discipline came before everything. He topped his MA in Economics at Agra University and cleared the civil services at just 23. One small story: at the age of five, a teacher in Pune told him about Lokmanya Tilak. Seventy-six years later, he returned to the same city to receive the Lokmanya Tilak National Award.',
  'In 1972, Kerala’s Home Minister needed someone to stop a communal riot in Thalassery. He picked a 27-year-old officer in only his third year of service. Doval did not stay behind a desk. He went to every affected street, asked families to come back home, and promised that their looted property would be returned. He kept that promise, and the riot was controlled within a week. That was the first sign of his style: calm, personal, and built on trust.',
  'In 1972 he joined the Intelligence Bureau and was sent to Mizoram, where an armed insurgency was going on. For about five years he worked mostly undercover. Reports say he convinced six of rebel leader Laldenga’s seven commanders to give up the fight. He did it with conversations, not guns. That work helped lead to the Mizoram Peace Accord of 1986. In 1974, he became the youngest officer to receive the Police Medal for meritorious service. Next, Member 2 will tell you about his most dangerous years.',
  'From 1983 to 1987, Doval was officially posted at the Indian High Commission in Islamabad. But reports say he spent about seven years in Pakistan, much of it living in Lahore under a false identity. He has shared one story himself. An old man stopped him near a shrine and said, “You are a Hindu.” He had spotted Doval’s pierced ears, a Garhwali tradition. Doval denied it, but the old man revealed that he too was a Hindu, hiding his identity, and warned him to fix his ears. Doval later had them surgically corrected. One tiny detail could have cost him his life.',
  'In 1988, militants once again occupied the Golden Temple. The government wanted to end it without damaging the holy shrine, as had happened in 1984. Biographers say Doval walked into the temple before the operation, posing as an agent working for Pakistan’s spy agency, the ISI, and mapped exactly how many militants there were, where they were, and what weapons they had. The NSG used that information, and on 18 May the militants surrendered in front of the media. For this, Doval received the Kirti Chakra, the first police officer ever to win it. Even today, he has never spoken publicly about what happened inside.',
  'Doval became the government’s go-to negotiator. He was involved in ending all fifteen hijackings of Indian Airlines planes between 1971 and 1999. The most famous was IC-814 in 1999, when a plane was hijacked to Kandahar. Doval flew there as a negotiator. The hijackers’ demands were reportedly brought down from thirty-six militants and two hundred million dollars to three militants, and every hostage came home. But Doval himself later called it a failure, because one of those three men went on to start a terror group. A good leader admits that too.',
  'After decades in the field, Doval rose to the top. He ran the IB’s operations wing for over ten years and created systems like the Multi Agency Centre, so that India’s agencies would share information about terror threats instead of working alone. In 2004 he became Director of the Intelligence Bureau, and he retired in 2005 after more than thirty-three years. But he did not stop. He started a think tank and helped set up a national security university. In 2014, India called him back.',
  'In February 2014, Doval gave a lecture that defined his thinking. He said a country can deal with a hostile neighbour in three ways: defend and wait, go to all-out war, or something in between that he called defensive offence: hitting the threat at its source. He made it clear that India should stop only defending. His most famous line was a warning to Pakistan: “You may do one Mumbai, you may lose Balochistan.” Three months later, on 30 May 2014, he became India’s National Security Advisor. Member 3 will now show you what happened next.',
  'As NSA, Doval has been in the room for almost every crisis India has faced. In 2014 he flew to Iraq himself to bring home forty-six Indian nurses trapped by ISIS. In 2016 came the surgical strikes after the Uri attack. In 2019, after Pulwama, he was one of only seven people who knew about the Balakot airstrike in advance. When Article 370 was removed, he stayed in Kashmir for eleven days and sat down for lunch with locals on a street in Shopian. And in 2020, after the clash at Galwan, a two-hour phone call with China’s foreign minister helped get troops to pull back.',
  'On 22 April 2025, terrorists killed twenty-six people in Pahalgam. Two weeks later, on 7 May, India launched Operation Sindoor: nine terror sites hit in twenty-three minutes. Doval said, “We missed none.” Within hours, he was on the phone with the United States and other world powers, explaining that India’s action was measured and not meant to start a war. By 10 May, the firing stopped. Strong action, followed by clear communication. That is his leadership style at its best.',
  'India has recognised Doval many times. He was the youngest officer to receive the Police Medal, and the first police officer ever to win the Kirti Chakra. Six universities have given him honorary doctorates, and this August he received the Lokmanya Tilak National Award in Pune. The media calls him India’s James Bond. But his real story is not about medals. It is about what kind of person he is, and that is why we chose him.',
  'So why did we choose Ajit Doval? Because his life shows every side of leadership: the police officer who calmed a riot, the spy who lived among the enemy, the negotiator who talked down hijackers, and the advisor who guides the nation today. As a person, he offers courage, calm, patience and humility. He rarely gives interviews and almost never seeks credit. And for us as students of communication, the biggest lesson is this: many of his greatest victories came from listening, showing up in person, keeping promises and explaining clearly, not from force. As he told young Indians this year: put the nation’s interest above your own.',
  'That was the story of Ajit Doval, the Quiet Guardian of India. Thank you for listening. We’re happy to take your questions.'
];
const TICKER = [
  [1945, 'Born in Ghiri Banelsyun, Pauri Garhwal'], [1967, 'Tops MA Economics, Agra University'],
  [1968, 'Joins the IPS, Kerala cadre'], [1972, 'Ends the Thalassery riot'],
  [1974, 'Youngest to win the Police Medal'], [1983, 'Posted to Islamabad'],
  [1988, 'Operation Black Thunder'], [1989, 'Kirti Chakra'], [1999, 'IC-814 negotiator, Kandahar'],
  [2004, 'Director, Intelligence Bureau'], [2014, 'National Security Advisor'],
  [2019, 'Cabinet rank'], [2024, 'Third term as NSA'], [2025, 'Operation Sindoor'],
  [2026, 'Lokmanya Tilak National Award']
];

/* =================== build chrome =================== */
$('#ticker-run').innerHTML = TICKER.concat(TICKER).map(([y, t]) => `<span><b>${y}</b>${t}</span>`).join('');
$('#ticks').innerHTML = PAGES.map(() => '<span></span>').join('');
const slidesEl = $('#slides');
PAGES.forEach((p, i) => {
  if (i === 0) return;
  const s = document.createElement('section');
  s.className = 'slide';
  s.id = 's' + (i + 1);
  s.setAttribute('aria-label', `Slide ${i + 1}: ${p.t}`);
  s.innerHTML = `<div class="ph"><div class="num">${String(i + 1).padStart(2, '0')}</div><h2>${p.t}</h2><p>${p.h}</p><div class="wip">Design in review · we build this page next</div></div>`;
  slidesEl.appendChild(s);
});
const slides = $$('.slide', slidesEl);
$('#menu-grid').innerHTML = PAGES.map((p, i) =>
  `<button data-to="${i}" class="${p.done ? 'done' : ''}"><span class="n">${String(i + 1).padStart(2, '0')} · Part ${['I', 'II', 'III'][p.m - 1]}</span><span class="t">${p.t}</span><span class="st">${p.done ? 'Designed' : 'In review'}</span></button>`).join('');

// film grain texture
(() => {
  const c = document.createElement('canvas'); c.width = c.height = 220;
  const x = c.getContext('2d'); const d = x.createImageData(220, 220);
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0); $('#grain').style.backgroundImage = `url(${c.toDataURL()})`;
})();

/* =================== stage scaling =================== */
let S = 1;
function fit() {
  S = Math.min(innerWidth / 1600, innerHeight / 900);
  stage.style.transform = `translate(-50%,-50%) scale(${S})`;
  if (GL) GL.resize();
  sizeIris();
}
function toStage(e) {
  const r = stage.getBoundingClientRect();
  return [(e.clientX - r.left) / S, (e.clientY - r.top) / S];
}

/* =================== iris transition =================== */
const iris = $('#iris'); const ictx = iris.getContext('2d');
let IPR = 1;
function sizeIris() { IPR = Math.min(2, Math.max(1, (window.devicePixelRatio || 1) * S)); iris.width = 1600 * IPR; iris.height = 900 * IPR; drawIris(0); }
function drawIris(p) {
  ictx.setTransform(IPR, 0, 0, IPR, 0, 0);
  ictx.clearRect(0, 0, 1600, 900);
  if (p <= 0.001) return;
  const R = 960 * (1 - p), cx = 800, cy = 450, n = 7, rot = p * 1.4;
  const pts = [];
  for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
  ictx.fillStyle = '#020305'; ictx.fillRect(0, 0, 1600, 900);
  if (R > 1) {
    ictx.save(); ictx.globalCompositeOperation = 'destination-out'; ictx.beginPath();
    pts.forEach((q, i) => i ? ictx.lineTo(q[0], q[1]) : ictx.moveTo(q[0], q[1])); ictx.closePath(); ictx.fill(); ictx.restore();
    ictx.strokeStyle = 'rgba(244,180,67,.42)'; ictx.lineWidth = 1.5; ictx.beginPath();
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; const dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy) || 1; ictx.moveTo(a[0], a[1]); ictx.lineTo(a[0] + dx / L * 2200, a[1] + dy / L * 2200); }
    ictx.stroke();
  }
}
function tween(ms, fn, done) {
  if (REDUCE) { fn(1); done && done(); return; }
  const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / ms); fn(k); if (k < 1) requestAnimationFrame(step); else done && done(); };
  requestAnimationFrame(step);
}
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
function irisSwap(mid) {
  if (REDUCE) { mid(); return; }
  tween(380, k => drawIris(ease(k)), () => { mid(); tween(460, k => drawIris(1 - ease(k)), () => drawIris(0)); });
}

/* =================== navigation =================== */
let cur = 0, busy = false, declassified = false;
const N = PAGES.length;
function updateChrome() {
  const p = PAGES[cur];
  $('#part').textContent = 'Part ' + ['I', 'II', 'III'][p.m - 1];
  $('#secname').textContent = p.t;
  $('#count').innerHTML = `Page <b>${String(cur + 1).padStart(2, '0')}</b> / ${N}`;
  $('#tape').style.width = ((cur + 1) / N * 100) + '%';
  $('#notes-h').textContent = `Slide ${String(cur + 1).padStart(2, '0')} · ${p.t} · Member ${p.m}`;
  $('#notes-p').textContent = NOTES[cur];
}
function go(n) {
  if (n === 'next') n = cur + 1; else if (n === 'prev') n = cur - 1;
  n = Math.max(0, Math.min(N - 1, n));
  if (n === cur || busy) return;
  if (cur === 0 && n > 0 && !declassified) { declassify(n); return; }
  busy = true;
  irisSwap(() => {
    slides[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    updateChrome();
    if (GL) GL.pose(cur);
    setTimeout(() => { busy = false; }, 500);
  });
}

/* =================== slide 1 choreography =================== */
const s1 = $('#s1');
const stSecret = $('#st-secret'), stDeclass = $('#st-declass');
function shake() { if (REDUCE) return; stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); }
function intro() {
  if (REDUCE) {
    s1.classList.add('shown');
    stSecret.style.opacity = .9;
    return;
  }
  s1.classList.add('pre');
  $$('[data-in]', s1).forEach((el, i) => { el.style.transitionDelay = (i * 90) + 'ms'; });
  setTimeout(() => { s1.classList.add('reveal'); }, 1300);
  setTimeout(() => { s1.classList.add('shown'); }, 1700);
  setTimeout(() => { stSecret.classList.add('on'); shake(); }, 2500);
}
function declassify(next) {
  if (busy) return;
  busy = true; declassified = true;
  stSecret.classList.add('struck');
  setTimeout(() => { stDeclass.classList.add('on'); shake(); }, 260);
  if (REDUCE) stDeclass.style.opacity = .95;
  setTimeout(() => { $('#dawn').classList.add('go'); if (GL) GL.dawn(); }, 420);
  setTimeout(() => { busy = false; go(next === undefined ? 1 : next); }, REDUCE ? 600 : 2300);
}
$('#open-file').addEventListener('click', () => { if (!declassified) declassify(1); else go(1); });

/* =================== controls =================== */
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
const notes = $('#notes'), menu = $('#menu');
function toggleNotes() { notes.hidden = !notes.hidden; }
function toggleMenu(open) { menu.hidden = open === undefined ? !menu.hidden : !open; }
$('#btn-notes').addEventListener('click', toggleNotes);
$('#btn-menu').addEventListener('click', () => toggleMenu());
$('#menu-close').addEventListener('click', () => toggleMenu(false));
$('#menu-grid').addEventListener('click', e => { const b = e.target.closest('button[data-to]'); if (!b) return; toggleMenu(false); go(+b.dataset.to); });
function fullscreen() {
  const d = document;
  try {
    if (d.fullscreenElement) d.exitFullscreen && d.exitFullscreen();
    else { const p = d.documentElement.requestFullscreen && d.documentElement.requestFullscreen(); p && p.catch && p.catch(() => {}); }
  } catch (err) { /* not available here */ }
}
$('#btn-fs').addEventListener('click', fullscreen);
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { if (e.target.closest && e.target.closest('button') && (k === ' ' || k === 'Enter')) return; e.preventDefault(); go('next'); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go('prev'); }
  else if (k === 'Home') go(0);
  else if (k === 'End') go(N - 1);
  else if (k === 'f' || k === 'F') fullscreen();
  else if (k === 'n' || k === 'N') toggleNotes();
  else if (k === 'm' || k === 'M') toggleMenu();
  else if (k === 'Escape') { notes.hidden = true; toggleMenu(false); }
});

/* =================== 3D night map =================== */
let GL = null;
function initGL() {
  const T = window.THREE;
  if (!T) return null;
  const canvas = $('#gl');
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' }); }
  catch (err) { return null; }
  renderer.setClearColor(0x05070b, 1);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, 16 / 9, 0.1, 400);

  /* projection: Mercator, centred on India */
  const LON_C = 80, LAT_C = 22, K = 0.66, PL = 0.85;
  const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;
  const M0 = merc(LAT_C);
  const P = (lon, lat) => [(lon - LON_C) * K, -(merc(lat) - M0) * K];
  const unP = (x, z) => { const m = -z / K + M0; return [x / K + LON_C, (2 * Math.atan(Math.exp(m * Math.PI / 180)) - Math.PI / 2) * 180 / Math.PI]; };

  /* grid */
  const G = MAPDATA.grid; const raw = atob(G.b64);
  const cell = (x, y) => { const i = y * G.w + x; return (raw.charCodeAt(i >> 2) >> ((i & 3) * 2)) & 3; };
  const classAt = (lon, lat) => { const x = Math.floor((lon - G.lon0) / G.step), y = Math.floor((G.lat1 - lat) / G.step); if (x < 0 || y < 0 || x >= G.w || y >= G.h) return 0; return cell(x, y); };

  const DEL = P(77.209, 28.614), PAU = P(78.78, 30.15);
  const dDel = (x, z) => Math.hypot(x - DEL[0], z - DEL[1]);

  // seeded random
  let seed = 1945;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  const indPos = [], indRand = [], indDist = [], nbPos = [], nbDist = [];
  const indiaCells = [];
  for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) {
    const v = cell(x, y); if (!v) continue;
    const lon = G.lon0 + (x + .5) * G.step, lat = G.lat1 - (y + .5) * G.step; const p = P(lon, lat);
    if (v === 2) { indPos.push(p[0], 0, p[1]); indRand.push(rnd()); indDist.push(dDel(p[0], p[1])); indiaCells.push([lon, lat]); }
    else { nbPos.push(p[0], -PL, p[1]); nbDist.push(dDel(p[0], p[1])); }
  }

  /* city lights: synthetic night lights from city sizes (not real satellite data) */
  const CITIES = [[77.21,28.61,10],[72.88,19.08,10],[88.36,22.57,9],[77.59,12.97,9],[80.27,13.08,9],[78.49,17.39,9],[72.57,23.02,8],[73.86,18.52,8],[72.83,21.17,7],[75.79,26.91,7],[80.95,26.85,7],[80.33,26.45,6],[79.09,21.15,6],[75.86,22.72,6],[77.41,23.26,6],[85.14,25.59,6],[73.18,22.31,5],[75.86,30.9,5],[78.01,27.18,5],[73.79,20.0,5],[82.97,25.32,5],[74.8,34.08,5],[74.87,31.63,5],[85.31,23.34,4],[76.96,11.02,5],[78.12,9.93,4],[76.27,9.93,5],[76.94,8.52,4],[75.78,11.26,4],[75.49,11.75,3],[83.22,17.69,5],[80.65,16.51,4],[85.82,20.3,4],[91.74,26.14,4],[81.63,21.25,4],[76.78,30.73,5],[78.03,30.32,4],[74.86,32.73,4],[73.02,26.24,4],[73.71,24.59,3],[70.8,22.3,4],[78.18,26.22,4],[79.99,23.18,4],[75.34,19.88,4],[75.91,17.66,3],[74.86,12.91,3],[76.64,12.3,4],[75.12,15.36,3],[74.5,15.85,3],[73.83,15.49,3],[78.7,10.79,3],[78.15,11.66,3],[79.81,11.94,3],[79.59,17.97,3],[80.44,16.31,3],[79.99,14.44,3],[75.86,25.21,3],[74.64,26.45,3],[73.31,28.02,2],[77.71,28.98,4],[78.08,27.88,3],[79.43,28.37,3],[83.37,26.76,3],[81.85,25.44,4],[86.43,23.8,3],[86.2,22.8,3],[88.4,26.73,3],[93.94,24.82,2],[92.72,23.73,2],[91.89,25.58,2],[91.29,23.83,2],[94.11,25.67,1],[93.61,27.08,1],[88.61,27.33,1],[77.17,31.1,2],[77.58,34.16,1],[92.73,11.62,1],[78.16,29.95,2],[74.95,30.21,2],[75.58,31.33,3],[74.24,16.7,3],[77.32,19.15,2],[81.28,21.19,3],[85.88,20.46,3],[86.98,23.68,3],[85.39,26.12,2],[85.0,24.79,2],[86.98,25.24,2],[78.57,25.45,2],[77.55,29.97,2],[78.77,28.84,3],[79.42,13.63,2],[78.04,15.83,2],[76.21,10.53,3],[76.61,8.89,2],[72.15,21.76,2],[70.06,22.47,2],[72.65,23.22,2],[75.78,23.18,2],[78.74,23.84,1],[82.15,22.08,2],[83.97,21.47,1],[84.85,22.26,2],[94.91,27.47,1],[92.78,24.83,1],[94.2,26.75,1],[78.78,30.15,1]];
  const lPos = [], lRand = [], lDist = [], lI = [];
  for (const [lon, lat, w] of CITIES) {
    const n = Math.round(w * 28), sg = 0.06 + w * 0.026;
    for (let i = 0; i < n; i++) {
      const gx = gauss(), gy = gauss();
      const lo = lon + gx * sg * 1.05, la = lat + gy * sg;
      if (classAt(lo, la) !== 2) continue;
      const p = P(lo, la); const r2 = (gx * gx + gy * gy) / 2;
      lPos.push(p[0], 0.04, p[1]); lRand.push(rnd()); lDist.push(dDel(p[0], p[1])); lI.push(Math.exp(-r2) * 0.85 + 0.15);
    }
  }
  for (let i = 0; i < 1900; i++) {
    const c = indiaCells[(rnd() * indiaCells.length) | 0];
    const lo = c[0] + (rnd() - .5) * G.step, la = c[1] + (rnd() - .5) * G.step; const p = P(lo, la);
    lPos.push(p[0], 0.04, p[1]); lRand.push(rnd()); lDist.push(dDel(p[0], p[1])); lI.push(0.08 + rnd() * 0.22);
  }

  const U = { uTime: { value: 0 }, uReveal: { value: 0 }, uTrace: { value: 0 }, uDawn: { value: -40 }, uDim: { value: 1 }, uPR: { value: 1 } };
  const flagGLSL = `
    vec3 flagCol(float z){ vec3 s=vec3(1.,.6,.2), w=vec3(1.,1.,1.), g=vec3(.16,.78,.2);
      return mix(mix(s,w,smoothstep(-4.2,-2.6,z)),g,smoothstep(2.6,4.2,z)); }
    float dawnBand(float x){ return exp(-pow(x-uDawn,2.)/9.); }`;
  const ptFrag = `varying vec3 vC; varying float vA;
    void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.08,d)*vA; if(a<.004) discard; gl_FragColor=vec4(vC,a); }`;
  const geoPts = (pos, attrs) => { const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); for (const k in attrs) g.setAttribute(k, new T.Float32BufferAttribute(attrs[k], 1)); return g; };

  // India dot-matrix
  const indMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime,uReveal,uDawn,uDim,uPR; attribute float aRand,aDist; varying vec3 vC; varying float vA; ${flagGLSL}
      void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mv;
        float rev=clamp((uReveal-aDist)/4.,0.,1.); float tw=.82+.18*sin(uTime*1.1+aRand*50.); float b=dawnBand(position.x);
        vC=mix(vec3(.24,.66,.66),flagCol(position.z),b); vA=rev*tw*(.62+.38*b)*uDim;
        gl_PointSize=2.5*uPR*(34./-mv.z)*(1.+b*.9)*(.5+.5*rev); }`,
    fragmentShader: ptFrag
  });
  scene.add(new T.Points(geoPts(indPos, { aRand: indRand, aDist: indDist }), indMat));

  // neighbouring land, lower plane
  const nbMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false,
    vertexShader: `uniform float uReveal,uDim,uPR; attribute float aDist; varying vec3 vC; varying float vA;
      void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mv;
        vC=vec3(.30,.40,.50); vA=.56*clamp((uReveal-aDist*.7)/6.,0.,1.)*(.55+.45*uDim); gl_PointSize=2.*uPR*(34./-mv.z); }`,
    fragmentShader: ptFrag
  });
  scene.add(new T.Points(geoPts(nbPos, { aDist: nbDist }), nbMat));

  // city lights
  const lMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: `uniform float uTime,uReveal,uDawn,uDim,uPR; attribute float aRand,aDist,aI; varying vec3 vC; varying float vA; ${flagGLSL}
      void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mv;
        float rev=clamp((uReveal-aDist-1.5)/3.,0.,1.); float tw=.62+.38*sin(uTime*(1.2+aRand*2.4)+aRand*90.); float b=dawnBand(position.x);
        vec3 warm=mix(vec3(1.,.66,.26),vec3(1.,.92,.74),aRand*aI);
        vC=mix(warm,flagCol(position.z),b*.85); vA=.85*rev*tw*(.25+.75*aI)*(.55+.45*uDim)*(1.+b*.6);
        gl_PointSize=uPR*(34./-mv.z)*(1.1+2.6*aI)*(1.+b*.5); }`,
    fragmentShader: ptFrag
  });
  scene.add(new T.Points(geoPts(lPos, { aRand: lRand, aDist: lDist, aI: lI }), lMat));

  // border ribbons + hologram walls
  const ribbonGeo = (ring, w, y) => {
    const pts = ring.map(([lo, la]) => P(lo, la)); pts.push(pts[0]);
    const n = pts.length, cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = cum[n - 1] || 1; const pos = [], side = [], along = [], idx = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], tz = b[1] - a[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
      const nx = -tz, nz = tx;
      pos.push(pts[i][0] + nx * w / 2, y, pts[i][1] + nz * w / 2, pts[i][0] - nx * w / 2, y, pts[i][1] - nz * w / 2);
      side.push(1, -1); along.push(cum[i] / L, cum[i] / L);
      if (i < n - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('aSide', new T.Float32BufferAttribute(side, 1)); g.setAttribute('aAlong', new T.Float32BufferAttribute(along, 1)); g.setIndex(idx); return g;
  };
  const wallGeo = (ring, h) => {
    const pts = ring.map(([lo, la]) => P(lo, la)); pts.push(pts[0]);
    const n = pts.length, cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = cum[n - 1] || 1; const pos = [], vv = [], along = [], idx = [];
    for (let i = 0; i < n; i++) {
      pos.push(pts[i][0], 0, pts[i][1], pts[i][0], -h, pts[i][1]); vv.push(0, 1); along.push(cum[i] / L, cum[i] / L);
      if (i < n - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('aV', new T.Float32BufferAttribute(vv, 1)); g.setAttribute('aAlong', new T.Float32BufferAttribute(along, 1)); g.setIndex(idx); return g;
  };
  const ribbonMat = (color, alpha, sharp) => new T.ShaderMaterial({
    uniforms: Object.assign({ uColor: { value: new T.Color(color) }, uAlpha: { value: alpha }, uSharp: { value: sharp } }, U),
    transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: `uniform float uTrace,uDawn; attribute float aSide,aAlong; varying float vSide,vAlong,vB; ${'float dawnBand(float x){ return exp(-pow(x-uDawn,2.)/9.); }'}
      void main(){ gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); vSide=aSide; vAlong=aAlong; vB=dawnBand(position.x); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uAlpha,uSharp,uTrace,uTime,uDim; varying float vSide,vAlong,vB;
      void main(){ if(vAlong>uTrace) discard; float head=smoothstep(uTrace-.025,uTrace,vAlong)*(1.-step(.999,uTrace));
        float prof=pow(1.-abs(vSide),uSharp); float fl=.88+.12*sin(uTime*2.2+vAlong*60.);
        vec3 c=mix(uColor,vec3(1.,.97,.9),head*.8)+vB*.35;
        gl_FragColor=vec4(c,prof*uAlpha*fl*(1.+head*2.5)*(.6+.4*uDim)); }`
  });
  const wallMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: `attribute float aV,aAlong; varying float vV,vAlong; void main(){ gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); vV=aV; vAlong=aAlong; }`,
    fragmentShader: `uniform float uTrace,uTime,uDim; varying float vV,vAlong;
      void main(){ if(vAlong>uTrace) discard; float a=pow(1.-vV,1.8)*.30*(.6+.4*uDim);
        float scan=.75+.25*sin(vV*30.-uTime*3.); vec3 c=mix(vec3(1.,.72,.28),vec3(.31,.82,.77),vV);
        gl_FragColor=vec4(c,a*scan); }`
  });
  const haloMat = ribbonMat(0xF4B443, 0.16, 1.6), coreMat = ribbonMat(0xFFC766, 0.95, 0.6);
  MAPDATA.rings.forEach((ring, i) => {
    const big = i === 0;
    scene.add(new T.Mesh(ribbonGeo(ring, big ? 0.9 : 0.4, 0.02), haloMat));
    scene.add(new T.Mesh(ribbonGeo(ring, big ? 0.075 : 0.05, 0.03), coreMat));
    if (big) scene.add(new T.Mesh(wallGeo(ring, PL), wallMat));
  });

  // graticule on the lower plane
  const gr = [];
  for (let lo = 60; lo <= 100; lo += 5) { const a = P(lo, 4), b = P(lo, 40); gr.push(a[0], -PL - .01, a[1], b[0], -PL - .01, b[1]); }
  for (let la = 5; la <= 40; la += 5) { const a = P(60, la), b = P(100, la); gr.push(a[0], -PL - .01, a[1], b[0], -PL - .01, b[1]); }
  const grG = new T.BufferGeometry(); grG.setAttribute('position', new T.Float32BufferAttribute(gr, 3));
  const grMat = new T.LineBasicMaterial({ color: 0x4FD1C5, transparent: true, opacity: 0.07, depthWrite: false });
  scene.add(new T.LineSegments(grG, grMat));

  // markers
  const ringMat = (color, speed) => new T.ShaderMaterial({
    uniforms: Object.assign({ uColor: { value: new T.Color(color) }, uSpeed: { value: speed } }, U),
    transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime,uSpeed,uReveal; varying vec2 vUv;
      void main(){ float r=length(vUv-.5)*2.; float a=0.;
        for(int i=0;i<2;i++){ float f=fract(uTime*uSpeed+float(i)*.5); a+=smoothstep(.06,0.,abs(r-f))*(1.-f); }
        a+=smoothstep(.16,.0,r)*1.2; a*=smoothstep(1.,.9,r)*clamp((uReveal-2.)/3.,0.,1.);
        gl_FragColor=vec4(uColor,a); }`
  });
  const marker = (p, color, size, speed, beamH) => {
    const g = new T.Group(); g.position.set(p[0], 0.06, p[1]);
    const ring = new T.Mesh(new T.PlaneGeometry(size, size), ringMat(color, speed)); ring.rotation.x = -Math.PI / 2; g.add(ring);
    const beam = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, beamH, 8, 1, true), new T.ShaderMaterial({
      uniforms: Object.assign({ uColor: { value: new T.Color(color) } }, U), transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: `varying float vY; void main(){ vY=uv.y; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uReveal; varying float vY; void main(){ gl_FragColor=vec4(uColor,(1.-vY)*.8*clamp((uReveal-3.)/3.,0.,1.)); }`
    }));
    beam.position.y = beamH / 2; g.add(beam); scene.add(g); return g;
  };
  marker(DEL, 0xF4B443, 2.6, 0.45, 3.4);
  marker(PAU, 0x4FD1C5, 1.6, 0.6, 1.6);

  // journey arc: Pauri Garhwal -> New Delhi
  const arcPts = [], arcT = []; const A0 = new T.Vector3(PAU[0], 0.06, PAU[1]), A1 = new T.Vector3(DEL[0], 0.06, DEL[1]);
  const AM = A0.clone().lerp(A1, .5); AM.y = 1.3;
  const curve = new T.QuadraticBezierCurve3(A0, AM, A1);
  for (let i = 0; i <= 80; i++) { const q = curve.getPoint(i / 80); arcPts.push(q.x, q.y, q.z); arcT.push(i / 80); }
  const arcG = new T.BufferGeometry(); arcG.setAttribute('position', new T.Float32BufferAttribute(arcPts, 3)); arcG.setAttribute('aT', new T.Float32BufferAttribute(arcT, 1));
  scene.add(new T.Line(arcG, new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: `attribute float aT; varying float vT; void main(){ vT=aT; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform float uTime,uReveal; varying float vT; void main(){ float on=clamp((uReveal-4.)/3.,0.,1.);
      float dash=step(.45,fract(vT*14.-uTime*.8)); float pulse=smoothstep(.12,0.,abs(vT-fract(uTime*.32)));
      gl_FragColor=vec4(mix(vec3(.31,.82,.77),vec3(1.,.8,.4),vT),(dash*.45+pulse)*on); }`
  })));

  // radar sweep around Delhi
  const radar = new T.Mesh(new T.PlaneGeometry(16, 16), new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform float uTime,uReveal,uDim; varying vec2 vUv;
      void main(){ vec2 c=vUv-.5; float r=length(c)*2.; if(r>1.) discard; float ang=atan(c.y,c.x)/6.28318+.5;
        float s=fract(ang+uTime*.09); float trail=pow(s,7.)*.17; float rings=(smoothstep(.012,0.,abs(r-.33))+smoothstep(.012,0.,abs(r-.66))+smoothstep(.012,0.,abs(r-.985)))*.06;
        float a=(trail+rings)*smoothstep(1.,.75,r)*clamp((uReveal-4.)/4.,0.,1.)*uDim;
        gl_FragColor=vec4(.31,.82,.77,a); }`
  }));
  radar.rotation.x = -Math.PI / 2; radar.position.set(DEL[0], 0.05, DEL[1]); scene.add(radar);

  // drifting dust
  const dPos = [], dR = [];
  for (let i = 0; i < 320; i++) { dPos.push((rnd() - .5) * 46, rnd() * 9, (rnd() - .5) * 36); dR.push(rnd()); }
  const dust = new T.Points(geoPts(dPos, { aRand: dR }), new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: `uniform float uTime,uPR; attribute float aRand; varying vec3 vC; varying float vA;
      void main(){ vec3 p=position; p.y=mod(p.y+uTime*(.08+aRand*.12),9.); p.x+=sin(uTime*.2+aRand*20.)*.6;
        vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; vC=vec3(1.,.85,.6); vA=.18*sin(p.y/9.*3.14159); gl_PointSize=uPR*(34./-mv.z)*(1.+aRand*2.); }`,
    fragmentShader: ptFrag
  }));
  scene.add(dust);

  /* labels projected from 3D */
  const labelsEl = $('#labels');
  const LABELS = [
    { p: DEL, y: 0.1, t: 'New Delhi', s: 'Seat of the NSA', dx: -190, dy: 46 },
    { p: PAU, y: 0.1, t: 'Pauri Garhwal', s: 'Born here · 1945', dx: 60, dy: -64, cls: 'teal' },
    { p: P(67.5, 14), y: -PL, t: 'Arabian Sea', cls: 'sea' },
    { p: P(89, 15.2), y: -PL, t: 'Bay of Bengal', cls: 'sea' },
    { p: P(79, 5.2), y: -PL, t: 'Indian Ocean', cls: 'sea' }
  ];
  LABELS.forEach(L => {
    const el = document.createElement('div'); el.className = 'mlabel ' + (L.cls || '');
    if (L.dx !== undefined) {
      const len = Math.hypot(L.dx, L.dy), ang = Math.atan2(L.dy, L.dx) * 180 / Math.PI;
      el.innerHTML = `<i class="ln" style="width:${len}px;transform:rotate(${ang}deg)"></i><span class="box" style="position:absolute;left:${L.dx}px;top:${L.dy}px;transform:translate(${L.dx < 0 ? '-100%' : '0'},-50%);padding:${L.dx < 0 ? '0 10px 0 0' : '0 0 0 10px'};text-align:${L.dx < 0 ? 'right' : 'left'}"><span class="t">${L.t}</span><span class="s">${L.s}</span></span>`;
    } else el.innerHTML = `<span class="t" style="transform:translate(-50%,-50%)">${L.t}</span>`;
    labelsEl.appendChild(el); L.el = el; L.v = new T.Vector3(L.p[0], L.y, L.p[1]);
  });
  const projV = new T.Vector3();
  const toScreen = v => { projV.copy(v).project(camera); return [(projV.x + 1) / 2 * 1600, (1 - projV.y) / 2 * 900]; };

  /* camera */
  const camFinal = { pos: new T.Vector3(2.4, 22.5, 21.5), tgt: new T.Vector3(1.4, 0, 0.6) };
  const camStart = { pos: new T.Vector3(-1, 44, 7), tgt: new T.Vector3(1.4, 0, -1) };
  const camAway = { pos: new T.Vector3(3, 30, 27), tgt: new T.Vector3(1.4, -0.5, 0.6) };
  let camFrom = camStart, camTo = camFinal, camK = 0, camDur = 3.4, camT0 = 0;
  const camPos = new T.Vector3(), camTgt = new T.Vector3();
  let dimTarget = 1; let px = 0, py = 0, spx = 0, spy = 0;

  function resize() {
    const pr = Math.min(2, Math.max(1, (window.devicePixelRatio || 1) * S));
    renderer.setPixelRatio(pr); renderer.setSize(1600, 900, false); U.uPR.value = pr;
    camera.aspect = 16 / 9; camera.setViewOffset(1600, 900, -1600 * 0.155, 0, 1600, 900); camera.updateProjectionMatrix();
  }
  resize();

  const t0 = performance.now();
  let dawnT0 = -1;
  const easeOut = k => 1 - Math.pow(1 - k, 3);
  const io = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  let labelsOn = false, scaleK = 0;

  function frame(now) {
    const t = (now - t0) / 1000; U.uTime.value = t;
    if (REDUCE) { U.uTrace.value = 1; U.uReveal.value = 60; camK = 1; }
    else {
      U.uTrace.value = io(Math.min(1, Math.max(0, (t - 0.3) / 2.3)));
      U.uReveal.value = Math.max(0, (t - 0.8) / 2.8) * 30;
      camK = Math.min(1, (t - camT0) / camDur);
    }
    if (!labelsOn && (REDUCE || t > 2.9)) { labelsOn = true; LABELS.forEach(L => L.el.classList.add('on')); }
    if (dawnT0 >= 0) { const k = (now - dawnT0) / 1700; U.uDawn.value = k > 1 ? -40 : -16 + k * 34; if (k > 1) dawnT0 = -1; }
    U.uDim.value += (dimTarget - U.uDim.value) * 0.06;
    spx += (px - spx) * 0.05; spy += (py - spy) * 0.05;
    const k = easeOut(camK);
    camPos.lerpVectors(camFrom.pos, camTo.pos, k); camTgt.lerpVectors(camFrom.tgt, camTo.tgt, k);
    const drift = REDUCE ? 0 : Math.sin(t * 0.07) * 0.8;
    camera.position.set(camPos.x + spx * 2.2 + drift, camPos.y - spy * 1.4, camPos.z + spy * 1.2);
    camera.lookAt(camTgt.x + spx * 0.6, camTgt.y, camTgt.z + spy * 0.4);
    renderer.render(scene, camera);
    // labels + scale bar
    for (const L of LABELS) { const [x, y] = toScreen(L.v); L.el.style.transform = `translate(${x}px,${y}px)`; if (L.cls === 'sea') L.el.classList.toggle('off', x < 760); }
    if (++scaleK % 10 === 1) {
      const a = toScreen(new T.Vector3(...[P(84, 12)[0], 0, P(84, 12)[1]])), b = toScreen(new T.Vector3(P(84 + 500 / (111.32 * Math.cos(12 * Math.PI / 180)), 12)[0], 0, P(84, 12)[1]));
      $('#scale-line').style.width = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1])) + 'px';
    }
    if (!document.hidden) requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);

  /* crosshair readout */
  const ray = new T.Raycaster(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hit = new T.Vector3();
  const cross = $('#cross'), roLat = $('#ro-lat'), roLon = $('#ro-lon'), roWhere = $('#ro-where');
  const fmt = (v, pos, neg) => Math.abs(v).toFixed(2) + '° ' + (v >= 0 ? pos : neg);
  const resetRO = () => { roLat.textContent = '28.61° N'; roLon.textContent = '77.21° E'; roWhere.textContent = 'New Delhi · seat of the NSA'; cross.classList.remove('on'); };
  stage.addEventListener('pointermove', e => {
    const [sx, sy] = toStage(e);
    px = (sx / 1600 - .5); py = (sy / 900 - .5);
    if (cur !== 0 || sx < 760 || sy < 100 || sy > 840) { resetRO(); return; }
    ray.setFromCamera({ x: sx / 1600 * 2 - 1, y: -(sy / 900 * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(plane, hit)) { resetRO(); return; }
    const [lon, lat] = unP(hit.x, hit.z);
    if (lon < 60 || lon > 100 || lat < 4 || lat > 40) { resetRO(); return; }
    const c = classAt(lon, lat);
    roLat.textContent = fmt(lat, 'N', 'S'); roLon.textContent = fmt(lon, 'E', 'W');
    roWhere.textContent = c === 2 ? 'India' : c === 1 ? 'Neighbouring land' : 'Open sea';
    cross.style.left = sx + 'px'; cross.style.top = sy + 'px'; cross.classList.add('on');
  });
  stage.addEventListener('pointerleave', () => { px = py = 0; resetRO(); });

  return {
    resize,
    dawn() { dawnT0 = performance.now(); },
    pose(i) {
      const away = i !== 0;
      dimTarget = away ? 0.4 : 1;
      camFrom = { pos: camera.position.clone(), tgt: camTgt.clone() };
      camTo = away ? camAway : camFinal; camT0 = (performance.now() - t0) / 1000; camDur = 1.4;
      $('#hud').style.opacity = away ? 0 : 1; labelsEl.style.opacity = away ? 0.35 : 1;
    }
  };
}

try { GL = initGL(); } catch (err) { GL = null; }
if (!GL) {
  const m = document.createElement('p'); m.id = 'nogl';
  m.textContent = 'The 3D map needs WebGL. Open this deck in Chrome or Edge with hardware acceleration turned on.';
  stage.appendChild(m);
}
$('#hud').style.transition = 'opacity .6s';
$('#labels').style.transition = 'opacity .6s';
addEventListener('resize', fit);
fit();
updateChrome();
intro();
})();
