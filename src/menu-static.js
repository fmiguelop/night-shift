// Low-resolution television interference, isolated from the gameplay renderer.
export function createMenuStatic(canvas){
 const context=canvas.getContext('2d');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const pixels=context.createImageData(canvas.width,canvas.height);
 let active=false,frame=0,last=-Infinity;
 function draw(){
  const data=pixels.data;
  for(let y=0;y<canvas.height;y++){
   const line=Math.random()*.3+.7;
   for(let x=0;x<canvas.width;x++){
    const index=(y*canvas.width+x)*4,value=Math.random()*255*line;
    data[index]=data[index+1]=data[index+2]=value;data[index+3]=255;
   }
  }
  context.putImageData(pixels,0,0);
  context.fillStyle='#c8c8c8';
  const band=Math.floor(Math.random()*canvas.height);
  context.globalAlpha=.3;context.fillRect(0,band,canvas.width,1);context.globalAlpha=1;
 }
 function animate(now){
  if(!active||motion.matches)return;
  if(now-last>=125){draw();last=now;}
  frame=requestAnimationFrame(animate);
 }
 function schedule(){
  cancelAnimationFrame(frame);frame=0;
  if(!active)return;
  draw();last=-Infinity;
  if(!motion.matches)frame=requestAnimationFrame(animate);
 }
 motion.addEventListener('change',schedule);
 return {setActive(value){active=value;schedule();}};
}
