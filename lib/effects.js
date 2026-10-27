// Efectos del navegador portados de la maqueta (menú desplegable, puntero en cinta y frases con clic derecho).
// Código imperativo: se ejecuta en el cliente sobre el HTML que ya genera el servidor.
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

export function initNav(){
  const nav=$('#nav'),mp=$('#mpanel'),menu=$('#menu');
  const dds=()=>$$('.ddbtn',nav);
  const closeAll=except=>dds().forEach(b=>{if(b!==except){b.setAttribute('aria-expanded','false');b.nextElementSibling.hidden=true}});
  let openedAt=0;const openDD=b=>{closeAll(b);b.setAttribute('aria-expanded','true');b.nextElementSibling.hidden=false;openedAt=performance.now()};
  const setMobile=o=>{mp.hidden=!o;menu.setAttribute('aria-expanded',o);menu.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')};
  const hoverOK=matchMedia('(hover:hover)');let t;const sched=(fn,ms)=>{clearTimeout(t);t=setTimeout(fn,ms)};
  nav.addEventListener('click',e=>{const b=e.target.closest('.ddbtn');if(!b)return;if(b.getAttribute('aria-expanded')==='true'&&performance.now()-openedAt>400)closeAll();else openDD(b)});
  /* hover con intención: retardo para abrir/cambiar, el panel mantiene abierto y salir tiene margen */
  nav.addEventListener('mouseover',e=>{if(!hoverOK.matches)return;
    const btn=e.target.closest('.ddbtn');
    if(e.target.closest('.ddpanel')){clearTimeout(t);return}
    if(btn){if(btn.getAttribute('aria-expanded')==='true'){clearTimeout(t);return}
      const abierto=dds().some(b=>b.getAttribute('aria-expanded')==='true');
      sched(()=>openDD(btn),abierto?160:70);return}
    if(e.target.closest('.dd')){clearTimeout(t);return}
    sched(()=>closeAll(),240)});
  nav.addEventListener('mouseleave',()=>{if(hoverOK.matches)sched(()=>closeAll(),280)});
  nav.addEventListener('focusout',e=>{if(!nav.contains(e.relatedTarget))closeAll()});
  menu.onclick=()=>setMobile(mp.hidden);
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const o=dds().find(b=>b.getAttribute('aria-expanded')==='true');if(o){closeAll();o.focus()}if(!mp.hidden){setMobile(false);menu.focus()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeAll();if(!mp.hidden&&!e.target.closest('#mpanel,#menu'))setMobile(false)});
  window.__closeNav=()=>{closeAll();setMobile(false)};
  /* indicador deslizante bajo el enlace actual o el que se señala */
  const blob=nav.querySelector('.blob');const cur=()=>nav.querySelector('[data-nav][aria-current="page"]');
  function to(el){if(!el||!el.offsetWidth){blob.style.opacity=0;return}const r=el.getBoundingClientRect(),n=nav.getBoundingClientRect();blob.style.opacity=1;blob.style.left=(r.left-n.left)+'px';blob.style.top=(r.top-n.top)+'px';blob.style.width=r.width+'px'}
  nav.addEventListener('mouseover',e=>{const el=e.target.closest('[data-nav]');if(el&&hoverOK.matches)to(el)});
  nav.addEventListener('focusin',e=>{const el=e.target.closest('[data-nav]');if(el)to(el)});
  nav.addEventListener('mouseleave',()=>to(cur()));
  nav.addEventListener('focusout',()=>to(cur()));
  addEventListener('resize',()=>to(cur()));
  window.__blob=()=>to(cur());
}

/* ---------- puntero en cinta + frases con clic derecho ---------- */
const TIPS=["Ocho provincias. Una sola guía.","Cada dato, con su fecha y su fuente.","Aquí no hay reseñas compradas ni estrellas inventadas.","Un dato sin fecha es un rumor.","Comprobamos antes de publicar. Despacio, pero bien.","El orden de las fichas no es una clasificación.","Verificada, comprobada, externa o pendiente: siempre sabrás cuál.","Sin precios ni disponibilidad inventados.","Andalucía tiene costa en el Atlántico y en el Mediterráneo.","Sierra Nevada guarda el pico más alto de la península: el Mulhacén.","En Granada, en muchos bares la bebida viene con tapa.","La Alhambra se ve mejor desde el Albaicín.","Doñana, uno de los humedales más importantes de Europa.","La Mezquita-Catedral de Córdoba lleva más de mil años a la vista.","Jaén es tierra de olivos hasta donde alcanza la vista.","Úbeda y Baeza son Patrimonio Mundial.","Cádiz, una de las ciudades más antiguas de Occidente.","Cabo de Gata: calas, volcanes y poco bullicio.","Las casas cueva de Guadix mantienen la temperatura todo el año.","Sevilla huele a azahar en primavera.","Málaga: aquí nació Picasso.","Huelva tiene playas larguísimas y fresas de temporada.","El flamenco es Patrimonio Inmaterial de la Humanidad.","La Alpujarra: pueblos blancos escalonados en la montaña.","Salmorejo, gazpacho y ajoblanco no son lo mismo.","Pescaíto frito: se pide por raciones y se come sin prisa.","La siesta también es infraestructura.","Aquí «ahora mismo» puede significar «en un rato».","Sin prisa: la guía no caduca. Los datos sí, por eso llevan fecha.","Mejor un bar bueno que diez cualquiera.","Haz clic derecho otra vez. Hay más.","Pulsa Escape para cerrar. La curiosidad, no.","Has encontrado el menú escondido. Solo tiene opiniones.","Los errores de tecleo van incluidos sin coste."];
export function initCursorFx(){
  const fine=matchMedia('(pointer:fine)'),calm=matchMedia('(prefers-reduced-motion:reduce)');
  const root=document.documentElement;
  /* frases */
  let tip=null,timers=[],queue=[],lastTip='';
  const clearTip=()=>{timers.forEach(clearTimeout);timers=[];tip&&tip.remove();tip=null};
  const typing=s=>{const AL='abcdefghijklmnopqrstuvwxyz0123456789#@$';const out=[{text:'',at:0}];let cur='',at=0;
    for(const ch of s){if(ch!==' '&&Math.random()<.09){const w=AL[Math.floor(Math.random()*AL.length)];at+=26;out.push({text:cur+w,at});at+=48;out.push({text:cur,at});at+=26}cur+=ch;at+=26+(ch===' '||ch==='.'?12:0);out.push({text:cur,at})}return out};
  document.addEventListener('contextmenu',e=>{
    const el=e.target instanceof Element?e.target:null;
    if((el&&el.closest("input,textarea,select,[contenteditable='true'],a[href],[data-native-menu]"))||(getSelection()&&getSelection().toString()))return;
    e.preventDefault();clearTip();
    if(!queue.length){queue=[...TIPS].sort(()=>Math.random()-.5);if(queue[queue.length-1]===lastTip&&queue.length>1)queue.unshift(queue.pop())}
    const full=queue.pop();lastTip=full;
    tip=document.createElement('div');tip.className='context-tip';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');
    tip.innerHTML='<span class="context-tip-prompt" aria-hidden="true">› </span><span class="context-tip-body"><span class="context-tip-ghost" aria-hidden="true"></span><span class="context-tip-text" aria-hidden="true"></span></span>';
    tip.querySelector('.context-tip-ghost').textContent=full;
    const tx=tip.querySelector('.context-tip-text'),caret=document.createElement('span');caret.className='context-tip-caret';caret.textContent='█';
    const put=s=>{tx.textContent=s;tx.append(caret)};put('');tip.style.visibility='hidden';document.body.appendChild(tip);
    const {width,height}=tip.getBoundingClientRect(),half=width/2;
    tip.style.left=Math.min(Math.max(e.clientX,half+12),innerWidth-half-12)+'px';tip.style.top=e.clientY+'px';
    if(e.clientY-height-16<12)tip.classList.add('is-below');tip.style.visibility='visible';
    tip.classList.add('is-typing');
    const steps=calm.matches?[{text:full,at:0}]:typing(full),me=tip;
    steps.forEach(s=>timers.push(setTimeout(()=>{if(tip!==me)return;put(s.text);if(s.text===full){me.classList.remove('is-typing');me.classList.add('is-typed');me.setAttribute('aria-label',full)}},s.at)));
    timers.push(setTimeout(clearTip,steps[steps.length-1].at+2600));
  },true);
  addEventListener('keydown',e=>{e.key==='Escape'&&clearTip()});addEventListener('pointerdown',clearTip,true);addEventListener('scroll',clearTip,{passive:true,capture:true});addEventListener('resize',clearTip);
  /* cinta del puntero */
  if(!fine.matches||calm.matches)return;
  const layer=document.createElement('div');layer.className='ribbon-layer';layer.setAttribute('aria-hidden','true');
  const cv=document.createElement('canvas');layer.appendChild(cv);document.body.appendChild(layer);
  const cx=cv.getContext('2d');if(!cx)return;
  const INK=[29,42,53],SIG=[20,150,110];
  let pts=[],mx=0,my=0,on=false,hov=0,hovT=false,press=0,pressT=false,field=false,lastMove=0,W=1,H=1,raf=0,hid=document.visibilityState==='hidden',nx=0,ny=1;
  const size=()=>{const r=Math.min(devicePixelRatio||1,1.5),b=cv.getBoundingClientRect();W=Math.max(1,b.width);H=Math.max(1,b.height);cv.width=Math.floor(W*r);cv.height=Math.floor(H*r);cx.setTransform(r,0,0,r,0,0)};
  const ask=()=>{raf||hid||(raf=requestAnimationFrame(frame))};
  const frame=ts=>{raf=0;if(hid)return;
    if(on&&!field){const l=pts[pts.length-1],d=l?Math.hypot(mx-l.x,my-l.y):99;
      if(!l||d>.35){pts.push({x:mx,y:my});pts.length>26&&pts.shift()}else{l.x=mx;l.y=my}
      pts.length>2&&ts-lastMove>28&&pts.shift();
      const h=pts[pts.length-1];h&&(h.x=mx,h.y=my);
      for(let i=pts.length-2;i>=0;i--){pts[i].x+=(pts[i+1].x-pts[i].x)*.0616;pts[i].y+=(pts[i+1].y-pts[i].y)*.0616}
      hov+=((hovT?1:0)-hov)*.28;press+=((pressT?1:0)-press)*.38}
    cx.clearRect(0,0,W,H);
    if(on&&!field&&pts.length>0){
      cx.fillStyle=`rgba(${Math.round(INK[0]+(SIG[0]-INK[0])*hov)},${Math.round(INK[1]+(SIG[1]-INK[1])*hov)},${Math.round(INK[2]+(SIG[2]-INK[2])*hov)},.85)`;
      if(pts.length>=3){const L=[],R=[];
        for(let i=1;i<pts.length;i++){const s=pts[i-1],o=pts[i],dx=o.x-s.x,dy=o.y-s.y,d=Math.hypot(dx,dy);let a,b;
          if(d<.45){a=nx;b=ny}else{a=-dy/d;b=dx/d;nx=a;ny=b}
          const w=(i/(pts.length-1))**2*2;L.push([o.x+a*w,o.y+b*w]);R.push([o.x-a*w,o.y-b*w])}
        cx.beginPath();cx.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++)cx.lineTo(L[i][0],L[i][1]);for(let i=R.length-1;i>=0;i--)cx.lineTo(R[i][0],R[i][1]);cx.closePath();cx.fill()}
      cx.beginPath();cx.arc(mx,my,1.92*(1+.7*press),0,Math.PI*2);cx.fill()}
    on&&!field||hov>.012||press>.012?ask():cx.clearRect(0,0,W,H)};
  size();new ResizeObserver(size).observe(cv);addEventListener('resize',size);
  addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;mx=e.clientX;my=e.clientY;lastMove=performance.now();
    const el=e.target instanceof Element?e.target:null;
    field=!!(el&&el.closest("input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']),textarea,[contenteditable='true']"));
    const it=el&&el.closest("a[href],button,[role='button'],summary,label,input,textarea,select");
    hovT=!!it&&!it.matches(":disabled,[aria-disabled='true']")&&!field;
    if(!on){on=true;pts.length=0;pts.push({x:mx,y:my});root.classList.add('has-ribbon')}ask()},{passive:true});
  addEventListener('pointerdown',e=>{e.button===0&&(pressT=true)},true);addEventListener('pointerup',()=>{pressT=false});addEventListener('pointercancel',()=>{pressT=false});
  const leave=e=>{if(e.relatedTarget)return;on=false;hovT=false;pressT=false;pts.length=0;root.classList.remove('has-ribbon');cx.clearRect(0,0,W,H)};
  document.addEventListener('pointerleave',leave);root.addEventListener('mouseleave',leave);
  document.addEventListener('visibilitychange',()=>{hid=document.visibilityState==='hidden';if(hid){raf&&cancelAnimationFrame(raf);raf=0;cx.clearRect(0,0,W,H)}else ask()});
}
