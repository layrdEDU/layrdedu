/* LayrdEDU — application logic: tabs, observation tables, calculators, simulations */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const C1 = () => css("--series-1"), C2 = () => css("--series-2"), C3 = () => css("--series-3");
  const f = (v, d = 3) => (v === null || v === undefined || !Number.isFinite(v)) ? "—" : (+v.toFixed(d)).toString();

  /* ================= theme ================= */
  const themeBtn = $("#themeBtn");
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t;
    themeBtn.textContent = (document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches)) ? "☀" : "☾";
    redrawAll();
  }
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    localStorage.setItem("layrd-theme", next);
    applyTheme(next);
  });

  /* ================= tabs & navigation ================= */
  // labs = the two lab-manual tabs + all Study Hub subject tabs injected by study.js
  const labs = ["ae", "cm"].concat(window.STUDY_LABS || []);
  const labOf = id => { const p = (id || "").split("-")[0]; return labs.includes(p) ? p : null; };
  function showLab(lab) {
    labs.forEach(l => {
      $("#tab-" + l).classList.toggle("active", l === lab);
      $("#nav-" + l).style.display = l === lab ? "" : "none";
    });
    const first = $(`#nav-${lab} button`);
    if (!$$(`#nav-${lab} button.active`).length && first) first.click();
    else {
      const act = $(`#nav-${lab} button.active`);
      if (act) showExp(lab, act.dataset.exp);
    }
    localStorage.setItem("layrd-lab", lab);
  }
  function showExp(lab, id) {
    $$(`#nav-${lab} button`).forEach(b => b.classList.toggle("active", b.dataset.exp === id));
    $$("article.exp").forEach(a => a.classList.toggle("active", a.id === id));
    try { history.replaceState(null, "", "#" + id); } catch (_) { }
    window.scrollTo({ top: 0, behavior: "auto" });
    // charts drawn while their article was hidden used a fallback width — redraw now that it is visible
    requestAnimationFrame(() => { try { redrawAll(); } catch (_) { } });
  }
  labs.forEach(lab => {
    $("#tab-" + lab).addEventListener("click", () => showLab(lab));
    $$(`#nav-${lab} button`).forEach(b => b.addEventListener("click", () => showExp(lab, b.dataset.exp)));
  });

  /* ================= observation-table framework =================
     cfg: { id, cols:[{key,label,unit,input,calc,dec,cls}], rows:[{..}], derive(rows)->stats[],
            charts:[{el, build(rows)->chartCfg}] } */
  const TABLES = {};
  function makeTable(cfg) {
    TABLES[cfg.id] = cfg;
    const host = $("#" + cfg.id);
    if (!host) return;
    const wrap = document.createElement("div");
    wrap.className = "tbl-wrap";
    const tbl = document.createElement("table");
    tbl.className = "obs";
    wrap.appendChild(tbl);
    host.appendChild(wrap);
    const actions = document.createElement("div");
    actions.className = "tbl-actions";
    actions.innerHTML = `<button class="btn primary" data-a="add">＋ Add reading</button>
      <button class="btn" data-a="reset">↺ Reset to manual data</button>
      <button class="btn danger" data-a="clear">Clear all</button>`;
    host.appendChild(actions);
    const strip = document.createElement("div");
    strip.className = "result-strip";
    host.appendChild(strip);

    let rows = cfg.rows.map(r => ({ ...r }));
    const defaults = cfg.rows.map(r => ({ ...r }));

    function render() {
      let h = "<thead><tr><th>Sl.</th>";
      cfg.cols.forEach(c => {
        h += `<th>${c.label}${c.unit ? `<small>${c.unit}</small>` : ""}</th>`;
      });
      h += "<th></th></tr></thead><tbody>";
      rows.forEach((r, i) => {
        // normalized copy: empty inputs become NaN so calc cells show "—" instead of coercing null→0
        const cr = { ...r };
        for (const k in cr) if (cr[k] === null || cr[k] === undefined) cr[k] = NaN;
        h += `<tr><td>${i + 1}</td>`;
        cfg.cols.forEach(c => {
          if (c.input) {
            const v = r[c.key];
            h += `<td><input type="number" step="any" data-r="${i}" data-k="${c.key}" value="${v === null || v === undefined ? "" : v}"></td>`;
          } else {
            const v = c.calc(cr, rows, i);
            const cls = c.cls ? c.cls(cr, rows, i) : "";
            h += `<td class="calc ${cls}">${typeof v === "string" ? v : f(v, c.dec ?? 3)}</td>`;
          }
        });
        h += `<td><button class="rowdel" title="delete row" data-del="${i}">✕</button></td></tr>`;
      });
      h += "</tbody>";
      tbl.innerHTML = h;
      // stats
      strip.innerHTML = "";
      (cfg.derive ? cfg.derive(rows) : []).forEach(st => {
        strip.insertAdjacentHTML("beforeend",
          `<div class="stat"><div class="k">${st.k}</div><div class="v">${st.v}${st.u ? ` <small>${st.u}</small>` : ""}</div></div>`);
      });
      // charts
      (cfg.charts || []).forEach(ch => {
        const el = $("#" + ch.el);
        if (el) LCharts.lineChart(el, ch.build(rows));
      });
    }

    tbl.addEventListener("input", e => {
      const t = e.target;
      if (t.matches("input")) {
        rows[+t.dataset.r][t.dataset.k] = t.value === "" ? null : +t.value;
        // re-render calc cells only (simpler: full render but preserve focus)
        const pos = { r: t.dataset.r, k: t.dataset.k, s: t.selectionStart };
        render();
        const again = tbl.querySelector(`input[data-r="${pos.r}"][data-k="${pos.k}"]`);
        if (again) { again.focus(); try { again.setSelectionRange(pos.s, pos.s); } catch (_) { } }
      }
    });
    tbl.addEventListener("click", e => {
      if (e.target.dataset.del !== undefined) { rows.splice(+e.target.dataset.del, 1); render(); }
    });
    actions.addEventListener("click", e => {
      const a = e.target.dataset.a;
      if (a === "add") { const blank = {}; cfg.cols.forEach(c => { if (c.input) blank[c.key] = null; }); rows.push(blank); render(); }
      if (a === "reset") { rows = defaults.map(r => ({ ...r })); render(); }
      if (a === "clear") { rows = []; render(); }
    });
    cfg._render = render;
    render();
  }
  function redrawAll() {
    Object.values(TABLES).forEach(t => t._render && t._render());
    Object.values(SIMS).forEach(fn => { try { fn(); } catch (_) { } });
    (window.STUDY_SIMS || []).forEach(fn => { try { fn(); } catch (_) { } });
  }

  /* ================= generic calculator widgets =================
     <div class="calc" data-calc="id"> with inputs[name] ; CALCS[id](values)->outHTML */
  const CALCS = {};
  function bindCalcs() {
    $$(".calc[data-calc]").forEach(box => {
      const id = box.dataset.calc;
      const out = box.querySelector(".out");
      function run() {
        const vals = {};
        $$("input,select", box).forEach(i => vals[i.name] = i.type === "checkbox" ? i.checked : (i.value === "" ? NaN : +i.value));
        out.innerHTML = CALCS[id] ? CALCS[id](vals) : "";
      }
      box.addEventListener("input", run);
      run();
    });
  }

  /* helpers */
  const log10 = Math.log10;
  function bandwidth(rows, vinKey) {
    // rows: {fq, vo}; gain dB
    const pts = rows.filter(r => r.fq > 0 && r.vo > 0)
      .map(r => ({ x: log10(r.fq), g: 20 * log10(r.vo / vinKey) }))
      .sort((a, b) => a.x - b.x);
    if (pts.length < 3) return null;
    const gmax = Math.max(...pts.map(p => p.g));
    const cut = gmax - 3;
    let fL = null, fH = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (a.g < cut && b.g >= cut && fL === null)
        fL = Math.pow(10, a.x + (cut - a.g) / (b.g - a.g) * (b.x - a.x));
      if (a.g >= cut && b.g < cut)
        fH = Math.pow(10, a.x + (cut - a.g) / (b.g - a.g) * (b.x - a.x));
    }
    return { gmax, cut, fL, fH, bw: (fL && fH) ? fH - fL : null };
  }
  const eng = v => {
    if (!Number.isFinite(v)) return "—";
    if (Math.abs(v) >= 1e6) return f(v / 1e6) + " MHz";
    if (Math.abs(v) >= 1e3) return f(v / 1e3) + " kHz";
    return f(v) + " Hz";
  };

  /* =========================================================
     ANALOG ELECTRONICS LAB
  ==========================================================*/

  // ---- Expt 2: RC coupled amplifier ----
  const RC_VIN = 0.1;
  makeTable({
    id: "tbl-rc-amp",
    cols: [
      { key: "fq", label: "Frequency", unit: "Hz", input: true },
      { key: "vo", label: "Output V₀", unit: "V", input: true },
      { key: "av", label: "V₀ / Vᵢ", calc: r => r.vo / RC_VIN, dec: 1 },
      { key: "g", label: "Gain", unit: "dB = 20·log(V₀/Vᵢ)", calc: r => 20 * log10(r.vo / RC_VIN), dec: 3 },
      { key: "lf", label: "log f", calc: r => log10(r.fq), dec: 3 },
    ],
    rows: [
      { fq: 100, vo: 1.2 }, { fq: 200, vo: 2 }, { fq: 300, vo: 2.4 }, { fq: 400, vo: 2.8 },
      { fq: 500, vo: 3 }, { fq: 600, vo: 3 }, { fq: 1800, vo: 3 }, { fq: 2500, vo: 3 },
      { fq: 4000, vo: 3 }, { fq: 7000, vo: 3 }, { fq: 10000, vo: 3 }, { fq: 100000, vo: 3 },
      { fq: 1000000, vo: 2.8 }, { fq: 2000000, vo: 2.2 }, { fq: 3000000, vo: 1.6 },
    ],
    derive(rows) {
      const b = bandwidth(rows, RC_VIN);
      if (!b) return [{ k: "Bandwidth", v: "—" }];
      return [
        { k: "Mid-band gain", v: f(b.gmax, 2), u: "dB" },
        { k: "fL (−3 dB)", v: b.fL ? eng(b.fL) : "—" },
        { k: "fH (−3 dB)", v: b.fH ? eng(b.fH) : "—" },
        { k: "Bandwidth fH − fL", v: b.bw ? eng(b.bw) : "—" },
      ];
    },
    charts: [{
      el: "cht-rc-amp",
      build(rows) {
        const pts = rows.filter(r => r.fq > 0 && r.vo > 0).map(r => [log10(r.fq), 20 * log10(r.vo / RC_VIN)]);
        const b = bandwidth(rows, RC_VIN);
        return {
          xLabel: "log f", yLabel: "Gain (dB)", zeroY: false,
          series: [{ name: "Gain", color: C1(), pts }],
          refY: b && b.fL ? [{ y: b.cut, label: "−3 dB" }] : [],
        };
      },
    }],
  });

  // ---- Expt 3: FET amplifier ----
  makeTable({
    id: "tbl-fet-amp",
    cols: [
      { key: "fq", label: "Frequency", unit: "Hz", input: true },
      { key: "vo", label: "Output V₀", unit: "V", input: true },
      { key: "g", label: "Gain", unit: "dB", calc: r => 20 * log10(r.vo / RC_VIN), dec: 2 },
      { key: "lf", label: "log f", calc: r => log10(r.fq), dec: 3 },
    ],
    rows: [
      { fq: 352, vo: 0.2 }, { fq: 460, vo: 0.22 }, { fq: 500, vo: 0.24 }, { fq: 560, vo: 0.26 },
      { fq: 800, vo: 0.32 }, { fq: 1000, vo: 0.34 }, { fq: 3000, vo: 0.4 }, { fq: 7000, vo: 0.4 },
      { fq: 20000, vo: 0.4 }, { fq: 50000, vo: 0.4 }, { fq: 300000, vo: 0.32 }, { fq: 600000, vo: 0.26 },
      { fq: 725000, vo: 0.24 }, { fq: 840000, vo: 0.22 }, { fq: 960000, vo: 0.2 },
    ],
    derive(rows) {
      const b = bandwidth(rows, RC_VIN);
      if (!b) return [];
      return [
        { k: "Mid-band gain", v: f(b.gmax, 2), u: "dB" },
        { k: "fL (−3 dB)", v: b.fL ? eng(b.fL) : "—" },
        { k: "fH (−3 dB)", v: b.fH ? eng(b.fH) : "—" },
        { k: "Bandwidth", v: b.bw ? eng(b.bw) : "—" },
      ];
    },
    charts: [{
      el: "cht-fet-amp",
      build(rows) {
        const pts = rows.filter(r => r.fq > 0 && r.vo > 0).map(r => [log10(r.fq), 20 * log10(r.vo / RC_VIN)]);
        const b = bandwidth(rows, RC_VIN);
        return {
          xLabel: "log f", yLabel: "Gain (dB)", zeroY: false,
          series: [{ name: "Gain", color: C1(), pts }],
          refY: b && b.fL ? [{ y: b.cut, label: "−3 dB" }] : [],
        };
      },
    }],
  });

  // ---- Expt 4: clipping / clamping simulator ----
  const SIMS = {};
  // memory-less input→output mapping shared by the waveform and transfer-characteristic plots
  function clipMap(kind, drop, v, A) {
    let o = v;
    const clipHi = lim => { if (o > lim) o = lim; };
    const clipLo = lim => { if (o < lim) o = lim; };
    switch (kind) {
      case "pos0": clipHi(drop); break;
      case "neg0": clipLo(-drop); break;
      case "pos3": clipHi(3 + drop); break;
      case "posm3": clipHi(-3 + drop); break;
      case "neg3": clipLo(3 - drop); break;
      case "double3": clipHi(3 + drop); clipLo(-3 - drop); break;
      case "slicer35": clipHi(5 + drop); clipLo(3 - drop); break;
      case "slicerm": clipHi(-3 + drop); clipLo(-5 - drop); break;
      // clampers: shift the whole wave by a DC level set by the charged capacitor
      case "clampPos0": o = v + A - drop; break;
      case "clampNeg0": o = v - A + drop; break;
      case "clampPos3": o = v + A + 3 - drop; break;
      case "clampPosM3": o = v + A - 3 - drop; break;
      case "clampNeg3": o = v - A + 3 + drop; break;
    }
    return o;
  }
  function clipperSim() {
    const el = $("#cht-clipper"); if (!el) return;
    const kind = $("#clip-kind").value, drop = $("#clip-drop").checked ? 0.6 : 0;
    const A = 10; // 20 Vpp
    const inPts = [], outPts = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 120; // two cycles
      const v = A * Math.sin(2 * Math.PI * t);
      inPts.push([t, v]); outPts.push([t, clipMap(kind, drop, v, A)]);
    }
    LCharts.lineChart(el, {
      xLabel: "time (cycles)", yLabel: "voltage (V)", height: 320, zeroY: false,
      series: [
        { name: "Vin (20 Vpp)", color: C1(), pts: inPts, markers: false, dashed: true },
        { name: "Vo", color: C2(), pts: outPts, markers: false },
      ],
    });
    // transfer characteristic Vo vs Vin (as observed in CRO X-Y mode)
    const tc = $("#cht-clip-tc");
    if (tc) {
      const tPts = [], idPts = [];
      for (let v = -A; v <= A + 1e-9; v += 0.25) { tPts.push([v, clipMap(kind, drop, v, A)]); idPts.push([v, v]); }
      LCharts.lineChart(tc, {
        xLabel: "Vin (V)", yLabel: "Vo (V)", height: 320, zeroY: false,
        series: [
          { name: "Vo = Vin (reference)", color: C1(), pts: idPts, markers: false, dashed: true },
          { name: "Transfer characteristic", color: C2(), pts: tPts, markers: false },
        ],
      });
    }
    const desc = {
      pos0: "Positive clipper, 0 V — positive half-cycles removed; clipping at +0.6 V with diode drop.",
      neg0: "Negative clipper, 0 V — negative half-cycles removed; clipping at −0.6 V with diode drop.",
      pos3: "Positive clipper at +3 V — output limited to +3.6 V (bias + diode drop).",
      posm3: "Positive clipper at −3 V — everything above −2.4 V is clipped.",
      neg3: "Negative clipper at +3 V — output cannot fall below +2.4 V.",
      double3: "Double clipper ±3 V — output limited between +3.6 V and −3.6 V.",
      slicer35: "Two-level slicer — output confined between +2.4 V and +5.6 V.",
      slicerm: "Slicer at −5 V / −3 V — output confined between −5.6 V and −2.4 V.",
      clampPos0: "Positive clamper, 0 V — wave shifted up; swings −0.6 V → +19.4 V.",
      clampNeg0: "Negative clamper, 0 V — wave shifted down; swings +0.6 V → −19.4 V.",
      clampPos3: "Positive clamper at +3 V — swings +2.4 V → +22.4 V.",
      clampPosM3: "Positive clamper at −3 V — swings −3.6 V → +16.4 V.",
      clampNeg3: "Negative clamper at +3 V — swings +3.6 V → −16.4 V.",
    };
    $("#clip-desc").textContent = desc[kind] || "";
  }
  SIMS.clipper = clipperSim;
  if ($("#clip-kind")) { $("#clip-kind").addEventListener("input", clipperSim); $("#clip-drop").addEventListener("input", clipperSim); }

  // ---- Expt 5a: zener regulator ----
  makeTable({
    id: "tbl-zener-line",
    cols: [
      { key: "vin", label: "Vin", unit: "V", input: true },
      { key: "vo", label: "V₀", unit: "V", input: true },
    ],
    rows: [
      { vin: 7, vo: 1 }, { vin: 8, vo: 2.3 }, { vin: 9, vo: 3.2 }, { vin: 10, vo: 4.2 },
      { vin: 11, vo: 5 }, { vin: 12, vo: 5.4 }, { vin: 13, vo: 5.5 }, { vin: 14, vo: 5.6 },
      { vin: 15, vo: 5.6 }, { vin: 16, vo: 5.6 },
    ],
    derive(rows) {
      // % line regulation between the two rows nearest the knee (max slope end): use manual method ΔVL/ΔVin ×100 across a chosen pair — take pair with Vin 11→12 if present, else last two distinct
      const v = rows.filter(r => Number.isFinite(r.vin) && Number.isFinite(r.vo)).sort((a, b) => a.vin - b.vin);
      if (v.length < 2) return [];
      // find first pair where zener regulates (Vo change small) — use manual approach: ΔVL/ΔVi over the pair just after turn-on
      // use the first pair fully inside the regulation region (both points past the knee),
      // matching the manual: (5.4−5)/(12−11)×100 = 40 %
      let best = null;
      const knee = 0.8 * Math.max(...v.map(r => r.vo));
      for (let i = 1; i < v.length; i++) {
        const dv = v[i].vo - v[i - 1].vo, di = v[i].vin - v[i - 1].vin;
        if (v[i - 1].vo >= knee && v[i].vo >= knee && di > 0) { best = 100 * dv / di; break; }
      }
      const last = v[v.length - 1], prev = v[v.length - 2];
      const fallback = 100 * (last.vo - prev.vo) / (last.vin - prev.vin);
      return [{ k: "% Line regulation = (ΔV_L/ΔV_in)×100", v: f(best !== null ? best : fallback, 2), u: "%" }];
    },
    charts: [{
      el: "cht-zener-line",
      build: rows => ({
        xLabel: "Vin (V)", yLabel: "V₀ (V)",
        series: [{ name: "Line regulation (IL = 5 mA)", color: C1(), pts: rows.filter(r => Number.isFinite(r.vin) && Number.isFinite(r.vo)).map(r => [r.vin, r.vo]) }],
      }),
    }],
  });
  makeTable({
    id: "tbl-zener-load",
    cols: [
      { key: "il", label: "I_L", unit: "mA", input: true },
      { key: "vo", label: "V₀", unit: "V", input: true },
    ],
    rows: [{ il: 0, vo: 5.6 }, { il: 5, vo: 4.4 }, { il: 6, vo: 3.3 }, { il: 7, vo: 2.2 }, { il: 8, vo: 0.9 }, { il: 9, vo: 0.1 }],
    derive(rows) {
      const v = rows.filter(r => Number.isFinite(r.il) && Number.isFinite(r.vo)).sort((a, b) => a.il - b.il);
      if (v.length < 2) return [];
      const VNL = v[0].vo;
      const rated = v.find(r => r.il >= 5) || v[v.length - 1];
      const VFL = rated.vo;
      return [
        { k: "V_NL (no load)", v: f(VNL, 2), u: "V" },
        { k: "V_FL (rated I_L)", v: f(VFL, 2), u: "V" },
        { k: "% Load reg. = (V_NL−V_FL)/V_FL ×100", v: f(100 * (VNL - VFL) / VFL, 2), u: "%" },
      ];
    },
    charts: [{
      el: "cht-zener-load",
      build: rows => ({
        xLabel: "I_L (mA)", yLabel: "V₀ (V)",
        series: [{ name: "Load regulation (Vin = 10 V)", color: C2(), pts: rows.filter(r => Number.isFinite(r.il) && Number.isFinite(r.vo)).map(r => [r.il, r.vo]) }],
      }),
    }],
  });

  // ---- Expt 5b: zener + emitter follower ----
  makeTable({
    id: "tbl-zef-line",
    cols: [
      { key: "vin", label: "Vin", unit: "V", input: true },
      { key: "vo", label: "V₀", unit: "V", input: true },
    ],
    rows: [{ vin: 10, vo: 8.2 }, { vin: 12, vo: 8.4 }, { vin: 14, vo: 8.6 }, { vin: 16, vo: 8.6 }],
    derive(rows) {
      const v = rows.filter(r => Number.isFinite(r.vin) && Number.isFinite(r.vo)).sort((a, b) => a.vin - b.vin);
      if (v.length < 2) return [];
      const dV = v[v.length - 1].vo - v[0].vo, dVi = v[v.length - 1].vin - v[0].vin;
      return [{ k: "% Line regulation = (ΔV₀×100)/ΔVin", v: f(100 * dV / dVi, 2), u: "%" }];
    },
    charts: [{
      el: "cht-zef-line",
      build: rows => ({
        xLabel: "Vin (V)", yLabel: "V₀ (V)",
        series: [{ name: "Line regulation (I_L = 500 mA)", color: C1(), pts: rows.filter(r => Number.isFinite(r.vin) && Number.isFinite(r.vo)).map(r => [r.vin, r.vo]) }],
      }),
    }],
  });
  makeTable({
    id: "tbl-zef-load",
    cols: [
      { key: "il", label: "I_L", unit: "A", input: true },
      { key: "vo", label: "V₀", unit: "V", input: true },
    ],
    rows: [{ il: 0.5, vo: 8.6 }, { il: 0.6, vo: 8.5 }, { il: 0.7, vo: 8.4 }, { il: 0.8, vo: 8.3 }],
    derive(rows) {
      const v = rows.filter(r => Number.isFinite(r.il) && Number.isFinite(r.vo)).sort((a, b) => a.il - b.il);
      if (v.length < 2) return [];
      const VNL = v[0].vo, VFL = v[v.length - 1].vo;
      return [{ k: "% Load reg. = (V_NL−V_FL)/V_NL ×100", v: f(100 * (VNL - VFL) / VNL, 2), u: "%" }];
    },
    charts: [{
      el: "cht-zef-load",
      build: rows => ({
        xLabel: "I_L (A)", yLabel: "V₀ (V)",
        series: [{ name: "Load regulation (Vin = 15 V)", color: C2(), pts: rows.filter(r => Number.isFinite(r.il) && Number.isFinite(r.vo)).map(r => [r.il, r.vo]) }],
      }),
    }],
  });

  // ---- Expt 6: op-amp calculators ----
  CALCS["inv"] = v => {
    const A = -v.rf / v.ri;
    return `Gain A = −Rf/Rᵢ = <b>${f(A, 2)}</b>\nVo = ${f(A * v.vin, 2)} V (${f(Math.abs(A * v.vin), 2)} V, 180° out of phase)`;
  };
  CALCS["noninv"] = v => {
    const A = 1 + v.rf / v.ri;
    return `Gain A = 1 + Rf/Rᵢ = <b>${f(A, 2)}</b>\nVo = ${f(A * v.vin, 2)} V (in phase)`;
  };
  CALCS["adder"] = v => {
    const vo = -v.rf * (v.v1 / v.r1 + v.v2 / v.r2);
    return `Vo = −Rf·(V₁/R₁ + V₂/R₂) = <b>${f(vo, 2)} V</b>`;
  };
  CALCS["integ"] = v => {
    const fb = 1 / (2 * Math.PI * v.rf * 1e3 * v.c * 1e-6);
    const fa = 1 / (2 * Math.PI * v.r * 1e3 * v.c * 1e-6);
    return `Break frequency f_b = 1/(2πRfC) = <b>${eng(fb)}</b>\nUnity-gain f_a = 1/(2πRC) = ${eng(fa)}\nProper integration for T ≥ RfC = ${f(v.rf * 1e3 * v.c * 1e-6 * 1000, 2)} ms`;
  };
  CALCS["diff"] = v => {
    const fa = 1 / (2 * Math.PI * v.rf * 1e3 * v.c * 1e-6);
    return `f_a = 1/(2πRfC₁) = <b>${eng(fa)}</b>\nVo = −Rf·C₁·dVin/dt (spikes on square-wave edges)`;
  };

  // ---- Expt 7: oscillators ----
  CALCS["psosc"] = v => {
    const fo = 1 / (2 * Math.PI * Math.sqrt(6) * v.r * 1e3 * v.c * 1e-6);
    const fm = v.t > 0 ? 1000 / v.t : NaN;
    const dev = Number.isFinite(fm) ? 100 * (fm - fo) / fo : NaN;
    return `Designed f₀ = 1/(2π√6·RC) = <b>${eng(fo)}</b>\nMeasured f = 1/T = ${Number.isFinite(fm) ? eng(fm) : "—"}\nDeviation = ${f(dev, 2)} %\nRequired gain Rf/R₁ ≥ 29`;
  };
  CALCS["wien"] = v => {
    const fo = 1 / (2 * Math.PI * v.r * 1e3 * v.c * 1e-6);
    const fm = v.t > 0 ? 1000 / v.t : NaN;
    return `Designed f₀ = 1/(2πRC) = <b>${eng(fo)}</b>\nMeasured f = 1/T = ${Number.isFinite(fm) ? eng(fm) : "—"}\nRequired gain 1 + Rf/R₁ = 3`;
  };

  // ---- Expt 8: waveform generators ----
  CALCS["trigen"] = v => {
    const fo = (v.r1 * 1e3) / (4 * v.r2 * (v.r3 * 1e3) * (v.c * 1e-6) * 1e3) / 1;
    // f = R1/(4 R2 R3 C): R1 kΩ, R2 Ω, R3 kΩ, C µF
    const fr = (v.r1 * 1e3) / (4 * v.r2 * v.r3 * 1e3 * v.c * 1e-6);
    const vpp = 2 * (v.r2 / (v.r1 * 1e3)) * v.vsat;
    return `f = R₁/(4·R₂·R₃·C) = <b>${eng(fr)}</b>\nV₀(p-p) = 2·(R₂/R₁)·V_sat = <b>${f(vpp, 2)} V</b>`;
  };

  // ---- Expt 9: Schmitt trigger ----
  CALCS["schmitt"] = v => {
    const k2 = v.r2 / (v.r1 + v.r2), k1 = v.r1 / (v.r1 + v.r2);
    const utp = v.vsat * k2 + v.vref * k1;
    const ltp = -v.vsat * k2 + v.vref * k1;
    return `UTP = +V_sat·R₂/(R₁+R₂) + V_ref·R₁/(R₁+R₂) = <b>${f(utp, 2)} V</b>\nLTP = −V_sat·R₂/(R₁+R₂) + V_ref·R₁/(R₁+R₂) = <b>${f(ltp, 2)} V</b>\nHysteresis V_H = UTP − LTP = ${f(utp - ltp, 2)} V`;
  };
  makeTable({
    id: "tbl-schmitt",
    cols: [
      { key: "name", label: "Value", input: false, calc: (r, rows, i) => i === 0 ? "Theoretical" : "Observed" },
      { key: "utp", label: "UTP", unit: "V", input: true },
      { key: "ltp", label: "LTP", unit: "V", input: true },
      { key: "vsat", label: "V_sat", unit: "V", input: true },
      { key: "hys", label: "Hysteresis", unit: "V", calc: r => r.utp - r.ltp, dec: 2 },
    ],
    rows: [{ utp: 3, ltp: 2, vsat: 12 }, { utp: 2.8, ltp: 1.8, vsat: 11 }],
  });

  // ---- Expt 10: 555 astable ----
  CALCS["astable"] = v => {
    const tc = 0.69 * (v.ra + v.rb) * 1e3 * v.c * 1e-6 * 1000; // ms
    const td = 0.69 * v.rb * 1e3 * v.c * 1e-6 * 1000;
    const T = tc + td, fr = 1000 / T;
    const duty = 100 * (v.ra + v.rb) / (v.ra + 2 * v.rb);
    return `t_c = 0.69·(R_a+R_b)·C = <b>${f(tc, 3)} ms</b>\nt_d = 0.69·R_b·C = <b>${f(td, 3)} ms</b>\nT = ${f(T, 3)} ms → f = <b>${eng(fr)}</b>\nDuty cycle = ${f(duty, 1)} %\nThresholds: ⅔V_CC = ${f(v.vcc * 2 / 3, 2)} V, ⅓V_CC = ${f(v.vcc / 3, 2)} V`;
  };
  makeTable({
    id: "tbl-astable",
    cols: [
      { key: "name", label: "Value", input: false, calc: (r, rows, i) => i === 0 ? "Theoretical" : "Observed" },
      { key: "tc", label: "t_c", unit: "ms", input: true },
      { key: "td", label: "t_d", unit: "ms", input: true },
      { key: "v23", label: "⅔ V_CC", unit: "V", input: true },
      { key: "v13", label: "⅓ V_CC", unit: "V", input: true },
      { key: "vcc", label: "V_CC", unit: "V", input: true },
      { key: "fr", label: "f = 1/(t_c+t_d)", unit: "Hz", calc: r => 1000 / (r.tc + r.td), dec: 1 },
    ],
    rows: [{ tc: 0.5, td: 0.25, v23: 6.6, v13: 3.33, vcc: 10 }, { tc: 0.6, td: 0.3, v23: 8, v13: 3.5, vcc: 10.1 }],
  });

  // ---- Expt 11: 555 monostable ----
  CALCS["mono"] = v => {
    const tp = 1.1 * v.r * 1e3 * v.c * 1e-6 * 1000;
    const err = Number.isFinite(v.tm) ? 100 * (v.tm - tp) / tp : NaN;
    return `Theoretical t_p = 1.1·R·C = <b>${f(tp, 3)} ms</b>` +
      (Number.isFinite(v.tm) ? `\nPractical t_p = ${f(v.tm, 3)} ms\nDeviation = ${f(err, 2)} %` : "");
  };

  // ---- Expt 1: CRO calculators ----
  CALCS["croAmp"] = v => {
    const vpp = v.div * v.vdiv;
    return `V(p-p) = divisions × volts/div = <b>${f(vpp, 3)} V</b>\nV_peak = ${f(vpp / 2, 3)} V\nV_rms = V_peak/√2 = ${f(vpp / 2 / Math.SQRT2, 3)} V`;
  };
  CALCS["croFreq"] = v => {
    const T = v.div * v.tdiv / (v.mag || 1); // ms
    return `T = div × time/div ÷ magnification = <b>${f(T, 4)} ms</b>\nf = 1/T = <b>${eng(1000 / T)}</b>`;
  };
  CALCS["croPhase"] = v => {
    const s = v.y1 / v.y2;
    if (!(s >= -1 && s <= 1)) return "Require |Y₁/Y₂| ≤ 1";
    const ph = Math.asin(s) * 180 / Math.PI;
    return `sin φ = Y₁/Y₂ = ${f(s, 3)}\nPhase difference φ = <b>${f(ph, 2)}°</b>`;
  };

  /* ============ waveform simulations (graphs from the experiment objectives) ============ */
  const calcInput = (calc, name) => { const e = $(`.calc[data-calc="${calc}"] [name="${name}"]`); return e ? +e.value : NaN; };
  const bindSim = (sel, fn) => { const e = $(sel); if (e) e.addEventListener("input", fn); };

  // Expt 1 — Lissajous pattern (X = Vin, Y = Vo shifted by φ)
  function lissajousSim() {
    const el = $("#cht-lissajous"); if (!el) return;
    const y1 = calcInput("croPhase", "y1"), y2 = calcInput("croPhase", "y2");
    const s = y1 / y2, ok = s >= -1 && s <= 1;
    const phi = ok ? Math.asin(s) : Math.PI / 4;
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200 * 2 * Math.PI;
      pts.push([Math.sin(t), (ok ? y2 : 1) * Math.sin(t + phi)]);
    }
    LCharts.lineChart(el, {
      xLabel: "Vin → X plates", yLabel: "Vo → Y plates", height: 300, zeroY: false,
      series: [{ name: "Lissajous", color: C1(), pts, markers: false, sort: false }],
    });
  }
  SIMS.lissajous = lissajousSim;
  bindSim('.calc[data-calc="croPhase"]', lissajousSim);

  // Expt 6 — op-amp input/output waveforms
  function opampSim() {
    const el = $("#cht-opamp"); if (!el) return;
    const kind = $("#oa-kind").value;
    const N = 400, T = 1, dt = 2 * T / N;
    const vin = [], vout = [];
    let integ = 0;
    for (let i = 0; i <= N; i++) {
      const t = i * dt;
      const sine = Math.sin(2 * Math.PI * t / T);
      const square = (t % T) < T / 2 ? 1 : -1;
      let vi, vo;
      switch (kind) {
        case "inv": vi = sine; vo = Math.max(-13, Math.min(13, -10 * sine)); break;
        case "noninv": vi = sine; vo = Math.max(-13, Math.min(13, 11 * sine)); break;
        case "follower": vi = sine; vo = sine; break;
        case "adder": vi = sine; vo = -(sine + 0.5); break; // V2 = 0.5 V DC, unity gains
        case "integ": {
          vi = square;
          integ += -square * dt / 0.30; // 1/(RC) scaled for display: triangle ≈ ±1.65 V
          vo = integ; break;
        }
        case "diff": {
          vi = square;
          const tin = t % (T / 2), edge = (Math.floor(2 * t / T) % 2 === 0) ? -1 : 1;
          vo = 2.5 * edge * Math.exp(-tin / (0.06 * T)); break;
        }
      }
      vin.push([t, vi]); vout.push([t, vo]);
    }
    // centre the integrator triangle about 0
    if (kind === "integ") {
      const m = (Math.max(...vout.map(p => p[1])) + Math.min(...vout.map(p => p[1]))) / 2;
      vout.forEach(p => p[1] -= m);
    }
    LCharts.lineChart(el, {
      xLabel: "time (ms)", yLabel: "voltage (V)", height: 320, zeroY: false,
      series: [
        { name: "Vin", color: C1(), pts: vin, markers: false, dashed: true },
        { name: "Vo", color: C2(), pts: vout, markers: false },
      ],
    });
  }
  SIMS.opamp = opampSim;
  bindSim("#oa-kind", opampSim);

  // Expt 7 — oscillator output waveform at the designed frequency
  function oscSim() {
    const el = $("#cht-osc"); if (!el) return;
    const kind = $("#osc-kind").value;
    let f0, amp = 11;
    if (kind === "ps") f0 = 1 / (2 * Math.PI * Math.sqrt(6) * calcInput("psosc", "r") * 1e3 * calcInput("psosc", "c") * 1e-6);
    else f0 = 1 / (2 * Math.PI * calcInput("wien", "r") * 1e3 * calcInput("wien", "c") * 1e-6);
    if (!Number.isFinite(f0) || f0 <= 0) { el.innerHTML = ""; return; }
    const Tms = 1000 / f0, pts = [];
    for (let i = 0; i <= 300; i++) { const t = i / 300 * 2 * Tms; pts.push([t, amp * Math.sin(2 * Math.PI * t / Tms)]); }
    LCharts.lineChart(el, {
      xLabel: "time (ms)", yLabel: "Vo (V)", height: 300, zeroY: false,
      series: [{ name: `Output sine — f₀ = ${eng(f0)}`, color: C1(), pts, markers: false }],
    });
  }
  SIMS.osc = oscSim;
  bindSim("#osc-kind", oscSim);
  bindSim('.calc[data-calc="psosc"]', oscSim);
  bindSim('.calc[data-calc="wien"]', oscSim);

  // Expt 8 — triangular / saw-tooth generator waveforms (square at A1, ramp at A2)
  function waveGenSim() {
    const el = $("#cht-wavegen"); if (!el) return;
    const r1 = calcInput("trigen", "r1") * 1e3, r2 = calcInput("trigen", "r2"),
      r3 = calcInput("trigen", "r3") * 1e3, c = calcInput("trigen", "c") * 1e-6,
      vsat = calcInput("trigen", "vsat");
    const d = (+$("#wg-duty").value) / 100; // rise fraction (pot position)
    const fr = r1 / (4 * r2 * r3 * c);
    if (!Number.isFinite(fr) || fr <= 0) { el.innerHTML = ""; return; }
    const Tms = 1000 / fr, vp = (r2 / r1) * vsat; // ±Vp triangle
    const tri = [], sq = [];
    for (let i = 0; i <= 400; i++) {
      const t = i / 400 * 2 * Tms, ph = (t / Tms) % 1;
      const rising = ph < d;
      const v = rising ? -vp + 2 * vp * (ph / d) : vp - 2 * vp * ((ph - d) / (1 - d));
      tri.push([t, v]); sq.push([t, rising ? vsat : -vsat]);
    }
    LCharts.lineChart(el, {
      xLabel: "time (ms)", yLabel: "voltage (V)", height: 320, zeroY: false,
      series: [
        { name: "A₁ output (square)", color: C1(), pts: sq, markers: false, dashed: true },
        { name: "A₂ output (triangular / saw-tooth)", color: C2(), pts: tri, markers: false },
      ],
    });
    const lbl = $("#wg-duty-lbl");
    if (lbl) lbl.textContent = `${$("#wg-duty").value} % rise (50 % = triangular; other values = saw-tooth)`;
  }
  SIMS.wavegen = waveGenSim;
  bindSim("#wg-duty", waveGenSim);
  bindSim('.calc[data-calc="trigen"]', waveGenSim);

  // Expt 9 — Schmitt trigger waveforms with UTP / LTP
  function schmittSim() {
    const el = $("#cht-schmitt"); if (!el) return;
    const r1 = calcInput("schmitt", "r1"), r2 = calcInput("schmitt", "r2"),
      vsat = calcInput("schmitt", "vsat"), vref = calcInput("schmitt", "vref");
    const k2 = r2 / (r1 + r2), k1 = r1 / (r1 + r2);
    const utp = vsat * k2 + vref * k1, ltp = -vsat * k2 + vref * k1;
    if (![utp, ltp, vsat].every(Number.isFinite)) { el.innerHTML = ""; return; }
    const A = Math.max(Math.abs(utp), Math.abs(ltp)) * 1.7 + 1;
    const vin = [], vout = [];
    let state = 1; // +Vsat
    for (let i = 0; i <= 400; i++) {
      const t = i / 200; // two cycles
      const v = A * Math.sin(2 * Math.PI * t);
      // inverting Schmitt (Vin at the − input): above UTP → −Vsat, below LTP → +Vsat
      if (state === 1 && v > utp) state = -1;
      else if (state === -1 && v < ltp) state = 1;
      vin.push([t, v]); vout.push([t, state * vsat]);
    }
    LCharts.lineChart(el, {
      xLabel: "time (cycles)", yLabel: "voltage (V)", height: 320, zeroY: false,
      series: [
        { name: "Vin (sine)", color: C1(), pts: vin, markers: false, dashed: true },
        { name: "Vo (square)", color: C2(), pts: vout, markers: false },
      ],
      refY: [{ y: utp, label: "UTP = " + f(utp, 2) + " V" }, { y: ltp, label: "LTP = " + f(ltp, 2) + " V" }],
    });
  }
  SIMS.schmitt = schmittSim;
  bindSim('.calc[data-calc="schmitt"]', schmittSim);

  // Expt 10 — 555 astable: capacitor exponential between ⅓ and ⅔ V_CC + square output
  function astableSim() {
    const el = $("#cht-astable"); if (!el) return;
    const ra = calcInput("astable", "ra") * 1e3, rb = calcInput("astable", "rb") * 1e3,
      c = calcInput("astable", "c") * 1e-6, vcc = calcInput("astable", "vcc");
    const tc = 0.69 * (ra + rb) * c * 1000, td = 0.69 * rb * c * 1000; // ms
    if (![tc, td, vcc].every(v => Number.isFinite(v) && v > 0)) { el.innerHTML = ""; return; }
    const tauC = (ra + rb) * c * 1000, tauD = rb * c * 1000, T = tc + td;
    const cap = [], out = [];
    for (let i = 0; i <= 600; i++) {
      const t = i / 600 * 3 * T, ph = t % T;
      let vc;
      if (ph < tc) vc = vcc + (vcc / 3 - vcc) * Math.exp(-ph / tauC);        // charging toward Vcc
      else vc = (2 * vcc / 3) * Math.exp(-(ph - tc) / tauD);                  // discharging toward 0
      cap.push([t, vc]); out.push([t, ph < tc ? vcc : 0]);
    }
    LCharts.lineChart(el, {
      xLabel: "time (ms)", yLabel: "voltage (V)", height: 320,
      series: [
        { name: "Output — pin 3", color: C1(), pts: out, markers: false, dashed: true },
        { name: "Capacitor — pin 6", color: C2(), pts: cap, markers: false },
      ],
      refY: [{ y: 2 * vcc / 3, label: "⅔ V_CC" }, { y: vcc / 3, label: "⅓ V_CC" }],
    });
  }
  SIMS.astable = astableSim;
  bindSim('.calc[data-calc="astable"]', astableSim);

  // Expt 11 — 555 monostable: trigger, capacitor charge and output pulse t_p = 1.1RC
  function monoSim() {
    const el = $("#cht-mono"); if (!el) return;
    const r = calcInput("mono", "r") * 1e3, c = calcInput("mono", "c") * 1e-6;
    const rc = r * c * 1000, tp = 1.1 * rc; // ms
    if (!Number.isFinite(tp) || tp <= 0) { el.innerHTML = ""; return; }
    const vcc = 10, t0 = 0.15 * tp, span = 2.4 * tp;
    const trig = [], cap = [], out = [];
    for (let i = 0; i <= 600; i++) {
      const t = i / 600 * span;
      // trigger: narrow negative pulses; the second one (during t_p) has no effect
      const nearT = (a) => t >= a && t < a + 0.04 * tp;
      trig.push([t, (nearT(t0) || nearT(t0 + 0.55 * tp)) ? 0 : vcc / 2]);
      const inPulse = t >= t0 && t < t0 + tp;
      out.push([t, inPulse ? vcc : 0]);
      cap.push([t, inPulse ? vcc * (1 - Math.exp(-(t - t0) / rc)) : 0]);
    }
    LCharts.lineChart(el, {
      xLabel: "time (ms)", yLabel: "voltage (V)", height: 320,
      series: [
        { name: "Trigger — pin 2", color: C3(), pts: trig, markers: false, dashed: true },
        { name: "Output — pin 3", color: C1(), pts: out, markers: false },
        { name: "Capacitor voltage", color: C2(), pts: cap, markers: false },
      ],
      refY: [{ y: 2 * vcc / 3, label: "⅔ V_CC" }],
    });
  }
  SIMS.mono = monoSim;
  bindSim('.calc[data-calc="mono"]', monoSim);

  /* =========================================================
     CIRCUITS & MEASUREMENTS LAB
  ==========================================================*/

  // ---- Superposition ----
  // returns null if the row is incomplete, true if I = I' + I'' holds (within meter tolerance), false otherwise
  function superCheck(r) {
    const keys = ["i1", "i1p", "i1q", "i2", "i2p", "i2q", "i3", "i3p", "i3q"];
    if (!keys.every(k => Number.isFinite(r[k]))) return null;
    return [["i1", "i1p", "i1q"], ["i2", "i2p", "i2q"], ["i3", "i3p", "i3q"]].every(([a, b, c]) =>
      Math.abs(r[b] + r[c] - r[a]) <= Math.max(0.05, 0.07 * Math.abs(r[a])));
  }
  makeTable({
    id: "tbl-super",
    cols: [
      { key: "i1", label: "I₁ (both)", unit: "A", input: true },
      { key: "i2", label: "I₂ (both)", unit: "A", input: true },
      { key: "i3", label: "I₃ (both)", unit: "A", input: true },
      { key: "i1p", label: "I₁′ (E₁)", unit: "A", input: true },
      { key: "i2p", label: "I₂′ (E₁)", unit: "A", input: true },
      { key: "i3p", label: "I₃′ (E₁)", unit: "A", input: true },
      { key: "i1q", label: "I₁″ (E₂)", unit: "A", input: true },
      { key: "i2q", label: "I₂″ (E₂)", unit: "A", input: true },
      { key: "i3q", label: "I₃″ (E₂)", unit: "A", input: true },
      { key: "s1", label: "I₁′+I₁″", unit: "A", calc: r => r.i1p + r.i1q, dec: 3 },
      { key: "s2", label: "I₂′+I₂″", unit: "A", calc: r => r.i2p + r.i2q, dec: 3 },
      { key: "s3", label: "I₃′+I₃″", unit: "A", calc: r => r.i3p + r.i3q, dec: 3 },
      {
        key: "ok", label: "Verified?",
        calc: r => {
          const st = superCheck(r);
          return st === null ? "—" : (st ? "✓ verified" : "✗ check");
        },
        cls: r => {
          const st = superCheck(r);
          return st === null ? "" : (st ? "ok" : "err");
        },
      },
    ],
    rows: [
      { i1: 1.05, i2: 0.35, i3: 1.4, i1p: 0.9, i2p: -0.3, i3p: 0.6, i1q: 0.15, i2q: 0.65, i3q: 0.8 },
      { i1: null, i2: null, i3: null, i1p: null, i2p: null, i3p: null, i1q: null, i2q: null, i3q: null },
    ],
    derive() {
      return [{ k: "Verification rule", v: "I = I′ + I″", u: "within ±5–7 % (meter tolerance)" }];
    },
  });

  // ---- RLC series ----
  function rlcSeriesPhasor(rows) {
    const r = rows.find(x => [x.vr, x.vl, x.vc].every(Number.isFinite));
    const host = $("#phasor-rlcs");
    if (!host) return;
    if (!r) { host.innerHTML = ""; return; }
    LCharts.phasor(host, [
      { x: r.vr, y: 0, color: C1(), label: "V_R = " + f(r.vr, 1) + " V" },
      { x: 0, y: r.vl, color: C2(), label: "V_L" },
      { x: 0, y: -r.vc, color: C3(), label: "V_C" },
      { x: r.vr, y: r.vl - r.vc, color: css("--ink"), label: "V", thin: false },
    ], { caption: (r.vl >= r.vc ? "V_L > V_C → lagging p.f." : "V_C > V_L → leading p.f.") + " (first complete row)" });
  }
  makeTable({
    id: "tbl-rlcs",
    cols: [
      { key: "v", label: "V", unit: "V", input: true },
      { key: "i", label: "I", unit: "A", input: true },
      { key: "vr", label: "V_R", unit: "V", input: true },
      { key: "vl", label: "V_L", unit: "V", input: true },
      { key: "vc", label: "V_C", unit: "V", input: true },
      { key: "vcal", label: "√(V_R²+(V_L−V_C)²)", unit: "V", calc: r => Math.hypot(r.vr, r.vl - r.vc), dec: 1 },
      { key: "z", label: "Z = V/I", unit: "Ω", calc: r => r.v / r.i, dec: 1 },
      { key: "y", label: "Y = I/V", unit: "℧", calc: r => r.i / r.v, dec: 4 },
      { key: "pf", label: "cos φ = V_R/V", calc: r => r.vr / r.v, dec: 3 },
      { key: "ll", label: "lag / lead", calc: r => !Number.isFinite(r.vl - r.vc) ? "—" : (r.vl >= r.vc ? "lag" : "lead") },
      { key: "p", label: "P = VI·cosφ", unit: "W", calc: r => r.v * r.i * (r.vr / r.v), dec: 1 },
      { key: "q", label: "Q = VI·sinφ", unit: "VAR", calc: r => { const c = r.vr / r.v; return r.v * r.i * Math.sqrt(Math.max(0, 1 - c * c)); }, dec: 1 },
      { key: "s", label: "S = VI", unit: "VA", calc: r => r.v * r.i, dec: 1 },
    ],
    rows: [
      { v: 230, i: 1.5, vr: 200, vl: 150, vc: 40 },
      { v: 230, i: 1.2, vr: 168, vl: 175, vc: 48 },
      { v: null, i: null, vr: null, vl: null, vc: null },
    ],
    derive(rows) { rlcSeriesPhasor(rows); return []; },
  });

  // ---- RLC parallel ----
  function rlcParPhasor(rows) {
    const r = rows.find(x => [x.ir, x.il, x.ic].every(Number.isFinite));
    const host = $("#phasor-rlcp");
    if (!host) return;
    if (!r) { host.innerHTML = ""; return; }
    LCharts.phasor(host, [
      { x: r.ir, y: 0, color: C1(), label: "I_R = " + f(r.ir, 2) + " A" },
      { x: 0, y: r.ic, color: C2(), label: "I_C" },
      { x: 0, y: -r.il, color: C3(), label: "I_L" },
      { x: r.ir, y: r.ic - r.il, color: css("--ink"), label: "I" },
    ], { caption: (r.il >= r.ic ? "I_L > I_C → lagging p.f." : "I_C > I_L → leading p.f.") + " (first complete row)" });
  }
  makeTable({
    id: "tbl-rlcp",
    cols: [
      { key: "v", label: "V", unit: "V", input: true },
      { key: "i", label: "I", unit: "A", input: true },
      { key: "ir", label: "I_R", unit: "A", input: true },
      { key: "il", label: "I_L", unit: "A", input: true },
      { key: "ic", label: "I_C", unit: "A", input: true },
      { key: "ical", label: "√(I_R²+(I_L−I_C)²)", unit: "A", calc: r => Math.hypot(r.ir, r.il - r.ic), dec: 3 },
      { key: "z", label: "Z = V/I", unit: "Ω", calc: r => r.v / r.i, dec: 1 },
      { key: "y", label: "Y = I/V", unit: "℧", calc: r => r.i / r.v, dec: 4 },
      { key: "pf", label: "cos φ = I_R/I", calc: r => r.ir / r.i, dec: 3 },
      { key: "ll", label: "lag / lead", calc: r => !Number.isFinite(r.il - r.ic) ? "—" : (r.il >= r.ic ? "lag" : "lead") },
      { key: "p", label: "P = VI·cosφ", unit: "W", calc: r => r.v * r.i * (r.ir / r.i), dec: 1 },
      { key: "q", label: "Q = VI·sinφ", unit: "VAR", calc: r => { const c = r.ir / r.i; return r.v * r.i * Math.sqrt(Math.max(0, 1 - c * c)); }, dec: 1 },
      { key: "s", label: "S = VI", unit: "VA", calc: r => r.v * r.i, dec: 1 },
    ],
    rows: [
      { v: 230, i: 2.01, ir: 1.74, il: 1.5, ic: 0.5 },
      { v: 230, i: 1.35, ir: 1.15, il: 0.9, ic: 0.2 },
      { v: null, i: null, ir: null, il: null, ic: null },
    ],
    derive(rows) { rlcParPhasor(rows); return []; },
  });

  // ---- Thermocouple ----
  makeTable({
    id: "tbl-thermo",
    cols: [
      { key: "tr", label: "Thermometer TR", unit: "°C", input: true },
      { key: "ir", label: "Indicated IR", unit: "°C", input: true },
      { key: "er", label: "Error = IR − TR", unit: "°C", calc: r => r.ir - r.tr, dec: 2 },
      { key: "pe", label: "% Error = (IR−TR)/IR ×100", unit: "%", calc: r => 100 * (r.ir - r.tr) / r.ir, dec: 2 },
    ],
    rows: [
      { tr: 30, ir: 31 }, { tr: 40, ir: 41.5 }, { tr: 50, ir: 51 }, { tr: 60, ir: 62 },
      { tr: 70, ir: 71.5 }, { tr: 80, ir: 81 }, { tr: 90, ir: 92 }, { tr: 100, ir: 101 },
    ],
    charts: [
      {
        el: "cht-thermo-cal",
        build: rows => ({
          xLabel: "Thermometer reading TR (°C)", yLabel: "Indicated IR (°C)",
          series: [
            { name: "Calibration curve", color: C1(), pts: rows.filter(r => Number.isFinite(r.tr) && Number.isFinite(r.ir)).map(r => [r.tr, r.ir]) },
            { name: "Ideal (IR = TR)", color: C2(), dashed: true, markers: false, pts: rows.filter(r => Number.isFinite(r.tr)).map(r => [r.tr, r.tr]) },
          ],
        }),
      },
      {
        el: "cht-thermo-err",
        build: rows => ({
          xLabel: "Indicated reading IR (°C)", yLabel: "% Error", zeroY: true,
          series: [{ name: "% error", color: C3(), pts: rows.filter(r => Number.isFinite(r.tr) && Number.isFinite(r.ir)).map(r => [r.ir, 100 * (r.ir - r.tr) / r.ir]) }],
        }),
      },
    ],
  });

  // ---- Wheatstone bridge ----
  CALCS["wheat"] = v => {
    const S = v.s1 * 1000 + v.s2 * 100 + v.s3 * 10 + v.s4 * 1;
    const X = v.pq * S;
    return `S = S₁×1000 + S₂×100 + S₃×10 + S₄×1 = <b>${f(S, 1)} Ω</b>\nX = (P/Q) × S = <b>${f(X, 3)} Ω</b>`;
  };
  makeTable({
    id: "tbl-wheat",
    cols: [
      { key: "nm", label: "Unknown resistor", input: true },
      { key: "pq", label: "P/Q ratio", input: true },
      { key: "s1", label: "S₁ (×1000)", input: true },
      { key: "s2", label: "S₂ (×100)", input: true },
      { key: "s3", label: "S₃ (×10)", input: true },
      { key: "s4", label: "S₄ (×1)", input: true },
      { key: "s", label: "S", unit: "Ω", calc: r => r.s1 * 1000 + r.s2 * 100 + r.s3 * 10 + r.s4, dec: 1 },
      { key: "x", label: "X = (P/Q)·S", unit: "Ω", calc: r => r.pq * (r.s1 * 1000 + r.s2 * 100 + r.s3 * 10 + r.s4), dec: 2 },
    ],
    rows: [
      { nm: 1, pq: 0.1, s1: 6, s2: 5, s3: 0, s4: 0 },
      { nm: 2, pq: 1, s1: 0, s2: 7, s3: 5, s4: 0 },
      { nm: 3, pq: 0.1, s1: 2, s2: 3, s3: 0, s4: 0 },
    ],
  });

  // ---- Wattmeter extension (CT & PT) ----
  makeTable({
    id: "tbl-ctpt",
    cols: [
      { key: "a1", label: "A₁", unit: "A", input: true },
      { key: "v1", label: "V₁", unit: "V", input: true },
      { key: "w1", label: "W₁ (true)", unit: "W", input: true },
      { key: "w2", label: "W₂", unit: "W", input: true },
      { key: "ct", label: "CT ratio", input: true },
      { key: "pt", label: "PT ratio", input: true },
      { key: "irr", label: "Indicated = W₂·CT·PT", unit: "W", calc: r => r.w2 * r.ct * r.pt, dec: 1 },
      { key: "er", label: "% Error = (IR−TR)/IR ×100", unit: "%", calc: r => 100 * (r.w2 * r.ct * r.pt - r.w1) / (r.w2 * r.ct * r.pt), dec: 2 },
    ],
    rows: [
      { a1: 2, v1: 230, w1: 452, w2: 22.4, ct: 10, pt: 2 },
      { a1: 4, v1: 230, w1: 912, w2: 45.9, ct: 10, pt: 2 },
      { a1: 6, v1: 230, w1: 1376, w2: 68.5, ct: 10, pt: 2 },
      { a1: 8, v1: 230, w1: 1830, w2: 91.9, ct: 10, pt: 2 },
    ],
    charts: [
      {
        el: "cht-ctpt-err",
        build: rows => ({
          xLabel: "Load current I (A)", yLabel: "% Error", zeroY: true,
          series: [{ name: "Error curve", color: C3(), pts: rows.filter(r => [r.a1, r.w1, r.w2, r.ct, r.pt].every(Number.isFinite)).map(r => [r.a1, 100 * (r.w2 * r.ct * r.pt - r.w1) / (r.w2 * r.ct * r.pt)]) }],
        }),
      },
      {
        el: "cht-ctpt-ir",
        build: rows => ({
          xLabel: "True reading TR (W)", yLabel: "Indicated reading IR (W)",
          series: [
            { name: "IR vs TR", color: C1(), pts: rows.filter(r => [r.w1, r.w2, r.ct, r.pt].every(Number.isFinite)).map(r => [r.w1, r.w2 * r.ct * r.pt]) },
            { name: "Ideal (IR = TR)", color: C2(), dashed: true, markers: false, pts: rows.filter(r => Number.isFinite(r.w1)).map(r => [r.w1, r.w1]) },
          ],
        }),
      },
    ],
  });

  // ---- Energy meter ----
  function emIR(rows) {
    const k = +($("#em-k") ? $("#em-k").value : 1500) || 1500;
    return 1000 * 3600 / k; // Ws per revolution
  }
  makeTable({
    id: "tbl-em",
    cols: [
      { key: "v", label: "V", unit: "V", input: true },
      { key: "i", label: "I", unit: "A", input: true },
      { key: "w", label: "Wattmeter W", unit: "W", input: true },
      { key: "t5", label: "t for 5 rev", unit: "s", input: true },
      { key: "t1", label: "t for 1 rev", unit: "s", calc: r => r.t5 / 5, dec: 2 },
      { key: "tr", label: "TR = W·t₁", unit: "Ws", calc: r => r.w * r.t5 / 5, dec: 1 },
      { key: "irc", label: "IR = 3.6×10⁶/k", unit: "Ws", calc: () => emIR(), dec: 1 },
      { key: "er", label: "Error = IR − TR", unit: "Ws", calc: r => emIR() - r.w * r.t5 / 5, dec: 1 },
      { key: "pe", label: "% Error", unit: "%", calc: r => 100 * (emIR() - r.w * r.t5 / 5) / emIR(), dec: 2 },
    ],
    rows: [
      { v: 230, i: 1, w: 230, t5: 51.5 },
      { v: 230, i: 2, w: 460, t5: 26.2 },
      { v: 230, i: 3, w: 690, t5: 17.6 },
      { v: 230, i: 4, w: 920, t5: 13.2 },
      { v: 230, i: 5, w: 1150, t5: 10.4 },
    ],
    derive() {
      return [{ k: "Indicated energy / rev = (1000×3600)/k", v: f(emIR(), 1), u: "watt-seconds" }];
    },
    charts: [{
      el: "cht-em-err",
      build: rows => ({
        xLabel: "Load current I (A)", yLabel: "% Error", zeroY: true,
        series: [{ name: "Error curve", color: C3(), pts: rows.filter(r => [r.i, r.w, r.t5].every(Number.isFinite)).map(r => [r.i, 100 * (emIR() - r.w * r.t5 / 5) / emIR()]) }],
      }),
    }],
  });
  if ($("#em-k")) $("#em-k").addEventListener("input", () => TABLES["tbl-em"]._render());

  // ---- Strain gauge ----
  function strainActual(pGrams) {
    const B = +$("#sg-b").value, L = +$("#sg-l").value, T = +$("#sg-t").value, E = +$("#sg-e").value;
    const P = pGrams / 1000; // kg
    return 6 * P * L / (B * T * T * E) * 1e6; // microstrain
  }
  makeTable({
    id: "tbl-strain",
    cols: [
      { key: "wt", label: "Weight", unit: "g", input: true },
      { key: "ar", label: "Actual S = 6PL/(BT²E)", unit: "µstrain", calc: r => strainActual(r.wt), dec: 1 },
      { key: "ir", label: "Indicated", unit: "µstrain", input: true },
      { key: "er", label: "Error = IR − AR", unit: "µstrain", calc: r => r.ir - strainActual(r.wt), dec: 1 },
      { key: "pe", label: "% Error (of full scale)", unit: "%", calc: r => 100 * (r.ir - strainActual(r.wt)) / strainActual(1000), dec: 2 },
    ],
    rows: [
      { wt: 100, ir: 38 }, { wt: 200, ir: 76 }, { wt: 300, ir: 114 }, { wt: 400, ir: 152 },
      { wt: 500, ir: 190 }, { wt: 600, ir: 227 }, { wt: 700, ir: 265 }, { wt: 800, ir: 303 },
      { wt: 900, ir: 341 }, { wt: 1000, ir: 379 },
    ],
    charts: [{
      el: "cht-strain",
      build: rows => ({
        xLabel: "Load (g)", yLabel: "Strain (µstrain)",
        series: [
          { name: "Indicated", color: C1(), pts: rows.filter(r => Number.isFinite(r.wt) && Number.isFinite(r.ir)).map(r => [r.wt, r.ir]) },
          { name: "Actual (theory)", color: C2(), dashed: true, pts: rows.filter(r => Number.isFinite(r.wt)).map(r => [r.wt, strainActual(r.wt)]) },
        ],
      }),
    }, {
      el: "cht-strain-cal",
      build: rows => ({
        xLabel: "Actual reading (µstrain)", yLabel: "Indicated reading (µstrain)",
        series: [
          { name: "Calibration", color: C1(), pts: rows.filter(r => Number.isFinite(r.wt) && Number.isFinite(r.ir)).map(r => [strainActual(r.wt), r.ir]) },
          { name: "Ideal (IR = AR)", color: C2(), dashed: true, markers: false, pts: rows.filter(r => Number.isFinite(r.wt)).map(r => [strainActual(r.wt), strainActual(r.wt)]) },
        ],
      }),
    }, {
      el: "cht-strain-err",
      build: rows => ({
        xLabel: "Indicated reading (µstrain)", yLabel: "% Error (of full scale)", zeroY: true,
        series: [{
          name: "% error", color: C3(),
          pts: rows.filter(r => Number.isFinite(r.wt) && Number.isFinite(r.ir)).map(r => [r.ir, 100 * (r.ir - strainActual(r.wt)) / strainActual(1000)]),
        }],
      }),
    }],
  });
  ["sg-b", "sg-l", "sg-t", "sg-e"].forEach(id => { const e = $("#" + id); if (e) e.addEventListener("input", () => TABLES["tbl-strain"]._render()); });

  // ---- LVDT ----
  makeTable({
    id: "tbl-lvdt",
    cols: [
      { key: "ar", label: "Micrometer (actual)", unit: "mm", input: true },
      { key: "ir", label: "LVDT display (indicated)", unit: "mm", input: true },
      { key: "vo", label: "Output voltage", unit: "V", input: true },
      { key: "er", label: "Error = IR − AR", unit: "mm", calc: r => r.ir - r.ar, dec: 3 },
      { key: "pe", label: "% Error = Error/IR ×100", unit: "%", calc: r => 100 * (r.ir - r.ar) / r.ir, dec: 2 },
    ],
    rows: [
      { ar: -10, ir: -9.9, vo: 0.50 }, { ar: -8, ir: -7.95, vo: 0.40 }, { ar: -6, ir: -6.0, vo: 0.30 },
      { ar: -4, ir: -4.02, vo: 0.20 }, { ar: -2, ir: -2.0, vo: 0.10 }, { ar: 0, ir: 0.0, vo: 0.00 },
      { ar: 2, ir: 2.02, vo: 0.10 }, { ar: 4, ir: 4.0, vo: 0.20 }, { ar: 6, ir: 6.05, vo: 0.30 },
      { ar: 8, ir: 8.0, vo: 0.40 }, { ar: 10, ir: 10.05, vo: 0.51 },
    ],
    charts: [
      {
        el: "cht-lvdt-cal",
        build: rows => ({
          xLabel: "Actual displacement (mm)", yLabel: "Indicated (mm)", zeroY: false,
          series: [
            { name: "LVDT reading", color: C1(), pts: rows.filter(r => Number.isFinite(r.ar) && Number.isFinite(r.ir)).map(r => [r.ar, r.ir]) },
            { name: "Ideal", color: C2(), dashed: true, markers: false, pts: rows.filter(r => Number.isFinite(r.ar)).map(r => [r.ar, r.ar]) },
          ],
        }),
      },
      {
        el: "cht-lvdt-v",
        build: rows => ({
          xLabel: "Core position (mm from null)", yLabel: "Output voltage (V)",
          series: [{ name: "|V_out|", color: C3(), pts: rows.filter(r => Number.isFinite(r.ar) && Number.isFinite(r.vo)).map(r => [r.ar, Math.abs(r.vo)]) }],
        }),
      },
      {
        el: "cht-lvdt-err",
        build: rows => ({
          xLabel: "Indicated measurement (mm)", yLabel: "% Error", zeroY: true,
          series: [{
            name: "% error", color: C3(),
            pts: rows.filter(r => Number.isFinite(r.ar) && Number.isFinite(r.ir) && r.ir !== 0).map(r => [r.ir, 100 * (r.ir - r.ar) / r.ir]),
          }],
        }),
      },
    ],
  });

  /* ================= boot ================= */
  Schematics.render(document);
  bindCalcs();
  Object.values(SIMS).forEach(fn => { try { fn(); } catch (_) { } });
  applyTheme(localStorage.getItem("layrd-theme") || "");
  // deep-link support: layrdedu.github.io/#cm-lvdt, #cn-m2, #anx-cheat etc.
  const hash = location.hash.slice(1);
  const target = hash && document.getElementById(hash) && labOf(hash) ? hash : null;
  if (target) {
    showLab(labOf(target));
    showExp(labOf(target), target);
  } else {
    const saved = localStorage.getItem("layrd-lab");
    showLab(labs.includes(saved) ? saved : "ae");
  }
  window.addEventListener("hashchange", () => {
    const h = location.hash.slice(1);
    if (h && document.getElementById(h) && labOf(h)) { showLab(labOf(h)); showExp(labOf(h), h); }
  });
  // responsive charts: redraw at the new width when the viewport changes (rotation, resize)
  let rsz;
  window.addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(() => { try { redrawAll(); } catch (_) { } }, 200); });
})();
