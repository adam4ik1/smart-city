import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#city-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b18);
scene.fog = new THREE.FogExp2(0x070b18, 0.012);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 500);
camera.position.set(28, 27, 34);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06; controls.minDistance = 12; controls.maxDistance = 75; controls.maxPolarAngle = Math.PI * .47; controls.target.set(0, 1, 0);

scene.add(new THREE.HemisphereLight(0x9ccfff, 0x101126, 1.45));
const moon = new THREE.DirectionalLight(0x8bbcff, 2.1); moon.position.set(-20,35,18); moon.castShadow=true; moon.shadow.mapSize.set(2048,2048); scene.add(moon);
const cyanLight = new THREE.PointLight(0x00cfff, 32, 65); cyanLight.position.set(0,10,0); scene.add(cyanLight);
const purpleLight = new THREE.PointLight(0x783cff, 20, 50); purpleLight.position.set(-18,8,-12); scene.add(purpleLight);

const city = new THREE.Group(); scene.add(city);
const pickables=[]; const traffic=[]; const labels=[];
const mat=(color,metalness=.25,roughness=.5,emissive=0x000000,intensity=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity});
const groundMat=mat(0x101b31,.35,.85); const roadMat=mat(0x080f20,.15,.8); const glassMat=mat(0x122e4b,.65,.22,0x063d64,.65); const darkMat=mat(0x101a2d,.5,.45);
const neonCyan=new THREE.MeshStandardMaterial({color:0x00e5ff,emissive:0x00bcd4,emissiveIntensity:2.1});
const neonPink=new THREE.MeshStandardMaterial({color:0xff3ca6,emissive:0xff1688,emissiveIntensity:1.6});
const neonPurple=new THREE.MeshStandardMaterial({color:0x9a5cff,emissive:0x6c2bff,emissiveIntensity:1.7});
const neonGreen=new THREE.MeshStandardMaterial({color:0x52ffc7,emissive:0x12d99a,emissiveIntensity:1.5});
function box(w,h,d,material,x,y,z,parent=city){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function line(points,material,r=.035,parent=city){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*8),r,6,false),material);parent.add(mesh);return mesh}
function addGlowRect(x,z,w,d,y,material=neonCyan){const o=new THREE.Mesh(new THREE.BoxGeometry(w,.045,d),material);o.position.set(x,y,z);city.add(o);return o}

// Floating urban platform and street grid
const platform=box(52,.8,48,groundMat,0,-.55,0); platform.receiveShadow=true;
const under=box(53,.18,49,mat(0x06101f,.5,.35,0x004d78,.7),0,-1.05,0); 
for(let x=-24;x<=24;x+=8){box(.13,.025,46,neonCyan,x,-.12,0);box(3,.035,.16,neonCyan,x,-.1,0)}
for(let z=-22;z<=22;z+=8){box(50,.025,.13,neonCyan,0,-.11,z)}
// Road lanes
for(let x of [-16,0,16]){box(4,.035,47,roadMat,x,-.08,0);for(let z=-21;z<22;z+=3)box(.07,.025,1.2,mat(0x3d6480),x,-.045,z)}
for(let z of [-16,0,16]){box(51,.035,4,roadMat,0,-.075,z);for(let x=-23;x<24;x+=3)box(1.2,.025,.07,mat(0x3d6480),x,-.04,z)}
// Green public spaces
for(const [x,z] of [[-8,-8],[8,8],[-8,8],[8,-8]]){box(6,.12,6,mat(0x102c35),x,.02,z);for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const tx=x+Math.cos(a)*2, tz=z+Math.sin(a)*2;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,.9,6),mat(0x526b73));trunk.position.set(tx,.55,tz);city.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.65,1),mat(0x1a735f,.1,.8,0x0b382c,.3));crown.position.set(tx,1.25,tz);city.add(crown)}}

const data=[
{id:'control',name:'AI CONTROL CENTER',category:'CORE INFRASTRUCTURE',x:0,z:0,w:5.5,d:5.5,h:12,color:0x123c5d,performance:'99.2%',energy:'18%',description:'The central intelligence hub coordinates transport, energy, safety and city services through a unified real-time digital twin.',insight:'Predictive models reroute traffic before congestion forms and balance city resources every 30 seconds.',status:'ONLINE'},
{id:'business',name:'SMART BUSINESS TOWER',category:'BUSINESS & ANALYTICS',x:8,z:-8,w:4.2,d:4.2,h:17,color:0x1a2f58,performance:'96.8%',energy:'12%',description:'A connected business district using AI forecasting, customer intelligence and automated operations to support companies.',insight:'Demand forecasting indicates a 8.4% increase in district activity over the next quarter.',status:'ONLINE'},
{id:'bank',name:'DIGITAL BANK',category:'FINANCIAL TECHNOLOGY',x:16,z:8,w:4.2,d:4.2,h:11,color:0x26305b,performance:'99.8%',energy:'7%',description:'A next-generation financial center with secure digital payments, fraud detection and AI-assisted risk analysis.',insight:'Anomaly detection reviews transactions in milliseconds while protecting customer privacy.',status:'SECURE'},
{id:'factory',name:'SMART FACTORY',category:'INDUSTRY 4.0',x:-16,z:8,w:6,d:5,h:8,color:0x25364b,performance:'94.5%',energy:'21%',description:'An automated production facility with industrial robots, predictive maintenance and computer-vision quality control.',insight:'Predictive maintenance schedules service before equipment failure, reducing unplanned downtime.',status:'PRODUCTION'},
{id:'hospital',name:'AI MEDICAL CENTER',category:'HEALTH TECHNOLOGY',x:-8,z:-16,w:5,d:4.5,h:9,color:0x1b3b4e,performance:'97.1%',energy:'10%',description:'A smart hospital coordinating appointments, diagnostics, emergency routing and resource planning with AI support.',insight:'Patient-flow prediction helps allocate staff and shorten waiting times. Clinical decisions remain with clinicians.',status:'ONLINE'},
{id:'energy',name:'GREEN ENERGY HUB',category:'CLEAN ENERGY',x:16,z:-16,w:5,d:4.5,h:7,color:0x17433f,performance:'98.4%',energy:'16%',description:'A renewable energy station integrating solar generation, wind power, battery storage and intelligent grid balancing.',insight:'AI shifts flexible loads toward periods of high renewable generation to reduce grid demand.',status:'GENERATING'},
{id:'university',name:'SMART UNIVERSITY',category:'EDUCATION & RESEARCH',x:-16,z:-8,w:5,d:4.5,h:10,color:0x322a58,performance:'95.9%',energy:'8%',description:'A connected campus for computer science, robotics and entrepreneurship, supported by adaptive learning platforms.',insight:'Learning analytics recommend practice pathways while keeping educators in control of assessment.',status:'IN SESSION'},
{id:'transport',name:'AUTONOMOUS TRANSIT HUB',category:'MOBILITY SYSTEMS',x:8,z:16,w:5.5,d:4.5,h:6,color:0x263c58,performance:'92.7%',energy:'5%',description:'A multimodal mobility station coordinating autonomous shuttles, public transit, charging and pedestrian safety.',insight:'Adaptive signal timing prioritizes emergency vehicles and smooths traffic across connected intersections.',status:'ACTIVE'},
{id:'data',name:'QUANTUM DATA CENTER',category:'DIGITAL INFRASTRUCTURE',x:-8,z:16,w:4.5,d:4.5,h:13,color:0x34234e,performance:'99.9%',energy:'19%',description:'A resilient data facility processing city sensor streams, AI workloads and secure digital services.',insight:'Workloads are distributed across compute clusters to optimize latency, resilience and energy use.',status:'ONLINE'}
];
function addBuilding(d){
 const g=new THREE.Group();g.position.set(d.x,0,d.z);city.add(g);
 const base=new THREE.Mesh(new THREE.BoxGeometry(d.w+.55,.45,d.d+.55),mat(0x142943,.5,.4));base.position.y=.23;g.add(base);
 const body=new THREE.Mesh(new THREE.BoxGeometry(d.w,d.h,d.d),mat(d.color,.65,.25,0x071a34,.4));body.position.y=.45+d.h/2;body.castShadow=true;body.receiveShadow=true;g.add(body);
 // horizontal illuminated floor bands
 for(let y=1.1;y<d.h;y+=2.2){const band=new THREE.Mesh(new THREE.BoxGeometry(d.w+.06,.075,d.d+.06,1),neonCyan);band.position.y=.45+y;g.add(band)}
 // windows on front and side
 const winMat= new THREE.MeshStandardMaterial({color:0x76dfff,emissive:0x168dca,emissiveIntensity:.75,metalness:.4,roughness:.2});
 for(let y=1.25;y<d.h-.3;y+=1.25){for(let x=-d.w/2+.45;x<d.w/2-.2;x+=.75){const win=new THREE.Mesh(new THREE.BoxGeometry(.38,.48,.035),winMat);win.position.set(x,.45+y,d.d/2+.02);g.add(win)}}
 for(let y=1.25;y<d.h-.3;y+=1.25){for(let z=-d.d/2+.4;z<d.d/2-.2;z+=.8){const win=new THREE.Mesh(new THREE.BoxGeometry(.035,.48,.4),winMat);win.position.set(d.w/2+.02,.45+y,z);g.add(win)}}
 // rooftop feature
 const roof=box(d.w*.45,.5,d.d*.45,mat(0x203c5c,.6,.25),0,.45+d.h+.25,0,g);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.7,8),neonCyan);mast.position.set(0,.45+d.h+1.25,0);g.add(mast);
 const orb=new THREE.Mesh(new THREE.SphereGeometry(.2,12,12),neonPink);orb.position.set(0,.45+d.h+2.15,0);g.add(orb);
 // sign plate
 const sign=new THREE.Mesh(new THREE.BoxGeometry(d.w*.72,.52,.08),mat(0x061426,.4,.2,0x00aacc,.4));sign.position.set(0,.45+d.h*.58,d.d/2+.07);g.add(sign);
 // selection ring and ground glow
 const ring=new THREE.Mesh(new THREE.RingGeometry(Math.max(d.w,d.d)*.65,Math.max(d.w,d.d)*.69,64),neonCyan);ring.rotation.x=-Math.PI/2;ring.position.y=.055;g.add(ring);
 const halo=new THREE.PointLight(0x00cfff,4,10);halo.position.set(0,2,0);g.add(halo);
 g.userData={...d,ring,halo,body};
 g.traverse(o=>{if(o.isMesh){o.userData.building=g; if(o!==ring)pickables.push(o)}});
 return g;
}
const buildings=data.map(addBuilding);
// Energy arrays and solar canopies
for(let i=0;i<3;i++){const x=-22+i*3;const panel=box(2.2,.15,1.4,mat(0x123f70,.75,.2,0x0055ff,.6),x,.45,-20);panel.rotation.x=-.12;for(let k=-1;k<=1;k++)box(.035,.17,1.4,neonCyan,x+k*.65,.54,-20)}
// Wind turbines
for(const [x,z] of [[22,-21],[-22,21]]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,5,8),mat(0x8ca7bc,.65,.35));pole.position.set(x,2.5,z);city.add(pole);const hub=new THREE.Group();hub.position.set(x,5,z);city.add(hub);const center=new THREE.Mesh(new THREE.SphereGeometry(.22,12,12),neonCyan);hub.add(center);for(let i=0;i<3;i++){const blade=new THREE.Mesh(new THREE.BoxGeometry(.14,2.4,.12),mat(0xc5eaff,.5,.3,0x00aaff,.3));blade.position.y=1.25;blade.rotation.z=.12;const pivot=new THREE.Group();pivot.rotation.y=i*Math.PI*2/3;hub.add(pivot);pivot.add(blade)}hub.userData.spin=true;traffic.push(hub)}
// Transit bridges / elevated maglev
line([[-23,1.5,4],[-16,2.3,4],[-8,2.3,4],[0,2.3,4],[8,2.3,4],[16,2.3,4],[23,1.5,4]],neonPurple,.09);
line([[-4,1.5,-22],[-4,2.1,-14],[-4,2.1,-8],[-4,2.1,0],[-4,2.1,8],[-4,2.1,16],[-4,1.5,22]],neonCyan,.065);
// Vehicles follow road loops
const carMats=[mat(0x00d9ff,.55,.25,0x00bfff,1.5),mat(0xff3ca6,.5,.25,0xff1688,1.2),mat(0x9a5cff,.5,.25,0x6c2bff,1.2)];
function addCar(axis,fixed,start,speed,material){const car=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(1.05,.35,.58),material);body.position.y=.32;car.add(body);const top=new THREE.Mesh(new THREE.BoxGeometry(.55,.22,.48),mat(0x152c49,.7,.15));top.position.set(-.08,.58,0);car.add(top);const glow=new THREE.PointLight(0x00dfff,1.2,3);glow.position.set(0,.3,0);car.add(glow);city.add(car);traffic.push({car,axis,fixed,pos:start,speed});}
for(let i=0;i<6;i++){addCar('x',-16,-22+i*7,.035+(i%3)*.012,carMats[i%3]);addCar('z',0,-21+i*7,.03+(i%2)*.014,carMats[(i+1)%3]);addCar('x',16,-20+i*7,-.032-(i%2)*.012,carMats[(i+2)%3])}
// tiny city perimeter beacons
for(let x=-24;x<=24;x+=4){for(let z of [-22,22]){const b=new THREE.Mesh(new THREE.SphereGeometry(.07,8,8),neonCyan);b.position.set(x,.12,z);city.add(b)}}

// Star field
const starsGeo=new THREE.BufferGeometry();const starPositions=[];for(let i=0;i<650;i++)starPositions.push((Math.random()-.5)*150,Math.random()*55+8,(Math.random()-.5)*150);starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x78cfff,size:.12,transparent:true,opacity:.8}));scene.add(stars);

// Raycast and selection
const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let selected=null;let pointerDown=null;
const panelPlaceholder=document.querySelector('#object-placeholder'), details=document.querySelector('#object-details');
function selectBuilding(building){if(!building)return;selected=building;panelPlaceholder.classList.add('hidden');details.classList.remove('hidden');const d=building.userData;
 document.querySelector('#object-category').textContent=d.category;document.querySelector('#object-name').textContent=d.name;document.querySelector('#object-description').textContent=d.description;document.querySelector('#object-status').textContent='● '+d.status;document.querySelector('#object-performance').textContent=d.performance;document.querySelector('#object-energy').textContent=d.energy;document.querySelector('#object-insight').textContent=d.insight;
 document.querySelector('.panel-index').textContent=String(data.findIndex(x=>x.id===d.id)+1).padStart(2,'0')+' / 09';
 buildings.forEach(b=>{b.userData.ring.material=b===building?neonPink:neonCyan;b.userData.halo.intensity=b===building?12:4});showToast(d.name+' SELECTED');}
function showToast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1700)}
canvas.addEventListener('pointerdown',e=>{pointerDown={x:e.clientX,y:e.clientY}});
canvas.addEventListener('pointerup',e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>5){pointerDown=null;return}pointerDown=null;const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(pickables,false);if(hits.length){const b=hits[0].object.userData.building;if(b)selectBuilding(b)}});
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(pickables,false);canvas.style.cursor=hits.length?'pointer':'grab'});

// Day/night toggle
let daytime=false;document.querySelector('#daynight').addEventListener('click',()=>{daytime=!daytime;scene.background.set(daytime?0x8eb9d4:0x070b18);scene.fog.color.set(daytime?0x8eb9d4:0x070b18);scene.fog.density=daytime?.006:.012;moon.intensity=daytime?3.1:2.1;renderer.toneMappingExposure=daytime?1.45:1.22;document.querySelector('#day-icon').textContent=daytime?'☾':'☼';document.querySelector('.btn-label').textContent=daytime?'DAY MODE':'NIGHT MODE';showToast(daytime?'DAYLIGHT SIMULATION':'NIGHT MODE ACTIVATED')});
document.querySelector('#reset-view').addEventListener('click',()=>{camera.position.set(28,27,34);controls.target.set(0,1,0);controls.update();showToast('CAMERA VIEW RESET')});

// Responsive renderer
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
let tick=0;function animate(){requestAnimationFrame(animate);tick+=.01;controls.update();traffic.forEach(t=>{if(t.car){t.pos+=t.speed;if(t.pos>23)t.pos=-23;if(t.pos< -23)t.pos=23;if(t.axis==='x'){t.car.position.set(t.pos,.0,t.fixed);t.car.rotation.y=t.speed>0?0:Math.PI}else{t.car.position.set(t.fixed,.0,t.pos);t.car.rotation.y=t.speed>0?Math.PI/2:-Math.PI/2}}else if(t.userData?.spin)t.rotation.y+=.012});buildings.forEach((b,i)=>{b.userData.halo.intensity=(b===selected?11:3.5)+Math.sin(tick*2+i)*.8;b.userData.ring.rotation.z+=.001});renderer.render(scene,camera)}animate();

// Simulated live KPI drift
setInterval(()=>{const clean=84+Math.round(Math.sin(Date.now()/7000)*2);const flow=92+Math.round(Math.cos(Date.now()/9000)*2);document.querySelector('#clean-energy').innerHTML=clean+'<span>%</span>';document.querySelector('#traffic-flow').innerHTML=flow+'<span>%</span>';},3500);
