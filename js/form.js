// ===== Formulario de confirmación (se guarda en Google Sheets) =====
// 1) Pega aquí la URL de tu Apps Script (ver README.md)
const SCRIPT_URL = 'PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT';
// 2) Máximo de personas por confirmación (contando a quien responde)
const MAX_PERSONAS = 4;

(() => {
  const $ = id => document.getElementById(id);
  const form = $('rsvpForm'), thanks = $('thanks'), err = $('err'), send = $('send');
  const peopleBox = $('peopleBox'), name = $('rname');
  const KEY = 'babyshower-julian-rsvp';

  // botones 1..MAX_PERSONAS
  $('chips').innerHTML = Array.from({length: MAX_PERSONAS}, (_, i) =>
    `<input type="radio" name="personas" id="p${i+1}" value="${i+1}"><label for="p${i+1}">${i+1}</label>`).join('');

  // mostrar/ocultar "cuántas personas"
  form.addEventListener('change', e => {
    if (e.target.name !== 'asiste') return;
    peopleBox.hidden = e.target.value !== 'Sí';
    err.textContent = '';
  });
  name.addEventListener('input', () => { name.classList.remove('bad'); err.textContent = ''; });

  function showThanks(n, asiste) {
    $('thanksT').textContent = `¡Muchas gracias, ${n.split(' ')[0]}!`;
    $('thanksP').textContent = asiste === 'Sí'
      ? 'Tu confirmación quedó registrada. ¡Te esperamos el domingo 8 de noviembre para celebrar juntos la llegada de Julian! 💙'
      : 'Lamentamos que no puedas acompañarnos, pero te agradecemos mucho por avisarnos. ¡Te mandamos un abrazo! 💙';
    form.classList.add('out');
    setTimeout(() => { form.hidden = true; thanks.hidden = false; $('rsvp').scrollIntoView({behavior: 'smooth', block: 'center'}); }, 450);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nombre = name.value.trim().replace(/\s+/g, ' ');
    const asiste = (form.asiste.value || '');
    const personas = asiste === 'Sí' ? (form.personas.value || '') : '0';

    if (!nombre) { name.classList.add('bad'); err.textContent = 'Por favor escribe tu nombre.'; name.focus(); return; }
    if (!asiste) { err.textContent = 'Cuéntanos si podrás asistir.'; return; }
    if (asiste === 'Sí' && !personas) { err.textContent = `Elige cuántas personas asistirán (de 1 a ${MAX_PERSONAS}).`; return; }
    if ($('web').value) return;                       // trampa para bots
    if (SCRIPT_URL.startsWith('PEGA_AQUI')) { err.textContent = 'El formulario aún no está conectado a la hoja de cálculo.'; return; }

    send.disabled = true; send.classList.add('load'); err.textContent = '';
    const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 15000);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', signal: ctrl.signal,
        body: new URLSearchParams({ nombre, asiste, personas }) });
      try { localStorage.setItem(KEY, JSON.stringify({ nombre, asiste })); } catch (_) {}
      showThanks(nombre, asiste);
    } catch (_) {
      err.textContent = 'No pudimos enviar tu respuesta. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      clearTimeout(to); send.disabled = false; send.classList.remove('load');
    }
  });

  // si ya respondió antes en este dispositivo
  try {
    const old = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (old) { form.hidden = true; thanks.hidden = false; showThanksQuiet(old); }
  } catch (_) {}
  function showThanksQuiet(o) {
    $('thanksT').textContent = `¡Muchas gracias, ${o.nombre.split(' ')[0]}!`;
    $('thanksP').textContent = 'Ya tenemos registrada tu respuesta. 💙';
  }
  $('again').addEventListener('click', () => {
    try { localStorage.removeItem(KEY); } catch (_) {}
    thanks.hidden = true; form.hidden = false; form.classList.remove('out'); form.reset(); peopleBox.hidden = true;
  });
})();
