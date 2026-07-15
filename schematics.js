/* LayrdEDU — SVG schematic library.
   Small primitive set + one function per circuit diagram.
   All primitives return SVG markup strings; diagrams return a full <svg>. */
(function () {
  "use strict";

  // ---------- primitives ----------
  const txt = (x, y, s, cls = "lbl", anchor = "middle") =>
    `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
  const w = (...pts) => `<polyline class="w" points="${pts.join(" ")}"/>`;
  const dot = (x, y) => `<circle class="node" cx="${x}" cy="${y}" r="3"/>`;
  const term = (x, y) => `<circle class="comp" cx="${x}" cy="${y}" r="3.5" fill="var(--surface)"/>`;

  // horizontal resistor, 60 long, centred label above
  function rH(x, y, name, val) {
    const z = `M${x} ${y} l8 0 l4 -8 l8 16 l8 -16 l8 16 l8 -16 l8 16 l4 -8 l4 0`;
    return `<path class="comp" d="${z}"/>` + (name ? txt(x + 30, y - 14, name, "lbl b") : "") + (val ? txt(x + 30, y + 22, val, "lbl m") : "");
  }
  // vertical resistor, 60 tall
  function rV(x, y, name, val) {
    const z = `M${x} ${y} l0 8 l-8 4 l16 8 l-16 8 l16 8 l-16 8 l16 8 l-8 4 l0 4`;
    return `<path class="comp" d="${z}"/>` + (name ? txt(x + 14, y + 26, name, "lbl b", "start") : "") + (val ? txt(x + 14, y + 40, val, "lbl m", "start") : "");
  }
  function capH(x, y, name, val) { // 24 long
    return `<path class="comp" d="M${x} ${y} l8 0 M${x + 8} ${y - 11} l0 22 M${x + 16} ${y - 11} l0 22 M${x + 16} ${y} l8 0"/>` +
      (name ? txt(x + 12, y - 17, name, "lbl b") : "") + (val ? txt(x + 12, y + 26, val, "lbl m") : "");
  }
  function capV(x, y, name, val) {
    return `<path class="comp" d="M${x} ${y} l0 8 M${x - 11} ${y + 8} l22 0 M${x - 11} ${y + 16} l22 0 M${x} ${y + 16} l0 8"/>` +
      (name ? txt(x + 15, y + 10, name, "lbl b", "start") : "") + (val ? txt(x + 15, y + 23, val, "lbl m", "start") : "");
  }
  function indV(x, y, name, val) { // vertical inductor 60 tall
    let d = `M${x} ${y}`;
    for (let i = 0; i < 4; i++) d += ` a8 8 0 0 1 0 15`;
    return `<path class="comp" d="${d}"/>` + (name ? txt(x + 13, y + 30, name, "lbl b", "start") : "") + (val ? txt(x + 13, y + 44, val, "lbl m", "start") : "");
  }
  function gnd(x, y) {
    return `<path class="comp" d="M${x} ${y} l0 8 M${x - 12} ${y + 8} l24 0 M${x - 8} ${y + 13} l16 0 M${x - 4} ${y + 18} l8 0"/>`;
  }
  function srcAC(x, y, name, val) { // circle r=16 centred (x,y)
    return `<circle class="comp" cx="${x}" cy="${y}" r="16"/>` +
      `<path class="comp" d="M${x - 9} ${y} q4.5 -9 9 0 q4.5 9 9 0"/>` +
      (name ? txt(x - 22, y - 2, name, "lbl b", "end") : "") + (val ? txt(x - 22, y + 12, val, "lbl m", "end") : "");
  }
  function srcDC(x, y, name, val) { // battery vertical centred (x,y)
    return `<path class="comp" d="M${x} ${y - 14} l0 6 M${x - 13} ${y - 8} l26 0 M${x - 6} ${y - 1} l12 0 M${x - 13} ${y + 6} l26 0 M${x - 6} ${y + 13} l12 0 M${x} ${y + 13} l0 6"/>` +
      txt(x - 18, y - 4, "+", "lbl b", "end") +
      (name ? txt(x - 22, y + 2, name, "lbl b", "end") : "") + (val ? txt(x - 22, y + 16, val, "lbl m", "end") : "");
  }
  function meter(x, y, letter, val) { // circle meter centred
    return `<circle class="comp" cx="${x}" cy="${y}" r="14"/>` + txt(x, y + 4.5, letter, "lbl b") +
      (val ? txt(x, y - 20, val, "lbl m") : "");
  }
  // diode pointing down at (x, y..y+22)
  function diodeV(x, y, name, zenerTag) {
    let s = `<path class="fill" d="M${x - 9} ${y} L${x + 9} ${y} L${x} ${y + 16} Z"/><path class="comp" d="M${x} ${y - 6} l0 6 M${x - 9} ${y + 16} l18 0 M${x} ${y + 16} l0 6"/>`;
    if (zenerTag) s += `<path class="comp" d="M${x - 9} ${y + 16} l-5 5 M${x + 9} ${y + 16} l5 -5"/>`;
    if (name) s += txt(x + 15, y + 12, name, "lbl b", "start");
    return s;
  }
  function diodeH(x, y, name) { // pointing right, occupies 22
    let s = `<path class="fill" d="M${x} ${y - 9} L${x} ${y + 9} L${x + 16} ${y} Z"/><path class="comp" d="M${x - 6} ${y} l6 0 M${x + 16} ${y - 9} l0 18 M${x + 16} ${y} l6 0"/>`;
    if (name) s += txt(x + 8, y - 15, name, "lbl b");
    return s;
  }
  // NPN transistor, base at left (x,y)
  function npn(x, y, name) {
    const bx = x + 16;
    return `<circle class="comp" cx="${bx + 8}" cy="${y}" r="22"/>` +
      `<path class="comp" d="M${x} ${y} l16 0 M${bx} ${y - 14} l0 28"/>` +
      `<path class="comp" d="M${bx} ${y - 7} l16 -11 l0 -12"/>` + // collector
      `<path class="comp" d="M${bx} ${y + 7} l16 11 l0 12"/>` +   // emitter
      `<path class="fill" d="M${bx + 9} ${y + 11} l8 6 l-9 3 Z"/>` + // arrow
      (name ? txt(bx + 34, y + 4, name, "lbl b", "start") : "");
  }
  // N-JFET, gate at left (x,y)
  function jfet(x, y, name) {
    const bx = x + 18;
    return `<circle class="comp" cx="${bx + 9}" cy="${y}" r="22"/>` +
      `<path class="comp" d="M${x} ${y} l18 0 M${bx} ${y - 14} l0 28"/>` +
      `<path class="fill" d="M${bx + 2} ${y} l-9 -5 l0 10 Z"/>` +
      `<path class="comp" d="M${bx} ${y - 10} l17 0 l0 -14 M${bx} ${y + 10} l17 0 l0 14"/>` +
      (name ? txt(bx + 34, y + 4, name, "lbl b", "start") : "") +
      txt(bx + 21, y - 15, "D", "lbl m", "start") + txt(bx + 21, y + 21, "S", "lbl m", "start");
  }
  // op-amp triangle: (x,y) = tip of − input; outputs at right
  function opamp(x, y, name) {
    // triangle from (x, y-28) to (x, y+28) to (x+72, y)  — inputs at y-14 (−) and y+14 (+)
    return `<path class="comp" d="M${x} ${y - 30} L${x} ${y + 30} L${x + 72} ${y} Z"/>` +
      txt(x + 10, y - 9, "−", "lbl b", "start") + txt(x + 10, y + 19, "+", "lbl b", "start") +
      (name ? txt(x + 26, y + 5, name, "lbl m", "start") : "");
  }
  function icbox(x, y, wd, ht, name) {
    return `<rect class="comp" x="${x}" y="${y}" width="${wd}" height="${ht}" rx="4"/>` +
      txt(x + wd / 2, y + ht / 2 + 6, name, "lbl b");
  }
  const arrow = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), r = 8;
    return `<line class="w" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` +
      `<path class="fill" d="M${x2} ${y2} L${x2 - r * Math.cos(a - 0.4)} ${y2 - r * Math.sin(a - 0.4)} L${x2 - r * Math.cos(a + 0.4)} ${y2 - r * Math.sin(a + 0.4)} Z"/>`;
  };
  const svg = (vw, vh, inner) => `<svg viewBox="0 0 ${vw} ${vh}" width="${vw}">${inner}</svg>`;

  // ---------- diagrams ----------
  const D = {};

  // CRO block diagram
  D["cro-block"] = () => {
    let s = "";
    s += icbox(30, 60, 110, 44, "Y-amplifier");
    s += icbox(30, 150, 110, 44, "Trigger");
    s += icbox(190, 150, 110, 44, "Time base");
    s += icbox(360, 40, 150, 170, "");
    s += txt(435, 30, "CRT", "lbl b");
    s += `<path class="comp" d="M370 60 L470 60 L500 95 L500 155 L470 190 L370 190 Z" opacity="0.35"/>`;
    s += txt(485, 128, "screen", "lbl m", "middle");
    s += arrow(140, 82, 360, 82); s += txt(250, 74, "to Y-plates", "lbl m");
    s += arrow(85, 104, 85, 150);
    s += arrow(140, 172, 190, 172);
    s += arrow(300, 172, 380, 172); s += txt(340, 164, "to X-plates", "lbl m");
    s += w(0, 82, 30, 82); s += term(0, 82); s += txt(6, 70, "signal in", "lbl m", "start");
    return svg(540, 230, s);
  };

  // RC coupled CE amplifier (Fig 4.1)
  D["rc-amp"] = () => {
    let s = "";
    const railY = 40, gndY = 260;
    s += w(120, railY, 470, railY); s += txt(295, 30, "V_CC = +12 V", "lbl b");
    // R1 and Rc from rail
    s += w(160, railY, 160, 70) + rV(160, 70, "R1", "47 kΩ") + w(160, 130, 160, 160) + dot(160, 160);
    s += w(300, railY, 300, 62) + rV(300, 62, "Rc", "2.2 kΩ") + w(300, 122, 300, 138) + dot(300, 138);
    // input source + Cc1
    s += srcAC(50, 160, "Vin", "100 mV, sine") + w(50, 144, 50, 120, 80, 120) + capH(80, 120, "Cc1", "15 µF") + w(104, 120, 128, 120, 128, 160);
    s += w(50, 176, 50, gndY);
    s += w(128, 160, 160, 160) + w(160, 160, 232, 160); // base node line
    // transistor: base at (232,160)
    s += npn(232, 160, "BC107");
    s += w(264, 137, 264, 138, 300, 138); // collector up to Rc node... adjust: collector at (264, y-30)=... approximate
    // emitter chain
    s += w(264, 183, 264, 200) + dot(264, 200);
    s += w(264, 200, 264, 206) + rV(264, 206, "R6", "680 Ω") + w(264, 266, 264, gndY);
    s += w(264, 200, 340, 200) + capV(340, 200, "CE", "22 µF") + w(340, 224, 340, gndY);
    // R2
    s += w(160, 160, 160, 170) + rV(160, 170, "R2", "10 kΩ") + w(160, 230, 160, gndY);
    // Cc2 out + RL
    s += w(300, 138, 300, 100, 356, 100) + capH(356, 100, "Cc2", "10 µF") + w(380, 100, 430, 100) + dot(430, 100);
    s += w(430, 100, 430, 110) + rV(430, 110, "RL", "820 Ω") + w(430, 170, 430, gndY);
    s += w(430, 100, 480, 100) + term(480, 100) + txt(494, 104, "Vo", "lbl b", "start");
    // ground rail
    s += w(40, gndY, 480, gndY) + gnd(260, gndY);
    return svg(540, 300, s);
  };

  // FET common-source amplifier (Fig 5.1)
  D["fet-amp"] = () => {
    let s = "";
    const railY = 40, gndY = 250;
    s += w(150, railY, 440, railY) + txt(295, 30, "V_DD = +12 V", "lbl b");
    s += w(280, railY, 280, 58) + rV(280, 58, "RD", "2.7 kΩ") + w(280, 118, 280, 132) + dot(280, 132);
    // input
    s += srcAC(48, 160, "Vin", "100 mV") + w(48, 144, 48, 118, 76, 118) + capH(76, 118, "Cc1", "0.022 µF") + w(100, 118, 126, 118, 126, 160) + dot(126, 160);
    s += w(48, 176, 48, gndY);
    s += w(126, 160, 126, 168) + rV(126, 168, "Rg", "1 MΩ") + w(126, 228, 126, gndY);
    s += w(126, 160, 212, 160);
    s += jfet(212, 160, "BFW10");
    s += w(247, 136, 247, 132, 280, 132); // drain
    s += w(247, 184, 247, 196) + dot(247, 196);
    s += w(247, 196, 247, 200) + rV(247, 200, "Rs", "1 kΩ") + w(247, 260, 247, gndY);
    s += w(247, 196, 330, 196) + capV(330, 196, "Cs", "15 µF") + w(330, 220, 330, gndY);
    s += w(280, 132, 280, 96, 338, 96) + capH(338, 96, "Cc2", "0.022 µF") + w(362, 96, 408, 96) + dot(408, 96);
    s += w(408, 96, 408, 106) + rV(408, 106, "RL", "4.7 kΩ") + w(408, 166, 408, gndY);
    s += w(408, 96, 458, 96) + term(458, 96) + txt(472, 100, "Vo", "lbl b", "start");
    s += w(40, gndY, 460, gndY) + gnd(240, gndY);
    return svg(540, 292, s);
  };

  // Shunt clipper with bias
  D["clipper"] = () => {
    let s = "";
    s += srcAC(52, 130, "Vin", "20 Vpp") + w(52, 114, 52, 80, 90, 80) + rH(90, 80, "R", "3.3 kΩ") + w(150, 80, 240, 80) + dot(240, 80);
    s += w(240, 80, 240, 96) + diodeV(240, 96, "1N4001") + w(240, 134, 240, 152);
    s += srcDC(240, 168, "V", "bias (0 / ±3 V)") + w(240, 187, 240, 210);
    s += w(52, 146, 52, 210) + w(52, 210, 360, 210) + gnd(200, 210);
    s += w(240, 80, 360, 80) + term(360, 80) + txt(374, 84, "Vo", "lbl b", "start");
    s += w(360, 210, 360, 214); s += term(360, 210);
    return svg(430, 250, s);
  };

  // Clamper
  D["clamper"] = () => {
    let s = "";
    s += srcAC(52, 130, "Vin", "20 Vpp") + w(52, 114, 52, 80, 96, 80) + capH(96, 80, "C", "1 µF") + w(120, 80, 240, 80) + dot(240, 80);
    s += w(240, 80, 240, 96) + diodeV(240, 96, "1N4001") + w(240, 134, 240, 152);
    s += srcDC(240, 168, "V", "bias (0 / ±3 V)") + w(240, 187, 240, 210);
    s += w(52, 146, 52, 210) + w(52, 210, 360, 210) + gnd(200, 210);
    s += w(240, 80, 360, 80) + term(360, 80) + txt(374, 84, "Vo", "lbl b", "start");
    s += term(360, 210);
    return svg(430, 250, s);
  };

  // Zener shunt regulator
  D["zener-reg"] = () => {
    let s = "";
    s += srcDC(60, 140, "Vin", "0–30 V") + w(60, 126, 60, 70, 110, 70) + rH(110, 70, "Rs", "1 kΩ") + w(170, 70, 230, 70) + dot(230, 70);
    s += w(230, 70, 260, 70) + meter(274, 70, "mA", "0–100 mA") + w(288, 70, 330, 70) + dot(330, 70);
    s += w(230, 70, 230, 96) + diodeV(230, 96, "SZ 5.6", true) + w(230, 134, 230, 210);
    s += w(330, 70, 330, 84) + meter(330, 98, "V", "0–15 V") + w(330, 112, 330, 210);
    s += w(330, 70, 420, 70) + w(420, 70, 420, 84) + rV(420, 84, "RL", "1.2 kΩ (rheo.)") + w(420, 144, 420, 210);
    s += w(60, 154, 60, 210) + w(60, 210, 420, 210) + gnd(240, 210);
    return svg(500, 252, s);
  };

  // Zener + emitter follower
  D["zener-ef"] = () => {
    let s = "";
    s += srcDC(60, 150, "Vin", "0–30 V") + w(60, 136, 60, 60, 470, 60);
    s += w(150, 60, 150, 76) + rV(150, 76, "RB", "330 Ω, 0.5 W") + w(150, 136, 150, 170) + dot(150, 170);
    // transistor base at 150,170? base left — put npn with base at (150,170) requires wire from left; flip: base at x=150
    s += npn(150, 170, "2N3055");
    s += w(182, 147, 182, 60); // collector to rail
    s += w(150, 170, 150, 170);
    s += w(182, 193, 182, 215) + dot(182, 215); // emitter node
    // zener from base node down
    s += w(150, 170, 118, 170, 118, 186) + diodeV(118, 186, "SZ 9.1", true) + w(118, 224, 118, 260);
    // ammeter + load
    s += w(182, 215, 260, 215) + meter(274, 215, "A", "0–1 A") + w(288, 215, 360, 215) + dot(360, 215);
    s += w(360, 215, 360, 224) + meter(360, 238, "V", "0–30 V") + w(360, 252, 360, 260);
    s += w(360, 215, 440, 215) + w(440, 215, 440, 222) + rV(440, 222, "RL", "820 Ω, 1 A") + w(440, 282, 440, 290);
    s += w(60, 164, 60, 290) + w(60, 290, 440, 290) + gnd(250, 290) + w(118, 260, 118, 290) + w(360, 260, 360, 290);
    return svg(520, 330, s);
  };

  // Op-amp inverting
  D["opamp-inv"] = () => {
    let s = "";
    s += srcAC(44, 150, "Vin", "2 Vpp") + w(44, 134, 44, 106, 70, 106) + rH(70, 106, "R1", "1 kΩ") + w(130, 106, 170, 106) + dot(170, 106);
    s += w(170, 106, 200, 106); // to − input
    s += opamp(200, 120, "741");
    s += w(170, 106, 170, 56, 220, 56) + rH(220, 56, "Rf", "10 kΩ") + w(280, 56, 310, 56, 310, 120) + dot(310, 120);
    s += w(200, 134, 176, 134, 176, 190) + gnd(176, 190);
    s += w(272, 120, 380, 120) + term(380, 120) + txt(394, 124, "Vo", "lbl b", "start");
    s += w(44, 166, 44, 190) + gnd(44, 190);
    s += txt(236, 76, "", "lbl m");
    s += txt(230, 210, "Gain A = −Rf / R1 = −10", "lbl m", "start");
    return svg(470, 230, s);
  };

  // Op-amp non-inverting
  D["opamp-noninv"] = () => {
    let s = "";
    s += srcAC(44, 168, "Vin", "2 Vpp") + w(44, 152, 44, 134, 200, 134); // to + input
    s += opamp(200, 120, "741");
    s += w(200, 106, 170, 106, 170, 56, 220, 56) + rH(220, 56, "Rf", "10 kΩ") + w(280, 56, 310, 56, 310, 120) + dot(310, 120);
    s += w(170, 106, 132, 106) + rH(132 - 60, 106, "R1", "1 kΩ"); // R1 to gnd — draw leftwards
    s += w(72, 106, 60, 106, 60, 190) + gnd(60, 190);
    s += w(272, 120, 380, 120) + term(380, 120) + txt(394, 124, "Vo", "lbl b", "start");
    s += w(44, 184, 44, 200) + gnd(44, 200);
    s += txt(230, 210, "Gain A = 1 + Rf / R1 = 11", "lbl m", "start");
    return svg(470, 230, s);
  };

  // Integrator
  D["integrator"] = () => {
    let s = "";
    s += term(30, 106) + txt(30, 92, "Vin (square)", "lbl m") + w(30, 106, 60, 106) + rH(60, 106, "R", "15 kΩ") + w(120, 106, 170, 106) + dot(170, 106) + w(170, 106, 200, 106);
    s += opamp(200, 120, "741");
    // feedback C with parallel Rf
    s += w(170, 106, 170, 40, 226, 40) + capH(226, 40, "C", "0.01 µF") + w(250, 40, 310, 40, 310, 120) + dot(310, 120);
    s += w(190, 70, 226, 70) + rH(226, 70, "Rf", "150 kΩ") + w(286, 70, 300, 70, 300, 90); // parallel Rf sketch
    s += w(170, 72, 190, 70 + 0);
    s += w(170, 106, 170, 72);
    s += w(200, 134, 176, 134, 176, 188) + gnd(176, 188);
    s += w(272, 120, 372, 120) + term(372, 120) + txt(386, 124, "Vo (triangular)", "lbl m", "start");
    return svg(500, 220, s);
  };

  // Differentiator
  D["differentiator"] = () => {
    let s = "";
    s += term(30, 106) + txt(30, 92, "Vin (square)", "lbl m") + w(30, 106, 66, 106) + capH(66, 106, "C", "0.1 µF") + w(90, 106, 120, 106) + rH(120, 106, "R", "820 Ω") + w(180, 106, 200, 106) + dot(190, 106);
    s += opamp(200, 120, "741");
    s += w(190, 106, 190, 56, 226, 56) + rH(226, 56, "Rf", "5.6 kΩ") + w(286, 56, 310, 56, 310, 120) + dot(310, 120);
    s += w(200, 134, 176, 134, 176, 188) + gnd(176, 188);
    s += w(272, 120, 372, 120) + term(372, 120) + txt(386, 124, "Vo (spikes)", "lbl m", "start");
    return svg(500, 220, s);
  };

  // RC phase-shift oscillator
  D["phase-shift"] = () => {
    let s = "";
    s += opamp(120, 110, "741");
    s += w(120, 96, 96, 96, 96, 46, 140, 46) + rH(140, 46, "Rf", "33 kΩ + pot") + w(200, 46, 232, 46, 232, 110) + dot(232, 110);
    s += w(96, 96, 60, 96) + rH(0, 96, "R1", "1.5 kΩ") + w(60, 96, 96, 96);
    s += w(0, 96, 0, 96); s += gnd(6, 96 + 4) ;
    s += w(120, 124, 100, 124, 100, 180) + gnd(100, 180);
    s += w(192, 110, 460, 110) + term(460, 110) + txt(474, 114, "Vo", "lbl b", "start");
    // three RC stages from output back to input node
    let x = 250;
    for (let i = 0; i < 3; i++) {
      s += w(x, 110, x, 190) + capH(x, 190, "C", "0.1 µF");
      // wait—capH is horizontal; place caps along the feedback path instead
      x += 70;
    }
    return svg(540, 240, s);
  };

  // Wien bridge oscillator (simplified)
  D["wien"] = () => {
    let s = "";
    s += opamp(180, 120, "741");
    // negative feedback Rf / R1
    s += w(180, 106, 156, 106, 156, 50, 210, 50) + rH(210, 50, "Rf", "4.7 kΩ pot") + w(270, 50, 300, 50, 300, 120) + dot(300, 120);
    s += w(156, 106, 120, 106, 120, 128) + rV(120, 128, "R1", "1 kΩ") + w(120, 188, 120, 210) + gnd(120, 210);
    // positive feedback: series RC then parallel RC to +
    s += w(300, 120, 340, 120, 340, 200, 80, 200);
    s += rH(80 - 60 + 60, 200, "", ""); // decorative
    s += txt(210, 192, "R–C series", "lbl m");
    s += w(80, 200, 60, 200, 60, 134, 180, 134); // to + input
    s += txt(96, 148, "R‖C", "lbl m");
    s += w(252, 120, 300, 120) + w(300, 120, 420, 120) + term(420, 120) + txt(434, 124, "Vo", "lbl b", "start");
    s += txt(250, 230, "R = 1.5 kΩ, C = 0.1 µF  →  fo = 1/(2πRC) ≈ 1 kHz", "lbl m");
    return svg(500, 250, s);
  };

  // Triangular wave generator (comparator + integrator)
  D["tri-gen"] = () => {
    let s = "";
    s += opamp(90, 110, "A1");
    s += txt(126, 88, "comparator", "lbl m");
    s += w(162, 110, 210, 110) + rH(210, 110, "R3", "10 kΩ") + w(270, 110, 310, 110);
    s += opamp(310, 96 + 14, "A2"); // − input at y=96
    s += txt(346, 88, "integrator", "lbl m");
    s += w(310, 96, 296, 96, 296, 44, 336, 44) + capH(336, 44, "C", "0.1 µF") + w(360, 44, 420, 44, 420, 110) + dot(420, 110);
    s += w(382, 110, 470, 110) + term(470, 110) + txt(484, 114, "Vo", "lbl b", "start");
    s += w(310, 124, 292, 124, 292, 180) + gnd(292, 180);
    // feedback: Vo -> R2 -> node P -> comparator +, node P -> R1 -> A1 out
    s += w(420, 110, 420, 200, 60, 200, 60, 124, 90, 124);
    s += txt(238, 192, "R2 = 180 Ω → P ← R1 = 1 kΩ (from A1 out)", "lbl m");
    s += w(90, 96, 74, 96, 74, 60) + gnd(74, 60 - 0) ;
    return svg(540, 240, s);
  };

  // Schmitt trigger
  D["schmitt"] = () => {
    let s = "";
    s += srcAC(44, 140, "Vin", "sine") + w(44, 124, 44, 106, 200, 106);
    s += opamp(200, 120, "741");
    s += w(272, 120, 400, 120) + term(400, 120) + txt(414, 124, "Vo", "lbl b", "start");
    // feedback divider to + input
    s += w(310, 120, 310, 180) + dot(310, 120);
    s += rH(230, 180, "R1", "22 kΩ"); s += w(310, 180, 290, 180) + w(230, 180, 200, 180) + dot(200, 180);
    s += w(200, 180, 200, 134); // + input
    s += w(200, 180, 200, 190) + rV(200, 190, "R2", "1 kΩ") + w(200, 250, 200, 262);
    s += srcDC(200, 276, "Vref", "2.5 V") + w(200, 295, 200, 306) + gnd(200, 306);
    s += w(44, 156, 44, 306) + w(44, 306, 200, 306);
    return svg(470, 340, s);
  };

  // 555 astable
  D["astable-555"] = () => {
    let s = "";
    s += icbox(210, 70, 130, 160, "555");
    // pins: 8 (Vcc, top), 4 (reset, top), 7,6,2 left, 3 right, 1 gnd bottom, 5 right-bottom
    s += txt(238, 64, "8", "lbl m") + txt(316, 64, "4", "lbl m");
    s += w(238, 40, 238, 70) + w(316, 40, 316, 70) + w(120, 40, 460, 40) + txt(290, 30, "V_CC = +10 V", "lbl b");
    s += txt(203, 105, "7", "lbl m", "end") + txt(203, 145, "6", "lbl m", "end") + txt(203, 185, "2", "lbl m", "end");
    s += txt(347, 105, "3", "lbl m", "start") + txt(347, 195, "5", "lbl m", "start");
    s += txt(272, 244, "1", "lbl m");
    // Ra from Vcc to pin 7
    s += w(150, 40, 150, 56) + rV(150, 56, "Ra", "6.8 kΩ") + w(150, 116, 150, 100 + 0) + w(150, 116, 150, 100) ;
    s += w(150, 116, 150, 100, 210, 100);
    s += dot(150, 100 + 16);
    // Rb from pin7 node to pin6/2 node
    s += w(150, 116, 150, 122) + rV(150, 122, "Rb", "6.8 kΩ") + w(150, 182, 150, 200) + dot(150, 200);
    s += w(150, 140 + 0, 150, 140);
    s += w(150, 200, 210, 200 - 60 + 0);
    s += w(150, 200, 178, 200, 178, 140, 210, 140); // pin 6
    s += w(150, 200, 150, 180 + 0);
    s += w(178, 200, 210, 200 - 20 + 0);
    s += w(150, 200, 150, 200) + w(150, 200, 194, 200, 194, 180, 210, 180); // pin 2
    // C from node to gnd
    s += w(150, 200, 150, 214) + capV(150, 214, "C", "0.1 µF") + w(150, 238, 150, 268);
    // pin 5 cap
    s += w(340, 195, 386, 195) + capV(386, 195, "C1", "0.01 µF") + w(386, 219, 386, 268);
    // pin 1 gnd
    s += w(275, 230, 275, 268);
    s += w(120, 268, 460, 268) + gnd(280, 268);
    // output
    s += w(340, 100, 430, 100) + term(430, 100) + txt(444, 104, "Vo", "lbl b", "start");
    return svg(500, 310, s);
  };

  // 555 monostable
  D["mono-555"] = () => {
    let s = "";
    s += icbox(210, 70, 130, 160, "555");
    s += txt(238, 64, "8", "lbl m") + txt(316, 64, "4", "lbl m");
    s += w(238, 40, 238, 70) + w(316, 40, 316, 70) + w(120, 40, 460, 40) + txt(290, 30, "V_CC = +5…15 V", "lbl b");
    s += txt(203, 105, "7", "lbl m", "end") + txt(203, 145, "6", "lbl m", "end") + txt(203, 185, "2", "lbl m", "end");
    s += txt(347, 105, "3", "lbl m", "start") + txt(347, 195, "5", "lbl m", "start");
    s += txt(272, 244, "1", "lbl m");
    // R from Vcc to 7/6 node
    s += w(150, 40, 150, 56) + rV(150, 56, "R", "10 kΩ") + w(150, 116, 150, 140) + dot(150, 140);
    s += w(150, 140, 210, 140); // pin 6
    s += w(150, 140, 150, 100) + w(150, 100, 210, 100); // pin 7 tied
    // C from node to gnd
    s += w(150, 140, 150, 200) + capV(150, 200, "C", "0.1 µF") + w(150, 224, 150, 268);
    // trigger to pin 2
    s += term(96, 180) + txt(96, 166, "trigger", "lbl m") + w(96, 180, 210, 180);
    // pin 5 cap
    s += w(340, 195, 386, 195) + capV(386, 195, "C1", "0.01 µF") + w(386, 219, 386, 268);
    s += w(275, 230, 275, 268);
    s += w(120, 268, 460, 268) + gnd(280, 268);
    s += w(340, 100, 430, 100) + term(430, 100) + txt(444, 104, "Vo (pulse)", "lbl m", "start");
    return svg(500, 310, s);
  };

  // Superposition network
  D["superposition"] = () => {
    let s = "";
    const topY = 80, gndY = 220;
    s += srcDC(60, 150, "E1", "0–30 V") + w(60, 136, 60, topY, 100, topY);
    s += meter(114, topY, "A", "A1: 0–2 A") + w(128, topY, 150, topY) + rH(150, topY, "", "19 Ω, 8.5 A") + w(210, topY, 250, topY) + dot(250, topY);
    s += rH(270, topY, "", "19 Ω, 8.5 A") + w(250, topY, 270, topY) + w(330, topY, 352, topY);
    s += meter(366, topY, "A", "A2: 0–1 A") + w(380, topY, 430, topY);
    s += w(250, topY, 250, 96) + rV(250, 96, "", "19 Ω, 8.5 A") + w(250, 156, 250, 170);
    s += meter(250, 184, "A", "A3: 0–5 A") + w(250, 198, 250, gndY);
    s += srcDC(430, 150, "E2", "0–30 V") + w(430, 136, 430, topY);
    s += w(60, 164, 60, gndY) + w(430, 164, 430, gndY) + w(60, gndY, 430, gndY);
    s += txt(84, 60, "V1 across E1", "lbl m", "start") + txt(406, 60, "V2 across E2", "lbl m", "end");
    return svg(500, 250, s);
  };

  // RLC series
  D["rlc-series"] = () => {
    let s = "";
    s += srcAC(56, 150, "230 V", "1φ, 50 Hz AC") + w(56, 134, 56, 70, 120, 70);
    s += meter(134, 70, "A", "0–2 A (MI)") + w(148, 70, 180, 70);
    s += rH(180, 70, "R", "145 Ω rheostat") + w(240, 70, 300, 70) + dot(300, 70);
    s += capH(310, 70, "C", "10 µF") + w(300, 70, 310, 70) + w(334, 70, 380, 70) + dot(380, 70);
    s += w(380, 70, 380, 88) + indV(380, 88, "L", "inductor") + w(380, 148, 380, 210);
    s += w(56, 166, 56, 210) + w(56, 210, 380, 210);
    // voltmeters
    s += txt(210, 42, "V_R", "lbl m") + txt(322, 42, "V_C", "lbl m") + txt(412, 118, "V_L", "lbl m", "start");
    s += txt(140, 232, "V across supply: 0–250 V (MI); V_R, V_L, V_C: 0–250 V (MI)", "lbl m", "start");
    return svg(500, 250, s);
  };

  // RLC parallel
  D["rlc-parallel"] = () => {
    let s = "";
    s += srcAC(56, 150, "230 V", "1φ, 50 Hz AC") + w(56, 134, 56, 60, 130, 60);
    s += meter(144, 60, "A", "I: 0–5 A") + w(158, 60, 420, 60);
    const gy = 230;
    // R branch
    s += dot(200, 60) + w(200, 60, 200, 74) + rV(200, 74, "R", "145 Ω") + w(200, 134, 200, 150) + meter(200, 164, "A", "I_R") + w(200, 178, 200, gy);
    // C branch
    s += dot(300, 60) + w(300, 60, 300, 88) + capV(300, 88, "C", "10 µF") + w(300, 112, 300, 150) + meter(300, 164, "A", "I_C") + w(300, 178, 300, gy);
    // L branch
    s += dot(400, 60) + w(400, 60, 400, 80) + indV(400, 80, "L", "") + w(400, 140, 400, 150) + meter(400, 164, "A", "I_L") + w(400, 178, 400, gy);
    s += w(56, 166, 56, gy) + w(56, gy, 400, gy);
    return svg(480, 270, s);
  };

  // Wheatstone bridge
  D["wheatstone"] = () => {
    let s = "";
    const cx = 240, top = 40, mid = 150, bot = 260;
    // diamond nodes: top c, left a, right b, bottom d
    const a = [cx - 130, mid], b = [cx + 130, mid], c = [cx, top], d = [cx, bot];
    s += w(a[0], a[1], (a[0] + c[0]) / 2 - 20, (a[1] + c[1]) / 2 + 20);
    s += txt(cx - 92, 82, "P", "lbl b");
    s += w((a[0] + c[0]) / 2 - 20, (a[1] + c[1]) / 2 + 20, c[0], c[1]);
    s += w(c[0], c[1], b[0], b[1]) + txt(cx + 92, 82, "Q", "lbl b");
    s += w(a[0], a[1], d[0], d[1]) + txt(cx - 92, 220, "X (unknown)", "lbl b");
    s += w(d[0], d[1], b[0], b[1]) + txt(cx + 100, 220, "S (decade)", "lbl b");
    // galvanometer across c–d
    s += w(c[0], c[1] + 0, c[0], 108) + meter(cx, 122, "G", "") + w(cx, 136, cx, 176) ;
    s += w(cx, 176, d[0], d[1] - 0);
    // battery across a–b
    s += w(a[0], a[1], a[0] - 40, a[1], a[0] - 40, 320, cx - 12, 320);
    s += srcDC(cx, 320, "B", "DC supply") + w(cx + 0, 320 + 19, cx, 339);
    s += w(cx, 301, cx, 320 - 19 + 0);
    s += w(cx + 12 - 12, 339, cx, 339) + w(cx, 339, b[0] + 40, 339, b[0] + 40, b[1], b[0], b[1]);
    s += dot(...a) + dot(...b) + dot(...c) + dot(...d);
    s += txt(a[0] - 10, a[1] - 10, "a", "lbl m", "end") + txt(b[0] + 10, b[1] - 10, "b", "lbl m", "start") + txt(c[0] + 12, c[1] - 4, "c", "lbl m", "start") + txt(d[0] + 12, d[1] + 14, "d", "lbl m", "start");
    s += txt(cx, 368, "Balance: X = (P/Q) × S", "lbl b");
    return svg(480, 385, s);
  };

  // LVDT construction
  D["lvdt"] = () => {
    let s = "";
    // bobbin
    s += `<rect class="comp" x="90" y="70" width="320" height="24" rx="4"/>`;
    s += `<rect class="comp" x="90" y="166" width="320" height="24" rx="4"/>`;
    // coils: sec1, primary, sec2 (top hatch)
    const coil = (x, wdt, lab) =>
      `<rect class="comp" x="${x}" y="40" width="${wdt}" height="30" fill="var(--accent-soft)"/>` +
      `<rect class="comp" x="${x}" y="190" width="${wdt}" height="30" fill="var(--accent-soft)"/>` +
      txt(x + wdt / 2, 30, lab, "lbl b");
    s += coil(100, 80, "Sec 1") + coil(210, 80, "Primary") + coil(320, 80, "Sec 2");
    // core
    s += `<rect class="fill" x="130" y="112" width="260" height="36" rx="6" opacity="0.75"/>`;
    s += txt(260, 135, "soft-iron core", "lbl", "middle");
    s += arrow(400, 130, 460, 130) + arrow(120, 130, 60, 130);
    s += txt(452, 152, "displacement x", "lbl m", "end");
    s += txt(250, 250, "e_out = e_s1 − e_s2  (zero at null, linear with core position)", "lbl m");
    return svg(500, 268, s);
  };

  // Cantilever beam / strain gauge
  D["cantilever"] = () => {
    let s = "";
    s += `<rect class="fill" x="30" y="40" width="18" height="180" opacity="0.55"/>`;
    s += `<rect class="comp" x="48" y="118" width="330" height="16" fill="var(--accent-soft)"/>`;
    s += `<rect class="comp" x="90" y="108" width="54" height="10" fill="var(--series-3)" opacity="0.8"/>`;
    s += txt(117, 100, "strain gauge", "lbl m");
    s += arrow(370, 134, 370, 186) + txt(384, 166, "load P (100 g steps → 1 kg)", "lbl m", "start");
    s += txt(212, 158, "L = 22 cm", "lbl m");
    s += txt(212, 220, "S = 6PL / (B·T²·E) microstrain — B = 2.81 cm, T = 0.25 cm, E = 2×10⁶", "lbl m");
    return svg(520, 240, s);
  };

  // Thermocouple
  D["thermocouple"] = () => {
    let s = "";
    s += w(60, 80, 240, 120) + txt(140, 78, "Metal A", "lbl b");
    s += w(60, 160, 240, 120) + txt(140, 172, "Metal B", "lbl b");
    s += dot(240, 120) + txt(252, 116, "hot junction T₁", "lbl m", "start");
    s += w(60, 80, 30, 80) + w(60, 160, 30, 160);
    s += meter(30, 120, "mV", "") + w(30, 94, 30, 106) + w(30, 134, 30, 146);
    s += txt(30, 196, "reference junction T₂", "lbl m");
    s += txt(250, 210, "E₀ = C₁(T₁ − T₂) + C₂(T₁² − T₂²)", "lbl m");
    return svg(460, 230, s);
  };

  // CT & PT wattmeter range extension (single-line)
  D["ctpt"] = () => {
    let s = "";
    s += srcAC(50, 130, "230 V", "1φ AC") + w(50, 114, 50, 60, 110, 60);
    s += icbox(110, 40, 90, 40, "W1 (CC)") + txt(155, 96, "250 V, 10 A (true)", "lbl m");
    s += w(200, 60, 240, 60);
    s += icbox(240, 40, 80, 40, "CT 50/5") + w(320, 60, 420, 60);
    s += w(420, 60, 420, 92) + rV(420, 92, "Load", "rheostats") + w(420, 152, 420, 200);
    s += w(50, 146, 50, 200) + w(50, 200, 420, 200);
    // secondary circuit
    s += icbox(240, 120, 80, 40, "W2 (CC)") + txt(280, 176, "125 V, 5 A via CT sec.", "lbl m");
    s += w(280, 100 - 20, 280, 120);
    s += icbox(110, 120, 90, 40, "PT 2:1") + w(200, 140, 240, 140);
    s += txt(155, 176, "PC of W2 via PT sec.", "lbl m");
    return svg(500, 230, s);
  };

  // Energy meter calibration (direct loading)
  D["energymeter"] = () => {
    let s = "";
    s += srcAC(50, 140, "230 V", "1φ, 50 Hz") + w(50, 124, 50, 60, 100, 60);
    s += meter(114, 60, "A", "0–5 A MI") + w(128, 60, 160, 60);
    s += icbox(160, 40, 100, 40, "Wattmeter") + txt(210, 96, "250 V, 5 A upf (CC)", "lbl m");
    s += w(260, 60, 300, 60);
    s += icbox(300, 40, 110, 40, "Energy meter") + txt(355, 96, "240 V, 2.5–10 A, k = 1500 rev/kWh", "lbl m");
    s += w(410, 60, 450, 60) + w(450, 60, 450, 112) + rV(450, 112, "RL", "100 Ω, 5 A") + w(450, 172, 450, 210);
    s += w(50, 156, 50, 210) + w(50, 210, 450, 210);
    s += txt(250, 234, "Pressure coils of wattmeter & energy meter across the supply", "lbl m");
    return svg(520, 250, s);
  };

  // waveform gallery helper (used by clipper section title art) — none

  window.Schematics = {
    render(root) {
      (root || document).querySelectorAll(".schematic[data-diagram]").forEach(box => {
        const id = box.dataset.diagram;
        if (D[id]) box.insertAdjacentHTML("afterbegin", D[id]());
      });
    },
  };
})();
