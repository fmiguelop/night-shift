// Three columns and two rows. Walter's row split is 560px; older sheets use 512px.
export const CHARACTER_SHEETS = {Walter:'walter',Pip:'pip',Dot:'dot'};
export const POSES = {idle:[0,0],angleA:[1,0],angleB:[2,0],doorway:[0,1],attack:[1,1]};
const sheetUrl=id=>new URL(`../assets/characters/test/${id}.png`,import.meta.url).href;
export const WALTER_ATTACK_IMAGES = ['walter-attack-lunge','walter-attack-grab','walter-attack-impact'];

function walterAttackMarkup(){
 const atlas=column=>`--attack-image:url('${sheetUrl('walter')}');--attack-size:300% ${1024/464*100}%;--attack-height:${464/512*100}%;--attack-position:${column*50}% 100%`;
 const portrait=id=>`--attack-image:url('${sheetUrl(id)}')`;
 const frames=[atlas(1),portrait(WALTER_ATTACK_IMAGES[0]),atlas(2),portrait(WALTER_ATTACK_IMAGES[1]),portrait(WALTER_ATTACK_IMAGES[2])];
 return `<div class="character sprite-character sprite-attack walter-attack" role="img" aria-label="Walter">${frames.map(style=>`<span class="attack-frame" aria-hidden="true" style="${style}"></span>`).join('')}</div>`;
}

export function characterMarkup(actor,pose='idle',{mirror=false}={}){
 const id=CHARACTER_SHEETS[actor.name]||'walter';
 if(id==='walter'&&pose==='attack')return walterAttackMarkup();
 const [column,row]=POSES[pose]||POSES.idle;
 // Keep each source rectangle's proportions inside the square display frame.
 const height=id==='walter'?(row===0?560:464):512;
 const sizing=`--sheet-height:${1024/height*100}%;--frame-width:${Math.min(100,512/height*100)}%;--frame-height:${Math.min(100,height/512*100)}%`;
 return `<div class="character sprite-character${pose==='attack'?' sprite-attack':''}" role="img" aria-label="${CHARACTER_SHEETS[actor.name]?actor.name:'Walter'}" style="--sheet:url('${sheetUrl(id)}');--frame-x:${column*50}%;--frame-y:${row*100}%;--facing:${mirror?-1:1};${sizing}"><span class="sprite-frame"></span></div>`;
}

export function preloadCharacters(){
 // Start decoding all sheets before the player reaches a doorway or jumpscare.
 return Promise.all([...Object.values(CHARACTER_SHEETS),...WALTER_ATTACK_IMAGES].map(id=>{
  const image=new Image();image.src=sheetUrl(id);
  return image.decode().catch(()=>{});
 }));
}
