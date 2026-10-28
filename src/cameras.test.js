import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMERA_ROOMS,createCameraRenderer} from './cameras.js';

test('all camera lenses produce finite geometry, respond to resize and cache unchanged feeds',()=>{
 let resized,polygons=0;
 const ctx={save(){},restore(){},transform(...n){assert.ok(n.every(Number.isFinite))},fillText(){},fillRect(...n){assert.ok(n.every(Number.isFinite))},beginPath(){},closePath(){},fill(){polygons++},stroke(){},moveTo(...n){assert.ok(n.every(Number.isFinite))},lineTo(...n){assert.ok(n.every(Number.isFinite))},createRadialGradient(...n){assert.ok(n.every(Number.isFinite));return {addColorStop(){}}}};
 const canvas={getContext(){return ctx},getBoundingClientRect(){return {width:1280,height:720}}};
 const cast={children:[],replaceChildren(){this.children=[]},append(el){this.children.push(el)}};
 const oldResize=globalThis.ResizeObserver,oldDocument=globalThis.document;
 globalThis.ResizeObserver=class{constructor(fn){resized=fn}observe(){}};
 globalThis.document={createElement(){return {style:{},setAttribute(){}}}};
 try{
  const renderer=createCameraRenderer(canvas,cast);
  for(let i=0;i<CAMERA_ROOMS.length;i++){
   const before=polygons;
   renderer.draw(i,[{name:'Walter',kind:'human'}]);
   assert.ok(polygons>before+20,`${CAMERA_ROOMS[i].key} must draw room geometry`);
   assert.equal(cast.children.length,1);
   assert.ok(!/NaN|Infinity/.test(cast.children[0].style.cssText));
  }
  const before=polygons;
  renderer.draw(7,[{name:'Walter',kind:'human'}]);assert.equal(polygons,before);
  resized();renderer.draw(7,[{name:'Walter',kind:'human'}]);assert.ok(polygons>before);
  renderer.draw(7,[]);assert.equal(cast.children.length,0);
 }finally{globalThis.ResizeObserver=oldResize;globalThis.document=oldDocument}
});
