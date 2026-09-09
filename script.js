const screens=[...document.querySelectorAll('.screen')];
function show(id){screens.forEach(s=>s.classList.toggle('active',s.id===id));}
function sparkleBurst(){const box=document.querySelector('.sparkles'); for(let i=0;i<24;i++){const e=document.createElement('span');e.className='sparkle';e.textContent=['✦','·','♥'][i%3];e.style.left=(35+Math.random()*30)+'%';e.style.top=(42+Math.random()*25)+'%';e.style.animationDelay=(Math.random()*.5)+'s';box.appendChild(e);setTimeout(()=>e.remove(),4500)}}
const open=document.getElementById('openLetter');open.onclick=()=>{sparkleBurst();open.style.transform='scale(.9)';setTimeout(()=>show('letterScreen'),180)};open.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')open.click()};
const env=document.getElementById('envelopeBtn');env.onclick=()=>{env.classList.add('open');setTimeout(()=>show('modalScreen'),650)};
document.getElementById('closeModal').onclick=()=>{env.classList.remove('open');show('letterScreen')};document.getElementById('continueBtn').onclick=()=>show('lockScreen');
// PART 3: compact birthday/DOB keypad. Any 6 digits continue for now; replace with the real DOB later if needed.
const keypad=document.getElementById('keypad'),dots=[...document.querySelectorAll('#dots i')],dateText=document.getElementById('dateText');let pin='';
function refreshPin(){
  dots.forEach((d,i)=>d.classList.toggle('filled',i<pin.length));
  const formatted=pin.replace(/(\d{2})(?=\d)/g,'$1  ').trim();
  dateText.innerHTML=formatted || 'DD&nbsp;&nbsp;MM&nbsp;&nbsp;YY';
  dateText.parentElement.classList.toggle('has-value',!!pin);
}
['1','2','3','4','5','6','7','8','9','⌫','0','✓'].forEach(v=>{
  const b=document.createElement('button');b.className='key'+(['⌫','✓'].includes(v)?' special':'');b.textContent=v;
  b.onclick=()=>{
    if(v==='⌫'){pin=pin.slice(0,-1);refreshPin();return}
    if(v==='✓'){if(pin.length===6)unlock();return}
    if(pin.length<6){pin+=v;refreshPin();if(pin.length===6)setTimeout(unlock,480)}
  };
  keypad.appendChild(b);
});
function unlock(){
  document.querySelector('.lock-card').animate([{transform:'scale(1)'},{transform:'scale(.96)',opacity:.65}],{duration:180,easing:'ease-out'});
  sparkleBurst();setTimeout(()=>show('cakeScreen'),220);
}
refreshPin();
const stage=document.getElementById('cakeStage'),knife=document.getElementById('knife');let start=null,cut=false;
function moveKnife(x,y){const r=stage.getBoundingClientRect();knife.style.left=Math.max(8,Math.min(92,(x-r.left)/r.width*100))+'%';knife.style.top=Math.max(8,Math.min(88,(y-r.top)/r.height*100))+'%';}
function celebrateCake(){if(cut)return;cut=true;stage.classList.add('cut');knife.style.opacity=.25;document.getElementById('cakeInstruction').textContent='You did it! Happy Birthday! 🎉';const msg=document.getElementById('cakeMessage');msg.textContent='Happy Birthday, Cutie! 💗';msg.classList.add('done');const conf=document.getElementById('cakeConfetti');['♥','✦','•','♥','✦','♡','✦','♥','•','✦','♡','♥'].forEach((icon,i)=>{const e=document.createElement('span');e.textContent=icon;e.style.left=(42+Math.random()*16)+'%';e.style.top=(45+Math.random()*15)+'%';e.style.setProperty('--x',(Math.random()*220-110)+'px');e.style.setProperty('--y',(-80-Math.random()*150)+'px');e.style.animationDelay=(i*.03)+'s';conf.appendChild(e)});sparkleBurst();}
stage.addEventListener('pointerdown',e=>{if(cut)return;start={x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId);moveKnife(e.clientX,e.clientY)});
stage.addEventListener('pointermove',e=>{if(start&&!cut)moveKnife(e.clientX,e.clientY)});
stage.addEventListener('pointerup',e=>{if(!start)return;const dx=Math.abs(e.clientX-start.x),dy=Math.abs(e.clientY-start.y);if(dx>95||dy>70)celebrateCake();start=null});
stage.addEventListener('pointercancel',()=>start=null);
document.getElementById('memoriesBtn').onclick=()=>show('memoriesScreen');

// PART 5: Keep the center memory card focused and update the dots while swiping.
const cards=document.getElementById('cards');
const memoryCards=[...document.querySelectorAll('.memory-card')];
const memoryDots=[...document.querySelectorAll('#memoryDots i')];
function updateMemoryFocus(){
  const box=cards.getBoundingClientRect(); let best=0,bestDist=Infinity;
  memoryCards.forEach((card,i)=>{const r=card.getBoundingClientRect();const d=Math.abs((r.left+r.width/2)-(box.left+box.width/2));if(d<bestDist){bestDist=d;best=i}card.classList.toggle('focus',i===best)});
  memoryDots.forEach((d,i)=>d.classList.toggle('active',i===best));
}
cards.addEventListener('scroll',()=>requestAnimationFrame(updateMemoryFocus),{passive:true});
window.addEventListener('resize',updateMemoryFocus);
setTimeout(updateMemoryFocus,80);
document.getElementById('finalBtn').onclick=()=>show('finalScreen');


// FINAL: floating hearts and replay
const finalHearts=document.getElementById('finalHearts');
function makeFinalHearts(){
  if(!finalHearts)return;
  finalHearts.innerHTML='';
  for(let i=0;i<20;i++){
    const e=document.createElement('span');
    e.textContent=['♥','♡','✦','·'][i%4];
    e.style.left=(8+Math.random()*84)+'%';
    e.style.top=(68+Math.random()*25)+'%';
    e.style.setProperty('--x',(Math.random()*180-90)+'px');
    e.style.setProperty('--dur',(3.8+Math.random()*2.4)+'s');
    e.style.setProperty('--delay',(Math.random()*1.8)+'s');
    finalHearts.appendChild(e);
  }
}
const finalScreen=document.getElementById('finalScreen');
const finalObserver=new MutationObserver(()=>{if(finalScreen.classList.contains('active'))makeFinalHearts()});
finalObserver.observe(finalScreen,{attributes:true,attributeFilter:['class']});
document.getElementById('replayBtn').onclick=()=>{
  pin=''; refreshPin(); cut=false; stage.classList.remove('cut'); knife.style.opacity='1';
  document.getElementById('cakeMessage').textContent='Your wish is safe with me ♡';
  document.getElementById('cakeMessage').classList.remove('done');
  document.getElementById('cakeInstruction').textContent='Drag your finger across the cake ✦';
  env.classList.remove('open');
  show('intro');
};
