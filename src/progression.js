import {NIGHT_COUNT,normalizeNight} from './game.js';

export const PROGRESS_KEY='the-night-shift.progress.v1';
const fresh=()=>({unlockedNight:1,completed:false,seenTranscripts:[]});

export function loadProgress(storage){
 try{
  const saved=JSON.parse((storage??globalThis.localStorage).getItem(PROGRESS_KEY));
  if(!saved||!Number.isInteger(saved.unlockedNight)||saved.unlockedNight<1||saved.unlockedNight>NIGHT_COUNT)return fresh();
  const seenTranscripts=Array.isArray(saved.seenTranscripts)?[...new Set(saved.seenTranscripts.filter(night=>Number.isInteger(night)&&night>=1&&night<=saved.unlockedNight))]:[];
  return {unlockedNight:saved.unlockedNight,completed:saved.unlockedNight===NIGHT_COUNT&&saved.completed===true,seenTranscripts};
 }catch{return fresh();}
}

export function recordWin(progress,night){
 night=normalizeNight(night);
 if(night>progress.unlockedNight)return {...progress};
 return {...progress,unlockedNight:Math.max(progress.unlockedNight,Math.min(NIGHT_COUNT,night+1)),completed:progress.completed||night===NIGHT_COUNT};
}

export function hasSeenTranscript(progress,night){return progress.seenTranscripts?.includes(night)??false;}

export function recordTranscript(progress,night){
 if(!Number.isInteger(night)||night<1||night>progress.unlockedNight||hasSeenTranscript(progress,night))return progress;
 return {...progress,seenTranscripts:[...(progress.seenTranscripts??[]),night]};
}

export function resetTranscripts(progress){return {...progress,seenTranscripts:[]};}

export function saveProgress(progress,storage){
 try{(storage??globalThis.localStorage).setItem(PROGRESS_KEY,JSON.stringify(progress));return true;}
 catch{return false;}
}
