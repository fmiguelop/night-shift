import test from 'node:test';
import assert from 'node:assert/strict';
import {loadProgress,saveProgress,recordWin,PROGRESS_KEY} from './progression.js';

function memoryStorage(){
 const values=new Map();
 return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
}

test('wins unlock one night at a time and persist across reloads',()=>{
 const storage=memoryStorage();let progress=loadProgress(storage);
 assert.deepEqual(progress,{unlockedNight:1,completed:false});
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
 assert.deepEqual(recordWin({unlockedNight:1,completed:false},5),{unlockedNight:1,completed:false});
});
test('missing, corrupt and invalid saves start safely at night one',()=>{
 const storage=memoryStorage();
 for(const value of [null,'bad json','null','{}','{"unlockedNight":0}','{"unlockedNight":6}','{"unlockedNight":2.5}','{"unlockedNight":"5"}']){
  if(value!==null)storage.setItem(PROGRESS_KEY,value);
  assert.deepEqual(loadProgress(storage),{unlockedNight:1,completed:false});
 }
 storage.setItem(PROGRESS_KEY,'{"unlockedNight":3,"completed":true}');
 assert.deepEqual(loadProgress(storage),{unlockedNight:3,completed:false});
});
test('unavailable storage does not prevent in-session progression',()=>{
 const storage={getItem(){throw Error('blocked');},setItem(){throw Error('full');}};
 const progress=recordWin(loadProgress(storage),1);
 assert.equal(progress.unlockedNight,2);assert.equal(saveProgress(progress,storage),false);
});
