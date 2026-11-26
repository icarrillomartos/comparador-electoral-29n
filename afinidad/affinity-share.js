/* Social card: drawn locally. No questionnaire answers are sent to a service. */
(()=>{
'use strict';
const W=1080,H=1920,C={bg:'#0d0f13',card:'#171a20',line:'#2a2e37',ink:'#f1f3f6',muted:'#b3bac7',blue:'#7eb6ff',green:'#77c9b6',red:'#eea6a4'};
function loadPortrait(src){return new Promise(resolve=>{if(!src)return resolve(null);let img=new Image(),timer=setTimeout(()=>resolve(null),5000);img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);resolve(null);};img.src=src;});}
async function render(model){
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
  const top=model.rows.slice(0,3),images=await Promise.all(top.map(p=>loadPortrait(model.portraits[p.id])));
  const font=(size,weight=500)=>{ctx.font=`${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;};
  function text(value,x,y,size=24,color=C.ink,weight=500,align='left'){font(size,weight);ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y);}
  function lines(value,width,size,weight=500){font(size,weight);const out=[];for(const para of String(value).split('\n')){let line='';for(const word of para.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){out.push(line);line=word;}else line=next;}out.push(line);}return out;}
  function fit(value,x,y,width,height,max=26,min=18,color=C.ink,weight=500){
    for(let size=max;size>=min;size--){const arr=lines(value,width,size,weight),lh=size*1.3;if(arr.length*lh<=height&&arr.every(v=>{font(size,weight);return ctx.measureText(v).width<=width;})){arr.forEach((v,i)=>text(v,x,y+i*lh,size,color,weight));return arr.length*lh;}}
    throw new Error('Text does not fit social card');
  }
  function box(x,y,w,h,fill=C.card,r=24,stroke=C.line){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=2;ctx.strokeStyle=stroke;ctx.stroke();}}
  function line(x1,y1,x2,y2,color=C.line,width=2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function circle(x,y,r,fill,stroke=null,width=2){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  text('Comparador',56,44,28,C.ink,800);box(229,40,82,43,C.ink,12,null);text('29N',270,45,28,C.bg,900,'center');
  text('MI AFINIDAD',1024,50,22,C.muted,700,'right');
  text('Mis ideas,',56,112,64,C.ink,850);text('más allá de las siglas.',56,185,64,C.ink,850);
  fit(`${model.answered}/25 respuestas · ${model.notice}`,56,267,968,54,22,19,C.muted,500);
  const order=[1,0,2],cw=306,gap=25;
  order.forEach((i,col)=>{
    const p=top[i];if(!p)return;const x=56+col*(cw+gap),y=i===0?336:360,h=i===0?274:250,mid=x+cw/2;
    box(x,y,cw,h,C.card,24);line(x+22,y+2,x+cw-22,y+2,p.color,5);
    text(String(i+1).padStart(2,'0'),x+18,y+14,20,C.muted,750);
    const cy=y+77,r=i===0?53:45;circle(mid,cy,r,C.bg,p.color,3);
    const image=images[i];if(image){ctx.save();ctx.beginPath();ctx.arc(mid,cy,r-3,0,Math.PI*2);ctx.clip();const side=r*2;ctx.drawImage(image,mid-r,cy-r,side,side);ctx.restore();}else text(p.corto.slice(0,2),mid,cy-17,30,C.ink,800,'center');
    font(29,800);let size=29;while(ctx.measureText(p.corto).width>cw-28&&size>20)font(--size,800);
    text(p.corto,mid,y+139,size,C.ink,800,'center');
    const valid=model.primary!=='none'&&p.value!==null;
    text(valid?String(p.value):'Sin base',mid,y+180,valid?46:30,valid?C.blue:C.muted,800,'center');
    text(valid?(p.eligible?'afinidad / 100':'provisional · base limitada'):'no es un resultado',mid,y+h-30,17,C.muted,500,'center');
  });
  // Both axes use the exact normalized coordinates from the site's scoring core.
  box(56,640,968,450);text('Mi sitio en el mapa',82,663,32,C.ink,800);
  const L=125,R=955,T=756,B=952,cx=(L+R)/2,cy=(T+B)/2;
  const sx=v=>L+(Math.max(-1,Math.min(1,v))+1)*(R-L)/2;
  const sy=v=>T+(1-Math.max(-1,Math.min(1,v)))*(B-T)/2;
  text('Más mercado · menos Estado ↑',540,714,21,C.muted,600,'center');
  ctx.fillStyle='#1b2029';ctx.fillRect(L,T,(R-L)/2,(B-T)/2);ctx.fillStyle='#1d2427';ctx.fillRect(cx,cy,(R-L)/2,(B-T)/2);
  ctx.setLineDash([5,7]);line(cx,T,cx,B,'#465064');line(L,cy,R,cy,'#465064');ctx.setLineDash([]);
  const pointOrder=[...model.partyCoords].sort((a,b)=>a.id.localeCompare(b.id));
  pointOrder.forEach((p,i)=>{const x=sx(p.x),y=sy(p.y);circle(x,y,12,p.color,C.bg,2);text(i+1,x,y-10,16,'#fff',800,'center');});
  const enough=model.coords.x.n>=3&&model.coords.y.n>=3;
  if(enough){const x=sx(model.coords.x.v),y=sy(model.coords.y.v);circle(x,y,23,'rgba(255,255,255,0.12)',C.ink,2);circle(x,y,16,C.ink);text('Tú',x,y-11,17,C.bg,900,'center');}
  else text('Faltan respuestas para situarme',540,843,24,C.ink,650,'center');
  text('← Progresista',125,970,20,C.muted,600);text('Conservador →',955,970,20,C.muted,600,'right');
  text('↓ Más Estado en la economía',540,1001,20,C.muted,600,'center');
  pointOrder.forEach((p,i)=>{const x=84+i*155;circle(x+7,1055,7,p.color);fit(`${i+1} ${p.name}`,x+21,1045,130,28,18,14,C.muted,650);});
  text('Dónde conecto. Dónde discrepo.',56,1123,38,C.ink,800);
  const h=model.highlights||{close:[],far:[],partyName:''};
  fit(h.partyName?`Primera afinidad con base suficiente: ${h.partyName}${model.primary==='tie'?' · sin un ganador único':''}`:'Sin base suficiente para destacar preguntas',56,1173,968,48,24,19,C.muted,550);
  function questionColumn(items,title,x,accent){
    const y=1229,w=472,height=574;box(x,y,w,height);text(title,x+22,y+22,29,accent,800);
    if(!items.length){fit('No hay preguntas con una '+(title==='Esto nos acerca'?'coincidencia alta':'diferencia clara')+' documentada para este resultado.',x+22,y+86,w-44,180,26,22,C.muted);return;}
    // Allocate each question space in proportion to its actual wrapped length.
    let chosen=null;
    for(let size=25;size>=16;size--){const rows=items.map(q=>({q,arr:lines(q.text,w-44,size,500)}));const total=rows.reduce((n,r)=>n+r.arr.length*size*1.27+60,0);if(total<=470){chosen={rows,size,total};break;}}
    if(!chosen)throw new Error('Questions too long for social card');
    let py=y+78;const extra=(470-chosen.total)/items.length;
    chosen.rows.forEach(({q,arr},i)=>{
      text(`${q.topic.toUpperCase()} · YO: ${q.answer.toUpperCase()}`,x+22,py,17,accent,750);py+=26;
      arr.forEach(v=>{text(v,x+22,py,chosen.size,C.ink,500);py+=chosen.size*1.27;});py+=10;
      box(x+22,py,120,6,C.line,3,null);if(q.credit>0)box(x+22,py,120*q.credit/4,6,accent,3,null);
      text(`${q.credit}/4 coincidencia`,x+154,py-8,16,C.muted);py+=24+extra;
      if(i<items.length-1)line(x+22,py-7,x+w-22,py-7,C.line,1);
    });
    if(items.length<3)text('No hay más casos claros.',x+22,y+height-28,17,C.muted);
  }
  questionColumn(h.close||[],'Esto nos acerca',56,C.green);questionColumn(h.far||[],'Esto nos separa',552,C.red);
  text('Afinidad interpretativa · no es intención de voto',540,1833,22,C.muted,500,'center');
  text('ivancarrillo.com  /  Comparador 29N',540,1872,26,C.ink,750,'center');
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG export failed')),'image/png'));
  return {blob,width:W,height:H};
}
window.AffinityShare={render};
})();
