/* LayrdEDU — minimal SVG line/scatter chart with crosshair tooltip.
   Palette: validated reference palette (see styles.css custom properties). */
(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function niceTicks(min, max, n) {
    if (!isFinite(min) || !isFinite(max)) return [0, 1];
    if (min === max) { min -= 1; max += 1; }
    const span = max - min;
    const step0 = Math.pow(10, Math.floor(Math.log10(span / n)));
    let step = step0;
    for (const m of [1, 2, 2.5, 5, 10]) {
      if (span / (step0 * m) <= n) { step = step0 * m; break; }
    }
    const ticks = [];
    const start = Math.ceil(min / step) * step;
    for (let v = start; v <= max + step * 1e-9; v += step) ticks.push(+v.toPrecision(12));
    return ticks;
  }

  function fmtNum(v) {
    if (v === null || v === undefined || !isFinite(v)) return "—";
    const a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toPrecision(3).replace(/\.?0+$/, "") + "M";
    if (a >= 1e4) return (v / 1e3).toPrecision(3).replace(/\.?0+$/, "") + "k";
    if (a >= 100) return v.toFixed(1).replace(/\.0$/, "");
    if (a >= 1) return +v.toFixed(2) + "";
    if (a === 0) return "0";
    return +v.toPrecision(3) + "";
  }

  /**
   * lineChart(container, cfg)
   * cfg = { series:[{name,color,pts:[[x,y],...],dashed,markers}],
   *         xLabel, yLabel, height, xFmt, yFmt, refY: [{y,label}], connect(default true) }
   */
  function lineChart(container, cfg) {
    container.classList.add("chart-box");
    container.innerHTML = "";
    // draw at the container's real width so axis text stays legible on phones
    const cw = container.clientWidth || (container.parentElement && container.parentElement.clientWidth) || 0;
    const W = cw > 40 ? Math.max(300, Math.min(760, cw)) : 720;
    const small = W < 480;
    const H = cfg.height ? (small ? Math.round(cfg.height * 0.85) : cfg.height) : (small ? 260 : 340);
    const P = { l: small ? 46 : 58, r: small ? 12 : 18, t: 14, b: small ? 40 : 46 };

    const series = (cfg.series || []).map(s => {
      const pts = (s.pts || []).filter(p => isFinite(p[0]) && isFinite(p[1]));
      // parametric curves (e.g. Lissajous) must keep point order — pass sort:false
      return { ...s, pts: s.sort === false ? pts : pts.sort((a, b) => a[0] - b[0]) };
    }).filter(s => s.pts.length);

    // legend (only when ≥ 2 named series; unnamed series belong to a named family)
    const named = series.filter(s => s.name);
    if (named.length >= 2) {
      const lg = document.createElement("div");
      lg.className = "legend";
      named.forEach(s => {
        const it = document.createElement("span");
        it.innerHTML = `<span class="sw" style="background:${s.color}"></span>${s.name}`;
        lg.appendChild(it);
      });
      container.appendChild(lg);
    }

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.yLabel + " vs " + cfg.xLabel });
    container.appendChild(svg);

    const tip = document.createElement("div");
    tip.className = "chart-tip";
    container.appendChild(tip);

    if (!series.length) {
      const t = el("text", { x: W / 2, y: H / 2, "text-anchor": "middle", fill: "var(--muted)", "font-size": 13 });
      t.textContent = "Enter readings in the table to plot the graph";
      svg.appendChild(t);
      return;
    }

    let xs = [], ys = [];
    series.forEach(s => s.pts.forEach(p => { xs.push(p[0]); ys.push(p[1]); }));
    (cfg.refY || []).forEach(r => ys.push(r.y));
    let xmin = Math.min(...xs), xmax = Math.max(...xs);
    let ymin = Math.min(...ys), ymax = Math.max(...ys);
    if (cfg.zeroY !== false) { ymin = Math.min(ymin, 0); }
    const ypad = (ymax - ymin || 1) * 0.08;
    ymax += ypad; if (ymin !== 0) ymin -= ypad;
    if (xmin === xmax) { xmin -= 1; xmax += 1; }

    const X = v => P.l + (v - xmin) / (xmax - xmin) * (W - P.l - P.r);
    const Y = v => H - P.b - (v - ymin) / (ymax - ymin) * (H - P.t - P.b);

    // grid + ticks (fewer x ticks on narrow screens)
    const xt = niceTicks(xmin, xmax, small ? 4 : 7), yt = niceTicks(ymin, ymax, small ? 5 : 6);

    // scale annotation (as written on the manual's graph sheets): 1 division = one grid step
    const unitOf = lbl => { const m = /\(([^)]*)\)/.exec(lbl || ""); return m ? m[1] : (lbl || ""); };
    if (xt.length > 1 && yt.length > 1) {
      const note = document.createElement("div");
      note.className = "scale-note";
      note.innerHTML = `<b>Scale</b> — x-axis: 1 div = ${fmtNum(xt[1] - xt[0])} ${unitOf(cfg.xLabel)} · y-axis: 1 div = ${fmtNum(yt[1] - yt[0])} ${unitOf(cfg.yLabel)}`;
      container.insertBefore(note, svg);
    }
    yt.forEach(v => {
      svg.appendChild(el("line", { x1: P.l, x2: W - P.r, y1: Y(v), y2: Y(v), stroke: "var(--grid)", "stroke-width": 1 }));
      const t = el("text", { x: P.l - 8, y: Y(v) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--muted)", style: "font-variant-numeric:tabular-nums" });
      t.textContent = (cfg.yFmt || fmtNum)(v);
      svg.appendChild(t);
    });
    xt.forEach(v => {
      const t = el("text", { x: X(v), y: H - P.b + 18, "text-anchor": "middle", "font-size": 11, fill: "var(--muted)", style: "font-variant-numeric:tabular-nums" });
      t.textContent = (cfg.xFmt || fmtNum)(v);
      svg.appendChild(t);
    });
    // axes
    svg.appendChild(el("line", { x1: P.l, x2: W - P.r, y1: Y(Math.max(ymin, 0)), y2: Y(Math.max(ymin, 0)), stroke: "var(--axis)", "stroke-width": 1.4 }));
    svg.appendChild(el("line", { x1: P.l, x2: P.l, y1: P.t, y2: H - P.b, stroke: "var(--axis)", "stroke-width": 1.4 }));
    // axis labels
    const xl = el("text", { x: (P.l + W - P.r) / 2, y: H - 8, "text-anchor": "middle", "font-size": 12, fill: "var(--ink-2)", "font-weight": 600 });
    xl.textContent = cfg.xLabel; svg.appendChild(xl);
    const yl = el("text", { x: 14, y: (P.t + H - P.b) / 2, "text-anchor": "middle", "font-size": 12, fill: "var(--ink-2)", "font-weight": 600, transform: `rotate(-90 14 ${(P.t + H - P.b) / 2})` });
    yl.textContent = cfg.yLabel; svg.appendChild(yl);

    // reference lines (e.g., −3 dB)
    (cfg.refY || []).forEach(r => {
      svg.appendChild(el("line", { x1: P.l, x2: W - P.r, y1: Y(r.y), y2: Y(r.y), stroke: "var(--series-3)", "stroke-width": 1.6, "stroke-dasharray": "6 5" }));
      const t = el("text", { x: W - P.r - 4, y: Y(r.y) - 6, "text-anchor": "end", "font-size": 11, fill: "var(--series-3)", "font-weight": 600 });
      t.textContent = r.label; svg.appendChild(t);
    });

    // series paths + markers
    series.forEach(s => {
      if (s.connect !== false && s.pts.length > 1) {
        const d = s.pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1)).join(" ");
        svg.appendChild(el("path", { d, fill: "none", stroke: s.color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": s.dashed ? "6 5" : "none" }));
      }
      if (s.markers !== false) {
        s.pts.forEach(p => {
          svg.appendChild(el("circle", { cx: X(p[0]), cy: Y(p[1]), r: 3.6, fill: s.color, stroke: "var(--surface)", "stroke-width": 2 }));
        });
      }
    });

    // hover crosshair + tooltip
    const cross = el("line", { y1: P.t, y2: H - P.b, stroke: "var(--muted)", "stroke-width": 1, "stroke-dasharray": "3 3", opacity: 0 });
    svg.appendChild(cross);
    const hoverDots = series.map(s => {
      const c = el("circle", { r: 5.5, fill: s.color, stroke: "var(--surface)", "stroke-width": 2, opacity: 0 });
      svg.appendChild(c); return c;
    });

    svg.addEventListener("pointermove", ev => {
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      const m = pt.matrixTransform(svg.getScreenCTM().inverse());
      if (m.x < P.l || m.x > W - P.r) { hide(); return; }
      const xv = xmin + (m.x - P.l) / (W - P.l - P.r) * (xmax - xmin);
      let lines = [], anyX = null;
      series.forEach((s, i) => {
        if (!s.name) return; // family curves (unnamed) stay out of the tooltip
        let best = null, bd = Infinity;
        s.pts.forEach(p => { const d = Math.abs(p[0] - xv); if (d < bd) { bd = d; best = p; } });
        if (best) {
          hoverDots[i].setAttribute("cx", X(best[0]));
          hoverDots[i].setAttribute("cy", Y(best[1]));
          hoverDots[i].setAttribute("opacity", 1);
          anyX = best[0];
          lines.push(`<span style="color:${s.color}">●</span> ${series.length > 1 ? s.name + ": " : ""}<b>${(cfg.yFmt || fmtNum)(best[1])}</b>`);
        }
      });
      if (anyX === null) { hide(); return; }
      cross.setAttribute("x1", X(anyX)); cross.setAttribute("x2", X(anyX));
      cross.setAttribute("opacity", 0.7);
      tip.innerHTML = `${cfg.xLabel}: <b>${(cfg.xFmt || fmtNum)(anyX)}</b><br>` + lines.join("<br>");
      const rect = container.getBoundingClientRect(), srect = svg.getBoundingClientRect();
      let px = srect.left - rect.left + (X(anyX) / W) * srect.width;
      const py = srect.top - rect.top + (P.t / H) * srect.height + 30;
      tip.style.top = py + "px"; tip.style.display = "block";
      // keep the (translate(-50%)-centred) tooltip inside the container on narrow screens
      const half = tip.offsetWidth / 2;
      px = Math.max(half + 2, Math.min(rect.width - half - 2, px));
      tip.style.left = px + "px";
    });
    function hide() { tip.style.display = "none"; cross.setAttribute("opacity", 0); hoverDots.forEach(d => d.setAttribute("opacity", 0)); }
    svg.addEventListener("mouseleave", hide);
    svg.addEventListener("pointerleave", hide);
    svg.addEventListener("pointercancel", hide);
  }

  /** phasor(container, vectors=[{x,y,color,label}], title) — draws vectors from origin */
  function phasor(container, vectors, opts) {
    container.classList.add("chart-box");
    container.innerHTML = "";
    const W = 420, H = 320;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}` });
    container.appendChild(svg);
    const vs = vectors.filter(v => isFinite(v.x) && isFinite(v.y) && (v.x || v.y));
    const maxMag = Math.max(1e-9, ...vs.map(v => Math.hypot(v.x, v.y)));
    const cx = 120, cy = H / 2, scale = 150 / maxMag;
    // axes
    svg.appendChild(el("line", { x1: 20, x2: W - 20, y1: cy, y2: cy, stroke: "var(--grid)", "stroke-width": 1.2 }));
    svg.appendChild(el("line", { x1: cx, x2: cx, y1: 16, y2: H - 16, stroke: "var(--grid)", "stroke-width": 1.2 }));
    vs.forEach(v => {
      const x2 = cx + v.x * scale, y2 = cy - v.y * scale;
      const ang = Math.atan2(-(y2 - cy), x2 - cx);
      svg.appendChild(el("line", { x1: cx, y1: cy, x2, y2, stroke: v.color, "stroke-width": v.thin ? 1.6 : 2.6, "stroke-dasharray": v.dashed ? "5 4" : "none" }));
      // arrowhead
      const a1 = ang + Math.PI * 0.86, a2 = ang - Math.PI * 0.86, r = 9;
      svg.appendChild(el("path", {
        d: `M${x2} ${y2} L${x2 + r * Math.cos(a1)} ${y2 - r * Math.sin(a1)} L${x2 + r * Math.cos(a2)} ${y2 - r * Math.sin(a2)} Z`,
        fill: v.color,
      }));
      const t = el("text", { x: x2 + 10 * Math.cos(ang), y: y2 - 10 * Math.sin(ang) + 4, "font-size": 12.5, "font-weight": 600, fill: v.color, "text-anchor": Math.cos(ang) < -0.3 ? "end" : "start" });
      t.textContent = v.label; svg.appendChild(t);
    });
    if (opts && opts.caption) {
      const t = el("text", { x: W / 2, y: H - 4, "text-anchor": "middle", "font-size": 12, fill: "var(--muted)" });
      t.textContent = opts.caption; svg.appendChild(t);
    }
  }

  window.LCharts = { lineChart, phasor, fmtNum };
})();
