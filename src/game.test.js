import test from 'node:test';import assert from 'node:assert/strict';import {createGame,tick,DURATION,usage,NIGHT_CONFIGS,NIGHT_COUNT,difficultyAt} from './game.js';
test('reaches 6 AM with sufficient power',()=>{const g=createGame(()=>1);g.actors=[];for(let i=0;i<DURATION*10+1;i++)tick(g,.1);assert.equal(g.phase,'won')});
test('an open door lets a visitor enter',()=>{const g=createGame(()=>1);g.actors[0].step=3;tick(g,5.1);assert.equal(g.phase,'lost');assert.equal(g.killer,'Walter')});
test('a closed door repels a visitor',()=>{const g=createGame(()=>1);g.left=true;g.actors[0].step=3;tick(g,5.1);assert.equal(g.phase,'playing');assert.equal(g.actors[0].step,1)});
test('devices increase consumption and power failure opens doors',()=>{let a=createGame(()=>1),b=createGame(()=>1);b.left=b.right=b.monitor=true;assert.equal(usage(b),4);tick(a,1);tick(b,1);assert.ok(b.power<a.power);b.power=.01;tick(b,1);assert.equal(b.left,false);assert.equal(b.monitor,false);tick(b,10);assert.equal(b.phase,'lost')});
test('Walter advances sooner with the monitor raised',()=>{const a=createGame(()=>0),b=createGame(()=>0);b.monitor=true;for(let i=0;i<80;i++){tick(a,.1);tick(b,.1)}assert.equal(a.actors[0].step,0);assert.equal(b.actors[0].step,1)});
test('archives checks slow Pip but do not stop his buildup',()=>{const a=createGame(()=>1),b=createGame(()=>1);a.elapsed=b.elapsed=a.actors[1].activeAt;b.monitor=true;b.camera=5;for(let i=0;i<150;i++){tick(a,.1);tick(b,.1)}assert.ok(a.actors[1].charge>b.actors[1].charge);assert.ok(b.actors[1].charge>0);assert.equal(b.actors[1].step,1)});
test('Pip warns before arriving and a closed door blocks his dash',()=>{const g=createGame(()=>1);g.elapsed=g.actors[1].activeAt;g.left=true;for(let i=0;i<320;i++)tick(g,.1);assert.ok(g.events.some(e=>e.actor==='Pip'&&e.type==='dash'));assert.ok(g.events.some(e=>e.actor==='Pip'&&e.type==='retreat'));assert.equal(g.phase,'playing')});
test('Dot retreats from a short flash',()=>{const g=createGame(()=>1);g.elapsed=g.actors[2].activeAt;const dot=g.actors[2];dot.step=3;g.rightLight=true;for(let i=0;i<3;i++)tick(g,.1);assert.equal(dot.step,2);assert.equal(dot.wait,0)});
test('Dot adapts to an already held light and attacks unless blocked',()=>{const g=createGame(()=>1);g.elapsed=g.actors[2].activeAt;g.rightLight=true;for(let i=0;i<20;i++)tick(g,.1);g.actors[2].step=3;for(let i=0;i<51;i++)tick(g,.1);assert.equal(g.killer,'Dot');assert.ok(g.events.some(e=>e.type==='adapt'))});
test('Pip and Dot stay inactive during the opening introduction',()=>{const g=createGame(()=>0);for(let i=0;i<300;i++)tick(g,.1);assert.equal(g.actors[1].step,0);assert.equal(g.actors[2].step,0)});

function advance(g,seconds){for(let i=0;i<seconds*10;i++)tick(g,.1);}
test('every later night activates threats earlier and increases pressure throughout the shift',()=>{
 for(let night=1;night<=NIGHT_COUNT;night++){
  const start=difficultyAt(night,0),middle=difficultyAt(night,120),end=difficultyAt(night,240);
  assert.ok(start.moveChance<middle.moveChance&&middle.moveChance<end.moveChance);
  assert.ok(start.pipRate<middle.pipRate&&middle.pipRate<end.pipRate);
  if(night===1)continue;
  const previous=difficultyAt(night-1,120);
  assert.ok(middle.pipActiveAt<previous.pipActiveAt&&middle.dotActiveAt<previous.dotActiveAt);
  assert.ok(middle.walterInterval<previous.walterInterval&&middle.dotInterval<previous.dotInterval);
  assert.ok(middle.moveChance>previous.moveChance&&middle.pipRate>previous.pipRate);
 }
});
test('activation gates and fixed routes apply on every night',()=>{
 for(let night=1;night<=NIGHT_COUNT;night++){
  for(const index of [1,2]){
   const g=createGame(()=>0,night),actor=g.actors[index];g.actors=[actor];
   g.elapsed=actor.activeAt-1;tick(g,.5);
   assert.equal(actor.step,0);assert.equal(actor.timer,0);assert.equal(actor.charge||0,0);
   advance(g,12);
   assert.ok(actor.step>0,`${actor.name} must activate on night ${night}`);
  }
 }
});
test('later-night movement intervals and probabilities drive real actor movement',()=>{
 for(const kind of ['human','bird']){
  const games=[1,3,5].map(n=>createGame(()=>.45,n));
  for(const g of games){const actor=g.actors.find(a=>a.kind===kind);g.actors=[actor];actor.activeAt=0;advance(g,12.1);}
  assert.equal(games[0].actors[0].step,0);
  assert.equal(games[1].actors[0].step,0);
  assert.ok(games[2].actors[0].step>0);
 }
});
test('the same night becomes more aggressive toward morning',()=>{
 for(const kind of ['human','bird']){
  const games=[0,200].map(elapsed=>{const g=createGame(()=>.45,1);g.elapsed=elapsed;g.actors=g.actors.filter(a=>a.kind===kind);g.actors[0].activeAt=0;advance(g,12.1);return g;});
  assert.equal(games[0].actors[0].step,0);assert.ok(games[1].actors[0].step>0);
 }
 const charges=[0,200].map(elapsed=>{const g=createGame(()=>1,1);g.elapsed=elapsed;g.actors=[g.actors[1]];g.actors[0].activeAt=0;advance(g,5);return g.actors[0].charge;});
 assert.ok(charges[1]>charges[0]);
});
test('Pip charges faster on successive nights while Archives keeps its slowdown',()=>{
 let previous=0;
 for(let night=1;night<=NIGHT_COUNT;night++){
  const games=[false,true].map(watching=>{const g=createGame(()=>1,night);g.elapsed=120;g.monitor=watching;g.camera=5;g.actors=[g.actors[1]];advance(g,5);return g;});
  const normal=games[0].actors[0].charge,observed=games[1].actors[0].charge;
  assert.ok(normal>previous);assert.ok(Math.abs(observed/normal-.22)<1e-10);previous=normal;
 }
});
test('attack windows, door defenses and light flashes remain consistent on all nights',()=>{
 for(let night=1;night<=NIGHT_COUNT;night++){
  for(const index of [0,1,2]){
   for(const blocked of [false,true]){
    const g=createGame(()=>1,night),actor=g.actors[index];g.actors=[actor];g.elapsed=120;
    actor.step=3;g[actor.kind==='bird'?'right':'left']=blocked;
    advance(g,actor.kind==='rabbit'?1.7:4.9);assert.equal(g.phase,'playing');
    advance(g,.3);assert.equal(g.phase,blocked?'playing':'lost');
    if(blocked)assert.equal(actor.step,1);else assert.equal(g.killer,actor.name);
   }
  }
  const g=createGame(()=>1,night);g.elapsed=120;g.actors=[g.actors[2]];g.actors[0].step=3;g.rightLight=true;
  advance(g,.3);assert.equal(g.actors[0].step,2);
 }
});
test('all nights have the same duration and power costs and reset on retry',()=>{
 for(let night=1;night<=NIGHT_COUNT;night++){
  const g=createGame(()=>1,night);g.actors=[];g.left=true;tick(g,5);
  assert.ok(Math.abs(g.power-(100-5*(.105+2*.057)))<1e-10);
  g.left=false;advance(g,235.1);assert.equal(g.phase,'won');
  const retry=createGame(()=>1,night);assert.equal(retry.night,night);assert.equal(retry.power,100);assert.equal(retry.elapsed,0);
  assert.ok(retry.actors.every(a=>a.step===0&&a.wait===0&&a.timer===0));
 }
});
test('difficulty inputs are bounded',()=>{
 assert.equal(createGame(()=>1,99).night,5);assert.equal(createGame(()=>1,-2).night,1);assert.equal(createGame(()=>1,NaN).night,1);
 assert.equal(difficultyAt(1,-100).moveChance,NIGHT_CONFIGS[0].moveStart);
 assert.equal(difficultyAt(5,999).pipRate,NIGHT_CONFIGS[4].pipEnd);
});
