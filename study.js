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

  /* ---------------- module theory & explanations (keyed by article id) ---------------- */
  const THEORY = {
    "m3-m1": [
      "Any periodic signal — a square wave from a 555 timer, a rectified sine, a distorted mains waveform — can be written as a sum of pure sines and cosines whose frequencies are integer multiples of the fundamental. That is the whole idea of the Fourier series: complicated periodic behaviour is just harmonics stacked on top of each other, and the coefficients a₀, aₙ, bₙ tell you exactly how much of each harmonic is present.",
      "The coefficients come from orthogonality: over one full period, sin(mx) and cos(nx) average to zero against each other unless m = n. Multiplying f(x) by cos(nx) and integrating therefore 'filters out' the single coefficient aₙ. Symmetry is the practical shortcut — an even function contains only cosines, an odd one only sines — and half-range expansions let you represent a function defined on (0, L) by deliberately extending it as even or odd.",
      "Convergence has one famous quirk: at a jump discontinuity the series settles at the midpoint of the jump, and near the jump the partial sums always overshoot by about 9 % (the Gibbs phenomenon) no matter how many terms you take. Parseval's identity connects the coefficients to the signal's power — which is why the series matters to electrical engineers: harmonic content IS power distribution.",
    ],
    "m3-m2": [
      "A non-periodic signal — a single pulse, a switching transient — has no fundamental frequency, so instead of discrete harmonics it needs a continuous spectrum. Letting the period of a Fourier series grow to infinity turns the coefficient sums into integrals, and the result is the Fourier transform: F(s) describes how much of every frequency the signal contains.",
      "The transform pair is symmetric — a function and its spectrum swap roles under inversion — and this symmetry produces the reciprocal-spreading rule: compressing a signal in time stretches its spectrum, and vice versa. A narrow pulse needs a wide band of frequencies; that single fact underlies bandwidth requirements in communication and the rise-time limits of amplifiers.",
      "Sine and cosine transforms are the half-line versions used for functions defined only for x > 0, chosen by the symmetry of the extension exactly as in half-range series. The handful of standard transforms (decaying exponential, rectangular pulse, Gaussian) plus the shifting and scaling properties solve nearly every exam problem without fresh integration.",
    ],
    "m3-m3": [
      "A complex function f(z) = u + iv is 'analytic' when it has a derivative that does not depend on the direction from which you approach the point — a much stronger condition than real differentiability. Forcing the derivative along the real axis to equal the derivative along the imaginary axis produces the Cauchy–Riemann equations, the workhorse test of this module.",
      "Analyticity has a beautiful consequence: both u and v automatically satisfy Laplace's equation, so every analytic function is a ready-made pair of harmonic functions — which is why complex analysis solves electrostatics and fluid-flow problems. Given one of the pair, the Milne–Thomson method reconstructs the whole analytic function directly.",
      "Geometrically an analytic map is conformal: it preserves the angle between intersecting curves wherever f′(z) ≠ 0, merely rotating by arg f′ and scaling by |f′|. The bilinear (Möbius) transformation is the most examined map — it sends circles and lines to circles and lines, and three chosen point-pairs pin it down completely through the cross-ratio.",
    ],
    "m3-m4": [
      "Integration in the complex plane happens along curves, and the striking result is that for analytic functions the path does not matter: around any closed contour the integral is zero (Cauchy's theorem). Poke a hole in the region — a singularity — and the integral around it stops being zero but becomes something computable.",
      "Cauchy's integral formula is the first payoff: the value of an analytic function anywhere inside a contour is fixed entirely by its values on the contour. Differentiating the formula gives every derivative the same way, which in turn generates the Taylor series. When the function has a singularity, the Taylor series generalises to the Laurent series with negative powers, valid in an annulus around the trouble spot.",
      "The coefficient of 1/(z−a) in the Laurent series — the residue — is the only term that survives contour integration, so every closed-contour integral collapses to 2πi times the sum of enclosed residues. Classify the singularity, compute its residue with the standard limit or p/q′ formulas, and integrals that look impossible fall out in two lines.",
    ],
    "cn-m1": [
      "Mesh and node analysis are the systematic engines of circuit theory: choose currents around loops or voltages at nodes, apply Kirchhoff's laws, and any linear circuit reduces to simultaneous equations. Supermeshes and supernodes are simply the bookkeeping trick for sources that sit between two loops or two nodes.",
      "The network theorems are shortcuts that exploit linearity. Superposition says each independent source contributes independently, so you may analyse them one at a time with the others killed. Thevenin and Norton go further: an entire two-terminal network, however messy, behaves at its terminals exactly like one source plus one resistance — which is why the lab experiment on this site measures V_oc and I_sc and nothing else.",
      "Maximum power transfer follows directly from the Thevenin picture: with the source fixed, the load receives the most power when it mirrors the source resistance, at the price of 50 % efficiency. Dependent sources change the mechanics (they must stay alive when finding R_th) but not the theorems themselves.",
    ],
    "cn-m2": [
      "Inductors and capacitors store energy, and stored energy cannot change instantaneously — so inductor current and capacitor voltage are continuous across a switching instant. Everything in transient analysis grows from that one continuity rule: it fixes the initial conditions at t = 0⁺, while the DC steady state (L a short, C an open) fixes the final values.",
      "A single storage element gives a first-order circuit whose response is always an exponential with time constant τ = L/R or RC. Since the answer is known in shape, you never solve the differential equation in practice: find the initial value, the final value, and τ, and the universal formula writes the solution for you.",
      "Two storage elements make the circuit second-order and introduce competition between energy sloshing (ω₀) and energy dissipation (α). Their ratio decides the personality of the response: sluggish overdamped decay, the fastest non-oscillatory critical case, or underdamped ringing at ω_d — the behaviour you can sweep continuously with the R slider below.",
    ],
    "cn-m3": [
      "The Laplace transform turns calculus into algebra: differentiation becomes multiplication by s, so the integro-differential equations of a switched circuit become polynomial equations. Better still, the transform absorbs initial conditions automatically — an inductor becomes sL in series with a source Li(0⁻), a capacitor 1/sC in series with v(0⁻)/s — so one s-domain circuit contains the entire problem.",
      "Solving means ordinary circuit analysis in s, followed by partial fractions and a table look-up to return to time. The structure of the answer is visible before inverting: each pole of the s-domain expression contributes one term to the time response — real poles give exponentials, complex pairs give damped sinusoids.",
      "That is why the transfer function H(s) and its pole–zero map summarise a network's dynamics completely, and why the initial- and final-value theorems are such good sanity checks: they read x(0⁺) and x(∞) straight off the s-domain answer without inverting anything.",
    ],
    "cn-m4": [
      "When two coils share flux, current in one induces voltage in the other through the mutual inductance M; the dot convention is just a sign bookkeeping system for whether that induced voltage aids or opposes. Coupled coils in series therefore add as L₁ + L₂ ± 2M — the ± is entirely the dots' doing.",
      "Resonance is the frequency at which an inductor's rising reactance exactly cancels a capacitor's falling one. In a series circuit the impedance collapses to plain R, current peaks, and the voltages across L and C individually soar to Q times the supply — small R means high Q, a tall narrow response, and a bandwidth f₀/Q. The interactive below lets you watch R reshape that curve.",
      "Two-port parameters answer a practical question: how does a black box relate its input pair (V₁, I₁) to its output pair (V₂, I₂)? Z, Y, h and ABCD are four bookkeeping choices for the same information, each convenient somewhere — h for transistors, ABCD for cascaded transmission stages, where chaining is literal matrix multiplication.",
    ],
    "dcm-m1": [
      "A magnetic circuit is Ohm's law with new names: MMF (NI) drives flux φ against reluctance S, and series/parallel reluctances combine like resistances. The analogy breaks only where iron saturates and where the core dissipates energy — hysteresis loss from repeatedly re-magnetising the material and eddy-current loss from voltages induced inside the core itself, tamed by laminations.",
      "A DC generator is a rotating application of Faraday's law: conductors moving through the pole flux generate an alternating EMF that the commutator mechanically rectifies. Counting conductors, paths, poles and speed gives the EMF equation E = φZNP/60A, with the winding style (lap or wave) deciding the number of parallel paths A.",
      "Loading the machine distorts its own field: armature current produces a cross magnetising field (armature reaction) that shifts the neutral axis and weakens the flux, treated with interpoles and compensating windings. A self-excited generator has a bootstrap problem — it builds voltage only if residual flux exists, the field aids it, and the field resistance is below the critical value.",
    ],
    "dcm-m2": [
      "A motor is the same machine run backwards, and the back EMF is the concept that makes it self-regulating: as the rotor speeds up, E_b rises and throttles the armature current to exactly what the load torque demands. At standstill E_b = 0, which is why a starter must insert resistance — otherwise the armature, only fractions of an ohm, draws a destructive current.",
      "The two working equations, T ∝ φI_a and N ∝ E_b/φ, generate every characteristic. A shunt motor's constant flux gives near-constant speed and torque linear in current; a series motor's flux grows with its own current, giving torque proportional to current squared — brutal starting torque — and a speed that skyrockets if the load is removed.",
      "Performance is measured by chasing the losses. Swinburne's no-load test finds the constant losses cheaply; a brake test measures output directly; Hopkinson's back-to-back test loads two machines against each other so the supply provides only the losses. Efficiency peaks where the variable copper loss equals the constant losses.",
    ],
    "dcm-m3": [
      "A transformer is two coils sharing an alternating flux: the same φ_m threading N turns generates 4.44·f·φ_m·N volts per winding, so voltages sit in the turns ratio and (by power balance) currents in the inverse ratio. It works only on AC — no changing flux, no induced EMF.",
      "The practical transformer adds imperfections you can measure: winding resistance and leakage reactance (series elements) and core loss plus magnetising current (shunt elements). The open-circuit test excites the core and reveals the shunt branch; the short-circuit test drives rated current through the windings and reveals the series branch — two cheap tests, one complete equivalent circuit.",
      "From that circuit come the two performance numbers. Regulation is the drop I(Rcosφ ± Xsinφ) the load sees — worse for lagging loads, even negative for leading ones. Efficiency trades a fixed core loss against a copper loss growing as load², peaking exactly where the two are equal; distribution transformers, loaded lightly most of the day, are therefore judged on all-day (energy) efficiency instead.",
    ],
    "dcm-m4": [
      "Three-phase power needs three-phase transformation, done either by a bank of three single-phase units or one three-legged core. The winding connections (Y or Δ on each side) set the line-voltage ratio and the phase shift between primary and secondary — captured in the vector group — and decide practical matters: a Y gives a neutral and easier insulation for HV; a Δ traps triplen harmonics.",
      "The special connections are exam favourites because they are counter-intuitive. Lose one transformer of a Δ bank and the remaining two in open-delta still supply three-phase power, but only 1/√3 (57.7 %) of the original rating. The Scott connection tricks two single-phase transformers, one tapped at 86.6 %, into converting three-phase to two-phase.",
      "Transformers share a busbar happily only if they agree: equal voltage ratios and vector groups (else circulating currents), and equal per-unit impedances if the load is to divide in proportion to ratings. The autotransformer saves copper by making part of one winding common to both sides — most economical when the ratio is near unity, at the cost of losing isolation.",
    ],
    "anx-m1": [
      "A transistor amplifies only if its DC operating point is planted in the active region, so biasing comes before any signal. The load line drawn on the output characteristics shows every operating point the supply and resistors allow; the bias network chooses one point — the Q-point — on it, ideally mid-line so the output can swing symmetrically before clipping.",
      "The enemy is β: it varies wildly between devices and with temperature. Fixed bias makes I_C proportional to β and is therefore unusable; the voltage-divider circuit fixes the base voltage and lets an emitter resistor set I_E ≈ (V_B − 0.7)/R_E, almost independent of β — the reason it is the default and the design used in this site's RC-amplifier lab experiment.",
      "For signals, the transistor is replaced by a small-signal model: the rₑ model (rₑ = 25 mV/I_E) or the hybrid-π with g_m = I_C/V_T. These models turn amplifier analysis into resistor arithmetic — gain ≈ −R_C/rₑ for the bypassed CE stage — and connect the DC design directly to the AC performance.",
    ],
    "anx-m2": [
      "The RC-coupled amplifier earns its name from the coupling capacitors that pass signal while blocking DC, letting stages cascade without disturbing each other's bias. Mid-band, capacitors are invisible and the gain is set by the collector load against rₑ; the trade for the FET version is lower gain but near-infinite input impedance.",
      "The frequency response droops at both ends for different reasons. At low frequencies the coupling and bypass capacitors' reactance grows and steals signal — each RC pair contributes a cutoff near 1/2πRC. At high frequencies tiny device capacitances shunt the signal, made vicious by the Miller effect, which multiplies the feedback capacitance by the stage gain.",
      "Bandwidth is read between the two −3 dB (half-power) points, exactly as measured in lab Expt 2/3. Multistage tricks manage the trade-offs: the Darlington pair multiplies current gain, the cascode neutralises Miller capacitance for wide bandwidth, and cascading stages multiplies gains (adds dBs) while shrinking overall bandwidth.",
    ],
    "anx-m3": [
      "Negative feedback returns a fraction β of the output to oppose the input, and everything it does follows from one factor: 1 + Aβ. Gain drops by it — but so do distortion, noise and the effect of parameter drift, while bandwidth stretches by the same factor. Trading surplus gain for predictability is the central bargain of analog design.",
      "Turn the phase around and the same loop oscillates: the Barkhausen criterion asks for loop gain of exactly one with zero net phase shift. RC oscillators build the phase from resistor–capacitor sections (three 60° sections in the phase-shift oscillator, a balanced bridge in the Wien), while LC and crystal oscillators resonate a tank — the crystal's absurdly high Q giving clock-grade stability.",
      "Power amplifiers stop being 'small-signal': the output swings across the whole supply and efficiency matters. Class A conducts always (clean, ≤ 25 % practical efficiency), class B splits the wave between push-pull halves (78.5 % ideal, but crossover distortion at the handoff), and class AB biases just enough to smooth the handoff — the standard audio compromise.",
    ],
    "anx-m4": [
      "The op-amp is feedback's perfect partner: gain so high that with negative feedback the two inputs are forced equal (virtual short) while drawing no current. Those two 'golden rules' reduce the inverting, non-inverting, summing and difference amplifiers to two-resistor arithmetic — and the same rules make R and C in the feedback path perform calculus, giving the integrator and differentiator.",
      "Remove negative feedback and the op-amp becomes a comparator; add positive feedback and it becomes a Schmitt trigger, whose two thresholds (UTP/LTP) create hysteresis that cleans noisy signals into crisp edges. Practical limits — CMRR, offsets, finite gain–bandwidth and above all slew rate — decide how fast and how large the output can actually be.",
      "The 555 timer packages two comparators, a flip-flop and a discharge switch around a ⅓/⅔·V_CC divider: let a capacitor shuttle between the thresholds and you get the astable clock (t = 0.69RC segments) or the one-shot monostable pulse (t_p = 1.1RC). Every one of these circuits runs live in the Analog Electronics Lab tab of this site.",
    ],
    "aids-m1": [
      "AI frames problems as agents acting in environments: the agent perceives, decides, acts, and is judged by a performance measure — the PEAS description makes this concrete for any application. Environment properties (observable? deterministic? static?) predict how hard the problem will be.",
      "Classical problem solving is search through a state space. Uninformed strategies differ only in which frontier node they expand next: BFS sweeps level by level (complete, optimal for unit costs, but exponential memory), DFS dives deep (cheap memory, no optimality), and iterative deepening cleverly combines them.",
      "Informed search adds domain knowledge as a heuristic h(n) estimating the remaining cost. A* expands the node minimising f = g + h and is provably optimal when h never over-estimates (admissibility). Local search like hill climbing abandons paths altogether and just improves a current state — fast, memory-free, and prone to getting stuck on local maxima.",
    ],
    "aids-m2": [
      "Machine learning replaces hand-written rules with functions fitted to data. In supervised learning the data comes labelled: regression fits continuous outputs, classification discrete ones. The fit is defined by a cost function — mean squared error for regression — and gradient descent walks the parameters downhill until the cost stops falling.",
      "Each classifier embodies one idea. k-NN votes among the nearest training points; decision trees split on the feature giving the largest information gain (entropy drop); Naïve Bayes multiplies per-feature probabilities under an independence assumption; logistic regression squeezes a linear score through a sigmoid to output probability.",
      "The honest part is evaluation. A model can memorise training data (overfit) or be too simple to learn it (underfit) — the bias–variance trade-off — so performance is always measured on data the model has never seen, via train/test splits or cross-validation, and reported with metrics that match the problem: precision when false alarms are costly, recall when misses are.",
    ],
    "aids-m3": [
      "Real data arrives dirty: missing entries, typos, impossible values, wild outliers. The data-science lifecycle therefore spends most of its effort before modelling — cleaning, imputing, and flagging outliers with rules like the 1.5 × IQR fences — because a model can only be as good as the table it is fed.",
      "Features measured on different scales distort any algorithm that computes distances or gradients, so numeric columns are standardised (z-scores) or min–max scaled, and categorical columns encoded into numbers. Exploratory data analysis then interrogates the data visually — histograms for shape, box plots for spread and outliers, scatter plots and correlation for relationships — before a single model is trained.",
      "Descriptive statistics compress a column into a few honest numbers: centre (mean vs the outlier-resistant median), spread (σ, IQR) and association (Pearson's r). The Python stack — NumPy arrays, pandas DataFrames, matplotlib charts — is the standard vehicle for all of it.",
    ],
    "aids-m4": [
      "Without labels, learning becomes pattern discovery. k-means is the canonical example: pick k centres, assign every point to its nearest centre, move each centre to its cluster's mean, repeat — a two-step loop that minimises within-cluster distance. Similarity measures are the quiet foundation: Euclidean distance for positions, cosine similarity for directions (documents, ratings, recommendations).",
      "The application landscape — language (NLP), vision, recommenders — matters to an EEE student mostly through its power-system uses: load forecasting, fault classification, predictive maintenance and smart-grid optimisation are all straight applications of the Module 2 toolkit.",
      "Responsible AI is now examinable material: models inherit bias from their training data, leak privacy, and can be un-explainable black boxes. The remedies — representative data, fairness metrics, explainability tools, human accountability — are as much a part of the syllabus as the algorithms.",
    ],
    "eco-m1": [
      "Economics begins with scarcity: wants exceed resources, so every choice costs the best alternative foregone (opportunity cost). Demand and supply summarise how buyers and sellers respond to price, and their intersection sets the market equilibrium; drawing the distinction between moving along a curve (price changed) and shifting it (anything else changed) prevents the classic exam error.",
      "Elasticity turns 'demand falls when price rises' into a measurable number — the percentage response of quantity to a 1 % price change — which immediately predicts revenue: raise price on an inelastic good and revenue rises; on an elastic one it falls.",
      "On the supply side, production converts inputs to output under diminishing returns, and the cost family (fixed, variable, marginal, average) describes the money side of that process. Market structure — from perfect competition to monopoly — then decides how much of the cost picture the firm can pass into price.",
    ],
    "eco-m2": [
      "National income accounting measures an economy's output: GDP counts production within borders, GNP adds net income earned abroad, and NNP subtracts depreciation. The same total can be computed three ways — production, income, expenditure — and separating real from nominal growth requires deflating by a price index.",
      "Inflation is a sustained rise in the general price level, driven from the demand side (too much spending chasing goods) or the cost side (input prices pushing up). The central bank leans against it with monetary policy — policy rates, reserve ratios — while the government's fiscal policy works through taxes and spending.",
      "Money itself is defined by its functions (medium of exchange, unit of account, store of value), and commercial banks multiply it through credit creation. International linkages appear through the balance of payments and exchange rates, which transmit the same demand-and-supply logic across borders.",
    ],
    "eco-m3": [
      "A rupee today outranks a rupee next year because today's rupee can earn interest — that is the time value of money, and engineering economics is the discipline of comparing cash flows that happen at different times. The cash-flow diagram is the non-negotiable first step: every arrow placed correctly is half the problem solved.",
      "Compound interest is the conversion engine: F = P(1+i)ⁿ moves single amounts forward, its reciprocal moves them back, and the annuity factors translate between a lump sum and an equal yearly series (capital recovery and sinking fund). With those four factors, any stream of payments can be collapsed to one number at one date.",
      "Comparing alternatives means collapsing each to the same date — present worth, future worth or annual equivalent — over the same study period. Rate of return asks the inverse question (what interest rate makes the project break even?) and payback measures crude speed of recovery.",
    ],
    "eco-m4": [
      "Assets wear out, and depreciation spreads their cost over their working life. Straight-line writes off equal slices; declining balance front-loads the write-off by taking a constant percentage of the shrinking book value; sum-of-years-digits sits between; sinking-fund reserves equal deposits that grow to the replacement cost. The method chosen changes yearly profit, not physical reality.",
      "Break-even analysis splits costs into fixed (paid regardless) and variable (per unit). Each unit sold contributes s − v toward the fixed block, so the break-even point is simply F/(s − v); beyond it every unit's contribution is profit, and the margin of safety measures how far sales can slip before losses begin — all visible on one chart of cost and revenue lines.",
      "Public projects replace profit with the benefit–cost ratio: discount all benefits and all costs to present worth and accept when B/C ≥ 1. Make-or-buy decisions apply the same marginal logic inside the firm.",
    ],
    "eth-m1": [
      "Morals are the standards a person actually holds; ethics is the systematic study of which standards are justified. Engineering ethics matters because engineers' decisions are amplified by technology — a single design judgment can affect thousands of users who never consented to the risk.",
      "Kohlberg mapped how moral reasoning matures: from obeying rules to avoid punishment (pre-conventional), to conforming with peers and law (conventional), to reasoning from self-chosen universal principles (post-conventional). Gilligan's critique added the care perspective — moral maturity as growing responsibility within relationships — and the contrast between the two is a standing exam question.",
      "A moral dilemma is a situation where genuine obligations conflict, and moral autonomy is the capacity to think through such conflicts independently rather than defaulting to authority. Identifying the competing obligations explicitly is what a good dilemma answer demonstrates.",
    ],
    "eth-m2": [
      "Every engineered product is an experiment on society: knowledge is partial, models approximate, and the 'subjects' are users who rarely gave informed consent. Framing engineering as social experimentation makes the engineer a responsible experimenter — obliged to monitor outcomes, disclose risks and respect the public's right to know.",
      "Codes of ethics published by professional bodies distil these duties: hold public safety paramount, act within competence, avoid conflicts of interest, be honest. Codes inspire and protect, but they are frameworks, not algorithms — the classic disasters (Bhopal's maintenance decay, Challenger's overridden engineers, Chernobyl's test culture) are studied precisely because codes existed and failed at the human layer.",
      "Risk is probability times severity of harm, and a risk becomes acceptable only when those exposed understand it and share its benefits justly. When internal channels fail on a serious hazard, whistle-blowing can become a duty — justified by seriousness, exhausted channels and documented evidence. Professional rights (conscientious refusal, fair treatment) and IPR round out the engineer's legal-ethical toolkit.",
    ],
    "eth-m3": [
      "The Brundtland definition — development that meets present needs without compromising future generations' ability to meet theirs — makes sustainability a fairness principle across time. It stands on three interlocking pillars: environmental integrity, economic viability and social equity; weaken any one and the stool tips.",
      "The 17 Sustainable Development Goals operationalise the idea, and grouping them as the five Ps (People, Planet, Prosperity, Peace, Partnership) makes them rememberable. Behind the goals sit the pressure indicators: climate change, resource depletion, pollution and biodiversity loss.",
      "Carrying capacity is the load an ecosystem can support indefinitely; the ecological footprint measures the load we actually impose. Humanity's footprint exceeding the planet's biocapacity — overshoot — is the quantitative statement of the sustainability problem, and equity (between and within generations) is its ethical core.",
    ],
    "eth-m4": [
      "Sustainable engineering translates the framework into design decisions: renewable energy sources and efficiency to cut the energy footprint, green-building principles for the built environment, and cleaner transport systems. The engineer's lever is the design stage — most of a product's lifetime impact is locked in before manufacture begins.",
      "The circular economy replaces take–make–dispose with loops: refuse, reduce, reuse, repurpose, recycle. Life-cycle analysis is its measuring instrument, tracking impacts from raw material through manufacture and use to end-of-life ('cradle to grave'), exposing where the real damage happens — often not where intuition says.",
      "Environmental legislation and impact assessment institutionalise the checks, while 'appropriate technology' reminds designers that the best solution fits local resources, skills and needs. Mapping each design choice to a numbered SDG is both good practice and good exam technique.",
    ],
  };

  /* ---------------- renderer ---------------- */
  const esc = s => s; // content is authored, not user input

  function moduleArticle(sub, m, i) {
    const th = THEORY[`${sub.id}-m${i + 1}`] || [];
    return `
    <article class="exp" id="${sub.id}-m${i + 1}">
      <div class="exp-head">
        <span class="kicker">${esc(sub.name)} · S3 EEE · KTU 2024 Scheme</span>
        <h2>${esc(m.title)}</h2>
      </div>
      ${th.length ? `<div class="card"><h3>Theory &amp; Explanation</h3>${th.map(p => `<p>${esc(p)}</p>`).join("")}</div>` : ""}
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
