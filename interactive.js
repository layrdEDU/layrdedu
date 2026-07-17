/* LayrdEDU — Study Hub interactive widgets.
   Keyed by article id (e.g. "m3-m1"); appends an "Interactive" card with
   live controls, charts and calculators to each study module. Loaded after
   study.js (articles exist) and before app.js (which redraws on tab switch). */
(function () {
  "use strict";
  window.STUDY_SIMS = window.STUDY_SIMS || [];
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const C1 = () => css("--series-1"), C2 = () => css("--series-2"), C3 = () => css("--series-3");
  const f = (v, d = 3) => (!Number.isFinite(v)) ? "—" : (+v.toFixed(d)).toString();
  const eng = v => !Number.isFinite(v) ? "—" :
    Math.abs(v) >= 1e6 ? f(v / 1e6) + " M" : Math.abs(v) >= 1e3 ? f(v / 1e3) + " k" : f(v) + " ";
  const PI = Math.PI;

  const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
  const curve = (xs, fn) => xs.map(x => [x, fn(x)]).filter(p => Number.isFinite(p[1]));

  /* ================= widget definitions ================= */
  const W = {};

  /* ---------- MATHS-3 ---------- */
  W["m3-m1"] = [{
    title: "Fourier series builder — watch harmonics assemble the wave",
    controls: [
      { k: "wave", type: "select", label: "Target waveform", opts: [["square", "Square wave (±1)"], ["saw", "Sawtooth x/π"], ["tri", "Triangle |x|"]] },
      { k: "N", type: "range", label: "Highest harmonic N", min: 1, max: 31, step: 2, val: 5 },
    ],
    chart: true,
    draw(v, els) {
      const xs = range(-2 * PI, 2 * PI, 500);
      let target, sum, formula;
      if (v.wave === "square") {
        target = x => (Math.sin(x) >= 0 ? 1 : -1);
        sum = x => { let s = 0; for (let n = 1; n <= v.N; n += 2) s += Math.sin(n * x) / n; return 4 / PI * s; };
        formula = "f(x) = (4/π)·Σ sin(nx)/n , n odd";
      } else if (v.wave === "saw") {
        target = x => { let t = ((x + PI) % (2 * PI) + 2 * PI) % (2 * PI) - PI; return t / PI; };
        sum = x => { let s = 0; for (let n = 1; n <= v.N; n++) s += (n % 2 ? 1 : -1) * Math.sin(n * x) / n; return 2 / PI * s; };
        formula = "f(x) = (2/π)·Σ (−1)ⁿ⁺¹ sin(nx)/n";
      } else {
        target = x => { let t = ((x + PI) % (2 * PI) + 2 * PI) % (2 * PI) - PI; return Math.abs(t); };
        sum = x => { let s = 0; for (let n = 1; n <= v.N; n += 2) s += Math.cos(n * x) / (n * n); return PI / 2 - 4 / PI * s; };
        formula = "f(x) = π/2 − (4/π)·Σ cos(nx)/n² , n odd";
      }
      LCharts.lineChart(els.chart, {
        xLabel: "x (rad)", yLabel: "f(x)", height: 300, zeroY: false,
        series: [
          { name: "Target", color: C3(), pts: curve(xs, target), markers: false, dashed: true },
          { name: `Partial sum (N = ${v.N})`, color: C1(), pts: curve(xs, sum), markers: false },
        ],
      });
      els.out.innerHTML = `${formula}\nIncrease N — the overshoot at each jump (≈ 9 %) never dies: the <b>Gibbs phenomenon</b>.`;
    },
  }];

  W["m3-m2"] = [{
    title: "Pulse ↔ sinc — Fourier transform of a rectangular pulse",
    controls: [{ k: "a", type: "range", label: "Pulse half-width a", min: 0.5, max: 3, step: 0.1, val: 1 }],
    chart: true,
    draw(v, els) {
      const F = s => s === 0 ? Math.sqrt(2 / PI) * v.a : Math.sqrt(2 / PI) * Math.sin(v.a * s) / s;
      LCharts.lineChart(els.chart, {
        xLabel: "s", yLabel: "F(s)", height: 300, zeroY: false,
        series: [{ name: "Spectrum", color: C1(), pts: curve(range(-12, 12, 600), F), markers: false }],
      });
      els.out.innerHTML = `F(s) = √(2/π)·sin(as)/s — zeros at s = kπ/a = ±${f(PI / v.a, 3)}, ±${f(2 * PI / v.a, 3)} …\nWiden the pulse → the spectrum <b>narrows</b>. That inverse spreading is the uncertainty principle of transforms.`;
    },
  }];

  W["m3-m3"] = [{
    title: "Conformal mapping visualizer — image of the grid under w = f(z)",
    controls: [{ k: "map", type: "select", label: "Mapping", opts: [["sq", "w = z²"], ["exp", "w = eᶻ"], ["inv", "w = 1/z"]] }],
    chart: true,
    draw(v, els) {
      const maps = {
        sq: z => [z[0] * z[0] - z[1] * z[1], 2 * z[0] * z[1]],
        exp: z => [Math.exp(z[0]) * Math.cos(z[1]), Math.exp(z[0]) * Math.sin(z[1])],
        inv: z => { const d = z[0] * z[0] + z[1] * z[1]; return d < 0.03 ? [NaN, NaN] : [z[0] / d, -z[1] / d]; },
      };
      const fm = maps[v.map], series = [];
      const cs = [-1, -0.5, 0.5, 1];
      cs.forEach((c, i) => {
        series.push({ name: i === 0 ? "Vertical lines x = c" : "", color: C1(), markers: false, sort: false, pts: range(-1.4, 1.4, 160).map(y => fm([c, y])).filter(p => p.every(Number.isFinite)) });
        series.push({ name: i === 0 ? "Horizontal lines y = c" : "", color: C2(), markers: false, sort: false, pts: range(-1.4, 1.4, 160).map(x => fm([x, c])).filter(p => p.every(Number.isFinite)) });
      });
      LCharts.lineChart(els.chart, { xLabel: "u = Re(w)", yLabel: "v = Im(w)", height: 340, zeroY: false, series });
      els.out.innerHTML = `The two families stay <b>orthogonal</b> after mapping — angles are preserved (conformality) wherever f′(z) ≠ 0.` +
        (v.map === "sq" ? "\nw = z² doubles angles at the origin, where f′(0) = 0." :
          v.map === "exp" ? "\nw = eᶻ maps vertical lines to circles and horizontal lines to rays." :
            "\nw = 1/z maps lines/circles to lines/circles (inversion).");
    },
  }];

  W["m3-m4"] = [{
    title: "Radius of convergence — partial sums of Σ zⁿ vs 1/(1−z)",
    controls: [
      { k: "x", type: "range", label: "Point z = x (real)", min: -1.6, max: 1.6, step: 0.05, val: 0.7 },
      { k: "N", type: "range", label: "Terms N", min: 2, max: 40, step: 1, val: 15 },
    ],
    chart: true,
    draw(v, els) {
      const pts = []; let s = 0;
      for (let n = 0; n <= v.N; n++) { s += Math.pow(v.x, n); pts.push([n, s]); }
      const inside = Math.abs(v.x) < 1, lim = 1 / (1 - v.x);
      LCharts.lineChart(els.chart, {
        xLabel: "number of terms N", yLabel: "partial sum S_N", height: 300, zeroY: false,
        series: [{ name: "S_N = Σ xⁿ", color: C1(), pts }],
        refY: inside ? [{ y: lim, label: "1/(1−x) = " + f(lim, 3) }] : [],
      });
      els.out.innerHTML = inside
        ? `|z| = ${f(Math.abs(v.x), 2)} &lt; 1 → <b>converges</b> to 1/(1−z) = ${f(lim, 4)}. Radius of convergence R = 1.`
        : `|z| = ${f(Math.abs(v.x), 2)} ≥ 1 → the geometric series <b>diverges</b>; outside |z|&lt;1 you need the Laurent form −Σ 1/zⁿ⁺¹.`;
    },
  }];

  /* ---------- CIRCUITS & NETWORKS ---------- */
  W["cn-m1"] = [{
    title: "Maximum power transfer — sweep the load and find the peak",
    controls: [
      { k: "vth", type: "number", label: "V_th (V)", val: 10 },
      { k: "rth", type: "number", label: "R_th (Ω)", val: 50 },
    ],
    chart: true,
    draw(v, els) {
      const P = rl => v.vth * v.vth * rl / Math.pow(rl + v.rth, 2);
      const pmax = v.vth * v.vth / (4 * v.rth);
      LCharts.lineChart(els.chart, {
        xLabel: "R_L (Ω)", yLabel: "P_L (W)", height: 300,
        series: [{ name: "Load power", color: C1(), pts: curve(range(0.01, 5 * v.rth, 300), P), markers: false }],
        refY: [{ y: pmax, label: "P_max" }],
      });
      els.out.innerHTML = `Peak exactly at R_L = R_th = ${f(v.rth, 1)} Ω\nP_max = V_th²/(4R_th) = <b>${f(pmax, 3)} W</b>\nEfficiency at that point is only 50 % — matching maximises <i>power</i>, not efficiency.`;
    },
  }];

  W["cn-m2"] = [{
    title: "Series RLC step response — slide R through the three damping regimes",
    controls: [
      { k: "r", type: "range", label: "R (Ω)", min: 5, max: 400, step: 5, val: 40 },
      { k: "l", type: "number", label: "L (mH)", val: 100 },
      { k: "c", type: "number", label: "C (µF)", val: 10 },
    ],
    chart: true,
    draw(v, els) {
      const L = v.l / 1000, C = v.c / 1e6;
      const a = v.r / (2 * L), w0 = 1 / Math.sqrt(L * C);
      const tEnd = Math.max(8 / w0 * 4, 5 / Math.max(a, 1e-6));
      const n = 2400, dt = tEnd / n;
      let i = 0, vc = 0; const pts = [[0, 0]];
      for (let k = 1; k <= n; k++) {
        // series RLC driven by 1 V step: L di/dt = 1 − R·i − vC ; C dvC/dt = i
        i += dt * (1 - v.r * i - vc) / L;
        vc += dt * i / C;
        if (k % 4 === 0) pts.push([k * dt * 1000, vc]);
      }
      const kind = a > w0 ? "overdamped (α > ω₀)" : Math.abs(a - w0) < 0.02 * w0 ? "critically damped (α ≈ ω₀)" : "underdamped (α < ω₀)";
      LCharts.lineChart(els.chart, {
        xLabel: "time (ms)", yLabel: "v_C (V)", height: 300,
        series: [{ name: "Capacitor voltage", color: C1(), pts, markers: false }],
        refY: [{ y: 1, label: "final value" }],
      });
      els.out.innerHTML = `α = R/2L = ${f(a, 1)} s⁻¹ ·  ω₀ = 1/√(LC) = ${f(w0, 1)} rad/s\nRegime: <b>${kind}</b>` +
        (a < w0 ? `\nω_d = √(ω₀²−α²) = ${f(Math.sqrt(w0 * w0 - a * a), 1)} rad/s — count the ring frequency on the plot.` : "");
    },
  }];

  W["cn-m3"] = [{
    title: "First-order universal formula — x(t) = x(∞) + [x(0)−x(∞)]·e^(−t/τ)",
    controls: [
      { k: "x0", type: "number", label: "x(0⁺)", val: 0 },
      { k: "xf", type: "number", label: "x(∞)", val: 10 },
      { k: "tau", type: "number", label: "τ (ms)", val: 2 },
    ],
    chart: true,
    draw(v, els) {
      const x = t => v.xf + (v.x0 - v.xf) * Math.exp(-t / v.tau);
      LCharts.lineChart(els.chart, {
        xLabel: "time (ms)", yLabel: "x(t)", height: 300, zeroY: false,
        series: [{ name: "Response", color: C1(), pts: curve(range(0, 6 * v.tau, 300), x), markers: false }],
        refY: [{ y: v.xf, label: "x(∞)" }, { y: x(v.tau), label: "63 % @ τ" }],
      });
      els.out.innerHTML = `At t = τ the response has covered <b>63.2 %</b> of the change: x(τ) = ${f(x(v.tau), 3)}\nSettled (&gt;99 %) after ≈ 5τ = ${f(5 * v.tau, 2)} ms.\nIVT check: lim s·X(s) as s→∞ = x(0⁺) = ${f(v.x0, 2)} ·  FVT: s→0 gives ${f(v.xf, 2)} ✓`;
    },
  }];

  W["cn-m4"] = [{
    title: "Series resonance curve — R controls the sharpness (Q)",
    controls: [
      { k: "r", type: "range", label: "R (Ω)", min: 5, max: 150, step: 5, val: 20 },
      { k: "l", type: "number", label: "L (mH)", val: 100 },
      { k: "c", type: "number", label: "C (µF)", val: 10 },
    ],
    chart: true,
    draw(v, els) {
      const L = v.l / 1000, C = v.c / 1e6, V = 10;
      const f0 = 1 / (2 * PI * Math.sqrt(L * C));
      const I = fq => V / Math.hypot(v.r, 2 * PI * fq * L - 1 / (2 * PI * fq * C));
      const Q = 2 * PI * f0 * L / v.r, BW = f0 / Q, Imax = V / v.r;
      LCharts.lineChart(els.chart, {
        xLabel: "frequency (Hz)", yLabel: "current (A)", height: 300,
        series: [{ name: "I(f), V = 10 V", color: C1(), pts: curve(range(0.25 * f0, 2.5 * f0, 400), I), markers: false }],
        refY: [{ y: Imax / Math.SQRT2, label: "half-power" }],
      });
      els.out.innerHTML = `f₀ = 1/(2π√LC) = <b>${eng(f0)}Hz</b> ·  I_max = V/R = ${f(Imax, 3)} A\nQ = ω₀L/R = <b>${f(Q, 2)}</b> ·  BW = f₀/Q = ${eng(BW)}Hz\nLower R → taller, sharper peak (higher Q) — the half-power line cuts a narrower band.`;
    },
  }];

  /* ---------- DC MACHINES & TRANSFORMERS ---------- */
  W["dcm-m1"] = [{
    title: "EMF equation calculator — E = φZNP/60A",
    controls: [
      { k: "phi", type: "number", label: "Flux/pole φ (mWb)", val: 25 },
      { k: "z", type: "number", label: "Conductors Z", val: 720 },
      { k: "n", type: "number", label: "Speed N (rpm)", val: 1000 },
      { k: "p", type: "number", label: "Poles P", val: 4 },
      { k: "wind", type: "select", label: "Winding", opts: [["lap", "Lap (A = P)"], ["wave", "Wave (A = 2)"]] },
    ],
    chart: true,
    draw(v, els) {
      const A = v.wind === "lap" ? v.p : 2;
      const E = n => (v.phi / 1000) * v.z * n * v.p / (60 * A);
      LCharts.lineChart(els.chart, {
        xLabel: "speed N (rpm)", yLabel: "generated EMF (V)", height: 300,
        series: [
          { name: "E vs N (φ constant)", color: C1(), pts: curve(range(0, 1.5 * v.n, 60), E), markers: false },
          { name: "Operating point", color: C3(), pts: [[v.n, E(v.n)]], connect: false },
        ],
      });
      els.out.innerHTML = `A = ${A} parallel paths (${v.wind})\nE = φZNP/60A = <b>${f(E(v.n), 2)} V</b>\nE ∝ φ·N — halve the speed or the flux and the EMF halves with it.`;
    },
  }];

  W["dcm-m2"] = [{
    title: "Motor characteristics — shunt vs series on the same axes",
    controls: [
      { k: "show", type: "select", label: "Characteristic", opts: [["t", "Torque vs Iₐ"], ["n", "Speed vs Iₐ"]] },
      { k: "v", type: "number", label: "Supply V (V)", val: 220 },
      { k: "ra", type: "number", label: "Rₐ (Ω)", val: 0.5 },
    ],
    chart: true,
    draw(v, els) {
      const Ia = range(1, 40, 200);
      let s1, s2, note;
      if (v.show === "t") {
        s1 = { name: "Shunt: T ∝ Iₐ", color: C1(), pts: Ia.map(i => [i, 1.2 * i]), markers: false };
        s2 = { name: "Series: T ∝ Iₐ² (unsat.)", color: C2(), pts: Ia.map(i => [i, 0.06 * i * i]), markers: false };
        note = "Series torque grows with the SQUARE of current — the traction-motor advantage at starting.";
        LCharts.lineChart(els.chart, { xLabel: "armature current Iₐ (A)", yLabel: "torque (N·m)", height: 300, series: [s1, s2] });
      } else {
        s1 = { name: "Shunt: N ≈ const.", color: C1(), pts: Ia.map(i => [i, (v.v - i * v.ra) / v.v * 1500]), markers: false };
        s2 = { name: "Series: N ∝ 1/Iₐ", color: C2(), pts: Ia.filter(i => i > 2).map(i => [i, (v.v - i * (v.ra + 0.3)) / (0.14 * i)]), markers: false };
        note = "Series speed shoots up as load current falls — WHY a series motor must never start unloaded.";
        LCharts.lineChart(els.chart, { xLabel: "armature current Iₐ (A)", yLabel: "speed (rpm)", height: 300, series: [s1, s2] });
      }
      els.out.innerHTML = `N ∝ (V − IₐRₐ)/φ ·  T ∝ φ·Iₐ\n${note}`;
    },
  }];

  W["dcm-m3"] = [{
    title: "Transformer efficiency vs load — find the maximum-η point",
    controls: [
      { k: "s", type: "number", label: "Rating S (kVA)", val: 10 },
      { k: "pi", type: "number", label: "Core loss Pᵢ (W)", val: 120 },
      { k: "pcu", type: "number", label: "FL Cu loss (W)", val: 400 },
      { k: "pf", type: "range", label: "Power factor", min: 0.5, max: 1, step: 0.05, val: 0.8 },
    ],
    chart: true,
    draw(v, els) {
      const eta = x => 100 * (x * v.s * 1000 * v.pf) / (x * v.s * 1000 * v.pf + v.pi + x * x * v.pcu);
      const xm = Math.sqrt(v.pi / v.pcu);
      LCharts.lineChart(els.chart, {
        xLabel: "load fraction x", yLabel: "efficiency (%)", height: 300, zeroY: false,
        series: [
          { name: "η(x)", color: C1(), pts: curve(range(0.05, 1.3, 240), eta), markers: false },
          { name: "Max-η point", color: C3(), pts: [[xm, eta(xm)]], connect: false },
        ],
      });
      els.out.innerHTML = `Max efficiency where Cu loss = core loss → x = √(Pᵢ/P_cu) = <b>${f(xm, 3)}</b> (${f(xm * 100, 1)} % load)\nη_max = <b>${f(eta(xm), 2)} %</b> at pf = ${v.pf}\nFull-load η = ${f(eta(1), 2)} %`;
    },
  }];

  W["dcm-m4"] = [{
    title: "Parallel operation & open-delta calculators",
    controls: [
      { k: "z1", type: "number", label: "T₁ impedance (%)", val: 4 },
      { k: "z2", type: "number", label: "T₂ impedance (%)", val: 5 },
      { k: "sl", type: "number", label: "Total load (kVA)", val: 900 },
      { k: "sd", type: "number", label: "Closed-Δ bank (kVA)", val: 300 },
    ],
    draw(v, els) {
      const s1 = v.sl * v.z2 / (v.z1 + v.z2), s2 = v.sl * v.z1 / (v.z1 + v.z2);
      els.out.innerHTML = `<b>Load sharing (equal ratios):</b> S ∝ 1/Z\nT₁ carries ${f(s1, 1)} kVA · T₂ carries ${f(s2, 1)} kVA — the LOWER-impedance unit takes more.\n\n<b>Open-delta:</b> if one unit of the ${f(v.sd, 0)} kVA Δ bank fails,\nV–V capacity = ${f(v.sd, 0)}/√3 = <b>${f(v.sd / Math.sqrt(3), 1)} kVA</b> (57.7 %, not 66.7 %).`;
    },
  }];

  /* ---------- ANALOG ELECTRONICS ---------- */
  W["anx-m1"] = [{
    title: "Q-point on the DC load line — the lab's voltage-divider bias, live",
    controls: [
      { k: "vcc", type: "number", label: "V_CC (V)", val: 12 },
      { k: "r1", type: "number", label: "R₁ (kΩ)", val: 47 },
      { k: "r2", type: "number", label: "R₂ (kΩ)", val: 10 },
      { k: "rc", type: "number", label: "R_C (kΩ)", val: 2.2 },
      { k: "re", type: "number", label: "R_E (kΩ)", val: 0.68 },
    ],
    chart: true,
    draw(v, els) {
      const vb = v.vcc * v.r2 / (v.r1 + v.r2);
      const ie = (vb - 0.7) / v.re;             // mA
      const vce = v.vcc - ie * (v.rc + v.re);
      const isat = v.vcc / (v.rc + v.re);
      LCharts.lineChart(els.chart, {
        xLabel: "V_CE (V)", yLabel: "I_C (mA)", height: 300,
        series: [
          { name: "DC load line", color: C1(), pts: [[0, isat], [v.vcc, 0]], markers: false },
          { name: "Q-point", color: C3(), pts: [[vce, ie]], connect: false },
        ],
      });
      els.out.innerHTML = `V_B = ${f(vb, 2)} V → I_C ≈ I_E = (V_B−0.7)/R_E = <b>${f(ie, 2)} mA</b>\nV_CE = V_CC − I_C(R_C+R_E) = <b>${f(vce, 2)} V</b>` +
        `\n${Math.abs(vce - v.vcc / 2) < 0.15 * v.vcc ? "Q sits near mid-line → maximum symmetric swing ✓" : "Q is off-centre — output will clip on one side first."}`;
    },
  }];

  W["anx-m2"] = [{
    title: "Amplifier frequency response — set A_mid, f_L, f_H",
    controls: [
      { k: "a", type: "number", label: "Mid-band gain (dB)", val: 30 },
      { k: "fl", type: "number", label: "f_L (Hz)", val: 250 },
      { k: "fh", type: "number", label: "f_H (kHz)", val: 2000 },
    ],
    chart: true,
    draw(v, els) {
      const fh = v.fh * 1000;
      const g = lf => { const fq = Math.pow(10, lf); return v.a - 10 * Math.log10(1 + Math.pow(v.fl / fq, 2)) - 10 * Math.log10(1 + Math.pow(fq / fh, 2)); };
      LCharts.lineChart(els.chart, {
        xLabel: "log f", yLabel: "gain (dB)", height: 300, zeroY: false,
        series: [{ name: "Gain", color: C1(), pts: curve(range(Math.log10(v.fl) - 1.2, Math.log10(fh) + 1.2, 300), g), markers: false }],
        refY: [{ y: v.a - 3, label: "−3 dB" }],
      });
      els.out.innerHTML = `Bandwidth = f_H − f_L ≈ <b>${eng(fh - v.fl)}Hz</b>\nBelow f_L coupling/bypass capacitors roll the gain off at ~20 dB/decade; above f_H device (Miller) capacitances do.`;
    },
  }];

  W["anx-m3"] = [{
    title: "Negative feedback — trade gain for bandwidth (A·BW ≈ constant)",
    controls: [
      { k: "a", type: "number", label: "Open-loop gain A", val: 1000 },
      { k: "b", type: "range", label: "Feedback β", min: 0, max: 0.05, step: 0.002, val: 0.01 },
      { k: "fh", type: "number", label: "Open-loop f_H (kHz)", val: 10 },
    ],
    chart: true,
    draw(v, els) {
      const D = 1 + v.a * v.b, af = v.a / D, fhf = v.fh * D;
      const gdb = (a0, fh) => lf => { const fq = Math.pow(10, lf); return 20 * Math.log10(a0) - 10 * Math.log10(1 + Math.pow(fq / (fh * 1000), 2)); };
      const xs = range(2, Math.log10(v.fh * D * 1000) + 1.5, 300);
      LCharts.lineChart(els.chart, {
        xLabel: "log f", yLabel: "gain (dB)", height: 300, zeroY: false,
        series: [
          { name: "Open loop", color: C3(), pts: curve(xs, gdb(v.a, v.fh)), markers: false, dashed: true },
          { name: "With feedback", color: C1(), pts: curve(xs, gdb(af, fhf)), markers: false },
        ],
      });
      els.out.innerHTML = `Desensitivity D = 1 + Aβ = <b>${f(D, 1)}</b>\nA_f = A/D = ${f(af, 1)} ·  f_H(f) = f_H·D = ${f(fhf, 1)} kHz\nGain ÷ D, bandwidth × D — distortion and drift also shrink by D.`;
    },
  }];

  W["anx-m4"] = [{
    title: "Slew-rate limit — highest clean full-power frequency",
    controls: [
      { k: "sr", type: "number", label: "Slew rate (V/µs)", val: 0.5 },
      { k: "vp", type: "range", label: "Output peak V_p (V)", min: 0.5, max: 13, step: 0.5, val: 10 },
    ],
    chart: true,
    draw(v, els) {
      const fmax = vp => v.sr * 1e6 / (2 * PI * vp);
      LCharts.lineChart(els.chart, {
        xLabel: "output peak (V)", yLabel: "f_max (kHz)", height: 300,
        series: [
          { name: "f_max = SR/(2πV_p)", color: C1(), pts: curve(range(0.5, 13, 200), vp => fmax(vp) / 1000), markers: false },
          { name: "Your point", color: C3(), pts: [[v.vp, fmax(v.vp) / 1000]], connect: false },
        ],
      });
      els.out.innerHTML = `At V_p = ${v.vp} V:  f_max = SR/(2π·V_p) = <b>${eng(fmax(v.vp))}Hz</b>\nAbove this the 741's output turns triangular — slewing, not small-signal bandwidth, sets the full-power limit.`;
    },
  }];

  /* ---------- AI & DATA SCIENCE ---------- */
  W["aids-m1"] = [{
    title: "Search-space explosion — nodes ≈ bᵈ",
    controls: [
      { k: "b", type: "range", label: "Branching factor b", min: 2, max: 8, step: 1, val: 3 },
      { k: "d", type: "range", label: "Depth d", min: 2, max: 14, step: 1, val: 8 },
    ],
    chart: true,
    draw(v, els) {
      LCharts.lineChart(els.chart, {
        xLabel: "depth", yLabel: "log₁₀(nodes)", height: 300,
        series: [{ name: `b = ${v.b}`, color: C1(), pts: range(0, v.d, v.d).map(k => [k, k * Math.log10(v.b)]) }],
      });
      const nodes = Math.pow(v.b, v.d);
      els.out.innerHTML = `b^d = ${v.b}^${v.d} ≈ <b>${nodes.toExponential(2)}</b> nodes\nBFS stores the whole frontier — O(bᵈ) memory kills it long before time does. A good heuristic (A*) prunes this curve.`;
    },
  }];

  W["aids-m2"] = [
    {
      title: "Least-squares linear regression — edit the points, watch the fit",
      controls: [{ k: "pts", type: "text", label: "Points x,y (semicolon separated)", val: "1,2.1; 2,3.9; 3,6.2; 4,8.1; 5,9.8; 6,12.3" }],
      chart: true,
      draw(v, els) {
        const data = String(v.pts).split(";").map(s => s.split(",").map(Number)).filter(p => p.length === 2 && p.every(Number.isFinite));
        if (data.length < 2) { els.out.textContent = "Enter at least two x,y points."; return; }
        const n = data.length, mx = data.reduce((s, p) => s + p[0], 0) / n, my = data.reduce((s, p) => s + p[1], 0) / n;
        const sxy = data.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0), sxx = data.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
        const t1 = sxy / sxx, t0 = my - t1 * mx;
        const ssRes = data.reduce((s, p) => s + (p[1] - (t0 + t1 * p[0])) ** 2, 0);
        const ssTot = data.reduce((s, p) => s + (p[1] - my) ** 2, 0);
        const r2 = 1 - ssRes / ssTot, mse = ssRes / n;
        const xs = data.map(p => p[0]);
        LCharts.lineChart(els.chart, {
          xLabel: "x", yLabel: "y", height: 300, zeroY: false,
          series: [
            { name: "Data", color: C1(), pts: data, connect: false },
            { name: "Fit ŷ = θ₀ + θ₁x", color: C2(), markers: false, pts: [Math.min(...xs), Math.max(...xs)].map(x => [x, t0 + t1 * x]) },
          ],
        });
        els.out.innerHTML = `θ₀ = ${f(t0, 3)} ·  θ₁ = ${f(t1, 3)}\nMSE = ${f(mse, 4)} ·  R² = <b>${f(r2, 4)}</b>`;
      },
    },
    {
      title: "Confusion-matrix metrics calculator",
      controls: [
        { k: "tp", type: "number", label: "True positives", val: 40 },
        { k: "fp", type: "number", label: "False positives", val: 10 },
        { k: "fn", type: "number", label: "False negatives", val: 5 },
        { k: "tn", type: "number", label: "True negatives", val: 45 },
      ],
      draw(v, els) {
        const acc = (v.tp + v.tn) / (v.tp + v.fp + v.fn + v.tn);
        const p = v.tp / (v.tp + v.fp), r = v.tp / (v.tp + v.fn), f1 = 2 * p * r / (p + r);
        els.out.innerHTML = `Accuracy = ${f(acc, 4)}\nPrecision = TP/(TP+FP) = <b>${f(p, 4)}</b>\nRecall = TP/(TP+FN) = <b>${f(r, 4)}</b>\nF1 = 2PR/(P+R) = <b>${f(f1, 4)}</b>`;
      },
    },
  ];

  W["aids-m3"] = [{
    title: "Descriptive statistics & outlier fences — paste any data",
    controls: [{ k: "d", type: "text", label: "Values (comma separated)", val: "12, 14, 15, 15, 16, 17, 18, 19, 21, 22, 24, 41" }],
    chart: true,
    draw(v, els) {
      const xs = String(v.d).split(/[,\s]+/).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
      if (xs.length < 4) { els.out.textContent = "Enter at least four numbers."; return; }
      const n = xs.length, mean = xs.reduce((a, b) => a + b) / n;
      const med = n % 2 ? xs[(n - 1) / 2] : (xs[n / 2 - 1] + xs[n / 2]) / 2;
      const q = p => { const i = p * (n - 1), lo = Math.floor(i); return xs[lo] + (xs[Math.min(lo + 1, n - 1)] - xs[lo]) * (i - lo); };
      const q1 = q(0.25), q3 = q(0.75), iqr = q3 - q1;
      const lof = q1 - 1.5 * iqr, hif = q3 + 1.5 * iqr;
      const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n);
      const outliers = xs.filter(x => x < lof || x > hif);
      LCharts.lineChart(els.chart, {
        xLabel: "sample index (sorted)", yLabel: "value", height: 300, zeroY: false,
        series: [{ name: "Data", color: C1(), pts: xs.map((x, i) => [i + 1, x]), connect: false }],
        refY: [{ y: hif, label: "Q₃+1.5·IQR" }, { y: lof, label: "Q₁−1.5·IQR" }],
      });
      els.out.innerHTML = `mean = ${f(mean, 3)} · median = ${f(med, 3)} · σ = ${f(sd, 3)}\nQ₁ = ${f(q1, 2)} · Q₃ = ${f(q3, 2)} · IQR = ${f(iqr, 2)}\nOutliers beyond fences: <b>${outliers.length ? outliers.join(", ") : "none"}</b>`;
    },
  }];

  W["aids-m4"] = [{
    title: "Vector similarity calculator — cosine vs Euclidean",
    controls: [
      { k: "a", type: "text", label: "Vector A", val: "3, 4, 0, 1" },
      { k: "b", type: "text", label: "Vector B", val: "1, 2, 2, 3" },
    ],
    draw(v, els) {
      const A = String(v.a).split(/[,\s]+/).map(Number).filter(Number.isFinite);
      const B = String(v.b).split(/[,\s]+/).map(Number).filter(Number.isFinite);
      if (!A.length || A.length !== B.length) { els.out.textContent = "Vectors must have the same length."; return; }
      const dot = A.reduce((s, x, i) => s + x * B[i], 0);
      const na = Math.hypot(...A), nb = Math.hypot(...B);
      const d = Math.sqrt(A.reduce((s, x, i) => s + (x - B[i]) ** 2, 0));
      els.out.innerHTML = `A·B = ${f(dot, 3)} · ‖A‖ = ${f(na, 3)} · ‖B‖ = ${f(nb, 3)}\ncosine similarity = <b>${f(dot / (na * nb), 4)}</b>  (1 = same direction)\nEuclidean distance = <b>${f(d, 4)}</b>\nRecommenders use cosine (direction), k-means uses Euclidean (position).`;
    },
  }];

  /* ---------- ECONOMICS ---------- */
  W["eco-m1"] = [{
    title: "Price elasticity of demand calculator",
    controls: [
      { k: "p1", type: "number", label: "Price P₁", val: 100 }, { k: "p2", type: "number", label: "Price P₂", val: 110 },
      { k: "q1", type: "number", label: "Quantity Q₁", val: 500 }, { k: "q2", type: "number", label: "Quantity Q₂", val: 420 },
    ],
    draw(v, els) {
      const e = ((v.q2 - v.q1) / v.q1) / ((v.p2 - v.p1) / v.p1);
      const a = Math.abs(e);
      els.out.innerHTML = `E_p = (ΔQ/Q)/(ΔP/P) = <b>${f(e, 3)}</b>\n|E_p| ${a > 1 ? "&gt; 1 → <b>elastic</b> (revenue falls when price rises)" : a < 1 ? "&lt; 1 → <b>inelastic</b> (revenue rises when price rises)" : "= 1 → unitary"}`;
    },
  }];

  W["eco-m2"] = [{
    title: "Real vs nominal GDP calculator",
    controls: [
      { k: "nom", type: "number", label: "Nominal GDP (₹ cr)", val: 27500 },
      { k: "def", type: "number", label: "GDP deflator (index)", val: 125 },
    ],
    draw(v, els) {
      els.out.innerHTML = `Real GDP = Nominal / deflator × 100 = <b>₹ ${f(v.nom / v.def * 100, 1)} cr</b>\nInflation embedded in the nominal figure: ${f(v.def - 100, 1)} % price rise vs base year.`;
    },
  }];

  W["eco-m3"] = [{
    title: "Time value of money — compound growth curve",
    controls: [
      { k: "p", type: "number", label: "Principal P (₹)", val: 100000 },
      { k: "i", type: "range", label: "Interest i (%/yr)", min: 1, max: 20, step: 0.5, val: 8 },
      { k: "n", type: "range", label: "Years n", min: 1, max: 30, step: 1, val: 10 },
    ],
    chart: true,
    draw(v, els) {
      const i = v.i / 100;
      const F = k => v.p * Math.pow(1 + i, k);
      const A = v.p * (i * Math.pow(1 + i, v.n)) / (Math.pow(1 + i, v.n) - 1);
      LCharts.lineChart(els.chart, {
        xLabel: "years", yLabel: "future worth (₹)", height: 300,
        series: [{ name: "F = P(1+i)ⁿ", color: C1(), pts: range(0, v.n, v.n).map(k => [k, F(k)]) }],
      });
      els.out.innerHTML = `F = P(1+i)ⁿ = <b>₹ ${f(F(v.n), 0)}</b>\nEquivalent annual payment (capital recovery): A = <b>₹ ${f(A, 0)}/yr</b>\nDoubling time ≈ 72/${v.i} = ${f(72 / v.i, 1)} years (rule of 72).`;
    },
  }];

  W["eco-m4"] = [{
    title: "Break-even chart — cost and revenue lines cross at BEP",
    controls: [
      { k: "F", type: "number", label: "Fixed cost F (₹)", val: 200000 },
      { k: "s", type: "number", label: "Selling price s (₹/unit)", val: 50 },
      { k: "v", type: "number", label: "Variable cost v (₹/unit)", val: 30 },
      { k: "act", type: "number", label: "Actual sales (units)", val: 15000 },
    ],
    chart: true,
    draw(v, els) {
      const bep = v.F / (v.s - v.v);
      const qmax = Math.max(2 * bep, v.act * 1.2);
      LCharts.lineChart(els.chart, {
        xLabel: "quantity (units)", yLabel: "₹", height: 300,
        series: [
          { name: "Total cost F + v·q", color: C3(), pts: [[0, v.F], [qmax, v.F + v.v * qmax]], markers: false },
          { name: "Revenue s·q", color: C2(), pts: [[0, 0], [qmax, v.s * qmax]], markers: false },
          { name: "BEP", color: C1(), pts: [[bep, v.s * bep]], connect: false },
        ],
      });
      const mos = (v.act - bep) / v.act;
      els.out.innerHTML = `Contribution = s − v = ₹ ${f(v.s - v.v, 2)}/unit\nBEP = F/(s−v) = <b>${f(bep, 0)} units</b> (₹ ${f(v.s * bep, 0)})\nMargin of safety at ${v.act} units = <b>${f(mos * 100, 1)} %</b>${mos < 0 ? " — operating BELOW break-even!" : ""}`;
    },
  }];

  /* ---------- ETHICS & SD ---------- */
  W["eth-m1"] = [{
    title: "Moral-development ladder (Kohlberg)",
    svg: `<svg viewBox="0 0 520 240" width="520">
      <g font-family="system-ui" font-size="12">
      <rect x="20"  y="170" width="150" height="46" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <rect x="185" y="100" width="150" height="46" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <rect x="350" y="30"  width="150" height="46" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <text x="95"  y="190" text-anchor="middle" fill="var(--ink)" font-weight="600">Pre-conventional</text>
      <text x="95"  y="206" text-anchor="middle" fill="var(--ink-2)">punishment / reward</text>
      <text x="260" y="120" text-anchor="middle" fill="var(--ink)" font-weight="600">Conventional</text>
      <text x="260" y="136" text-anchor="middle" fill="var(--ink-2)">approval / law &amp; order</text>
      <text x="425" y="50"  text-anchor="middle" fill="var(--ink)" font-weight="600">Post-conventional</text>
      <text x="425" y="66"  text-anchor="middle" fill="var(--ink-2)">social contract / universal principles</text>
      <path d="M170 185 L185 130 M335 115 L350 62" stroke="var(--muted)" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
      <text x="260" y="230" text-anchor="middle" fill="var(--muted)">each level has two stages → six stages in all · Gilligan reframes the ladder around care &amp; relationships</text>
      </g></svg>`,
  }];

  W["eth-m2"] = [{
    title: "Risk assessment calculator — risk = probability × severity",
    controls: [
      { k: "p", type: "range", label: "Probability (0–1)", min: 0.05, max: 1, step: 0.05, val: 0.3 },
      { k: "s", type: "range", label: "Severity (1–10)", min: 1, max: 10, step: 1, val: 6 },
    ],
    draw(v, els) {
      const r = v.p * v.s;
      const band = r < 1.5 ? "LOW — manage by routine procedures" : r < 4 ? "MODERATE — mitigate and monitor" : r < 7 ? "HIGH — needs engineered controls & informed consent" : "EXTREME — redesign; risk not acceptable";
      els.out.innerHTML = `Risk score = ${f(v.p, 2)} × ${v.s} = <b>${f(r, 2)}</b>\nClassification: <b>${band}</b>\nAcceptable risk requires: informed consent of those affected + just distribution of risk and benefit.`;
    },
  }];

  W["eth-m3"] = [{
    title: "Sustainability at a glance — 3 pillars, 5 Ps of the SDGs",
    svg: `<svg viewBox="0 0 520 250" width="520">
      <g font-family="system-ui" font-size="12">
      <circle cx="180" cy="90" r="60" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <circle cx="260" cy="140" r="60" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <circle cx="340" cy="90" r="60" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <text x="168" y="72" text-anchor="middle" fill="var(--ink)" font-weight="700">Environment</text>
      <text x="260" y="166" text-anchor="middle" fill="var(--ink)" font-weight="700">Society</text>
      <text x="352" y="72" text-anchor="middle" fill="var(--ink)" font-weight="700">Economy</text>
      <text x="260" y="108" text-anchor="middle" fill="var(--ink-2)" font-weight="600">sustainable</text>
      <text x="60" y="230" fill="var(--ink-2)">17 SDGs grouped as the 5 Ps:</text>
      <text x="235" y="230" fill="var(--accent)" font-weight="600">People · Planet · Prosperity · Peace · Partnership</text>
      </g></svg>`,
  }];

  W["eth-m4"] = [{
    title: "Life-cycle analysis — cradle to grave (and back)",
    svg: `<svg viewBox="0 0 560 200" width="560">
      <g font-family="system-ui" font-size="12">
      ${[["Raw material", 30], ["Manufacture", 170], ["Use phase", 310], ["End of life", 450]].map(([t, x]) =>
        `<rect x="${x}" y="70" width="110" height="44" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
         <text x="${x + 55}" y="96" text-anchor="middle" fill="var(--ink)" font-weight="600">${t}</text>`).join("")}
      <path d="M140 92 L170 92 M280 92 L310 92 M420 92 L450 92" stroke="var(--ink-2)" stroke-width="2"/>
      <path d="M505 114 Q505 170 280 170 Q55 170 55 118" stroke="var(--series-2)" stroke-width="2.2" fill="none" stroke-dasharray="6 5"/>
      <text x="280" y="188" text-anchor="middle" fill="var(--series-2)" font-weight="600">recycle / reuse loop → circular economy</text>
      </g></svg>`,
  }];

  /* ================= builder ================= */
  function build(host, w) {
    if (w.svg) {
      host.insertAdjacentHTML("beforeend",
        `<p style="margin:10px 0 4px;font-weight:600">${w.title}</p><div class="schematic">${w.svg}</div>`);
      return;
    }
    const wrap = document.createElement("div");
    wrap.className = "iw" + (w.chart ? "" : " noc");
    const panel = document.createElement("div");
    panel.className = "calc";
    let h = `<h4>${w.title}</h4>`;
    (w.controls || []).forEach(c => {
      let ctl;
      if (c.type === "select") ctl = `<select name="${c.k}">${c.opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select>`;
      else if (c.type === "range") ctl = `<span style="display:flex;align-items:center;gap:8px"><input type="range" name="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${c.val}"><span class="rv" data-rv="${c.k}">${c.val}</span></span>`;
      else if (c.type === "text") ctl = `<input type="text" name="${c.k}" value="${c.val}">`;
      else ctl = `<input type="number" step="any" name="${c.k}" value="${c.val}">`;
      h += `<label${c.type === "text" ? ' class="stack"' : ""}>${c.label}${ctl}</label>`;
    });
    panel.innerHTML = h;
    const out = document.createElement("div");
    out.className = "out";
    panel.appendChild(out);
    wrap.appendChild(panel);
    let chart = null;
    if (w.chart) { chart = document.createElement("div"); chart.className = "chart-box"; wrap.appendChild(chart); }
    host.appendChild(wrap);

    function vals() {
      const v = {};
      panel.querySelectorAll("[name]").forEach(i => {
        if (i.tagName === "SELECT" || i.type === "text") v[i.name] = i.value;
        else v[i.name] = i.value === "" ? NaN : +i.value;
      });
      return v;
    }
    function render() {
      panel.querySelectorAll('input[type="range"]').forEach(r => {
        const s = panel.querySelector(`[data-rv="${r.name}"]`);
        if (s) s.textContent = r.value;
      });
      try { w.draw(vals(), { chart, out }); } catch (e) { out.textContent = "…"; }
    }
    panel.addEventListener("input", render);
    window.STUDY_SIMS.push(render);
    render();
  }

  Object.keys(W).forEach(id => {
    const art = document.getElementById(id);
    if (!art) return;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h3>Interactive — play with the concept</h3>";
    const host = document.createElement("div");
    card.appendChild(host);
    art.appendChild(card);
    W[id].forEach(w => build(host, w));
  });
})();
