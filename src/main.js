import {ROOMS,DURATION,createGame,tick,usage} from './game.js';
const $=id=>document.getElementById(id);let game=createGame(),started=false,sound=false,audio,hum,last=0,endingShown=false,scareUntil=0,staticUntil=0;
const character=a=>`<div class="character ${a.kind}" style="--fur:${{bear:'#82735a',rabbit:'#747d88',bird:'#9a925d'}[a.kind]}"><div class="body"></div><div class="head"><i class="ear"></i><i class="ear"></i><div class="eyes"></div><div class="muzzle"></div></div><div class="bow">◆</div><small>${a.name}</small></div>`;
ROOMS.forEach((room,i)=>{let b=document.createElement('button');b.textContent=`CAM 0${i+1}`;b.title=room;b.onclick=()=>{if(game.camera===i||game.phase!=='playing')return;game.camera=i;cameraStatic();beep(170,.04);render()};$('mapButtons').append(b)});
function beep(freq=150,duration=.08){if(!sound||!audio)return;let o=audio.createOscillator(),v=audio.createGain();o.connect(v);v.connect(audio.destination);o.type='triangle';o.frequency.value=freq;v.gain.setValueAtTime(.06,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}
$('sound').onclick=()=>{sound=!sound;if(sound&&!audio){audio=new AudioContext();hum=audio.createOscillator();let v=audio.createGain();v.gain.value=.018;hum.frequency.value=55;hum.connect(v);v.connect(audio.destination);hum.start()}if(audio){if(sound)audio.resume();else audio.suspend()}$('sound').innerHTML=`SOUND ${sound?'ON':'OFF'} <span>◖</span>`};
function start(){staticUntil=0;$('cameraView').classList.remove('switching');scareUntil=0;$('jumpscare').classList.add('hidden');$('jumpscare').replaceChildren();game=createGame();started=true;endingShown=false;$('intro').classList.add('hidden');$('ending').classList.add('hidden');$('viewport').classList.remove('lost');last=performance.now();render()}
$('start').onclick=start;$('restart').onclick=start;
function cameraStatic(){staticUntil=performance.now()+280;$('cameraView').classList.add('switching')}
function toggle(key){if(!started||game.phase!=='playing'||game.power<=0||$('helpDialog').open)return;game[key]=!game[key];if(key==='monitor'&&game.monitor)cameraStatic();beep(key==='monitor'?230:95);render()}
for(const key of ['left','right','leftLight','rightLight','monitor'])$(key).onclick=()=>toggle(key);
document.addEventListener('keydown',e=>{if(e.repeat||$('helpDialog').open)return;const key={a:'left',d:'right',q:'leftLight',e:'rightLight',' ':'monitor'}[e.key.toLowerCase()];if(key){e.preventDefault();toggle(key)}});
$('help').onclick=()=>$('helpDialog').showModal();$('closeHelp').onclick=()=>$('helpDialog').close();
function render(){
 const active=started&&game.phase==='playing';
 for(const key of ['left','right','leftLight','rightLight','monitor']){$(key).setAttribute('aria-pressed',String(game[key]));$(key).disabled=!active||game.power<=0}
 $('leftDoor').classList.toggle('closed',game.left);$('rightDoor').classList.toggle('closed',game.right);
 for(const [side,room] of [['left',6],['right',7]]){$(`${side}Hall`).classList.toggle('lit',game[`${side}Light`]);$(`${side}Visitor`).innerHTML=game[`${side}Light`]?game.actors.filter(a=>a.route[a.step]===room).map(character).join(''):''}
 $('cameraView').classList.toggle('hidden',!game.monitor);$('officeLabel').classList.toggle('hidden',game.monitor);$('viewLabel').textContent=game.monitor?'CAMERA SYSTEM':'SECURITY OFFICE';
 $('roomName').textContent=ROOMS[game.camera];$('camCode').textContent=`CAM 0${game.camera+1}`;$('cast').innerHTML=game.actors.filter(a=>a.route[a.step]===game.camera).map((a,i)=>character(a).replace('style="',`style="left:${24+i*19}%;`)).join('');
 [...$('mapButtons').children].forEach((b,i)=>{b.classList.toggle('selected',i===game.camera);b.setAttribute('aria-pressed',String(i===game.camera))});
 let hour=Math.min(6,Math.floor(game.elapsed/(DURATION/6)));$('clock').textContent=`${hour||12} AM`;$('power').innerHTML=`${Math.ceil(game.power)}<span>%</span>`;$('batteryFill').style.width=`${game.power}%`;$('usageBars').textContent='▮'.repeat(usage(game));$('status').textContent=!started?'AWAITING NIGHT STAFF':game.power<=0?'POWER FAILURE':game.monitor?'REMOTE SURVEILLANCE ACTIVE':'SECURITY SYSTEM ONLINE';$('feedTime').textContent=`00:${String(Math.floor(game.elapsed/60)).padStart(2,'0')}:${String(Math.floor(game.elapsed%60)).padStart(2,'0')}`;$('viewport').classList.toggle('blackout',game.power<=0);
 if(started&&game.phase!=='playing'&&!endingShown){endingShown=true;const won=game.phase==='won';$('endEyebrow').textContent=won?'SHIFT COMPLETE / 06:00':'CONNECTION LOST';$('endTitle').textContent=won?'6 AM':'CAUGHT.';$('endText').textContent=won?'Morning, at last. You made it through your first shift.':game.killer?`${game.killer} found an open door. Watch the hallway lights and close the door before your visitor enters.`:'The power ran out. Use doors and lights only when you need them.';if(won){$('ending').classList.remove('hidden');beep(520,.5)}else showJumpscare()}
}
function showJumpscare(){
 const actor=game.actors.find(a=>a.name===game.killer)||game.actors[0];
 $('jumpscare').innerHTML=character(actor);$('jumpscare').classList.remove('hidden');
 $('status').textContent='SIGNAL INTERRUPTED';scareUntil=performance.now()+1250;
 if(!sound||!audio)return;
 const duration=1.15,now=audio.currentTime;
 const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate);
 const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
 const noise=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
 noise.buffer=buffer;filter.type='bandpass';filter.frequency.setValueAtTime(1700,now);filter.frequency.exponentialRampToValueAtTime(350,now+duration);filter.Q.value=.8;
 gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.24,now+.025);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
 noise.connect(filter);filter.connect(gain);gain.connect(audio.destination);noise.start();noise.stop(now+duration);
 const scream=audio.createOscillator();scream.type='sawtooth';scream.frequency.setValueAtTime(180,now);scream.frequency.exponentialRampToValueAtTime(65,now+duration);scream.connect(gain);scream.start();scream.stop(now+duration);
}
function frame(now){if(staticUntil&&now>=staticUntil){staticUntil=0;$('cameraView').classList.remove('switching');}if(scareUntil&&now>=scareUntil){scareUntil=0;$('jumpscare').classList.add('hidden');$('ending').classList.remove('hidden');}const dt=Math.min(.1,(now-last)/1000);last=now;if(started&&!$('helpDialog').open){tick(game,dt);render()}requestAnimationFrame(frame)}render();requestAnimationFrame(frame);
