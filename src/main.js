import {createSoundEffects} from './sound-effects.js';
import {createAtmosphere} from './atmosphere.js';
import {createScareAudio} from './scare-audio.js';
import {characterMarkup,preloadCharacters} from './characters.js';
import {CAMERA_ROOMS,MAP_POSITIONS,createCameraRenderer} from './cameras.js?v=character-sheets';
import {ROOMS,DURATION,createGame,tick,usage,DEATH_HINTS} from './game.js?v=character-sheets';
const $=id=>document.getElementById(id);let game=createGame(),started=false,sound=true,subtitles=false,audio,atmosphere,scareAudio,effects,last=0,endingShown=false,scareUntil=0,staticUntil=0;
const cameraRenderer=createCameraRenderer($('cameraScene'),$('cast'));
preloadCharacters();
const character=a=>characterMarkup(a,'doorway');
ROOMS.forEach((room,i)=>{let b=document.createElement('button');b.textContent=`CAM 0${i+1}`;b.title=room;b.setAttribute('aria-label',`CAM 0${i+1}: ${room}`);b.style.left=MAP_POSITIONS[i][0]+'%';b.style.top=MAP_POSITIONS[i][1]+'%';b.onclick=()=>{if(game.camera===i||game.phase!=='playing')return;game.camera=i;cameraStatic();if(sound)effects?.play('monitor',{volume:.1,duration:.18});render()};$('mapButtons').append(b)});
function beep(freq=150,duration=.08){if(!sound||!audio)return;let o=audio.createOscillator(),v=audio.createGain();o.connect(v);v.connect(scareAudio.ambience);o.type='triangle';o.frequency.value=freq;v.gain.setValueAtTime(.06,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}
const cueText={Walter:{move:'Heavy footsteps — west hall',near:'Heavy footsteps — west doorway',retreat:'Heavy footsteps recede — west hall'},Pip:{move:'Metallic tapping — archives',tapping:'Rapid tapping — west hall',dash:'RUNNING FOOTSTEPS — CLOSE WEST DOOR',retreat:'Metallic footsteps recede — west hall'},Dot:{move:'Eerie whistle — east hall',near:'Beak clicks — east doorway',retreat:'Whistle recedes — east hall',adapt:'Harsh beak clicks — Dot is resisting the light'}};
let captionUntil=0;
function actorCue(event){
 if(subtitles){$('soundCaption').textContent=cueText[event.actor][event.type]||'';captionUntil=performance.now()+3500;}
 if(!sound||!audio)return;
 effects.actorCue(event);
}
function syncAudio(){
 if(sound&&!audio){audio=new AudioContext();scareAudio=createScareAudio(audio);atmosphere=createAtmosphere(audio,scareAudio.ambience);effects=createSoundEffects(audio,scareAudio.ambience)}
 if(audio){if(sound)audio.resume().catch(()=>{});else {effects?.reset();audio.suspend().catch(()=>{})}}
 atmosphere?.setPlaying(sound&&started&&game.phase==='playing'&&game.power>0);
}
$('sound').onchange=()=>{if(started)return;sound=$('sound').checked;syncAudio()};
$('subtitles').onchange=()=>{if(started)return;subtitles=$('subtitles').checked;captionUntil=0;$('soundCaption').textContent='';$('soundCaption').classList.toggle('hidden',!subtitles)};
function start(){syncAudio();$('settings').open=false;effects?.reset();scareAudio?.reset();captionUntil=0;$('soundCaption').textContent='';staticUntil=0;$('cameraView').classList.remove('switching');scareUntil=0;$('jumpscare').classList.add('hidden');$('jumpscare').replaceChildren();game=createGame();started=true;endingShown=false;$('intro').classList.add('hidden');$('ending').classList.add('hidden');$('viewport').classList.remove('lost');last=performance.now();render()}
$('start').onclick=start;$('restart').onclick=start;
function cameraStatic(){staticUntil=performance.now()+280;$('cameraView').classList.add('switching')}
function toggle(key){if(!started||game.phase!=='playing'||game.power<=0||$('helpDialog').open)return;game[key]=!game[key];if(key==='monitor'&&game.monitor)cameraStatic();if(sound)effects?.control(key,game[key]);render()}
for(const key of ['left','right','leftLight','rightLight','monitor'])$(key).onclick=()=>toggle(key);
document.addEventListener('keydown',e=>{if(e.repeat||$('helpDialog').open)return;const key={a:'left',d:'right',q:'leftLight',e:'rightLight',' ':'monitor'}[e.key.toLowerCase()];if(key){e.preventDefault();toggle(key)}});
$('help').onclick=()=>$('helpDialog').showModal();$('closeHelp').onclick=()=>$('helpDialog').close();
function render(){
 const active=started&&game.phase==='playing';
 atmosphere?.setPlaying(sound&&active&&game.power>0);
 for(const key of ['left','right','leftLight','rightLight','monitor']){$(key).setAttribute('aria-pressed',String(game[key]));$(key).disabled=!active||game.power<=0}
 $('leftDoor').classList.toggle('closed',game.left);$('rightDoor').classList.toggle('closed',game.right);
 for(const [side,room] of [['left',6],['right',7]]){$(`${side}Hall`).classList.toggle('lit',game[`${side}Light`]);$(`${side}Visitor`).innerHTML=game[`${side}Light`]?game.actors.filter(a=>a.route[a.step]===room).map(character).join(''):''}
 $('cameraView').classList.toggle('hidden',!game.monitor);$('officeLabel').classList.toggle('hidden',game.monitor);$('viewLabel').textContent=game.monitor?'CAMERA SYSTEM':'SECURITY OFFICE';
 $('roomName').textContent=ROOMS[game.camera];$('camCode').textContent=`CAM 0${game.camera+1}`;$('mapLocation').textContent=`CAM 0${game.camera+1} / ${ROOMS[game.camera]}`;if(game.monitor){$('cameraScene').setAttribute('aria-label',`${ROOMS[game.camera]}. ${CAMERA_ROOMS[game.camera].description}`);cameraRenderer.draw(game.camera,game.actors.filter(a=>a.route[a.step]===game.camera));}
 [...$('mapButtons').children].forEach((b,i)=>{b.classList.toggle('selected',i===game.camera);b.setAttribute('aria-pressed',String(i===game.camera))});
 let hour=Math.min(6,Math.floor(game.elapsed/(DURATION/6)));$('clock').textContent=`${hour||12} AM`;$('power').innerHTML=`${Math.ceil(game.power)}<span>%</span>`;$('batteryFill').style.width=`${game.power}%`;$('usageBars').textContent='▮'.repeat(usage(game));$('status').textContent=!started?'AWAITING NIGHT STAFF':game.power<=0?'POWER FAILURE':game.monitor?'REMOTE SURVEILLANCE ACTIVE':'SECURITY SYSTEM ONLINE';$('feedTime').textContent=`00:${String(Math.floor(game.elapsed/60)).padStart(2,'0')}:${String(Math.floor(game.elapsed%60)).padStart(2,'0')}`;$('viewport').classList.toggle('blackout',game.power<=0);
 if(started&&game.phase!=='playing'&&!endingShown){endingShown=true;effects?.reset();const won=game.phase==='won';$('endEyebrow').textContent=won?'SHIFT COMPLETE / 06:00':'CONNECTION LOST';$('endTitle').textContent=won?'6 AM':'CAUGHT.';$('endText').textContent=won?'Morning, at last. You made it through your first shift.':game.killer?DEATH_HINTS[game.killer]:'The power ran out. Use doors and lights only when you need them.';if(won){$('ending').classList.remove('hidden');beep(520,.5)}else showJumpscare()}
}
function showJumpscare(){
 const actor=game.actors.find(a=>a.name===game.killer)||game.actors[0];
 $('jumpscare').innerHTML=characterMarkup(actor,'attack');$('jumpscare').setAttribute('aria-label',`${actor.name} lunges toward you`);$('jumpscare').classList.remove('hidden');
 $('status').textContent='SIGNAL INTERRUPTED';scareUntil=performance.now()+1250;
 if(!sound||!audio)return;
 scareAudio.play(actor.name);
}
function frame(now){if(staticUntil&&now>=staticUntil){staticUntil=0;$('cameraView').classList.remove('switching');}if(scareUntil&&now>=scareUntil){scareUntil=0;$('jumpscare').classList.add('hidden');$('ending').classList.remove('hidden');}const dt=Math.min(.1,(now-last)/1000);last=now;if(started&&!$('helpDialog').open){const hadPower=game.power>0;tick(game,dt);if(hadPower&&game.power<=0){atmosphere?.setPlaying(false);if(sound)effects?.powerFailure()}if(sound&&game.phase==='playing'&&game.power>0)effects?.tick(dt);for(const event of game.events.splice(0))actorCue(event);if(captionUntil&&now>=captionUntil){captionUntil=0;$('soundCaption').textContent='';}render()}requestAnimationFrame(frame)}render();requestAnimationFrame(frame);
