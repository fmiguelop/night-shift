import test from 'node:test';
import assert from 'node:assert/strict';
import {loadProgress,saveProgress,recordWin,PROGRESS_KEY,hasSeenTranscript,recordTranscript,resetTranscripts} from './progression.js';

function memoryStorage(){
 const values=new Map();
 return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
}

test('wins unlock one night at a time and persist across reloads',()=>{
 const storage=memoryStorage();let progress=loadProgress(storage);
 assert.deepEqual(progress,{unlockedNight:1,completed:false,seenTranscripts:[]});
 for(let night=1;night<=5;night++){
  progress=recordWin(progress,night);
  assert.equal(progress.unlockedNight,Math.min(5,night+1));
  assert.equal(progress.completed,night===5);
  assert.equal(saveProgress(progress,storage),true);
  assert.deepEqual(loadProgress(storage),progress);
 }
});
test('replaying earlier nights preserves unlocks and campaign completion',()=>{
 const progress={unlockedNight:5,completed:true};
 assert.deepEqual(recordWin(progress,1),progress);
 assert.deepEqual(recordWin({unlockedNight:1,completed:false,seenTranscripts:[]},5),{unlockedNight:1,completed:false,seenTranscripts:[]});
});
test('missing, corrupt and invalid saves start safely at night one',()=>{
 const storage=memoryStorage();
 for(const value of [null,'bad json','null','{}','{"unlockedNight":0}','{"unlockedNight":6}','{"unlockedNight":2.5}','{"unlockedNight":"5"}']){
  if(value!==null)storage.setItem(PROGRESS_KEY,value);
  assert.deepEqual(loadProgress(storage),{unlockedNight:1,completed:false,seenTranscripts:[]});
 }
 storage.setItem(PROGRESS_KEY,'{"unlockedNight":3,"completed":true}');
 assert.deepEqual(loadProgress(storage),{unlockedNight:3,completed:false,seenTranscripts:[]});
});
test('unavailable storage does not prevent in-session progression',()=>{
 const storage={getItem(){throw Error('blocked');},setItem(){throw Error('full');}};
 const progress=recordWin(loadProgress(storage),1);
 assert.equal(progress.unlockedNight,2);assert.equal(saveProgress(progress,storage),false);
});

test('old saves gain empty transcript history without losing unlocks',()=>{
 const storage=memoryStorage();
 storage.setItem(PROGRESS_KEY,JSON.stringify({unlockedNight:5,completed:true}));
 assert.deepEqual(loadProgress(storage),{unlockedNight:5,completed:true,seenTranscripts:[]});
});
test('transcript introductions persist, survive wins, and reset independently of unlocks',()=>{
 const storage=memoryStorage();
 let progress=recordTranscript(loadProgress(storage),1);
 assert.equal(hasSeenTranscript(progress,1),true);
 assert.equal(hasSeenTranscript(progress,2),false);
 assert.equal(recordTranscript(progress,1),progress);
 progress=recordWin(progress,1);
 assert.deepEqual(progress.seenTranscripts,[1]);
 saveProgress(progress,storage);
 progress=loadProgress(storage);
 assert.equal(hasSeenTranscript(progress,1),true);
 assert.equal(hasSeenTranscript(progress,2),false);
 progress=recordTranscript(progress,2);
 assert.deepEqual(progress.seenTranscripts,[1,2]);
 const reset=resetTranscripts({...progress,unlockedNight:5,completed:true});
 assert.deepEqual(reset,{unlockedNight:5,completed:true,seenTranscripts:[]});
 saveProgress(reset,storage);
 assert.deepEqual(loadProgress(storage),reset);
});
test('transcript history rejects invalid and locked nights when loaded or recorded',()=>{
 const storage=memoryStorage();
 storage.setItem(PROGRESS_KEY,JSON.stringify({unlockedNight:3,seenTranscripts:[1,1,2,0,4,6,-1,1.5,'3',null]}));
 const progress=loadProgress(storage);
 assert.deepEqual(progress.seenTranscripts,[1,2]);
 for(const night of [0,4,6,-1,1.5,'3',null])assert.equal(recordTranscript(progress,night),progress);
 storage.setItem(PROGRESS_KEY,JSON.stringify({unlockedNight:3,seenTranscripts:'bad'}));
 assert.deepEqual(loadProgress(storage).seenTranscripts,[]);
});
test('transcript history still works in session when saving fails',()=>{
 const storage={getItem(){throw Error('blocked');},setItem(){throw Error('full');}};
 const progress=recordTranscript(loadProgress(storage),1);
 assert.equal(saveProgress(progress,storage),false);
 assert.equal(hasSeenTranscript(progress,1),true);
 assert.equal(hasSeenTranscript(resetTranscripts(progress),1),false);
});
