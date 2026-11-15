# C-212 Knowledge Transfer – for Claude Code (Mass & Balance / Speeds app)

Prepared 15 Nov 2026 from the "C212 Knowledge Base" project (Claude chat) for the Claude Code project in
`D:\Royal Rain\software\mass and balance`.
Read this together with `README.md` (what the app does) and `App.html` (the data actually used).
If this file and the code disagree, the code shows what is implemented; the manuals decide what is correct.

---

## 1. Who the user is and what the app is for

- The user is a pilot on the **CASA / Airbus C-212-300, C-212-400 and C-212-400i (NC212i)**, doing recurrent
  training. The operator flies **Royal Rainmaking** missions (crew + chemical operators + scientist, 1 000 kg of
  chemical in boxes, dispensed before landing).
- Besides the standard flap settings (CR / TO-APP / LDG; -300: 0 / 25 % / 100 %), the operation uses a
  **mission-specific flap 60 %** setting. The app already shows VAPP/VMAN for APP, 60 % and LDG.
- The app is a **planning and training aid**, not an approved load-sheet system. Keep the disclaimer.
- Time zone: Asia/Bangkok (UTC+7). Units: kg and metres in the code; lb shown alongside (1 kg = 2.20462 lb).

## 2. Aircraft models and their designations

| Common name | Airbus/CASA model code | Notes |
|---|---|---|
| C-212-200 | C-212-CC | Only an old Ops Manual Sect. 9 (1983) in the library – not in the app |
| C-212-300 | C-212-DF | AFM INTA 1988; QRH C.L. C212DF-AA73-1 (Rev 4, Jul 2019) |
| C-212-400 | C-212-EE | Two different AFMs (DGAC civil / INTA state) – see §4 |
| C-212-400i / NC212i | NC212i-400 (built by IAe, Indonesia; EE92 AOM) | NTH1 (2019) and NTH2 (2022/23) deliveries |

App type keys (`TYPES` in `App.html`, `VALID_TYPES` in `Code.gs`):
`C212_300` (military normal role, default), `C212_300C` (civil AFM), `C212_400M` (military), `C212_400C` (FAR 25),
`NC212I` (military normal role, default), `NC212I_C` (civil AOM).

## 3. Reference geometry and data already in the app (verify before changing)

- Datum 1.115 m forward of the jig point. **LEMAC 5.462 m, MAC 2.190 m**. %MAC = (arm − 5.462) / 2.190 × 100.
  (-300 AFM App. 1 gives the same in inches: MAC 86.22 in, LEMAC 215.04 in.)
- Crew: pilot / co-pilot 2.050 m, 3rd crew 2.350 m. Cabin seats 1–23: 3.539 – 9.275 m.
- Cargo zones I–VI, A: centroids 3.700 – 9.838 m; max 560 / 755 / 500 / 860 / 765 / 620 / 400 kg.
- Fuel arms: inboard 6.26 m, outboard 6.17 m, underwing (400/NC212i only) 5.90 m.
- Weights (kg):

| Type | MTOW | MLW | MZFW | Ramp | Min | CG envelope (%MAC) |
|---|---|---|---|---|---|---|
| -300 military | 8 100 | 8 100 | 7 100 | 8 150 | 4 300 | fwd 15 % (≤5 013) → 16 % (≥7 700); aft 30 % to 8 000, 27 % at 8 100 |
| -300 civil | 7 700 | 7 450 | 7 100 | 7 750 | 4 300 | fwd 15 → 16 %; aft 30 % |
| -400 military / NC212i military | 8 100 | 8 100 | 7 500 | 8 150 | 4 700 | fwd 12 % (≤6 500) → 16 % (≥7 700); aft 30 % to 7 700, 27 % at 8 100 |
| -400 FAR 25 / NC212i civil | 7 700 | 7 450 | 7 100 | 7 750 | 4 700 | fwd 12 → 16 %; aft 30 % |

**Known assumption:** -300 tank arms and cargo zones are copied from the C-212-400 W&B Manual (same wing and
fuselage). Replace them if -300 W&B data is found.

Fleet BEW/arm values in `DEFAULT_FLEET` are **examples only** (NC212i 4 778 kg @ 6.042 m from the ground-school case
study; -400 4 826 kg @ 6.008 m; -300 placeholder). Real values come from each aircraft's weighing report.

## 4. Source documents – where to look

Library root: `D:\Royal Rain\CASA C212 Local\CASA C212\`
(only two top folders: `1 Aircraft Documents` and `2 Training`; reorganised 29 Oct 2026 – older paths such as
`Casa 400`, `Nc212i`, `Ground School 2024`, `ทบทวนประจำปี69` no longer exist).

### 1 Aircraft Documents
- **C-212-300 (DF)** – AFM (INTA 1988) + OCR copy; QRH AA73 + OCR + Rev 4 translated; short checklists;
  `Casa C212 (BANANA).pdf` (Thai pilot handbook -200/-300).
- **C-212-400 (EE)**
  - `AFM\AFM DGAC D.T.97-2001 (BR4 2007).pdf` (+ `- OCR - Improved.pdf`, recommended for text search) –
    **civil (FAR 25)** manual. MTOW 7 700, MLW 7 450. Supplement No.14 = increased weights with aux tank / ferry
    (MTOW 8 100, MZFW 7 500).
  - `AFM\AFM INTA D.T.96-2002 BR4 2007 - Combined OCR.pdf` (546 p) – same Sections 1–7 **plus Section 8
    Appendix No.1 "Operations at increased structural weights"** (A.1-1 … A.1-286: own limitations and full
    performance data; roles assault transport 3.0 g / normal transport 2.5 g; towing max 8 050 kg). Appendix 1 is
    *not* authorised for FAR 25-only (civil) operation. **This is the source for military-weight performance.**
  - `AOM\CASA400 - VOL I SYSTEM DESCRIPTION.pdf`, `VOL II LIMITATIONS PROCEDURES.pdf`
  - `C212-400 Performance Data Manual.pdf` (266 p), `C-212-400M QRH.pdf` (102 p, AB73, "training" watermark),
    MEL (2010 training copy), W&B Manual ME-24.
- **C-212-400i (NC212i)**
  - `AIRCRAFT_OPERATIONS_MANUAL\Aircraft Operation Manual Volume 1.pdf` (502 p) and `Volume 2.pdf` (174 p);
    annexes FMS SCN and EE92 GPWS kept as separate files.
  - `Performance Data Manual.pdf` (264 p), QRH NTH1, FCFM, AOM supplements (NTH1 drafts, **NTH2 Appendix A
    12M.0001.177A** – military weights Table 1-1), MMEL S/N 120-122, EE92 training copies (Dec 2023).
- Also: TPE331 engine (Garrett pilot tips), Airbus notice FOT-C212-28-0001, Operator SOP.
- New pilot short checklists (Nov 2026, A5 + A4 print-cut) in each model's `Checklists` folder – each has
  **performance tables at the back** that can be used as a cross-check (see §7 for their open issues).

### 2 Training (weight & balance / performance material)
- `04 NC212i NTH1 - IAe 2019\Pilot Ground School\` – W&B deck and `NC212 NTH1 Performance Manual.pdf` (140 p IAe
  presentation by M. Iqbal – a training deck, **not** the PDM).
- `06 NC212i NTH2 Pilot Ground School - IAe Feb 2023` – "W&B & Performance" by Stepen (newest). Source of the
  NC212i seat map, the WAB case study (VREF 89 kt at 6 850 kg worked example) and the max-cruise fuel flow
  (≈ 1 400 lb / 101 min → app default 380 kg/h).
- `08 NC212i Annual Review 2026` – latest course.

### Rules for using these sources
1. Prefer approved documents (AFM/AOM/PDM/QRH, W&B Manual) over training decks; use decks only where no
   approved figure exists, and say so in the `source` string.
2. OCR text can be wrong in tables and charts – **check every number against the page image** before using it.
3. Use the civil DGAC AFM for civil types, the INTA AFM Appendix 1 / NC212i NTH2 Appendix A for military weights.
   Which AFM applies to a given airframe is shown on page A of the manual and the aircraft certificate
   (not filled in on the library copies).
4. Record the document, revision and page/table for every value added (pattern: the `source` field in `TYPES`
   and the README "Data sources" table).

## 5. Speed logic (as implemented – keep consistent)

- **Take-off** (-300 flaps 25 %; -400/NC212i flaps TO/APP): VR, V2, VFTO interpolated by actual TOW; VR and V2
  raised to the VMCA-limited minimum for field elevation and OAT (QRH MIN VR / MIN V2 tables; `null` = "-" in the
  QRH). V1 shown = VR (QRH gives no separate V1). -300 also shows flap-retraction speed. -400/NC212i offer the
  **tactical take-off** table.
- **Landing:** VREF (flaps LDG / 100 %) by actual landing weight.
  VAPP = VREF + ΔV flap + ADD; VMAN = VAPP + 10.
  ΔV flap: 0 kt above 70 % flap, **8 kt for 20–70 % (APP and 60 %)**, 16 kt at ≤ 20 %.
  ADD = ½ steady headwind + full gust, max 10 kt.
- **Rounding:** table values to nearest knot (matches the ground-school VREF 89 kt @ 6 850 kg example); VMCA
  minimums rounded **up**.
- Beyond the last table column (-300: 7.7 t T/O, 7.5 t LDG; -400: 8.1 t T/O, 8.0 t LDG) values are extrapolated
  and **flagged** – keep the flag.
- Sources: QRH C212DF-AA73-1 PD-2 / PD-3 (-300); QRH C-212-400M AB73-1 and QRH NC212i NTH1 PD-2, PD-22
  (-400/NC212i).

## 6. Code and deployment notes

- Google Apps Script web app: `Code.gs` (server: `doGet`, fleet in Script Properties, load-sheet log in a Google
  Sheet "C-212 Mass & Balance Log"), `Index.html`, `Styles.html` (screen + A4 print), `App.html` (all data and
  calculations run client-side), `appsscript.json` (V8, Asia/Bangkok).
- Deployment: clasp (`.clasp.json`) + GitHub Actions `.github/workflows/deploy.yml`. `.claspignore` pushes only the
  five source files, so this `.md` file is not uploaded to Apps Script.
- If you add a type or change limits, update **both** `TYPES` (App.html) and `VALID_TYPES` / validation ranges
  in `Code.gs`, plus the README data table.
- Fleet is cached in the browser (`localStorage` key `c212wb.fleet`) when not running under Apps Script.

## 7. Open questions / items not yet verified

From the Nov 2026 short-checklist work (values left as printed, waiting for the instructor):
- Performance table **7.8 t column shows "16.5 lbs×1000"** (all three models) – suspicious.
- Take-off power 1 000 ft row not steadily decreasing (all three).
- -300 Takeoff page says **"V2 115 knots"**, which does not match the V2 table – do not use 115 kt.
- -400/400i SRL EGT table labelled 97/99/100 % (-300: 96/98/100 %, same values).
- -400/400i Before Landing FUEL XFEED OFF vs memory item X FEED NORM (procedure, not M&B).

Data gaps for this app:
- -300 fuel-tank arms and cargo zones (borrowed from -400, see §3).
- Speeds for flap 60 % come only from the ΔV rule; no dedicated table has been found.
- Increased-weight (military) take-off/landing performance for the -400 is in INTA AFM Appendix 1 (A.1-x) –
  not yet compared with the QRH tables used in the app.
- Real BEW / arm for each tail number.

## 8. Working agreements with the user

- Cite document + page/table for any figure; never invent or "round off" a limitation.
- When a value is uncertain or extrapolated, show it and flag it rather than hiding it.
- Keep the plain-English UI style and the A4 print layout.
- Ask before changing approved limits; small UI/code changes can go ahead.
