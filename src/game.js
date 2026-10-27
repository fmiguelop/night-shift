export const ROOMS = ['Lecture hall','Library','Teaching lab','West corridor','East corridor','Archives','West stairwell','Faculty lobby'];
export const DURATION = 240;
export const DEATH_HINTS = {
 Marlow: 'Marlow advances faster while your monitor is raised. Keep checks brief and close the west door when his chuckle reaches the office.',
 Pip: 'Pip’s running footsteps mean a dash has begun. Close the west door immediately. Checking the archives slows his buildup.',
 Dot: 'Short flashes of the east light repel Dot. A long beam makes her adapt; close the east door if she stays.'
};
export function createGame(random = Math.random) {
 return {phase:'playing',elapsed:0,camera:0,power:100,left:false,right:false,leftLight:false,rightLight:false,monitor:false,blackout:0,random,events:[],actors:[
  {name:'Marlow',kind:'bear',route:[0,1,3,6],step:0,wait:0,timer:0,activeAt:0},
  {name:'Pip',kind:'rabbit',route:[2,5,3,6],step:0,wait:0,timer:0,charge:0,dashing:false,activeAt:35},
  {name:'Dot',kind:'bird',route:[0,1,4,7],step:0,wait:0,timer:0,exposure:0,lightHeld:0,activeAt:70}
 ]};
}
export function usage(g){return 1 + Number(g.left)+Number(g.right)+Number(g.leftLight)+Number(g.rightLight)+Number(g.monitor);}
function cue(g,a,type){g.events.push({actor:a.name,type,side:a.kind==='bird'?'right':'left'});}
function retreat(g,a){a.step=1;a.wait=0;a.timer=0;a.charge=0;a.dashing=false;a.exposure=0;cue(g,a,'retreat');}
export function tick(g,dt){
 if(g.phase!=='playing')return;
 g.elapsed+=dt;
 if(g.elapsed>=DURATION){g.phase='won';return;}
 g.power=Math.max(0,g.power-dt*(.105+usage(g)*.057));
 if(g.power<=0){g.monitor=g.left=g.right=g.leftLight=g.rightLight=false;g.blackout+=dt;if(g.blackout>9)g.phase='lost';return;}
 for(const a of g.actors){
  if(g.elapsed<a.activeAt)continue;
  if(a.kind==='bird'){
   a.lightHeld=g.rightLight?a.lightHeld+dt:0;
   const near=a.step>=2;
   if(near&&g.rightLight){
    a.exposure+=dt;
    if(a.lightHeld<=.8&&a.exposure>=.25){a.step=Math.max(1,a.step-1);a.wait=0;a.exposure=0;cue(g,a,'retreat');continue;}
    if(a.lightHeld>1.5&&!a.adapted){a.adapted=true;cue(g,a,'adapt');}
   }else a.exposure=0;
   if(!g.rightLight)a.adapted=false;
  }
  if(a.step===a.route.length-1){
   a.wait+=dt;
   if(a.wait>(a.kind==='rabbit'?1.8:5)){
    if(!(a.kind==='bird'?g.right:g.left)){g.phase='lost';g.killer=a.name;return;}
    retreat(g,a);
   }
   continue;
  }
  if(a.kind==='rabbit'){
   // Archives observation buys time, but cannot hold Pip indefinitely.
   a.charge+=dt*(g.monitor&&g.camera===5?.22:1)*(1+g.elapsed/DURATION*.5);
   if(a.step===0){a.step=1;cue(g,a,'move');}
   if(a.charge>=12&&a.step===1){a.step=2;cue(g,a,'tapping');}
   if(a.charge>=20&&!a.dashing){a.dashing=true;a.timer=0;cue(g,a,'dash');}
   if(a.dashing){a.timer+=dt;if(a.timer>=2.5){a.step=3;a.wait=0;}}
   continue;
  }
  a.timer+=dt*(a.kind==='bear'&&g.monitor?1.65:1);
  const interval=a.kind==='bear'?10:8;
  if(a.timer>=interval){a.timer%=interval;if(g.random()<.4+g.elapsed/DURATION*.35){a.step++;a.wait=0;cue(g,a,a.step===3?'near':'move');}}
 }
}
