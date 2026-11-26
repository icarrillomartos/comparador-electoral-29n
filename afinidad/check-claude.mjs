// Comprobaciones de la versión de lanzamiento (cálculo igualado, sin estadísticas simuladas).
import fs from 'node:fs'; import vm from 'node:vm'; import assert from 'node:assert/strict';
const base = new URL('./', import.meta.url);
const src = fs.readFileSync(new URL('affinity-data.js', base), 'utf8');
const box = {window: {}, document: {addEventListener() {}}, console}; vm.createContext(box);
vm.runInContext(src, box); vm.runInContext(fs.readFileSync(new URL('affinity.js', base), 'utf8'), box);
const d = box.window.AFFINITY_DATA, c = box.window.AffinityCore, S = box.window.AffinityState;

// Estructura y fuentes
assert.equal(d.questions.length, 25); assert.equal(d.parties.length, 6);
let celdas = 0, conNivel = 0;
for (const q of d.questions) for (const p of d.parties) {
  const pos = q.positions[p.id]; celdas++;
  assert.ok(pos && pos.reason, `${q.id}/${p.id} sin explicación`);
  assert.ok(pos.support === null || [0, 1, 2, 3, 4].includes(pos.support), `${q.id}/${p.id} nivel inválido`);
  if (pos.support !== null) { conNivel++; assert.ok(pos.evidence.some(e => e.quote && /^https?:\/\//.test(e.url)), `${q.id}/${p.id} sin cita con enlace`); }
}
assert.equal(celdas, 150);

// Simetría: responder todo sí o todo no da coincidencias complementarias
const yes = Object.fromEntries(d.questions.map(q => [q.id, 1])), no = Object.fromEntries(d.questions.map(q => [q.id, 0]));
for (const p of c.score(yes)) { const q = c.score(no).find(x => x.id === p.id); assert.ok(Math.abs(p.coin + q.coin - 100) <= 1, p.id); }
// Sin respuestas o solo dudas: sin resultado
assert.ok(c.score({}).every(p => p.value === null));
assert.ok(c.score(Object.fromEntries(d.questions.map(q => [q.id, null]))).every(p => p.value === null));
assert.equal(c.leaders({}).length, 0);
// Las dudas no cambian nada
assert.equal(JSON.stringify(c.score({jornada: 1})), JSON.stringify(c.score({jornada: 1, nuclear: null})));
// Edad, género y renta no influyen
const antes = JSON.stringify(c.score(yes)); S.demographics = {age: '65 o más', sex: 'Mujer', income: '3.000 € o más'}; assert.equal(JSON.stringify(c.score(yes)), antes);
// Las preguntas de consenso no cuentan
for (const id of c.consenso) for (const p of c.score({[id]: 1})) assert.equal(p.n, 0, id);

// Resultados: se pintan y ya no hay estadísticas simuladas
box.window.UI29N = {tag: id => `<b>${id.id || id}</b>`, ring: n => `<span>${n}</span>`};
S.answers = Object.fromEntries(d.questions.map((q, i) => [q.id, i % 5 === 4 ? null : i % 2])); S.phase = 'results';
const html = box.window.vAfinidad();
for (const t of ['af-podio', 'Tu sitio en el mapa', 'Ver el resto de partidos']) assert.ok(html.includes(t), t);
for (const t of ['DATOS SIMULADOS', 'Ver estadísticas', 'Revisar mis respuestas (']) assert.ok(!html.includes(t), t);

// Reparto justo: con respuestas al azar, cada partido sale primero entre el 12 % y el 22 % de las veces
let seed = 11; const r = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296; const win = {};
for (let t = 0; t < 20000; t++) { const a = {}; d.questions.forEach(q => a[q.id] = r() < .12 ? null : (r() < .5 ? 1 : 0)); const s = c.score(a).sort((x, y) => y.raw - x.raw); win[s[0].id] = (win[s[0].id] || 0) + 1; }
for (const p of d.parties) { const f = (win[p.id] || 0) / 20000; assert.ok(f > .10 && f < .25, `${p.id} ${f}`); }
const hi = {}; seed = 5; for (let t = 0; t < 20000; t++) { const a = {}; d.questions.forEach(q => a[q.id] = r() < .12 ? null : (r() < .5 ? 1 : 0)); for (const p of c.score(a)) if (p.raw >= 80) hi[p.id] = (hi[p.id] || 0) + 1; }
for (const p of d.parties) { const f = hi[p.id] / 20000; assert.ok(f > .17 && f < .23, `calibración ${p.id} ${f}`); }

// Mapa dentro de los límites
for (const p of d.parties) { const k = c.coordsParty(p.id); assert.ok(Math.abs(k.x.v) <= 1 && Math.abs(k.y.v) <= 1, p.id); }

console.log(JSON.stringify({ok: true, celdas, conNivel, sinPostura: celdas - conNivel, consenso: [...c.consenso],
  primeroAlAzar: Object.fromEntries(Object.entries(win).map(([k, v]) => [k, (100 * v / 20000).toFixed(1) + ' %']))}, null, 1));
