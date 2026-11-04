(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = $('#stage'), cam = $('#cam');

/* A photo can be embedded here as a data: URL once we have a licensed file.
   Until then the presenter adds one by clicking the sketch; it is kept in this browser. */
const EMBED_PHOTO = null;
const EMBED_CREDIT = '';

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

/* =================== helpers =================== */
let seed = 1945;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeOut = k => 1 - Math.pow(1 - k, 3);
let S = 1;
const prFor = cap => Math.min(cap, Math.max(1, (window.devicePixelRatio || 1) * S));

/* =================== build file sheets (slides 2-15) + menu =================== */
const PART = m => ['I', 'II', 'III'][m - 1];
const two = n => String(n).padStart(2, '0');
const SHEET_HEAD = i => `<i class="hole l"></i><i class="hole r"></i><div class="sheet-head"><span>Case file AD/1945</span><span>Sheet ${two(i + 1)}</span><span>Part ${PART(PAGES[i].m)}</span></div><span class="stamp-s">Confidential</span>`;
const SHEETS = {
  1: `${SHEET_HEAD(1)}
    <p class="subj">Subject: Ajit Kumar Doval · present position</p>
    <h2 class="big" data-type>The man India turns to|in a crisis</h2>
    <h3 class="sec" style="top:212px">1. What a National Security Advisor does</h3>
    <ol class="duties">
      <li><b>Chief adviser to the Prime Minister</b> on national security and foreign policy.</li>
      <li><b>Brings together intelligence</b> from the IB, R&amp;AW and the armed forces, and briefs the PM.</li>
      <li><b>Represents India in security talks</b> with other countries. Heads the National Security Council Secretariat.</li>
    </ol>
    <h3 class="sec" style="top:420px">2. Record in office</h3>
    <div class="form">
      <div class="cell"><small>Position</small><b class="hw">5th</b><em class="hw">National Security Advisor</em></div>
      <div class="cell"><small>In office since</small><b class="hw">2014</b><em class="hw">30 May 2014</em></div>
      <div class="cell"><small>Terms</small><b class="hw">3</b><em class="hw">2014 · 2019 · 2024</em></div>
      <div class="cell"><small>Years in office</small><b class="hw">12+</b><em class="hw">longest in India’s history</em></div>
      <div class="cell"><small>Rank</small><b class="hw">1st</b><em class="hw">NSA with Cabinet rank</em></div>
      <div class="cell"><small>Age</small><b class="hw">81</b><em class="hw">and still on duty</em></div>
    </div>
    <svg class="redpen" viewBox="0 0 646 700" aria-hidden="true"><path class="draw" d="M50 592 C 46 564, 92 553, 122 555 C 160 557, 174 574, 168 594 C 162 616, 112 622, 84 618 C 58 614, 42 604, 58 576"/><path class="draw" d="M60 631 C 110 636, 170 635, 232 629"/></svg>
    <p class="also"><b>3. Also:</b> chairs the Strategic Policy Group, and is India’s Special Representative for border talks with China (24th round: August 2025).</p>`
};
const pagesEl = $('#pages');
pagesEl.innerHTML = PAGES.map((p, i) => i === 0 ? '' :
  `<div class="page" data-i="${i}" style="--z:${(PAGES.length - i) * 0.7}" role="group" aria-label="Slide ${i + 1}: ${p.t}"><div class="pf">${SHEETS[i] || `${SHEET_HEAD(i)}
    <p class="subj">Subject: Ajit Kumar Doval · ${p.t.toLowerCase()}</p>
    <h2 class="big" data-type>${p.h}</h2>
    <p class="ph-note">This sheet is next in our design review.<small>Content is approved; the page design comes after your OK on the sheet before it.</small></p>`}</div><div class="pb"></div></div>`).join('');
const pageEls = $$('.page', pagesEl);
const pageFor = i => pageEls.find(p => +p.dataset.i === i);
$('#index-list').innerHTML = PAGES.map((p, i) => `<li data-i="${i}"><span>${two(i + 1)} · ${p.t}</span><i>${p.done || i === 1 ? '✓' : ''}</i></li>`).join('');
$('#menu-grid').innerHTML = PAGES.map((p, i) =>
  `<button data-to="${i}" class="${p.done ? 'done' : ''}"><span class="n">Page ${String(i + 1).padStart(2, '0')} · Part ${['I', 'II', 'III'][p.m - 1]}</span><span class="t">${p.t}</span><span class="st">${p.done ? 'designed' : 'in review'}</span></button>`).join('');

/* =================== textures =================== */
function noiseCanvas(size, lo, hi, fibers) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'); const d = x.createImageData(size, size);
  for (let i = 0; i < d.data.length; i += 4) { const v = lo + Math.random() * (hi - lo); d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0);
  if (fibers) {
    x.globalAlpha = .08; x.strokeStyle = '#7a6a50'; x.lineWidth = .6;
    for (let i = 0; i < fibers; i++) { const a = Math.random() * 6.28, l = 4 + Math.random() * 14, px = Math.random() * size, py = Math.random() * size; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + .6) * l / 2, py + Math.sin(a + .6) * l / 2, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  }
  return c;
}
const paperTex = noiseCanvas(256, 222, 255, 260);
const paperURL = paperTex.toDataURL();
$$('.sheet,.pf,.pb,.face,.f-back,.f-tab,.ex-sheet').forEach(s => {
  const cs = getComputedStyle(s);
  if (cs.backgroundImage && cs.backgroundImage !== 'none') {
    s.style.backgroundImage = cs.backgroundImage + `,url(${paperURL})`;
    s.style.backgroundSize = cs.backgroundSize + ',256px 256px';
    s.style.backgroundPosition = cs.backgroundPosition + ',0 0';
  } else { s.style.backgroundImage = `url(${paperURL})`; s.style.backgroundSize = '256px 256px'; }
});
$('#grain').style.backgroundImage = `url(${noiseCanvas(256, 0, 255, 0).toDataURL()})`;

function drawCork() {
  const cv = $('#cork'), W = 1680, H = 980, pr = prFor(1.6);
  cv.width = Math.round(W * pr); cv.height = Math.round(H * pr);
  const x = cv.getContext('2d'); x.setTransform(pr, 0, 0, pr, 0, 0);
  seed = 77;
  x.fillStyle = '#9f7240'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 80; i++) {
    const gx = rnd() * W, gy = rnd() * H, r = 70 + rnd() * 260, dark = rnd() < .55;
    const g = x.createRadialGradient(gx, gy, 0, gx, gy, r);
    g.addColorStop(0, dark ? 'rgba(66,38,14,.20)' : 'rgba(222,178,118,.15)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(gx - r, gy - r, r * 2, r * 2);
  }
  const pal = ['#6a421e', '#7a4e24', '#8d5c2c', '#a06c37', '#b47f46', '#c89557', '#d9ac70', '#94622f'];
  const n = Math.round(W * H / 8);
  pal.forEach((col, ci) => {
    x.fillStyle = col;
    for (let i = ci; i < n; i += pal.length) {
      const rx = rnd() * W, ry = rnd() * H, s = .55 + rnd() * rnd() * 3.4;
      x.globalAlpha = .3 + rnd() * .65;
      if (s < 1.5) x.fillRect(rx, ry, s, s * (.6 + rnd() * .8));
      else { x.beginPath(); x.ellipse(rx, ry, s, s * (.45 + rnd() * .6), rnd() * 3.14, 0, 6.283); x.fill(); }
    }
  });
  x.fillStyle = '#331d0b';
  for (let i = 0; i < 11000; i++) { x.globalAlpha = .3 + rnd() * .55; const s = .5 + rnd() * 1.7; x.fillRect(rnd() * W, rnd() * H, s, s * (.5 + rnd() * .9)); }
  x.fillStyle = '#ecca94';
  for (let i = 0; i < 6000; i++) { x.globalAlpha = .2 + rnd() * .4; x.fillRect(rnd() * W, rnd() * H, .8 + rnd(), .8 + rnd()); }
  for (let i = 0; i < 70; i++) {
    const hx = rnd() * W, hy = rnd() * H;
    x.globalAlpha = .85; x.fillStyle = '#1e1007'; x.beginPath(); x.arc(hx, hy, 1.1 + rnd() * .8, 0, 6.283); x.fill();
    x.globalAlpha = .22; x.fillStyle = '#f3d6a3'; x.beginPath(); x.arc(hx - 1.2, hy - 1.2, 1.3, 0, 6.283); x.fill();
  }
  x.globalAlpha = 1;
}

function drawDesk() {
  const cv = $('#desk'), W = 1600, H = 900, pr = prFor(1.6);
  cv.width = Math.round(W * pr); cv.height = Math.round(H * pr);
  const x = cv.getContext('2d'); x.setTransform(pr, 0, 0, pr, 0, 0);
  seed = 2014;
  const base = x.createLinearGradient(0, 0, 0, H); base.addColorStop(0, '#2a170c'); base.addColorStop(.5, '#3a2213'); base.addColorStop(1, '#24140a');
  x.fillStyle = base; x.fillRect(0, 0, W, H);
  // planks
  const plank = 225;
  for (let p = 0; p * plank < H + plank; p++) {
    const y0 = p * plank - 40, tint = rnd();
    x.fillStyle = `rgba(${tint < .5 ? '20,10,4' : '90,55,28'},${.08 + rnd() * .12})`; x.fillRect(0, y0, W, plank);
    for (let i = 0; i < 150; i++) {
      const yy = y0 + rnd() * plank, amp = 1 + rnd() * 5, ph = rnd() * 6.28, f = .002 + rnd() * .004;
      x.strokeStyle = ['#1a0d05', '#4e2f17', '#5f3b1d', '#2e1a0c', '#6b4423'][(rnd() * 5) | 0];
      x.globalAlpha = .12 + rnd() * .3; x.lineWidth = .4 + rnd() * 1.8;
      x.beginPath();
      for (let xx = -10; xx <= W + 10; xx += 16) { const yv = yy + Math.sin(xx * f + ph) * amp + Math.sin(xx * .013 + ph * 2) * amp * .3; xx < 0 ? x.moveTo(xx, yv) : x.lineTo(xx, yv); }
      x.stroke();
    }
    x.globalAlpha = .55; x.fillStyle = '#0c0603'; x.fillRect(0, y0 + plank - 2, W, 2);
    x.globalAlpha = .12; x.fillStyle = '#d9a46a'; x.fillRect(0, y0 + plank, W, 1);
  }
  x.globalAlpha = 1;
  const sheen = x.createLinearGradient(0, 0, W, H); sheen.addColorStop(0, 'rgba(255,220,170,0)'); sheen.addColorStop(.45, 'rgba(255,220,170,.07)'); sheen.addColorStop(.6, 'rgba(255,220,170,0)');
  x.fillStyle = sheen; x.fillRect(0, 0, W, H);
}

/* =================== pins + string =================== */
const PINS = [
  { id: 'portrait', x: 1032, y: 166, c: 'red' }, { id: 'born', x: 737, y: 204, c: 'red' },
  { id: 'ips', x: 751, y: 426, c: 'red' }, { id: 'nsa', x: 768, y: 650, c: 'red' },
  { id: 'kc', x: 1393, y: 498, c: 'red' }, { id: 'map', x: 1428, y: 150, c: 'red' },
  { id: 'file', x: 1574, y: 684, c: 'brass' }
];
const LINKS = [['portrait', 'born'], ['portrait', 'map'], ['born', 'ips'], ['map', 'kc'], ['ips', 'nsa'], ['kc', 'file']];
function pinSVG(c, i) {
  if (c === 'brass') return `<svg viewBox="0 0 36 40" width="36" height="40"><defs><radialGradient id="br${i}" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="#fff2c4"/><stop offset=".35" stop-color="#d9b25c"/><stop offset=".8" stop-color="#8a6420"/><stop offset="1" stop-color="#5a3f12"/></radialGradient><filter id="bs${i}"><feGaussianBlur stdDeviation="1.6"/></filter></defs><ellipse cx="18" cy="24" rx="11" ry="6" fill="rgba(0,0,0,.55)" filter="url(#bs${i})"/><circle cx="14" cy="18" r="10" fill="url(#br${i})"/><circle cx="14" cy="18" r="10" fill="none" stroke="rgba(60,40,10,.6)" stroke-width=".8"/><circle cx="14" cy="18" r="2" fill="#6b4b17"/></svg>`;
  return `<svg viewBox="0 0 36 40" width="36" height="40"><defs><radialGradient id="pr${i}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ff8a7d"/><stop offset=".28" stop-color="#e0262b"/><stop offset=".75" stop-color="#9c0f14"/><stop offset="1" stop-color="#5e070b"/></radialGradient><linearGradient id="pc${i}" x1="0" x2="1"><stop offset="0" stop-color="#7a0c10"/><stop offset=".5" stop-color="#c41b20"/><stop offset="1" stop-color="#6a0a0d"/></linearGradient><filter id="ps${i}"><feGaussianBlur stdDeviation="2"/></filter></defs><ellipse cx="21" cy="29" rx="10" ry="6" fill="rgba(0,0,0,.55)" filter="url(#ps${i})"/><path d="M14 22 L17 30" stroke="#c9ccd0" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="14" cy="21" rx="7" ry="3.4" fill="url(#pc${i})"/><rect x="9.5" y="15" width="9" height="6" fill="url(#pc${i})"/><circle cx="14" cy="13" r="9.5" fill="url(#pr${i})"/><ellipse cx="10.6" cy="9.4" rx="3.2" ry="2" fill="rgba(255,255,255,.55)" transform="rotate(-30 10.6 9.4)"/></svg>`;
}
function buildPins() {
  $('#pins').innerHTML = PINS.map((p, i) => `<div class="pin" style="left:${p.x}px;top:${p.y}px;transition-delay:${(REDUCE ? 0 : 1100 + i * 120)}ms">${pinSVG(p.c, i)}</div>`).join('');
}
function buildStrings() {
  const at = id => PINS.find(p => p.id === id);
  let sh = '', st = '';
  LINKS.forEach(([a, b]) => {
    const A = at(a), B = at(b); const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, d = Math.hypot(B.x - A.x, B.y - A.y);
    const path = `M${A.x} ${A.y} Q${mx} ${my + d * .07} ${B.x} ${B.y}`;
    sh += `<path class="sh" d="M${A.x + 5} ${A.y + 8} Q${mx + 6} ${my + d * .07 + 10} ${B.x + 5} ${B.y + 8}"/>`;
    st += `<path class="s" d="${path}"/><path class="h" d="${path}"/>`;
  });
  $('#str-sh').innerHTML = sh; $('#str').innerHTML = st;
}
function drawStrings(delay) {
  const paths = $$('#strings path');
  paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = p.classList.contains('h') ? '2 4' : `${L} ${L}`; if (!p.classList.contains('h')) p.style.strokeDashoffset = REDUCE ? 0 : L; p.style.opacity = REDUCE ? 1 : 0; });
  if (REDUCE) return;
  setTimeout(() => {
    LINKS.forEach((_, i) => {
      const group = paths.filter((p, j) => j === i || j === LINKS.length + i * 2 || j === LINKS.length + i * 2 + 1);
      setTimeout(() => group.forEach(p => { p.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.6,0,.3,1), opacity .4s'; p.style.opacity = 1; p.style.strokeDashoffset = 0; }), i * 260);
    });
  }, delay);
}

/* =================== map scrap (official boundary) =================== */
function drawMapScrap() {
  const cv = $('#mapc'), W = 300, H = 318, pr = prFor(2.5);
  cv.width = W * pr; cv.height = H * pr;
  const x = cv.getContext('2d'); x.setTransform(pr, 0, 0, pr, 0, 0);
  seed = 314;
  const pts = []; const j = (a) => (rnd() - .5) * a;
  for (let px = 4; px <= W - 4; px += 7) pts.push([px, 6 + j(8) + (rnd() < .15 ? 6 : 0)]);
  for (let py = 6; py <= H - 6; py += 9) pts.push([W - 5 + j(5), py]);
  for (let px = W - 4; px >= 4; px -= 6) pts.push([px, H - 7 + j(9) - (rnd() < .2 ? 7 : 0)]);
  for (let py = H - 6; py >= 6; py -= 9) pts.push([5 + j(5), py]);
  const torn = () => { x.beginPath(); pts.forEach((q, i) => i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); x.closePath(); };
  x.save(); torn(); x.fillStyle = '#efe5cb'; x.fill(); x.clip();
  x.globalAlpha = .55; x.fillStyle = x.createPattern(paperTex, 'repeat'); x.globalCompositeOperation = 'multiply'; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
  // sea hatching
  x.strokeStyle = 'rgba(70,105,130,.16)'; x.lineWidth = .7;
  for (let y = 0; y < H; y += 4) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
  const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const L0 = 66.5, L1 = 98.5, T = merc(37.6 * 1), B = merc(5.6);
  const P = (lon, lat) => [14 + (lon - L0) / (L1 - L0) * 272, 16 + (T - merc(lat)) / (T - B) * 290];
  // graticule
  x.setLineDash([2, 3]); x.strokeStyle = 'rgba(90,70,48,.25)'; x.lineWidth = .6;
  for (let lo = 70; lo <= 95; lo += 5) { const a = P(lo, 38), b = P(lo, 5); x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  for (let la = 10; la <= 35; la += 5) { const a = P(66, la), b = P(99, la); x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  x.setLineDash([]);
  // land
  MAPDATA.rings.forEach(r => { x.beginPath(); r.forEach(([lo, la], i) => { const q = P(lo, la); i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); }); x.closePath(); x.fillStyle = '#e8d8b2'; x.fill(); x.strokeStyle = '#4e3b27'; x.lineWidth = 1; x.stroke(); });
  // relief stipple on land
  x.fillStyle = 'rgba(110,80,45,.10)';
  for (let i = 0; i < 1400; i++) { const lo = 68 + rnd() * 29, la = 7 + rnd() * 30; if (!inIndia(lo, la)) continue; const q = P(lo, la); x.fillRect(q[0], q[1], 1, 1); }
  // labels
  x.fillStyle = '#3b2e20'; x.font = '400 11px "Special Elite", monospace'; x.textAlign = 'center';
  let q = P(78.5, 21); x.fillText('I N D I A', q[0], q[1]);
  x.font = 'italic 400 10px "Special Elite", monospace'; x.fillStyle = 'rgba(50,70,90,.8)';
  q = P(69.5, 15); x.fillText('Arabian Sea', q[0], q[1]); q = P(88.5, 15.5); x.fillText('Bay of Bengal', q[0], q[1]);
  // New Delhi
  q = P(77.21, 28.61); x.fillStyle = '#2a2016'; x.beginPath(); x.arc(q[0], q[1], 2.4, 0, 6.283); x.fill();
  x.font = '400 10.5px "Special Elite", monospace'; x.textAlign = 'right'; x.fillText('New Delhi', q[0] - 5, q[1] + 11);
  // red marker circle around Pauri Garhwal
  const g = P(78.78, 30.15);
  x.strokeStyle = 'rgba(178,20,26,.88)'; x.lineWidth = 2.2; x.lineCap = 'round';
  x.beginPath();
  for (let a = 0; a <= 6.283 * 1.85; a += .08) { const rr = 13 + Math.sin(a * 1.7) * 1.6 + a * .35; const px2 = g[0] + Math.cos(a - .6) * rr * 1.25, py2 = g[1] + Math.sin(a - .6) * rr * .9; a ? x.lineTo(px2, py2) : x.moveTo(px2, py2); }
  x.stroke();
  x.font = '700 17px "Kalam", cursive'; x.fillStyle = 'rgba(178,20,26,.92)'; x.textAlign = 'left';
  x.save(); x.translate(g[0] + 30, g[1] - 26); x.rotate(-.12); x.fillText('born here, 1945', 0, 0); x.restore();
  x.beginPath(); x.moveTo(g[0] + 34, g[1] - 20); x.quadraticCurveTo(g[0] + 26, g[1] - 10, g[0] + 18, g[1] - 7); x.stroke();
  x.beginPath(); x.moveTo(g[0] + 18, g[1] - 7); x.lineTo(g[0] + 25, g[1] - 7); x.moveTo(g[0] + 18, g[1] - 7); x.lineTo(g[0] + 22, g[1] - 13); x.stroke();
  // fold crease
  const cg = x.createLinearGradient(W * .5 - 6, 0, W * .5 + 6, 0); cg.addColorStop(0, 'rgba(0,0,0,0)'); cg.addColorStop(.5, 'rgba(60,40,20,.14)'); cg.addColorStop(.52, 'rgba(255,255,255,.18)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = cg; x.fillRect(W * .5 - 6, 0, 12, H);
  x.restore();
  torn(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = .8; x.stroke();
}
const G = MAPDATA.grid, GRAW = atob(G.b64);
function inIndia(lon, lat) { const gx = Math.floor((lon - G.lon0) / G.step), gy = Math.floor((G.lat1 - lat) / G.step); if (gx < 0 || gy < 0 || gx >= G.w || gy >= G.h) return false; const i = gy * G.w + gx; return ((GRAW.charCodeAt(i >> 2) >> ((i & 3) * 2)) & 3) === 2; }

/* =================== pencil sketch =================== */
const SK_W = 656, SK_H = 872;
function boxBlur(a, w, h, r) {
  const b = new Float32Array(w * h), n = 2 * r + 1;
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) { const row = y * w; let acc = 0; for (let k = -r; k <= r; k++) acc += a[row + clamp(k, 0, w - 1)]; for (let x = 0; x < w; x++) { b[row + x] = acc / n; acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let acc = 0; for (let k = -r; k <= r; k++) acc += b[clamp(k, 0, h - 1) * w + x]; for (let y = 0; y < h; y++) { a[y * w + x] = acc / n; acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]; } }
  }
  return a;
}
function hatchMap(angle, count, seedV) {
  const c = document.createElement('canvas'); c.width = SK_W; c.height = SK_H; const x = c.getContext('2d');
  seed = seedV; x.strokeStyle = '#000'; x.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const a = angle + (rnd() - .5) * .22, l = 10 + rnd() * 22, px = rnd() * SK_W, py = rnd() * SK_H;
    x.globalAlpha = .25 + rnd() * .55; x.lineWidth = .6 + rnd() * .9;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
  }
  const d = x.getImageData(0, 0, SK_W, SK_H).data, out = new Float32Array(SK_W * SK_H);
  for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3] / 255;
  return out;
}
let H1 = null, H2 = null;
function sketchFrom(src) {
  if (!H1) { H1 = hatchMap(-0.85, 9000, 11); H2 = hatchMap(0.75, 6000, 23); }
  const W = SK_W, H = SK_H, N = W * H;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height;
  const r = Math.max(W / sw, H / sh), dw = sw * r, dh = sh * r;
  x.drawImage(src, (W - dw) / 2, (H - dh) * 0.22, dw, dh);
  const px = x.getImageData(0, 0, W, H).data;
  const g = new Float32Array(N);
  const hist = new Uint32Array(256);
  for (let i = 0; i < N; i++) { const v = .299 * px[i * 4] + .587 * px[i * 4 + 1] + .114 * px[i * 4 + 2]; g[i] = v; hist[v | 0]++; }
  let lo = 0, hi = 255, acc = 0; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > N * .01) { lo = v; break; } }
  acc = 0; for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > N * .01) { hi = v; break; } }
  const span = Math.max(30, hi - lo);
  for (let i = 0; i < N; i++) g[i] = clamp((g[i] - lo) / span * 255, 0, 255);
  const inv = new Float32Array(N); for (let i = 0; i < N; i++) inv[i] = 255 - g[i];
  boxBlur(inv, W, H, Math.max(3, Math.round(W * 0.011)));
  const alpha = new Float32Array(N), when = new Float32Array(N);
  seed = 99;
  for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
    const i = y * W + xx;
    const den = 255 - inv[i]; const s = den <= 0.5 ? 255 : Math.min(255, g[i] * 255 / den);
    let line = 1 - s / 255; line = Math.min(1, Math.pow(line * 2.1, 1.2));
    const tone = Math.pow(1 - g[i] / 255, 1.5);
    let dark = Math.max(line, tone * (.18 + .55 * H1[i]) + Math.max(0, tone - .42) * H2[i] * .75);
    const ex = (xx - W / 2) / (W * .54), ey = (y - H * .42) / (H * .6);
    const e = ex * ex + ey * ey + (H1[i] - .3) * .22;
    dark *= 1 - smooth(.62, 1.05, e);
    alpha[i] = clamp(dark, 0, 1);
    when[i] = clamp(.08 + .5 * (y / H) + .3 * rnd() - .4 * line, 0, 1);
  }
  return { alpha, when };
}
function blankSketch() {
  // an empty, lightly pencil-shaded frame shown until a real photo is added
  if (!H1) { H1 = hatchMap(-0.85, 9000, 11); H2 = hatchMap(0.75, 6000, 23); }
  const W = SK_W, H = SK_H, N = W * H, alpha = new Float32Array(N), when = new Float32Array(N);
  seed = 7;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, ex = (x - W / 2) / (W * .5), ey = (y - H * .46) / (H * .52);
    const e = ex * ex + ey * ey + (H1[i] - .3) * .3;
    alpha[i] = (.06 + .2 * H1[i] + .08 * H2[i]) * (1 - smooth(.35, 1.0, e)) * (1 - .55 * smooth(.0, .3, 1 - e));
    when[i] = clamp(.1 + .6 * (y / H) + .25 * rnd(), 0, 1);
  }
  return { alpha, when };
}
const skC = $('#sketch'), skX = skC.getContext('2d');
skC.width = SK_W; skC.height = SK_H;
let skImg = null, skAnim = 0;
function showSketch(data, animate) {
  const W = SK_W, H = SK_H, N = W * H;
  if (!skImg) skImg = skX.createImageData(W, H);
  const d = skImg.data;
  for (let i = 0; i < N; i++) { d[i * 4] = 46; d[i * 4 + 1] = 48; d[i * 4 + 2] = 54; }
  cancelAnimationFrame(skAnim);
  const paint = p => { for (let i = 0; i < N; i++) d[i * 4 + 3] = data.alpha[i] * 240 * clamp((p - data.when[i]) / .12, 0, 1); skX.putImageData(skImg, 0, 0); };
  if (!animate || REDUCE) { paint(2); syncExhibitSketch(); return; }
  const t0 = performance.now(), D = 2800;
  const step = now => { const k = (now - t0) / D; paint(k * 1.15); if (k < 1) skAnim = requestAnimationFrame(step); else syncExhibitSketch(); };
  skAnim = requestAnimationFrame(step);
}
function loadPhoto(url, credit, animate) {
  const im = new Image();
  im.onload = () => { $('#p-portrait').classList.add('has-photo'); $('#credit').textContent = credit || 'pencil sketch from photograph'; showSketch(sketchFrom(im), animate); };
  im.src = url;
}
const STORE_KEY = 'aqg-portrait-v1';
function savedPhoto() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
function takeFile(file) {
  if (!file || !/^image\//.test(file.type)) return;
  const fr = new FileReader();
  fr.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 1100 / Math.max(im.width, im.height)); const c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', .88);
      try { localStorage.setItem(STORE_KEY, url); } catch (e) { /* storage full or blocked: the sketch still shows for now */ }
      loadPhoto(url, '', true);
    };
    im.src = fr.result;
  };
  fr.readAsDataURL(file);
}
const photoInput = $('#photo-input');
skC.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', () => { takeFile(photoInput.files[0]); photoInput.value = ''; });
function syncExhibitSketch() {
  const c = $('#sk2'), x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);
  const r = Math.max(c.width / SK_W, c.height / SK_H), w = SK_W * r, h = SK_H * r;
  x.drawImage(skC, (c.width - w) / 2, (c.height - h) * .3, w, h);
  document.body.classList.toggle('has-photo-all', $('#p-portrait').classList.contains('has-photo'));
}
$('#sk2').addEventListener('click', () => photoInput.click());
stage.addEventListener('dragover', e => { if (cur === 0) e.preventDefault(); });
stage.addEventListener('drop', e => { if (cur !== 0) return; e.preventDefault(); takeFile(e.dataTransfer.files[0]); });

/* =================== lamp dust =================== */
const dust = $('#dust'), dx = dust.getContext('2d');
const motes = Array.from({ length: 110 }, () => ({ x: 600 + Math.random() * 900, y: Math.random() * 900, r: .6 + Math.random() * 1.8, vx: (Math.random() - .5) * .12, vy: -.05 - Math.random() * .12, a: Math.random() }));
function drawDust(t) {
  dx.clearRect(0, 0, 1600, 900);
  for (const m of motes) {
    m.x += m.vx + Math.sin(t * .0004 + m.a * 9) * .08; m.y += m.vy;
    if (m.y < -10) { m.y = 910; m.x = 600 + Math.random() * 900; }
    const cx = 960 + (m.y - 0) * .08, w = 260 + m.y * .55; const inBeam = 1 - smooth(.55, 1, Math.abs(m.x - cx) / w);
    const a = inBeam * (.25 + .35 * Math.sin(t * .001 + m.a * 20) ** 2);
    if (a < .02) continue;
    dx.globalAlpha = a; dx.fillStyle = '#ffe2b0'; dx.beginPath(); dx.arc(m.x, m.y, m.r, 0, 6.283); dx.fill();
  }
  dx.globalAlpha = 1;
}

/* =================== documentary camera =================== */
let camT0 = performance.now(), px = 0, py = 0, spx = 0, spy = 0, wx = 0, wy = 0, lastWeave = 0;
const warm = $('.light-warm');
function frame(now) {
  const t = (now - camT0) / 1000;
  const k = REDUCE ? 1 : easeOut(clamp((t - .4) / 3.6, 0, 1));
  const drift = REDUCE ? 0 : (Math.sin(t * .045 - 1.57) + 1) / 2 * .028 * k;
  spx += (px - spx) * .04; spy += (py - spy) * .04;
  if (!REDUCE && now - lastWeave > 84) { wx = (Math.random() - .5) * .7; wy = (Math.random() - .5) * .7; lastWeave = now; }
  const sc = 1.075 - .075 * k + drift;
  cam.style.transform = `translate(${(-14 * (1 - k) - spx * 10 + wx).toFixed(2)}px,${(-10 * (1 - k) - spy * 7 + wy).toFixed(2)}px) scale(${sc.toFixed(4)})`;
  if (!REDUCE) { warm.style.opacity = (.94 + Math.sin(t * 7.3) * .02 + Math.sin(t * 2.1) * .03).toFixed(3); drawDust(now); }
  if (!document.hidden) requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(frame); });
stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5; });
stage.addEventListener('pointerleave', () => { px = py = 0; });

/* =================== stage scaling =================== */
function fit() { S = Math.min(innerWidth / 1600, innerHeight / 900); stage.style.transform = `translate(-50%,-50%) scale(${S})`; }

/* =================== navigation =================== */
let cur = 0, busy = false;
const N = PAGES.length;
function updateChrome() {
  const p = PAGES[cur];
  $('#part').textContent = 'Part ' + ['I', 'II', 'III'][p.m - 1];
  $('#secname').textContent = p.t;
  $('#count').innerHTML = `<b>${String(cur + 1).padStart(2, '0')}</b> / ${N}`;
  $('#prog').style.width = ((cur + 1) / N * 100) + '%';
  $('#notes-h').textContent = `Slide ${String(cur + 1).padStart(2, '0')} · ${p.t} · Member ${p.m}`;
  $('#notes-p').textContent = NOTES[cur];
}
const fade = $('#fade');
const sceneBoard = $('#scene-board'), sceneFile = $('#scene-file');
const wrap = $('#folder-wrap'), cover = $('#cover');
const later = (ms, fn) => setTimeout(fn, REDUCE ? 0 : ms);
function fadeTo(v, ms) { fade.style.transition = REDUCE ? 'none' : `opacity ${ms}ms ease`; fade.style.opacity = v; }

/* typewriter: split a heading into slightly uneven characters, then strike them one by one */
function prepType(el) {
  if (el.dataset.ready) return;
  const txt = el.textContent; el.textContent = '';
  for (const ch of txt) {
    if (ch === '|') { el.appendChild(document.createElement('br')); continue; }
    const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
    s.style.setProperty('--o', (.78 + Math.random() * .22).toFixed(2));
    s.style.transform = `translateY(${((Math.random() - .5) * 1.4).toFixed(2)}px) rotate(${((Math.random() - .5) * 1.2).toFixed(2)}deg)`;
    el.appendChild(s);
  }
  el.dataset.ready = 1;
}
let typeTimers = [];
function playType(el) {
  prepType(el);
  const chs = $$('.ch', el);
  if (REDUCE) { el.classList.add('static'); return; }
  chs.forEach(c => c.classList.remove('on'));
  chs.forEach((c, i) => typeTimers.push(setTimeout(() => c.classList.add('on'), 150 + i * 34)));
}
function measureDraws(root) { $$('.draw', root).forEach(p => { if (!p.style.getPropertyValue('--len')) p.style.setProperty('--len', Math.ceil(p.getTotalLength() + 2)); }); }

function enterPage(i) {
  const pg = pageFor(i); if (!pg) return;
  $$('[data-type]', pg).forEach(playType);
  measureDraws(pg);
  $$('.hw', pg).forEach((h, k) => { h.style.transitionDelay = (REDUCE ? 0 : 1300 + k * 160) + 'ms'; });
  $$('.draw', pg).forEach((d, k) => { d.style.transitionDelay = (REDUCE ? 0 : 2300 + k * 350) + 'ms'; });
  requestAnimationFrame(() => pg.classList.add('play'));
  const ex = $('.exhibits[data-for="1"]');
  if (i === 1) { syncExhibitSketch(); measureDraws(ex); $$('.draw', ex).forEach((d, k) => { d.style.transitionDelay = (REDUCE ? 0 : 600 + k * 180) + 'ms'; }); requestAnimationFrame(() => ex.classList.add('play')); }
}
function leavePage(i) {
  typeTimers.forEach(clearTimeout); typeTimers = [];
  const pg = pageFor(i); if (pg) pg.classList.remove('play');
  $('.exhibits[data-for="1"]').classList.remove('play');
}
function showExhibits(i) {
  $$('.exhibits').forEach(e => e.classList.toggle('on', i === 1 ? e.dataset.for === '1' : e.dataset.for === 'index'));
  $$('#index-list li').forEach(li => li.classList.toggle('cur', +li.dataset.i === i));
}
function setPages(i, instant) {
  if (instant) pagesEl.classList.add('notrans');
  pageEls.forEach(p => {
    const k = +p.dataset.i, gone = k < i;
    p.style.transitionDelay = instant ? '0ms' : (Math.abs(k - cur) * 70) + 'ms';
    p.classList.toggle('gone', gone);
  });
  if (instant) { void pagesEl.offsetWidth; pagesEl.classList.remove('notrans'); }
}
function openFile(n) {
  busy = true;
  leavePage(cur);
  fadeTo(1, 420);
  later(440, () => {
    stage.classList.add('infile');
    sceneBoard.classList.remove('on'); sceneFile.classList.add('on');
    wrap.classList.add('notrans'); cover.classList.add('notrans');
    wrap.classList.remove('in', 'opened'); cover.classList.remove('open');
    void wrap.offsetWidth; wrap.classList.remove('notrans'); cover.classList.remove('notrans');
    cur = n; updateChrome(); setPages(n, true); showExhibits(n);
    fadeTo(0, 520);
    later(120, () => wrap.classList.add('in'));
    later(1150, () => { wrap.classList.add('opened', 'opening'); cover.classList.add('open'); });
    later(2400, () => { wrap.classList.remove('opening'); enterPage(n); busy = false; });
  });
}
function closeFile() {
  busy = true;
  leavePage(cur);
  wrap.classList.add('closing'); cover.classList.remove('open'); wrap.classList.remove('opened');
  later(1250, () => { wrap.classList.remove('in', 'closing'); });
  later(1700, () => {
    fadeTo(1, 380);
    later(400, () => {
      stage.classList.remove('infile');
      sceneFile.classList.remove('on'); sceneBoard.classList.add('on');
      cur = 0; updateChrome();
      fadeTo(0, 600);
      busy = false;
    });
  });
}
function go(n) {
  if (n === 'next') n = cur + 1; else if (n === 'prev') n = cur - 1;
  n = clamp(n, 0, N - 1);
  if (n === cur || busy) return;
  if (cur === 0) { openFile(n); return; }
  if (n === 0) { closeFile(); return; }
  busy = true;
  leavePage(cur);
  setPages(n, false);
  cur = n; updateChrome(); showExhibits(n);
  later(950, () => { enterPage(n); busy = false; });
}
$('#open-file').addEventListener('click', () => go(1));
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
const notes = $('#notes'), menu = $('#menu');
const toggleNotes = () => { notes.hidden = !notes.hidden; };
const toggleMenu = open => { menu.hidden = open === undefined ? !menu.hidden : !open; };
$('#btn-notes').addEventListener('click', toggleNotes);
$('#btn-menu').addEventListener('click', () => toggleMenu());
$('#menu-close').addEventListener('click', () => toggleMenu(false));
$('#menu-grid').addEventListener('click', e => { const b = e.target.closest('button[data-to]'); if (!b) return; toggleMenu(false); go(+b.dataset.to); });
function fullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen && document.exitFullscreen();
    else { const p = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); p && p.catch && p.catch(() => {}); }
  } catch (e) { /* not available in this view */ }
}
$('#btn-fs').addEventListener('click', fullscreen);
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key, onBtn = e.target.closest && e.target.closest('button');
  if (k === 'ArrowRight' || k === 'PageDown' || ((k === ' ' || k === 'Enter') && !onBtn)) { e.preventDefault(); go('next'); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go('prev'); }
  else if (k === 'Home') go(0);
  else if (k === 'End') go(N - 1);
  else if (k === 'f' || k === 'F') fullscreen();
  else if (k === 'n' || k === 'N') toggleNotes();
  else if (k === 'm' || k === 'M') toggleMenu();
  else if (k === 'Escape') { notes.hidden = true; toggleMenu(false); }
});

/* =================== intro =================== */
function intro() {
  const lamp = $('#lamp');
  const title = $('#s1');
  if (REDUCE) { lamp.style.opacity = 0; cam.classList.remove('pre'); title.classList.add('shown'); drawStrings(0); return; }
  $$('.prop').forEach((p, i) => { p.style.transitionDelay = (700 + i * 110) + 'ms'; });
  lamp.animate([{ opacity: 1 }, { opacity: .55, offset: .18 }, { opacity: .92, offset: .3 }, { opacity: .3, offset: .5 }, { opacity: .6, offset: .62 }, { opacity: 0 }], { duration: 1500, easing: 'linear', fill: 'forwards' });
  setTimeout(() => cam.classList.remove('pre'), 60);
  $$('[data-in]', title).forEach((el, i) => { el.style.transitionDelay = (1500 + i * 220) + 'ms'; });
  setTimeout(() => title.classList.add('shown'), 60);
  drawStrings(2500);
}

/* =================== boot =================== */
addEventListener('resize', fit);
fit();
updateChrome();
drawCork();
drawDesk();
buildPins();
buildStrings();
const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
fontsReady.then(() => Promise.all(['700 17px Kalam', '400 16px Kalam', '11px "Special Elite"'].map(f => document.fonts && document.fonts.load ? document.fonts.load(f).catch(() => {}) : 0))).then(() => {
  drawMapScrap();
  const stored = savedPhoto();
  if (EMBED_PHOTO) loadPhoto(EMBED_PHOTO, EMBED_CREDIT, true);
  else if (stored) setTimeout(() => loadPhoto(stored, '', true), REDUCE ? 0 : 1300);
  else setTimeout(() => showSketch(blankSketch(), true), REDUCE ? 0 : 1300);
});
intro();
requestAnimationFrame(frame);
})();
