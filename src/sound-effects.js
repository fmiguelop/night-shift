export const EFFECT_SOUNDS=Object.freeze(Object.fromEntries([
 'footsteps','taps','whistle','clicks','door','electric','monitor','metal','creak','power',
].map(name=>[name,new URL(`../assets/audio/fx-${name}.mp3`,import.meta.url)])));
const requests=Object.entries(EFFECT_SOUNDS).map(([name,url])=>[name,fetch(url)
 .then(response=>{if(!response.ok)throw Error(`${name} effect failed to load`);return response.arrayBuffer()})
 .catch(error=>{console.warn(error);return null})]);

export function createSoundEffects(context,destination,random=Math.random){
 const buffers={},voices=new Set();let creakIn=12+random()*14,lastWarning=-Infinity;
 const ready=Promise.all(requests.map(async([name,request])=>{
  try{const bytes=await request;if(bytes)buffers[name]=await context.decodeAudioData(bytes.slice(0))}
  catch(error){console.warn(`${name} effect failed to decode`,error)}
 })).then(()=>buffers);
 function stop(voice){voice.source.onended=null;voice.source.stop();voice.clean()}
 function reset(){for(const voice of [...voices])stop(voice);creakIn=12+random()*14;lastWarning=-Infinity}
 function play(name,{volume=.3,pan=0,rate=1,delay=0,duration,channel=name}={}){
  const buffer=buffers[name];if(!buffer)return;
  for(const voice of [...voices])if(voice.channel===channel)stop(voice);
  if(voices.size>=12)return;
  const source=context.createBufferSource(),gain=context.createGain(),panner=context.createStereoPanner();
  const at=context.currentTime+delay,length=Math.min(duration??buffer.duration/rate,buffer.duration/rate);
  source.buffer=buffer;source.playbackRate.value=rate;panner.pan.value=pan;
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.008);
  gain.gain.setValueAtTime(volume,at+Math.max(.008,length-.06));gain.gain.linearRampToValueAtTime(0,at+length);
  source.connect(gain);gain.connect(panner);panner.connect(destination);
  const voice={source,channel,clean(){source.disconnect();gain.disconnect();panner.disconnect();voices.delete(voice)}};
  voices.add(voice);source.onended=()=>voice.clean();source.start(at);source.stop(at+length);
 }
 function actorCue(event){
  lastWarning=context.currentTime;
  // Decorative creaks never coincide with an actionable character warning.
  for(const voice of [...voices])if(voice.channel==='room')stop(voice);
  const pan=event.side==='left'?-.75:.75,retreat=event.type==='retreat',volume=retreat?.15:.34;
  const channel=`actor-${event.actor}`;
  if(event.actor==='Walter')play('footsteps',{pan,volume,rate:event.type==='near'?.78:.9,channel});
  if(event.actor==='Pip'){
   if(event.type==='dash')play('footsteps',{pan,volume:.48,rate:1.65,duration:1.7,channel});
   else play('taps',{pan,volume,rate:event.type==='tapping'?1.3:1,channel});
  }
  if(event.actor==='Dot'){
   const clicking=event.type==='near'||event.type==='adapt';
   if(clicking){
    for(let i=0;i<(event.type==='adapt'?4:2);i++)play('clicks',{pan,volume:event.type==='adapt'?.4:.28,rate:1.2,delay:i*.16,channel:`dot-click-${i}`});
   }else play('whistle',{pan,volume:retreat?.12:.24,channel});
  }
 }
 function control(key,on){
  const pan=key.startsWith('left')?-.65:key.startsWith('right')?.65:0;
  if(key==='monitor')play('monitor',{volume:on?.22:.14,rate:on?1:1.15,duration:on?.8:.3,channel:'monitor'});
  else if(key.endsWith('Light'))play('electric',{pan,volume:on?.17:.09,duration:on?.75:.14,channel:key});
  else play('door',{pan,volume:on?.42:.23,rate:on?1:.85,duration:on?1:.65,channel:key});
 }
 function tick(dt){
  creakIn-=dt;if(creakIn>0)return;
  if(context.currentTime-lastWarning<4){creakIn=4;return}
  play(random()<.8?'creak':'metal',{volume:.08,pan:(random()-.5)*.8,channel:'room'});
  creakIn=16+random()*18;
 }
 function powerFailure(){reset();play('power',{volume:.4,channel:'power'})}
 return {ready,play,reset,actorCue,control,tick,powerFailure};
}
