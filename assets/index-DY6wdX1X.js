(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const Dc="pale-hour/settings/v1",Al={volume:.7,sensitivity:1,fov:75,grain:1,renderScale:1,shake:!0,invertY:!1,seed:"",difficulty:"dread"},er={wander:{name:"WANDER",index:"01",desc:"It exists, but it is patient. For learning the forest and reading every note.",bars:1,fragments:8,baseDistance:46,minDistance:22,stalkSpeed:.55,teleportBase:11,teleportPerFrag:.62,staticGain:.2,staticDecay:.42,batteryDrain:.01,killDistance:3.2,watchers:1,stalkers:1,stalkerFrom:4,chaseSpeed:2.7},dread:{name:"DREAD",index:"02",desc:"The intended tape. It closes distance, punishes long looks, and learns your route.",bars:2,fragments:8,baseDistance:38,minDistance:15,stalkSpeed:.95,teleportBase:8.5,teleportPerFrag:.72,staticGain:.3,staticDecay:.3,batteryDrain:.016,killDistance:3.6,watchers:1,stalkers:2,stalkerFrom:2,chaseSpeed:3.3},static:{name:"STATIC",index:"03",desc:"It is rarely more than a treeline away. Sprint, and it hears where you went.",bars:3,fragments:8,baseDistance:30,minDistance:11,stalkSpeed:1.5,teleportBase:6.2,teleportPerFrag:.62,staticGain:.42,staticDecay:.22,batteryDrain:.022,killDistance:4,watchers:2,stalkers:3,stalkerFrom:1,chaseSpeed:3.9},paleHour:{name:"PALE HOUR",index:"04",desc:"No mercy pass, no safe darkness, no second look. Most runs end before the third fragment.",bars:4,fragments:8,baseDistance:24,minDistance:8,stalkSpeed:2.15,teleportBase:4.6,teleportPerFrag:.44,staticGain:.58,staticDecay:.15,batteryDrain:.03,killDistance:4.4,watchers:2,stalkers:4,stalkerFrom:0,chaseSpeed:4.5}};function Rl(){let r={};try{r=JSON.parse(localStorage.getItem(Dc)||"{}")}catch{r={}}return{...Al,...r}}function ts(r){try{localStorage.setItem(Dc,JSON.stringify(r))}catch{}}function Cl(r){return er[r.difficulty]??er.dread}const ho={forward:["KeyW","ArrowUp"],back:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],sprint:["ShiftLeft","ShiftRight"],crouch:["ControlLeft","ControlRight","KeyC"],light:["KeyF"],use:["KeyE","Space"],pack:["Tab","KeyI"],place:["KeyQ"]};class Pl{constructor(t){this.canvas=t,this.keys=new Set,this.pressed=new Set,this.mouse={dx:0,dy:0},this.locked=!1,this.enabled=!1,this.wantLock=!1,this.hadLock=!1,this.lockFailed=!1,this._onKeyDown=e=>{e.code!=="Escape"&&this.enabled&&(this.keys.has(e.code)||this.pressed.add(e.code),this.keys.add(e.code),(e.code.startsWith("Arrow")||e.code==="Space"||e.code==="Tab")&&e.preventDefault())},this._onKeyUp=e=>this.keys.delete(e.code),this._onBlur=()=>this.keys.clear(),this._dragging=!1,this._onDown=()=>{this.lockFailed&&(this._dragging=!0)},this._onUp=()=>{this._dragging=!1},this._onMove=e=>{this.enabled&&(this.locked||this.lockFailed&&this._dragging)&&(this.mouse.dx+=e.movementX||0,this.mouse.dy+=e.movementY||0)},this._onLockChange=()=>{this.locked=document.pointerLockElement===this.canvas,this.locked?(this.hadLock=!0,this.lockFailed=!1):this.wantLock&&this.hadLock&&(this.keys.clear(),this.onLockLost?.())},this._onLockError=()=>{this.lockFailed=!0,this.onLockFailed?.()},addEventListener("keydown",this._onKeyDown),addEventListener("keyup",this._onKeyUp),addEventListener("blur",this._onBlur),document.addEventListener("mousemove",this._onMove),document.addEventListener("mousedown",this._onDown),document.addEventListener("mouseup",this._onUp),document.addEventListener("pointerlockchange",this._onLockChange),document.addEventListener("pointerlockerror",this._onLockError)}down(t){const e=ho[t];if(!e)return!1;for(const n of e)if(this.keys.has(n))return!0;return!1}hit(t){const e=ho[t];if(!e)return!1;for(const n of e)if(this.pressed.has(n))return!0;return!1}takeMouse(){const t=this.mouse.dx,e=this.mouse.dy;return this.mouse.dx=0,this.mouse.dy=0,{dx:t,dy:e}}endFrame(){this.pressed.clear()}async lock(){if(this.enabled=!0,this.wantLock=!0,document.activeElement?.blur?.(),document.pointerLockElement!==this.canvas)try{const t=this.canvas.requestPointerLock({unadjustedMovement:!0});t?.then&&await t}catch{try{const t=this.canvas.requestPointerLock();t?.then&&await t}catch{this.lockFailed=!0,this.onLockFailed?.()}}}unlock(){this.enabled=!1,this.wantLock=!1,this.keys.clear(),this._dragging=!1,document.pointerLockElement===this.canvas&&document.exitPointerLock()}dispose(){removeEventListener("keydown",this._onKeyDown),removeEventListener("keyup",this._onKeyUp),removeEventListener("blur",this._onBlur),document.removeEventListener("mousemove",this._onMove),document.removeEventListener("mousedown",this._onDown),document.removeEventListener("mouseup",this._onUp),document.removeEventListener("pointerlockchange",this._onLockChange),document.removeEventListener("pointerlockerror",this._onLockError)}}function Dl(r){let t=2166136261;const e=String(r??"");for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function Bn(r){let t=r>>>0;const e=()=>{t=t+1831565813>>>0;let n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296};return e.range=(n,i)=>n+e()*(i-n),e.int=(n,i)=>Math.floor(e.range(n,i+1)),e.pick=n=>n[Math.floor(e()*n.length)],e.chance=n=>e()<n,e.sign=()=>e()<.5?-1:1,e}const uo=r=>r*r*r*(r*(r*6-15)+10),hn=(r,t,e)=>r+(t-r)*e;function _s(r,t,e){let n=Math.imul(r|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e,2246822519);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function or(r,t,e=0){const n=Math.floor(r),i=Math.floor(t),s=r-n,a=t-i,o=uo(s),c=uo(a),l=_s(n,i,e),h=_s(n+1,i,e),u=_s(n,i+1,e),d=_s(n+1,i+1,e);return hn(hn(l,h,o),hn(u,d,o),c)*2-1}function Se(r,t,e=0,n=4,i=2.05,s=.5){let a=0,o=1,c=1,l=0;for(let h=0;h<n;h++)a+=or(r*c,t*c,e+h*7919)*o,l+=o,o*=s,c*=i;return a/l}const ns=(r,t,e)=>r<t?t:r>e?e:r,Ot=r=>ns(r,0,1),Jt=(r,t,e,n)=>hn(r,t,1-Math.exp(-e*n)),mr=(r,t,e)=>{const n=Ot((e-r)/(t-r));return n*n*(3-2*n)};class Il{constructor(t){this.settings=t,this.ctx=null,this.ready=!1,this._heartAt=0,this._whisperAt=0}async init(){if(this.ctx){this.ctx.state==="suspended"&&await this.ctx.resume();return}const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.ctx.state==="suspended"&&await this.ctx.resume();const e=this.ctx;this.master=e.createGain(),this.master.gain.value=this.settings.volume,this.limiter=e.createDynamicsCompressor(),this.limiter.threshold.value=-10,this.limiter.knee.value=12,this.limiter.ratio.value=8,this.limiter.attack.value=.004,this.limiter.release.value=.22,this.master.connect(this.limiter).connect(e.destination),this.noiseBuf=this._makeNoise(4),this._buildWind(),this._buildDrone(),this._buildStatic(),this._buildBreath(),this._buildMusic(),this.ready=!0}setVolume(t){this.settings.volume=t,this.master&&(this.master.gain.value=t)}_makeNoise(t){const e=this.ctx,n=Math.floor(e.sampleRate*t),i=e.createBuffer(2,n,e.sampleRate);for(let s=0;s<2;s++){const a=i.getChannelData(s);let o=0,c=0,l=0;for(let h=0;h<n;h++){const u=Math.random()*2-1;o=.99765*o+u*.099046,c=.963*c+u*.2965164,l=.57*l+u*1.0526913,a[h]=(o+c+l+u*.1848)*.22}}return i}_noiseSource(t=!0){const e=this.ctx.createBufferSource();return e.buffer=this.noiseBuf,e.loop=t,e}_buildWind(){const t=this.ctx,e=this._noiseSource(),n=t.createBiquadFilter();n.type="bandpass",n.frequency.value=420,n.Q.value=.7;const i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=1400,this.windGain=t.createGain(),this.windGain.gain.value=0;for(const[o,c]of[[.055,260],[.021,140]]){const l=t.createOscillator();l.frequency.value=o;const h=t.createGain();h.gain.value=c,l.connect(h).connect(n.frequency),l.start()}const s=t.createOscillator();s.frequency.value=.037;const a=t.createGain();a.gain.value=.14,s.connect(a).connect(this.windGain.gain),s.start(),e.connect(n).connect(i).connect(this.windGain).connect(this.master),e.start()}_buildDrone(){const t=this.ctx;this.droneGain=t.createGain(),this.droneGain.gain.value=0;const e=t.createBiquadFilter();e.type="lowpass",e.frequency.value=240,e.Q.value=3,this.droneFilter=e;const n=[38.5,39.8,57.5,77.1];this.droneOscs=n.map((i,s)=>{const a=t.createOscillator();a.type=s%2?"sawtooth":"triangle",a.frequency.value=i;const o=t.createGain();o.gain.value=s===0?.5:.24;const c=t.createOscillator();c.frequency.value=.03+s*.017;const l=t.createGain();return l.gain.value=1.4+s,c.connect(l).connect(a.detune),c.start(),a.connect(o).connect(e),a.start(),a}),e.connect(this.droneGain).connect(this.master)}_buildStatic(){const t=this.ctx,e=this._noiseSource(),n=t.createBiquadFilter();n.type="highpass",n.frequency.value=1800;const i=t.createBiquadFilter();i.type="peaking",i.frequency.value=5200,i.gain.value=8,i.Q.value=.8,this.staticGain=t.createGain(),this.staticGain.gain.value=0,e.connect(n).connect(i).connect(this.staticGain).connect(this.master),e.start()}update(t,e){if(!this.ready)return;const n=this.ctx.currentTime,i=(o,c,l=.12)=>{o.setTargetAtTime(c,n,l)};if(!e.playing){i(this.windGain.gain,.05,.6),i(this.droneGain.gain,.05,.6),i(this.staticGain.gain,0,.3);return}if(i(this.windGain.gain,.26+e.proximity*.1,.5),i(this.droneGain.gain,.06+e.proximity*.42,.35),i(this.droneFilter.frequency,190+e.proximity*900,.4),i(this.staticGain.gain,Math.pow(e.staticLevel,1.4)*.34,.08),e.proximity>.12){const c=60/(52+e.proximity*108);n-this._heartAt>c&&(this._heartAt=n,this._heartbeat(.16+e.proximity*.5))}e.observed&&e.proximity>.3&&n-this._whisperAt>3.2+Math.random()*4&&(this._whisperAt=n,this.whisper(e.proximity));const s=Math.max(1-(e.stamina??1),e.proximity*.55),a=3.4-s*2;this._breathAt??=0,this._breathPhase??=0,n-this._breathAt>a*.5&&(this._breathAt=n,this._breathPhase=1-this._breathPhase,(s>.12||e.sprinting)&&this.breath(this._breathPhase===1,s)),this._creatureAt??=0,e.proximity>.35&&!e.observed&&n-this._creatureAt>6+Math.random()*8&&(this._creatureAt=n,this.creature(e.proximity)),this.setMusic(e.proximity,t)}_heartbeat(t){const e=this.ctx,n=e.currentTime,i=(s,a,o,c)=>{const l=e.createOscillator();l.type="sine";const h=e.createGain();l.frequency.setValueAtTime(o,s),l.frequency.exponentialRampToValueAtTime(c,s+.14),h.gain.setValueAtTime(0,s),h.gain.linearRampToValueAtTime(a,s+.012),h.gain.exponentialRampToValueAtTime(1e-4,s+.26),l.connect(h).connect(this.master),l.start(s),l.stop(s+.3)};i(n,t,74,34),i(n+.17,t*.62,62,30)}footstep(t,e){if(!this.ready)return;const n=this.ctx,i=n.currentTime,s=this._noiseSource(!1);s.playbackRate.value=.8+Math.random()*.5;const a=n.createBiquadFilter();a.type="bandpass",a.frequency.value=260+Math.random()*340,a.Q.value=.9;const o=n.createGain(),c=e?.16:.2;o.gain.setValueAtTime(0,i),o.gain.linearRampToValueAtTime(.09*t,i+.008),o.gain.exponentialRampToValueAtTime(1e-4,i+c);const l=n.createOscillator();l.type="sine",l.frequency.setValueAtTime(96,i),l.frequency.exponentialRampToValueAtTime(48,i+.1);const h=n.createGain();h.gain.setValueAtTime(.055*t,i),h.gain.exponentialRampToValueAtTime(1e-4,i+.12),s.connect(a).connect(o).connect(this.master),l.connect(h).connect(this.master),s.start(i),s.stop(i+c+.05),l.start(i),l.stop(i+.16)}pickup(){if(!this.ready)return;const t=this.ctx,e=t.currentTime,n=this._noiseSource(!1);n.playbackRate.value=1.7;const i=t.createBiquadFilter();i.type="bandpass",i.Q.value=1.3,i.frequency.setValueAtTime(1400,e),i.frequency.exponentialRampToValueAtTime(4200,e+.18);const s=t.createGain();s.gain.setValueAtTime(0,e),s.gain.linearRampToValueAtTime(.2,e+.01),s.gain.exponentialRampToValueAtTime(1e-4,e+.3),n.connect(i).connect(s).connect(this.master),n.start(e),n.stop(e+.4)}escalate(t){if(!this.ready)return;const e=this.ctx,n=e.currentTime,i=110*Math.pow(1.045,t);[1,1.06,1.5,2.02].forEach((s,a)=>{const o=e.createOscillator();o.type=a>1?"sawtooth":"square",o.frequency.value=i*s;const c=e.createGain();c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(.09/(a+1),n+.006),c.gain.exponentialRampToValueAtTime(1e-4,n+1.6+a*.2);const l=e.createBiquadFilter();l.type="lowpass",l.frequency.setValueAtTime(3400,n),l.frequency.exponentialRampToValueAtTime(320,n+1.8),o.connect(l).connect(c).connect(this.master),o.start(n),o.stop(n+2.2)}),this.staticBurst(.5)}staticBurst(t=1){if(!this.ready)return;const e=this.ctx,n=e.currentTime,i=this._noiseSource(!1);i.playbackRate.value=1.4;const s=e.createBiquadFilter();s.type="highpass",s.frequency.value=900;const a=e.createGain();a.gain.setValueAtTime(0,n),a.gain.linearRampToValueAtTime(.26*t,n+.004),a.gain.exponentialRampToValueAtTime(1e-4,n+.34),i.connect(s).connect(a).connect(this.master),i.start(n),i.stop(n+.4)}scream(){if(!this.ready)return;const t=this.ctx,e=t.currentTime,n=t.createWaveShaper(),i=new Float32Array(1024);for(let c=0;c<1024;c++){const l=c/1023*2-1;i[c]=Math.tanh(l*4.2)}n.curve=i;const s=t.createGain();s.gain.value=.5,n.connect(s).connect(this.master),[1,1.48,2.51,3.77].forEach((c,l)=>{const h=t.createOscillator();h.type="sawtooth",h.frequency.setValueAtTime(880*c,e),h.frequency.exponentialRampToValueAtTime(120*c,e+1.1);const u=t.createGain();u.gain.setValueAtTime(0,e),u.gain.linearRampToValueAtTime(.12/(l+1),e+.02),u.gain.exponentialRampToValueAtTime(1e-4,e+1.3),h.connect(u).connect(n),h.start(e),h.stop(e+1.4)});const a=t.createOscillator();a.type="sine",a.frequency.setValueAtTime(120,e),a.frequency.exponentialRampToValueAtTime(28,e+1.5);const o=t.createGain();o.gain.setValueAtTime(0,e),o.gain.linearRampToValueAtTime(.42,e+.03),o.gain.exponentialRampToValueAtTime(1e-4,e+1.8),a.connect(o).connect(this.master),a.start(e),a.stop(e+1.9),this.staticBurst(1)}whisper(t=.5){if(!this.ready)return;const e=this.ctx,n=e.currentTime,i=this._noiseSource(!1);i.playbackRate.value=.6;const s=e.createGain();s.gain.setValueAtTime(0,n),s.gain.linearRampToValueAtTime(.06+t*.09,n+.25),s.gain.linearRampToValueAtTime(0,n+1.5),[520,1180,2600].forEach((a,o)=>{const c=e.createBiquadFilter();c.type="bandpass",c.Q.value=7+o*3,c.frequency.setValueAtTime(a,n),c.frequency.linearRampToValueAtTime(a*(.7+Math.random()*.6),n+1.4);const l=e.createGain();l.gain.value=1/(o+1),i.connect(c).connect(l).connect(s)}),s.connect(this.master),i.start(n),i.stop(n+1.6)}death(){if(!this.ready)return;const t=this.ctx,e=t.currentTime;this.staticGain.gain.cancelScheduledValues(e),this.staticGain.gain.setValueAtTime(.5,e),this.staticGain.gain.exponentialRampToValueAtTime(1e-4,e+2.4),this.droneGain.gain.cancelScheduledValues(e),this.droneGain.gain.setValueAtTime(.7,e),this.droneGain.gain.exponentialRampToValueAtTime(1e-4,e+3.2);const n=t.createOscillator();n.type="sine",n.frequency.setValueAtTime(70,e),n.frequency.exponentialRampToValueAtTime(19,e+2.6);const i=t.createGain();i.gain.setValueAtTime(.6,e),i.gain.exponentialRampToValueAtTime(1e-4,e+3),n.connect(i).connect(this.master),n.start(e),n.stop(e+3.1)}victory(){if(!this.ready)return;const t=this.ctx,e=t.currentTime;[220,330,440].forEach((n,i)=>{const s=t.createOscillator();s.type="sine",s.frequency.value=n;const a=t.createGain();a.gain.setValueAtTime(0,e+i*.5),a.gain.linearRampToValueAtTime(.16,e+i*.5+.4),a.gain.linearRampToValueAtTime(0,e+i*.5+4),s.connect(a).connect(this.master),s.start(e+i*.5),s.stop(e+i*.5+4.2)})}ui(t="move"){if(!this.ready)return;const e=this.ctx,n=e.currentTime,i=e.createOscillator();i.type="square",i.frequency.value=t==="select"?180:1200;const s=e.createGain();s.gain.setValueAtTime(0,n),s.gain.linearRampToValueAtTime(t==="select"?.1:.035,n+.004),s.gain.exponentialRampToValueAtTime(1e-4,n+(t==="select"?.18:.05)),i.connect(s).connect(this.master),i.start(n),i.stop(n+.2)}flashlight(t){if(!this.ready)return;const e=this.ctx,n=e.currentTime,i=(s,a,o,c)=>{const l=e.createOscillator();l.type="square",l.frequency.setValueAtTime(a,s),l.frequency.exponentialRampToValueAtTime(a*.35,s+c);const h=e.createGain();h.gain.setValueAtTime(o,s),h.gain.exponentialRampToValueAtTime(1e-4,s+c);const u=e.createBiquadFilter();u.type="highpass",u.frequency.value=700,l.connect(u).connect(h).connect(this.master),l.start(s),l.stop(s+c+.02)};if(i(n,t?2600:1900,.16,.02),i(n+.028,t?900:720,.1,.035),t){const s=e.createOscillator();s.type="sine",s.frequency.setValueAtTime(1400,n+.03),s.frequency.exponentialRampToValueAtTime(320,n+.16);const a=e.createGain();a.gain.setValueAtTime(.03,n+.03),a.gain.exponentialRampToValueAtTime(1e-4,n+.18),s.connect(a).connect(this.master),s.start(n+.03),s.stop(n+.2)}}_buildBreath(){const t=this.ctx;this.breathGain=t.createGain(),this.breathGain.gain.value=0,this.breathGain.connect(this.master)}breath(t,e){if(!this.ready)return;const n=this.ctx,i=n.currentTime,s=this._noiseSource(!1);s.playbackRate.value=t?.85:.6;const a=n.createBiquadFilter();a.type="bandpass",a.Q.value=t?1.6:1.1;const o=t?420:700,c=t?900:300,l=t?.34:.46;a.frequency.setValueAtTime(o,i),a.frequency.exponentialRampToValueAtTime(c,i+l);const h=n.createGain(),u=(.035+e*.13)*(t?1:.8);if(h.gain.setValueAtTime(0,i),h.gain.linearRampToValueAtTime(u,i+l*.3),h.gain.exponentialRampToValueAtTime(1e-4,i+l),e>.55){const d=n.createBiquadFilter();d.type="peaking",d.frequency.value=1800,d.gain.value=10*e,d.Q.value=2,s.connect(d).connect(a)}else s.connect(a);a.connect(h).connect(this.master),s.start(i),s.stop(i+l+.05)}creature(t=.5){if(!this.ready)return;const e=this.ctx,n=e.currentTime,i=1.4+t*1.2,s=e.createGain();s.gain.setValueAtTime(0,n),s.gain.linearRampToValueAtTime(.1+t*.22,n+.3),s.gain.linearRampToValueAtTime(0,n+i),s.connect(this.master),[1,2.41,3.83,5.17].forEach((l,h)=>{const u=e.createOscillator();u.type=h===0?"sine":"triangle";const d=44+t*22;u.frequency.setValueAtTime(d*l,n),u.frequency.linearRampToValueAtTime(d*l*.72,n+i);const p=e.createGain();p.gain.value=.5/(h+1);const g=e.createOscillator();g.frequency.value=.7+h*.31;const _=e.createGain();_.gain.value=.3/(h+1),g.connect(_).connect(p.gain),g.start(n),g.stop(n+i),u.connect(p).connect(s),u.start(n),u.stop(n+i)});const a=this._noiseSource(!1);a.playbackRate.value=.4;const o=e.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(300,n),o.frequency.linearRampToValueAtTime(120,n+i),o.Q.value=1.4;const c=e.createGain();c.gain.value=.5,a.connect(o).connect(c).connect(s),a.start(n),a.stop(n+i)}_buildMusic(){const t=this.ctx;this.musicGain=t.createGain(),this.musicGain.gain.value=0;const e=t.createBiquadFilter();e.type="lowpass",e.frequency.value=900,e.Q.value=.7,this.musicFilter=e,this.musicVoices=[73.4,87.3,103.8,130.8].map((n,i)=>{const s=t.createOscillator();s.type=i<2?"sawtooth":"triangle",s.frequency.value=n;const a=t.createGain();a.gain.value=0;const o=t.createOscillator();o.frequency.value=4.1+i*.7;const c=t.createGain();return c.gain.value=.13,o.connect(c).connect(a.gain),o.start(),s.connect(a).connect(e),s.start(),{osc:s,gain:a,base:.14/(i+1)}}),e.connect(this.musicGain).connect(this.master)}setMusic(t,e){if(!this.ready||!this.musicVoices)return;const n=this.ctx.currentTime;this.musicGain.gain.setTargetAtTime(t*.5,n,1.4),this.musicFilter.frequency.setTargetAtTime(500+t*1800,n,1.2),this.musicVoices.forEach((i,s)=>{const a=s*.24,o=Math.max(0,Math.min(1,(t-a)/.3));i.gain.gain.setTargetAtTime(o*i.base,n,1.1)})}suspend(){this.ctx&&this.ctx.state==="running"&&this.ctx.suspend()}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}}const vs=[{kicker:"ASHEN FOLD — 14 MILES OF UNMADE ROAD",body:"Eleven years ago my brother walked into this forest to bring back the register. He was nineteen. They found his torch, still on, forty feet up a tree."},{kicker:"THE COVENANT",body:"The village kept eight pages. Every autumn the warden read the eight names aloud at the treeline, and every autumn nothing happened, and everyone agreed that was the point."},{kicker:"THE LAST READING WAS IN 1974",body:"Then the parish closed, the warden died, and no one read anything. The pages are still out there, nailed where they fell."},{kicker:"TONIGHT",body:"Find all eight. Get to the gate before the hour turns. That is the whole plan, and I have written it down so I cannot talk myself out of it."}],Ll=["One. The handwriting is the warden's. Careful, and pressed too hard.","Two. Someone counted these before me. The nail holes are older than the paper.","Three. My torch is warm. It has never been warm before.","Four. It is not hiding. It is <i>letting me work</i>.","Five. Tom's name is on this one. Written in, not printed.","Six. The names are not victims. They are <i>signatures</i>.","Seven. Every reading renewed it. Eleven years unread and it has come to collect in person.","Eight. The last name on the register is mine, and the ink is not dry. <i>Run.</i>"],fo=[{id:"warden-1",title:"WARDEN'S LOG — OCT 1961",place:"farmhouse",body:["Read the eight at first frost as always. Wind took the fourth page out of my hand and put it back. I am recording that plainly because I do not intend to discuss it.","Nothing followed me home. Nothing ever does. That is not the same as nothing being there."]},{id:"child",title:"ON THE BACK OF A SCHOOL EXERCISE BOOK",place:"cabin",body:["the tall one stands in the trees at the edge of the field and does not come closer if you look at it","so we made a game. everyone looks in a different direction and then it cannot move at all","we played it for a whole hour. we won. mum was very angry about the hour"]},{id:"register",title:"INSTRUCTION PINNED INSIDE THE REGISTER",place:"farmhouse",body:["The eight names are to be read aloud at the treeline, in order, once each year, by the warden or by a person of sound mind who has volunteered.","The reader is to say their own name last.","The register is not to leave the parish. The register is not to be completed."]},{id:"surveyor",title:"ORDNANCE SURVEY — FIELD NOTE",place:"cabin",body:["Third attempt at triangulating this wood. Third set of contradictory bearings. The stand of pines north of the chapel measures 240 m across going in and 310 m coming back.","I am recommending the area be marked unmapped rather than continue to spend public money proving I cannot count."]},{id:"search",title:"SEARCH PARTY — DAY 4",place:"cabin",body:["We have swept the eastern quarter twice. Dogs will not enter past the fence line and I will not make them.","Found his torch. Still lit, after four days. I want that written down by someone other than me, because I know how it sounds."]},{id:"tom-1",title:"TOM'S NOTEBOOK — FIRST PAGE",place:"farmhouse",body:["If you are reading this you came looking, which means I did not come back, which means I was right about at least one thing.","The pages are not a warning. I have been treating them like a warning for two months and that is why I have got nowhere."]},{id:"tom-2",title:"TOM'S NOTEBOOK — TORN PAGE",place:"cabin",body:["Eight names. Eight families that stayed when everyone else left. Every one of them prospered. Not a single bad harvest in ninety years, in a valley where nothing grows.","It was never taking from us. We were paying, and we were getting our money's worth, and at some point we stopped noticing which of those came first."]},{id:"priest",title:"LETTER, UNSENT, TO THE DIOCESE",place:"farmhouse",body:["You ask what I believe is in the wood. I believe it is a contract, and I believe it is being honoured, and I believe my congregation would be considerably less calm if it were not.","You ask whether I have attempted an exorcism. I have not. One does not exorcise a creditor."]},{id:"warden-last",title:"WARDEN'S LOG — FINAL ENTRY, 1974",place:"farmhouse",body:["No one came to the reading. I stood at the treeline for two hours with the eight pages and read them to an empty field, and then I read my own name, and then I went home.","I am eighty-one. There will not be another reading. Whoever finds this: it is owed eight, and it has been patient, and patience is not the same as mercy."]},{id:"last-hand",title:"SCRATCHED INTO A DOOR FRAME",place:"cabin",body:["IT DOES NOT CHASE","IT ARRIVES","THE DIFFERENCE MATTERS WHEN YOU ARE DECIDING WHETHER TO RUN"]}],Ul="A note. <i>Read it.</i> They are not the register — they are the people who kept it.",Nl={escaped:{tag:"RECOVERED FOOTAGE",title:"OUT",sub:"Eight pages, and the gate let you through. Behind you the forest is exactly as quiet as it was before you arrived.",epilogue:{few:"You have the register. You do not know what it is for. That will be someone else's problem, in a year, at first frost.",many:"The register is complete. Eight names, and yours written last in a hand you recognise, because it is your brother's. The covenant is renewed. Something in the treeline is satisfied, and being satisfied is not the same as being finished."}},caught:{tag:"SIGNAL LOST",title:"COLLECTED",sub:"It did not chase you. It arrived, the way it always has, at the place you were going to be.",epilogue:{few:"The tape runs for another nine minutes. There is nothing on it but the forest, and the forest is not doing anything unusual.",many:"Somewhere a page is being amended. The debt was eight, and the arithmetic has never once been wrong."}},consumed:{tag:"TAPE CORRUPTED",title:"UNMADE",sub:"You looked, and kept looking, and the looking was the whole transaction.",epilogue:{few:"The static took the picture first. Whatever it took after that did not make a sound.",many:"The warden wrote that the reader must say their own name last. You never got to the end of the list. It said it for you."}}},po=["Eight fragments. One forest.<br />Something is already counting.","It does not chase.<br />It arrives.","The last reading was in 1974.<br />It has been patient.","Eight names were enough for ninety years.<br />Nobody asked what happens at nine."],ce=r=>document.getElementById(r);class Fl{constructor(){this.root=ce("hud"),this.clock=ce("hud-clock"),this.dayEl=ce("hud-day"),this.todEl=ce("hud-tod"),this.phaseEl=ce("hud-phase"),this.heldEl=ce("hud-held"),this.promptEl=ce("hud-prompt"),this.promptLabel=ce("prompt-label"),this.promptFill=ce("prompt-fill"),this.promptKey=ce("prompt-key"),this.toastsEl=ce("toasts"),this.vitals={};for(const t of["health","hunger","thirst","warmth","stamina"])this.vitals[t]={fill:ce(`v-${t}`),row:document.querySelector(`.vital[data-v="${t}"]`)};this.hint=ce("hud-hint"),this.notesEl=ce("hud-notes"),this.whisperEl=ce("whisper"),this._whisperTimer=0,this._lastHint="",this.lookFallback=!1}setLookFallback(t){this.lookFallback=t}show(){this.root.classList.add("is-on"),document.body.classList.add("playing")}hide(){this.root.classList.remove("is-on"),document.body.classList.remove("playing"),this.clearWhisper()}setClock(t,e,n){this.dayEl.textContent=`DAY ${t}`,this.todEl.textContent=e,this.phaseEl.textContent=n}setVitals(t){const e=(n,i)=>{const s=this.vitals[n];s.fill.style.transform=`scaleX(${Math.max(0,Math.min(1,i))})`,s.row.classList.toggle("is-low",i<.25)};e("health",t.health),e("hunger",t.hunger),e("thirst",t.thirst),e("warmth",t.warmth),e("stamina",t.stamina)}setHeld(t){this.heldEl.innerHTML=t||""}setPrompt(t){if(!t){this.promptEl.classList.remove("is-on");return}this.promptEl.classList.add("is-on"),this.promptEl.classList.toggle("is-blocked",!!t.blocked),this.promptLabel.textContent=t.label,this.promptKey.innerHTML=t.key,this.promptFill.style.transform=`scaleX(${t.progress??1})`}toast(t,e=!1){const n=document.createElement("div");for(n.className=`toast ${e?"toast--warn":""}`,n.innerHTML=t,this.toastsEl.appendChild(n),setTimeout(()=>n.remove(),2600);this.toastsEl.children.length>5;)this.toastsEl.firstChild.remove()}setHint(t){t!==this._lastHint&&(this._lastHint=t,this.hint.innerHTML=t||"",this.hint.classList.toggle("is-on",!!t))}whisper(t,e=5){this.whisperEl.innerHTML=t,this.whisperEl.classList.add("is-on"),clearTimeout(this._whisperTimer),this._whisperTimer=setTimeout(()=>this.whisperEl.classList.remove("is-on"),e*1e3)}clearWhisper(){clearTimeout(this._whisperTimer),this.whisperEl.classList.remove("is-on")}opening(){this.whisper("Wood, water, fire — in that order, and before dark.",6)}fragmentLine(t){const e=Ll[t];e&&this.whisper(e,5.4)}setNotes(){}showNote(t,e,n){ce("reader-title").textContent=t.title,ce("reader-body").innerHTML=t.body.map(i=>`<p>${i}</p>`).join(""),ce("reader-count").textContent=`NOTE ${e} OF ${n}`,ce("reader").hidden=!1}hideNote(){ce("reader").hidden=!0}get readerOpen(){return!ce("reader").hidden}playIntro(){return new Promise(t=>{const e=ce("intro"),n=ce("intro-kicker"),i=ce("intro-body"),s=ce("intro-next"),a=ce("intro-dots");let o=0;a.innerHTML=vs.map(()=>"<i></i>").join(""),e.hidden=!1;const c=()=>{const u=vs[o];n.textContent=u.kicker,i.innerHTML=u.body,[...a.children].forEach((d,p)=>d.classList.toggle("on",p<=o)),s.textContent=o===vs.length-1?"GO IN ▸":"CONTINUE ▸",i.style.animation="none",i.offsetWidth,i.style.animation="menuin 0.45s ease-out both"},l=()=>{o++,o>=vs.length?(e.hidden=!0,s.removeEventListener("click",l),removeEventListener("keydown",h),t()):c()},h=u=>{(u.code==="Space"||u.code==="Enter"||u.code==="KeyE")&&(u.preventDefault(),l())};s.addEventListener("click",l),addEventListener("keydown",h),c(),s.focus({preventScroll:!0})})}flashDamage(){this.root.classList.remove("flash-red"),this.root.offsetWidth,this.root.classList.add("flash-red")}dispose(){clearTimeout(this._whisperTimer),clearTimeout(this._whisperQueue)}}const te=r=>document.getElementById(r),gr=["PALE HOUR — ANALOG RECOVERY UNIT","reading tape ................ ok","compiling forest ............ ok","painting bark, soil, paper .. ok","synthesising wind ........... ok","locating subject ............ <b>found</b>","locating <b>second</b> subject ..... <b>found</b>"];class Ol{constructor(t,e){this.settings=t,this.h=e,this.screens={boot:te("boot"),menu:te("menu"),options:te("options"),difficulty:te("difficulty"),howto:te("howto"),credits:te("credits"),pause:te("pause"),over:te("over")},this.current="boot",this.returnTo="menu",this._wireNav(),this._wireOptions(),this._buildDifficulty(),this._wireKeys(),this._rotateTagline(),this._runBoot()}_rotateTagline(){const t=document.querySelector(".menu__tag");t&&(t.innerHTML=po[Math.floor(Math.random()*po.length)])}get inMenus(){return this.current!==null}show(t){for(const[e,n]of Object.entries(this.screens))n.hidden=e!==t;this.current=t,(t==="menu"||t==="pause")&&this._focusFirst(this.screens[t])}hideAll(){for(const t of Object.values(this.screens))t.hidden=!0;this.current=null}_focusFirst(t){const e=t.querySelector(".mbtn");e&&setTimeout(()=>e.focus({preventScroll:!0}),30)}async _runBoot(){const t=te("boot-log"),e=te("boot-fill"),n=te("boot-go");for(let i=0;i<gr.length;i++)t.innerHTML+=(i?`
`:"")+gr[i],e.style.width=`${(i+1)/gr.length*92}%`,await kl(i<2?210:130+Math.random()*190);e.style.width="100%",n.hidden=!1,n.addEventListener("click",()=>{this.h.onBootDone?.(),this.show("menu")}),n.focus({preventScroll:!0})}_wireNav(){document.addEventListener("click",t=>{const e=t.target.closest("[data-act]");if(!e)return;const n=e.dataset.act;switch(this.h.onSound?.("select"),n){case"play":this.hideAll(),this.h.onPlay(this.settings.difficulty);break;case"options":this.returnTo=this.current,this._syncOptions(),this.show("options");break;case"difficulty":this.returnTo=this.current,this.show("difficulty");break;case"howto":this.returnTo=this.current,this.show("howto");break;case"credits":this.returnTo=this.current,this.show("credits");break;case"back":this.show(this.returnTo||"menu");break;case"resume":this.hideAll(),this.h.onResume();break;case"quit":this.show("menu"),this.h.onQuit();break;case"retry":this.hideAll(),this.h.onRetry();break;case"close-reader":this.h.onCloseReader?.();break}}),document.addEventListener("pointerover",t=>{t.target.closest(".mbtn, .dcard")&&this.h.onSound?.("move")})}_wireKeys(){addEventListener("keydown",t=>{this.h.isReaderOpen?.()&&["KeyE","Space","Enter","Escape"].includes(t.code)&&(t.preventDefault(),t.stopImmediatePropagation(),this.h.onCloseReader?.())},!0),addEventListener("keydown",t=>{t.code==="Escape"&&(t.preventDefault(),this.current===null?this.h.onPauseRequest?.():this.current==="pause"?(this.hideAll(),this.h.onResume()):["options","difficulty","howto","credits"].includes(this.current)&&this.show(this.returnTo||"menu"))}),addEventListener("keydown",t=>{if(this.current!=="menu"&&this.current!=="pause")return;const e=[...this.screens[this.current].querySelectorAll(".mbtn")];if(!e.length)return;const n=e.indexOf(document.activeElement);if(t.code==="ArrowDown"||t.code==="ArrowUp"){t.preventDefault();const i=(n+(t.code==="ArrowDown"?1:-1)+e.length)%e.length;e[i<0?e.length-1:i].focus(),this.h.onSound?.("move")}})}_buildDifficulty(){const t=te("diff-cards");t.innerHTML="",this.diffCards={};for(const[e,n]of Object.entries(er)){const i=document.createElement("button");i.className="dcard",i.type="button",i.innerHTML=`
        <div class="dcard__n">${n.index}</div>
        <div class="dcard__t">${n.name}</div>
        <div class="dcard__d">${n.desc}</div>
        <div class="dcard__bars">${[1,2,3,4].map(s=>`<i class="${s<=n.bars?"on":""}"></i>`).join("")}</div>`,i.addEventListener("click",()=>{this.settings.difficulty=e,ts(this.settings),this._syncDifficulty(),this.h.onSound?.("select")}),t.appendChild(i),this.diffCards[e]=i}this._syncDifficulty()}_syncDifficulty(){for(const[t,e]of Object.entries(this.diffCards))e.classList.toggle("is-on",t===this.settings.difficulty);te("menu-diff").textContent=er[this.settings.difficulty]?.name??"—"}_wireOptions(){const t=[["volume","opt-volume",n=>n/100,n=>`${Math.round(n*100)}`],["sensitivity","opt-sens",n=>n/100,n=>`${Math.round(n*100)}`],["fov","opt-fov",n=>n,n=>`${Math.round(n)}`],["grain","opt-grain",n=>n/100,n=>`${Math.round(n*100)}`],["renderScale","opt-scale",n=>n/100,n=>`${Math.round(n*100)}`]];this._sliders=t;for(const[n,i,s,a]of t){const o=te(i),c=te(`${i}-out`);o.addEventListener("input",()=>{const l=s(Number(o.value));this.settings[n]=l,c.textContent=a(l),ts(this.settings),this.h.onSettingChange?.(n,l)})}for(const[n,i]of[["shake","opt-shake"],["invertY","opt-inverty"]]){const s=te(i);s.addEventListener("change",()=>{this.settings[n]=s.checked,ts(this.settings),this.h.onSettingChange?.(n,s.checked),this.h.onSound?.("select")})}const e=te("opt-seed");e.addEventListener("change",()=>{this.settings.seed=e.value.trim(),ts(this.settings)}),this._syncOptions()}_syncOptions(){const t=this.settings,e=(n,i,s)=>{te(n).value=i;const a=te(`${n}-out`);a&&(a.textContent=s)};e("opt-volume",Math.round(t.volume*100),`${Math.round(t.volume*100)}`),e("opt-sens",Math.round(t.sensitivity*100),`${Math.round(t.sensitivity*100)}`),e("opt-fov",Math.round(t.fov),`${Math.round(t.fov)}`),e("opt-grain",Math.round(t.grain*100),`${Math.round(t.grain*100)}`),e("opt-scale",Math.round(t.renderScale*100),`${Math.round(t.renderScale*100)}`),te("opt-shake").checked=!!t.shake,te("opt-inverty").checked=!!t.invertY,te("opt-seed").value=t.seed??""}showPause({found:t,total:e,time:n}){te("pause-found").textContent=t,te("pause-total").textContent=e,te("pause-time").textContent=n,this.show("pause")}showEnd(t,{found:e,total:n,time:i,seed:s,notesRead:a=0,notesTotal:o=0}){const c=document.querySelector(".overbox"),l=Nl[t],u=o>0&&a/o>=.5?l.epilogue.many:l.epilogue.few;c.classList.toggle("overbox--win",t==="escaped"),te("over-tag").textContent=l.tag,te("over-title").textContent=l.title,te("over-sub").innerHTML=`${l.sub}<br /><br />${u}`,te("over-stats").innerHTML=`<div>FRAGMENTS <b>${e}/${n}</b></div><div>NOTES <b>${a}/${o}</b></div><div>TIME <b>${i}</b></div><div>SEED <b>${s}</b></div>`,this.show("over")}}const kl=r=>new Promise(t=>setTimeout(t,r));/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ha="180",Bl=0,mo=1,zl=2,Ic=1,Lc=2,En=3,kn=0,Ge=1,Ee=2,Tn=0,wi=1,bn=2,go=3,_o=4,Hl=5,Zn=100,Gl=101,Vl=102,Wl=103,Xl=104,ql=200,Yl=201,$l=202,Kl=203,Zr=204,Jr=205,jl=206,Zl=207,Jl=208,Ql=209,th=210,eh=211,nh=212,ih=213,sh=214,Qr=0,ta=1,ea=2,Ri=3,na=4,ia=5,sa=6,ra=7,Uc=0,rh=1,ah=2,On=0,oh=1,ch=2,lh=3,Nc=4,hh=5,uh=6,dh=7,Fc=300,Ci=301,Pi=302,aa=303,oa=304,cr=306,Di=1e3,Qn=1001,ca=1002,Be=1003,fh=1004,xs=1005,un=1006,_r=1007,ti=1008,pn=1009,Oc=1010,kc=1011,rs=1012,Ga=1013,ei=1014,dn=1015,wn=1016,Va=1017,Wa=1018,as=1020,Bc=35902,zc=35899,Hc=1021,Gc=1022,rn=1023,os=1026,cs=1027,Xa=1028,qa=1029,Vc=1030,Ya=1031,$a=1033,Ys=33776,$s=33777,Ks=33778,js=33779,la=35840,ha=35841,ua=35842,da=35843,fa=36196,pa=37492,ma=37496,ga=37808,_a=37809,va=37810,xa=37811,Ma=37812,ya=37813,Sa=37814,Ea=37815,Ta=37816,ba=37817,wa=37818,Aa=37819,Ra=37820,Ca=37821,Pa=36492,Da=36494,Ia=36495,La=36283,Ua=36284,Na=36285,Fa=36286,ph=3200,mh=3201,Wc=0,gh=1,Nn="",Re="srgb",Ii="srgb-linear",nr="linear",ie="srgb",ai=7680,vo=519,_h=512,vh=513,xh=514,Xc=515,Mh=516,yh=517,Sh=518,Eh=519,xo=35044,Mo="300 es",fn=2e3,ir=2001;class Oi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let yo=1234567;const is=Math.PI/180,Li=180/Math.PI;function ki(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[r&255]+Ie[r>>8&255]+Ie[r>>16&255]+Ie[r>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function Xt(r,t,e){return Math.max(t,Math.min(e,r))}function Ka(r,t){return(r%t+t)%t}function Th(r,t,e,n,i){return n+(r-t)*(i-n)/(e-t)}function bh(r,t,e){return r!==t?(e-r)/(t-r):0}function ss(r,t,e){return(1-e)*r+e*t}function wh(r,t,e,n){return ss(r,t,1-Math.exp(-e*n))}function Ah(r,t=1){return t-Math.abs(Ka(r,t*2)-t)}function Rh(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function Ch(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function Ph(r,t){return r+Math.floor(Math.random()*(t-r+1))}function Dh(r,t){return r+Math.random()*(t-r)}function Ih(r){return r*(.5-Math.random())}function Lh(r){r!==void 0&&(yo=r);let t=yo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Uh(r){return r*is}function Nh(r){return r*Li}function Fh(r){return(r&r-1)===0&&r!==0}function Oh(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function kh(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Bh(r,t,e,n,i){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),d=a((t-n)/2),p=s((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":r.set(o*h,c*u,c*d,o*l);break;case"YZY":r.set(c*d,o*h,c*u,o*l);break;case"ZXZ":r.set(c*u,c*d,o*h,o*l);break;case"XZX":r.set(o*h,c*g,c*p,o*l);break;case"YXY":r.set(c*p,o*h,c*g,o*l);break;case"ZYZ":r.set(c*g,c*p,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ei(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Oe(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Oa={DEG2RAD:is,RAD2DEG:Li,generateUUID:ki,clamp:Xt,euclideanModulo:Ka,mapLinear:Th,inverseLerp:bh,lerp:ss,damp:wh,pingpong:Ah,smoothstep:Rh,smootherstep:Ch,randInt:Ph,randFloat:Dh,randFloatSpread:Ih,seededRandom:Lh,degToRad:Uh,radToDeg:Nh,isPowerOfTwo:Fh,ceilPowerOfTwo:Oh,floorPowerOfTwo:kh,setQuaternionFromProperEuler:Bh,normalize:Oe,denormalize:Ei};class wt{constructor(t=0,e=0){wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*i+t.x,this.y=s*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class us{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=s[a+0],p=s[a+1],g=s[a+2],_=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==p||h!==g){let m=1-o;const f=c*d+l*p+h*g+u*_,E=f>=0?1:-1,T=1-f*f;if(T>Number.EPSILON){const A=Math.sqrt(T),b=Math.atan2(A,f*E);m=Math.sin(m*b)/A,o=Math.sin(o*b)/A}const x=o*E;if(c=c*m+d*x,l=l*m+p*x,h=h*m+g*x,u=u*m+_*x,m===1-o){const A=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=A,l*=A,h*=A,u*=A}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=s[a],d=s[a+1],p=s[a+2],g=s[a+3];return t[e]=o*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-o*p,t[e+2]=l*g+h*p+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(s/2),d=c(n/2),p=c(i/2),g=c(s/2);switch(a){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(s-l)*p,this._z=(a-i)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(h-c)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+l)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(s-l)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-i)/p,this._x=(s+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+i*l-s*c,this._y=i*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(So.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(So.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*i-o*n),h=2*(o*e-s*i),u=2*(s*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-s*u,this.z=i+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=i*c-s*o,this.y=s*a-n*c,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return vr.copy(this).projectOnVector(t),this.sub(vr)}reflect(t){return this.sub(vr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vr=new R,So=new us;class Bt{constructor(t,e,n,i,s,a,o,c,l){Bt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,o,c,l)}set(t,e,n,i,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=i[0],m=i[3],f=i[6],E=i[1],T=i[4],x=i[7],A=i[2],b=i[5],C=i[8];return s[0]=a*_+o*E+c*A,s[3]=a*m+o*T+c*b,s[6]=a*f+o*x+c*C,s[1]=l*_+h*E+u*A,s[4]=l*m+h*T+u*b,s[7]=l*f+h*x+u*C,s[2]=d*_+p*E+g*A,s[5]=d*m+p*T+g*b,s[8]=d*f+p*x+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+i*s*l-i*a*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*s,p=l*s-a*c,g=e*u+n*d+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*l-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=d*_,t[4]=(h*e-i*c)*_,t[5]=(i*s-o*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-i*l,i*c,-i*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(xr.makeScale(t,e)),this}rotate(t){return this.premultiply(xr.makeRotation(-t)),this}translate(t,e){return this.premultiply(xr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const xr=new Bt;function qc(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function sr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function zh(){const r=sr("canvas");return r.style.display="block",r}const Eo={};function ls(r){r in Eo||(Eo[r]=!0,console.warn(r))}function Hh(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const To=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bo=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gh(){const r={enabled:!0,workingColorSpace:Ii,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ie&&(i.r=An(i.r),i.g=An(i.g),i.b=An(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ie&&(i.r=Ai(i.r),i.g=Ai(i.g),i.b=Ai(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Nn?nr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return ls("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return ls("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Ii]:{primaries:t,whitePoint:n,transfer:nr,toXYZ:To,fromXYZ:bo,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:n,transfer:ie,toXYZ:To,fromXYZ:bo,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),r}const Kt=Gh();function An(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ai(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let oi;class Vh{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{oi===void 0&&(oi=sr("canvas")),oi.width=t.width,oi.height=t.height;const i=oi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=oi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=sr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=An(s[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Wh=0;class ja{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=ki(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Mr(i[a].image)):s.push(Mr(i[a]))}else s=Mr(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function Mr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Vh.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xh=0;const yr=new R;class Ne extends Oi{constructor(t=Ne.DEFAULT_IMAGE,e=Ne.DEFAULT_MAPPING,n=Qn,i=Qn,s=un,a=ti,o=rn,c=pn,l=Ne.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xh++}),this.uuid=ki(),this.name="",this.source=new ja(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new wt(0,0),this.repeat=new wt(1,1),this.center=new wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(yr).x}get height(){return this.source.getSize(yr).y}get depth(){return this.source.getSize(yr).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Di:t.x=t.x-Math.floor(t.x);break;case Qn:t.x=t.x<0?0:1;break;case ca:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Di:t.y=t.y-Math.floor(t.y);break;case Qn:t.y=t.y<0?0:1;break;case ca:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ne.DEFAULT_IMAGE=null;Ne.DEFAULT_MAPPING=Fc;Ne.DEFAULT_ANISOTROPY=1;class se{constructor(t=0,e=0,n=0,i=1){se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(l+1)/2,x=(p+1)/2,A=(f+1)/2,b=(h+d)/4,C=(u+_)/4,I=(g+m)/4;return T>x&&T>A?T<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(T),i=b/n,s=C/n):x>A?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=b/i,s=I/i):A<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(A),n=C/s,i=I/s),this.set(n,i,s,e),this}let E=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-_)/E,this.z=(d-h)/E,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qh extends Oi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);const i={width:t,height:e,depth:n.depth},s=new Ne(i);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:un,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new ja(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class an extends qh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Yc extends Ne{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Yh extends Ne{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class si{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Qe):Qe.fromBufferAttribute(s,a),Qe.applyMatrix4(t.matrixWorld),this.expandByPoint(Qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ms.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ms.copy(n.boundingBox)),Ms.applyMatrix4(t.matrixWorld),this.union(Ms)}const i=t.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Qe),Qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vi),ys.subVectors(this.max,Vi),ci.subVectors(t.a,Vi),li.subVectors(t.b,Vi),hi.subVectors(t.c,Vi),Rn.subVectors(li,ci),Cn.subVectors(hi,li),Vn.subVectors(ci,hi);let e=[0,-Rn.z,Rn.y,0,-Cn.z,Cn.y,0,-Vn.z,Vn.y,Rn.z,0,-Rn.x,Cn.z,0,-Cn.x,Vn.z,0,-Vn.x,-Rn.y,Rn.x,0,-Cn.y,Cn.x,0,-Vn.y,Vn.x,0];return!Sr(e,ci,li,hi,ys)||(e=[1,0,0,0,1,0,0,0,1],!Sr(e,ci,li,hi,ys))?!1:(Ss.crossVectors(Rn,Cn),e=[Ss.x,Ss.y,Ss.z],Sr(e,ci,li,hi,ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const _n=[new R,new R,new R,new R,new R,new R,new R,new R],Qe=new R,Ms=new si,ci=new R,li=new R,hi=new R,Rn=new R,Cn=new R,Vn=new R,Vi=new R,ys=new R,Ss=new R,Wn=new R;function Sr(r,t,e,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Wn.fromArray(r,s);const o=i.x*Math.abs(Wn.x)+i.y*Math.abs(Wn.y)+i.z*Math.abs(Wn.z),c=t.dot(Wn),l=e.dot(Wn),h=n.dot(Wn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const $h=new si,Wi=new R,Er=new R;class Bi{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):$h.setFromPoints(t).getCenter(n);let i=0;for(let s=0,a=t.length;s<a;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Wi.subVectors(t,this.center);const e=Wi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Wi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Er.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Wi.copy(t.center).add(Er)),this.expandByPoint(Wi.copy(t.center).sub(Er))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const vn=new R,Tr=new R,Es=new R,Pn=new R,br=new R,Ts=new R,wr=new R;class $c{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,vn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=vn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(vn.copy(this.origin).addScaledVector(this.direction,e),vn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Tr.copy(t).add(e).multiplyScalar(.5),Es.copy(e).sub(t).normalize(),Pn.copy(this.origin).sub(Tr);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Es),o=Pn.dot(this.direction),c=-Pn.dot(Es),l=Pn.lengthSq(),h=Math.abs(1-a*a);let u,d,p,g;if(h>0)if(u=a*c-o,d=a*o-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-c),s),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),p=d*(d+2*c)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-c),s),p=-u*u+d*(d+2*c)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Tr).addScaledVector(Es,d),p}intersectSphere(t,e){vn.subVectors(t.center,this.origin);const n=vn.dot(this.direction),i=vn.dot(vn)-n*n,s=t.radius*t.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,vn)!==null}intersectTriangle(t,e,n,i,s){br.subVectors(e,t),Ts.subVectors(n,t),wr.crossVectors(br,Ts);let a=this.direction.dot(wr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pn.subVectors(this.origin,t);const c=o*this.direction.dot(Ts.crossVectors(Pn,Ts));if(c<0)return null;const l=o*this.direction.dot(br.cross(Pn));if(l<0||c+l>a)return null;const h=-o*Pn.dot(wr);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Qt{constructor(t,e,n,i,s,a,o,c,l,h,u,d,p,g,_,m){Qt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,o,c,l,h,u,d,p,g,_,m)}set(t,e,n,i,s,a,o,c,l,h,u,d,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=i,f[1]=s,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ui.setFromMatrixColumn(t,0).length(),s=1/ui.setFromMatrixColumn(t,1).length(),a=1/ui.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=a*h,p=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-_*l,e[9]=-o*c,e[2]=_-d*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,p=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,p=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*c,p=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Kh,t,jh)}lookAt(t,e,n){const i=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),Dn.crossVectors(n,Ye),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),Dn.crossVectors(n,Ye)),Dn.normalize(),bs.crossVectors(Ye,Dn),i[0]=Dn.x,i[4]=bs.x,i[8]=Ye.x,i[1]=Dn.y,i[5]=bs.y,i[9]=Ye.y,i[2]=Dn.z,i[6]=bs.z,i[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],E=n[3],T=n[7],x=n[11],A=n[15],b=i[0],C=i[4],I=i[8],y=i[12],S=i[1],D=i[5],F=i[9],z=i[13],q=i[2],W=i[6],X=i[10],Z=i[14],H=i[3],at=i[7],ht=i[11],Et=i[15];return s[0]=a*b+o*S+c*q+l*H,s[4]=a*C+o*D+c*W+l*at,s[8]=a*I+o*F+c*X+l*ht,s[12]=a*y+o*z+c*Z+l*Et,s[1]=h*b+u*S+d*q+p*H,s[5]=h*C+u*D+d*W+p*at,s[9]=h*I+u*F+d*X+p*ht,s[13]=h*y+u*z+d*Z+p*Et,s[2]=g*b+_*S+m*q+f*H,s[6]=g*C+_*D+m*W+f*at,s[10]=g*I+_*F+m*X+f*ht,s[14]=g*y+_*z+m*Z+f*Et,s[3]=E*b+T*S+x*q+A*H,s[7]=E*C+T*D+x*W+A*at,s[11]=E*I+T*F+x*X+A*ht,s[15]=E*y+T*z+x*Z+A*Et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+s*c*u-i*l*u-s*o*d+n*l*d+i*o*p-n*c*p)+_*(+e*c*p-e*l*d+s*a*d-i*a*p+i*l*h-s*c*h)+m*(+e*l*u-e*o*p-s*a*u+n*a*p+s*o*h-n*l*h)+f*(-i*o*h-e*c*u+e*o*d+i*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],E=u*m*l-_*d*l+_*c*p-o*m*p-u*c*f+o*d*f,T=g*d*l-h*m*l-g*c*p+a*m*p+h*c*f-a*d*f,x=h*_*l-g*u*l+g*o*p-a*_*p-h*o*f+a*u*f,A=g*u*c-h*_*c-g*o*d+a*_*d+h*o*m-a*u*m,b=e*E+n*T+i*x+s*A;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/b;return t[0]=E*C,t[1]=(_*d*s-u*m*s-_*i*p+n*m*p+u*i*f-n*d*f)*C,t[2]=(o*m*s-_*c*s+_*i*l-n*m*l-o*i*f+n*c*f)*C,t[3]=(u*c*s-o*d*s-u*i*l+n*d*l+o*i*p-n*c*p)*C,t[4]=T*C,t[5]=(h*m*s-g*d*s+g*i*p-e*m*p-h*i*f+e*d*f)*C,t[6]=(g*c*s-a*m*s-g*i*l+e*m*l+a*i*f-e*c*f)*C,t[7]=(a*d*s-h*c*s+h*i*l-e*d*l-a*i*p+e*c*p)*C,t[8]=x*C,t[9]=(g*u*s-h*_*s-g*n*p+e*_*p+h*n*f-e*u*f)*C,t[10]=(a*_*s-g*o*s+g*n*l-e*_*l-a*n*f+e*o*f)*C,t[11]=(h*o*s-a*u*s-h*n*l+e*u*l+a*n*p-e*o*p)*C,t[12]=A*C,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*m+e*u*m)*C,t[14]=(g*o*i-a*_*i-g*n*c+e*_*c+a*n*m-e*o*m)*C,t[15]=(a*u*i-h*o*i+h*n*c-e*u*c-a*n*d+e*o*d)*C,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,a){return this.set(1,n,s,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,u=o+o,d=s*l,p=s*h,g=s*u,_=a*h,m=a*u,f=o*u,E=c*l,T=c*h,x=c*u,A=n.x,b=n.y,C=n.z;return i[0]=(1-(_+f))*A,i[1]=(p+x)*A,i[2]=(g-T)*A,i[3]=0,i[4]=(p-x)*b,i[5]=(1-(d+f))*b,i[6]=(m+E)*b,i[7]=0,i[8]=(g+T)*C,i[9]=(m-E)*C,i[10]=(1-(d+_))*C,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=ui.set(i[0],i[1],i[2]).length();const a=ui.set(i[4],i[5],i[6]).length(),o=ui.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],tn.copy(this);const l=1/s,h=1/a,u=1/o;return tn.elements[0]*=l,tn.elements[1]*=l,tn.elements[2]*=l,tn.elements[4]*=h,tn.elements[5]*=h,tn.elements[6]*=h,tn.elements[8]*=u,tn.elements[9]*=u,tn.elements[10]*=u,e.setFromRotationMatrix(tn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,i,s,a,o=fn,c=!1){const l=this.elements,h=2*s/(e-t),u=2*s/(n-i),d=(e+t)/(e-t),p=(n+i)/(n-i);let g,_;if(c)g=s/(a-s),_=a*s/(a-s);else if(o===fn)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===ir)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,s,a,o=fn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),p=-(n+i)/(n-i);let g,_;if(c)g=1/(a-s),_=a/(a-s);else if(o===fn)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===ir)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ui=new R,tn=new Qt,Kh=new R(0,0,0),jh=new R(1,1,1),Dn=new R,bs=new R,Ye=new R,wo=new Qt,Ao=new us;class mn{constructor(t=0,e=0,n=0,i=mn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Xt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return wo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(wo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ao.setFromEuler(this),this.setFromQuaternion(Ao,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mn.DEFAULT_ORDER="XYZ";class Kc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zh=0;const Ro=new R,di=new us,xn=new Qt,ws=new R,Xi=new R,Jh=new R,Qh=new us,Co=new R(1,0,0),Po=new R(0,1,0),Do=new R(0,0,1),Io={type:"added"},tu={type:"removed"},fi={type:"childadded",child:null},Ar={type:"childremoved",child:null};class ue extends Oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zh++}),this.uuid=ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ue.DEFAULT_UP.clone();const t=new R,e=new mn,n=new us,i=new R(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Qt},normalMatrix:{value:new Bt}}),this.matrix=new Qt,this.matrixWorld=new Qt,this.matrixAutoUpdate=ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.multiply(di),this}rotateOnWorldAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.premultiply(di),this}rotateX(t){return this.rotateOnAxis(Co,t)}rotateY(t){return this.rotateOnAxis(Po,t)}rotateZ(t){return this.rotateOnAxis(Do,t)}translateOnAxis(t,e){return Ro.copy(t).applyQuaternion(this.quaternion),this.position.add(Ro.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Co,t)}translateY(t){return this.translateOnAxis(Po,t)}translateZ(t){return this.translateOnAxis(Do,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ws.copy(t):ws.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Xi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(Xi,ws,this.up):xn.lookAt(ws,Xi,this.up),this.quaternion.setFromRotationMatrix(xn),i&&(xn.extractRotation(i.matrixWorld),di.setFromRotationMatrix(xn),this.quaternion.premultiply(di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Io),fi.child=t,this.dispatchEvent(fi),fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(tu),Ar.child=t,this.dispatchEvent(Ar),Ar.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Io),fi.child=t,this.dispatchEvent(fi),fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xi,t,Jh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xi,Qh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));i.material=o}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}ue.DEFAULT_UP=new R(0,1,0);ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const en=new R,Mn=new R,Rr=new R,yn=new R,pi=new R,mi=new R,Lo=new R,Cr=new R,Pr=new R,Dr=new R,Ir=new se,Lr=new se,Ur=new se;class nn{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),en.subVectors(t,e),i.cross(en);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){en.subVectors(i,e),Mn.subVectors(n,e),Rr.subVectors(t,e);const a=en.dot(en),o=en.dot(Mn),c=en.dot(Rr),l=Mn.dot(Mn),h=Mn.dot(Rr),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,p=(l*c-o*h)*d,g=(a*h-o*c)*d;return s.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(t,e,n,i,s,a,o,c){return this.getBarycoord(t,e,n,i,yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,yn.x),c.addScaledVector(a,yn.y),c.addScaledVector(o,yn.z),c)}static getInterpolatedAttribute(t,e,n,i,s,a){return Ir.setScalar(0),Lr.setScalar(0),Ur.setScalar(0),Ir.fromBufferAttribute(t,e),Lr.fromBufferAttribute(t,n),Ur.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(Ir,s.x),a.addScaledVector(Lr,s.y),a.addScaledVector(Ur,s.z),a}static isFrontFacing(t,e,n,i){return en.subVectors(n,e),Mn.subVectors(t,e),en.cross(Mn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return en.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),en.cross(Mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return nn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return nn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let a,o;pi.subVectors(i,n),mi.subVectors(s,n),Cr.subVectors(t,n);const c=pi.dot(Cr),l=mi.dot(Cr);if(c<=0&&l<=0)return e.copy(n);Pr.subVectors(t,i);const h=pi.dot(Pr),u=mi.dot(Pr);if(h>=0&&u<=h)return e.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(pi,a);Dr.subVectors(t,s);const p=pi.dot(Dr),g=mi.dot(Dr);if(g>=0&&p<=g)return e.copy(s);const _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(mi,o);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Lo.subVectors(s,i),o=(u-h)/(u-h+(p-g)),e.copy(i).addScaledVector(Lo,o);const f=1/(m+_+d);return a=_*f,o=d*f,e.copy(n).addScaledVector(pi,a).addScaledVector(mi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const jc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},As={h:0,s:0,l:0};function Nr(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class Nt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Re){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Kt.workingColorSpace){if(t=Ka(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Nr(a,s,t+1/3),this.g=Nr(a,s,t),this.b=Nr(a,s,t-1/3)}return Kt.colorSpaceToWorking(this,i),this}setStyle(t,e=Re){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Re){const n=jc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=Ai(t.r),this.g=Ai(t.g),this.b=Ai(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Re){return Kt.workingToColorSpace(Le.copy(this),t),Math.round(Xt(Le.r*255,0,255))*65536+Math.round(Xt(Le.g*255,0,255))*256+Math.round(Xt(Le.b*255,0,255))}getHexString(t=Re){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.workingToColorSpace(Le.copy(this),e);const n=Le.r,i=Le.g,s=Le.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-s)/u+(i<s?6:0);break;case i:c=(s-n)/u+2;break;case s:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.workingToColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Re){Kt.workingToColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,i=Le.b;return t!==Re?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(In),this.setHSL(In.h+t,In.s+e,In.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(In),t.getHSL(As);const n=ss(In.h,As.h,e),i=ss(In.s,As.s,e),s=ss(In.l,As.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new Nt;Nt.NAMES=jc;let eu=0;class zi extends Oi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=ki(),this.name="",this.type="Material",this.blending=wi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zr,this.blendDst=Jr,this.blendEquation=Zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=Ri,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==wi&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Zr&&(n.blendSrc=this.blendSrc),this.blendDst!==Jr&&(n.blendDst=this.blendDst),this.blendEquation!==Zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ri&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=i(t.textures),a=i(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ni extends zi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new R,Rs=new wt;let nu=0;class Pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:nu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=xo,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Rs.fromBufferAttribute(this,e),Rs.applyMatrix3(t),this.setXY(e,Rs.x,Rs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ei(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ei(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ei(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ei(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ei(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),i=Oe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),i=Oe(i,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==xo&&(t.usage=this.usage),t}}class Zc extends Pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Jc extends Pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ee extends Pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let iu=0;const Ze=new Qt,Fr=new ue,gi=new R,$e=new si,qi=new si,Ae=new R;class Ce extends Oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qc(t)?Jc:Zc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Bt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ze.makeRotationFromQuaternion(t),this.applyMatrix4(Ze),this}rotateX(t){return Ze.makeRotationX(t),this.applyMatrix4(Ze),this}rotateY(t){return Ze.makeRotationY(t),this.applyMatrix4(Ze),this}rotateZ(t){return Ze.makeRotationZ(t),this.applyMatrix4(Ze),this}translate(t,e,n){return Ze.makeTranslation(t,e,n),this.applyMatrix4(Ze),this}scale(t,e,n){return Ze.makeScale(t,e,n),this.applyMatrix4(Ze),this}lookAt(t){return Fr.lookAt(t),Fr.updateMatrix(),this.applyMatrix4(Fr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,s=t.length;i<s;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ee(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new si);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];$e.setFromBufferAttribute(s),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];qi.setFromBufferAttribute(o),this.morphTargetsRelative?(Ae.addVectors($e.min,qi.min),$e.expandByPoint(Ae),Ae.addVectors($e.max,qi.max),$e.expandByPoint(Ae)):($e.expandByPoint(qi.min),$e.expandByPoint(qi.max))}$e.getCenter(n);let i=0;for(let s=0,a=t.count;s<a;s++)Ae.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(Ae));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ae.fromBufferAttribute(o,l),c&&(gi.fromBufferAttribute(t,l),Ae.add(gi)),i=Math.max(i,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let I=0;I<n.count;I++)o[I]=new R,c[I]=new R;const l=new R,h=new R,u=new R,d=new wt,p=new wt,g=new wt,_=new R,m=new R;function f(I,y,S){l.fromBufferAttribute(n,I),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,S),d.fromBufferAttribute(s,I),p.fromBufferAttribute(s,y),g.fromBufferAttribute(s,S),h.sub(l),u.sub(l),p.sub(d),g.sub(d);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(D),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(D),o[I].add(_),o[y].add(_),o[S].add(_),c[I].add(m),c[y].add(m),c[S].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let I=0,y=E.length;I<y;++I){const S=E[I],D=S.start,F=S.count;for(let z=D,q=D+F;z<q;z+=3)f(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const T=new R,x=new R,A=new R,b=new R;function C(I){A.fromBufferAttribute(i,I),b.copy(A);const y=o[I];T.copy(y),T.sub(A.multiplyScalar(A.dot(y))).normalize(),x.crossVectors(b,y);const D=x.dot(c[I])<0?-1:1;a.setXYZW(I,T.x,T.y,T.z,D)}for(let I=0,y=E.length;I<y;++I){const S=E[I],D=S.start,F=S.count;for(let z=D,q=D+F;z<q;z+=3)C(t.getX(z+0)),C(t.getX(z+1)),C(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const i=new R,s=new R,a=new R,o=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)i.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new Pe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],p=t(d,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(i[c]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uo=new Qt,Xn=new $c,Cs=new Bi,No=new R,Ps=new R,Ds=new R,Is=new R,Or=new R,Ls=new R,Fo=new R,Us=new R;class K extends ue{constructor(t=new Ce,e=new ni){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(s&&o){Ls.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],u=s[c];h!==0&&(Or.fromBufferAttribute(u,t),a?Ls.addScaledVector(Or,h):Ls.addScaledVector(Or.sub(e),h))}e.add(Ls)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(s),Xn.copy(t.ray).recast(t.near),!(Cs.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(Cs,No)===null||Xn.origin.distanceToSquared(No)>(t.far-t.near)**2))&&(Uo.copy(s).invert(),Xn.copy(t.ray).applyMatrix4(Uo),!(n.boundingBox!==null&&Xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xn)))}_computeIntersections(t,e,n){let i;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=a[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let x=E,A=T;x<A;x+=3){const b=o.getX(x),C=o.getX(x+1),I=o.getX(x+2);i=Ns(this,f,t,n,l,h,u,b,C,I),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const E=o.getX(m),T=o.getX(m+1),x=o.getX(m+2);i=Ns(this,a,t,n,l,h,u,E,T,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=a[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let x=E,A=T;x<A;x+=3){const b=x,C=x+1,I=x+2;i=Ns(this,f,t,n,l,h,u,b,C,I),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const E=m,T=m+1,x=m+2;i=Ns(this,a,t,n,l,h,u,E,T,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function su(r,t,e,n,i,s,a,o){let c;if(t.side===Ge?c=n.intersectTriangle(a,s,i,!0,o):c=n.intersectTriangle(i,s,a,t.side===kn,o),c===null)return null;Us.copy(o),Us.applyMatrix4(r.matrixWorld);const l=e.ray.origin.distanceTo(Us);return l<e.near||l>e.far?null:{distance:l,point:Us.clone(),object:r}}function Ns(r,t,e,n,i,s,a,o,c,l){r.getVertexPosition(o,Ps),r.getVertexPosition(c,Ds),r.getVertexPosition(l,Is);const h=su(r,t,e,n,Ps,Ds,Is,Fo);if(h){const u=new R;nn.getBarycoord(Fo,Ps,Ds,Is,u),i&&(h.uv=nn.getInterpolatedAttribute(i,o,c,l,u,new wt)),s&&(h.uv1=nn.getInterpolatedAttribute(s,o,c,l,u,new wt)),a&&(h.normal=nn.getInterpolatedAttribute(a,o,c,l,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new R,materialIndex:0};nn.getNormal(Ps,Ds,Is,d.normal),h.face=d,h.barycoord=u}return h}class Ct extends Ce{constructor(t=1,e=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(c),this.setAttribute("position",new ee(l,3)),this.setAttribute("normal",new ee(h,3)),this.setAttribute("uv",new ee(u,2));function g(_,m,f,E,T,x,A,b,C,I,y){const S=x/C,D=A/I,F=x/2,z=A/2,q=b/2,W=C+1,X=I+1;let Z=0,H=0;const at=new R;for(let ht=0;ht<X;ht++){const Et=ht*D-z;for(let Vt=0;Vt<W;Vt++){const ae=Vt*S-F;at[_]=ae*E,at[m]=Et*T,at[f]=q,l.push(at.x,at.y,at.z),at[_]=0,at[m]=0,at[f]=b>0?1:-1,h.push(at.x,at.y,at.z),u.push(Vt/C),u.push(1-ht/I),Z+=1}}for(let ht=0;ht<I;ht++)for(let Et=0;Et<C;Et++){const Vt=d+Et+W*ht,ae=d+Et+W*(ht+1),de=d+(Et+1)+W*(ht+1),jt=d+(Et+1)+W*ht;c.push(Vt,ae,jt),c.push(ae,de,jt),H+=6}o.addGroup(p,H,y),p+=H,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ct(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ui(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function ke(r){const t={};for(let e=0;e<r.length;e++){const n=Ui(r[e]);for(const i in n)t[i]=n[i]}return t}function ru(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function Qc(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const rr={clone:Ui,merge:ke};var au=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ou=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ue extends zi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=au,this.fragmentShader=ou,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ui(t.uniforms),this.uniformsGroups=ru(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class tl extends ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qt,this.projectionMatrix=new Qt,this.projectionMatrixInverse=new Qt,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ln=new R,Oo=new wt,ko=new wt;class He extends tl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Li*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(is*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Li*2*Math.atan(Math.tan(is*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ln.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ln.x,Ln.y).multiplyScalar(-t/Ln.z),Ln.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ln.x,Ln.y).multiplyScalar(-t/Ln.z)}getViewSize(t,e){return this.getViewBounds(t,Oo,ko),e.subVectors(ko,Oo)}setViewOffset(t,e,n,i,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(is*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const _i=-90,vi=1;class cu extends ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new He(_i,vi,t,e);i.layers=this.layers,this.add(i);const s=new He(_i,vi,t,e);s.layers=this.layers,this.add(s);const a=new He(_i,vi,t,e);a.layers=this.layers,this.add(a);const o=new He(_i,vi,t,e);o.layers=this.layers,this.add(o);const c=new He(_i,vi,t,e);c.layers=this.layers,this.add(c);const l=new He(_i,vi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===fn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class el extends Ne{constructor(t=[],e=Ci,n,i,s,a,o,c,l,h){super(t,e,n,i,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class lu extends an{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new el(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ct(5,5,5),s=new Ue({name:"CubemapFromEquirect",uniforms:Ui(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ge,blending:Tn});s.uniforms.tEquirect.value=e;const a=new K(i,s),o=e.minFilter;return e.minFilter===ti&&(e.minFilter=un),new cu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(s)}}class Yt extends ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hu={type:"move"};class kr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(l,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hu)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Yt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Za{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Nt(t),this.density=e}clone(){return new Za(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class uu extends ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class du extends Ne{constructor(t=null,e=1,n=1,i,s,a,o,c,l=Be,h=Be,u,d){super(null,a,o,c,l,h,i,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bo extends Pe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const xi=new Qt,zo=new Qt,Fs=[],Ho=new si,fu=new Qt,Yi=new K,$i=new Bi;class Ti extends K{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Bo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,fu)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new si),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,xi),Ho.copy(t.boundingBox).applyMatrix4(xi),this.boundingBox.union(Ho)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Bi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,xi),$i.copy(t.boundingSphere).applyMatrix4(xi),this.boundingSphere.union($i)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=t*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Yi.geometry=this.geometry,Yi.material=this.material,Yi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$i.copy(this.boundingSphere),$i.applyMatrix4(n),t.ray.intersectsSphere($i)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,xi),zo.multiplyMatrices(n,xi),Yi.matrixWorld=zo,Yi.raycast(t,Fs);for(let a=0,o=Fs.length;a<o;a++){const c=Fs[a];c.instanceId=s,c.object=this,e.push(c)}Fs.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Bo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new du(new Float32Array(i*this.count),i,this.count,Xa,dn));const s=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*t;s[c]=o,s.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Br=new R,pu=new R,mu=new Bt;class Kn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Br.subVectors(n,e).cross(pu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Br),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||mu.getNormalMatrix(t),i=this.coplanarPoint(Br).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qn=new Bi,gu=new wt(.5,.5),Os=new R;class Ja{constructor(t=new Kn,e=new Kn,n=new Kn,i=new Kn,s=new Kn,a=new Kn){this.planes=[t,e,n,i,s,a]}set(t,e,n,i,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=fn,n=!1){const i=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],u=s[5],d=s[6],p=s[7],g=s[8],_=s[9],m=s[10],f=s[11],E=s[12],T=s[13],x=s[14],A=s[15];if(i[0].setComponents(l-a,p-h,f-g,A-E).normalize(),i[1].setComponents(l+a,p+h,f+g,A+E).normalize(),i[2].setComponents(l+o,p+u,f+_,A+T).normalize(),i[3].setComponents(l-o,p-u,f-_,A-T).normalize(),n)i[4].setComponents(c,d,m,x).normalize(),i[5].setComponents(l-c,p-d,f-m,A-x).normalize();else if(i[4].setComponents(l-c,p-d,f-m,A-x).normalize(),e===fn)i[5].setComponents(l+c,p+d,f+m,A+x).normalize();else if(e===ir)i[5].setComponents(c,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(t){qn.center.set(0,0,0);const e=gu.distanceTo(t.center);return qn.radius=.7071067811865476+e,qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Os.x=i.normal.x>0?t.max.x:t.min.x,Os.y=i.normal.y>0?t.max.y:t.min.y,Os.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Os)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class _u extends zi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Go=new Qt,ka=new $c,ks=new Bi,Bs=new R;class nl extends ue{constructor(t=new Ce,e=new _u){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(i),ks.radius+=s,t.ray.intersectsSphere(ks)===!1)return;Go.copy(i).invert(),ka.copy(t.ray).applyMatrix4(Go);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let g=d,_=p;g<_;g++){const m=l.getX(g);Bs.fromBufferAttribute(u,m),Vo(Bs,m,c,i,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=d,_=p;g<_;g++)Bs.fromBufferAttribute(u,g),Vo(Bs,g,c,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Vo(r,t,e,n,i,s,a){const o=ka.distanceSqToPoint(r);if(o<e){const c=new R;ka.closestPointToPoint(r,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class ds extends Ne{constructor(t,e,n,i,s,a,o,c,l){super(t,e,n,i,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class il extends Ne{constructor(t,e,n=ei,i,s,a,o=Be,c=Be,l,h=os,u=1){if(h!==os&&h!==cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,i,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ja(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class sl extends Ne{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ni extends Ce{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const s=[],a=[],o=[],c=[],l=new R,h=new wt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const p=n+u/e*i;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new ee(a,3)),this.setAttribute("normal",new ee(o,3)),this.setAttribute("uv",new ee(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ni(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class le extends Ce{constructor(t=1,e=1,n=1,i=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),s=Math.floor(s);const h=[],u=[],d=[],p=[];let g=0;const _=[],m=n/2;let f=0;E(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new ee(u,3)),this.setAttribute("normal",new ee(d,3)),this.setAttribute("uv",new ee(p,2));function E(){const x=new R,A=new R;let b=0;const C=(e-t)/n;for(let I=0;I<=s;I++){const y=[],S=I/s,D=S*(e-t)+t;for(let F=0;F<=i;F++){const z=F/i,q=z*c+o,W=Math.sin(q),X=Math.cos(q);A.x=D*W,A.y=-S*n+m,A.z=D*X,u.push(A.x,A.y,A.z),x.set(W,C,X).normalize(),d.push(x.x,x.y,x.z),p.push(z,1-S),y.push(g++)}_.push(y)}for(let I=0;I<i;I++)for(let y=0;y<s;y++){const S=_[y][I],D=_[y+1][I],F=_[y+1][I+1],z=_[y][I+1];(t>0||y!==0)&&(h.push(S,D,z),b+=3),(e>0||y!==s-1)&&(h.push(D,F,z),b+=3)}l.addGroup(f,b,0),f+=b}function T(x){const A=g,b=new wt,C=new R;let I=0;const y=x===!0?t:e,S=x===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*S,0),d.push(0,S,0),p.push(.5,.5),g++;const D=g;for(let F=0;F<=i;F++){const q=F/i*c+o,W=Math.cos(q),X=Math.sin(q);C.x=y*X,C.y=m*S,C.z=y*W,u.push(C.x,C.y,C.z),d.push(0,S,0),b.x=W*.5+.5,b.y=X*.5*S+.5,p.push(b.x,b.y),g++}for(let F=0;F<i;F++){const z=A+F,q=D+F;x===!0?h.push(q,q+1,z):h.push(q+1,q,z),I+=3}l.addGroup(f,I,x===!0?1:2),f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new le(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fs extends le{constructor(t=1,e=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new fs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qa extends Ce{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const s=[],a=[];o(i),l(n),h(),this.setAttribute("position",new ee(s,3)),this.setAttribute("normal",new ee(s.slice(),3)),this.setAttribute("uv",new ee(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(E){const T=new R,x=new R,A=new R;for(let b=0;b<e.length;b+=3)p(e[b+0],T),p(e[b+1],x),p(e[b+2],A),c(T,x,A,E)}function c(E,T,x,A){const b=A+1,C=[];for(let I=0;I<=b;I++){C[I]=[];const y=E.clone().lerp(x,I/b),S=T.clone().lerp(x,I/b),D=b-I;for(let F=0;F<=D;F++)F===0&&I===b?C[I][F]=y:C[I][F]=y.clone().lerp(S,F/D)}for(let I=0;I<b;I++)for(let y=0;y<2*(b-I)-1;y++){const S=Math.floor(y/2);y%2===0?(d(C[I][S+1]),d(C[I+1][S]),d(C[I][S])):(d(C[I][S+1]),d(C[I+1][S+1]),d(C[I+1][S]))}}function l(E){const T=new R;for(let x=0;x<s.length;x+=3)T.x=s[x+0],T.y=s[x+1],T.z=s[x+2],T.normalize().multiplyScalar(E),s[x+0]=T.x,s[x+1]=T.y,s[x+2]=T.z}function h(){const E=new R;for(let T=0;T<s.length;T+=3){E.x=s[T+0],E.y=s[T+1],E.z=s[T+2];const x=m(E)/2/Math.PI+.5,A=f(E)/Math.PI+.5;a.push(x,1-A)}g(),u()}function u(){for(let E=0;E<a.length;E+=6){const T=a[E+0],x=a[E+2],A=a[E+4],b=Math.max(T,x,A),C=Math.min(T,x,A);b>.9&&C<.1&&(T<.2&&(a[E+0]+=1),x<.2&&(a[E+2]+=1),A<.2&&(a[E+4]+=1))}}function d(E){s.push(E.x,E.y,E.z)}function p(E,T){const x=E*3;T.x=t[x+0],T.y=t[x+1],T.z=t[x+2]}function g(){const E=new R,T=new R,x=new R,A=new R,b=new wt,C=new wt,I=new wt;for(let y=0,S=0;y<s.length;y+=9,S+=6){E.set(s[y+0],s[y+1],s[y+2]),T.set(s[y+3],s[y+4],s[y+5]),x.set(s[y+6],s[y+7],s[y+8]),b.set(a[S+0],a[S+1]),C.set(a[S+2],a[S+3]),I.set(a[S+4],a[S+5]),A.copy(E).add(T).add(x).divideScalar(3);const D=m(A);_(b,S+0,E,D),_(C,S+2,T,D),_(I,S+4,x,D)}}function _(E,T,x,A){A<0&&E.x===1&&(a[T]=E.x-1),x.x===0&&x.z===0&&(a[T]=A/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function f(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qa(t.vertices,t.indices,t.radius,t.details)}}class Fn extends Qa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Fn(t.radius,t.detail)}}class Je extends Ce{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=t/o,d=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const E=f*d-a;for(let T=0;T<l;T++){const x=T*u-s;g.push(x,-E,0),_.push(0,0,1),m.push(T/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let E=0;E<o;E++){const T=E+l*f,x=E+l*(f+1),A=E+1+l*(f+1),b=E+1+l*f;p.push(T,x,b),p.push(x,A,b)}this.setIndex(p),this.setAttribute("position",new ee(g,3)),this.setAttribute("normal",new ee(_,3)),this.setAttribute("uv",new ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Je(t.width,t.height,t.widthSegments,t.heightSegments)}}class ii extends Ce{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new R,d=new R,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const E=[],T=f/n;let x=0;f===0&&a===0?x=.5/e:f===n&&c===Math.PI&&(x=-.5/e);for(let A=0;A<=e;A++){const b=A/e;u.x=-t*Math.cos(i+b*s)*Math.sin(a+T*o),u.y=t*Math.cos(a+T*o),u.z=t*Math.sin(i+b*s)*Math.sin(a+T*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(b+x,1-T),E.push(l++)}h.push(E)}for(let f=0;f<n;f++)for(let E=0;E<e;E++){const T=h[f][E+1],x=h[f][E],A=h[f+1][E],b=h[f+1][E+1];(f!==0||a>0)&&p.push(T,x,b),(f!==n-1||c<Math.PI)&&p.push(x,A,b)}this.setIndex(p),this.setAttribute("position",new ee(g,3)),this.setAttribute("normal",new ee(_,3)),this.setAttribute("uv",new ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ii(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Gt extends zi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wc,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class vu extends zi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ph,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class xu extends zi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class lr extends ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Mu extends lr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Nt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const zr=new Qt,Wo=new R,Xo=new R;class to{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new wt(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new Qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ja,this._frameExtents=new wt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Wo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wo),Xo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Xo),e.updateMatrixWorld(),zr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zr,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class yu extends to{constructor(){super(new He(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=Li*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(n!==e.fov||i!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=i,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class qo extends lr{constructor(t,e,n=0,i=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.target=new ue,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new yu}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Yo=new Qt,Ki=new R,Hr=new R;class Su extends to{constructor(){super(new He(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new wt(4,2),this._viewportCount=6,this._viewports=[new se(2,1,1,1),new se(0,1,1,1),new se(3,1,1,1),new se(1,1,1,1),new se(3,0,1,1),new se(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Ki.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ki),Hr.copy(n.position),Hr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Hr),n.updateMatrixWorld(),i.makeTranslation(-Ki.x,-Ki.y,-Ki.z),Yo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yo,n.coordinateSystem,n.reversedDepth)}}class hr extends lr{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Su}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class eo extends tl{constructor(t=-1,e=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Eu extends to{constructor(){super(new eo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $o extends lr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.target=new ue,this.shadow=new Eu}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Tu extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class rl{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ko(r,t,e,n){const i=bu(n);switch(e){case Hc:return r*t;case Xa:return r*t/i.components*i.byteLength;case qa:return r*t/i.components*i.byteLength;case Vc:return r*t*2/i.components*i.byteLength;case Ya:return r*t*2/i.components*i.byteLength;case Gc:return r*t*3/i.components*i.byteLength;case rn:return r*t*4/i.components*i.byteLength;case $a:return r*t*4/i.components*i.byteLength;case Ys:case $s:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Ks:case js:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ha:case da:return Math.max(r,16)*Math.max(t,8)/4;case la:case ua:return Math.max(r,8)*Math.max(t,8)/2;case fa:case pa:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ma:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ga:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case _a:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case va:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case xa:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Ma:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case ya:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Sa:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Ea:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Ta:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case ba:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case wa:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Aa:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Ra:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Ca:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Pa:case Da:case Ia:return Math.ceil(r/4)*Math.ceil(t/4)*16;case La:case Ua:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Na:case Fa:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function bu(r){switch(r){case pn:case Oc:return{byteLength:1,components:1};case rs:case kc:case wn:return{byteLength:2,components:1};case Va:case Wa:return{byteLength:2,components:4};case ei:case Ga:case dn:return{byteLength:4,components:1};case Bc:case zc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ha}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ha);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function al(){let r=null,t=!1,e=null,n=null;function i(s,a){e(s,a),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function wu(r){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=r.createBuffer();r.bindBuffer(c,d),r.bufferData(c,l,h),o.onUploadCallback();let p;if(l instanceof Float32Array)p=r.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=r.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=r.HALF_FLOAT:p=r.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=r.SHORT;else if(l instanceof Uint32Array)p=r.UNSIGNED_INT;else if(l instanceof Int32Array)p=r.INT;else if(l instanceof Int8Array)p=r.BYTE;else if(l instanceof Uint8Array)p=r.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(r.bindBuffer(l,o),u.length===0)r.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const _=u[p];r.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(r.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:s,update:a}}var Au=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ru=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Du=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Iu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Uu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Fu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ou=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ku=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,zu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Hu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Gu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,$u=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ku=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ju=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ju=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Qu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,td=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ed=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,id="gl_FragColor = linearToOutputTexel( gl_FragColor );",sd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ad=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,od=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,cd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ld=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ud=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,md=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_d=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,xd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Md=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ed=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Td=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,wd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ad=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Rd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Id=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ld=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ud=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Fd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Od=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Bd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Hd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Vd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Xd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$d=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Kd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,jd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ef=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,nf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,af=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,of=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,hf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,df=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ff=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_f=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ef=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Af=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Df=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,If=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Uf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ff=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Gf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$f=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Kf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Jf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ep=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,np=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ip=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ap=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ht={alphahash_fragment:Au,alphahash_pars_fragment:Ru,alphamap_fragment:Cu,alphamap_pars_fragment:Pu,alphatest_fragment:Du,alphatest_pars_fragment:Iu,aomap_fragment:Lu,aomap_pars_fragment:Uu,batching_pars_vertex:Nu,batching_vertex:Fu,begin_vertex:Ou,beginnormal_vertex:ku,bsdfs:Bu,iridescence_fragment:zu,bumpmap_pars_fragment:Hu,clipping_planes_fragment:Gu,clipping_planes_pars_fragment:Vu,clipping_planes_pars_vertex:Wu,clipping_planes_vertex:Xu,color_fragment:qu,color_pars_fragment:Yu,color_pars_vertex:$u,color_vertex:Ku,common:ju,cube_uv_reflection_fragment:Zu,defaultnormal_vertex:Ju,displacementmap_pars_vertex:Qu,displacementmap_vertex:td,emissivemap_fragment:ed,emissivemap_pars_fragment:nd,colorspace_fragment:id,colorspace_pars_fragment:sd,envmap_fragment:rd,envmap_common_pars_fragment:ad,envmap_pars_fragment:od,envmap_pars_vertex:cd,envmap_physical_pars_fragment:xd,envmap_vertex:ld,fog_vertex:hd,fog_pars_vertex:ud,fog_fragment:dd,fog_pars_fragment:fd,gradientmap_pars_fragment:pd,lightmap_pars_fragment:md,lights_lambert_fragment:gd,lights_lambert_pars_fragment:_d,lights_pars_begin:vd,lights_toon_fragment:Md,lights_toon_pars_fragment:yd,lights_phong_fragment:Sd,lights_phong_pars_fragment:Ed,lights_physical_fragment:Td,lights_physical_pars_fragment:bd,lights_fragment_begin:wd,lights_fragment_maps:Ad,lights_fragment_end:Rd,logdepthbuf_fragment:Cd,logdepthbuf_pars_fragment:Pd,logdepthbuf_pars_vertex:Dd,logdepthbuf_vertex:Id,map_fragment:Ld,map_pars_fragment:Ud,map_particle_fragment:Nd,map_particle_pars_fragment:Fd,metalnessmap_fragment:Od,metalnessmap_pars_fragment:kd,morphinstance_vertex:Bd,morphcolor_vertex:zd,morphnormal_vertex:Hd,morphtarget_pars_vertex:Gd,morphtarget_vertex:Vd,normal_fragment_begin:Wd,normal_fragment_maps:Xd,normal_pars_fragment:qd,normal_pars_vertex:Yd,normal_vertex:$d,normalmap_pars_fragment:Kd,clearcoat_normal_fragment_begin:jd,clearcoat_normal_fragment_maps:Zd,clearcoat_pars_fragment:Jd,iridescence_pars_fragment:Qd,opaque_fragment:tf,packing:ef,premultiplied_alpha_fragment:nf,project_vertex:sf,dithering_fragment:rf,dithering_pars_fragment:af,roughnessmap_fragment:of,roughnessmap_pars_fragment:cf,shadowmap_pars_fragment:lf,shadowmap_pars_vertex:hf,shadowmap_vertex:uf,shadowmask_pars_fragment:df,skinbase_vertex:ff,skinning_pars_vertex:pf,skinning_vertex:mf,skinnormal_vertex:gf,specularmap_fragment:_f,specularmap_pars_fragment:vf,tonemapping_fragment:xf,tonemapping_pars_fragment:Mf,transmission_fragment:yf,transmission_pars_fragment:Sf,uv_pars_fragment:Ef,uv_pars_vertex:Tf,uv_vertex:bf,worldpos_vertex:wf,background_vert:Af,background_frag:Rf,backgroundCube_vert:Cf,backgroundCube_frag:Pf,cube_vert:Df,cube_frag:If,depth_vert:Lf,depth_frag:Uf,distanceRGBA_vert:Nf,distanceRGBA_frag:Ff,equirect_vert:Of,equirect_frag:kf,linedashed_vert:Bf,linedashed_frag:zf,meshbasic_vert:Hf,meshbasic_frag:Gf,meshlambert_vert:Vf,meshlambert_frag:Wf,meshmatcap_vert:Xf,meshmatcap_frag:qf,meshnormal_vert:Yf,meshnormal_frag:$f,meshphong_vert:Kf,meshphong_frag:jf,meshphysical_vert:Zf,meshphysical_frag:Jf,meshtoon_vert:Qf,meshtoon_frag:tp,points_vert:ep,points_frag:np,shadow_vert:ip,shadow_frag:sp,sprite_vert:rp,sprite_frag:ap},rt={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},ln={basic:{uniforms:ke([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:ke([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:ke([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:ke([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:ke([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:ke([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:ke([rt.points,rt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:ke([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:ke([rt.common,rt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:ke([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:ke([rt.sprite,rt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:ke([rt.common,rt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:ke([rt.lights,rt.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};ln.physical={uniforms:ke([ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};const zs={r:0,b:0,g:0},Yn=new mn,op=new Qt;function cp(r,t,e,n,i,s,a){const o=new Nt(0);let c=s===!0?0:1,l,h,u=null,d=0,p=null;function g(T){let x=T.isScene===!0?T.background:null;return x&&x.isTexture&&(x=(T.backgroundBlurriness>0?e:t).get(x)),x}function _(T){let x=!1;const A=g(T);A===null?f(o,c):A&&A.isColor&&(f(A,1),x=!0);const b=r.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(T,x){const A=g(x);A&&(A.isCubeTexture||A.mapping===cr)?(h===void 0&&(h=new K(new Ct(1,1,1),new Ue({name:"BackgroundCubeMaterial",uniforms:Ui(ln.backgroundCube.uniforms),vertexShader:ln.backgroundCube.vertexShader,fragmentShader:ln.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Yn.copy(x.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(op.makeRotationFromEuler(Yn)),h.material.toneMapped=Kt.getTransfer(A.colorSpace)!==ie,(u!==A||d!==A.version||p!==r.toneMapping)&&(h.material.needsUpdate=!0,u=A,d=A.version,p=r.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new K(new Je(2,2),new Ue({name:"BackgroundMaterial",uniforms:Ui(ln.background.uniforms),vertexShader:ln.background.vertexShader,fragmentShader:ln.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Kt.getTransfer(A.colorSpace)!==ie,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||d!==A.version||p!==r.toneMapping)&&(l.material.needsUpdate=!0,u=A,d=A.version,p=r.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function f(T,x){T.getRGB(zs,Qc(r)),n.buffers.color.setClear(zs.r,zs.g,zs.b,x,a)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,x=1){o.set(T),c=x,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,f(o,c)},render:_,addToRenderList:m,dispose:E}}function lp(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null);let s=i,a=!1;function o(S,D,F,z,q){let W=!1;const X=u(z,F,D);s!==X&&(s=X,l(s.object)),W=p(S,z,F,q),W&&g(S,z,F,q),q!==null&&t.update(q,r.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,x(S,D,F,z),q!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function c(){return r.createVertexArray()}function l(S){return r.bindVertexArray(S)}function h(S){return r.deleteVertexArray(S)}function u(S,D,F){const z=F.wireframe===!0;let q=n[S.id];q===void 0&&(q={},n[S.id]=q);let W=q[D.id];W===void 0&&(W={},q[D.id]=W);let X=W[z];return X===void 0&&(X=d(c()),W[z]=X),X}function d(S){const D=[],F=[],z=[];for(let q=0;q<e;q++)D[q]=0,F[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:z,object:S,attributes:{},index:null}}function p(S,D,F,z){const q=s.attributes,W=D.attributes;let X=0;const Z=F.getAttributes();for(const H in Z)if(Z[H].location>=0){const ht=q[H];let Et=W[H];if(Et===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(Et=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(Et=S.instanceColor)),ht===void 0||ht.attribute!==Et||Et&&ht.data!==Et.data)return!0;X++}return s.attributesNum!==X||s.index!==z}function g(S,D,F,z){const q={},W=D.attributes;let X=0;const Z=F.getAttributes();for(const H in Z)if(Z[H].location>=0){let ht=W[H];ht===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(ht=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(ht=S.instanceColor));const Et={};Et.attribute=ht,ht&&ht.data&&(Et.data=ht.data),q[H]=Et,X++}s.attributes=q,s.attributesNum=X,s.index=z}function _(){const S=s.newAttributes;for(let D=0,F=S.length;D<F;D++)S[D]=0}function m(S){f(S,0)}function f(S,D){const F=s.newAttributes,z=s.enabledAttributes,q=s.attributeDivisors;F[S]=1,z[S]===0&&(r.enableVertexAttribArray(S),z[S]=1),q[S]!==D&&(r.vertexAttribDivisor(S,D),q[S]=D)}function E(){const S=s.newAttributes,D=s.enabledAttributes;for(let F=0,z=D.length;F<z;F++)D[F]!==S[F]&&(r.disableVertexAttribArray(F),D[F]=0)}function T(S,D,F,z,q,W,X){X===!0?r.vertexAttribIPointer(S,D,F,q,W):r.vertexAttribPointer(S,D,F,z,q,W)}function x(S,D,F,z){_();const q=z.attributes,W=F.getAttributes(),X=D.defaultAttributeValues;for(const Z in W){const H=W[Z];if(H.location>=0){let at=q[Z];if(at===void 0&&(Z==="instanceMatrix"&&S.instanceMatrix&&(at=S.instanceMatrix),Z==="instanceColor"&&S.instanceColor&&(at=S.instanceColor)),at!==void 0){const ht=at.normalized,Et=at.itemSize,Vt=t.get(at);if(Vt===void 0)continue;const ae=Vt.buffer,de=Vt.type,jt=Vt.bytesPerElement,Y=de===r.INT||de===r.UNSIGNED_INT||at.gpuType===Ga;if(at.isInterleavedBufferAttribute){const J=at.data,ft=J.stride,Lt=at.offset;if(J.isInstancedInterleavedBuffer){for(let St=0;St<H.locationSize;St++)f(H.location+St,J.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let St=0;St<H.locationSize;St++)m(H.location+St);r.bindBuffer(r.ARRAY_BUFFER,ae);for(let St=0;St<H.locationSize;St++)T(H.location+St,Et/H.locationSize,de,ht,ft*jt,(Lt+Et/H.locationSize*St)*jt,Y)}else{if(at.isInstancedBufferAttribute){for(let J=0;J<H.locationSize;J++)f(H.location+J,at.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let J=0;J<H.locationSize;J++)m(H.location+J);r.bindBuffer(r.ARRAY_BUFFER,ae);for(let J=0;J<H.locationSize;J++)T(H.location+J,Et/H.locationSize,de,ht,Et*jt,Et/H.locationSize*J*jt,Y)}}else if(X!==void 0){const ht=X[Z];if(ht!==void 0)switch(ht.length){case 2:r.vertexAttrib2fv(H.location,ht);break;case 3:r.vertexAttrib3fv(H.location,ht);break;case 4:r.vertexAttrib4fv(H.location,ht);break;default:r.vertexAttrib1fv(H.location,ht)}}}}E()}function A(){I();for(const S in n){const D=n[S];for(const F in D){const z=D[F];for(const q in z)h(z[q].object),delete z[q];delete D[F]}delete n[S]}}function b(S){if(n[S.id]===void 0)return;const D=n[S.id];for(const F in D){const z=D[F];for(const q in z)h(z[q].object),delete z[q];delete D[F]}delete n[S.id]}function C(S){for(const D in n){const F=n[D];if(F[S.id]===void 0)continue;const z=F[S.id];for(const q in z)h(z[q].object),delete z[q];delete F[S.id]}}function I(){y(),a=!0,s!==i&&(s=i,l(s.object))}function y(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:I,resetDefaultState:y,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function hp(r,t,e){let n;function i(l){n=l}function s(l,h){r.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(r.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function c(l,h,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function up(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(C){return!(C!==rn&&n.convert(C)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const I=C===wn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==pn&&n.convert(C)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==dn&&!I)}function c(C){if(C==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),f=r.getParameter(r.MAX_VERTEX_ATTRIBS),E=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),T=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,b=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:T,maxFragmentUniforms:x,vertexTextures:A,maxSamples:b}}function dp(r){const t=this;let e=null,n=0,i=!1,s=!1;const a=new Kn,o=new Bt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||i;return i=d,n=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=r.get(u);if(!i||g===null||g.length===0||s&&!m)s?h(null):l();else{const E=s?0:n,T=E*4;let x=f.clippingState||null;c.value=x,x=h(g,d,T,p);for(let A=0;A!==T;++A)x[A]=e[A];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const f=p+_*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let T=0,x=p;T!==_;++T,x+=4)a.copy(u[T]).applyMatrix4(E,o),a.normal.toArray(m,x),m[x+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function fp(r){let t=new WeakMap;function e(a,o){return o===aa?a.mapping=Ci:o===oa&&(a.mapping=Pi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===aa||o===oa)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new lu(c.height);return l.fromEquirectangularTexture(r,a),t.set(a,l),a.addEventListener("dispose",i),e(l.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const bi=4,jo=[.125,.215,.35,.446,.526,.582],Jn=20,Gr=new eo,Zo=new Nt;let Vr=null,Wr=0,Xr=0,qr=!1;const jn=(1+Math.sqrt(5))/2,Mi=1/jn,Jo=[new R(-jn,Mi,0),new R(jn,Mi,0),new R(-Mi,0,jn),new R(Mi,0,jn),new R(0,jn,-Mi),new R(0,jn,Mi),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],pp=new R;class Qo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,s={}){const{size:a=256,position:o=pp}=s;Vr=this._renderer.getRenderTarget(),Wr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,i,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Vr,Wr,Xr),this._renderer.xr.enabled=qr,t.scissorTest=!1,Hs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ci||t.mapping===Pi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Vr=this._renderer.getRenderTarget(),Wr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:un,minFilter:un,generateMipmaps:!1,type:wn,format:rn,colorSpace:Ii,depthBuffer:!1},i=tc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tc(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mp(s)),this._blurMaterial=gp(s,t,e)}return i}_compileMaterial(t){const e=new K(this._lodPlanes[0],t);this._renderer.compile(e,Gr)}_sceneToCubeUV(t,e,n,i,s){const c=new He(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(Zo),u.toneMapping=On,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));const _=new ni({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1}),m=new K(new Ct,_);let f=!1;const E=t.background;E?E.isColor&&(_.color.copy(E),t.background=null,f=!0):(_.color.copy(Zo),f=!0);for(let T=0;T<6;T++){const x=T%3;x===0?(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[T],s.y,s.z)):x===1?(c.up.set(0,0,l[T]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[T],s.z)):(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[T]));const A=this._cubeSize;Hs(i,x*A,T>2?A:0,A,A),u.setRenderTarget(i),f&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=E}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ci||t.mapping===Pi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=nc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ec());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new K(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;Hs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Gr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Jo[(i-s-1)%Jo.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",s),this._halfBlur(a,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new K(this._lodPlanes[i],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Jn-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):Jn;m>Jn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Jn}`);const f=[];let E=0;for(let C=0;C<Jn;++C){const I=C/_,y=Math.exp(-I*I/2);f.push(y),C===0?E+=y:C<m&&(E+=2*y)}for(let C=0;C<f.length;C++)f[C]=f[C]/E;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:T}=this;d.dTheta.value=g,d.mipInt.value=T-n;const x=this._sizeLods[i],A=3*x*(i>T-bi?i-T+bi:0),b=4*(this._cubeSize-x);Hs(e,A,b,3*x,2*x),c.setRenderTarget(e),c.render(u,Gr)}}function mp(r){const t=[],e=[],n=[];let i=r;const s=r-bi+1+jo.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let c=1/o;a>r-bi?c=jo[a-r+bi-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,E=new Float32Array(_*g*p),T=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let b=0;b<p;b++){const C=b%3*2/3-1,I=b>2?0:-1,y=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];E.set(y,_*g*b),T.set(d,m*g*b);const S=[b,b,b,b,b,b];x.set(S,f*g*b)}const A=new Ce;A.setAttribute("position",new Pe(E,_)),A.setAttribute("uv",new Pe(T,m)),A.setAttribute("faceIndex",new Pe(x,f)),t.push(A),i>bi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function tc(r,t,e){const n=new an(r,t,e);return n.texture.mapping=cr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Hs(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function gp(r,t,e){const n=new Float32Array(Jn),i=new R(0,1,0);return new Ue({name:"SphericalGaussianBlur",defines:{n:Jn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function ec(){return new Ue({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function nc(){return new Ue({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function no(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function _p(r){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===aa||c===oa,h=c===Ci||c===Pi;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Qo(r)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return l&&p&&p.height>0||h&&p&&i(p)?(e===null&&(e=new Qo(r)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function i(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function vp(r){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&ls("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function xp(r,t,e,n){const i={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];const p=s.get(d);p&&(t.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const p in d)t.update(d[p],r.ARRAY_BUFFER)}function l(u){const d=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const E=p.array;_=p.version;for(let T=0,x=E.length;T<x;T+=3){const A=E[T+0],b=E[T+1],C=E[T+2];d.push(A,b,b,C,C,A)}}else if(g!==void 0){const E=g.array;_=g.version;for(let T=0,x=E.length/3-1;T<x;T+=3){const A=T+0,b=T+1,C=T+2;d.push(A,b,b,C,C,A)}}else return;const m=new(qc(d)?Jc:Zc)(d,1);m.version=_;const f=s.get(u);f&&t.remove(f),s.set(u,m)}function h(u){const d=s.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return s.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Mp(r,t,e){let n;function i(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,p){r.drawElements(n,p,s,d*a),e.update(p,n,1)}function l(d,p,g){g!==0&&(r.drawElementsInstanced(n,p,s,d*a,g),e.update(p,n,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function u(d,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,d,0,_,0,g);let f=0;for(let E=0;E<g;E++)f+=p[E]*_[E];e.update(f,n,1)}}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function yp(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Sp(r,t,e){const n=new WeakMap,i=new se;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let S=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var p=S;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let A=o.attributes.position.count*x,b=1;A>t.maxTextureSize&&(b=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const C=new Float32Array(A*b*4*u),I=new Yc(C,A,b,u);I.type=dn,I.needsUpdate=!0;const y=x*4;for(let D=0;D<u;D++){const F=f[D],z=E[D],q=T[D],W=A*b*4*D;for(let X=0;X<F.count;X++){const Z=X*y;g===!0&&(i.fromBufferAttribute(F,X),C[W+Z+0]=i.x,C[W+Z+1]=i.y,C[W+Z+2]=i.z,C[W+Z+3]=0),_===!0&&(i.fromBufferAttribute(z,X),C[W+Z+4]=i.x,C[W+Z+5]=i.y,C[W+Z+6]=i.z,C[W+Z+7]=0),m===!0&&(i.fromBufferAttribute(q,X),C[W+Z+8]=i.x,C[W+Z+9]=i.y,C[W+Z+10]=i.z,C[W+Z+11]=q.itemSize===4?i.w:1)}}d={count:u,texture:I,size:new wt(A,b)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(r,"morphTargetBaseInfluence",_),c.getUniforms().setValue(r,"morphTargetInfluences",l)}c.getUniforms().setValue(r,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function Ep(r,t,e,n){let i=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),i.get(c)!==l&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function a(){i=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const ol=new Ne,ic=new il(1,1),cl=new Yc,ll=new Yh,hl=new el,sc=[],rc=[],ac=new Float32Array(16),oc=new Float32Array(9),cc=new Float32Array(4);function Hi(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=sc[i];if(s===void 0&&(s=new Float32Array(i),sc[i]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function Te(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function be(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function ur(r,t){let e=rc[t];e===void 0&&(e=new Int32Array(t),rc[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function Tp(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function bp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;r.uniform2fv(this.addr,t),be(e,t)}}function wp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;r.uniform3fv(this.addr,t),be(e,t)}}function Ap(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;r.uniform4fv(this.addr,t),be(e,t)}}function Rp(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Te(e,n))return;cc.set(n),r.uniformMatrix2fv(this.addr,!1,cc),be(e,n)}}function Cp(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Te(e,n))return;oc.set(n),r.uniformMatrix3fv(this.addr,!1,oc),be(e,n)}}function Pp(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Te(e,n))return;ac.set(n),r.uniformMatrix4fv(this.addr,!1,ac),be(e,n)}}function Dp(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function Ip(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;r.uniform2iv(this.addr,t),be(e,t)}}function Lp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;r.uniform3iv(this.addr,t),be(e,t)}}function Up(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;r.uniform4iv(this.addr,t),be(e,t)}}function Np(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function Fp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;r.uniform2uiv(this.addr,t),be(e,t)}}function Op(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;r.uniform3uiv(this.addr,t),be(e,t)}}function kp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;r.uniform4uiv(this.addr,t),be(e,t)}}function Bp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(ic.compareFunction=Xc,s=ic):s=ol,e.setTexture2D(t||s,i)}function zp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ll,i)}function Hp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||hl,i)}function Gp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||cl,i)}function Vp(r){switch(r){case 5126:return Tp;case 35664:return bp;case 35665:return wp;case 35666:return Ap;case 35674:return Rp;case 35675:return Cp;case 35676:return Pp;case 5124:case 35670:return Dp;case 35667:case 35671:return Ip;case 35668:case 35672:return Lp;case 35669:case 35673:return Up;case 5125:return Np;case 36294:return Fp;case 36295:return Op;case 36296:return kp;case 35678:case 36198:case 36298:case 36306:case 35682:return Bp;case 35679:case 36299:case 36307:return zp;case 35680:case 36300:case 36308:case 36293:return Hp;case 36289:case 36303:case 36311:case 36292:return Gp}}function Wp(r,t){r.uniform1fv(this.addr,t)}function Xp(r,t){const e=Hi(t,this.size,2);r.uniform2fv(this.addr,e)}function qp(r,t){const e=Hi(t,this.size,3);r.uniform3fv(this.addr,e)}function Yp(r,t){const e=Hi(t,this.size,4);r.uniform4fv(this.addr,e)}function $p(r,t){const e=Hi(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function Kp(r,t){const e=Hi(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function jp(r,t){const e=Hi(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function Zp(r,t){r.uniform1iv(this.addr,t)}function Jp(r,t){r.uniform2iv(this.addr,t)}function Qp(r,t){r.uniform3iv(this.addr,t)}function tm(r,t){r.uniform4iv(this.addr,t)}function em(r,t){r.uniform1uiv(this.addr,t)}function nm(r,t){r.uniform2uiv(this.addr,t)}function im(r,t){r.uniform3uiv(this.addr,t)}function sm(r,t){r.uniform4uiv(this.addr,t)}function rm(r,t,e){const n=this.cache,i=t.length,s=ur(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||ol,s[a])}function am(r,t,e){const n=this.cache,i=t.length,s=ur(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||ll,s[a])}function om(r,t,e){const n=this.cache,i=t.length,s=ur(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||hl,s[a])}function cm(r,t,e){const n=this.cache,i=t.length,s=ur(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||cl,s[a])}function lm(r){switch(r){case 5126:return Wp;case 35664:return Xp;case 35665:return qp;case 35666:return Yp;case 35674:return $p;case 35675:return Kp;case 35676:return jp;case 5124:case 35670:return Zp;case 35667:case 35671:return Jp;case 35668:case 35672:return Qp;case 35669:case 35673:return tm;case 5125:return em;case 36294:return nm;case 36295:return im;case 36296:return sm;case 35678:case 36198:case 36298:case 36306:case 35682:return rm;case 35679:case 36299:case 36307:return am;case 35680:case 36300:case 36308:case 36293:return om;case 36289:case 36303:case 36311:case 36292:return cm}}class hm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Vp(e.type)}}class um{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=lm(e.type)}}class dm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(t,e[o.id],n)}}}const Yr=/(\w+)(\])?(\[|\.)?/g;function lc(r,t){r.seq.push(t),r.map[t.id]=t}function fm(r,t,e){const n=r.name,i=n.length;for(Yr.lastIndex=0;;){const s=Yr.exec(n),a=Yr.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){lc(e,l===void 0?new hm(o,r,t):new um(o,r,t));break}else{let u=e.map[o];u===void 0&&(u=new dm(o),lc(e,u)),e=u}}}class Zs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),a=t.getUniformLocation(e,s.name);fm(s,a,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function hc(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const pm=37297;let mm=0;function gm(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const uc=new Bt;function _m(r){Kt._getMatrix(uc,Kt.workingColorSpace,r);const t=`mat3( ${uc.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(r)){case nr:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function dc(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+gm(r.getShaderSource(t),o)}else return s}function vm(r,t){const e=_m(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function xm(r,t){let e;switch(t){case oh:e="Linear";break;case ch:e="Reinhard";break;case lh:e="Cineon";break;case Nc:e="ACESFilmic";break;case uh:e="AgX";break;case dh:e="Neutral";break;case hh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Gs=new R;function Mm(){Kt.getLuminanceCoefficients(Gs);const r=Gs.x.toFixed(4),t=Gs.y.toFixed(4),e=Gs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ym(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(es).join(`
`)}function Sm(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Em(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function es(r){return r!==""}function fc(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function pc(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Tm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ba(r){return r.replace(Tm,wm)}const bm=new Map;function wm(r,t){let e=Ht[t];if(e===void 0){const n=bm.get(t);if(n!==void 0)e=Ht[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ba(e)}const Am=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mc(r){return r.replace(Am,Rm)}function Rm(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function gc(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Cm(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Ic?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Lc?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===En&&(t="SHADOWMAP_TYPE_VSM"),t}function Pm(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ci:case Pi:t="ENVMAP_TYPE_CUBE";break;case cr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dm(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Pi:t="ENVMAP_MODE_REFRACTION";break}return t}function Im(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Uc:t="ENVMAP_BLENDING_MULTIPLY";break;case rh:t="ENVMAP_BLENDING_MIX";break;case ah:t="ENVMAP_BLENDING_ADD";break}return t}function Lm(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Um(r,t,e,n){const i=r.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Cm(e),l=Pm(e),h=Dm(e),u=Im(e),d=Lm(e),p=ym(e),g=Sm(s),_=i.createProgram();let m,f,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(es).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(es).join(`
`),f.length>0&&(f+=`
`)):(m=[gc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(es).join(`
`),f=[gc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==On?"#define TONE_MAPPING":"",e.toneMapping!==On?Ht.tonemapping_pars_fragment:"",e.toneMapping!==On?xm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,vm("linearToOutputTexel",e.outputColorSpace),Mm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(es).join(`
`)),a=Ba(a),a=fc(a,e),a=pc(a,e),o=Ba(o),o=fc(o,e),o=pc(o,e),a=mc(a),o=mc(o),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Mo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Mo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const T=E+m+a,x=E+f+o,A=hc(i,i.VERTEX_SHADER,T),b=hc(i,i.FRAGMENT_SHADER,x);i.attachShader(_,A),i.attachShader(_,b),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function C(D){if(r.debug.checkShaderErrors){const F=i.getProgramInfoLog(_)||"",z=i.getShaderInfoLog(A)||"",q=i.getShaderInfoLog(b)||"",W=F.trim(),X=z.trim(),Z=q.trim();let H=!0,at=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(H=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,A,b);else{const ht=dc(i,A,"vertex"),Et=dc(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+W+`
`+ht+`
`+Et)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(X===""||Z==="")&&(at=!1);at&&(D.diagnostics={runnable:H,programLog:W,vertexShader:{log:X,prefix:m},fragmentShader:{log:Z,prefix:f}})}i.deleteShader(A),i.deleteShader(b),I=new Zs(i,_),y=Em(i,_)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let y;this.getAttributes=function(){return y===void 0&&C(this),y};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(_,pm)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=mm++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=b,this}let Nm=0;class Fm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Om(t),e.set(t,n)),n}}class Om{constructor(t){this.id=Nm++,this.code=t,this.usedTimes=0}}function km(r,t,e,n,i,s,a){const o=new Kc,c=new Fm,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,S,D,F,z){const q=F.fog,W=z.geometry,X=y.isMeshStandardMaterial?F.environment:null,Z=(y.isMeshStandardMaterial?e:t).get(y.envMap||X),H=Z&&Z.mapping===cr?Z.image.height:null,at=g[y.type];y.precision!==null&&(p=i.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const ht=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Et=ht!==void 0?ht.length:0;let Vt=0;W.morphAttributes.position!==void 0&&(Vt=1),W.morphAttributes.normal!==void 0&&(Vt=2),W.morphAttributes.color!==void 0&&(Vt=3);let ae,de,jt,Y;if(at){const Zt=ln[at];ae=Zt.vertexShader,de=Zt.fragmentShader}else ae=y.vertexShader,de=y.fragmentShader,c.update(y),jt=c.getVertexShaderID(y),Y=c.getFragmentShaderID(y);const J=r.getRenderTarget(),ft=r.state.buffers.depth.getReversed(),Lt=z.isInstancedMesh===!0,St=z.isBatchedMesh===!0,qt=!!y.map,De=!!y.matcap,P=!!Z,fe=!!y.aoMap,Ft=!!y.lightMap,Dt=!!y.bumpMap,gt=!!y.normalMap,pe=!!y.displacementMap,_t=!!y.emissiveMap,zt=!!y.metalnessMap,we=!!y.roughnessMap,xe=y.anisotropy>0,w=y.clearcoat>0,v=y.dispersion>0,O=y.iridescence>0,V=y.sheen>0,j=y.transmission>0,G=xe&&!!y.anisotropyMap,yt=w&&!!y.clearcoatMap,it=w&&!!y.clearcoatNormalMap,vt=w&&!!y.clearcoatRoughnessMap,xt=O&&!!y.iridescenceMap,et=O&&!!y.iridescenceThicknessMap,lt=V&&!!y.sheenColorMap,Pt=V&&!!y.sheenRoughnessMap,Mt=!!y.specularMap,ot=!!y.specularColorMap,kt=!!y.specularIntensityMap,L=j&&!!y.transmissionMap,nt=j&&!!y.thicknessMap,st=!!y.gradientMap,dt=!!y.alphaMap,Q=y.alphaTest>0,$=!!y.alphaHash,mt=!!y.extensions;let Ut=On;y.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Ut=r.toneMapping);const oe={shaderID:at,shaderType:y.type,shaderName:y.name,vertexShader:ae,fragmentShader:de,defines:y.defines,customVertexShaderID:jt,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:St,batchingColor:St&&z._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&z.instanceColor!==null,instancingMorph:Lt&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?r.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ii,alphaToCoverage:!!y.alphaToCoverage,map:qt,matcap:De,envMap:P,envMapMode:P&&Z.mapping,envMapCubeUVHeight:H,aoMap:fe,lightMap:Ft,bumpMap:Dt,normalMap:gt,displacementMap:d&&pe,emissiveMap:_t,normalMapObjectSpace:gt&&y.normalMapType===gh,normalMapTangentSpace:gt&&y.normalMapType===Wc,metalnessMap:zt,roughnessMap:we,anisotropy:xe,anisotropyMap:G,clearcoat:w,clearcoatMap:yt,clearcoatNormalMap:it,clearcoatRoughnessMap:vt,dispersion:v,iridescence:O,iridescenceMap:xt,iridescenceThicknessMap:et,sheen:V,sheenColorMap:lt,sheenRoughnessMap:Pt,specularMap:Mt,specularColorMap:ot,specularIntensityMap:kt,transmission:j,transmissionMap:L,thicknessMap:nt,gradientMap:st,opaque:y.transparent===!1&&y.blending===wi&&y.alphaToCoverage===!1,alphaMap:dt,alphaTest:Q,alphaHash:$,combine:y.combine,mapUv:qt&&_(y.map.channel),aoMapUv:fe&&_(y.aoMap.channel),lightMapUv:Ft&&_(y.lightMap.channel),bumpMapUv:Dt&&_(y.bumpMap.channel),normalMapUv:gt&&_(y.normalMap.channel),displacementMapUv:pe&&_(y.displacementMap.channel),emissiveMapUv:_t&&_(y.emissiveMap.channel),metalnessMapUv:zt&&_(y.metalnessMap.channel),roughnessMapUv:we&&_(y.roughnessMap.channel),anisotropyMapUv:G&&_(y.anisotropyMap.channel),clearcoatMapUv:yt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:it&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:et&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&_(y.sheenRoughnessMap.channel),specularMapUv:Mt&&_(y.specularMap.channel),specularColorMapUv:ot&&_(y.specularColorMap.channel),specularIntensityMapUv:kt&&_(y.specularIntensityMap.channel),transmissionMapUv:L&&_(y.transmissionMap.channel),thicknessMapUv:nt&&_(y.thicknessMap.channel),alphaMapUv:dt&&_(y.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(gt||xe),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!W.attributes.uv&&(qt||dt),fog:!!q,useFog:y.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ft,skinning:z.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Et,morphTextureStride:Vt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:r.shadowMap.enabled&&D.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ut,decodeVideoTexture:qt&&y.map.isVideoTexture===!0&&Kt.getTransfer(y.map.colorSpace)===ie,decodeVideoTextureEmissive:_t&&y.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(y.emissiveMap.colorSpace)===ie,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Ee,flipSided:y.side===Ge,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:mt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&y.extensions.multiDraw===!0||St)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return oe.vertexUv1s=l.has(1),oe.vertexUv2s=l.has(2),oe.vertexUv3s=l.has(3),l.clear(),oe}function f(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)S.push(D),S.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(E(S,y),T(S,y),S.push(r.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function E(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function T(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),y.push(o.mask)}function x(y){const S=g[y.type];let D;if(S){const F=ln[S];D=rr.clone(F.uniforms)}else D=y.uniforms;return D}function A(y,S){let D;for(let F=0,z=h.length;F<z;F++){const q=h[F];if(q.cacheKey===S){D=q,++D.usedTimes;break}}return D===void 0&&(D=new Um(r,S,y,s),h.push(D)),D}function b(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function C(y){c.remove(y)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:A,releaseProgram:b,releaseShaderCache:C,programs:h,dispose:I}}function Bm(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,c){r.get(a)[o]=c}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function zm(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function _c(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function vc(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function a(u,d,p,g,_,m){let f=r[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},r[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,d,p,g,_,m){const f=a(u,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?i.push(f):e.push(f)}function c(u,d,p,g,_,m){const f=a(u,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?i.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||zm),n.length>1&&n.sort(d||_c),i.length>1&&i.sort(d||_c)}function h(){for(let u=t,d=r.length;u<d;u++){const p=r[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:o,unshift:c,finish:h,sort:l}}function Hm(){let r=new WeakMap;function t(n,i){const s=r.get(n);let a;return s===void 0?(a=new vc,r.set(n,[a])):i>=s.length?(a=new vc,s.push(a)):a=s[i],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function Gm(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Nt};break;case"SpotLight":e={position:new R,direction:new R,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new R,halfWidth:new R,halfHeight:new R};break}return r[t.id]=e,e}}}function Vm(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let Wm=0;function Xm(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function qm(r){const t=new Gm,e=Vm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);const i=new R,s=new Qt,a=new Qt;function o(l){let h=0,u=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,E=0,T=0,x=0,A=0,b=0,C=0;l.sort(Xm);for(let y=0,S=l.length;y<S;y++){const D=l[y],F=D.color,z=D.intensity,q=D.distance,W=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*z,u+=F.g*z,d+=F.b*z;else if(D.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(D.sh.coefficients[X],z);C++}else if(D.isDirectionalLight){const X=t.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Z=D.shadow,H=e.get(D);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.directionalShadow[p]=H,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=D.shadow.matrix,E++}n.directional[p]=X,p++}else if(D.isSpotLight){const X=t.get(D);X.position.setFromMatrixPosition(D.matrixWorld),X.color.copy(F).multiplyScalar(z),X.distance=q,X.coneCos=Math.cos(D.angle),X.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),X.decay=D.decay,n.spot[_]=X;const Z=D.shadow;if(D.map&&(n.spotLightMap[A]=D.map,A++,Z.updateMatrices(D),D.castShadow&&b++),n.spotLightMatrix[_]=Z.matrix,D.castShadow){const H=e.get(D);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=W,x++}_++}else if(D.isRectAreaLight){const X=t.get(D);X.color.copy(F).multiplyScalar(z),X.halfWidth.set(D.width*.5,0,0),X.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=X,m++}else if(D.isPointLight){const X=t.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity),X.distance=D.distance,X.decay=D.decay,D.castShadow){const Z=D.shadow,H=e.get(D);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,H.shadowCameraNear=Z.camera.near,H.shadowCameraFar=Z.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=D.shadow.matrix,T++}n.point[g]=X,g++}else if(D.isHemisphereLight){const X=t.get(D);X.skyColor.copy(D.color).multiplyScalar(z),X.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[f]=X,f++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=rt.LTC_FLOAT_1,n.rectAreaLTC2=rt.LTC_FLOAT_2):(n.rectAreaLTC1=rt.LTC_HALF_1,n.rectAreaLTC2=rt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==f||I.numDirectionalShadows!==E||I.numPointShadows!==T||I.numSpotShadows!==x||I.numSpotMaps!==A||I.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=x+A-b,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=C,I.directionalLength=p,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=f,I.numDirectionalShadows=E,I.numPointShadows=T,I.numSpotShadows=x,I.numSpotMaps=A,I.numLightProbes=C,n.version=Wm++)}function c(l,h){let u=0,d=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let f=0,E=l.length;f<E;f++){const T=l[f];if(T.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(T.matrixWorld),i.setFromMatrixPosition(T.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),u++}else if(T.isSpotLight){const x=n.spot[p];x.position.setFromMatrixPosition(T.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(T.matrixWorld),i.setFromMatrixPosition(T.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),p++}else if(T.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(T.matrixWorld),x.position.applyMatrix4(m),a.identity(),s.copy(T.matrixWorld),s.premultiply(m),a.extractRotation(s),x.halfWidth.set(T.width*.5,0,0),x.halfHeight.set(0,T.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(T.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(T.matrixWorld),x.position.applyMatrix4(m),d++}else if(T.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(T.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function xc(r){const t=new qm(r),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function Ym(r){let t=new WeakMap;function e(i,s=0){const a=t.get(i);let o;return a===void 0?(o=new xc(r),t.set(i,[o])):s>=a.length?(o=new xc(r),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const $m=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Km=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function jm(r,t,e){let n=new Ja;const i=new wt,s=new wt,a=new se,o=new vu({depthPacking:mh}),c=new xu,l={},h=e.maxTextureSize,u={[kn]:Ge,[Ge]:kn,[Ee]:Ee},d=new Ue({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new wt},radius:{value:4}},vertexShader:$m,fragmentShader:Km}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ce;g.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new K(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ic;let f=this.type;this.render=function(b,C,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const y=r.getRenderTarget(),S=r.getActiveCubeFace(),D=r.getActiveMipmapLevel(),F=r.state;F.setBlending(Tn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=f!==En&&this.type===En,q=f===En&&this.type!==En;for(let W=0,X=b.length;W<X;W++){const Z=b[W],H=Z.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const at=H.getFrameExtents();if(i.multiply(at),s.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/at.x),i.x=s.x*at.x,H.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/at.y),i.y=s.y*at.y,H.mapSize.y=s.y)),H.map===null||z===!0||q===!0){const Et=this.type!==En?{minFilter:Be,magFilter:Be}:{};H.map!==null&&H.map.dispose(),H.map=new an(i.x,i.y,Et),H.map.texture.name=Z.name+".shadowMap",H.camera.updateProjectionMatrix()}r.setRenderTarget(H.map),r.clear();const ht=H.getViewportCount();for(let Et=0;Et<ht;Et++){const Vt=H.getViewport(Et);a.set(s.x*Vt.x,s.y*Vt.y,s.x*Vt.z,s.y*Vt.w),F.viewport(a),H.updateMatrices(Z,Et),n=H.getFrustum(),x(C,I,H.camera,Z,this.type)}H.isPointLightShadow!==!0&&this.type===En&&E(H,I),H.needsUpdate=!1}f=this.type,m.needsUpdate=!1,r.setRenderTarget(y,S,D)};function E(b,C){const I=t.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new an(i.x,i.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,r.setRenderTarget(b.mapPass),r.clear(),r.renderBufferDirect(C,null,I,d,_,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,r.setRenderTarget(b.map),r.clear(),r.renderBufferDirect(C,null,I,p,_,null)}function T(b,C,I,y){let S=null;const D=I.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)S=D;else if(S=I.isPointLight===!0?c:o,r.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=S.uuid,z=C.uuid;let q=l[F];q===void 0&&(q={},l[F]=q);let W=q[z];W===void 0&&(W=S.clone(),q[z]=W,C.addEventListener("dispose",A)),S=W}if(S.visible=C.visible,S.wireframe=C.wireframe,y===En?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:u[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,I.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=r.properties.get(S);F.light=I}return S}function x(b,C,I,y,S){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===En)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,b.matrixWorld);const z=t.update(b),q=b.material;if(Array.isArray(q)){const W=z.groups;for(let X=0,Z=W.length;X<Z;X++){const H=W[X],at=q[H.materialIndex];if(at&&at.visible){const ht=T(b,at,y,S);b.onBeforeShadow(r,b,C,I,z,ht,H),r.renderBufferDirect(I,null,z,ht,b,H),b.onAfterShadow(r,b,C,I,z,ht,H)}}}else if(q.visible){const W=T(b,q,y,S);b.onBeforeShadow(r,b,C,I,z,W,null),r.renderBufferDirect(I,null,z,W,b,null),b.onAfterShadow(r,b,C,I,z,W,null)}}const F=b.children;for(let z=0,q=F.length;z<q;z++)x(F[z],C,I,y,S)}function A(b){b.target.removeEventListener("dispose",A);for(const I in l){const y=l[I],S=b.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}const Zm={[Qr]:ta,[ea]:sa,[na]:ra,[Ri]:ia,[ta]:Qr,[sa]:ea,[ra]:na,[ia]:Ri};function Jm(r,t){function e(){let L=!1;const nt=new se;let st=null;const dt=new se(0,0,0,0);return{setMask:function(Q){st!==Q&&!L&&(r.colorMask(Q,Q,Q,Q),st=Q)},setLocked:function(Q){L=Q},setClear:function(Q,$,mt,Ut,oe){oe===!0&&(Q*=Ut,$*=Ut,mt*=Ut),nt.set(Q,$,mt,Ut),dt.equals(nt)===!1&&(r.clearColor(Q,$,mt,Ut),dt.copy(nt))},reset:function(){L=!1,st=null,dt.set(-1,0,0,0)}}}function n(){let L=!1,nt=!1,st=null,dt=null,Q=null;return{setReversed:function($){if(nt!==$){const mt=t.get("EXT_clip_control");$?mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.ZERO_TO_ONE_EXT):mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.NEGATIVE_ONE_TO_ONE_EXT),nt=$;const Ut=Q;Q=null,this.setClear(Ut)}},getReversed:function(){return nt},setTest:function($){$?J(r.DEPTH_TEST):ft(r.DEPTH_TEST)},setMask:function($){st!==$&&!L&&(r.depthMask($),st=$)},setFunc:function($){if(nt&&($=Zm[$]),dt!==$){switch($){case Qr:r.depthFunc(r.NEVER);break;case ta:r.depthFunc(r.ALWAYS);break;case ea:r.depthFunc(r.LESS);break;case Ri:r.depthFunc(r.LEQUAL);break;case na:r.depthFunc(r.EQUAL);break;case ia:r.depthFunc(r.GEQUAL);break;case sa:r.depthFunc(r.GREATER);break;case ra:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}dt=$}},setLocked:function($){L=$},setClear:function($){Q!==$&&(nt&&($=1-$),r.clearDepth($),Q=$)},reset:function(){L=!1,st=null,dt=null,Q=null,nt=!1}}}function i(){let L=!1,nt=null,st=null,dt=null,Q=null,$=null,mt=null,Ut=null,oe=null;return{setTest:function(Zt){L||(Zt?J(r.STENCIL_TEST):ft(r.STENCIL_TEST))},setMask:function(Zt){nt!==Zt&&!L&&(r.stencilMask(Zt),nt=Zt)},setFunc:function(Zt,gn,on){(st!==Zt||dt!==gn||Q!==on)&&(r.stencilFunc(Zt,gn,on),st=Zt,dt=gn,Q=on)},setOp:function(Zt,gn,on){($!==Zt||mt!==gn||Ut!==on)&&(r.stencilOp(Zt,gn,on),$=Zt,mt=gn,Ut=on)},setLocked:function(Zt){L=Zt},setClear:function(Zt){oe!==Zt&&(r.clearStencil(Zt),oe=Zt)},reset:function(){L=!1,nt=null,st=null,dt=null,Q=null,$=null,mt=null,Ut=null,oe=null}}}const s=new e,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,T=null,x=null,A=null,b=null,C=new Nt(0,0,0),I=0,y=!1,S=null,D=null,F=null,z=null,q=null;const W=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Z=0;const H=r.getParameter(r.VERSION);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),X=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),X=Z>=2);let at=null,ht={};const Et=r.getParameter(r.SCISSOR_BOX),Vt=r.getParameter(r.VIEWPORT),ae=new se().fromArray(Et),de=new se().fromArray(Vt);function jt(L,nt,st,dt){const Q=new Uint8Array(4),$=r.createTexture();r.bindTexture(L,$),r.texParameteri(L,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(L,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let mt=0;mt<st;mt++)L===r.TEXTURE_3D||L===r.TEXTURE_2D_ARRAY?r.texImage3D(nt,0,r.RGBA,1,1,dt,0,r.RGBA,r.UNSIGNED_BYTE,Q):r.texImage2D(nt+mt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Q);return $}const Y={};Y[r.TEXTURE_2D]=jt(r.TEXTURE_2D,r.TEXTURE_2D,1),Y[r.TEXTURE_CUBE_MAP]=jt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[r.TEXTURE_2D_ARRAY]=jt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Y[r.TEXTURE_3D]=jt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(r.DEPTH_TEST),a.setFunc(Ri),Dt(!1),gt(mo),J(r.CULL_FACE),fe(Tn);function J(L){h[L]!==!0&&(r.enable(L),h[L]=!0)}function ft(L){h[L]!==!1&&(r.disable(L),h[L]=!1)}function Lt(L,nt){return u[L]!==nt?(r.bindFramebuffer(L,nt),u[L]=nt,L===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=nt),L===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=nt),!0):!1}function St(L,nt){let st=p,dt=!1;if(L){st=d.get(nt),st===void 0&&(st=[],d.set(nt,st));const Q=L.textures;if(st.length!==Q.length||st[0]!==r.COLOR_ATTACHMENT0){for(let $=0,mt=Q.length;$<mt;$++)st[$]=r.COLOR_ATTACHMENT0+$;st.length=Q.length,dt=!0}}else st[0]!==r.BACK&&(st[0]=r.BACK,dt=!0);dt&&r.drawBuffers(st)}function qt(L){return g!==L?(r.useProgram(L),g=L,!0):!1}const De={[Zn]:r.FUNC_ADD,[Gl]:r.FUNC_SUBTRACT,[Vl]:r.FUNC_REVERSE_SUBTRACT};De[Wl]=r.MIN,De[Xl]=r.MAX;const P={[ql]:r.ZERO,[Yl]:r.ONE,[$l]:r.SRC_COLOR,[Zr]:r.SRC_ALPHA,[th]:r.SRC_ALPHA_SATURATE,[Jl]:r.DST_COLOR,[jl]:r.DST_ALPHA,[Kl]:r.ONE_MINUS_SRC_COLOR,[Jr]:r.ONE_MINUS_SRC_ALPHA,[Ql]:r.ONE_MINUS_DST_COLOR,[Zl]:r.ONE_MINUS_DST_ALPHA,[eh]:r.CONSTANT_COLOR,[nh]:r.ONE_MINUS_CONSTANT_COLOR,[ih]:r.CONSTANT_ALPHA,[sh]:r.ONE_MINUS_CONSTANT_ALPHA};function fe(L,nt,st,dt,Q,$,mt,Ut,oe,Zt){if(L===Tn){_===!0&&(ft(r.BLEND),_=!1);return}if(_===!1&&(J(r.BLEND),_=!0),L!==Hl){if(L!==m||Zt!==y){if((f!==Zn||x!==Zn)&&(r.blendEquation(r.FUNC_ADD),f=Zn,x=Zn),Zt)switch(L){case wi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case bn:r.blendFunc(r.ONE,r.ONE);break;case go:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case _o:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case wi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case bn:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case go:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _o:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,T=null,A=null,b=null,C.set(0,0,0),I=0,m=L,y=Zt}return}Q=Q||nt,$=$||st,mt=mt||dt,(nt!==f||Q!==x)&&(r.blendEquationSeparate(De[nt],De[Q]),f=nt,x=Q),(st!==E||dt!==T||$!==A||mt!==b)&&(r.blendFuncSeparate(P[st],P[dt],P[$],P[mt]),E=st,T=dt,A=$,b=mt),(Ut.equals(C)===!1||oe!==I)&&(r.blendColor(Ut.r,Ut.g,Ut.b,oe),C.copy(Ut),I=oe),m=L,y=!1}function Ft(L,nt){L.side===Ee?ft(r.CULL_FACE):J(r.CULL_FACE);let st=L.side===Ge;nt&&(st=!st),Dt(st),L.blending===wi&&L.transparent===!1?fe(Tn):fe(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);const dt=L.stencilWrite;o.setTest(dt),dt&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),_t(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(r.SAMPLE_ALPHA_TO_COVERAGE):ft(r.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(L){S!==L&&(L?r.frontFace(r.CW):r.frontFace(r.CCW),S=L)}function gt(L){L!==Bl?(J(r.CULL_FACE),L!==D&&(L===mo?r.cullFace(r.BACK):L===zl?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ft(r.CULL_FACE),D=L}function pe(L){L!==F&&(X&&r.lineWidth(L),F=L)}function _t(L,nt,st){L?(J(r.POLYGON_OFFSET_FILL),(z!==nt||q!==st)&&(r.polygonOffset(nt,st),z=nt,q=st)):ft(r.POLYGON_OFFSET_FILL)}function zt(L){L?J(r.SCISSOR_TEST):ft(r.SCISSOR_TEST)}function we(L){L===void 0&&(L=r.TEXTURE0+W-1),at!==L&&(r.activeTexture(L),at=L)}function xe(L,nt,st){st===void 0&&(at===null?st=r.TEXTURE0+W-1:st=at);let dt=ht[st];dt===void 0&&(dt={type:void 0,texture:void 0},ht[st]=dt),(dt.type!==L||dt.texture!==nt)&&(at!==st&&(r.activeTexture(st),at=st),r.bindTexture(L,nt||Y[L]),dt.type=L,dt.texture=nt)}function w(){const L=ht[at];L!==void 0&&L.type!==void 0&&(r.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function v(){try{r.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function O(){try{r.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function V(){try{r.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{r.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function G(){try{r.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function yt(){try{r.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function it(){try{r.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function vt(){try{r.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{r.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function et(){try{r.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function lt(L){ae.equals(L)===!1&&(r.scissor(L.x,L.y,L.z,L.w),ae.copy(L))}function Pt(L){de.equals(L)===!1&&(r.viewport(L.x,L.y,L.z,L.w),de.copy(L))}function Mt(L,nt){let st=l.get(nt);st===void 0&&(st=new WeakMap,l.set(nt,st));let dt=st.get(L);dt===void 0&&(dt=r.getUniformBlockIndex(nt,L.name),st.set(L,dt))}function ot(L,nt){const dt=l.get(nt).get(L);c.get(nt)!==dt&&(r.uniformBlockBinding(nt,dt,L.__bindingPointIndex),c.set(nt,dt))}function kt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},at=null,ht={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,T=null,x=null,A=null,b=null,C=new Nt(0,0,0),I=0,y=!1,S=null,D=null,F=null,z=null,q=null,ae.set(0,0,r.canvas.width,r.canvas.height),de.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:J,disable:ft,bindFramebuffer:Lt,drawBuffers:St,useProgram:qt,setBlending:fe,setMaterial:Ft,setFlipSided:Dt,setCullFace:gt,setLineWidth:pe,setPolygonOffset:_t,setScissorTest:zt,activeTexture:we,bindTexture:xe,unbindTexture:w,compressedTexImage2D:v,compressedTexImage3D:O,texImage2D:xt,texImage3D:et,updateUBOMapping:Mt,uniformBlockBinding:ot,texStorage2D:it,texStorage3D:vt,texSubImage2D:V,texSubImage3D:j,compressedTexSubImage2D:G,compressedTexSubImage3D:yt,scissor:lt,viewport:Pt,reset:kt}}function Qm(r,t,e,n,i,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new wt,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,v){return p?new OffscreenCanvas(w,v):sr("canvas")}function _(w,v,O){let V=1;const j=xe(w);if((j.width>O||j.height>O)&&(V=O/Math.max(j.width,j.height)),V<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const G=Math.floor(V*j.width),yt=Math.floor(V*j.height);u===void 0&&(u=g(G,yt));const it=v?g(G,yt):u;return it.width=G,it.height=yt,it.getContext("2d").drawImage(w,0,0,G,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+G+"x"+yt+")."),it}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){r.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?r.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function T(w,v,O,V,j=!1){if(w!==null){if(r[w]!==void 0)return r[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let G=v;if(v===r.RED&&(O===r.FLOAT&&(G=r.R32F),O===r.HALF_FLOAT&&(G=r.R16F),O===r.UNSIGNED_BYTE&&(G=r.R8)),v===r.RED_INTEGER&&(O===r.UNSIGNED_BYTE&&(G=r.R8UI),O===r.UNSIGNED_SHORT&&(G=r.R16UI),O===r.UNSIGNED_INT&&(G=r.R32UI),O===r.BYTE&&(G=r.R8I),O===r.SHORT&&(G=r.R16I),O===r.INT&&(G=r.R32I)),v===r.RG&&(O===r.FLOAT&&(G=r.RG32F),O===r.HALF_FLOAT&&(G=r.RG16F),O===r.UNSIGNED_BYTE&&(G=r.RG8)),v===r.RG_INTEGER&&(O===r.UNSIGNED_BYTE&&(G=r.RG8UI),O===r.UNSIGNED_SHORT&&(G=r.RG16UI),O===r.UNSIGNED_INT&&(G=r.RG32UI),O===r.BYTE&&(G=r.RG8I),O===r.SHORT&&(G=r.RG16I),O===r.INT&&(G=r.RG32I)),v===r.RGB_INTEGER&&(O===r.UNSIGNED_BYTE&&(G=r.RGB8UI),O===r.UNSIGNED_SHORT&&(G=r.RGB16UI),O===r.UNSIGNED_INT&&(G=r.RGB32UI),O===r.BYTE&&(G=r.RGB8I),O===r.SHORT&&(G=r.RGB16I),O===r.INT&&(G=r.RGB32I)),v===r.RGBA_INTEGER&&(O===r.UNSIGNED_BYTE&&(G=r.RGBA8UI),O===r.UNSIGNED_SHORT&&(G=r.RGBA16UI),O===r.UNSIGNED_INT&&(G=r.RGBA32UI),O===r.BYTE&&(G=r.RGBA8I),O===r.SHORT&&(G=r.RGBA16I),O===r.INT&&(G=r.RGBA32I)),v===r.RGB&&(O===r.UNSIGNED_INT_5_9_9_9_REV&&(G=r.RGB9_E5),O===r.UNSIGNED_INT_10F_11F_11F_REV&&(G=r.R11F_G11F_B10F)),v===r.RGBA){const yt=j?nr:Kt.getTransfer(V);O===r.FLOAT&&(G=r.RGBA32F),O===r.HALF_FLOAT&&(G=r.RGBA16F),O===r.UNSIGNED_BYTE&&(G=yt===ie?r.SRGB8_ALPHA8:r.RGBA8),O===r.UNSIGNED_SHORT_4_4_4_4&&(G=r.RGBA4),O===r.UNSIGNED_SHORT_5_5_5_1&&(G=r.RGB5_A1)}return(G===r.R16F||G===r.R32F||G===r.RG16F||G===r.RG32F||G===r.RGBA16F||G===r.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function x(w,v){let O;return w?v===null||v===ei||v===as?O=r.DEPTH24_STENCIL8:v===dn?O=r.DEPTH32F_STENCIL8:v===rs&&(O=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ei||v===as?O=r.DEPTH_COMPONENT24:v===dn?O=r.DEPTH_COMPONENT32F:v===rs&&(O=r.DEPTH_COMPONENT16),O}function A(w,v){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Be&&w.minFilter!==un?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function b(w){const v=w.target;v.removeEventListener("dispose",b),I(v),v.isVideoTexture&&h.delete(v)}function C(w){const v=w.target;v.removeEventListener("dispose",C),S(v)}function I(w){const v=n.get(w);if(v.__webglInit===void 0)return;const O=w.source,V=d.get(O);if(V){const j=V[v.__cacheKey];j.usedTimes--,j.usedTimes===0&&y(w),Object.keys(V).length===0&&d.delete(O)}n.remove(w)}function y(w){const v=n.get(w);r.deleteTexture(v.__webglTexture);const O=w.source,V=d.get(O);delete V[v.__cacheKey],a.memory.textures--}function S(w){const v=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(v.__webglFramebuffer[V]))for(let j=0;j<v.__webglFramebuffer[V].length;j++)r.deleteFramebuffer(v.__webglFramebuffer[V][j]);else r.deleteFramebuffer(v.__webglFramebuffer[V]);v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer[V])}else{if(Array.isArray(v.__webglFramebuffer))for(let V=0;V<v.__webglFramebuffer.length;V++)r.deleteFramebuffer(v.__webglFramebuffer[V]);else r.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&r.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let V=0;V<v.__webglColorRenderbuffer.length;V++)v.__webglColorRenderbuffer[V]&&r.deleteRenderbuffer(v.__webglColorRenderbuffer[V]);v.__webglDepthRenderbuffer&&r.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=w.textures;for(let V=0,j=O.length;V<j;V++){const G=n.get(O[V]);G.__webglTexture&&(r.deleteTexture(G.__webglTexture),a.memory.textures--),n.remove(O[V])}n.remove(w)}let D=0;function F(){D=0}function z(){const w=D;return w>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),D+=1,w}function q(w){const v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function W(w,v){const O=n.get(w);if(w.isVideoTexture&&zt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&O.__version!==w.version){const V=w.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,w,v);return}}else w.isExternalTexture&&(O.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,O.__webglTexture,r.TEXTURE0+v)}function X(w,v){const O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){Y(O,w,v);return}e.bindTexture(r.TEXTURE_2D_ARRAY,O.__webglTexture,r.TEXTURE0+v)}function Z(w,v){const O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){Y(O,w,v);return}e.bindTexture(r.TEXTURE_3D,O.__webglTexture,r.TEXTURE0+v)}function H(w,v){const O=n.get(w);if(w.version>0&&O.__version!==w.version){J(O,w,v);return}e.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+v)}const at={[Di]:r.REPEAT,[Qn]:r.CLAMP_TO_EDGE,[ca]:r.MIRRORED_REPEAT},ht={[Be]:r.NEAREST,[fh]:r.NEAREST_MIPMAP_NEAREST,[xs]:r.NEAREST_MIPMAP_LINEAR,[un]:r.LINEAR,[_r]:r.LINEAR_MIPMAP_NEAREST,[ti]:r.LINEAR_MIPMAP_LINEAR},Et={[_h]:r.NEVER,[Eh]:r.ALWAYS,[vh]:r.LESS,[Xc]:r.LEQUAL,[xh]:r.EQUAL,[Sh]:r.GEQUAL,[Mh]:r.GREATER,[yh]:r.NOTEQUAL};function Vt(w,v){if(v.type===dn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===un||v.magFilter===_r||v.magFilter===xs||v.magFilter===ti||v.minFilter===un||v.minFilter===_r||v.minFilter===xs||v.minFilter===ti)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(w,r.TEXTURE_WRAP_S,at[v.wrapS]),r.texParameteri(w,r.TEXTURE_WRAP_T,at[v.wrapT]),(w===r.TEXTURE_3D||w===r.TEXTURE_2D_ARRAY)&&r.texParameteri(w,r.TEXTURE_WRAP_R,at[v.wrapR]),r.texParameteri(w,r.TEXTURE_MAG_FILTER,ht[v.magFilter]),r.texParameteri(w,r.TEXTURE_MIN_FILTER,ht[v.minFilter]),v.compareFunction&&(r.texParameteri(w,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(w,r.TEXTURE_COMPARE_FUNC,Et[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Be||v.minFilter!==xs&&v.minFilter!==ti||v.type===dn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");r.texParameterf(w,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ae(w,v){let O=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",b));const V=v.source;let j=d.get(V);j===void 0&&(j={},d.set(V,j));const G=q(v);if(G!==w.__cacheKey){j[G]===void 0&&(j[G]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,O=!0),j[G].usedTimes++;const yt=j[w.__cacheKey];yt!==void 0&&(j[w.__cacheKey].usedTimes--,yt.usedTimes===0&&y(v)),w.__cacheKey=G,w.__webglTexture=j[G].texture}return O}function de(w,v,O){return Math.floor(Math.floor(w/O)/v)}function jt(w,v,O,V){const G=w.updateRanges;if(G.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,v.width,v.height,O,V,v.data);else{G.sort((et,lt)=>et.start-lt.start);let yt=0;for(let et=1;et<G.length;et++){const lt=G[yt],Pt=G[et],Mt=lt.start+lt.count,ot=de(Pt.start,v.width,4),kt=de(lt.start,v.width,4);Pt.start<=Mt+1&&ot===kt&&de(Pt.start+Pt.count-1,v.width,4)===ot?lt.count=Math.max(lt.count,Pt.start+Pt.count-lt.start):(++yt,G[yt]=Pt)}G.length=yt+1;const it=r.getParameter(r.UNPACK_ROW_LENGTH),vt=r.getParameter(r.UNPACK_SKIP_PIXELS),xt=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,v.width);for(let et=0,lt=G.length;et<lt;et++){const Pt=G[et],Mt=Math.floor(Pt.start/4),ot=Math.ceil(Pt.count/4),kt=Mt%v.width,L=Math.floor(Mt/v.width),nt=ot,st=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,kt),r.pixelStorei(r.UNPACK_SKIP_ROWS,L),e.texSubImage2D(r.TEXTURE_2D,0,kt,L,nt,st,O,V,v.data)}w.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,it),r.pixelStorei(r.UNPACK_SKIP_PIXELS,vt),r.pixelStorei(r.UNPACK_SKIP_ROWS,xt)}}function Y(w,v,O){let V=r.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(V=r.TEXTURE_2D_ARRAY),v.isData3DTexture&&(V=r.TEXTURE_3D);const j=ae(w,v),G=v.source;e.bindTexture(V,w.__webglTexture,r.TEXTURE0+O);const yt=n.get(G);if(G.version!==yt.__version||j===!0){e.activeTexture(r.TEXTURE0+O);const it=Kt.getPrimaries(Kt.workingColorSpace),vt=v.colorSpace===Nn?null:Kt.getPrimaries(v.colorSpace),xt=v.colorSpace===Nn||it===vt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let et=_(v.image,!1,i.maxTextureSize);et=we(v,et);const lt=s.convert(v.format,v.colorSpace),Pt=s.convert(v.type);let Mt=T(v.internalFormat,lt,Pt,v.colorSpace,v.isVideoTexture);Vt(V,v);let ot;const kt=v.mipmaps,L=v.isVideoTexture!==!0,nt=yt.__version===void 0||j===!0,st=G.dataReady,dt=A(v,et);if(v.isDepthTexture)Mt=x(v.format===cs,v.type),nt&&(L?e.texStorage2D(r.TEXTURE_2D,1,Mt,et.width,et.height):e.texImage2D(r.TEXTURE_2D,0,Mt,et.width,et.height,0,lt,Pt,null));else if(v.isDataTexture)if(kt.length>0){L&&nt&&e.texStorage2D(r.TEXTURE_2D,dt,Mt,kt[0].width,kt[0].height);for(let Q=0,$=kt.length;Q<$;Q++)ot=kt[Q],L?st&&e.texSubImage2D(r.TEXTURE_2D,Q,0,0,ot.width,ot.height,lt,Pt,ot.data):e.texImage2D(r.TEXTURE_2D,Q,Mt,ot.width,ot.height,0,lt,Pt,ot.data);v.generateMipmaps=!1}else L?(nt&&e.texStorage2D(r.TEXTURE_2D,dt,Mt,et.width,et.height),st&&jt(v,et,lt,Pt)):e.texImage2D(r.TEXTURE_2D,0,Mt,et.width,et.height,0,lt,Pt,et.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){L&&nt&&e.texStorage3D(r.TEXTURE_2D_ARRAY,dt,Mt,kt[0].width,kt[0].height,et.depth);for(let Q=0,$=kt.length;Q<$;Q++)if(ot=kt[Q],v.format!==rn)if(lt!==null)if(L){if(st)if(v.layerUpdates.size>0){const mt=Ko(ot.width,ot.height,v.format,v.type);for(const Ut of v.layerUpdates){const oe=ot.data.subarray(Ut*mt/ot.data.BYTES_PER_ELEMENT,(Ut+1)*mt/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Q,0,0,Ut,ot.width,ot.height,1,lt,oe)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Q,0,0,0,ot.width,ot.height,et.depth,lt,ot.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Q,Mt,ot.width,ot.height,et.depth,0,ot.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?st&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Q,0,0,0,ot.width,ot.height,et.depth,lt,Pt,ot.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Q,Mt,ot.width,ot.height,et.depth,0,lt,Pt,ot.data)}else{L&&nt&&e.texStorage2D(r.TEXTURE_2D,dt,Mt,kt[0].width,kt[0].height);for(let Q=0,$=kt.length;Q<$;Q++)ot=kt[Q],v.format!==rn?lt!==null?L?st&&e.compressedTexSubImage2D(r.TEXTURE_2D,Q,0,0,ot.width,ot.height,lt,ot.data):e.compressedTexImage2D(r.TEXTURE_2D,Q,Mt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?st&&e.texSubImage2D(r.TEXTURE_2D,Q,0,0,ot.width,ot.height,lt,Pt,ot.data):e.texImage2D(r.TEXTURE_2D,Q,Mt,ot.width,ot.height,0,lt,Pt,ot.data)}else if(v.isDataArrayTexture)if(L){if(nt&&e.texStorage3D(r.TEXTURE_2D_ARRAY,dt,Mt,et.width,et.height,et.depth),st)if(v.layerUpdates.size>0){const Q=Ko(et.width,et.height,v.format,v.type);for(const $ of v.layerUpdates){const mt=et.data.subarray($*Q/et.data.BYTES_PER_ELEMENT,($+1)*Q/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,$,et.width,et.height,1,lt,Pt,mt)}v.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,lt,Pt,et.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Mt,et.width,et.height,et.depth,0,lt,Pt,et.data);else if(v.isData3DTexture)L?(nt&&e.texStorage3D(r.TEXTURE_3D,dt,Mt,et.width,et.height,et.depth),st&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,lt,Pt,et.data)):e.texImage3D(r.TEXTURE_3D,0,Mt,et.width,et.height,et.depth,0,lt,Pt,et.data);else if(v.isFramebufferTexture){if(nt)if(L)e.texStorage2D(r.TEXTURE_2D,dt,Mt,et.width,et.height);else{let Q=et.width,$=et.height;for(let mt=0;mt<dt;mt++)e.texImage2D(r.TEXTURE_2D,mt,Mt,Q,$,0,lt,Pt,null),Q>>=1,$>>=1}}else if(kt.length>0){if(L&&nt){const Q=xe(kt[0]);e.texStorage2D(r.TEXTURE_2D,dt,Mt,Q.width,Q.height)}for(let Q=0,$=kt.length;Q<$;Q++)ot=kt[Q],L?st&&e.texSubImage2D(r.TEXTURE_2D,Q,0,0,lt,Pt,ot):e.texImage2D(r.TEXTURE_2D,Q,Mt,lt,Pt,ot);v.generateMipmaps=!1}else if(L){if(nt){const Q=xe(et);e.texStorage2D(r.TEXTURE_2D,dt,Mt,Q.width,Q.height)}st&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,lt,Pt,et)}else e.texImage2D(r.TEXTURE_2D,0,Mt,lt,Pt,et);m(v)&&f(V),yt.__version=G.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function J(w,v,O){if(v.image.length!==6)return;const V=ae(w,v),j=v.source;e.bindTexture(r.TEXTURE_CUBE_MAP,w.__webglTexture,r.TEXTURE0+O);const G=n.get(j);if(j.version!==G.__version||V===!0){e.activeTexture(r.TEXTURE0+O);const yt=Kt.getPrimaries(Kt.workingColorSpace),it=v.colorSpace===Nn?null:Kt.getPrimaries(v.colorSpace),vt=v.colorSpace===Nn||yt===it?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const xt=v.isCompressedTexture||v.image[0].isCompressedTexture,et=v.image[0]&&v.image[0].isDataTexture,lt=[];for(let $=0;$<6;$++)!xt&&!et?lt[$]=_(v.image[$],!0,i.maxCubemapSize):lt[$]=et?v.image[$].image:v.image[$],lt[$]=we(v,lt[$]);const Pt=lt[0],Mt=s.convert(v.format,v.colorSpace),ot=s.convert(v.type),kt=T(v.internalFormat,Mt,ot,v.colorSpace),L=v.isVideoTexture!==!0,nt=G.__version===void 0||V===!0,st=j.dataReady;let dt=A(v,Pt);Vt(r.TEXTURE_CUBE_MAP,v);let Q;if(xt){L&&nt&&e.texStorage2D(r.TEXTURE_CUBE_MAP,dt,kt,Pt.width,Pt.height);for(let $=0;$<6;$++){Q=lt[$].mipmaps;for(let mt=0;mt<Q.length;mt++){const Ut=Q[mt];v.format!==rn?Mt!==null?L?st&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,0,0,Ut.width,Ut.height,Mt,Ut.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,kt,Ut.width,Ut.height,0,Ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?st&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,0,0,Ut.width,Ut.height,Mt,ot,Ut.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,kt,Ut.width,Ut.height,0,Mt,ot,Ut.data)}}}else{if(Q=v.mipmaps,L&&nt){Q.length>0&&dt++;const $=xe(lt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,dt,kt,$.width,$.height)}for(let $=0;$<6;$++)if(et){L?st&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,lt[$].width,lt[$].height,Mt,ot,lt[$].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,kt,lt[$].width,lt[$].height,0,Mt,ot,lt[$].data);for(let mt=0;mt<Q.length;mt++){const oe=Q[mt].image[$].image;L?st&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,0,0,oe.width,oe.height,Mt,ot,oe.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,kt,oe.width,oe.height,0,Mt,ot,oe.data)}}else{L?st&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Mt,ot,lt[$]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,kt,Mt,ot,lt[$]);for(let mt=0;mt<Q.length;mt++){const Ut=Q[mt];L?st&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,0,0,Mt,ot,Ut.image[$]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,kt,Mt,ot,Ut.image[$])}}}m(v)&&f(r.TEXTURE_CUBE_MAP),G.__version=j.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function ft(w,v,O,V,j,G){const yt=s.convert(O.format,O.colorSpace),it=s.convert(O.type),vt=T(O.internalFormat,yt,it,O.colorSpace),xt=n.get(v),et=n.get(O);if(et.__renderTarget=v,!xt.__hasExternalTextures){const lt=Math.max(1,v.width>>G),Pt=Math.max(1,v.height>>G);j===r.TEXTURE_3D||j===r.TEXTURE_2D_ARRAY?e.texImage3D(j,G,vt,lt,Pt,v.depth,0,yt,it,null):e.texImage2D(j,G,vt,lt,Pt,0,yt,it,null)}e.bindFramebuffer(r.FRAMEBUFFER,w),_t(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,V,j,et.__webglTexture,0,pe(v)):(j===r.TEXTURE_2D||j>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,V,j,et.__webglTexture,G),e.bindFramebuffer(r.FRAMEBUFFER,null)}function Lt(w,v,O){if(r.bindRenderbuffer(r.RENDERBUFFER,w),v.depthBuffer){const V=v.depthTexture,j=V&&V.isDepthTexture?V.type:null,G=x(v.stencilBuffer,j),yt=v.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,it=pe(v);_t(v)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,it,G,v.width,v.height):O?r.renderbufferStorageMultisample(r.RENDERBUFFER,it,G,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,G,v.width,v.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,yt,r.RENDERBUFFER,w)}else{const V=v.textures;for(let j=0;j<V.length;j++){const G=V[j],yt=s.convert(G.format,G.colorSpace),it=s.convert(G.type),vt=T(G.internalFormat,yt,it,G.colorSpace),xt=pe(v);O&&_t(v)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,xt,vt,v.width,v.height):_t(v)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,xt,vt,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,vt,v.width,v.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function St(w,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(v.depthTexture);V.__renderTarget=v,(!V.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),W(v.depthTexture,0);const j=V.__webglTexture,G=pe(v);if(v.depthTexture.format===os)_t(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,j,0,G):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,j,0);else if(v.depthTexture.format===cs)_t(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,j,0,G):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function qt(w){const v=n.get(w),O=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){const V=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),V){const j=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,V.removeEventListener("dispose",j)};V.addEventListener("dispose",j),v.__depthDisposeCallback=j}v.__boundDepthTexture=V}if(w.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const V=w.texture.mipmaps;V&&V.length>0?St(v.__webglFramebuffer[0],w):St(v.__webglFramebuffer,w)}else if(O){v.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[V]),v.__webglDepthbuffer[V]===void 0)v.__webglDepthbuffer[V]=r.createRenderbuffer(),Lt(v.__webglDepthbuffer[V],w,!1);else{const j=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer[V];r.bindRenderbuffer(r.RENDERBUFFER,G),r.framebufferRenderbuffer(r.FRAMEBUFFER,j,r.RENDERBUFFER,G)}}else{const V=w.texture.mipmaps;if(V&&V.length>0?e.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=r.createRenderbuffer(),Lt(v.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,G),r.framebufferRenderbuffer(r.FRAMEBUFFER,j,r.RENDERBUFFER,G)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function De(w,v,O){const V=n.get(w);v!==void 0&&ft(V.__webglFramebuffer,w,w.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),O!==void 0&&qt(w)}function P(w){const v=w.texture,O=n.get(w),V=n.get(v);w.addEventListener("dispose",C);const j=w.textures,G=w.isWebGLCubeRenderTarget===!0,yt=j.length>1;if(yt||(V.__webglTexture===void 0&&(V.__webglTexture=r.createTexture()),V.__version=v.version,a.memory.textures++),G){O.__webglFramebuffer=[];for(let it=0;it<6;it++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[it]=[];for(let vt=0;vt<v.mipmaps.length;vt++)O.__webglFramebuffer[it][vt]=r.createFramebuffer()}else O.__webglFramebuffer[it]=r.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let it=0;it<v.mipmaps.length;it++)O.__webglFramebuffer[it]=r.createFramebuffer()}else O.__webglFramebuffer=r.createFramebuffer();if(yt)for(let it=0,vt=j.length;it<vt;it++){const xt=n.get(j[it]);xt.__webglTexture===void 0&&(xt.__webglTexture=r.createTexture(),a.memory.textures++)}if(w.samples>0&&_t(w)===!1){O.__webglMultisampledFramebuffer=r.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let it=0;it<j.length;it++){const vt=j[it];O.__webglColorRenderbuffer[it]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,O.__webglColorRenderbuffer[it]);const xt=s.convert(vt.format,vt.colorSpace),et=s.convert(vt.type),lt=T(vt.internalFormat,xt,et,vt.colorSpace,w.isXRRenderTarget===!0),Pt=pe(w);r.renderbufferStorageMultisample(r.RENDERBUFFER,Pt,lt,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+it,r.RENDERBUFFER,O.__webglColorRenderbuffer[it])}r.bindRenderbuffer(r.RENDERBUFFER,null),w.depthBuffer&&(O.__webglDepthRenderbuffer=r.createRenderbuffer(),Lt(O.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(G){e.bindTexture(r.TEXTURE_CUBE_MAP,V.__webglTexture),Vt(r.TEXTURE_CUBE_MAP,v);for(let it=0;it<6;it++)if(v.mipmaps&&v.mipmaps.length>0)for(let vt=0;vt<v.mipmaps.length;vt++)ft(O.__webglFramebuffer[it][vt],w,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+it,vt);else ft(O.__webglFramebuffer[it],w,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);m(v)&&f(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let it=0,vt=j.length;it<vt;it++){const xt=j[it],et=n.get(xt);let lt=r.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(lt=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(lt,et.__webglTexture),Vt(lt,xt),ft(O.__webglFramebuffer,w,xt,r.COLOR_ATTACHMENT0+it,lt,0),m(xt)&&f(lt)}e.unbindTexture()}else{let it=r.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(it=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(it,V.__webglTexture),Vt(it,v),v.mipmaps&&v.mipmaps.length>0)for(let vt=0;vt<v.mipmaps.length;vt++)ft(O.__webglFramebuffer[vt],w,v,r.COLOR_ATTACHMENT0,it,vt);else ft(O.__webglFramebuffer,w,v,r.COLOR_ATTACHMENT0,it,0);m(v)&&f(it),e.unbindTexture()}w.depthBuffer&&qt(w)}function fe(w){const v=w.textures;for(let O=0,V=v.length;O<V;O++){const j=v[O];if(m(j)){const G=E(w),yt=n.get(j).__webglTexture;e.bindTexture(G,yt),f(G),e.unbindTexture()}}}const Ft=[],Dt=[];function gt(w){if(w.samples>0){if(_t(w)===!1){const v=w.textures,O=w.width,V=w.height;let j=r.COLOR_BUFFER_BIT;const G=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,yt=n.get(w),it=v.length>1;if(it)for(let xt=0;xt<v.length;xt++)e.bindFramebuffer(r.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,yt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer);const vt=w.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,yt.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let xt=0;xt<v.length;xt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=r.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=r.STENCIL_BUFFER_BIT)),it){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,yt.__webglColorRenderbuffer[xt]);const et=n.get(v[xt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,et,0)}r.blitFramebuffer(0,0,O,V,0,0,O,V,j,r.NEAREST),c===!0&&(Ft.length=0,Dt.length=0,Ft.push(r.COLOR_ATTACHMENT0+xt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Ft.push(G),Dt.push(G),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Dt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ft))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),it)for(let xt=0;xt<v.length;xt++){e.bindFramebuffer(r.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.RENDERBUFFER,yt.__webglColorRenderbuffer[xt]);const et=n.get(v[xt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,yt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.TEXTURE_2D,et,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const v=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[v])}}}function pe(w){return Math.min(i.maxSamples,w.samples)}function _t(w){const v=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function zt(w){const v=a.render.frame;h.get(w)!==v&&(h.set(w,v),w.update())}function we(w,v){const O=w.colorSpace,V=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||O!==Ii&&O!==Nn&&(Kt.getTransfer(O)===ie?(V!==rn||j!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function xe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=X,this.setTexture3D=Z,this.setTextureCube=H,this.rebindTextures=De,this.setupRenderTarget=P,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=_t}function t0(r,t){function e(n,i=Nn){let s;const a=Kt.getTransfer(i);if(n===pn)return r.UNSIGNED_BYTE;if(n===Va)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Wa)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Bc)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===zc)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Oc)return r.BYTE;if(n===kc)return r.SHORT;if(n===rs)return r.UNSIGNED_SHORT;if(n===Ga)return r.INT;if(n===ei)return r.UNSIGNED_INT;if(n===dn)return r.FLOAT;if(n===wn)return r.HALF_FLOAT;if(n===Hc)return r.ALPHA;if(n===Gc)return r.RGB;if(n===rn)return r.RGBA;if(n===os)return r.DEPTH_COMPONENT;if(n===cs)return r.DEPTH_STENCIL;if(n===Xa)return r.RED;if(n===qa)return r.RED_INTEGER;if(n===Vc)return r.RG;if(n===Ya)return r.RG_INTEGER;if(n===$a)return r.RGBA_INTEGER;if(n===Ys||n===$s||n===Ks||n===js)if(a===ie)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ys)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$s)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ks)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===js)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ys)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$s)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ks)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===js)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===la||n===ha||n===ua||n===da)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===la)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ha)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ua)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===da)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fa||n===pa||n===ma)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===fa||n===pa)return a===ie?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ma)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ga||n===_a||n===va||n===xa||n===Ma||n===ya||n===Sa||n===Ea||n===Ta||n===ba||n===wa||n===Aa||n===Ra||n===Ca)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===ga)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===_a)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===va)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===xa)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ma)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ya)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Sa)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ea)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ta)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ba)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wa)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ra)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ca)return a===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Pa||n===Da||n===Ia)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Pa)return a===ie?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Da)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ia)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===La||n===Ua||n===Na||n===Fa)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===La)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Ua)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Na)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Fa)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===as?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}const e0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,n0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class i0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new sl(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ue({vertexShader:e0,fragmentShader:n0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new K(new Je(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class s0 extends Oi{constructor(t,e){super();const n=this;let i=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null;const _=typeof XRWebGLBinding<"u",m=new i0,f={},E=e.getContextAttributes();let T=null,x=null;const A=[],b=[],C=new wt;let I=null;const y=new He;y.viewport=new se;const S=new He;S.viewport=new se;const D=[y,S],F=new Tu;let z=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let J=A[Y];return J===void 0&&(J=new kr,A[Y]=J),J.getTargetRaySpace()},this.getControllerGrip=function(Y){let J=A[Y];return J===void 0&&(J=new kr,A[Y]=J),J.getGripSpace()},this.getHand=function(Y){let J=A[Y];return J===void 0&&(J=new kr,A[Y]=J),J.getHandSpace()};function W(Y){const J=b.indexOf(Y.inputSource);if(J===-1)return;const ft=A[J];ft!==void 0&&(ft.update(Y.inputSource,Y.frame,l||a),ft.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",Z);for(let Y=0;Y<A.length;Y++){const J=b[Y];J!==null&&(b[Y]=null,A[Y].disconnect(J))}z=null,q=null,m.reset();for(const Y in f)delete f[Y];t.setRenderTarget(T),p=null,d=null,u=null,i=null,x=null,jt.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(T=t.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",X),i.addEventListener("inputsourceschange",Z),E.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ft=null,Lt=null,St=null;E.depth&&(St=E.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ft=E.stencil?cs:os,Lt=E.stencil?as:ei);const qt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(qt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new an(d.textureWidth,d.textureHeight,{format:rn,type:pn,depthTexture:new il(d.textureWidth,d.textureHeight,Lt,void 0,void 0,void 0,void 0,void 0,void 0,ft),stencilBuffer:E.stencil,colorSpace:t.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ft={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,e,ft),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new an(p.framebufferWidth,p.framebufferHeight,{format:rn,type:pn,colorSpace:t.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),jt.setContext(i),jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(Y){for(let J=0;J<Y.removed.length;J++){const ft=Y.removed[J],Lt=b.indexOf(ft);Lt>=0&&(b[Lt]=null,A[Lt].disconnect(ft))}for(let J=0;J<Y.added.length;J++){const ft=Y.added[J];let Lt=b.indexOf(ft);if(Lt===-1){for(let qt=0;qt<A.length;qt++)if(qt>=b.length){b.push(ft),Lt=qt;break}else if(b[qt]===null){b[qt]=ft,Lt=qt;break}if(Lt===-1)break}const St=A[Lt];St&&St.connect(ft)}}const H=new R,at=new R;function ht(Y,J,ft){H.setFromMatrixPosition(J.matrixWorld),at.setFromMatrixPosition(ft.matrixWorld);const Lt=H.distanceTo(at),St=J.projectionMatrix.elements,qt=ft.projectionMatrix.elements,De=St[14]/(St[10]-1),P=St[14]/(St[10]+1),fe=(St[9]+1)/St[5],Ft=(St[9]-1)/St[5],Dt=(St[8]-1)/St[0],gt=(qt[8]+1)/qt[0],pe=De*Dt,_t=De*gt,zt=Lt/(-Dt+gt),we=zt*-Dt;if(J.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(we),Y.translateZ(zt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),St[10]===-1)Y.projectionMatrix.copy(J.projectionMatrix),Y.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const xe=De+zt,w=P+zt,v=pe-we,O=_t+(Lt-we),V=fe*P/w*xe,j=Ft*P/w*xe;Y.projectionMatrix.makePerspective(v,O,V,j,xe,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Et(Y,J){J===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(J.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let J=Y.near,ft=Y.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(ft=m.depthFar)),F.near=S.near=y.near=J,F.far=S.far=y.far=ft,(z!==F.near||q!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,q=F.far),F.layers.mask=Y.layers.mask|6,y.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const Lt=Y.parent,St=F.cameras;Et(F,Lt);for(let qt=0;qt<St.length;qt++)Et(St[qt],Lt);St.length===2?ht(F,y,S):F.projectionMatrix.copy(y.projectionMatrix),Vt(Y,F,Lt)};function Vt(Y,J,ft){ft===null?Y.matrix.copy(J.matrixWorld):(Y.matrix.copy(ft.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(J.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(J.projectionMatrix),Y.projectionMatrixInverse.copy(J.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Li*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(Y){return f[Y]};let ae=null;function de(Y,J){if(h=J.getViewerPose(l||a),g=J,h!==null){const ft=h.views;p!==null&&(t.setRenderTargetFramebuffer(x,p.framebuffer),t.setRenderTarget(x));let Lt=!1;ft.length!==F.cameras.length&&(F.cameras.length=0,Lt=!0);for(let P=0;P<ft.length;P++){const fe=ft[P];let Ft=null;if(p!==null)Ft=p.getViewport(fe);else{const gt=u.getViewSubImage(d,fe);Ft=gt.viewport,P===0&&(t.setRenderTargetTextures(x,gt.colorTexture,gt.depthStencilTexture),t.setRenderTarget(x))}let Dt=D[P];Dt===void 0&&(Dt=new He,Dt.layers.enable(P),Dt.viewport=new se,D[P]=Dt),Dt.matrix.fromArray(fe.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(fe.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),P===0&&(F.matrix.copy(Dt.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Lt===!0&&F.cameras.push(Dt)}const St=i.enabledFeatures;if(St&&St.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const P=u.getDepthInformation(ft[0]);P&&P.isValid&&P.texture&&m.init(P,i.renderState)}if(St&&St.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<ft.length;P++){const fe=ft[P].camera;if(fe){let Ft=f[fe];Ft||(Ft=new sl,f[fe]=Ft);const Dt=u.getCameraImage(fe);Ft.sourceTexture=Dt}}}}for(let ft=0;ft<A.length;ft++){const Lt=b[ft],St=A[ft];Lt!==null&&St!==void 0&&St.update(Lt,J,l||a)}ae&&ae(Y,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const jt=new al;jt.setAnimationLoop(de),this.setAnimationLoop=function(Y){ae=Y},this.dispose=function(){}}}const $n=new mn,r0=new Qt;function a0(r,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Qc(r)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,E,T,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),u(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),_(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,E,T):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ge&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ge&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const E=t.get(f),T=E.envMap,x=E.envMapRotation;T&&(m.envMap.value=T,$n.copy(x),$n.x*=-1,$n.y*=-1,$n.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),m.envMapRotation.value.setFromMatrix4(r0.makeRotationFromEuler($n)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,E,T){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=T*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ge&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const E=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function o0(r,t,e,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,T){const x=T.program;n.uniformBlockBinding(E,x)}function l(E,T){let x=i[E.id];x===void 0&&(g(E),x=h(E),i[E.id]=x,E.addEventListener("dispose",m));const A=T.program;n.updateUBOMapping(E,A);const b=t.render.frame;s[E.id]!==b&&(d(E),s[E.id]=b)}function h(E){const T=u();E.__bindingPointIndex=T;const x=r.createBuffer(),A=E.__size,b=E.usage;return r.bindBuffer(r.UNIFORM_BUFFER,x),r.bufferData(r.UNIFORM_BUFFER,A,b),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,T,x),x}function u(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){const T=i[E.id],x=E.uniforms,A=E.__cache;r.bindBuffer(r.UNIFORM_BUFFER,T);for(let b=0,C=x.length;b<C;b++){const I=Array.isArray(x[b])?x[b]:[x[b]];for(let y=0,S=I.length;y<S;y++){const D=I[y];if(p(D,b,y,A)===!0){const F=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let q=0;for(let W=0;W<z.length;W++){const X=z[W],Z=_(X);typeof X=="number"||typeof X=="boolean"?(D.__data[0]=X,r.bufferSubData(r.UNIFORM_BUFFER,F+q,D.__data)):X.isMatrix3?(D.__data[0]=X.elements[0],D.__data[1]=X.elements[1],D.__data[2]=X.elements[2],D.__data[3]=0,D.__data[4]=X.elements[3],D.__data[5]=X.elements[4],D.__data[6]=X.elements[5],D.__data[7]=0,D.__data[8]=X.elements[6],D.__data[9]=X.elements[7],D.__data[10]=X.elements[8],D.__data[11]=0):(X.toArray(D.__data,q),q+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,F,D.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function p(E,T,x,A){const b=E.value,C=T+"_"+x;if(A[C]===void 0)return typeof b=="number"||typeof b=="boolean"?A[C]=b:A[C]=b.clone(),!0;{const I=A[C];if(typeof b=="number"||typeof b=="boolean"){if(I!==b)return A[C]=b,!0}else if(I.equals(b)===!1)return I.copy(b),!0}return!1}function g(E){const T=E.uniforms;let x=0;const A=16;for(let C=0,I=T.length;C<I;C++){const y=Array.isArray(T[C])?T[C]:[T[C]];for(let S=0,D=y.length;S<D;S++){const F=y[S],z=Array.isArray(F.value)?F.value:[F.value];for(let q=0,W=z.length;q<W;q++){const X=z[q],Z=_(X),H=x%A,at=H%Z.boundary,ht=H+at;x+=at,ht!==0&&A-ht<Z.storage&&(x+=A-ht),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=Z.storage}}}const b=x%A;return b>0&&(x+=A-b),E.__size=x,E.__cache={},this}function _(E){const T={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(T.boundary=4,T.storage=4):E.isVector2?(T.boundary=8,T.storage=8):E.isVector3||E.isColor?(T.boundary=16,T.storage=12):E.isVector4?(T.boundary=16,T.storage=16):E.isMatrix3?(T.boundary=48,T.storage=48):E.isMatrix4?(T.boundary=64,T.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),T}function m(E){const T=E.target;T.removeEventListener("dispose",m);const x=a.indexOf(T.__bindingPointIndex);a.splice(x,1),r.deleteBuffer(i[T.id]),delete i[T.id],delete s[T.id]}function f(){for(const E in i)r.deleteBuffer(i[E]);a=[],i={},s={}}return{bind:c,update:l,dispose:f}}class c0{constructor(t={}){const{canvas:e=zh(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const E=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=On,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let A=!1;this._outputColorSpace=Re;let b=0,C=0,I=null,y=-1,S=null;const D=new se,F=new se;let z=null;const q=new Nt(0);let W=0,X=e.width,Z=e.height,H=1,at=null,ht=null;const Et=new se(0,0,X,Z),Vt=new se(0,0,X,Z);let ae=!1;const de=new Ja;let jt=!1,Y=!1;const J=new Qt,ft=new R,Lt=new se,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function De(){return I===null?H:1}let P=n;function fe(M,U){return e.getContext(M,U)}try{const M={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ha}`),e.addEventListener("webglcontextlost",st,!1),e.addEventListener("webglcontextrestored",dt,!1),e.addEventListener("webglcontextcreationerror",Q,!1),P===null){const U="webgl2";if(P=fe(U,M),P===null)throw fe(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Ft,Dt,gt,pe,_t,zt,we,xe,w,v,O,V,j,G,yt,it,vt,xt,et,lt,Pt,Mt,ot,kt;function L(){Ft=new vp(P),Ft.init(),Mt=new t0(P,Ft),Dt=new up(P,Ft,t,Mt),gt=new Jm(P,Ft),Dt.reversedDepthBuffer&&d&&gt.buffers.depth.setReversed(!0),pe=new yp(P),_t=new Bm,zt=new Qm(P,Ft,gt,_t,Dt,Mt,pe),we=new fp(x),xe=new _p(x),w=new wu(P),ot=new lp(P,w),v=new xp(P,w,pe,ot),O=new Ep(P,v,w,pe),et=new Sp(P,Dt,zt),it=new dp(_t),V=new km(x,we,xe,Ft,Dt,ot,it),j=new a0(x,_t),G=new Hm,yt=new Ym(Ft),xt=new cp(x,we,xe,gt,O,p,c),vt=new jm(x,O,Dt),kt=new o0(P,pe,Dt,gt),lt=new hp(P,Ft,pe),Pt=new Mp(P,Ft,pe),pe.programs=V.programs,x.capabilities=Dt,x.extensions=Ft,x.properties=_t,x.renderLists=G,x.shadowMap=vt,x.state=gt,x.info=pe}L();const nt=new s0(x,P);this.xr=nt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const M=Ft.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Ft.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(M){M!==void 0&&(H=M,this.setSize(X,Z,!1))},this.getSize=function(M){return M.set(X,Z)},this.setSize=function(M,U,k=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=M,Z=U,e.width=Math.floor(M*H),e.height=Math.floor(U*H),k===!0&&(e.style.width=M+"px",e.style.height=U+"px"),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(X*H,Z*H).floor()},this.setDrawingBufferSize=function(M,U,k){X=M,Z=U,H=k,e.width=Math.floor(M*k),e.height=Math.floor(U*k),this.setViewport(0,0,M,U)},this.getCurrentViewport=function(M){return M.copy(D)},this.getViewport=function(M){return M.copy(Et)},this.setViewport=function(M,U,k,B){M.isVector4?Et.set(M.x,M.y,M.z,M.w):Et.set(M,U,k,B),gt.viewport(D.copy(Et).multiplyScalar(H).round())},this.getScissor=function(M){return M.copy(Vt)},this.setScissor=function(M,U,k,B){M.isVector4?Vt.set(M.x,M.y,M.z,M.w):Vt.set(M,U,k,B),gt.scissor(F.copy(Vt).multiplyScalar(H).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(M){gt.setScissorTest(ae=M)},this.setOpaqueSort=function(M){at=M},this.setTransparentSort=function(M){ht=M},this.getClearColor=function(M){return M.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,k=!0){let B=0;if(M){let N=!1;if(I!==null){const tt=I.texture.format;N=tt===$a||tt===Ya||tt===qa}if(N){const tt=I.texture.type,ct=tt===pn||tt===ei||tt===rs||tt===as||tt===Va||tt===Wa,pt=xt.getClearColor(),ut=xt.getClearAlpha(),Rt=pt.r,It=pt.g,Tt=pt.b;ct?(g[0]=Rt,g[1]=It,g[2]=Tt,g[3]=ut,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Rt,_[1]=It,_[2]=Tt,_[3]=ut,P.clearBufferiv(P.COLOR,0,_))}else B|=P.COLOR_BUFFER_BIT}U&&(B|=P.DEPTH_BUFFER_BIT),k&&(B|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",st,!1),e.removeEventListener("webglcontextrestored",dt,!1),e.removeEventListener("webglcontextcreationerror",Q,!1),xt.dispose(),G.dispose(),yt.dispose(),_t.dispose(),we.dispose(),xe.dispose(),O.dispose(),ot.dispose(),kt.dispose(),V.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",on),nt.removeEventListener("sessionend",so),Hn.stop()};function st(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function dt(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const M=pe.autoReset,U=vt.enabled,k=vt.autoUpdate,B=vt.needsUpdate,N=vt.type;L(),pe.autoReset=M,vt.enabled=U,vt.autoUpdate=k,vt.needsUpdate=B,vt.type=N}function Q(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function $(M){const U=M.target;U.removeEventListener("dispose",$),mt(U)}function mt(M){Ut(M),_t.remove(M)}function Ut(M){const U=_t.get(M).programs;U!==void 0&&(U.forEach(function(k){V.releaseProgram(k)}),M.isShaderMaterial&&V.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,k,B,N,tt){U===null&&(U=St);const ct=N.isMesh&&N.matrixWorld.determinant()<0,pt=yl(M,U,k,B,N);gt.setMaterial(B,ct);let ut=k.index,Rt=1;if(B.wireframe===!0){if(ut=v.getWireframeAttribute(k),ut===void 0)return;Rt=2}const It=k.drawRange,Tt=k.attributes.position;let Wt=It.start*Rt,ne=(It.start+It.count)*Rt;tt!==null&&(Wt=Math.max(Wt,tt.start*Rt),ne=Math.min(ne,(tt.start+tt.count)*Rt)),ut!==null?(Wt=Math.max(Wt,0),ne=Math.min(ne,ut.count)):Tt!=null&&(Wt=Math.max(Wt,0),ne=Math.min(ne,Tt.count));const _e=ne-Wt;if(_e<0||_e===1/0)return;ot.setup(N,B,pt,k,ut);let he,re=lt;if(ut!==null&&(he=w.get(ut),re=Pt,re.setIndex(he)),N.isMesh)B.wireframe===!0?(gt.setLineWidth(B.wireframeLinewidth*De()),re.setMode(P.LINES)):re.setMode(P.TRIANGLES);else if(N.isLine){let At=B.linewidth;At===void 0&&(At=1),gt.setLineWidth(At*De()),N.isLineSegments?re.setMode(P.LINES):N.isLineLoop?re.setMode(P.LINE_LOOP):re.setMode(P.LINE_STRIP)}else N.isPoints?re.setMode(P.POINTS):N.isSprite&&re.setMode(P.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)ls("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),re.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))re.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const At=N._multiDrawStarts,me=N._multiDrawCounts,$t=N._multiDrawCount,Xe=ut?w.get(ut).bytesPerElement:1,ri=_t.get(B).currentProgram.getUniforms();for(let qe=0;qe<$t;qe++)ri.setValue(P,"_gl_DrawID",qe),re.render(At[qe]/Xe,me[qe])}else if(N.isInstancedMesh)re.renderInstances(Wt,_e,N.count);else if(k.isInstancedBufferGeometry){const At=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,me=Math.min(k.instanceCount,At);re.renderInstances(Wt,_e,me)}else re.render(Wt,_e)};function oe(M,U,k){M.transparent===!0&&M.side===Ee&&M.forceSinglePass===!1?(M.side=Ge,M.needsUpdate=!0,gs(M,U,k),M.side=kn,M.needsUpdate=!0,gs(M,U,k),M.side=Ee):gs(M,U,k)}this.compile=function(M,U,k=null){k===null&&(k=M),f=yt.get(k),f.init(U),T.push(f),k.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),M!==k&&M.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const B=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const tt=N.material;if(tt)if(Array.isArray(tt))for(let ct=0;ct<tt.length;ct++){const pt=tt[ct];oe(pt,k,N),B.add(pt)}else oe(tt,k,N),B.add(tt)}),f=T.pop(),B},this.compileAsync=function(M,U,k=null){const B=this.compile(M,U,k);return new Promise(N=>{function tt(){if(B.forEach(function(ct){_t.get(ct).currentProgram.isReady()&&B.delete(ct)}),B.size===0){N(M);return}setTimeout(tt,10)}Ft.get("KHR_parallel_shader_compile")!==null?tt():setTimeout(tt,10)})};let Zt=null;function gn(M){Zt&&Zt(M)}function on(){Hn.stop()}function so(){Hn.start()}const Hn=new al;Hn.setAnimationLoop(gn),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(M){Zt=M,nt.setAnimationLoop(M),M===null?Hn.stop():Hn.start()},nt.addEventListener("sessionstart",on),nt.addEventListener("sessionend",so),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(U),U=nt.getCamera()),M.isScene===!0&&M.onBeforeRender(x,M,U,I),f=yt.get(M,T.length),f.init(U),T.push(f),J.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),de.setFromProjectionMatrix(J,fn,U.reversedDepth),Y=this.localClippingEnabled,jt=it.init(this.clippingPlanes,Y),m=G.get(M,E.length),m.init(),E.push(m),nt.enabled===!0&&nt.isPresenting===!0){const tt=x.xr.getDepthSensingMesh();tt!==null&&fr(tt,U,-1/0,x.sortObjects)}fr(M,U,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(at,ht),qt=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,qt&&xt.addToRenderList(m,M),this.info.render.frame++,jt===!0&&it.beginShadows();const k=f.state.shadowsArray;vt.render(k,M,U),jt===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){const tt=U.cameras;if(N.length>0)for(let ct=0,pt=tt.length;ct<pt;ct++){const ut=tt[ct];ao(B,N,M,ut)}qt&&xt.render(M);for(let ct=0,pt=tt.length;ct<pt;ct++){const ut=tt[ct];ro(m,M,ut,ut.viewport)}}else N.length>0&&ao(B,N,M,U),qt&&xt.render(M),ro(m,M,U);I!==null&&C===0&&(zt.updateMultisampleRenderTarget(I),zt.updateRenderTargetMipmap(I)),M.isScene===!0&&M.onAfterRender(x,M,U),ot.resetDefaultState(),y=-1,S=null,T.pop(),T.length>0?(f=T[T.length-1],jt===!0&&it.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function fr(M,U,k,B){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)k=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||de.intersectsSprite(M)){B&&Lt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(J);const ct=O.update(M),pt=M.material;pt.visible&&m.push(M,ct,pt,k,Lt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||de.intersectsObject(M))){const ct=O.update(M),pt=M.material;if(B&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Lt.copy(M.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Lt.copy(ct.boundingSphere.center)),Lt.applyMatrix4(M.matrixWorld).applyMatrix4(J)),Array.isArray(pt)){const ut=ct.groups;for(let Rt=0,It=ut.length;Rt<It;Rt++){const Tt=ut[Rt],Wt=pt[Tt.materialIndex];Wt&&Wt.visible&&m.push(M,ct,Wt,k,Lt.z,Tt)}}else pt.visible&&m.push(M,ct,pt,k,Lt.z,null)}}const tt=M.children;for(let ct=0,pt=tt.length;ct<pt;ct++)fr(tt[ct],U,k,B)}function ro(M,U,k,B){const N=M.opaque,tt=M.transmissive,ct=M.transparent;f.setupLightsView(k),jt===!0&&it.setGlobalState(x.clippingPlanes,k),B&&gt.viewport(D.copy(B)),N.length>0&&ms(N,U,k),tt.length>0&&ms(tt,U,k),ct.length>0&&ms(ct,U,k),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function ao(M,U,k,B){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[B.id]===void 0&&(f.state.transmissionRenderTarget[B.id]=new an(1,1,{generateMipmaps:!0,type:Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float")?wn:pn,minFilter:ti,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));const tt=f.state.transmissionRenderTarget[B.id],ct=B.viewport||D;tt.setSize(ct.z*x.transmissionResolutionScale,ct.w*x.transmissionResolutionScale);const pt=x.getRenderTarget(),ut=x.getActiveCubeFace(),Rt=x.getActiveMipmapLevel();x.setRenderTarget(tt),x.getClearColor(q),W=x.getClearAlpha(),W<1&&x.setClearColor(16777215,.5),x.clear(),qt&&xt.render(k);const It=x.toneMapping;x.toneMapping=On;const Tt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),f.setupLightsView(B),jt===!0&&it.setGlobalState(x.clippingPlanes,B),ms(M,k,B),zt.updateMultisampleRenderTarget(tt),zt.updateRenderTargetMipmap(tt),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let ne=0,_e=U.length;ne<_e;ne++){const he=U[ne],re=he.object,At=he.geometry,me=he.material,$t=he.group;if(me.side===Ee&&re.layers.test(B.layers)){const Xe=me.side;me.side=Ge,me.needsUpdate=!0,oo(re,k,B,At,me,$t),me.side=Xe,me.needsUpdate=!0,Wt=!0}}Wt===!0&&(zt.updateMultisampleRenderTarget(tt),zt.updateRenderTargetMipmap(tt))}x.setRenderTarget(pt,ut,Rt),x.setClearColor(q,W),Tt!==void 0&&(B.viewport=Tt),x.toneMapping=It}function ms(M,U,k){const B=U.isScene===!0?U.overrideMaterial:null;for(let N=0,tt=M.length;N<tt;N++){const ct=M[N],pt=ct.object,ut=ct.geometry,Rt=ct.group;let It=ct.material;It.allowOverride===!0&&B!==null&&(It=B),pt.layers.test(k.layers)&&oo(pt,U,k,ut,It,Rt)}}function oo(M,U,k,B,N,tt){M.onBeforeRender(x,U,k,B,N,tt),M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(x,U,k,B,M,tt),N.transparent===!0&&N.side===Ee&&N.forceSinglePass===!1?(N.side=Ge,N.needsUpdate=!0,x.renderBufferDirect(k,U,B,N,M,tt),N.side=kn,N.needsUpdate=!0,x.renderBufferDirect(k,U,B,N,M,tt),N.side=Ee):x.renderBufferDirect(k,U,B,N,M,tt),M.onAfterRender(x,U,k,B,N,tt)}function gs(M,U,k){U.isScene!==!0&&(U=St);const B=_t.get(M),N=f.state.lights,tt=f.state.shadowsArray,ct=N.state.version,pt=V.getParameters(M,N.state,tt,U,k),ut=V.getProgramCacheKey(pt);let Rt=B.programs;B.environment=M.isMeshStandardMaterial?U.environment:null,B.fog=U.fog,B.envMap=(M.isMeshStandardMaterial?xe:we).get(M.envMap||B.environment),B.envMapRotation=B.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Rt===void 0&&(M.addEventListener("dispose",$),Rt=new Map,B.programs=Rt);let It=Rt.get(ut);if(It!==void 0){if(B.currentProgram===It&&B.lightsStateVersion===ct)return lo(M,pt),It}else pt.uniforms=V.getUniforms(M),M.onBeforeCompile(pt,x),It=V.acquireProgram(pt,ut),Rt.set(ut,It),B.uniforms=pt.uniforms;const Tt=B.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Tt.clippingPlanes=it.uniform),lo(M,pt),B.needsLights=El(M),B.lightsStateVersion=ct,B.needsLights&&(Tt.ambientLightColor.value=N.state.ambient,Tt.lightProbe.value=N.state.probe,Tt.directionalLights.value=N.state.directional,Tt.directionalLightShadows.value=N.state.directionalShadow,Tt.spotLights.value=N.state.spot,Tt.spotLightShadows.value=N.state.spotShadow,Tt.rectAreaLights.value=N.state.rectArea,Tt.ltc_1.value=N.state.rectAreaLTC1,Tt.ltc_2.value=N.state.rectAreaLTC2,Tt.pointLights.value=N.state.point,Tt.pointLightShadows.value=N.state.pointShadow,Tt.hemisphereLights.value=N.state.hemi,Tt.directionalShadowMap.value=N.state.directionalShadowMap,Tt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Tt.spotShadowMap.value=N.state.spotShadowMap,Tt.spotLightMatrix.value=N.state.spotLightMatrix,Tt.spotLightMap.value=N.state.spotLightMap,Tt.pointShadowMap.value=N.state.pointShadowMap,Tt.pointShadowMatrix.value=N.state.pointShadowMatrix),B.currentProgram=It,B.uniformsList=null,It}function co(M){if(M.uniformsList===null){const U=M.currentProgram.getUniforms();M.uniformsList=Zs.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function lo(M,U){const k=_t.get(M);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function yl(M,U,k,B,N){U.isScene!==!0&&(U=St),zt.resetTextureUnits();const tt=U.fog,ct=B.isMeshStandardMaterial?U.environment:null,pt=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ii,ut=(B.isMeshStandardMaterial?xe:we).get(B.envMap||ct),Rt=B.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,It=!!k.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Tt=!!k.morphAttributes.position,Wt=!!k.morphAttributes.normal,ne=!!k.morphAttributes.color;let _e=On;B.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(_e=x.toneMapping);const he=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,re=he!==void 0?he.length:0,At=_t.get(B),me=f.state.lights;if(jt===!0&&(Y===!0||M!==S)){const Fe=M===S&&B.id===y;it.setState(B,M,Fe)}let $t=!1;B.version===At.__version?(At.needsLights&&At.lightsStateVersion!==me.state.version||At.outputColorSpace!==pt||N.isBatchedMesh&&At.batching===!1||!N.isBatchedMesh&&At.batching===!0||N.isBatchedMesh&&At.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&At.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&At.instancing===!1||!N.isInstancedMesh&&At.instancing===!0||N.isSkinnedMesh&&At.skinning===!1||!N.isSkinnedMesh&&At.skinning===!0||N.isInstancedMesh&&At.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&At.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&At.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&At.instancingMorph===!1&&N.morphTexture!==null||At.envMap!==ut||B.fog===!0&&At.fog!==tt||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==it.numPlanes||At.numIntersection!==it.numIntersection)||At.vertexAlphas!==Rt||At.vertexTangents!==It||At.morphTargets!==Tt||At.morphNormals!==Wt||At.morphColors!==ne||At.toneMapping!==_e||At.morphTargetsCount!==re)&&($t=!0):($t=!0,At.__version=B.version);let Xe=At.currentProgram;$t===!0&&(Xe=gs(B,U,N));let ri=!1,qe=!1,Gi=!1;const ge=Xe.getUniforms(),Ke=At.uniforms;if(gt.useProgram(Xe.program)&&(ri=!0,qe=!0,Gi=!0),B.id!==y&&(y=B.id,qe=!0),ri||S!==M){gt.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ge.setValue(P,"projectionMatrix",M.projectionMatrix),ge.setValue(P,"viewMatrix",M.matrixWorldInverse);const ze=ge.map.cameraPosition;ze!==void 0&&ze.setValue(P,ft.setFromMatrixPosition(M.matrixWorld)),Dt.logarithmicDepthBuffer&&ge.setValue(P,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&ge.setValue(P,"isOrthographic",M.isOrthographicCamera===!0),S!==M&&(S=M,qe=!0,Gi=!0)}if(N.isSkinnedMesh){ge.setOptional(P,N,"bindMatrix"),ge.setOptional(P,N,"bindMatrixInverse");const Fe=N.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),ge.setValue(P,"boneTexture",Fe.boneTexture,zt))}N.isBatchedMesh&&(ge.setOptional(P,N,"batchingTexture"),ge.setValue(P,"batchingTexture",N._matricesTexture,zt),ge.setOptional(P,N,"batchingIdTexture"),ge.setValue(P,"batchingIdTexture",N._indirectTexture,zt),ge.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&ge.setValue(P,"batchingColorTexture",N._colorsTexture,zt));const je=k.morphAttributes;if((je.position!==void 0||je.normal!==void 0||je.color!==void 0)&&et.update(N,k,Xe),(qe||At.receiveShadow!==N.receiveShadow)&&(At.receiveShadow=N.receiveShadow,ge.setValue(P,"receiveShadow",N.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(Ke.envMap.value=ut,Ke.flipEnvMap.value=ut.isCubeTexture&&ut.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&U.environment!==null&&(Ke.envMapIntensity.value=U.environmentIntensity),qe&&(ge.setValue(P,"toneMappingExposure",x.toneMappingExposure),At.needsLights&&Sl(Ke,Gi),tt&&B.fog===!0&&j.refreshFogUniforms(Ke,tt),j.refreshMaterialUniforms(Ke,B,H,Z,f.state.transmissionRenderTarget[M.id]),Zs.upload(P,co(At),Ke,zt)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Zs.upload(P,co(At),Ke,zt),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&ge.setValue(P,"center",N.center),ge.setValue(P,"modelViewMatrix",N.modelViewMatrix),ge.setValue(P,"normalMatrix",N.normalMatrix),ge.setValue(P,"modelMatrix",N.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Fe=B.uniformsGroups;for(let ze=0,pr=Fe.length;ze<pr;ze++){const Gn=Fe[ze];kt.update(Gn,Xe),kt.bind(Gn,Xe)}}return Xe}function Sl(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function El(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(M,U,k){const B=_t.get(M);B.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),_t.get(M.texture).__webglTexture=U,_t.get(M.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:k,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){const k=_t.get(M);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};const Tl=P.createFramebuffer();this.setRenderTarget=function(M,U=0,k=0){I=M,b=U,C=k;let B=!0,N=null,tt=!1,ct=!1;if(M){const ut=_t.get(M);if(ut.__useDefaultFramebuffer!==void 0)gt.bindFramebuffer(P.FRAMEBUFFER,null),B=!1;else if(ut.__webglFramebuffer===void 0)zt.setupRenderTarget(M);else if(ut.__hasExternalTextures)zt.rebindTextures(M,_t.get(M.texture).__webglTexture,_t.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Tt=M.depthTexture;if(ut.__boundDepthTexture!==Tt){if(Tt!==null&&_t.has(Tt)&&(M.width!==Tt.image.width||M.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");zt.setupDepthRenderbuffer(M)}}const Rt=M.texture;(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)&&(ct=!0);const It=_t.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(It[U])?N=It[U][k]:N=It[U],tt=!0):M.samples>0&&zt.useMultisampledRTT(M)===!1?N=_t.get(M).__webglMultisampledFramebuffer:Array.isArray(It)?N=It[k]:N=It,D.copy(M.viewport),F.copy(M.scissor),z=M.scissorTest}else D.copy(Et).multiplyScalar(H).floor(),F.copy(Vt).multiplyScalar(H).floor(),z=ae;if(k!==0&&(N=Tl),gt.bindFramebuffer(P.FRAMEBUFFER,N)&&B&&gt.drawBuffers(M,N),gt.viewport(D),gt.scissor(F),gt.setScissorTest(z),tt){const ut=_t.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,ut.__webglTexture,k)}else if(ct){const ut=U;for(let Rt=0;Rt<M.textures.length;Rt++){const It=_t.get(M.textures[Rt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Rt,It.__webglTexture,k,ut)}}else if(M!==null&&k!==0){const ut=_t.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ut.__webglTexture,k)}y=-1},this.readRenderTargetPixels=function(M,U,k,B,N,tt,ct,pt=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ut=_t.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(ut=ut[ct]),ut){gt.bindFramebuffer(P.FRAMEBUFFER,ut);try{const Rt=M.textures[pt],It=Rt.format,Tt=Rt.type;if(!Dt.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-B&&k>=0&&k<=M.height-N&&(M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+pt),P.readPixels(U,k,B,N,Mt.convert(It),Mt.convert(Tt),tt))}finally{const Rt=I!==null?_t.get(I).__webglFramebuffer:null;gt.bindFramebuffer(P.FRAMEBUFFER,Rt)}}},this.readRenderTargetPixelsAsync=async function(M,U,k,B,N,tt,ct,pt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ut=_t.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(ut=ut[ct]),ut)if(U>=0&&U<=M.width-B&&k>=0&&k<=M.height-N){gt.bindFramebuffer(P.FRAMEBUFFER,ut);const Rt=M.textures[pt],It=Rt.format,Tt=Rt.type;if(!Dt.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Wt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Wt),P.bufferData(P.PIXEL_PACK_BUFFER,tt.byteLength,P.STREAM_READ),M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+pt),P.readPixels(U,k,B,N,Mt.convert(It),Mt.convert(Tt),0);const ne=I!==null?_t.get(I).__webglFramebuffer:null;gt.bindFramebuffer(P.FRAMEBUFFER,ne);const _e=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Hh(P,_e,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Wt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,tt),P.deleteBuffer(Wt),P.deleteSync(_e),tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,k=0){const B=Math.pow(2,-k),N=Math.floor(M.image.width*B),tt=Math.floor(M.image.height*B),ct=U!==null?U.x:0,pt=U!==null?U.y:0;zt.setTexture2D(M,0),P.copyTexSubImage2D(P.TEXTURE_2D,k,0,0,ct,pt,N,tt),gt.unbindTexture()};const bl=P.createFramebuffer(),wl=P.createFramebuffer();this.copyTextureToTexture=function(M,U,k=null,B=null,N=0,tt=null){tt===null&&(N!==0?(ls("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),tt=N,N=0):tt=0);let ct,pt,ut,Rt,It,Tt,Wt,ne,_e;const he=M.isCompressedTexture?M.mipmaps[tt]:M.image;if(k!==null)ct=k.max.x-k.min.x,pt=k.max.y-k.min.y,ut=k.isBox3?k.max.z-k.min.z:1,Rt=k.min.x,It=k.min.y,Tt=k.isBox3?k.min.z:0;else{const je=Math.pow(2,-N);ct=Math.floor(he.width*je),pt=Math.floor(he.height*je),M.isDataArrayTexture?ut=he.depth:M.isData3DTexture?ut=Math.floor(he.depth*je):ut=1,Rt=0,It=0,Tt=0}B!==null?(Wt=B.x,ne=B.y,_e=B.z):(Wt=0,ne=0,_e=0);const re=Mt.convert(U.format),At=Mt.convert(U.type);let me;U.isData3DTexture?(zt.setTexture3D(U,0),me=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(zt.setTexture2DArray(U,0),me=P.TEXTURE_2D_ARRAY):(zt.setTexture2D(U,0),me=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const $t=P.getParameter(P.UNPACK_ROW_LENGTH),Xe=P.getParameter(P.UNPACK_IMAGE_HEIGHT),ri=P.getParameter(P.UNPACK_SKIP_PIXELS),qe=P.getParameter(P.UNPACK_SKIP_ROWS),Gi=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,he.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,he.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Rt),P.pixelStorei(P.UNPACK_SKIP_ROWS,It),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Tt);const ge=M.isDataArrayTexture||M.isData3DTexture,Ke=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){const je=_t.get(M),Fe=_t.get(U),ze=_t.get(je.__renderTarget),pr=_t.get(Fe.__renderTarget);gt.bindFramebuffer(P.READ_FRAMEBUFFER,ze.__webglFramebuffer),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,pr.__webglFramebuffer);for(let Gn=0;Gn<ut;Gn++)ge&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,_t.get(M).__webglTexture,N,Tt+Gn),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,_t.get(U).__webglTexture,tt,_e+Gn)),P.blitFramebuffer(Rt,It,ct,pt,Wt,ne,ct,pt,P.DEPTH_BUFFER_BIT,P.NEAREST);gt.bindFramebuffer(P.READ_FRAMEBUFFER,null),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(N!==0||M.isRenderTargetTexture||_t.has(M)){const je=_t.get(M),Fe=_t.get(U);gt.bindFramebuffer(P.READ_FRAMEBUFFER,bl),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,wl);for(let ze=0;ze<ut;ze++)ge?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,je.__webglTexture,N,Tt+ze):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,je.__webglTexture,N),Ke?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Fe.__webglTexture,tt,_e+ze):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Fe.__webglTexture,tt),N!==0?P.blitFramebuffer(Rt,It,ct,pt,Wt,ne,ct,pt,P.COLOR_BUFFER_BIT,P.NEAREST):Ke?P.copyTexSubImage3D(me,tt,Wt,ne,_e+ze,Rt,It,ct,pt):P.copyTexSubImage2D(me,tt,Wt,ne,Rt,It,ct,pt);gt.bindFramebuffer(P.READ_FRAMEBUFFER,null),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Ke?M.isDataTexture||M.isData3DTexture?P.texSubImage3D(me,tt,Wt,ne,_e,ct,pt,ut,re,At,he.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(me,tt,Wt,ne,_e,ct,pt,ut,re,he.data):P.texSubImage3D(me,tt,Wt,ne,_e,ct,pt,ut,re,At,he):M.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,tt,Wt,ne,ct,pt,re,At,he.data):M.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,tt,Wt,ne,he.width,he.height,re,he.data):P.texSubImage2D(P.TEXTURE_2D,tt,Wt,ne,ct,pt,re,At,he);P.pixelStorei(P.UNPACK_ROW_LENGTH,$t),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Xe),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ri),P.pixelStorei(P.UNPACK_SKIP_ROWS,qe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Gi),tt===0&&U.generateMipmaps&&P.generateMipmap(me),gt.unbindTexture()},this.initRenderTarget=function(M){_t.get(M).__webglFramebuffer===void 0&&zt.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?zt.setTextureCube(M,0):M.isData3DTexture?zt.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?zt.setTexture2DArray(M,0):zt.setTexture2D(M,0),gt.unbindTexture()},this.resetState=function(){b=0,C=0,I=null,gt.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}const $r=new Map;function io(r){const t=document.createElement("canvas");return t.width=t.height=r,t}function Ve(r,{repeat:t=1,srgb:e=!0,aniso:n=8}={}){const i=new ds(r);return i.wrapS=i.wrapT=Di,i.repeat.set(t,t),i.anisotropy=n,e&&(i.colorSpace=Re),i.needsUpdate=!0,i}function We(r,t){return $r.has(r)||$r.set(r,t()),$r.get(r)}function zn(r,t){const e=io(r),n=e.getContext("2d"),i=n.createImageData(r,r),s=i.data;for(let a=0;a<r;a++)for(let o=0;o<r;o++){const c=(a*r+o)*4,l=t(o,a,r);s[c]=l[0],s[c+1]=l[1],s[c+2]=l[2],s[c+3]=l[3]??255}return n.putImageData(i,0,0),e}function dr(r,t,e=2.4){const n=new Float32Array(r*r);for(let s=0;s<r;s++)for(let a=0;a<r;a++)n[s*r+a]=t(a,s,r);const i=(s,a)=>n[(a+r)%r*r+(s+r)%r];return zn(r,(s,a)=>{const o=(i(s-1,a)-i(s+1,a))*e,c=(i(s,a-1)-i(s,a+1))*e,l=Math.hypot(o,c,1);return[(o/l*.5+.5)*255,(c/l*.5+.5)*255,(1/l*.5+.5)*255]})}const ul=(r,t,e)=>{const n=r/e*5.5,i=t/e*1.6,s=Se(n*.7,i*2.2,31,3)*.9,a=Math.abs(or(n*7+s*3,i*1.3,77)),o=Math.pow(1-Math.abs(Se(n*3.1,i*9,903,4)),5),c=Se(n*26,i*26,5,2)*.14;return Ot(a*.75+o*.6+c)};function l0(){return We("bark",()=>Ve(zn(512,(r,t,e)=>{const n=ul(r,t,e),i=Ot(Se(r/e*4,t/e*2.4,411,3)*1.5-.35);let s=86+n*74,a=74+n*64,o=58+n*48;return s-=i*24,a+=i*30,o-=i*6,[s,a,o]}),{repeat:1}))}function h0(){return We("barkN",()=>Ve(dr(512,ul,3),{srgb:!1}))}const dl=(r,t,e)=>{const n=r/e*8,i=t/e*8,s=Se(n*1.4,i*1.4,12,4)*.5+.5,a=Math.pow(Math.abs(or(n*11,i*3.3,88)),3)*.5,o=Se(n*40,i*40,3,2)*.25+.25;return Ot(s*.6+a+o*.4)};function u0(){return We("ground",()=>Ve(zn(512,(r,t,e)=>{const n=r/e*8,i=t/e*8,s=dl(r,t,e),a=Ot(Se(n*2.6,i*2.6,202,4)*1.3+.35),o=Ot(Se(n*.8,i*.8,55,3)+.5);let c=52+o*44+a*52+s*30,l=47+o*40+a*38+s*27,h=36+o*26+a*17+s*20;return Se(n*18,i*18,707,2)>.62&&(c+=56,l+=54,h+=50),[c,l,h]}),{repeat:1}))}function d0(){return We("groundN",()=>Ve(dr(512,dl,2),{srgb:!1}))}const fl=(r,t,e)=>{const i=t/e*6,s=Math.floor(i),a=i-s,o=a<.06||a>.94?0:1,c=Math.abs(or(r/e*14+s*9.1,i*3,61))*.5+.4;return Ot(o*c)};function Js(){return We("plank",()=>Ve(zn(512,(r,t,e)=>{const n=fl(r,t,e),i=Ot(Se(r/e*5,t/e*5,313,3)+.4),s=26+n*(92+i*40),a=23+n*(76+i*30),o=18+n*(58+i*18);return[s,a,o]})))}function Qs(){return We("plankN",()=>Ve(dr(512,fl,3.4),{srgb:!1}))}const pl=(r,t,e)=>{const n=r/e*6,i=t/e*6,s=Math.pow(Ot(Se(n*9,i*9,141,3)+.5),2),a=Math.pow(1-Math.abs(Se(n*2.2,i*2.2,902,4)),8);return Ot(.55+s*.3-a*.75)};function ml(){return We("concrete",()=>Ve(zn(512,(r,t,e)=>{const n=pl(r,t,e),i=Ot(Se(r/e*3,t/e*3,66,4)+.5),s=70+n*96-i*26;return[s*1.02,s,s*.95]})))}function gl(){return We("concreteN",()=>Ve(dr(512,pl,1.6),{srgb:!1}))}function _l(){return We("rust",()=>Ve(zn(256,(r,t,e)=>{const n=r/e*6,i=t/e*6,s=Ot(Se(n*2.4,i*2.4,480,4)*1.4+.5),o=62+(Se(n*22,i*22,9,2)*.5+.5)*34;return[o+s*112,o+s*52,o+s*20]})))}function f0(r=1){return We(`foliage${r}`,()=>{const e=io(256),n=e.getContext("2d"),i=Bn(r*7717+13);n.clearRect(0,0,256,256);for(let a=0;a<5;a++){const o=i.range(.15,.85)*256,c=i.range(.55,1)*256,l=i.range(-1.2,1.2)-Math.PI/2,h=i.range(.35,.62)*256;for(let u=0;u<190;u++){const d=u/190,p=o+Math.cos(l)*h*d+i.range(-9,9),g=c+Math.sin(l)*h*d+i.range(-9,9),_=(1-d)*22+6,m=i.range(0,Math.PI*2),f=i.range(6,15),E=i.range(0,1);n.strokeStyle=`rgba(${18+E*26}, ${30+E*40}, ${16+E*20}, ${i.range(.5,.95)})`,n.lineWidth=i.range(.8,1.9),n.beginPath(),n.moveTo(p+Math.cos(m)*_*.2,g+Math.sin(m)*_*.2),n.lineTo(p+Math.cos(m)*(_*.2+f),g+Math.sin(m)*(_*.2+f)),n.stroke()}}return Ve(e,{repeat:1})})}function Un(r,t,e,n,i,s,a=1){r.strokeStyle="rgba(14,12,10,0.86)";for(let o=0;o<s;o++){const c=n+o*15;let l=e+t.range(0,8);const h=e+i-t.range(0,i*.42);for(r.lineWidth=t.range(1.1,2.3),r.beginPath(),r.moveTo(l,c);l<h;){const u=t.range(4,11);r.quadraticCurveTo(l+u*.5,c+t.range(-7,7)*a,l+u,c+t.range(-2.5,2.5)*a),l+=u}r.stroke()}}function p0(r){return We(`frag${r}`,()=>{const n=document.createElement("canvas");n.width=384,n.height=512;const i=n.getContext("2d"),s=Bn(9001+r*131);i.fillStyle="#d8d2bf",i.fillRect(0,0,384,512);for(let o=0;o<2600;o++){const c=s.range(1,5);i.fillStyle=`rgba(${s.int(120,190)},${s.int(105,170)},${s.int(80,135)},${s.range(.02,.14)})`,i.fillRect(s.range(0,384),s.range(0,512),c,c)}const a=i.createRadialGradient(384/2,512/2,512*.25,384/2,512/2,512*.68);switch(a.addColorStop(0,"rgba(0,0,0,0)"),a.addColorStop(1,"rgba(58,44,26,0.55)"),i.fillStyle=a,i.fillRect(0,0,384,512),i.save(),i.translate(384/2,512/2),i.rotate(s.range(-.03,.03)),i.translate(-384/2,-512/2),r){case 0:{Un(i,s,40,62,300,2),i.fillStyle="rgba(20,18,16,0.9)",i.fillRect(176,150,30,190),i.beginPath(),i.ellipse(191,138,24,30,0,0,7),i.fill(),i.strokeStyle="rgba(20,18,16,0.9)",i.lineWidth=7,i.beginPath(),i.moveTo(176,180),i.lineTo(112,300),i.moveTo(206,180),i.lineTo(272,300),i.moveTo(182,340),i.lineTo(168,452),i.moveTo(200,340),i.lineTo(216,452),i.stroke(),i.font="bold 27px monospace",i.fillStyle="rgba(18,16,14,0.92)",i.fillText("NO FACE",122,486);break}case 1:{Un(i,s,40,56,300,1),i.strokeStyle="rgba(20,18,16,0.88)",i.lineWidth=3.4;for(let o=0;o<9;o++)for(let c=0;c<5;c++){const l=44+c*62,h=110+o*42;for(let u=0;u<4;u++)i.beginPath(),i.moveTo(l+u*9,h),i.lineTo(l+u*9+s.range(-3,3),h+26),i.stroke();i.beginPath(),i.moveTo(l-4,h+24),i.lineTo(l+34,h+2),i.stroke()}i.font="bold 24px monospace",i.fillStyle="rgba(120,20,12,0.9)",i.fillText("AND ME",240,494);break}case 2:{i.strokeStyle="rgba(24,20,16,0.75)",i.lineWidth=2,i.strokeRect(48,96,288,320);for(let o=0;o<46;o++){const c=s.range(60,324),l=s.range(108,404);i.beginPath(),i.moveTo(c,l+7),i.lineTo(c+5,l-7),i.lineTo(c+10,l+7),i.closePath(),i.stroke()}i.setLineDash([8,6]),i.strokeStyle="rgba(120,20,12,0.85)",i.lineWidth=3,i.beginPath(),i.moveTo(70,390);for(let o=0;o<7;o++)i.lineTo(s.range(70,320),390-o*42);i.stroke(),i.setLineDash([]),Un(i,s,48,56,288,2),i.font="bold 21px monospace",i.fillStyle="rgba(120,20,12,0.9)",i.fillText("THE PATH LOOPS",92,452);break}case 3:{i.font="bold 19px monospace";for(let o=0;o<22;o++)for(let c=0;c<3;c++){const l=.28+o/22*.66;i.fillStyle=`rgba(20,18,16,${l})`,i.save(),i.translate(30+c*118,70+o*20),i.rotate(s.range(-.05,.05)*(o/8)),i.fillText("DON'T LOOK",0,0),i.restore()}break}case 4:{i.strokeStyle="rgba(22,19,16,0.85)",i.lineWidth=4,i.strokeRect(112,120,160,280),i.beginPath(),i.arc(248,262,7,0,7),i.stroke();for(let o=0;o<5;o++)i.lineWidth=s.range(1,2.6),i.beginPath(),i.moveTo(s.range(120,264),s.range(140,380)),i.lineTo(s.range(120,264),s.range(140,380)),i.stroke();Un(i,s,44,60,296,2),i.font="bold 23px monospace",i.fillStyle="rgba(20,18,16,0.9)",i.fillText("IT KNOCKS BACK",74,446);break}case 5:{for(let o=0;o<26;o++){const c=s.range(56,328),l=s.range(110,400),h=s.range(16,34),u=h*s.range(.42,.66);i.strokeStyle=`rgba(20,18,16,${s.range(.5,.9)})`,i.lineWidth=2.2,i.beginPath(),i.ellipse(c,l,h,u,s.range(-.3,.3),0,7),i.stroke(),i.fillStyle="rgba(20,18,16,0.85)",i.beginPath(),i.arc(c,l,u*.42,0,7),i.fill()}Un(i,s,44,62,296,2),i.font="bold 25px monospace",i.fillStyle="rgba(120,20,12,0.9)",i.fillText("ALL OF THEM MINE",52,452);break}case 6:{Un(i,s,40,70,304,12,.7),i.fillStyle="#d8d2bf",i.fillRect(36,250,312,54),i.font="bold 22px monospace",i.fillStyle="rgba(20,18,16,0.94)",i.fillText("EIGHT AND THEN",66,274),i.fillText("IT STOPS HIDING",60,298),Un(i,s,40,330,304,9,.7);break}default:{i.fillStyle="rgba(96,18,12,0.62)",i.beginPath(),i.ellipse(192,300,62,74,0,0,7),i.fill();const o=[[-52,-70],[-20,-104],[14,-108],[46,-86],[70,-18]];for(const[c,l]of o)i.beginPath(),i.ellipse(192+c*.85,300+l*.9,15,40,Math.atan2(l,c)+Math.PI/2,0,7),i.fill();Un(i,s,44,64,296,2),i.font="bold 24px monospace",i.fillStyle="rgba(20,18,16,0.9)",i.fillText("COUNT THEM",108,470);break}}i.restore(),i.strokeStyle="rgba(90,74,50,0.28)",i.lineWidth=2;for(let o=0;o<3;o++){const c=s.range(60,452);i.beginPath(),i.moveTo(0,c),i.lineTo(384,c+s.range(-10,10)),i.stroke()}return Ve(n,{repeat:1})})}function m0(){return We("sign",()=>{const r=io(256),t=r.getContext("2d");t.fillStyle="#b8ad3c",t.fillRect(0,0,256,256),t.fillStyle="#171512",t.font="bold 46px monospace",t.textAlign="center",t.fillText("DO NOT",128,108),t.fillText("ENTER",128,158),t.fillRect(20,186,216,6);for(let e=0;e<900;e++)t.fillStyle=`rgba(${80+Math.random()*60},${40+Math.random()*30},20,${Math.random()*.28})`,t.fillRect(Math.random()*256,Math.random()*256,Math.random()*7,Math.random()*7);return Ve(r,{repeat:1})})}function g0(){return We("pale",()=>Ve(zn(256,(r,t,e)=>{const n=r/e*4,i=t/e*4,s=Math.pow(1-Math.abs(Se(n*3,i*3,1337,4)),9),o=158+(Se(n*7,i*7,21,3)*.5+.5)*30;return[o-s*46,o-s*60,o-s*52]})))}function _0(){return We("static",()=>{const r=Ve(zn(256,()=>{const t=Math.random()*255;return[t,t,t]}),{srgb:!1,aniso:1});return r.minFilter=Be,r.magFilter=Be,r})}const za=260,bt=za/2;class v0{constructor(t){this.seed=t;const e=168,n=new Je(za,za,e,e);n.rotateX(-Math.PI/2);const i=n.attributes.position;for(let o=0;o<i.count;o++){const c=i.getX(o),l=i.getZ(o);i.setY(o,this.heightAt(c,l))}n.computeVertexNormals();const s=u0(),a=d0();s.repeat.set(34,34),a.repeat.set(34,34),this.mesh=new K(n,new Gt({map:s,normalMap:a,normalScale:new wt(1.3,1.3),roughness:.94,metalness:0,color:16777215})),this.mesh.receiveShadow=!0,this.mesh.name="terrain"}heightAt(t,e){const n=this.seed;let i=0;i+=Se(t*.0075,e*.0075,n,4)*7.5,i+=Se(t*.028,e*.028,n+991,3)*1.7,i+=Se(t*.11,e*.11,n+7717,2)*.32;const s=Math.hypot(t,e)/bt;i-=(1-Math.min(1,s))*1.9;const a=Math.max(Math.abs(t),Math.abs(e))/bt;return a>.82&&(i+=Math.pow((a-.82)/.18,2)*9),i}normalAt(t,e,n=new R){const s=this.heightAt(t-.6,e),a=this.heightAt(t+.6,e),o=this.heightAt(t,e-.6),c=this.heightAt(t,e+.6);return n.set(s-a,2*.6,o-c).normalize()}slopeAt(t,e){return 1-this.normalAt(t,e).y}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const ar={uWindTime:{value:0},uWindStrength:{value:1}};function hs(r,{amount:t=.22,stiffness:e=1.4}={}){return r.onBeforeCompile=n=>{n.uniforms.uWindTime=ar.uWindTime,n.uniforms.uWindStrength=ar.uWindStrength,n.uniforms.uWindAmount={value:t},n.uniforms.uWindStiff={value:e},n.vertexShader=n.vertexShader.replace("#include <common>",`
        #include <common>
        uniform float uWindTime;
        uniform float uWindStrength;
        uniform float uWindAmount;
        uniform float uWindStiff;
        `).replace("#include <begin_vertex>",`
        #include <begin_vertex>
        {
          // World position of this instance, so neighbouring plants are out of
          // phase with each other instead of swaying as one rigid sheet.
          #ifdef USE_INSTANCING
            vec3 instOrigin = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 instOrigin = vec3(modelMatrix[3][0], modelMatrix[3][1], modelMatrix[3][2]);
          #endif

          // Only the parts above the root move, and the tips move most.
          float h = max(transformed.y, 0.0);
          float bend = pow(h, uWindStiff) * uWindAmount * uWindStrength;

          float t = uWindTime;
          float seed = instOrigin.x * 0.37 + instOrigin.z * 0.53;

          // A slow gust front travelling across the map, plus fast flutter.
          float gust = 0.55 + 0.45 * sin(t * 0.31 + instOrigin.x * 0.045 + instOrigin.z * 0.031);
          float flutter = sin(t * 2.1 + seed) * 0.7 + sin(t * 4.7 + seed * 1.9) * 0.3;

          transformed.x += bend * gust * flutter;
          transformed.z += bend * gust * flutter * 0.45;
          // Bending shortens the plant slightly — keeps it from stretching.
          transformed.y -= bend * abs(flutter) * 0.16;
        }
        `)},r.needsUpdate=!0,r.customProgramCacheKey=()=>`wind-${t}-${e}`,r}const yi=8;class x0{constructor(t,e,n){this.terrain=t,this.trees=[],this.grid=new Map,this.group=new Yt,this.group.name="forest",n.add(this.group),this._plan(e),this._build(e)}_plan(t){for(let i=0;i<1500*3&&this.trees.length<1500;i++){const s=t.range(-bt+4,bt-4),a=t.range(-bt+4,bt-4);if(Math.hypot(s,a)<9||this.terrain.slopeAt(s,a)>.42)continue;const o=.5+.5*Math.sin(s*.045)*Math.cos(a*.041),l=Math.max(Math.abs(s),Math.abs(a))/bt>.78?1:0;if(!l&&t()>.34+o*.5)continue;const h=t.range(.26,.62)*(l?1.1:1);let u=!1;for(const g of this._near(s,a,3.2))if((g.x-s)**2+(g.z-a)**2<(h+g.r+1.5)**2){u=!0;break}if(u)continue;const d=t()<.62,p={x:s,z:a,r:h,h:t.range(d?12:9,d?26:19),dead:d,lean:t.range(0,Math.PI*2),leanAmt:t.range(0,d?.13:.05)};this._insert(p,this.trees.length),this.trees.push(p)}}_key(t,e){return t*4096+e}_insert(t,e){const n=Math.floor(t.x/yi),i=Math.floor(t.z/yi),s=this._key(n,i);let a=this.grid.get(s);a||this.grid.set(s,a=[]),a.push(e)}_near(t,e,n){const i=[],s=Math.floor((t-n)/yi),a=Math.floor((t+n)/yi),o=Math.floor((e-n)/yi),c=Math.floor((e+n)/yi);for(let l=s;l<=a;l++)for(let h=o;h<=c;h++){const u=this.grid.get(this._key(l,h));if(u)for(const d of u)i.push(this.trees[d])}return i}_build(t){const e=l0(),n=h0();e.repeat.set(2,5),n.repeat.set(2,5);const i=new Gt({map:e,normalMap:n,normalScale:new wt(1.5,1.5),roughness:.95,metalness:0,color:16777215}),s=new le(.62,1,1,7,1,!0);s.translate(0,.5,0);const a=new le(.06,.17,1,5,1,!0);a.translate(0,.5,0);const o=new fs(1,1,9,2);o.translate(0,.5,0);const c=new Gt({color:3953460,roughness:1,metalness:0,flatShading:!0});hs(c,{amount:.09,stiffness:2.6});let l=0,h=0;for(const _ of this.trees)_.branches=_.dead?3+Math.floor(t()*4):0,_.canopies=_.dead?0:3,l+=_.branches,h+=_.canopies;this.trunks=new Ti(s,i,this.trees.length),this.branches=new Ti(a,i,l),this.canopies=new Ti(o,c,h);for(const _ of[this.trunks,this.branches,this.canopies])_.castShadow=!0,_.receiveShadow=!0,_.frustumCulled=!1,this.group.add(_);const u=new ue,d=new Nt;let p=0,g=0;this.trees.forEach((_,m)=>{const f=this.terrain.heightAt(_.x,_.z);_.y=f,u.position.set(_.x,f-.4,_.z),u.rotation.set(Math.cos(_.lean)*_.leanAmt,t.range(0,Math.PI*2),Math.sin(_.lean)*_.leanAmt),u.scale.set(_.r,_.h,_.r),u.updateMatrix(),this.trunks.setMatrixAt(m,u.matrix);const E=.62+t()*.55;this.trunks.setColorAt(m,d.setRGB(E,E*.97,E*.9));for(let T=0;T<_.branches;T++){const x=.45+T/Math.max(1,_.branches)*.5,A=t.range(0,Math.PI*2),b=_.h*t.range(.16,.34);u.position.set(_.x,f+_.h*x,_.z),u.rotation.set(0,0,0),u.rotateY(A),u.rotateZ(t.range(.75,1.35)),u.scale.set(_.r*1.5,b,_.r*1.5),u.updateMatrix(),this.branches.setMatrixAt(p,u.matrix),this.branches.setColorAt(p,d.setRGB(E*.8,E*.78,E*.72)),p++}for(let T=0;T<_.canopies;T++){const x=.34+T*.22,A=_.r*(7.2-T*1.7);u.position.set(_.x,f+_.h*x,_.z),u.rotation.set(0,t.range(0,Math.PI*2),0),u.scale.set(A,_.h*(.46-T*.06),A),u.updateMatrix(),this.canopies.setMatrixAt(g,u.matrix);const b=.7+t()*.6;this.canopies.setColorAt(g,d.setRGB(b*.8,b,b*.75)),g++}}),this.trunks.instanceMatrix.needsUpdate=!0,this.branches.instanceMatrix.needsUpdate=!0,this.canopies.instanceMatrix.needsUpdate=!0,this._buildUndergrowth(t)}_buildUndergrowth(t){const n=new Je(1,1);n.translate(0,.5,0);const i=[];for(let f=0;f<2;f++){const E=n.clone();E.rotateY(f*Math.PI/2),i.push(E)}const s=new Ce,a=i[0].attributes.position.array,o=i[1].attributes.position.array,c=i[0].attributes.uv.array,l=i[0].attributes.normal.array,h=i[1].attributes.normal.array;s.setAttribute("position",new ee([...a,...o],3)),s.setAttribute("normal",new ee([...l,...h],3)),s.setAttribute("uv",new ee([...c,...c],2));const u=[...i[0].index.array];s.setIndex([...u,...u.map(f=>f+4)]),i.forEach(f=>f.dispose()),n.dispose();const d=new Gt({map:f0(3),transparent:!0,alphaTest:.42,side:Ee,roughness:1,metalness:0,color:13160372});hs(d,{amount:.26,stiffness:1.3});const p=new Ti(s,d,1100);p.frustumCulled=!1,p.receiveShadow=!0;const g=new ue,_=new Nt;let m=0;for(let f=0;f<1100*4&&m<1100;f++){const E=t.range(-bt+3,bt-3),T=t.range(-bt+3,bt-3);if(this.terrain.slopeAt(E,T)>.5)continue;const x=t.range(.9,2.6);g.position.set(E,this.terrain.heightAt(E,T)-.15,T),g.rotation.set(0,t.range(0,Math.PI*2),0),g.scale.set(x*t.range(.8,1.3),x,x),g.updateMatrix(),p.setMatrixAt(m,g.matrix);const A=.55+t()*.7;p.setColorAt(m,_.setRGB(A*.9,A,A*.7)),m++}p.count=m,p.instanceMatrix.needsUpdate=!0,this.undergrowth=p,this.group.add(p)}resolveCollision(t,e){for(const n of this._near(t.x,t.z,e+2)){const i=t.x-n.x,s=t.z-n.z,a=e+n.r*.92,o=i*i+s*s;if(o<a*a&&o>1e-6){const c=Math.sqrt(o),l=(a-c)/c;t.x+=i*l,t.z+=s*l}}return t}hasLineOfSight(t,e){const n=e.x-t.x,i=e.z-t.z,s=Math.hypot(n,i);if(s<.6)return!0;const a=Math.min(64,Math.max(6,Math.ceil(s/1.6)));for(let o=1;o<a;o++){const c=o/a,l=t.x+n*c,h=t.z+i*c;for(const u of this._near(l,h,1.4)){const d=l-u.x,p=h-u.z;if(d*d+p*p<u.r*u.r*1.05)return!1}}return!0}findOpenSpot(t,{minRadius:e=0,maxRadius:n=bt-12,clearance:i=2.4,tries:s=90}={}){for(let a=0;a<s;a++){const o=t()*Math.PI*2,c=e+Math.sqrt(t())*(n-e),l=Math.cos(o)*c,h=Math.sin(o)*c;if(Math.abs(l)>bt-10||Math.abs(h)>bt-10||this.terrain.slopeAt(l,h)>.35)continue;let u=!0;for(const d of this._near(l,h,i+1))if((d.x-l)**2+(d.z-h)**2<(d.r+i)**2){u=!1;break}if(u)return new R(l,this.terrain.heightAt(l,h),h)}return new R(0,this.terrain.heightAt(0,0),0)}nearestTree(t,e,n=12){let i=null,s=n*n;for(const a of this._near(t,e,n)){const o=(a.x-t)**2+(a.z-e)**2;o<s&&(s=o,i=a)}return i}dispose(){for(const t of[this.trunks,this.branches,this.canopies,this.undergrowth])t&&(t.geometry.dispose(),t.material.dispose())}}class M0{constructor(t,e,n,i){this.terrain=t,this.forest=e,this.group=new Yt,this.group.name="props",i.add(this.group),this.segments=[],this.circles=[],this.anchors=[],this.landmarks=[],this.mats={plank:new Gt({map:Js(),normalMap:Qs(),normalScale:new wt(1.2,1.2),roughness:.95,metalness:0,color:16777215}),concrete:new Gt({map:ml(),normalMap:gl(),roughness:.9,metalness:0,color:16777215}),rust:new Gt({map:_l(),roughness:.82,metalness:.35,color:16777215}),dark:new Gt({color:657932,roughness:1}),sign:new Gt({map:m0(),roughness:.8,side:Ee})};for(const s of Object.values(this.mats))s.map&&(s.map.wrapS=s.map.wrapT=Di);this._populate(n)}_populate(t){const e=[],n=(i,s,a=12)=>{for(let c=0;c<60;c++){const l=this.forest.findOpenSpot(t,{minRadius:i,maxRadius:s,clearance:3});if(e.every(h=>h.distanceTo(l)>a))return e.push(l),l}const o=this.forest.findOpenSpot(t,{minRadius:i,maxRadius:s,clearance:3});return e.push(o),o};this._chapel(n(38,bt-44,46),t),this._silo(n(38,bt-44,46),t),this._brickMaze(n(30,bt-46,44),t),this._brickMaze(n(30,bt-46,44),t),this._truck(n(26,bt-40,30),t),this._depot(n(26,bt-40,30),t),this._graves(n(26,bt-40,30),t),this._well(n(20,bt-40,26),t),this._shed(n(26,bt-42,32),t);for(let i=0;i<7;i++)this._fenceRun(t);for(let i=0;i<46;i++)this._rock(t);for(let i=0;i<24;i++)this._log(t);for(let i=0;i<9;i++)this._sign(t);this._perimeter()}_seg(t,e,n,i,s=.5,a=!0){this.segments.push({x1:t,z1:e,x2:n,z2:i,r:s,tall:a})}_circle(t,e,n){this.circles.push({x:t,z:e,r:n})}_wallAnchors(t,e,n,i,s,a){const o=Math.cos(i+Math.PI/2),c=Math.sin(i+Math.PI/2);for(const l of[1,-1]){const h=.34*l;this.anchors.push({position:new R(t+o*h,e,n+c*h),normal:new R(o*l,0,c*l),name:a})}}_wall(t,e,n,i,s,a,o,c="wall"){const l=this.terrain.heightAt(t,e),h=new Ct(i,s,a),u=new K(h,o);u.position.set(t,l+s/2-.35,e),u.rotation.y=n,u.castShadow=u.receiveShadow=!0,this.group.add(u);const d=Math.cos(n)*i*.5,p=-Math.sin(n)*i*.5;return this._seg(t-d,e-p,t+d,e+p,a*.5+.3,s>2),this._wallAnchors(t,l+Math.min(s*.55,1.9),e,-n,i,c),u}_chapel(t,e){const{x:n,z:i}=t,s=this.terrain.heightAt(n,i),a=e.range(0,Math.PI*2),o=new Yt;o.position.set(n,0,i),this.landmarks.push({name:"THE CHAPEL",position:new R(n,s,i)});const c=11,l=15,h=5.4,u=this.mats.concrete;this._wall(n+Math.cos(a)*(l/2),i-Math.sin(a)*(l/2),a+Math.PI/2,c,h,.6,u,"chapel"),this._wall(n-Math.cos(a)*(l/2),i+Math.sin(a)*(l/2),a+Math.PI/2,c*.32,h,.6,u,"chapel");const d=Math.cos(a+Math.PI/2),p=-Math.sin(a+Math.PI/2);this._wall(n+d*(c/2),i+p*(c/2),a,l,h,.6,u,"chapel"),this._wall(n-d*(c/2),i-p*(c/2),a,l,h,.6,u,"chapel");for(let x=0;x<7;x++){const A=(x/6-.5)*l*.86,b=new K(new Ct(c*e.range(.7,1.05),.3,.3),this.mats.plank);b.position.set(n+Math.cos(a)*A,s+h-e.range(.2,1.6),i-Math.sin(a)*A),b.rotation.set(e.range(-.3,.3),a+Math.PI/2,e.range(-.5,.5)),b.castShadow=!0,o.add(b)}const g=new K(new Ct(4.2,9,4.2),u),_=n-Math.cos(a)*(l/2+1.4),m=i+Math.sin(a)*(l/2+1.4);g.position.set(_,this.terrain.heightAt(_,m)+4.2,m),g.rotation.y=a,g.castShadow=g.receiveShadow=!0,o.add(g),this._circle(_,m,3);const f=new Yt,E=new K(new Ct(.24,3.2,.24),this.mats.plank),T=new K(new Ct(1.7,.24,.24),this.mats.plank);T.position.y=.85,f.add(E,T),f.position.set(_+e.range(-3,3),this.terrain.heightAt(_,m)+.9,m+e.range(-3,3)),f.rotation.set(e.range(-.4,.4),e.range(0,6),e.range(.7,1.3)),o.add(f),this.group.add(o)}_silo(t,e){const{x:n,z:i}=t,s=this.terrain.heightAt(n,i);this.landmarks.push({name:"THE SILO",position:new R(n,s,i)});const a=4.6,o=20,c=new K(new le(a,a*1.06,o,22,1,!0),new Gt({map:this.mats.concrete.map,normalMap:this.mats.concrete.normalMap,roughness:.92,metalness:0,color:15789286,side:Ee}));c.position.set(n,s+o/2-.4,i),c.castShadow=c.receiveShadow=!0,this.group.add(c),this._circle(n,i,a+.4);const l=new Yt;for(let u=0;u<24;u++){const d=new K(new Ct(.9,.08,.08),this.mats.rust);d.position.y=u*.78,l.add(d)}for(const u of[-.45,.45]){const d=new K(new Ct(.09,18.6,.09),this.mats.rust);d.position.set(u,9.3,0),l.add(d)}const h=e.range(0,Math.PI*2);l.position.set(n+Math.cos(h)*(a+.2),s-.3,i+Math.sin(h)*(a+.2)),l.rotation.y=-h,this.group.add(l);for(let u=0;u<3;u++){const d=h+Math.PI*.5*(u+1);this.anchors.push({position:new R(n+Math.cos(d)*(a+.12),s+1.7,i+Math.sin(d)*(a+.12)),normal:new R(Math.cos(d),0,Math.sin(d)),name:"silo"})}}_brickMaze(t,e){const{x:n,z:i}=t;this.landmarks.push({name:"THE WALLS",position:new R(n,this.terrain.heightAt(n,i),i)});const s=5+Math.floor(e()*4);for(let a=0;a<s;a++){const o=e.range(-13,13),c=e.range(-13,13),l=n+o,h=i+c;if(Math.abs(l)>bt-12||Math.abs(h)>bt-12)continue;const u=e.chance(.5)?0:Math.PI/2;this._wall(l,h,u+e.range(-.14,.14),e.range(7,15),e.range(3.2,5.6),.55,this.mats.concrete,"walls")}}_truck(t,e){const{x:n,z:i}=t,s=this.terrain.heightAt(n,i);this.landmarks.push({name:"THE TRUCK",position:new R(n,s,i)});const a=new Yt,o=e.range(0,Math.PI*2);a.position.set(n,s,i),a.rotation.y=o;const c=new K(new Ct(2.6,1.1,6.4),this.mats.rust);c.position.y=1.15;const l=new K(new Ct(2.5,1.5,2.2),this.mats.rust);l.position.set(0,2.35,1.9);const h=new K(new Ct(2.2,.9,.08),this.mats.dark);h.position.set(0,2.5,3.02),a.add(c,l,h);for(const[p,g]of[[-1.35,2.1],[1.35,2.1],[-1.35,-2],[1.35,-2]]){const _=new K(new le(.62,.62,.42,14),this.mats.dark);_.rotation.z=Math.PI/2,_.position.set(p,.55,g),a.add(_)}a.traverse(p=>{p.castShadow=p.receiveShadow=!0}),this.group.add(a),this._circle(n,i,3.4);const u=Math.cos(o),d=-Math.sin(o);this.anchors.push({position:new R(n+u*1.4,s+1.5,i+d*1.4),normal:new R(u,0,d),name:"truck"})}_depot(t,e){const{x:n,z:i}=t;this.landmarks.push({name:"THE DRUMS",position:new R(n,this.terrain.heightAt(n,i),i)});const s=new le(.52,.52,1.3,16);for(let a=0;a<14;a++){const o=n+e.range(-7,7),c=i+e.range(-7,7),l=e.chance(.35),h=new K(s,this.mats.rust);h.position.set(o,this.terrain.heightAt(o,c)+(l?.2:.55),c),l&&h.rotation.set(Math.PI/2,e.range(0,6),e.range(0,6)),h.castShadow=h.receiveShadow=!0,this.group.add(h),this._circle(o,c,.7)}this._wall(n,i,e.range(0,Math.PI),5,2.4,.4,this.mats.plank,"drums")}_graves(t,e){const{x:n,z:i}=t;this.landmarks.push({name:"THE STONES",position:new R(n,this.terrain.heightAt(n,i),i)});for(let s=0;s<22;s++){const a=n+e.range(-9,9),o=i+e.range(-9,9),c=e.range(.7,1.5),l=new K(new Ct(e.range(.5,.9),c,e.range(.14,.26)),this.mats.concrete);l.position.set(a,this.terrain.heightAt(a,o)+c/2-.2,o),l.rotation.set(e.range(-.16,.16),e.range(0,6),e.range(-.14,.14)),l.castShadow=l.receiveShadow=!0,this.group.add(l)}this._wall(n,i,e.range(0,Math.PI),6.5,2.2,.5,this.mats.concrete,"stones")}_well(t){const{x:e,z:n}=t,i=this.terrain.heightAt(e,n);this.landmarks.push({name:"THE WELL",position:new R(e,i,n)});const s=new K(new le(1.5,1.6,1.2,18,1,!0),this.mats.concrete);s.position.set(e,i+.4,n);const a=new K(new Ni(1.45,18),this.mats.dark);a.rotation.x=-Math.PI/2,a.position.set(e,i+.94,n);for(const c of[-1,1]){const l=new K(new Ct(.16,2.6,.16),this.mats.plank);l.position.set(e+c*1.3,i+1.3,n),this.group.add(l)}const o=new K(new Ct(3,.18,.18),this.mats.plank);o.position.set(e,i+2.5,n),s.castShadow=s.receiveShadow=!0,this.group.add(s,a,o),this._circle(e,n,1.9)}_shed(t,e){const{x:n,z:i}=t;this.landmarks.push({name:"THE SHED",position:new R(n,this.terrain.heightAt(n,i),i)});const s=e.range(0,Math.PI*2),a=6,o=5,c=3,l=Math.cos(s+Math.PI/2),h=-Math.sin(s+Math.PI/2);this._wall(n+Math.cos(s)*(o/2),i-Math.sin(s)*(o/2),s+Math.PI/2,a,c,.35,this.mats.plank,"shed"),this._wall(n+l*(a/2),i+h*(a/2),s,o,c,.35,this.mats.plank,"shed"),this._wall(n-l*(a/2),i-h*(a/2),s,o,c,.35,this.mats.plank,"shed");const u=new K(new Ct(a+.6,.2,o+.6),this.mats.plank);u.position.set(n,this.terrain.heightAt(n,i)+c-.2,i),u.rotation.set(.08,s,.04),u.castShadow=!0,this.group.add(u)}_fenceRun(t){const e=this.forest.findOpenSpot(t,{minRadius:14,maxRadius:bt-22,clearance:2}),n=t.range(0,Math.PI*2),i=8+Math.floor(t()*12);let s=e.x,a=e.z,o=n;for(let c=0;c<i;c++){const l=s+Math.cos(o)*3.2,h=a+Math.sin(o)*3.2;if(Math.abs(l)>bt-8||Math.abs(h)>bt-8)break;const u=this.terrain.heightAt(s,a),d=new K(new Ct(.16,1.9,.16),this.mats.plank);if(d.position.set(s,u+.8,a),d.rotation.set(t.range(-.1,.1),o,t.range(-.12,.12)),d.castShadow=!0,this.group.add(d),t.chance(.78)){for(const p of[.6,1.25]){const g=new K(new Ct(3.3,.13,.07),this.mats.plank);g.position.set((s+l)/2,(u+this.terrain.heightAt(l,h))/2+p,(a+h)/2),g.rotation.y=-o,g.castShadow=!0,this.group.add(g)}this._seg(s,a,l,h,.35,!1)}s=l,a=h,o+=t.range(-.22,.22)}}_rock(t){const e=this.forest.findOpenSpot(t,{minRadius:6,maxRadius:bt-8,clearance:1.2}),n=t.range(.5,2.6);this.mats.rock??=new Gt({map:this.mats.concrete.map,normalMap:this.mats.concrete.normalMap,roughness:.95,color:14210252,flatShading:!0});const i=new K(new Fn(n,0),this.mats.rock);i.position.set(e.x,e.y+n*.35,e.z),i.rotation.set(t.range(0,6),t.range(0,6),t.range(0,6)),i.scale.set(1,t.range(.55,.9),t.range(.8,1.3)),i.castShadow=i.receiveShadow=!0,this.group.add(i),n>1.2&&this._circle(e.x,e.z,n*.8)}_log(t){const e=this.forest.findOpenSpot(t,{minRadius:8,maxRadius:bt-10,clearance:2}),n=t.range(3,8),i=t.range(.3,.6),s=new K(new le(i*.7,i,n,8),this.mats.plank);s.rotation.set(Math.PI/2+t.range(-.1,.1),t.range(0,6),0),s.position.set(e.x,e.y+i*.8,e.z),s.castShadow=s.receiveShadow=!0,this.group.add(s)}_sign(t){const e=this.forest.findOpenSpot(t,{minRadius:12,maxRadius:bt-10,clearance:1.5}),n=new K(new Ct(.1,2.2,.1),this.mats.plank);n.position.set(e.x,e.y+1,e.z);const i=new K(new Je(1.1,1.1),this.mats.sign),s=t.range(0,Math.PI*2);i.position.set(e.x,e.y+1.7,e.z),i.rotation.set(t.range(-.1,.1),s,t.range(-.08,.08)),n.castShadow=i.castShadow=!0,this.group.add(n,i)}_perimeter(){const t=bt-4,e=new Gt({color:2763308,roughness:.8,metalness:.4,wireframe:!0,transparent:!0,opacity:.5});for(const[n,i,s,a]of[[-t,-t,t,-t],[t,-t,t,t],[t,t,-t,t],[-t,t,-t,-t]]){const o=Math.hypot(s-n,a-i),c=new Je(o,4,Math.floor(o/1.2),4),l=new K(c,e),h=(n+s)/2,u=(i+a)/2;l.position.set(h,this.terrain.heightAt(h,u)+2,u),l.rotation.y=-Math.atan2(a-i,s-n),this.group.add(l),this._seg(n,i,s,a,.6,!1)}}resolveCollision(t,e){for(const n of this.circles){const i=t.x-n.x,s=t.z-n.z,a=e+n.r,o=i*i+s*s;if(o<a*a&&o>1e-6){const c=Math.sqrt(o);t.x+=i/c*(a-c),t.z+=s/c*(a-c)}}for(const n of this.segments){const i=n.x2-n.x1,s=n.z2-n.z1,a=i*i+s*s;if(a<1e-6)continue;let o=((t.x-n.x1)*i+(t.z-n.z1)*s)/a;o=o<0?0:o>1?1:o;const c=n.x1+i*o,l=n.z1+s*o,h=t.x-c,u=t.z-l,d=e+n.r,p=h*h+u*u;if(p<d*d){const g=Math.sqrt(p)||1e-4;t.x+=h/g*(d-g),t.z+=u/g*(d-g)}}return t}blocksSight(t,e){for(const n of this.segments)if(n.tall&&y0(t.x,t.z,e.x,e.z,n.x1,n.z1,n.x2,n.z2))return!0;return!1}dispose(){this.group.traverse(t=>{t.geometry?.dispose?.()});for(const t of Object.values(this.mats))t.dispose()}}function y0(r,t,e,n,i,s,a,o){const c=Vs(i,s,a,o,r,t),l=Vs(i,s,a,o,e,n),h=Vs(r,t,e,n,i,s),u=Vs(r,t,e,n,a,o);return c>0!=l>0&&h>0!=u>0}function Vs(r,t,e,n,i,s){return(e-r)*(s-t)-(n-t)*(i-r)}const Mc=.42,yc=.56,S0=2.6,E0=.86;class T0{constructor(t,e,n,i,s,a=8){this.terrain=t,this.forest=e,this.count=a,this.found=0,this.group=new Yt,this.group.name="fragments",s.add(this.group),this.items=[],this._place(n,i)}_place(t,e){const n=[],i=a=>n.every(o=>o.distanceTo(a)>34),s=t.anchors.slice();for(let a=s.length-1;a>0;a--){const o=Math.floor(e()*(a+1));[s[a],s[o]]=[s[o],s[a]]}for(let a=0;a<this.count;a++){let o=null;for(;s.length&&!o;){const c=s.pop();i(c.position)&&(o={position:c.position.clone(),normal:c.normal.clone(),place:c.name})}for(let c=0;c<200&&!o;c++){const l=this.forest.findOpenSpot(e,{minRadius:20,maxRadius:bt-22,clearance:1.6}),h=this.forest.nearestTree(l.x,l.z,10);if(!h)continue;const u=e()*Math.PI*2,d=new R(h.x+Math.cos(u)*(h.r+.06),h.y+1.55,h.z+Math.sin(u)*(h.r+.06));i(d)&&(o={position:d,normal:new R(Math.cos(u),0,Math.sin(u)),place:"the trees"})}if(!o){const c=this.forest.findOpenSpot(e,{minRadius:14,maxRadius:bt-20,clearance:2});o={position:c.clone().setY(c.y+1.4),normal:new R(0,0,1),place:"the ground"}}n.push(o.position.clone()),this.items.push(this._build(a,o))}}_build(t,e){const n=new Je(Mc,yc,3,4),i=n.attributes.position;for(let c=0;c<i.count;c++){const l=i.getX(c)/Mc;i.setZ(c,Math.pow(Math.abs(l)*2,2.2)*.028)}n.computeVertexNormals();const s=new Gt({map:p0(t),roughness:.88,metalness:0,side:Ee,emissive:1709842,emissiveIntensity:1}),a=new K(n,s);a.position.copy(e.position),a.lookAt(e.position.clone().add(e.normal)),a.rotateZ((Math.random()-.5)*.16),a.castShadow=!1,a.receiveShadow=!1,a.renderOrder=2,this.group.add(a);const o=new K(new le(.012,.012,.07,5),new Gt({color:3814444,metalness:.6,roughness:.5}));return o.position.copy(e.position).addScaledVector(e.normal,.035).add(new R(0,yc*.42,0)),o.rotation.x=Math.PI/2,o.lookAt(o.position.clone().add(e.normal)),this.group.add(o),{mesh:a,nail:o,index:t,position:e.position.clone(),normal:e.normal.clone(),place:e.place,taken:!1,pulse:Math.random()*Math.PI*2}}targetFor(t){const e=t.eyePosition(),n=new R(0,0,-1).applyQuaternion(t.camera.quaternion);let i=null,s=1/0;for(const a of this.items){if(a.taken)continue;const o=e.distanceTo(a.position);o>S0||o>s||a.position.clone().sub(e).normalize().dot(n)<E0||(i=a,s=o)}return{item:i,distance:s}}take(t){return!t||t.taken?!1:(t.taken=!0,t.mesh.visible=!1,t.nail.visible=!1,this.found++,!0)}update(t,e){const n=e.eyePosition();for(const i of this.items){if(i.taken)continue;i.pulse+=t*1.6;const s=n.distanceTo(i.position),o=.55+Ot((s-4)/22)*2.6+Math.sin(i.pulse)*.12,c=i.mesh.material;c.emissiveIntensity=Jt(c.emissiveIntensity,e.lightOn?o:o*.25,6,t)}}get remaining(){return this.count-this.found}dispose(){for(const t of this.items)t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.nail.geometry.dispose(),t.nail.material.dispose()}}const b0=2.72,cn={WATCHER:"watcher",STALKER:"stalker"},ve={DORMANT:"dormant",LURK:"lurk",STALK:"stalk",CHARGE:"charge"};class Sc{constructor(t,e,n,i,s,a,o={}){this.archetype=o.archetype??cn.WATCHER,this.activateAt=o.activateAt??0,this.chaseSpeed=o.chaseSpeed??3.4,this.scale=o.scale??1,this.terrain=t,this.forest=e,this.props=n,this.difficulty=i,this.rng=s,this.position=new R(0,0,0),this.state=ve.DORMANT,this.static=0,this.observed=!1,this.observedTime=0,this.unobservedTime=0,this.proximity=0,this.fragments=0,this.timer=i.teleportBase,this.chargeTime=0,this.visibleNow=!1,this.onEvent=null,this.group=new Yt,this.group.name="entity",this.group.visible=!1,a.add(this.group),this._buildBody(),this._tmpA=new R,this._tmpB=new R}_buildBody(){const t=new Gt({map:g0(),color:13617338,roughness:.82,metalness:0,emissive:460552,emissiveIntensity:1}),e=new Gt({color:1644832,roughness:.98,metalness:0,side:Ee});this.skin=t,this.cloth=e;const n=b0/2.72,i=new K(new ii(.16,20,22),t);i.scale.set(1,1.5,.92),i.position.y=2.5*n,this.head=i;const s=new K(new le(.06,.085,.36,10),t);s.position.y=2.2*n;const a=new K(new le(.19,.26,.98,12),e);a.position.y=1.62*n;const o=new K(new Ct(.66,.13,.24),e);o.position.y=2.04*n;const c=new fs(.52,1.5,22,4,!0),l=c.attributes.position;for(let u=0;u<l.count;u++){const d=l.getY(u);if(d<-.5){const p=1+(Math.sin(u*2.7)*.5+Math.sin(u*7.1)*.5)*.28;l.setX(u,l.getX(u)*p),l.setZ(u,l.getZ(u)*p),l.setY(u,d+Math.sin(u*4.3)*.16)}}c.computeVertexNormals();const h=new K(c,e);h.position.y=1.42*n,this.shroud=h,this.arms=[];for(const u of[-1,1]){const d=new Yt,p=new K(new le(.052,.062,.72,8),t);p.position.y=-.36;const g=new Yt;g.position.y=-.72;const _=new K(new le(.04,.05,.78,8),t);_.position.y=-.39;const m=new Yt;m.position.y=-.78;for(let f=0;f<5;f++){const E=new K(new le(.011,.019,.3,5),t);E.position.set((f-2)*.028,-.15,0),E.rotation.z=(f-2)*.16,m.add(E)}g.add(_,m),d.add(p,g),d.position.set(u*.3,2*n,0),d.userData.side=u,d.userData.elbow=g,this.arms.push(d),this.group.add(d)}this.legs=[];for(const u of[-1,1]){const d=new Yt,p=new K(new le(.062,.075,.78,8),e);p.position.y=-.39;const g=new Yt;g.position.y=-.78;const _=new K(new le(.042,.058,.74,8),e);_.position.y=-.37;const m=new K(new Ct(.11,.05,.26),e);m.position.set(0,-.76,.06),g.add(_,m),d.add(p,g),d.position.set(u*.11,1.16*n,0),d.userData.side=u,d.userData.knee=g,this.legs.push(d),this.group.add(d)}this.group.add(i,s,a,o,h),this.archetype===cn.STALKER?(this.group.scale.set(1.18*this.scale,.74*this.scale,1.18*this.scale),o.scale.set(1.45,1.6,1.5),i.scale.set(1.15,1.05,1.05),this.skin.color.setHex(12167314)):this.group.scale.setScalar(this.scale),this.group.traverse(u=>{u.isMesh&&(u.castShadow=!0,u.frustumCulled=!1)}),this.rim=new hr(10465988,0,9,2),this.rim.position.y=2.3*n,this.group.add(this.rim),this._anim=0}begin(t){this.state=ve.LURK,this.static=0,this.fragments=0,this.timer=this.difficulty.teleportBase*1.4,this.group.visible=!0,this._reposition(t,this.difficulty.baseDistance*1.5)}onFragmentTaken(t,e){this.fragments=t,this.timer=Math.min(this.timer,1.4),this.onEvent?.("escalate",{count:t}),t%2===0&&this._reposition(e,this.difficulty.baseDistance*.72)}get teleportInterval(){const t=this.difficulty;return Math.max(2.2,t.teleportBase-t.teleportPerFrag*this.fragments)}update(t,e,n){if(this.state===ve.DORMANT)return"alive";const i=this.difficulty,s=e.eyePosition(this._tmpA),a=this._tmpB.set(this.position.x,this.position.y+1.9,this.position.z),o=s.distanceTo(a);if(this._updateObservation(t,e,n,s,a,o),this.archetype===cn.STALKER)this.static=Ot(this.static-t*i.staticDecay);else if(this.observed){const l=1-mr(6,48,o),h=mr(0,.45,this.observedTime);this.static=Ot(this.static+t*i.staticGain*(.55+l)*h)}else this.static=Ot(this.static-t*i.staticDecay);const c=(1-mr(4,34,o))*(this.archetype===cn.STALKER||this.observed?1:.55);switch(this.proximity=Jt(this.proximity,Math.max(c,this.static*.8),3.5,t),this.state){case ve.LURK:case ve.STALK:this._stalk(t,e,o);break;case ve.CHARGE:this._charge(t,e);break}if(this._face(e,t),this._animate(t,o),this.static>=1)return"consumed";if(this.archetype===cn.STALKER){if(o<i.killDistance*.75)return"caught"}else if(o<i.killDistance&&(this.observed||this.state===ve.CHARGE))return"caught";return"alive"}_updateObservation(t,e,n,i,s,a){const o=new R(0,0,-1).applyQuaternion(n.quaternion),c=s.clone().sub(i),l=Math.max(.001,c.length());c.divideScalar(l);const h=Oa.degToRad(n.fov)*.5,d=c.dot(o)>Math.cos(h*n.aspect*.82)&&this.forest.hasLineOfSight(i,s)&&!this.props.blocksSight(i,s),p=e.lightOn&&c.dot(o)>Math.cos(h*.5)&&a<e.torch.distance,g=d&&(p||a<26);this.visibleNow=d,this.observed=g,g?(this.observedTime+=t,this.unobservedTime=0):(this.unobservedTime+=t,this.observedTime=Math.max(0,this.observedTime-t*2))}_stalk(t,e,n){const i=this.difficulty;if(this.archetype===cn.STALKER){this._pursue(t,e,this.chaseSpeed*(1+this.fragments*.06)),this.timer-=t,this.timer<=0&&n>60&&(this.timer=this.teleportInterval*2,this._reposition(e,i.baseDistance));return}if(this.observed){this.timer-=t*.25,n<i.minDistance*.8&&this.observedTime>1.6&&this._enterCharge();return}if(this.timer-=t,this.state=ve.STALK,n>i.minDistance&&this._pursue(t,e,i.stalkSpeed*(1+this.fragments*.14)),this.timer<=0){this.timer=this.teleportInterval*(.8+this.rng()*.45);const s=this.fragments/this.difficulty.fragments;this.rng()<s*.34&&n<i.baseDistance?this._enterCharge():this._reposition(e)}}_pursue(t,e,n){const i=new R(e.position.x-this.position.x,0,e.position.z-this.position.z);if(i.lengthSq()<1e-6)return;i.normalize();const s=this.position.clone().addScaledVector(i,n*t);this.forest.resolveCollision(s,.6),this.props.resolveCollision(s,.6),this.position.x=s.x,this.position.z=s.z,this.position.y=this.terrain.heightAt(this.position.x,this.position.z)}_enterCharge(){this.state!==ve.CHARGE&&(this.state=ve.CHARGE,this.chargeTime=0,this.onEvent?.("charge"))}_charge(t,e){this.chargeTime+=t;const n=6.4+this.fragments*.5,i=new R(e.position.x-this.position.x,0,e.position.z-this.position.z).normalize(),s=this.position.clone().addScaledVector(i,n*t);this.forest.resolveCollision(s,.5),this.props.resolveCollision(s,.5),this.position.x=s.x,this.position.z=s.z,this.position.y=this.terrain.heightAt(this.position.x,this.position.z),this.chargeTime>4.2&&(this.state=ve.LURK,this.timer=this.teleportInterval,this._reposition(e,this.difficulty.baseDistance),this.onEvent?.("retreat"))}_reposition(t,e=this.difficulty.baseDistance){const n=this.difficulty,i=Math.max(n.minDistance,9);let s=null,a=-1/0;for(let o=0;o<42;o++){const c=this.rng()*Math.PI*2,l=i+this.rng()*Math.max(4,e-i)*1.5,h=t.position.x+Math.cos(c)*l,u=t.position.z+Math.sin(c)*l;if(Math.abs(h)>bt-8||Math.abs(u)>bt-8||this.terrain.slopeAt(h,u)>.45)continue;const d=this.terrain.heightAt(h,u),p=new R(h,d,u),g=p.clone().setY(d+1.9),_=t.eyePosition(),m=p.clone();if(this.forest.resolveCollision(m,.8),this.props.resolveCollision(m,.8),m.distanceToSquared(p)>.04)continue;const f=this.forest.hasLineOfSight(_,g)&&!this.props.blocksSight(_,g),E=_.distanceTo(g),T=g.clone().sub(_).setY(0).normalize(),x=t.forward(),A=-T.dot(x);let b=0;b+=f?2.5:0,b+=A*2.2,b-=Math.abs(E-e)*.07,b+=this.rng()*.9,b>a&&(a=b,s=p)}s&&(this.position.copy(s),this.onEvent?.("reposition",{distance:s.distanceTo(t.position)})),this.state===ve.CHARGE&&(this.state=ve.LURK)}_face(t,e){const n=Math.atan2(t.position.x-this.position.x,t.position.z-this.position.z);let i=this.group.rotation.y,s=n-i;for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;this.group.rotation.y=i+s*(this.observed?Math.min(1,e*4.5):1),this.group.position.set(this.position.x,this.position.y,this.position.z)}_animate(t,e){this._anim+=t;const n=this._anim,i=this.state===ve.CHARGE,s=Math.sin(n*.7)*.022+Math.sin(n*1.9)*.008;this.group.rotation.z=s*(i?3:1),this.head.rotation.z=Math.sin(n*.53)*.05,this.shroud.rotation.y=Math.sin(n*.4)*.06;for(const l of this.arms){const h=l.userData.side;if(i){const u=Math.min(1,this.chargeTime*3);l.rotation.x=Jt(l.rotation.x,-2.1*u,9,t),l.rotation.z=Jt(l.rotation.z,h*.5*u,9,t),l.userData.elbow.rotation.x=Jt(l.userData.elbow.rotation.x,-.7*u,9,t)}else l.rotation.x=Jt(l.rotation.x,Math.sin(n*.6+h)*.05,4,t),l.rotation.z=Jt(l.rotation.z,h*(.06+Math.sin(n*.45)*.03),4,t),l.userData.elbow.rotation.x=Jt(l.userData.elbow.rotation.x,-.08,4,t)}const o=i||this.archetype===cn.STALKER&&this.state!==ve.DORMANT?Math.sin(n*(i?9:6.2)):0;this.legs.forEach((l,h)=>{const u=h===0?o:-o;l.rotation.x=Jt(l.rotation.x,u*.7,12,t),l.userData.knee.rotation.x=Jt(l.userData.knee.rotation.x,-Math.max(0,u)*.8,12,t)});const c=(1-Ot(e/30))*(i?44:22);this.rim.intensity=Jt(this.rim.intensity,c,4,t),this.skin.emissiveIntensity=Jt(this.skin.emissiveIntensity,i?3.2:1,4,t)}dispose(){this.group.traverse(t=>t.geometry?.dispose?.()),this.skin.dispose(),this.cloth.dispose(),this.group.removeFromParent()}}const Ec=1.68,w0=1.02,Kr=.42,A0=118,Tc=3.15,R0=5.75,C0=1.45,bc=42,wc=12,Ac=1,Rc=1.05,Ws=60;class P0{constructor(t,e,n,i,s,a){this.camera=t,this.scene=a,this.terrain=e,this.forest=n,this.props=i,this.settings=s,this.position=new R(0,0,0),this.velocity=new R,this.yaw=0,this.pitch=0,this.eye=Ec,this.crouching=!1,this.sprinting=!1,this.stamina=1,this.battery=1,this.lightOn=!0,this.walkDistance=0,this._stepAt=0,this.speed=0,this.bob=0,this._shake=0,this._lightFlicker=1,this._roll=0,this._camPos=new R,this.onFootstep=null,this._buildLights()}_buildLights(){this.torch=new qo(16772300,bc,Ws,Oa.degToRad(23),.62,Rc),this.torchWide=new qo(16770240,wc,Ws*.55,Oa.degToRad(48),.92,Rc),this.torch.castShadow=!0,this.torch.shadow.mapSize.set(1024,1024),this.torch.shadow.camera.near=.4,this.torch.shadow.camera.far=Ws,this.torch.shadow.bias=-.0016,this.torch.shadow.normalBias=.03,this.rig=new ue,this.rig.rotation.order="YXZ",this.scene.add(this.rig),this.torch.position.set(.16,-.14,.1),this.torchWide.position.copy(this.torch.position),this.torch.target.position.set(.16,-.14,-1),this.torchWide.target.position.copy(this.torch.target.position),this.rig.add(this.torch,this.torch.target,this.torchWide,this.torchWide.target),this.held=new hr(16767400,Ac,5,2),this.held.position.set(.2,-.3,0),this.rig.add(this.held)}spawn(t,e,n=0){this.position.set(t,this.terrain.heightAt(t,e),e),this.yaw=n,this.pitch=0,this.stamina=1,this.battery=1,this.lightOn=!0,this.velocity.set(0,0,0),this.walkDistance=0,this._applyCamera(0)}eyePosition(t=new R){return t.set(this.position.x,this.position.y+this.eye,this.position.z)}forward(t=new R){return t.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw))}addShake(t){this._shake=Math.min(1.4,this._shake+t)}update(t,e,n){this._look(e),this._move(t,e),this._torch(t,e,n),this._applyCamera(t)}_look(t){const{dx:e,dy:n}=t.takeMouse(),i=this.settings.sensitivity*.0021;this.yaw-=e*i,this.pitch-=n*i*(this.settings.invertY?-1:1);const s=Math.PI/2-.03;this.pitch=ns(this.pitch,-s,s),this.yaw>Math.PI&&(this.yaw-=Math.PI*2),this.yaw<-Math.PI&&(this.yaw+=Math.PI*2)}_move(t,e){let n=0,i=0;e.down("forward")&&(i-=1),e.down("back")&&(i+=1),e.down("left")&&(n-=1),e.down("right")&&(n+=1);const s=n!==0||i!==0;if(s){const _=Math.hypot(n,i);n/=_,i/=_}this.crouching=e.down("crouch");const a=e.down("sprint")&&s&&!this.crouching&&i<.1;if(this.sprinting=a&&this.stamina>.02,this.sprinting)this.stamina=Ot(this.stamina-t*.24);else{const _=s?.11:.2;this.stamina=Ot(this.stamina+t*_)}let o=this.crouching?C0:this.sprinting?R0:Tc;i>0&&(o*=.72),this.stamina<.14&&!this.crouching&&(o*=.72+this.stamina);const c=Math.sin(this.yaw),l=Math.cos(this.yaw),h=(n*l+i*c)*o,u=(-n*c+i*l)*o,d=s?13:17;this.velocity.x=Jt(this.velocity.x,h,d,t),this.velocity.z=Jt(this.velocity.z,u,d,t),this.position.x+=this.velocity.x*t,this.position.z+=this.velocity.z*t,this.forest.resolveCollision(this.position,Kr),this.props.resolveCollision(this.position,Kr);const p=A0;this.position.x=ns(this.position.x,-p,p),this.position.z=ns(this.position.z,-p,p),this.position.y=Jt(this.position.y,this.terrain.heightAt(this.position.x,this.position.z),16,t),this.speed=Math.hypot(this.velocity.x,this.velocity.z),this.walkDistance+=this.speed*t;const g=this.crouching?1.35:this.sprinting?1.85:1.55;this.speed>.4&&this.walkDistance-this._stepAt>g&&(this._stepAt=this.walkDistance,this.onFootstep?.(this.crouching?.32:this.sprinting?1:.62,this.sprinting)),this.eye=Jt(this.eye,this.crouching?w0:Ec,11,t)}_torch(t,e,n){if(e.hit("light")){const l=this.lightOn;this.lightOn=!this.lightOn&&this.battery>.001,(l!==this.lightOn||!this.lightOn)&&this.onLightToggle?.(this.lightOn)}this.lightOn&&this.battery>0&&(this.battery=Ot(this.battery-t*n.batteryDrain),this.battery<=0&&(this.lightOn=!1));const i=1-Ot(this.battery/.28),s=performance.now()*.001;let a=1+Math.sin(s*7.3)*.018+Math.sin(s*23.7)*.01;if(i>0){const l=Math.sin(s*31)*Math.sin(s*13.7)*Math.sin(s*5.1);a*=1-i*.55+l*i*.5,Math.random()<i*t*6&&(a*=.12)}this._lightFlicker=Jt(this._lightFlicker,Math.max(.05,a),22,t);const o=this.lightOn?1:0,c=.35+this.battery*.65;this.torch.intensity=Jt(this.torch.intensity,o*bc*c*this._lightFlicker,18,t),this.torchWide.intensity=Jt(this.torchWide.intensity,o*wc*c*this._lightFlicker,18,t),this.held.intensity=Jt(this.held.intensity,o*Ac*c,12,t),this.torch.distance=Ws*(.72+this.battery*.28)}_applyCamera(t){const e=this.sprinting?11.5:8.4;this.bob+=this.speed*t*e*.34;const n=(this.crouching?.4:1)*Math.min(1,this.speed/Tc),i=this.settings.shake?1:.25,s=Math.sin(this.bob*2)*.045*n*i,a=Math.cos(this.bob)*.035*n*i;this._roll=Jt(this._roll,-this.velocity.x*.004*Math.cos(this.yaw)+Math.sin(this.bob)*.006*n,8,t),this._shake=Math.max(0,this._shake-t*2.2);const o=this._shake*this._shake*i,c=(Math.random()-.5)*o*.09,l=(Math.random()-.5)*o*.09;this._camPos.set(this.position.x+a*Math.cos(this.yaw),this.position.y+this.eye+s,this.position.z-a*Math.sin(this.yaw)),this.rig.position.copy(this._camPos),this.rig.rotation.set(this.pitch,this.yaw,0),this.camera.position.copy(this._camPos),this.camera.rotation.order="YXZ",this.camera.rotation.set(this.pitch+l,this.yaw+c,this._roll)}get radius(){return Kr}}const tr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ps{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const D0=new eo(-1,1,1,-1,0,1);class I0 extends Ce{constructor(){super(),this.setAttribute("position",new ee([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ee([0,2,0,0,2,0],2))}}const L0=new I0;class vl{constructor(t){this._mesh=new K(L0,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,D0)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class xl extends ps{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ue?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=rr.clone(t.uniforms),this.material=new Ue({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new vl(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Cc extends ps{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}}class U0 extends ps{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class N0{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new wt);this._width=n.width,this._height=n.height,e=new an(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:wn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new xl(tr),this.copyPass.material.blending=Tn,this.clock=new rl}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,s=this.passes.length;i<s;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Cc!==void 0&&(a instanceof Cc?n=!0:a instanceof U0&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new wt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class F0 extends ps{constructor(t,e,n=null,i=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Nt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}}const O0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Nt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Fi extends ps{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new wt(t.x,t.y):new wt(256,256),this.clearColor=new Nt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new an(s,a,{type:wn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new an(s,a,{type:wn});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new an(s,a,{type:wn});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),a=Math.round(a/2)}const o=O0;this.highPassUniforms=rr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ue({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new wt(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=rr.clone(tr.uniforms),this.blendMaterial=new Ue({uniforms:this.copyUniforms,vertexShader:tr.vertexShader,fragmentShader:tr.fragmentShader,blending:bn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Nt,this._oldClearAlpha=1,this._basic=new ni,this._fsQuad=new vl(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,i),this.renderTargetsVertical[s].setSize(n,i),this.separableBlurMaterials[s].uniforms.invSize.value=new wt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,s){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Fi.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Fi.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Ue({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new wt(.5,.5)},direction:{value:new wt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(t){return new Ue({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Fi.BlurDirectionX=new wt(1,0);Fi.BlurDirectionY=new wt(0,1);const k0={uniforms:{tDiffuse:{value:null},tStatic:{value:null},uTime:{value:0},uResolution:{value:new wt(1,1)},uGrain:{value:1},uStatic:{value:0},uGlitch:{value:0},uDamage:{value:0},uVignette:{value:1},uFade:{value:0},uPulse:{value:0},uDaylight:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform sampler2D tStatic;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uGrain;
    uniform float uStatic;
    uniform float uGlitch;
    uniform float uDamage;
    uniform float uVignette;
    uniform float uFade;
    uniform float uPulse;
    uniform float uDaylight;

    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(443.897, 441.423));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    // barrel distortion — the cheap plastic lens
    vec2 barrel(vec2 uv, float k) {
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      return 0.5 + c * (1.0 + k * r2);
    }

    void main() {
      float t = uTime;
      float storm = uStatic;

      // ── tracking error: horizontal bands that slip sideways
      float band = floor(vUv.y * 96.0);
      float slipNoise = hash(vec2(band, floor(t * 11.0)));
      float slip = step(0.972 - storm * 0.32 - uGlitch * 0.5, slipNoise);
      float slipAmt = slip * (0.006 + storm * 0.03 + uGlitch * 0.09)
                    * (slipNoise - 0.5) * 2.0;

      // ── whole-frame roll when it is very close
      float roll = uGlitch * 0.02 * sin(t * 61.0);

      vec2 uv = vUv;
      uv.x += slipAmt + roll;
      uv.y += uPulse * 0.0035 * sin(vUv.x * 9.0 + t * 1.7);
      uv = barrel(uv, 0.055 + storm * 0.09 + uPulse * 0.01);

      // ── chromatic aberration, stronger toward the corners
      vec2 fromCenter = uv - 0.5;
      float edge = dot(fromCenter, fromCenter);
      float ca = (0.0016 + edge * 0.012) * (1.0 + storm * 5.0 + uGlitch * 6.0) * (1.0 - uDaylight * 0.7);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + fromCenter * ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - fromCenter * ca).b;

      // ── ghosting: a faint delayed copy, offset like a bad tape head
      vec3 ghost = texture2D(tDiffuse, uv + vec2(0.004 + storm * 0.02, 0.0)).rgb;
      col = mix(col, max(col, ghost * 0.55), (0.35 + storm * 0.3) * (1.0 - uDaylight * 0.8));

      // ── tape noise
      vec2 grainUv = uv * uResolution / 256.0 + vec2(fract(t * 7.3), fract(t * 5.1));
      float noise = texture2D(tStatic, grainUv).r;
      col += (noise - 0.5) * (0.055 + storm * 0.06) * uGrain * (1.0 - uDaylight * 0.6);

      // ── static storm: hard white/black speckle that eats the image
      if (storm > 0.001) {
        float sp = hash(uv * uResolution * 0.7 + fract(t * 37.0) * 91.0);
        float bursts = step(1.0 - storm * 0.55, sp);
        col = mix(col, vec3(sp), bursts * storm * 0.95);
        // dropout lines
        float dl = step(0.995 - storm * 0.02, hash(vec2(floor(uv.y * 220.0), floor(t * 24.0))));
        col = mix(col, vec3(0.02), dl * storm);
      }

      // ── scanlines + interlace shimmer
      float scan = sin(uv.y * uResolution.y * 1.5708) * 0.5 + 0.5;
      col *= 1.0 - scan * 0.11 * uGrain * (1.0 - uDaylight * 0.75);
      float inter = step(0.5, fract(uv.y * uResolution.y * 0.5 + t * 12.0));
      col *= 1.0 - inter * 0.025 * uGrain;

      // ── vignette
      float vig = 1.0 - smoothstep(0.28 + uDaylight * 0.25, 0.85 + uDaylight * 0.3, length(fromCenter) * 1.32);
      col *= mix(1.0, vig, uVignette * (0.85 + storm * 0.15));

      // ── colour grade: cold, desaturated, crushed blacks, slight green tape cast
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, mix(0.72, 1.06, uDaylight));
      // night is cold and green-cast; day is neutral and slightly warm
      col *= mix(vec3(0.94, 1.0, 1.02), vec3(1.04, 1.0, 0.95), uDaylight);
      col = max(vec3(0.0), col - 0.012 * (1.0 - uDaylight));
      col = pow(col, vec3(mix(1.06, 0.94, uDaylight)));

      // ── damage / caught: the frame floods red from the edges inward
      col = mix(col, vec3(0.52, 0.03, 0.02), uDamage * smoothstep(0.1, 0.95, length(fromCenter) * 1.5));
      col += vec3(0.22, 0.0, 0.0) * uDamage * 0.5;

      // ── edges of frame are never quite clean
      float border = smoothstep(0.0, 0.006, uv.x) * smoothstep(0.0, 0.006, uv.y)
                   * smoothstep(0.0, 0.006, 1.0 - uv.x) * smoothstep(0.0, 0.006, 1.0 - uv.y);
      col *= border;

      col *= 1.0 - uFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `};class B0{constructor(t,e,n,i){this.renderer=t,this.settings=i,this.composer=new N0(t),this.composer.addPass(new F0(e,n));const s=t.getSize(new wt);this.bloom=new Fi(s,.12,.5,.95),this.composer.addPass(this.bloom),this.vhs=new xl(k0),this.vhs.uniforms.tStatic.value=_0(),this.vhs.renderToScreen=!0,this.composer.addPass(this.vhs),this._glitch=0,this._damage=0,this._fade=0,this._fadeTarget=0}glitch(t=1){this._glitch=Math.min(1.5,this._glitch+t)}damage(t=1){this._damage=Math.min(1,this._damage+t)}fadeTo(t){this._fadeTarget=t}setFade(t){this._fade=this._fadeTarget=t}update(t,{staticLevel:e=0,proximity:n=0,daylight:i=0}={}){const s=this.vhs.uniforms;s.uTime.value+=t,s.uGrain.value=this.settings.grain,s.uStatic.value=Ot(e),s.uPulse.value=n,s.uDaylight.value=Ot(i),this._glitch=Math.max(0,this._glitch-t*3.4),this._damage=Math.max(0,this._damage-t*1.5),this._fade=Jt(this._fade,this._fadeTarget,4.5,t),s.uGlitch.value=this._glitch,s.uDamage.value=this._damage,s.uFade.value=this._fade,this.bloom.strength=.12+n*.14+e*.1}setSize(t,e){this.composer.setSize(t,e),this.bloom.setSize(t,e),this.vhs.uniforms.uResolution.value.set(t,e)}render(){this.composer.render()}dispose(){this.composer.dispose?.()}}const ji=340;class z0{constructor(t,e){this.group=new Yt,this.group.name="sky",e.add(this.group);const n=Bn(t^24301);this._buildStars(n),this._buildMoon(),this._time=0}_buildStars(t){const n=new Float32Array(7800),i=new Float32Array(2600*3),s=new Float32Array(2600),a=new Float32Array(2600);for(let l=0;l<2600;l++){const h=t()*Math.PI*2,u=Math.pow(t(),.62),d=Math.sqrt(1-u*u);n[l*3]=Math.cos(h)*d*ji,n[l*3+1]=u*ji,n[l*3+2]=Math.sin(h)*d*ji;const p=t()<.16,g=.25+Math.pow(t(),2.4)*.75;i[l*3]=g*(p?1:.86),i[l*3+1]=g*(p?.86:.9),i[l*3+2]=g*(p?.72:1),s[l]=(.7+Math.pow(t(),3)*3.4)*ji*.004,a[l]=t()*Math.PI*2}const o=new Ce;o.setAttribute("position",new Pe(n,3)),o.setAttribute("color",new Pe(i,3)),o.setAttribute("aSize",new Pe(s,1)),o.setAttribute("aPhase",new Pe(a,1));const c=new Ue({uniforms:{uTime:{value:0},uOpacity:{value:1}},transparent:!0,depthWrite:!1,blending:bn,fog:!1,vertexShader:`
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vColor = color;
          // Two incommensurate frequencies: the twinkle never finds a pattern.
          vTwinkle = 0.72 + 0.28 * sin(uTime * 1.7 + aPhase)
                          * sin(uTime * 0.63 + aPhase * 1.7);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (300.0 / -mv.z);
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vTwinkle;
        uniform float uOpacity;
        void main() {
          // round, soft-edged point with a tight core
          vec2 d = gl_PointCoord - 0.5;
          float r = length(d) * 2.0;
          float a = smoothstep(1.0, 0.0, r);
          a *= a;
          a += smoothstep(0.35, 0.0, r) * 0.6;
          gl_FragColor = vec4(vColor * vTwinkle, a * vTwinkle * uOpacity);
        }
      `});c.vertexColors=!0,this.stars=new nl(o,c),this.stars.frustumCulled=!1,this.starMat=c,this.group.add(this.stars)}_buildMoon(){const e=new R(-60,90,40).normalize().clone().multiplyScalar(ji*.86),n=new K(new Ni(19,48),new ni({map:H0(),fog:!1,transparent:!0,depthWrite:!1}));n.position.copy(e),n.lookAt(0,0,0);const i=(s,a)=>{const o=new K(new Ni(s,40),new ni({map:G0(),fog:!1,transparent:!0,depthWrite:!1,blending:bn,opacity:a}));return o.position.copy(e),o.lookAt(0,0,0),o};this.moonGroup=new Yt,this.moonGroup.add(i(120,.19),i(46,.34),n),this.moonGroup.renderOrder=-1,this.group.add(this.moonGroup),this.moonDisc=n}update(t,e){this._time+=t,this.starMat.uniforms.uTime.value=this._time,this.group.position.set(e.position.x,0,e.position.z)}setStarOpacity(t){this.starMat.uniforms.uOpacity.value=t;const e=t>.02;this.stars.visible=e,this.moonGroup.visible=e}setDim(t){this.starMat.uniforms.uOpacity.value=1-t*.72,this.moonGroup.children.forEach(e=>{e.material.blending!==bn&&(e.material.opacity=1-t*.4)})}dispose(){this.group.traverse(t=>{t.geometry?.dispose?.(),t.material?.dispose?.()})}}let Zi=null;function H0(){if(Zi)return Zi;const r=256,t=document.createElement("canvas");t.width=t.height=r;const e=t.getContext("2d"),n=Bn(24601);e.clearRect(0,0,r,r),e.save(),e.beginPath(),e.arc(r/2,r/2,r/2-1,0,Math.PI*2),e.clip(),e.fillStyle="#e9e7e0",e.fillRect(0,0,r,r);for(let s=0;s<7;s++){const a=n.range(.2,.8)*r,o=n.range(.2,.8)*r,c=n.range(.08,.24)*r,l=e.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,"rgba(150,150,156,0.5)"),l.addColorStop(1,"rgba(150,150,156,0)"),e.fillStyle=l,e.beginPath(),e.arc(a,o,c,0,7),e.fill()}for(let s=0;s<90;s++){const a=n.range(0,r),o=n.range(0,r),c=Math.pow(n(),2.3)*22+1.6;e.fillStyle=`rgba(120,120,126,${n.range(.16,.42)})`,e.beginPath(),e.arc(a,o,c,0,7),e.fill(),e.fillStyle=`rgba(255,255,250,${n.range(.2,.5)})`,e.beginPath(),e.arc(a-c*.16,o-c*.16,c*.82,0,7),e.fill(),e.fillStyle=`rgba(112,112,120,${n.range(.2,.45)})`,e.beginPath(),e.arc(a+c*.1,o+c*.1,c*.6,0,7),e.fill()}const i=e.createRadialGradient(r*.38,r*.36,r*.1,r*.5,r*.5,r*.5);return i.addColorStop(0,"rgba(255,255,255,0.16)"),i.addColorStop(.75,"rgba(0,0,0,0)"),i.addColorStop(1,"rgba(10,12,18,0.55)"),e.fillStyle=i,e.fillRect(0,0,r,r),e.restore(),Zi=new ds(t),Zi.colorSpace=Re,Zi}let Ji=null;function G0(){if(Ji)return Ji;const r=128,t=document.createElement("canvas");t.width=t.height=r;const e=t.getContext("2d"),n=e.createRadialGradient(r/2,r/2,0,r/2,r/2,r/2);return n.addColorStop(0,"rgba(196,214,240,0.85)"),n.addColorStop(.22,"rgba(150,175,215,0.28)"),n.addColorStop(.6,"rgba(90,110,150,0.07)"),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(0,0,r,r),Ji=new ds(t),Ji.colorSpace=Re,Ji}const Ml=960,Qi=[{t:0,name:"DEAD OF NIGHT",sun:2899038,sunI:0,moonI:1.35,skyTop:659228,skyBottom:329484,ambSky:2240586,ambGround:526857,ambI:.55,fog:527122,fogD:.022,stars:1},{t:.2,name:"FALSE DAWN",sun:5917290,sunI:.12,moonI:.9,skyTop:1384502,skyBottom:2761782,ambSky:3356751,ambGround:1052429,ambI:.9,fog:1317414,fogD:.026,stars:.55},{t:.27,name:"DAWN",sun:14250298,sunI:1.5,moonI:.2,skyTop:3823232,skyBottom:13203018,ambSky:7044508,ambGround:2760728,ambI:1.5,fog:6969938,fogD:.02,stars:.12},{t:.36,name:"MORNING",sun:16766888,sunI:2.6,moonI:0,skyTop:6260932,skyBottom:11059416,ambSky:9414856,ambGround:4867128,ambI:1.9,fog:10135732,fogD:.011,stars:0},{t:.5,name:"MIDDAY",sun:16774368,sunI:3.1,moonI:0,skyTop:5539528,skyBottom:11979740,ambSky:10335954,ambGround:5656640,ambI:2.1,fog:11056834,fogD:.009,stars:0},{t:.68,name:"AFTERNOON",sun:16767392,sunI:2.4,moonI:0,skyTop:5931706,skyBottom:12629148,ambSky:9742012,ambGround:5129782,ambI:1.8,fog:10722450,fogD:.012,stars:0},{t:.76,name:"DUSK",sun:12866858,sunI:1.3,moonI:.25,skyTop:3951218,skyBottom:12082996,ambSky:6582414,ambGround:2892568,ambI:1.3,fog:7033672,fogD:.019,stars:.15},{t:.83,name:"NIGHTFALL",sun:4078168,sunI:.18,moonI:.85,skyTop:1252400,skyBottom:2367278,ambSky:2897224,ambGround:789772,ambI:.8,fog:1054242,fogD:.023,stars:.7},{t:1,name:"DEAD OF NIGHT",sun:2899038,sunI:0,moonI:1.35,skyTop:659228,skyBottom:329484,ambSky:2240586,ambGround:526857,ambI:.55,fog:527122,fogD:.022,stars:1}];class V0{constructor(t,e=.3){this.scene=t,this.t=e,this.day=1,this.paused=!1,this.sun=new $o(16774368,0),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048);const n=this.sun.shadow.camera;n.near=1,n.far=320,n.left=-70,n.right=70,n.top=70,n.bottom=-70,this.sun.shadow.bias=-6e-4,this.sun.shadow.normalBias=.05,t.add(this.sun,this.sun.target),this.moon=new $o(9414860,0),t.add(this.moon,this.moon.target),this.ambient=new Mu(10335954,5656640,0),t.add(this.ambient),this.fog=new Za(725014,.02),t.fog=this.fog,this._colA=new Nt,this._colB=new Nt,this.state={...Qi[0]},this.apply()}update(t){if(this.paused)return!1;this.t,this.t+=t/Ml;let e=!1;for(;this.t>=1;)this.t-=1,this.day++,e=!0;return this.apply(),e}apply(){const t=this.t;let e=0;for(;e<Qi.length-2&&Qi[e+1].t<=t;)e++;const n=Qi[e],i=Qi[e+1],s=Math.max(1e-6,i.t-n.t),a=Ot((t-n.t)/s),o=(u,d,p)=>p.setHex(u).lerp(this._colB.setHex(d),a),c=(t-.25)*Math.PI*2,l=Math.sin(c),h=Math.cos(c);this.sun.position.set(h*140,l*150,60),this.sun.target.position.set(0,0,0),this.moon.position.set(-h*140,-l*150,-60),this.moon.target.position.set(0,0,0),this.sun.intensity=hn(n.sunI,i.sunI,a),this.sun.color.copy(o(n.sun,i.sun,this._colA)),this.sun.castShadow=this.sun.intensity>.15,this.moon.intensity=hn(n.moonI,i.moonI,a),this.ambient.intensity=hn(n.ambI,i.ambI,a),this.ambient.color.copy(o(n.ambSky,i.ambSky,this._colA)),this.ambient.groundColor.copy(o(n.ambGround,i.ambGround,this._colA)),this.fog.color.copy(o(n.fog,i.fog,this._colA)),this.fog.density=hn(n.fogD,i.fogD,a),this.scene.background=this.fog.color,this.state={name:a<.5?n.name:i.name,stars:hn(n.stars,i.stars,a),skyTop:o(n.skyTop,i.skyTop,this._colA).clone(),skyBottom:o(n.skyBottom,i.skyBottom,this._colA).clone(),sunElevation:l}}get daylight(){return Ot((this.sun.intensity-.1)/2.4)}get isNight(){return this.t<.24||this.t>.8}get isDeepNight(){return this.t<.16||this.t>.88}get clockText(){const t=Math.floor(this.t*24*60),e=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${e}:${n}`}get hoursToDawn(){let e=.25-this.t;return e<0&&(e+=1),e*24}dispose(){for(const t of[this.sun,this.moon,this.ambient])t.removeFromParent();this.sun.target.removeFromParent(),this.moon.target.removeFromParent()}}const Si={tree:{hits:5,tool:"axe",bareMult:.5,label:"TREE"},rock:{hits:6,tool:"pick",bareMult:0,label:"ROCK"},bush:{hits:1,tool:null,bareMult:1,label:"BERRY BUSH"},deadfall:{hits:1,tool:null,bareMult:1,label:"FALLEN BRANCHES"},flint:{hits:1,tool:null,bareMult:1,label:"LOOSE STONE"},fungus:{hits:1,tool:null,bareMult:1,label:"MUSHROOMS"},water:{hits:0,tool:null,bareMult:1,label:"WATER"}};class W0{constructor(t,e,n,i){this.terrain=t,this.forest=e,this.scene=i,this.group=new Yt,this.group.name="resources",i.add(this.group),this.nodes=[];const s=Bn(n^2533);this._buildTrees(s),this._buildRocks(s),this._buildForage(s),this._buildGroundLoot(s),this._buildPonds(s)}_buildTrees(t){for(const e of this.forest.trees)t()>.42||this.nodes.push({kind:"tree",x:e.x,z:e.z,y:e.y,radius:e.r+1.5,hp:Si.tree.hits,maxHp:Si.tree.hits,drops:e.dead?{branch:[2,4],wood:[1,2],fibre:[0,1]}:{wood:[2,3],branch:[1,3],fibre:[1,2]},tree:e,depleted:!1,respawn:0,shake:0})}_buildRocks(t){const e=new Fn(1,1),n=e.attributes.position;for(let l=0;l<n.count;l++){const h=new R().fromBufferAttribute(n,l);h.multiplyScalar(.78+Math.abs(Math.sin(l*12.9898))*.42),n.setXYZ(l,h.x,h.y,h.z)}e.computeVertexNormals();const i=new Gt({color:9276294,roughness:.96,metalness:.02,flatShading:!0}),s=new Gt({color:10122072,roughness:.8,metalness:.35,flatShading:!0,emissive:1707270,emissiveIntensity:1}),a=90;this.rockMesh=new Ti(e,i,a),this.rockMesh.castShadow=this.rockMesh.receiveShadow=!0,this.rockMesh.frustumCulled=!1,this.group.add(this.rockMesh);const o=new ue;let c=0;for(let l=0;l<a*4&&c<a;l++){const h=this.forest.findOpenSpot(t,{minRadius:8,maxRadius:bt-12,clearance:2.4}),u=t()<.35,d=t.range(1.1,2.3);if(o.position.set(h.x,h.y+d*.45,h.z),o.rotation.set(t.range(0,6),t.range(0,6),t.range(0,6)),o.scale.set(d,d*t.range(.6,.95),d*t.range(.85,1.2)),o.updateMatrix(),this.rockMesh.setMatrixAt(c,o.matrix),u){const p=new K(new Fn(d*.34,0),s);p.position.set(h.x+t.range(-.3,.3),h.y+d*.6,h.z+t.range(-.3,.3)),p.rotation.set(t.range(0,6),t.range(0,6),0),p.castShadow=!0,this.group.add(p)}this.nodes.push({kind:"rock",x:h.x,z:h.z,y:h.y,radius:d+1.4,hp:Si.rock.hits,maxHp:Si.rock.hits,drops:u?{stone:[2,4],ore:[1,2]}:{stone:[3,5]},instance:c,depleted:!1,respawn:0,shake:0}),this.forest.trees.push({x:h.x,z:h.z,r:d*.8,y:h.y,h:d}),c++}this.rockMesh.count=c,this.rockMesh.instanceMatrix.needsUpdate=!0}_buildForage(t){const e=new Fn(.62,1),n=new Gt({color:3754028,roughness:1,flatShading:!0});hs(n,{amount:.1,stiffness:1.8});const i=new Gt({color:9311264,roughness:.5,emissive:2753800,emissiveIntensity:1});for(let o=0;o<70;o++){const c=this.forest.findOpenSpot(t,{minRadius:6,maxRadius:bt-10,clearance:1.4}),l=new K(e,n),h=t.range(.8,1.35);l.position.set(c.x,c.y+.42*h,c.z),l.scale.set(h,h*.82,h),l.rotation.y=t.range(0,6),l.castShadow=l.receiveShadow=!0,this.group.add(l);const u=new Yt;for(let d=0;d<9;d++){const p=new K(new ii(.055,6,5),i),g=t.range(0,6.28),_=t.range(.3,.6)*h;p.position.set(Math.cos(g)*_,t.range(.25,.75)*h,Math.sin(g)*_),u.add(p)}u.position.set(c.x,c.y,c.z),this.group.add(u),this.nodes.push({kind:"bush",x:c.x,z:c.z,y:c.y,radius:1.7,hp:1,maxHp:1,drops:{berries:[2,4],fibre:[1,2]},mesh:u,depleted:!1,respawn:0,respawnTime:180,shake:0})}const s=new Gt({color:14208436,roughness:.85,emissive:1380872,emissiveIntensity:1}),a=new Gt({color:12103320,roughness:.9});for(let o=0;o<55;o++){const c=this.forest.findOpenSpot(t,{minRadius:6,maxRadius:bt-10,clearance:1}),l=new Yt,h=2+Math.floor(t()*4);for(let u=0;u<h;u++){const d=t.range(.7,1.3),p=new K(new le(.028,.038,.16*d,6),a),g=new K(new ii(.085*d,8,6,0,6.3,0,1.7),s),_=t.range(-.3,.3),m=t.range(-.3,.3);p.position.set(_,.08*d,m),g.position.set(_,.16*d,m),l.add(p,g)}l.position.set(c.x,c.y,c.z),this.group.add(l),this.nodes.push({kind:"fungus",x:c.x,z:c.z,y:c.y,radius:1.5,hp:1,maxHp:1,drops:{mushroom:[1,3]},mesh:l,depleted:!1,respawn:0,respawnTime:240,shake:0})}}_buildGroundLoot(t){const e=new Gt({color:6969924,roughness:.96}),n=new Gt({color:9078912,roughness:.82,flatShading:!0});for(let i=0;i<130;i++){const s=this.forest.findOpenSpot(t,{minRadius:3,maxRadius:bt-8,clearance:.9}),a=new Yt,o=2+Math.floor(t()*3);for(let c=0;c<o;c++){const l=t.range(.5,1.1),h=new K(new le(.032,.045,l,5),e);h.rotation.set(Math.PI/2+t.range(-.16,.16),t.range(0,6.28),0),h.position.set(t.range(-.28,.28),.05,t.range(-.28,.28)),h.castShadow=!0,a.add(h)}a.position.set(s.x,s.y,s.z),this.group.add(a),this.nodes.push({kind:"deadfall",x:s.x,z:s.z,y:s.y,radius:1.3,hp:1,maxHp:1,drops:{branch:[2,4],fibre:[0,1]},mesh:a,depleted:!1,respawn:0,respawnTime:300,shake:0})}for(let i=0;i<110;i++){const s=this.forest.findOpenSpot(t,{minRadius:3,maxRadius:bt-8,clearance:.9}),a=new Yt,o=2+Math.floor(t()*4);for(let c=0;c<o;c++){const l=t.range(.09,.19),h=new K(new Fn(l,0),n);h.position.set(t.range(-.32,.32),l*.6,t.range(-.32,.32)),h.rotation.set(t.range(0,6),t.range(0,6),t.range(0,6)),h.castShadow=h.receiveShadow=!0,a.add(h)}a.position.set(s.x,s.y,s.z),this.group.add(a),this.nodes.push({kind:"flint",x:s.x,z:s.z,y:s.y,radius:1.3,hp:1,maxHp:1,drops:{stone:[2,3]},mesh:a,depleted:!1,respawn:0,respawnTime:300,shake:0})}}_buildPonds(t){const e=new Gt({color:1845808,roughness:.08,metalness:.65,transparent:!0,opacity:.88});for(let n=0;n<5;n++){const i=this.forest.findOpenSpot(t,{minRadius:18,maxRadius:bt-24,clearance:6}),s=t.range(4.5,8.5),a=new K(new Ni(s,32),e);a.rotation.x=-Math.PI/2,a.position.set(i.x,i.y-.35,i.z),a.receiveShadow=!0,this.group.add(a);const o=new Gt({color:5921844,roughness:1,side:Ee});hs(o,{amount:.34,stiffness:1.2});for(let c=0;c<40;c++){const l=t.range(0,6.28),h=s*t.range(.85,1.15),u=i.x+Math.cos(l)*h,d=i.z+Math.sin(l)*h,p=new K(new Je(.06,t.range(.7,1.5)),o);p.position.set(u,this.terrain.heightAt(u,d)+.5,d),p.rotation.y=t.range(0,6),this.group.add(p)}this.nodes.push({kind:"water",x:i.x,z:i.z,y:i.y,radius:s+2.5,hp:1/0,maxHp:1/0,drops:{water_dirty:[1,1]},depleted:!1,respawn:0,shake:0,infinite:!0})}}targetFor(t,e=3.6){const n=t.position.x,i=t.position.z,s=t.forward();let a=null,o=-1/0;for(const c of this.nodes){if(c.depleted)continue;const l=c.x-n,h=c.z-i,u=Math.hypot(l,h),d=c.kind==="water"?c.radius:e+c.radius*.4;if(u>d)continue;const p=u<.001?1:l/u*s.x+h/u*s.z;if(p<.35&&c.kind!=="water")continue;const g=p*2-u*.2;g>o&&(o=g,a=c)}return a}harvest(t,e,n=Math.random){const i=Si[t.kind];if(!i)return{drops:null,done:!1,blocked:null};let s=1;if(i.tool&&!e.tool(i.tool)){if(i.bareMult<=0)return{drops:null,done:!1,blocked:`NEEDS A ${i.tool.toUpperCase()}`};s=i.bareMult}return t.shake=1,t.infinite?{drops:this._roll(t.drops,n),done:!1,blocked:null}:(t.hp-=s,t.hp>0?{drops:null,done:!1,blocked:null}:(t.depleted=!0,t.respawn=t.respawnTime??0,this._setVisible(t,!1),{drops:this._roll(t.drops,n),done:!0,blocked:null}))}_roll(t,e){const n={};for(const[i,[s,a]]of Object.entries(t)){const o=s+Math.floor(e()*(a-s+1));o>0&&(n[i]=o)}return n}_setVisible(t,e){if(t.kind==="tree"&&t.tree){const n=new Qt;this.forest.trunks.getMatrixAt(this.forest.trees.indexOf(t.tree),n),t._savedMatrix||(t._savedMatrix=n.clone());const i=e?t._savedMatrix:n.premultiply(new Qt().makeTranslation(0,-200,0));this.forest.trunks.setMatrixAt(this.forest.trees.indexOf(t.tree),i),this.forest.trunks.instanceMatrix.needsUpdate=!0,t.tree.r=e?t._savedRadius??t.tree.r:.001,e&&t._savedRadius?t.tree.r=t._savedRadius:!e&&!t._savedRadius&&(t._savedRadius=t.tree.r)}else if(t.mesh)t.mesh.visible=e;else if(t.kind==="rock"&&t.instance!==void 0){const n=new Qt;this.rockMesh.getMatrixAt(t.instance,n),t._savedMatrix||(t._savedMatrix=n.clone()),this.rockMesh.setMatrixAt(t.instance,e?t._savedMatrix:n.premultiply(new Qt().makeTranslation(0,-200,0))),this.rockMesh.instanceMatrix.needsUpdate=!0}}update(t){for(const e of this.nodes)e.shake>0&&(e.shake=Jt(e.shake,0,8,t)),!(!e.depleted||!e.respawnTime)&&(e.respawn-=t,e.respawn<=0&&(e.depleted=!1,e.hp=e.maxHp,this._setVisible(e,!0)))}describe(t,e){const n=Si[t.kind],i=n.tool&&!e.tool(n.tool),s=t.infinite?1:Ot(t.hp/t.maxHp);return{label:n.label,needs:i?n.tool:null,progress:s}}dispose(){this.group.traverse(t=>{t.geometry?.dispose?.()}),this.group.removeFromParent()}}const X0=5.5,q0=3.4;class Y0{constructor(t,e){this.terrain=t,this.scene=e,this.group=new Yt,this.group.name="placeables",e.add(this.group),this.items=[],this._t=0,this.mats={log:new Gt({color:4864554,roughness:.95}),stone:new Gt({color:7302246,roughness:.95,flatShading:!0}),ember:new Gt({color:2756356,emissive:16733456,emissiveIntensity:2,roughness:1}),thatch:new Gt({color:6050612,roughness:1,side:Ee})}}placeFire(t,e){const n=this.terrain.heightAt(t,e),i=new Yt;i.position.set(t,n,e);for(let h=0;h<9;h++){const u=h/9*Math.PI*2,d=new K(new Fn(.17,0),this.mats.stone);d.position.set(Math.cos(u)*.62,.08,Math.sin(u)*.62),d.rotation.set(u,u*1.7,0),d.scale.setScalar(.8+Math.random()*.5),d.castShadow=d.receiveShadow=!0,i.add(d)}for(let h=0;h<4;h++){const u=h/4*Math.PI,d=new K(new le(.07,.09,.9,6),this.mats.log);d.position.set(0,.18,0),d.rotation.set(Math.PI/2.6,u,0),d.castShadow=!0,i.add(d)}const s=new K(new ii(.24,10,8),this.mats.ember.clone());s.position.y=.2,i.add(s);const a=new ni({color:16742942,transparent:!0,opacity:.55,blending:bn,depthWrite:!1}),o=[];for(let h=0;h<3;h++){const u=new K(new fs(.22-h*.05,.7-h*.16,7),a.clone());u.material.color.setHex([16734736,16751658,16767114][h]),u.position.y=.42+h*.1,i.add(u),o.push(u)}const c=new hr(16747056,0,24,2);c.position.y=.7,c.castShadow=!0,c.shadow.mapSize.set(512,512),i.add(c),this.group.add(i);const l={kind:"campfire",group:i,light:c,ember:s,flames:o,x:t,y:n,z:e,fuel:1,burnRate:1/360,lit:!0};return this.items.push(l),l}placeShelter(t,e,n=0){const i=this.terrain.heightAt(t,e),s=new Yt;s.position.set(t,i,e),s.rotation.y=n;for(const l of[-1,1]){const h=new K(new Je(3,2.4),this.mats.thatch);h.position.set(l*.72,.95,0),h.rotation.set(0,Math.PI/2,l*.62),h.castShadow=h.receiveShadow=!0,s.add(h)}const a=new K(new le(.06,.06,3.1,6),this.mats.log);a.rotation.z=Math.PI/2,a.position.y=1.85,s.add(a);for(const l of[-1,1]){const h=new K(new le(.07,.08,1.9,6),this.mats.log);h.position.set(0,.95,l*1.45),s.add(h)}const o=new K(new Ct(1.5,.12,2.4),this.mats.thatch);o.position.y=.08,o.receiveShadow=!0,s.add(o),s.traverse(l=>{l.isMesh&&(l.castShadow=!0)}),this.group.add(s);const c={kind:"shelter",group:s,x:t,y:i,z:e};return this.items.push(c),c}fireAt(t,e){for(const n of this.items)if(!(n.kind!=="campfire"||!n.lit)&&Math.hypot(n.x-t,n.z-e)<X0)return n;return null}shelterAt(t,e){for(const n of this.items)if(n.kind==="shelter"&&Math.hypot(n.x-t,n.z-e)<q0)return n;return null}targetFor(t,e=3){let n=null,i=e;for(const s of this.items){const a=Math.hypot(s.x-t.position.x,s.z-t.position.z);a<i&&(i=a,n=s)}return n}refuel(t,e=.45){t.fuel=Ot(t.fuel+e),t.lit=!0}update(t){this._t+=t;for(const e of this.items){if(e.kind!=="campfire")continue;e.lit&&(e.fuel=Ot(e.fuel-e.burnRate*t),e.fuel<=0&&(e.lit=!1));const n=this._t,i=.78+Math.sin(n*9.1)*.09+Math.sin(n*21.7)*.06+Math.random()*.07,s=e.lit?(.35+e.fuel*.65)*i:0;e.light.intensity=Jt(e.light.intensity,s*34,12,t),e.light.distance=12+e.fuel*16,e.ember.material.emissiveIntensity=Jt(e.ember.material.emissiveIntensity,e.lit?1.4+e.fuel*2.4:.15,6,t),e.flames.forEach((a,o)=>{const c=s*(.7+Math.sin(n*(7+o*3.3)+o)*.22);a.scale.set(.7+c*.5,Math.max(.05,c*1.25),.7+c*.5),a.rotation.y=n*(.7+o*.4),a.position.x=Math.sin(n*(5+o*2))*.03,a.material.opacity=e.lit?.35+c*.4:0})}}dispose(){this.group.traverse(t=>{t.geometry?.dispose?.()});for(const t of Object.values(this.mats))t.dispose();this.group.removeFromParent(),this.items=[]}}const Sn={hunger:1/900,thirst:1/540,starving:1.6/100,dehydrated:2.6/100,freezing:3.4/100,regen:.9/100,staminaDrain:.24,staminaRegenMoving:.11,staminaRegenStill:.2};class $0{constructor(){this.reset()}reset(){this.health=1,this.hunger=1,this.thirst=1,this.warmth=1,this.stamina=1,this.nearFire=!1,this.sheltered=!1,this.dead=!1,this.causeOfDeath=null,this._hurtPulse=0,this._warned=new Set}update(t,e){if(this.dead)return[];const n=[];this.hunger=Ot(this.hunger-Sn.hunger*t),this.thirst=Ot(this.thirst-Sn.thirst*t);let i;if(e.nearFire?i=1/90:e.sheltered?i=-.0033333333333333335*.25+e.daylight*(1/300):i=e.daylight>.35?.004166666666666667*e.daylight:-.0033333333333333335*(1-e.daylight),e.sprinting&&(i+=1/900),this.warmth=Ot(this.warmth+i*t),this.nearFire=e.nearFire,this.sheltered=e.sheltered,e.sprinting)this.stamina=Ot(this.stamina-Sn.staminaDrain*t);else{const a=e.moving?Sn.staminaRegenMoving:Sn.staminaRegenStill,o=(this.hunger<.15?.5:1)*(this.warmth<.2?.5:1);this.stamina=Ot(this.stamina+a*o*t)}let s=0;return this.hunger<=0&&(s+=Sn.starving),this.thirst<=0&&(s+=Sn.dehydrated),this.warmth<=0&&(s+=Sn.freezing),s>0?(this.health=Ot(this.health-s*t),this._hurtPulse=Math.min(1,this._hurtPulse+s*t*6)):this.hunger>.3&&this.thirst>.3&&this.warmth>.3&&(this.health=Ot(this.health+Sn.regen*t)),this._hurtPulse=Math.max(0,this._hurtPulse-t*.8),n.push(...this._threshold("thirst",this.thirst,.25,"THIRSTY — find water")),n.push(...this._threshold("hunger",this.hunger,.25,"HUNGRY — find food")),n.push(...this._threshold("warmth",this.warmth,.3,"COLD — get to a fire")),n.push(...this._threshold("health",this.health,.35,"INJURED — you are dying")),this.health<=0&&!this.dead&&(this.dead=!0,this.causeOfDeath=this.warmth<=0?"exposure":this.thirst<=0?"thirst":this.hunger<=0?"starvation":"injury"),n}_threshold(t,e,n,i){const s=this._warned.has(t);return e<n&&!s?(this._warned.add(t),[i]):(e>n+.15&&s&&this._warned.delete(t),[])}eat(t){this.hunger=Ot(this.hunger+t)}drink(t){this.thirst=Ot(this.thirst+t)}heal(t){this.health=Ot(this.health+t)}warm(t){this.warmth=Ot(this.warmth+t)}hurt(t,e="injury"){this.health=Ot(this.health-t),this._hurtPulse=Math.min(1,this._hurtPulse+t*3),this.health<=0&&!this.dead&&(this.dead=!0,this.causeOfDeath=e)}get hurtPulse(){return ns(this._hurtPulse,0,1)}get mostUrgent(){const t=[["THIRST",this.thirst],["HUNGER",this.hunger],["WARMTH",this.warmth]].sort((e,n)=>e[1]-n[1]);return t[0][1]<.35?t[0][0]:null}}const sn={branch:{name:"BRANCH",stack:40,tag:"material",desc:"Dry deadfall. Burns fast."},wood:{name:"WOOD",stack:40,tag:"material",desc:"Split logs. The backbone of everything."},stone:{name:"STONE",stack:40,tag:"material",desc:"Rough flint. Sharp enough to matter."},fibre:{name:"FIBRE",stack:60,tag:"material",desc:"Stripped bark cordage."},ore:{name:"IRON ORE",stack:20,tag:"material",desc:"Heavy, rust-red, worth the arm ache."},berries:{name:"BERRIES",stack:20,tag:"food",food:.18,thirst:.06,desc:"Tart. Barely food, but food."},mushroom:{name:"MUSHROOM",stack:20,tag:"food",food:.12,desc:"Probably fine. Probably."},meat_raw:{name:"RAW MEAT",stack:10,tag:"food",food:.15,health:-.08,desc:"Eating this raw is a decision."},meat:{name:"COOKED MEAT",stack:10,tag:"food",food:.52,desc:"Hot, and worth the fire it took."},water:{name:"WATER",stack:5,tag:"food",thirst:.55,desc:"Cold enough to hurt your teeth."},axe:{name:"STONE AXE",stack:1,tag:"tool",tool:"axe",power:1,desc:"Fells trees. Slowly."},pick:{name:"STONE PICK",stack:1,tag:"tool",tool:"pick",power:1,desc:"Breaks rock into something useful."},torch:{name:"TORCH",stack:1,tag:"tool",tool:"torch",desc:"Burns for a while. Warms a little. Shows a lot."},campfire:{name:"CAMPFIRE",stack:5,tag:"place",place:"campfire",desc:"Warmth, light, and a place to cook."},shelter:{name:"LEAN-TO",stack:3,tag:"place",place:"shelter",desc:"Blocks the wind. Lets you sleep to dawn."}},Pc=[{id:"axe",out:{axe:1},in:{branch:2,stone:3,fibre:2},at:null,blurb:"Lash a split stone to a straight branch."},{id:"pick",out:{pick:1},in:{branch:2,stone:4,fibre:2},at:null,blurb:"Heavier, blunter, for rock."},{id:"torch",out:{torch:1},in:{branch:1,fibre:2},at:null,blurb:"Bark wrapped tight and soaked in pitch."},{id:"campfire",out:{campfire:1},in:{wood:3,stone:4,branch:2},at:null,blurb:"A ring of stones and everything dry you own."},{id:"shelter",out:{shelter:1},in:{wood:6,branch:6,fibre:4},at:null,blurb:"Enough roof to be on the right side of."},{id:"meat",out:{meat:1},in:{meat_raw:1},at:"campfire",blurb:"Cook it before it decides for you."},{id:"water",out:{water:1},in:{water_dirty:1},at:"campfire",blurb:"Boiling is not optional."}];sn.water_dirty={name:"MURKY WATER",stack:5,tag:"food",thirst:.3,health:-.1,desc:"Drinkable. Ill-advised. Boil it."};class K0{constructor(t=20){this.slots=t,this.items=new Map,this.onChange=null}clear(){this.items.clear(),this.onChange?.()}count(t){return this.items.get(t)??0}add(t,e=1){const n=sn[t];if(!n)return 0;const i=this.count(t);if(i===0&&this.items.size>=this.slots)return 0;const s=n.stack-i,a=Math.max(0,Math.min(e,s));return a>0&&(this.items.set(t,i+a),this.onChange?.()),a}remove(t,e=1){const n=this.count(t);return n<e?!1:(n===e?this.items.delete(t):this.items.set(t,n-e),this.onChange?.(),!0)}has(t){return Object.entries(t).every(([e,n])=>this.count(e)>=n)}tool(t){for(const[e,n]of this.items)if(n>0&&sn[e]?.tool===t)return e;return null}craft(t){if(!this.has(t.in))return!1;for(const[e,n]of Object.entries(t.in))this.remove(e,n);for(const[e,n]of Object.entries(t.out))this.add(e,n);return!0}get sorted(){const t={tool:0,place:1,food:2,material:3};return[...this.items.entries()].map(([e,n])=>({id:e,n,def:sn[e]})).filter(e=>e.def).sort((e,n)=>(t[e.def.tag]??9)-(t[n.def.tag]??9)||e.def.name.localeCompare(n.def.name))}get used(){return this.items.size}}const Xs=r=>document.getElementById(r);class j0{constructor(t,e){this.inv=t,this.h=e,this.el=Xs("pack"),this.itemsEl=Xs("pack-items"),this.recipesEl=Xs("pack-recipes"),this.slotsEl=Xs("pack-slots"),this.itemsEl.addEventListener("click",n=>{const i=n.target.closest("[data-use]");i&&this.h.onUse?.(i.dataset.use)}),this.recipesEl.addEventListener("click",n=>{const i=n.target.closest("[data-recipe]");if(!i||!i.classList.contains("can"))return;const s=Pc.find(a=>a.id===i.dataset.recipe);s&&this.h.onCraft?.(s)})}get open(){return!this.el.hidden}toggle(){this.open?this.close():this.show()}show(){this.el.hidden=!1,this.render()}close(){this.el.hidden=!0}render(){if(!this.open)return;const t=this.h.nearFire?.()??!1;this.slotsEl.textContent=`${this.inv.used} / ${this.inv.slots} SLOTS`;const e=this.inv.sorted;this.itemsEl.innerHTML=e.length?e.map(({id:n,n:i,def:s})=>{const a=s.tag==="food",o=a?'<span class="slot__use">CLICK TO CONSUME</span>':"";return`<div class="slot ${a?"slot--use":""}" ${a?`data-use="${n}"`:""}>
            <span class="slot__n">${i}</span>
            <div class="slot__name">${s.name}</div>
            <div class="slot__desc">${s.desc}</div>
            ${o}
          </div>`}).join(""):'<p class="pack__empty">Nothing but the clothes you came in.<br />Pick up branches and stone — press <b>[E]</b> at a tree, a rock, or a bush.</p>',this.recipesEl.innerHTML=Pc.map(n=>{const i=this.inv.has(n.in)&&(!n.at||t),s=sn[Object.keys(n.out)[0]]?.name??n.id,a=Object.entries(n.in).map(([c,l])=>{const h=this.inv.count(c);return`<span class="${h<l?"short":""}">${sn[c]?.name??c} ${h}/${l}</span>`}).join(""),o=n.at&&!t?'<span class="recipe__at">NEEDS A FIRE</span>':"";return`<button class="recipe ${i?"can":""}" data-recipe="${n.id}" type="button">
          <div class="recipe__top"><span class="recipe__name">${s}</span>${o}</div>
          <div class="recipe__blurb">${n.blurb}</div>
          <div class="recipe__cost">${a}</div>
        </button>`}).join("")}}function Z0(){const r=[];for(let o=0;o<3;o++){const l=[],h=[],u=[],d=(o-1)*.42,p=1-Math.abs(o-1)*.22,g=.045;for(let m=0;m<=4;m++){const f=m/4,E=f*p,T=g*(1-f*.92),x=d*f*f*.55,A=Math.sin(f*1.4)*.06*d;if(l.push(x-T,E,A,x+T,E,A),h.push(0,f,1,f),m<4){const b=m*2;u.push(b,b+1,b+2,b+1,b+3,b+2)}}const _=new Ce;_.setAttribute("position",new ee(l,3)),_.setAttribute("uv",new ee(h,2)),_.setIndex(u),_.rotateY((o-1)*.7),_.computeVertexNormals(),r.push(_)}const t=[],e=[],n=[],i=[];let s=0;for(const o of r){t.push(...o.attributes.position.array),e.push(...o.attributes.uv.array),n.push(...o.attributes.normal.array);for(const c of o.index.array)i.push(c+s);s+=o.attributes.position.count,o.dispose()}const a=new Ce;return a.setAttribute("position",new ee(t,3)),a.setAttribute("uv",new ee(e,2)),a.setAttribute("normal",new ee(n,3)),a.setIndex(i),a}function J0(){const r=document.createElement("canvas");r.width=4,r.height=64;const t=r.getContext("2d"),e=t.createLinearGradient(0,64,0,0);e.addColorStop(0,"#2b3520"),e.addColorStop(.45,"#4c5c33"),e.addColorStop(.82,"#77803f"),e.addColorStop(1,"#9aa055"),t.fillStyle=e,t.fillRect(0,0,4,64);const n=new ds(r);return n.colorSpace=Re,n}class Q0{constructor(t,e,n,i,s=26e3){this.terrain=t;const a=Bn(n^649813),o=Z0(),c=new Gt({map:J0(),roughness:.92,metalness:0,side:Ee,vertexColors:!0});hs(c,{amount:.3,stiffness:1.5}),this.mesh=new Ti(o,c,s),this.mesh.frustumCulled=!1,this.mesh.receiveShadow=!0,this.mesh.castShadow=!1,this.mesh.name="grass";const l=new ue,h=new Nt;let u=0;for(let d=0;d<s*3&&u<s;d++){const p=a.range(-bt+2,bt-2),g=a.range(-bt+2,bt-2);if(this.terrain.slopeAt(p,g)>.5)continue;const _=Math.sin(p*.13)*Math.cos(g*.11)*.5+.5;if(a()>.28+_*.72)continue;const m=a.range(.28,.82)*(.7+_*.6);l.position.set(p,this.terrain.heightAt(p,g)-.06,g),l.rotation.set(0,a.range(0,Math.PI*2),0),l.scale.set(a.range(.8,1.3),m,a.range(.8,1.3)),l.updateMatrix(),this.mesh.setMatrixAt(u,l.matrix);const f=a();h.setRGB(.7+f*.5,.85+f*.35,.55+f*.3),this.mesh.setColorAt(u,h),u++}this.mesh.count=u,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0),i.add(this.mesh),this._buildMotes(a,i)}_buildMotes(t,e){const i=new Float32Array(2100),s=new Float32Array(700);this._moteHome=new Float32Array(700*3);for(let c=0;c<700;c++){const l=t.range(-bt,bt),h=t.range(-bt,bt),u=this.terrain.heightAt(l,h)+t.range(.3,3.4);i[c*3]=l,i[c*3+1]=u,i[c*3+2]=h,s[c]=t.range(.06,.28)}const a=new Ce;a.setAttribute("position",new Pe(i,3)),a.setAttribute("aSpeed",new Pe(s,1));const o=new Ue({uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:bn,vertexShader:`
        attribute float aSpeed;
        uniform float uTime;
        varying float vFade;
        void main() {
          vec3 p = position;
          // rise and loop over a 4 m column, wandering sideways as they go
          float life = fract(uTime * aSpeed * 0.25 + aSpeed * 13.0);
          p.y += life * 4.0;
          p.x += sin(uTime * 0.5 + aSpeed * 30.0) * 0.5;
          p.z += cos(uTime * 0.43 + aSpeed * 21.0) * 0.5;
          vFade = sin(life * 3.14159);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          // only visible up close — they are lit by your torch, not the moon
          vFade *= smoothstep(26.0, 4.0, -mv.z);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = 2.6 * (34.0 / -mv.z);
        }
      `,fragmentShader:`
        varying float vFade;
        void main() {
          float r = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.0, r) * vFade * 0.5;
          gl_FragColor = vec4(vec3(1.0, 0.94, 0.82), a);
        }
      `});this.motes=new nl(a,o),this.motes.frustumCulled=!1,this.motes.name="motes",this.moteMat=o,e.add(this.motes)}update(t,e){this.moteMat.uniforms.uTime.value=e}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.removeFromParent(),this.motes.geometry.dispose(),this.motes.material.dispose(),this.motes.removeFromParent()}}class tg{constructor(t,e,n,i,s){this.terrain=t,this.forest=e,this.props=n,this.group=new Yt,this.group.name="buildings",s.add(this.group),this.rooms=[],this.places=[];const a=Js().clone();a.wrapS=a.wrapT=Di,a.repeat.set(2,1),a.needsUpdate=!0,this.mats={log:new Gt({map:a,normalMap:Qs(),roughness:.94,metalness:0,color:16777215}),plank:new Gt({map:Js(),normalMap:Qs(),roughness:.95,color:14275268}),floor:new Gt({map:Js(),normalMap:Qs(),roughness:.9,color:12102807}),stone:new Gt({map:ml(),normalMap:gl(),roughness:.95,color:15789284}),dark:new Gt({color:723725,roughness:1}),cloth:new Gt({color:6971212,roughness:1})},this._populate(i)}_populate(t){const e=[],n=(i,s,a)=>{for(let c=0;c<80;c++){const l=this.forest.findOpenSpot(t,{minRadius:i,maxRadius:s,clearance:7});if(e.every(h=>h.distanceTo(l)>a))return e.push(l),l}const o=this.forest.findOpenSpot(t,{minRadius:i,maxRadius:s,clearance:7});return e.push(o),o};this._farmhouse(n(30,96,50),t);for(let i=0;i<4;i++)this._cabin(n(22,104,34),t)}_wall(t,e,n,i,s,a,o,c,l=[]){const h=new Yt;h.position.set(t,e,n),h.rotation.y=i;const u=[...l].sort((E,T)=>E[0]-T[0]),d=s/2;let p=-d;const g=[];for(const[E,T]of u){const x=E-T/2;x>p&&g.push([p,x]),p=Math.max(p,E+T/2)}p<d&&g.push([p,d]);for(const[E,T]of g){const x=T-E;if(x<.02)continue;const A=new K(new Ct(x,a,o),c);A.position.set((E+T)/2,a/2,0),A.castShadow=A.receiveShadow=!0,h.add(A)}for(const[E,T,x=0,A=a]of u){if(A<a){const b=new K(new Ct(T,a-A,o),c);b.position.set(E,A+(a-A)/2,0),b.castShadow=b.receiveShadow=!0,h.add(b)}if(x>0){const b=new K(new Ct(T,x,o),c);b.position.set(E,x/2,0),b.castShadow=b.receiveShadow=!0,h.add(b)}}this.group.add(h);const _=Math.cos(i),m=Math.sin(i),f=E=>[t+E*_,n-E*m];for(const[E,T]of g){if(T-E<.02)continue;const[x,A]=f(E),[b,C]=f(T);this.props.segments.push({x1:x,z1:A,x2:b,z2:C,r:o*.5+.3,tall:!0})}for(const[E,T,x=0]of u){if(x<=.05)continue;const[A,b]=f(E-T/2),[C,I]=f(E+T/2);this.props.segments.push({x1:A,z1:b,x2:C,z2:I,r:o*.5+.3,tall:!1})}return h}_anchor(t,e,n,i,s,a){this.props.anchors.push({position:new R(t,e,n),normal:new R(i,0,s),name:a})}_floor(t,e,n,i,s,a,o){const c=new K(new Ct(s,.16,a),o);return c.position.set(t,e-.08,n),c.rotation.y=i,c.receiveShadow=!0,this.group.add(c),c}_roof(t,e,n,i,s,a,o,c){const l=new Yt;l.position.set(t,e,n),l.rotation.y=i;const h=Math.atan2(o,a/2),u=Math.hypot(o,a/2);for(const d of[-1,1]){const p=new K(new Ct(s+.7,.16,u*2+.2),c);p.position.set(0,o/2,d*a/4),p.rotation.x=-d*h,p.scale.z=.5,p.castShadow=p.receiveShadow=!0,l.add(p)}for(const d of[-1,1]){const p=new K(new Ct(.16,o,a*.9),c);p.position.set(d*s/2,o/2,0),p.castShadow=!0,l.add(p)}return this.group.add(l),l}_cabin(t,e){const{x:n,z:i}=t,s=this.terrain.heightAt(n,i),a=e.range(0,Math.PI*2),o=7.4,c=6.2,l=2.9,h=.3;this.places.push({name:"A CABIN",position:new R(n,s,i)}),this.rooms.push({x:n,z:i,angle:a,w:o,d:c,y:s,name:"A CABIN"});const u=Math.cos(a),d=Math.sin(a),p=[n+c/2*d,i+c/2*u],g=[n-c/2*d,i-c/2*u],_=[n-o/2*u,i+o/2*d],m=[n+o/2*u,i-o/2*d];this._floor(n,s,i,a,o,c,this.mats.floor);const f=e.range(-1.3,1.3);this._wall(p[0],s,p[1],a,o,l,h,this.mats.log,[[f,1.15,0,2.15]]),this._wall(g[0],s,g[1],a,o,l,h,this.mats.log,[[e.range(-1.6,1.6),1.2,1,2.1]]),this._wall(_[0],s,_[1],a+Math.PI/2,c,l,h,this.mats.log,[[.4,1.1,1,2.1]]),this._wall(m[0],s,m[1],a+Math.PI/2,c,l,h,this.mats.log,[]),this._roof(n,s+l,i,a,o,c,1.5,this.mats.plank);const E=new Yt;E.position.set(p[0]+d*.9,s,p[1]+u*.9),E.rotation.y=a;const T=new K(new Ct(o*.8,.14,1.8),this.mats.plank);T.position.y=.05,T.receiveShadow=!0,E.add(T);for(const y of[-1,1]){const S=new K(new Ct(.14,2.4,.14),this.mats.plank);S.position.set(y*o*.34,1.2,.7),S.castShadow=!0,E.add(S)}const x=new K(new Ct(o*.85,.12,2.1),this.mats.plank);x.position.set(0,2.4,.3),x.castShadow=!0,E.add(x),this.group.add(E);const A=(y,S,D,F,z=0)=>(y.position.set(n+S*u+F*d,s+D,i-S*d+F*u),y.rotation.y=a+z,y.castShadow=y.receiveShadow=!0,this.group.add(y),y),b=A(new K(new Ct(.8,1.1,.7),this.mats.dark),-o/2+.8,.55,-c/2+.7);A(new K(new le(.09,.09,2.4,8),this.mats.dark),-o/2+.8,2.1,-c/2+.7),this.props.circles.push({x:b.position.x,z:b.position.z,r:.65});const C=A(new K(new Ct(1,.42,2.1),this.mats.plank),o/2-.8,.21,.4);A(new K(new Ct(.92,.18,1.95),this.mats.cloth),o/2-.8,.5,.4),this.props.circles.push({x:C.position.x,z:C.position.z,r:1});const I=A(new K(new Ct(1.5,.09,.85),this.mats.plank),0,.78,1.2);for(const[y,S]of[[-.65,-.32],[.65,-.32],[-.65,.32],[.65,.32]])A(new K(new Ct(.09,.78,.09),this.mats.plank),y,.39,1.2+S);this.props.circles.push({x:I.position.x,z:I.position.z,r:.85});for(let y=0;y<2;y++)A(new K(new Ct(o-1.4,.07,.32),this.mats.plank),0,1.5+y*.5,-c/2+.24);A(new K(new le(.1,.13,.26,8),this.mats.dark),.3,.95,1.2),this._anchor(n-d*(c/2-.22),s+1.65,i-u*(c/2-.22),d,u,"a cabin"),this._anchor(n+u*(o/2-.22)*-1,s+1.6,i-d*(o/2-.22)*-1,u,-d,"a cabin")}_farmhouse(t,e){const{x:n,z:i}=t,s=this.terrain.heightAt(n,i),a=e.range(0,Math.PI*2),o=12.5,c=9.5,l=3.4,h=.34;this.places.push({name:"THE FARMHOUSE",position:new R(n,s,i)}),this.rooms.push({x:n,z:i,angle:a,w:o,d:c,y:s,name:"THE FARMHOUSE"});const u=Math.cos(a),d=Math.sin(a),p=[n+c/2*d,i+c/2*u],g=[n-c/2*d,i-c/2*u],_=[n-o/2*u,i+o/2*d],m=[n+o/2*u,i-o/2*d];this._floor(n,s,i,a,o,c,this.mats.floor),this._wall(p[0],s,p[1],a,o,l,h,this.mats.stone,[[-3.2,1.3,0,2.3],[1.6,1.4,1.05,2.4],[4.4,1.4,1.05,2.4]]),this._wall(g[0],s,g[1],a,o,l,h,this.mats.stone,[[-4,1.2,0,2.2],[1,1.4,1.05,2.4]]),this._wall(_[0],s,_[1],a+Math.PI/2,c,l,h,this.mats.stone,[[-1.4,1.3,1.05,2.4]]),this._wall(m[0],s,m[1],a+Math.PI/2,c,l,h,this.mats.stone,[[1.8,1.3,1.05,2.4]]);const f=1.6;this._wall(n+f*u,s,i-f*d,a+Math.PI/2,c,l,.26,this.mats.plank,[[-2.2,1.1,0,2.2]]),this._roof(n,s+l,i,a,o,c,2.2,this.mats.plank);const E=(b,C,I,y,S=0)=>(b.position.set(n+C*u+y*d,s+I,i-C*d+y*u),b.rotation.y=a+S,b.castShadow=b.receiveShadow=!0,this.group.add(b),b),T=E(new K(new Ct(2.2,1.5,.8),this.mats.stone),-o/2+1.4,.75,-c/2+.6);E(new K(new Ct(1.4,.9,.5),this.mats.dark),-o/2+1.4,.45,-c/2+.95),this.props.circles.push({x:T.position.x,z:T.position.z,r:1.3});const x=E(new K(new Ct(3.4,.11,1.1),this.mats.plank),-3,.82,1.4);for(const b of[-4.4,-1.6])for(const C of[.95,1.85])E(new K(new Ct(.11,.82,.11),this.mats.plank),b,.41,C);for(const b of[.55,2.25])E(new K(new Ct(3,.09,.34),this.mats.plank),-3,.46,b);this.props.circles.push({x:x.position.x,z:x.position.z,r:1.7});for(let b=0;b<3;b++)E(new K(new Ct(3.4,.08,.36),this.mats.plank),4.4,.9+b*.62,-c/2+.3);const A=E(new K(new Ct(1.2,2.2,.65),this.mats.plank),5.2,1.1,2.6);this.props.circles.push({x:A.position.x,z:A.position.z,r:.9}),this._anchor(n+(f-.2)*u,s+1.7,i-(f-.2)*d,u,-d,"the farmhouse"),this._anchor(n+(f+.2)*u,s+1.7,i-(f+.2)*d,-u,d,"the farmhouse"),this._anchor(n-d*(c/2-.24),s+1.8,i-u*(c/2-.24),d,u,"the farmhouse")}roomAt(t,e){for(const n of this.rooms){const i=t-n.x,s=e-n.z,a=Math.cos(-n.angle),o=Math.sin(-n.angle),c=i*a-s*o,l=i*o+s*a;if(Math.abs(c)<n.w/2&&Math.abs(l)<n.d/2)return n}return null}dispose(){this.group.traverse(t=>t.geometry?.dispose?.());for(const t of Object.values(this.mats))t.dispose();this.group.removeFromParent()}}const eg=2.4,ng=.84;function ig(r){const n=document.createElement("canvas");n.width=256,n.height=320;const i=n.getContext("2d"),s=Bn(4400+r*97);i.fillStyle="#cdc5ae",i.fillRect(0,0,256,320);for(let c=0;c<1400;c++)i.fillStyle=`rgba(${s.int(110,175)},${s.int(96,155)},${s.int(70,120)},${s.range(.02,.12)})`,i.fillRect(s.range(0,256),s.range(0,320),s.range(1,4),s.range(1,4));i.strokeStyle="rgba(90,105,130,0.22)",i.lineWidth=1;for(let c=40;c<300;c+=18)i.beginPath(),i.moveTo(14,c),i.lineTo(242,c),i.stroke();i.strokeStyle="rgba(26,22,18,0.72)";for(let c=0;c<13;c++){const l=52+c*18;let h=22+s.range(0,10);const u=236-s.range(0,70);for(i.lineWidth=s.range(1,1.9),i.beginPath(),i.moveTo(h,l);h<u;){const d=s.range(4,10);i.quadraticCurveTo(h+d*.5,l-s.range(1,6),h+d,l-s.range(0,2)),h+=d}i.stroke()}const a=i.createRadialGradient(256,320,10,256,320,190);a.addColorStop(0,"rgba(72,56,32,0.55)"),a.addColorStop(1,"rgba(72,56,32,0)"),i.fillStyle=a,i.fillRect(0,0,256,320);const o=new ds(n);return o.colorSpace=Re,o}class sg{constructor(t,e,n,i,s,a){this.terrain=t,this.group=new Yt,this.group.name="notes",a.add(this.group),this.items=[],this.read=new Set,this._place(e,n,i,s)}_place(t,e,n,i){const s=[];for(const o of n.rooms){const c=Math.cos(o.angle),l=Math.sin(o.angle);for(let h=0;h<3;h++){const u=i.range(-o.w/2+1,o.w/2-1),d=i.range(-o.d/2+1,o.d/2-1);s.push({position:new R(o.x+u*c+d*l,o.y+.9,o.z-u*l+d*c),kind:o.name==="THE FARMHOUSE"?"farmhouse":"cabin"})}}for(let o=s.length-1;o>0;o--){const c=Math.floor(i()*(o+1));[s[o],s[c]]=[s[c],s[o]]}const a=[];for(const o of fo){let c=null;const l=s.findIndex(h=>h.kind===o.place&&a.every(u=>u.distanceTo(h.position)>2.2));if(l>=0&&(c=s.splice(l,1)[0].position),!c&&s.length&&(c=s.pop().position),!c){const h=t.findOpenSpot(i,{minRadius:12,maxRadius:100,clearance:1.6});c=h.clone().setY(h.y+.06)}a.push(c.clone()),this.items.push(this._build(o,c,i))}}_build(t,e,n){const i=fo.indexOf(t),s=new Je(.3,.38,3,3),a=s.attributes.position;for(let l=0;l<a.count;l++)a.setZ(l,Math.sin(a.getX(l)*9)*.012+Math.cos(a.getY(l)*7)*.008);s.computeVertexNormals();const o=new Gt({map:ig(i),roughness:.92,side:Ee,emissive:1315084,emissiveIntensity:1}),c=new K(s,o);return c.position.copy(e),c.rotation.set(-Math.PI/2+n.range(-.06,.06),n.range(0,Math.PI*2),0),c.renderOrder=2,this.group.add(c),{mesh:c,data:t,position:e.clone(),taken:!1,pulse:n()*6.28}}targetFor(t){const e=t.eyePosition(),n=new R(0,0,-1).applyQuaternion(t.camera.quaternion);let i=null,s=1/0;for(const a of this.items){if(a.taken)continue;const o=e.distanceTo(a.position);o>eg||o>s||a.position.clone().sub(e).normalize().dot(n)<ng||(i=a,s=o)}return i}take(t){return!t||t.taken?null:(t.taken=!0,t.mesh.visible=!1,this.read.add(t.data.id),t.data)}update(t,e){const n=e.eyePosition();for(const i of this.items){if(i.taken)continue;i.pulse+=t*1.4;const s=n.distanceTo(i.position),o=.4+Ot((s-3)/14)*1.5+Math.sin(i.pulse)*.08,c=i.mesh.material;c.emissiveIntensity=Jt(c.emissiveIntensity,e.lightOn?o:o*.3,6,t)}}get count(){return this.read.size}get total(){return this.items.length}dispose(){for(const t of this.items)t.mesh.geometry.dispose(),t.mesh.material.map?.dispose(),t.mesh.material.dispose();this.group.removeFromParent()}}const Me={READING:"reading",IDLE:"idle",PLAYING:"playing",PAUSED:"paused",ENDING:"ending",OVER:"over"};class rg{constructor({canvas:t,settings:e,input:n,audio:i,hud:s,onEnd:a}){this.canvas=t,this.settings=e,this.input=n,this.audio=i,this.hud=s,this.onEnd=a,this.phase=Me.IDLE,this.elapsed=0,this.seedText="",this._initRenderer(),this._initScene(),this._clock=new rl,this._tmp=new R,this._loop=this._loop.bind(this),this._onResize=this._onResize.bind(this),addEventListener("resize",this._onResize),requestAnimationFrame(this._loop)}_initRenderer(){this.renderer=new c0({canvas:this.canvas,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Lc,this.renderer.toneMapping=Nc,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=Re}_initScene(){this.scene=new uu,this.camera=new He(this.settings.fov,innerWidth/innerHeight,.08,400),this.scene.add(this.camera),this.daynight=new V0(this.scene,.3),this.fog=this.daynight.fog,this.postfx=new B0(this.renderer,this.scene,this.camera,this.settings),this._onResize()}build(t){this.dispose(!1),this.seedText=t||String(Math.floor(Math.random()*16777215)).padStart(6,"0");const e=Dl(this.seedText),n=Bn(e);this.difficulty=Cl(this.settings),this.terrain=new v0(e),this.scene.add(this.terrain.mesh),this.skyDome=new z0(e,this.scene),this.forest=new x0(this.terrain,n,this.scene),this.grass=new Q0(this.terrain,this.forest,e,this.scene),this.resources=new W0(this.terrain,this.forest,e,this.scene),this.placeables=new Y0(this.terrain,this.scene),this.props=new M0(this.terrain,this.forest,n,this.scene),this.buildings=new tg(this.terrain,this.forest,this.props,n,this.scene),this.fragments=new T0(this.terrain,this.forest,this.props,n,this.scene,this.difficulty.fragments),this.notes=new sg(this.terrain,this.forest,this.props,this.buildings,n,this.scene),this.player=new P0(this.camera,this.terrain,this.forest,this.props,this.settings,this.scene),this.player.onFootstep=(s,a)=>this.audio.footstep(s,a),this.player.onLightToggle=s=>this.audio.flashlight(s),this._buildHorde(n),this.survival=new $0,this.inventory=new K0(20),this._crafted=0,this.pack=new j0(this.inventory,{onCraft:s=>{this.inventory.craft(s)&&(this._crafted++,this.audio.ui("select"),this.hud.toast(`CRAFTED ${sn[Object.keys(s.out)[0]].name}`),this.pack.render())},onUse:s=>this.consume(s),nearFire:()=>!!this.placeables?.fireAt(this.player.position.x,this.player.position.z)}),this.daynight.t=.3,this.daynight.day=1,this.daysSurvived=0,this._buildExit(n);const i=this.forest.findOpenSpot(n,{minRadius:0,maxRadius:6,clearance:2.6});this.player.spawn(i.x,i.z,n()*Math.PI*2)}_buildHorde(t){const e=this.difficulty;this.entities=[];for(let n=0;n<(e.watchers??1);n++){const i=new Sc(this.terrain,this.forest,this.props,e,t,this.scene,{archetype:cn.WATCHER,activateAt:n===0?0:3,scale:1+n*.06});this.entities.push(i)}for(let n=0;n<(e.stalkers??0);n++){const i=new Sc(this.terrain,this.forest,this.props,e,t,this.scene,{archetype:cn.STALKER,activateAt:(e.stalkerFrom??2)+n*2,chaseSpeed:(e.chaseSpeed??3.3)*(.9+t()*.25),scale:.94+t()*.2});this.entities.push(i)}for(const n of this.entities)n.onEvent=(i,s)=>this._onEntityEvent(i,s,n);this.entity=this.entities[0]}_buildExit(t){const e=Math.floor(t()*4),n=t.range(-.55,.55)*(bt-20),i=bt-18,s=[new R(n,0,-i),new R(i,0,n),new R(n,0,i),new R(-i,0,n)][e];s.y=this.terrain.heightAt(s.x,s.z);const a=new Yt;a.position.copy(s),a.rotation.y=e*Math.PI/2;const o=new Gt({map:_l(),roughness:.8,metalness:.4,color:9078400});for(const u of[-1,1]){const d=new K(new Ct(.34,5.4,.34),o);d.position.set(u*2.4,2.5,0),d.castShadow=!0,a.add(d)}const c=new K(new Ct(5.4,.3,.3),o);c.position.y=5.05,a.add(c),this.exitLamps=[];for(const u of[-1,1]){const d=new hr(16726556,0,26,2);d.position.set(u*2.4,4.6,0),a.add(d);const p=new K(new ii(.14,10,8),new Gt({color:2756363,emissive:16722448,emissiveIntensity:0}));p.position.copy(d.position),a.add(p),this.exitLamps.push({lamp:d,bulb:p})}const l=new ni({color:16722450,transparent:!0,opacity:0,depthWrite:!1,blending:bn,side:Ee}),h=new K(new le(1.1,3.4,90,12,1,!0),l);h.position.y=45,a.add(h),this.exitBeam=h,this.scene.add(a),this.exit={group:a,position:s.clone(),live:!1}}start(){this.build(this.settings.seed),this.elapsed=0,this.phase=Me.PLAYING;for(const t of this.entities)t.state=ve.DORMANT,t.group.visible=!1;this._threatTimer=240,this.survival.reset(),this.inventory.clear(),this.postfx.setFade(1),this.postfx.fadeTo(0),this.hud.show(),this.hud.opening(),this.input.lock(),this.input.onLockLost=()=>{this.phase===Me.PLAYING&&this.pause()},this._clock.getDelta()}pause(){this.phase===Me.PLAYING&&(this.phase=Me.PAUSED,this.pack?.close(),this.input.unlock(),this.hud.hide(),this.audio.suspend(),this.onPaused?.())}resume(){this.phase===Me.PAUSED&&(this.phase=Me.PLAYING,this.audio.resume(),this.hud.show(),this.input.lock(),this._clock.getDelta())}quit(){this.phase=Me.IDLE,this.input.unlock(),this.hud.hide(),this.postfx.setFade(1),this.dispose(!1)}end(t){this.phase===Me.ENDING||this.phase===Me.OVER||(this.phase=Me.ENDING,this.input.unlock(),this.hud.hide(),t==="escaped"?(this.audio.victory(),this.postfx.fadeTo(1)):(this.audio.death(),this.postfx.damage(1),this.postfx.glitch(1.5),t==="caught"&&this._deathStare(),setTimeout(()=>this.postfx.fadeTo(1),900)),setTimeout(()=>{this.phase=Me.OVER,this.onEnd?.(t,this.stats)},t==="escaped"?2600:2300))}_readNote(t){const e=this.notes.take(t);e&&(this.phase=Me.READING,this.input.unlock(),this.audio.pickup(),this.postfx.glitch(.3),this.notes.count===1&&this.hud.whisper(Ul,5),this.hud.setNotes(this.notes.count,this.notes.total),this.hud.showNote(e,this.notes.count,this.notes.total))}closeNote(){this.phase===Me.READING&&(this.hud.hideNote(),this.phase=Me.PLAYING,this.input.lock(),this._clock.getDelta())}_deathStare(){const t=this._killer??this.entity,e=new R(t.position.x,t.position.y+2.3,t.position.z),n=this.player.eyePosition();this.player.yaw=Math.atan2(-(e.x-n.x),-(e.z-n.z)),this.player.pitch=Math.atan2(e.y-n.y,Math.hypot(e.x-n.x,e.z-n.z)),this.player.addShake(1.4),this._staring=!0}get stats(){return{days:this.daynight?.day??1,time:ag(this.elapsed),seed:this.seedText,crafted:this._crafted??0,cause:this.survival?.causeOfDeath??null}}_onEntityEvent(t,e){switch(t){case"reposition":e&&e.distance<34&&(this.audio.staticBurst(.55),this.postfx.glitch(.4));break;case"charge":this.audio.scream(),this.postfx.glitch(1.2),this.player.addShake(.8),this.hud.whisper("<i>It stopped pretending.</i>",2.6);break;case"retreat":this.audio.staticBurst(.8),this.postfx.glitch(.7);break;case"escalate":this.audio.escalate(e.count),this.postfx.glitch(.9);break}}_tryPickup(){const{item:t}=this.fragments.targetFor(this.player);if(!t)return;this.fragments.take(t);const e=this.fragments.found;this.audio.pickup(),this.postfx.glitch(.8),this.player.addShake(.35),this.hud.setFound(e),this.hud.fragmentLine(e-1);for(const i of this.entities)i.state===ve.DORMANT?e>=i.activateAt&&(i.begin(this.player),i.archetype===cn.STALKER&&(this.audio.creature(.85),this.postfx.glitch(1.1),this.hud.whisper("<i>Something else just started moving.</i>",4))):i.onFragmentTaken(e,this.player);const n=e/this.difficulty.fragments;this._fogTarget=hn(.02,.05,n),this.skyDome.setDim(n),e>=this.difficulty.fragments&&this._openExit()}_openExit(){this.exit.live=!0,this.audio.escalate(this.difficulty.fragments+2),this.hud.whisper("The gate is awake. <i>Go.</i>",6)}_loop(){requestAnimationFrame(this._loop);const t=Math.min(.05,this._clock.getDelta());this.phase===Me.PLAYING?this._step(t):this.phase===Me.READING?(this._worldTime=(this._worldTime??0)+t,ar.uWindTime.value=this._worldTime,this.skyDome.update(t,this.camera),this.grass.update(t,this._worldTime),this.postfx.update(t,{staticLevel:this._hordeStatic??0,proximity:this._hordeProximity??0})):this.phase===Me.ENDING?this._stepEnding(t):this.postfx.update(t,{staticLevel:.02,proximity:0}),this.audio.update(t,{playing:this.phase===Me.PLAYING||this.phase===Me.ENDING||this.phase===Me.READING,staticLevel:this._hordeStatic??0,proximity:this._hordeProximity??0,observed:this.entities?.some(e=>e.observed)??!1,speed:this.player?.speed??0,stamina:this.player?.stamina??1,sprinting:this.player?.sprinting??!1}),this.postfx.render(),this.input.endFrame()}_step(t){this.elapsed+=t,this._worldTime=(this._worldTime??0)+t,ar.uWindTime.value=this._worldTime,this.daynight.update(t)&&this._onNewDay(),this.skyDome.update(t,this.camera),this.skyDome.setStarOpacity?.(this.daynight.state.stars),this.grass.update(t,this._worldTime),this.resources.update(t),this.placeables.update(t),this.player.update(t,this.input,this.difficulty),this.input.hit("pack")&&(this.pack.toggle(),this.audio.ui("select")),this.input.hit("place")&&this._placeHeld(),this.input.hit("use")&&this._interact();const n=this.placeables.fireAt(this.player.position.x,this.player.position.z),i=this.placeables.shelterAt(this.player.position.x,this.player.position.z)||this.buildings.roomAt(this.player.position.x,this.player.position.z),s=this.survival.update(t,{daylight:this.daynight.daylight,sprinting:this.player.sprinting,moving:this.player.speed>.4,nearFire:!!n,sheltered:!!i});for(const a of s)this.hud.toast(a,!0);if(this.player.stamina=this.survival.stamina,this.survival.dead){this.end(this.survival.causeOfDeath);return}this._updateThreat(t),this._updateAtmosphere(t),this._updateHud(n,i)}_onNewDay(){this.daysSurvived=this.daynight.day-1,this.hud.toast(`DAY ${this.daynight.day} — you are still here`,!1),this.audio.escalate(Math.min(8,this.daysSurvived+2))}_updateThreat(t){this._threatTimer=(this._threatTimer??90)-t;const e=this.daynight.isDeepNight,n=!!this.placeables.fireAt(this.player.position.x,this.player.position.z);if(e&&!n&&this._threatTimer<=0){const o=this.entities.filter(c=>c.state===ve.DORMANT);o.length&&(o[Math.floor(Math.random()*o.length)].begin(this.player),this.audio.creature(.9),this.postfx.glitch(1.2),this.hud.toast("SOMETHING IS AWAKE",!0),this.hud.whisper("<i>Something out past the trees has noticed the dark too.</i>",5)),this._threatTimer=150+Math.random()*180}if(!e||n)for(const o of this.entities)o.state!==ve.DORMANT&&o.position.distanceTo(this.player.position)>34&&(o.state=ve.DORMANT,o.group.visible=!1);let i="alive",s=0,a=0;for(const o of this.entities){if(o.state===ve.DORMANT)continue;o.group.visible=!0;const c=o.update(t,this.player,this.camera);c!=="alive"&&(i=c,this._killer=o),o.static>s&&(s=o.static),o.proximity>a&&(a=o.proximity)}this._hordeStatic=s,this._hordeProximity=a,this._chaseNear=this.entities.some(o=>o.state!==ve.DORMANT&&o.position.distanceTo(this.player.position)<16),i!=="alive"&&(this.hud.flashDamage(),this.end(i==="consumed"?"consumed":"caught"))}_interact(){const t=this.player,e=this.resources.targetFor(t),n=this.placeables.targetFor(t);if(n&&!e){if(n.kind==="campfire"){if(this.inventory.count("wood")>0||this.inventory.count("branch")>0){const i=this.inventory.count("wood")>0?"wood":"branch";this.inventory.remove(i,1),this.placeables.refuel(n,i==="wood"?.45:.2),this.hud.toast(`FED THE FIRE (-1 ${sn[i].name})`),this.audio.footstep(.4,!1)}else this.hud.toast("NO FUEL TO BURN",!0);return}if(n.kind==="shelter"){this._sleep();return}}if(e){this._harvest(e);return}}_harvest(t){const{drops:e,done:n,blocked:i}=this.resources.harvest(t,this.inventory);if(i){this.hud.toast(i,!0);return}if(this.audio.footstep(.85,!1),this.player.addShake(.12),!e)return;const s=[];for(const[a,o]of Object.entries(e)){const c=this.inventory.add(a,o);c>0?s.push(`+${c} ${sn[a].name}`):s.push("PACK FULL")}s.length&&this.hud.toast(s.join("  ")),this.pack?.render(),n&&this.postfx.glitch(.15)}_placeHeld(){for(const t of["campfire","shelter"])if(this.inventory.count(t)>0){this.placeItem(t);return}this.hud.toast("NOTHING TO PLACE — CRAFT A CAMPFIRE",!0)}placeItem(t){const e=sn[t];if(!e?.place||this.inventory.count(t)<1)return!1;const n=this.player.forward(),i=this.player.position.x+n.x*2,s=this.player.position.z+n.z*2;return e.place==="campfire"?this.placeables.placeFire(i,s):this.placeables.placeShelter(i,s,this.player.yaw),this.inventory.remove(t,1),this.hud.toast(`PLACED ${e.name}`),this.pack?.render(),!0}_sleep(){if(!this.daynight.isNight){this.hud.toast("NOT TIRED YET — SLEEP AFTER DARK",!0);return}const e=this.daynight.hoursToDawn/24*Ml;this.daynight.t=.26,this.daynight.day+=this.daynight.t<.26?1:0,this.survival.hunger=Math.max(0,this.survival.hunger-e*(1/900)),this.survival.thirst=Math.max(0,this.survival.thirst-e*(1/540)),this.survival.stamina=1,this.survival.heal(.25),this.daynight.apply(),this.postfx.setFade(1),this.postfx.fadeTo(0),this.hud.toast("SLEPT UNTIL DAWN"),this._onNewDay()}consume(t){const e=sn[t];!e||e.tag!=="food"||this.inventory.count(t)<1||(this.inventory.remove(t,1),e.food&&this.survival.eat(e.food),e.thirst&&this.survival.drink(e.thirst),e.health&&(e.health>0?this.survival.heal(e.health):this.survival.hurt(-e.health)),this.hud.toast(`ATE ${e.name}`),this.pack?.render())}_stepEnding(t){this.player._applyCamera(t);const e=this._killer??this.entity;this._staring&&e&&(e._face(this.player,t),e._animate(t,3),e.static=Math.min(1,e.static+t*.8)),this.postfx.update(t,{staticLevel:Math.min(1,(e?.static??0)+.35),proximity:1})}_updateExit(t){const e=this.exit.live;for(const{lamp:n,bulb:i}of this.exitLamps){const s=e?.75+Math.random()*.5:0;n.intensity=Jt(n.intensity,220*s,6,t),i.material.emissiveIntensity=Jt(i.material.emissiveIntensity,3*s,6,t)}this.exitBeam.material.opacity=Jt(this.exitBeam.material.opacity,e?.05:0,3,t)}_updateAtmosphere(t){this._fogTarget&&(this.fog.density=Jt(this.fog.density,this._fogTarget,.7,t));const e=this._hordeStatic*.03+this._hordeProximity*.012;this.fog.density=Math.max(this.fog.density,(this._fogTarget??.02)+e),this.postfx.update(t,{staticLevel:this._hordeStatic,proximity:this._hordeProximity,daylight:this.daynight.daylight}),this._hordeProximity>.55&&this.player.addShake(t*this._hordeProximity*.9)}_updateHud(t,e){const n=this.daynight;this.hud.setClock(n.day,n.clockText,n.state.name),this.hud.setVitals(this.survival);const i=this.inventory.tool("axe")?"AXE":null,s=this.inventory.tool("pick")?"PICK":null,a=[i,s].filter(Boolean).join(" · "),o=t?"<b>BY THE FIRE</b>":e?"<b>SHELTERED</b>":"";this.hud.setHeld([a&&`CARRYING ${a}`,o].filter(Boolean).join("  —  "));const c=this.resources.targetFor(this.player),l=this.placeables.targetFor(this.player);if(c){const u=this.resources.describe(c,this.inventory);this.hud.setPrompt({label:u.label,key:u.needs?`NEEDS A ${u.needs.toUpperCase()}`:"<b>[E]</b> HARVEST",progress:u.progress,blocked:!!u.needs})}else l?.kind==="campfire"?this.hud.setPrompt({label:l.lit?`CAMPFIRE — FUEL ${Math.round(l.fuel*100)}%`:"CAMPFIRE — OUT",key:"<b>[E]</b> ADD FUEL",progress:l.fuel,blocked:!1}):l?.kind==="shelter"?this.hud.setPrompt({label:"LEAN-TO",key:n.isNight?"<b>[E]</b> SLEEP UNTIL DAWN":"SLEEP AFTER DARK",progress:1,blocked:!n.isNight}):this.hud.setPrompt(null);let h="";this.hud.lookFallback?h="POINTER LOCK BLOCKED — <b>CLICK AND DRAG</b> TO LOOK":this._chaseNear?h="<b>RUN</b>":this.survival.mostUrgent?h=`${this.survival.mostUrgent} CRITICAL`:n.isNight&&!t?h=`DARK — ${n.hoursToDawn.toFixed(1)}H TO DAWN`:this.inventory.used===0&&(h="<b>[E]</b> AT TREES AND ROCKS · <b>[TAB]</b> FOR PACK"),this.hud.setHint(h)}_bearingTo(t){const e=this._tmp.set(t.x-this.player.position.x,0,t.z-this.player.position.z);let i=Math.atan2(e.x,e.z)-(this.player.yaw+Math.PI);for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;const s=i*180/Math.PI;return Math.abs(s)<25?"▲ AHEAD":Math.abs(s)>155?"▼ BEHIND":s<0?"◀ LEFT":"▶ RIGHT"}applySetting(t,e){switch(t){case"fov":this.camera.fov=e,this.camera.updateProjectionMatrix();break;case"volume":this.audio.setVolume(e);break;case"renderScale":this._onResize();break}}_onResize(){const t=Ot(this.settings.renderScale||1),e=Math.max(320,Math.floor(innerWidth*t)),n=Math.max(240,Math.floor(innerHeight*t));this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setPixelRatio(Math.min(devicePixelRatio,t<.9?1:2)),this.renderer.setSize(e,n,!1),this.canvas.style.width="100%",this.canvas.style.height="100%",this.postfx?.setSize(e,n)}dispose(t=!0){this._staring=!1;for(const e of this.entities??[])e.dispose?.();for(const e of[this.fragments,this.notes,this.props,this.forest,this.grass,this.skyDome,this.buildings,this.resources,this.placeables])e?.dispose?.();this.terrain&&(this.scene.remove(this.terrain.mesh),this.terrain.dispose());for(const e of["forest","props","fragments","entity","buildings"]){const n=this.scene.getObjectByName(e);n&&this.scene.remove(n)}this.exit&&this.scene.remove(this.exit.group),this.player&&this.player.rig?.removeFromParent();for(const e of["sky","grass","motes","resources","placeables"]){const n=this.scene.getObjectByName(e);n&&this.scene.remove(n)}this.terrain=this.forest=this.props=this.fragments=this.entity=this.player=null,this.grass=this.skyDome=this.buildings=this.notes=this._killer=null,this.resources=this.placeables=null,this.entities=[],this.exit=null,t&&(removeEventListener("resize",this._onResize),this.postfx.dispose(),this.renderer.dispose())}}function ag(r){const t=Math.floor(r/3600),e=Math.floor(r%3600/60),n=Math.floor(r%60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:${String(n).padStart(2,"0")}`}const jr=document.getElementById("scene"),qs=Rl(),og=matchMedia("(hover: none) and (pointer: coarse)").matches;og?(document.getElementById("boot").hidden=!0,document.getElementById("rotate").hidden=!1):cg();function cg(){const r=new Pl(jr),t=new Il(qs),e=new Fl,n=new rg({canvas:jr,settings:qs,input:r,audio:t,hud:e,onEnd:(a,o)=>s.showEnd(a,o)});let i=!1;const s=new Ol(qs,{onBootDone:()=>t.init(),onPlay:async()=>{await t.init(),i||(i=!0,await e.playIntro()),n.start()},onResume:()=>n.resume(),onQuit:()=>{n.quit(),s.show("menu")},onRetry:async()=>{await t.init(),n.start()},onPauseRequest:()=>n.pause(),onSettingChange:(a,o)=>{n.applySetting(a,o),ts(qs)},onSound:a=>t.ui(a),isReaderOpen:()=>e.readerOpen,onCloseReader:()=>n.closeNote()});n.onPaused=()=>s.showPause(n.stats),jr.addEventListener("click",()=>{s.current==="pause"?(s.hideAll(),n.resume()):s.current===null&&!r.locked&&!r.lockFailed&&r.lock()}),r.onLockFailed=()=>{e.setLookFallback(!0),document.body.classList.remove("playing")},document.addEventListener("visibilitychange",()=>{document.hidden&&n.pause()})}
