/* Sheets 04-15 of the case file (right page) and the exhibits clipped inside the cover (left).
   {{HEAD}} is replaced with the sheet header by deck.js. Positions are in page pixels (646 x 700)
   and cover pixels (690 x 744). */
(function () {
const clip = (l, r) => `<svg class="clip" style="${r ? 'left:auto;right:' + r + 'px' : 'left:' + (l || 40) + 'px'}" viewBox="0 0 30 84"><path d="M8 66V14a7 7 0 0 1 14 0v58a10 10 0 0 1-20 0V22" fill="none" stroke="url(#steel)" stroke-width="3" stroke-linecap="round"/></svg>`;
const lesson = (t, wide, top) => wide
  ? `<div class="lesson wide" style="top:${top || 640}px"><span class="st">Lesson</span><p class="hw">${t}</p></div>`
  : `<div class="lesson" style="top:${top || 540}px"><span class="st">Lesson</span><p class="hw">${t}</p></div>`;
const tick = '<span class="tk hw">✓</span>';
/* a real photograph printed with a white border; hidden until its image is available */
const photo = (key, l, t, w, h, r, cap, clipR) => `<figure class="photo-print" data-photo="${key}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;transform:rotate(${r}deg)">${clipR === undefined ? '' : clip(0, clipR)}<div class="pimg"><img alt="${cap}"></div><figcaption>${cap}</figcaption></figure>`;
window.DOVAL_PHOTO = photo;

/* ---------- small illustrations (hand-made, illustrative only) ---------- */
const xbox = (k) => `<div class="day"><small>Day ${k}</small><svg viewBox="0 0 60 60"><path class="draw" d="M10 12 C 24 26, 38 40, 50 50"/><path class="draw" d="M50 10 C 36 24, 24 38, 10 50"/></svg></div>`;
const tally = n => { let s = '', x = 6; for (let g = 0; g < Math.ceil(n / 5); g++) { const c = Math.min(5, n - g * 5); for (let i = 0; i < Math.min(4, c); i++) s += `<path class="draw" d="M${x + i * 12} 8 C ${x + i * 12 + 1} 30, ${x + i * 12 - 1} 50, ${x + i * 12} 70"/>`; if (c === 5) s += `<path class="draw" d="M${x - 6} 60 C ${x + 14} 44, ${x + 34} 28, ${x + 46} 16"/>`; x += 66; } return `<svg class="tally" viewBox="0 0 ${x} 80">${s}</svg>`; };
const chakra = (cx, cy, r, col) => { let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${r * .12}"/><circle cx="${cx}" cy="${cy}" r="${r * .18}" fill="${col}"/>`; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; s += `<line x1="${(cx + Math.cos(a) * r * .18).toFixed(1)}" y1="${(cy + Math.sin(a) * r * .18).toFixed(1)}" x2="${(cx + Math.cos(a) * r * .94).toFixed(1)}" y2="${(cy + Math.sin(a) * r * .94).toFixed(1)}" stroke="${col}" stroke-width="${r * .045}"/>`; } return s; };
const wreath = (cx, cy, r, col) => { let s = ''; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; s += `<ellipse cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" rx="${r * .16}" ry="${r * .07}" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)})" fill="${col}"/>`; } return s; };
function medal(kind, id) {
  const rib = kind === 'kirti' ? `<rect x="30" y="0" width="60" height="70" fill="#1f7a3a"/><rect x="48" y="0" width="7" height="70" fill="#ef8a26"/><rect x="65" y="0" width="7" height="70" fill="#ef8a26"/>`
    : kind === 'police' ? `<rect x="30" y="0" width="60" height="70" fill="#1d2f6b"/><rect x="40" y="0" width="5" height="70" fill="#e9e3d2"/><rect x="75" y="0" width="5" height="70" fill="#e9e3d2"/><rect x="57" y="0" width="6" height="70" fill="#b3171d"/>`
      : `<rect x="30" y="0" width="60" height="70" fill="#7a1418"/><rect x="56" y="0" width="8" height="70" fill="#d7b26a"/>`;
  const metal = kind === 'kirti' ? ['#ffffff', '#cfd4d8', '#7d858c'] : kind === 'police' ? ['#fff0d8', '#c58a4a', '#6b4320'] : ['#fff6cf', '#d9b04c', '#7a5a14'];
  const face = kind === 'kirti' ? chakra(60, 128, 22, '#6f777e') + wreath(60, 128, 38, '#8b939a')
    : kind === 'police' ? `<path d="M60 100 L67 120 L88 120 L71 132 L78 152 L60 140 L42 152 L49 132 L32 120 L53 120 Z" fill="#7a4d22" opacity=".8"/>` + wreath(60, 128, 38, '#8a5a2a')
      : `<text x="60" y="136" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-weight="700" font-size="24" fill="#6e5112">2026</text>` + wreath(60, 128, 38, '#9a7a28');
  return `<svg class="medal" viewBox="0 0 120 180"><defs><radialGradient id="m${id}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${metal[0]}"/><stop offset=".45" stop-color="${metal[1]}"/><stop offset="1" stop-color="${metal[2]}"/></radialGradient><linearGradient id="r${id}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
    <g>${rib}<rect x="30" y="0" width="60" height="70" fill="url(#r${id})"/></g><rect x="40" y="68" width="40" height="10" rx="3" fill="url(#m${id})"/><circle cx="60" cy="128" r="50" fill="url(#m${id})"/><circle cx="60" cy="128" r="46" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>${face}<ellipse cx="44" cy="104" rx="14" ry="7" fill="rgba(255,255,255,.45)" transform="rotate(-35 44 104)"/></svg>`;
}
const ear = `<svg class="ear" viewBox="0 0 200 300"><g class="pencil">
  <path class="draw" d="M70 28 C 120 4, 172 40, 164 112 C 158 162, 122 176, 116 214 C 110 252, 88 276, 64 268 C 40 260, 44 232, 58 214"/>
  <path class="draw" d="M80 64 C 118 48, 140 84, 128 124 C 120 150, 98 154, 92 176"/>
  <path class="draw" d="M86 122 C 74 132, 76 152, 94 158"/>
  <path class="draw" d="M48 118 C 60 112, 64 136, 52 142"/>
  <path class="draw" d="M70 28 C 56 40, 50 70, 52 100"/></g>
  <circle cx="72" cy="248" r="3.4" fill="#2b2b2b"/><path class="draw red" d="M48 232 C 50 212, 96 210, 100 236 C 104 262, 58 272, 50 252 C 46 240, 52 230, 60 226"/></svg>`;
const stopwatch = () => { let t = ''; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2 - Math.PI / 2, r1 = i % 5 ? 104 : 96; t += `<line x1="${(150 + Math.cos(a) * r1).toFixed(1)}" y1="${(170 + Math.sin(a) * r1).toFixed(1)}" x2="${(150 + Math.cos(a) * 112).toFixed(1)}" y2="${(170 + Math.sin(a) * 112).toFixed(1)}" stroke="#2b261f" stroke-width="${i % 5 ? 1 : 2.4}"/>`; }
  const a23 = 23 / 60 * Math.PI * 2 - Math.PI / 2, ex = 150 + Math.cos(a23) * 84, ey = 170 + Math.sin(a23) * 84;
  return `<svg class="watch" viewBox="0 0 300 320"><defs><radialGradient id="wface" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#e2dac6"/></radialGradient><linearGradient id="wcase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset=".5" stop-color="#9aa1a7"/><stop offset="1" stop-color="#4c5257"/></linearGradient></defs>
    <rect x="136" y="18" width="28" height="26" rx="4" fill="url(#wcase)"/><circle cx="150" cy="170" r="130" fill="url(#wcase)"/><circle cx="150" cy="170" r="118" fill="url(#wface)"/>${t}
    <path class="draw red" d="M150 82 A 88 88 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" style="stroke-width:9;stroke-linecap:butt;opacity:.85"/>
    <line x1="150" y1="170" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#1b1813" stroke-width="3.5" stroke-linecap="round"/><circle cx="150" cy="170" r="7" fill="#1b1813"/>
    <text x="150" y="228" text-anchor="middle" font-family="Special Elite,Courier New,monospace" font-size="22" fill="#1b1813">23 MIN</text></svg>`; };
const chess = () => { let s = ''; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) s += `<rect x="${c * 40}" y="${r * 40}" width="40" height="40" fill="${(r + c) % 2 ? '#bda57a' : '#efe6cf'}"/>`;
  const pc = (g, c, r, col) => `<text x="${c * 40 + 20}" y="${r * 40 + 31}" text-anchor="middle" font-size="31" fill="${col}" style="font-family:'Segoe UI Symbol','DejaVu Sans','Noto Sans Symbols2',serif">${g}</text>`;
  s += pc('♚', 6, 1, '#1b1813') + pc('♟', 5, 2, '#1b1813') + pc('♟', 6, 2, '#1b1813') + pc('♟', 7, 2, '#1b1813') + pc('♜', 3, 0, '#1b1813') + pc('♞', 2, 2, '#1b1813');
  s += pc('♔', 4, 7, '#7a1418') + pc('♙', 3, 6, '#7a1418') + pc('♙', 4, 6, '#7a1418') + pc('♙', 5, 6, '#7a1418') + pc('♘', 4, 4, '#7a1418') + pc('♖', 0, 7, '#7a1418');
  return `<svg class="chess" viewBox="-4 -4 328 328"><rect x="-4" y="-4" width="328" height="328" fill="#3a2a18"/>${s}<path class="draw red" d="M180 180 C 190 140, 200 120, 212 106" style="stroke-width:4"/><path class="draw red" d="M212 106 L 198 112 M212 106 L 214 121" style="stroke-width:4"/><circle class="draw red" cx="220" cy="100" r="24" style="stroke-width:3;fill:none"/></svg>`; };

window.DOVAL_SHEETS = {
/* ---------- 04 · the young officer ---------- */
3: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · the young officer</p>
  <h2 class="big" data-type>A riot ended|in one week</h2>
  <h3 class="sec" style="top:212px">Incident report</h3>
  <dl class="kv" style="top:240px">
    <dt>Place</dt><dd>Thalassery, Kerala</dd>
    <dt>When</dt><dd>Late 1971 into early 1972</dd>
    <dt>Cause</dt><dd>A shoe thrown at a procession set off a communal riot.</dd>
    <dt>Officer</dt><dd>A. K. Doval, ASP, IPS 1968. Age 27, third year of service.</dd>
    <dt>Sent by</dt><dd>Kerala’s Home Minister</dd>
  </dl>
  <h3 class="sec" style="top:412px">Action taken</h3>
  <ul class="ticks" style="top:440px">
    <li>${tick}<b>Went in person</b> to every affected area.</li>
    <li>${tick}<b>Asked families to return home</b> and promised the looters would face justice.</li>
    <li>${tick}<b>Promised their stolen property would come back,</b> and kept his word.</li>
  </ul>
  <div class="result" style="top:590px"><span class="sec-i">Result</span><b class="hw">Controlled within one week</b><small>He stayed 4 more months to run law and order in the district, then joined the IB.</small></div>
  ${lesson('Show up in person. Promise only what you can deliver.', false, 584)}`,

/* ---------- 05 · into the shadows ---------- */
4: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · into the shadows</p>
  <h2 class="big" data-type>The spy who talked|rebels into peace</h2>
  <h3 class="sec" style="top:212px">Field posting</h3>
  <dl class="kv" style="top:240px">
    <dt>Place</dt><dd>Aizawl, Mizoram. Head of the Intelligence Bureau unit.</dd>
    <dt>Years</dt><dd>1972 to 1977: about five years, mostly undercover.</dd>
    <dt>Situation</dt><dd>Armed insurgency by the Mizo National Front under Laldenga.</dd>
  </dl>
  <h3 class="sec" style="top:362px">Six of seven</h3>
  <div class="cmdrs" style="top:390px">${[1, 2, 3, 4, 5, 6, 7].map(k => `<div class="cm"><small>Cmdr ${k}</small>${k === 7 ? '<em>stayed</em>' : '<b class="hw">won over</b>'}</div>`).join('')}</div>
  <p class="tp blk" style="top:470px">Reports say he persuaded six of Laldenga’s seven commanders to leave the fight, with conversations, not guns.</p>
  <h3 class="sec" style="top:530px">What followed</h3>
  <div class="trio" style="top:556px">
    <div><b>1974</b><span>Police Medal, the youngest officer ever to get it</span></div>
    <div><b>1975</b><span>A role in Sikkim joining India as the 22nd state</span></div>
    <div><b>1986</b><span>Mizoram Peace Accord, signed 30 June</span></div>
  </div>
  ${lesson('Win people over before you win the fight.', true, 650)}`,

/* ---------- 06 · behind enemy lines ---------- */
5: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · behind enemy lines</p>
  <h2 class="big" data-type>Seven years|in Pakistan</h2>
  <div class="twocol" style="top:212px">
    <div><h4>On record</h4><p><b>1983–1987:</b> Indian High Commission, Islamabad. Officially head of the commercial section.</p></div>
    <div><h4>Reported</h4><p>About <b>7 years</b> in Pakistan in total, partly living undercover in <b>Lahore</b>.</p></div>
  </div>
  <h3 class="sec" style="top:350px">The pierced ear · a story he has told himself</h3>
  <ol class="story" style="top:378px">
    <li>Near a shrine in Lahore, an old man with a white beard stopped him: <b>“You are a Hindu.”</b></li>
    <li>He had noticed Doval’s <b>pierced ears</b>, a Garhwali custom.</li>
    <li>Doval insisted he was Muslim. The old man admitted he was <b>a Hindu too</b>, hiding his identity, and told him to fix his ears.</li>
    <li>Doval later had <b>minor surgery</b> to hide the marks.</li>
  </ol>
  <p class="caveat" style="top:596px">Most details of these years have never been officially confirmed.</p>
  ${lesson('Small details decide big outcomes.', true, 646)}`,

/* ---------- 07 · operation black thunder ---------- */
6: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · Operation Black Thunder</p>
  <h2 class="big" data-type>Inside the|Golden Temple</h2>
  <dl class="kv" style="top:214px">
    <dt>Operation</dt><dd>Black Thunder II, Amritsar, 9–18 May 1988</dd>
    <dt>Situation</dt><dd>Armed militants took over the Golden Temple again, four years after Operation Blue Star.</dd>
    <dt>Goal</dt><dd>End the siege <b>without damaging the shrine.</b></dd>
  </dl>
  <h3 class="sec" style="top:356px">His role, as reported by biographers</h3>
  <ul class="ticks" style="top:384px">
    <li>${tick}Then a <b>Joint Director</b> in the Intelligence Bureau.</li>
    <li>${tick}<b>Entered the temple before the operation,</b> reportedly posing as a sympathiser of Pakistan’s spy agency, the ISI.</li>
    <li>${tick}Mapped the militants’ <b>numbers, weapons and positions</b> and passed it all to the NSG commandos.</li>
  </ul>
  <div class="result" style="top:560px;width:550px"><span class="sec-i">Outcome</span><b class="hw">Militants surrendered, 18 May 1988</b><small>In front of the media. Doval has never spoken publicly about what he did inside.</small></div>
  ${lesson('Real courage doesn’t need an audience.', true, 650)}`,

/* ---------- 08 · the negotiator ---------- */
7: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · the negotiator</p>
  <h2 class="big" data-type>Talking down hijackers|and militants</h2>
  <div class="twocol" style="top:212px">
    <div><h4>Hijackings, 1971–1999</h4><p class="bignum hw">15 / 15</p><p>He was involved in ending <b>all 15</b> hijackings of Indian Airlines planes.</p></div>
    <div><h4>Kashmir and Punjab</h4><p><b>1990s:</b> reportedly brought militant Kuka Parray’s group to India’s side, which helped make the <b>1996 J&amp;K elections</b> possible.</p><p><b>1991:</b> led the rescue of a Romanian diplomat kidnapped by militants in Punjab.</p></div>
  </div>
  <h3 class="sec" style="top:418px">IC-814 · Kandahar, December 1999</h3>
  <dl class="kv log" style="top:446px">
    <dt>24 Dec</dt><dd>Kathmandu–Delhi flight hijacked, taken to Kandahar.</dd>
    <dt>27 Dec</dt><dd>Doval flies to Kandahar as one of India’s negotiators.</dd>
    <dt>Demands</dt><dd><s class="strike">36 militants and $200 million</s> <b class="hw down">→ 3 militants</b></dd>
    <dt>31 Dec</dt><dd>All hostages freed.</dd>
  </dl>
  <p class="caveat red" style="top:602px">He later called it a failure: one released man, Masood Azhar, went on to found Jaish-e-Mohammed.</p>
  ${lesson('Stay calm at the table, and own the results.', true, 656)}`,

/* ---------- 09 · at the top ---------- */
8: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · at the top</p>
  <h2 class="big" data-type>From field agent|to India’s spy chief</h2>
  <h3 class="sec" style="top:212px">Career ladder</h3>
  <div class="ladder" style="top:246px">
    <div class="step" style="--h:46px"><b>1972</b><span>Joins the IB</span></div>
    <div class="step" style="--h:86px"><b>1992–96</b><span>India House, London</span></div>
    <div class="step" style="--h:126px"><b>10+ years</b><span>Head, IB operations wing</span></div>
    <div class="step" style="--h:166px"><b>Founder</b><span>Multi Agency Centre and JTFI</span></div>
    <div class="step peak" style="--h:206px"><b>2004</b><span>Director, Intelligence Bureau</span></div>
  </div>
  <p class="tp blk" style="top:470px"><b>31 Jan 2005:</b> retired after more than 33 years in intelligence.</p>
  <div class="sticky" style="top:512px"><i class="tape"></i><h4 class="hw">Retired, but not resting</h4><p class="hw">2009: founding director of the Vivekananda International Foundation, a Delhi think tank. Helped set up Rashtriya Raksha University.</p></div>
  ${lesson('Great leaders build systems, not just success stories.', false, 530)}`,

/* ---------- 10 · the doval doctrine ---------- */
9: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · the doctrine</p>
  <h2 class="big" data-type>Defensive|offence</h2>
  <p class="tp blk" style="top:212px">Lecture notes · <b>February 2014</b> · SASTRA University. Three ways to deal with a hostile neighbour:</p>
  <div class="opts" style="top:268px">
    <div class="opt"><i class="box-c"></i><b>1. Defensive</b><span>Guard the border and wait to be attacked. India’s old approach.</span></div>
    <div class="opt pick"><i class="box-c"><svg viewBox="0 0 30 30"><path class="draw" d="M5 15 L12 23 L27 4"/></svg></i><b>2. Defensive offence</b><span>Hit the threat at its source, where the enemy is weak.</span><em class="hw">his choice</em></div>
    <div class="opt"><i class="box-c"></i><b>3. Offence</b><span>Full-scale war. Too costly between nuclear powers.</span></div>
  </div>
  <blockquote class="quote" style="top:474px"><p>“You may do one Mumbai, you may lose Balochistan.”</p><cite>February 2014, a warning aimed at Pakistan</cite><svg class="ul" viewBox="0 0 540 12"><path class="draw" d="M4 7 C 140 2, 300 11, 536 5"/></svg></blockquote>
  <p class="caveat" style="top:582px">Critics have called the doctrine hawkish. <b class="hw blue">30 May 2014: appointed India’s 5th NSA.</b></p>
  ${lesson('Decide your strategy before the crisis comes.', true, 646)}`,

/* ---------- 11 · the NSA years ---------- */
10: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · the NSA years</p>
  <h2 class="big" data-type>One crisis|after another</h2>
  <table class="log-t" style="top:212px">
    <thead><tr><th>Year</th><th>Crisis</th><th>His move</th></tr></thead>
    <tbody>
      <tr><td>2014</td><td>Iraq: 46 Indian nurses trapped in ISIS-held territory</td><td><b>Flew to Iraq himself.</b> All 46 came home.</td></tr>
      <tr><td>2016</td><td>Uri attack: 19 soldiers killed</td><td><b>Surgical strikes,</b> widely reported as his plan.</td></tr>
      <tr><td>2019</td><td>Pulwama, then Article 370</td><td>One of <b>7 people</b> who knew of the Balakot strike. Then <b>11 days in Kashmir</b>, lunch with locals in Shopian.</td></tr>
      <tr><td>2020</td><td>Galwan clash with China</td><td><b>2-hour call</b> with Wang Yi on 5 July; troops began pulling back.</td></tr>
    </tbody>
  </table>
  ${lesson('Lead from the front. Be seen where the problem is.', true, 644)}`,

/* ---------- 12 · operation sindoor ---------- */
11: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · Operation Sindoor</p>
  <h2 class="big" data-type>23 minutes.|9 targets.</h2>
  <dl class="kv log wide" style="top:214px">
    <dt>22 Apr 2025</dt><dd>Terror attack at Pahalgam. <b>26 people killed</b>, mostly tourists.</dd>
    <dt>7 May, 1 am</dt><dd><b>Operation Sindoor:</b> 9 terror sites in Pakistan and Pakistan-occupied Kashmir hit in 23 minutes. Doval: <b>“We missed none.”</b></dd>
    <dt>7 May</dt><dd>Doval briefs the US and other world powers: India’s action is <b>“measured and non-escalatory.”</b></dd>
    <dt>10 May, 5 pm</dt><dd>Firing stops after talks between the two armies’ operations chiefs (DGMOs).</dd>
  </dl>
  <div class="result" style="top:470px"><span class="sec-i">His role</span><b class="hw">Coordinated, then explained</b><small>He linked the PM, the armed forces and the intelligence agencies, and kept the world informed. In July 2025 at IIT Madras he challenged foreign media to show “even one photo” of damage to an Indian structure.</small></div>
  ${lesson('Act decisively, then explain clearly.', true, 646)}`,

/* ---------- 13 · honours ---------- */
12: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · honours</p>
  <h2 class="big" data-type>A nation’s|thank-you</h2>
  <dl class="kv roll" style="top:214px">
    <dt>1974</dt><dd>Police Medal for Meritorious Service <b class="hw blue">youngest ever</b></dd>
    <dt>—</dt><dd>President’s Police Medal for Distinguished Service</dd>
    <dt>1989</dt><dd><b>Kirti Chakra</b> <b class="hw blue">first police officer ever</b></dd>
    <dt>2022</dt><dd>Uttarakhand Gaurav Samman</dd>
    <dt>2026</dt><dd><b>Lokmanya Tilak National Award</b>, presented by Amit Shah in Pune on 1 August</dd>
  </dl>
  <h3 class="sec" style="top:420px">Honorary doctorates · 6</h3>
  <ul class="cols2" style="top:448px">
    <li>Dr. Bhimrao Ambedkar University, 2017</li><li>Kumaun University, 2018</li><li>Amity University, 2018</li>
    <li>HNB Garhwal University, 2019</li><li>G. B. Pant University, 2023</li><li>Central University of Punjab, 2024</li>
  </ul>
  <p class="caveat" style="top:560px">Called <b>“India’s James Bond.”</b> A character in the film <i>Uri</i> (2019), played by Paresh Rawal, is reportedly based on him.</p>
  ${lesson('Respect is earned over decades, not days.', true, 646)}`,

/* ---------- 14 · why we chose him ---------- */
13: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · our assessment</p>
  <h2 class="big" data-type>Why we chose|Ajit Doval</h2>
  <h3 class="sec" style="top:212px">What we can learn</h3>
  <ol class="lessons6" style="top:242px">
    <li><b>Listen before you speak.</b><em class="hw">Mizoram, Lahore</em></li>
    <li><b>Show up in person.</b><em class="hw">Thalassery, Shopian</em></li>
    <li><b>Keep your promises.</b><em class="hw">Thalassery</em></li>
    <li><b>Stay calm when it matters.</b><em class="hw">Kandahar</em></li>
    <li><b>Act, then explain clearly.</b><em class="hw">Operation Sindoor</em></li>
    <li><b>Own your failures.</b><em class="hw">IC-814</em></li>
  </ol>
  <div class="sticky big-note" style="top:500px"><i class="tape"></i><h4 class="hw">His message to young Indians · August 2026</h4><p class="hw">Put the nation’s interest above personal gain.</p></div>
  <span class="seal hw" style="top:540px">Our leader</span>`,

/* ---------- 15 · thank you ---------- */
14: `{{HEAD}}
  <p class="subj">Subject: A. K. Doval · closing</p>
  <h2 class="big huge" data-type>Thank you.</h2>
  <ul class="ticks takeaways" style="top:250px">
    <li>${tick}From a village in Garhwal to <b>India’s top security post</b>.</li>
    <li>${tick}He won many battles with <b>conversations, not guns</b>.</li>
    <li>${tick}<b>Calm, courage and keeping your word:</b> lessons for all of us.</li>
  </ul>
  <p class="questions hw" style="top:430px">Questions?</p>
  <span class="closed">Case closed</span>`
};

window.DOVAL_EXHIBITS = {
3: `<div class="ex-card days" style="left:46px;top:52px;width:340px;height:252px;transform:rotate(-2.5deg)">${clip(150)}<p class="ch-title">Days to restore calm</p><div class="days-grid">${[1, 2, 3, 4, 5, 6, 7].map(xbox).join('')}</div><span class="hw-note" style="left:200px;top:200px;color:var(--red)">riot over!</span></div>
    <div class="ex-sheet" style="left:300px;top:300px;width:360px;height:410px;transform:rotate(2deg)">${clip(0, 50)}<p class="ch-title">Kerala coast</p><canvas class="mini" id="mini-kerala" width="720" height="760"></canvas><svg class="ink mini-ink" viewBox="0 0 360 380" id="mini-kerala-ink"></svg><div class="mini-labels" id="mini-kerala-lab"></div></div>
    ${window.DOVAL_PHOTO('s04', 402, 34, 268, 236, 3, 'Tellicherry Fort, Thalassery', 40)}`,
4: `<div class="ex-sheet" style="left:42px;top:44px;width:390px;height:420px;transform:rotate(-1.5deg)">${clip(60)}<p class="ch-title">North-east posting</p><canvas class="mini" id="mini-ne" width="780" height="780"></canvas><svg class="ink mini-ink" viewBox="0 0 390 390" id="mini-ne-ink"></svg><div class="mini-labels" id="mini-ne-lab"></div></div>
    <div class="ex-card medal-card" style="left:360px;top:420px;width:290px;height:280px;transform:rotate(3deg)">${clip(0, 40)}${medal('police', 'p4')}<p class="mc"><b>Police Medal · 1974</b><span class="hw">the youngest officer ever to get it</span></p></div>
    ${window.DOVAL_PHOTO('s05', 40, 480, 300, 236, -2.5, 'Aizawl, Mizoram', 40)}`,
5: `<div class="ex-sheet" style="left:52px;top:46px;width:330px;height:420px;transform:rotate(-2deg)">${clip(50)}<p class="ch-title">Exhibit C · the detail</p>${ear}<span class="hw-note" style="left:150px;top:330px;color:var(--red)">pierced ear</span><span class="hw-note" style="left:26px;top:372px;font-size:16px">a Garhwali custom that nearly gave him away</span></div>
    <div class="ex-card idcard" style="left:340px;top:470px;width:320px;height:220px;transform:rotate(3deg)">${clip(0, 46)}<p class="ch-title">Cover identity</p><dl><dt>Name</dt><dd><i class="redact" style="width:150px"></i></dd><dt>City</dt><dd>Lahore</dd><dt>Faith</dt><dd>Muslim <i class="redact" style="width:60px"></i></dd><dt>Status</dt><dd class="hw">never officially confirmed</dd></dl></div>
    ${window.DOVAL_PHOTO('s06', 400, 52, 268, 236, 3, 'Badshahi Mosque, Lahore', 40)}`,
6: `<div class="ex-card box-case" style="left:56px;top:50px;width:330px;height:380px;transform:rotate(-2deg)"><div class="velvet">${medal('kirti', 'k6')}</div><p class="mc"><b>Kirti Chakra</b><span class="hw">illustration</span></p></div>
    <div class="ex-card" style="left:330px;top:440px;width:330px;height:250px;transform:rotate(2.5deg)">${clip(0, 50)}<p class="ch-title">Kirti Chakra · 1989</p><ul class="mini-list"><li>India’s second-highest peacetime gallantry award</li><li>Usually given to soldiers</li><li><b>Doval: the first police officer ever to receive it</b></li></ul></div>
    ${window.DOVAL_PHOTO('s07', 398, 40, 272, 236, 3.5, 'The Golden Temple, Amritsar', 40)}`,
7: `<div class="ex-sheet route-card" style="left:40px;top:50px;width:610px;height:230px;transform:rotate(-1.2deg)">${clip(70)}<p class="ch-title">IC-814 · flight path, 24–25 Dec 1999</p>
      <svg class="ink" viewBox="0 0 610 230"><path class="draw" style="stroke:var(--red);stroke-width:2.6;stroke-dasharray:var(--len)" d="M40 130 C 140 80, 200 170, 300 120 C 380 80, 440 160, 570 110"/>${[[40, 130, 'Kathmandu'], [160, 118, 'Amritsar'], [300, 120, 'Lahore'], [430, 128, 'Dubai'], [570, 110, 'Kandahar']].map(([x, y, t], i) => `<g class="pt"><circle cx="${x}" cy="${y}" r="7" fill="#fbf8ef" stroke="#b3171d" stroke-width="2.4"/><text x="${x}" y="${y + 34}" text-anchor="middle" style="font:400 15px 'Special Elite',monospace;fill:#221d16">${t}</text></g>`).join('')}<text x="570" y="88" text-anchor="middle" font-size="26" fill="#1b1813">✈</text></svg></div>
    <div class="ex-card" style="left:404px;top:296px;width:256px;height:200px;transform:rotate(3deg)">${clip(110)}<p class="ch-title">Hijackings ended</p>${tally(15)}<span class="hw-note" style="left:24px;top:170px">15 of 15</span></div>
    <div class="ex-card" style="left:384px;top:512px;width:276px;height:204px;transform:rotate(-2deg)">${clip(0, 50)}<p class="ch-title">The deal at Kandahar</p><p class="deal"><s class="strike">36 militants</s><s class="strike">$200 million</s><b class="hw">3 militants</b></p></div>
    ${window.DOVAL_PHOTO('s08', 34, 300, 340, 280, -2.5, 'VT-EDW, the IC-814 aircraft · Delhi, 1999-2000', 60)}`,
8: `<div class="ex-sheet" style="left:44px;top:46px;width:420px;height:420px;transform:rotate(-1.5deg)">${clip(70)}<p class="ch-title">Multi Agency Centre</p>
      <svg class="ink" viewBox="0 0 420 420"><g class="blue">${[[70, 120], [350, 120], [56, 300], [364, 300], [210, 372]].map(([x, y]) => `<path class="draw" d="M210 220 C ${(210 + x) / 2 + 10} ${(220 + y) / 2 - 12}, ${x} ${y + 10}, ${x} ${y}"/>`).join('')}</g><path class="draw red" style="stroke:var(--red);stroke-width:2.6" d="M150 222 C 146 186, 270 180, 272 216 C 274 250, 152 258, 150 222"/></svg>
      <span class="box" style="left:150px;top:206px;width:120px">MAC</span><span class="box" style="left:22px;top:104px;width:96px">IB</span><span class="box" style="left:302px;top:104px;width:96px">R&amp;AW</span><span class="box" style="left:6px;top:284px;width:100px">Mil. intel</span><span class="box" style="left:310px;top:284px;width:100px">State police</span><span class="box" style="left:150px;top:356px;width:120px">Other agencies</span>
      <span class="hw-note" style="left:236px;top:160px">share terror information</span></div>
    <div class="ex-card big-num" style="left:380px;top:470px;width:270px;height:220px;transform:rotate(3deg)">${clip(0, 40)}<p class="ch-title">Years in intelligence</p><b class="hw">33+</b><span class="hw">1972 to 2005</span></div>
    ${window.DOVAL_PHOTO('s09', 44, 484, 310, 230, -2, 'Addressing IPS probationers · Hyderabad, 2015', 50)}`,
9: `<div class="ex-sheet chess-sheet" style="left:46px;top:44px;width:400px;height:470px;transform:rotate(-1.5deg)">${clip(60)}<p class="ch-title">A move, not a wall</p>${chess()}<span class="hw-note" style="left:30px;top:420px;color:var(--red)">strike at the source</span></div>
    <div class="ex-card" style="left:350px;top:510px;width:300px;height:190px;transform:rotate(2.5deg)">${clip(0, 46)}<p class="ch-title">Appointed</p><b class="hw" style="display:block;margin:62px 0 0 22px;font:700 34px/1 var(--f-hand);color:#1d2a6b">30 May 2014</b><span class="hw" style="display:block;margin:8px 22px 0;font:700 18px/1.2 var(--f-hand);color:#1d2a6b">5th National Security Advisor, 3 months after the lecture</span></div>
    ${window.DOVAL_PHOTO('s10', 38, 526, 300, 196, -2.5, 'Delivering a lecture · New Delhi', 50)}`,
10: [[2014, 'Iraq', 'all 46 nurses home', -5, 26, 30], [2016, 'Uri', 'surgical strikes', 4, 412, 40], [2019, 'Kashmir', '11 days on the ground', -3, 26, 510], [2020, 'Galwan', 'talks, then pull-back', 4, 412, 500]].map(([y, p, n, r, l, t]) => `<div class="ex-card year-card" style="left:${l}px;top:${t}px;width:252px;height:196px;transform:rotate(${r}deg)">${clip(100)}<b class="hw">${y}</b><span class="pl">${p}</span><span class="hw nt">${n}</span></div>`).join('') + `${window.DOVAL_PHOTO('s11', 140, 236, 400, 268, -1.5, 'With Vladimir Putin in the Kremlin', 80)}`,
11: `<div class="ex-sheet watch-sheet" style="left:52px;top:44px;width:360px;height:420px;transform:rotate(-1.5deg)">${clip(70)}<p class="ch-title">7 May 2025 · about 1 am</p>${stopwatch()}</div>
    <div class="ex-card memory" style="left:330px;top:470px;width:330px;height:230px;transform:rotate(2deg)">${clip(0, 50)}<p class="ch-title">In memory</p><div class="dots26">${Array.from({ length: 26 }, () => '<i></i>').join('')}</div><p class="mem">The 26 people killed at Pahalgam, 22 April 2025. The name <b>Sindoor</b> honoured the women who lost their husbands.</p></div>
    ${window.DOVAL_PHOTO('s12', 38, 488, 292, 222, -2, 'Operation Sindoor press briefing · May 2025', 50)}`,
12: `<div class="ex-card tray" style="left:34px;top:52px;width:432px;height:300px;transform:rotate(-1deg)"><div class="velvet row">${medal('police', 'p12')}${medal('kirti', 'k12')}${medal('award', 'a12')}</div><p class="mc"><b>1974 · 1989 · 2026</b><span class="hw">illustrations</span></p></div>
    <div class="ex-card film" style="left:120px;top:440px;width:470px;height:220px;transform:rotate(2deg)">${clip(0, 60)}<p class="ch-title">On screen</p><p class="film-t"><b>Uri</b> (2019)</p><p class="hw film-n">a character reportedly based on him, played by Paresh Rawal</p></div>
    ${window.DOVAL_PHOTO('s13', 482, 44, 186, 262, 3, 'The Kirti Chakra', 30)}`,
13: `<div class="ex-sheet assess" style="left:36px;top:36px;width:620px;height:670px;transform:rotate(-1deg)">${clip(80)}<p class="ch-title">Assessment</p>
      <h4>Why we chose him</h4>
      <ul><li>His life shows <b>every side of leadership</b>: street-level policing, undercover risk, negotiation, strategy and national command.</li><li>He rose from <b>a small village</b> through hard work: topped his MA, civil services at 23.</li><li><b>More than 50 years</b> of service, still on duty at 81.</li><li>Many of his biggest wins came from <b>conversations, not force</b>.</li></ul>
      <h4>What he offers as a person</h4>
      <ul class="q5"><li>${tick}<b>Courage</b> · inside the Golden Temple, years in Pakistan</li><li>${tick}<b>Calm under pressure</b> · Kandahar, Operation Sindoor</li><li>${tick}<b>Humility</b> · avoids the spotlight, rarely gives interviews</li><li>${tick}<b>Patience</b> · five years of quiet work in Mizoram</li><li>${tick}<b>Nation first</b> · national interest above personal gain</li></ul></div>`,
14: `${window.DOVAL_PHOTO('s14', 64, 26, 236, 278, -3, 'Ajit Doval, 2023', 40)}
    <div class="ex-sheet sources" style="left:36px;top:300px;width:618px;height:424px;transform:rotate(-1deg)">${clip(80)}<p class="ch-title">Sources</p>
      <ol><li>Wikipedia, “Ajit Doval” and “National Security Advisor (India)”</li><li>The Week, “How Ajit Doval suppressed a riot in Kerala in 1972” (2020)</li><li>The Quint, profile of Doval and the Mizoram years (2016)</li><li>The Tribune: longest-serving NSA turns 80 (2025); Operation Sindoor briefings (2025)</li><li>Deccan Herald: “We hit 9 terror targets … missed none” (July 2025)</li><li>DD News and News On Air: Lokmanya Tilak National Award (August 2026)</li><li>Dawn: “A hawkish doctrine” (2018), on the 2014 lecture</li><li>ThePrint: “Checking out the Doval detail: myth, reality and folklore”</li><li>Outlook: the Ikhwan in Kashmir</li><li>Republic World: his years in Pakistan (2020)</li></ol>
      <p class="note-src hw">Photos: Wikimedia Commons (U.S. Dept. of State, PIB, kremlin.ru, Sunil Gupta and others). Map: DataMeet India composite. Drawings are illustrations.</p></div>`
};
})();
