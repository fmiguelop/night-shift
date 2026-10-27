// Shared atlas layout: three columns, two rows, 512px square cells.
export const CHARACTER_SHEETS = {Marlow:'marlow',Pip:'pip',Dot:'dot'};
export const POSES = {idle:[0,0],angleA:[1,0],angleB:[2,0],doorway:[0,1],attack:[1,1]};
const sheetUrl=id=>new URL(`../assets/characters/test/${id}.png`,import.meta.url).href;

export function characterMarkup(actor,pose='idle',{mirror=false}={}){
 const id=CHARACTER_SHEETS[actor.name]||'marlow';
 const [column,row]=POSES[pose]||POSES.idle;
 return `<div class="character sprite-character${pose==='attack'?' sprite-attack':''}" role="img" aria-label="${id}" style="--sheet:url('${sheetUrl(id)}');--frame-x:${column*50}%;--frame-y:${row*100}%;--facing:${mirror?-1:1}"><span class="sprite-frame"></span></div>`;
}

export function preloadCharacters(){
 // Start decoding all sheets before the player reaches a doorway or jumpscare.
 return Promise.all(Object.values(CHARACTER_SHEETS).map(id=>{
  const image=new Image();image.src=sheetUrl(id);
  return image.decode().catch(()=>{});
 }));
}
