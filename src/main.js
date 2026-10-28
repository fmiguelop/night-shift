import {createSoundEffects} from './sound-effects.js';
import {createAtmosphere} from './atmosphere.js';
import {createScareAudio} from './scare-audio.js';
import {characterMarkup,preloadCharacters} from './characters.js';
import {CAMERA_ROOMS,MAP_POSITIONS,createCameraRenderer} from './cameras.js?v=es';
import {ROOMS,DURATION,createGame,tick,usage,DEATH_HINTS,NIGHT_COUNT} from './game.js';
import {createMenuStatic} from './menu-static.js';
import {loadProgress,recordWin,saveProgress,hasSeenTranscript,recordTranscript,resetTranscripts} from './progression.js';
import {TRANSCRIPTS} from './transcripts.js';
const $=id=>document.getElementById(id);let game=createGame(),started=false,sound=true,subtitles=false,audio,atmosphere,scareAudio,effects,last=0,endingShown=false,scareUntil=0,staticUntil=0;
let progress=loadProgress(),selectedNight=progress.unlockedNight,progressSaved=true;
const nightLabel=night=>`NOCHE ${String(night).padStart(2,'0')}`;
const isPaused=()=>$('helpDialog').open||$('creditsDialog').open||$('transcriptDialog').open;
const cameraRenderer=createCameraRenderer($('cameraScene'),$('cast'));
preloadCharacters();
const menuStatic=createMenuStatic($('menuStatic'));menuStatic.setActive(true);
const character=a=>characterMarkup(a,'doorway');
ROOMS.forEach((room,i)=>{let b=document.createElement('button');b.textContent=`CÁM 0${i+1}`;b.title=room;b.setAttribute('aria-label',`CÁM 0${i+1}: ${room}`);b.style.left=MAP_POSITIONS[i][0]+'%';b.style.top=MAP_POSITIONS[i][1]+'%';b.onclick=()=>{if(game.camera===i||game.phase!=='playing'||isPaused())return;game.camera=i;cameraStatic();if(sound)effects?.play('monitor',{volume:.1,duration:.18});render()};$('mapButtons').append(b)});
function beep(freq=150,duration=.08){if(!sound||!audio)return;let o=audio.createOscillator(),v=audio.createGain();o.connect(v);v.connect(scareAudio.ambience);o.type='triangle';o.frequency.value=freq;v.gain.setValueAtTime(.06,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}
const cueText={Walter:{move:'Pasos pesados — pasillo oeste',near:'Pasos pesados — puerta oeste',retreat:'Los pasos pesados se alejan — pasillo oeste'},Pip:{move:'Golpeteo metálico — archivo',tapping:'Golpeteo rápido — pasillo oeste',dash:'PASOS CORRIENDO — CERRÁ LA PUERTA OESTE',retreat:'Los pasos metálicos se alejan — pasillo oeste'},Dot:{move:'Silbido inquietante — pasillo este',near:'Chasquidos de pico — puerta este',retreat:'El silbido se aleja — pasillo este',adapt:'Chasquidos fuertes — Dot resiste la luz'}};
let captionUntil=0;
function actorCue(event){
 if(subtitles){$('soundCaption').textContent=cueText[event.actor][event.type]||'';captionUntil=performance.now()+3500;}
 if(!sound||!audio)return;
 effects.actorCue(event);
}
function syncAudio(){
 if(sound&&!audio){audio=new AudioContext();scareAudio=createScareAudio(audio);atmosphere=createAtmosphere(audio,scareAudio.ambience);effects=createSoundEffects(audio,scareAudio.ambience)}
 if(audio){if(sound&&!isPaused())audio.resume().catch(()=>{});else {effects?.reset();audio.suspend().catch(()=>{})}}
 atmosphere?.setPlaying(sound&&!isPaused()&&started&&game.phase==='playing'&&game.power>0);
}
$('sound').onchange=()=>{if(started)return;sound=$('sound').checked;syncAudio()};
$('subtitles').onchange=()=>{if(started)return;subtitles=$('subtitles').checked;captionUntil=0;$('soundCaption').textContent='';$('soundCaption').classList.toggle('hidden',!subtitles)};
function start(night=selectedNight){selectedNight=night;menuStatic.setActive(false);syncAudio();$('settings').open=false;effects?.reset();scareAudio?.reset();captionUntil=0;$('soundCaption').textContent='';staticUntil=0;$('cameraView').classList.remove('switching');scareUntil=0;$('jumpscare').classList.add('hidden');$('jumpscare').replaceChildren();game=createGame(Math.random,selectedNight);started=true;endingShown=false;$('intro').classList.add('hidden');$('ending').classList.add('hidden');$('viewport').classList.remove('lost');last=performance.now();if(!hasSeenTranscript(progress,game.night))openTranscript();else {render();$('monitor').focus()}}
function updateNightMenu(){
 $('nightSelect').replaceChildren();
 for(let night=1;night<=NIGHT_COUNT;night++){
  const option=document.createElement('option');option.value=night;
  option.disabled=night>progress.unlockedNight;option.textContent=`${nightLabel(night)}${option.disabled?' — BLOQUEADA':''}`;
  $('nightSelect').append(option);
 }
 $('nightSelect').value=selectedNight;
 $('start').hidden=progress.unlockedNight===1;
 $('continueNight').textContent=`Noche ${selectedNight}`;
 $('nightPicker').hidden=progress.unlockedNight<3;
 $('progressNote').hidden=progressSaved;
 $('progressNote').textContent=progressSaved?'':'No se pudo guardar el progreso. Podés seguir jugando en esta sesión.';
}
$('nightSelect').onchange=()=>{selectedNight=Number($('nightSelect').value);updateNightMenu()};
$('newGame').onclick=()=>{progress=resetTranscripts(progress);progressSaved=saveProgress(progress);start(1)};
$('start').onclick=()=>start();
$('restart').onclick=()=>start(game.phase==='won'?Math.min(NIGHT_COUNT,game.night+1):game.night);
$('backToMenu').onclick=()=>{
 selectedNight=game.phase==='won'?Math.min(NIGHT_COUNT,game.night+1):game.night;
 started=false;game=createGame(Math.random,selectedNight);effects?.reset();scareAudio?.reset();scareUntil=0;captionUntil=0;
 $('jumpscare').classList.add('hidden');$('ending').classList.add('hidden');$('intro').classList.remove('hidden');
 $('soundCaption').textContent='';updateNightMenu();render();menuStatic.setActive(true);(progress.unlockedNight>1?$('start'):$('newGame')).focus();
};
updateNightMenu();
function cameraStatic(){staticUntil=performance.now()+280;$('cameraView').classList.add('switching')}
function toggle(key){if(!started||game.phase!=='playing'||game.power<=0||isPaused()||(game.monitor&&key!=='monitor'))return;game[key]=!game[key];if(key==='monitor'&&game.monitor)cameraStatic();if(sound)effects?.control(key,game[key]);render()}
for(const key of ['left','right','leftLight','rightLight','monitor'])$(key).onclick=()=>toggle(key);
document.addEventListener('keydown',e=>{if(!started||e.repeat||isPaused())return;const key={a:'left',d:'right',q:'leftLight',e:'rightLight',' ':'monitor'}[e.key.toLowerCase()];if(key){e.preventDefault();toggle(key)}});
function openTranscript(){
 if(!started||game.phase!=='playing'||isPaused())return;
 $('transcriptTitle').textContent=`Oficina de seguridad / Noche ${String(game.night).padStart(2,'0')}`;
 $('transcriptBody').replaceChildren(...TRANSCRIPTS[game.night-1].split('\n\n').map(text=>{
  const paragraph=document.createElement('p');paragraph.textContent=text;
  if(text.startsWith('['))paragraph.className='transcript-annotation';
  else if(text.startsWith('VOZ AUTOMÁTICA:'))paragraph.className='transcript-automated';
  return paragraph;
 }));
 $('transcriptDialog').showModal();$('transcriptBody').scrollTop=0;
 if(!hasSeenTranscript(progress,game.night)){progress=recordTranscript(progress,game.night);progressSaved=saveProgress(progress);}
 syncAudio();render();
}
$('transcript').onclick=()=>openTranscript();
$('closeTranscript').onclick=()=>$('transcriptDialog').close();
function openMenuDialog(id){if(started)return;$('settings').open=false;menuStatic.setActive(false);$(id).showModal();$(id).scrollTop=0;if(id==='helpDialog')$('helpBody').scrollTop=0;}
$('help').onclick=()=>openMenuDialog('helpDialog');$('closeHelp').onclick=()=>$('helpDialog').close();
$('credits').onclick=()=>openMenuDialog('creditsDialog');$('closeCredits').onclick=()=>$('creditsDialog').close();
for(const [id,trigger] of [['helpDialog','help'],['creditsDialog','credits'],['transcriptDialog','transcript']])$(id).addEventListener('close',()=>{last=performance.now();if(started)syncAudio();else menuStatic.setActive(true);render();$(trigger).focus()});
function render(){
 const active=started&&game.phase==='playing'&&!isPaused();
 $('transcript').disabled=!active;
 $('nightLabel').textContent=nightLabel(game.night);
 atmosphere?.setPlaying(sound&&active&&game.power>0);
 for(const key of ['left','right','leftLight','rightLight','monitor']){$(key).setAttribute('aria-pressed',String(game[key]));$(key).disabled=!active||game.power<=0||(game.monitor&&key!=='monitor')}
 for(const key of ['left','right','leftLight','rightLight'])$(key+'State').textContent=game.power<=0?'SIN ENERGÍA':key.endsWith('Light')?(game[key]?'ENCENDIDA':'APAGADA'):(game[key]?'CERRADA':'ABIERTA');
 $('leftDoor').classList.toggle('closed',game.left);$('rightDoor').classList.toggle('closed',game.right);
 for(const [side,room] of [['left',6],['right',7]]){$(`${side}Hall`).classList.toggle('lit',game[`${side}Light`]);$(`${side}Visitor`).innerHTML=game[`${side}Light`]?game.actors.filter(a=>a.route[a.step]===room).map(character).join(''):''}
 $('cameraView').classList.toggle('hidden',!game.monitor);$('officeLabel').classList.toggle('hidden',game.monitor);$('viewLabel').textContent=game.monitor?'SISTEMA DE CÁMARAS':'OFICINA DE SEGURIDAD';
 $('roomName').textContent=ROOMS[game.camera];$('camCode').textContent=`CÁM 0${game.camera+1}`;$('mapLocation').textContent=`CÁM 0${game.camera+1} / ${ROOMS[game.camera]}`;if(game.monitor){$('cameraScene').setAttribute('aria-label',`${ROOMS[game.camera]}. ${CAMERA_ROOMS[game.camera].description}`);cameraRenderer.draw(game.camera,game.actors.filter(a=>a.route[a.step]===game.camera));}
 [...$('mapButtons').children].forEach((b,i)=>{b.classList.toggle('selected',i===game.camera);b.setAttribute('aria-pressed',String(i===game.camera))});
 let hour=Math.min(6,Math.floor(game.elapsed/(DURATION/6)));$('clock').textContent=`${hour||12} a. m.`;$('power').innerHTML=`${Math.ceil(game.power)}<span>%</span>`;$('batteryFill').style.width=`${game.power}%`;$('usageBars').textContent='▮'.repeat(usage(game));$('status').textContent=!started?'ESPERANDO AL PERSONAL NOCTURNO':game.power<=0?'FALLO ELÉCTRICO':game.monitor?'VIGILANCIA REMOTA ACTIVA':'SISTEMA DE SEGURIDAD ACTIVO';$('feedTime').textContent=`00:${String(Math.floor(game.elapsed/60)).padStart(2,'0')}:${String(Math.floor(game.elapsed%60)).padStart(2,'0')}`;$('viewport').classList.toggle('blackout',game.power<=0);
 if(started&&game.phase!=='playing'&&!endingShown){
  endingShown=true;effects?.reset();const won=game.phase==='won';
  if(won){progress=recordWin(progress,game.night);progressSaved=saveProgress(progress);}
  $('endEyebrow').textContent=won?'TURNO COMPLETADO / 06:00':'CONEXIÓN PERDIDA';
  $('endTitle').textContent=won?'6 a. m.':'TE ATRAPARON.';
  $('endText').textContent=won?(game.night===NIGHT_COUNT?'Sobreviviste las cinco noches. Tu semana terminó.':`Completaste la noche ${game.night}. La noche ${game.night+1} está desbloqueada. Llegarán más temprano y se moverán más.`):game.killer?DEATH_HINTS[game.killer]:'Se agotó la energía. Usá las puertas y las luces solo cuando las necesités.';
  if(won&&!progressSaved)$('endText').textContent+=' No se pudo guardar el progreso. Podés seguir jugando en esta sesión.';
  $('restart').textContent=won&&game.night<NIGHT_COUNT?`EMPEZAR ${nightLabel(game.night+1)}`:`REINTENTAR ${nightLabel(game.night)}`;
  if(won&&game.night===NIGHT_COUNT)$('restart').textContent='REPETIR NOCHE 05';
  if(won){$('ending').classList.remove('hidden');$('restart').focus();beep(520,.5)}else showJumpscare();
 }
}
function showJumpscare(){
 const actor=game.actors.find(a=>a.name===game.killer)||game.actors[0];
 $('jumpscare').innerHTML=characterMarkup(actor,'attack');$('jumpscare').setAttribute('aria-label',`${actor.name} se abalanza hacia vos`);$('jumpscare').classList.remove('hidden');
 $('status').textContent='SEÑAL INTERRUMPIDA';scareUntil=performance.now()+1250;
 if(!sound||!audio)return;
 scareAudio.play(actor.name);
}
function frame(now){if(staticUntil&&now>=staticUntil){staticUntil=0;$('cameraView').classList.remove('switching');}if(scareUntil&&now>=scareUntil){scareUntil=0;$('jumpscare').classList.add('hidden');$('ending').classList.remove('hidden');$('restart').focus();}const dt=Math.max(0,Math.min(.1,(now-last)/1000));last=now;if(started&&!isPaused()){const hadPower=game.power>0;tick(game,dt);if(hadPower&&game.power<=0){atmosphere?.setPlaying(false);if(sound)effects?.powerFailure()}if(sound&&game.phase==='playing'&&game.power>0)effects?.tick(dt);for(const event of game.events.splice(0))actorCue(event);if(captionUntil&&now>=captionUntil){captionUntil=0;$('soundCaption').textContent='';}render()}requestAnimationFrame(frame)}render();requestAnimationFrame(frame);
