export const ROOMS = ['Aula magna','Biblioteca','Laboratorio','Pasillo oeste','Pasillo este','Archivo','Escalera oeste','Vestíbulo docente'];
export const DURATION = 240;
export const NIGHT_COUNT = 5;
// Each row defines a baseline and a gradual rise over the four-minute shift.
export const NIGHT_CONFIGS = Object.freeze([
 {pipActiveAt:55,dotActiveAt:100,walterInterval:12,dotInterval:10,moveStart:.30,moveEnd:.50,pipStart:.80,pipEnd:1.10},
 {pipActiveAt:42.5,dotActiveAt:80,walterInterval:11,dotInterval:9,moveStart:.35,moveEnd:.575,pipStart:.90,pipEnd:1.25},
 {pipActiveAt:30,dotActiveAt:60,walterInterval:10,dotInterval:8,moveStart:.40,moveEnd:.65,pipStart:1,pipEnd:1.40},
 {pipActiveAt:20,dotActiveAt:42.5,walterInterval:9,dotInterval:7.5,moveStart:.45,moveEnd:.725,pipStart:1.10,pipEnd:1.55},
 {pipActiveAt:10,dotActiveAt:25,walterInterval:8,dotInterval:7,moveStart:.50,moveEnd:.80,pipStart:1.20,pipEnd:1.70}
].map(Object.freeze));
export function normalizeNight(night){return Number.isInteger(night)?Math.max(1,Math.min(NIGHT_COUNT,night)):1;}
export function difficultyAt(night,elapsed){
 const config=NIGHT_CONFIGS[normalizeNight(night)-1];
 const progress=Math.max(0,Math.min(1,elapsed/DURATION));
 return {...config,moveChance:config.moveStart+(config.moveEnd-config.moveStart)*progress,pipRate:config.pipStart+(config.pipEnd-config.pipStart)*progress};
}
export const DEATH_HINTS = {
 Walter: 'Walter avanza más rápido mientras usás el monitor. Revisá las cámaras brevemente y cerrá la puerta oeste cuando sus pasos lleguen a la oficina.',
 Pip: 'Si escuchás correr a Pip, ya comenzó su carrera. Cerrá la puerta oeste de inmediato. Revisar el archivo retrasa su ataque.',
 Dot: 'Los destellos breves de la luz este ahuyentan a Dot. Si la dejás encendida, se adapta; cerrá la puerta este si no se va.'
};
export function createGame(random = Math.random, night = 1) {
 night=normalizeNight(night);
 const config=NIGHT_CONFIGS[night-1];
 return {night,phase:'playing',elapsed:0,camera:0,power:100,left:false,right:false,leftLight:false,rightLight:false,monitor:false,blackout:0,random,events:[],actors:[
  {name:'Walter',kind:'human',route:[0,1,3,6],step:0,wait:0,timer:0,activeAt:0},
  {name:'Pip',kind:'rabbit',route:[2,5,3,6],step:0,wait:0,timer:0,charge:0,dashing:false,activeAt:config.pipActiveAt},
  {name:'Dot',kind:'bird',route:[0,1,4,7],step:0,wait:0,timer:0,exposure:0,lightHeld:0,activeAt:config.dotActiveAt}
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
 const difficulty=difficultyAt(g.night,g.elapsed);
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
   a.charge+=dt*(g.monitor&&g.camera===5?.22:1)*difficulty.pipRate;
   if(a.step===0){a.step=1;cue(g,a,'move');}
   if(a.charge>=12&&a.step===1){a.step=2;cue(g,a,'tapping');}
   if(a.charge>=20&&!a.dashing){a.dashing=true;a.timer=0;cue(g,a,'dash');}
   if(a.dashing){a.timer+=dt;if(a.timer>=2.5){a.step=3;a.wait=0;}}
   continue;
  }
  a.timer+=dt*(a.kind==='human'&&g.monitor?1.65:1);
  const interval=a.kind==='human'?difficulty.walterInterval:difficulty.dotInterval;
  if(a.timer>=interval){a.timer%=interval;if(g.random()<difficulty.moveChance){a.step++;a.wait=0;cue(g,a,a.step===3?'near':'move');}}
 }
}
