/**
 * C-212 Mass & Balance — Google Apps Script web app (server side)
 *
 * Files in this project:
 *   Code.gs        – this file (web app entry point, fleet storage, load-sheet log)
 *   Index.html     – page layout
 *   Styles.html    – CSS
 *   App.html       – client-side calculation, graph and UI (JavaScript)
 *   appsscript.json– manifest
 *
 * All weight & balance calculations run in the browser (App.html) so results update
 * instantly. The server only stores the fleet list (registration, basic empty weight, arm)
 * and appends saved load sheets to a Google Sheet.
 */

var APP_TITLE = 'C-212 Mass & Balance';

/**
 * Example fleet. REPLACE these with the figures from each aircraft's latest
 * weighing report / Basic Weight & Balance Record (Form C). Edit them from the
 * app ("Fleet" button) – changes are stored in Script Properties.
 */
var DEFAULT_FLEET = [
  { reg: 'NC212i (example)',   type: 'NC212I',    bew: 4778, arm: 6.042, note: 'Example from NC212i WAB ground-school case study – replace' },
  { reg: 'C-212-400 (example)', type: 'C212_400M', bew: 4826, arm: 6.008, note: 'Example from NC212-400 WAB master sheet – replace' },
  { reg: 'C-212-300 (example)', type: 'C212_300',  bew: 4500, arm: 6.000, note: 'Placeholder – enter from weighing report' }
];

var VALID_TYPES = ['C212_300', 'C212_400M', 'C212_400C', 'NC212I'];

function doGet() {
  var t = HtmlService.createTemplateFromFile('Index');
  return t.evaluate()
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Used by Index.html to pull in Styles.html and App.html. */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

/** Returns the stored fleet (or the example fleet on first run). */
function getFleet() {
  var raw = PropertiesService.getScriptProperties().getProperty('FLEET');
  if (!raw) return DEFAULT_FLEET;
  try {
    var f = JSON.parse(raw);
    return (f && f.length) ? f : DEFAULT_FLEET;
  } catch (e) {
    return DEFAULT_FLEET;
  }
}

/** Saves the fleet list after validating every entry. */
function saveFleet(fleet) {
  if (!Array.isArray(fleet) || !fleet.length) throw new Error('Fleet list is empty.');
  var clean = fleet.map(function (a, i) {
    var reg = String(a.reg || '').trim();
    var bew = Number(a.bew), arm = Number(a.arm);
    if (!reg) throw new Error('Row ' + (i + 1) + ': registration is required.');
    if (VALID_TYPES.indexOf(a.type) < 0) throw new Error(reg + ': unknown aircraft type.');
    if (!(bew > 3000 && bew < 6500)) throw new Error(reg + ': basic empty weight must be 3000–6500 kg.');
    if (!(arm > 5 && arm < 7)) throw new Error(reg + ': BEW arm must be 5–7 m from datum.');
    return { reg: reg, type: a.type, bew: bew, arm: arm, note: String(a.note || '').slice(0, 200) };
  });
  PropertiesService.getScriptProperties().setProperty('FLEET', JSON.stringify(clean));
  return clean;
}

/**
 * Appends one load sheet to the log spreadsheet. The spreadsheet is created on the
 * first save (in the Drive of the account that deployed the web app) and its ID is
 * kept in Script Properties as LOG_SHEET_ID.
 */
function saveLoadsheet(rec) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = getLogSpreadsheet_();
    var sh = ss.getSheets()[0];
    var user = '';
    try { user = Session.getActiveUser().getEmail(); } catch (e) {}
    sh.appendRow([
      new Date(), rec.date, rec.flight, rec.mission, rec.reg, rec.typeName, rec.pic,
      rec.bew, rec.people, rec.payload, rec.zfw, rec.zfwCg,
      rec.fuel, rec.tow, rec.towCg, rec.trip, rec.lw, rec.lwCg,
      rec.status, rec.warnings, user
    ]);
    return { url: ss.getUrl(), row: sh.getLastRow() };
  } finally {
    lock.releaseLock();
  }
}

function getLogSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('LOG_SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* deleted – create a new one */ }
  }
  var ss = SpreadsheetApp.create('C-212 Mass & Balance Log');
  var sh = ss.getSheets()[0];
  sh.setName('Load sheets');
  sh.appendRow([
    'Saved at', 'Flight date', 'Flight no.', 'Mission', 'Registration', 'Type', 'PIC',
    'BEW (kg)', 'People (kg)', 'Payload (kg)', 'ZFW (kg)', 'ZFW CG (%MAC)',
    'Fuel (kg)', 'TOW (kg)', 'TOW CG (%MAC)', 'Trip fuel (kg)', 'LW (kg)', 'LW CG (%MAC)',
    'Status', 'Warnings', 'Saved by'
  ]);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, 21).setFontWeight('bold');
  props.setProperty('LOG_SHEET_ID', ss.getId());
  return ss;
}
