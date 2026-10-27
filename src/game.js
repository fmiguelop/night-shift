export const ROOMS = ['Show stage','Dining room','Backstage','West hall','East hall','Supply closet','West corner','East corner'];
export const DURATION = 240;
export function createGame(random = Math.random) {
 return {phase:'playing',elapsed:0,power:100,left:false,right:false,leftLight:false,rightLight:false,monitor:false,camera:0,moveTimer:0,blackout:0,random,actors:[{name:'Marlow',kind:'bear',route:[0,1,3,6],step:0,wait:0},{name:'Pip',kind:'rabbit',route:[2,5,3,6],step:0,wait:0},{name:'Dot',kind:'bird',route:[0,1,4,7],step:0,wait:0}]};
}
export function usage(g){return 1 + Number(g.left)+Number(g.right)+Number(g.leftLight)+Number(g.rightLight)+Number(g.monitor);}
export function tick(g,dt){
 if(g.phase!=='playing')return;
 g.elapsed+=dt;
 if(g.elapsed>=DURATION){g.phase='won';return;}
 g.power=Math.max(0,g.power-dt*(.105+usage(g)*.057));
 if(g.power<=0){g.monitor=g.left=g.right=g.leftLight=g.rightLight=false;g.blackout+=dt;if(g.blackout>9)g.phase='lost';return;}
 for(const a of g.actors){if(a.step===a.route.length-1){a.wait+=dt;if(a.wait>5){const closed=a.route.at(-1)===6?g.left:g.right;if(!closed){g.phase='lost';g.killer=a.name;return;}a.step=1;a.wait=0;}}}
 g.moveTimer+=dt;
 if(g.moveTimer>=7){g.moveTimer=0;for(const a of g.actors){if(a.step<a.route.length-1 && g.random()<.30+g.elapsed/DURATION*.35){a.step++;a.wait=0;}}}
}
