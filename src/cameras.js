import {characterMarkup} from './characters.js';
// Fixed security-camera lenses and room geometry, in metres.
export const CAMERA_ROOMS = [
 {key:'lecture',size:[12,10],eye:[-4.8,3.3,-4],target:[0,1,4],actors:[[-1.8,0,3.3],[1.5,0,3.3]],description:'Aula magna con pizarra, atril, pantalla de proyección y filas de pupitres.'},
 {key:'library',size:[14,17],eye:[5.7,3.5,-6.8],target:[-1,0,5],actors:[[-.15,0,2],[3.2,0,4]],description:'Biblioteca universitaria con estantes altos, mesas de lectura y lámparas de estudio.'},
 {key:'lab',size:[8,10],eye:[-3.2,3,-3.8],target:[1,1,3],actors:[[.3,0,1.6],[-.3,0,3.2]],description:'Laboratorio con mesas de experimentos, lavabos y material de vidrio.'},
 {key:'west-hall',size:[4.4,19],eye:[1.5,3,-8],target:[-.6,.7,7],actors:[[0,0,4],[.5,0,7]],description:'Pasillo académico oeste con puertas de aulas, carteleras y casilleros.'},
 {key:'east-hall',size:[4.4,19],eye:[-1.5,3,-8],target:[.5,.6,8],actors:[[0,0,5],[.5,0,7]],description:'Pasillo de ciencias este con puertas de laboratorios, vitrinas y tuberías expuestas.'},
 {key:'archives',size:[7,8],eye:[2.7,2.9,-3],target:[-1,.8,2],actors:[[.3,0,1],[-.3,0,.3]],description:'Archivo universitario con archivadores, cajas de documentos y estanterías.'},
 {key:'west-corner',size:[6,7],eye:[-2.5,3,-2.7],target:[1,.6,2.5],actors:[[.5,0,1.1],[-.7,0,2]],description:'Descanso de la escalera oeste con gradas, pasamanos y una cartelera académica.'},
 {key:'east-corner',size:[6,7],eye:[2.5,3,-2.7],target:[-1,.6,2.5],actors:[[-.5,0,1.1],[.7,0,2]],description:'Vestíbulo docente con recepción, casilleros de correspondencia y asientos de espera.'}
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
  function face(points,tone,label){const p=points.map(project);if(p.some(v=>!v))return;faces.push({p,tone,label,z:p.reduce((s,v)=>s+v[2],0)/p.length})}
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
  for(let x=L;x<R;x+=1)for(let z=F;z<B;z+=1){const odd=(Math.round(x-L)+Math.round(z-F))%2;face([[x,0,z],[Math.min(x+1,R),0,z],[Math.min(x+1,R),0,z+1],[x,0,z+1]],46+odd*5)}
  face([[L,0,B],[R,0,B],[R,3.6,B],[L,3.6,B]],61);
  face([[L,0,F],[L,0,B],[L,3.6,B],[L,3.6,F]],45);
  face([[R,0,B],[R,0,F],[R,3.6,F],[R,3.6,B]],51);
  for(let x=L;x<R;x+=1.5)for(let z=F;z<B;z+=1.5)face([[x,3.6,z],[Math.min(x+1.47,R),3.6,z],[Math.min(x+1.47,R),3.6,Math.min(z+1.47,B)],[x,3.6,Math.min(z+1.47,B)]],24);
  box(L,0,B-.1,rw,.16,.1,30);box(L,1.25,B-.08,rw,.08,.08,34);
  // Institutional wall rail rather than the former entertainment-venue checker trim.
  box(L,1.35,B-.06,rw,.05,.04,85);
  function doorway(x,z,width=1.1){box(x,0,z,width,2.55,.08,18);box(x-.07,0,z-.04,.07,2.65,.14,80);box(x+width,0,z-.04,.07,2.65,.14,80);box(x-.07,2.55,z-.04,width+.14,.1,.14,80)}
  function sign(x,y,z,width,text){
   face([[x,y+.4,z],[x+width,y+.4,z],[x+width,y,z],[x,y,z]],[0,60,113],text);
  }
  function crate(x,z,size=.7){box(x,0,z,size,size,size,63);box(x+.05,size*.4,z-.012,size-.1,.045,.025,32);box(x+.05,size*.72,z-.012,size-.1,.025,.025,32)}
  function table(x,z){box(x,.85,z,2,.12,1,115);for(const dx of [.12,1.75])for(const dz of [.12,.8])box(x+dx,0,z+dz,.08,.85,.08,36);for(const dz of [-.55,1.25]){box(x+.6,.45,z+dz,.65,.08,.5,48);box(x+.6,.45,z+dz+.42,.65,.65,.06,45)}}
  function shelf(x,z,width=1.6){for(const dx of [0,width-.06])box(x+dx,0,z,.06,2.7,.55,82);for(let y=.15;y<2.7;y+=.65){box(x,y,z,width,.05,.6,98);for(let i=0;i<2;i++)box(x+.1+i*.7,y+.05,z+.05,.5,.4,.42,50+i*15)}}
  function books(x,z,width=2){
   for(const dx of [0,width-.07])box(x+dx,0,z,.07,2.8,.5,68);
   for(let y=.2;y<2.8;y+=.55){box(x,y,z,width,.06,.55,87);for(let i=0;i<12;i++)box(x+.1+i*(width-.2)/12,y+.06,z+.03,(width-.3)/12,.28+(i%3)*.07,.34,40+(i*17)%60)}
  }
  function board(x,z,width=3){box(x-.08,1.3,z,width+.16,1.65,.08,100);box(x,1.38,z-.02,width,1.49,.03,18);box(x-.12,1.27,z-.1,width+.24,.04,.2,110);for(let row=0;row<4;row++)for(let j=0;j<4;j++)box(x+.2+j*.5,2.55-row*.22,z-.04,.18+(j%2)*.12,.018,.01,95)}
  function seat(x,z){box(x,.45,z,.6,.08,.5,60);box(x,.5,z-.05,.6,.55,.07,55);for(const dx of [.05,.5])box(x+dx,0,z+.12,.04,.45,.3,35)}
  function notice(x,z){box(x,1.3,z,1.5,1.05,.08,48);for(let i=0;i<5;i++)box(x+.1+(i%3)*.45,1.4+Math.floor(i/3)*.45,z-.02,.32,.36,.02,125-i*8)}
  switch(room.key){
   case 'lecture':
    board(-4.1,B-.2,5);
    box(1.4,1.7,B-.3,3,1.65,.06,128);box(1.3,3.3,B-.4,3.2,.12,.18,65);
    box(-.4,0,2.7,.9,1.1,.7,58);box(-.5,1.1,2.6,1.1,.12,.9,100);
    for(const z of [-2,.2])for(const x of [-4,-1,2]){box(x,.75,z,2,.08,.65,90);for(const dx of [.1,1.8])box(x+dx,0,z,.06,.75,.5,35);seat(x+.15,z-1);seat(x+1.15,z-1)}
    break;
   case 'library':
    for(const x of [-5.5,-2.8,.2]){books(x,3.5,2.3);books(x,6.5,2.3)}
    books(-5.5,0,2.3);
    for(const x of [-2.5,1.5])for(const z of [-3,0]){table(x,z);box(x+.8,.98,z+.35,.035,.42,.035,115);box(x+.55,1.38,z+.18,.55,.08,.3,110);box(x+.2,.99,z+.2,.38,.035,.5,140)}
    doorway(4,B-.14,1.5);break;
   case 'lab':
    for(const x of [-3,1])for(const z of [-1,2]){
     box(x,0,z,2, .9,.9,65);box(x-.06,.9,z-.05,2.12,.09,1,31);
     box(x+.15,.995,z+.2,.55,.02,.4,115);box(x+.4,1,z+.6,.045,.45,.045,150);box(x+.4,1.4,z+.3,.045,.045,.34,150);
     for(let i=0;i<3;i++){box(x+1+i*.23,1,z+.35,.15,.25+i*.07,.15,130);box(x+1.04+i*.23,1.2+i*.07,z+.4,.07,.12,.07,150)}
    }
    board(-2,B-.2,3);shelf(2,3.8,1.4);break;
   case 'west-hall':case 'east-hall':
    doorway(-.6,B-.12,1.2);
    for(let z=-3;z<B;z+=4){
     box(L+.03,0,z,.1,2.5,1.2,20);box(R-.13,0,z+1,.1,2.5,1.2,24);
     box(L+.02,2.65,z,.12,.18,.7,130);box(R-.14,2.65,z+1,.12,.18,.7,130);
     box(-.6,3.53,z,1.2,.035,.45,175);
    }
    if(index===4){for(let y=2.7;y<3.3;y+=.2)box(R-.18,y,F+.2,.1,.08,rd-.4,85);box(L+.2,0,2,.45,1.9,2,65);}
    else {for(let z=1;z<5;z+=.5){box(L+.1,0,z,.4,1.85,.46,72);box(L+.49,.9,z+.28,.02,.12,.04,145)}notice(-.8,B-.2);}
    break;
   case 'archives':
    shelf(-3,2.6,2);shelf(.8,2.6,2);
    for(const x of [-2.9,.9]){box(x,0,0,1.4,1.8,.6,77);for(let y=.05;y<1.8;y+=.43){box(x+.04,y,-.035,1.32,.39,.04,88);box(x+.48,y+.24,-.06,.45,.035,.04,140);box(x+.52,y+.08,-.065,.35,.1,.02,120)}}
    crate(-.6,1.7,.6);break;
   case 'west-corner':
    doorway(.3,B-.13,1.3);
    for(let i=0;i<7;i++)box(L+.1,0,.2+i*.43,1.7,.18*(i+1),.43,65+i*3);
    box(L+1.8,.8,.2,.05,1.3,3,112);notice(-1.5,B-.2);break;
   case 'east-corner':
    doorway(-1.5,B-.13,1.3);
    box(.5,0,1.5,2,1.1,.8,62);box(.4,1.1,1.4,2.2,.1,1,110);
    for(let i=0;i<3;i++)seat(-2.6+i*.75,.8);
    for(let x=.5;x<2.5;x+=.45)for(let y=1.6;y<2.8;y+=.32){box(x,y,B-.2,.42,.3,.1,30);box(x+.03,y+.02,B-.22,.32,.05,.04,120)}
    break;
  }
  const signs=['AULA MAGNA','BIBLIOTECA','LABORATORIO','AULAS / OESTE','CIENCIAS / ESTE','ARCHIVO','ESCALERAS','DOCENTES'];
  sign(-1.8,2.85,B-.26,3.6,signs[index]);
  // Painter's algorithm, then distance falloff and subtle sensor grain.
  faces.sort((a,b)=>b.z-a.z);
  for(const {p,tone,label,z} of faces){
   const shade=v=>Math.max(8,Math.min(220,v*(.6+1.2/(1+z*.12))));
   const rgb=Array.isArray(tone)?tone.map(shade):[shade(tone),shade(tone),shade(tone)*.96];
   ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=.6;ctx.stroke();
   if(label){ctx.save();ctx.transform((p[1][0]-p[0][0])/360,(p[1][1]-p[0][1])/360,(p[3][0]-p[0][0])/40,(p[3][1]-p[0][1])/40,p[0][0],p[0][1]);ctx.fillStyle='#f1f1ee';ctx.font='16px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,180,21,330);ctx.restore()}
  }
  const light=ctx.createRadialGradient(w*.45,h*.35,0,w*.45,h*.4,w*.8);light.addColorStop(0,'#0000');light.addColorStop(1,'#000c');ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
  let seed=739+index;
  for(let i=0;i<w*h/35;i++){seed=(seed*16807)%2147483647;const x=seed%w;seed=(seed*16807)%2147483647;const y=seed%h;ctx.fillStyle=i%2?'#ffffff08':'#00000018';ctx.fillRect(x,y,2,1)}
  cast.replaceChildren();
  actors.forEach((actor,i)=>{
   const pos=room.actors[i%room.actors.length],p=project(pos);if(!p)return;
   const el=document.createElement('div');el.className='camera-actor';el.style.cssText=`left:${p[0]/w*100}%;top:${p[1]/h*100}%;--actor-scale:${Math.min(2.8,1.8*f/p[2]/180)};`;
   el.innerHTML=characterMarkup(actor,index===3?'angleA':index===4?'angleB':'idle',{mirror:index===3});
   el.setAttribute('role','img');el.setAttribute('aria-label',actor.name);cast.append(el);
  });
 }
 return {draw};
}
