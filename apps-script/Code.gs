/**
 * Recibe las confirmaciones de la invitación y las guarda en esta hoja de Google Sheets.
 * Columnas: Fecha | Nombre | Asistencia | Personas
 */
const SHEET_NAME = 'Respuestas';
const MAX_PERSONAS = 4;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { sh = ss.insertSheet(SHEET_NAME); preparar(sh); }
    else if (sh.getLastRow() === 0) preparar(sh);

    const p = (e && e.parameter) || {};
    let nombre = String(p.nombre || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    if (!nombre) throw new Error('Falta el nombre');
    if (/^[=+\-@]/.test(nombre)) nombre = "'" + nombre;          // evita fórmulas maliciosas
    const asiste = p.asiste === 'Sí' ? 'Sí' : 'No';
    const personas = asiste === 'Sí'
      ? Math.min(MAX_PERSONAS, Math.max(1, parseInt(p.personas, 10) || 1)) : 0;

    sh.appendRow([new Date(), nombre, asiste, personas]);
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  } finally {
    lock.release();
  }
}

function doGet() { return ContentService.createTextOutput('El formulario está activo ✅'); }

function preparar(sh) {
  sh.appendRow(['Fecha', 'Nombre', 'Asistencia', 'Personas']);
  sh.getRange('A1:D1').setFontWeight('bold').setBackground('#8ecfff').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
  sh.setColumnWidths(1, 1, 140); sh.setColumnWidths(2, 1, 240); sh.setColumnWidths(3, 2, 110);
  // resumen automático
  sh.getRange('F1:G3').setValues([
    ['Respuestas "Sí"', '=COUNTIF(C:C,"Sí")'],
    ['Respuestas "No"', '=COUNTIF(C:C,"No")'],
    ['TOTAL DE PERSONAS', '=SUM(D:D)']
  ]);
  sh.getRange('F1:F3').setFontWeight('bold');
  sh.getRange('F3:G3').setBackground('#d9efff');
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
