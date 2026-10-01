// letras de JULIAN una a una
const nm=document.getElementById('name');
nm.innerHTML=[...'JULIAN'].map((c,i)=>`<span style="transition-delay:${1.5+i*.11}s" aria-hidden="true">${c}</span>`).join('');

// cuenta regresiva (8 de noviembre de 2026)
const target=new Date(2026,10,8,0,0,0);
function tick(){
  const el=document.getElementById('count'),d=target-new Date();
  if(d<=0){el.innerHTML='<span class="today">¡Hoy es el gran día!</span>';document.querySelector('.cd-t').textContent='Julian ya está por llegar';return}
  const s=Math.floor(d/1e3),v=[[Math.floor(s/86400)===1?'día':'días',Math.floor(s/86400)],['horas',Math.floor(s%86400/3600)],['min',Math.floor(s%3600/60)],['seg',s%60]];
  el.innerHTML=v.map(([l,n])=>`<div><strong>${n}</strong>${l}</div>`).join('');
}
tick();setInterval(tick,1000);

// abrir invitación
document.getElementById('open').onclick=()=>{
  start();
  document.getElementById('cover').classList.add('gone');
  setTimeout(()=>document.getElementById('wrap').classList.add('in'),350);
};

// aparición suave al hacer scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target)}}),{threshold:.2});
document.querySelectorAll('.sv').forEach(e=>io.observe(e));

// burbujas que suben suavemente
(()=>{const b=document.getElementById('bub'),h=document.getElementById('wrap').offsetHeight+80;
for(let i=0;i<12;i++){const e=document.createElement('i'),z=8+Math.random()*16;
e.style.cssText=`left:${Math.random()*96}%;width:${z}px;height:${z}px;--h:${h}px;animation-duration:${26+Math.random()*26}s;animation-delay:-${Math.random()*40}s;opacity:${.5+Math.random()*.4}`;b.appendChild(e)}})();
