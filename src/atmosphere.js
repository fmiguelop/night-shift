const atmosphereBytes=fetch(new URL('../assets/audio/eerie-atmosphere.mp3',import.meta.url))
 .then(response=>{if(!response.ok)throw Error('Atmosphere failed to load');return response.arrayBuffer()})
 .catch(error=>{console.warn(error);return null});

export function createAtmosphere(context,destination){
 const gain=context.createGain();gain.gain.value=0;gain.connect(destination);
 let buffer,source,wanted=false;
 function update(){
  if(!buffer)return;
  if(wanted&&!source){
   source=context.createBufferSource();source.buffer=buffer;source.loop=true;
   source.connect(gain);source.start();
  }
  const now=context.currentTime;
  gain.gain.cancelAndHoldAtTime(now);
  gain.gain.linearRampToValueAtTime(wanted?.18:0,now+(wanted?.8:.2));
 }
 const ready=atmosphereBytes.then(bytes=>bytes?context.decodeAudioData(bytes.slice(0)):null)
  .then(decoded=>{buffer=decoded;update();return buffer})
  .catch(error=>console.warn('Atmosphere failed to decode',error));
 function setPlaying(playing){if(wanted===playing)return;wanted=playing;update()}
 return {setPlaying,ready};
}
