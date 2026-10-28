export const SCARE_SOUNDS=Object.freeze({
 Walter:new URL('../assets/audio/walter-jumpscare.mp3',import.meta.url),
 Pip:new URL('../assets/audio/pip-jumpscare.mp3',import.meta.url),
 Dot:new URL('../assets/audio/dot-jumpscare.mp3',import.meta.url),
});
// Start fetching during page load, before the player enables sound.
const screamBytes=Object.fromEntries(Object.entries(SCARE_SOUNDS).map(([actor,url])=>[
 actor,fetch(url)
  .then(response=>{if(!response.ok)throw Error(`${actor} scream failed to load`);return response.arrayBuffer()})
  .catch(error=>{console.warn(error);return null}),
]));

export function createScareAudio(context){
 const ambience=context.createGain(),master=context.createGain(),limiter=context.createDynamicsCompressor();
 master.gain.value=.7;
 limiter.threshold.value=-10;limiter.knee.value=6;limiter.ratio.value=12;
 limiter.attack.value=.002;limiter.release.value=.08;
 ambience.connect(master);master.connect(limiter);limiter.connect(context.destination);
 const buffers={};
 const ready=Promise.all(Object.entries(screamBytes).map(async([actor,request])=>{
  try{
   const bytes=await request;
   if(bytes)buffers[actor]=await context.decodeAudioData(bytes.slice(0));
  }catch(error){console.warn(`${actor} scream failed to decode`,error)}
 })).then(()=>buffers);
 let cancel=()=>{};
 function reset(){cancel();ambience.gain.cancelScheduledValues(context.currentTime);ambience.gain.setValueAtTime(1,context.currentTime)}
 function play(actor){
  reset();
  const buffer=buffers[actor]||buffers.Walter;
  if(!buffer)return;
  const now=context.currentTime,source=context.createBufferSource(),gain=context.createGain();
  ambience.gain.setValueAtTime(1,now);ambience.gain.linearRampToValueAtTime(.015,now+.012);
  // These are complete designed effects: preserve their pitch, speed and mix.
  // Fade the selected excerpt out just before the 1.25-second loss overlay.
  source.buffer=buffer;
  const duration=Math.min(1.2,buffer.duration);
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+.005);
  gain.gain.setValueAtTime(1,now+Math.max(.005,duration-.08));
  gain.gain.linearRampToValueAtTime(0,now+duration);
  source.connect(gain);gain.connect(master);
  const disconnect=()=>{source.disconnect();gain.disconnect();cancel=()=>{}};
  source.onended=disconnect;
  cancel=()=>{source.onended=null;source.stop();disconnect()};
  source.start(now);source.stop(now+duration);
 }
 return {ambience,play,reset,ready};
}
