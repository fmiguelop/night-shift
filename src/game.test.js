import test from 'node:test';import assert from 'node:assert/strict';import {createGame,tick,DURATION,usage} from './game.js';
test('reaches 6 AM with sufficient power',()=>{const g=createGame(()=>1);for(let i=0;i<DURATION*10+1;i++)tick(g,.1);assert.equal(g.phase,'won')});
test('an open door lets a visitor enter',()=>{const g=createGame(()=>1);g.actors[0].step=3;tick(g,5.1);assert.equal(g.phase,'lost');assert.equal(g.killer,'Marlow')});
test('a closed door repels a visitor',()=>{const g=createGame(()=>1);g.left=true;g.actors[0].step=3;tick(g,5.1);assert.equal(g.phase,'playing');assert.equal(g.actors[0].step,1)});
test('devices increase consumption and power failure opens doors',()=>{let a=createGame(()=>1),b=createGame(()=>1);b.left=b.right=b.monitor=true;assert.equal(usage(b),4);tick(a,1);tick(b,1);assert.ok(b.power<a.power);b.power=.01;tick(b,1);assert.equal(b.left,false);assert.equal(b.monitor,false);tick(b,10);assert.equal(b.phase,'lost')});
