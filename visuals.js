/* LayrdEDU — Study Hub concept diagrams.
   Static, theme-aware SVG illustrations keyed by module article id.
   Injected as a "Concept Diagrams" card right after the Theory card,
   so the picture sits next to the prose it explains.
   Loaded after study.js (articles exist), before app.js. */
(function () {
  "use strict";

  /* ---------- tiny SVG builder helpers ---------- */
  const INK = "var(--ink)", INK2 = "var(--ink-2)", MUT = "var(--muted)",
    ACC = "var(--accent)", SOFT = "var(--accent-soft)", GRN = "var(--series-2)",
    PNK = "var(--series-3)", GRID = "var(--grid)", SURF = "var(--surface)";

  const r1 = v => +(+v).toFixed(1);

  function txt(x, y, s, o) {
    o = o || {};
    return `<text x="${r1(x)}" y="${r1(y)}" fill="${o.c || INK2}" font-size="${o.fs || 12}"` +
      `${o.anchor ? ` text-anchor="${o.anchor}"` : ""}${o.b ? ` font-weight="600"` : ""}` +
      `${o.mono ? ` font-family="ui-monospace,Consolas,monospace"` : ""}>${s}</text>`;
  }

  function line(x1, y1, x2, y2, o) {
    o = o || {};
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${o.c || INK2}"` +
      ` stroke-width="${o.w || 1.6}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`;
  }

  function head(x, y, ang, c, r) {
    r = r || 7;
    const a1 = ang + 2.65, a2 = ang - 2.65;
    return `<path d="M${r1(x)} ${r1(y)} L${r1(x + r * Math.cos(a1))} ${r1(y + r * Math.sin(a1))}` +
      ` L${r1(x + r * Math.cos(a2))} ${r1(y + r * Math.sin(a2))} Z" fill="${c}"/>`;
  }

  function arrow(x1, y1, x2, y2, o) {
    o = o || {};
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return line(x1, y1, x2, y2, o) + head(x2, y2, ang, o.c || INK2, o.r);
  }

  /* curved (quadratic) arrow — direction at tip taken from control point */
  function qarrow(x1, y1, cx, cy, x2, y2, o) {
    o = o || {};
    const ang = Math.atan2(y2 - cy, x2 - cx);
    return `<path d="M${r1(x1)} ${r1(y1)} Q${r1(cx)} ${r1(cy)} ${r1(x2)} ${r1(y2)}" fill="none"` +
      ` stroke="${o.c || INK2}" stroke-width="${o.w || 1.6}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>` +
      head(x2, y2, ang, o.c || INK2, o.r);
  }

  function poly(pts, o) {
    o = o || {};
    return `<polyline points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" fill="${o.fill || "none"}"` +
      ` stroke="${o.c || ACC}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}` +
      ` stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  /* sample fn(u∈[0,1]) → value in [-1,1]; plotted around centreline y0 with amplitude amp */
  function wave(x0, y0, w, amp, fn, n) {
    n = n || 120;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, v = fn(u);
      if (Number.isFinite(v)) pts.push([x0 + u * w, y0 - v * amp]);
    }
    return pts;
  }

  /* rounded box with centred (multi-line) label */
  function box(x, y, w, h, lines, o) {
    o = o || {};
    if (!Array.isArray(lines)) lines = [lines];
    const lh = o.fs ? o.fs + 4 : 15;
    const y0 = y + h / 2 - (lines.length - 1) * lh / 2 + 4;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 9 : o.rx}"` +
      ` fill="${o.fill || SOFT}" stroke="${o.stroke || ACC}" stroke-width="1.4"/>` +
      lines.map((s, i) => txt(x + w / 2, y0 + i * lh, s, { anchor: "middle", c: o.c || INK, fs: o.fs || 12, b: o.b !== false })).join("");
  }

  function dot(x, y, c, r) { return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r || 4}" fill="${c || ACC}" stroke="${SURF}" stroke-width="1.5"/>`; }
  function cross(x, y, c, s) { s = s || 6; c = c || INK; return line(x - s, y - s, x + s, y + s, { c, w: 2.4 }) + line(x - s, y + s, x + s, y - s, { c, w: 2.4 }); }

  /* zigzag resistor: horizontal (dir="h") or vertical, total length len */
  function res(x, y, len, dir, c) {
    const n = 6, a = 6, pts = [[0, 0]];
    for (let i = 0; i < n; i++) pts.push([(i + 0.5) * (len / n), (i % 2 ? a : -a)]);
    pts.push([len, 0]);
    const m = pts.map(p => dir === "v" ? [x + p[1], y + p[0]] : [x + p[0], y + p[1]]);
    return poly(m, { c: c || INK, w: 1.8 });
  }

  /* battery: long/short plate pair, vertical plates on a horizontal wire */
  function battery(x, y, c) {
    c = c || INK;
    return line(x, y - 11, x, y + 11, { c, w: 2.2 }) + line(x + 7, y - 5, x + 7, y + 5, { c, w: 2.2 });
  }

  /* vertical coil of n bumps at x, from y going down, bulging toward side (+1 right / −1 left) */
  function coil(x, y, n, side, c) {
    let d = `M${x} ${y}`;
    for (let i = 0; i < n; i++) d += ` a 9 8 0 0 ${side > 0 ? 1 : 0} 0 16`;
    return `<path d="${d}" fill="none" stroke="${c || INK}" stroke-width="1.9"/>`;
  }

  const svg = (h, body) => `<svg viewBox="0 0 560 ${h}" width="560"><g font-family="system-ui" font-size="12">${body}</g></svg>`;

  /* =========================================================
     diagram definitions — VIS[articleId] = [{t, cap, svg}]
     ========================================================= */
  const VIS = {};

  /* ---------- MATHS-3 ---------- */
  (() => { // m1: harmonics stack → square wave
    const two = k => u => Math.sin(2 * Math.PI * 2 * u * k);
    let b = "";
    [[50, 1, "sin x"], [115, 3, "(1/3)·sin 3x"], [180, 5, "(1/5)·sin 5x"]].forEach(([cy, k, lb], i) => {
      b += line(20, cy, 175, cy, { c: GRID }) + poly(wave(20, cy, 155, 24 / k, two(k)), { c: i === 0 ? ACC : i === 1 ? GRN : PNK, w: 1.8 });
      b += txt(182, cy + 4, lb, { mono: true, fs: 11 });
      if (i < 2) b += txt(97, cy + 42, "+", { anchor: "middle", fs: 20, c: INK, b: true });
    });
    b += arrow(268, 115, 316, 115, { c: INK, w: 2 }) + txt(292, 103, "Σ", { anchor: "middle", fs: 16, c: INK, b: true });
    const sum = u => { let s = 0; for (const k of [1, 3, 5]) s += Math.sin(2 * Math.PI * 2 * u * k) / k; return s * 4 / Math.PI / 1.3; };
    const sq = u => (Math.sin(2 * Math.PI * 2 * u) >= 0 ? 0.82 : -0.82);
    b += line(330, 115, 545, 115, { c: GRID });
    b += poly(wave(330, 115, 215, 62, sq, 400), { c: PNK, w: 1.6, dash: "5 4" });
    b += poly(wave(330, 115, 215, 62, sum, 300), { c: ACC, w: 2.2 });
    b += txt(437, 210, "partial sum (N = 5) vs target", { anchor: "middle", fs: 11, c: MUT });
    VIS["m3-m1"] = [{
      t: "Harmonics assemble the wave",
      cap: "Odd sine harmonics with 1/n amplitudes stack into a square wave — more terms, sharper corners.",
      svg: svg(225, b),
    }];
  })();

  (() => { // m2: pulse ↔ sinc duality
    let b = txt(120, 30, "time domain", { anchor: "middle", b: true, c: INK });
    b += arrow(30, 175, 225, 175, { c: MUT }) + txt(222, 192, "t", { c: MUT });
    b += poly([[35, 170], [85, 170], [85, 85], [160, 85], [160, 170], [218, 170]], { c: ACC, w: 2.4 });
    b += arrow(85, 62, 160, 62, { c: INK2, r: 5 }) + arrow(160, 62, 85, 62, { c: INK2, r: 5 }) + txt(122, 55, "2a", { anchor: "middle", fs: 11 });
    b += txt(437, 30, "frequency domain", { anchor: "middle", b: true, c: INK });
    b += arrow(320, 175, 548, 175, { c: MUT }) + txt(542, 192, "ω", { c: MUT });
    const sinc = u => { const s = (u - 0.5) * 26; return s === 0 ? 1 : Math.sin(3 * s) / (3 * s); };
    b += poly(wave(325, 150, 218, 78, sinc, 300), { c: GRN, w: 2.2 });
    b += txt(437, 118, "sin(aω)/ω", { anchor: "middle", mono: true, fs: 11, c: MUT });
    b += arrow(240, 100, 305, 100, { c: INK, w: 2 }) + txt(272, 90, "𝓕", { anchor: "middle", fs: 15, c: INK, b: true });
    b += arrow(305, 128, 240, 128, { c: INK, w: 2 }) + txt(272, 148, "𝓕⁻¹", { anchor: "middle", fs: 13, c: INK, b: true });
    VIS["m3-m2"] = [{
      t: "A pulse and its spectrum are two views of one signal",
      cap: "Squeeze the pulse in time and the sinc spreads in frequency — width in one domain × width in the other is fixed.",
      svg: svg(210, b),
    }];
  })();

  (() => { // m3: conformal mapping z → z²
    let b = "";
    for (let i = 0; i <= 4; i++) {
      b += line(45 + i * 38, 45, 45 + i * 38, 197, { c: GRID }) + line(45, 45 + i * 38, 197, 45 + i * 38, { c: GRID });
    }
    b += line(121, 45, 121, 197, { c: ACC, w: 2 }) + line(45, 121, 197, 121, { c: GRN, w: 2 });
    b += `<rect x="121" y="109" width="12" height="12" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
    b += txt(121, 218, "z-plane", { anchor: "middle", b: true, c: INK });
    b += arrow(215, 121, 290, 121, { c: INK, w: 2 }) + txt(252, 108, "w = z²", { anchor: "middle", mono: true, c: INK, b: true });
    const SX = u => 430 + u * 42, SY = v => 121 - v * 26;
    [0.6, 1.05].forEach(c => {
      const p1 = [], p2 = [];
      for (let i = 0; i <= 120; i++) {
        const t = -1.7 + 3.4 * i / 120;
        p1.push([SX(c * c - t * t), SY(2 * c * t)]);   // image of vertical line x = c
        p2.push([SX(t * t - c * c), SY(2 * t * c)]);   // image of horizontal line y = c
      }
      b += poly(p1, { c: ACC, w: 2 }) + poly(p2, { c: GRN, w: 2 });
    });
    b += dot(SX(0), SY(2 * 0.6 * 0.6), INK, 4.5);
    b += txt(430, 218, "w-plane — still 90° at every crossing", { anchor: "middle", b: true, c: INK });
    VIS["m3-m3"] = [{
      t: "Conformal = angle-preserving",
      cap: "Under w = z² grid lines become parabolas, yet the families still intersect at right angles wherever f′(z) ≠ 0.",
      svg: svg(235, b),
    }];
  })();

  (() => { // m4: contour + residues
    let b = `<ellipse cx="200" cy="115" rx="150" ry="82" fill="${SOFT}" stroke="${ACC}" stroke-width="2.2"/>`;
    b += head(200, 33, Math.PI, ACC, 8) + txt(200, 20, "C (counter-clockwise)", { anchor: "middle", fs: 11, c: ACC, b: true });
    b += cross(150, 130, INK) + txt(150, 155, "z₁", { anchor: "middle", mono: true, c: INK, b: true });
    b += cross(255, 90, INK) + txt(255, 72, "z₂", { anchor: "middle", mono: true, c: INK, b: true });
    b += cross(460, 60, MUT) + txt(460, 42, "z₃ — outside, contributes 0", { anchor: "middle", fs: 11, c: MUT });
    b += txt(340, 140, "∮ f(z) dz = 2πi·(Res z₁ + Res z₂)", { mono: true, fs: 12.5, c: INK, b: true });
    b += txt(340, 165, "only enclosed poles count", { fs: 11, c: MUT });
    VIS["m3-m4"] = [{
      t: "The residue theorem in one picture",
      cap: "Integrate around a closed loop: the answer is 2πi times the residues of the poles you actually enclose.",
      svg: svg(215, b),
    }];
  })();

  /* ---------- CIRCUITS & NETWORKS ---------- */
  (() => { // m1: Thévenin collapse
    let b = box(35, 55, 150, 100, ["any linear", "network", "(R, L, C, sources)"], { fs: 12 });
    b += line(185, 80, 235, 80, { c: INK }) + line(185, 130, 235, 130, { c: INK });
    b += `<circle cx="240" cy="80" r="4" fill="none" stroke="${INK}" stroke-width="1.8"/><circle cx="240" cy="130" r="4" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
    b += txt(252, 84, "A", { c: INK, b: true }) + txt(252, 134, "B", { c: INK, b: true });
    b += arrow(280, 105, 330, 105, { c: INK, w: 2 }) + txt(305, 92, "Thévenin", { anchor: "middle", fs: 11, c: INK, b: true });
    b += line(355, 80, 370, 80, { c: INK }) + battery(370, 80) + txt(366, 62, "V_th", { mono: true, fs: 11, c: INK });
    b += line(377, 80, 400, 80, { c: INK }) + res(400, 80, 55, "h") + txt(427, 62, "R_th", { anchor: "middle", mono: true, fs: 11, c: INK });
    b += line(455, 80, 490, 80, { c: INK });
    b += line(355, 80, 355, 130, { c: INK }) + line(355, 130, 490, 130, { c: INK });
    b += res(490, 80, 50, "v", ACC) + txt(505, 108, "R_L", { mono: true, fs: 11, c: ACC });
    VIS["cn-m1"] = [{
      t: "Thévenin — the great collapse",
      cap: "Seen from two terminals, any linear network is just one source behind one resistor. Max power transfer: R_L = R_th.",
      svg: svg(185, b),
    }];
  })();

  (() => { // m2: RC charging with τ landmarks
    let b = "";
    // circuit loop: switch + R across the top, C on the right, battery in the bottom wire
    b += line(45, 60, 80, 60, { c: INK });
    b += line(80, 60, 110, 45, { c: INK }) + dot(80, 60, INK, 3) + dot(114, 60, INK, 3) + txt(96, 32, "t = 0", { anchor: "middle", fs: 11, c: MUT });
    b += line(114, 60, 130, 60, { c: INK }) + res(130, 60, 55, "h") + txt(157, 42, "R", { anchor: "middle", mono: true, fs: 11, c: INK });
    b += line(185, 60, 225, 60, { c: INK }) + line(225, 60, 225, 92, { c: INK });
    b += line(211, 92, 239, 92, { c: INK, w: 2.2 }) + line(211, 100, 239, 100, { c: INK, w: 2.2 }) + txt(248, 100, "C", { mono: true, fs: 11, c: INK });
    b += line(225, 100, 225, 150, { c: INK }) + line(225, 150, 127, 150, { c: INK });
    b += battery(120, 150) + txt(123, 178, "V_s", { anchor: "middle", mono: true, fs: 11, c: INK });
    b += line(120, 150, 45, 150, { c: INK }) + line(45, 150, 45, 60, { c: INK });
    // response
    const X0 = 300, Y0 = 165, W = 235, H = 105;
    b += arrow(X0, Y0, X0 + W + 12, Y0, { c: MUT }) + arrow(X0, Y0, X0, Y0 - H - 12, { c: MUT });
    b += txt(X0 + W + 2, Y0 + 16, "t", { c: MUT }) + txt(X0 - 8, Y0 - H - 16, "v_C", { mono: true, fs: 11, c: MUT, anchor: "end" });
    b += line(X0, Y0 - H, X0 + W, Y0 - H, { c: MUT, dash: "4 4" }) + txt(X0 + W, Y0 - H - 6, "V_s", { mono: true, fs: 11, c: MUT, anchor: "end" });
    const rc = u => 1 - Math.exp(-u * 5);
    b += poly(wave(X0, Y0, W, H, rc, 160), { c: ACC, w: 2.4 });
    const xt = X0 + W / 5, yt = Y0 - H * rc(0.2);
    b += line(xt, Y0, xt, yt, { c: GRN, dash: "4 3" }) + line(X0, yt, xt, yt, { c: GRN, dash: "4 3" }) + dot(xt, yt, GRN, 4.5);
    b += txt(xt + 6, yt + 16, "63 % at t = τ = RC", { fs: 11, c: GRN, b: true });
    b += txt(X0 + W - 4, Y0 - H + 16, "≈ done by 5τ", { fs: 11, c: MUT, anchor: "end" });
    b += txt(xt, Y0 + 16, "τ", { anchor: "middle", mono: true, c: GRN, b: true });
    VIS["cn-m2"] = [{
      t: "One time constant tells the whole story",
      cap: "Close the switch: the capacitor climbs 63 % of the remaining gap every τ = RC, and is essentially charged by 5τ.",
      svg: svg(195, b),
    }];
  })();

  (() => { // m3: the Laplace detour
    let b = box(35, 35, 185, 52, ["differential equation", "in t — hard"], { fill: "none", stroke: PNK, c: INK });
    b += box(340, 35, 185, 52, ["solution x(t)"], { fill: "none", stroke: PNK, c: INK });
    b += box(35, 150, 185, 52, ["algebraic equation", "in s — easy"], {});
    b += box(340, 150, 185, 52, ["X(s)"], {});
    b += arrow(228, 61, 332, 61, { c: PNK, dash: "5 4" }) + txt(280, 50, "direct: hard", { anchor: "middle", fs: 11, c: PNK });
    b += arrow(127, 92, 127, 145, { c: INK, w: 2 }) + txt(140, 122, "𝓛", { fs: 15, c: INK, b: true });
    b += arrow(228, 176, 332, 176, { c: GRN, w: 2.2 }) + txt(280, 166, "just algebra", { anchor: "middle", fs: 11, c: GRN, b: true });
    b += arrow(432, 145, 432, 92, { c: INK, w: 2 }) + txt(445, 122, "𝓛⁻¹", { fs: 13, c: INK, b: true });
    VIS["cn-m3"] = [{
      t: "The transform detour",
      cap: "Calculus becomes algebra in the s-domain: transform, solve with ordinary arithmetic, transform back. Initial conditions ride along for free.",
      svg: svg(230, b),
    }];
  })();

  (() => { // m4: coupled coils + two-port box
    let b = txt(120, 28, "coupled coils", { anchor: "middle", b: true, c: INK });
    b += coil(95, 60, 5, -1) + coil(150, 60, 5, 1);
    b += line(117, 55, 117, 145, { c: INK2, w: 1.4 }) + line(127, 55, 127, 145, { c: INK2, w: 1.4 });
    b += dot(87, 52, ACC, 4) + dot(158, 52, ACC, 4);
    b += txt(70, 105, "L₁", { mono: true, c: INK, b: true, anchor: "end" }) + txt(175, 105, "L₂", { mono: true, c: INK, b: true });
    b += arrow(88, 165, 156, 165, { c: INK2, r: 5 }) + arrow(156, 165, 88, 165, { c: INK2, r: 5 });
    b += txt(122, 185, "M = k·√(L₁L₂)", { anchor: "middle", mono: true, fs: 11.5, c: INK });
    b += txt(122, 203, "dots: currents entering dots → fluxes add", { anchor: "middle", fs: 10.5, c: MUT });
    b += txt(415, 28, "two-port black box", { anchor: "middle", b: true, c: INK });
    b += box(330, 60, 170, 85, ["linear two-port", "[Z] [Y] [h] [ABCD]"], {});
    b += line(280, 80, 330, 80, { c: INK }) + line(280, 125, 330, 125, { c: INK });
    b += arrow(292, 72, 316, 72, { c: ACC, r: 5 }) + txt(302, 60, "I₁", { anchor: "middle", mono: true, fs: 11, c: ACC });
    b += txt(272, 107, "V₁", { mono: true, fs: 11.5, c: INK, b: true, anchor: "end" });
    b += line(500, 80, 550, 80, { c: INK }) + line(500, 125, 550, 125, { c: INK });
    b += arrow(538, 72, 514, 72, { c: ACC, r: 5 }) + txt(526, 60, "I₂", { anchor: "middle", mono: true, fs: 11, c: ACC });
    b += txt(556, 107, "V₂", { mono: true, fs: 11.5, c: INK, b: true }).replace('x="556"', 'x="554"');
    b += txt(415, 170, "four terminal variables — one 2×2 matrix", { anchor: "middle", fs: 11, c: MUT });
    VIS["cn-m4"] = [{
      t: "Mutual coupling and the two-port idea",
      cap: "The dot convention fixes the sign of M; a two-port matrix hides the internals and keeps only what the terminals can see.",
      svg: svg(215, b),
    }];
  })();

  /* ---------- DC MACHINES ---------- */
  (() => { // m1: electric ↔ magnetic circuit analogy
    let b = txt(125, 28, "electric circuit", { anchor: "middle", b: true, c: INK });
    b += line(60, 55, 190, 55, { c: INK }) + line(190, 55, 190, 100, { c: INK });
    b += res(190, 100, 50, "v") + line(190, 150, 190, 170, { c: INK }) + txt(205, 128, "R", { mono: true, c: INK });
    b += line(190, 170, 127, 170, { c: INK }) + battery(120, 170) + line(120, 170, 60, 170, { c: INK });
    b += txt(108, 156, "E", { mono: true, c: INK, b: true, anchor: "end" });
    b += line(60, 170, 60, 55, { c: INK });
    b += arrow(100, 47, 150, 47, { c: ACC }) + txt(125, 38, "I", { anchor: "middle", mono: true, c: ACC, b: true });
    b += txt(430, 28, "magnetic circuit", { anchor: "middle", b: true, c: INK });
    b += `<rect x="350" y="55" width="160" height="115" rx="6" fill="none" stroke="${INK}" stroke-width="7"/>`;
    b += line(510, 100, 510, 122, { c: SURF, w: 9 }); // air gap cut
    b += txt(522, 116, "air gap", { fs: 10.5, c: MUT });
    b += coil(346, 82, 4, -1, ACC) + txt(332, 72, "N·I", { mono: true, c: ACC, b: true, anchor: "end" });
    b += qarrow(395, 90, 430, 78, 465, 90, { c: GRN, w: 2 }) + txt(430, 118, "φ", { anchor: "middle", mono: true, fs: 13, c: GRN, b: true });
    b += txt(280, 90, "E ↔ NI (MMF)", { anchor: "middle", mono: true, fs: 11, c: INK });
    b += txt(280, 112, "I ↔ φ (flux)", { anchor: "middle", mono: true, fs: 11, c: INK });
    b += txt(280, 134, "R ↔ S = l/μA", { anchor: "middle", mono: true, fs: 11, c: INK });
    VIS["dcm-m1"] = [{
      t: "Ohm's law has a magnetic twin",
      cap: "MMF drives flux through reluctance exactly as EMF drives current through resistance — φ = NI / S. The air gap is where most reluctance lives.",
      svg: svg(195, b),
    }];
  })();

  (() => { // m2: force on a conductor
    let b = box(45, 55, 60, 120, ["N"], { fill: SOFT, stroke: ACC, fs: 18 });
    b += box(455, 55, 60, 120, ["S"], { fill: "none", stroke: PNK, fs: 18, c: PNK });
    [80, 115, 150].forEach(y => { b += arrow(115, y, 445, y, { c: MUT, r: 6 }); });
    b += txt(280, 68, "field B →", { anchor: "middle", fs: 11, c: MUT });
    b += `<circle cx="280" cy="115" r="15" fill="${SURF}" stroke="${INK}" stroke-width="2.2"/>` + dot(280, 115, INK, 3.5);
    b += txt(300, 138, "I out of page", { fs: 10.5, c: INK });
    b += arrow(280, 92, 280, 38, { c: GRN, w: 3, r: 9 }) + txt(292, 45, "F = B·I·l", { mono: true, fs: 13, c: GRN, b: true });
    b += txt(280, 196, "Fleming's left hand — Field (index), Current (middle), thumb = Force", { anchor: "middle", fs: 11, c: MUT });
    VIS["dcm-m2"] = [{
      t: "The motor principle is one force",
      cap: "Every DC motor is this picture repeated Z times around a rotor: current across a field produces F = BIl, force at a radius produces torque.",
      svg: svg(210, b),
    }];
  })();

  (() => { // m3: transformer core, flux, turns ratio
    let b = `<rect x="185" y="45" width="190" height="150" rx="6" fill="none" stroke="${INK}" stroke-width="8"/>`;
    b += `<path d="M205 65 H355 V175 H205 Z" fill="none" stroke="${GRN}" stroke-width="1.8" stroke-dasharray="6 5"/>`;
    b += head(280, 65, 0, GRN, 6) + txt(280, 84, "φ (same flux links both)", { anchor: "middle", fs: 10.5, c: GRN });
    b += coil(181, 80, 5, -1, ACC);
    b += line(140, 82, 172, 82, { c: INK }) + line(140, 158, 172, 158, { c: INK });
    b += txt(128, 92, "V₁", { mono: true, c: INK, b: true, anchor: "end" }) + txt(148, 122, "N₁", { mono: true, fs: 11, c: ACC, anchor: "end" });
    b += coil(379, 80, 5, 1, PNK);
    b += line(388, 82, 420, 82, { c: INK }) + line(388, 158, 420, 158, { c: INK });
    b += txt(432, 92, "V₂", { mono: true, c: INK, b: true }) + txt(412, 122, "N₂", { mono: true, fs: 11, c: PNK });
    b += txt(280, 225, "V₂/V₁ = N₂/N₁   ·   I₁/I₂ = N₂/N₁   ·   E = 4.44·f·φₘ·N", { anchor: "middle", mono: true, fs: 12, c: INK, b: true });
    VIS["dcm-m3"] = [{
      t: "One flux, two windings",
      cap: "The mutual flux in the core links both coils, so volts-per-turn is identical on both sides — everything about transformers follows from that.",
      svg: svg(245, b),
    }];
  })();

  (() => { // m4: star vs delta
    let b = txt(135, 28, "star (Y)", { anchor: "middle", b: true, c: INK });
    const cx = 135, cy = 115;
    [[90, "R"], [210, "Y"], [330, "B"]].forEach(([deg, lb]) => {
      const a = deg * Math.PI / 180, x = cx + 62 * Math.cos(a), y = cy - 62 * Math.sin(a);
      b += line(cx, cy, x, y, { c: ACC, w: 3.2 });
      b += `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
      b += txt(cx + 80 * Math.cos(a), cy - 80 * Math.sin(a) + 4, lb, { anchor: "middle", c: INK, b: true });
    });
    b += dot(cx, cy, INK, 4) + txt(cx + 12, cy + 14, "N", { c: INK, fs: 11, b: true });
    b += txt(135, 208, "V_L = √3·V_ph   I_L = I_ph", { anchor: "middle", mono: true, fs: 11.5, c: INK });
    b += txt(420, 28, "delta (Δ)", { anchor: "middle", b: true, c: INK });
    const v = [[420, 55], [355, 168], [485, 168]];
    for (let i = 0; i < 3; i++) {
      const p = v[i], q = v[(i + 1) % 3];
      b += line(p[0], p[1], q[0], q[1], { c: GRN, w: 3.2 });
      b += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
    }
    b += txt(420, 44, "R", { anchor: "middle", c: INK, b: true }) + txt(340, 182, "Y", { anchor: "middle", c: INK, b: true }) + txt(500, 182, "B", { anchor: "middle", c: INK, b: true });
    b += txt(420, 208, "V_L = V_ph   I_L = √3·I_ph", { anchor: "middle", mono: true, fs: 11.5, c: INK });
    VIS["dcm-m4"] = [{
      t: "Star vs delta at a glance",
      cap: "Star gives you a neutral and √3 on voltage; delta gives √3 on current. Open-delta runs a 3-φ load on two transformers at 57.7 % capacity.",
      svg: svg(225, b),
    }];
  })();

  /* ---------- ANALOG ELECTRONICS ---------- */
  (() => { // m1: load line + Q point
    const X0 = 70, Y0 = 195, W = 440, H = 145;
    let b = arrow(X0, Y0, X0 + W + 15, Y0, { c: MUT }) + arrow(X0, Y0, X0, Y0 - H - 15, { c: MUT });
    b += txt(X0 + W + 8, Y0 + 17, "V_CE", { mono: true, fs: 11, c: MUT, anchor: "end" }) + txt(X0 - 8, Y0 - H - 18, "I_C", { mono: true, fs: 11, c: MUT, anchor: "end" });
    [[0.38, "I_B1"], [0.6, "I_B2"], [0.82, "I_B3"]].forEach(([lv, lb]) => {
      const sat = u => Math.min(1, u * 14) * lv + u * 0.03;
      b += poly(wave(X0, Y0, W, H, sat, 140), { c: INK2, w: 1.6 });
      b += txt(X0 + W + 4, Y0 - H * (lv + 0.03) + 4, lb, { mono: true, fs: 10.5, c: MUT });
    });
    b += line(X0, Y0 - H * 0.94, X0 + W, Y0, { c: ACC, w: 2.4 });
    b += txt(X0 + 24, Y0 - H * 0.94 + 4, "load line: slope −1/R_C", { fs: 10.5, c: ACC });
    const qx = X0 + W * 0.42, qy = Y0 - H * 0.94 * 0.58;
    b += dot(qx, qy, ACC, 6) + txt(qx + 12, qy - 8, "Q", { fs: 14, c: ACC, b: true });
    b += line(qx, qy, qx, Y0, { c: GRN, dash: "4 3" }) + txt(qx, Y0 + 16, "V_CEQ", { anchor: "middle", mono: true, fs: 10.5, c: GRN });
    b += line(X0, qy, qx, qy, { c: GRN, dash: "4 3" }) + txt(X0 - 6, qy + 4, "I_CQ", { anchor: "end", mono: true, fs: 10.5, c: GRN });
    b += arrow(qx - 90, qy + 90 * 0.94 * H / W, qx + 90, qy - 90 * 0.94 * H / W, { c: PNK, r: 6 }) + arrow(qx + 90, qy - 90 * 0.94 * H / W, qx - 90, qy + 90 * 0.94 * H / W, { c: PNK, r: 6 });
    b += txt(qx + 118, qy - 78 * 0.94 * H / W, "signal swings along the line", { fs: 10.5, c: PNK });
    VIS["anx-m1"] = [{
      t: "Where DC meets AC: the load line",
      cap: "The circuit forces operation onto the load line; bias parks Q mid-way so the signal can swing both directions without hitting saturation or cut-off.",
      svg: svg(225, b),
    }];
  })();

  (() => { // m2: gain band with -3 dB edges
    const X0 = 65, Y0 = 175, W = 450, H = 110;
    let b = arrow(X0, Y0, X0 + W + 12, Y0, { c: MUT }) + arrow(X0, Y0, X0, Y0 - H - 14, { c: MUT });
    b += txt(X0 + W + 6, Y0 + 17, "log f", { fs: 11, c: MUT, anchor: "end" }) + txt(X0 - 6, Y0 - H - 18, "gain", { fs: 11, c: MUT, anchor: "end" });
    const g = u => { const f = Math.pow(10, u * 6), fl = 300, fh = 3e5; return 1 / Math.sqrt(1 + (fl / f) ** 2) / Math.sqrt(1 + (f / fh) ** 2); };
    b += poly(wave(X0, Y0, W, H, g, 220), { c: ACC, w: 2.4 });
    b += line(X0, Y0 - H, X0 + W, Y0 - H, { c: MUT, dash: "3 4" }) + txt(X0 + 4, Y0 - H - 6, "A_mid", { mono: true, fs: 10.5, c: MUT });
    const g3 = 1 / Math.sqrt(2);
    b += line(X0, Y0 - H * g3, X0 + W, Y0 - H * g3, { c: PNK, dash: "6 5" }) + txt(X0 + W - 4, Y0 - H * g3 - 6, "A_mid/√2  (−3 dB)", { mono: true, fs: 10.5, c: PNK, anchor: "end" });
    // find fL/fH crossings numerically
    let uL = 0, uH = 1;
    for (let u = 0; u < 1; u += 0.002) { if (g(u) >= g3) { uL = u; break; } }
    for (let u = 1; u > 0; u -= 0.002) { if (g(u) >= g3) { uH = u; break; } }
    const xL = X0 + uL * W, xH = X0 + uH * W;
    b += line(xL, Y0, xL, Y0 - H * g3, { c: GRN, dash: "4 3" }) + line(xH, Y0, xH, Y0 - H * g3, { c: GRN, dash: "4 3" });
    b += txt(xL, Y0 + 16, "f_L", { anchor: "middle", mono: true, fs: 11, c: GRN, b: true }) + txt(xH, Y0 + 16, "f_H", { anchor: "middle", mono: true, fs: 11, c: GRN, b: true });
    b += arrow(xL, Y0 - H - 24, xH, Y0 - H - 24, { c: INK, r: 5 }) + arrow(xH, Y0 - H - 24, xL, Y0 - H - 24, { c: INK, r: 5 });
    b += txt((xL + xH) / 2, Y0 - H - 32, "bandwidth = f_H − f_L", { anchor: "middle", fs: 11, c: INK, b: true });
    b += txt(X0 + 30, Y0 - 14, "coupling &amp; bypass", { fs: 10, c: MUT }) + txt(X0 + 30, Y0 - 2, "capacitors roll off lows", { fs: 10, c: MUT });
    b += txt(X0 + W - 4, Y0 - 14, "junction/stray capacitance", { fs: 10, c: MUT, anchor: "end" }) + txt(X0 + W - 4, Y0 - 2, "rolls off highs", { fs: 10, c: MUT, anchor: "end" });
    VIS["anx-m2"] = [{
      t: "Why every amplifier is a band-pass",
      cap: "External capacitors set the low edge, device capacitances set the high edge; the flat region between the −3 dB points is the usable bandwidth.",
      svg: svg(225, b),
    }];
  })();

  (() => { // m3: feedback loop
    let b = arrow(30, 95, 66, 95, { c: INK, w: 2 }) + txt(34, 84, "V_s", { mono: true, fs: 12, c: INK, b: true });
    b += `<circle cx="85" cy="95" r="15" fill="${SURF}" stroke="${INK}" stroke-width="2"/>`;
    b += txt(85, 100, "Σ", { anchor: "middle", fs: 14, c: INK, b: true });
    b += txt(70, 82, "+", { fs: 12, c: GRN, b: true }) + txt(72, 122, "−", { fs: 14, c: PNK, b: true });
    b += arrow(100, 95, 155, 95, { c: INK, w: 2 });
    b += box(155, 68, 100, 54, ["A"], { fs: 20 });
    b += line(255, 95, 470, 95, { c: INK, w: 2 }) + dot(380, 95, INK, 4);
    b += arrow(470, 95, 510, 95, { c: INK, w: 2 }) + txt(490, 84, "V_o", { mono: true, fs: 12, c: INK, b: true });
    b += line(380, 95, 380, 155, { c: INK2, w: 1.8 });
    b += box(255, 132, 90, 46, ["β"], { fill: "none", stroke: GRN, fs: 17, c: GRN });
    b += arrow(380, 155, 345, 155, { c: INK2, w: 1.8 });
    b += line(255, 155, 85, 155, { c: INK2, w: 1.8 }) + arrow(85, 155, 85, 112, { c: INK2, w: 1.8 });
    b += txt(300, 205, "negative feedback: A_f = A/(1+Aβ) — flatter, wider, cleaner", { anchor: "middle", mono: true, fs: 11.5, c: INK });
    b += txt(300, 224, "make the − a + and set Aβ = 1∠0° → Barkhausen → oscillator", { anchor: "middle", fs: 11, c: MUT });
    VIS["anx-m3"] = [{
      t: "One loop, two personalities",
      cap: "Sample the output, scale it by β, subtract it at the input: gain stabilises and bandwidth grows. Feed it back in phase instead and the loop sings — that's an oscillator.",
      svg: svg(240, b),
    }];
  })();

  (() => { // m4: inside the 555
    let b = `<rect x="130" y="30" width="300" height="200" rx="10" fill="none" stroke="${INK}" stroke-width="2"/>`;
    b += txt(280, 22, "inside the 555", { anchor: "middle", b: true, c: INK });
    // divider
    [[45, "5k"], [100, "5k"], [155, "5k"]].forEach(([y, lb]) => {
      b += res(160, y, 40, "v") + txt(148, y + 24, lb, { mono: true, fs: 10, c: MUT, anchor: "end" });
    });
    b += line(160, 32, 160, 45, { c: INK }) + txt(196, 42, "V_CC (8)", { anchor: "middle", fs: 10, c: MUT });
    b += line(160, 195, 160, 222, { c: INK }) + txt(174, 222, "GND (1)", { fs: 10, c: MUT });
    b += dot(160, 92, ACC, 4) + txt(172, 88, "⅔V_CC", { mono: true, fs: 10, c: ACC });
    b += dot(160, 147, GRN, 4) + txt(172, 143, "⅓V_CC", { mono: true, fs: 10, c: GRN });
    // comparators
    b += `<path d="M232 62 L232 106 L272 84 Z" fill="${SOFT}" stroke="${ACC}" stroke-width="1.6"/>` + txt(244, 88, "C1", { fs: 10, c: ACC, b: true });
    b += `<path d="M232 128 L232 172 L272 150 Z" fill="${SOFT}" stroke="${GRN}" stroke-width="1.6"/>` + txt(244, 154, "C2", { fs: 10, c: GRN, b: true });
    b += line(160, 92, 210, 92, { c: ACC, w: 1.4 }) + line(210, 92, 232, 92, { c: ACC, w: 1.4 });
    b += line(160, 147, 232, 147, { c: GRN, w: 1.4 });
    b += line(80, 74, 232, 74, { c: INK2, w: 1.4 }) + txt(76, 78, "THR (6)", { fs: 10, c: INK2, anchor: "end" });
    b += line(80, 160, 232, 160, { c: INK2, w: 1.4 }) + txt(76, 164, "TRG (2)", { fs: 10, c: INK2, anchor: "end" });
    // flip-flop + output
    b += box(300, 84, 66, 66, ["R", "S"], { fill: "none", stroke: INK, fs: 11 });
    b += txt(333, 76, "latch", { anchor: "middle", fs: 10, c: MUT });
    b += line(272, 84, 300, 100, { c: ACC, w: 1.4 }) + line(272, 150, 300, 134, { c: GRN, w: 1.4 });
    b += `<path d="M382 100 L382 134 L412 117 Z" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
    b += line(366, 117, 382, 117, { c: INK, w: 1.4 }) + arrow(412, 117, 460, 117, { c: INK, w: 2 }) + txt(466, 121, "OUT (3)", { fs: 10.5, c: INK, b: true });
    b += line(333, 150, 333, 190, { c: INK2, w: 1.4 }) + `<circle cx="333" cy="197" r="7" fill="none" stroke="${INK2}" stroke-width="1.6"/>`;
    b += line(333, 204, 333, 214, { c: INK2, w: 1.4 }) + arrow(333, 214, 298, 214, { c: INK2, w: 1.4 }) + txt(292, 218, "DIS (7)", { fs: 10, c: INK2, anchor: "end" });
    VIS["anx-m4"] = [{
      t: "The 555 is just two comparators and a latch",
      cap: "The 5k-5k-5k divider pins the trip points at ⅓ and ⅔ V_CC; C1 resets and C2 sets one latch; the latch drives the output and the discharge switch. Astable, monostable, PWM — all wiring around this core.",
      svg: svg(245, b),
    }];
  })();

  /* ---------- AI & DATA SCIENCE ---------- */
  (() => { // m1: BFS vs DFS on one tree
    const P = { A: [280, 55], B: [165, 120], C: [395, 120], D: [105, 190], E: [225, 190], F: [335, 190], G: [455, 190] };
    const E1 = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]];
    let b = E1.map(([p, q]) => line(P[p][0], P[p][1], P[q][0], P[q][1], { c: INK2, w: 1.6 })).join("");
    Object.keys(P).forEach(k => {
      const [x, y] = P[k];
      b += `<circle cx="${x}" cy="${y}" r="17" fill="var(--surface-2)" stroke="${INK}" stroke-width="1.8"/>`;
      b += txt(x, y + 4.5, k, { anchor: "middle", c: INK, b: true, fs: 13 });
    });
    const bfs = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 };
    const dfs = { A: 1, B: 2, D: 3, E: 4, C: 5, F: 6, G: 7 };
    Object.keys(P).forEach(k => {
      const [x, y] = P[k];
      b += txt(x - 24, y - 16, bfs[k], { anchor: "middle", mono: true, fs: 12, c: ACC, b: true });
      b += txt(x + 25, y - 16, dfs[k], { anchor: "middle", mono: true, fs: 12, c: GRN, b: true });
    });
    b += `<rect x="345" y="30" width="12" height="12" rx="3" fill="${ACC}"/>` + txt(363, 41, "BFS order (queue — level by level)", { fs: 11 });
    b += `<rect x="345" y="50" width="12" height="12" rx="3" fill="${GRN}"/>` + txt(363, 61, "DFS order (stack — dive deep first)", { fs: 11 });
    VIS["aids-m1"] = [{
      t: "Same tree, two frontiers",
      cap: "BFS expands the shallowest node next (complete, optimal for unit costs, memory-hungry); DFS expands the deepest (cheap memory, can wander). The numbers show each strategy's visiting order.",
      svg: svg(230, b),
    }];
  })();

  (() => { // m2: under / good / over fitting
    const panels = [["underfit — high bias", PNK], ["good fit", GRN], ["overfit — high variance", ACC]];
    const px = [30, 216, 402], PW = 128, PY = 45, PH = 130;
    const data = u => 40 + 165 * (u - 0.5) * (u - 0.5);
    const noise = [4, -6, 5, -4, 6, -5, 3, -4];
    const us = [0.04, 0.17, 0.31, 0.46, 0.6, 0.73, 0.86, 0.97];
    let b = "";
    panels.forEach(([lb, col], pi) => {
      const x0 = px[pi];
      b += `<rect x="${x0 - 8}" y="${PY - 12}" width="${PW + 16}" height="${PH + 26}" rx="8" fill="none" stroke="${GRID}"/>`;
      us.forEach((u, i) => { b += dot(x0 + u * PW, PY + data(u) + noise[i], INK2, 3.2); });
      let fit;
      if (pi === 0) fit = u => 78 - 12 * (u - 0.5);
      else if (pi === 1) fit = data;
      else fit = u => data(u) + 11 * Math.sin(27 * u);
      const pts = [];
      for (let i = 0; i <= 120; i++) { const u = i / 120; pts.push([x0 + u * PW, PY + fit(u)]); }
      b += poly(pts, { c: col, w: 2.2 });
      b += txt(x0 + PW / 2, PY + PH + 28, lb, { anchor: "middle", fs: 11, c: col, b: true });
    });
    VIS["aids-m2"] = [{
      t: "Bias–variance in three panels",
      cap: "Same data, three models: too simple misses the pattern, too flexible memorises the noise, the middle one generalises. Test error — not training error — tells them apart.",
      svg: svg(215, b),
    }];
  })();

  (() => { // m3: pipeline + train/test split
    const steps = ["collect", "clean", "explore", "model", "communicate"];
    let b = "";
    steps.forEach((s, i) => {
      const x = 22 + i * 106;
      b += box(x, 45, 90, 40, [s], { fs: 11.5 });
      if (i < steps.length - 1) b += arrow(x + 92, 65, x + 104, 65, { c: INK, w: 2, r: 6 });
    });
    b += qarrow(362, 88, 250, 135, 152, 88, { c: PNK, dash: "5 4" });
    b += txt(258, 128, "iterate — modelling exposes dirty data", { anchor: "middle", fs: 10.5, c: PNK });
    b += txt(60, 172, "split first:", { fs: 11.5, c: INK, b: true });
    b += `<rect x="140" y="158" width="272" height="26" rx="6" fill="${ACC}"/>`;
    b += `<rect x="412" y="158" width="68" height="26" rx="6" fill="${GRN}"/>`;
    b += txt(276, 175, "train 80 %", { anchor: "middle", fs: 11.5, c: "#fff", b: true });
    b += txt(446, 175, "test 20 %", { anchor: "middle", fs: 10.5, c: "#fff", b: true });
    b += txt(276, 204, "the model never sees the test slice until the very end", { anchor: "middle", fs: 11, c: MUT });
    VIS["aids-m3"] = [{
      t: "The data-science loop (and the golden rule)",
      cap: "Data science is a cycle, not a straight line — and evaluation is only honest if the test data stayed locked away during training.",
      svg: svg(220, b),
    }];
  })();

  (() => { // m4: k-means clusters
    const O = [[0, 0], [22, -12], [-20, 10], [12, 22], [-26, -14], [28, 10], [-6, -26], [10, -4]];
    const C = [[150, 90, ACC], [305, 155, GRN], [440, 80, PNK]];
    let b = "";
    C.forEach(([cx, cy, col]) => {
      O.forEach(o => { b += dot(cx + o[0], cy + o[1], col, 4); });
      b += `<circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="${col}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
      b += cross(cx, cy, INK, 7);
    });
    b += txt(150, 152, "cluster 1", { anchor: "middle", fs: 11, c: ACC, b: true });
    b += txt(305, 215, "cluster 2", { anchor: "middle", fs: 11, c: GRN, b: true });
    b += txt(440, 142, "cluster 3", { anchor: "middle", fs: 11, c: PNK, b: true });
    b += dot(228, 118, INK2, 4.5) + txt(228, 105, "?", { anchor: "middle", fs: 13, c: INK, b: true });
    b += arrow(222, 114, 165, 96, { c: INK2, dash: "4 3", r: 6 });
    b += txt(545, 30, "× = centroid (cluster mean)", { fs: 11, c: INK, anchor: "end" });
    VIS["aids-m4"] = [{
      t: "k-means: assign, average, repeat",
      cap: "Each point joins its nearest centroid, each centroid moves to its cluster's mean, and the two steps repeat until nothing moves. No labels needed — that's unsupervised learning.",
      svg: svg(235, b),
    }];
  })();

  /* ---------- ECONOMICS ---------- */
  (() => { // m1: supply & demand + shift
    const X0 = 80, Y0 = 195, W = 420, H = 150;
    let b = arrow(X0, Y0, X0 + W + 12, Y0, { c: MUT }) + arrow(X0, Y0, X0, Y0 - H - 12, { c: MUT });
    b += txt(X0 + W + 4, Y0 + 17, "quantity Q", { fs: 11, c: MUT, anchor: "end" }) + txt(X0 - 8, Y0 - H - 16, "price P", { fs: 11, c: MUT, anchor: "end" });
    const dm = [[X0 + 20, Y0 - H + 10], [X0 + W - 60, Y0 - 18]];
    const sp = [[X0 + 20, Y0 - 18], [X0 + W - 60, Y0 - H + 10]];
    b += poly(dm, { c: ACC, w: 2.4 }) + txt(dm[1][0] + 8, dm[1][1] + 4, "D", { c: ACC, b: true, fs: 13 });
    b += poly(sp, { c: GRN, w: 2.4 }) + txt(sp[1][0] + 8, sp[1][1] + 4, "S", { c: GRN, b: true, fs: 13 });
    const ex = (dm[0][0] + dm[1][0]) / 2, ey = (dm[0][1] + dm[1][1]) / 2;
    b += dot(ex, ey, INK, 5.5) + txt(ex + 10, ey - 10, "E", { c: INK, b: true, fs: 13 });
    b += line(ex, ey, ex, Y0, { c: MUT, dash: "4 3" }) + line(X0, ey, ex, ey, { c: MUT, dash: "4 3" });
    b += txt(ex, Y0 + 16, "Q*", { anchor: "middle", mono: true, fs: 11, c: INK }) + txt(X0 - 6, ey + 4, "P*", { anchor: "end", mono: true, fs: 11, c: INK });
    const d2 = [[X0 + 90, Y0 - H + 4], [X0 + W - 4, Y0 - 40]];
    b += poly(d2, { c: ACC, w: 1.8, dash: "6 5" }) + txt(d2[1][0] - 2, d2[1][1] - 8, "D′", { c: ACC, fs: 12, b: true, anchor: "end" });
    const e2x = ex + 42, e2y = ey - 15;
    b += `<circle cx="${e2x}" cy="${e2y}" r="5.5" fill="${SURF}" stroke="${INK}" stroke-width="2"/>`;
    b += qarrow(ex + 8, ey - 8, ex + 24, ey - 20, e2x - 7, e2y - 2, { c: PNK, w: 1.8 });
    b += txt(e2x + 12, e2y - 8, "demand shifts right → P↑ Q↑", { fs: 10.5, c: PNK });
    VIS["eco-m1"] = [{
      t: "The market cross",
      cap: "Equilibrium sits where the curves intersect. A movement along a curve is a price change; a shift of the whole curve is everything else (income, tastes, technology).",
      svg: svg(225, b),
    }];
  })();

  (() => { // m2: circular flow of income
    let b = box(50, 95, 150, 62, ["households", "(own the factors)"], { fs: 11.5 });
    b += box(360, 95, 150, 62, ["firms", "(produce output)"], { fs: 11.5 });
    b += qarrow(190, 90, 280, 25, 370, 90, { c: GRN, w: 2.4 });
    b += txt(280, 30, "factor services: labour, land, capital", { anchor: "middle", fs: 10.5, c: GRN, b: true });
    b += qarrow(365, 105, 280, 70, 195, 105, { c: ACC, w: 2.4 });
    b += txt(280, 78, "factor incomes: wages, rent, interest, profit", { anchor: "middle", fs: 10.5, c: ACC });
    b += qarrow(370, 162, 280, 227, 190, 162, { c: GRN, w: 2.4 });
    b += txt(280, 228, "goods &amp; services", { anchor: "middle", fs: 10.5, c: GRN, b: true });
    b += qarrow(195, 147, 280, 182, 365, 147, { c: ACC, w: 2.4 });
    b += txt(280, 176, "consumption spending", { anchor: "middle", fs: 10.5, c: ACC });
    b += `<rect x="228" y="112" width="10" height="10" rx="2" fill="${GRN}"/>` + txt(243, 121, "real flow", { fs: 10 });
    b += `<rect x="228" y="128" width="10" height="10" rx="2" fill="${ACC}"/>` + txt(243, 137, "money flow", { fs: 10 });
    VIS["eco-m2"] = [{
      t: "The circular flow of income",
      cap: "Real resources circulate one way, money the other. National income can be measured at any cut through the loop — product, income or expenditure — and all three must agree.",
      svg: svg(250, b),
    }];
  })();

  (() => { // m3: cash-flow timeline P → F
    let b = arrow(50, 155, 535, 155, { c: INK, w: 2 });
    for (let i = 0; i <= 5; i++) {
      const x = 75 + i * 84;
      b += line(x, 150, x, 160, { c: INK, w: 2 }) + txt(x, 176, i < 5 ? String(i) : "n", { anchor: "middle", mono: true, fs: 11, c: INK2 });
    }
    b += arrow(75, 152, 75, 108, { c: GRN, w: 3, r: 8 }) + txt(75, 98, "P", { anchor: "middle", mono: true, fs: 14, c: GRN, b: true });
    b += arrow(495, 152, 495, 40, { c: ACC, w: 3, r: 8 }) + txt(495, 30, "F = P·(1+i)ⁿ", { anchor: "middle", mono: true, fs: 13, c: ACC, b: true });
    const gr = u => Math.pow(1 + 0.35, u * 5) / Math.pow(1.35, 5);
    const pts = [];
    for (let i = 0; i <= 100; i++) { const u = i / 100; pts.push([75 + u * 420, 108 - (gr(u) * 68 - gr(0) * 68)]); }
    b += poly(pts, { c: MUT, w: 1.6, dash: "5 4" });
    b += txt(300, 78, "each year multiplies by (1 + i)", { anchor: "middle", fs: 11, c: MUT });
    b += txt(292, 205, "every TVM factor (F/P, P/F, A/P …) is a walk along this line", { anchor: "middle", fs: 11, c: MUT });
    VIS["eco-m3"] = [{
      t: "Money on a timeline",
      cap: "A rupee now and a rupee later are different animals: value moves through time by (1+i)ⁿ. Draw the timeline first and every problem becomes bookkeeping.",
      svg: svg(225, b),
    }];
  })();

  (() => { // m4: SLM vs WDV depreciation
    const X0 = 75, Y0 = 185, W = 420, H = 135;
    let b = arrow(X0, Y0, X0 + W + 12, Y0, { c: MUT }) + arrow(X0, Y0, X0, Y0 - H - 12, { c: MUT });
    b += txt(X0 + W + 4, Y0 + 17, "years", { fs: 11, c: MUT, anchor: "end" }) + txt(X0 - 8, Y0 - H - 16, "book value", { fs: 11, c: MUT, anchor: "end" });
    const S = 0.18; // salvage fraction
    b += line(X0, Y0 - H * S, X0 + W, Y0 - H * S, { c: MUT, dash: "4 4" }) + txt(X0 + W - 4, Y0 - H * S + 14, "salvage S", { fs: 10.5, c: MUT, anchor: "end" });
    b += poly([[X0, Y0 - H], [X0 + W, Y0 - H * S]], { c: ACC, w: 2.4 });
    b += txt(X0 + 205, Y0 - H * 0.62, "SLM — equal slice every year", { fs: 11, c: ACC, b: true });
    const pts = [];
    for (let i = 0; i <= 100; i++) { const u = i / 100; pts.push([X0 + u * W, Y0 - H * (S + (1 - S) * Math.pow(0.62, u * 6))]); }
    b += poly(pts, { c: GRN, w: 2.4 });
    b += txt(X0 + 92, Y0 - H * 0.30, "WDV — fixed % of book value,", { fs: 11, c: GRN, b: true });
    b += txt(X0 + 92, Y0 - H * 0.30 + 14, "big write-offs early", { fs: 11, c: GRN, b: true });
    b += dot(X0, Y0 - H, INK, 4.5) + txt(X0 + 8, Y0 - H - 8, "first cost C", { fs: 10.5, c: INK });
    VIS["eco-m4"] = [{
      t: "Two ways down the depreciation hill",
      cap: "Straight-line drops the same amount each year; written-down value removes a constant percentage, so the curve is steep early and flattens toward salvage.",
      svg: svg(215, b),
    }];
  })();

  /* ---------- ETHICS (m2 — m1/m3/m4 already have visuals) ---------- */
  (() => { // m2: four ethical lenses
    let b = box(200, 95, 160, 56, ["ethical decision"], { fs: 13 });
    b += box(30, 25, 200, 48, ["utilitarian", "best outcome for the most"], { fill: "none", stroke: ACC, fs: 11 });
    b += box(330, 25, 200, 48, ["duty / rules", "would the rule universalise?"], { fill: "none", stroke: GRN, fs: 11 });
    b += box(30, 175, 200, 48, ["rights", "does it violate anyone's rights?"], { fill: "none", stroke: PNK, fs: 11 });
    b += box(330, 175, 200, 48, ["virtue", "what would a good engineer do?"], { fill: "none", stroke: INK2, fs: 11 });
    b += arrow(160, 73, 235, 95, { c: ACC, w: 1.8 });
    b += arrow(400, 73, 325, 95, { c: GRN, w: 1.8 });
    b += arrow(160, 175, 235, 151, { c: PNK, w: 1.8 });
    b += arrow(400, 175, 325, 151, { c: INK2, w: 1.8 });
    VIS["eth-m2"] = [{
      t: "Four lenses on one dilemma",
      cap: "Run a case through all four theories. When they agree you can act with confidence; when they clash, you have found exactly where the ethical tension lies — which is what exam answers should name.",
      svg: svg(245, b),
    }];
  })();

  /* =========================================================
     reference images — freely licensed diagrams hotlinked from
     Wikimedia Commons (every file verified to exist), credited
     and linked back to its source page
     ========================================================= */
  const IMG = {
    "m3-m1": [["Fourier series square wave circles animation.gif", "Rotating phasors — one circle per harmonic — trace out the square wave"]],
    "m3-m2": [["Fourier transform time and frequency domains (small).gif", "The same signal seen in the time domain (red) and the frequency domain (blue)"]],
    "m3-m3": [["Conformal map.svg", "A rectangular grid and its image under a conformal map — angles survive, shapes bend"]],
    "cn-m1": [["Thevenin equivalent circuit.svg", "Any linear one-port reduced to its Thévenin equivalent"]],
    "cn-m2": [["Series RC capacitor voltage.svg", "Capacitor voltage during charging — the exponential every transient problem hides"]],
    "dcm-m1": [["B-H loop.png", "The hysteresis (B–H) loop — the area inside is energy lost per magnetisation cycle"]],
    "dcm-m2": [["Animation einer Gleichstrommaschine (Variante).gif", "A DC machine turning: commutator segments reverse the rotor current every half revolution"]],
    "dcm-m3": [["Transformer3d col3.svg", "Transformer construction — primary and secondary windings share one laminated core"]],
    "dcm-m4": [["3 phase AC waveform.svg", "Three phases displaced by 120° — the waveform behind every star/delta question"]],
    "anx-m2": [["Bandwidth 2.svg", "Bandwidth between the −3 dB (half-power) points"]],
    "anx-m3": [["Ideal feedback model.svg", "The ideal feedback model — compare with the loop drawn above"]],
    "anx-m4": [["NE555 Bloc Diagram.svg", "Functional block diagram of the NE555 timer"]],
    "aids-m1": [
      ["Breadth-first-tree.svg", "BFS visiting order — level by level"],
      ["Depth-first-tree.svg", "DFS visiting order — deep before wide"],
    ],
    "aids-m2": [
      ["Linear regression.svg", "Least-squares regression — the line that minimises squared vertical errors"],
      ["Overfitting.svg", "The green boundary memorises noise; the black one will generalise better"],
    ],
    "aids-m3": [["CRISP-DM Process Diagram.png", "CRISP-DM — the industry-standard data science cycle"]],
    "aids-m4": [["K-means convergence.gif", "k-means converging: assignments and centroids update until stable"]],
    "eco-m1": [["Supply-demand-equilibrium.svg", "Supply and demand — equilibrium price and quantity at the intersection"]],
    "eco-m2": [["Circular flow of goods income.png", "The circular flow of goods and income between households and firms"]],
    "eco-m3": [["Compound Interest with Varying Frequencies.svg", "Compound interest — the same principal at different compounding frequencies"]],
    "eco-m4": [["CVP-TC-Sales-PL-BEP.svg", "Cost–volume–profit chart: the break-even point is where total cost meets sales"]],
    "eth-m1": [["Kohlberg Model of Moral Development.png", "Kohlberg's stages of moral development"]],
    "eth-m2": [["Challenger explosion.jpg", "Challenger, 1986 — the canonical case study: engineers' warnings about cold O-rings were overruled"]],
    "eth-m3": [["Sustainable development.svg", "Sustainability as the overlap of environment, society and economy"]],
    "eth-m4": [["The Circular Economy concept.png", "The circular economy — keep materials in the loop instead of the landfill"]],
  };
  const FP = f => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f) + "?width=640";
  const PG = f => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(f.replace(/ /g, "_"));

  /* =========================================================
     injection — a "Concept Diagrams" card after the Theory card
     ========================================================= */
  const ids = new Set(Object.keys(VIS).concat(Object.keys(IMG)));
  ids.forEach(id => {
    const art = document.getElementById(id);
    if (!art) return;
    let h = "<h3>Concept Diagrams — see the idea</h3>";
    (VIS[id] || []).forEach(v => {
      h += `<p style="margin:10px 0 4px;font-weight:600">${v.t}</p>` +
        `<div class="schematic">${v.svg}${v.cap ? `<div class="cap">${v.cap}</div>` : ""}</div>`;
    });
    (IMG[id] || []).forEach(([file, cap]) => {
      h += `<figure class="webimg"><img loading="lazy" src="${FP(file)}" alt="${cap}">` +
        `<figcaption>${cap} · <a href="${PG(file)}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>`;
    });
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = h;
    const first = art.querySelector(".card");
    if (first) first.after(card); else art.appendChild(card);
  });
})();
