/* LayrdEDU — Study Hub worked examples + easy tricks.
   Exam-style solved numericals keyed by module article id, appended as a
   "Worked Examples" card at the end of each module (before the interactive
   card, which loads after this file).
   q = question, s = solution steps (newline-separated, rendered monospace),
   a = boxed answer, t = the shortcut/trick that solves it fastest. */
(function () {
  "use strict";

  const EX = {};

  /* ---------- MATHS-3 ---------- */
  EX["m3-m1"] = [{
    q: "Find the Fourier series of f(x) = x on (−π, π), and use it to evaluate 1 − 1/3 + 1/5 − …",
    s: "f(x) = x is odd → a₀ = aₙ = 0 (only sine terms survive)\nbₙ = (2/π)∫₀^π x·sin nx dx = (2/n)·(−1)ⁿ⁺¹   (tabular integration by parts)\nf(x) = 2[ sin x − sin 2x/2 + sin 3x/3 − … ]\nPut x = π/2: π/2 = 2[1 − 1/3 + 1/5 − …]",
    a: "x = 2·Σ (−1)ⁿ⁺¹ sin nx / n,  and  1 − 1/3 + 1/5 − … = π/4",
    t: "Check odd/even FIRST — it kills half the coefficients before you integrate anything. Then cos nπ = (−1)ⁿ finishes most bₙ in one line.",
  }];
  EX["m3-m2"] = [{
    q: "Find the Fourier transform of f(t) = e^(−2|t|).",
    s: "F(s) = (1/√2π)∫ e^(−2|t|) e^(−ist) dt — split at t = 0, the two halves are conjugates\n∫₀^∞ e^(−2t) cos st dt = 2/(4 + s²)   (standard integral, a = 2)\nF(s) = √(2/π) · 2/(4 + s²)",
    a: "F(s) = √(2/π) · 2/(s² + 4) — a smooth, everywhere-positive spectrum (no jumps → fast decay)",
    t: "Memorise three pairs — pulse ↔ sinc, e^(−a|t|) ↔ a/(a²+s²), gaussian ↔ gaussian — then reach the rest with shifting/scaling properties instead of fresh integrals.",
  }];
  EX["m3-m3"] = [{
    q: "Show f(z) = z² is analytic and find the image of the line x = 1 under w = z².",
    s: "u = x² − y², v = 2xy\n∂u/∂x = 2x = ∂v/∂y ✓   ∂u/∂y = −2y = −∂v/∂x ✓ → CR satisfied, partials continuous → analytic\nOn x = 1: u = 1 − y², v = 2y → eliminate y = v/2",
    a: "u = 1 − v²/4 — a left-opening parabola; every vertical line maps to a parabola (see the diagram above)",
    t: "For images under w = z², substitute the line equation into u, v and eliminate the parameter — never invert the map. Answers are always parabolas/hyperbolas.",
  }];
  EX["m3-m4"] = [{
    q: "Evaluate ∮ z dz / [(z−1)(z−3)] around |z| = 2.",
    s: "Poles: z = 1 (inside |z| = 2), z = 3 (outside — ignored)\nRes at z = 1: lim_{z→1} (z−1)·f(z) = 1/(1−3) = −1/2\n∮ = 2πi · (sum of enclosed residues) = 2πi·(−1/2)",
    a: "∮ = −πi. Redraw the contour as |z| = 4 and both poles count: Res(3) = 3/2, total = 2πi(1) = 2πi",
    t: "Simple pole → cover-up rule: Res = N(z₀)/D′(z₀). Sketch the contour and cross out outside poles before computing anything.",
  }];

  /* ---------- CIRCUITS & NETWORKS ---------- */
  EX["cn-m1"] = [{
    q: "Mesh AND node analysis, simple method: a 5 V source in series with 2 Ω feeds node A, from which two 1 Ω resistors go to ground. Solve the circuit both ways.",
    s: "NODE (1 equation): at A →  (V_A − 5)/2 + V_A/1 + V_A/1 = 0\n→ V_A·(0.5 + 1 + 1) = 2.5 → V_A = 1 V\ncurrents: source 2 A, each 1 Ω carries 1 A ✓\n\nMESH by inspection (2 equations):\n[ R₁₁  −R₁₂ ] [I₁]   [ΣEMF₁]      [ 3  −1 ] [I₁]   [5]\n[ −R₂₁  R₂₂ ] [I₂] = [ΣEMF₂]  →   [ −1  2 ] [I₂] = [0]\ndiagonal = total R in each mesh, off-diagonal = −(shared R)\nCramer: Δ = 5 → I₁ = 2 A, I₂ = 1 A (same answers)",
    a: "V_A = 1 V, I₁ = 2 A, I₂ = 1 A — one node equation beat two mesh equations here",
    t: "Count before you solve: nodal needs (nodes − 1) equations, mesh needs (branches − nodes + 1). Pick the smaller. Write mesh equations straight from the matrix pattern — diagonal positive, shared resistances negative, EMF rises on the right.",
  }, {
    q: "A 10 V source with 2 Ω in series feeds a 3 Ω resistor. Find the Thévenin equivalent seen across the 3 Ω, and the maximum power a load can draw.",
    s: "V_th = open-circuit voltage = 10 × 3/(2+3) = 6 V\nR_th = sources killed → 2 Ω ∥ 3 Ω = 1.2 Ω\nMax power transfer at R_L = R_th = 1.2 Ω\nP_max = V_th²/(4·R_th) = 36/4.8",
    a: "V_th = 6 V, R_th = 1.2 Ω, P_max = 7.5 W",
    t: "Kill sources mentally (V → wire, I → gap) and R_th is usually a one-line series-parallel; V_th is almost always a voltage divider.",
  }];
  EX["cn-m2"] = [{
    q: "A 10 V step is applied to R = 10 kΩ in series with C = 100 µF (initially uncharged). Find v_C at t = 1 s and 2 s.",
    s: "τ = RC = 10×10³ × 100×10⁻⁶ = 1 s\nv_C(t) = V(1 − e^(−t/τ)) = 10(1 − e^(−t))\nv_C(1) = 10(1 − 0.368) = 6.32 V   v_C(2) = 10(1 − 0.135) = 8.65 V\ni(0⁺) = V/R = 1 mA (capacitor looks like a short at t = 0⁺)",
    a: "6.32 V after one τ, 8.65 V after two — exactly the 63 % landmarks on the curve above",
    t: "Never solve the ODE. Find three numbers — x(0⁺), x(∞), τ — and the universal formula x(t) = x(∞) + [x(0)−x(∞)]e^(−t/τ) writes the answer.",
  }];
  EX["cn-m3"] = [{
    q: "Solve di/dt + 2i = 4 with i(0) = 1 A using Laplace transforms.",
    s: "Transform: sI(s) − i(0) + 2I(s) = 4/s\nI(s) = (s + 4)/[s(s + 2)]\nPartial fractions: I(s) = 2/s − 1/(s + 2)\nInvert: i(t) = 2 − e^(−2t)",
    a: "i(t) = 2 − e^(−2t) A — check: i(0) = 1 ✓, i(∞) = 2 ✓, τ = ½ s",
    t: "Cover-up rule for partial fractions, then sanity-check with the initial & final value theorems BEFORE inverting — they catch sign slips for free.",
  }];
  EX["cn-m4"] = [{
    q: "A series RLC has R = 10 Ω, L = 0.1 H, C = 10 µF. Find f₀, Q, bandwidth, and the capacitor voltage at resonance for a 10 V supply.",
    s: "f₀ = 1/(2π√(LC)) = 1/(2π×10⁻³) = 159.2 Hz\nQ = (1/R)·√(L/C) = (1/10)·√(10⁴) = 10\nBW = f₀/Q = 15.9 Hz\nat resonance Z = R → I = 1 A → V_C = Q·V = 100 V (!)",
    a: "f₀ ≈ 159 Hz, Q = 10, BW ≈ 15.9 Hz, V_C = 100 V from a 10 V source — voltage magnification is the exam favourite",
    t: "At resonance the circuit is purely resistive, and V_L = V_C = Q × V_supply — quote it, don't derive it.",
  }];

  /* ---------- DC MACHINES ---------- */
  EX["dcm-m1"] = [{
    q: "A 4-pole wave-wound DC generator has 400 conductors, flux 0.02 Wb/pole, and runs at 1200 rpm. Find the generated EMF.",
    s: "Wave winding → A = 2\nE = φZNP/(60A) = 0.02 × 400 × 1200 × 4 / (60 × 2)\n= 38400/120",
    a: "E = 320 V. (Lap-wound, A = P = 4, would give 160 V — more parallel paths trade voltage for current.)",
    t: "Fix A first — lap: A = P, wave: A = 2 — that choice is the whole question. For 'what if N or φ changes' use E₂/E₁ = φ₂N₂/(φ₁N₁), no full formula needed.",
  }];
  EX["dcm-m2"] = [{
    q: "A 230 V shunt motor draws an armature current of 20 A with Ra = 0.5 Ω at 1000 rpm. Find the back EMF, mechanical power and torque developed.",
    s: "E_b = V − I_a·R_a = 230 − 20×0.5 = 220 V\nP_mech = E_b·I_a = 220 × 20 = 4.4 kW\nω = 2πN/60 = 2π×1000/60 = 104.7 rad/s\nT = P_mech/ω = 4400/104.7",
    a: "E_b = 220 V, P = 4.4 kW, T ≈ 42 N·m",
    t: "Speed problems are one ratio: N₂/N₁ = (E_b₂/E_b₁)·(φ₁/φ₂). Compute the two back-EMFs, take the ratio, done.",
  }];
  EX["dcm-m3"] = [{
    q: "A 230 V, 50 Hz transformer has 1000 primary turns. Find the peak core flux, and the turns needed for a 24 V secondary.",
    s: "E = 4.44·f·φₘ·N → φₘ = 230/(4.44 × 50 × 1000)\n= 1.04 mWb\nN₂ = N₁·V₂/V₁ = 1000 × 24/230 ≈ 104 turns",
    a: "φₘ ≈ 1.04 mWb, N₂ ≈ 104 turns",
    t: "Work in volts-per-turn (here 0.23 V/turn) — it is identical on both sides, so every winding question becomes a multiplication. Max efficiency: quote P_cu = P_iron, don't differentiate.",
  }];
  EX["dcm-m4"] = [{
    q: "Two 50 kVA single-phase transformers are connected in open-delta (V–V). What 3-φ load can they carry, and at what fraction of installed capacity?",
    s: "Open-delta capacity = √3 × (one unit's rating) = √3 × 50 = 86.6 kVA\nInstalled = 2 × 50 = 100 kVA → utilisation = 86.6/100 = 86.6 %\nCompared with a full Δ of three units (150 kVA): 86.6/150 = 57.7 %",
    a: "86.6 kVA — each transformer at 86.6 % of rating, bank at 57.7 % of full delta",
    t: "Memorise the two open-delta numbers — 86.6 % and 57.7 % — they answer every V–V question instantly. Star ↔ delta: only ONE of V or I picks up the √3.",
  }];

  /* ---------- ANALOG ELECTRONICS ---------- */
  EX["anx-m1"] = [{
    q: "Voltage-divider bias: V_CC = 12 V, R₁ = 47 k, R₂ = 10 k, R_E = 680 Ω, R_C = 2.2 k. Locate the Q-point.",
    s: "V_B = 12 × 10/(47+10) = 2.11 V\nV_E = V_B − 0.7 = 1.41 V → I_E = 1.41/680 = 2.07 mA ≈ I_C\nV_CE = V_CC − I_C(R_C + R_E) = 12 − 2.07m × 2.88k = 6.0 V",
    a: "Q ≈ (6.0 V, 2.1 mA) — mid-rail, maximum symmetric swing (the lab's RC-amplifier values)",
    t: "If β·R_E ≫ 10·R₂ the divider is 'stiff' — treat V_B as a plain voltage divider and never touch β. Three lines: V_B → V_E → I_C.",
  }];
  EX["anx-m2"] = [{
    q: "An amplifier has mid-band gain 100 and f_H = 1 MHz. Express the gain in dB, and find the bandwidth of two identical stages in cascade.",
    s: "Gain(dB) = 20·log₁₀(100) = 40 dB → cascade = 80 dB\nCascade f_H = f_H·√(2^(1/n) − 1),  n = 2\n= 1 MHz × √(√2 − 1) = 1 MHz × 0.644",
    a: "40 dB each, 80 dB total, bandwidth shrinks to ≈ 644 kHz — gain stacks, bandwidth pays",
    t: "dB arithmetic beats multiplication: gains multiply → dBs add; ×10 = +20 dB, ×2 = +6 dB, 1/√2 = −3 dB. Most response questions are additions.",
  }];
  EX["anx-m3"] = [{
    q: "A = 1000 with feedback β = 0.04. Find A_f, and the change in A_f if A drops 50 %. Also: f₀ of an RC phase-shift oscillator with R = 680 Ω, C = 0.1 µF.",
    s: "A_f = A/(1+Aβ) = 1000/41 = 24.4\nA halves → A_f = 500/21 = 23.8 → only 2.4 % change (desensitivity 1+Aβ = 41)\nf₀ = 1/(2π√6·RC) = 1/(2π × 2.449 × 680 × 10⁻⁷)",
    a: "A_f ≈ 24.4, nearly immune to device variation; f₀ ≈ 955 Hz",
    t: "When Aβ ≫ 1, jump straight to A_f ≈ 1/β = 25 — the exact answer is a small correction. Oscillators: match the circuit to its formula (√6 → phase-shift, plain 2πRC → Wien) and quote the gain condition (29 / 3).",
  }];
  EX["anx-m4"] = [{
    q: "A 555 astable uses R_a = R_b = 6.8 kΩ, C = 0.1 µF. Find the frequency and duty cycle. Also: max full-power frequency for SR = 1 V/µs at V_peak = 10 V.",
    s: "t_c = 0.69(R_a+R_b)C = 0.69 × 13.6k × 0.1µ = 0.94 ms\nt_d = 0.69·R_b·C = 0.47 ms\nf = 1/(t_c+t_d) = 1/1.41 ms ≈ 710 Hz   duty = t_c/(t_c+t_d) = 66.7 %\nf_max = SR/(2π·V_peak) = 10⁶/(2π×10)",
    a: "≈ 710 Hz at 66.7 % duty (matches the lab experiment); slew-rate limit f_max ≈ 15.9 kHz",
    t: "Everything in a 555 is t = 0.69·R·C with the right R: charge through Ra+Rb, discharge through Rb. Duty is always > 50 % for the basic astable — if your answer says otherwise, recheck.",
  }];

  /* ---------- AI & DATA SCIENCE ---------- */
  EX["aids-m1"] = [{
    q: "A search tree has branching factor b = 3 and the goal sits at depth d = 4. How many nodes can BFS generate, and why does DFS use less memory?",
    s: "Worst case BFS generates every node to depth 4: 1+3+9+27+81 = (3⁵−1)/2 = 121 nodes\nBFS frontier alone holds up to b^d = 81 nodes (exponential memory)\nDFS stores only the current path + siblings: O(b·d) = 12 nodes",
    a: "121 vs ~12 — BFS buys optimality with exponential memory; iterative deepening gets both for O(b·d)",
    t: "Total tree nodes = (b^(d+1) − 1)/(b − 1) — one geometric-sum formula instead of adding levels. In comparisons, answer in O(·) first, numbers second.",
  }];
  EX["aids-m2"] = [{
    q: "A classifier gives TP = 40, FP = 10, FN = 20, TN = 30. Compute accuracy, precision, recall and F1.",
    s: "accuracy = (TP+TN)/all = 70/100 = 0.70\nprecision = TP/(TP+FP) = 40/50 = 0.80\nrecall = TP/(TP+FN) = 40/60 = 0.667\nF1 = 2PR/(P+R) = 2×0.8×0.667/1.467",
    a: "acc 0.70, P 0.80, R 0.67, F1 ≈ 0.73 — high precision + low recall = it misses positives it should catch",
    t: "Draw the 2×2 matrix and label it before touching formulas. Mnemonic: Precision = of my Positive calls, how many were right; Recall = of the Real positives, how many I caught.",
  }];
  EX["aids-m3"] = [{
    q: "For the data 5, 7, 8, 9, 10, 12, 35 — find the median, IQR and any outliers. Which centre should you report?",
    s: "sorted already: median = 9\nQ₁ = 7, Q₃ = 12 → IQR = 5\nfences: Q₁ − 1.5·IQR = −0.5,  Q₃ + 1.5·IQR = 19.5 → 35 is an outlier\nmean = 86/7 = 12.3 — dragged 37 % above the median by one point",
    a: "median 9, IQR 5, outlier 35. Report the median — the mean is not robust",
    t: "Sort first, always. The fence recipe never changes: Q₁ − 1.5·IQR and Q₃ + 1.5·IQR. If mean ≫ median, suspect a right-tail outlier before computing anything else.",
  }];
  EX["aids-m4"] = [{
    q: "Compare a = (1, 2, 3) and b = (2, 4, 6) by cosine similarity and Euclidean distance. What does the disagreement teach?",
    s: "a·b = 2+8+18 = 28,  |a| = √14,  |b| = √56\ncos θ = 28/(√14·√56) = 28/28 = 1 (identical direction)\nEuclidean d = √(1²+2²+3²) = √14 ≈ 3.74 (far apart in magnitude)",
    a: "cosine says identical, Euclidean says distant — pick the metric that matches what 'similar' means for your data",
    t: "Spot scalar multiples by eye (b = 2a) → cosine = 1 with zero arithmetic. Rule of thumb: direction matters (text, ratings) → cosine; magnitude matters (coordinates) → Euclidean.",
  }];

  /* ---------- ECONOMICS ---------- */
  EX["eco-m1"] = [{
    q: "Price rises from ₹10 to ₹12 and quantity demanded falls from 100 to 80. Find the (midpoint) price elasticity of demand.",
    s: "%ΔQ = (80−100)/90 = −22.2 %   (midpoint base Q̄ = 90)\n%ΔP = (12−10)/11 = +18.2 %   (P̄ = 11)\ne = −22.2/18.2 = −1.22",
    a: "|e| ≈ 1.22 > 1 → elastic: this price rise LOWERS total revenue (1200 → 960)",
    t: "One-liner: e = (ΔQ/ΔP)·(P̄/Q̄) = (−20/2)·(11/90). And remember the revenue test: elastic → price and revenue move opposite ways.",
  }];
  EX["eco-m2"] = [{
    q: "Nominal GDP is ₹550 lakh crore and real GDP is ₹500 lakh crore. Find the GDP deflator and the implied inflation vs the base year.",
    s: "deflator = nominal/real × 100 = 550/500 × 100 = 110\nbase year deflator = 100 by definition",
    a: "Deflator 110 → prices 10 % above base year; real growth is what survives the deflation",
    t: "Deflator, CPI, any index — all are (value ÷ base) × 100. One pattern answers the whole family, and 'real' always means 'divide the nominal by the index'.",
  }];
  EX["eco-m3"] = [{
    q: "₹1,00,000 is invested at 10 % compounded annually for 5 years. Also find the present worth of ₹50,000 due in 3 years at 8 %.",
    s: "F = P(1+i)ⁿ = 1,00,000 × 1.1⁵ = 1,00,000 × 1.6105\nP = F/(1+i)ⁿ = 50,000/1.08³ = 50,000/1.2597",
    a: "F = ₹1,61,051 and P ≈ ₹39,692 — both single hops along the timeline",
    t: "Sanity-check with the Rule of 72: doubling time ≈ 72/i%. At 10 %, money doubles in ~7.2 years — so ×1.61 in 5 years is plausible. Draw the timeline before choosing F/P vs P/F.",
  }];
  EX["eco-m4"] = [{
    q: "Fixed cost ₹2,00,000; selling price ₹50/unit; variable cost ₹30/unit. Find the BEP, and profit at 12,000 units.",
    s: "contribution/unit = 50 − 30 = ₹20\nBEP = FC/contribution = 2,00,000/20 = 10,000 units (₹5,00,000 sales)\nprofit at 12,000 = (12,000 − 10,000) × 20 = ₹40,000\nmargin of safety = 2,000/12,000 = 16.7 %",
    a: "BEP 10,000 units; ₹40,000 profit; 16.7 % margin of safety",
    t: "Everything flows from contribution = price − variable cost: BEP = FC/contribution, profit = units-past-BEP × contribution. Never rebuild the full cost table.",
  }];

  /* ---------- ETHICS & SD ---------- */
  EX["eth-m1"] = [{
    q: "Classify these reactions to the Heinz dilemma (steal an unaffordable drug to save a life?) by Kohlberg stage: (a) 'No — he'll go to jail.' (b) 'No — if everyone stole, society would collapse.' (c) 'Yes — a life outweighs property; an unjust price deserves no obedience.'",
    s: "(a) reasons only from punishment → pre-conventional, stage 1\n(b) reasons from maintaining social order/law → conventional, stage 4\n(c) appeals to a universal principle above the law → post-conventional, stage 6",
    a: "Stages 1, 4 and 6",
    t: "Grade the REASONING, never the verdict — both 'yes' and 'no' exist at every stage. Punishment → 1, deal/benefit → 2, approval → 3, law & order → 4, contract → 5, principle → 6.",
  }];
  EX["eth-m2"] = [{
    q: "A flaw has failure probability 10⁻⁴/year with expected damage ₹5 crore. A fix costs ₹2 lakh/year. Should the engineer insist on it, and what if management refuses?",
    s: "expected annual loss = 10⁻⁴ × 5×10⁷ = ₹5,000 — naïvely cheaper to skip the fix\nBUT severity involves possible loss of life → not reducible to money; the exposed public never consented\ncodes: 'hold paramount the safety of the public' overrides cost–benefit\nif overruled: document → exhaust internal channels → then whistle-blowing is justified",
    a: "Insist on the fix — Challenger is the canonical case of this exact arithmetic overruling engineers",
    t: "Full marks recipe for any safety dilemma: quote 'hold paramount', name informed consent, list the three whistle-blowing conditions (serious harm, channels exhausted, documented evidence).",
  }];
  EX["eth-m3"] = [{
    q: "Humanity's average ecological footprint is 2.7 gha/person against a biocapacity of 1.6 gha/person. What does this imply?",
    s: "overshoot ratio = 2.7/1.6 = 1.69 → consuming as if we had ~1.7 Earths\nthe deficit is met by drawing down stocks (forests, fisheries, aquifers) and overfilling sinks (CO₂)\nequity: the average hides that high-income footprints run several × the sustainable share",
    a: "≈ 1.7 planets — the quantitative statement of unsustainability",
    t: "footprint ÷ biocapacity = number of planets. One division, then spend your marks on the stock/sink explanation and the equity point.",
  }];
  EX["eth-m4"] = [{
    q: "Compare a 10 W LED and a 60 W incandescent over the LED's 25,000 h life (electricity ₹6/kWh) as a mini life-cycle analysis.",
    s: "use-phase energy: LED = 10 × 25,000 = 250 kWh; incandescent = 60 × 25,000 = 1,500 kWh\n(plus ~20 bulb replacements at 1,250 h each)\nsavings = 1,250 kWh → ₹7,500 and roughly a tonne of CO₂\nembodied (manufacturing) energy is small against a 1,250 kWh use-phase gap",
    a: "Use phase dominates the LCA → design-stage efficiency beats end-of-pipe fixes",
    t: "For any appliance LCA question, compute lifetime kWh first — the use phase almost always dwarfs manufacture and disposal, and that one number carries the argument.",
  }];

  /* ---------- render ---------- */
  Object.keys(EX).forEach(id => {
    const art = document.getElementById(id);
    if (!art) return;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h3>Worked Examples &amp; Easy Tricks</h3>" + EX[id].map((e, i) =>
      `<div class="ex">
        <div class="ex-q"><span class="ex-n">Example ${i + 1}</span>${e.q}</div>
        <div class="ex-s">${e.s}</div>
        <div class="ex-a">✔ ${e.a}</div>
        ${e.t ? `<div class="ex-t">⚡ <b>Trick:</b> ${e.t}</div>` : ""}
      </div>`).join("");
    art.appendChild(card);
  });
})();
