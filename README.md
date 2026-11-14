# C-212 Mass & Balance – Google Apps Script web app

Calculates the load sheet, shows the **actual CG** (% MAC and arm) at zero-fuel, take-off and landing, and plots them, with the fuel-burn path, on the weight–CG envelope.

Default mission (the **Rainmaking default** button): 6 persons × 80 kg = 480 kg (pilot, co-pilot, flight engineer, and in zone II: 2 chemical operators in cabin seats 5/6 and the scientist in cabin seat 4), 1 000 kg of chemical in four 250 kg boxes (2 in zone III, 2 in zone IV), full wing tanks, 1.5 h flight at 380 kg/h (≈ 570 kg trip fuel; maximum-cruise flow from the NC212i ground-school deck), payload dispensed before landing. Flight time and fuel flow are editable.

**Top view:** a scaled plan view (nose left) with an arm ruler, cargo zones I–VI and A with their boundaries and centroid arms, crew/cabin seats, fuel-tank arms, the MAC bar with the allowed CG range at take-off weight, and the actual CG lines. People (circles) and chemical boxes (squares) can be dragged anywhere in the cabin, or nudged with the arrow keys; the load sheet, zone loading and envelope graph update live.

## Files
| File | Purpose |
|---|---|
| `Code.gs` | `doGet()`, fleet storage (Script Properties), load-sheet log (Google Sheet) |
| `Index.html` | Page layout |
| `Styles.html` | CSS (screen and A4 print) |
| `App.html` | Aircraft data, calculations, envelope graph, UI |
| `appsscript.json` | Manifest (V8, Asia/Bangkok, web-app settings) |

## Deploy
1. Go to https://script.google.com and click **New project**.
2. Replace the contents of `Code.gs` with this `Code.gs`.
3. Add three HTML files (**+ → HTML**) named exactly `Index`, `Styles`, `App`, and paste each file's content.
4. Optional: **Project Settings → Show "appsscript.json"**, then paste the manifest.
5. **Deploy → New deployment → Web app**. Execute as: *Me*. Who has access: choose who should use it. Click **Deploy** and authorise.
6. Open the web-app URL. Click **Fleet** and enter each aircraft's registration, type, basic empty weight and BEW arm from its latest weighing report (the entries supplied are examples only).

The first **Save to log** creates a spreadsheet named *C-212 Mass & Balance Log* in the deploying account's Drive.

## Data sources (from the local `CASA C212` library)
| Item | Value | Source |
|---|---|---|
| MAC / LEMAC | 2.190 m / 5.462 m aft of datum | C-212-400 W&B Manual ME-24 1-00 / 1-10; C-212-DF AFM App. 1 (86.22 in / 215.04 in) |
| Crew arms | Pilot and co-pilot 2.050 m, 3rd crew 2.350 m | W&B Manual 1-40 |
| Cabin seats 1–23 | 3.539 – 9.275 m | NC212i WAB ground school (seat map) |
| Cargo zones I–VI, A | 3.700 – 9.838 m, maximum 560/755/500/860/765/620/400 kg | W&B Manual 1-60; NC212i WAB |
| Fuel arms | Inboard 6.26 m, outboard 6.17 m, underwing 5.90 m | W&B Manual 1-20 |
| C-212-300 military, normal role (default) | MTOW 8 100, MLW 8 100, MZFW 7 100, min 4 300 kg; fwd 15 % (≤5 013) → 16 % (7 700–8 100); aft 30 % to 8 000 kg, 27 % at 8 100 kg | QRH C-212-300 Rev 4 (Jul 2019) LD-2, LD-4 |
| C-212-300 civil | MTOW 7 700, MLW 7 450, MZFW 7 100, min 4 300 kg; CG 15 %→16 % fwd, 30 % aft; fuel 1 556 kg | AFM C-212-DF D.T.88-2508 Sect. 1 |
| C-212-400 military | MTOW/MLW 8 100, MZFW 7 500 kg; aft limit 27 % at 8 100 kg | AOM C-212-400M AB73; W&B Manual 1-10 |
| NC212i military, normal role (default) | MTOW/MLW 8 100, MZFW 7 500, ramp 8 150, min 4 700 kg; same CG envelope as C-212-400 military | AOM Supplement NC212i NTH2 / Appendix A 12M.0001.177A Table 1-1 |
| C-212-400 FAR 25 / NC212i civil | MTOW 7 700, MLW 7 450, MZFW 7 100, min 4 700 kg; fwd 12 % (≤6 500) → 16 % (7 700), aft 30 % | W&B Manual 1-10; AOM NC-212i EE92 Table 1-1 |

**Assumption:** the C-212-300 tank arms and cargo zones are taken from the C-212-400 manual because the two have the same wing and fuselage. Check these against the -300 W&B data if it is available.

This is a planning and training aid. Always check against the current approved AFM/AOM and the aircraft's own weighing report.
