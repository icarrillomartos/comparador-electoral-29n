/* Questionnaire answers never leave this browser. Optional aggregate contributions only. */
(() => {
'use strict';
const data=window.AFFINITY_DATA, qs=data.questions, parties=data.parties;
const state={phase:'question',step:0,answers:{},demo:false,demographics:{},dimension:'age',group:'all',finalResult:null};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const answered=a=>qs.filter(q=>a[q.id]===0||a[q.id]===1);
// Preguntas en las que todos los partidos con postura están a un punto o menos: no distinguen y no cuentan para el ranking.
const consenso=new Set(qs.filter(q=>{const s=parties.map(p=>q.positions[p.id]?.support).filter(Number.isFinite);return s.length>=2&&Math.max(...s)-Math.min(...s)<=1;}).map(q=>q.id));
// Estandarización: para cada partido se compara tu coincidencia con la que darían todas las formas posibles de responder
// esas mismas preguntas (media 50 %, dispersión según lo marcadas que sean sus posturas y cuántas son). El resultado es un
// percentil de 0 a 100, comparable entre partidos aunque tengan distinto número de posturas documentadas.
const erf=x=>{const t=1/(1+.3275911*Math.abs(x)),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return x>=0?y:-y;};
const Phi=z=>.5*(1+erf(z/Math.SQRT2));
// Percentil exacto: probabilidad de sacar menos puntos que tú respondiendo esas mismas preguntas al azar (medio punto en empates).
function pct(sup,pts){let dist=new Map([[0,1]]);for(const s of sup){const nd=new Map();for(const [k,p] of dist){for(const c of [s,4-s])nd.set(k+c,(nd.get(k+c)||0)+p/2);}dist=nd;}let lo=0,eq=0;for(const [k,p] of dist){if(k<pts-1e-9)lo+=p;else if(Math.abs(k-pts)<1e-9)eq+=p;}return 100*(lo+eq/2);}
function score(a){const valid=answered(a).filter(q=>!consenso.has(q.id));return parties.map(p=>{let points=0;const items=answered(a).map(q=>{const pos=q.positions[p.id],known=Number.isFinite(pos?.support),credit=known?(a[q.id]===1?pos.support:4-pos.support):null,cuenta=known&&!consenso.has(q.id);if(cuenta)points+=credit;return {q,pos,known,credit,cuenta,match:cuenta&&credit>=3};});const n=items.filter(x=>x.cuenta).length,total=valid.length,missing=total-n,coin=n?100*points/(4*n):null,sd=n?Math.sqrt(items.filter(x=>x.cuenta).reduce((v,x)=>v+(x.pos.support-2)**2,0))/(4*n):0,raw=coin===null?null:pct(items.filter(x=>x.cuenta).map(x=>x.pos.support),points);return {...p,n,total,points,items,coin:coin===null?null:Math.round(coin),value:raw===null?null:Math.round(raw),raw,coverage:total?n/total:0,eligible:n>=6&&n/total>=.6,lower:total?100*points/(4*total):0,upper:total?100*(points+4*missing)/(4*total):100};});}
function pair(a,idA,idB){const common=answered(a).filter(q=>Number.isFinite(q.positions[idA]?.support)&&Number.isFinite(q.positions[idB]?.support));return {n:common.length,results:[idA,idB].map(id=>({id,value:common.length?Math.round(100*common.reduce((n,q)=>n+(a[q.id]?q.positions[id].support:4-q.positions[id].support),0)/(4*common.length)):null})),questions:common};}
window.AffinityCore={score,pair,questions:qs,consenso};window.AffinityState=state;
const sets={age:['18–24','25–34','35–44','45–54','55–64','65 o más','Prefiero no responder'],sex:['Mujer','Hombre','Otra opción','Prefiero no responder'],income:['Sin ingresos propios','Menos de 1.000 €','1.000–1.999 €','2.000–2.999 €','3.000 € o más','Prefiero no responder']};
const labels={age:'Edad',sex:'Sexo',income:'Ingresos netos al mes'};
const CHEV='<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const partyTag=p=>window.UI29N.tag(typeof p==='string'?p:p.id);
const affinityRing=(value,size=46,width=5)=>value===null?'<span class="af-no-score">Sin base</span>':window.UI29N.ring(value,size,width);
function button(action,label,cls='primary',extra=''){return `<button class="af-btn ${cls==='text'||cls.startsWith('skip')?'txt':'btn'} ${cls}" data-af="${action}" ${extra}>${label}</button>`;}
function shell(body){return `<section class="af" aria-label="Afinidad">${body}</section>`;}
function intro(){return question();}
function question(){const q=qs[state.step],chosen=state.answers[q.id],has=Object.hasOwn(state.answers,q.id);return shell(`<section class="cab"><h1>¿Eres coherente entre lo que piensas y lo que votas?</h1><p>${qs.length} preguntas. Responde sí, no o «no lo tengo claro» y descubre tu afinidad.</p></section><div class="af-quiz-head">${button('back','← Volver','text')}<span>Pregunta <b>${state.step+1}</b> de ${qs.length}</span>${button('next','Siguiente →','text',has?'':'disabled')}</div><div class="af-progress" role="progressbar" aria-label="Progreso" aria-valuemin="0" aria-valuemax="${qs.length}" aria-valuenow="${state.step}"><i style="width:${state.step/qs.length*100}%"></i></div><div class="af-question"><div class="af-question-label"><span class="af-topic">${escape(q.topic)}</span><button type="button" class="af-info-button" data-af="info" aria-label="Información sobre esta pregunta" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r=".8" fill="currentColor" stroke="none"/></svg></button></div><h2 tabindex="-1" id="af-focus">${escape(q.text)}</h2>${q.annotation?`<p class="af-context af-fact">${escape(q.annotation)} <a href="${escape(q.annotationSource.url)}" target="_blank" rel="noopener">${escape(q.annotationSource.title)} ↗</a></p>`:''}<div class="af-options">${button('answer','Sí','answer '+(has&&chosen===1?'selected':''),'data-value="1" aria-pressed="'+(has&&chosen===1)+'"')}${button('answer','No','answer '+(has&&chosen===0?'selected':''),'data-value="0" aria-pressed="'+(has&&chosen===0)+'"')}</div>${button('answer','No lo tengo claro →','skip '+(has&&chosen===null?'selected':''),'data-value="skip"')}</div>`);}
// Persistent statistics are aggregated separately by demographic dimension.
const pcolor=id=>(parties.find(p=>p.id===id)||{}).color||'#888';
const STATS_VERSION='29n-2026-v1';
const STATS_URL='/api/afinidad/estadisticas';
const remote={data:null,error:'',loading:false,updatedAt:null,sending:false,saved:false,duplicate:false,consent:false,pending:null,timer:null,abort:null};
try{remote.saved=sessionStorage.getItem('af29n-saved-'+STATS_VERSION)==='1';}catch{/* Storage can be disabled. */}
function contributionId(){
  const key='af29n-id-'+STATS_VERSION;
  try{const old=sessionStorage.getItem(key);if(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(old||''))return old;}catch{}
  const id=crypto.randomUUID();try{sessionStorage.setItem(key,id);}catch{}return id;
}
function finishQuestionnaire(){
  const all=ranked(state.answers),n=answered(state.answers).length;
  const eligible=all.filter(p=>p.eligible);
  const primary=n<12||!eligible.length?'none':eligible.length>1&&eligible[0].raw-eligible[1].raw<=5?'tie':eligible[0].id;
  const reference=primary==='none'?null:eligible[0];
  const extract=items=>items.slice(0,3).map(({q,credit})=>({text:q.text,topic:q.topic,answer:state.answers[q.id]===1?'Sí':'No',credit}));
  const highlights={partyId:reference?.id||'',partyName:reference?.corto||'',
    close:extract(reference?reference.items.filter(x=>x.cuenta&&x.credit>=3).sort((a,b)=>b.credit-a.credit):[]),
    far:extract(reference?reference.items.filter(x=>x.cuenta&&x.credit<=1).sort((a,b)=>a.credit-b.credit):[])};
  state.finalResult={rows:all.map(({items,...summary})=>summary),near:n<12?[]:leaders(state.answers),answered:n,coords:coords(state.answers),primary,highlights};
  state.answers={}; // Discard the full answer set; keep only the requested six-question local summary.
  state.demographics={};remote.consent=false;remote.pending=null;remote.error='';
  document.getElementById('af-info')?.remove();document.getElementById('af-ficha')?.remove();
  state.phase=remote.saved?'results':'demographic';
  if(state.phase==='results')startStatistics();
}
function demographic(){
  const done=Object.keys(sets).every(k=>sets[k].includes(state.demographics[k]));
  const busy=remote.sending?'disabled':'';
  const fieldsBusy=remote.sending||remote.pending?'disabled':'';
  return shell(`<section class="cab"><h1 tabindex="-1" id="af-focus">Tu resultado está listo</h1><p>¿Quieres contribuir a las estadísticas de quienes participan?</p></section>
    <section class="af-comparar af-share"><p>Es opcional. Solo enviaremos tu <b>sexo, tramo de edad, tramo de renta y afinidad principal</b>. Las respuestas completas ya se han borrado y no se envían. Solo queda en esta pestaña un resumen de hasta seis para tu tarjeta.</p>
    ${Object.keys(sets).map(k=>`<fieldset class="af-chipset"><legend>${labels[k]}</legend><div class="af-chips">${sets[k].map(v=>`<button type="button" class="pc af-chip" data-af="demo-pick" data-key="${k}" data-value="${escape(v)}" aria-pressed="${state.demographics[k]===v}" ${fieldsBusy}>${escape(v)}</button>`).join('')}</div></fieldset>`).join('')}
    <p class="af-micro">Renta personal neta mensual, no la del hogar. Puedes elegir «Prefiero no responder».</p>
    <label class="af-consent"><input id="af-share-consent" type="checkbox" ${remote.consent?'checked':''} ${busy}><span>Tengo 18 años o más y acepto compartir estos datos y mi afinidad principal para las estadísticas públicas agregadas.</span></label>
    <p class="af-micro">No pedimos nombre ni correo. Guardamos recuentos separados por sexo, edad o renta, no una ficha con tus datos combinados. <a href="#/metodo">Cómo se usan los datos</a>.</p>
    ${remote.error?`<p class="af-save-error" role="alert">${escape(remote.error)}</p>`:''}
    <div class="af-bottom">${button('demo-go',remote.sending?'Guardando…':remote.pending?'Reintentar guardado':'Compartir y ver mi resultado','primary',done&&remote.consent&&!remote.sending?'':'disabled')}${button('skip-demo','Ver mi resultado sin compartir','text',busy)}</div></section>`);
}
function paintStatistics(){
  const el=document.getElementById('af-live-stats');
  if(el)el.innerHTML=statistics();
}
async function loadStatistics(){
  if(remote.loading)return;
  remote.loading=true;paintStatistics();
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{
    const response=await fetch(STATS_URL,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error('unavailable');
    const result=await response.json();
    if(result.version!==STATS_VERSION||!Number.isSafeInteger(result.total)||!result.dimensions)throw new Error('invalid');
    remote.data=result;remote.updatedAt=new Date();remote.error='';
  }catch{remote.error='No se han podido actualizar las estadísticas. Puedes volver a intentarlo.';}
  finally{clearTimeout(timeout);remote.loading=false;paintStatistics();}
}
function startStatistics(){
  void loadStatistics();
  if(!remote.timer)remote.timer=setInterval(()=>{if(!document.hidden&&state.phase==='results'&&location.hash.startsWith('#/afinidad'))void loadStatistics();},30000);
}
async function submitContribution(){
  if(remote.sending||remote.saved||!remote.consent||!state.finalResult||!Object.keys(sets).every(k=>sets[k].includes(state.demographics[k])))return;
  // Freeze the exact minimal payload for idempotent retries. Never include answers/scores.
  remote.pending??={version:STATS_VERSION,submissionId:contributionId(),sex:state.demographics.sex,age:state.demographics.age,income:state.demographics.income,affinity:state.finalResult.primary,consent:true};
  remote.sending=true;remote.error='';render(false);
  const controller=new AbortController();remote.abort=controller;const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(STATS_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(remote.pending),signal:controller.signal,cache:'no-store'});
    const result=await response.json();
    if(!response.ok||result.saved!==true)throw new Error(result.error||'No se ha podido confirmar el guardado.');
    remote.saved=true;remote.duplicate=result.duplicate===true;
    try{sessionStorage.setItem('af29n-saved-'+STATS_VERSION,'1');}catch{}
    if(result.stats){remote.data=result.stats;remote.updatedAt=new Date();}
    state.demographics={};remote.pending=null;remote.consent=false;state.phase='results';
    startStatistics();
  }catch(error){remote.error=error.name==='AbortError'?'No hemos podido confirmar el guardado a tiempo. Puedes reintentar durante 30 días sin duplicar tu aportación.':error.message;}
  finally{clearTimeout(timeout);remote.sending=false;remote.abort=null;render();}
}
function statistics() {
  const {error,loading,updatedAt}=remote;
  const ids = [
    'podemos', 'frenteamplio', 'psoe', 'pp',
    'vox', 'salf', 'tie', 'none'
  ];
  const names = {
    podemos: 'Podemos',
    frenteamplio: 'Frente Amplio',
    psoe: 'PSOE',
    pp: 'PP',
    vox: 'Vox',
    salf: 'Se Acabó La Fiesta',
    tie: 'Sin diferencia clara',
    none: 'Sin base suficiente'
  };
  const dimensions = ['sex', 'age', 'income'];
  const dimension = dimensions.includes(state.dimension)
    ? state.dimension
    : 'sex';
  const selection = state.spectrumSelection;
  const data = remote.data;
  const e = value => escape(String(value ?? ''));
  const number = value => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  };
  const format = value => value.toLocaleString('es-ES');
  const percentage = (count, total) =>
    (total > 0 ? (count / total) * 100 : 0)
      .toFixed(1)
      .replace('.', ',');

  const controls = dimensions.map(key => `
    <button
      type="button"
      data-af="dimension"
      data-key="${e(key)}"
      aria-pressed="${key === dimension ? 'true' : 'false'}"
    >${e(labels[key])}</button>
  `).join('');

  const refreshLabel = error && !data ? 'Reintentar' : 'Actualizar';
  const header = `
    <header class="af-section-head">
      <h2>Afinidad de quienes participan</h2>
      <button type="button" data-af="refresh-stats"${loading ? ' disabled' : ''}>
        ${e(refreshLabel)}
      </button>
    </header>
    <p>Muestra voluntaria: no representa al electorado ni la intención de voto.</p>
    <p>
      Elige sexo, edad o renta para comparar. Cuanto mayor es el círculo,
      más participaciones tienen esa afinidad. Pulsa un círculo para ver su porcentaje.
    </p>
    <div class="af-stat-controls" role="group" aria-label="Dimensión de los resultados">
      ${controls}
    </div>
  `;
  const explanation = `
    <p>
      Una diferencia de 5 puntos o menos entre las dos mejores afinidades
      se clasifica como «Sin diferencia clara». Menos de 12 respuestas
      o una cobertura insuficiente se clasifica como «Sin base suficiente».
    </p>
  `;
  const pendingSelection = selection ? `
    <p>El detalle de la selección estará disponible cuando se carguen los datos.</p>
  ` : '';

  if (!data) {
    let status;

    if (loading) {
      status = '<p role="status">Cargando participaciones…</p>';
    } else if (error) {
      status = `
        <p role="alert">
          No se han podido cargar las participaciones: ${e(error)}.
          Pulsa «Reintentar» para volver a intentarlo.
        </p>
      `;
    } else {
      status = '<p role="status">Los datos de participaciones aún no están disponibles.</p>';
    }

    return `
      <section class="af-stats af-real-stats" aria-label="Afinidad de quienes participan" aria-busy="${loading ? 'true' : 'false'}">
        ${header}
        ${status}
        ${pendingSelection}
        ${explanation}
      </section>
    `;
  }

  const total = number(data.total);
  const sourceRows = data.dimensions?.[dimension];
  const rows = (Array.isArray(sourceRows) ? sourceRows : []).map(row => ({
    label: String(row.label ?? ''),
    total: number(row.total),
    counts: Object.fromEntries(ids.map(id => [
      id, number(row.counts?.[id])
    ]))
  }));
  const maxN = Math.max(0, ...rows.flatMap(row =>
    ids.map(id => row.counts[id])
  ));
  const timestamp = updatedAt instanceof Date &&
    Number.isFinite(updatedAt.getTime())
    ? `<p>Última actualización: <time datetime="${e(updatedAt.toISOString())}">${e(
        updatedAt.toLocaleString('es-ES')
      )}</time></p>`
    : '';
  const warning = error ? `
    <p role="alert">
      No se ha podido actualizar: ${e(error)}.
      Se conservan los datos de la última carga correcta.
    </p>
  ` : '';
  const progress = loading
    ? '<p role="status">Actualizando participaciones…</p>'
    : '';
  const smallSample = total < 30
    ? '<p>Muestra pequeña: menos de 30 participaciones.</p>'
    : '';

  let content;

  if (total === 0) {
    content = '<p>Todavía no hay participaciones registradas.</p>';
  } else if (rows.length === 0) {
    content = `
      <p>No hay grupos disponibles para ${e(labels[dimension])} en los datos recibidos.</p>
    `;
  } else {
    const headings = ids.map(id => `
      <th scope="col">
        ${id === 'tie' || id === 'none' ? e(names[id]) : partyTag(id)}
      </th>
    `).join('');

    const tableRows = rows.map(row => {
      const cells = ids.map(id => {
        const count = row.counts[id];
        const percent = percentage(count, row.total);
        const size = maxN > 0
          ? 20 + 28 * Math.sqrt(count / maxN)
          : 20;
        const description =
          `${row.label}, ${names[id]}, ${count} de ${row.total}, ${percent}%`;
        const selected = selection &&
          selection.group === row.label &&
          selection.id === id;

        return `
          <td>
            <button
              type="button"
              class="af-real-dot"
              data-af="cluster"
              data-group="${e(row.label)}"
              data-id="${e(id)}"
              aria-pressed="${selected ? 'true' : 'false'}"
              title="${e(description)}"
              aria-label="${e(description)}"
              style="--dot-color: ${e(pcolor(id))}; --dot-size: ${e(size.toFixed(2))}px;"
            >${count === 0 ? '—' : e(format(count))}</button>
          </td>
        `;
      }).join('');

      return `
        <tr>
          <th scope="row">
            ${e(row.label)}
            <small>${e(format(row.total))} participaciones</small>
          </th>
          <td>${e(format(row.total))}</td>
          ${cells}
        </tr>
      `;
    }).join('');

    content = `
      <div
        class="af-spectrum-scroll"
        tabindex="0"
        role="region"
        aria-label="${e(`Tabla de afinidad principal por ${labels[dimension]}`)}"
      >
        <p class="af-scroll-hint">Desliza la tabla para ver todos los partidos →</p>
        <table class="af-real-table">
          <caption>${e(`Afinidad principal por ${labels[dimension]}`)}</caption>
          <thead>
            <tr>
              <th scope="col">${e(labels[dimension])}</th>
              <th scope="col" aria-label="Número de participaciones">n</th>
              ${headings}
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    `;
  }

  let detail = '';

  if (selection) {
    const row = total > 0
      ? rows.find(item => item.label === selection.group)
      : null;
    const validId = ids.includes(selection.id);

    if (row && validId) {
      const count = row.counts[selection.id];
      detail = `
        <div role="status">
          <h3>Detalle de la selección</h3>
          <p>
            ${e(row.label)} — ${e(names[selection.id])}:
            ${e(format(count))} de ${e(format(row.total))}
            (${e(percentage(count, row.total))}%).
          </p>
          ${row.total === 0 ? '<p>Este grupo no tiene respuestas.</p>' : ''}
        </div>
      `;
    } else {
      detail = `
        <p role="status">
          La selección «${e(selection.group)}»,
          «${e(validId ? names[selection.id] : selection.id)}»
          no tiene un detalle disponible en esta vista.
        </p>
      `;
    }
  }

  return `
    <section class="af-stats af-real-stats" aria-label="Afinidad de quienes participan" aria-busy="${loading ? 'true' : 'false'}">
      ${header}
      <p>Total de participaciones: <strong>${e(format(total))}</strong></p>
      ${smallSample}
      ${timestamp}
      ${warning}
      ${progress}
      ${content}
      ${detail}
      ${explanation}
    </section>
  `;
}
function leaders(a){const r=ranked(a).filter(p=>p.eligible);return r.length?r.filter(p=>r[0].raw-p.raw<=5).map(p=>p.id):[];}
window.AffinityCore.leaders=leaders;
function ranked(a){return score(a).sort((a,b)=>(b.raw??-1)-(a.raw??-1)||a.id.localeCompare(b.id));}
function profile(a){const rows=ranked(a);return {version:data.version,answered:answered(a).length,undecided:qs.filter(q=>Object.hasOwn(a,q.id)&&a[q.id]===null).map(q=>q.id),affinities:rows.map(p=>({party:p.id,score:p.value,coverage:p.coverage,range:[p.lower,p.upper]})),near:leaders(a)};}
window.AffinityCore.profile=profile;
function resultRow(p,i){return `<button class="af-fila" data-af="party" data-id="${p.id}"><span class="af-place">${i}</span><span class="af-fila-nom">${partyTag(p)}<small>${p.n} de ${p.total} con evidencia${!p.eligible?' · puntuación provisional · base limitada':''}</small></span>${affinityRing(p.value,44,4)}<span class="af-ir" aria-hidden="true">→</span></button>`;}
function face(p,big){const people=leaderImages[p.id];return `<div class="af-foto${big?' af-foto-xl':''}${people&&people.length>1?' af-foto-duo':''}" style="--c:${p.color}">${people?people.map(([key,name])=>`<img src="/recursos/comparador-electoral-29n/assets/characters/${key}.png" alt="Ilustración de ${escape(name)}">`).join(''):`<span>${escape(p.corto.slice(0,2))}</span>`}</div>`;}
function podiumCard(p,i){const people=leaderImages[p.id];return `<button class="af-podio-card${i===1?' af-oro':''}" data-af="party" data-id="${p.id}" style="--c:${p.color}"><span class="af-pos">${i}º</span>${face(p,i===1)}${people?`<span class="af-quien">${people.map(x=>escape(x[1])).join(' y ')}</span>`:''}<div class="af-podio-tag">${partyTag(p)}</div><div class="af-podio-ring">${affinityRing(p.value,i===1?92:68,i===1?8:6)}</div><small>${p.n} de ${p.total} respuestas con evidencia${!p.eligible?' · puntuación provisional · base limitada':''}</small><span class="af-ver">Ver por qué →</span></button>`;}
const leaderImages={salf:[['alvise','Alvise Pérez']],psoe:[['sanchez','Pedro Sánchez']],pp:[['feijoo','Alberto Núñez Feijóo']],vox:[['abascal','Santiago Abascal']],frenteamplio:[['colau','Ada Colau']],podemos:[['montero-rufian','Irene Montero y Gabriel Rufián']]};
function leaderPortrait(id){const people=leaderImages[id];return people?`<figure class="af-leaders ${id==='podemos'?'af-leaders-duo':''}"><div>${people.map(([key,name])=>`<img src="/recursos/comparador-electoral-29n/assets/characters/${key}.png" alt="Ilustración IA de ${escape(name)}" width="330" height="330">`).join('')}</div><figcaption>${people.map(x=>escape(x[1])).join(' · ')}</figcaption></figure>`:'';}
function results(){const snapshot=state.finalResult,r=snapshot?.rows||ranked(state.answers),ids=snapshot?.near||leaders(state.answers),validCount=snapshot?.answered??answered(state.answers).length,pending=qs.length-validCount,near=r.filter(p=>ids.includes(p.id)),first=near[0],tied=near.length>1&&near.every(p=>Math.abs(p.raw-near[0].raw)<1e-9);
const top=r.slice(0,3),rest=r.slice(3);
const flojo=first&&first.value<80;const aviso=flojo?`<div class="af-nota af-flojo"><b>Ningún partido encaja claramente contigo.</b> El que más se acerca coincide contigo en ${first.coin} de cada 100 puntos posibles: en unas ideas estás con unos y en otras con otros. Mira tu sitio en el mapa, más abajo.</div>`:first?(near.length>1?`<p class="af-nota">${tied?'Empate':'Muy cerca'}: ${near.map(p=>partyTag(p)).join(' ')} ${tied?'tienen la misma puntuación.':'están a cinco puntos o menos; no hay una diferencia clara.'}</p>`:''):`<div class="af-nota"><b>${validCount<12?'Faltan respuestas para situarte.':'Falta evidencia para destacar un partido.'}</b> ${validCount<12?'Responde al menos 12 preguntas. Las dudas no te asignan una posición.':'Puedes consultar las puntuaciones provisionales y las fuentes de cada partido.'}</div>`;
const podio=[top[1],top[0],top[2]].map((p,k)=>p?podiumCard(p,[2,1,3][k]):'').join('');
return shell(`<section class="cab af-res-cab"><h1 tabindex="-1" id="af-focus">Tus ideas, más allá de las siglas</h1><div class="af-res-meta"><span><b>${validCount}</b> respuestas</span><span><b>${pending}</b> sin postura</span><span>Afinidad de 0 a 100, igualada entre partidos · no es intención de voto</span></div></section>
${aviso}<div class="af-export-bar">${button('export-card','Descargar mi afinidad','primary')}<span class="af-micro">Tarjeta vertical para redes · PNG · vista previa</span></div><div class="af-podio">${podio}</div>
${rest.length?`<details class="acord af-resto"><summary>Ver el resto de partidos (${rest.length})${CHEV}</summary><div class="in"><div class="af-filas">${rest.map((p,i)=>resultRow(p,i+4)).join('')}</div><p class="af-micro">Las preguntas sin evidencia no suman puntos ni se rellenan. Los empates no se deshacen: entre iguales, orden alfabético.</p></div></details>`:''}
${mapa()}
${highlightPanel()}
<div id="af-live-stats">${statistics()}</div>
${remote.saved?`<p class="af-micro" role="status">${remote.duplicate?'Esta pestaña ya había aportado datos; no se han contado dos veces.':'Tu aportación ya forma parte de las estadísticas.'}</p>`:''}

<div class="af-bottom"><a class="txt" href="#/metodo">Cómo se calcula</a>${button('restart','Volver a empezar','text')}</div>`);}
function highlightPanel(){
  const h=state.finalResult?.highlights;if(!h?.partyId)return '';
  const column=(title,items,kind)=>`<div class="af-highlight-column"><h3>${title}</h3>${items.length?items.map(q=>`<div class="af-highlight-item"><p><b>${escape(q.answer)}</b> · ${escape(q.text)}</p><div class="af-credit" role="img" aria-label="Coincidencia: ${q.credit} de 4"><i class="${kind}" style="width:${q.credit*25}%"></i></div><small>${q.credit}/4 de coincidencia</small></div>`).join(''):'<p class="af-micro">No hay preguntas con una coincidencia '+(kind==='close'?'alta':'baja')+' documentada.</p>'}${items.length>0&&items.length<3?'<p class="af-micro">No hay más casos claros en tus respuestas.</p>':''}</div>`;
  return `<section class="af-comparar af-highlights"><h2>Tus puntos de encuentro y de distancia</h2><p class="af-micro">Comparación con <b>${escape(h.partyName)}</b>, la primera afinidad con base suficiente.${state.finalResult.primary==='tie'?' Hay partidos a cinco puntos o menos: no es un ganador único.':''}</p><div class="af-highlight-grid">${column('Esto os acerca',h.close,'close')}${column('Esto os separa',h.far,'far')}</div></section>`;
}
const shareCard={url:null,blob:null,busy:false,generation:0};
function clearShareCard(){
  shareCard.generation++;shareCard.busy=false;shareCard.blob=null;
  if(shareCard.url)URL.revokeObjectURL(shareCard.url);shareCard.url=null;
  document.getElementById('af-export')?.remove();
}
async function openShareCard(){
  const snapshot=state.finalResult;if(!snapshot||shareCard.busy)return;
  clearShareCard();const generation=shareCard.generation;shareCard.busy=true;
  const dlg=document.createElement('dialog');dlg.id='af-export';dlg.setAttribute('aria-labelledby','af-export-title');
  dlg.innerHTML=`<div class="dh"><h2 id="af-export-title">Tu afinidad para compartir</h2><button class="x" data-af="close-export" aria-label="Cerrar tarjeta">×</button></div><div class="db af-export-body"><p role="status">Preparando tu tarjeta…</p></div>`;
  dlg.addEventListener('close',clearShareCard);document.body.append(dlg);dlg.showModal();
  try{
    const notice=snapshot.primary==='none'?(snapshot.answered<12?'Sin base suficiente: responde al menos 12 preguntas.':'Sin base suficiente: falta cobertura documentada.'):snapshot.primary==='tie'?'Sin diferencia clara entre las primeras afinidades.':'Afinidad de 0 a 100 · no es intención de voto';
    const model={rows:snapshot.rows.map(({id,corto,color,value,eligible})=>({id,corto,color,value,eligible})),answered:snapshot.answered,primary:snapshot.primary,coords:snapshot.coords,highlights:snapshot.highlights,
      partyCoords:parties.map(p=>{const c=coordsParty(p.id);return {id:p.id,name:p.corto,color:p.color,x:c.x.v,y:c.y.v};}),
      portraits:Object.fromEntries(Object.entries(leaderImages).map(([id,people])=>[id,`/recursos/comparador-electoral-29n/assets/characters/${people[0][0]}.png`])),notice};
    if(!window.AffinityShare?.render)throw new Error('renderer');
    const {blob}=await window.AffinityShare.render(model);
    if(generation!==shareCard.generation||snapshot!==state.finalResult||!dlg.isConnected)return;
    shareCard.blob=blob;shareCard.url=URL.createObjectURL(blob);
    const file=new File([blob],'mi-afinidad-29n.png',{type:'image/png'});
    let canShare=false;try{canShare=typeof navigator.canShare==='function'&&navigator.canShare({files:[file]});}catch{/* Download remains available. */}
    dlg.querySelector('.db').innerHTML=`<p class="af-micro">Se crea en tu dispositivo. Incluye hasta seis respuestas destacadas; revísala antes de compartir. No contiene sexo, edad ni renta.</p><div class="af-export-actions"><a class="btn" href="${shareCard.url}" download="mi-afinidad-29n.png">Descargar PNG</a>${canShare?button('share-card','Compartir imagen','secondary'):''}</div><p class="af-micro" id="af-export-status" role="status">1080 × 1920 · lista para historias y redes</p><img class="af-export-preview" src="${shareCard.url}" alt="Vista previa de tu tarjeta: las tres primeras afinidades, tu mapa y hasta tres coincidencias y diferencias">`;
  }catch{
    if(generation===shareCard.generation&&dlg.isConnected)dlg.querySelector('.db').innerHTML=`<p role="alert">No se ha podido preparar la imagen. Tu resultado sigue disponible.</p>${button('export-card','Volver a intentarlo','primary')}`;
  }finally{if(generation===shareCard.generation)shareCard.busy=false;}
}
async function shareImage(){
  if(!shareCard.blob)return;
  try{await navigator.share({files:[new File([shareCard.blob],'mi-afinidad-29n.png',{type:'image/png'})],title:'Mi afinidad · Comparador 29N'});}
  catch(error){if(error.name!=='AbortError'){const el=document.getElementById('af-export-status');if(el)el.textContent='No se ha podido abrir el menú de compartir. Puedes descargar el PNG.';}}
}

// Mapa: dos ejes calculados con las mismas preguntas para ti y para cada partido.
// x: progresista (-) / conservador (+); y: más Estado en la economía (-) / más mercado (+).
const EJES={x:{burka:1,regularizacion:-1,'sanidad-acceso':-1,'prision-revisable':1,eutanasia:-1,'matrimonio-igualitario':-1,'violencia-genero':-1},y:{'condiciones-laborales':-1,'ayudas-sociales':-1,autonomos:1,jornada:-1,alquiler:-1,patrimonio:-1,sucesiones:-1,conciertos:-1,'sanidad-colaboracion':1,turismo:-1,infantil:-1}};
function eje(dir,val){let s=0,n=0;for(const q of qs){const d=dir[q.id];if(!d)continue;const v=val(q);if(v===null||v===undefined)continue;s+=v*d;n++;}return {v:s/(n+1),n};}
function coords(a){return {x:eje(EJES.x,q=>a[q.id]===1?1:a[q.id]===0?-1:null),y:eje(EJES.y,q=>a[q.id]===1?1:a[q.id]===0?-1:null)};}
function coordsParty(id){const f=q=>{const s=q.positions[id]?.support;return Number.isFinite(s)?(s-2)/2:null;};return {x:eje(EJES.x,f),y:eje(EJES.y,f)};}
window.AffinityCore.coords=coords;window.AffinityCore.coordsParty=coordsParty;
function mapa(){const W=640,H=480,L=34,R=W-34,T=40,B=H-96,sx=v=>L+14+(v+1)*(R-L-28)/2,sy=v=>T+14+(1-v)*(B-T-28)/2,yo=state.finalResult?.coords||coords(state.answers),ok=yo.x.n>=3&&yo.y.n>=3;
const ps=parties.map(p=>({p,c:coordsParty(p.id)})).filter(o=>o.c.x.n&&o.c.y.n);const cerca=ok?[...ps].sort((a,b)=>Math.hypot(a.c.x.v-yo.x.v,a.c.y.v-yo.y.v)-Math.hypot(b.c.x.v-yo.x.v,b.c.y.v-yo.y.v))[0]:null;
const cajas=[];if(ok)cajas.push([sx(yo.x.v)-20,sy(yo.y.v)-20,40,40]);for(const o of ps)cajas.push([sx(o.c.x.v)-11,sy(o.c.y.v)-11,22,22]);
const choque=(r)=>cajas.some(c=>r[0]<c[0]+c[2]&&r[0]+r[2]>c[0]&&r[1]<c[1]+c[3]&&r[1]+r[3]>c[1]);
const dot=o=>{const x=sx(o.c.x.v),y=sy(o.c.y.v),w=o.p.corto.length*7.6+6,h=16;const op=[[0,-17,'middle',[x-w/2,y-31,w,h]],[0,27,'middle',[x-w/2,y+15,w,h]],[15,5,'start',[x+13,y-8,w,h]],[-15,5,'end',[x-13-w,y-8,w,h]]];const c=op.find(z=>!choque(z[3]))||op[0];cajas.push(c[3]);return `<g class="af-mp" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="10" fill="${o.p.color}"/><text x="${c[0]}" y="${c[1]}" text-anchor="${c[2]}">${escape(o.p.corto)}</text></g>`;};
return `<section class="af-mapa"><div class="af-section-head"><h2>Tu sitio en el mapa</h2></div><p class="af-context">Dos ejes calculados con tus respuestas y con las de los partidos a las mismas preguntas. No es su ideología oficial, sino dónde los colocan estas preguntas.</p>
<div class="af-mapa-box"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa ideológico con tu posición y la de los partidos">
<defs><linearGradient id="afgx" x1="0" x2="1"><stop offset="0" stop-color="${pcolor('podemos')}"/><stop offset=".25" stop-color="${pcolor('frenteamplio')}"/><stop offset=".38" stop-color="${pcolor('psoe')}"/><stop offset=".5" stop-color="var(--ink3)"/><stop offset=".68" stop-color="${pcolor('pp')}"/><stop offset="1" stop-color="${pcolor('vox')}"/></linearGradient></defs>
<text class="af-mp-l" x="${W/2}" y="${T-12}" text-anchor="middle">↑ Más mercado, menos Estado</text>
<rect x="${L}" y="${T}" width="${R-L}" height="${B-T}" rx="14" class="af-mp-fondo"/>
<line x1="${W/2}" y1="${T}" x2="${W/2}" y2="${B}" class="af-mp-eje"/><line x1="${L}" y1="${(T+B)/2}" x2="${R}" y2="${(T+B)/2}" class="af-mp-eje"/>
<text class="af-mp-q" x="${L+12}" y="${T+20}">Liberal</text><text class="af-mp-q" x="${R-12}" y="${T+20}" text-anchor="end">Derecha liberal</text><text class="af-mp-q" x="${L+12}" y="${B-12}">Izquierda</text><text class="af-mp-q" x="${R-12}" y="${B-12}" text-anchor="end">Derecha con más Estado</text>
${ps.map(dot).join('')}
${ok?`<g class="af-mp-yo" transform="translate(${sx(yo.x.v).toFixed(1)} ${sy(yo.y.v).toFixed(1)})"><circle r="20" class="af-mp-halo"/><circle r="12"/><text y="4" text-anchor="middle">Tú</text></g>`:''}
<rect x="${L}" y="${B+16}" width="${R-L}" height="7" rx="3.5" fill="url(#afgx)"/>
<text class="af-mp-l" x="${L}" y="${B+44}">← Progresista</text><text class="af-mp-l" x="${W/2}" y="${B+44}" text-anchor="middle">Centro</text><text class="af-mp-l" x="${R}" y="${B+44}" text-anchor="end">Conservador →</text>
<text class="af-mp-l" x="${W/2}" y="${H-10}" text-anchor="middle">↓ Más Estado en la economía</text>
</svg></div>
${ok?(cerca?`<p class="af-nota">En el mapa, el partido más cercano a ti es ${partyTag(cerca.p)}</p>`:''):'<p class="af-nota">Responde con sí o no a más preguntas para situarte en el mapa.</p>'}
<details class="acord"><summary>Cómo se calcula el mapa${CHEV}</summary><div class="in"><p><b>Eje horizontal</b> (progresista ↔ conservador): ${Object.keys(EJES.x).map(id=>escape(qs.find(q=>q.id===id)?.topic||id)).join(', ')}. <b>Eje vertical</b> (más Estado ↔ más mercado): ${Object.keys(EJES.y).map(id=>escape(qs.find(q=>q.id===id)?.topic||id)).join(', ')}.</p><p>Cada sí o no suma o resta en su eje. Para los partidos se usa su postura documentada en cada pregunta (la misma que en el resto de Afinidad). Si de un partido hay pocas posturas documentadas, su punto se acerca al centro: es una forma de no exagerar lo que no sabemos.</p><p>Los bordes del mapa no son «extrema izquierda» ni «extrema derecha»: solo indican que en estas preguntas se eligió siempre la misma opción. El nacionalismo y el independentismo no aparecen porque ninguna pregunta trata el modelo territorial.</p></div></details></section>`;}
function openInfo(){const q=qs[state.step];let dlg=document.getElementById('af-info');if(!dlg){dlg=document.createElement('dialog');dlg.id='af-info';document.body.append(dlg);dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});}dlg.setAttribute('aria-labelledby','af-info-title');dlg.innerHTML=`<div class="dh"><div class="sup"><span>${escape(q.topic)}</span></div><button class="x" data-af="close-info" aria-label="Cerrar información">×</button></div><div class="db"><div class="dtop"><h2 id="af-info-title">El contexto de la pregunta</h2>${q.info.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}${q.info.sources.length?`<div class="fte">${q.info.sources.map(s=>`<p><a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(s.title)} ↗</a></p>`).join('')}</div>`:''}</div></div>`;dlg.showModal();}
function openParty(id){
  const p=(state.finalResult?.rows||score(state.answers)).find(p=>p.id===id);if(!p)return;
  let dlg=document.getElementById('af-ficha');if(!dlg){dlg=document.createElement('dialog');dlg.id='af-ficha';document.body.append(dlg);dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});}
  dlg.setAttribute('aria-labelledby','af-dialog-title');
  dlg.innerHTML=`<div class="dh"><div class="sup">${partyTag(p)}<span>Afinidad</span></div><button class="x" data-af="close-party" aria-label="Cerrar">×</button></div><div class="db"><div class="dtop af-modal-top"><h2 id="af-dialog-title">Tu afinidad y las posturas de ${escape(p.corto)}</h2><div class="af-modal-score">${affinityRing(p.value,84,8)}<p>${p.value===null?'Sin respuestas suficientes para calcular la afinidad.':`Afinidad ${p.value} de 100. Coincidís en ${p.coin} de cada 100 puntos posibles, en ${p.n} preguntas con postura documentada.`}</p></div><p>El conjunto completo de respuestas ya se ha borrado; solo queda el resumen de la tarjeta en esta pestaña. Aquí puedes consultar las posturas y fuentes del partido.</p></div><section class="pan"><ol class="pasos">${qs.map((q,i)=>{const pos=q.positions[id],known=Number.isFinite(pos?.support);return `<li><span class="nodo">${i+1}</span><h3>${escape(q.topic)} · ${known?'Postura documentada':'Sin evidencia suficiente'}</h3><div class="caja"><h4 class="af-step-question">${escape(q.text)}</h4><p>${escape(pos.reason)}</p>${known?`<p class="fte">Apoyo estimado al sí: ${pos.support}/4. ${consenso.has(q.id)?'Los partidos piensan parecido: esta pregunta no cuenta para el ranking.':''}</p>`:'<p class="fte">No atribuimos una postura ni rellenamos la ausencia de evidencia.</p>'}${pos.evidence.map(e=>`${e.quote?`<div class="cita" style="--c:${p.color}">«${escape(e.quote)}»</div>`:''}<div class="fte"><a href="${escape(e.url)}${e.page?'#page='+e.page:''}" target="_blank" rel="noopener">${escape(e.title)}${e.page?' · pág. '+e.page:''} ↗</a></div>`).join('')}</div></li>`;}).join('')}</ol></section></div>`;dlg.showModal();
}
window.vAfinidad=()=>({intro,question,demographic,results}[state.phase]());
function render(focus=true){if(!location.hash.startsWith('#/afinidad'))return;document.getElementById('app').innerHTML=window.vAfinidad();if(focus){window.scrollTo({top:0,behavior:'instant'});document.getElementById('af-focus')?.focus({preventScroll:true});}}
function resetQuestionnaire(){if(remote.sending)return;clearShareCard();state.phase='question';state.step=0;state.answers={};state.finalResult=null;state.demographics={};remote.pending=null;remote.consent=false;remote.error='';}
document.addEventListener('click',e=>{
  if(e.target.closest('.afinidad-puerta'))resetQuestionnaire();
  const b=e.target.closest('[data-af]');if(!b||b.disabled)return;
  switch(b.dataset.af){
    case'export-card':void openShareCard();return;
    case'close-export':document.getElementById('af-export')?.close();return;
    case'share-card':void shareImage();return;
    case'info':openInfo();return;
    case'close-info':document.getElementById('af-info')?.close();return;
    case'party':openParty(b.dataset.id);return;
    case'close-party':document.getElementById('af-ficha')?.close();return;
    case'back':if(state.step)state.step--;else{location.hash='#/';return;}break;
    case'next':if(!Object.hasOwn(state.answers,qs[state.step].id))return;if(state.step<qs.length-1)state.step++;else finishQuestionnaire();break;
    case'answer':state.answers[qs[state.step].id]=b.dataset.value==='skip'?null:Number(b.dataset.value);if(state.step<qs.length-1)state.step++;else finishQuestionnaire();break;
    case'demo-pick':if(remote.sending||remote.pending||!Object.hasOwn(sets,b.dataset.key)||!sets[b.dataset.key].includes(b.dataset.value))return;state.demographics[b.dataset.key]=b.dataset.value;remote.pending=null;remote.error='';render(false);return;
    case'demo-go':void submitContribution();return;
    case'skip-demo':if(remote.sending)return;state.demographics={};remote.pending=null;remote.consent=false;remote.error='';state.phase='results';startStatistics();break;
    case'restart':resetQuestionnaire();break;
    case'dimension':if(!Object.hasOwn(sets,b.dataset.key))return;state.dimension=b.dataset.key;state.spectrumSelection=null;paintStatistics();return;
    case'cluster':state.spectrumSelection={group:b.dataset.group,id:b.dataset.id};paintStatistics();return;
    case'refresh-stats':void loadStatistics();return;
    default:return;
  }
  render();
});
document.addEventListener('change',e=>{if(e.target.id==='af-share-consent'){remote.consent=e.target.checked;render(false);}});
window.addEventListener?.('pageshow',event=>{if(event.persisted){remote.sending=false;resetQuestionnaire();render();}});
window.addEventListener?.('pagehide',()=>{clearShareCard();state.answers={};state.finalResult=null;state.demographics={};remote.pending=null;remote.abort?.abort();if(remote.timer)clearInterval(remote.timer);remote.timer=null;});
})();
