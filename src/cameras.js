// Fixed security-camera lenses and room geometry, in metres.
export const CAMERA_ROOMS = [
 {key:'stage',size:[12,10],eye:[-4.8,3.3,-4],target:[0,1,4],actors:[[-1.8,.65,3.3],[1.5,.65,3.3]],description:'Raised performance platform, curtains and speaker stacks.'},
 {key:'dining',size:[14,17],eye:[5.7,3.5,-6.8],target:[-1,0,5],actors:[[-3,0,6],[1,0,8]],description:'Dining room with rows of tables and a rear service opening.'},
 {key:'backstage',size:[8,10],eye:[-3.2,3,-3.8],target:[1,1,3],actors:[[1,0,2.5],[-1,0,3]],description:'Backstage workbench, spare equipment and storage crates.'},
 {key:'west-hall',size:[4.4,19],eye:[1.5,3,-8],target:[-.6,.7,7],actors:[[0,0,4],[.5,0,7]],description:'Long west corridor, side doorways and ceiling lights.'},
 {key:'east-hall',size:[4.4,19],eye:[-1.5,3,-8],target:[.5,.6,8],actors:[[0,0,5],[.5,0,7]],description:'East corridor with service doors and exposed wall pipes.'},
 {key:'closet',size:[7,8],eye:[2.7,2.9,-3],target:[-1,.8,2],actors:[[-.4,0,1.8],[1,0,2]],description:'Supply closet with metal shelves, boxes and cleaning equipment.'},
 {key:'west-corner',size:[6,7],eye:[-2.5,3,-2.7],target:[1,.6,2.5],actors:[[.5,0,1.1],[-.7,0,2]],description:'West blind corner immediately outside the security office.'},
 {key:'east-corner',size:[6,7],eye:[2.5,3,-2.7],target:[-1,.6,2.5],actors:[[-.5,0,1.1],[.7,0,2]],description:'East blind corner with a maintenance cart and office approach.'}
];
export const MAP_POSITIONS = [[49,9],[49,32],[15,14],[19,53],[79,53],[15,34],[25,77],[73,77]];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);return a.map(v=>v/n)};

export function createCameraRenderer(canvas, cast){
 const ctx=canvas.getContext('2d',{alpha:false});
 let last='', dirty=true;
 const observer=new ResizeObserver(()=>{dirty=true});observer.observe(canvas);
 function draw(index, actors){
  const signature=index+':'+actors.map(a=>a.name).join(',');
  if(!dirty&&last===signature)return;
  dirty=false;last=signature;
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height){dirty=true;return}
  // A modest sensor resolution is deliberate; interference is composited in CSS.
  const w=canvas.width=Math.min(1440,Math.round(rect.width)),h=canvas.height=Math.round(w*rect.height/rect.width);
  const room=CAMERA_ROOMS[index], [rw,rd]=room.size, eye=room.eye;
  const forward=unit(sub(room.target,eye)),right=unit(cross([0,1,0],forward)),up=cross(forward,right);
  const f=Math.min(w*.8,h*1.2), faces=[];
  function project(p){const v=sub(p,eye),z=dot(v,forward);return z<.12?null:[w*.5+dot(v,right)*f/z,h*.47-dot(v,up)*f/z,z]}
  function face(points,tone){const p=points.map(project);if(p.some(v=>!v))return;faces.push({p,tone,z:p.reduce((s,v)=>s+v[2],0)/p.length})}
  function box(x,y,z,bw,bh,bd,tone=65){
   const X=x+bw,Y=y+bh,Z=z+bd;
   face([[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],tone);
   face([[X,y,Z],[x,y,Z],[x,Y,Z],[X,Y,Z]],tone*.7);
   face([[x,y,Z],[x,y,z],[x,Y,z],[x,Y,Z]],tone*.65);
   face([[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],tone*.85);
   face([[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]],tone*1.25);
  }
  ctx.fillStyle='#080808';ctx.fillRect(0,0,w,h);
  const L=-rw/2,R=rw/2,B=rd/2,F=-rd/2;
  // Individual floor tiles, wall courses and suspended ceiling panels give real scale.
  for(let x=L;x<R;x+=1)for(let z=F;z<B;z+=1){const odd=(Math.round(x-L)+Math.round(z-F))%2;face([[x,0,z],[Math.min(x+1,R),0,z],[Math.min(x+1,R),0,z+1],[x,0,z+1]],odd?49:77)}
  face([[L,0,B],[R,0,B],[R,3.6,B],[L,3.6,B]],61);
  face([[L,0,F],[L,0,B],[L,3.6,B],[L,3.6,F]],45);
  face([[R,0,B],[R,0,F],[R,3.6,F],[R,3.6,B]],51);
  for(let x=L;x<R;x+=1.5)for(let z=F;z<B;z+=1.5)face([[x,3.6,z],[Math.min(x+1.47,R),3.6,z],[Math.min(x+1.47,R),3.6,Math.min(z+1.47,B)],[x,3.6,Math.min(z+1.47,B)]],24);
  box(L,0,B-.1,rw,.16,.1,30);box(L,1.25,B-.08,rw,.08,.08,34);
  for(let x=L+.25;x<R;x+=.5)box(x,1.35,B-.06,.23,.18,.04,90);
  function doorway(x,z,width=1.1){box(x,0,z,width,2.55,.08,18);box(x-.07,0,z-.04,.07,2.65,.14,80);box(x+width,0,z-.04,.07,2.65,.14,80);box(x-.07,2.55,z-.04,width+.14,.1,.14,80)}
  function crate(x,z,size=.7){box(x,0,z,size,size,size,63);box(x+.05,size*.4,z-.012,size-.1,.045,.025,32);box(x+.05,size*.72,z-.012,size-.1,.025,.025,32)}
  function table(x,z){box(x,.85,z,2,.12,1,115);for(const dx of [.12,1.75])for(const dz of [.12,.8])box(x+dx,0,z+dz,.08,.85,.08,36);for(const dz of [-.55,1.25]){box(x+.6,.45,z+dz,.65,.08,.5,48);box(x+.6,.45,z+dz+.42,.65,.65,.06,45)}}
  function shelf(x,z,width=1.6){for(const dx of [0,width-.06])box(x+dx,0,z,.06,2.7,.55,82);for(let y=.15;y<2.7;y+=.65){box(x,y,z,width,.05,.6,98);for(let i=0;i<2;i++)box(x+.1+i*.7,y+.05,z+.05,.5,.4,.42,50+i*15)}}
  switch(room.key){
   case 'stage':
    box(-4,0,2,8,.65,2.6,46);
    for(let x=-5.7;x<5.7;x+=.3)box(x,.65,4.45,.22,2.8,.15,24+(Math.round((x+5.7)*10)%3)*5);
    for(const x of [-4.9,4.1]){box(x,0,2,.8,1.8,.75,23);box(x+.12,.2,1.97,.55,.55,.03,45);box(x+.12,1,1.97,.55,.55,.03,40)}
    box(-.05,.65,1.8,.04,1.7,.04,118);box(-.3,.66,1.6,.6,.03,.5,38);break;
   case 'dining':
    for(const x of [-4.5,-.9,2.7])for(const z of [-2,2,6])table(x,z);
    doorway(-1,B-.14,2.3);box(-5,2.2,B-.18,2,.8,.05,105);break;
   case 'backstage':
    box(-3.4,.85,2.7,4.6,.15,1,90);for(const x of [-3.3,.9])box(x,0,2.8,.15,.85,.7,45);
    shelf(2,1.8,1.5);crate(-2,-.5,1);crate(-.8,1,.6);box(-2.5,1,3,.9,.75,.5,36);break;
   case 'west-hall':case 'east-hall':
    doorway(-.6,B-.12,1.2);
    for(let z=-3;z<B;z+=4){box(L+.03,0,z,.1,2.5,1.2,16);box(R-.13,0,z+1,.1,2.5,1.2,20);box(-.6,3.53,z,1.2,.035,.45,175)}
    if(index===4)for(let y=2.7;y<3.3;y+=.2)box(R-.18,y,F+.2,.1,.08,rd-.4,85);
    else box(L+.14,1.5,1,.07,1,.7,95);break;
   case 'closet':
    shelf(-3,1.9,2);shelf(.8,2.5,2);crate(-1,1,.75);crate(1,-1,.6);
    box(-2.4,0,-.2,.7,.5,.65,60);box(-2.15,.4,.1,.045,2,.045,130);break;
   case 'west-corner':case 'east-corner':
    doorway(index===6?-.1:-1.2,B-.13,1.4);box(index===6?L:R-1.4,0,1,1.4,3.6,2.5,42);
    if(index===7){box(.4,.65,0,1.3,.1,.7,95);box(.5,0,.1,.08,.65,.08,80);box(1.5,0,.1,.08,.65,.08,80);crate(.6,.2,.6)}
    else {box(-.6,2.6,B-.2,1.2,.3,.08,120);crate(1.8,1.7,.5)}break;
  }
  // Painter's algorithm, then distance falloff and subtle sensor grain.
  faces.sort((a,b)=>b.z-a.z);
  for(const {p,tone,z} of faces){const v=Math.max(8,Math.min(220,tone*(.6+1.2/(1+z*.12))));ctx.fillStyle=`rgb(${v},${v},${v*.96})`;ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=.6;ctx.stroke()}
  const light=ctx.createRadialGradient(w*.45,h*.35,0,w*.45,h*.4,w*.8);light.addColorStop(0,'#0000');light.addColorStop(1,'#000c');ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
  let seed=739+index;
  for(let i=0;i<w*h/35;i++){seed=(seed*16807)%2147483647;const x=seed%w;seed=(seed*16807)%2147483647;const y=seed%h;ctx.fillStyle=i%2?'#ffffff08':'#00000018';ctx.fillRect(x,y,2,1)}
  cast.replaceChildren();
  actors.forEach((actor,i)=>{
   const pos=room.actors[i%room.actors.length],p=project(pos);if(!p)return;
   const el=document.createElement('div');el.className=`character ${actor.kind}`;el.style.cssText=`--fur:${{bear:'#82735a',rabbit:'#747d88',bird:'#9a925d'}[actor.kind]};left:${p[0]/w*100}%;top:${p[1]/h*100}%;--actor-scale:${Math.min(2.8,1.8*f/p[2]/180)};`;
   el.innerHTML='<div class="body"></div><div class="head"><i class="ear"></i><i class="ear"></i><div class="eyes"></div><div class="muzzle"></div></div><div class="bow"></div>';
   el.setAttribute('role','img');el.setAttribute('aria-label',actor.name);cast.append(el);
  });
 }
 return {draw};
}
