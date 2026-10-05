var Xu=0,Zc=1,qu=2;var ts=1,Yu=2,Zs=3,ii=0,ke=1,An=2,si=0,Js=1,es=2,Jc=3,$c=4,$s=5;var ns=100,Zu=101,Ju=102,$u=103,Ku=104,ju=200,Ks=201,Qu=202,td=203,Kc=204,is=205,ed=206,nd=207,id=208,sd=209,rd=210,ad=211,od=212,ld=213,cd=214,po=0,mo=1,go=2,Ps=3,_o=4,xo=5,vo=6,yo=7,$o=0,hd=1,ud=2,Hn=0,jc=1,Qc=2,th=3,ua=4,eh=5,nh=6,ih=7;var sh=300,Ui=301,ss=302,Ko=303,jo=304,da=306,Is=1e3,Kn=1001,Mo=1002,Xe=1003,dd=1004;var fa=1005;var Ze=1006,Qo=1007;var ri=1008;var gn=1009,rh=1010,ah=1011,js=1012,tl=1013,Gn=1014,Cn=1015,Vn=1016,el=1017,nl=1018,Qs=1020,oh=35902,lh=35899,ch=1021,hh=1022,Rn=1023,Qn=1026,Oi=1027,il=1028,sl=1029,Bi=1030,rl=1031;var al=1033,pa=33776,ma=33777,ga=33778,_a=33779,ol=35840,ll=35841,cl=35842,hl=35843,ul=36196,dl=37492,fl=37496,pl=37488,ml=37489,xa=37490,gl=37491,_l=37808,xl=37809,vl=37810,yl=37811,Ml=37812,Sl=37813,bl=37814,El=37815,Tl=37816,wl=37817,Al=37818,Cl=37819,Rl=37820,Pl=37821,Il=36492,Ll=36494,Dl=36495,Nl=36283,Fl=36284,va=36285,Ul=36286;var Ir=2300,So=2301,uo=2302,Dc=2303,Nc=2400,Fc=2401,Uc=2402;var fd=3200;var ya=0,pd=1,vi="",_e="srgb",Lr="srgb-linear",Dr="linear",me="srgb";var fo=7680;var md=519,gd=512,_d=513,xd=514,Ol=515,vd=516,yd=517,Bl=518,Md=519,uh=35044,zi=35048;var dh="300 es",On=2e3,Ls=2001;function Wf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Xf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Nr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Sd(){let i=Nr("canvas");return i.style.display="block",i}var cu={},Ds=null;function Fr(...i){let t="THREE."+i.shift();Ds?Ds("log",t,...i):console.log(t,...i)}function bd(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Jt(...i){i=bd(i);let t="THREE."+i.shift();if(Ds)Ds("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Zt(...i){i=bd(i);let t="THREE."+i.shift();if(Ds)Ds("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Yi(...i){let t=i.join(" ");t in cu||(cu[t]=!0,Jt(...i))}function Ed(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Td={[po]:mo,[go]:vo,[_o]:yo,[Ps]:xo,[mo]:po,[vo]:go,[yo]:_o,[xo]:Ps},ti=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],hu=1234567,Ar=Math.PI/180,Zi=180/Math.PI;function jn(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function fh(i,t){return(i%t+t)%t}function qf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Yf(i,t,e){return i!==t?(e-i)/(t-i):0}function Cr(i,t,e){return(1-e)*i+e*t}function Zf(i,t,e,n){return Cr(i,t,1-Math.exp(-e*n))}function Jf(i,t=1){return t-Math.abs(fh(i,t*2)-t)}function $f(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Kf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function jf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Qf(i,t){return i+Math.random()*(t-i)}function tp(i){return i*(.5-Math.random())}function ep(i){i!==void 0&&(hu=i);let t=hu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function np(i){return i*Ar}function ip(i){return i*Zi}function sp(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function rp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ap(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function op(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:Jt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Un(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var yi={DEG2RAD:Ar,RAD2DEG:Zi,generateUUID:jn,clamp:ne,euclideanModulo:fh,mapLinear:qf,inverseLerp:Yf,lerp:Cr,damp:Zf,pingpong:Jf,smoothstep:$f,smootherstep:Kf,randInt:jf,randFloat:Qf,randFloatSpread:tp,seededRandom:ep,degToRad:np,radToDeg:ip,isPowerOfTwo:sp,ceilPowerOfTwo:rp,floorPowerOfTwo:ap,setQuaternionFromProperEuler:op,normalize:ge,denormalize:Un},vh=class vh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};vh.prototype.isVector2=!0;var gt=vh,En=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(d!==_||l!==u||c!==f||h!==g){let m=l*u+c*f+h*g+d*_;m<0&&(u=-u,f=-f,g=-g,_=-_,m=-m);let p=1-o;if(m<.9995){let E=Math.acos(m),R=Math.sin(E);p=Math.sin(p*E)/R,o=Math.sin(o*E)/R,l=l*p+u*o,c=c*p+f*o,h=h*p+g*o,d=d*p+_*o}else{l=l*p+u*o,c=c*p+f*o,h=h*p+g*o,d=d*p+_*o;let E=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=E,c*=E,h*=E,d*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-o*f,t[e+2]=c*g+h*f+o*u-l*d,t[e+3]=h*g-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:Jt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},yh=class yh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(uu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(uu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return lc.copy(this).projectOnVector(t),this.sub(lc)}reflect(t){return this.sub(lc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};yh.prototype.isVector3=!0;var I=yh,lc=new I,uu=new En,Mh=class Mh{constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],E=s[1],R=s[4],S=s[7],T=s[2],M=s[5],w=s[8];return r[0]=a*_+o*E+l*T,r[3]=a*m+o*R+l*M,r[6]=a*p+o*S+l*w,r[1]=c*_+h*E+d*T,r[4]=c*m+h*R+d*M,r[7]=c*p+h*S+d*w,r[2]=u*_+f*E+g*T,r[5]=u*m+f*R+g*M,r[8]=u*p+f*S+g*w,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=d*_,t[1]=(s*c-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=u*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Yi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(cc.makeScale(t,e)),this}rotate(t){return Yi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(cc.makeRotation(-t)),this}translate(t,e){return Yi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(cc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Mh.prototype.isMatrix3=!0;var jt=Mh,cc=new jt,du=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fu=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function lp(){let i={enabled:!0,workingColorSpace:Lr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===me&&(s.r=gi(s.r),s.g=gi(s.g),s.b=gi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===me&&(s.r=Rs(s.r),s.g=Rs(s.g),s.b=Rs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===vi?Dr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Yi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Yi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Lr]:{primaries:t,whitePoint:n,transfer:Dr,toXYZ:du,fromXYZ:fu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:_e},outputColorSpaceConfig:{drawingBufferColorSpace:_e}},[_e]:{primaries:t,whitePoint:n,transfer:me,toXYZ:du,fromXYZ:fu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:_e}}}),i}var ae=lp();function gi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Rs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var us,bo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{us===void 0&&(us=Nr("canvas")),us.width=t.width,us.height=t.height;let s=us.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=us}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Nr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=gi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(gi(e[n]/255)*255):e[n]=gi(e[n]);return{data:e,width:t.width,height:t.height}}else return Jt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},cp=0,Ns=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=jn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(hc(s[a].image)):r.push(hc(s[a]))}else r=hc(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function hc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?bo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Jt("Texture: Unable to serialize Texture."),{})}var hp=0,uc=new I,cn=class i extends ti{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Kn,s=Kn,r=Ze,a=ri,o=Rn,l=gn,c=i.DEFAULT_ANISOTROPY,h=vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=jn(),this.name="",this.source=new Ns(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new gt(0,0),this.repeat=new gt(1,1),this.center=new gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(uc).x}get height(){return this.source.getSize(uc).y}get depth(){return this.source.getSize(uc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Jt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Jt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==sh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Is:t.x=t.x-Math.floor(t.x);break;case Kn:t.x=t.x<0?0:1;break;case Mo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Is:t.y=t.y-Math.floor(t.y);break;case Kn:t.y=t.y<0?0:1;break;case Mo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=sh;cn.DEFAULT_ANISOTROPY=1;var Sh=class Sh{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let R=(c+1)/2,S=(f+1)/2,T=(p+1)/2,M=(h+u)/4,w=(d+_)/4,v=(g+m)/4;return R>S&&R>T?R<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(R),s=M/n,r=w/n):S>T?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=M/s,r=v/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=w/r,s=v/r),this.set(n,s,r,e),this}let E=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-_)/E,this.z=(u-h)/E,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Sh.prototype.isVector4=!0;var be=Sh,Eo=class extends ti{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new be(0,0,t,e),this.scissorTest=!1,this.viewport=new be(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new cn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ns(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},pn=class extends Eo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ur=class extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var To=class extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Jo=class Jo{constructor(t,e,n,s,r,a,o,l,c,h,d,u,f,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,u,f,g,_,m)}set(t,e,n,s,r,a,o,l,c,h,d,u,f,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Jo().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/ds.setFromMatrixColumn(t,0).length(),r=1/ds.setFromMatrixColumn(t,1).length(),a=1/ds.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=a*h,f=a*d,g=o*h,_=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,g=c*h,_=c*d;e[0]=u+_*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,g=c*h,_=c*d;e[0]=u-_*o,e[4]=-a*d,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,f=a*d,g=o*h,_=o*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-u*d,e[8]=g*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-_*d}else if(t.order==="XZY"){let u=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=a*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=o*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(up,t,dp)}lookAt(t,e,n){let s=this.elements;return _n.subVectors(t,e),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),wi.crossVectors(n,_n),wi.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),wi.crossVectors(n,_n)),wi.normalize(),Ba.crossVectors(_n,wi),s[0]=wi.x,s[4]=Ba.x,s[8]=_n.x,s[1]=wi.y,s[5]=Ba.y,s[9]=_n.y,s[2]=wi.z,s[6]=Ba.z,s[10]=_n.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],E=n[3],R=n[7],S=n[11],T=n[15],M=s[0],w=s[4],v=s[8],A=s[12],L=s[1],O=s[5],V=s[9],J=s[13],z=s[2],W=s[6],nt=s[10],j=s[14],ht=s[3],tt=s[7],at=s[11],q=s[15];return r[0]=a*M+o*L+l*z+c*ht,r[4]=a*w+o*O+l*W+c*tt,r[8]=a*v+o*V+l*nt+c*at,r[12]=a*A+o*J+l*j+c*q,r[1]=h*M+d*L+u*z+f*ht,r[5]=h*w+d*O+u*W+f*tt,r[9]=h*v+d*V+u*nt+f*at,r[13]=h*A+d*J+u*j+f*q,r[2]=g*M+_*L+m*z+p*ht,r[6]=g*w+_*O+m*W+p*tt,r[10]=g*v+_*V+m*nt+p*at,r[14]=g*A+_*J+m*j+p*q,r[3]=E*M+R*L+S*z+T*ht,r[7]=E*w+R*O+S*W+T*tt,r[11]=E*v+R*V+S*nt+T*at,r[15]=E*A+R*J+S*j+T*q,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15],E=l*f-c*u,R=o*f-c*d,S=o*u-l*d,T=a*f-c*h,M=a*u-l*h,w=a*d-o*h;return e*(_*E-m*R+p*S)-n*(g*E-m*T+p*M)+s*(g*R-_*T+p*w)-r*(g*S-_*M+m*w)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],E=e*o-n*a,R=e*l-s*a,S=e*c-r*a,T=n*l-s*o,M=n*c-r*o,w=s*c-r*l,v=h*_-d*g,A=h*m-u*g,L=h*p-f*g,O=d*m-u*_,V=d*p-f*_,J=u*p-f*m,z=E*J-R*V+S*O+T*L-M*A+w*v;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let W=1/z;return t[0]=(o*J-l*V+c*O)*W,t[1]=(s*V-n*J-r*O)*W,t[2]=(_*w-m*M+p*T)*W,t[3]=(u*M-d*w-f*T)*W,t[4]=(l*L-a*J-c*A)*W,t[5]=(e*J-s*L+r*A)*W,t[6]=(m*S-g*w-p*R)*W,t[7]=(h*w-u*S+f*R)*W,t[8]=(a*V-o*L+c*v)*W,t[9]=(n*L-e*V-r*v)*W,t[10]=(g*M-_*S+p*E)*W,t[11]=(d*S-h*M-f*E)*W,t[12]=(o*A-a*O-l*v)*W,t[13]=(e*O-n*A+s*v)*W,t[14]=(_*R-g*T-m*E)*W,t[15]=(h*T-d*R+u*E)*W,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,g=r*d,_=a*h,m=a*d,p=o*d,E=l*c,R=l*h,S=l*d,T=n.x,M=n.y,w=n.z;return s[0]=(1-(_+p))*T,s[1]=(f+S)*T,s[2]=(g-R)*T,s[3]=0,s[4]=(f-S)*M,s[5]=(1-(u+p))*M,s[6]=(m+E)*M,s[7]=0,s[8]=(g+R)*w,s[9]=(m-E)*w,s[10]=(1-(u+_))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=ds.set(s[0],s[1],s[2]).length(),o=ds.set(s[4],s[5],s[6]).length(),l=ds.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Ln.copy(this);let c=1/a,h=1/o,d=1/l;return Ln.elements[0]*=c,Ln.elements[1]*=c,Ln.elements[2]*=c,Ln.elements[4]*=h,Ln.elements[5]*=h,Ln.elements[6]*=h,Ln.elements[8]*=d,Ln.elements[9]*=d,Ln.elements[10]*=d,e.setFromRotationMatrix(Ln),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=On,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s),g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===On)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Ls)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=On,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s),g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===On)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===Ls)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Jo.prototype.isMatrix4=!0;var ue=Jo,ds=new I,Ln=new ue,up=new I(0,0,0),dp=new I(1,1,1),wi=new I,Ba=new I,_n=new I,pu=new ue,mu=new En,ei=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ne(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Jt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return pu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(pu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return mu.setFromEuler(this),this.setFromQuaternion(mu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ei.DEFAULT_ORDER="XYZ";var Fs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},fp=0,gu=new I,fs=new En,hi=new ue,za=new I,_r=new I,pp=new I,mp=new En,_u=new I(1,0,0),xu=new I(0,1,0),vu=new I(0,0,1),yu={type:"added"},gp={type:"removed"},ps={type:"childadded",child:null},dc={type:"childremoved",child:null},Pe=class i extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new I,e=new ei,n=new En,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ue},normalMatrix:{value:new jt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return fs.setFromAxisAngle(t,e),this.quaternion.multiply(fs),this}rotateOnWorldAxis(t,e){return fs.setFromAxisAngle(t,e),this.quaternion.premultiply(fs),this}rotateX(t){return this.rotateOnAxis(_u,t)}rotateY(t){return this.rotateOnAxis(xu,t)}rotateZ(t){return this.rotateOnAxis(vu,t)}translateOnAxis(t,e){return gu.copy(t).applyQuaternion(this.quaternion),this.position.add(gu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(_u,t)}translateY(t){return this.translateOnAxis(xu,t)}translateZ(t){return this.translateOnAxis(vu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?za.copy(t):za.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),_r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(_r,za,this.up):hi.lookAt(za,_r,this.up),this.quaternion.setFromRotationMatrix(hi),s&&(hi.extractRotation(s.matrixWorld),fs.setFromRotationMatrix(hi),this.quaternion.premultiply(fs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Zt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yu),ps.child=t,this.dispatchEvent(ps),ps.child=null):Zt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gp),dc.child=t,this.dispatchEvent(dc),dc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),hi.multiply(t.parent.matrixWorld)),t.applyMatrix4(hi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yu),ps.child=t,this.dispatchEvent(ps),ps.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,t,pp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,mp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Pe.DEFAULT_UP=new I(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var qe=class extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}},_p={type:"move"},Us=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(_p)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new qe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},wd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},ka={h:0,s:0,l:0};function fc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Tt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=_e){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=fh(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=fc(a,r,t+1/3),this.g=fc(a,r,t),this.b=fc(a,r,t-1/3)}return ae.colorSpaceToWorking(this,s),this}setStyle(t,e=_e){function n(r){r!==void 0&&parseFloat(r)<1&&Jt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Jt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Jt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=_e){let n=wd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Jt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gi(t.r),this.g=gi(t.g),this.b=gi(t.b),this}copyLinearToSRGB(t){return this.r=Rs(t.r),this.g=Rs(t.g),this.b=Rs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=_e){return ae.workingToColorSpace(en.copy(this),t),Math.round(ne(en.r*255,0,255))*65536+Math.round(ne(en.g*255,0,255))*256+Math.round(ne(en.b*255,0,255))}getHexString(t=_e){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.workingToColorSpace(en.copy(this),e);let n=en.r,s=en.g,r=en.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=_e){ae.workingToColorSpace(en.copy(this),t);let e=en.r,n=en.g,s=en.b;return t!==_e?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ai),this.setHSL(Ai.h+t,Ai.s+e,Ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ai),t.getHSL(ka);let n=Cr(Ai.h,ka.h,e),s=Cr(Ai.s,ka.s,e),r=Cr(Ai.l,ka.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new Tt;Tt.NAMES=wd;var Or=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Tt(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ji=class extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Dn=new I,ui=new I,pc=new I,di=new I,ms=new I,gs=new I,Mu=new I,mc=new I,gc=new I,_c=new I,xc=new be,vc=new be,yc=new be,mi=class i{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Dn.subVectors(t,e),s.cross(Dn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Dn.subVectors(s,e),ui.subVectors(n,e),pc.subVectors(t,e);let a=Dn.dot(Dn),o=Dn.dot(ui),l=Dn.dot(pc),c=ui.dot(ui),h=ui.dot(pc),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,di.x),l.addScaledVector(a,di.y),l.addScaledVector(o,di.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return xc.setScalar(0),vc.setScalar(0),yc.setScalar(0),xc.fromBufferAttribute(t,e),vc.fromBufferAttribute(t,n),yc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(xc,r.x),a.addScaledVector(vc,r.y),a.addScaledVector(yc,r.z),a}static isFrontFacing(t,e,n,s){return Dn.subVectors(n,e),ui.subVectors(t,e),Dn.cross(ui).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Dn.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),Dn.cross(ui).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;ms.subVectors(s,n),gs.subVectors(r,n),mc.subVectors(t,n);let l=ms.dot(mc),c=gs.dot(mc);if(l<=0&&c<=0)return e.copy(n);gc.subVectors(t,s);let h=ms.dot(gc),d=gs.dot(gc);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(ms,a);_c.subVectors(t,r);let f=ms.dot(_c),g=gs.dot(_c);if(g>=0&&f<=g)return e.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(gs,o);let m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return Mu.subVectors(r,s),o=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(Mu,o);let p=1/(m+_+u);return a=_*p,o=u*p,e.copy(n).addScaledVector(ms,a).addScaledVector(gs,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ni=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Nn):Nn.fromBufferAttribute(r,a),Nn.applyMatrix4(t.matrixWorld),this.expandByPoint(Nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ha.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ha.copy(n.boundingBox)),Ha.applyMatrix4(t.matrixWorld),this.union(Ha)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Nn),Nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xr),Ga.subVectors(this.max,xr),_s.subVectors(t.a,xr),xs.subVectors(t.b,xr),vs.subVectors(t.c,xr),Ci.subVectors(xs,_s),Ri.subVectors(vs,xs),Gi.subVectors(_s,vs);let e=[0,-Ci.z,Ci.y,0,-Ri.z,Ri.y,0,-Gi.z,Gi.y,Ci.z,0,-Ci.x,Ri.z,0,-Ri.x,Gi.z,0,-Gi.x,-Ci.y,Ci.x,0,-Ri.y,Ri.x,0,-Gi.y,Gi.x,0];return!Mc(e,_s,xs,vs,Ga)||(e=[1,0,0,0,1,0,0,0,1],!Mc(e,_s,xs,vs,Ga))?!1:(Va.crossVectors(Ci,Ri),e=[Va.x,Va.y,Va.z],Mc(e,_s,xs,vs,Ga))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},fi=[new I,new I,new I,new I,new I,new I,new I,new I],Nn=new I,Ha=new ni,_s=new I,xs=new I,vs=new I,Ci=new I,Ri=new I,Gi=new I,xr=new I,Ga=new I,Va=new I,Vi=new I;function Mc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Vi.fromArray(i,r);let o=s.x*Math.abs(Vi.x)+s.y*Math.abs(Vi.y)+s.z*Math.abs(Vi.z),l=t.dot(Vi),c=e.dot(Vi),h=n.dot(Vi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Be=new I,Wa=new gt,xp=0,Ye=class extends ti{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=uh,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Wa.fromBufferAttribute(this,e),Wa.applyMatrix3(t),this.setXY(e,Wa.x,Wa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix3(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Un(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Un(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Un(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Un(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Br=class extends Ye{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var zr=class extends Ye{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var de=class extends Ye{constructor(t,e,n){super(new Float32Array(t),e,n)}},vp=new ni,vr=new I,Sc=new I,_i=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):vp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vr.subVectors(t,this.center);let e=vr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(vr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Sc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vr.copy(t.center).add(Sc)),this.expandByPoint(vr.copy(t.center).sub(Sc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},yp=0,bn=new ue,bc=new Pe,ys=new I,xn=new ni,yr=new ni,Ve=new I,Ie=class i extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wf(t)?zr:Br)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return bn.makeRotationFromQuaternion(t),this.applyMatrix4(bn),this}rotateX(t){return bn.makeRotationX(t),this.applyMatrix4(bn),this}rotateY(t){return bn.makeRotationY(t),this.applyMatrix4(bn),this}rotateZ(t){return bn.makeRotationZ(t),this.applyMatrix4(bn),this}translate(t,e,n){return bn.makeTranslation(t,e,n),this.applyMatrix4(bn),this}scale(t,e,n){return bn.makeScale(t,e,n),this.applyMatrix4(bn),this}lookAt(t){return bc.lookAt(t),bc.updateMatrix(),this.applyMatrix4(bc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ys).negate(),this.translate(ys.x,ys.y,ys.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new de(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Jt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];xn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ve.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(Ve),Ve.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(Ve)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Zt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _i);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let n=this.boundingSphere.center;if(xn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];yr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ve.addVectors(xn.min,yr.min),xn.expandByPoint(Ve),Ve.addVectors(xn.max,yr.max),xn.expandByPoint(Ve)):(xn.expandByPoint(yr.min),xn.expandByPoint(yr.max))}xn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ve.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ve));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ve.fromBufferAttribute(o,c),l&&(ys.fromBufferAttribute(t,c),Ve.add(ys)),s=Math.max(s,n.distanceToSquared(Ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Zt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Zt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ye(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new I,l[v]=new I;let c=new I,h=new I,d=new I,u=new gt,f=new gt,g=new gt,_=new I,m=new I;function p(v,A,L){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,A),d.fromBufferAttribute(n,L),u.fromBufferAttribute(r,v),f.fromBufferAttribute(r,A),g.fromBufferAttribute(r,L),h.sub(c),d.sub(c),f.sub(u),g.sub(u);let O=1/(f.x*g.y-g.x*f.y);isFinite(O)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(O),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(O),o[v].add(_),o[A].add(_),o[L].add(_),l[v].add(m),l[A].add(m),l[L].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let v=0,A=E.length;v<A;++v){let L=E[v],O=L.start,V=L.count;for(let J=O,z=O+V;J<z;J+=3)p(t.getX(J+0),t.getX(J+1),t.getX(J+2))}let R=new I,S=new I,T=new I,M=new I;function w(v){T.fromBufferAttribute(s,v),M.copy(T);let A=o[v];R.copy(A),R.sub(T.multiplyScalar(T.dot(A))).normalize(),S.crossVectors(M,A);let O=S.dot(l[v])<0?-1:1;a.setXYZW(v,R.x,R.y,R.z,O)}for(let v=0,A=E.length;v<A;++v){let L=E[v],O=L.start,V=L.count;for(let J=O,z=O+V;J<z;J+=3)w(t.getX(J+0)),w(t.getX(J+1)),w(t.getX(J+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ye(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,d=new I;if(t)for(let u=0,f=t.count;u<f;u+=3){let g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ve.fromBufferAttribute(t,e),Ve.normalize(),t.setXYZ(e,Ve.x,Ve.y,Ve.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Ye(u,h,d)}if(this.index===null)return Jt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},wo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=uh,this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},ln=new I,kr=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ln.fromBufferAttribute(this,e),ln.applyMatrix4(t),this.setXYZ(e,ln.x,ln.y,ln.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ln.fromBufferAttribute(this,e),ln.applyNormalMatrix(t),this.setXYZ(e,ln.x,ln.y,ln.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ln.fromBufferAttribute(this,e),ln.transformDirection(t),this.setXYZ(e,ln.x,ln.y,ln.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Un(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Un(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Un(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Un(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Fr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ye(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Fr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ec=new I,Mp=new I,Sp=new jt,Fn=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Ec.subVectors(n,e).cross(Mp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Ec),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Sp.getNormalMatrix(t),s=this.coplanarPoint(Ec).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},bp=0,Bn=class extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=Js,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kc,this.blendDst=is,this.blendEquation=ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Tt(0,0,0),this.blendAlpha=0,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=md,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fo,this.stencilZFail=fo,this.stencilZPass=fo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Jt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Jt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Tt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Fn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new gt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new gt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},xi=class extends Bn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Tt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ms,Mr=new I,Ss=new I,bs=new I,Es=new gt,Sr=new gt,Ad=new ue,Xa=new I,br=new I,qa=new I,Su=new gt,Tc=new gt,bu=new gt,Ii=class extends Pe{constructor(t=new xi){if(super(),this.isSprite=!0,this.type="Sprite",Ms===void 0){Ms=new Ie;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new wo(e,5);Ms.setIndex([0,1,2,0,2,3]),Ms.setAttribute("position",new kr(n,3,0,!1)),Ms.setAttribute("uv",new kr(n,2,3,!1))}this.geometry=Ms,this.material=t,this.center=new gt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Zt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ss.setFromMatrixScale(this.matrixWorld),Ad.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),bs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ss.multiplyScalar(-bs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;Ya(Xa.set(-.5,-.5,0),bs,a,Ss,s,r),Ya(br.set(.5,-.5,0),bs,a,Ss,s,r),Ya(qa.set(.5,.5,0),bs,a,Ss,s,r),Su.set(0,0),Tc.set(1,0),bu.set(1,1);let o=t.ray.intersectTriangle(Xa,br,qa,!1,Mr);if(o===null&&(Ya(br.set(-.5,.5,0),bs,a,Ss,s,r),Tc.set(0,1),o=t.ray.intersectTriangle(Xa,qa,br,!1,Mr),o===null))return;let l=t.ray.origin.distanceTo(Mr);l<t.near||l>t.far||e.push({distance:l,point:Mr.clone(),uv:mi.getInterpolation(Mr,Xa,br,qa,Su,Tc,bu,new gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Ya(i,t,e,n,s,r){Es.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Sr.x=r*Es.x-s*Es.y,Sr.y=s*Es.x+r*Es.y):Sr.copy(Es),i.copy(t),i.x+=Sr.x,i.y+=Sr.y,i.applyMatrix4(Ad)}var pi=new I,wc=new I,Za=new I,Ja=new I,Os=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,pi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=pi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(pi.copy(this.origin).addScaledVector(this.direction,e),pi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){wc.copy(t).add(e).multiplyScalar(.5),Za.copy(e).sub(t).normalize(),Ja.copy(this.origin).sub(wc);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Za),o=Ja.dot(this.direction),l=-Ja.dot(Za),c=Ja.lengthSq(),h=Math.abs(1-a*a),d,u,f,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let _=1/h;d*=_,u*=_,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(wc).addScaledVector(Za,u),f}intersectSphere(t,e){if(t.radius<0)return null;pi.subVectors(t.center,this.origin);let n=pi.dot(this.direction),s=pi.dot(pi)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,pi)!==null}intersectTriangle(t,e,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,g=e.x-a.x,_=e.y-a.y,m=e.z-a.z,p=n.x-a.x,E=n.y-a.y,R=n.z-a.z,S=Math.abs(l),T=Math.abs(c),M=Math.abs(h),w,v,A,L,O,V,J,z,W,nt,j,ht;if(S>=T&&S>=M?(A=l,V=d,W=g,ht=p,l>=0?(w=c,v=h,L=u,O=f,J=_,z=m,nt=E,j=R):(w=h,v=c,L=f,O=u,J=m,z=_,nt=R,j=E)):T>=M?(A=c,V=u,W=_,ht=E,c>=0?(w=h,v=l,L=f,O=d,J=m,z=g,nt=R,j=p):(w=l,v=h,L=d,O=f,J=g,z=m,nt=p,j=R)):(A=h,V=f,W=m,ht=R,h>=0?(w=l,v=c,L=d,O=u,J=g,z=_,nt=p,j=E):(w=c,v=l,L=u,O=d,J=_,z=g,nt=E,j=p)),A===0)return null;let tt=w/A,at=v/A,q=1/A,ut=L-tt*V,yt=O-at*V,Kt=J-tt*W,$t=z-at*W,Vt=nt-tt*ht,et=j-at*ht,ot=Vt*$t-et*Kt,St=ut*et-yt*Vt,Wt=Kt*yt-$t*ut;if(s){if(ot<0||St<0||Wt<0)return null}else if((ot<0||St<0||Wt<0)&&(ot>0||St>0||Wt>0))return null;let bt=ot+St+Wt;if(bt===0)return null;let At=q*(ot*V+St*W+Wt*ht);return(bt>0?At<0:At>0)?null:this.at(At/bt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},zn=class extends Bn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=$o,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Eu=new ue,Wi=new Os,$a=new _i,Tu=new I,Ka=new I,ja=new I,Qa=new I,Ac=new I,to=new I,wu=new I,eo=new I,ie=class extends Pe{constructor(t=new Ie,e=new zn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){to.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(Ac.fromBufferAttribute(d,t),a?to.addScaledVector(Ac,h):to.addScaledVector(Ac.sub(e),h))}e.add(to)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),$a.copy(n.boundingSphere),$a.applyMatrix4(r),Wi.copy(t.ray).recast(t.near),!($a.containsPoint(Wi.origin)===!1&&(Wi.intersectSphere($a,Tu)===null||Wi.origin.distanceToSquared(Tu)>(t.far-t.near)**2))&&(Eu.copy(r).invert(),Wi.copy(t.ray).applyMatrix4(Eu),!(n.boundingBox!==null&&Wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Wi)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){let m=u[g],p=a[m.materialIndex],E=Math.max(m.start,f.start),R=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let S=E,T=R;S<T;S+=3){let M=o.getX(S),w=o.getX(S+1),v=o.getX(S+2);s=no(this,p,t,n,c,h,d,M,w,v),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let E=o.getX(m),R=o.getX(m+1),S=o.getX(m+2);s=no(this,a,t,n,c,h,d,E,R,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){let m=u[g],p=a[m.materialIndex],E=Math.max(m.start,f.start),R=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let S=E,T=R;S<T;S+=3){let M=S,w=S+1,v=S+2;s=no(this,p,t,n,c,h,d,M,w,v),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let E=m,R=m+1,S=m+2;s=no(this,a,t,n,c,h,d,E,R,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Ep(i,t,e,n,s,r,a,o){let l;if(t.side===ke?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===ii,o),l===null)return null;eo.copy(o),eo.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(eo);return c<e.near||c>e.far?null:{distance:c,point:eo.clone(),object:i}}function no(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Ka),i.getVertexPosition(l,ja),i.getVertexPosition(c,Qa);let h=Ep(i,t,e,n,Ka,ja,Qa,wu);if(h){let d=new I;mi.getBarycoord(wu,Ka,ja,Qa,d),s&&(h.uv=mi.getInterpolatedAttribute(s,o,l,c,d,new gt)),r&&(h.uv1=mi.getInterpolatedAttribute(r,o,l,c,d,new gt)),a&&(h.normal=mi.getInterpolatedAttribute(a,o,l,c,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new I,materialIndex:0};mi.getNormal(Ka,ja,Qa,u.normal),h.face=u,h.barycoord=d}return h}var Hr=class extends cn{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Xe,h=Xe,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Tn=class extends Ye{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ts=new ue,Au=new ue,io=[],Cu=new ni,Tp=new ue,Er=new ie,Tr=new _i,kn=class extends ie{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Tn(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Tp)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ni),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ts),Cu.copy(t.boundingBox).applyMatrix4(Ts),this.boundingBox.union(Cu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new _i),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ts),Tr.copy(t.boundingSphere).applyMatrix4(Ts),this.boundingSphere.union(Tr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Er.geometry=this.geometry,Er.material=this.material,Er.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Tr.copy(this.boundingSphere),Tr.applyMatrix4(n),t.ray.intersectsSphere(Tr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ts),Au.multiplyMatrices(n,Ts),Er.matrixWorld=Au,Er.raycast(t,io);for(let a=0,o=io.length;a<o;a++){let l=io[a];l.instanceId=r,l.object=this,e.push(l)}io.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Tn(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Hr(new Float32Array(s*this.count),s,this.count,il,Cn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Xi=new _i,wp=new gt(.5,.5),so=new I,Bs=class{constructor(t=new Fn,e=new Fn,n=new Fn,s=new Fn,r=new Fn,a=new Fn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=On,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],E=r[12],R=r[13],S=r[14],T=r[15];if(s[0].setComponents(c-a,f-h,p-g,T-E).normalize(),s[1].setComponents(c+a,f+h,p+g,T+E).normalize(),s[2].setComponents(c+o,f+d,p+_,T+R).normalize(),s[3].setComponents(c-o,f-d,p-_,T-R).normalize(),n)s[4].setComponents(l,u,m,S).normalize(),s[5].setComponents(c-l,f-u,p-m,T-S).normalize();else if(s[4].setComponents(c-l,f-u,p-m,T-S).normalize(),e===On)s[5].setComponents(c+l,f+u,p+m,T+S).normalize();else if(e===Ls)s[5].setComponents(l,u,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(t){Xi.center.set(0,0,0);let e=wp.distanceTo(t.center);return Xi.radius=.7071067811865476+e,Xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(so.x=s.normal.x>0?t.max.x:t.min.x,so.y=s.normal.y>0?t.max.y:t.min.y,so.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(so)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ao=class extends Bn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ru=new ue,Oc=new Os,ro=new _i,ao=new I,Gr=class extends Pe{constructor(t=new Ie,e=new Ao){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ro.copy(n.boundingSphere),ro.applyMatrix4(s),ro.radius+=r,t.ray.intersectsSphere(ro)===!1)return;Ru.copy(s).invert(),Oc.copy(t.ray).applyMatrix4(Ru);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=u,_=f;g<_;g++){let m=c.getX(g);ao.fromBufferAttribute(d,m),Pu(ao,m,l,s,t,e,this)}}else{let u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,_=f;g<_;g++)ao.fromBufferAttribute(d,g),Pu(ao,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Pu(i,t,e,n,s,r,a){let o=Oc.distanceSqToPoint(i);if(o<e){let l=new I;Oc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var Vr=class extends cn{constructor(t=[],e=Ui,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ze=class extends cn{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Li=class extends cn{constructor(t,e,n=Gn,s,r,a,o=Xe,l=Xe,c,h=Qn,d=1){if(h!==Qn&&h!==Oi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ns(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Co=class extends Li{constructor(t,e=Gn,n=Ui,s,r,a=Xe,o=Xe,l,c=Qn){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Wr=class extends cn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},mn=class i extends Ie{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(h,3)),this.setAttribute("uv",new de(d,2));function g(_,m,p,E,R,S,T,M,w,v,A){let L=S/w,O=T/v,V=S/2,J=T/2,z=M/2,W=w+1,nt=v+1,j=0,ht=0,tt=new I;for(let at=0;at<nt;at++){let q=at*O-J;for(let ut=0;ut<W;ut++){let yt=ut*L-V;tt[_]=yt*E,tt[m]=q*R,tt[p]=z,c.push(tt.x,tt.y,tt.z),tt[_]=0,tt[m]=0,tt[p]=M>0?1:-1,h.push(tt.x,tt.y,tt.z),d.push(ut/w),d.push(1-at/v),j+=1}}for(let at=0;at<v;at++)for(let q=0;q<w;q++){let ut=u+q+W*at,yt=u+q+W*(at+1),Kt=u+(q+1)+W*(at+1),$t=u+(q+1)+W*at;l.push(ut,yt,$t),l.push(yt,Kt,$t),ht+=6}o.addGroup(f,ht,A),f+=ht,u+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Xr=class i extends Ie{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],c=new I,h=new gt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){let f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new de(a,3)),this.setAttribute("normal",new de(o,3)),this.setAttribute("uv",new de(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},wn=class i extends Ie{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],g=0,_=[],m=n/2,p=0;E(),a===!1&&(t>0&&R(!0),e>0&&R(!1)),this.setIndex(h),this.setAttribute("position",new de(d,3)),this.setAttribute("normal",new de(u,3)),this.setAttribute("uv",new de(f,2));function E(){let S=new I,T=new I,M=0,w=(e-t)/n;for(let v=0;v<=r;v++){let A=[],L=v/r,O=L*(e-t)+t;for(let V=0;V<=s;V++){let J=V/s,z=J*l+o,W=Math.sin(z),nt=Math.cos(z);T.x=O*W,T.y=-L*n+m,T.z=O*nt,d.push(T.x,T.y,T.z),S.set(W,w,nt).normalize(),u.push(S.x,S.y,S.z),f.push(J,1-L),A.push(g++)}_.push(A)}for(let v=0;v<s;v++)for(let A=0;A<r;A++){let L=_[A][v],O=_[A+1][v],V=_[A+1][v+1],J=_[A][v+1];(t>0||A!==0)&&(h.push(L,O,J),M+=3),(e>0||A!==r-1)&&(h.push(O,V,J),M+=3)}c.addGroup(p,M,0),p+=M}function R(S){let T=g,M=new gt,w=new I,v=0,A=S===!0?t:e,L=S===!0?1:-1;for(let V=1;V<=s;V++)d.push(0,m*L,0),u.push(0,L,0),f.push(.5,.5),g++;let O=g;for(let V=0;V<=s;V++){let z=V/s*l+o,W=Math.cos(z),nt=Math.sin(z);w.x=A*nt,w.y=m*L,w.z=A*W,d.push(w.x,w.y,w.z),u.push(0,L,0),M.x=W*.5+.5,M.y=nt*.5*L+.5,f.push(M.x,M.y),g++}for(let V=0;V<s;V++){let J=T+V,z=O+V;S===!0?h.push(z,z+1,J):h.push(z+1,z,J),v+=3}c.addGroup(p,v,S===!0?1:2),p+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Jt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new gt:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new I,s=[],r=[],a=[],o=new I,l=new ue;for(let f=0;f<=t;f++){let g=f/t;s[f]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(ne(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(ne(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},zs=class extends vn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new gt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ro=class extends zs{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function ph(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Iu=new I,Lu=new I,Cc=new ph,Rc=new ph,Pc=new ph,ks=class extends vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Lu.subVectors(s[0],s[1]).add(s[0]),c=Lu);let d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Iu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Iu),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Cc.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,_,m),Rc.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,_,m),Pc.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Cc.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Rc.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Pc.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Cc.calc(l),Rc.calc(l),Pc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Du(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Ap(i,t){let e=1-i;return e*e*t}function Cp(i,t){return 2*(1-i)*i*t}function Rp(i,t){return i*i*t}function Rr(i,t,e,n){return Ap(i,t)+Cp(i,e)+Rp(i,n)}function Pp(i,t){let e=1-i;return e*e*e*t}function Ip(i,t){let e=1-i;return 3*e*e*i*t}function Lp(i,t){return 3*(1-i)*i*i*t}function Dp(i,t){return i*i*i*t}function Pr(i,t,e,n,s){return Pp(i,t)+Ip(i,e)+Lp(i,n)+Dp(i,s)}var qr=class extends vn{constructor(t=new gt,e=new gt,n=new gt,s=new gt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new gt){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Pr(t,s.x,r.x,a.x,o.x),Pr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Po=class extends vn{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Pr(t,s.x,r.x,a.x,o.x),Pr(t,s.y,r.y,a.y,o.y),Pr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Yr=class extends vn{constructor(t=new gt,e=new gt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new gt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new gt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Io=class extends vn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Zr=class extends vn{constructor(t=new gt,e=new gt,n=new gt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new gt){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Rr(t,s.x,r.x,a.x),Rr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Lo=class extends vn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Rr(t,s.x,r.x,a.x),Rr(t,s.y,r.y,a.y),Rr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Jr=class extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new gt){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Du(o,l.x,c.x,h.x,d.x),Du(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new gt().fromArray(s))}return this}},Bc=Object.freeze({__proto__:null,ArcCurve:Ro,CatmullRomCurve3:ks,CubicBezierCurve:qr,CubicBezierCurve3:Po,EllipseCurve:zs,LineCurve:Yr,LineCurve3:Io,QuadraticBezierCurve:Zr,QuadraticBezierCurve3:Lo,SplineCurve:Jr}),Do=class extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bc[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Bc[s.type]().fromJSON(s))}return this}},$i=class extends Do{constructor(t){super(),this.type="Path",this.currentPoint=new gt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Yr(this.currentPoint.clone(),new gt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Zr(this.currentPoint.clone(),new gt(t,e),new gt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new qr(this.currentPoint.clone(),new gt(t,e),new gt(n,s),new gt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Jr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){let c=new zs(t,e,n,s,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Hs=class extends $i{constructor(t){super(t),this.uuid=jn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new $i().fromJSON(s))}return this}};function Np(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Cd(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=zp(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let h=o,d=l;for(let u=e;u<s;u+=e){let f=i[u],g=i[u+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return $r(r,a,e,o,l,c,0),a}function Cd(i,t,e,n,s){let r;if(s===$p(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Nu(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Nu(a/n|0,i[a],i[a+1],r);return r&&Gs(r,r.next)&&(jr(r),r=r.next),r}function Ki(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Gs(e,e.next)||Ce(e.prev,e,e.next)===0)){if(jr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function $r(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Wp(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Up(i,n,s,r):Fp(i)){t.push(l.i,i.i,c.i),jr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Op(Ki(i),t),$r(i,t,e,n,s,r,2)):a===2&&Bp(i,t,e,n,s,r):$r(Ki(i),t,e,n,s,r,1);break}}}function Fp(i){let t=i.prev,e=i,n=i.next;if(Ce(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),u=Math.max(s,r,a),f=Math.max(o,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&wr(s,o,r,l,a,c,g.x,g.y)&&Ce(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Up(i,t,e,n){let s=i.prev,r=i,a=i.next;if(Ce(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=Math.min(o,l,c),g=Math.min(h,d,u),_=Math.max(o,l,c),m=Math.max(h,d,u),p=zc(f,g,t,e,n),E=zc(_,m,t,e,n),R=i.prevZ,S=i.nextZ;for(;R&&R.z>=p&&S&&S.z<=E;){if(R.x>=f&&R.x<=_&&R.y>=g&&R.y<=m&&R!==s&&R!==a&&wr(o,h,l,d,c,u,R.x,R.y)&&Ce(R.prev,R,R.next)>=0||(R=R.prevZ,S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&wr(o,h,l,d,c,u,S.x,S.y)&&Ce(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;R&&R.z>=p;){if(R.x>=f&&R.x<=_&&R.y>=g&&R.y<=m&&R!==s&&R!==a&&wr(o,h,l,d,c,u,R.x,R.y)&&Ce(R.prev,R,R.next)>=0)return!1;R=R.prevZ}for(;S&&S.z<=E;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&wr(o,h,l,d,c,u,S.x,S.y)&&Ce(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Op(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Gs(n,s)&&Pd(n,e,e.next,s)&&Kr(n,s)&&Kr(s,n)&&(t.push(n.i,e.i,s.i),jr(e),jr(e.next),e=i=s),e=e.next}while(e!==i);return Ki(e)}function Bp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Yp(a,o)){let l=Id(a,o);a=Ki(a,a.next),l=Ki(l,l.next),$r(a,t,e,n,s,r,0),$r(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function zp(i,t,e,n){let s=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Cd(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(qp(c))}s.sort(kp);for(let r=0;r<s.length;r++)e=Hp(s[r],e);return e}function kp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Hp(i,t){let e=Gp(i,t);if(!e)return t;let n=Id(e,i);return Ki(n,n.next),Ki(e,e.next)}function Gp(i,t){let e=t,n=i.x,s=i.y,r=-1/0,a;if(Gs(i,e))return e;do{if(Gs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Rd(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);Kr(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&Vp(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function Vp(i,t){return Ce(i.prev,i,t.prev)<0&&Ce(t.next,i,i.next)<0}function Wp(i,t,e,n){let s=i;do s.z===0&&(s.z=zc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Xp(s)}function Xp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function zc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function qp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Rd(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function wr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Rd(i,t,e,n,s,r,a,o)}function Yp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Zp(i,t)&&(Kr(i,t)&&Kr(t,i)&&Jp(i,t)&&(Ce(i.prev,i,t.prev)||Ce(i,t.prev,t))||Gs(i,t)&&Ce(i.prev,i,i.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Gs(i,t){return i.x===t.x&&i.y===t.y}function Pd(i,t,e,n){let s=lo(Ce(i,t,e)),r=lo(Ce(i,t,n)),a=lo(Ce(e,n,i)),o=lo(Ce(e,n,t));return!!(s!==r&&a!==o||s===0&&oo(i,e,t)||r===0&&oo(i,n,t)||a===0&&oo(e,i,n)||o===0&&oo(e,t,n))}function oo(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function lo(i){return i>0?1:i<0?-1:0}function Zp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Pd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Kr(i,t){return Ce(i.prev,i,i.next)<0?Ce(i,t,i.next)>=0&&Ce(i,i.prev,t)>=0:Ce(i,t,i.prev)<0||Ce(i,i.next,t)<0}function Jp(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Id(i,t){let e=kc(i.i,i.x,i.y),n=kc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Nu(i,t,e,n){let s=kc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function jr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function kc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function $p(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Hc=class{static triangulate(t,e,n=2){return Np(t,e,n)}},qi=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Fu(t),Uu(n,t);let a=t.length;e.forEach(Fu);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Uu(n,e[l]);let o=Hc.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Fu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Uu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Qr=class i extends Ie{constructor(t=new Hs([new gt(.5,.5),new gt(-.5,.5),new gt(-.5,-.5),new gt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new de(s,3)),this.setAttribute("uv",new de(r,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,E=e.UVGenerator!==void 0?e.UVGenerator:Kp,R,S=!1,T,M,w,v;if(p){R=p.getSpacedPoints(h),S=!0,u=!1;let lt=p.isCatmullRomCurve3?p.closed:!1;T=p.computeFrenetFrames(h,lt),M=new I,w=new I,v=new I}u||(m=0,f=0,g=0,_=0);let A=o.extractPoints(c),L=A.shape,O=A.holes;if(!qi.isClockWise(L)){L=L.reverse();for(let lt=0,ft=O.length;lt<ft;lt++){let vt=O[lt];qi.isClockWise(vt)&&(O[lt]=vt.reverse())}}function J(lt){let vt=10000000000000001e-36,_t=lt[0];for(let Et=1;Et<=lt.length;Et++){let Ft=Et%lt.length,Ut=lt[Ft],Ht=Ut.x-_t.x,Xt=Ut.y-_t.y,D=Ht*Ht+Xt*Xt,qt=Math.max(Math.abs(Ut.x),Math.abs(Ut.y),Math.abs(_t.x),Math.abs(_t.y)),Yt=vt*qt*qt;if(D<=Yt){lt.splice(Ft,1),Et--;continue}_t=Ut}}J(L),O.forEach(J);let z=O.length,W=L;for(let lt=0;lt<z;lt++){let ft=O[lt];L=L.concat(ft)}function nt(lt,ft,vt){return ft||Zt("ExtrudeGeometry: vec does not exist"),lt.clone().addScaledVector(ft,vt)}let j=L.length;function ht(lt,ft,vt){let _t,Et,Ft,Ut=lt.x-ft.x,Ht=lt.y-ft.y,Xt=vt.x-lt.x,D=vt.y-lt.y,qt=Ut*Ut+Ht*Ht,Yt=Ut*D-Ht*Xt;if(Math.abs(Yt)>Number.EPSILON){let C=Math.sqrt(qt),x=Math.sqrt(Xt*Xt+D*D),Y=ft.x-Ht/C,k=ft.y+Ut/C,y=vt.x-D/x,P=vt.y+Xt/x,X=((y-Y)*D-(P-k)*Xt)/(Ut*D-Ht*Xt);_t=Y+Ut*X-lt.x,Et=k+Ht*X-lt.y;let B=_t*_t+Et*Et;if(B<=2)return new gt(_t,Et);Ft=Math.sqrt(B/2)}else{let C=!1;Ut>Number.EPSILON?Xt>Number.EPSILON&&(C=!0):Ut<-Number.EPSILON?Xt<-Number.EPSILON&&(C=!0):Math.sign(Ht)===Math.sign(D)&&(C=!0),C?(_t=-Ht,Et=Ut,Ft=Math.sqrt(qt)):(_t=Ut,Et=Ht,Ft=Math.sqrt(qt/2))}return new gt(_t/Ft,Et/Ft)}let tt=[];for(let lt=0,ft=W.length,vt=ft-1,_t=lt+1;lt<ft;lt++,vt++,_t++)vt===ft&&(vt=0),_t===ft&&(_t=0),tt[lt]=ht(W[lt],W[vt],W[_t]);let at=[],q,ut=tt.concat();for(let lt=0,ft=z;lt<ft;lt++){let vt=O[lt];q=[];for(let _t=0,Et=vt.length,Ft=Et-1,Ut=_t+1;_t<Et;_t++,Ft++,Ut++)Ft===Et&&(Ft=0),Ut===Et&&(Ut=0),q[_t]=ht(vt[_t],vt[Ft],vt[Ut]);at.push(q),ut=ut.concat(q)}let yt;if(m===0)yt=qi.triangulateShape(W,O);else{let lt=[],ft=[];for(let vt=0;vt<m;vt++){let _t=vt/m,Et=f*Math.cos(_t*Math.PI/2),Ft=g*Math.sin(_t*Math.PI/2)+_;for(let Ut=0,Ht=W.length;Ut<Ht;Ut++){let Xt=nt(W[Ut],tt[Ut],Ft);St(Xt.x,Xt.y,-Et),_t===0&&lt.push(Xt)}for(let Ut=0,Ht=z;Ut<Ht;Ut++){let Xt=O[Ut];q=at[Ut];let D=[];for(let qt=0,Yt=Xt.length;qt<Yt;qt++){let C=nt(Xt[qt],q[qt],Ft);St(C.x,C.y,-Et),_t===0&&D.push(C)}_t===0&&ft.push(D)}}yt=qi.triangulateShape(lt,ft)}let Kt=yt.length,$t=g+_;for(let lt=0;lt<j;lt++){let ft=u?nt(L[lt],ut[lt],$t):L[lt];S?(w.copy(T.normals[0]).multiplyScalar(ft.x),M.copy(T.binormals[0]).multiplyScalar(ft.y),v.copy(R[0]).add(w).add(M),St(v.x,v.y,v.z)):St(ft.x,ft.y,0)}for(let lt=1;lt<=h;lt++)for(let ft=0;ft<j;ft++){let vt=u?nt(L[ft],ut[ft],$t):L[ft];S?(w.copy(T.normals[lt]).multiplyScalar(vt.x),M.copy(T.binormals[lt]).multiplyScalar(vt.y),v.copy(R[lt]).add(w).add(M),St(v.x,v.y,v.z)):St(vt.x,vt.y,d/h*lt)}for(let lt=m-1;lt>=0;lt--){let ft=lt/m,vt=f*Math.cos(ft*Math.PI/2),_t=g*Math.sin(ft*Math.PI/2)+_;for(let Et=0,Ft=W.length;Et<Ft;Et++){let Ut=nt(W[Et],tt[Et],_t);St(Ut.x,Ut.y,d+vt)}for(let Et=0,Ft=O.length;Et<Ft;Et++){let Ut=O[Et];q=at[Et];for(let Ht=0,Xt=Ut.length;Ht<Xt;Ht++){let D=nt(Ut[Ht],q[Ht],_t);S?St(D.x,D.y+R[h-1].y,R[h-1].x+vt):St(D.x,D.y,d+vt)}}}Vt(),et();function Vt(){let lt=s.length/3;if(u){let ft=0,vt=j*ft;for(let _t=0;_t<Kt;_t++){let Et=yt[_t];Wt(Et[2]+vt,Et[1]+vt,Et[0]+vt)}ft=h+m*2,vt=j*ft;for(let _t=0;_t<Kt;_t++){let Et=yt[_t];Wt(Et[0]+vt,Et[1]+vt,Et[2]+vt)}}else{for(let ft=0;ft<Kt;ft++){let vt=yt[ft];Wt(vt[2],vt[1],vt[0])}for(let ft=0;ft<Kt;ft++){let vt=yt[ft];Wt(vt[0]+j*h,vt[1]+j*h,vt[2]+j*h)}}n.addGroup(lt,s.length/3-lt,0)}function et(){let lt=s.length/3,ft=0;ot(W,ft),ft+=W.length;for(let vt=0,_t=O.length;vt<_t;vt++){let Et=O[vt];ot(Et,ft),ft+=Et.length}n.addGroup(lt,s.length/3-lt,1)}function ot(lt,ft){let vt=lt.length;for(;--vt>=0;){let _t=vt,Et=vt-1;Et<0&&(Et=lt.length-1);for(let Ft=0,Ut=h+m*2;Ft<Ut;Ft++){let Ht=j*Ft,Xt=j*(Ft+1),D=ft+_t+Ht,qt=ft+Et+Ht,Yt=ft+Et+Xt,C=ft+_t+Xt;bt(D,qt,Yt,C)}}}function St(lt,ft,vt){l.push(lt),l.push(ft),l.push(vt)}function Wt(lt,ft,vt){At(lt),At(ft),At(vt);let _t=s.length/3,Et=E.generateTopUV(n,s,_t-3,_t-2,_t-1);le(Et[0]),le(Et[1]),le(Et[2])}function bt(lt,ft,vt,_t){At(lt),At(ft),At(_t),At(ft),At(vt),At(_t);let Et=s.length/3,Ft=E.generateSideWallUV(n,s,Et-6,Et-3,Et-2,Et-1);le(Ft[0]),le(Ft[1]),le(Ft[3]),le(Ft[1]),le(Ft[2]),le(Ft[3])}function At(lt){s.push(l[lt*3+0]),s.push(l[lt*3+1]),s.push(l[lt*3+2])}function le(lt){r.push(lt.x),r.push(lt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return jp(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Bc[s.type]().fromJSON(s)),new i(n,t.options)}},Kp={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new gt(r,a),new gt(o,l),new gt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],g=t[s*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new gt(a,1-l),new gt(c,1-d),new gt(u,1-g),new gt(_,1-p)]:[new gt(o,1-l),new gt(h,1-d),new gt(f,1-g),new gt(m,1-p)]}};function jp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Vs=class i extends Ie{constructor(t=[new gt(0,-.5),new gt(.5,0),new gt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ne(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],h=1/e,d=new I,u=new gt,f=new I,g=new I,_=new I,m=0,p=0;for(let E=0;E<=t.length-1;E++)switch(E){case 0:m=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let E=0;E<=e;E++){let R=n+E*h*s,S=Math.sin(R),T=Math.cos(R);for(let M=0;M<=t.length-1;M++){d.x=t[M].x*S,d.y=t[M].y,d.z=t[M].x*T,a.push(d.x,d.y,d.z),u.x=E/e,u.y=M/(t.length-1),o.push(u.x,u.y);let w=l[3*M+0]*S,v=l[3*M+1],A=l[3*M+0]*T;c.push(w,v,A)}}for(let E=0;E<e;E++)for(let R=0;R<t.length-1;R++){let S=R+E*t.length,T=S,M=S+t.length,w=S+t.length+1,v=S+1;r.push(T,M,v),r.push(w,v,M)}this.setIndex(r),this.setAttribute("position",new de(a,3)),this.setAttribute("uv",new de(o,2)),this.setAttribute("normal",new de(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var nn=class i extends Ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,u=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let E=p*u-a;for(let R=0;R<c;R++){let S=R*d-r;g.push(S,-E,0),_.push(0,0,1),m.push(R/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let E=0;E<o;E++){let R=E+c*p,S=E+c*(p+1),T=E+1+c*(p+1),M=E+1+c*p;f.push(R,S,M),f.push(S,T,M)}this.setIndex(f),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(_,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},ta=class i extends Ie{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],h=[],d=t,u=(e-t)/s,f=new I,g=new gt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){let p=r+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let _=0;_<s;_++){let m=_*(n+1);for(let p=0;p<n;p++){let E=p+m,R=E,S=E+n+1,T=E+n+2,M=E+1;o.push(R,S,M),o.push(S,T,M)}}this.setIndex(o),this.setAttribute("position",new de(l,3)),this.setAttribute("normal",new de(c,3)),this.setAttribute("uv",new de(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var ea=class i extends Ie{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new I,u=new I,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let E=[],R=p/n,S=a+R*o,T=t*Math.cos(S),M=Math.sqrt(t*t-T*T),w=0;p===0&&a===0?w=.5/e:p===n&&l===Math.PI&&(w=-.5/e);for(let v=0;v<=e;v++){let A=v/e,L=s+A*r;d.x=-M*Math.cos(L),d.y=T,d.z=M*Math.sin(L),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(A+w,1-R),E.push(c++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<e;E++){let R=h[p][E+1],S=h[p][E],T=h[p+1][E],M=h[p+1][E+1];(p!==0||a>0)&&f.push(R,S,M),(p!==n-1||l<Math.PI)&&f.push(S,T,M)}this.setIndex(f),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(_,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var na=class i extends Ie{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new I,f=new I,g=new I;for(let _=0;_<=n;_++){let m=a+_/n*o;for(let p=0;p<=s;p++){let E=p/s*r;f.x=(t+e*Math.cos(m))*Math.cos(E),f.y=(t+e*Math.cos(m))*Math.sin(E),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(E),u.y=t*Math.sin(E),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/s),d.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=s;m++){let p=(s+1)*_+m-1,E=(s+1)*(_-1)+m-1,R=(s+1)*(_-1)+m,S=(s+1)*_+m;l.push(p,E,S),l.push(E,R,S)}this.setIndex(l),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(h,3)),this.setAttribute("uv",new de(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function rs(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Ou(s))s.isRenderTargetTexture?(Jt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Ou(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function sn(i){let t={};for(let e=0;e<i.length;e++){let n=rs(i[e]);for(let s in n)t[s]=n[s]}return t}function Ou(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Qp(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function mh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}var Ld={clone:rs,merge:sn},tm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,em=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ne=class extends Bn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tm,this.fragmentShader=em,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=rs(t.uniforms),this.uniformsGroups=Qp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Tt().setHex(s.value);break;case"v2":this.uniforms[n].value=new gt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new be().fromArray(s.value);break;case"m3":this.uniforms[n].value=new jt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ue().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},No=class extends Ne{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Fe=class extends Bn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ya,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ji=class extends Fe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new gt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ne(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Tt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Tt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Tt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ia=class extends Bn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ya,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=$o,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Fo=class extends Bn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Uo=class extends Bn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ws(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Ic(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Di=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Oo=class extends Di{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Nc,endingEnd:Nc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Fc:r=t,o=2*e-n;break;case Uc:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Fc:a=t,l=2*n-e;break;case Uc:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,p=-u*m+2*u*_-u*g,E=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*g+1,R=(-1-f)*m+(1.5+f)*_+.5*g,S=f*m-f*_;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+E*a[c+T]+R*a[l+T]+S*a[d+T];return r}},Bo=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},zo=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},ko=class extends Di{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-e)/(s-e),_=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*_+a[l+m]*g;return r}let u=o*2,f=t-1;for(let g=0;g!==o;++g){let _=a[c+g],m=a[l+g],p=f*u+g*2,E=d[p],R=d[p+1],S=t*u+g*2,T=h[S],M=h[S+1],w=im(n,e,E,T,s);r[g]=Dd(w,_,R,M,m)}return r}};function Dd(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function nm(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function im(i,t,e,n,s){let r=(i-t)/(s-t);for(let a=0;a<8;a++){let o=Dd(r,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;let l=nm(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var yn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ws(e,this.TimeBufferType),this.values=ws(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ws(t.times,Array),values:ws(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Ic(t.settings)&&(n.settings={inTangents:ws(t.settings.inTangents,Array),outTangents:ws(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new zo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Bo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Oo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new ko(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Ir:e=this.InterpolantFactoryMethodDiscrete;break;case So:e=this.InterpolantFactoryMethodLinear;break;case uo:e=this.InterpolantFactoryMethodSmooth;break;case Dc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Jt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ir;case this.InterpolantFactoryMethodLinear:return So;case this.InterpolantFactoryMethodSmooth:return uo;case this.InterpolantFactoryMethodBezier:return Dc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Ic(this.settings)&&(Bu(this.settings.inTangents,t),Bu(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Zt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Zt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Zt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Zt("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&Xf(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Zt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===uo,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let d=o*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){let _=e[d+g];if(_!==e[u+g]||_!==e[f+g]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Ic(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Bu(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=So;var Ni=class extends yn{constructor(t,e,n){super(t,e,n)}};Ni.prototype.ValueTypeName="bool";Ni.prototype.ValueBufferType=Array;Ni.prototype.DefaultInterpolation=Ir;Ni.prototype.InterpolantFactoryMethodLinear=void 0;Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var Ho=class extends yn{constructor(t,e,n,s){super(t,e,n,s)}};Ho.prototype.ValueTypeName="color";var Go=class extends yn{constructor(t,e,n,s){super(t,e,n,s)}};Go.prototype.ValueTypeName="number";var Vo=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)En.slerpFlat(r,0,a,c-o,a,c,l);return r}},sa=class extends yn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Vo(this.times,this.values,this.getValueSize(),t)}};sa.prototype.ValueTypeName="quaternion";sa.prototype.InterpolantFactoryMethodSmooth=void 0;var Fi=class extends yn{constructor(t,e,n){super(t,e,n)}};Fi.prototype.ValueTypeName="string";Fi.prototype.ValueBufferType=Array;Fi.prototype.DefaultInterpolation=Ir;Fi.prototype.InterpolantFactoryMethodLinear=void 0;Fi.prototype.InterpolantFactoryMethodSmooth=void 0;var Wo=class extends yn{constructor(t,e,n,s){super(t,e,n,s)}};Wo.prototype.ValueTypeName="vector";var Xo=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Nd=new Xo,qo=class{constructor(t){this.manager=t!==void 0?t:Nd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};qo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Qi=class extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Tt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},ra=class extends Qi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Tt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Lc=new ue,zu=new I,ku=new I,Ws=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new gt(512,512),this.mapType=gn,this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bs,this._frameExtents=new gt(1,1),this._viewportCount=1,this._viewports=[new be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;zu.setFromMatrixPosition(t.matrixWorld),e.position.copy(zu),ku.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ku),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Lc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Lc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Ls||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(Lc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},co=new I,ho=new En,$n=new I,aa=class extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(co,ho,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(co,ho,$n.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(co,ho,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(co,ho,$n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Pi=new I,Hu=new gt,Gu=new gt,We=class extends aa{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Zi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ar*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Zi*2*Math.atan(Math.tan(Ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z)}getViewSize(t,e){return this.getViewBounds(t,Hu,Gu),e.subVectors(Gu,Hu)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ar*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Gc=class extends Ws{constructor(){super(new We(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){let e=this.camera,n=Zi*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){let t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}},oa=class extends Qi{constructor(t,e,n=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Gc}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}},Vc=class extends Ws{constructor(){super(new We(90,1,.5,500)),this.isPointLightShadow=!0}},la=class extends Qi{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Vc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Xs=class extends aa{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Wc=class extends Ws{constructor(){super(new Xs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},qs=class extends Qi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new Wc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Ys=class extends Ie{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var As=-90,Cs=1,Yo=class extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new We(As,Cs,t,e);s.layers=this.layers,this.add(s);let r=new We(As,Cs,t,e);r.layers=this.layers,this.add(r);let a=new We(As,Cs,t,e);a.layers=this.layers,this.add(a);let o=new We(As,Cs,t,e);o.layers=this.layers,this.add(o);let l=new We(As,Cs,t,e);l.layers=this.layers,this.add(l);let c=new We(As,Cs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===On)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ls)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Zo=class extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},ca=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=sm.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function sm(){this._document.hidden===!1&&this.reset()}var gh="\\[\\]\\.:\\/",rm=new RegExp("["+gh+"]","g"),_h="[^"+gh+"]",am="[^"+gh.replace("\\.","")+"]",om=/((?:WC+[\/:])*)/.source.replace("WC",_h),lm=/(WCOD+)?/.source.replace("WCOD",am),cm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_h),hm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_h),um=new RegExp("^"+om+lm+cm+hm+"$"),dm=["material","materials","bones","map"],Xc=class{constructor(t,e,n){let s=n||Te.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Te=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(rm,"")}static parseTrackName(t){let e=um.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);dm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Jt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Zt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Zt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Zt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Zt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Zt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Zt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Zt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;Zt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Zt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Zt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Te.Composite=Xc;Te.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Te.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Te.prototype.GetterByBindingType=[Te.prototype._getValue_direct,Te.prototype._getValue_array,Te.prototype._getValue_arrayElement,Te.prototype._getValue_toArray];Te.prototype.SetterByBindingTypeAndVersioning=[[Te.prototype._setValue_direct,Te.prototype._setValue_direct_setNeedsUpdate,Te.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_array,Te.prototype._setValue_array_setNeedsUpdate,Te.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_arrayElement,Te.prototype._setValue_arrayElement_setNeedsUpdate,Te.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_fromArray,Te.prototype._setValue_fromArray_setNeedsUpdate,Te.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var kv=new Float32Array(1);var Vu=new ue,ha=class{constructor(t,e,n=0,s=1/0){this.ray=new Os(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Fs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Zt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Vu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Vu),this}intersectObject(t,e=!0,n=[]){return qc(t,this,n,e),n.sort(Wu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)qc(t[s],this,n,e);return n.sort(Wu),n}};function Wu(i,t){return i.distance-t.distance}function qc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)qc(r[a],t,e,!0)}}var bh=class bh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};bh.prototype.isMatrix2=!0;var Yc=bh;function xh(i,t,e,n){let s=fm(n);switch(e){case ch:return i*t;case il:return i*t/s.components*s.byteLength;case sl:return i*t/s.components*s.byteLength;case Bi:return i*t*2/s.components*s.byteLength;case rl:return i*t*2/s.components*s.byteLength;case hh:return i*t*3/s.components*s.byteLength;case Rn:return i*t*4/s.components*s.byteLength;case al:return i*t*4/s.components*s.byteLength;case pa:case ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ga:case _a:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ll:case hl:return Math.max(i,16)*Math.max(t,8)/4;case ol:case cl:return Math.max(i,8)*Math.max(t,8)/2;case ul:case dl:case pl:case ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fl:case xa:case gl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _l:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case vl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case yl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ml:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Sl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case bl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case El:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case wl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Al:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Cl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Rl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Pl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Il:case Ll:case Dl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Nl:case Fl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case va:case Ul:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function fm(i){switch(i){case gn:case rh:return{byteLength:1,components:1};case js:case ah:case Vn:return{byteLength:2,components:1};case el:case nl:return{byteLength:2,components:4};case Gn:case tl:case Cn:return{byteLength:4,components:1};case oh:case lh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Jt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function nf(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function mm(i){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){let g=d[u],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){let _=d[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var gm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_m=`#ifdef USE_ALPHAHASH
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
#endif`,xm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ym=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Mm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sm=`#ifdef USE_AOMAP
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
#endif`,bm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Em=`#ifdef USE_BATCHING
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
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Tm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Am=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rm=`#ifdef USE_IRIDESCENCE
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
#endif`,Pm=`#ifdef USE_BUMPMAP
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
#endif`,Im=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Lm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Um=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Om=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Bm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,zm=`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,km=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hm=`vec3 transformedNormal = objectNormal;
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
#endif`,Gm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ym=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Jm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$m=`#ifdef USE_ENVMAP
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
#endif`,Km=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,t0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,e0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,n0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,i0=`#ifdef USE_GRADIENTMAP
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
}`,s0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,r0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,a0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,o0=`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
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
#endif
#include <lightprobes_pars_fragment>`,l0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
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
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,c0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,h0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,u0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,f0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,p0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
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
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,m0=`
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
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,g0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,x0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,v0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,y0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,M0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,S0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,b0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,E0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,T0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,w0=`#if defined( USE_POINTS_UV )
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
#endif`,A0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,C0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,R0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,P0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,I0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,L0=`#ifdef USE_MORPHTARGETS
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
#endif`,D0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,N0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,F0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,U0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,z0=`#ifdef USE_NORMALMAP
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
#endif`,k0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,H0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,G0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,V0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,X0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,q0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Y0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Z0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,J0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,K0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,j0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
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
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Q0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
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
#endif`,tg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
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
#endif`,eg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
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
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
}`,ng=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ig=`#ifdef USE_SKINNING
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
#endif`,sg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rg=`#ifdef USE_SKINNING
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
#endif`,ag=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,og=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,hg=`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ug=`#ifdef USE_TRANSMISSION
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
#endif`,dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,gg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_g=`uniform sampler2D t2D;
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
}`,xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sg=`#include <common>
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
}`,bg=`#if DEPTH_PACKING == 3200
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
}`,Eg=`#define DISTANCE
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
}`,Tg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ag=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cg=`uniform float scale;
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
}`,Rg=`uniform vec3 diffuse;
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
}`,Pg=`#include <common>
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
}`,Ig=`uniform vec3 diffuse;
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
}`,Lg=`#define LAMBERT
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
}`,Dg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,Ng=`#define MATCAP
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
}`,Fg=`#define MATCAP
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
}`,Ug=`#define NORMAL
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
}`,Og=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bg=`#define PHONG
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
}`,zg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,kg=`#define STANDARD
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
}`,Hg=`#define STANDARD
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
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,Gg=`#define TOON
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
}`,Vg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,Wg=`uniform float size;
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
}`,Xg=`uniform vec3 diffuse;
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
}`,qg=`#include <common>
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
}`,Yg=`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,Zg=`uniform float rotation;
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
}`,Jg=`uniform vec3 diffuse;
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
}`,se={alphahash_fragment:gm,alphahash_pars_fragment:_m,alphamap_fragment:xm,alphamap_pars_fragment:vm,alphatest_fragment:ym,alphatest_pars_fragment:Mm,aomap_fragment:Sm,aomap_pars_fragment:bm,batching_pars_vertex:Em,batching_vertex:Tm,begin_vertex:wm,beginnormal_vertex:Am,bsdfs:Cm,iridescence_fragment:Rm,bumpmap_pars_fragment:Pm,clipping_planes_fragment:Im,clipping_planes_pars_fragment:Lm,clipping_planes_pars_vertex:Dm,clipping_planes_vertex:Nm,color_fragment:Fm,color_pars_fragment:Um,color_pars_vertex:Om,color_vertex:Bm,common:zm,cube_uv_reflection_fragment:km,defaultnormal_vertex:Hm,displacementmap_pars_vertex:Gm,displacementmap_vertex:Vm,emissivemap_fragment:Wm,emissivemap_pars_fragment:Xm,colorspace_fragment:qm,colorspace_pars_fragment:Ym,envmap_fragment:Zm,envmap_common_pars_fragment:Jm,envmap_pars_fragment:$m,envmap_pars_vertex:Km,envmap_physical_pars_fragment:l0,envmap_vertex:jm,fog_vertex:Qm,fog_pars_vertex:t0,fog_fragment:e0,fog_pars_fragment:n0,gradientmap_pars_fragment:i0,lightmap_pars_fragment:s0,lights_lambert_fragment:r0,lights_lambert_pars_fragment:a0,lights_pars_begin:o0,lights_toon_fragment:c0,lights_toon_pars_fragment:h0,lights_phong_fragment:u0,lights_phong_pars_fragment:d0,lights_physical_fragment:f0,lights_physical_pars_fragment:p0,lights_fragment_begin:m0,lights_fragment_maps:g0,lights_fragment_end:_0,lightprobes_pars_fragment:x0,logdepthbuf_fragment:v0,logdepthbuf_pars_fragment:y0,logdepthbuf_pars_vertex:M0,logdepthbuf_vertex:S0,map_fragment:b0,map_pars_fragment:E0,map_particle_fragment:T0,map_particle_pars_fragment:w0,metalnessmap_fragment:A0,metalnessmap_pars_fragment:C0,morphinstance_vertex:R0,morphcolor_vertex:P0,morphnormal_vertex:I0,morphtarget_pars_vertex:L0,morphtarget_vertex:D0,normal_fragment_begin:N0,normal_fragment_maps:F0,normal_pars_fragment:U0,normal_pars_vertex:O0,normal_vertex:B0,normalmap_pars_fragment:z0,clearcoat_normal_fragment_begin:k0,clearcoat_normal_fragment_maps:H0,clearcoat_pars_fragment:G0,iridescence_pars_fragment:V0,opaque_fragment:W0,packing:X0,premultiplied_alpha_fragment:q0,project_vertex:Y0,dithering_fragment:Z0,dithering_pars_fragment:J0,roughnessmap_fragment:$0,roughnessmap_pars_fragment:K0,shadowmap_pars_fragment:j0,shadowmap_pars_vertex:Q0,shadowmap_vertex:tg,shadowmask_pars_fragment:eg,skinbase_vertex:ng,skinning_pars_vertex:ig,skinning_vertex:sg,skinnormal_vertex:rg,specularmap_fragment:ag,specularmap_pars_fragment:og,tonemapping_fragment:lg,tonemapping_pars_fragment:cg,transmission_fragment:hg,transmission_pars_fragment:ug,uv_pars_fragment:dg,uv_pars_vertex:fg,uv_vertex:pg,worldpos_vertex:mg,background_vert:gg,background_frag:_g,backgroundCube_vert:xg,backgroundCube_frag:vg,cube_vert:yg,cube_frag:Mg,depth_vert:Sg,depth_frag:bg,distance_vert:Eg,distance_frag:Tg,equirect_vert:wg,equirect_frag:Ag,linedashed_vert:Cg,linedashed_frag:Rg,meshbasic_vert:Pg,meshbasic_frag:Ig,meshlambert_vert:Lg,meshlambert_frag:Dg,meshmatcap_vert:Ng,meshmatcap_frag:Fg,meshnormal_vert:Ug,meshnormal_frag:Og,meshphong_vert:Bg,meshphong_frag:zg,meshphysical_vert:kg,meshphysical_frag:Hg,meshtoon_vert:Gg,meshtoon_frag:Vg,points_vert:Wg,points_frag:Xg,shadow_vert:qg,shadow_frag:Yg,sprite_vert:Zg,sprite_frag:Jg},Ct={common:{diffuse:{value:new Tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new Tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Tt(16777215)},opacity:{value:1},center:{value:new gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},oi={basic:{uniforms:sn([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.fog]),vertexShader:se.meshbasic_vert,fragmentShader:se.meshbasic_frag},lambert:{uniforms:sn([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Tt(0)},envMapIntensity:{value:1}}]),vertexShader:se.meshlambert_vert,fragmentShader:se.meshlambert_frag},phong:{uniforms:sn([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Tt(0)},specular:{value:new Tt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:se.meshphong_vert,fragmentShader:se.meshphong_frag},standard:{uniforms:sn([Ct.common,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.roughnessmap,Ct.metalnessmap,Ct.fog,Ct.lights,{emissive:{value:new Tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag},toon:{uniforms:sn([Ct.common,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.gradientmap,Ct.fog,Ct.lights,{emissive:{value:new Tt(0)}}]),vertexShader:se.meshtoon_vert,fragmentShader:se.meshtoon_frag},matcap:{uniforms:sn([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,{matcap:{value:null}}]),vertexShader:se.meshmatcap_vert,fragmentShader:se.meshmatcap_frag},points:{uniforms:sn([Ct.points,Ct.fog]),vertexShader:se.points_vert,fragmentShader:se.points_frag},dashed:{uniforms:sn([Ct.common,Ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:se.linedashed_vert,fragmentShader:se.linedashed_frag},depth:{uniforms:sn([Ct.common,Ct.displacementmap]),vertexShader:se.depth_vert,fragmentShader:se.depth_frag},normal:{uniforms:sn([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,{opacity:{value:1}}]),vertexShader:se.meshnormal_vert,fragmentShader:se.meshnormal_frag},sprite:{uniforms:sn([Ct.sprite,Ct.fog]),vertexShader:se.sprite_vert,fragmentShader:se.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:se.background_vert,fragmentShader:se.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:se.backgroundCube_vert,fragmentShader:se.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:se.cube_vert,fragmentShader:se.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:se.equirect_vert,fragmentShader:se.equirect_frag},distance:{uniforms:sn([Ct.common,Ct.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:se.distance_vert,fragmentShader:se.distance_frag},shadow:{uniforms:sn([Ct.lights,Ct.fog,{color:{value:new Tt(0)},opacity:{value:1}}]),vertexShader:se.shadow_vert,fragmentShader:se.shadow_frag}};oi.physical={uniforms:sn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Tt(0)},specularColor:{value:new Tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag};var zl={r:0,b:0,g:0},$g=new ue,sf=new jt;sf.set(-1,0,0,0,1,0,0,0,1);function Kg(i,t,e,n,s,r){let a=new Tt(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(E){let R=E.isScene===!0?E.background:null;if(R&&R.isTexture){let S=E.backgroundBlurriness>0;R=t.get(R,S)}return R}function g(E){let R=!1,S=f(E);S===null?m(a,o):S&&S.isColor&&(m(S,1),R=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||R)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(E,R){let S=f(R);S&&(S.isCubeTexture||S.mapping===da)?(c===void 0&&(c=new ie(new mn(1,1,1),new Ne({name:"BackgroundCubeMaterial",uniforms:rs(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,M,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4($g.makeRotationFromEuler(R.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(sf),c.material.toneMapped=ae.getTransfer(S.colorSpace)!==me,(h!==S||d!==S.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=S,d=S.version,u=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new ie(new nn(2,2),new Ne({name:"BackgroundMaterial",uniforms:rs(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,l.material.toneMapped=ae.getTransfer(S.colorSpace)!==me,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||d!==S.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=S,d=S.version,u=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function m(E,R){E.getRGB(zl,mh(i)),e.buffers.color.setClear(zl.r,zl.g,zl.b,R,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,R=1){a.set(E),o=R,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,m(a,o)},render:g,addToRenderList:_,dispose:p}}function jg(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(O,V,J,z,W){let nt=!1,j=d(O,z,J,V);r!==j&&(r=j,c(r.object)),nt=f(O,z,J,W),nt&&g(O,z,J,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(nt||a)&&(a=!1,S(O,V,J,z),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function l(){return i.createVertexArray()}function c(O){return i.bindVertexArray(O)}function h(O){return i.deleteVertexArray(O)}function d(O,V,J,z){let W=z.wireframe===!0,nt=n[V.id];nt===void 0&&(nt={},n[V.id]=nt);let j=O.isInstancedMesh===!0?O.id:0,ht=nt[j];ht===void 0&&(ht={},nt[j]=ht);let tt=ht[J.id];tt===void 0&&(tt={},ht[J.id]=tt);let at=tt[W];return at===void 0&&(at=u(l()),tt[W]=at),at}function u(O){let V=[],J=[],z=[];for(let W=0;W<e;W++)V[W]=0,J[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:J,attributeDivisors:z,object:O,attributes:{},index:null}}function f(O,V,J,z){let W=r.attributes,nt=V.attributes,j=0,ht=J.getAttributes();for(let tt in ht)if(ht[tt].location>=0){let q=W[tt],ut=nt[tt];if(ut===void 0&&(tt==="instanceMatrix"&&O.instanceMatrix&&(ut=O.instanceMatrix),tt==="instanceColor"&&O.instanceColor&&(ut=O.instanceColor)),q===void 0||q.attribute!==ut||ut&&q.data!==ut.data)return!0;j++}return r.attributesNum!==j||r.index!==z}function g(O,V,J,z){let W={},nt=V.attributes,j=0,ht=J.getAttributes();for(let tt in ht)if(ht[tt].location>=0){let q=nt[tt];q===void 0&&(tt==="instanceMatrix"&&O.instanceMatrix&&(q=O.instanceMatrix),tt==="instanceColor"&&O.instanceColor&&(q=O.instanceColor));let ut={};ut.attribute=q,q&&q.data&&(ut.data=q.data),W[tt]=ut,j++}r.attributes=W,r.attributesNum=j,r.index=z}function _(){let O=r.newAttributes;for(let V=0,J=O.length;V<J;V++)O[V]=0}function m(O){p(O,0)}function p(O,V){let J=r.newAttributes,z=r.enabledAttributes,W=r.attributeDivisors;J[O]=1,z[O]===0&&(i.enableVertexAttribArray(O),z[O]=1),W[O]!==V&&(i.vertexAttribDivisor(O,V),W[O]=V)}function E(){let O=r.newAttributes,V=r.enabledAttributes;for(let J=0,z=V.length;J<z;J++)V[J]!==O[J]&&(i.disableVertexAttribArray(J),V[J]=0)}function R(O,V,J,z,W,nt,j){j===!0?i.vertexAttribIPointer(O,V,J,W,nt):i.vertexAttribPointer(O,V,J,z,W,nt)}function S(O,V,J,z){_();let W=z.attributes,nt=J.getAttributes(),j=V.defaultAttributeValues;for(let ht in nt){let tt=nt[ht];if(tt.location>=0){let at=W[ht];if(at===void 0&&(ht==="instanceMatrix"&&O.instanceMatrix&&(at=O.instanceMatrix),ht==="instanceColor"&&O.instanceColor&&(at=O.instanceColor)),at!==void 0){let q=at.normalized,ut=at.itemSize,yt=t.get(at);if(yt===void 0)continue;let Kt=yt.buffer,$t=yt.type,Vt=yt.bytesPerElement,et=$t===i.INT||$t===i.UNSIGNED_INT||at.gpuType===tl;if(at.isInterleavedBufferAttribute){let ot=at.data,St=ot.stride,Wt=at.offset;if(ot.isInstancedInterleavedBuffer){for(let bt=0;bt<tt.locationSize;bt++)p(tt.location+bt,ot.meshPerAttribute);O.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let bt=0;bt<tt.locationSize;bt++)m(tt.location+bt);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let bt=0;bt<tt.locationSize;bt++)R(tt.location+bt,ut/tt.locationSize,$t,q,St*Vt,(Wt+ut/tt.locationSize*bt)*Vt,et)}else{if(at.isInstancedBufferAttribute){for(let ot=0;ot<tt.locationSize;ot++)p(tt.location+ot,at.meshPerAttribute);O.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let ot=0;ot<tt.locationSize;ot++)m(tt.location+ot);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let ot=0;ot<tt.locationSize;ot++)R(tt.location+ot,ut/tt.locationSize,$t,q,ut*Vt,ut/tt.locationSize*ot*Vt,et)}}else if(j!==void 0){let q=j[ht];if(q!==void 0)switch(q.length){case 2:i.vertexAttrib2fv(tt.location,q);break;case 3:i.vertexAttrib3fv(tt.location,q);break;case 4:i.vertexAttrib4fv(tt.location,q);break;default:i.vertexAttrib1fv(tt.location,q)}}}}E()}function T(){A();for(let O in n){let V=n[O];for(let J in V){let z=V[J];for(let W in z){let nt=z[W];for(let j in nt)h(nt[j].object),delete nt[j];delete z[W]}}delete n[O]}}function M(O){if(n[O.id]===void 0)return;let V=n[O.id];for(let J in V){let z=V[J];for(let W in z){let nt=z[W];for(let j in nt)h(nt[j].object),delete nt[j];delete z[W]}}delete n[O.id]}function w(O){for(let V in n){let J=n[V];for(let z in J){let W=J[z];if(W[O.id]===void 0)continue;let nt=W[O.id];for(let j in nt)h(nt[j].object),delete nt[j];delete W[O.id]}}}function v(O){for(let V in n){let J=n[V],z=O.isInstancedMesh===!0?O.id:0,W=J[z];if(W!==void 0){for(let nt in W){let j=W[nt];for(let ht in j)h(j[ht].object),delete j[ht];delete W[nt]}delete J[z],Object.keys(J).length===0&&delete n[V]}}}function A(){L(),a=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:L,dispose:T,releaseStatesOfGeometry:M,releaseStatesOfObject:v,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function Qg(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function t_(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==Rn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){let v=w===Vn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==gn&&w!==Cn&&!v&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Jt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Jt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),M=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:R,maxFragmentUniforms:S,maxSamples:T,samples:M}}function e_(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Fn,o=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let E=r?0:n,R=E*4,S=p.clippingState||null;l.value=S,S=h(g,u,R,f);for(let T=0;T!==R;++T)S[T]=e[T];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let R=0,S=f;R!==_;++R,S+=4)a.copy(d[R]).applyMatrix4(E,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}var er=4,n_=6,i_=20,s_=256,Ma=new Xs,Fd=new Tt,Eh=null,Th=0,wh=0,Ah=!1,r_=new I,as=new I,ir=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=r_}=r;Eh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Od(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Eh,Th,wh),this._renderer.xr.enabled=Ah,t.scissorTest=!1,tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ui||t.mapping===ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Eh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Vn,format:Rn,colorSpace:Lr,depthBuffer:!1},s=Ud(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ud(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=a_(r)),this._blurMaterial=l_(r,t,e),this._ggxMaterial=o_(r,t,e)}return s}_compileMaterial(t){let e=new ie(new Ie,t);this._renderer.compile(e,Ma)}_sceneToCubeUV(t,e,n,s,r){let l=new We(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Fd),d.toneMapping=Hn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ie(new mn,new zn({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,p=!1,E=t.background;E?E.isColor&&(m.color.copy(E),t.background=null,p=!0):(m.color.copy(Fd),p=!0);for(let R=0;R<6;R++){let S=R%3;S===0?(l.up.set(0,c[R],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[R],r.y,r.z)):S===1?(l.up.set(0,0,c[R]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[R],r.z)):(l.up.set(0,c[R],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[R]));let T=this._cubeSize;tr(s,S*T,R>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(_,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=E}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ui||t.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Od());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;tr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Ma)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:g}=this,_=this._sizeLods[n],m=3*_*(n>g-er?n-g+er:0),p=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,tr(r,m,p,3*_,2*_),s.setRenderTarget(r),s.render(o,Ma),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,tr(t,m,p,3*_,2*_),s.setRenderTarget(t),s.render(o,Ma)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-er?s-this._lodMax+er:0),u=4*(this._cubeSize-h);tr(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(l,Ma)}};function a_(i){let t=[],e=[],n=i,s=i-er+1+n_;for(let r=0;r<s;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,g=new Float32Array(f*u*d),_=new Float32Array(f*u*d);for(let p=0;p<d;p++){let E=p%3*2/3-1,R=p>2?0:-1,S=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];g.set(S,f*u*p);for(let T=0;T<u;T++){let M=h[T*2]*2-1,w=h[T*2+1]*2-1;p===0?as.set(1,w,M):p===1?as.set(-M,1,-w):p===2?as.set(-M,w,1):p===3?as.set(-1,w,-M):p===4?as.set(-M,-1,w):as.set(M,w,-1),as.toArray(_,(p*u+T)*f)}}let m=new Ie;m.setAttribute("position",new Ye(g,f)),m.setAttribute("outputDirection",new Ye(_,f)),e.push(new ie(m,null)),n>er&&n--}return{lodMeshes:e,sizeLods:t}}function Ud(i,t,e){let n=new pn(i,t,e);return n.texture.mapping=da,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function o_(i,t,e){return new Ne({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:s_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:si,depthTest:!1,depthWrite:!1})}function l_(i,t,e){return new Ne({name:"SphericalGaussianBlur",defines:{SAMPLES:i_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Vl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:si,depthTest:!1,depthWrite:!1})}function Od(){return new Ne({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vl(),fragmentShader:`

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
		`,blending:si,depthTest:!1,depthWrite:!1})}function Bd(){return new Ne({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:si,depthTest:!1,depthWrite:!1})}function Vl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Hl=class extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Vr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new mn(5,5,5),r=new Ne({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ke,blending:si});r.uniforms.tEquirect.value=e;let a=new ie(s,r),o=e.minFilter;return e.minFilter===ri&&(e.minFilter=Ze),new Yo(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function c_(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Ko||f===jo)if(t.has(u)){let g=t.get(u).texture;return o(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let _=new Hl(g.height);return _.fromEquirectangularTexture(i,u),t.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,g=f===Ko||f===jo,_=f===Ui||f===ss;if(g||_){let m=e.get(u),p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new ir(i)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{let E=u.image;return g&&E&&E.height>0||_&&E&&l(E)?(n===null&&(n=new ir(i)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Ko?u.mapping=Ui:f===jo&&(u.mapping=ss),u}function l(u){let f=0,g=6;for(let _=0;_<g;_++)u[_]!==void 0&&f++;return f===g}function c(u){let f=u.target;f.removeEventListener("dispose",c);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function h_(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Yi("WebGLRenderer: "+n+" extension not supported."),s}}}function u_(i,t,e,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,g=d.attributes.position,_=0;if(g===void 0)return;if(f!==null){let E=f.array;_=f.version;for(let R=0,S=E.length;R<S;R+=3){let T=E[R+0],M=E[R+1],w=E[R+2];u.push(T,M,M,w,w,T)}}else{let E=g.array;_=g.version;for(let R=0,S=E.length/3-1;R<S;R+=3){let T=R+0,M=R+1,w=R+2;u.push(T,M,M,w,w,T)}}let m=new(g.count>=65535?zr:Br)(u,1);m.version=_;let p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function d_(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let _=0;for(let m=0;m<f;m++)_+=u[m];e.update(_,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function f_(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Zt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function p_(i,t,e){let n=new WeakMap,s=new be;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let A=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],E=o.morphAttributes.color||[],R=0;f===!0&&(R=1),g===!0&&(R=2),_===!0&&(R=3);let S=o.attributes.position.count*R,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);let M=new Float32Array(S*T*4*d),w=new Ur(M,S,T,d);w.type=Cn,w.needsUpdate=!0;let v=R*4;for(let L=0;L<d;L++){let O=m[L],V=p[L],J=E[L],z=S*T*4*L;for(let W=0;W<O.count;W++){let nt=W*v;f===!0&&(s.fromBufferAttribute(O,W),M[z+nt+0]=s.x,M[z+nt+1]=s.y,M[z+nt+2]=s.z,M[z+nt+3]=0),g===!0&&(s.fromBufferAttribute(V,W),M[z+nt+4]=s.x,M[z+nt+5]=s.y,M[z+nt+6]=s.z,M[z+nt+7]=0),_===!0&&(s.fromBufferAttribute(J,W),M[z+nt+8]=s.x,M[z+nt+9]=s.y,M[z+nt+10]=s.z,M[z+nt+11]=J.itemSize===4?s.w:1)}}u={count:d,texture:w,size:new gt(S,T)},n.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function m_(i,t,e,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var g_={[jc]:"LINEAR_TONE_MAPPING",[Qc]:"REINHARD_TONE_MAPPING",[th]:"CINEON_TONE_MAPPING",[ua]:"ACES_FILMIC_TONE_MAPPING",[nh]:"AGX_TONE_MAPPING",[ih]:"NEUTRAL_TONE_MAPPING",[eh]:"CUSTOM_TONE_MAPPING"};function __(i,t,e,n,s,r){let a=new pn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Ie;c.setAttribute("position",new de([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new de([0,2,0,0,2,0],2));let h=new No({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ie(c,h),u=new Xs(-1,1,1,-1,0,1),f=null,g=null,_=!1,m,p=null,E=[],R=!1;this.setSize=function(S,T){a.setSize(S,T),o!==null&&o.setSize(S,T),l!==null&&l.setSize(S,T);for(let M=0;M<E.length;M++){let w=E[M];w.setSize&&w.setSize(S,T)}},this.setEffects=function(S){E=S,R=E.length>0&&E[0].isRenderPass===!0;let T=a.width,M=a.height;E.length>0&&o===null&&(o=new pn(T,M,{type:Vn,depthBuffer:!1,stencilBuffer:!1}),l=new pn(T,M,{type:Vn,depthBuffer:!1,stencilBuffer:!1}));for(let w=0;w<E.length;w++){let v=E[w];v.setSize&&v.setSize(T,M)}},this.begin=function(S,T){if(_||S.toneMapping===Hn&&E.length===0)return!1;if(p=T,T!==null){let M=T.width,w=T.height;(a.width!==M||a.height!==w)&&this.setSize(M,w)}return R===!1&&S.setRenderTarget(a),m=S.toneMapping,S.toneMapping=Hn,!0},this.hasRenderPass=function(){return R},this.end=function(S,T){S.toneMapping=m,_=!0;let M=a,w=o;for(let v=0;v<E.length;v++){let A=E[v];A.enabled!==!1&&(A.render(S,w,M,T),A.needsSwap!==!1&&(M=w,w=w===o?l:o))}if(f!==S.outputColorSpace||g!==S.toneMapping){f=S.outputColorSpace,g=S.toneMapping,h.defines={},ae.getTransfer(f)===me&&(h.defines.SRGB_TRANSFER="");let v=g_[g];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,S.setRenderTarget(p),S.render(d,u),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var rf=new cn,Ph=new Li(1,1),af=new Ur,of=new To,lf=new Vr,zd=[],kd=[],Hd=new Float32Array(16),Gd=new Float32Array(9),Vd=new Float32Array(4);function sr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=zd[s];if(r===void 0&&(r=new Float32Array(s),zd[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Wl(i,t){let e=kd[t];e===void 0&&(e=new Int32Array(t),kd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function x_(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function v_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ge(e,t)}}function y_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ge(e,t)}}function M_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ge(e,t)}}function S_(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;Vd.set(n),i.uniformMatrix2fv(this.addr,!1,Vd),Ge(e,n)}}function b_(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;Gd.set(n),i.uniformMatrix3fv(this.addr,!1,Gd),Ge(e,n)}}function E_(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;Hd.set(n),i.uniformMatrix4fv(this.addr,!1,Hd),Ge(e,n)}}function T_(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function w_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ge(e,t)}}function A_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ge(e,t)}}function C_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ge(e,t)}}function R_(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function P_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ge(e,t)}}function I_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ge(e,t)}}function L_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ge(e,t)}}function D_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ph.compareFunction=e.isReversedDepthBuffer()?Bl:Ol,r=Ph):r=rf,e.setTexture2D(t||r,s)}function N_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||of,s)}function F_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||lf,s)}function U_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||af,s)}function O_(i){switch(i){case 5126:return x_;case 35664:return v_;case 35665:return y_;case 35666:return M_;case 35674:return S_;case 35675:return b_;case 35676:return E_;case 5124:case 35670:return T_;case 35667:case 35671:return w_;case 35668:case 35672:return A_;case 35669:case 35673:return C_;case 5125:return R_;case 36294:return P_;case 36295:return I_;case 36296:return L_;case 35678:case 36198:case 36298:case 36306:case 35682:return D_;case 35679:case 36299:case 36307:return N_;case 35680:case 36300:case 36308:case 36293:return F_;case 36289:case 36303:case 36311:case 36292:return U_}}function B_(i,t){i.uniform1fv(this.addr,t)}function z_(i,t){let e=sr(t,this.size,2);i.uniform2fv(this.addr,e)}function k_(i,t){let e=sr(t,this.size,3);i.uniform3fv(this.addr,e)}function H_(i,t){let e=sr(t,this.size,4);i.uniform4fv(this.addr,e)}function G_(i,t){let e=sr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function V_(i,t){let e=sr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function W_(i,t){let e=sr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function X_(i,t){i.uniform1iv(this.addr,t)}function q_(i,t){i.uniform2iv(this.addr,t)}function Y_(i,t){i.uniform3iv(this.addr,t)}function Z_(i,t){i.uniform4iv(this.addr,t)}function J_(i,t){i.uniform1uiv(this.addr,t)}function $_(i,t){i.uniform2uiv(this.addr,t)}function K_(i,t){i.uniform3uiv(this.addr,t)}function j_(i,t){i.uniform4uiv(this.addr,t)}function Q_(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ph:a=rf;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function tx(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||of,r[a])}function ex(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||lf,r[a])}function nx(i,t,e){let n=this.cache,s=t.length,r=Wl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ge(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||af,r[a])}function ix(i){switch(i){case 5126:return B_;case 35664:return z_;case 35665:return k_;case 35666:return H_;case 35674:return G_;case 35675:return V_;case 35676:return W_;case 5124:case 35670:return X_;case 35667:case 35671:return q_;case 35668:case 35672:return Y_;case 35669:case 35673:return Z_;case 5125:return J_;case 36294:return $_;case 36295:return K_;case 36296:return j_;case 35678:case 36198:case 36298:case 36306:case 35682:return Q_;case 35679:case 36299:case 36307:return tx;case 35680:case 36300:case 36308:case 36293:return ex;case 36289:case 36303:case 36311:case 36292:return nx}}var Ih=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=O_(e.type)}},Lh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ix(e.type)}},Dh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},Ch=/(\w+)(\])?(\[|\.)?/g;function Wd(i,t){i.seq.push(t),i.map[t.id]=t}function sx(i,t,e){let n=i.name,s=n.length;for(Ch.lastIndex=0;;){let r=Ch.exec(n),a=Ch.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Wd(e,c===void 0?new Ih(o,i,t):new Lh(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new Dh(o),Wd(e,d)),e=d}}}var nr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);sx(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Xd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var rx=37297,ax=0;function ox(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var qd=new jt;function lx(i){ae._getMatrix(qd,ae.workingColorSpace,i);let t=`mat3( ${qd.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(i)){case Dr:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return Jt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Yd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+ox(i.getShaderSource(t),o)}else return r}function cx(i,t){let e=lx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var hx={[jc]:"Linear",[Qc]:"Reinhard",[th]:"Cineon",[ua]:"ACESFilmic",[nh]:"AgX",[ih]:"Neutral",[eh]:"Custom"};function ux(i,t){let e=hx[t];return e===void 0?(Jt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var kl=new I;function dx(){ae.getLuminanceCoefficients(kl);let i=kl.x.toFixed(4),t=kl.y.toFixed(4),e=kl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ba).join(`
`)}function px(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function mx(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ba(i){return i!==""}function Zd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var gx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Nh(i){return i.replace(gx,xx)}var _x=new Map;function xx(i,t){let e=se[t];if(e===void 0){let n=_x.get(t);if(n!==void 0)e=se[n],Jt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Nh(e)}var vx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $d(i){return i.replace(vx,yx)}function yx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Mx={[ts]:"SHADOWMAP_TYPE_PCF",[Zs]:"SHADOWMAP_TYPE_VSM"};function Sx(i){return Mx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var bx={[Ui]:"ENVMAP_TYPE_CUBE",[ss]:"ENVMAP_TYPE_CUBE",[da]:"ENVMAP_TYPE_CUBE_UV"};function Ex(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":bx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Tx={[ss]:"ENVMAP_MODE_REFRACTION"};function wx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Tx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Ax={[$o]:"ENVMAP_BLENDING_MULTIPLY",[hd]:"ENVMAP_BLENDING_MIX",[ud]:"ENVMAP_BLENDING_ADD"};function Cx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Ax[i.combine]||"ENVMAP_BLENDING_NONE"}function Rx(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Px(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Sx(e),c=Ex(e),h=wx(e),d=Cx(e),u=Rx(e),f=fx(e),g=px(r),_=s.createProgram(),m,p,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ba).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ba).join(`
`),p.length>0&&(p+=`
`)):(m=[Kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ba).join(`
`),p=[Kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hn?"#define TONE_MAPPING":"",e.toneMapping!==Hn?se.tonemapping_pars_fragment:"",e.toneMapping!==Hn?ux("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",se.colorspace_pars_fragment,cx("linearToOutputTexel",e.outputColorSpace),dx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ba).join(`
`)),a=Nh(a),a=Zd(a,e),a=Jd(a,e),o=Nh(o),o=Zd(o,e),o=Jd(o,e),a=$d(a),o=$d(o),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===dh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===dh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let R=E+m+a,S=E+p+o,T=Xd(s,s.VERTEX_SHADER,R),M=Xd(s,s.FRAGMENT_SHADER,S);s.attachShader(_,T),s.attachShader(_,M),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function w(O){if(i.debug.checkShaderErrors){let V=s.getProgramInfoLog(_)||"",J=s.getShaderInfoLog(T)||"",z=s.getShaderInfoLog(M)||"",W=V.trim(),nt=J.trim(),j=z.trim(),ht=!0,tt=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ht=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,T,M);else{let at=Yd(s,T,"vertex"),q=Yd(s,M,"fragment");Zt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+W+`
`+at+`
`+q)}else W!==""?Jt("WebGLProgram: Program Info Log:",W):(nt===""||j==="")&&(tt=!1);tt&&(O.diagnostics={runnable:ht,programLog:W,vertexShader:{log:nt,prefix:m},fragmentShader:{log:j,prefix:p}})}s.deleteShader(T),s.deleteShader(M),v=new nr(s,_),A=mx(s,_)}let v;this.getUniforms=function(){return v===void 0&&w(this),v};let A;this.getAttributes=function(){return A===void 0&&w(this),A};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(_,rx)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ax++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=M,this}var Ix=0,Fh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Uh(t),e.set(t,n)),n}},Uh=class{constructor(t){this.id=Ix++,this.code=t,this.usedTimes=0}};function Lx(i){return i===Bi||i===xa||i===va}function Dx(i,t,e,n,s,r){let a=new Fs,o=new Fh,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,A,L,O,V,J){let z=O.fog,W=V.geometry,nt=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?O.environment:null,j=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,ht=t.get(v.envMap||nt,j),tt=ht&&ht.mapping===da?ht.image.height:null,at=f[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Jt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let q=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ut=q!==void 0?q.length:0,yt=0;W.morphAttributes.position!==void 0&&(yt=1),W.morphAttributes.normal!==void 0&&(yt=2),W.morphAttributes.color!==void 0&&(yt=3);let Kt,$t,Vt,et;if(at){let Me=oi[at];Kt=Me.vertexShader,$t=Me.fragmentShader}else{Kt=v.vertexShader,$t=v.fragmentShader;let Me=o.getVertexShaderStage(v),fe=o.getFragmentShaderStage(v);o.update(v,Me,fe),Vt=Me.id,et=fe.id}let ot=i.getRenderTarget(),St=i.state.buffers.depth.getReversed(),Wt=V.isInstancedMesh===!0,bt=V.isBatchedMesh===!0,At=!!v.map,le=!!v.matcap,lt=!!ht,ft=!!v.aoMap,vt=!!v.lightMap,_t=!!v.bumpMap&&v.wireframe===!1,Et=!!v.normalMap,Ft=!!v.displacementMap,Ut=!!v.emissiveMap,Ht=!!v.metalnessMap,Xt=!!v.roughnessMap,D=v.anisotropy>0,qt=v.clearcoat>0,Yt=v.dispersion>0,C=v.retroreflectivity>0,x=v.iridescence>0,Y=v.sheen>0,k=v.transmission>0,y=D&&!!v.anisotropyMap,P=qt&&!!v.clearcoatMap,X=qt&&!!v.clearcoatNormalMap,B=qt&&!!v.clearcoatRoughnessMap,U=x&&!!v.iridescenceMap,st=x&&!!v.iridescenceThicknessMap,N=Y&&!!v.sheenColorMap,Z=Y&&!!v.sheenRoughnessMap,G=!!v.specularMap,it=!!v.specularColorMap,ct=!!v.specularIntensityMap,Nt=k&&!!v.transmissionMap,F=k&&!!v.thicknessMap,Mt=!!v.gradientMap,rt=!!v.alphaMap,wt=v.alphaTest>0,It=!!v.alphaHash,pt=!!v.extensions,Gt=Hn;v.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(Gt=i.toneMapping);let zt={shaderID:at,shaderType:v.type,shaderName:v.name,vertexShader:Kt,fragmentShader:$t,defines:v.defines,customVertexShaderID:Vt,customFragmentShaderID:et,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:bt,batchingColor:bt&&V._colorsTexture!==null,instancing:Wt,instancingColor:Wt&&V.instanceColor!==null,instancingMorph:Wt&&V.morphTexture!==null,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:ae.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:At,matcap:le,envMap:lt,envMapMode:lt&&ht.mapping,envMapCubeUVHeight:tt,aoMap:ft,lightMap:vt,bumpMap:_t,normalMap:Et,displacementMap:Ft,emissiveMap:Ut,normalMapObjectSpace:Et&&v.normalMapType===pd,normalMapTangentSpace:Et&&v.normalMapType===ya,packedNormalMap:Et&&v.normalMapType===ya&&Lx(v.normalMap.format),metalnessMap:Ht,roughnessMap:Xt,anisotropy:D,anisotropyMap:y,clearcoat:qt,clearcoatMap:P,clearcoatNormalMap:X,clearcoatRoughnessMap:B,dispersion:Yt,retroreflection:C,iridescence:x,iridescenceMap:U,iridescenceThicknessMap:st,sheen:Y,sheenColorMap:N,sheenRoughnessMap:Z,specularMap:G,specularColorMap:it,specularIntensityMap:ct,transmission:k,transmissionMap:Nt,thicknessMap:F,gradientMap:Mt,opaque:v.transparent===!1&&v.blending===Js&&v.alphaToCoverage===!1,alphaMap:rt,alphaTest:wt,alphaHash:It,combine:v.combine,mapUv:At&&g(v.map.channel),aoMapUv:ft&&g(v.aoMap.channel),lightMapUv:vt&&g(v.lightMap.channel),bumpMapUv:_t&&g(v.bumpMap.channel),normalMapUv:Et&&g(v.normalMap.channel),displacementMapUv:Ft&&g(v.displacementMap.channel),emissiveMapUv:Ut&&g(v.emissiveMap.channel),metalnessMapUv:Ht&&g(v.metalnessMap.channel),roughnessMapUv:Xt&&g(v.roughnessMap.channel),anisotropyMapUv:y&&g(v.anisotropyMap.channel),clearcoatMapUv:P&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:X&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:B&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:U&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:st&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:N&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:Z&&g(v.sheenRoughnessMap.channel),specularMapUv:G&&g(v.specularMap.channel),specularColorMapUv:it&&g(v.specularColorMap.channel),specularIntensityMapUv:ct&&g(v.specularIntensityMap.channel),transmissionMapUv:Nt&&g(v.transmissionMap.channel),thicknessMapUv:F&&g(v.thicknessMap.channel),alphaMapUv:rt&&g(v.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Et||D),vertexNormals:!!W.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!W.attributes.uv&&(At||rt),fog:!!z,useFog:v.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||W.attributes.normal===void 0&&Et===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:St,skinning:V.isSkinnedMesh===!0,hasPositionAttribute:W.attributes.position!==void 0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:yt,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:J.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Gt,decodeVideoTexture:At&&v.map.isVideoTexture===!0&&ae.getTransfer(v.map.colorSpace)===me,decodeVideoTextureEmissive:Ut&&v.emissiveMap.isVideoTexture===!0&&ae.getTransfer(v.emissiveMap.colorSpace)===me,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===An,flipSided:v.side===ke,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:pt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pt&&v.extensions.multiDraw===!0||bt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return zt.vertexUv1s=l.has(1),zt.vertexUv2s=l.has(2),zt.vertexUv3s=l.has(3),l.clear(),zt}function m(v){let A=[];if(v.shaderID?A.push(v.shaderID):(A.push(v.customVertexShaderID),A.push(v.customFragmentShaderID)),v.defines!==void 0)for(let L in v.defines)A.push(L),A.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(p(A,v),E(A,v),A.push(i.outputColorSpace)),A.push(v.customProgramCacheKey),A.join()}function p(v,A){v.push(A.precision),v.push(A.outputColorSpace),v.push(A.envMapMode),v.push(A.envMapCubeUVHeight),v.push(A.mapUv),v.push(A.alphaMapUv),v.push(A.lightMapUv),v.push(A.aoMapUv),v.push(A.bumpMapUv),v.push(A.normalMapUv),v.push(A.displacementMapUv),v.push(A.emissiveMapUv),v.push(A.metalnessMapUv),v.push(A.roughnessMapUv),v.push(A.anisotropyMapUv),v.push(A.clearcoatMapUv),v.push(A.clearcoatNormalMapUv),v.push(A.clearcoatRoughnessMapUv),v.push(A.iridescenceMapUv),v.push(A.iridescenceThicknessMapUv),v.push(A.sheenColorMapUv),v.push(A.sheenRoughnessMapUv),v.push(A.specularMapUv),v.push(A.specularColorMapUv),v.push(A.specularIntensityMapUv),v.push(A.transmissionMapUv),v.push(A.thicknessMapUv),v.push(A.combine),v.push(A.fogExp2),v.push(A.sizeAttenuation),v.push(A.morphTargetsCount),v.push(A.morphAttributeCount),v.push(A.numSunLights),v.push(A.numDirLights),v.push(A.numPointLights),v.push(A.numSpotLights),v.push(A.numSpotLightMaps),v.push(A.numHemiLights),v.push(A.numRectAreaLights),v.push(A.numSunLightShadows),v.push(A.numDirLightShadows),v.push(A.numPointLightShadows),v.push(A.numSpotLightShadows),v.push(A.numSpotLightShadowsWithMaps),v.push(A.numLightProbes),v.push(A.shadowMapType),v.push(A.toneMapping),v.push(A.numClippingPlanes),v.push(A.numClipIntersection),v.push(A.depthPacking)}function E(v,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function R(v){let A=f[v.type],L;if(A){let O=oi[A];L=Ld.clone(O.uniforms)}else L=v.uniforms;return L}function S(v,A){let L=h.get(A);return L!==void 0?++L.usedTimes:(L=new Px(i,A,v,s),c.push(L),h.set(A,L)),L}function T(v){if(--v.usedTimes===0){let A=c.indexOf(v);c[A]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function M(v){o.remove(v)}function w(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:R,acquireProgram:S,releaseProgram:T,releaseShaderCache:M,programs:c,dispose:w}}function Nx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Fx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function jd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Qd(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,_,m,p){let E=i[t];return E===void 0?(E={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:p},i[t]=E):(E.id=u.id,E.object=u,E.geometry=f,E.material=g,E.materialVariant=a(u),E.groupOrder=_,E.renderOrder=u.renderOrder,E.z=m,E.group=p),t++,E}function l(u,f,g,_,m,p,E){E.reversedDepth===!0&&(m=-m);let R=o(u,f,g,_,m,p);g.transmission>0?n.push(R):g.transparent===!0?s.push(R):e.push(R)}function c(u,f,g,_,m,p){let E=o(u,f,g,_,m,p);g.transmission>0?n.unshift(E):g.transparent===!0?s.unshift(E):e.unshift(E)}function h(u,f){e.length>1&&e.sort(u||Fx),n.length>1&&n.sort(f||jd),s.length>1&&s.sort(f||jd)}function d(){for(let u=t,f=i.length;u<f;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Ux(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new Qd,i.set(n,[a])):s>=r.length?(a=new Qd,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ox(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new I,color:new Tt};break;case"SpotLight":e={position:new I,direction:new I,color:new Tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Tt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Tt,groundColor:new Tt};break;case"RectAreaLight":e={color:new Tt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function Bx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var zx=0;function kx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Hx(i){let t=new Ox,e=Bx(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let s=new I,r=new ue,a=new ue;function o(c){let h=0,d=0,u=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,E=0,R=0,S=0,T=0,M=0,w=0,v=0,A=0,L=0;c.sort(kx);for(let V=0,J=c.length;V<J;V++){let z=c[V],W=z.color,nt=z.intensity,j=z.distance,ht=null;if(z.shadow&&z.shadow.map&&(z.shadow.map.texture.format===Bi?ht=z.shadow.map.texture:ht=z.shadow.map.depthTexture||z.shadow.map.texture),z.isAmbientLight)h+=W.r*nt,d+=W.g*nt,u+=W.b*nt;else if(z.isLightProbe){for(let tt=0;tt<9;tt++)n.probe[tt].addScaledVector(z.sh.coefficients[tt],nt);L++}else if(z.isSunLight){let tt=t.get(z);if(tt.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){let at=z.shadow,q=e.get(z);q.shadowIntensity=at.intensity,q.shadowBias=at.bias,q.shadowNormalBias=at.normalBias,q.shadowRadius=at.radius,q.shadowMapSize.copy(at.mapSize).multiply(at.getFrameExtents()),n.sunShadow[g]=q,n.sunShadowMap[g]=ht;let ut=at.getViewportCount();for(let yt=0;yt<ut;yt++)n.sunShadowMatrix[_+yt]=at.getMatrix(yt),n.sunShadowCascade[_+yt]=at._cascadeData[yt];_+=ut,g++}n.sun[f]=tt,f++}else if(z.isDirectionalLight){let tt=t.get(z);if(tt.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){let at=z.shadow,q=e.get(z);q.shadowIntensity=at.intensity,q.shadowBias=at.bias,q.shadowNormalBias=at.normalBias,q.shadowRadius=at.radius,q.shadowMapSize=at.mapSize,n.directionalShadow[m]=q,n.directionalShadowMap[m]=ht,n.directionalShadowMatrix[m]=z.shadow.matrix,T++}n.directional[m]=tt,m++}else if(z.isSpotLight){let tt=t.get(z);tt.position.setFromMatrixPosition(z.matrixWorld),tt.color.copy(W).multiplyScalar(nt),tt.distance=j,tt.coneCos=Math.cos(z.angle),tt.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),tt.decay=z.decay,n.spot[E]=tt;let at=z.shadow;if(z.map&&(n.spotLightMap[v]=z.map,v++,at.updateMatrices(z),z.castShadow&&A++),n.spotLightMatrix[E]=at.matrix,z.castShadow){let q=e.get(z);q.shadowIntensity=at.intensity,q.shadowBias=at.bias,q.shadowNormalBias=at.normalBias,q.shadowRadius=at.radius,q.shadowMapSize=at.mapSize,n.spotShadow[E]=q,n.spotShadowMap[E]=ht,w++}E++}else if(z.isRectAreaLight){let tt=t.get(z);tt.color.copy(W).multiplyScalar(nt),tt.halfWidth.set(z.width*.5,0,0),tt.halfHeight.set(0,z.height*.5,0),n.rectArea[R]=tt,R++}else if(z.isPointLight){let tt=t.get(z);if(tt.color.copy(z.color).multiplyScalar(z.intensity),tt.distance=z.distance,tt.decay=z.decay,z.castShadow){let at=z.shadow,q=e.get(z);q.shadowIntensity=at.intensity,q.shadowBias=at.bias,q.shadowNormalBias=at.normalBias,q.shadowRadius=at.radius,q.shadowMapSize=at.mapSize,q.shadowCameraNear=at.camera.near,q.shadowCameraFar=at.camera.far,n.pointShadow[p]=q,n.pointShadowMap[p]=ht,n.pointShadowMatrix[p]=z.shadow.matrix,M++}n.point[p]=tt,p++}else if(z.isHemisphereLight){let tt=t.get(z);tt.skyColor.copy(z.color).multiplyScalar(nt),tt.groundColor.copy(z.groundColor).multiplyScalar(nt),n.hemi[S]=tt,S++}}R>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ct.LTC_FLOAT_1,n.rectAreaLTC2=Ct.LTC_FLOAT_2):(n.rectAreaLTC1=Ct.LTC_HALF_1,n.rectAreaLTC2=Ct.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let O=n.hash;(O.sunLength!==f||O.directionalLength!==m||O.pointLength!==p||O.spotLength!==E||O.rectAreaLength!==R||O.hemiLength!==S||O.numSunShadows!==g||O.numDirectionalShadows!==T||O.numPointShadows!==M||O.numSpotShadows!==w||O.numSpotMaps!==v||O.numLightProbes!==L)&&(n.sun.length=f,n.directional.length=m,n.spot.length=E,n.rectArea.length=R,n.point.length=p,n.hemi.length=S,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=M,n.pointShadowMap.length=M,n.pointShadowMatrix.length=M,n.spotShadow.length=w,n.spotShadowMap.length=w,n.spotLightMatrix.length=w+v-A,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=L,O.sunLength=f,O.directionalLength=m,O.pointLength=p,O.spotLength=E,O.rectAreaLength=R,O.hemiLength=S,O.numSunShadows=g,O.numDirectionalShadows=T,O.numPointShadows=M,O.numSpotShadows=w,O.numSpotMaps=v,O.numLightProbes=L,n.version=zx++)}function l(c,h){let d=0,u=0,f=0,g=0,_=0,m=0,p=h.matrixWorldInverse;for(let E=0,R=c.length;E<R;E++){let S=c[E];if(S.isSunLight){let T=n.sun[d];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(p),d++}else if(S.isDirectionalLight){let T=n.directional[u];T.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),u++}else if(S.isSpotLight){let T=n.spot[g];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),g++}else if(S.isRectAreaLight){let T=n.rectArea[_];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(S.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(S.width*.5,0,0),T.halfHeight.set(0,S.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){let T=n.point[f];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){let T=n.hemi[m];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function tf(i){let t=new Hx(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Gx(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new tf(i),t.set(s,[o])):r>=a.length?(o=new tf(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var Vx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Xx=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],qx=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],ef=new ue,Sa=new I,Rh=new I;function Yx(i,t,e){let n=new Bs,s=new gt,r=new gt,a=new be,o=new Fo,l=new Uo,c={},h=e.maxTextureSize,d={[ii]:ke,[ke]:ii,[An]:An},u=new Ne({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new gt},radius:{value:4}},vertexShader:Vx,fragmentShader:Wx}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let g=new Ie;g.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ie(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ts;let p=this.type;this.render=function(M,w,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===Yu&&(Jt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ts);let A=i.getRenderTarget(),L=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),V=i.state;V.setBlending(si),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let J=p!==this.type;J&&w.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(W=>W.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,W=M.length;z<W;z++){let nt=M[z],j=nt.shadow;if(j===void 0){Jt("WebGLShadowMap:",nt,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;s.copy(j.mapSize);let ht=j.getFrameExtents();s.multiply(ht),r.copy(j.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ht.x),s.x=r.x*ht.x,j.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ht.y),s.y=r.y*ht.y,j.mapSize.y=r.y));let tt=i.state.buffers.depth.getReversed();if(j.camera._reversedDepth=tt,j.map===null||J===!0){if(j.map!==null&&(j.map.depthTexture!==null&&(j.map.depthTexture.dispose(),j.map.depthTexture=null),j.map.dispose()),this.type===Zs){if(nt.isPointLight){Jt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}j.map=new pn(s.x,s.y,{format:Bi,type:Vn,minFilter:Ze,magFilter:Ze,generateMipmaps:!1}),j.map.texture.name=nt.name+".shadowMap",j.map.depthTexture=new Li(s.x,s.y,Cn),j.map.depthTexture.name=nt.name+".shadowMapDepth",j.map.depthTexture.format=Qn,j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=Xe,j.map.depthTexture.magFilter=Xe}else nt.isPointLight?(j.map=new Hl(s.x),j.map.depthTexture=new Co(s.x,Gn)):(j.map=new pn(s.x,s.y),j.map.depthTexture=new Li(s.x,s.y,Gn)),j.map.depthTexture.name=nt.name+".shadowMap",j.map.depthTexture.format=Qn,this.type===ts?(j.map.depthTexture.compareFunction=tt?Bl:Ol,j.map.depthTexture.minFilter=Ze,j.map.depthTexture.magFilter=Ze):(j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=Xe,j.map.depthTexture.magFilter=Xe);j.camera.updateProjectionMatrix()}j.map.isWebGLCubeRenderTarget!==!0&&(j.map.width!==s.x||j.map.height!==s.y)&&j.map.setSize(s.x,s.y);let at=j.map.isWebGLCubeRenderTarget?6:j.getViewportCount();nt.isPointLight!==!0&&j.updateMatrices(nt,v);for(let q=0;q<at;q++){let ut=j.getCamera(q);if(nt.isPointLight){let yt=j.camera,Kt=j.matrix,$t=nt.distance||yt.far;$t!==yt.far&&(yt.far=$t,yt.updateProjectionMatrix()),Sa.setFromMatrixPosition(nt.matrixWorld),yt.position.copy(Sa),Rh.copy(yt.position),Rh.add(Xx[q]),yt.up.copy(qx[q]),yt.lookAt(Rh),yt.updateMatrixWorld(),Kt.makeTranslation(-Sa.x,-Sa.y,-Sa.z),ef.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),j._frustum.setFromProjectionMatrix(ef,yt.coordinateSystem,yt.reversedDepth)}if(j.map.isWebGLCubeRenderTarget)i.setRenderTarget(j.map,q),i.clear();else{q===0&&(i.setRenderTarget(j.map),i.clear());let yt=j.getViewport(q);a.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),V.viewport(a)}n=j.getFrustum(q),S(w,v,ut,nt,this.type)}j.isPointLightShadow!==!0&&this.type===Zs&&E(j,v),j.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(A,L,O)};function E(M,w){let v=t.update(_);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null?M.mapPass=new pn(s.x,s.y,{format:Bi,type:Vn}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(w,null,v,u,_,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(w,null,v,f,_,null)}function R(M,w,v,A){let L=null,O=v.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(O!==void 0)L=O;else if(L=v.isPointLight===!0?l:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let V=L.uuid,J=w.uuid,z=c[V];z===void 0&&(z={},c[V]=z);let W=z[J];W===void 0&&(W=L.clone(),z[J]=W,w.addEventListener("dispose",T)),L=W}if(L.visible=w.visible,L.wireframe=w.wireframe,A===Zs?L.side=w.shadowSide!==null?w.shadowSide:w.side:L.side=w.shadowSide!==null?w.shadowSide:d[w.side],L.alphaMap=w.alphaMap,L.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,L.map=w.map,L.clipShadows=w.clipShadows,L.clippingPlanes=w.clippingPlanes,L.clipIntersection=w.clipIntersection,L.displacementMap=w.displacementMap,L.displacementScale=w.displacementScale,L.displacementBias=w.displacementBias,L.wireframeLinewidth=w.wireframeLinewidth,L.linewidth=w.linewidth,v.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let V=i.properties.get(L);V.light=v}return L}function S(M,w,v,A,L){if(M.visible===!1)return;if(M.layers.test(w.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&L===Zs)&&(!M.frustumCulled||M.intersectsFrustum(n))){M.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,M.matrixWorld);let J=t.update(M),z=M.material;if(Array.isArray(z)){let W=J.groups;for(let nt=0,j=W.length;nt<j;nt++){let ht=W[nt],tt=z[ht.materialIndex];if(tt&&tt.visible){let at=R(M,tt,A,L);M.onBeforeShadow(i,M,w,v,J,at,ht),i.renderBufferDirect(v,null,J,at,M,ht),M.onAfterShadow(i,M,w,v,J,at,ht)}}}else if(z.visible){let W=R(M,z,A,L);M.onBeforeShadow(i,M,w,v,J,W,null),i.renderBufferDirect(v,null,J,W,M,null),M.onAfterShadow(i,M,w,v,J,W,null)}}let V=M.children;for(let J=0,z=V.length;J<z;J++)S(V[J],w,v,A,L)}function T(M){M.target.removeEventListener("dispose",T);for(let v in c){let A=c[v],L=M.target.uuid;L in A&&(A[L].dispose(),delete A[L])}}}function Zx(i,t){function e(){let F=!1,Mt=new be,rt=null,wt=new be(0,0,0,0);return{setMask:function(It){rt!==It&&!F&&(i.colorMask(It,It,It,It),rt=It)},setLocked:function(It){F=It},setClear:function(It,pt,Gt,zt,Me){Me===!0&&(It*=zt,pt*=zt,Gt*=zt),Mt.set(It,pt,Gt,zt),wt.equals(Mt)===!1&&(i.clearColor(It,pt,Gt,zt),wt.copy(Mt))},reset:function(){F=!1,rt=null,wt.set(-1,0,0,0)}}}function n(){let F=!1,Mt=!1,rt=null,wt=null,It=null;return{setReversed:function(pt){if(Mt!==pt){let Gt=t.get("EXT_clip_control");pt?Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.ZERO_TO_ONE_EXT):Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.NEGATIVE_ONE_TO_ONE_EXT),Mt=pt;let zt=It;It=null,this.setClear(zt)}},getReversed:function(){return Mt},setTest:function(pt){pt?ot(i.DEPTH_TEST):St(i.DEPTH_TEST)},setMask:function(pt){rt!==pt&&!F&&(i.depthMask(pt),rt=pt)},setFunc:function(pt){if(Mt&&(pt=Td[pt]),wt!==pt){switch(pt){case po:i.depthFunc(i.NEVER);break;case mo:i.depthFunc(i.ALWAYS);break;case go:i.depthFunc(i.LESS);break;case Ps:i.depthFunc(i.LEQUAL);break;case _o:i.depthFunc(i.EQUAL);break;case xo:i.depthFunc(i.GEQUAL);break;case vo:i.depthFunc(i.GREATER);break;case yo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}wt=pt}},setLocked:function(pt){F=pt},setClear:function(pt){It!==pt&&(It=pt,Mt&&(pt=1-pt),i.clearDepth(pt))},reset:function(){F=!1,rt=null,wt=null,It=null,Mt=!1}}}function s(){let F=!1,Mt=null,rt=null,wt=null,It=null,pt=null,Gt=null,zt=null,Me=null;return{setTest:function(fe){F||(fe?ot(i.STENCIL_TEST):St(i.STENCIL_TEST))},setMask:function(fe){Mt!==fe&&!F&&(i.stencilMask(fe),Mt=fe)},setFunc:function(fe,In,Zn){(rt!==fe||wt!==In||It!==Zn)&&(i.stencilFunc(fe,In,Zn),rt=fe,wt=In,It=Zn)},setOp:function(fe,In,Zn){(pt!==fe||Gt!==In||zt!==Zn)&&(i.stencilOp(fe,In,Zn),pt=fe,Gt=In,zt=Zn)},setLocked:function(fe){F=fe},setClear:function(fe){Me!==fe&&(i.clearStencil(fe),Me=fe)},reset:function(){F=!1,Mt=null,rt=null,wt=null,It=null,pt=null,Gt=null,zt=null,Me=null}}}let r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,g=[],_=null,m=!1,p=null,E=null,R=null,S=null,T=null,M=null,w=null,v=new Tt(0,0,0),A=0,L=!1,O=null,V=null,J=null,z=null,W=null,nt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,ht=0,tt=i.getParameter(i.VERSION);tt.indexOf("WebGL")!==-1?(ht=parseFloat(/^WebGL (\d)/.exec(tt)[1]),j=ht>=1):tt.indexOf("OpenGL ES")!==-1&&(ht=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),j=ht>=2);let at=null,q={},ut=i.getParameter(i.SCISSOR_BOX),yt=i.getParameter(i.VIEWPORT),Kt=new be().fromArray(ut),$t=new be().fromArray(yt);function Vt(F,Mt,rt,wt){let It=new Uint8Array(4),pt=i.createTexture();i.bindTexture(F,pt),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Gt=0;Gt<rt;Gt++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(Mt,0,i.RGBA,1,1,wt,0,i.RGBA,i.UNSIGNED_BYTE,It):i.texImage2D(Mt+Gt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,It);return pt}let et={};et[i.TEXTURE_2D]=Vt(i.TEXTURE_2D,i.TEXTURE_2D,1),et[i.TEXTURE_CUBE_MAP]=Vt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[i.TEXTURE_2D_ARRAY]=Vt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),et[i.TEXTURE_3D]=Vt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ot(i.DEPTH_TEST),a.setFunc(Ps),_t(!1),Et(Zc),ot(i.CULL_FACE),ft(si);function ot(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function St(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function Wt(F,Mt){return u[F]!==Mt?(i.bindFramebuffer(F,Mt),u[F]=Mt,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Mt),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Mt),!0):!1}function bt(F,Mt){let rt=g,wt=!1;if(F){rt=f.get(Mt),rt===void 0&&(rt=[],f.set(Mt,rt));let It=F.textures;if(rt.length!==It.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let pt=0,Gt=It.length;pt<Gt;pt++)rt[pt]=i.COLOR_ATTACHMENT0+pt;rt.length=It.length,wt=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,wt=!0);wt&&i.drawBuffers(rt)}function At(F){return _!==F?(i.useProgram(F),_=F,!0):!1}let le={[ns]:i.FUNC_ADD,[Zu]:i.FUNC_SUBTRACT,[Ju]:i.FUNC_REVERSE_SUBTRACT};le[$u]=i.MIN,le[Ku]=i.MAX;let lt={[ju]:i.ZERO,[Ks]:i.ONE,[Qu]:i.SRC_COLOR,[Kc]:i.SRC_ALPHA,[rd]:i.SRC_ALPHA_SATURATE,[id]:i.DST_COLOR,[ed]:i.DST_ALPHA,[td]:i.ONE_MINUS_SRC_COLOR,[is]:i.ONE_MINUS_SRC_ALPHA,[sd]:i.ONE_MINUS_DST_COLOR,[nd]:i.ONE_MINUS_DST_ALPHA,[ad]:i.CONSTANT_COLOR,[od]:i.ONE_MINUS_CONSTANT_COLOR,[ld]:i.CONSTANT_ALPHA,[cd]:i.ONE_MINUS_CONSTANT_ALPHA};function ft(F,Mt,rt,wt,It,pt,Gt,zt,Me,fe){if(F===si){m===!0&&(St(i.BLEND),m=!1);return}if(m===!1&&(ot(i.BLEND),m=!0),F!==$s){if(F!==p||fe!==L){if((E!==ns||T!==ns)&&(i.blendEquation(i.FUNC_ADD),E=ns,T=ns),fe)switch(F){case Js:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case es:i.blendFunc(i.ONE,i.ONE);break;case Jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $c:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Zt("WebGLState: Invalid blending: ",F);break}else switch(F){case Js:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Jc:Zt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $c:Zt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Zt("WebGLState: Invalid blending: ",F);break}R=null,S=null,M=null,w=null,v.set(0,0,0),A=0,p=F,L=fe}return}It=It||Mt,pt=pt||rt,Gt=Gt||wt,(Mt!==E||It!==T)&&(i.blendEquationSeparate(le[Mt],le[It]),E=Mt,T=It),(rt!==R||wt!==S||pt!==M||Gt!==w)&&(i.blendFuncSeparate(lt[rt],lt[wt],lt[pt],lt[Gt]),R=rt,S=wt,M=pt,w=Gt),(zt.equals(v)===!1||Me!==A)&&(i.blendColor(zt.r,zt.g,zt.b,Me),v.copy(zt),A=Me),p=F,L=!1}function vt(F,Mt){F.side===An?St(i.CULL_FACE):ot(i.CULL_FACE);let rt=F.side===ke;Mt&&(rt=!rt),_t(rt),F.blending===Js&&F.transparent===!1?ft(si):ft(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let wt=F.stencilWrite;o.setTest(wt),wt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ut(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):St(i.SAMPLE_ALPHA_TO_COVERAGE)}function _t(F){O!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),O=F)}function Et(F){F!==Xu?(ot(i.CULL_FACE),F!==V&&(F===Zc?i.cullFace(i.BACK):F===qu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):St(i.CULL_FACE),V=F}function Ft(F){F!==J&&(j&&i.lineWidth(F),J=F)}function Ut(F,Mt,rt){F?(ot(i.POLYGON_OFFSET_FILL),(z!==Mt||W!==rt)&&(z=Mt,W=rt,a.getReversed()&&(Mt=-Mt),i.polygonOffset(Mt,rt))):St(i.POLYGON_OFFSET_FILL)}function Ht(F){F?ot(i.SCISSOR_TEST):St(i.SCISSOR_TEST)}function Xt(F){F===void 0&&(F=i.TEXTURE0+nt-1),at!==F&&(i.activeTexture(F),at=F)}function D(F,Mt,rt){rt===void 0&&(at===null?rt=i.TEXTURE0+nt-1:rt=at);let wt=q[rt];wt===void 0&&(wt={type:void 0,texture:void 0},q[rt]=wt),(wt.type!==F||wt.texture!==Mt)&&(at!==rt&&(i.activeTexture(rt),at=rt),i.bindTexture(F,Mt||et[F]),wt.type=F,wt.texture=Mt)}function qt(){let F=q[at];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Yt(){try{i.compressedTexImage2D(...arguments)}catch(F){Zt("WebGLState:",F)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(F){Zt("WebGLState:",F)}}function x(){try{i.texSubImage2D(...arguments)}catch(F){Zt("WebGLState:",F)}}function Y(){try{i.texSubImage3D(...arguments)}catch(F){Zt("WebGLState:",F)}}function k(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Zt("WebGLState:",F)}}function y(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Zt("WebGLState:",F)}}function P(){try{i.texStorage2D(...arguments)}catch(F){Zt("WebGLState:",F)}}function X(){try{i.texStorage3D(...arguments)}catch(F){Zt("WebGLState:",F)}}function B(){try{i.texImage2D(...arguments)}catch(F){Zt("WebGLState:",F)}}function U(){try{i.texImage3D(...arguments)}catch(F){Zt("WebGLState:",F)}}function st(F){return d[F]!==void 0?d[F]:i.getParameter(F)}function N(F,Mt){d[F]!==Mt&&(i.pixelStorei(F,Mt),d[F]=Mt)}function Z(F){Kt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),Kt.copy(F))}function G(F){$t.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),$t.copy(F))}function it(F,Mt){let rt=c.get(Mt);rt===void 0&&(rt=new WeakMap,c.set(Mt,rt));let wt=rt.get(F);wt===void 0&&(wt=i.getUniformBlockIndex(Mt,F.name),rt.set(F,wt))}function ct(F,Mt){let wt=c.get(Mt).get(F);l.get(Mt)!==wt&&(i.uniformBlockBinding(Mt,wt,F.__bindingPointIndex),l.set(Mt,wt))}function Nt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},at=null,q={},u={},f=new WeakMap,g=[],_=null,m=!1,p=null,E=null,R=null,S=null,T=null,M=null,w=null,v=new Tt(0,0,0),A=0,L=!1,O=null,V=null,J=null,z=null,W=null,Kt.set(0,0,i.canvas.width,i.canvas.height),$t.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ot,disable:St,bindFramebuffer:Wt,drawBuffers:bt,useProgram:At,setBlending:ft,setMaterial:vt,setFlipSided:_t,setCullFace:Et,setLineWidth:Ft,setPolygonOffset:Ut,setScissorTest:Ht,activeTexture:Xt,bindTexture:D,unbindTexture:qt,compressedTexImage2D:Yt,compressedTexImage3D:C,texImage2D:B,texImage3D:U,pixelStorei:N,getParameter:st,updateUBOMapping:it,uniformBlockBinding:ct,texStorage2D:P,texStorage3D:X,texSubImage2D:x,texSubImage3D:Y,compressedTexSubImage2D:k,compressedTexSubImage3D:y,scissor:Z,viewport:G,reset:Nt}}function Jx(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new gt,h=new WeakMap,d=new Set,u,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,x){return g?new OffscreenCanvas(C,x):Nr("canvas")}function m(C,x,Y){let k=1,y=Yt(C);if((y.width>Y||y.height>Y)&&(k=Y/Math.max(y.width,y.height)),k<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let P=Math.floor(k*y.width),X=Math.floor(k*y.height);u===void 0&&(u=_(P,X));let B=x?_(P,X):u;return B.width=P,B.height=X,B.getContext("2d").drawImage(C,0,0,P,X),Jt("WebGLRenderer: Texture has been resized from ("+y.width+"x"+y.height+") to ("+P+"x"+X+")."),B}else return"data"in C&&Jt("WebGLRenderer: Image in DataTexture is too big ("+y.width+"x"+y.height+")."),C;return C}function p(C){return C.generateMipmaps}function E(C){i.generateMipmap(C)}function R(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(C,x,Y,k,y,P=!1){if(C!==null){if(i[C]!==void 0)return i[C];Jt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let X;k&&(X=t.get("EXT_texture_norm16"),X||Jt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let B=x;if(x===i.RED&&(Y===i.FLOAT&&(B=i.R32F),Y===i.HALF_FLOAT&&(B=i.R16F),Y===i.UNSIGNED_BYTE&&(B=i.R8),Y===i.UNSIGNED_SHORT&&X&&(B=X.R16_EXT),Y===i.SHORT&&X&&(B=X.R16_SNORM_EXT)),x===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(B=i.R8UI),Y===i.UNSIGNED_SHORT&&(B=i.R16UI),Y===i.UNSIGNED_INT&&(B=i.R32UI),Y===i.BYTE&&(B=i.R8I),Y===i.SHORT&&(B=i.R16I),Y===i.INT&&(B=i.R32I)),x===i.RG&&(Y===i.FLOAT&&(B=i.RG32F),Y===i.HALF_FLOAT&&(B=i.RG16F),Y===i.UNSIGNED_BYTE&&(B=i.RG8),Y===i.UNSIGNED_SHORT&&X&&(B=X.RG16_EXT),Y===i.SHORT&&X&&(B=X.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(B=i.RG8UI),Y===i.UNSIGNED_SHORT&&(B=i.RG16UI),Y===i.UNSIGNED_INT&&(B=i.RG32UI),Y===i.BYTE&&(B=i.RG8I),Y===i.SHORT&&(B=i.RG16I),Y===i.INT&&(B=i.RG32I)),x===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(B=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(B=i.RGB16UI),Y===i.UNSIGNED_INT&&(B=i.RGB32UI),Y===i.BYTE&&(B=i.RGB8I),Y===i.SHORT&&(B=i.RGB16I),Y===i.INT&&(B=i.RGB32I)),x===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(B=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(B=i.RGBA16UI),Y===i.UNSIGNED_INT&&(B=i.RGBA32UI),Y===i.BYTE&&(B=i.RGBA8I),Y===i.SHORT&&(B=i.RGBA16I),Y===i.INT&&(B=i.RGBA32I)),x===i.RGB&&(Y===i.UNSIGNED_SHORT&&X&&(B=X.RGB16_EXT),Y===i.SHORT&&X&&(B=X.RGB16_SNORM_EXT),Y===i.UNSIGNED_INT_5_9_9_9_REV&&(B=i.RGB9_E5),Y===i.UNSIGNED_INT_10F_11F_11F_REV&&(B=i.R11F_G11F_B10F)),x===i.RGBA){let U=P?Dr:ae.getTransfer(y);Y===i.FLOAT&&(B=i.RGBA32F),Y===i.HALF_FLOAT&&(B=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(B=U===me?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT&&X&&(B=X.RGBA16_EXT),Y===i.SHORT&&X&&(B=X.RGBA16_SNORM_EXT),Y===i.UNSIGNED_SHORT_4_4_4_4&&(B=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(B=i.RGB5_A1)}return(B===i.R16F||B===i.R32F||B===i.RG16F||B===i.RG32F||B===i.RGBA16F||B===i.RGBA32F)&&t.get("EXT_color_buffer_float"),B}function T(C,x){let Y;return C?x===null||x===Gn||x===Qs?Y=i.DEPTH24_STENCIL8:x===Cn?Y=i.DEPTH32F_STENCIL8:x===js&&(Y=i.DEPTH24_STENCIL8,Jt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Gn||x===Qs?Y=i.DEPTH_COMPONENT24:x===Cn?Y=i.DEPTH_COMPONENT32F:x===js&&(Y=i.DEPTH_COMPONENT16),Y}function M(C,x){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Xe&&C.minFilter!==Ze?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function w(C){let x=C.target;x.removeEventListener("dispose",w),A(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function v(C){let x=C.target;x.removeEventListener("dispose",v),O(x)}function A(C){let x=n.get(C);if(x.__webglInit===void 0)return;let Y=C.source,k=f.get(Y);if(k){let y=k[x.__cacheKey];y.usedTimes--,y.usedTimes===0&&L(C),Object.keys(k).length===0&&f.delete(Y)}n.remove(C)}function L(C){let x=n.get(C);i.deleteTexture(x.__webglTexture);let Y=C.source,k=f.get(Y);delete k[x.__cacheKey],a.memory.textures--}function O(C){let x=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(x.__webglFramebuffer[k]))for(let y=0;y<x.__webglFramebuffer[k].length;y++)i.deleteFramebuffer(x.__webglFramebuffer[k][y]);else i.deleteFramebuffer(x.__webglFramebuffer[k]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[k])}else{if(Array.isArray(x.__webglFramebuffer))for(let k=0;k<x.__webglFramebuffer.length;k++)i.deleteFramebuffer(x.__webglFramebuffer[k]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let k=0;k<x.__webglColorRenderbuffer.length;k++)x.__webglColorRenderbuffer[k]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[k]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let Y=C.textures;for(let k=0,y=Y.length;k<y;k++){let P=n.get(Y[k]);P.__webglTexture&&(i.deleteTexture(P.__webglTexture),a.memory.textures--),n.remove(Y[k])}n.remove(C)}let V=0;function J(){V=0}function z(){return V}function W(C){V=C}function nt(){let C=V;return C>=s.maxTextures&&Jt("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),V+=1,C}function j(C){let x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function ht(C,x){let Y=n.get(C);if(C.isVideoTexture&&D(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&Y.__version!==C.version){let k=C.image;if(k===null)Jt("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)Jt("WebGLRenderer: Texture marked for update but image is incomplete");else{St(Y,C,x);return}}else C.isExternalTexture&&(Y.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+x)}function tt(C,x){let Y=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&Y.__version!==C.version){St(Y,C,x);return}else C.isExternalTexture&&(Y.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+x)}function at(C,x){let Y=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&Y.__version!==C.version){St(Y,C,x);return}e.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+x)}function q(C,x){let Y=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&Y.__version!==C.version){Wt(Y,C,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+x)}let ut={[Is]:i.REPEAT,[Kn]:i.CLAMP_TO_EDGE,[Mo]:i.MIRRORED_REPEAT},yt={[Xe]:i.NEAREST,[dd]:i.NEAREST_MIPMAP_NEAREST,[fa]:i.NEAREST_MIPMAP_LINEAR,[Ze]:i.LINEAR,[Qo]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},Kt={[gd]:i.NEVER,[Md]:i.ALWAYS,[_d]:i.LESS,[Ol]:i.LEQUAL,[xd]:i.EQUAL,[Bl]:i.GEQUAL,[vd]:i.GREATER,[yd]:i.NOTEQUAL};function $t(C,x){if(x.type===Cn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ze||x.magFilter===Qo||x.magFilter===fa||x.magFilter===ri||x.minFilter===Ze||x.minFilter===Qo||x.minFilter===fa||x.minFilter===ri)&&Jt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,ut[x.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,ut[x.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,ut[x.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,yt[x.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,yt[x.minFilter]),x.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Kt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Xe||x.minFilter!==fa&&x.minFilter!==ri||x.type===Cn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let Y=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Vt(C,x){let Y=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",w));let k=x.source,y=f.get(k);y===void 0&&(y={},f.set(k,y));let P=j(x);if(P!==C.__cacheKey){y[P]===void 0&&(y[P]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,Y=!0),y[P].usedTimes++;let X=y[C.__cacheKey];X!==void 0&&(y[C.__cacheKey].usedTimes--,X.usedTimes===0&&L(x)),C.__cacheKey=P,C.__webglTexture=y[P].texture}return Y}function et(C,x,Y){return Math.floor(Math.floor(C/Y)/x)}function ot(C,x,Y,k){let P=C.updateRanges;if(P.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,Y,k,x.data);else{P.sort((N,Z)=>N.start-Z.start);let X=0;for(let N=1;N<P.length;N++){let Z=P[X],G=P[N],it=Z.start+Z.count,ct=et(G.start,x.width,4),Nt=et(Z.start,x.width,4);G.start<=it+1&&ct===Nt&&et(G.start+G.count-1,x.width,4)===ct?Z.count=Math.max(Z.count,G.start+G.count-Z.start):(++X,P[X]=G)}P.length=X+1;let B=e.getParameter(i.UNPACK_ROW_LENGTH),U=e.getParameter(i.UNPACK_SKIP_PIXELS),st=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let N=0,Z=P.length;N<Z;N++){let G=P[N],it=Math.floor(G.start/4),ct=Math.ceil(G.count/4),Nt=it%x.width,F=Math.floor(it/x.width),Mt=ct,rt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Nt),e.pixelStorei(i.UNPACK_SKIP_ROWS,F),e.texSubImage2D(i.TEXTURE_2D,0,Nt,F,Mt,rt,Y,k,x.data)}C.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,B),e.pixelStorei(i.UNPACK_SKIP_PIXELS,U),e.pixelStorei(i.UNPACK_SKIP_ROWS,st)}}function St(C,x,Y){let k=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(k=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(k=i.TEXTURE_3D);let y=Vt(C,x),P=x.source;e.bindTexture(k,C.__webglTexture,i.TEXTURE0+Y);let X=n.get(P);if(P.version!==X.__version||y===!0){if(e.activeTexture(i.TEXTURE0+Y),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let rt=ae.getPrimaries(ae.workingColorSpace),wt=x.colorSpace===vi?null:ae.getPrimaries(x.colorSpace),It=x.colorSpace===vi||rt===wt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It)}e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let U=m(x.image,!1,s.maxTextureSize);U=qt(x,U);let st=r.convert(x.format,x.colorSpace),N=r.convert(x.type),Z=S(x.internalFormat,st,N,x.normalized,x.colorSpace,x.isVideoTexture);$t(k,x);let G,it=x.mipmaps,ct=x.isVideoTexture!==!0,Nt=X.__version===void 0||y===!0,F=P.dataReady,Mt=M(x,U);if(x.isDepthTexture)Z=T(x.format===Oi,x.type),Nt&&(ct?e.texStorage2D(i.TEXTURE_2D,1,Z,U.width,U.height):e.texImage2D(i.TEXTURE_2D,0,Z,U.width,U.height,0,st,N,null));else if(x.isDataTexture)if(it.length>0){ct&&Nt&&e.texStorage2D(i.TEXTURE_2D,Mt,Z,it[0].width,it[0].height);for(let rt=0,wt=it.length;rt<wt;rt++)G=it[rt],ct?F&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,G.width,G.height,st,N,G.data):e.texImage2D(i.TEXTURE_2D,rt,Z,G.width,G.height,0,st,N,G.data);x.generateMipmaps=!1}else ct?(Nt&&e.texStorage2D(i.TEXTURE_2D,Mt,Z,U.width,U.height),F&&ot(x,U,st,N)):e.texImage2D(i.TEXTURE_2D,0,Z,U.width,U.height,0,st,N,U.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ct&&Nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Z,it[0].width,it[0].height,U.depth);for(let rt=0,wt=it.length;rt<wt;rt++)if(G=it[rt],x.format!==Rn)if(st!==null)if(ct){if(F)if(x.layerUpdates.size>0){let It=xh(G.width,G.height,x.format,x.type);for(let pt of x.layerUpdates){let Gt=G.data.subarray(pt*It/G.data.BYTES_PER_ELEMENT,(pt+1)*It/G.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,pt,G.width,G.height,1,st,Gt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,G.width,G.height,U.depth,st,G.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,rt,Z,G.width,G.height,U.depth,0,G.data,0,0);else Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ct?F&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,G.width,G.height,U.depth,st,N,G.data):e.texImage3D(i.TEXTURE_2D_ARRAY,rt,Z,G.width,G.height,U.depth,0,st,N,G.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{ct&&Nt&&e.texStorage2D(i.TEXTURE_2D,Mt,Z,it[0].width,it[0].height);for(let rt=0,wt=it.length;rt<wt;rt++)G=it[rt],x.format!==Rn?st!==null?ct?F&&e.compressedTexSubImage2D(i.TEXTURE_2D,rt,0,0,G.width,G.height,st,G.data):e.compressedTexImage2D(i.TEXTURE_2D,rt,Z,G.width,G.height,0,G.data):Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?F&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,G.width,G.height,st,N,G.data):e.texImage2D(i.TEXTURE_2D,rt,Z,G.width,G.height,0,st,N,G.data)}else if(x.isDataArrayTexture)if(ct){if(Nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Z,U.width,U.height,U.depth),F)if(x.layerUpdates.size>0){let rt=xh(U.width,U.height,x.format,x.type);for(let wt of x.layerUpdates){let It=U.data.subarray(wt*rt/U.data.BYTES_PER_ELEMENT,(wt+1)*rt/U.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,wt,U.width,U.height,1,st,N,It)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,U.width,U.height,U.depth,st,N,U.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Z,U.width,U.height,U.depth,0,st,N,U.data);else if(x.isData3DTexture)ct?(Nt&&e.texStorage3D(i.TEXTURE_3D,Mt,Z,U.width,U.height,U.depth),F&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,U.width,U.height,U.depth,st,N,U.data)):e.texImage3D(i.TEXTURE_3D,0,Z,U.width,U.height,U.depth,0,st,N,U.data);else if(x.isFramebufferTexture){if(Nt)if(ct)e.texStorage2D(i.TEXTURE_2D,Mt,Z,U.width,U.height);else{let rt=U.width,wt=U.height;for(let It=0;It<Mt;It++)e.texImage2D(i.TEXTURE_2D,It,Z,rt,wt,0,st,N,null),rt>>=1,wt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let rt=i.canvas;if(rt.hasAttribute("layoutsubtree")||rt.setAttribute("layoutsubtree","true"),U.parentNode!==rt){rt.appendChild(U),d.add(x),rt.onpaint=wt=>{let It=wt.changedElements;for(let pt of d)It.includes(pt.image)&&(pt.needsUpdate=!0)},rt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,U);else{let It=i.RGBA,pt=i.RGBA,Gt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,It,pt,Gt,U)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(it.length>0){if(ct&&Nt){let rt=Yt(it[0]);e.texStorage2D(i.TEXTURE_2D,Mt,Z,rt.width,rt.height)}for(let rt=0,wt=it.length;rt<wt;rt++)G=it[rt],ct?F&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,st,N,G):e.texImage2D(i.TEXTURE_2D,rt,Z,st,N,G);x.generateMipmaps=!1}else if(ct){if(Nt){let rt=Yt(U);e.texStorage2D(i.TEXTURE_2D,Mt,Z,rt.width,rt.height)}F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,st,N,U)}else e.texImage2D(i.TEXTURE_2D,0,Z,st,N,U);p(x)&&E(k),X.__version=P.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Wt(C,x,Y){if(x.image.length!==6)return;let k=Vt(C,x),y=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+Y);let P=n.get(y);if(y.version!==P.__version||k===!0){e.activeTexture(i.TEXTURE0+Y);let X=ae.getPrimaries(ae.workingColorSpace),B=x.colorSpace===vi?null:ae.getPrimaries(x.colorSpace),U=x.colorSpace===vi||X===B?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,U);let st=x.isCompressedTexture||x.image[0].isCompressedTexture,N=x.image[0]&&x.image[0].isDataTexture,Z=[];for(let pt=0;pt<6;pt++)!st&&!N?Z[pt]=m(x.image[pt],!0,s.maxCubemapSize):Z[pt]=N?x.image[pt].image:x.image[pt],Z[pt]=qt(x,Z[pt]);let G=Z[0],it=r.convert(x.format,x.colorSpace),ct=r.convert(x.type),Nt=S(x.internalFormat,it,ct,x.normalized,x.colorSpace),F=x.isVideoTexture!==!0,Mt=P.__version===void 0||k===!0,rt=y.dataReady,wt=M(x,G);$t(i.TEXTURE_CUBE_MAP,x);let It;if(st){F&&Mt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Nt,G.width,G.height);for(let pt=0;pt<6;pt++){It=Z[pt].mipmaps;for(let Gt=0;Gt<It.length;Gt++){let zt=It[Gt];x.format!==Rn?it!==null?F?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt,0,0,zt.width,zt.height,it,zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt,Nt,zt.width,zt.height,0,zt.data):Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt,0,0,zt.width,zt.height,it,ct,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt,Nt,zt.width,zt.height,0,it,ct,zt.data)}}}else{if(It=x.mipmaps,F&&Mt){It.length>0&&wt++;let pt=Yt(Z[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Nt,pt.width,pt.height)}for(let pt=0;pt<6;pt++)if(N){F?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Z[pt].width,Z[pt].height,it,ct,Z[pt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,Nt,Z[pt].width,Z[pt].height,0,it,ct,Z[pt].data);for(let Gt=0;Gt<It.length;Gt++){let Me=It[Gt].image[pt].image;F?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt+1,0,0,Me.width,Me.height,it,ct,Me.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt+1,Nt,Me.width,Me.height,0,it,ct,Me.data)}}else{F?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,it,ct,Z[pt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,Nt,it,ct,Z[pt]);for(let Gt=0;Gt<It.length;Gt++){let zt=It[Gt];F?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt+1,0,0,it,ct,zt.image[pt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Gt+1,Nt,it,ct,zt.image[pt])}}}p(x)&&E(i.TEXTURE_CUBE_MAP),P.__version=y.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function bt(C,x,Y,k,y,P){let X=r.convert(Y.format,Y.colorSpace),B=r.convert(Y.type),U=S(Y.internalFormat,X,B,Y.normalized,Y.colorSpace),st=n.get(x),N=n.get(Y);if(N.__renderTarget=x,!st.__hasExternalTextures){let Z=Math.max(1,x.width>>P),G=Math.max(1,x.height>>P);y===i.TEXTURE_3D||y===i.TEXTURE_2D_ARRAY?e.texImage3D(y,P,U,Z,G,x.depth,0,X,B,null):e.texImage2D(y,P,U,Z,G,0,X,B,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),Xt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,k,y,N.__webglTexture,0,Ht(x)):(y===i.TEXTURE_2D||y>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&y<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,k,y,N.__webglTexture,P),e.bindFramebuffer(i.FRAMEBUFFER,null)}function At(C,x,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,C),x.depthBuffer){let k=x.depthTexture,y=k&&k.isDepthTexture?k.type:null,P=T(x.stencilBuffer,y),X=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Xt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ht(x),P,x.width,x.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht(x),P,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,P,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,C)}else{let k=x.textures;for(let y=0;y<k.length;y++){let P=k[y],X=r.convert(P.format,P.colorSpace),B=r.convert(P.type),U=S(P.internalFormat,X,B,P.normalized,P.colorSpace);Xt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ht(x),U,x.width,x.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht(x),U,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,U,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function le(C,x,Y){let k=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let y=n.get(x.depthTexture);if(y.__renderTarget=x,(!y.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),k){if(y.__webglInit===void 0&&(y.__webglInit=!0,x.depthTexture.addEventListener("dispose",w)),y.__webglTexture===void 0){y.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,y.__webglTexture),$t(i.TEXTURE_CUBE_MAP,x.depthTexture);let st=r.convert(x.depthTexture.format),N=r.convert(x.depthTexture.type),Z;x.depthTexture.format===Qn?Z=i.DEPTH_COMPONENT24:x.depthTexture.format===Oi&&(Z=i.DEPTH24_STENCIL8);for(let G=0;G<6;G++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Z,x.width,x.height,0,st,N,null)}}else ht(x.depthTexture,0);let P=y.__webglTexture,X=Ht(x),B=k?i.TEXTURE_CUBE_MAP_POSITIVE_X+Y:i.TEXTURE_2D,U=x.depthTexture.format===Oi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===Qn)Xt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,U,B,P,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,U,B,P,0);else if(x.depthTexture.format===Oi)Xt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,U,B,P,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,U,B,P,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function lt(C){let x=n.get(C),Y=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){let k=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),k){let y=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,k.removeEventListener("dispose",y)};k.addEventListener("dispose",y),x.__depthDisposeCallback=y}x.__boundDepthTexture=k}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(Y)for(let k=0;k<6;k++)le(x.__webglFramebuffer[k],C,k);else{let k=C.texture.mipmaps;k&&k.length>0?le(x.__webglFramebuffer[0],C,0):le(x.__webglFramebuffer,C,0)}else if(Y){x.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[k]),x.__webglDepthbuffer[k]===void 0)x.__webglDepthbuffer[k]=i.createRenderbuffer(),At(x.__webglDepthbuffer[k],C,!1);else{let y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,P=x.__webglDepthbuffer[k];i.bindRenderbuffer(i.RENDERBUFFER,P),i.framebufferRenderbuffer(i.FRAMEBUFFER,y,i.RENDERBUFFER,P)}}else{let k=C.texture.mipmaps;if(k&&k.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),At(x.__webglDepthbuffer,C,!1);else{let y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,P=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,P),i.framebufferRenderbuffer(i.FRAMEBUFFER,y,i.RENDERBUFFER,P)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(C,x,Y){let k=n.get(C);x!==void 0&&bt(k.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&lt(C)}function vt(C){let x=C.texture,Y=n.get(C),k=n.get(x);C.addEventListener("dispose",v);let y=C.textures,P=C.isWebGLCubeRenderTarget===!0,X=y.length>1;if(X||(k.__webglTexture===void 0&&(k.__webglTexture=i.createTexture()),k.__version=x.version,a.memory.textures++),P){Y.__webglFramebuffer=[];for(let B=0;B<6;B++)if(x.mipmaps&&x.mipmaps.length>0){Y.__webglFramebuffer[B]=[];for(let U=0;U<x.mipmaps.length;U++)Y.__webglFramebuffer[B][U]=i.createFramebuffer()}else Y.__webglFramebuffer[B]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){Y.__webglFramebuffer=[];for(let B=0;B<x.mipmaps.length;B++)Y.__webglFramebuffer[B]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(X)for(let B=0,U=y.length;B<U;B++){let st=n.get(y[B]);st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&Xt(C)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let B=0;B<y.length;B++){let U=y[B];Y.__webglColorRenderbuffer[B]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[B]);let st=r.convert(U.format,U.colorSpace),N=r.convert(U.type),Z=S(U.internalFormat,st,N,U.normalized,U.colorSpace,C.isXRRenderTarget===!0),G=Ht(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,G,Z,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+B,i.RENDERBUFFER,Y.__webglColorRenderbuffer[B])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),At(Y.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(P){e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture),$t(i.TEXTURE_CUBE_MAP,x);for(let B=0;B<6;B++)if(x.mipmaps&&x.mipmaps.length>0)for(let U=0;U<x.mipmaps.length;U++)bt(Y.__webglFramebuffer[B][U],C,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+B,U);else bt(Y.__webglFramebuffer[B],C,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+B,0);p(x)&&E(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(X){for(let B=0,U=y.length;B<U;B++){let st=y[B],N=n.get(st),Z=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Z=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Z,N.__webglTexture),$t(Z,st),bt(Y.__webglFramebuffer,C,st,i.COLOR_ATTACHMENT0+B,Z,0),p(st)&&E(Z)}e.unbindTexture()}else{let B=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(B=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(B,k.__webglTexture),$t(B,x),x.mipmaps&&x.mipmaps.length>0)for(let U=0;U<x.mipmaps.length;U++)bt(Y.__webglFramebuffer[U],C,x,i.COLOR_ATTACHMENT0,B,U);else bt(Y.__webglFramebuffer,C,x,i.COLOR_ATTACHMENT0,B,0);p(x)&&E(B),e.unbindTexture()}C.depthBuffer&&lt(C)}function _t(C){let x=C.textures;for(let Y=0,k=x.length;Y<k;Y++){let y=x[Y];if(p(y)){let P=R(C),X=n.get(y).__webglTexture;e.bindTexture(P,X),E(P),e.unbindTexture()}}}let Et=[],Ft=[];function Ut(C){if(C.samples>0){if(Xt(C)===!1){let x=C.textures,Y=C.width,k=C.height,y=i.COLOR_BUFFER_BIT,P=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=n.get(C),B=x.length>1;if(B)for(let st=0;st<x.length;st++)e.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+st,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,X.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+st,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,X.__webglMultisampledFramebuffer);let U=C.texture.mipmaps;U&&U.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglFramebuffer);for(let st=0;st<x.length;st++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(y|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(y|=i.STENCIL_BUFFER_BIT)),B){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,X.__webglColorRenderbuffer[st]);let N=n.get(x[st]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,N,0)}i.blitFramebuffer(0,0,Y,k,0,0,Y,k,y,i.NEAREST),l===!0&&(Et.length=0,Ft.length=0,Et.push(i.COLOR_ATTACHMENT0+st),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(Et.push(P),Ft.push(P),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ft)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Et))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),B)for(let st=0;st<x.length;st++){e.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+st,i.RENDERBUFFER,X.__webglColorRenderbuffer[st]);let N=n.get(x[st]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,X.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+st,i.TEXTURE_2D,N,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let x=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Ht(C){return Math.min(s.maxSamples,C.samples)}function Xt(C){let x=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function D(C){let x=a.render.frame;h.get(C)!==x&&(h.set(C,x),C.update())}function qt(C,x){let Y=C.colorSpace,k=C.format,y=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||Y!==Lr&&Y!==vi&&(ae.getTransfer(Y)===me?(k!==Rn||y!==gn)&&Jt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Zt("WebGLTextures: Unsupported texture color space:",Y)),x}function Yt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=nt,this.resetTextureUnits=J,this.getTextureUnits=z,this.setTextureUnits=W,this.setTexture2D=ht,this.setTexture2DArray=tt,this.setTexture3D=at,this.setTextureCube=q,this.rebindTextures=ft,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=Ut,this.setupDepthRenderbuffer=lt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Xt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function $x(i,t){function e(n,s=vi){let r,a=ae.getTransfer(s);if(n===gn)return i.UNSIGNED_BYTE;if(n===el)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===oh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===lh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===rh)return i.BYTE;if(n===ah)return i.SHORT;if(n===js)return i.UNSIGNED_SHORT;if(n===tl)return i.INT;if(n===Gn)return i.UNSIGNED_INT;if(n===Cn)return i.FLOAT;if(n===Vn)return i.HALF_FLOAT;if(n===ch)return i.ALPHA;if(n===hh)return i.RGB;if(n===Rn)return i.RGBA;if(n===Qn)return i.DEPTH_COMPONENT;if(n===Oi)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===Bi)return i.RG;if(n===rl)return i.RG_INTEGER;if(n===al)return i.RGBA_INTEGER;if(n===pa||n===ma||n===ga||n===_a)if(a===me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===pa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===pa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_a)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ol||n===ll||n===cl||n===hl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ol)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ul||n===dl||n===fl||n===pl||n===ml||n===xa||n===gl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ul||n===dl)return a===me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===pl)return r.COMPRESSED_R11_EAC;if(n===ml)return r.COMPRESSED_SIGNED_R11_EAC;if(n===xa)return r.COMPRESSED_RG11_EAC;if(n===gl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===_l||n===xl||n===vl||n===yl||n===Ml||n===Sl||n===bl||n===El||n===Tl||n===wl||n===Al||n===Cl||n===Rl||n===Pl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===_l)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===vl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===yl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ml)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===bl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===El)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Tl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Al)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Cl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Rl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pl)return a===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Il||n===Ll||n===Dl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Il)return a===me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ll)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Dl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nl||n===Fl||n===va||n===Ul)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Nl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Fl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Kx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jx=`
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

}`,Oh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Wr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ne({vertexShader:Kx,fragmentShader:jx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ie(new nn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bh=class extends ti{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null,_=typeof XRWebGLBinding<"u",m=new Oh,p={},E=e.getContextAttributes(),R=null,S=null,T=[],M=[],w=new gt,v=null,A=null,L=new We;L.viewport=new be;let O=new We;O.viewport=new be;let V=[L,O],J=new Zo,z=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let ot=T[et];return ot===void 0&&(ot=new Us,T[et]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(et){let ot=T[et];return ot===void 0&&(ot=new Us,T[et]=ot),ot.getGripSpace()},this.getHand=function(et){let ot=T[et];return ot===void 0&&(ot=new Us,T[et]=ot),ot.getHandSpace()};function nt(et){let ot=M.indexOf(et.inputSource);if(ot===-1)return;let St=T[ot];St!==void 0&&(St.update(et.inputSource,et.frame,c||a),St.dispatchEvent({type:et.type,data:et.inputSource}))}function j(){s.removeEventListener("select",nt),s.removeEventListener("selectstart",nt),s.removeEventListener("selectend",nt),s.removeEventListener("squeeze",nt),s.removeEventListener("squeezestart",nt),s.removeEventListener("squeezeend",nt),s.removeEventListener("end",j),s.removeEventListener("inputsourceschange",ht);for(let et=0;et<T.length;et++){let ot=M[et];ot!==null&&(M[et]=null,T[et].disconnect(ot))}z=null,W=null,m.reset();for(let et in p)delete p[et];if(t.setRenderTarget(R),f=null,u=null,d=null,s=null,S=null,Vt.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(w.width,w.height,!1),A!==null){let et=A.camera;et.fov=A.fov,et.zoom=A.zoom,et.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){r=et,n.isPresenting===!0&&Jt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){o=et,n.isPresenting===!0&&Jt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(et){c=et},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(et){if(s=et,s!==null){if(R=t.getRenderTarget(),s.addEventListener("select",nt),s.addEventListener("selectstart",nt),s.addEventListener("selectend",nt),s.addEventListener("squeeze",nt),s.addEventListener("squeezestart",nt),s.addEventListener("squeezeend",nt),s.addEventListener("end",j),s.addEventListener("inputsourceschange",ht),E.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(w),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let St=null,Wt=null,bt=null;E.depth&&(bt=E.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,St=E.stencil?Oi:Qn,Wt=E.stencil?Qs:Gn);let At={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(At),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),S=new pn(u.textureWidth,u.textureHeight,{format:Rn,type:gn,depthTexture:new Li(u.textureWidth,u.textureHeight,Wt,void 0,void 0,void 0,void 0,void 0,void 0,St),stencilBuffer:E.stencil,colorSpace:t.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let St={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,St),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new pn(f.framebufferWidth,f.framebufferHeight,{format:Rn,type:gn,colorSpace:t.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Vt.setContext(s),Vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ht(et){for(let ot=0;ot<et.removed.length;ot++){let St=et.removed[ot],Wt=M.indexOf(St);Wt>=0&&(M[Wt]=null,T[Wt].disconnect(St))}for(let ot=0;ot<et.added.length;ot++){let St=et.added[ot],Wt=M.indexOf(St);if(Wt===-1){for(let At=0;At<T.length;At++)if(At>=M.length){M.push(St),Wt=At;break}else if(M[At]===null){M[At]=St,Wt=At;break}if(Wt===-1)break}let bt=T[Wt];bt&&bt.connect(St)}}let tt=new I,at=new I;function q(et,ot,St){tt.setFromMatrixPosition(ot.matrixWorld),at.setFromMatrixPosition(St.matrixWorld);let Wt=tt.distanceTo(at),bt=ot.projectionMatrix.elements,At=St.projectionMatrix.elements,le=bt[14]/(bt[10]-1),lt=bt[14]/(bt[10]+1),ft=(bt[9]+1)/bt[5],vt=(bt[9]-1)/bt[5],_t=(bt[8]-1)/bt[0],Et=(At[8]+1)/At[0],Ft=le*_t,Ut=le*Et,Ht=Wt/(-_t+Et),Xt=Ht*-_t;if(ot.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Xt),et.translateZ(Ht),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),bt[10]===-1)et.projectionMatrix.copy(ot.projectionMatrix),et.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{let D=le+Ht,qt=lt+Ht,Yt=Ft-Xt,C=Ut+(Wt-Xt),x=ft*lt/qt*D,Y=vt*lt/qt*D;et.projectionMatrix.makePerspective(Yt,C,x,Y,D,qt),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function ut(et,ot){ot===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices(ot.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(s===null)return;let ot=et.near,St=et.far;m.texture!==null&&(m.depthNear>0&&(ot=m.depthNear),m.depthFar>0&&(St=m.depthFar)),J.near=O.near=L.near=ot,J.far=O.far=L.far=St,(z!==J.near||W!==J.far)&&(s.updateRenderState({depthNear:J.near,depthFar:J.far}),z=J.near,W=J.far),J.layers.mask=et.layers.mask|6,L.layers.mask=J.layers.mask&-5,O.layers.mask=J.layers.mask&-3;let Wt=et.parent,bt=J.cameras;ut(J,Wt);for(let At=0;At<bt.length;At++)ut(bt[At],Wt);bt.length===2?q(J,L,O):J.projectionMatrix.copy(L.projectionMatrix),A===null&&et.isPerspectiveCamera&&(A={camera:et,fov:et.fov,zoom:et.zoom}),yt(et,J,Wt)};function yt(et,ot,St){St===null?et.matrix.copy(ot.matrixWorld):(et.matrix.copy(St.matrixWorld),et.matrix.invert(),et.matrix.multiply(ot.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy(ot.projectionMatrix),et.projectionMatrixInverse.copy(ot.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=Zi*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(et){l=et,u!==null&&(u.fixedFoveation=et),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=et)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(J)},this.getCameraTexture=function(et){return p[et]};let Kt=null;function $t(et,ot){if(h=ot.getViewerPose(c||a),g=ot,h!==null){let St=h.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let Wt=!1;St.length!==J.cameras.length&&(J.cameras.length=0,Wt=!0);for(let lt=0;lt<St.length;lt++){let ft=St[lt],vt=null;if(f!==null)vt=f.getViewport(ft);else{let Et=d.getViewSubImage(u,ft);vt=Et.viewport,lt===0&&(t.setRenderTargetTextures(S,Et.colorTexture,Et.depthStencilTexture),t.setRenderTarget(S))}let _t=V[lt];_t===void 0&&(_t=new We,_t.layers.enable(lt),_t.viewport=new be,V[lt]=_t),_t.matrix.fromArray(ft.transform.matrix),_t.matrix.decompose(_t.position,_t.quaternion,_t.scale),_t.projectionMatrix.fromArray(ft.projectionMatrix),_t.projectionMatrixInverse.copy(_t.projectionMatrix).invert(),_t.viewport.set(vt.x,vt.y,vt.width,vt.height),lt===0&&(J.matrix.copy(_t.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),Wt===!0&&J.cameras.push(_t)}let bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let lt=d.getDepthInformation(St[0]);lt&&lt.isValid&&lt.texture&&m.init(lt,s.renderState)}if(bt&&bt.includes("camera-access")&&_){t.state.unbindTexture(),d=n.getBinding();for(let lt=0;lt<St.length;lt++){let ft=St[lt].camera;if(ft){let vt=p[ft];vt||(vt=new Wr,p[ft]=vt);let _t=d.getCameraImage(ft);vt.sourceTexture=_t}}}}for(let St=0;St<T.length;St++){let Wt=M[St],bt=T[St];Wt!==null&&bt!==void 0&&bt.update(Wt,ot,c||a)}Kt&&Kt(et,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}let Vt=new nf;Vt.setAnimationLoop($t),this.setAnimationLoop=function(et){Kt=et},this.dispose=function(){}}},Qx=new ue,cf=new jt;cf.set(-1,0,0,0,1,0,0,0,1);function tv(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,mh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,E,R,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,E,R):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===ke&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===ke&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let E=t.get(p),R=E.envMap,S=E.envMapRotation;R&&(m.envMap.value=R,m.envMapRotation.value.setFromMatrix4(Qx.makeRotationFromEuler(S)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(cf),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,E,R){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=R*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ke&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let E=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ev(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,T){let M=T.program;n.uniformBlockBinding(S,M)}function c(S,T){let M=s[S.id];M===void 0&&(m(S),M=h(S),s[S.id]=M,S.addEventListener("dispose",E));let w=T.program;n.updateUBOMapping(S,w);let v=t.render.frame;r[S.id]!==v&&(u(S),r[S.id]=v)}function h(S){let T=d();S.__bindingPointIndex=T;let M=i.createBuffer(),w=S.__size,v=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,w,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,M),M}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Zt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){let T=s[S.id],M=S.uniforms,w=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let v=0,A=M.length;v<A;v++){let L=M[v];if(Array.isArray(L))for(let O=0,V=L.length;O<V;O++)f(L[O],v,O,w);else f(L,v,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,T,M,w){if(_(S,T,M,w)===!0){let v=S.__offset,A=S.value;if(Array.isArray(A)){let L=0;for(let O=0;O<A.length;O++){let V=A[O],J=p(V);g(V,S.__data,L),typeof V!="number"&&typeof V!="boolean"&&!V.isMatrix3&&!ArrayBuffer.isView(V)&&(L+=J.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,S.__data)}}function g(S,T,M){typeof S=="number"||typeof S=="boolean"?T[0]=S:S.isMatrix3?(T[0]=S.elements[0],T[1]=S.elements[1],T[2]=S.elements[2],T[3]=0,T[4]=S.elements[3],T[5]=S.elements[4],T[6]=S.elements[5],T[7]=0,T[8]=S.elements[6],T[9]=S.elements[7],T[10]=S.elements[8],T[11]=0):ArrayBuffer.isView(S)?T.set(new S.constructor(S.buffer,S.byteOffset,T.length)):S.toArray(T,M)}function _(S,T,M,w){let v=S.value,A=T+"_"+M;if(w[A]===void 0)return typeof v=="number"||typeof v=="boolean"?w[A]=v:ArrayBuffer.isView(v)?w[A]=v.slice():w[A]=v.clone(),!0;{let L=w[A];if(typeof v=="number"||typeof v=="boolean"){if(L!==v)return w[A]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(L.equals(v)===!1)return L.copy(v),!0}}return!1}function m(S){let T=S.uniforms,M=0,w=16;for(let A=0,L=T.length;A<L;A++){let O=Array.isArray(T[A])?T[A]:[T[A]];for(let V=0,J=O.length;V<J;V++){let z=O[V],W=Array.isArray(z.value)?z.value:[z.value];for(let nt=0,j=W.length;nt<j;nt++){let ht=W[nt],tt=p(ht),at=M%w,q=at%tt.boundary,ut=at+q;M+=q,ut!==0&&w-ut<tt.storage&&(M+=w-ut),z.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=M,M+=tt.storage}}}let v=M%w;return v>0&&(M+=w-v),S.__size=M,S.__cache={},this}function p(S){let T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?Jt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Jt("WebGLRenderer: Unsupported uniform value type.",S),T}function E(S){let T=S.target;T.removeEventListener("dispose",E);let M=a.indexOf(T.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function R(){for(let S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:R}}var nv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ai=null;function iv(){return ai===null&&(ai=new Hr(nv,16,16,Bi,Vn),ai.name="DFG_LUT",ai.minFilter=Ze,ai.magFilter=Ze,ai.wrapS=Kn,ai.wrapT=Kn,ai.generateMipmaps=!1,ai.needsUpdate=!0),ai}var Gl=class{constructor(t={}){let{canvas:e=Sd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=gn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let _=f,m=new Set([al,rl,sl]),p=new Set([gn,Gn,js,Qs,el,nl]),E=new Uint32Array(4),R=new Int32Array(4),S=new I,T=null,M=null,w=[],v=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,O=!1,V=null,J=null,z=null,W=null;this._outputColorSpace=_e;let nt=0,j=0,ht=null,tt=-1,at=null,q=new be,ut=new be,yt=null,Kt=new Tt(0),$t=0,Vt=e.width,et=e.height,ot=1,St=null,Wt=null,bt=new be(0,0,Vt,et),At=new be(0,0,Vt,et),le=!1,lt=new Bs,ft=!1,vt=!1,_t=new ue,Et=new I,Ft=new be,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ht=!1;function Xt(){return ht===null?ot:1}let D=n;function qt(b,H){return e.getContext(b,H)}let Yt,C,x,Y,k,y,P,X,B,U,st,N,Z,G,it,ct,Nt,F,Mt,rt,wt,It,pt;try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Me,!1),e.addEventListener("webglcontextrestored",fe,!1),e.addEventListener("webglcontextcreationerror",In,!1),D===null){let H="webgl2";if(D=qt(H,b),D===null)throw qt(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Gt()}catch(b){throw e.removeEventListener("webglcontextlost",Me,!1),e.removeEventListener("webglcontextrestored",fe,!1),e.removeEventListener("webglcontextcreationerror",In,!1),Zt("WebGLRenderer: "+b.message),b}function Gt(){Yt=new h_(D),Yt.init(),wt=new $x(D,Yt),C=new t_(D,Yt,t,wt),x=new Zx(D,Yt),C.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),J=D.createFramebuffer(),z=D.createFramebuffer(),W=D.createFramebuffer(),Y=new f_(D),k=new Nx,y=new Jx(D,Yt,x,k,C,wt,Y),P=new c_(L),X=new mm(D),It=new jg(D,X),B=new u_(D,X,Y,It),U=new m_(D,B,X,It,Y),F=new p_(D,C,y),it=new e_(k),st=new Dx(L,P,Yt,C,It,it),N=new tv(L,k),Z=new Ux,G=new Gx(Yt),Nt=new Kg(L,P,x,U,g,l),ct=new Yx(L,U,C),pt=new ev(D,Y,C,x),Mt=new Qg(D,Yt,Y),rt=new d_(D,Yt,Y),Y.programs=st.programs,L.capabilities=C,L.extensions=Yt,L.properties=k,L.renderLists=Z,L.shadowMap=ct,L.state=x,L.info=Y}_!==gn&&(A=new __(_,e.width,e.height,o,s,r));let zt=new Bh(L,D);this.xr=zt,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let b=Yt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Yt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ot},this.setPixelRatio=function(b){b!==void 0&&(ot=b,this.setSize(Vt,et,!1))},this.getSize=function(b){return b.set(Vt,et)},this.setSize=function(b,H,Q=!0){if(zt.isPresenting){Jt("WebGLRenderer: Can't change size while VR device is presenting.");return}Vt=b,et=H,e.width=Math.floor(b*ot),e.height=Math.floor(H*ot),Q===!0&&(e.style.width=b+"px",e.style.height=H+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,b,H)},this.getDrawingBufferSize=function(b){return b.set(Vt*ot,et*ot).floor()},this.setDrawingBufferSize=function(b,H,Q){Vt=b,et=H,ot=Q,e.width=Math.floor(b*Q),e.height=Math.floor(H*Q),this.setViewport(0,0,b,H)},this.setEffects=function(b){if(_===gn){Zt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let H=0;H<b.length;H++)if(b[H].isOutputPass===!0){Jt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(q)},this.getViewport=function(b){return b.copy(bt)},this.setViewport=function(b,H,Q,$){b.isVector4?bt.set(b.x,b.y,b.z,b.w):bt.set(b,H,Q,$),x.viewport(q.copy(bt).multiplyScalar(ot).round())},this.getScissor=function(b){return b.copy(At)},this.setScissor=function(b,H,Q,$){b.isVector4?At.set(b.x,b.y,b.z,b.w):At.set(b,H,Q,$),x.scissor(ut.copy(At).multiplyScalar(ot).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(b){x.setScissorTest(le=b)},this.setOpaqueSort=function(b){St=b},this.setTransparentSort=function(b){Wt=b},this.getClearColor=function(b){return b.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor(...arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha(...arguments)},this.clear=function(b=!0,H=!0,Q=!0){let $=0;if(b){let K=!1;if(ht!==null){let Pt=ht.texture.format;K=m.has(Pt)}if(K){let Pt=ht.texture.type,Dt=p.has(Pt),Rt=Nt.getClearColor(),Ot=Nt.getClearAlpha(),kt=Rt.r,ee=Rt.g,re=Rt.b;Dt?(E[0]=kt,E[1]=ee,E[2]=re,E[3]=Ot,D.clearBufferuiv(D.COLOR,0,E)):(R[0]=kt,R[1]=ee,R[2]=re,R[3]=Ot,D.clearBufferiv(D.COLOR,0,R))}else $|=D.COLOR_BUFFER_BIT}H&&($|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&($|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&D.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),V=b},this.dispose=function(){e.removeEventListener("webglcontextlost",Me,!1),e.removeEventListener("webglcontextrestored",fe,!1),e.removeEventListener("webglcontextcreationerror",In,!1),Nt.dispose(),Z.dispose(),G.dispose(),k.dispose(),P.dispose(),U.dispose(),It.dispose(),pt.dispose(),st.dispose(),zt.dispose(),zt.removeEventListener("sessionstart",tu),zt.removeEventListener("sessionend",eu),Hi.stop()};function Me(b){b.preventDefault(),Fr("WebGLRenderer: Context Lost."),O=!0}function fe(){Fr("WebGLRenderer: Context Restored."),O=!1;let b=Y.autoReset,H=ct.enabled,Q=ct.autoUpdate,$=ct.needsUpdate,K=ct.type;Gt(),Y.autoReset=b,ct.enabled=H,ct.autoUpdate=Q,ct.needsUpdate=$,ct.type=K}function In(b){Zt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Zn(b){let H=b.target;H.removeEventListener("dispose",Zn),Of(H)}function Of(b){Bf(b),k.remove(b)}function Bf(b){let H=k.get(b).programs;H!==void 0&&(H.forEach(function(Q){st.releaseProgram(Q)}),b.isShaderMaterial&&st.releaseShaderCache(b))}this.renderBufferDirect=function(b,H,Q,$,K,Pt){H===null&&(H=Ut);let Dt=K.isMesh&&K.matrixWorld.determinantAffine()<0,Rt=Hf(b,H,Q,$,K);x.setMaterial($,Dt);let Ot=Q.index,kt=1;if($.wireframe===!0){if(Ot=B.getWireframeAttribute(Q),Ot===void 0)return;kt=2}let ee=Q.drawRange,re=Q.attributes.position,Bt=ee.start*kt,pe=(ee.start+ee.count)*kt;Pt!==null&&(Bt=Math.max(Bt,Pt.start*kt),pe=Math.min(pe,(Pt.start+Pt.count)*kt)),Ot!==null?(Bt=Math.max(Bt,0),pe=Math.min(pe,Ot.count)):re!=null&&(Bt=Math.max(Bt,0),pe=Math.min(pe,re.count));let Oe=pe-Bt;if(Oe<0||Oe===1/0)return;It.setup(K,$,Rt,Q,Ot);let Ee,ve=Mt;if(Ot!==null&&(Ee=X.get(Ot),ve=rt,ve.setIndex(Ee)),K.isMesh)$.wireframe===!0?(x.setLineWidth($.wireframeLinewidth*Xt()),ve.setMode(D.LINES)):ve.setMode(D.TRIANGLES);else if(K.isLine){let Qe=$.linewidth;Qe===void 0&&(Qe=1),x.setLineWidth(Qe*Xt()),K.isLineSegments?ve.setMode(D.LINES):K.isLineLoop?ve.setMode(D.LINE_LOOP):ve.setMode(D.LINE_STRIP)}else K.isPoints?ve.setMode(D.POINTS):K.isSprite&&ve.setMode(D.TRIANGLES);if(K.isBatchedMesh)if(Yt.get("WEBGL_multi_draw"))ve.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let Qe=K._multiDrawStarts,Lt=K._multiDrawCounts,on=K._multiDrawCount,ce=Ot?X.get(Ot).bytesPerElement:1,Sn=k.get($).currentProgram.getUniforms();for(let Jn=0;Jn<on;Jn++)Sn.setValue(D,"_gl_DrawID",Jn),ve.render(Qe[Jn]/ce,Lt[Jn])}else if(K.isInstancedMesh)ve.renderInstances(Bt,Oe,K.count);else if(Q.isInstancedBufferGeometry){let Qe=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Lt=Math.min(Q.instanceCount,Qe);ve.renderInstances(Bt,Oe,Lt)}else ve.render(Bt,Oe)};function Qh(b,H,Q,$){V!==null&&b.isNodeMaterial&&V.setObject($,b),ft===!0&&it.setState(b,Q,!1),b.transparent===!0&&b.side===An&&b.forceSinglePass===!1?(b.side=ke,b.needsUpdate=!0,Oa(b,H,$),b.side=ii,b.needsUpdate=!0,Oa(b,H,$),b.side=An):Oa(b,H,$)}this.compile=function(b,H,Q=null){Q===null&&(Q=b),V!==null&&V.renderStart(b,H,Q),M=G.get(Q),M.init(H),v.push(M),Q.traverseVisible(function(K){K.isLight&&K.layers.test(H.layers)&&(M.pushLight(K),K.castShadow&&M.pushShadow(K))}),b!==Q&&b.traverseVisible(function(K){K.isLight&&K.layers.test(H.layers)&&(M.pushLight(K),K.castShadow&&M.pushShadow(K))}),M.setupLights(),V!==null&&V.updateLights(M.state.lightsArray),vt=this.localClippingEnabled,ft=it.init(this.clippingPlanes,vt),ft===!0&&it.setGlobalState(this.clippingPlanes,H),V!==null&&ct.render(M.state.shadowsArray,Q,H);let $=new Set;return b.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Pt=K.material;if(Pt)if(Array.isArray(Pt))for(let Dt=0;Dt<Pt.length;Dt++){let Rt=Pt[Dt];Qh(Rt,Q,H,K),$.add(Rt)}else Qh(Pt,Q,H,K),$.add(Pt)}),M=v.pop(),V!==null&&V.renderEnd(),$},this.compileAsync=function(b,H,Q=null){let $=this.compile(b,H,Q);return new Promise(K=>{function Pt(){if($.forEach(function(Dt){let Ot=k.get(Dt).currentProgram;(Ot===void 0||Ot.isReady())&&$.delete(Dt)}),$.size===0){K(b);return}setTimeout(Pt,10)}Yt.get("KHR_parallel_shader_compile")!==null?Pt():setTimeout(Pt,10)})};let ac=null;function zf(b){ac&&ac(b)}function tu(){Hi.stop()}function eu(){Hi.start()}let Hi=new nf;Hi.setAnimationLoop(zf),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(b){ac=b,zt.setAnimationLoop(b),b===null?Hi.stop():Hi.start()},zt.addEventListener("sessionstart",tu),zt.addEventListener("sessionend",eu),this.render=function(b,H){if(H!==void 0&&H.isCamera!==!0){Zt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;V!==null&&V.renderStart(b,H);let Q=zt.enabled===!0&&zt.isPresenting===!0,$=A!==null&&(ht===null||Q)&&A.begin(L,ht);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),zt.enabled===!0&&zt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(zt.cameraAutoUpdate===!0&&zt.updateCamera(H),H=zt.getCamera()),b.isScene===!0&&b.onBeforeRender(L,b,H,ht),M=G.get(b,v.length),M.init(H),M.state.textureUnits=y.getTextureUnits(),v.push(M),_t.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),lt.setFromProjectionMatrix(_t,On,H.reversedDepth),vt=this.localClippingEnabled,ft=it.init(this.clippingPlanes,vt),T=Z.get(b,w.length),T.init(),w.push(T),zt.enabled===!0&&zt.isPresenting===!0){let Dt=L.xr.getDepthSensingMesh();Dt!==null&&oc(Dt,H,-1/0,L.sortObjects)}oc(b,H,0,L.sortObjects),T.finish(),V!==null&&V.updateLights(M.state.lightsArray),L.sortObjects===!0&&T.sort(St,Wt),Ht=zt.enabled===!1||zt.isPresenting===!1||zt.hasDepthSensing()===!1,Ht&&Nt.addToRenderList(T,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ft===!0&&it.beginShadows();let K=M.state.shadowsArray;if(ct.render(K,b,H),ft===!0&&it.endShadows(),($&&A.hasRenderPass())===!1){let Dt=T.opaque,Rt=T.transmissive;if(M.setupLights(),H.isArrayCamera){let Ot=H.cameras;if(Rt.length>0)for(let kt=0,ee=Ot.length;kt<ee;kt++){let re=Ot[kt];iu(Dt,Rt,b,re)}Ht&&Nt.render(b);for(let kt=0,ee=Ot.length;kt<ee;kt++){let re=Ot[kt];nu(T,b,re,re.viewport)}}else Rt.length>0&&iu(Dt,Rt,b,H),Ht&&Nt.render(b),nu(T,b,H)}ht!==null&&j===0&&(y.updateMultisampleRenderTarget(ht),y.updateRenderTargetMipmap(ht)),$&&A.end(L),b.isScene===!0&&b.onAfterRender(L,b,H),It.resetDefaultState(),tt=-1,at=null,v.pop(),v.length>0?(M=v[v.length-1],y.setTextureUnits(M.state.textureUnits),ft===!0&&it.setGlobalState(L.clippingPlanes,M.state.camera)):M=null,w.pop(),w.length>0?T=w[w.length-1]:T=null,V!==null&&V.renderEnd()};function oc(b,H,Q,$){if(b.visible===!1)return;if(b.layers.test(H.layers)){if(b.isGroup)Q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(H);else if(b.isLightProbeGrid)M.pushLightProbeGrid(b);else if(b.isLight)M.pushLight(b),b.castShadow&&M.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(lt)){$&&Ft.setFromMatrixPosition(b.matrixWorld).applyMatrix4(_t);let Dt=U.update(b),Rt=b.material;Rt.visible&&T.push(b,Dt,Rt,Q,Ft.z,null,H)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(lt))){let Dt=U.update(b),Rt=b.material;if($&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ft.copy(b.boundingSphere.center)):(Dt.boundingSphere===null&&Dt.computeBoundingSphere(),Ft.copy(Dt.boundingSphere.center)),Ft.applyMatrix4(b.matrixWorld).applyMatrix4(_t)),Array.isArray(Rt)){let Ot=Dt.groups;for(let kt=0,ee=Ot.length;kt<ee;kt++){let re=Ot[kt],Bt=Rt[re.materialIndex];Bt&&Bt.visible&&T.push(b,Dt,Bt,Q,Ft.z,re,H)}}else Rt.visible&&T.push(b,Dt,Rt,Q,Ft.z,null,H)}}let Pt=b.children;for(let Dt=0,Rt=Pt.length;Dt<Rt;Dt++)oc(Pt[Dt],H,Q,$)}function nu(b,H,Q,$){let{opaque:K,transmissive:Pt,transparent:Dt}=b;M.setupLightsView(Q),ft===!0&&it.setGlobalState(L.clippingPlanes,Q),$&&x.viewport(q.copy($)),K.length>0&&Ua(K,H,Q),Pt.length>0&&Ua(Pt,H,Q),Dt.length>0&&Ua(Dt,H,Q),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function iu(b,H,Q,$){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[$.id]===void 0){let Bt=Yt.has("EXT_color_buffer_half_float")||Yt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[$.id]=new pn(1,1,{generateMipmaps:!0,type:Bt?Vn:gn,minFilter:ri,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ae.workingColorSpace})}let Pt=M.state.transmissionRenderTarget[$.id],Dt=$.viewport||q;Pt.setSize(Dt.z*L.transmissionResolutionScale,Dt.w*L.transmissionResolutionScale);let Rt=L.getRenderTarget(),Ot=L.getActiveCubeFace(),kt=L.getActiveMipmapLevel();L.setRenderTarget(Pt),L.getClearColor(Kt),$t=L.getClearAlpha(),$t<1&&L.setClearColor(16777215,.5),L.clear(),Ht&&Nt.render(Q);let ee=L.toneMapping;L.toneMapping=Hn;let re=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),M.setupLightsView($),ft===!0&&it.setGlobalState(L.clippingPlanes,$),Ua(b,Q,$),y.updateMultisampleRenderTarget(Pt),y.updateRenderTargetMipmap(Pt),Yt.has("WEBGL_multisampled_render_to_texture")===!1){let Bt=!1;for(let pe=0,Oe=H.length;pe<Oe;pe++){let Ee=H[pe],{object:ve,geometry:Qe,material:Lt,group:on}=Ee;if(Lt.side===An&&ve.layers.test($.layers)){let ce=Lt.side;Lt.side=ke,Lt.needsUpdate=!0,su(ve,Q,$,Qe,Lt,on),Lt.side=ce,Lt.needsUpdate=!0,Bt=!0}}Bt===!0&&(y.updateMultisampleRenderTarget(Pt),y.updateRenderTargetMipmap(Pt))}L.setRenderTarget(Rt,Ot,kt),L.setClearColor(Kt,$t),re!==void 0&&($.viewport=re),L.toneMapping=ee}function Ua(b,H,Q){let $=H.isScene===!0?H.overrideMaterial:null;for(let K=0,Pt=b.length;K<Pt;K++){let Dt=b[K],{object:Rt,geometry:Ot,group:kt}=Dt,ee=Dt.material;ee.allowOverride===!0&&$!==null&&(ee=$),Rt.layers.test(Q.layers)&&su(Rt,H,Q,Ot,ee,kt)}}function su(b,H,Q,$,K,Pt){V!==null&&K.isNodeMaterial&&V.setObject(b,K),b.onBeforeRender(L,H,Q,$,K,Pt),b.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),K.onBeforeRender(L,H,Q,$,b,Pt),K.transparent===!0&&K.side===An&&K.forceSinglePass===!1?(K.side=ke,K.needsUpdate=!0,L.renderBufferDirect(Q,H,$,K,b,Pt),K.side=ii,K.needsUpdate=!0,L.renderBufferDirect(Q,H,$,K,b,Pt),K.side=An):L.renderBufferDirect(Q,H,$,K,b,Pt),b.onAfterRender(L,H,Q,$,K,Pt)}function Oa(b,H,Q){H.isScene!==!0&&(H=Ut);let $=k.get(b),K=M.state.lights,Pt=M.state.shadowsArray,Dt=K.state.version,Rt=st.getParameters(b,K.state,Pt,H,Q,M.state.lightProbeGridArray),Ot=st.getProgramCacheKey(Rt),kt=$.programs;$.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?H.environment:null,$.fog=H.fog;let ee=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;$.envMap=P.get(b.envMap||$.environment,ee),$.envMapRotation=$.environment!==null&&b.envMap===null?H.environmentRotation:b.envMapRotation,kt===void 0&&(b.addEventListener("dispose",Zn),kt=new Map,$.programs=kt);let re=kt.get(Ot);if(re!==void 0){if($.currentProgram===re&&$.lightsStateVersion===Dt)return au(b,Rt),re}else Rt.uniforms=st.getUniforms(b),V!==null&&b.isNodeMaterial&&V.build(b,Q,Rt),b.onBeforeCompile(Rt,L),re=st.acquireProgram(Rt,Ot),kt.set(Ot,re),$.uniforms=Rt.uniforms;let Bt=$.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Bt.clippingPlanes=it.uniform),au(b,Rt),$.needsLights=Vf(b),$.lightsStateVersion=Dt,$.needsLights&&(Bt.ambientLightColor.value=K.state.ambient,Bt.lightProbe.value=K.state.probe,Bt.sunLights.value=K.state.sun,Bt.sunLightShadows.value=K.state.sunShadow,Bt.directionalLights.value=K.state.directional,Bt.directionalLightShadows.value=K.state.directionalShadow,Bt.spotLights.value=K.state.spot,Bt.spotLightShadows.value=K.state.spotShadow,Bt.rectAreaLights.value=K.state.rectArea,Bt.ltc_1.value=K.state.rectAreaLTC1,Bt.ltc_2.value=K.state.rectAreaLTC2,Bt.pointLights.value=K.state.point,Bt.pointLightShadows.value=K.state.pointShadow,Bt.hemisphereLights.value=K.state.hemi,Bt.sunShadowMatrix.value=K.state.sunShadowMatrix,Bt.sunShadowCascade.value=K.state.sunShadowCascade,Bt.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Bt.spotLightMatrix.value=K.state.spotLightMatrix,Bt.spotLightMap.value=K.state.spotLightMap,Bt.pointShadowMatrix.value=K.state.pointShadowMatrix),$.lightProbeGrid=M.state.lightProbeGridArray.length>0,$.currentProgram=re,$.uniformsList=null,re}function ru(b){if(b.uniformsList===null){let H=b.currentProgram.getUniforms();b.uniformsList=nr.seqWithValue(H.seq,b.uniforms)}return b.uniformsList}function au(b,H){let Q=k.get(b);Q.outputColorSpace=H.outputColorSpace,Q.batching=H.batching,Q.batchingColor=H.batchingColor,Q.instancing=H.instancing,Q.instancingColor=H.instancingColor,Q.instancingMorph=H.instancingMorph,Q.skinning=H.skinning,Q.morphTargets=H.morphTargets,Q.morphNormals=H.morphNormals,Q.morphColors=H.morphColors,Q.morphTargetsCount=H.morphTargetsCount,Q.numClippingPlanes=H.numClippingPlanes,Q.numIntersection=H.numClipIntersection,Q.vertexAlphas=H.vertexAlphas,Q.vertexTangents=H.vertexTangents,Q.toneMapping=H.toneMapping}function kf(b,H){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;S.setFromMatrixPosition(H.matrixWorld);for(let Q=0,$=b.length;Q<$;Q++){let K=b[Q];if(K.texture!==null&&K.boundingBox.containsPoint(S))return K}return null}function Hf(b,H,Q,$,K){H.isScene!==!0&&(H=Ut),y.resetTextureUnits();let Pt=H.fog,Dt=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?H.environment:null,Rt=ht===null?L.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:ae.workingColorSpace,Ot=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,kt=P.get($.envMap||Dt,Ot),ee=$.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,re=!!Q.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Bt=!!Q.morphAttributes.position,pe=!!Q.morphAttributes.normal,Oe=!!Q.morphAttributes.color,Ee=Hn;$.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(Ee=L.toneMapping);let ve=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Qe=ve!==void 0?ve.length:0,Lt=k.get($),on=M.state.lights;if(ft===!0&&(vt===!0||b!==at)){let Se=b===at&&$.id===tt;it.setState($,b,Se)}let ce=!1;$.version===Lt.__version?(Lt.needsLights&&Lt.lightsStateVersion!==on.state.version||Lt.outputColorSpace!==Rt||K.isBatchedMesh&&Lt.batching===!1||!K.isBatchedMesh&&Lt.batching===!0||K.isBatchedMesh&&Lt.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&Lt.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&Lt.instancing===!1||!K.isInstancedMesh&&Lt.instancing===!0||K.isSkinnedMesh&&Lt.skinning===!1||!K.isSkinnedMesh&&Lt.skinning===!0||K.isInstancedMesh&&Lt.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Lt.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Lt.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Lt.instancingMorph===!1&&K.morphTexture!==null||Lt.envMap!==kt||$.fog===!0&&Lt.fog!==Pt||Lt.numClippingPlanes!==void 0&&(Lt.numClippingPlanes!==it.numPlanes||Lt.numIntersection!==it.numIntersection)||Lt.vertexAlphas!==ee||Lt.vertexTangents!==re||Lt.morphTargets!==Bt||Lt.morphNormals!==pe||Lt.morphColors!==Oe||Lt.toneMapping!==Ee||Lt.morphTargetsCount!==Qe||!!Lt.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(ce=!0):(ce=!0,Lt.__version=$.version);let Sn=Lt.currentProgram;ce===!0&&(Sn=Oa($,H,K),V&&$.isNodeMaterial&&V.onUpdateProgram($,Sn,Lt));let Jn=!1,bi=!1,cs=!1,xe=Sn.getUniforms(),De=Lt.uniforms;if(x.useProgram(Sn.program)&&(Jn=!0,bi=!0,cs=!0),$.id!==tt&&(tt=$.id,bi=!0),Lt.needsLights){let Se=kf(M.state.lightProbeGridArray,K);Lt.lightProbeGrid!==Se&&(Lt.lightProbeGrid=Se,bi=!0)}if(Jn||at!==b){x.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),xe.setValue(D,"projectionMatrix",b.projectionMatrix),xe.setValue(D,"viewMatrix",b.matrixWorldInverse);let Ti=xe.map.cameraPosition;Ti!==void 0&&Ti.setValue(D,Et.setFromMatrixPosition(b.matrixWorld)),C.logarithmicDepthBuffer&&xe.setValue(D,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&xe.setValue(D,"isOrthographic",b.isOrthographicCamera===!0),at!==b&&(at=b,bi=!0,cs=!0)}if(Lt.needsLights&&(on.state.sunShadowMap.length>0&&xe.setValue(D,"sunShadowMap",on.state.sunShadowMap,y),on.state.directionalShadowMap.length>0&&xe.setValue(D,"directionalShadowMap",on.state.directionalShadowMap,y),on.state.spotShadowMap.length>0&&xe.setValue(D,"spotShadowMap",on.state.spotShadowMap,y),on.state.pointShadowMap.length>0&&xe.setValue(D,"pointShadowMap",on.state.pointShadowMap,y)),K.isSkinnedMesh){xe.setOptional(D,K,"bindMatrix"),xe.setOptional(D,K,"bindMatrixInverse");let Se=K.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),xe.setValue(D,"boneTexture",Se.boneTexture,y))}K.isBatchedMesh&&(xe.setOptional(D,K,"batchingTexture"),xe.setValue(D,"batchingTexture",K._matricesTexture,y),xe.setOptional(D,K,"batchingIdTexture"),xe.setValue(D,"batchingIdTexture",K._indirectTexture,y),xe.setOptional(D,K,"batchingColorTexture"),K._colorsTexture!==null&&xe.setValue(D,"batchingColorTexture",K._colorsTexture,y));let Ei=Q.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&F.update(K,Q,Sn),(bi||Lt.receiveShadow!==K.receiveShadow)&&(Lt.receiveShadow=K.receiveShadow,xe.setValue(D,"receiveShadow",K.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&H.environment!==null&&(De.envMapIntensity.value=H.environmentIntensity),De.dfgLUT!==void 0&&(De.dfgLUT.value=iv()),bi){if(xe.setValue(D,"toneMappingExposure",L.toneMappingExposure),Lt.needsLights&&Gf(De,cs),Pt&&$.fog===!0&&N.refreshFogUniforms(De,Pt),N.refreshMaterialUniforms(De,$,ot,et,M.state.transmissionRenderTarget[b.id]),Lt.needsLights&&Lt.lightProbeGrid){let Se=Lt.lightProbeGrid;De.probesSH.value=Se.texture,De.probesMin.value.copy(Se.boundingBox.min),De.probesMax.value.copy(Se.boundingBox.max),De.probesResolution.value.copy(Se.resolution)}nr.upload(D,ru(Lt),De,y)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(nr.upload(D,ru(Lt),De,y),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&xe.setValue(D,"center",K.center),xe.setValue(D,"modelViewMatrix",K.modelViewMatrix),xe.setValue(D,"normalMatrix",K.normalMatrix),xe.setValue(D,"modelMatrix",K.matrixWorld),$.uniformsGroups!==void 0){let Se=$.uniformsGroups;for(let Ti=0,hs=Se.length;Ti<hs;Ti++){let lu=Se[Ti];pt.update(lu,Sn),pt.bind(lu,Sn)}}return Sn}function Gf(b,H){b.ambientLightColor.needsUpdate=H,b.lightProbe.needsUpdate=H,b.sunLights.needsUpdate=H,b.sunLightShadows.needsUpdate=H,b.directionalLights.needsUpdate=H,b.directionalLightShadows.needsUpdate=H,b.pointLights.needsUpdate=H,b.pointLightShadows.needsUpdate=H,b.spotLights.needsUpdate=H,b.spotLightShadows.needsUpdate=H,b.rectAreaLights.needsUpdate=H,b.hemisphereLights.needsUpdate=H}function Vf(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return nt},this.getActiveMipmapLevel=function(){return j},this.getRenderTarget=function(){return ht},this.setRenderTargetTextures=function(b,H,Q){let $=k.get(b);$.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),k.get(b.texture).__webglTexture=H,k.get(b.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:Q,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,H){let Q=k.get(b);Q.__webglFramebuffer=H,Q.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(b,H=0,Q=0){ht=b,nt=H,j=Q;let $=null,K=!1,Pt=!1;if(b){let Rt=k.get(b);if(Rt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(D.FRAMEBUFFER,Rt.__webglFramebuffer),q.copy(b.viewport),ut.copy(b.scissor),yt=b.scissorTest,x.viewport(q),x.scissor(ut),x.setScissorTest(yt),tt=-1;return}else if(Rt.__webglFramebuffer===void 0)y.setupRenderTarget(b);else if(Rt.__hasExternalTextures)y.rebindTextures(b,k.get(b.texture).__webglTexture,k.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let ee=b.depthTexture;if(Rt.__boundDepthTexture!==ee){if(ee!==null&&k.has(ee)&&(b.width!==ee.image.width||b.height!==ee.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");y.setupDepthRenderbuffer(b)}}let Ot=b.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(Pt=!0);let kt=k.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(kt[H])?$=kt[H][Q]:$=kt[H],K=!0):b.samples>0&&y.useMultisampledRTT(b)===!1?$=k.get(b).__webglMultisampledFramebuffer:Array.isArray(kt)?$=kt[Q]:$=kt,q.copy(b.viewport),ut.copy(b.scissor),yt=b.scissorTest}else q.copy(bt).multiplyScalar(ot).floor(),ut.copy(At).multiplyScalar(ot).floor(),yt=le;if(Q!==0&&($=J),x.bindFramebuffer(D.FRAMEBUFFER,$)&&x.drawBuffers(b,$),x.viewport(q),x.scissor(ut),x.setScissorTest(yt),K){let Rt=k.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+H,Rt.__webglTexture,Q)}else if(Pt){let Rt=H;for(let Ot=0;Ot<b.textures.length;Ot++){let kt=k.get(b.textures[Ot]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ot,kt.__webglTexture,Q,Rt)}}else if(b!==null&&Q!==0){let Rt=k.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Rt.__webglTexture,Q)}tt=-1};function ou(b){let H=k.get(b);return(H.__readFormat!==b.format||H.__readType!==b.type)&&(H.__readFormat=b.format,H.__readType=b.type,H.__formatReadable=C.textureFormatReadable(b.format),H.__typeReadable=C.textureTypeReadable(b.type)),H}this.readRenderTargetPixels=function(b,H,Q,$,K,Pt,Dt,Rt=0){if(!(b&&b.isWebGLRenderTarget)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=k.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Dt!==void 0&&(Ot=Ot[Dt]),Ot){x.bindFramebuffer(D.FRAMEBUFFER,Ot);try{let kt=b.textures[Rt],ee=kt.format,re=kt.type;b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Rt);let Bt=ou(kt);if(Bt.__formatReadable===!1){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Bt.__typeReadable===!1){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=b.width-$&&Q>=0&&Q<=b.height-K&&D.readPixels(H,Q,$,K,wt.convert(ee),wt.convert(re),Pt)}finally{let kt=ht!==null?k.get(ht).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(b,H,Q,$,K,Pt,Dt,Rt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=k.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Dt!==void 0&&(Ot=Ot[Dt]),Ot)if(H>=0&&H<=b.width-$&&Q>=0&&Q<=b.height-K){x.bindFramebuffer(D.FRAMEBUFFER,Ot);let kt=b.textures[Rt],ee=kt.format,re=kt.type;b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Rt);let Bt=ou(kt);if(Bt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Bt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let pe=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,pe),D.bufferData(D.PIXEL_PACK_BUFFER,Pt.byteLength,D.STREAM_READ),D.readPixels(H,Q,$,K,wt.convert(ee),wt.convert(re),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let Oe=ht!==null?k.get(ht).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,Oe);let Ee=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Ed(D,Ee,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,pe),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Pt),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(pe),D.deleteSync(Ee),Pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,H=null,Q=0){let $=Math.pow(2,-Q),K=Math.floor(b.image.width*$),Pt=Math.floor(b.image.height*$),Dt=H!==null?H.x:0,Rt=H!==null?H.y:0;y.setTexture2D(b,0),D.copyTexSubImage2D(D.TEXTURE_2D,Q,0,0,Dt,Rt,K,Pt),x.unbindTexture()},this.copyTextureToTexture=function(b,H,Q=null,$=null,K=0,Pt=0){let Dt,Rt,Ot,kt,ee,re,Bt,pe,Oe,Ee=b.isCompressedTexture?b.mipmaps[Pt]:b.image;if(Q!==null)Dt=Q.max.x-Q.min.x,Rt=Q.max.y-Q.min.y,Ot=Q.isBox3?Q.max.z-Q.min.z:1,kt=Q.min.x,ee=Q.min.y,re=Q.isBox3?Q.min.z:0;else{let De=Math.pow(2,-K);Dt=Math.floor(Ee.width*De),Rt=Math.floor(Ee.height*De),b.isDataArrayTexture?Ot=Ee.depth:b.isData3DTexture?Ot=Math.floor(Ee.depth*De):Ot=1,kt=0,ee=0,re=0}$!==null?(Bt=$.x,pe=$.y,Oe=$.z):(Bt=0,pe=0,Oe=0);let ve=wt.convert(H.format),Qe=wt.convert(H.type),Lt;H.isData3DTexture?(y.setTexture3D(H,0),Lt=D.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(y.setTexture2DArray(H,0),Lt=D.TEXTURE_2D_ARRAY):(y.setTexture2D(H,0),Lt=D.TEXTURE_2D),x.activeTexture(D.TEXTURE0),x.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,H.flipY),x.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),x.pixelStorei(D.UNPACK_ALIGNMENT,H.unpackAlignment);let on=x.getParameter(D.UNPACK_ROW_LENGTH),ce=x.getParameter(D.UNPACK_IMAGE_HEIGHT),Sn=x.getParameter(D.UNPACK_SKIP_PIXELS),Jn=x.getParameter(D.UNPACK_SKIP_ROWS),bi=x.getParameter(D.UNPACK_SKIP_IMAGES);x.pixelStorei(D.UNPACK_ROW_LENGTH,Ee.width),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ee.height),x.pixelStorei(D.UNPACK_SKIP_PIXELS,kt),x.pixelStorei(D.UNPACK_SKIP_ROWS,ee),x.pixelStorei(D.UNPACK_SKIP_IMAGES,re);let cs=b.isDataArrayTexture||b.isData3DTexture,xe=H.isDataArrayTexture||H.isData3DTexture;if(b.isDepthTexture){let De=k.get(b),Ei=k.get(H),Se=k.get(De.__renderTarget),Ti=k.get(Ei.__renderTarget);x.bindFramebuffer(D.READ_FRAMEBUFFER,Se.__webglFramebuffer),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ti.__webglFramebuffer);for(let hs=0;hs<Ot;hs++)cs&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,k.get(b).__webglTexture,K,re+hs),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,k.get(H).__webglTexture,Pt,Oe+hs)),D.blitFramebuffer(kt,ee,Dt,Rt,Bt,pe,Dt,Rt,D.DEPTH_BUFFER_BIT,D.NEAREST);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(K!==0||b.isRenderTargetTexture||k.has(b)){let De=k.get(b),Ei=k.get(H);x.bindFramebuffer(D.READ_FRAMEBUFFER,z),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,W);for(let Se=0;Se<Ot;Se++)cs?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,De.__webglTexture,K,re+Se):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,De.__webglTexture,K),xe?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ei.__webglTexture,Pt,Oe+Se):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ei.__webglTexture,Pt),K!==0?D.blitFramebuffer(kt,ee,Dt,Rt,Bt,pe,Dt,Rt,D.COLOR_BUFFER_BIT,D.NEAREST):xe?D.copyTexSubImage3D(Lt,Pt,Bt,pe,Oe+Se,kt,ee,Dt,Rt):D.copyTexSubImage2D(Lt,Pt,Bt,pe,kt,ee,Dt,Rt);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else xe?b.isDataTexture||b.isData3DTexture?D.texSubImage3D(Lt,Pt,Bt,pe,Oe,Dt,Rt,Ot,ve,Qe,Ee.data):H.isCompressedArrayTexture?D.compressedTexSubImage3D(Lt,Pt,Bt,pe,Oe,Dt,Rt,Ot,ve,Ee.data):D.texSubImage3D(Lt,Pt,Bt,pe,Oe,Dt,Rt,Ot,ve,Qe,Ee):b.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,Pt,Bt,pe,Dt,Rt,ve,Qe,Ee.data):b.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,Pt,Bt,pe,Ee.width,Ee.height,ve,Ee.data):D.texSubImage2D(D.TEXTURE_2D,Pt,Bt,pe,Dt,Rt,ve,Qe,Ee);x.pixelStorei(D.UNPACK_ROW_LENGTH,on),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ce),x.pixelStorei(D.UNPACK_SKIP_PIXELS,Sn),x.pixelStorei(D.UNPACK_SKIP_ROWS,Jn),x.pixelStorei(D.UNPACK_SKIP_IMAGES,bi),Pt===0&&H.generateMipmaps&&D.generateMipmap(Lt),x.unbindTexture()},this.initRenderTarget=function(b){k.get(b).__webglFramebuffer===void 0&&y.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?y.setTextureCube(b,0):b.isData3DTexture?y.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?y.setTexture2DArray(b,0):y.setTexture2D(b,0),x.unbindTexture()},this.resetState=function(){nt=0,j=0,ht=null,x.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}};var Xl=class extends Ji{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new mn;t.deleteAttribute("uv");let e=new Fe({side:ke}),n=new Fe,s=new la(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ie(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new kn(t,n,6),o=new Pe;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new ie(t,rr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new ie(t,rr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new ie(t,rr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new ie(t,rr(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new ie(t,rr(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let f=new ie(t,rr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function rr(i){return new ia({color:0,emissive:16777215,emissiveIntensity:i})}var he=(i,t,e)=>i<t?t:i>e?e:i,Ae=(i,t,e)=>i+(t-i)*e;var ar=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2;var Re=(i,t,e,n)=>Ae(i,t,1-Math.exp(-e*n)),te=(i=1,t)=>t===void 0?Math.random()*i:i+Math.random()*(t-i),Wn=i=>i[Math.random()*i.length|0],mt=(i,t=document)=>t.querySelector(i),ci=(i,t=document)=>Array.from(t.querySelectorAll(i));function hn(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.innerHTML=e),n}var ye=(i,t)=>setTimeout(t,i);var rn={get(i,t){try{let e=localStorage.getItem("piano."+i);return e===null?t:JSON.parse(e)}catch{return t}},set(i,t){try{localStorage.setItem("piano."+i,JSON.stringify(t))}catch{}}},Ea={},Le={on(i,t){return(Ea[i]||(Ea[i]=[])).push(t),()=>{Ea[i]=Ea[i].filter(e=>e!==t)}},emit(i,...t){(Ea[i]||[]).slice().forEach(e=>e(...t))}},zh=new Set,Mi={add(i){return zh.add(i),()=>zh.delete(i)},run(i,t){zh.forEach(e=>e(i,t))}},hf=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}})(),HS=(()=>{try{return matchMedia("(pointer: coarse)").matches||"ontouchstart"in window}catch{return!1}})();var Ue={top:new Tt("#E7E4F7"),mid:new Tt("#F7EDE6"),floor:new Tt("#F2E7DA"),hemiSky:new Tt("#FFF6EC"),hemiGround:new Tt("#D8C6B4"),hemi:1.15,key:2.4,keyColor:new Tt("#FFF1DF"),env:.95,spot:0,exposure:1,stars:0},Xn={top:new Tt("#02030C"),mid:new Tt("#0F1036"),floor:new Tt("#0B0B26"),hemiSky:new Tt("#5B63B8"),hemiGround:new Tt("#1A1836"),hemi:.55,key:.55,keyColor:new Tt("#9FB4FF"),env:.5,spot:16,exposure:1.05,stars:1},sv=new Tt("#F1E8DD"),rv=new Tt("#1D1B45"),av=new Tt("#2A2860");function uf(i){let t=new Gl({canvas:i,antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.outputColorSpace=_e,t.toneMapping=ua,t.toneMappingExposure=1,t.shadowMap.enabled=!0,t.shadowMap.type=ts,t.shadowMap.autoUpdate=!1;let e=new Ji,n=new We(34,1,.02,80);n.position.set(3,2,3);let s=new ir(t);e.environment=s.fromScene(new Xl,.04).texture,s.dispose();let r={uTop:{value:Ue.top.clone()},uMid:{value:Ue.mid.clone()},uFloor:{value:Ue.floor.clone()},uTint:{value:new Tt("#ffffff")},uTintAmt:{value:0},uTime:{value:0},uStars:{value:0},uBokeh:{value:Array.from({length:10},(q,ut)=>{let yt=-2.3+ut*.52+Math.sin(ut*7.1)*.2,Kt=.1+ut*.37%1*.42;return new be(Math.cos(yt)*Math.cos(Kt),Math.sin(Kt),Math.sin(yt)*Math.cos(Kt),.05+ut*.61%1*.07)})},uBokehC:{value:["#FF4F5E","#FF9A3C","#FFD43B","#3DD68C","#1FC8DB","#4D7CFE","#A55EEA","#FF8FAB","#5EEAD4","#FFC94A"].map(q=>new Tt(q))}},a=new ie(new ea(40,48,24),new Ne({side:ke,depthWrite:!1,fog:!1,uniforms:r,vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform vec3 uTop, uMid, uFloor, uTint; uniform float uTintAmt, uTime, uStars; varying vec3 vDir;
      uniform vec4 uBokeh[10]; uniform vec3 uBokehC[10];
      float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
      void main(){
        float y = vDir.y;
        vec3 c = mix(uMid, uTop, smoothstep(0.02, 0.75, y));
        c = mix(c, uFloor, smoothstep(0.03, -0.12, y));
        // a soft glow low on the horizon in the colour of the music
        float glow = exp(-pow(y - 0.12, 2.0) * 18.0);
        c += uTint * uTintAmt * glow;
        // big soft circles of colour, like out-of-focus stage lights
        for (int i = 0; i < 10; i++) {
          vec3 bd = normalize(uBokeh[i].xyz + vec3(sin(uTime * 0.05 + float(i)) * 0.04, sin(uTime * 0.07 + float(i) * 2.0) * 0.03, 0.0));
          float d = acos(clamp(dot(normalize(vDir), bd), -1.0, 1.0));
          float r = uBokeh[i].w;
          float disc = smoothstep(r, r * 0.82, d);
          c = mix(c, c + uBokehC[i] * mix(0.12, 0.22, uStars), disc * smoothstep(-0.02, 0.1, y) * mix(0.8, 1.0, uStars));
        }
        // stars at night
        if (uStars > 0.01 && y > 0.05) {
          vec3 p = floor(vDir * 220.0);
          float s = h(p);
          float tw = 0.6 + 0.4 * sin(uTime * (1.0 + 3.0 * h(p + 3.1)) + s * 40.0);
          float star = step(0.994, s) * tw * smoothstep(0.04, 0.3, y) * (0.5 + 0.5 * h(p + 7.7));
          c += mix(vec3(0.8, 0.85, 1.0), vec3(1.0, 0.9, 0.7), h(p + 1.3)) * star * uStars * 1.7;
        }
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`}));a.renderOrder=-10,e.add(a),e.fog=new Or(Ue.mid.clone(),7,24);let o=new Fe({color:Ue.floor.clone(),roughness:.95,metalness:0,envMapIntensity:.3}),l=new ie(new Xr(30,64),o);l.rotation.x=-Math.PI/2,l.receiveShadow=!0,l.position.y=-.045,e.add(l);let c=(()=>{let q=document.createElement("canvas");q.width=q.height=1024;let ut=q.getContext("2d"),yt=512,Kt=ut.createRadialGradient(yt,yt,0,yt,yt,yt);Kt.addColorStop(0,"#FFFFFF"),Kt.addColorStop(.8,"#F7F1EA"),Kt.addColorStop(1,"#EFE6DB"),ut.fillStyle=Kt,ut.fillRect(0,0,1024,1024),["#A55EEA","#4D7CFE","#1FC8DB","#3DD68C","#FFD43B","#FF9A3C","#FF4F5E"].forEach((et,ot)=>{ut.strokeStyle=et,ut.lineWidth=9,ut.beginPath(),ut.arc(yt,yt,452+ot*9,0,Math.PI*2),ut.stroke()}),ut.strokeStyle="rgba(255,255,255,.9)",ut.lineWidth=6,ut.beginPath(),ut.arc(yt,yt,486,0,Math.PI*2),ut.stroke();let Vt=new ze(q);return Vt.colorSpace=_e,Vt.anisotropy=8,Vt})(),h=(()=>{let q=document.createElement("canvas");q.width=q.height=1024;let ut=q.getContext("2d"),yt=["#A55EEA","#4D7CFE","#1FC8DB","#3DD68C","#FFD43B","#FF9A3C","#FF4F5E"];ut.fillStyle="#000",ut.fillRect(0,0,1024,1024),yt.forEach(($t,Vt)=>{ut.strokeStyle=$t,ut.lineWidth=9,ut.beginPath(),ut.arc(512,512,452+Vt*9,0,Math.PI*2),ut.stroke()});let Kt=new ze(q);return Kt.colorSpace=_e,Kt})(),d=new Fe({map:c,emissive:16777215,emissiveMap:h,emissiveIntensity:0,roughness:.55,envMapIntensity:.5}),u=new Fe({color:"#F1E8DD",roughness:.5}),f=new ie(new wn(1.95,1.99,.045,128,1),[u,d,u]);f.position.set(.02,-.0225,-.66),f.receiveShadow=!0,e.add(f);let g=(()=>{let q=document.createElement("canvas");q.width=q.height=256;let ut=q.getContext("2d"),yt=ut.createRadialGradient(128,128,10,128,128,128);return yt.addColorStop(0,"rgba(0,0,0,0.42)"),yt.addColorStop(.55,"rgba(0,0,0,0.16)"),yt.addColorStop(1,"rgba(0,0,0,0)"),ut.fillStyle=yt,ut.fillRect(0,0,256,256),new ze(q)})(),_=new ie(new nn(2.3,2.5),new zn({map:g,transparent:!0,depthWrite:!1,opacity:.8}));_.rotation.x=-Math.PI/2,_.position.set(-.02,.001,-.72),e.add(_);let m=(()=>{let q=document.createElement("canvas");q.width=q.height=256;let ut=q.getContext("2d"),yt=ut.createRadialGradient(128,128,0,128,128,128);return yt.addColorStop(0,"rgba(255,214,150,0.55)"),yt.addColorStop(.5,"rgba(255,190,120,0.18)"),yt.addColorStop(1,"rgba(255,180,110,0)"),ut.fillStyle=yt,ut.fillRect(0,0,256,256),new ze(q)})(),p=new ie(new nn(5.2,5.2),new zn({map:m,transparent:!0,depthWrite:!1,blending:es,opacity:0,fog:!1}));p.rotation.x=-Math.PI/2,p.position.set(.1,.003,-.5),p.renderOrder=-1,e.add(p);let E=new ra(Ue.hemiSky,Ue.hemiGround,Ue.hemi);e.add(E);let R=new qs(Ue.keyColor,Ue.key);R.position.set(2.2,4.8,2.6),R.target.position.set(0,.6,-.7),R.castShadow=!0,R.shadow.mapSize.set(2048,2048);let S=R.shadow.camera;S.left=-1.9,S.right=1.9,S.top=1.9,S.bottom=-1.9,S.near=1,S.far=10,R.shadow.bias=-4e-4,R.shadow.normalBias=.02,R.shadow.radius=4,e.add(R),e.add(R.target);let T=new qs("#FFE1F0",.5);T.position.set(-3,2.2,1.5),e.add(T);let M=new oa("#FFE7C2",0,9,.52,.65,1.4);M.position.set(.3,5.2,.6),M.target.position.set(0,.7,-.6),e.add(M),e.add(M.target);let w=new Ne({transparent:!0,depthWrite:!1,blending:es,side:ii,fog:!1,uniforms:{uAmt:{value:0},uColor:{value:new Tt("#FFE2B0")}},vertexShader:"varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",fragmentShader:`uniform float uAmt; uniform vec3 uColor; varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){ float rim = pow(1.0 - abs(dot(vN, vV)), 1.2); float a = (1.0 - rim) * pow(vY, 1.6) * uAmt * 0.16; gl_FragColor = vec4(uColor * a, a); }`}),v=new ie(new wn(.08,2.3,5.2,48,1,!0),w);v.position.set(.15,2.6,-.1),v.rotation.z=.06,e.add(v);let A=160,L=new Float32Array(A*3),O=new Float32Array(A);for(let q=0;q<A;q++)L[q*3]=(Math.random()-.5)*5,L[q*3+1]=Math.random()*2.6,L[q*3+2]=(Math.random()-.5)*5-.6,O[q]=Math.random();let V=new Ie;V.setAttribute("position",new Ye(L,3)),V.setAttribute("seed",new Ye(O,1));let J={uTime:{value:0},uNight:{value:0},uScale:{value:300}},z=new Gr(V,new Ne({transparent:!0,depthWrite:!1,blending:es,uniforms:J,vertexShader:`attribute float seed; uniform float uTime, uScale, uNight; varying float vA; varying float vS;
      void main(){ vec3 p = position; float t = uTime * (0.05 + seed * 0.08);
        p.x += sin(t * 3.0 + seed * 20.0) * 0.25; p.y = mod(p.y + t * 0.6, 2.6); p.z += cos(t * 2.0 + seed * 9.0) * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = uScale * (0.006 + 0.01 * seed) * (1.0 + uNight) / -mv.z;
        vA = (0.25 + 0.75 * uNight) * smoothstep(0.0, 0.4, p.y) * (1.0 - smoothstep(2.0, 2.6, p.y)) * (0.5 + 0.5 * sin(uTime * (1.0 + seed * 2.0) + seed * 30.0)); vS = seed; }`,fragmentShader:`uniform float uNight; varying float vA; varying float vS; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); float a = smoothstep(0.5, 0.0, r); a *= a;
      vec3 c = mix(vec3(1.0, 0.92, 0.75), mix(vec3(1.0, 0.85, 0.4), vec3(0.6, 1.0, 0.7), vS), uNight); gl_FragColor = vec4(c * a * vA, a * vA); }`}));z.frustumCulled=!1,e.add(z);let W={night:0,target:0,tint:new Tt,tintAmt:0},nt=new Tt,j=new Tt,ht=new Tt;function tt(){let q=W.night;nt.copy(Ue.top).lerp(Xn.top,q),j.copy(Ue.mid).lerp(Xn.mid,q),ht.copy(Ue.floor).lerp(Xn.floor,q),r.uTop.value.copy(nt),r.uMid.value.copy(j),r.uFloor.value.copy(ht),e.fog.color.copy(j),o.color.copy(ht),E.color.copy(Ue.hemiSky).lerp(Xn.hemiSky,q),E.groundColor.copy(Ue.hemiGround).lerp(Xn.hemiGround,q),E.intensity=Ae(Ue.hemi,Xn.hemi,q),R.intensity=Ae(Ue.key,Xn.key,q),R.color.copy(Ue.keyColor).lerp(Xn.keyColor,q),T.intensity=Ae(.5,.15,q),M.intensity=Ae(Ue.spot,Xn.spot,q),e.environmentIntensity=Ae(Ue.env,Xn.env,q),t.toneMappingExposure=Ae(Ue.exposure,Xn.exposure,q),r.uStars.value=q,J.uNight.value=q,w.uniforms.uAmt.value=q,_.material.opacity=Ae(.8,.95,q),p.material.opacity=q*.9,d.emissiveIntensity=q*1.4,u.color.set(sv).lerp(rv,q),d.color.set("#ffffff").lerp(av,q)}tt();let at={renderer:t,scene:e,camera:n,sky:a,floor:l,get night(){return W.night},setNight(q){W.target=q?1:0},tint(q,ut=1){W.tint.lerp(q,.5),W.tintAmt=Math.min(1,W.tintAmt+.22*ut)},resize(){let q=i.clientWidth||window.innerWidth,ut=i.clientHeight||window.innerHeight;t.setSize(q,ut,!1),n.aspect=q/ut,n.updateProjectionMatrix(),J.uScale.value=ut*t.getPixelRatio()*.5},shadowDirty(){t.shadowMap.needsUpdate=!0},update(q,ut){W.night!==W.target&&(W.night=Re(W.night,W.target,2.2,q),Math.abs(W.night-W.target)<.002&&(W.night=W.target),tt()),W.tintAmt=Re(W.tintAmt,0,.9,q),r.uTint.value.copy(W.tint),r.uTintAmt.value=W.tintAmt*Ae(.18,.55,W.night),r.uTime.value=ut,J.uTime.value=ut},render(){t.render(e,n)}};return t.shadowMap.needsUpdate=!0,at}var Ta=new I;function Pn(i,t,e,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Ta.copy(t),Ta[n]=0,Ta.normalize();let c=.5*a/(a+o),h=1-Ta.angleTo(i)/l;return Math.sign(Ta[e])===1?h*c:o/(a+o)+c+c*(1-h)}var un=class i extends mn{constructor(t=1,e=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let l=new I,c=new I,h=new I(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,g=d.length/6,_=new I,m=.5/a;for(let p=0,E=0;p<d.length;p+=3,E+=2)switch(l.fromArray(d,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),d[p+0]=h.x*Math.sign(l.x)+c.x*r,d[p+1]=h.y*Math.sign(l.y)+c.y*r,d[p+2]=h.z*Math.sign(l.z)+c.z*r,u[p+0]=c.x,u[p+1]=c.y,u[p+2]=c.z,Math.floor(p/g)){case 0:_.set(1,0,0),f[E+0]=Pn(_,c,"z","y",r,n),f[E+1]=1-Pn(_,c,"y","z",r,e);break;case 1:_.set(-1,0,0),f[E+0]=1-Pn(_,c,"z","y",r,n),f[E+1]=1-Pn(_,c,"y","z",r,e);break;case 2:_.set(0,1,0),f[E+0]=1-Pn(_,c,"x","z",r,t),f[E+1]=Pn(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),f[E+0]=1-Pn(_,c,"x","z",r,t),f[E+1]=1-Pn(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),f[E+0]=1-Pn(_,c,"x","y",r,t),f[E+1]=1-Pn(_,c,"y","x",r,e);break;case 5:_.set(0,0,-1),f[E+0]=Pn(_,c,"x","y",r,t),f[E+1]=1-Pn(_,c,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};var Je=21,qn=108,Zl=60,$e=i=>[1,3,6,8,10].includes((i%12+12)%12);var or=["do","re","mi","fa","sol","la","si"];var ql={0:0,2:1,4:2,5:3,7:4,9:5,11:6},Mn=i=>ql[(i%12+12)%12];var dn=["#FF4F5E","#FF9A3C","#FFD43B","#3DD68C","#1FC8DB","#4D7CFE","#A55EEA"];var kh=new Map;function Ke(i){if(kh.has(i))return kh.get(i);let t=(i%12+12)%12,e;if(!$e(i))e=new Tt(dn[ql[t]]);else{let n=new Tt(dn[ql[t-1]]),s=new Tt(dn[ql[(t+1)%12]]);e=n.lerp(s,.5)}return kh.set(i,e),e}var lr=i=>"#"+Ke(i).getHexString(),xt={W:.0235,GAP:.0011,WL:.15,WH:.022,BW:.0128,BL:.094,BH:.0125,TOP:.72,N_WHITE:52};xt.HALF=xt.N_WHITE*xt.W/2;var Yl=new Map;{let i=0;for(let t=Je;t<=qn;t++)$e(t)||Yl.set(t,i++)}var os=i=>Yl.get(i),ov={1:-.13,3:.13,6:-.16,8:0,10:.16};function je(i){return $e(i)?(Yl.get(i-1)+1)*xt.W-xt.HALF+ov[i%12]*xt.W:(Yl.get(i)+.5)*xt.W-xt.HALF}var Jl=[{from:21,to:23,e:"\u{1F40B}",zh:"\u9CB8\u9C7C"},{from:24,to:35,e:"\u{1F418}",zh:"\u5927\u8C61"},{from:36,to:47,e:"\u{1F43B}",zh:"\u5C0F\u718A"},{from:48,to:59,e:"\u{1F436}",zh:"\u5C0F\u72D7"},{from:60,to:71,e:"\u{1F431}",zh:"\u5C0F\u732B"},{from:72,to:83,e:"\u{1F430}",zh:"\u5C0F\u5154"},{from:84,to:95,e:"\u{1F426}",zh:"\u5C0F\u9E1F"},{from:96,to:108,e:"\u{1F41D}",zh:"\u5C0F\u871C\u8702"}];var cr=i=>440*Math.pow(2,(i-69)/12);var an=.735,Kl=.165,Hh=.6,ki=.975,lv=.034,df=.64,wa=.45;function cv(){let i=[[an,.4],[an,.5],[an-.008,.61],[an-.035,.71],[.645,.8],[.555,.89],[.45,.985],[.335,1.09],[.215,1.2],[.095,1.31],[-.03,1.41],[-.17,1.49],[-.32,1.545],[-.47,1.565],[-.59,1.545],[-.675,1.49],[-.722,1.41],[-an,1.3],[-an,1.2]].map(([n,s])=>new I(n,0,s)),t=new ks(i,!1,"centripetal"),e=[[an,Kl],[an,.3]];return t.getSpacedPoints(150).forEach(n=>e.push([n.x,n.z])),e.push([-an,.3],[-an,Kl]),e.map(([n,s])=>new gt(n,s))}function ff(i,t){return i.map((e,n)=>{let s=i[Math.max(0,n-1)],r=i[Math.min(i.length-1,n+1)],a=r.x-s.x,o=r.y-s.y,l=Math.hypot(a,o)||1;return new gt(e.x-o/l*t,e.y+a/l*t)})}var $l=cv(),Aa=(i,t=!0)=>{let e=new Hs;e.moveTo(i[0].x,i[0].y);for(let n=1;n<i.length;n++)e.lineTo(i[n].x,i[n].y);return t&&e.lineTo(i[0].x,i[0].y),e};function Ca(i,t,e,n=0){let s=new Qr(i,{depth:e,curveSegments:4,steps:1,bevelEnabled:n>0,bevelThickness:n,bevelSize:n,bevelSegments:3});return s.rotateX(-Math.PI/2),s.translate(0,t,0),s}function hv(i,t){let e=0;for(let n=0;n<i.length-1;n++){let s=i[n],r=i[n+1];if((s.x-t)*(r.x-t)<=0&&s.x!==r.x){let a=(t-s.x)/(r.x-s.x),o=s.y+(r.y-s.y)*a;o>e&&(e=o)}}return e}function uv(){let i=document.createElement("canvas");i.width=512,i.height=512;let t=i.getContext("2d");t.fillStyle="#E6C58E",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){let s=Math.random()*512,r=.6+Math.random()*2.2;t.strokeStyle=`rgba(${150+Math.random()*40},${100+Math.random()*30},50,${.08+Math.random()*.16})`,t.lineWidth=r,t.beginPath(),t.moveTo(s,0);for(let a=0;a<=512;a+=32)t.lineTo(s+Math.sin(a*.02+n)*2,a);t.stroke()}let e=new ze(i);return e.wrapS=e.wrapT=Is,e.repeat.set(3,3),e.colorSpace=_e,e.anisotropy=4,e}function dv(){let i=document.createElement("canvas");i.width=1024,i.height=256;let t=i.getContext("2d"),e=t.createLinearGradient(0,40,0,200);e.addColorStop(0,"#F8E3A1"),e.addColorStop(.45,"#D9A93F"),e.addColorStop(.55,"#B9862A"),e.addColorStop(1,"#F2D27E"),t.fillStyle=e,t.font='italic 600 112px "Snell Roundhand","Apple Chancery","Georgia",serif',t.textAlign="center",t.textBaseline="middle",t.fillText("Rainbow",512,108),t.font='600 30px "PingFang SC","Hiragino Sans GB",sans-serif',t.fillText("\u5F69  \u8679  \u94A2  \u7434",512,196),dn.forEach((s,r)=>{t.fillStyle=s,t.beginPath(),t.arc(410+r*34,236,7,0,Math.PI*2),t.fill()});let n=new ze(i);return n.colorSpace=_e,n.anisotropy=8,n}function fv(){let i=document.createElement("canvas");i.width=896,i.height=128;let t=new ze(i);return t.colorSpace=_e,t.anisotropy=8,{tex:t,draw:n=>{let s=i.getContext("2d");s.clearRect(0,0,i.width,i.height);for(let r=0;r<7;r++){let a=r*128+64,o=64;if(n==="none"||(s.fillStyle=dn[r],s.beginPath(),s.arc(a,o,n==="color"?30:56,0,Math.PI*2),s.fill(),n==="color"))continue;let l=n==="number"?String(r+1):n==="letter"?"CDEFGAB"[r]:or[r];s.fillStyle=r===2?"#5B4300":"#fff",s.font=`700 ${l.length>2?40:l.length>1?50:66}px "Arial Rounded MT Bold","Avenir Next","Nunito",sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(l,a,o+3)}t.needsUpdate=!0}}}function mf(){let i=new qe;i.name="piano";let t=new ji({color:1381659,roughness:.2,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.1}),e=t.clone(),n=new Fe({color:14201450,metalness:1,roughness:.3,envMapIntensity:1.2}),s=new Fe({color:13214554,metalness:.85,roughness:.42,envMapIntensity:1.1}),r=new Fe({color:15263982,metalness:1,roughness:.22}),a=new Fe({color:12614213,metalness:1,roughness:.3}),o=new Fe({color:1776415,roughness:1}),l=new Fe({color:7214626,roughness:1}),c=new Fe({map:uv(),roughness:.7}),h=new ji({color:16513264,roughness:.3,clearcoat:.5,clearcoatRoughness:.18,envMapIntensity:.8}),d=new ji({color:1052690,roughness:.32,clearcoat:.9,clearcoatRoughness:.12,envMapIntensity:1}),u=(N,Z,G=i,it=!0)=>{let ct=new ie(N,Z);return ct.castShadow=it,ct.receiveShadow=!0,G.add(ct),ct},f=[],g=ff($l,lv),_=$l.concat(g.slice().reverse()),m=u(Ca(Aa(_),Hh,ki-Hh-.008,.004),t);f.push(m),u(Ca(Aa($l),Hh-.01,.05),e);let p=g.slice();p.unshift(new gt(g[0].x,Kl+.01)),p.push(new gt(g[g.length-1].x,Kl+.01)),u(Ca(Aa(p),.7,.008),c,i,!1);let E=ff(g,.035).map(N=>new gt(N.x,Math.max(N.y,.205))),R=Aa(E);[[-.5,.66,.075],[-.3,.95,.1],[-.06,.72,.085],[.18,.62,.07],[-.52,1.18,.07],[.02,1.08,.06]].forEach(([N,Z,G])=>{let it=new $i;it.absarc(N,Z,G,0,Math.PI*2,!0),R.holes.push(it)}),u(Ca(R,.785,.012,.003),s,i,!1);let S=new wn(1,1,1,5,1,!0);S.rotateX(Math.PI/2);let T={steel:new kn(S,r,88),copper:new kn(S,a,88)},M=new wn(.0032,.0032,.018,6),w=new kn(M,r,176),v=[],A=new ue,L=new En,O=new I,V=new I,J=0,z=0;for(let N=Je;N<=qn;N++){let Z=N-Je,G=yi.lerp(-.655,.66,Z/87),it=.3,ct=hv(g,G)-.07,Nt=ct-it,F=N<48?.0017-(N-21)*2e-5:8e-4;A.compose(O.set(G,.832,-(it+Nt/2)),L.identity(),V.set(F,F,Nt)),N<48?T.copper.setMatrixAt(z++,A):T.steel.setMatrixAt(J++,A),v[N]={x:G,y:.832,z0:-it,z1:-ct};for(let Mt=0;Mt<2;Mt++)A.makeTranslation(G+(Mt?.003:-.003),.8,-(.235+Mt*.03+Z%2*.012)),w.setMatrixAt(Z*2+Mt,A)}T.steel.count=J,T.copper.count=z,[T.steel,T.copper,w].forEach(N=>{N.castShadow=!1,i.add(N)});let W=new un(.0115,.026,.034,1,.002),nt=new kn(W,o,68),j=new kn(new mn(.0118,.006,.036),c,68),ht=new Float32Array(89),tt=(N,Z)=>{let G=N-Je;if(N>88)return;let it=v[N];A.makeTranslation(it.x,it.y+.015+Z,-.4),nt.setMatrixAt(G,A),A.makeTranslation(it.x,it.y+.031+Z,-.4),j.setMatrixAt(G,A)};for(let N=Je;N<=88;N++)tt(N,0);i.add(nt),i.add(j);let at=new qe;at.position.set(-an,ki,0),i.add(at);let q=Ca(Aa($l),0,.02,.004);q.translate(an,0,0);let ut=u(q,t,at);f.push(ut);let yt=new I(.56,ki,-.83),Kt=.78,$t=1.24,Vt=u(new wn(.009,.011,1,10),t);Vt.visible=!1;let et=new qe;i.add(et),u(new mn(2*an,.07,.3),e,et,!1).position.set(0,.62+.035-.01,-.15),u(new un(2*xt.HALF+.004,.044,.021,2,.004),t,et).position.set(0,xt.TOP-.014-.022,.0125);for(let N of[-1,1]){let Z=u(new un(.124,.19,.24,3,.022),t,et);Z.position.set(N*(xt.HALF+.062),.62+.095,.024-.12),f.push(Z)}u(new mn(2*xt.HALF,.003,.005),l,et,!1).position.set(0,xt.TOP-5e-4,-xt.WL-.003);let ot=new qe;ot.position.set(0,xt.TOP+xt.BH+.004,-xt.WL-.024),et.add(ot);let St=u(new un(2*xt.HALF+.002,.162,.016,2,.004),t,ot);St.position.set(0,.081,-.008);let Wt=new ie(new nn(.22,.055),new Fe({map:dv(),transparent:!0,metalness:.6,roughness:.35}));Wt.position.set(0,.018,.0086),St.add(Wt),u(new un(2*an-.02,.245,.02,2,.004),t,et,!1).position.set(0,xt.TOP+.0125+.1225,-.216),u(new un(2*an-.01,.02,.05,2,.006),t,i,!1).position.set(0,ki-.02,-.335);let bt=[],At=[],le=new un(xt.W-xt.GAP,xt.WH,xt.WL+.06,2,.0018),lt=(()=>{let N=new un(xt.BW,xt.BH+.006,xt.BL+.03,2,.0022),Z=N.attributes.position;for(let G=0;G<Z.count;G++){let it=Z.getY(G),ct=Z.getZ(G);it>0&&(Z.setX(G,Z.getX(G)*.78),ct>0&&Z.setZ(G,ct-.004))}return N.computeVertexNormals(),N})(),ft=fv(),vt=new zn({map:ft.tex,transparent:!0,depthWrite:!1,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-2}),_t=[];for(let N=0;N<7;N++){let Z=new nn(.0182,.0182);Z.rotateX(-Math.PI/2);let G=Z.attributes.uv;for(let it=0;it<G.count;it++)G.setX(it,(N+G.getX(it))/7);_t.push(Z)}let Et=(()=>{let N=document.createElement("canvas");N.width=N.height=64;let Z=N.getContext("2d");Z.fillStyle="#E8B33C",Z.beginPath();for(let it=0;it<10;it++){let ct=-Math.PI/2+it*Math.PI/5,Nt=it%2?13:30;Z.lineTo(32+Math.cos(ct)*Nt,32+Math.sin(ct)*Nt)}Z.fill();let G=new ze(N);return G.colorSpace=_e,G})();for(let N=Je;N<=qn;N++){let Z=$e(N),G=new qe;G.position.set(je(N),xt.TOP-xt.WH,-wa);let it=(Z?d:h).clone();it.emissive=Ke(N).clone(),it.emissiveIntensity=0;let ct=new ie(Z?lt:le,it);ct.castShadow=!1,ct.receiveShadow=!0,Z?ct.position.set(0,xt.WH+(xt.BH+.006)/2-.004,wa-(xt.WL-xt.BL)-(xt.BL+.03)/2):ct.position.set(0,xt.WH/2,wa-(xt.WL+.06)/2),G.add(ct),et.add(G);let Nt={m:N,black:Z,pivot:G,mesh:ct,mat:it,x:je(N),down:0,target:0,glow:0,glowTarget:0,hint:0,hintColor:Ke(N)};if(!Z){let F=new ie(_t[Mn(N)],vt);if(F.position.set(0,xt.WH+4e-4,wa-.024),F.renderOrder=2,G.add(F),Nt.label=F,N===Zl){let Mt=new ie(new nn(.013,.013).rotateX(-Math.PI/2),new zn({map:Et,transparent:!0,depthWrite:!1,toneMapped:!1}));Mt.position.set(0,xt.WH+4e-4,wa-.046),Mt.renderOrder=2,G.add(Mt)}}bt[N]=Nt,Z||At.push(N)}let Ft=new qe;Ft.position.set(0,ki-.01,-.34),i.add(Ft),u(new un(.7,.29,.014,2,.004),t,Ft).position.set(0,.145,0),u(new un(.72,.016,.045,2,.004),t,Ft).position.set(0,.008,.024);let Ut=document.createElement("canvas");Ut.width=2048,Ut.height=800;let Ht=new ze(Ut);Ht.colorSpace=_e,Ht.anisotropy=8;let Xt=new ie(new nn(.62,.242),new Fe({map:Ht,roughness:.85,envMapIntensity:.4,emissive:16777215,emissiveMap:Ht,emissiveIntensity:.25}));Xt.position.set(0,.152,.0075),Ft.add(Xt);let D=[[0,.055],[.024,.055],[.029,.08],[.033,.16],[.039,.3],[.045,.43],[.05,.49],[.06,.51],[.06,.53],[.052,.54],[.058,.57],[.058,.605],[0,.605]].map(([N,Z])=>new gt(N,Z)),qt=new Vs(D,28),Yt=new Vs([[0,.016],[.026,.016],[.03,.03],[.027,.058],[0,.058]].map(([N,Z])=>new gt(N,Z)),28),C=new wn(.016,.016,.014,18);C.rotateZ(Math.PI/2);for(let[N,Z]of[[-.645,-.075],[.645,-.075],[-.43,-1.33]]){let G=new qe;G.position.set(N,0,Z),i.add(G),u(qt,t,G),u(Yt,n,G),u(C,n,G).position.set(0,.016,0)}let x=new qe;x.position.set(0,0,-.3),i.add(x);for(let N of[-1,1])u(new wn(.014,.017,.47,14),t,x).position.set(N*.075,.37,0);u(new na(.06,.006,8,32,Math.PI),t,x).position.set(0,.18,0),u(new un(.27,.075,.12,2,.012),t,x).position.set(0,.105,0);let Y=[-.066,0,.066].map(N=>{let Z=new qe;return Z.position.set(N,.088,.055),x.add(Z),u(new un(.03,.011,.085,2,.004),n,Z).position.set(0,0,.042),Z}),k={lid:0,lidTarget:0,fall:0,fallTarget:0,sustain:0,colorFrom:new Tt,colorTo:null,colorT:1,bounce:0,labelMode:"solfege",dirtyShadow:!0},y=new I,P=new I;function X(){at.rotation.z=k.lid*df;let N=k.lid*df;if(N<.02){Vt.visible=!1;return}Vt.visible=!0,P.set(-an+$t*Math.cos(N),ki+$t*Math.sin(N)-.006,yt.z),y.copy(P).sub(yt);let Z=Math.min(Kt,y.length());Vt.position.copy(yt).addScaledVector(y.normalize(),Z/2),Vt.scale.set(1,Z,1),Vt.quaternion.setFromUnitVectors(new I(0,1,0),y)}function B(){let N=ar(he((k.lid-.25)/.6,0,1));Ft.rotation.x=yi.lerp(-Math.PI/2+.02,-.2,N),Ft.position.y=yi.lerp(ki-.06,ki-.01,N)}function U(){ot.rotation.x=yi.lerp(Math.PI/2-.02,-.07,ar(k.fall))}X(),U(),B();let st={root:i,keys:bt,occluders:f,desk:Ft,sheet:Xt,sheetCanvas:Ut,sheetTex:Ht,stringInfo:v,lacquer:t,get lidOpen(){return k.lid},get fallOpen(){return k.fall},open(N=!0){k.lidTarget=N?1:0,k.fallTarget=N?1:0},press(N,Z,G){let it=bt[N];it&&(it.target=Z?1:0,Z?(it.glowTarget=1,it.glow=Math.max(it.glow,.85),G?it.mat.emissive.copy(G):it.mat.emissive.copy(Ke(N))):it.glowTarget=0)},hint(N,Z,G){let it=bt[N];it&&(it.hint=Z?1:0,G&&(it.hintColor=G))},clearHints(){bt.forEach(N=>N&&(N.hint=0,N.mark=0))},mark(N,Z){let G=bt[N];G&&(G.mark=Z?1:0,G.hintColor=Ke(N))},setSustain(N){k.sustain=N?1:0},setColor(N,Z){let G=new Tt(N);if(Z){t.color.copy(G),e.color.copy(G).multiplyScalar(.9),k.colorT=1;return}k.colorFrom.copy(t.color),k.colorTo=G,k.colorT=0,k.bounce=1},setLabels(N){k.labelMode=N,ft.draw(N),bt.forEach(Z=>Z&&Z.label&&(Z.label.visible=N!=="none"))},keyTop(N,Z=new I){let G=bt[N];return G?Z.set(G.x,xt.TOP+(G.black?xt.BH:0)+.002,G.black?-xt.WL+.02:-xt.WL+.012):Z.set(0,xt.TOP,0)},keyFront(N,Z=new I){let G=bt[N];return Z.set(G.x,xt.TOP+(G.black?xt.BH:0),G.black?-(xt.WL-xt.BL)-.02:-.03)},keyAt(N){let Z=N.origin,G=N.direction;if(Math.abs(G.y)<1e-4)return null;let it=(xt.TOP+xt.BH-Z.y)/G.y;if(it>0){let F=Z.x+G.x*it,Mt=Z.z+G.z*it;if(Mt<-(xt.WL-xt.BL)+.004&&Mt>-xt.WL-.01)for(let rt=Je;rt<=qn;rt++){let wt=bt[rt];if(wt.black&&Math.abs(F-wt.x)<xt.BW/2+.0016)return rt}}if(it=(xt.TOP-Z.y)/G.y,it<=0)return null;let ct=Z.x+G.x*it,Nt=Z.z+G.z*it;return Nt>.028||Nt<-xt.WL-.006||ct<-xt.HALF||ct>xt.HALF?null:At[he(Math.floor((ct+xt.HALF)/xt.W),0,xt.N_WHITE-1)]},update(N,Z){let G=k.lid;k.lid=pf(k.lid,k.lidTarget,N/1.6),k.fall=pf(k.fall,k.fallTarget,N/.9),k.lid!==G&&(X(),B(),k.dirtyShadow=!0),U();for(let it=Je;it<=qn;it++){let ct=bt[it],Nt=ct.target;ct.down=Nt>ct.down?Math.min(Nt,ct.down+N*55):Re(ct.down,Nt,26,N),ct.pivot.rotation.x=ct.down*(ct.black?.0215:.0205);let F=ct.hint?.35+.35*Math.sin(Z*6.5):ct.mark?.22:0;ct.glow=ct.glowTarget?Re(ct.glow,.65,4,N):Re(ct.glow,0,3.2,N);let Mt=Math.max(ct.glow*(ct.black?1.6:1.05),F);if(ct.glow<.05&&(ct.hint||ct.mark)&&ct.mat.emissive.copy(ct.hintColor),ct.mat.emissiveIntensity=Mt,it<=88){let rt=Math.max(ct.target,k.sustain)*.013,wt=ht[it-Je];Math.abs(wt-rt)>1e-5&&(ht[it-Je]=Re(wt,rt,30,N),tt(it,ht[it-Je]),nt.instanceMatrix.needsUpdate=!0,j.instanceMatrix.needsUpdate=!0)}}if(Y[2].rotation.x=Re(Y[2].rotation.x,k.sustain*.13,16,N),k.colorTo&&k.colorT<1&&(k.colorT=Math.min(1,k.colorT+N/.7),t.color.copy(k.colorFrom).lerp(k.colorTo,ar(k.colorT)),e.color.copy(t.color).multiplyScalar(.9)),k.bounce>0){k.bounce=Math.max(0,k.bounce-N*1.6);let it=Math.sin((1-k.bounce)*Math.PI*3)*k.bounce*.025;i.scale.set(1-it*.5,1+it,1-it*.5)}},consumeShadowDirty(){let N=k.dirtyShadow;return k.dirtyShadow=!1,N}};return st.setLabels("solfege"),st}function pf(i,t,e){return i===t?i:i<t?Math.min(t,i+e):Math.max(t,i-e)}var hr=new I(0,.78,-.62);function gf(i){let t={mode:"show",theta:.62,phi:1.08,radius:3.6,vTheta:0,vPhi:0,idle:0,cx:-.06,span:15,vcx:0,cxGoal:null,shot:0,shotT:0,glide:null,fovGoal:34,userAt:0},e=new I,n=new I,s=new I,r=new I;i.position.set(4,2.2,4),n.copy(hr);let a=()=>xt.N_WHITE+1,o=()=>{let _=Math.min(t.span,xt.N_WHITE)*xt.W/2;t.cx=he(t.cx,-xt.HALF+_-.004,xt.HALF-_+.004),t.span>=xt.N_WHITE&&(t.cx=0)};function l(_,m){m.copy(hr);let p=t.radius;_.set(hr.x+p*Math.sin(t.phi)*Math.sin(t.theta),hr.y+p*Math.cos(t.phi),hr.z+p*Math.sin(t.phi)*Math.cos(t.theta))}function c(_,m,p=t.cx,E=t.span){let R=yi.degToRad(i.fov),S=i.aspect,T=Math.tan(R/2),M=T*S,w=he((1.3-S)/.6,0,1),v=yi.degToRad(Ae(58,46,he((E-8)/40,0,1))+w*16),A=Math.atan(.82*T),O=E*xt.W*1.02/(2*M*Math.cos(A)),V=r.set(p,xt.TOP,.012);_.set(V.x,V.y+O*Math.sin(v),V.z+O*Math.cos(v));let J=v-A;m.set(V.x,_.y-Math.sin(J)*2,_.z-Math.cos(J)*2)}let h=[{p:[1.75,1.45,1.55],t:[-.05,.82,-.45],p2:[1.25,1.35,1.85]},{p:[.85,.98,.42],t:[-.05,.73,-.06],p2:[.25,1.02,.55]},{p:[1.5,1.62,-1.1],t:[-.15,.8,-.72],p2:[1.4,1.5,-.45]},{p:[-1.95,1.5,.25],t:[.05,.85,-.5],p2:[-1.75,1.25,1.05]},{p:[-.6,1.25,1.25],t:[.1,.78,-.2],p2:[.6,1.25,1.3]},{p:[1.7,2.1,-2.5],t:[-.1,.85,-.6],p2:[2.5,1.85,-1.4]}];function d(_,m,p,E){let R=h[p%h.length];_.set(Ae(R.p[0],R.p2[0],E),Ae(R.p[1],R.p2[1],E),Ae(R.p[2],R.p2[2],E)),m.set(R.t[0],R.t[1],R.t[2])}function u(_,m,p){_==="play"?c(m,p):_==="concert"?d(m,p,t.shot,t.shotT):l(m,p)}let f={get mode(){return t.mode},get span(){return t.span},get cx(){return t.cx},get gliding(){return!!t.glide},visibleRange(){let _=Math.min(t.span,xt.N_WHITE)/2,m=(t.cx+xt.HALF)/xt.W;return[m-_,m+_]},setMode(_,m={}){m.span&&(t.span=he(m.span,7,a())),m.cx!==void 0&&(t.cx=m.cx),_==="play"&&o(),_==="concert"&&(t.shot=(t.shot+1)%h.length,t.shotT=0),_==="show"&&m.theta!==void 0&&(t.theta=m.theta,t.phi=m.phi??t.phi,t.radius=m.radius??t.radius);let p=i.position.clone(),E=n.clone();t.mode=_,t.glide={fromP:p,fromT:E,t:0,dur:m.dur||1.5},t.fovGoal=_==="play"?22:34},orbit(_,m){t.mode!=="play"&&(t.mode==="concert"&&(t.mode="show",g()),t.vTheta=-_*.006,t.vPhi=-m*.005,t.theta+=t.vTheta,t.phi=he(t.phi+t.vPhi,.32,1.48),t.idle=0,t.userAt=performance.now())},release(){},zoom(_){if(t.userAt=performance.now(),t.mode==="play"){t.span=he(t.span/_,7,a()),o();return}t.mode==="concert"&&(t.mode="show",g()),t.radius=he(t.radius/_,1.25,6.5),t.idle=0},pan(_,m){if(t.mode!=="play")return;let p=t.span*xt.W/m;t.cx-=_*p,t.vcx=-_*p,t.cxGoal=null,o(),t.userAt=performance.now()},lookAtX(_,m={}){t.cxGoal=_,m.instant&&(t.cx=_,o(),t.cxGoal=null)},ensureVisible(_,m){let p=Math.min(t.span,xt.N_WHITE)*xt.W/2-xt.W*.8,E=t.cxGoal??t.cx;if(m-_>2*p){t.cxGoal=(_+m)/2;return}_<E-p?t.cxGoal=_+p:m>E+p&&(t.cxGoal=m-p)},setSpan(_){t.span=he(_,7,a()),o()},shotAt(_){t.mode="concert",t.shot=_,t.shotT=.5,t.glide=null,t.fovGoal=34,i.fov=34,i.updateProjectionMatrix()},nextShot(){t.shot=(t.shot+1)%h.length,t.shotT=0;let _=i.position.clone(),m=n.clone();t.glide={fromP:_,fromT:m,t:0,dur:3.2}},update(_){t.mode==="show"?(performance.now()-t.userAt>120&&(t.theta+=t.vTheta,t.phi=he(t.phi+t.vPhi,.32,1.48),t.vTheta*=Math.pow(.04,_),t.vPhi*=Math.pow(.04,_)),t.idle+=_,t.idle>7&&(t.theta+=_*.06*Math.min(1,(t.idle-7)/3))):t.mode==="play"?t.cxGoal!==null?(t.cx=Re(t.cx,t.cxGoal,5,_),Math.abs(t.cx-t.cxGoal)<5e-4&&(t.cxGoal=null),o()):performance.now()-t.userAt>60&&Math.abs(t.vcx)>1e-5&&(t.cx+=t.vcx,t.vcx*=Math.pow(.02,_),o()):t.mode==="concert"&&(t.shotT+=_/11,t.shotT>=1&&f.nextShot());let m=Re(i.fov,t.fovGoal,3,_);Math.abs(m-i.fov)>.01&&(i.fov=m,i.updateProjectionMatrix()),u(t.mode,e,s.copy(n));let p=s;if(t.glide){let E=t.glide;E.t=Math.min(1,E.t+_/E.dur);let R=ar(E.t);i.position.lerpVectors(E.fromP,e,R);let S=Math.sin(R*Math.PI)*.18*E.fromP.distanceTo(e);i.position.y+=S*.6,n.lerpVectors(E.fromT,p,R),E.t>=1&&(t.glide=null)}else{let E=t.mode==="concert"?1.2:14;i.position.set(Re(i.position.x,e.x,E,_),Re(i.position.y,e.y,E,_),Re(i.position.z,e.z,E,_)),n.set(Re(n.x,p.x,E,_),Re(n.y,p.y,E,_),Re(n.z,p.z,E,_))}i.lookAt(n)}};function g(){let _=i.position.clone().sub(hr);t.radius=he(_.length(),1.25,6.5),t.phi=he(Math.acos(he(_.y/t.radius,-1,1)),.32,1.48),t.theta=Math.atan2(_.x,_.z),t.glide=null}return f}var Qt={GLOW:0,DOT:1,STAR:2,SPARK:3,NOTE:4,NOTES:5,HEART:6,RING:7,SQUARE:8,DISC:9,FLOWER:10,CONF:11};function pv(){let t=document.createElement("canvas");t.width=t.height=512;let e=t.getContext("2d"),n=(a,o)=>{e.save(),e.translate(a%4*128+128/2,Math.floor(a/4)*128+128/2),o(),e.restore()};e.fillStyle="#fff",e.strokeStyle="#fff",n(Qt.GLOW,()=>{let a=e.createRadialGradient(0,0,0,0,0,62);a.addColorStop(0,"rgba(255,255,255,1)"),a.addColorStop(.18,"rgba(255,255,255,0.75)"),a.addColorStop(.45,"rgba(255,255,255,0.22)"),a.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=a,e.fillRect(-64,-64,128,128)}),n(Qt.DOT,()=>{let a=e.createRadialGradient(0,0,20,0,0,40);a.addColorStop(0,"#fff"),a.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=a,e.beginPath(),e.arc(0,0,40,0,7),e.fill()});let s=(a,o,l=5)=>{e.beginPath();for(let c=0;c<l*2;c++){let h=-Math.PI/2+c*Math.PI/l,d=c%2?o:a;e.lineTo(Math.cos(h)*d,Math.sin(h)*d)}e.closePath()};n(Qt.STAR,()=>{e.lineJoin="round",e.lineWidth=10,s(52,24),e.fill(),e.stroke()}),n(Qt.SPARK,()=>{e.beginPath();for(let a=0;a<8;a++){let o=a*Math.PI/4,l=a%2?9:58;e.lineTo(Math.cos(o)*l,Math.sin(o)*l)}e.closePath(),e.fill()}),n(Qt.NOTE,()=>{e.font='700 104px "Apple Symbols","Segoe UI Symbol","Noto Music",serif',e.textAlign="center",e.textBaseline="middle",e.fillText("\u266A",0,6)}),n(Qt.NOTES,()=>{e.font='700 100px "Apple Symbols","Segoe UI Symbol","Noto Music",serif',e.textAlign="center",e.textBaseline="middle",e.fillText("\u266B",0,6)}),n(Qt.HEART,()=>{e.beginPath(),e.moveTo(0,46),e.bezierCurveTo(-70,-6,-34,-62,0,-26),e.bezierCurveTo(34,-62,70,-6,0,46),e.fill()}),n(Qt.RING,()=>{e.lineWidth=9,e.beginPath(),e.arc(0,0,50,0,7),e.stroke()}),n(Qt.SQUARE,()=>{e.fillRect(-40,-40,80,80)}),n(Qt.DISC,()=>{e.beginPath(),e.arc(0,0,50,0,7),e.fill(),e.globalCompositeOperation="destination-out",e.beginPath(),e.arc(0,0,18,0,7),e.fill()}),n(Qt.FLOWER,()=>{for(let a=0;a<5;a++){let o=a*Math.PI*2/5;e.beginPath(),e.arc(Math.cos(o)*26,Math.sin(o)*26,24,0,7),e.fill()}}),n(Qt.CONF,()=>{e.fillRect(-18,-46,36,92)});let r=new ze(t);return r.colorSpace=_e,r.generateMipmaps=!0,r.minFilter=ri,r}function mv(i,t){let e=new nn(1,1),n=new Ys;n.index=e.index,n.attributes.position=e.attributes.position,n.attributes.uv=e.attributes.uv;let s=new Tn(new Float32Array(i*3),3).setUsage(zi),r=new Tn(new Float32Array(i*4),4).setUsage(zi),a=new Tn(new Float32Array(i*4),4).setUsage(zi);n.setAttribute("iPos",s),n.setAttribute("iCol",r),n.setAttribute("iMisc",a),n.instanceCount=0;let o=new Ne({transparent:!0,depthWrite:!1,depthTest:!0,blending:$s,blendSrc:Ks,blendDst:is,uniforms:{uTex:{value:t},uAdd:{value:0}},vertexShader:`
      attribute vec3 iPos; attribute vec4 iCol; attribute vec4 iMisc;
      varying vec2 vUv; varying vec4 vCol; varying float vCore;
      void main(){
        float s = iMisc.x, r = iMisc.y, fr = iMisc.z;
        vec2 q = position.xy; float c = cos(r), sn = sin(r); q = vec2(c*q.x - sn*q.y, sn*q.x + c*q.y);
        vec4 mv = modelViewMatrix * vec4(iPos, 1.0); mv.xy += q * s;
        gl_Position = projectionMatrix * mv;
        vec2 cellUV = vec2(mod(fr, 4.0), 3.0 - floor(fr / 4.0));
        vUv = (cellUV + uv) / 4.0; vCol = iCol; vCore = iMisc.w;
      }`,fragmentShader:`
      uniform sampler2D uTex; uniform float uAdd; varying vec2 vUv; varying vec4 vCol; varying float vCore;
      void main(){
        vec4 t = texture2D(uTex, vUv);
        float a = t.a * vCol.a;
        vec3 col = mix(vCol.rgb, vec3(1.0), vCore * t.a * t.a);
        gl_FragColor = vec4(col * a, a * (1.0 - uAdd));
      }`}),l=new ie(n,o);l.frustumCulled=!1,l.renderOrder=5;let c=[];return{mesh:l,mat:o,P:c,spawn(h){c.length>=i&&c.shift();let d=Object.assign({x:0,y:0,z:0,vx:0,vy:0,vz:0,ax:0,ay:0,az:0,drag:0,size:.02,size1:null,grow:0,rot:0,vrot:0,frame:Qt.GLOW,r:1,g:1,b:1,a:1,life:1,age:0,core:0,wob:0,wobF:2,fadeIn:.06,pop:0},h);return h.color&&(d.r=h.color.r,d.g=h.color.g,d.b=h.color.b),d.seed=Math.random()*10,c.push(d),d},update(h,d){let u=0;for(let f=c.length-1;f>=0;f--){let g=c[f];g.age+=h,g.age>=g.life&&c.splice(f,1)}for(let f of c){let g=Math.exp(-f.drag*h);f.vx=(f.vx+f.ax*h)*g,f.vy=(f.vy+f.ay*h)*g,f.vz=(f.vz+f.az*h)*g,f.x+=f.vx*h,f.y+=f.vy*h,f.z+=f.vz*h,f.rot+=f.vrot*h;let _=f.age/f.life,m=f.wob?Math.sin(d*f.wobF+f.seed)*f.wob:0,p=f.size1!==null?Ae(f.size,f.size1,_):f.size*(1+f.grow*_);f.pop&&(p*=f.age<.25?.4+.6*Math.sin(f.age/.25*Math.PI*.62)/Math.sin(Math.PI*.62):1);let E=Math.min(1,f.age/f.fadeIn)*(_<.6?1:1-(_-.6)/.4);s.array[u*3]=f.x+m,s.array[u*3+1]=f.y,s.array[u*3+2]=f.z,r.array[u*4]=f.r,r.array[u*4+1]=f.g,r.array[u*4+2]=f.b,r.array[u*4+3]=f.a*E,a.array[u*4]=p,a.array[u*4+1]=f.rot,a.array[u*4+2]=f.frame,a.array[u*4+3]=f.core,u++}n.instanceCount=u,s.needsUpdate=r.needsUpdate=a.needsUpdate=!0,s.clearUpdateRanges?.(),r.clearUpdateRanges?.(),a.clearUpdateRanges?.()}}}function gv(i){let t=new nn(1,1);t.translate(0,.5,0);let e=new Ys;e.index=t.index,e.attributes.position=t.attributes.position,e.attributes.uv=t.attributes.uv;let n=new Tn(new Float32Array(i*4),4).setUsage(zi),s=new Tn(new Float32Array(i*4),4).setUsage(zi),r=new Tn(new Float32Array(i),1).setUsage(zi);e.setAttribute("iA",n),e.setAttribute("iB",s),e.setAttribute("iW",r);let a=new Ne({transparent:!0,depthWrite:!1,blending:$s,blendSrc:Ks,blendDst:is,uniforms:{uAdd:{value:0}},vertexShader:`
      attribute vec4 iA; attribute vec4 iB; attribute float iW; varying vec2 vUv; varying vec4 vB; varying float vH;
      void main(){
        vec3 camRight = normalize(vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]));
        vec3 right = normalize(vec3(camRight.x, 0.0, camRight.z) + 1e-5);
        vec3 p = vec3(iA.x, iA.y, iA.z) + right * position.x * iW + vec3(0.0, position.y * iA.w, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        vUv = uv; vB = iB; vH = iA.w;
      }`,fragmentShader:`
      uniform float uAdd; varying vec2 vUv; varying vec4 vB; varying float vH;
      void main(){
        float x = (vUv.x - 0.5) * 2.0;
        float core = exp(-x * x * 26.0), halo = exp(-x * x * 3.2);
        float y = vUv.y * vH;                                  // metres from the bottom
        float topFade = smoothstep(0.0, 0.10, (1.0 - vUv.y) * vH);
        float botFade = smoothstep(0.0, 0.012, y);
        float a = (core * 0.95 + halo * 0.45) * topFade * botFade * vB.a;
        vec3 c = mix(vB.rgb, vec3(1.0), core * 0.55);
        gl_FragColor = vec4(c * a, a * 0.85 * (1.0 - uAdd));
      }`}),o=new ie(e,a);o.frustumCulled=!1,o.renderOrder=4;let l=[];return{mesh:o,mat:a,B:l,start(c,h,d,u,f){l.length>=i&&l.shift();let g={x:c,y0:h,z:d,top:h,color:u,width:f,held:!0,speed:.55,a:1,age:0};return l.push(g),g},update(c){for(let d=l.length-1;d>=0;d--){let u=l[d];u.age+=c,u.top+=u.speed*c,u.held||(u.y0+=u.speed*c,u.a-=c*.55),(u.a<=0||u.y0>4)&&l.splice(d,1)}let h=0;for(let d of l)n.array[h*4]=d.x,n.array[h*4+1]=d.y0,n.array[h*4+2]=d.z,n.array[h*4+3]=Math.max(.001,d.top-d.y0),s.array[h*4]=d.color.r,s.array[h*4+1]=d.color.g,s.array[h*4+2]=d.color.b,s.array[h*4+3]=he(d.a,0,1)*Math.min(1,d.age*12),r.array[h]=d.width,h++;e.instanceCount=h,n.needsUpdate=s.needsUpdate=r.needsUpdate=!0}}}function _v(i){let t={},e=(r,a)=>{let o=r+a;if(t[o])return t[o];let l=document.createElement("canvas");l.width=256,l.height=160;let c=l.getContext("2d");c.font=`800 ${r.length>2?92:108}px "Arial Rounded MT Bold","Avenir Next","Nunito",sans-serif`,c.textAlign="center",c.textBaseline="middle",c.lineWidth=18,c.lineJoin="round",c.strokeStyle="rgba(255,255,255,0.95)",c.strokeText(r,128,84),c.fillStyle=a,c.fillText(r,128,84);let h=new ze(l);return h.colorSpace=_e,t[o]=h},n=[];for(let r=0;r<18;r++){let a=new Ii(new xi({transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1}));a.visible=!1,a.renderOrder=8,i.add(a),n.push({s:a,age:1,life:1,y0:0,lift:0})}let s=0;return{show(r,a,o,l){let c=0;for(let d of n)d.s.visible&&d.age<.45&&Math.abs(d.s.position.x-o.x)<l*1.7&&Math.abs(d.y0+d.lift-o.y-c)<l*.8&&(c+=l*.9);let h=n[s++%n.length];h.lift=Math.min(c,l*2.7),h.s.material.map=e(r,a),h.s.material.needsUpdate=!0,h.s.position.copy(o),h.age=0,h.life=1,h.size=l,h.y0=o.y,h.s.visible=!0},update(r){for(let a of n){if(!a.s.visible)continue;a.age+=r;let o=a.age/a.life;if(o>=1){a.s.visible=!1;continue}let l=o<.18?Math.sin(o/.18*Math.PI*.6)/Math.sin(Math.PI*.6)*1:1;a.s.scale.set(a.size*1.6*l,a.size*l,1),a.s.position.y=a.y0+(a.lift||0)+a.size*.9*Math.sqrt(o),a.s.material.opacity=o<.65?1:1-(o-.65)/.35}}}}function xv(i){let t=new Ne({transparent:!0,depthWrite:!1,side:An,blending:$s,blendSrc:Ks,blendDst:is,uniforms:{uT:{value:0},uA:{value:0},uAdd:{value:0},uCols:{value:dn.slice().reverse().map(a=>new Tt(a))}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform float uT, uA, uAdd; uniform vec3 uCols[7]; varying vec2 vUv;
      void main(){
        // uv.x runs along the arc, uv.y across the bands
        float band = vUv.y * 7.0; int i = int(clamp(floor(band), 0.0, 6.0));
        vec3 c = uCols[0];
        for (int k = 0; k < 7; k++) if (k == i) c = uCols[k];
        float edge = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
        float grow = smoothstep(uT - 0.06, uT, 1.0 - vUv.x);
        float a = edge * (1.0 - grow) * uA * 0.85;
        gl_FragColor = vec4(c * a, a * (1.0 - uAdd));
      }`}),e=new ta(.62,.86,96,1,0,Math.PI),n=e.attributes.position,s=e.attributes.uv;for(let a=0;a<n.count;a++){let o=n.getX(a),l=n.getY(a),c=Math.hypot(o,l),h=Math.atan2(l,o);s.setXY(a,h/Math.PI,(c-.62)/.24)}let r=new ie(e,t);return r.visible=!1,r.renderOrder=3,r.frustumCulled=!1,i.add(r),{m:r,mat:t,t:0,active:!1}}function _f(i){let t=pv(),e=mv(2400,t),n=gv(96),s=_v(i),r=xv(i);i.add(n.mesh),i.add(e.mesh);let a=new Map,o={style:"piano",names:!0,quiet:hf,night:0},l={piano:{spirit:[Qt.NOTE,Qt.NOTES],spark:Qt.SPARK},musicbox:{spirit:[Qt.STAR,Qt.SPARK],spark:Qt.STAR},marimba:{spirit:[Qt.DISC,Qt.FLOWER],spark:Qt.DOT},chip:{spirit:[Qt.SQUARE],spark:Qt.SQUARE},voice:{spirit:[Qt.HEART,Qt.NOTE],spark:Qt.HEART}},c=new I;return o.noteOn=function(h,d,u={}){let f=u.color||Ke(h),g=u.vel??.8,_=he((h-21)/87,0,1),m=l[o.style]||l.piano,p=u.scale||1,E=a.get(h);E&&(E.held=!1);let R=n.start(d.x,d.y,d.z,f,($e(h)?.026:.034)*p*(u.camScale||1));if(R.speed=Ae(.42,.72,_)*Math.min(1,p*.85),a.set(h,R),o.quiet)return;let S=Ae(.085,.034,_)*(.8+g*.4)*p,T=Ae(.2,.42,_),M=Ae(3.2,2.2,_),w={x:d.x,y:d.y+.01,z:d.z,vx:te(-.03,.03),vy:T,vz:te(-.02,.02)-.04,drag:.15,life:M,color:f,wob:Ae(.018,.03,_)*p,wobF:Ae(1.6,3.6,_),pop:1};e.spawn(Object.assign({},w,{frame:Qt.GLOW,size:S*2.6,a:.75,core:.6})),e.spawn(Object.assign({},w,{frame:Wn(m.spirit),size:S,a:1,core:.25,rot:te(-.4,.4),vrot:te(-.6,.6)}));let v=Math.round(Ae(10,16,g)*(u.sparks??1));for(let A=0;A<v;A++){let L=te(Math.PI*2),O=te(.12,.45)*p;e.spawn({x:d.x,y:d.y+.004,z:d.z,vx:Math.cos(L)*O*.6,vy:te(.15,.6)*p,vz:Math.sin(L)*O*.4,ay:-.5*p,drag:2.2,life:te(.5,1),frame:A%3?Qt.DOT:m.spark,size:te(.006,.013)*p,color:f,core:.7,vrot:te(-6,6)})}if(e.spawn({x:d.x,y:d.y+.003,z:d.z+.03,frame:Qt.GLOW,size:.11*p,size1:.16*p,life:.45,color:f,a:.55,core:.3,fadeIn:.01}),o.names&&u.name!==!1){let A=u.label||($e(h)?null:or[Mn(h)]);A&&s.show(A,"#"+f.getHexString(),c.set(d.x,d.y+.03*p,d.z+.01),.026*p*(u.camScale||1))}},o.noteOff=function(h){let d=a.get(h);d&&(d.held=!1,a.delete(h))},o.burst=function(h,d=40,u={}){o.quiet&&(d=Math.round(d/3));let f=u.colors||dn.map(_=>new Tt(_)),g=u.scale||1;for(let _=0;_<d;_++){let m=te(Math.PI*2),p=te(-.2,1.2),E=te(.4,1.2)*g;e.spawn({x:h.x,y:h.y,z:h.z,vx:Math.cos(m)*Math.cos(p)*E,vy:Math.sin(p)*E+.3*g,vz:Math.sin(m)*Math.cos(p)*E,ay:-.9*g,drag:1.2,life:te(.9,1.8),frame:Wn([Qt.STAR,Qt.SPARK,Qt.DOT,Qt.HEART,Qt.NOTE]),size:te(.014,.034)*g,color:Wn(f),core:.5,vrot:te(-5,5)})}},o.firework=function(h,d,u=1){let f=o.quiet?30:90;for(let g=0;g<f;g++){let _=te(-1,1),m=te(Math.PI*2),p=Math.sqrt(1-_*_),E=te(.7,1)*u;e.spawn({x:h.x,y:h.y,z:h.z,vx:p*Math.cos(m)*E,vy:_*E,vz:p*Math.sin(m)*E,ay:-.35*u,drag:1.4,life:te(1.2,1.9),frame:g%4?Qt.DOT:Qt.SPARK,size:te(.012,.022)*u,color:d,core:.8})}e.spawn({x:h.x,y:h.y,z:h.z,frame:Qt.GLOW,size:.35*u,size1:.9*u,life:.6,color:d,a:.8,core:.7,fadeIn:.01})},o.confetti=function(h,d=120,u=1){o.quiet&&(d=30);for(let f=0;f<d;f++)e.spawn({x:h.x+te(-1.2,1.2)*u,y:h.y+te(.6,1.6)*u,z:h.z+te(-.8,.6)*u,vx:te(-.1,.1),vy:te(-.3,-.1),vz:te(-.1,.1),ay:-.12,drag:.6,life:te(3,5),frame:Wn([Qt.CONF,Qt.CONF,Qt.STAR,Qt.HEART]),size:te(.02,.035)*u,color:new Tt(Wn(dn)),core:.15,rot:te(6),vrot:te(-4,4),wob:.05*u,wobF:te(2,4),fadeIn:.2})},o.twinkle=function(h,d,u=1){e.spawn({x:h.x,y:h.y,z:h.z,frame:Qt.SPARK,size:.03*u,size1:0,life:.7,color:d,core:.8,vrot:3})},o.rainbow=function(h,d){r.m.position.copy(h),r.m.scale.setScalar(d/1.72),r.t=0,r.active=!0,r.m.visible=!0;for(let u=0;u<40;u++){let f=te(Math.PI),g=te(.62,.86)*d/1.72;e.spawn({x:h.x+Math.cos(f)*g,y:h.y+Math.sin(f)*g,z:h.z+.01,vy:te(-.02,.05),frame:Qt.SPARK,size:te(.01,.025)*d,life:te(1,2.2),color:new Tt(dn[Math.floor(te(7))]),core:.8,vrot:2,fadeIn:.3})}},o.lookAt=function(h){r.m.visible&&r.m.quaternion.copy(h.quaternion)},o.update=function(h,d,u){o.night=u;let f=u;e.mat.uniforms.uAdd.value=f,n.mat.uniforms.uAdd.value=f*.9,r.mat.uniforms.uAdd.value=f*.6,e.update(h,d),n.update(h),s.update(h),r.active&&(r.t+=h,r.mat.uniforms.uT.value=Math.min(1.06,r.t/.9),r.mat.uniforms.uA.value=r.t<2.6?1:Math.max(0,1-(r.t-2.6)/1.2),r.t>3.8&&(r.active=!1,r.m.visible=!1))},o.clear=function(){e.P.length=0,n.B.length=0,a.clear()},o}var xf=window.AudioContext||window.webkitAudioContext,dt={ctx:null,on:!0,ready:!1,loaded:0,total:30,inst:"piano",sustain:!1,voices:[]},ls,Si,ur,jl,Ql,tc,Pa,dr,Vh=new Map,yf=[];function vv(i,t=2.6,e=3.2){let n=i.sampleRate,s=Math.floor(n*t),r=i.createBuffer(2,s,n);for(let a=0;a<2;a++){let o=r.getChannelData(a),l=0;for(let c=0;c<s;c++){let h=c/s,d=.18+.6*h;l=l+d*(Math.random()*2-1-l),o[c]=l*Math.pow(1-h,e)*(c<n*.012?c/(n*.012):1)}}return r}dt.init=function(){if(dt.ctx)return dt.ctx.state!=="running"&&dt.ctx.resume().catch(()=>{}),dt.ctx;if(!xf)return null;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}let i=dt.ctx=new xf({latencyHint:"interactive"});return Si=i.createDynamicsCompressor(),Si.threshold.value=-16,Si.knee.value=14,Si.ratio.value=5,Si.attack.value=.002,Si.release.value=.25,ls=i.createGain(),ls.gain.value=dt.on?.95:0,Si.connect(ls),ls.connect(i.destination),dt._master=ls,dr=i.createGain(),dr.connect(Si),ur=i.createGain(),ur.gain.value=1,jl=i.createGain(),jl.gain.value=.92,Ql=i.createGain(),Ql.gain.value=.3,tc=i.createConvolver(),tc.buffer=vv(i),ur.connect(jl),jl.connect(dr),ur.connect(tc),tc.connect(Ql),Ql.connect(dr),Pa=i.createGain(),Pa.gain.value=.5,Pa.connect(Si),i.state!=="running"&&i.resume().catch(()=>{}),i};dt.time=()=>dt.ctx?dt.ctx.currentTime:0;var vf=!1;function yv(){let i=dt.ctx;if(i&&(i.state!=="running"&&i.resume().catch(()=>{}),!vf))try{let t=i.createBuffer(1,1,22050),e=i.createBufferSource();e.buffer=t,e.connect(i.destination),e.start(0),vf=!0}catch{}}["pointerdown","touchend","click","keydown"].forEach(i=>window.addEventListener(i,yv,{capture:!0,passive:!0}));dt.setOn=function(i){dt.on=i,ls&&ls.gain.setTargetAtTime(i?.95:0,dt.ctx.currentTime,.05)};dt.duck=function(i){dr&&dr.gain.setTargetAtTime(i?.55:1,dt.ctx.currentTime,i?.08:.4)};function Mv(i){return new Promise((t,e)=>{try{let n=dt.ctx.decodeAudioData(i,t,e);n&&n.catch&&n.catch(e)}catch(n){e(n)}})}function Sv(i){let t=i.getChannelData(0),e=0;for(let s=0;s<Math.min(t.length,8e3);s++)e=Math.max(e,Math.abs(t[s]));let n=e*.02;for(let s=0;s<t.length;s++)if(Math.abs(t[s])>n)return Math.max(0,s-24)/i.sampleRate;return 0}dt.load=async function(i="./",t){if(!dt.ctx)return;let[e,n]=await Promise.all([fetch(i+"piano.json").then(r=>r.json()),fetch(i+"piano.bin").then(r=>r.arrayBuffer())]);dt.total=e.n.length;let s=e.n.slice().sort((r,a)=>Math.abs(r[0]-64)-Math.abs(a[0]-64));for(let[r,a,o]of s){try{let l=await Mv(n.slice(a,a+o));Vh.set(r,{buf:l,off:Sv(l)}),yf=Array.from(Vh.keys()).sort((c,h)=>c-h)}catch{}dt.loaded++,t&&t(dt.loaded/dt.total)}dt.ready=!0};function bv(i){let t=null,e=1e9;for(let n of yf){let s=Math.abs(n-i);s<e&&(e=s,t=n)}return t}var Ev=44;function Tv(i){return he((i-64)/40,-1,1)*.55}function Ra(i){let t=dt.ctx,e=t.createGain();if(t.createStereoPanner){let n=t.createStereoPanner();n.pan.value=Tv(i),e.connect(n),n.connect(ur)}else e.connect(ur);return e}function wv(){for(;dt.voices.length>=Ev;)Xh(dt.voices.shift(),.03)}function Xh(i,t=.06){if(i.dead)return;i.dead=!0;let e=dt.ctx,n=e.currentTime;try{i.g.gain.cancelScheduledValues(n),i.g.gain.setValueAtTime(Math.max(1e-4,i.g.gain.value),n),i.g.gain.exponentialRampToValueAtTime(1e-4,n+t),i.srcs.forEach(s=>{try{s.stop(n+t+.02)}catch{}})}catch{}setTimeout(()=>{try{i.g.disconnect()}catch{}},(t+.1)*1e3)}var Wh={piano(i,t,e){let n=dt.ctx,s=bv(i);if(s===null)return Wh.soft(i,t,e);let r=Vh.get(s),a=n.createBufferSource();a.buffer=r.buf,a.playbackRate.value=Math.pow(2,(i-s)/12);let o=Ra(i),l=(.22+.78*Math.pow(t,1.6))*1.4;return o.gain.setValueAtTime(l,e),a.connect(o),a.start(e,r.off),{g:o,srcs:[a],release:i>=89?2.2:.42,amp:l}},soft(i,t,e){let n=dt.ctx,s=cr(i),r=Ra(i),a=.25*t,o=n.createOscillator(),l=n.createOscillator(),c=n.createGain();return o.type="triangle",o.frequency.value=s,l.type="sine",l.frequency.value=s*2,c.gain.value=.25,o.connect(r),l.connect(c),c.connect(r),r.gain.setValueAtTime(1e-4,e),r.gain.exponentialRampToValueAtTime(a,e+.008),r.gain.exponentialRampToValueAtTime(a*.3,e+1.2),r.gain.exponentialRampToValueAtTime(1e-4,e+3.5),o.start(e),l.start(e),o.stop(e+3.6),l.stop(e+3.6),{g:r,srcs:[o,l],release:.4,amp:a}},musicbox(i,t,e){let n=dt.ctx,s=cr(i),r=Ra(i),a=.27*(.5+.5*t),o=he(3.4-(i-60)*.035,1.2,4.5),l=[[1,1,o],[2,.12,o*.35],[6.27,.32,.09],[17.55,.08,.03]],c=[];for(let[h,d,u]of l){if(s*h>16e3)continue;let f=n.createOscillator(),g=n.createGain();f.frequency.value=s*h,g.gain.setValueAtTime(1e-4,e),g.gain.exponentialRampToValueAtTime(d,e+.002),g.gain.exponentialRampToValueAtTime(1e-4,e+u),f.connect(g),g.connect(r),f.start(e),f.stop(e+u+.05),c.push(f)}return r.gain.setValueAtTime(a,e),{g:r,srcs:c,release:o,amp:a,free:!0}},marimba(i,t,e){let n=dt.ctx,s=cr(i),r=Ra(i),a=.42*(.45+.55*t),o=he(1.6-(i-48)*.02,.35,2.2),l=[];for(let[c,h,d]of[[1,1,o],[3.93,.18,o*.12],[9.2,.05,.03]]){if(s*c>15e3)continue;let u=n.createOscillator(),f=n.createGain();u.frequency.value=s*c,f.gain.setValueAtTime(1e-4,e),f.gain.exponentialRampToValueAtTime(h,e+.003),f.gain.exponentialRampToValueAtTime(1e-4,e+d),u.connect(f),f.connect(r),u.start(e),u.stop(e+d+.05),l.push(u)}return r.gain.setValueAtTime(a,e),{g:r,srcs:l,release:o,amp:a,free:!0}},chip(i,t,e){let n=dt.ctx,s=cr(i),r=Ra(i),a=.11*(.6+.4*t),o=n.createOscillator();o.setPeriodicWave(Av(n)),o.frequency.value=s;let l=n.createOscillator(),c=n.createGain();l.frequency.value=5.5,c.gain.setValueAtTime(0,e),c.gain.linearRampToValueAtTime(s*.012,e+.35),l.connect(c),c.connect(o.frequency);let h=n.createBiquadFilter();return h.type="lowpass",h.frequency.value=he(s*9,1500,9e3),o.connect(h),h.connect(r),r.gain.setValueAtTime(1e-4,e),r.gain.exponentialRampToValueAtTime(a,e+.006),r.gain.exponentialRampToValueAtTime(a*.7,e+.12),o.start(e),l.start(e),{g:r,srcs:[o,l],release:.12,amp:a,hold:!0}}},Gh=null;function Av(i){if(Gh)return Gh;let t=40,e=new Float32Array(t),n=new Float32Array(t),s=.25;for(let r=1;r<t;r++){let a=2/(r*Math.PI)*Math.sin(Math.PI*r*s);e[r]=a*Math.cos(Math.PI*r*s),n[r]=a*Math.sin(Math.PI*r*s)}return Gh=i.createPeriodicWave(e,n)}dt.noteOn=function(i,t=.75,e={}){let n=dt.ctx;if(!n||!dt.on)return null;let s=Math.max(n.currentTime,e.when||0),r=e.inst||dt.inst;for(let l of dt.voices)l.m===i&&!l.dead&&l.inst===r&&!l.free&&Xh(l,.09);dt.voices=dt.voices.filter(l=>!l.dead),wv();let o=(Wh[r]||Wh.piano)(i,he(t,.05,1),s);return e.gain!==void 0&&o.g.gain.setValueAtTime(o.amp*e.gain,s),Object.assign(o,{m:i,inst:r,t0:s,held:!0}),dt.voices.push(o),e.dur&&dt.noteOff(o,s+e.dur),o};dt.noteOff=function(i,t){if(!i||i.dead||!dt.ctx)return;let e=dt.ctx,n=Math.max(e.currentTime,t||0);if(i.held=!1,!i.free){if(dt.sustain&&!i.hold){i.sustained=!0;return}Mf(i,n)}};function Mf(i,t){if(i.dead||i.releasing)return;i.releasing=!0;let e=i.release;try{i.g.gain.cancelScheduledValues(t),i.g.gain.setTargetAtTime(1e-4,t,e/4.5),i.srcs.forEach(n=>{try{n.stop(t+e+.3)}catch{}})}catch{}setTimeout(()=>{i.dead=!0;try{i.g.disconnect()}catch{}},(t-dt.ctx.currentTime+e+.5)*1e3)}dt.setSustain=function(i){if(dt.sustain=i,!i&&dt.ctx){let t=dt.ctx.currentTime;dt.voices.forEach(e=>{e.sustained&&!e.held&&(e.sustained=!1,Mf(e,t))})}};dt.allOff=function(){dt.ctx&&(dt.voices.forEach(i=>Xh(i,.15)),dt.voices=[])};var ec=[72,74,76,79,81,84,86,88];dt.ui=function(i="tap",t=0){let e=dt.ctx;if(!e||!dt.on)return;let n=e.currentTime,s=(r,a,o=.25,l=.18,c="sine")=>{let h=e.createOscillator(),d=e.createGain();h.type=c,h.frequency.value=cr(r),d.gain.setValueAtTime(1e-4,a),d.gain.exponentialRampToValueAtTime(o,a+.006),d.gain.exponentialRampToValueAtTime(1e-4,a+l),h.connect(d),d.connect(Pa),h.start(a),h.stop(a+l+.05)};if(i==="tap")s(ec[t%ec.length],n,.22,.14);else if(i==="open")[0,1,2,3,4,5].forEach((r,a)=>s(ec[r]-12,n+a*.05,.18,.5));else if(i==="close")[5,3,1].forEach((r,a)=>s(ec[r]-12,n+a*.06,.16,.3));else if(i==="pop")s(84,n,.18,.08,"triangle"),s(91,n+.04,.12,.1);else if(i==="whoosh"){let r=e.createBufferSource(),a=e.createBuffer(1,e.sampleRate*.6,e.sampleRate),o=a.getChannelData(0);for(let h=0;h<o.length;h++)o[h]=(Math.random()*2-1)*Math.sin(Math.PI*h/o.length);r.buffer=a;let l=e.createBiquadFilter();l.type="bandpass",l.Q.value=1.2,l.frequency.setValueAtTime(400,n),l.frequency.exponentialRampToValueAtTime(2400,n+.5);let c=e.createGain();c.gain.value=.09,r.connect(l),l.connect(c),c.connect(Pa),r.start(n)}};dt.chord=function(i,t={}){let e=dt.time()+(t.delay||0);i.forEach((n,s)=>dt.noteOn(n,t.vel||.6,{when:e+s*(t.spread||0),dur:t.dur||1.2,inst:t.inst}))};function Sf(i){let{piano:t,fx:e,stage:n,rig:s}=i,r=new Map,a=new I,o=null,l=()=>s.mode==="play"?Math.max(.55,Math.min(1.25,s.span/16)):1.25,c={isDown:h=>r.has(h),down(h,d={}){if(h<Je||h>qn)return;let u=d.src||"user",f=r.get(h);f||(f={srcs:new Set,voice:null},r.set(h,f)),f.srcs.add(u);let g=d.vel??.78;d.sound!==!1&&(f.voice=dt.noteOn(h,g,{inst:d.inst,gain:d.gain}));let _=Ke(h);t.press(h,!0,_);let m=l();e.noteOn(h,t.keyTop(h,a),{vel:g,scale:d.fxScale??m,name:d.name,sparks:u==="acc"?.3:1}),n.tint(_,u==="acc"?.3:1),o&&u==="user"&&o.ev.push([performance.now()-o.t0,h,1]),Le.emit("note",h,u,g)},up(h,d={}){let u=r.get(h);if(!u)return;let f=d.src||"user";u.srcs.delete(f),!u.srcs.size&&(r.delete(h),u.voice&&dt.noteOff(u.voice),t.press(h,!1),e.noteOff(h),o&&f==="user"&&o.ev.push([performance.now()-o.t0,h,0]),Le.emit("noteup",h,f))},tap(h,d,u={}){c.down(h,u),setTimeout(()=>c.up(h,{src:u.src}),Math.max(60,d*1e3))},allUp(h){for(let[d,u]of Array.from(r))(!h||u.srcs.has(h))&&(u.srcs.clear(),r.set(d,u),c.up(d,{src:"x"}))},record(h){if(h)return o={t0:performance.now(),ev:[]},null;let d=o;return o=null,d},get recording(){return!!o}};return c}function bf(i,t){let{camera:e,piano:n,player:s,rig:r}=t,a=new ha,o=new gt,l=new Map,c=null,h={enabled:!0,keysEnabled:!0,filter:null,onTapPiano:null,gloss:[]};function d(M,w){let v=i.getBoundingClientRect();return o.set((M-v.left)/v.width*2-1,-((w-v.top)/v.height)*2+1),a.setFromCamera(o,e),a}function u(M,w){if(!h.keysEnabled||n.fallOpen<.6)return null;let v=d(M,w),A=n.keyAt(v.ray);if(A==null)return null;if(r.mode!=="play"){let L=v.intersectObjects(n.occluders,!1)[0];if(L){let O=(xt.TOP-v.ray.origin.y)/v.ray.direction.y;if(L.distance<O*.995)return null}}return A}function f(M,w){return d(M,w).intersectObject(n.root,!0).length>0}function g(M,w){if(M.key!==w&&(M.key!==null&&s.up(M.key,{src:"user"}),M.key=w,w!==null)){if(h.filter&&!h.filter(w)){M.key=null;return}s.down(w,{src:"user",vel:M.vel}),M.moved?(M.run.push({m:w,t:performance.now()}),_(M)):M.run=[{m:w,t:performance.now()}]}}function _(M){let w=performance.now();M.run=M.run.filter(A=>w-A.t<1100);let v=M.run.filter(A=>!$e(A.m));v.length>=7&&!M.rainbowed&&Math.abs(os(v[v.length-1].m)-os(v[0].m))>=6&&(M.rainbowed=!0,Le.emit("glissando",v[0].m,v[v.length-1].m))}function m(M){if(!h.enabled)return;dt.init(),i.setPointerCapture?.(M.pointerId);let w=M.pointerType==="pen"&&M.pressure?.35+M.pressure*.65:.72+Math.random()*.1,v={id:M.pointerId,x:M.clientX,y:M.clientY,x0:M.clientX,y0:M.clientY,key:null,kind:"gesture",vel:w,moved:!1,run:[],t0:performance.now()};if(l.set(M.pointerId,v),h.onTapPiano&&f(M.clientX,M.clientY)){v.kind="tapPiano";return}let A=u(M.clientX,M.clientY);if(A!==null&&M.button!==2)v.kind="key",g(v,A);else{let L=Array.from(l.values()).filter(O=>O.kind==="gesture");L.length===2&&(c={d0:R(L[0],L[1]),a:L[0].id,b:L[1].id})}Le.emit("touch")}function p(M){let w=l.get(M.pointerId);if(!w)return;let v=M.clientX-w.x,A=M.clientY-w.y;if(w.x=M.clientX,w.y=M.clientY,Math.hypot(w.x-w.x0,w.y-w.y0)>6&&(w.moved=!0),w.kind==="key"){g(w,u(w.x,w.y));return}if(w.kind!=="gesture")return;if(Array.from(l.values()).filter(O=>O.kind==="gesture").length>=2&&c){let O=l.get(c.a),V=l.get(c.b);if(O&&V){let J=R(O,V);c.d0>0&&r.zoom(J/c.d0),c.d0=J}return}r.mode==="play"?r.pan(v,i.clientWidth):r.orbit(v,A)}function E(M){let w=l.get(M.pointerId);w&&(l.delete(M.pointerId),w.kind==="key"&&w.key!==null&&s.up(w.key,{src:"user"}),w.kind==="tapPiano"&&!w.moved&&h.onTapPiano&&h.onTapPiano(),c&&(c.a===M.pointerId||c.b===M.pointerId)&&(c=null),w.kind==="gesture"&&!w.moved&&performance.now()-w.t0<350&&Le.emit("tapEmpty",w.x,w.y))}let R=(M,w)=>Math.hypot(M.x-w.x,M.y-w.y);i.addEventListener("pointerdown",m),i.addEventListener("pointermove",p),i.addEventListener("pointerup",E),i.addEventListener("pointercancel",E),i.addEventListener("lostpointercapture",E),i.addEventListener("contextmenu",M=>M.preventDefault()),i.addEventListener("wheel",M=>{M.preventDefault(),r.zoom(Math.exp(-M.deltaY*.0015))},{passive:!1}),i.addEventListener("touchstart",M=>{M.touches.length>1&&M.preventDefault()},{passive:!1}),document.addEventListener("gesturestart",M=>M.preventDefault());let S={a:0,w:1,s:2,e:3,d:4,f:5,t:6,g:7,y:8,h:9,u:10,j:11,k:12,o:13,l:14,p:15,";":16,"'":17},T=new Map;return h.kbBase=60,window.addEventListener("keydown",M=>{if(M.repeat||M.metaKey||M.ctrlKey||M.altKey||!h.enabled||M.target&&/input|textarea|select/i.test(M.target.tagName))return;let w=M.key.toLowerCase();if(w==="z"){h.kbBase=Math.max(24,h.kbBase-12);return}if(w==="x"){h.kbBase=Math.min(96,h.kbBase+12);return}if(!(w in S))return;dt.init();let v=h.kbBase+S[w];h.filter&&!h.filter(v)||(T.set(w,v),s.down(v,{src:"user"}),Le.emit("touch"))}),window.addEventListener("keyup",M=>{let w=M.key.toLowerCase(),v=T.get(w);v!==void 0&&(T.delete(w),s.up(v,{src:"user"}))}),window.addEventListener("blur",()=>{for(let M of l.values())M.key!==null&&s.up(M.key,{src:"user"});l.clear(),T.forEach(M=>s.up(M,{src:"user"})),T.clear()}),h.releaseAll=()=>{for(let M of l.values())M.key!==null&&(s.up(M.key,{src:"user"}),M.key=null)},h}var Yn="speechSynthesis"in window?window.speechSynthesis:null,we={on:!0,last:"",busy:!1},pr=null,fr="idle",La=null,Da=null,mr=0,Ia=new Map;function Tf(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0).toString(36)}we.load=function(){return fr!=="idle"?La:!window.fetch||location.protocol==="file:"?(fr="failed",La=Promise.resolve()):(fr="loading",La=Promise.all([fetch("voice-zh.json").then(i=>i.ok?i.json():Promise.reject(i.status)),fetch("voice-zh.bin").then(i=>i.ok?i.arrayBuffer():Promise.reject(i.status))]).then(([i,t])=>{pr={map:i.u,bin:t},fr="ready"}).catch(()=>{fr="failed"}),La)};we.has=i=>!!(pr&&pr.map[Tf("n|"+i)]);function Yh(){let i=Da;if(Da=null,i)try{i.onended=null,i.stop()}catch{}}function nc(i,t){i===mr&&(we.busy=!1,dt.duck(!1),Le.emit("voice",null),t&&t())}we.stop=function(){if(mr++,Yh(),Yn)try{Yn.cancel()}catch{}we.busy=!1,dt.duck(!1),Le.emit("voice",null)};we.say=function(i,t={}){if(!i)return;if(t.keep!==!1&&(we.last=i),Le.emit("subtitle",t.show===!1?null:t.text||i),!we.on){t.onend&&setTimeout(t.onend,300);return}let e=++mr;Promise.resolve().then(()=>{if(e===mr){if(fr==="loading"){let n=!1,s=()=>{n||(n=!0,Ef(i,e,t))};La.then(s),setTimeout(s,3500);return}Ef(i,e,t)}})};we.repeat=()=>we.say(we.last);function Ef(i,t,e){if(t!==mr)return;let n=pr&&pr.map[Tf("n|"+i)];n&&dt.ctx?Cv(i,n,t,e):wf(i,t,e)}function Cv(i,t,e,n){let s=dt.ctx,r=Ia.get(t[0]);(r?Promise.resolve(r):new Promise((o,l)=>{try{let c=s.decodeAudioData(pr.bin.slice(t[0],t[0]+t[1]),o,l);c&&c.catch&&c.catch(l)}catch(c){l(c)}})).then(o=>{if(r||(Ia.set(t[0],o),Ia.size>30&&Ia.delete(Ia.keys().next().value)),e!==mr)return;if(Yh(),Yn)try{Yn.cancel()}catch{}let l=s.createBufferSource(),c=s.createGain();c.gain.value=1.05,l.buffer=o,l.connect(c),c.connect(s.destination),l.onended=()=>{Da===l&&(Da=null,nc(e,n.onend))},Da=l,l.start(),we.busy=!0,dt.duck(!0),Le.emit("voice",i)}).catch(()=>wf(i,e,n))}var qh=null;function Rv(){if(qh||!Yn)return qh;let i=(Yn.getVoices()||[]).filter(e=>/^(zh|cmn)/i.test(e.lang||"")),t=e=>{let n=(e.name||"").toLowerCase(),s=0;return/xiaoxiao|ting-?ting|mei-?jia|yu-?shu|google/.test(n)&&(s+=6),/zh[-_]?cn/i.test(e.lang)&&(s+=3),e.localService&&(s+=1),s};return i.sort((e,n)=>t(n)-t(e)),qh=i[0]||null}function wf(i,t,e){if(!Yn){setTimeout(()=>nc(t,e.onend),600);return}Yh();try{Yn.cancel();let n=new SpeechSynthesisUtterance(i.replace(/do re mi/g,"\u54C6\u6765\u54AA"));n.lang="zh-CN",n.rate=.9,n.pitch=1.1;let s=Rv();s&&(n.voice=s);let r=!1,a=()=>{r||(r=!0,nc(t,e.onend))};n.onend=a,n.onerror=a,setTimeout(a,1200+i.length*330),we.busy=!0,dt.duck(!0),Le.emit("voice",i),Yn.speak(n)}catch{nc(t,e.onend)}}we.unlock=function(){if(!(!Yn||we._unlocked)){we._unlocked=!0;try{let i=new SpeechSynthesisUtterance(" ");i.volume=0,Yn.speak(i)}catch{}}};var Pv=[0,0,2,4,5,7,9,11];function Af(i,t=60){let e=[],n=0,s=0;for(let r of i.trim().split(/\s+/)){if(r==="|")continue;if(r==="/"){s++;continue}let a=/^([#b]?)([0-7])([',]*)([-_.]*)$/.exec(r);if(!a)throw new Error("bad note "+r);let[,o,l,c,h]=a,d=1,u=0,f=!1;for(let g of h)g==="_"?d/=2:g==="-"?u++:g==="."&&(f=!0);if(d=d*(f?1.5:1)+u,l!=="0"){let g=t+Pv[+l]+(o==="#"?1:o==="b"?-1:0);for(let _ of c)g+=_==="'"?12:-12;e.push({m:g,t:n,d,phrase:s})}n+=d}return{notes:e,length:n}}var Iv={C:0,D:2,E:4,F:5,G:7,A:9,B:11},Cf={"":[0,4,7],m:[0,3,7],7:[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11],dim:[0,3,6],sus4:[0,5,7]};function Lv(i){let t=/^([A-G])([#b]?)(.*)$/.exec(i);if(!t)return null;let e=(Iv[t[1]]+(t[2]==="#"?1:t[2]==="b"?-1:0)+12)%12,n=Cf[t[3]]||Cf[""];return{root:e,pcs:n.map(s=>(e+s)%12)}}var Rf=(i,t)=>t+((i-t)%12+12)%12;function Dv(i,t,e,n=0){let s=[],r=n;for(let a of i.trim().split(/\s+/)){if(a==="|"||a==="/")continue;let[o,l]=a.split(":"),c=l?+l:t,h=o==="_"?null:Lv(o);if(h){let d=Rf(h.root,38),u=h.pcs.slice(0,3).map(f=>Rf(f,48)).sort((f,g)=>f-g);for(let f=0;f<c;f+=e==="arp"?.5:1){let g=r+f,_=Math.abs(f%t)<1e-6;if(e==="block")f===0&&(s.push({m:d,t:g,d:c,v:.42}),u.forEach(m=>s.push({m,t:g,d:c,v:.3})));else if(e==="arp"){let m=[d,u[1]??d+7,u[2]??d+12,u[1]??d+7];s.push({m:m[Math.round(f*2)%4],t:g,d:.9,v:f===0?.42:.3})}else f===0||_?s.push({m:d,t:g,d:.95,v:.44}):u.forEach(m=>s.push({m,t:g,d:.7,v:.26}))}}r+=c}return s}function Nv(i){return i?Array.from(i.replace(/[\s，。、！？,.!?/|]/g,"")):[]}var Fv=[{id:"scale",title:"\u5F69\u8679\u97F3\u9636",emoji:"\u{1F308}",stars:1,bpm:84,beats:4,key:60,a:"#FF7A7A",b:"#A55EEA",tip:"\u4ECE do \u8D70\u5230\u9AD8\u97F3 do\uFF0C\u518D\u8D70\u56DE\u6765\uFF0C\u50CF\u722C\u4E00\u5EA7\u5F69\u8679\u697C\u68AF",mel:"1 2 3 4 | 5 6 7 1'- / 1' 7 6 5 | 4 3 2 1-",lyr:"\u54C6\u6765\u54AA\u53D1\u5506\u62C9\u897F\u54C6 \u54C6\u897F\u62C9\u5506\u53D1\u54AA\u6765\u54C6",chords:"C:4 G:3 C:2 / C:2 G:2 C:2 G:1 C:2",style:"block"},{id:"twinkle",title:"\u5C0F\u661F\u661F",emoji:"\u2B50",stars:1,bpm:92,beats:4,key:60,a:"#FFC94A",b:"#FF8A3D",mel:"1 1 5 5 | 6 6 5- / 4 4 3 3 | 2 2 1- / 5 5 4 4 | 3 3 2- / 5 5 4 4 | 3 3 2- / 1 1 5 5 | 6 6 5- / 4 4 3 3 | 2 2 1-",lyr:"\u4E00\u95EA\u4E00\u95EA\u4EAE\u6676\u6676 \u6EE1\u5929\u90FD\u662F\u5C0F\u661F\u661F \u6302\u5728\u5929\u4E0A\u653E\u5149\u660E \u597D\u50CF\u8BB8\u591A\u5C0F\u773C\u775B \u4E00\u95EA\u4E00\u95EA\u4EAE\u6676\u6676 \u6EE1\u5929\u90FD\u662F\u5C0F\u661F\u661F",chords:"C:2 C:2 F:2 C:2 / F:2 C:2 G:2 C:2 / C:2 F:2 C:2 G:2 / C:2 F:2 C:2 G:2 / C:2 C:2 F:2 C:2 / F:2 C:2 G:2 C:2",style:"arp"},{id:"bee",title:"\u5C0F\u871C\u8702",emoji:"\u{1F41D}",stars:1,bpm:100,beats:4,key:60,a:"#FFD43B",b:"#F59F00",mel:"5 3 3- | 4 2 2- | 1 2 3 4 | 5 5 5- / 5 3 3- | 4 2 2- | 1 3 5 5 | 3--- / 2 2 2 2 | 2 3 4- | 3 3 3 3 | 3 4 5- / 5 3 3- | 4 2 2- | 1 3 5 5 | 1---",lyr:"\u55E1\u55E1\u55E1\u55E1\u55E1\u55E1\u5927\u5BB6\u4E00\u8D77\u52E4\u505A\u5DE5 \u6765\u5306\u5306\u53BB\u5306\u5306\u505A\u5DE5\u5174\u5473\u6D53 \u5929\u6696\u82B1\u597D\u4E0D\u505A\u5DE5\u5C06\u6765\u54EA\u91CC\u597D\u8FC7\u51AC \u55E1\u55E1\u55E1\u55E1\u55E1\u55E1\u522B\u505A\u61D2\u60F0\u866B",chords:"C G7 C C / C G7 C C / G G7 C C / C G7 C C",style:"oom"},{id:"lamb",title:"\u739B\u4E3D\u6709\u53EA\u5C0F\u7F8A\u7F94",emoji:"\u{1F411}",stars:1,bpm:100,beats:4,key:60,a:"#9AD7FF",b:"#4D7CFE",mel:"3 2 1 2 | 3 3 3- | 2 2 2- | 3 5 5- / 3 2 1 2 | 3 3 3 3 | 2 2 3 2 | 1---",lyr:"\u739B\u4E3D\u6709\u53EA\u5C0F\u7F8A\u7F94\u5C0F\u7F8A\u7F94\u5C0F\u7F8A\u7F94 \u739B\u4E3D\u6709\u53EA\u5C0F\u7F8A\u7F94\u7F8A\u6BDB\u96EA\u4E00\u6837\u767D",chords:"C C G C / C C G C",style:"oom"},{id:"tigers",title:"\u4E24\u53EA\u8001\u864E",emoji:"\u{1F42F}",stars:2,bpm:112,beats:4,key:60,a:"#FFA94D",b:"#E8590C",mel:"1 2 3 1 | 1 2 3 1 / 3 4 5- | 3 4 5- / 5_ 6_ 5_ 4_ 3 1 | 5_ 6_ 5_ 4_ 3 1 / 1 5, 1- | 1 5, 1-",lyr:"\u4E24\u53EA\u8001\u864E\u4E24\u53EA\u8001\u864E \u8DD1\u5F97\u5FEB\u8DD1\u5F97\u5FEB \u4E00\u53EA\u6CA1\u6709\u8033\u6735\u4E00\u53EA\u6CA1\u6709\u5C3E\u5DF4 \u771F\u5947\u602A\u771F\u5947\u602A",chords:"C C / C C / C C / C:1 G:1 C:2 C:1 G:1 C:2",style:"oom"},{id:"joy",title:"\u6B22\u4E50\u9882",emoji:"\u{1F389}",stars:2,bpm:104,beats:4,key:60,a:"#63E6BE",b:"#12B886",tip:"\u8D1D\u591A\u82AC\u5199\u7684\uFF0C\u5168\u4E16\u754C\u7684\u4EBA\u90FD\u4F1A\u5531",mel:"3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3. 2_ 2- / 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2. 1_ 1- / 2 2 3 1 | 2 3_ 4_ 3 1 | 2 3_ 4_ 3 2 | 1 2 5,- / 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2. 1_ 1-",chords:"C G C C:2 G:2 / C G C G:2 C:2 / G:2 C:2 G:2 C:2 G:2 C:1 G:1 C:1 G:3 / C G C G:2 C:2",style:"arp"},{id:"newyear",title:"\u65B0\u5E74\u597D",emoji:"\u{1F9E8}",stars:2,bpm:132,beats:3,key:60,a:"#FF6B6B",b:"#C92A2A",mel:"1_ 1_ 1 5, | 3_ 3_ 3 1 / 1_ 3_ 5 5 | 4_ 3_ 2- / 2_ 3_ 4 4 | 3_ 2_ 3 1 / 1_ 3_ 2 5, | 7,_ 2_ 1-",lyr:"\u65B0\u5E74\u597D\u5440\u65B0\u5E74\u597D\u5440 \u795D\u8D3A\u5927\u5BB6\u65B0\u5E74\u597D \u6211\u4EEC\u5531\u6B4C\u6211\u4EEC\u8DF3\u821E \u795D\u8D3A\u5927\u5BB6\u65B0\u5E74\u597D",chords:"C C / C G / G7 C / C:1 G:2 G:1 C:2",style:"oom"},{id:"london",title:"\u4F26\u6566\u6865",emoji:"\u{1F309}",stars:2,bpm:104,beats:4,key:60,a:"#91A7FF",b:"#5C7CFA",mel:"5. 6_ 5 4 | 3 4 5- | 2 3 4- | 3 4 5- / 5. 6_ 5 4 | 3 4 5- | 2- 5- | 3 1--",lyr:"\u4F26\u6566\u5927\u6865\u57AE\u4E0B\u6765\u57AE\u4E0B\u6765\u57AE\u4E0B\u6765 \u4F26\u6566\u5927\u6865\u57AE\u4E0B\u6765\u5FEB\u6765\u4FEE\u597D",chords:"C C G C / C C G C",style:"oom"},{id:"painter",title:"\u7C89\u5237\u5320",emoji:"\u{1F58C}\uFE0F",stars:2,bpm:108,beats:2,key:60,a:"#F783AC",b:"#D6336C",mel:"5_ 3_ 5_ 3_ | 5_ 3_ 1 | 2_ 4_ 3_ 2_ | 5- / 5_ 3_ 5_ 3_ | 5_ 3_ 1 | 2_ 4_ 3_ 2_ | 1- / 2_ 2_ 4_ 4_ | 3_ 1_ 5 | 2_ 4_ 3_ 2_ | 5- / 5_ 3_ 5_ 3_ | 5_ 3_ 1 | 2_ 4_ 3_ 2_ | 1-",lyr:"\u6211\u662F\u4E00\u4E2A\u7C89\u5237\u5320\u7C89\u5237\u672C\u9886\u5F3A \u6211\u8981\u628A\u90A3\u65B0\u623F\u5B50\u5237\u5F97\u5F88\u6F02\u4EAE \u5237\u4E86\u623F\u9876\u53C8\u5237\u5899\u5237\u5B50\u98DE\u821E\u5FD9 \u54CE\u5440\u6211\u7684\u5C0F\u9F3B\u5B50\u53D8\u5440\u53D8\u4E86\u6837",chords:"C C G G / C C G C / G7 C G G / C C G C",style:"oom"},{id:"jingle",title:"\u94C3\u513F\u54CD\u53EE\u5F53",emoji:"\u{1F514}",stars:3,bpm:126,beats:4,key:60,a:"#74C0FC",b:"#1C7ED6",mel:"3 3 3- | 3 3 3- | 3 5 1. 2_ | 3--- / 4 4 4. 4_ | 4 3 3 3_ 3_ | 3 2 2 1 | 2- 5- / 3 3 3- | 3 3 3- | 3 5 1. 2_ | 3--- / 4 4 4 4 | 4 3 3 3_ 3_ | 5 5 4 2 | 1---",lyr:"\u53EE\u53EE\u5F53\u53EE\u53EE\u5F53\u94C3\u513F\u54CD\u53EE\u5F53 \u6211\u4EEC\u6ED1\u96EA\u591A\u5FEB\u4E50\u6211\u4EEC\u5750\u5728\u96EA\u6A47\u4E0A\u563F \u53EE\u53EE\u5F53\u53EE\u53EE\u5F53\u94C3\u513F\u54CD\u53EE\u5F53 \u6211\u4EEC\u6ED1\u96EA\u591A\u5FEB\u4E50\u6211\u4EEC\u5750\u5728\u96EA\u6A47\u4E0A",chords:"C C C C / F C D7 G7 / C C C C / F C G7 C",style:"oom"},{id:"birthday",title:"\u751F\u65E5\u5FEB\u4E50",emoji:"\u{1F382}",stars:3,bpm:100,beats:3,key:60,a:"#FFB4D2",b:"#E64980",mel:"5,. 5,_ | 6, 5, 1 | 7,- / 5,. 5,_ | 6, 5, 2 | 1- / 5,. 5,_ | 5 3 1 | 7, 6, / 4. 4_ | 3 1 2 | 1--",lyr:"\u795D\u4F60\u751F\u65E5\u5FEB\u4E50 \u795D\u4F60\u751F\u65E5\u5FEB\u4E50 \u795D\u4F60\u751F\u65E5\u5FEB\u4E50~ \u795D\u4F60\u751F\u65E5\u5FEB\u4E50",chords:"_:1 C:3 G:2 / G:4 C:2 / C:4 F:2 / F:1 C:2 G:1 C:3",style:"oom"},{id:"xmas",title:"\u5723\u8BDE\u5FEB\u4E50",emoji:"\u{1F384}",stars:3,bpm:132,beats:3,key:60,a:"#69DB7C",b:"#2B8A3E",mel:"5, | 1 1_ 2_ 1_ 7,_ | 6, 6, / 6, | 2 2_ 3_ 2_ 1_ | 7, 5, / 5, | 3 3_ 4_ 3_ 2_ | 1 6, / 5,_ 5,_ | 6, 2 7, | 1--",lyr:"\u6211\u4EEC\u795D\u4F60\u5723\u8BDE\u5FEB\u4E50 \u6211\u4EEC\u795D\u4F60\u5723\u8BDE\u5FEB\u4E50 \u6211\u4EEC\u795D\u4F60\u5723\u8BDE\u5FEB\u4E50 \u795D\u4F60\u65B0\u5E74\u5FEB\u4E50",chords:"_:1 C:3 F:2 / F:1 D7:3 G:2 / G:1 C:3 Am:2 / Am:1 F:1 G:2 C:3",style:"oom"},{id:"farewell",title:"\u9001\u522B",emoji:"\u{1F305}",stars:3,bpm:76,beats:4,key:60,a:"#FFC078",b:"#E8590C",tip:"\u957F\u4EAD\u5916\uFF0C\u53E4\u9053\u8FB9\u2014\u2014\u4E00\u767E\u591A\u5E74\u524D\u7684\u8001\u6B4C",mel:"5 3_ 5_ 1'- | 6 1'_ 6_ 5- | 5 1_ 2_ 3 2_ 1_ | 2--- / 5 3_ 5_ 1'. 7_ | 6 1' 5- | 5 2_ 3_ 4. 7,_ | 1--- / 6 1' 1'- | 7 6_ 7_ 1'- | 6_ 7_ 1'_ 6_ 6_ 5_ 3_ 1_ | 2--- / 5 3_ 5_ 1'. 7_ | 6 1' 5- | 5 2_ 3_ 4. 7,_ | 1---",lyr:"\u957F\u4EAD~\u5916\u53E4\u9053~\u8FB9\u82B3\u8349~\u78A7\u8FDE~\u5929 \u665A\u98CE~\u62C2\u67F3\u7B1B\u58F0\u6B8B\u5915\u9633~\u5C71\u5916\u5C71 \u5929\u4E4B\u6DAF\u5730\u4E4B~\u89D2\u77E5~\u4EA4~\u534A~\u96F6~\u843D \u4E00\u58F6~\u6D4A\u9152\u5C3D\u4F59\u6B22\u4ECA\u5BB5~\u522B\u68A6\u5BD2",chords:"C F:2 C:2 C G / C F:2 C:2 G C / F G:2 C:2 F:2 C:2 G / C F:2 C:2 G C",style:"arp"},{id:"elise",title:"\u81F4\u7231\u4E3D\u4E1D",emoji:"\u{1F339}",stars:3,bpm:176,beats:3,key:60,a:"#E599F7",b:"#9C36B5",listenOnly:!0,tip:"\u8D1D\u591A\u82AC\u5199\u7ED9\u4E00\u4F4D\u670B\u53CB\u7684\u5C0F\u66F2",mel:"3'_ #2'_ | 3'_ #2'_ 3'_ 7_ 2'_ 1'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ #5_ 7_ | 1' 0_ 3_ 3'_ #2'_ | 3'_ #2'_ 3'_ 7_ 2'_ 1'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ 1'_ 7_ | 6 0 3'_ #2'_ | 3'_ #2'_ 3'_ 7_ 2'_ 1'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ #5_ 7_ | 1' 0_ 3_ 3'_ #2'_ | 3'_ #2'_ 3'_ 7_ 2'_ 1'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ 1'_ 7_ | 6 0_ 7_ 1'_ 2'_ | 3'. 5_ 4'_ 3'_ | 2'. 4_ 3'_ 2'_ | 1'. 3_ 2'_ 1'_ | 7 0_ 3_ 3'_ #2'_ | 3'_ #2'_ 3'_ #2'_ 3'_ #2'_ | 3'_ #2'_ 3'_ 7_ 2'_ 1'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ #5_ 7_ | 1' 0_ 3_ 3'_ #2'_ | 3'_ #2'_ 3'_ 7_ 2'_ 1'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ 1'_ 7_ | 6--",lh:"0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 1,_ 5,_ 1_ 0_ 0 | 5,,_ 5,_ 7,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ 3_ 0_ 0 | 0-- | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,-"},{id:"minuet",title:"\u5C0F\u6B65\u821E\u66F2",emoji:"\u{1F483}",stars:3,bpm:132,beats:3,key:67,a:"#A5D8FF",b:"#4263EB",listenOnly:!0,tip:"\u4E09\u767E\u5E74\u524D\u7684\u821E\u66F2\uFF0C\u4E00\u4E8C\u4E09\uFF0C\u4E00\u4E8C\u4E09",mel:"5 1_ 2_ 3_ 4_ | 5 1 1 | 6 4_ 5_ 6_ 7_ | 1' 1 1 | 4 5_ 4_ 3_ 2_ | 3 4_ 3_ 2_ 1_ | 7, 1_ 2_ 3_ 1_ | 2-- / 5 1_ 2_ 3_ 4_ | 5 1 1 | 6 4_ 5_ 6_ 7_ | 1' 1 1 | 4 5_ 4_ 3_ 2_ | 3 4_ 3_ 2_ 1_ | 2 3_ 2_ 1_ 7,_ | 1--",lh:"1,- 2, | 3,-- | 4,-- | 3,-- | 2,-- | 1,-- | 5, 3, 1, | 5, 5,, 4, / 1,- 2, | 3,-- | 4,-- | 3,-- | 2,-- | 1,-- | 5,- 5,, | 1,- 1,,"},{id:"canon",title:"\u5361\u519C",emoji:"\u{1F54A}\uFE0F",stars:3,bpm:72,beats:4,key:62,a:"#FFD8A8",b:"#F08C00",listenOnly:!0,tip:"\u5E15\u8D6B\u8D1D\u5C14\u7684\u5361\u519C\uFF1A\u4F4E\u97F3\u4E00\u76F4\u5728\u8F6C\u5708\uFF0C\u4E0A\u9762\u7684\u65CB\u5F8B\u4E00\u5C42\u4E00\u5C42\u53E0\u4E0A\u53BB",mel:"0--- | 0--- | 0--- | 0--- / 3'- 2'- | 1'- 7- | 6- 5- | 6- 7- | 3'- 2'- | 1'- 7- | 6- 5- | 6- 7- / 1' 3' 5' 4' | 3' 1' 3' 2' | 1' 6 1' 5' | 4' 6' 5' 4' | 1' 3' 5' 4' | 3' 1' 3' 2' | 1' 6 1' 5' | 4' 6' 5' 4' / 3'--- | 3'---",chords:"D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 / D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 / D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 / D:8",style:"arp"}],ic=Fv.map(i=>{let{notes:t,length:e}=Af(i.mel,i.key),n=Nv(i.lyr),s=0;t.forEach((l,c)=>{if(!n.length)return;let h=n[s++];l.lyric=h==="~"?"":h||""});let r=[];t.forEach((l,c)=>{(r[l.phrase]||(r[l.phrase]=[])).push(c)});let a=[];i.lh?a=Af(i.lh,i.key).notes.map(l=>({m:l.m,t:l.t,d:l.d,v:.45})):i.chords&&(a=Dv(i.chords,i.beats,i.style));let o=t.map(l=>l.m);return Object.assign({},i,{notes:t,length:e,acc:a,phrases:r.filter(Boolean),lo:Math.min(...o),hi:Math.max(...o),spb:60/i.bpm})}),Pf=i=>ic.find(t=>t.id===i);var Uv=["\u7EA2","\u6A59","\u9EC4","\u7EFF","\u9752","\u84DD","\u7D2B"],Ov={piano:"\u94A2\u7434",musicbox:"\u516B\u97F3\u76D2",marimba:"\u6728\u7434",chip:"\u6E38\u620F\u673A"},sc=[{id:"black",zh:"\u7ECF\u5178\u9ED1",hex:"#16161C"},{id:"white",zh:"\u8C61\u7259\u767D",hex:"#F3EEE4"},{id:"pink",zh:"\u6A31\u82B1\u7C89",hex:"#F6B3C6"},{id:"sky",zh:"\u5929\u7A7A\u84DD",hex:"#8CC4FF"},{id:"mint",zh:"\u8584\u8377\u7EFF",hex:"#8FDDBD"},{id:"lemon",zh:"\u67E0\u6AAC\u9EC4",hex:"#FFE184"},{id:"lilac",zh:"\u85B0\u8863\u8349\u7D2B",hex:"#C4B0F4"},{id:"cherry",zh:"\u6A31\u6843\u7EA2",hex:"#E0484F"},{id:"night",zh:"\u661F\u7A7A\u84DD",hex:"#203080"}],Bv=["\u9CB8\u9C7C","\u5927\u8C61","\u5C0F\u718A","\u5C0F\u72D7","\u5C0F\u732B","\u5C0F\u5154","\u5C0F\u9E1F","\u5C0F\u871C\u8702"],oe={welcome:"\u4F60\u597D\u5440\uFF01\u6211\u662F\u5F69\u8679\u94A2\u7434\u3002\u4E03\u4E2A\u97F3\uFF0C\u6709\u4E03\u79CD\u989C\u8272\u3002\u6478\u6478\u6211\u7684\u7434\u952E\u5427\uFF01",welcomeBack:"\u6B22\u8FCE\u56DE\u6765\uFF01\u6478\u6478\u7434\u952E\u5427\u3002",idle:"\u7528\u624B\u6307\u70B9\u4E00\u70B9\u7434\u952E\uFF0C\u6216\u8005\u5728\u7434\u952E\u4E0A\u6ED1\u4E00\u6ED1\u3002",free:"\u81EA\u5DF1\u5F39\uFF1A\u60F3\u5F39\u54EA\u91CC\u5C31\u5F39\u54EA\u91CC\u3002\u624B\u6307\u5728\u7434\u952E\u4E0A\u6ED1\u4E00\u4E0B\uFF0C\u4F1A\u6709\u5F69\u8679\u54E6\uFF01",rainbow:"\u54C7\uFF0C\u5F69\u8679\uFF01",inst:i=>`\u8FD9\u662F${Ov[i]}\uFF01`,night:"\u5929\u9ED1\u5566\uFF0C\u7434\u952E\u4F1A\u53D1\u5149\u54E6\u3002",day:"\u5929\u4EAE\u5566\u3002",paint:i=>`\u94A2\u7434\u53D8\u6210${i.zh}\u5566\uFF01`,register:(i,t)=>`\u8FD9\u91CC\u662F${Bv[i]}\u7684\u5BB6\uFF0C\u58F0\u97F3${t?"\u9AD8\u9AD8\u7684":"\u4F4E\u4F4E\u7684"}\u3002`,view:"\u7528\u624B\u6307\u8F6C\u4E00\u8F6C\u94A2\u7434\uFF0C\u770B\u770B\u5B83\u91CC\u9762\u3002",play:"\u5750\u56DE\u94A2\u7434\u524D\u9762\u5566\u3002",pedalOn:"\u8E29\u4E0B\u8E0F\u677F\uFF0C\u58F0\u97F3\u4F1A\u53D8\u5F97\u957F\u957F\u7684\u3002",pedalOff:"\u677E\u5F00\u8E0F\u677F\u3002",recStart:"\u5F00\u59CB\u5F55\u97F3\u5566\uFF0C\u5F39\u5427\uFF01\u5F39\u5B8C\u518D\u70B9\u4E00\u4E0B\u3002",recStop:"\u5F55\u597D\u5566\uFF01\u70B9\u201C\u542C\u6211\u7684\u201D\uFF0C\u94A2\u7434\u4F1A\u81EA\u5DF1\u5F39\u7ED9\u4F60\u542C\u3002",recEmpty:"\u8FD8\u6CA1\u6709\u5F39\u5462\uFF0C\u5148\u5F39\u51E0\u4E2A\u97F3\u5427\u3002",recPlay:"\u8FD9\u662F\u4F60\u5F39\u7684\u54E6\uFF01",learnPick:"\u9009\u4E00\u9996\u6B4C\uFF0C\u6211\u4EEC\u4E00\u8D77\u5F39\u3002",learnStart:i=>`\u6211\u4EEC\u6765\u5F39\u300A${i.title}\u300B\u3002\u6309\u4EAE\u8D77\u6765\u7684\u90A3\u4E2A\u952E\u3002`,learnPhrase:["\u771F\u68D2\uFF01","\u5F39\u5F97\u771F\u597D\uFF01","\u597D\u542C\uFF01","\u5BF9\u5566\uFF0C\u63A5\u7740\u5F39\uFF01","\u592A\u5389\u5BB3\u4E86\uFF01"],learnWrong:i=>`\u627E\u4E00\u627E${Uv[i]}\u8272\u7684\u90A3\u4E2A\u952E\u3002`,learnListen:"\u5148\u542C\u6211\u5F39\u4E00\u904D\u3002",learnYour:"\u8BE5\u4F60\u5566\u3002",learnDone:i=>`\u4F60\u5F39\u5B8C\u4E86\u300A${i.title}\u300B\uFF01\u542C\u4E00\u542C\uFF0C\u4F60\u5F39\u7684\u5C31\u662F\u8FD9\u9996\u6B4C\u3002`,learnAgain:"\u518D\u5F39\u4E00\u6B21\u5417\uFF1F\u8FD8\u662F\u6362\u4E00\u9996\uFF1F",listenPick:"\u9009\u4E00\u9996\uFF0C\u94A2\u7434\u81EA\u5DF1\u5F39\u7ED9\u4F60\u542C\u3002",listenStart:i=>`\u5618\uFF0C\u97F3\u4E50\u4F1A\u5F00\u59CB\u5566\u3002\u300A${i.title}\u300B\u3002`,listenEnd:"\u5F39\u5B8C\u5566\uFF01\u7ED9\u94A2\u7434\u62CD\u62CD\u624B\u5427\u3002",echoIntro:"\u5C0F\u9E1F\u5531\u51E0\u4E2A\u97F3\uFF0C\u4F60\u6765\u5B66\u4E00\u5B66\u3002\u5148\u542C\u54E6\u3002",echoYour:"\u8BE5\u4F60\u5566\uFF01",echoGood:["\u5B66\u5F97\u771F\u50CF\uFF01","\u5BF9\u5566\uFF01","\u4F60\u7684\u8033\u6735\u771F\u7075\uFF01","\u4E00\u6A21\u4E00\u6837\uFF01"],echoAgain:"\u5C0F\u9E1F\u518D\u5531\u4E00\u904D\uFF0C\u4ED4\u7EC6\u542C\u3002",echoMore:"\u5C0F\u9E1F\u8981\u5531\u66F4\u591A\u7684\u97F3\u5566\uFF01",echoWin:"\u4F60\u628A\u5C0F\u9E1F\u7684\u6B4C\u5168\u5B66\u4F1A\u5566\uFF01"};function If(i){let t=i.sheetCanvas,e=t.getContext("2d"),n=t.width,s=t.height,r={labels:"solfege"};function a(){e.clearRect(0,0,n,s);let d=e.createLinearGradient(0,0,0,s);d.addColorStop(0,"#FFFDF8"),d.addColorStop(1,"#F6EFE3"),e.fillStyle=d,e.fillRect(0,0,n,s),e.strokeStyle="rgba(120,100,80,.10)",e.lineWidth=3;for(let u=0;u<5;u++){let f=470+u*34;e.beginPath(),e.moveTo(80,f),e.lineTo(n-80,f),e.stroke()}e.strokeStyle="rgba(120,100,80,.18)",e.lineWidth=6,e.strokeRect(18,18,n-36,s-36)}function o(d){if($e(d))return"\u266F";let u=Mn(d);return r.labels==="number"?String(u+1):r.labels==="letter"?"CDEFGAB"[u]:or[u]}function l(d,u){e.fillStyle="#3B2F4A",e.textAlign="center",e.textBaseline="middle",e.font='800 92px "PingFang SC","Hiragino Sans GB",sans-serif',e.fillText(d,n/2,110),u&&(e.font='600 46px "PingFang SC",sans-serif',e.fillStyle="rgba(59,47,74,.55)",e.fillText(u,n/2,182))}function c(d,u,f,g,_){let m=lr(g);e.save(),_==="done"&&(e.globalAlpha=.35),_==="now"&&(e.shadowColor=m,e.shadowBlur=60),e.fillStyle=m,e.beginPath(),e.arc(d,u,f,0,Math.PI*2),e.fill(),e.shadowBlur=0;let p=e.createRadialGradient(d-f*.35,u-f*.4,f*.05,d-f*.3,u-f*.35,f*.75);p.addColorStop(0,"rgba(255,255,255,.75)"),p.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=p,e.beginPath(),e.arc(d,u,f,0,Math.PI*2),e.fill(),_==="now"&&(e.lineWidth=12,e.strokeStyle="#fff",e.beginPath(),e.arc(d,u,f+14,0,Math.PI*2),e.stroke(),e.lineWidth=6,e.strokeStyle=m,e.beginPath(),e.arc(d,u,f+24,0,Math.PI*2),e.stroke());let E=o(g);e.fillStyle=Mn(g)===2?"#5B4300":"#fff",e.font=`800 ${Math.round(f*(E.length>2?.62:.8))}px "Arial Rounded MT Bold","Avenir Next",sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(E,d,u+f*.05),e.restore()}let h={setLabels(d){r.labels=d},idle(){a(),l("\u5F69\u8679\u94A2\u7434","\u4E03\u4E2A\u97F3\uFF0C\u4E03\u79CD\u989C\u8272"),[60,62,64,65,67,69,71].forEach((u,f)=>c(n/2+(f-3)*210,520-f*18,70,u,"")),i.sheetTex.needsUpdate=!0},song(d,u,f={}){a();let g=d.phrases.find(M=>M.includes(u))||d.phrases[d.phrases.length-1],_=d.phrases.indexOf(g);l(`${d.emoji} ${d.title}`,d.phrases.length>1?`\u7B2C ${_+1} \u53E5\uFF0C\u5171 ${d.phrases.length} \u53E5`:"");let m=g.length,p=Math.min(190,(n-220)/Math.max(1,m-1)),E=Math.min(70,p*.42),R=n/2-p*(m-1)/2,S=Math.min(...g.map(M=>d.notes[M].m)),T=Math.max(...g.map(M=>d.notes[M].m));g.forEach((M,w)=>{let v=d.notes[M],A=560-(T>S?(v.m-S)/(T-S):.5)*170,L=M<u?"done":M===u?"now":"";c(R+w*p,A,L==="now"?E*1.12:E,v.m,L),v.lyric&&(e.fillStyle=L==="done"?"rgba(59,47,74,.35)":"#3B2F4A",e.font=`700 ${Math.round(Math.min(64,p*.48))}px "PingFang SC",sans-serif`,e.textAlign="center",e.fillText(v.lyric,R+w*p,718))}),i.sheetTex.needsUpdate=!0},concert(d,u){a(),e.font='160px "Apple Color Emoji","Segoe UI Emoji",sans-serif',e.textAlign="center",e.textBaseline="middle",e.fillText(d.emoji,n/2,300),l(d.title,d.tip||""),e.fillStyle="rgba(59,47,74,.1)",e.fillRect(260,640,n-520,22);let f=e.createLinearGradient(260,0,n-260,0);dn.forEach((g,_)=>f.addColorStop(_/6,g)),e.fillStyle=f,e.fillRect(260,640,(n-520)*u,22),i.sheetTex.needsUpdate=!0},echo(d,u,f){a(),l("\u{1F426} \u5B66\u5C0F\u9E1F",f?"\u5C0F\u9E1F\u5728\u5531\u2026":"\u8BE5\u4F60\u5566\uFF01");let g=d.length,_=230,m=n/2-_*(g-1)/2;d.forEach((p,E)=>{f||E<u?c(m+E*_,520,80,p,(E<u,"")):(e.strokeStyle="rgba(59,47,74,.25)",e.lineWidth=10,e.setLineDash([22,18]),e.beginPath(),e.arc(m+E*_,520,80,0,Math.PI*2),e.stroke(),e.setLineDash([]),e.fillStyle="rgba(59,47,74,.3)",e.font="800 90px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("?",m+E*_,525))}),i.sheetTex.needsUpdate=!0}};return h.idle(),h}var Zh=new Map;function zv(i){if(Zh.has(i))return Zh.get(i);let t=document.createElement("canvas");t.width=t.height=256;let e=t.getContext("2d"),n=e.createRadialGradient(128,128,30,128,128,128);n.addColorStop(0,i+"cc"),n.addColorStop(.5,i+"44"),n.addColorStop(1,i+"00"),e.fillStyle=n,e.fillRect(0,0,256,256),e.fillStyle=i,e.beginPath(),e.arc(128,128,62,0,Math.PI*2),e.fill();let s=e.createRadialGradient(104,100,4,110,108,58);s.addColorStop(0,"rgba(255,255,255,.95)"),s.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=s,e.beginPath(),e.arc(128,128,62,0,Math.PI*2),e.fill(),e.lineWidth=8,e.strokeStyle="rgba(255,255,255,.9)",e.beginPath(),e.arc(128,128,62,0,Math.PI*2),e.stroke();let r=new ze(t);return r.colorSpace=_e,Zh.set(i,r),r}function Lf(i,t){let n=[];for(let d=0;d<2;d++){let u=new Ii(new xi({transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1}));u.visible=!1,u.renderOrder=9,i.add(u),n.push({s:u,m:null,pos:new I,goal:new I,a:0,aGoal:0,size:0})}let s=(()=>{let d=document.createElement("canvas");d.width=d.height=128;let u=d.getContext("2d");u.fillStyle="#fff",u.strokeStyle="rgba(43,33,64,.35)",u.lineWidth=6,u.beginPath(),u.moveTo(64,112),u.lineTo(20,52),u.lineTo(46,52),u.lineTo(46,12),u.lineTo(82,12),u.lineTo(82,52),u.lineTo(108,52),u.closePath(),u.fill(),u.stroke();let f=new ze(d);return f.colorSpace=_e,f})(),r=new Ii(new xi({map:s,transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1}));r.visible=!1,r.renderOrder=10,i.add(r);let a=new I,o=1,l=!1,c=0;function h(d,u,f){return t.keyFront(u,f),f.z-=.03,f.y+=.024*o+d*.06*o,f.z-=d*.035*o,f}return{set(d,u=1){o=u,l=d.length>0;let f=n.map(g=>g.m);if(f[1]!==null&&f[1]===d[0]&&f[0]!==null){let g=n.shift();g.a=0,g.s.visible=!1,n.push(g),g.m=null}n.forEach((g,_)=>{let m=d[_];if(m===void 0){g.aGoal=0;return}g.m!==m&&(g.m=m,g.s.material.map=zv("#"+Ke(m).getHexString()),g.s.material.needsUpdate=!0,h(_+2,m,g.pos),g.a=0),h(_,m,g.goal),g.aGoal=_===0?1:.7,g.size=(_===0?.05:.032)*o,g.s.visible=!0})},get current(){return l?n[0].m:null},pulse(){n[0].bump=1},clear(){l=!1,n.forEach(d=>{d.aGoal=0,d.m=null})},update(d){c+=d,n.forEach((f,g)=>{if(f.pos.set(Re(f.pos.x,f.goal.x,9,d),Re(f.pos.y,f.goal.y,9,d),Re(f.pos.z,f.goal.z,9,d)),f.a=Re(f.a,f.aGoal,7,d),f.a<.01&&f.aGoal===0){f.s.visible=!1;return}f.bump=Math.max(0,(f.bump||0)-d*3);let _=g===0?Math.abs(Math.sin(c*4.2))*.007*o:Math.sin(c*2+g)*.003*o;f.s.position.copy(f.pos),f.s.position.y+=_;let m=f.size*(1+(f.bump||0)*.5);f.s.scale.set(m,m,1),f.s.material.opacity=f.a});let u=n[0];l&&u.m!==null&&u.a>.3?(r.visible=!0,r.position.copy(u.s.position),r.position.y+=.034*o+Math.abs(Math.sin(c*4.2))*.006*o,r.scale.set(.022*o,.022*o,1),r.material.opacity=u.a):r.visible=!1}}}function Df(i){let{stage:t,piano:e,rig:n,fx:s,player:r,input:a,camera:o}=i,l=If(e),c=Lf(t.scene,e);Mi.add(y=>c.update(y));let h=Object.assign({inst:"piano",paint:"black",night:!1,labels:"solfege",keys:"m",accomp:!0,sound:!0,voice:!0,fx:"full",names:!0},rn.get("prefs",{}));try{let y=JSON.parse(localStorage.getItem("logicc.design.v2")||"null");y&&!rn.get("prefs",null)&&(typeof y.voi=="boolean"&&(h.voice=y.voi),typeof y.snd=="boolean"&&(h.sound=y.snd))}catch{}let d=()=>rn.set("prefs",h),u={xl:112,l:92,m:74,s:52},f=y=>y==="all"?53:he(Math.round((window.innerWidth||1024)/u[y||"m"]),7,52),g=new Proxy({},{get:(y,P)=>f(P)});window.addEventListener("resize",()=>{n.mode==="play"&&At.name!=="learn"&&n.setSpan(f(h.keys))});let _=rn.get("done",{});dt.on=h.sound,we.on=h.voice,dt.inst=h.inst,s.style=h.inst,s.names=h.names,s.quiet=s.quiet||h.fx==="less",e.setLabels(h.labels),l.setLabels(h.labels==="none"||h.labels==="color"?"solfege":h.labels),e.setColor((sc.find(y=>y.id===h.paint)||sc[0]).hex,!0),n.setSpan(g[h.keys]||15);let m={bar:mt("#ldBar"),msg:mt("#ldMsg")};dt.init();let p=dt.load("./",y=>{m.bar.style.width=8+y*92+"%",y>.3&&(m.msg.textContent="\u6B63\u5728\u7ED9\u7434\u5F26\u8C03\u97F3\u2026")}).catch(()=>{m.msg.textContent="\u94A2\u7434\u7684\u58F0\u97F3\u6CA1\u4E0B\u8F7D\u4E0B\u6765\uFF0C\u5148\u7528\u7535\u5B50\u7434\u7684\u58F0\u97F3"});we.load(),Promise.race([p,new Promise(y=>setTimeout(y,6e3))]).then(()=>ye(250,()=>{mt("#loader").classList.add("gone"),Y()}));let R=mt("#hud"),S=0;Le.on("subtitle",y=>{let P=mt("#bubble");if(!y)return;let X=0;["#top","#nav","#lesson","#score","#concert","#echo"].forEach(B=>{let U=mt(B);U&&!U.hidden&&U.offsetParent!==null&&(X=Math.max(X,U.getBoundingClientRect().bottom))}),P.style.top=X+10+"px",P.textContent=y,P.classList.add("on"),clearTimeout(S),S=setTimeout(()=>P.classList.remove("on"),1600+y.length*230)});function T(y,P){we.say(y,P)}function M(y){let P=mt("#toast");P.textContent=y,P.classList.add("on"),clearTimeout(P._t),P._t=setTimeout(()=>P.classList.remove("on"),1800)}function w(y){y.classList.add("press"),setTimeout(()=>y.classList.remove("press"),140)}function v(y=0){dt.ui("tap",y)}let A=new I,L=new I(0,1.25,-.6);function O(y,P,X=0){let B=hn("div","cheer");B.innerHTML=`<div class="big">${y}</div><div class="t">${P}</div>`+(X?`<div class="stars">${"\u2B50".repeat(X).split("").map((G,it)=>`<span style="animation-delay:${.25+it*.18}s">${G}</span>`).join("")}</div>`:""),document.body.appendChild(B),setTimeout(()=>B.remove(),3300);let U=o.position,st=new I;o.getWorldDirection(st);let N=U.clone().addScaledVector(st,n.mode==="play"?.5:2.2),Z=n.mode==="play"?.35:1;for(let G=0;G<5;G++)ye(G*260,()=>{let it=N.clone().add(new I(te(-.6,.6)*Z*2,te(.1,.5)*Z*2,te(-.3,.3)*Z));s.firework(it,Ke(60+[0,4,7,12,16][G]),Z)});s.confetti(N,110,Z*1.3),dt.chord([60,64,67,72],{inst:"musicbox",spread:.07,vel:.6,dur:1.5}),ye(420,()=>dt.chord([67,72,76,79],{inst:"musicbox",spread:.06,vel:.55,dur:2}))}let V=mt("#mini"),J=mt("#miniKeys"),z=mt("#miniWin"),W=mt("#miniAnimals"),nt={};for(let y=Je;y<=qn;y++){let P=hn("i",$e(y)?"b":y===Zl?"c4":"");if($e(y)){let X=(je(y)+xt.HALF)/(2*xt.HALF);P.style.left=`calc(${X*100}% - 0.7%)`,P.style.width="1.4%"}else{let X=os(y);P.style.left=X/xt.N_WHITE*100+"%",P.style.width=100/xt.N_WHITE+"%"}J.appendChild(P),nt[y]=P}Jl.forEach((y,P)=>{let X=(je(Math.min(y.to,Math.max(y.from,y.from+6)))+xt.HALF)/(2*xt.HALF),B=hn("span",null,y.e);B.style.left=X*100+"%",B.dataset.i=P,W.appendChild(B)}),Le.on("note",y=>{let P=nt[y];P&&(P.style.setProperty("--c",lr(y)),P.classList.add("lit"),clearTimeout(P._t),P._t=setTimeout(()=>P.classList.remove("lit"),260))});let j=-1;Mi.add(()=>{let[y,P]=n.visibleRange(),X=V.clientWidth-16;z.style.left=8+he(y,0,xt.N_WHITE)/xt.N_WHITE*X+"px",z.style.width=Math.max(8,(he(P,0,xt.N_WHITE)-he(y,0,xt.N_WHITE))/xt.N_WHITE*X)+"px";let B=n.cx,U=0;Jl.forEach((st,N)=>{B>=je(st.from)-xt.W/2&&(U=N)}),U!==j&&(ci("#miniAnimals span").forEach((st,N)=>st.classList.toggle("here",N===U)),j=U)});function ht(y){let P=J.getBoundingClientRect(),X=he((y-P.left)/P.width,0,1);n.lookAtX(X*2*xt.HALF-xt.HALF)}let tt=null;V.addEventListener("pointerdown",y=>{tt={x:y.clientX},V.setPointerCapture(y.pointerId),ht(y.clientX),n.mode!=="play"&&ut("play")}),V.addEventListener("pointermove",y=>{tt&&ht(y.clientX)}),V.addEventListener("pointerup",y=>{let P=tt;if(tt=null,!P||Math.abs(y.clientX-P.x)>8)return;let X=J.getBoundingClientRect(),B=he((y.clientX-X.left)/X.width,0,1)*2*xt.HALF-xt.HALF,U=q(B),st=Jl.findIndex(N=>U>=N.from&&U<=N.to);st>=0&&(T(oe.register(st,st>=4)),dt.noteOn(U,.6,{inst:h.inst,dur:.5}))});function at(y){n.mode!=="play"&&ut("play"),n.lookAtX((n.cx??0)+y*7*xt.W);let P=q(n.cx+y*7*xt.W);dt.noteOn(P,.5,{inst:h.inst,dur:.4})}mt("#navL").addEventListener("click",y=>{w(y.currentTarget),at(-1)}),mt("#navR").addEventListener("click",y=>{w(y.currentTarget),at(1)});function q(y){let P=60,X=9;for(let B=Je;B<=qn;B++)!$e(B)&&Math.abs(je(B)-y)<X&&(X=Math.abs(je(B)-y),P=B);return P}function ut(y){y==="play"?(n.setMode("play",{dur:1.6}),mt("#viewBtn .ic").textContent="\u{1F440}",mt("#viewBtn .lb").textContent="\u770B\u94A2\u7434",mt("#nav").hidden=!1):(n.setMode(y,{dur:1.6,theta:.62,phi:1.05,radius:3.4}),mt("#viewBtn .ic").textContent="\u{1F3B9}",mt("#viewBtn .lb").textContent="\u5C55\u5F00\u952E\u76D8",mt("#nav").hidden=!0),dt.ui("whoosh")}mt("#viewBtn").addEventListener("click",y=>{w(y.currentTarget),n.mode==="play"?(ut("show"),T(oe.view)):(ut("play"),T(oe.play))});let yt={piano:"#FF7A59",musicbox:"#A55EEA",marimba:"#E8590C",chip:"#1FC8DB"};function Kt(y,P){h.inst=y,dt.inst=y,s.style=y,d(),ci("#rail .inst").forEach(X=>{X.classList.toggle("on",X.dataset.inst===y),X.style.setProperty("--c",yt[X.dataset.inst])}),P&&(T(oe.inst(y)),dt.chord([60,64,67],{inst:y,spread:.08,vel:.6,dur:.6}))}ci("#rail .inst").forEach(y=>y.addEventListener("click",()=>{w(y),Kt(y.dataset.inst,!0)})),Kt(h.inst);function $t(y,P){h.night=y,t.setNight(y),document.body.classList.toggle("night",y),mt("#nightBtn .ic").textContent=y?"\u2600\uFE0F":"\u{1F319}",document.querySelector("meta[name=theme-color]").content=y?"#0B0B24":"#F7EDE6",P&&T(y?oe.night:oe.day)}mt("#nightBtn").addEventListener("click",y=>{w(y.currentTarget),$t(!h.night,!0),d(),dt.ui(h.night?"close":"open")}),$t(h.night);let Vt=mt("#paint");sc.forEach(y=>{let P=hn("button","swatch");P.style.setProperty("--c",y.hex),P.setAttribute("aria-label",y.zh),P.addEventListener("click",()=>{h.paint=y.id,d(),e.setColor(y.hex),ci(".swatch",Vt).forEach(X=>X.classList.toggle("on",X===P)),T(oe.paint(y)),dt.chord([72,76,79,84],{inst:"musicbox",spread:.05,vel:.5,dur:.8}),s.burst(A.set(0,1.05,-.7),50,{colors:[new Tt(y.hex),new Tt("#fff"),new Tt(Wn(dn))],scale:n.mode==="play"?.5:1}),ye(500,()=>Vt.hidden=!0)}),y.id===h.paint&&P.classList.add("on"),Vt.appendChild(P)}),mt("#paintBtn").addEventListener("click",y=>{w(y.currentTarget),bt("paint"),Vt.hidden=!Vt.hidden,v(3)}),mt("#pedalBtn").addEventListener("click",y=>{let P=!dt.sustain;dt.setSustain(P),e.setSustain(P),y.currentTarget.setAttribute("aria-pressed",P),w(y.currentTarget),T(P?oe.pedalOn:oe.pedalOff)});let et=mt("#panel"),ot=mt("#panelRows");function St(y,P,X,B,U){let st=hn("div","row");st.appendChild(hn("div","k",y));let N=hn("div","seg");P.forEach(([Z,G])=>{let it=hn("button",Z===X?"on":"",G);it.addEventListener("click",()=>{ci("button",N).forEach(ct=>ct.classList.toggle("on",ct===it)),B(Z),v(2)}),N.appendChild(it)}),st.appendChild(N),U&&st.appendChild(hn("div","d",U)),ot.appendChild(st)}function Wt(){ot.innerHTML="",St("\u7434\u952E\u4E0A\u5199",[["solfege","do re mi"],["number","1 2 3"],["letter","C D E"],["color","\u53EA\u6709\u989C\u8272"],["none","\u4E0D\u5199"]],h.labels,y=>{h.labels=y,e.setLabels(y),l.setLabels(y==="none"||y==="color"?"solfege":y),d()},"\u7434\u952E\u4E0A\u7684\u5C0F\u5706\u8D34\uFF0C\u6309\u4E03\u79CD\u989C\u8272\u533A\u5206 do re mi"),St("\u7434\u952E\u5927\u5C0F",[["xl","\u7279\u5927"],["l","\u5927"],["m","\u4E2D"],["s","\u5C0F"],["all","\u5168\u90E8 88 \u952E"]],h.keys,y=>{h.keys=y,n.setSpan(g[y]),n.mode!=="play"&&ut("play"),d()},"\u5750\u4E0B\u5F39\u7684\u65F6\u5019\uFF0C\u4E00\u5C4F\u653E\u51E0\u4E2A\u952E\u3002\u4E5F\u53EF\u4EE5\u5728\u7434\u952E\u4E0A\u65B9\u7528\u4E24\u6839\u624B\u6307\u634F\u5408\u7F29\u653E"),St("\u98D8\u51FA\u5531\u540D",[[!0,"\u5F00"],[!1,"\u5173"]],h.names,y=>{h.names=y,s.names=y,d()}),St("\u8DDF\u6211\u5F39\u4F34\u594F",[[!0,"\u5F00"],[!1,"\u5173"]],h.accomp,y=>{h.accomp=y,d()},"\u5B69\u5B50\u6309\u5BF9\u4E00\u4E2A\u97F3\uFF0C\u94A2\u7434\u5C31\u914D\u4E0A\u548C\u5F26\uFF0C\u542C\u8D77\u6765\u50CF\u5728\u5F39\u6574\u9996\u66F2\u5B50"),St("\u7279\u6548",[["full","\u591A"],["less","\u5C11"]],h.fx,y=>{h.fx=y,s.quiet=y==="less",d()}),St("\u58F0\u97F3",[[!0,"\u5F00"],[!1,"\u5173"]],h.sound,y=>{h.sound=y,dt.setOn(y),d()}),St("\u8BED\u97F3",[[!0,"\u5F00"],[!1,"\u5173"]],h.voice,y=>{h.voice=y,we.on=y,y||we.stop(),d()})}mt("#gearBtn").addEventListener("click",y=>{w(y.currentTarget),bt("panel"),Wt(),et.hidden=!et.hidden,v(1)});function bt(y){y!=="paint"&&(Vt.hidden=!0),y!=="panel"&&(et.hidden=!0),y!=="shelf"&&(mt("#shelf").hidden=!0)}ci("[data-close]").forEach(y=>y.addEventListener("click",()=>{y.closest(".sheet").hidden=!0,v(0),y.closest("#shelf")&&!At.active&&ft("free")})),Le.on("touch",()=>{Vt.hidden=!0});let At={name:null,active:null},le={free:["#FF7A59","#FF4F8B"],learn:["#FFC94A","#FF8A3D"],listen:["#7C8CFF","#A55EEA"],echo:["#3DD68C","#12B8A6"]};function lt(){let y=mt(`#modes [data-mode="${At.name}"]`);if(!y)return;let P=mt("#modes .thumb");P.style.width=y.offsetWidth+"px",P.style.transform=`translateX(${y.offsetLeft-5}px)`;let[X,B]=le[At.name];P.style.setProperty("--a",X),P.style.setProperty("--b",B),ci("#modes [role=tab]").forEach(U=>U.setAttribute("aria-selected",U===y))}window.addEventListener("resize",()=>ye(50,lt)),ci("#modes [role=tab]").forEach((y,P)=>y.addEventListener("click",()=>{v(P+1),ft(y.dataset.mode,!0)}));function ft(y,P){At.active&&At.active.stop&&At.active.stop(),At.active=null,At.name=y,lt(),bt(),["#lesson","#concert","#echo"].forEach(X=>mt(X).hidden=!0),mt("#rail2").hidden=!1,mt("#rail").hidden=!1,c.clear(),e.clearHints(),a.filter=null,mt("#recBtn").hidden=y!=="free",mt("#playRecBtn").hidden=y!=="free"||!rn.get("rec",null),y==="free"?(At.active=Ut,Ut.start(P)):y==="learn"?vt("learn"):y==="listen"?vt("listen"):y==="echo"&&(At.active=Yt,Yt.start())}function vt(y){let P=mt("#shelfList");P.innerHTML="",mt("#shelfTitle").textContent=y==="learn"?"\u2B50 \u9009\u4E00\u9996\u6B4C\uFF0C\u8DDF\u7740\u4EAE\u706F\u5F39":"\u{1F3A7} \u9009\u4E00\u9996\uFF0C\u94A2\u7434\u81EA\u5DF1\u5F39";let X=ic.filter(U=>y==="listen"||!U.listenOnly);y==="listen"&&(X=X.filter(U=>U.listenOnly).concat(X.filter(U=>!U.listenOnly)));let B=rn.get("rec",null);y==="listen"&&B&&B.ev&&B.ev.length&&(X=[{id:"__rec",title:"\u6211\u5F39\u7684\u6B4C",emoji:"\u{1F399}\uFE0F",a:"#FF8FAB",b:"#FF4F8B",stars:0}].concat(X)),X.forEach((U,st)=>{let N=hn("button","song");N.style.setProperty("--a",U.a),N.style.setProperty("--b",U.b),N.style.setProperty("--s",U.b+"55"),N.style.animationDelay=st*.03+"s",N.innerHTML=`<span class="em">${U.emoji}</span><span class="nm">${U.title}</span>`+(U.stars?`<span class="st">${"\u2605".repeat(U.stars)}${"\u2606".repeat(3-U.stars)}</span>`:'<span class="st">\u521A\u521A\u5F55\u7684</span>')+(y==="learn"&&_[U.id]?`<span class="done">${_[U.id]>=3?"\u{1F451}":"\u{1F3C5}"}</span>`:""),N.addEventListener("click",()=>{w(N),dt.ui("pop"),mt("#shelf").hidden=!0,y==="learn"?(At.active=D,D.start(U)):U.id==="__rec"?(At.active=qt,qt.startRec(B)):(At.active=qt,qt.start(U))}),P.appendChild(N)}),mt("#shelf").hidden=!1,T(y==="learn"?oe.learnPick:oe.listenPick)}function _t(y,P={}){y=y.slice().sort((ct,Nt)=>ct.t-Nt.t);let X=.12,B=0,U=0,st=0,N=!1,Z=0,G=[],it={get playing(){return N},get progress(){return N||Z?he((N?dt.time()-B:Z)/(P.length||1),0,1):0},play(ct=0){dt.init(),B=dt.time()+.25-ct,N=!0,Z=0,U=y.findIndex(Nt=>Nt.t>=ct),U<0&&(U=y.length),st=U},pause(){N&&(Z=dt.time()-B,N=!1,dt.allOff(),G.forEach(ct=>r.up(ct.m,{src:ct.src})),G.length=0)},resume(){N||it.play(Z)},stop(){N=!1,Z=0,dt.allOff(),G.forEach(ct=>r.up(ct.m,{src:ct.src})),G.length=0},tick(){if(!N)return;let ct=dt.time()-B;for(;U<y.length&&y[U].t<ct+X;){let F=y[U++];dt.noteOn(F.m,F.v??.7,{when:B+F.t,dur:Math.max(.08,F.d*.98)})}let Nt=ct-(dt.ctx.outputLatency||dt.ctx.baseLatency||.02);for(;st<y.length&&y[st].t<=Nt;){let F=y[st++],Mt=F.part==="acc"?"acc":"auto";r.down(F.m,{src:Mt,sound:!1,vel:F.v,name:F.part==="acc"?!1:void 0}),G.push({m:F.m,src:Mt,at:F.t+Math.max(.06,F.d*.92)}),P.onNote&&P.onNote(F)}for(let F=G.length-1;F>=0;F--)G[F].at<=Nt&&(r.up(G[F].m,{src:G[F].src}),G.splice(F,1));st>=y.length&&!G.length&&ct>(P.length||0)&&(N=!1,P.onEnd&&P.onEnd())}};return it}function Et(y,P={}){let X=y.spb*(P.slow||1),B=y.notes.map(U=>({t:U.t*X,m:U.m,d:U.d*X,v:.72,part:"mel",note:U}));return P.acc!==!1&&y.acc.forEach(U=>B.push({t:U.t*X,m:U.m,d:U.d*X,v:U.v??.4,part:"acc"})),{ev:B,length:y.length*X+.6}}function Ft(y,P,X={}){let B=Math.max(g[h.keys]||15,os(q(je(P)))-os(q(je(y)))+3);n.setMode("play",{span:X.keepSpan?void 0:Math.min(B,30),cx:(je(y)+je(P))/2,dur:X.dur||1.6}),mt("#nav").hidden=!1,mt("#viewBtn .ic").textContent="\u{1F440}",mt("#viewBtn .lb").textContent="\u770B\u94A2\u7434"}let Ut={start(y){n.mode!=="play"&&ut("play"),l.idle(),y&&T(oe.free)},stop(){r.recording&&Xt()}};Le.on("glissando",(y,P)=>{let X=je(y),B=je(P),U=Math.abs(B-X)+.1;s.rainbow(new I((X+B)/2,xt.TOP+.02,-.12),Math.max(.25,U)),dt.chord([72,76,79,84,88],{inst:"musicbox",spread:.06,vel:.35,dur:1}),(!rn.get("saidRainbow",!1)||Math.random()<.25)&&(T(oe.rainbow),rn.set("saidRainbow",!0))});let Ht=0;function Xt(){let y=r.record(!1);if(mt("#recBtn").classList.remove("on"),mt("#recBtn .lb").textContent="\u5F55\u4E0B\u6765",!y||y.ev.length<2){T(oe.recEmpty);return}let P=y.ev[0][0];rn.set("rec",{at:Date.now(),ev:y.ev.map(([X,B,U])=>[Math.round(X-P),B,U]).slice(0,1600)}),mt("#playRecBtn").hidden=!1,T(oe.recStop)}mt("#recBtn").addEventListener("click",y=>{if(w(y.currentTarget),r.recording){Xt();return}r.record(!0),y.currentTarget.classList.add("on"),mt("#recBtn .lb").textContent="\u5F55\u597D\u4E86",T(oe.recStart),clearTimeout(Ht),Ht=setTimeout(()=>{r.recording&&Xt()},18e4)}),mt("#playRecBtn").addEventListener("click",y=>{w(y.currentTarget);let P=rn.get("rec",null);P&&(ft("listen"),bt(),At.active=qt,qt.startRec(P))});let D={song:null,at:0,wrong:0,demo:null,t0:0,played:[],start(y){this.song=y,this.at=0,this.wrong=0,this.played=[],this.t0=performance.now(),mt("#lesson").hidden=!1,mt("#lsEmoji").textContent=y.emoji,mt("#lsTitle").textContent=y.title,Ft(y.lo,y.hi),mt("#nav").hidden=!0,mt("#score")._ph=null,T(oe.learnStart(y)),this.show()},stop(){this.demo&&(this.demo.stop(),this.demo=null),c.clear(),e.clearHints(),mt("#lesson").hidden=!0,mt("#score").hidden=!0,mt("#score")._ph=null,this.song=null},show(){let y=this.song;if(!y)return;let P=y.notes.slice(this.at,this.at+2).map(X=>X.m);if(e.clearHints(),P.length&&e.hint(P[0],!0,Ke(P[0])),c.set(P,Math.max(.6,Math.min(1.2,n.span/16))),l.song(y,this.at),this.score(),mt("#lsProg").style.width=this.at/y.notes.length*100+"%",P.length){let B=(y.phrases.find(U=>U.includes(this.at))||[]).map(U=>y.notes[U].m);n.ensureVisible(je(Math.min(...B,P[0])),je(Math.max(...B,P[0])))}},score(){let y=this.song,P=mt("#score"),X=y.phrases.find(B=>B.includes(this.at))||y.phrases[y.phrases.length-1];P._ph!==X&&(P._ph=X,P.innerHTML="",X.forEach(B=>{let U=y.notes[B],st=hn("div","n"+(U.d>=2?" long":"")),N=h.labels==="number"?String(Mn(U.m)+1):h.labels==="letter"?"CDEFGAB"[Mn(U.m)]:["do","re","mi","fa","sol","la","si"][Mn(U.m)],Z=hn("div","b"+(Mn(U.m)===2?" y":""),$e(U.m)?"\u266F":N);Z.style.setProperty("--c",lr(U.m)),st.appendChild(Z),st.appendChild(hn("div","l",U.lyric||"")),st.dataset.i=B,P.appendChild(st)})),ci(".n",P).forEach(B=>{let U=+B.dataset.i;B.classList.toggle("done",U<this.at),B.classList.toggle("now",U===this.at)}),P.hidden=!1},onNote(y,P){let X=this.song;if(!X||P!=="user"||this.demo)return;let B=X.notes[this.at];if(!B)return;if(y!==B.m){this.wrong++,c.pulse(),(this.wrong===3||this.wrong%6===0)&&T(oe.learnWrong(Mn(B.m)??0));return}this.wrong=0,this.played.push({t:performance.now()-this.t0,m:y});let U=e.keyTop(y,A.clone());if(s.burst(U.setY(U.y+.03),16,{colors:[Ke(y),new Tt("#fff")],scale:Math.min(.45,n.span/30)}),h.accomp){let N=B.t,Z=(X.notes[this.at+1]||{t:X.length}).t;X.acc.filter(G=>G.t>=N-1e-6&&G.t<Z-1e-6&&G.t-N<1.01).forEach(G=>{let it=(G.t-N)*X.spb;ye(it*1e3,()=>r.tap(G.m,Math.min(G.d*X.spb,1.6),{src:"acc",vel:(G.v??.4)*.85,name:!1}))})}this.at++;let st=X.phrases.find(N=>N.includes(this.at-1));if(this.at>=X.notes.length)return this.finish();st&&st[st.length-1]===this.at-1&&(ye(250,()=>{T(Wn(oe.learnPhrase))}),dt.ui("pop")),this.show()},finish(){let y=this.song;c.clear(),e.clearHints(),l.song(y,y.notes.length),mt("#score").hidden=!0,mt("#lsProg").style.width="100%",_[y.id]=(_[y.id]||0)+1,rn.set("done",_);let P=(performance.now()-this.t0)/1e3,X=P<y.notes.length*1.4?3:P<y.notes.length*2.6?2:1;ye(500,()=>O(y.emoji,"\u5F39\u5B8C\u5566\uFF01",Math.max(X,2))),ye(900,()=>T(oe.learnDone(y),{onend:()=>{if(this.song!==y)return;let{ev:B,length:U}=Et(y);this.demo=_t(B,{length:U,onEnd:()=>{this.demo=null,this.song===y&&(T(oe.learnAgain),this.at=0,this.show())}}),this.demo.play()}}))},listen(){let y=this.song;if(!y||this.demo)return;let P=y.phrases.find(G=>G.includes(this.at))||y.phrases[0],X=y.notes[this.at]?this.at:P[0],B=P[P.length-1],U=y.notes[X].t,st=y.notes[B].t+y.notes[B].d,N=y.spb*1.15,Z=y.notes.slice(X,B+1).map(G=>({t:(G.t-U)*N,m:G.m,d:G.d*N,v:.75,part:"mel"}));h.accomp&&y.acc.filter(G=>G.t>=U&&G.t<st).forEach(G=>Z.push({t:(G.t-U)*N,m:G.m,d:G.d*N,v:(G.v??.4)*.8,part:"acc"})),c.clear(),e.clearHints(),T(oe.learnListen,{onend:()=>{this.song===y&&(this.demo=_t(Z,{length:(st-U)*N+.3,onEnd:()=>{this.demo=null,this.song===y&&(T(oe.learnYour),this.show())}}),this.demo.play())}})}};Mi.add(()=>{D.demo&&D.demo.tick()}),mt("#lsListen").addEventListener("click",y=>{w(y.currentTarget),D.listen()}),mt("#lsRestart").addEventListener("click",y=>{w(y.currentTarget),D.demo&&(D.demo.stop(),D.demo=null),D.at=0,D.t0=performance.now(),D.show(),v(4)}),mt("#lsPick").addEventListener("click",y=>{w(y.currentTarget),D.stop(),At.active=null,vt("learn")});let qt={song:null,sch:null,wasNight:!1,list:[],start(y){this.stopPlayback(),this.song=y,this.wasNight=h.night,h.night||$t(!0),mt("#concert").hidden=!1,mt("#ccEmoji").textContent=y.emoji,mt("#ccTitle").textContent=y.title,mt("#ccPause .ic").textContent="\u23F8",mt("#ccPause .lb").textContent="\u505C\u4E00\u4E0B",mt("#rail").hidden=!0,mt("#nav").hidden=!0,n.setMode("concert",{dur:2.4}),mt("#viewBtn .ic").textContent="\u{1F3B9}",mt("#viewBtn .lb").textContent="\u5C55\u5F00\u952E\u76D8",l.concert(y,0);let{ev:P,length:X}=Et(y);this.sch=_t(P,{length:X,onEnd:()=>this.end()}),T(oe.listenStart(y),{onend:()=>{this.song===y&&this.sch&&!this.sch.playing&&this.sch.play()}})},startRec(y){this.stopPlayback();let P={id:"__rec",title:"\u6211\u5F39\u7684\u6B4C",emoji:"\u{1F399}\uFE0F",tip:"\u521A\u521A\u5F55\u4E0B\u6765\u7684"};this.song=P,this.wasNight=h.night,h.night||$t(!0),mt("#concert").hidden=!1,mt("#ccEmoji").textContent="\u{1F399}\uFE0F",mt("#ccTitle").textContent="\u6211\u5F39\u7684\u6B4C",mt("#rail").hidden=!0,mt("#nav").hidden=!0,n.setMode("concert",{dur:2.4});let X=[],B={};y.ev.forEach(([st,N,Z])=>{Z?B[N]=st:B[N]!==void 0&&(X.push({t:B[N]/1e3,m:N,d:Math.max(.08,(st-B[N])/1e3),v:.72,part:"mel"}),delete B[N])}),Object.entries(B).forEach(([st,N])=>X.push({t:N/1e3,m:+st,d:.4,v:.72,part:"mel"}));let U=Math.max(...X.map(st=>st.t+st.d))+.6;l.concert(P,0),this.sch=_t(X,{length:U,onEnd:()=>this.end()}),T(oe.recPlay,{onend:()=>{this.song===P&&this.sch&&!this.sch.playing&&this.sch.play()}})},end(){let y=this.song;O("\u{1F44F}","\u5F39\u5B8C\u5566\uFF01"),T(oe.listenEnd),ye(5200,()=>{this.song===y&&At.active===qt&&this.next()})},next(){let y=ic,P=y.findIndex(X=>X.id===(this.song&&this.song.id));this.start(y[(P+1)%y.length])},stopPlayback(){this.sch&&(this.sch.stop(),this.sch=null)},stop(){this.stopPlayback(),this.song=null,mt("#concert").hidden=!0,mt("#rail").hidden=!1,!this.wasNight&&h.night&&$t(!1),ut("play")}};Mi.add(()=>{qt.sch&&(qt.sch.tick(),qt.song&&Math.random()<.08&&(l.concert(qt.song,qt.sch.progress),mt("#ccProg").style.width=qt.sch.progress*100+"%"))}),mt("#ccPause").addEventListener("click",y=>{w(y.currentTarget);let P=qt.sch;P&&(P.playing?(P.pause(),mt("#ccPause .ic").textContent="\u25B6\uFE0F",mt("#ccPause .lb").textContent="\u63A5\u7740\u5F39"):(P.resume(),mt("#ccPause .ic").textContent="\u23F8",mt("#ccPause .lb").textContent="\u505C\u4E00\u4E0B"))}),mt("#ccNext").addEventListener("click",y=>{w(y.currentTarget),qt.next()}),mt("#ccPick").addEventListener("click",y=>{w(y.currentTarget),qt.stopPlayback(),vt("listen")});let Yt={level:0,seq:[],got:0,phase:"idle",wins:0,sch:null,LEVELS:[{n:2,pool:[60,64,67]},{n:3,pool:[60,62,64,65,67]},{n:3,pool:[60,62,64,65,67,69,71,72]},{n:4,pool:[60,62,64,65,67,69,71,72]},{n:5,pool:[60,62,64,65,67,69,71,72]}],start(){this.level=rn.get("echoLevel",0),this.wins=0,mt("#echo").hidden=!1,Ft(60,72,{dur:1.4}),mt("#nav").hidden=!0,this.dots(),T(oe.echoIntro,{onend:()=>this.round()})},stop(){this.phase="idle",this.sch&&(this.sch.stop(),this.sch=null),mt("#echo").hidden=!0,e.clearHints()},dots(){let y=mt("#ecDots");y.innerHTML="";for(let P=0;P<(this.seq.length||this.LEVELS[this.level].n);P++){let X=hn("i");P<this.got&&(X.classList.add("on"),X.style.setProperty("--c",lr(this.seq[P]))),y.appendChild(X)}mt("#ecTitle").textContent=`\u5B66\u5C0F\u9E1F\u5531\u6B4C \xB7 \u7B2C ${this.level+1} \u5173`},round(y){if(At.active!==Yt)return;let P=this.LEVELS[this.level];if(!y){this.seq=[];for(let U=0;U<P.n;U++){let st;do st=Wn(P.pool);while(U&&st===this.seq[U-1]&&Math.random()<.7);this.seq.push(st)}}this.got=0,this.phase="listen",this.dots(),l.echo(this.seq,0,!0),e.clearHints(),P.pool.forEach(U=>e.mark(U,!0));let X=.62,B=this.seq.map((U,st)=>({t:st*X,m:U,d:.5,v:.7,part:"mel"}));this.sch=_t(B,{length:this.seq.length*X+.2,onNote:()=>{let U=mt("#ecBird");U.classList.remove("sing"),U.offsetWidth,U.classList.add("sing")},onEnd:()=>{this.sch=null,At.active===Yt&&(this.phase="answer",l.echo(this.seq,0,!1),T(oe.echoYour))}}),ye(400,()=>this.sch&&this.sch.play())},onNote(y,P){P!=="user"||this.phase!=="answer"||(y===this.seq[this.got]?(this.got++,this.dots(),l.echo(this.seq,this.got,!1),s.twinkle(e.keyTop(y,A.clone()).setY(xt.TOP+.05),Ke(y),1),this.got>=this.seq.length&&(this.phase="idle",this.wins++,ye(300,()=>{O("\u{1F426}",Wn(oe.echoGood))}),this.wins>=2&&(this.wins=0,this.level<this.LEVELS.length-1?(this.level++,rn.set("echoLevel",this.level),ye(1500,()=>T(oe.echoMore))):ye(1500,()=>T(oe.echoWin))),ye(3600,()=>this.round()))):(this.seq.includes(y)||Math.abs(y-this.seq[this.got])<=12)&&(this.phase="idle",ye(500,()=>T(oe.echoAgain,{onend:()=>this.round(!0)}))))}};Mi.add(()=>{Yt.sch&&Yt.sch.tick()}),mt("#ecAgain").addEventListener("click",y=>{w(y.currentTarget),Yt.phase!=="listen"&&Yt.round(!0)}),Le.on("note",(y,P)=>{At.active===D?D.onNote(y,P):At.active===Yt&&Yt.onNote(y,P),x=0});let C=!1,x=0;function Y(){n.setMode("show",{dur:.01,theta:.75,phi:1.12,radius:4.1}),e.open(!1),ye(900,()=>{C||(mt("#hint").hidden=!1)}),a.onTapPiano=k,Le.on("tapEmpty",()=>{C||k()}),/[?&]open\b/.test(location.search)&&ye(300,k)}function k(){if(C)return;C=!0,a.onTapPiano=null,dt.init(),we.unlock(),mt("#hint").hidden=!0,e.open(!0),dt.ui("open"),ye(500,()=>s.burst(new I(0,1,-.75),70,{scale:1.2})),ye(900,()=>s.burst(new I(.3,1.3,-.9),50,{scale:1})),ye(250,()=>[60,64,67,72,76,79,84].forEach((P,X)=>ye(X*70,()=>r.tap(P,.5,{src:"auto",vel:.55,inst:"piano",name:!1})))),ye(1300,()=>{n.setMode("play",{dur:2.2}),R.classList.remove("hidden"),ft("free"),ye(60,lt)});let y=rn.get("visited",!1);rn.set("visited",!0),ye(1600,()=>T(y?oe.welcomeBack:oe.welcome))}Mi.add(y=>{if(!(!C||At.name!=="free")&&(x+=y,x>25)){x=-40,T(oe.idle);let P=q(n.cx);c.set([P],Math.min(1.2,n.span/16)),ye(2600,()=>{At.name==="free"&&c.clear()})}}),Le.on("touch",()=>{x=0}),document.addEventListener("visibilitychange",()=>{document.hidden&&(we.stop(),qt.sch&&qt.sch.playing&&mt("#ccPause").click(),r.allUp())}),mt("#homeBtn").addEventListener("click",()=>{we.stop(),dt.allOff()}),window.__app={setMode:ft,setView:ut,setNight:$t,openPiano:k,Learn:D,Listen:qt,Echo:Yt,songById:Pf,S:h}}var jh=mt("#gl"),fn;try{fn=uf(jh)}catch(i){throw mt("#ldMsg").textContent="\u8FD9\u53F0\u8BBE\u5907\u6253\u4E0D\u5F00 3D \u753B\u9762\uFF08\u9700\u8981 WebGL 2\uFF09",i}var rc=mf();fn.scene.add(rc.root);var Ff=gf(fn.camera),Kh=_f(fn.scene),gr={stage:fn,piano:rc,rig:Ff,fx:Kh,camera:fn.camera,scene:fn.scene};gr.player=Sf(gr);gr.input=bf(jh,gr);window.__piano=gr;window.__sndRef=dt;function Fa(){fn.resize()}window.addEventListener("resize",Fa);window.visualViewport?.addEventListener("resize",Fa);try{new ResizeObserver(Fa).observe(jh)}catch{}Fa();var Nf=new ca,Na=0,Jh=0,$h=0;function Uf(){Nf.update();let i=Math.min(Nf.getDelta(),1/20);Na+=i,Ff.update(i),rc.update(i,Na),rc.consumeShadowDirty()&&fn.shadowDirty(),fn.update(i,Na),Kh.update(i,Na,fn.night),Kh.lookAt(fn.camera),Mi.run(i,Na),fn.render(),Jh++,i>1/40&&$h++,Jh===150&&($h>60&&fn.renderer.getPixelRatio()>1.25&&(fn.renderer.setPixelRatio(1.25),Fa()),Jh=0,$h=0),requestAnimationFrame(Uf)}Df(gr);requestAnimationFrame(Uf);
