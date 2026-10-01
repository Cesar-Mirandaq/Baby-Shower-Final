// música: caja de música generada con Web Audio (no necesita archivos). Para usar tu propia canción, ver README.md
let ctx,playing=false,timer;
const f=m=>440*Math.pow(2,(m-69)/12);
const mel=[[76,1],[79,1],[79,1],[76,1],[79,1],[84,1],[74,1],[77,1],[77,1],[79,3],
           [72,1],[76,1],[76,1],[72,1],[76,1],[79,1],[77,1],[74,1],[71,1],[72,3]];
const bass=[48,48,43,48,48,48,43,43];
const bpm=96,beat=60/bpm;
function note(m,t,len,vol,type){
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=type;o.frequency.value=f(m);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);
  g.gain.exponentialRampToValueAtTime(.0008,t+len);
  o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+len+.05);
}
function loop(){
  let t=ctx.currentTime+.1,total=0;
  mel.forEach(([m,b])=>{note(m,t+total*beat,b*beat*1.9,.16,'triangle');note(m+12,t+total*beat,b*beat,.03,'sine');total+=b});
  for(let i=0;i<8;i++){const bt=t+i*3*beat;note(bass[i],bt,3*beat,.12,'sine');note(bass[i]+12,bt+beat,beat*1.5,.04,'sine');note(bass[i]+16,bt+2*beat,beat*1.5,.04,'sine')}
  timer=setTimeout(loop,(total*beat-.3)*1000);
}
function startSynth(){
  if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();
  ctx.resume();if(!playing){playing=true;loop()}
  document.getElementById('play').classList.add('on');
}
function stopSynth(){clearTimeout(timer);playing=false;ctx&&ctx.suspend&&ctx.close().then(()=>{ctx=null});document.getElementById('play').classList.remove('on')}

// ===== Canción propia (audio/cancion.mp3) =====
// Si el archivo existe, se usa. Si no existe, suena la nana generada de arriba.
const bgm=document.getElementById('bgm');
let useFile=true,filePlaying=false;
bgm.addEventListener('error',()=>{useFile=false});
function start(){
  if(!useFile)return startSynth();
  bgm.play().then(()=>{filePlaying=true;document.getElementById('play').classList.add('on')})
            .catch(()=>{useFile=false;startSynth()});
}
function stop(){
  if(filePlaying){bgm.pause();filePlaying=false;document.getElementById('play').classList.remove('on')}
  else stopSynth();
}
document.getElementById('play').onclick=()=>(filePlaying||playing)?stop():start();
