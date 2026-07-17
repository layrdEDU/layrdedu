/* LayrdEDU — S3 EEE Study Hub (KTU 2024 scheme)
   Data-driven subject tabs: module-wise key topics, important equations,
   exam cheats, and reference links. Rendered before app.js binds navigation. */
(function () {
  "use strict";

  const GLOBAL_LINKS = [
    ["Official KTU syllabus & regulations", "https://ktu.edu.in/academics/branchsyllabus"],
    ["KTU S3 notes hub (ktunotes.live)", "https://s3.ktunotes.live/"],
    ["S3 2024-scheme notes — branch-wise (KTU Notes)", "https://www.ktunotes.in/ktu-s3-2024-scheme-notes-branch-wise-study-materials/"],
    ["S3 EEE question papers — 2024 scheme (KTU Notes)", "https://www.ktunotes.in/ktu-s3-eee-question-papers-2024-scheme/"],
    ["S3 EEE syllabus — 2024 scheme (KTU Notes)", "https://www.ktunotes.in/ktu-s3-btech-electrical-and-electronics-engineering-syllabus-2024-scheme/"],
  ];
  const search = q => "https://www.google.com/search?q=" + encodeURIComponent(q);
  const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

  /* eqns: [name, expression] ; topics: strings ; cheats: strings */
  const SUBJECTS = [

    /* ================= MATHEMATICS FOR ELECTRICAL SCIENCE — 3 ================= */
    {
      id: "m3", tab: "📐 Maths-3", name: "Mathematics for Electrical Science – 3",
      intro: "The transform-and-complex-analysis toolkit behind circuit, signal and field analysis: Fourier series & transforms, then analytic functions and contour integration.",
      modules: [
        {
          short: "Fourier Series", title: "Module 1 — Fourier Series",
          topics: [
            "Periodic functions and Dirichlet conditions for a valid Fourier expansion",
            "Euler formulas for a₀, aₙ, bₙ over period 2π and general period 2L",
            "Series of even and odd functions — which coefficients vanish",
            "Half-range sine and cosine expansions on (0, L)",
            "Convergence at a jump discontinuity (average of left and right limits)",
            "Parseval's identity and RMS value of a periodic signal",
            "Harmonic analysis of tabulated (numerical) data",
          ],
          eqns: [
            ["Series", "f(x) = a₀/2 + Σ [aₙ·cos(nπx/L) + bₙ·sin(nπx/L)]"],
            ["a₀", "a₀ = (1/L) ∫₍c₎^(c+2L) f(x) dx"],
            ["aₙ", "aₙ = (1/L) ∫ f(x)·cos(nπx/L) dx"],
            ["bₙ", "bₙ = (1/L) ∫ f(x)·sin(nπx/L) dx"],
            ["Half-range sine", "bₙ = (2/L) ∫₀ᴸ f(x)·sin(nπx/L) dx  (aₙ = 0)"],
            ["Half-range cosine", "aₙ = (2/L) ∫₀ᴸ f(x)·cos(nπx/L) dx  (bₙ = 0)"],
            ["Parseval", "(1/L) ∫ f² dx = a₀²/2 + Σ (aₙ² + bₙ²)"],
          ],
          cheats: [
            "Check even/odd FIRST — an odd function kills all aₙ (sine series), an even one kills all bₙ. Half the work disappears.",
            "cos nπ = (−1)ⁿ and sin nπ = 0 — memorise; nearly every coefficient simplification uses them.",
            "∫x·sin / ∫x²·cos → use Bernoulli's tabular (repeated) integration by parts; it's fast and error-proof.",
            "At a jump x₀ the series converges to [f(x₀⁻)+f(x₀⁺)]/2 — a favourite 3-mark theory question.",
            "Deduce series sums (π²/6, π²/8 …) by substituting special x values into your result.",
          ],
        },
        {
          short: "Fourier Transforms", title: "Module 2 — Fourier Transforms",
          topics: [
            "Fourier integral theorem (statement) — from series to transform",
            "Fourier transform and inverse transform pair; spectrum interpretation",
            "Fourier sine and cosine transforms and their inverses",
            "Properties: linearity, shifting, modulation, change of scale",
            "Transforms of standard signals — rectangular pulse, e^(−a|x|), Gaussian",
            "Parseval's identity for transforms",
          ],
          eqns: [
            ["Transform", "F(s) = (1/√2π) ∫₋∞^∞ f(x)·e^(isx) dx"],
            ["Inverse", "f(x) = (1/√2π) ∫₋∞^∞ F(s)·e^(−isx) ds"],
            ["Cosine transform", "Fc(s) = √(2/π) ∫₀^∞ f(x)·cos sx dx"],
            ["Sine transform", "Fs(s) = √(2/π) ∫₀^∞ f(x)·sin sx dx"],
            ["Shifting", "F{f(x−a)} = e^(isa)·F(s)"],
            ["Scaling", "F{f(ax)} = (1/a)·F(s/a),  a > 0"],
            ["Parseval", "∫ |f(x)|² dx = ∫ |F(s)|² ds"],
          ],
          cheats: [
            "The Gaussian e^(−x²/2) is self-reciprocal — its transform is itself. Classic short question.",
            "Even function → work with the cosine transform; odd → sine transform; it halves the integral.",
            "Rectangular pulse ↔ sinc function: sketch both — examiners love the pair.",
            "Evaluate definite integrals (e.g. ∫ sin x / x dx = π/2) by applying the inversion theorem at a suitable point.",
          ],
        },
        {
          short: "Complex Differentiation", title: "Module 3 — Analytic Functions & Conformal Mapping",
          topics: [
            "Limits, continuity and differentiability of complex functions",
            "Analytic functions; Cauchy–Riemann equations (Cartesian and polar)",
            "Harmonic functions; harmonic conjugate via Milne–Thomson method",
            "Orthogonal families u = c₁ and v = c₂",
            "Conformal mappings of standard functions: w = z², eᶻ, 1/z, sin z",
            "Bilinear (Möbius) transformation; fixed points; cross-ratio",
          ],
          eqns: [
            ["C–R equations", "∂u/∂x = ∂v/∂y ,  ∂u/∂y = −∂v/∂x"],
            ["Derivative", "f′(z) = uₓ + i·vₓ"],
            ["Polar C–R", "uᵣ = (1/r)·v_θ ,  vᵣ = −(1/r)·u_θ"],
            ["Harmonic", "∇²u = uₓₓ + u_yy = 0"],
            ["Milne–Thomson", "f(z) = ∫ [uₓ(z, 0) − i·u_y(z, 0)] dz + C"],
            ["Bilinear", "w = (az + b)/(cz + d),  ad − bc ≠ 0"],
            ["Cross-ratio", "(w−w₁)(w₂−w₃)/(w−w₃)(w₂−w₁) = (z−z₁)(z₂−z₃)/(z−z₃)(z₂−z₁)"],
          ],
          cheats: [
            "Analyticity test = C–R satisfied AND partial derivatives continuous — quote both parts.",
            "Given u, find f(z) in one line with Milne–Thomson instead of solving for v first.",
            "Bilinear map through 3 point-pairs: plug straight into the cross-ratio formula — no simultaneous equations.",
            "|f′(z)| is the local magnification and arg f′(z) the rotation of a conformal map — standard 3-mark theory.",
          ],
        },
        {
          short: "Complex Integration", title: "Module 4 — Complex Integration & Residues",
          topics: [
            "Line integrals in the complex plane; ML inequality",
            "Cauchy's integral theorem (simply connected domains)",
            "Cauchy's integral formula and formula for derivatives",
            "Taylor and Laurent series; region of convergence / annulus",
            "Zeros and singularities — removable, poles, essential",
            "Residues; Cauchy's residue theorem; evaluation of contour integrals",
          ],
          eqns: [
            ["Cauchy theorem", "∮_C f(z) dz = 0  (f analytic inside & on C)"],
            ["Integral formula", "f(a) = (1/2πi) ∮ f(z)/(z−a) dz"],
            ["Derivatives", "f⁽ⁿ⁾(a) = (n!/2πi) ∮ f(z)/(z−a)ⁿ⁺¹ dz"],
            ["Residue (simple pole)", "Res(a) = lim_(z→a) (z−a)·f(z)"],
            ["Residue (pole of order m)", "Res(a) = (1/(m−1)!)·lim d^(m−1)/dz^(m−1) [(z−a)^m f(z)]"],
            ["Rational shortcut", "Res(a) = p(a)/q′(a)  for f = p/q, simple zero of q"],
            ["Residue theorem", "∮_C f(z) dz = 2πi · Σ Residues inside C"],
          ],
          cheats: [
            "Decide the tool by what's inside C: no singularity → Cauchy theorem (0); one point → integral formula; several → residue theorem.",
            "Classify a singularity from the Laurent principal part: finite terms = pole (order = highest power), infinite = essential.",
            "For Laurent expansions, first identify the annulus the question asks for — the same function has different series in different regions.",
            "p(a)/q′(a) beats the limit method for rational functions — quicker and safer in exams.",
          ],
        },
      ],
      examTips: [
        "Fourier coefficient integrals + one half-range expansion appear virtually every year — drill the tabular integration by parts.",
        "Keep one page of transform pairs and one of residue rules; most Part-B questions are direct applications.",
        "Show the region/annulus explicitly in Laurent-series answers — marks are allotted to it.",
      ],
      links: [
        ["Search: KTU 2024 Maths for Electrical Science-3 notes", search("KTU 2024 scheme Mathematics for Electrical Science 3 S3 EEE notes")],
        ["YouTube: Fourier series KTU S3", yt("KTU S3 2024 scheme Fourier series")],
        ["YouTube: Complex integration residues KTU", yt("KTU complex integration residue theorem")],
      ],
    },

    /* ================= CIRCUITS AND NETWORKS ================= */
    {
      id: "cn", tab: "🔌 Circuits & Networks", name: "Circuits and Networks",
      intro: "The core analysis subject of EEE — network theorems, transients, s-domain analysis and two-port networks. Pairs directly with the Circuits & Measurements Lab tab on this site.",
      modules: [
        {
          short: "Network Theorems", title: "Module 1 — Circuit Analysis & Network Theorems",
          topics: [
            "Independent and dependent sources; source transformation",
            "Mesh analysis (supermesh) and node analysis (supernode) with dependent sources",
            "Star–delta (Y–Δ) conversion",
            "Superposition theorem and its limits",
            "Thevenin's and Norton's theorems (including dependent sources)",
            "Maximum power transfer theorem; Millman's and reciprocity theorems",
          ],
          eqns: [
            ["Thevenin", "V_th = open-circuit voltage,  R_th = V_oc / I_sc"],
            ["Norton", "I_N = I_sc ,  R_N = R_th"],
            ["Max power", "P_max = V_th² / (4·R_th)  when R_L = R_th"],
            ["Millman", "V = (Σ Eᵢ/Rᵢ) / (Σ 1/Rᵢ)"],
            ["Δ → Y", "R₁ = R_b·R_c / (R_a + R_b + R_c)  (and cyclic)"],
            ["Y → Δ", "R_a = (R₁R₂ + R₂R₃ + R₃R₁)/R₁  (and cyclic)"],
          ],
          cheats: [
            "Killing sources: voltage source → short, current source → open. Never kill dependent sources.",
            "With dependent sources find R_th as V_oc/I_sc, or apply a 1 V / 1 A test source — the 'look-in' resistance method fails.",
            "Superposition works for V and I only — NEVER for power (it's quadratic).",
            "Verify your superposition lab table on this site's Circuits & Measurements Lab tab (Expt 1).",
          ],
        },
        {
          short: "Transient Analysis", title: "Module 2 — Transient Analysis (Time Domain)",
          topics: [
            "Initial conditions: behaviour of L and C at t = 0⁻, 0⁺ and ∞",
            "Source-free RL and RC circuits; time constant",
            "Step (DC) response of RL and RC circuits — the universal formula",
            "Series RLC natural response: over-, critically- and under-damped cases",
            "Damping ratio, natural and damped frequencies",
            "Transients with sinusoidal excitation (qualitative)",
          ],
          eqns: [
            ["Time constants", "τ_RL = L/R ,  τ_RC = R·C"],
            ["Universal formula", "x(t) = x(∞) + [x(0⁺) − x(∞)]·e^(−t/τ)"],
            ["RLC char. eqn", "s² + (R/L)s + 1/(LC) = 0"],
            ["Neper / resonant", "α = R/(2L) ,  ω₀ = 1/√(LC)"],
            ["Damped freq.", "ω_d = √(ω₀² − α²)  (underdamped)"],
            ["Damping cases", "α > ω₀ over ·  α = ω₀ critical ·  α < ω₀ under"],
          ],
          cheats: [
            "i_L and v_C cannot change instantaneously — everything else can jump.",
            "At t = 0⁺ replace L by a current source i_L(0) and C by a voltage source v_C(0); at t = ∞, L → short, C → open.",
            "The universal formula solves 90 % of first-order problems in three substitutions: x(0⁺), x(∞), τ.",
            "For τ with multiple resistors, use the resistance SEEN BY L or C with sources killed.",
          ],
        },
        {
          short: "Laplace / s-domain", title: "Module 3 — Laplace Transform in Circuit Analysis",
          topics: [
            "Laplace transforms of step, ramp, impulse, exponential and sinusoid",
            "Properties: shifting, differentiation, integration; inverse by partial fractions",
            "s-domain equivalents of R, L, C including initial-condition sources",
            "Solving switched circuits completely in the s-domain",
            "Network / transfer functions H(s); poles, zeros and their significance",
            "Initial-value and final-value theorems",
          ],
          eqns: [
            ["Pairs", "u(t) → 1/s ·  t → 1/s² ·  e^(−at) → 1/(s+a) ·  sin ωt → ω/(s²+ω²)"],
            ["Inductor", "Z_L = sL  with series source L·i(0⁻)"],
            ["Capacitor", "Z_C = 1/(sC)  with series source v(0⁻)/s"],
            ["Transfer function", "H(s) = Y(s)/X(s) (zero initial conditions)"],
            ["IVT", "x(0⁺) = lim_(s→∞) s·X(s)"],
            ["FVT", "x(∞) = lim_(s→0) s·X(s)  (poles in LHP only)"],
          ],
          cheats: [
            "Draw the transformed circuit WITH initial-condition sources before writing a single equation.",
            "Sanity-check every answer with IVT/FVT — free error detection in the exam.",
            "Pole location tells the story: real & distinct = overdamped, repeated = critical, complex pair = damped oscillation.",
            "Repeated poles in partial fractions need the derivative formula — practise one every revision session.",
          ],
        },
        {
          short: "Coupled Circuits & Two-Port", title: "Module 4 — Coupled Circuits, Resonance & Two-Port Networks",
          topics: [
            "Mutual inductance, coefficient of coupling, dot convention",
            "Series and parallel connections of coupled coils; conductively-equivalent circuits",
            "Series and parallel resonance; Q factor, bandwidth, half-power frequencies",
            "Two-port parameters: Z, Y, h and transmission (ABCD)",
            "Conditions for reciprocity and symmetry in each parameter set",
            "Interconnection of two-ports (cascade) and parameter conversion",
          ],
          eqns: [
            ["Mutual inductance", "M = k·√(L₁·L₂)"],
            ["Coupled coils (series)", "L_eq = L₁ + L₂ ± 2M  (+ aiding, − opposing)"],
            ["Resonance", "f₀ = 1/(2π√(LC))"],
            ["Quality factor", "Q = ω₀L/R = 1/(ω₀CR) = f₀/BW"],
            ["Z-parameters", "V₁ = z₁₁I₁ + z₁₂I₂ ;  V₂ = z₂₁I₁ + z₂₂I₂"],
            ["h-parameters", "V₁ = h₁₁I₁ + h₁₂V₂ ;  I₂ = h₂₁I₁ + h₂₂V₂"],
            ["Reciprocity / symmetry", "z₁₂ = z₂₁ ;  z₁₁ = z₂₂ ·  (ABCD: AD − BC = 1 ; A = D)"],
            ["Cascade", "[T] = [T_a]·[T_b]"],
          ],
          cheats: [
            "Dot rule: currents both entering (or both leaving) dots → M positive.",
            "Series resonance: Z minimum (= R), current maximum, V_L = V_C = Q·V — remember the Q-multiplication.",
            "Find any parameter set by open-/short-circuiting the correct port in its defining equations — don't memorise 24 formulas.",
            "ABCD parameters cascade by simple matrix multiplication — the reason they exist.",
          ],
        },
      ],
      examTips: [
        "One full Thevenin/Norton problem and one transient with switching appear almost every exam.",
        "Write initial conditions (i_L, v_C at 0⁻/0⁺/∞) as the first step — partial marks live there.",
        "Practise 2–3 two-port conversions; they are formula-plug questions once definitions are clear.",
      ],
      links: [
        ["KTU S3 Circuits & Networks syllabus (KTU Notes)", "https://www.ktunotes.in/ktu-s3-circuits-and-networks-syllabus/"],
        ["Search: Circuits and Networks KTU 2024 notes", search("KTU 2024 scheme Circuits and Networks S3 EEE notes")],
        ["YouTube: KTU 2024 CN Thevenin/Norton", "https://www.youtube.com/watch?v=lIIwL9r4iOA"],
        ["YouTube: series RLC transient response", yt("series RLC transient response overdamped underdamped")],
      ],
    },

    /* ================= DC MACHINES AND TRANSFORMERS ================= */
    {
      id: "dcm", tab: "⚙️ DC Machines", name: "DC Machines and Transformers",
      intro: "First machines course — magnetic circuits, DC generators & motors, then single- and three-phase transformers with testing and performance.",
      modules: [
        {
          short: "Magnetics & DC Generators", title: "Module 1 — Magnetic Circuits & DC Generators",
          topics: [
            "Magnetic circuit analogy: MMF, flux, reluctance; series/parallel magnetic circuits, air-gap",
            "B–H curve; hysteresis and eddy-current (core) losses",
            "DC machine construction: yoke, poles, armature, commutator, brushes",
            "Lap vs wave winding; number of parallel paths",
            "EMF equation of a DC generator",
            "Armature reaction; interpoles and compensating winding; commutation",
            "OCC and load characteristics of separately-excited, shunt, series and compound generators; voltage build-up and critical field resistance",
          ],
          eqns: [
            ["Magnetic Ohm's law", "MMF = N·I = φ·S ,  S = l/(µ₀µᵣA)"],
            ["Hysteresis loss", "P_h = η·B_max^1.6·f·V   (Steinmetz)"],
            ["Eddy loss", "P_e = k·B_max²·f²·t²·V"],
            ["EMF equation", "E = φ·Z·N·P / (60·A)"],
            ["Parallel paths", "lap: A = P ·  wave: A = 2"],
          ],
          cheats: [
            "E ∝ φN — every generator numerical reduces to ratios of flux and speed.",
            "No voltage build-up? Check: residual magnetism, field polarity, field resistance < critical resistance.",
            "Armature reaction distorts and weakens the main field → shifts the MNA in the direction of rotation (generator).",
            "Laminations attack eddy loss (t² term); better steel attacks hysteresis loss.",
          ],
        },
        {
          short: "DC Motors", title: "Module 2 — DC Motors",
          topics: [
            "Back EMF and its significance; power equation",
            "Torque equation; shaft vs gross torque",
            "Characteristics (T–Ia, N–Ia, N–T) of shunt, series and compound motors",
            "Necessity of starters; 3-point and 4-point starters",
            "Speed control: armature-resistance, field-flux and Ward–Leonard methods",
            "Losses and power-flow diagram; efficiency",
            "Testing: brake test, Swinburne's test, Hopkinson's (regenerative) test",
          ],
          eqns: [
            ["Back EMF", "E_b = V − I_a·R_a = φZNP/(60A)"],
            ["Torque", "T = 0.159·φ·Z·I_a·(P/A)   [N·m]"],
            ["Torque–power", "T = 9.55·E_b·I_a / N"],
            ["Speed relation", "N ∝ E_b/φ  →  N₂/N₁ = (E_b2/E_b1)·(φ₁/φ₂)"],
            ["Efficiency", "η = output / (output + losses)"],
            ["Max efficiency", "variable (Cu) loss = constant loss"],
          ],
          cheats: [
            "NEVER start a series motor on no load — φ ≈ 0 makes N dangerously high.",
            "Shunt motor ≈ constant speed; series motor = high starting torque (T ∝ Ia² before saturation). Match to applications.",
            "Swinburne: cheap (no-load) but can't find stray-load loss and is invalid for series motors.",
            "Speed-control directions: extra armature resistance → below base speed; field weakening → above base speed.",
          ],
        },
        {
          short: "1-φ Transformers", title: "Module 3 — Single-Phase Transformers",
          topics: [
            "Working principle; core-type vs shell-type construction",
            "EMF equation; transformation ratio; ideal vs practical transformer",
            "No-load operation and phasor diagram; magnetising current",
            "Equivalent circuit referred to primary/secondary; phasor diagram on load",
            "Voltage regulation (lagging, unity, leading pf)",
            "Losses; efficiency and condition for maximum efficiency; all-day efficiency",
            "OC and SC tests; Sumpner's (back-to-back) test; polarity test; parallel operation basics",
          ],
          eqns: [
            ["EMF equation", "E = 4.44·f·φ_m·N"],
            ["Ratio", "K = E₂/E₁ = N₂/N₁ ;  I₁/I₂ ≈ K"],
            ["Referred values", "R₀₂ = R₂ + K²R₁ ,  X₀₂ = X₂ + K²X₁"],
            ["Regulation", "%Reg = I₂(R₀₂cosφ ± X₀₂sinφ)/E₂ × 100  (+ lag, − lead)"],
            ["Efficiency", "η = xS·cosφ / (xS·cosφ + P_i + x²P_cu) × 100"],
            ["Max-η load", "x = √(P_i / P_cu,FL) ;  at max η: P_cu = P_i"],
            ["All-day η", "η_all-day = kWh output / kWh input (24 h)"],
          ],
          cheats: [
            "OC test on the LV side gives core loss P_i; SC test on the HV side gives full-load Cu loss — memorise which side and why.",
            "Regulation can be ZERO or negative at leading pf — condition tanφ = R₀₂/X₀₂.",
            "Distribution transformers are judged by ALL-DAY efficiency (energy), power transformers by peak efficiency.",
            "In every efficiency numerical, first separate constant loss (P_i) from variable loss (x²·P_cu,FL).",
          ],
        },
        {
          short: "3-φ & Special Transformers", title: "Module 4 — Three-Phase Transformers & Autotransformers",
          topics: [
            "Three-phase transformer connections: Y–Y, Δ–Δ, Y–Δ, Δ–Y; vector groups",
            "Bank of three single-phase units vs single three-phase unit",
            "Open-delta (V–V) operation and capacity",
            "Scott connection (3-φ to 2-φ)",
            "Parallel operation of transformers and load sharing",
            "Autotransformer: saving of copper, advantages/limitations",
            "Tap-changing (off-load and on-load); cooling methods; inrush current (concept)",
          ],
          eqns: [
            ["Y relations", "V_L = √3·V_ph ,  I_L = I_ph"],
            ["Δ relations", "V_L = V_ph ,  I_L = √3·I_ph"],
            ["Open-delta capacity", "S_V–V = 57.7 % of closed-Δ  ( = 1/√3 )"],
            ["Cu saving (auto)", "saving = K × (Cu of 2-winding),  K = LV/HV"],
            ["Load sharing", "S₁/S₂ = Z₂/Z₁ (equal ratios, per-unit)"],
            ["Scott teaser tap", "86.6 % of main winding"],
          ],
          cheats: [
            "Δ–Y for step-up (generation → transmission); Y–Δ for step-down — the Y always on the HV side for cheaper insulation & neutral.",
            "Parallel operation checklist: same voltage ratio, polarity, phase sequence, vector group, and (for good sharing) equal % impedance.",
            "Autotransformer is economical only when K → 1; drawback: no isolation between windings.",
            "Open-delta supplies only 57.7 % — not 66.7 % — of the original bank rating. Frequent trick question.",
          ],
        },
      ],
      examTips: [
        "EMF/torque equation derivations and OC-SC-test numericals are near-certain questions.",
        "Draw the power-flow (loss) diagram in every efficiency answer — it organises the numbers and earns method marks.",
        "Learn the phasor diagram of a loaded transformer in stages: flux → EMFs → currents → drops.",
      ],
      links: [
        ["Search: DC Machines and Transformers KTU 2024 notes", search("KTU 2024 scheme DC Machines and Transformers S3 EEE notes")],
        ["YouTube: DC motor characteristics", yt("DC motor characteristics shunt series compound")],
        ["YouTube: transformer OC SC test", yt("transformer OC SC test equivalent circuit")],
      ],
    },

    /* ================= ANALOG ELECTRONICS ================= */
    {
      id: "anx", tab: "📈 Analog Electronics", name: "Analog Electronics (Theory)",
      intro: "Amplifiers, feedback, oscillators and op-amp systems. Every circuit here has a live, interactive version in this site's Analog Electronics Lab tab — use them together.",
      modules: [
        {
          short: "Biasing & Small-Signal Models", title: "Module 1 — BJT / MOSFET Biasing & Small-Signal Models",
          topics: [
            "DC load line, operating (Q) point and bias stability",
            "Fixed bias, collector-to-base bias, voltage-divider (self) bias",
            "Stability factor S; bias compensation (diode, thermistor)",
            "MOSFET biasing schemes",
            "Small-signal models: rₑ model and hybrid-π; h-parameters",
            "Graphical vs analytical analysis of the CE stage",
          ],
          eqns: [
            ["Load line", "V_CE = V_CC − I_C·(R_C + R_E)"],
            ["Divider bias", "V_B = V_CC·R₂/(R₁+R₂) ;  I_E = (V_B − V_BE)/R_E"],
            ["Stability", "S = (1+β) / (1 + β·R_E/(R_E+R_B))  (divider bias ≈ small)"],
            ["Dynamic resistance", "rₑ = 25 mV / I_E"],
            ["CE gain", "A_v ≈ −(R_C‖R_L)/rₑ  (bypassed R_E)"],
            ["Transconductance", "g_m = I_C / V_T"],
          ],
          cheats: [
            "Voltage-divider bias wins because the Q-point barely depends on β — the exact argument the RC-amp design in the lab uses.",
            "Rule-of-thumb design: V_E ≈ 10 % V_CC, V_CE ≈ 50 % V_CC, V_RC ≈ 40 % V_CC.",
            "Unbypassed R_E drops gain to ≈ −R_C/(rₑ+R_E) but stabilises it — the gain-stability trade.",
            "See Expt 2 in the Analog Electronics Lab tab for the full designed CE amplifier with live frequency response.",
          ],
        },
        {
          short: "Amplifiers & Frequency Response", title: "Module 2 — Amplifiers & Frequency Response",
          topics: [
            "RC-coupled CE amplifier: mid-band gain, input/output impedance",
            "FET common-source amplifier",
            "Multistage amplifiers: cascade, cascode, Darlington pair",
            "Frequency response: low-frequency roll-off (coupling/bypass C), high-frequency roll-off (device capacitances)",
            "Miller effect; bandwidth and gain–bandwidth product",
            "dB gain, half-power (−3 dB) points",
          ],
          eqns: [
            ["Gain in dB", "A(dB) = 20·log₁₀|V_o/V_in|"],
            ["Low cutoff", "f_L = 1/(2π·R_eq·C)  per coupling/bypass network"],
            ["Miller capacitance", "C_in(Miller) = C_f·(1 + |A_v|)"],
            ["Bandwidth", "BW = f_H − f_L"],
            ["CS amp gain", "A_v = −g_m·(R_D‖R_L)"],
            ["Overall cascade", "A_total(dB) = A₁(dB) + A₂(dB) + …"],
          ],
          cheats: [
            "At f_L and f_H the gain is 1/√2 (−3 dB) of mid-band — the bandwidth definition used in both lab experiments.",
            "Big coupling capacitors set the LOW cutoff; tiny junction capacitances (× Miller!) set the HIGH cutoff.",
            "Darlington ≈ β² current gain and huge Z_in; cascode kills Miller effect for wide bandwidth.",
            "Plot gain vs log f, never vs f — replicate the lab's Expt 2/3 graphs by hand once.",
          ],
        },
        {
          short: "Feedback, Oscillators & Power Amps", title: "Module 3 — Feedback Amplifiers, Oscillators & Power Amplifiers",
          topics: [
            "Negative feedback: four topologies and their effect on gain, bandwidth, distortion, Z_in/Z_out",
            "Barkhausen criterion for oscillation",
            "RC oscillators: phase-shift and Wien bridge",
            "LC oscillators: Hartley, Colpitts; crystal oscillator",
            "Power amplifiers: class A, B, AB, C; push-pull; crossover distortion",
            "Efficiency comparison of amplifier classes",
          ],
          eqns: [
            ["Closed-loop gain", "A_f = A / (1 + Aβ)"],
            ["Bandwidth ↑", "BW_f = BW·(1 + Aβ)"],
            ["Barkhausen", "|Aβ| = 1 and ∠Aβ = 0° (360°)"],
            ["Phase-shift osc.", "f₀ = 1/(2π√6·RC),  |A| ≥ 29"],
            ["Wien bridge", "f₀ = 1/(2πRC),  A = 3"],
            ["Colpitts", "f₀ = 1/(2π√(L·C₁C₂/(C₁+C₂)))"],
            ["Hartley", "f₀ = 1/(2π√((L₁+L₂+2M)·C))"],
            ["Class-B efficiency", "η_max = π/4 ≈ 78.5 %"],
          ],
          cheats: [
            "Feedback effects mnemonic: everything a good amplifier wants (flat gain, low distortion, wide BW) improves by the factor (1+Aβ).",
            "Phase-shift needs gain 29 (three RC sections × 180°); Wien needs only 3 — the classic compare-and-contrast question.",
            "Colpitts = Capacitive divider, Hartley = inductive — the C/H initial letters match.",
            "Crossover distortion is a class-B disease; class-AB biasing (small standing current) is the cure.",
            "Interactive versions: Expt 7 (oscillators) in the Analog Electronics Lab tab computes f₀ and draws the output.",
          ],
        },
        {
          short: "Op-Amps & 555", title: "Module 4 — Op-Amp Circuits, Timers & Regulators",
          topics: [
            "Op-amp characteristics: ideal vs practical (CMRR, slew rate, offsets, GBW)",
            "Inverting, non-inverting, follower, summing and difference amplifiers",
            "Integrator and differentiator (practical limits)",
            "Comparators and Schmitt trigger (hysteresis)",
            "Instrumentation amplifier; precision rectifiers; first-order active filters",
            "555 timer: astable and monostable operation",
            "Voltage regulators: zener, series (emitter-follower), IC regulators",
          ],
          eqns: [
            ["Inverting", "A = −R_f/R_in"],
            ["Non-inverting", "A = 1 + R_f/R_in"],
            ["Integrator", "V_o = −(1/RC)·∫V_in dt"],
            ["Differentiator", "V_o = −R_fC·dV_in/dt"],
            ["Schmitt thresholds", "UTP/LTP = ±V_sat·R₂/(R₁+R₂) + V_ref·R₁/(R₁+R₂)"],
            ["555 astable", "t_c = 0.69(R_a+R_b)C ,  t_d = 0.69R_bC"],
            ["555 monostable", "t_p = 1.1·R·C"],
            ["Slew-rate limit", "f_max = SR / (2π·V_peak)"],
            ["CMRR", "CMRR(dB) = 20·log(A_d/A_cm)"],
          ],
          cheats: [
            "Two golden rules solve every ideal op-amp circuit: (1) V₊ = V₋ (virtual short), (2) no current into the inputs.",
            "Virtual GROUND exists only in the inverting configuration — say 'virtual short' for the rest.",
            "555 duty cycle is always > 50 % in the basic astable ((R_a+R_b)/(R_a+2R_b)) — a diode across R_b fixes it.",
            "The Schmitt UTP/LTP formula is exactly the one driving the live graph in Lab Expt 9 — cross-check your hand calculation there.",
          ],
        },
      ],
      examTips: [
        "This subject's numericals mirror the lab designs — the RC-coupled amp, oscillators, Schmitt and 555 pages on this site double as solved examples.",
        "Memorise the four feedback topologies as a 2×2 table (sampled × mixed quantity).",
        "One oscillator derivation (phase-shift or Wien) is asked almost every cycle.",
      ],
      links: [
        ["Interactive companion — Analog Electronics Lab (this site)", "#ae-rc"],
        ["Search: Analog Electronics KTU 2024 S3 EEE notes", search("KTU 2024 scheme Analog Electronics S3 EEE notes")],
        ["YouTube: op-amp circuits KTU", yt("op amp inverting noninverting integrator KTU")],
        ["YouTube: 555 timer astable monostable", yt("555 timer astable monostable working")],
      ],
    },

    /* ================= INTRO TO AI & DATA SCIENCE ================= */
    {
      id: "aids", tab: "🤖 AI & Data Science", name: "Introduction to AI and Data Science",
      intro: "Foundations of intelligent systems and the data-science workflow — search, machine learning basics, data handling and the ethics of AI.",
      modules: [
        {
          short: "AI Foundations & Search", title: "Module 1 — Foundations of AI & Problem Solving",
          topics: [
            "What is AI; history and applications; Turing test",
            "Intelligent agents: PEAS description, agent types, environment properties",
            "Problem formulation and state-space representation",
            "Uninformed search: BFS, DFS, uniform-cost, depth-limited, iterative deepening",
            "Informed search: greedy best-first, A*; heuristic functions, admissibility",
            "Local search: hill climbing and its problems (local maxima, plateau, ridge)",
          ],
          eqns: [
            ["A* evaluation", "f(n) = g(n) + h(n)"],
            ["Admissible heuristic", "h(n) ≤ h*(n)  (never over-estimate)"],
            ["BFS complexity", "time/space O(b^d) — b branching, d depth"],
            ["DFS space", "O(b·m) — m max depth"],
          ],
          cheats: [
            "A* is optimal when h is admissible (tree search) / consistent (graph search) — quote the exact condition.",
            "BFS = complete & optimal (unit costs) but memory-hungry; DFS = cheap memory but incomplete on infinite paths. Classic compare table.",
            "PEAS example (self-driving taxi) is a rehearsed 3-mark answer — prepare one line for each letter.",
            "Hill climbing fixes: random restarts, simulated-annealing idea — one line each.",
          ],
        },
        {
          short: "Machine Learning Basics", title: "Module 2 — Machine Learning Fundamentals",
          topics: [
            "Supervised vs unsupervised vs reinforcement learning",
            "Linear regression; cost function; gradient descent",
            "Classification: k-NN, decision trees (entropy / information gain), Naïve Bayes, logistic regression",
            "Overfitting vs underfitting; bias–variance trade-off",
            "Train/validation/test splits; k-fold cross-validation",
            "Evaluation: confusion matrix, accuracy, precision, recall, F1; RMSE and R² for regression",
          ],
          eqns: [
            ["Hypothesis", "ŷ = θ₀ + θ₁x"],
            ["MSE cost", "J(θ) = (1/2m)·Σ(ŷᵢ − yᵢ)²"],
            ["Gradient descent", "θ_j := θ_j − α·∂J/∂θ_j"],
            ["Sigmoid", "σ(z) = 1/(1 + e^(−z))"],
            ["Entropy", "H = −Σ pᵢ·log₂ pᵢ"],
            ["Bayes theorem", "P(A|B) = P(B|A)·P(A)/P(B)"],
            ["Precision / Recall", "P = TP/(TP+FP) ;  R = TP/(TP+FN)"],
            ["F1 score", "F1 = 2PR/(P+R)"],
          ],
          cheats: [
            "Confusion-matrix mnemonic: Precision = 'of what I Predicted positive, how many were right'; Recall = 'of the Real positives, how many I caught'.",
            "High train accuracy + low test accuracy = overfitting → more data, regularise, simplify model.",
            "Naïve Bayes is 'naïve' because it assumes feature independence — a guaranteed 2-mark definition.",
            "k-NN: small k → noisy (overfit), large k → oversmoothed. Normalise features first (distance-based!).",
          ],
        },
        {
          short: "Data Science Process", title: "Module 3 — Data Science & Data Handling",
          topics: [
            "Data-science lifecycle; structured / unstructured data; data sources",
            "Data pre-processing: cleaning, handling missing values, outlier detection (IQR / z-score)",
            "Feature scaling: normalisation vs standardisation; encoding categorical data",
            "Exploratory data analysis; visualisation: histogram, box plot, scatter, heatmap",
            "Descriptive statistics: mean/median/mode, variance, standard deviation, correlation",
            "Python data ecosystem overview: NumPy, pandas, matplotlib",
          ],
          eqns: [
            ["Standardisation", "z = (x − µ)/σ"],
            ["Min–max scaling", "x′ = (x − min)/(max − min)"],
            ["IQR fences", "outlier if x < Q₁ − 1.5·IQR or x > Q₃ + 1.5·IQR"],
            ["Variance", "σ² = Σ(xᵢ − µ)²/n"],
            ["Pearson r", "r = Σ(x−x̄)(y−ȳ) / √(Σ(x−x̄)²·Σ(y−ȳ)²)"],
          ],
          cheats: [
            "Standardise for algorithms assuming Gaussian-ish data (SVM, k-means, PCA); min–max when you need a bounded [0,1] range.",
            "Box plot reads five numbers at a glance: min, Q₁, median, Q₃, max — draw one in the answer.",
            "Correlation ≠ causation — cite one example (ice-cream sales vs drowning).",
            "Missing-value strategies ladder: drop → impute mean/median → model-based. State trade-offs.",
          ],
        },
        {
          short: "Applications & Ethics", title: "Module 4 — Applications, Clustering & Responsible AI",
          topics: [
            "Unsupervised learning: k-means clustering; choosing k (elbow idea)",
            "Recommender systems and similarity measures (concept)",
            "Application overviews: NLP, computer vision, AI in smart grids / power systems",
            "AI ethics: bias & fairness, privacy, transparency / explainability, accountability",
            "Responsible-AI practices and societal impact; future trends",
          ],
          eqns: [
            ["k-means objective", "min Σ_clusters Σ_points ‖x − µ_c‖²"],
            ["Cosine similarity", "cos θ = (A·B)/(‖A‖·‖B‖)"],
            ["Euclidean distance", "d = √Σ(xᵢ − yᵢ)²"],
          ],
          cheats: [
            "k-means steps (assign → update → repeat) as a 4-line algorithm is a standard short answer.",
            "Bias enters through data, labels and deployment — give one example of each.",
            "For 'AI in EEE' answers, cite load forecasting, fault detection and smart-grid optimisation — branch-relevant examples score.",
          ],
        },
      ],
      examTips: [
        "Definitions dominate this paper — maintain a glossary (agent, heuristic, overfitting, precision…).",
        "Practise one numerical each on entropy/information gain, Bayes, and evaluation metrics from a confusion matrix.",
        "Diagrams (agent loop, DS lifecycle, confusion matrix) earn quick marks — rehearse drawing them in under a minute.",
      ],
      links: [
        ["Search: Introduction to AI and Data Science KTU 2024 notes", search("KTU 2024 scheme Introduction to Artificial Intelligence and Data Science S3 notes")],
        ["YouTube: A* search algorithm", yt("A star search algorithm example")],
        ["YouTube: confusion matrix precision recall", yt("confusion matrix precision recall F1 explained")],
      ],
    },

    /* ================= ECONOMICS FOR ENGINEERS ================= */
    {
      id: "eco", tab: "💰 Economics", name: "Economics for Engineers",
      intro: "Micro and macro foundations plus the engineering-economics toolkit: time value of money, depreciation and break-even decisions.",
      modules: [
        {
          short: "Micro-economics Basics", title: "Module 1 — Basic Micro-Economic Concepts",
          topics: [
            "Scarcity, choice and the basic economic problems; PPC",
            "Utility; law of diminishing marginal utility",
            "Demand and supply laws; market equilibrium; movements vs shifts",
            "Elasticity of demand: price, income, cross; measurement",
            "Production function; short run vs long run; returns to scale",
            "Cost concepts: fixed, variable, marginal, average, opportunity cost; economies of scale; market structures overview",
          ],
          eqns: [
            ["Price elasticity", "E_p = (ΔQ/Q)/(ΔP/P)"],
            ["Total cost", "TC = TFC + TVC"],
            ["Marginal cost", "MC = ΔTC/ΔQ"],
            ["Average cost", "AC = TC/Q"],
          ],
          cheats: [
            "Elasticity answers: |E|>1 elastic, <1 inelastic, =1 unitary — always interpret the number, not just compute it.",
            "Movement along the curve = own-price change; SHIFT of the curve = any other factor. Frequent 3-mark trap.",
            "MC cuts AC at AC's minimum — draw the U-curves once and remember the picture.",
          ],
        },
        {
          short: "Macro-economics & Money", title: "Module 2 — National Income, Money & Policy",
          topics: [
            "National income concepts: GDP, GNP, NNP, per-capita income; measurement methods (product, income, expenditure)",
            "Inflation: types, causes, effects; deflation; measures (CPI/WPI idea)",
            "Money: functions; banking system and credit creation; central-bank functions",
            "Monetary and fiscal policy instruments",
            "Business cycles; taxation basics (direct vs indirect, GST idea)",
            "International trade: balance of payments, exchange rates (concept)",
          ],
          eqns: [
            ["GNP", "GNP = GDP + net factor income from abroad"],
            ["NNP", "NNP = GNP − depreciation"],
            ["Real vs nominal", "Real GDP = Nominal GDP / price index × 100"],
          ],
          cheats: [
            "Keep the national-income aggregates as a one-line chain: GDP → GNP → NNP → NI.",
            "Cost-push vs demand-pull inflation — one cause + one remedy each is a complete short answer.",
            "Repo rate ↑ → borrowing costly → demand cools → inflation eases: rehearse the transmission chain.",
          ],
        },
        {
          short: "Time Value of Money", title: "Module 3 — Engineering Economics: Time Value of Money",
          topics: [
            "Why money has time value; cash-flow diagrams",
            "Simple vs compound interest; nominal vs effective rates",
            "Single-payment factors (P↔F); annuity factors (A↔P, A↔F); gradient (idea)",
            "Present-worth, future-worth and annual-equivalent comparison of alternatives",
            "Rate of return and payback period (concepts)",
          ],
          eqns: [
            ["Compound amount", "F = P·(1 + i)ⁿ"],
            ["Present worth", "P = F/(1 + i)ⁿ"],
            ["A from P (capital recovery)", "A = P·[i(1+i)ⁿ]/[(1+i)ⁿ − 1]"],
            ["A from F (sinking fund)", "A = F·i/[(1+i)ⁿ − 1]"],
            ["Effective rate", "i_eff = (1 + r/m)^m − 1"],
          ],
          cheats: [
            "Draw the cash-flow diagram FIRST — up arrows receipts, down arrows payments; most errors are sign errors.",
            "The four factors are two reciprocal pairs: (F/P ↔ P/F) and (A/P ↔ P/A) — memorise two, invert for the rest.",
            "Compare alternatives over the SAME period (repeat cycles or use annual equivalent).",
          ],
        },
        {
          short: "Depreciation & Break-even", title: "Module 4 — Depreciation, Break-Even & Project Evaluation",
          topics: [
            "Depreciation: causes; straight-line, declining-balance, sum-of-years-digits, sinking-fund methods",
            "Break-even analysis: contribution, BEP, margin of safety; P/V ratio",
            "Make-or-buy decisions",
            "Benefit–cost ratio for public projects; introduction to project appraisal",
          ],
          eqns: [
            ["Straight line", "D = (C − S)/n"],
            ["Declining balance", "D_k = C·(1−d)^(k−1)·d ;  book value B_k = C(1−d)^k"],
            ["Break-even point", "BEP (units) = F / (s − v)"],
            ["Contribution", "contribution/unit = s − v"],
            ["Margin of safety", "MoS = (actual sales − BEP sales)/actual sales"],
            ["Benefit–cost", "B/C = PW(benefits) / PW(costs)  (accept if ≥ 1)"],
          ],
          cheats: [
            "Straight line = equal yearly amounts; declining balance = biggest depreciation first — pick by the asset's usage pattern.",
            "One labelled break-even chart (cost & revenue lines crossing) can carry a whole 14-mark answer.",
            "Below BEP every unit loses (s − v) is untrue — it loses its share of F; be precise in viva-type questions.",
          ],
        },
      ],
      examTips: [
        "Numericals cluster in Modules 3–4 (interest factors, depreciation, BEP) — perfect those three formula families.",
        "Definitions with one example each (elasticity, inflation types, GDP vs GNP) cover most of Part A.",
      ],
      links: [
        ["Search: Economics for Engineers KTU 2024 notes", search("KTU 2024 scheme Economics for Engineers notes")],
        ["YouTube: engineering economics time value of money", yt("engineering economics time value of money problems")],
        ["YouTube: break even analysis problems", yt("break even analysis solved problems")],
      ],
    },

    /* ================= ENGINEERING ETHICS & SUSTAINABLE DEVELOPMENT ================= */
    {
      id: "eth", tab: "🌱 Ethics & SD", name: "Engineering Ethics and Sustainable Development",
      intro: "Values, professional responsibility and the sustainability framework every engineer is examined on — and expected to practise.",
      modules: [
        {
          short: "Human Values & Moral Development", title: "Module 1 — Human Values & Ethical Reasoning",
          topics: [
            "Morals, values and ethics; integrity, honesty, courage, empathy, work ethic",
            "Civic virtue, respect for others, self-confidence, spirituality (as listed values)",
            "Kohlberg's theory of moral development (pre-conventional, conventional, post-conventional)",
            "Gilligan's ethics-of-care perspective and the Kohlberg–Gilligan contrast",
            "Moral dilemmas and moral autonomy; consensus vs controversy",
          ],
          eqns: [
            ["Kohlberg levels", "Pre-conventional → Conventional → Post-conventional (2 stages each)"],
            ["Gilligan stages", "Selfishness → Goodness (care for others) → Care for self AND others"],
          ],
          cheats: [
            "Kohlberg = justice/rules reasoning; Gilligan = care/relationships reasoning — one sentence each wins the compare question.",
            "Keep a personal example ready for 'moral dilemma' — the marks are for identifying the CONFLICTING obligations.",
            "Values questions are definition + example; write both every time.",
          ],
        },
        {
          short: "Professional Ethics", title: "Module 2 — Engineering as a Profession: Ethics, Safety & Rights",
          topics: [
            "Engineering as social experimentation; engineers as responsible experimenters",
            "Codes of ethics: roles, advantages and limitations",
            "Safety and risk: assessment, acceptable risk, risk–benefit analysis",
            "Collegiality and loyalty; respect for authority vs whistle-blowing",
            "Professional rights, employee rights; confidentiality and conflicts of interest",
            "IPR basics (patent, copyright, trademark); case studies: Bhopal, Challenger, Chernobyl",
          ],
          eqns: [
            ["Risk", "risk = probability of occurrence × magnitude of harm"],
            ["Acceptability", "acceptable risk ⇔ informed consent + justly distributed"],
          ],
          cheats: [
            "'Engineering as experimentation' answer skeleton: partial knowledge → monitoring → informed consent → responsibility.",
            "Whistle-blowing justification checklist (Davis/DeGeorge style): serious harm, exhausted internal channels, documented evidence.",
            "For any case study: 2 lines of facts, 2 causes, 2 lessons — a reusable template.",
          ],
        },
        {
          short: "Sustainability Fundamentals", title: "Module 3 — Sustainable Development: Concepts & Goals",
          topics: [
            "Sustainability definition (Brundtland) and the three pillars (environment, economy, society)",
            "UN Sustainable Development Goals (17 SDGs) — overview and grouping",
            "Global environmental issues: climate change, resource depletion, pollution, biodiversity loss",
            "Carrying capacity and ecological footprint",
            "Environment–development trade-offs; inter- and intra-generational equity",
          ],
          eqns: [
            ["Brundtland", "development meeting present needs without compromising future generations' ability to meet theirs"],
            ["Footprint idea", "ecological footprint vs biocapacity → overshoot"],
          ],
          cheats: [
            "Group the 17 SDGs as People / Planet / Prosperity / Peace / Partnership (5 Ps) instead of memorising all seventeen in order.",
            "Quote the Brundtland definition verbatim — it is asked as-is for 2–3 marks.",
            "Have one Kerala/India example per issue (flooding, e-waste, sand mining) — local examples lift answers.",
          ],
        },
        {
          short: "Sustainable Engineering Practice", title: "Module 4 — Sustainable Engineering in Practice",
          topics: [
            "Clean and renewable energy technologies; energy efficiency and management",
            "Green buildings and ratings (concept); sustainable transport",
            "Circular economy, zero waste, 3R/5R hierarchy",
            "Life-cycle analysis (LCA) — stages and use",
            "Environmental legislation overview and EIA (concept); appropriate technology",
            "Engineer's role in achieving the SDGs",
          ],
          eqns: [
            ["Waste hierarchy", "Refuse → Reduce → Reuse → Repurpose → Recycle"],
            ["LCA stages", "raw material → manufacture → use → end-of-life (cradle to grave)"],
          ],
          cheats: [
            "LCA answers score with a labelled cradle-to-grave diagram plus one product example (e.g., an EV battery).",
            "Circular vs linear economy in one line: 'take-make-dispose' vs 'reduce-reuse-regenerate loops'.",
            "Tie every technology answer back to a numbered SDG (e.g., solar → SDG 7) — examiners look for the mapping.",
          ],
        },
      ],
      examTips: [
        "This paper rewards structured writing: definition → explanation → example → diagram where possible.",
        "Prepare the three classic case studies and two Indian environmental case examples in template form.",
      ],
      links: [
        ["Search: Engineering Ethics and Sustainable Development KTU 2024 notes", search("KTU 2024 scheme Engineering Ethics and Sustainable Development notes")],
        ["UN SDGs — official site", "https://sdgs.un.org/goals"],
        ["YouTube: engineering ethics case studies", yt("engineering ethics case studies Challenger Bhopal")],
      ],
    },
  ];

  /* ---------------- renderer ---------------- */
  const esc = s => s; // content is authored, not user input

  function moduleArticle(sub, m, i) {
    return `
    <article class="exp" id="${sub.id}-m${i + 1}">
      <div class="exp-head">
        <span class="kicker">${esc(sub.name)} · S3 EEE · KTU 2024 Scheme</span>
        <h2>${esc(m.title)}</h2>
      </div>
      <div class="card"><h3>Key Topics</h3>
        <ul>${m.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      <div class="card"><h3>Important Equations &amp; Relations</h3>
        ${m.eqns.map(e => `<div class="formula"><b class="eq-k">${esc(e[0])}:</b> ${esc(e[1])}</div>`).join("")}
      </div>
      <div class="card"><h3>Study Cheats — score faster</h3>
        <ul>${m.cheats.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
      </div>
    </article>`;
  }

  function cheatArticle(sub) {
    const allEq = sub.modules.map((m, i) =>
      `<p style="margin:12px 0 4px"><strong>Module ${i + 1} — ${esc(m.short)}</strong></p>` +
      m.eqns.map(e => `<div class="formula"><b class="eq-k">${esc(e[0])}:</b> ${esc(e[1])}</div>`).join("")
    ).join("");
    const links = (sub.links || []).concat(GLOBAL_LINKS);
    return `
    <article class="exp" id="${sub.id}-cheat">
      <div class="exp-head">
        <span class="kicker">${esc(sub.name)} · S3 EEE · KTU 2024 Scheme</span>
        <h2>Cheat Sheet, Question Papers &amp; Resources</h2>
      </div>
      <div class="card"><h3>About this subject</h3>
        <p>${esc(sub.intro)}</p>
        <p class="note">Module grouping follows the KTU 2024-scheme outline (4 modules per course). Always cross-check the
        official syllabus PDF from <strong>ktu.edu.in</strong> — the links below take you straight there.</p>
      </div>
      <div class="card"><h3>Exam Strategy</h3>
        <ul>${(sub.examTips || []).map(t => `<li>${esc(t)}</li>`).join("")}
          <li>Solve at least the two most recent question papers under timed conditions — links below.</li>
        </ul>
      </div>
      <div class="card"><h3>All Key Equations — one-page revision</h3>
        ${allEq}
      </div>
      <div class="card"><h3>Question Papers, Notes &amp; Reference Links</h3>
        <div class="links-grid">
          ${links.map(l => {
            const internal = l[1].startsWith("#");
            return `<a class="res-link" href="${l[1]}" ${internal ? "" : 'target="_blank" rel="noopener"'}>${esc(l[0])} <span>${internal ? "→" : "↗"}</span></a>`;
          }).join("")}
        </div>
      </div>
    </article>`;
  }

  const tabsBar = document.querySelector(".lab-tabs");
  const wrap = document.querySelector(".wrap");
  const main = document.querySelector("main");
  window.STUDY_LABS = SUBJECTS.map(s => s.id);

  SUBJECTS.forEach(sub => {
    // header tab
    const b = document.createElement("button");
    b.id = "tab-" + sub.id;
    b.setAttribute("role", "tab");
    b.textContent = "";
    b.innerHTML = sub.tab;
    tabsBar.appendChild(b);
    // sidebar navigation
    const nav = document.createElement("nav");
    nav.className = "exp-nav";
    nav.id = "nav-" + sub.id;
    nav.style.display = "none";
    nav.innerHTML = `<h2>Modules</h2>` +
      sub.modules.map((m, i) => `<button data-exp="${sub.id}-m${i + 1}"><span class="n">M${i + 1}</span>${esc(m.short)}</button>`).join("") +
      `<button data-exp="${sub.id}-cheat"><span class="n">★</span>Cheat Sheet &amp; Question Papers</button>`;
    wrap.insertBefore(nav, main);
    // articles
    sub.modules.forEach((m, i) => main.insertAdjacentHTML("beforeend", moduleArticle(sub, m, i)));
    main.insertAdjacentHTML("beforeend", cheatArticle(sub));
  });
})();
