(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();var ks={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qo=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},dl=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const a=t[n++];e[r++]=String.fromCharCode((s&31)<<6|a&63)}else if(s>239&&s<365){const a=t[n++],l=t[n++],h=t[n++],g=((s&7)<<18|(a&63)<<12|(l&63)<<6|h&63)-65536;e[r++]=String.fromCharCode(55296+(g>>10)),e[r++]=String.fromCharCode(56320+(g&1023))}else{const a=t[n++],l=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(a&63)<<6|l&63)}}return e.join("")},zo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const a=t[s],l=s+1<t.length,h=l?t[s+1]:0,g=s+2<t.length,E=g?t[s+2]:0,T=a>>2,A=(a&3)<<4|h>>4;let k=(h&15)<<2|E>>6,N=E&63;g||(N=64,l||(k=64)),r.push(n[T],n[A],n[k],n[N])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(qo(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):dl(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const a=n[t.charAt(s++)],h=s<t.length?n[t.charAt(s)]:0;++s;const E=s<t.length?n[t.charAt(s)]:64;++s;const A=s<t.length?n[t.charAt(s)]:64;if(++s,a==null||h==null||E==null||A==null)throw new fl;const k=a<<2|h>>4;if(r.push(k),E!==64){const N=h<<4&240|E>>2;if(r.push(N),A!==64){const C=E<<6&192|A;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class fl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const pl=function(t){const e=qo(t);return zo.encodeByteArray(e,!0)},Sn=function(t){return pl(t).replace(/\./g,"")},Jo=function(t){try{return zo.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml=()=>gl().__FIREBASE_DEFAULTS__,yl=()=>{if(typeof process>"u"||typeof ks>"u")return;const t=ks.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},vl=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Jo(t[1]);return e&&JSON.parse(e)},er=()=>{try{return ml()||yl()||vl()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Xo=t=>{var e,n;return(n=(e=er())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Yo=t=>{const e=Xo(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},Qo=()=>{var t;return(t=er())===null||t===void 0?void 0:t.config},Zo=t=>{var e;return(e=er())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Il(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,a=t.sub||t.user_id;if(!a)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:a,user_id:a,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Sn(JSON.stringify(n)),Sn(JSON.stringify(l)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function _l(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(X())}function El(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ea(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Tl(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function bl(){const t=X();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function tr(){try{return typeof indexedDB=="object"}catch{return!1}}function nr(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var a;e(((a=s.error)===null||a===void 0?void 0:a.message)||"")}}catch(n){e(n)}})}function ta(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl="FirebaseError";class ve extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Sl,Object.setPrototypeOf(this,ve.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ge.prototype.create)}}class Ge{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,a=this.errors[e],l=a?Al(a,r):"Error",h=`${this.serviceName}: ${l} (${s}).`;return new ve(s,h,r)}}function Al(t,e){return t.replace(kl,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const kl=/\{\$([^}]+)}/g;function Pl(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function An(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const a=t[s],l=e[s];if(Ps(a)&&Ps(l)){if(!An(a,l))return!1}else if(a!==l)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function Ps(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ut(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,a]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(a)}}),e}function Ft(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Cl(t,e){const n=new Rl(t,e);return n.subscribe.bind(n)}class Rl{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let s;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ol(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:r},s.next===void 0&&(s.next=wi),s.error===void 0&&(s.error=wi),s.complete===void 0&&(s.complete=wi);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),a}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ol(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function wi(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll=1e3,Nl=2,Dl=4*60*60*1e3,Ml=.5;function Cs(t,e=Ll,n=Nl){const r=e*Math.pow(n,t),s=Math.round(Ml*r*(Math.random()-.5)*2);return Math.min(Dl,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(t){return t&&t._delegate?t._delegate:t}class ne{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new wl;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(a){if(s)return null;throw a}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(xl(e))try{this.getOrInitializeService({instanceIdentifier:Xe})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const a=this.getOrInitializeService({instanceIdentifier:s});r.resolve(a)}catch{}}}}clearInstance(e=Xe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Xe){return this.instances.has(e)}getOptions(e=Xe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[a,l]of this.instancesDeferred.entries()){const h=this.normalizeInstanceIdentifier(a);r===h&&l.resolve(s)}return s}onInit(e,n){var r;const s=this.normalizeInstanceIdentifier(n),a=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;a.add(e),this.onInitCallbacks.set(s,a);const l=this.instances.get(s);return l&&e(l,s),()=>{a.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Fl(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Xe){return this.component?this.component.multipleInstances?e:Xe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Fl(t){return t===Xe?void 0:t}function xl(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ul(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var O;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(O||(O={}));const jl={debug:O.DEBUG,verbose:O.VERBOSE,info:O.INFO,warn:O.WARN,error:O.ERROR,silent:O.SILENT},$l=O.INFO,Vl={[O.DEBUG]:"log",[O.VERBOSE]:"log",[O.INFO]:"info",[O.WARN]:"warn",[O.ERROR]:"error"},Hl=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=Vl[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Fn{constructor(e){this.name=e,this._logLevel=$l,this._logHandler=Hl,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in O))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?jl[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,O.DEBUG,...e),this._logHandler(this,O.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,O.VERBOSE,...e),this._logHandler(this,O.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,O.INFO,...e),this._logHandler(this,O.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,O.WARN,...e),this._logHandler(this,O.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,O.ERROR,...e),this._logHandler(this,O.ERROR,...e)}}const Gl=(t,e)=>e.some(n=>t instanceof n);let Rs,Os;function Wl(){return Rs||(Rs=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Kl(){return Os||(Os=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const na=new WeakMap,Bi=new WeakMap,ia=new WeakMap,Ii=new WeakMap,ir=new WeakMap;function ql(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",a),t.removeEventListener("error",l)},a=()=>{n(Oe(t.result)),s()},l=()=>{r(t.error),s()};t.addEventListener("success",a),t.addEventListener("error",l)});return e.then(n=>{n instanceof IDBCursor&&na.set(n,t)}).catch(()=>{}),ir.set(e,t),e}function zl(t){if(Bi.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",a),t.removeEventListener("error",l),t.removeEventListener("abort",l)},a=()=>{n(),s()},l=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",a),t.addEventListener("error",l),t.addEventListener("abort",l)});Bi.set(t,e)}let ji={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Bi.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ia.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Oe(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Jl(t){ji=t(ji)}function Xl(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(_i(this),e,...n);return ia.set(r,e.sort?e.sort():[e]),Oe(r)}:Kl().includes(t)?function(...e){return t.apply(_i(this),e),Oe(na.get(this))}:function(...e){return Oe(t.apply(_i(this),e))}}function Yl(t){return typeof t=="function"?Xl(t):(t instanceof IDBTransaction&&zl(t),Gl(t,Wl())?new Proxy(t,ji):t)}function Oe(t){if(t instanceof IDBRequest)return ql(t);if(Ii.has(t))return Ii.get(t);const e=Yl(t);return e!==t&&(Ii.set(t,e),ir.set(e,t)),e}const _i=t=>ir.get(t);function xn(t,e,{blocked:n,upgrade:r,blocking:s,terminated:a}={}){const l=indexedDB.open(t,e),h=Oe(l);return r&&l.addEventListener("upgradeneeded",g=>{r(Oe(l.result),g.oldVersion,g.newVersion,Oe(l.transaction),g)}),n&&l.addEventListener("blocked",g=>n(g.oldVersion,g.newVersion,g)),h.then(g=>{a&&g.addEventListener("close",()=>a()),s&&g.addEventListener("versionchange",E=>s(E.oldVersion,E.newVersion,E))}).catch(()=>{}),h}function Ei(t,{blocked:e}={}){const n=indexedDB.deleteDatabase(t);return e&&n.addEventListener("blocked",r=>e(r.oldVersion,r)),Oe(n).then(()=>{})}const Ql=["get","getKey","getAll","getAllKeys","count"],Zl=["put","add","delete","clear"],Ti=new Map;function Ls(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ti.get(e))return Ti.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=Zl.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Ql.includes(n)))return;const a=async function(l,...h){const g=this.transaction(l,s?"readwrite":"readonly");let E=g.store;return r&&(E=E.index(h.shift())),(await Promise.all([E[n](...h),s&&g.done]))[0]};return Ti.set(e,a),a}Jl(t=>({...t,get:(e,n,r)=>Ls(e,n)||t.get(e,n,r),has:(e,n)=>!!Ls(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(tu(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function tu(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const $i="@firebase/app",Ns="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Le=new Fn("@firebase/app"),nu="@firebase/app-compat",iu="@firebase/analytics-compat",ru="@firebase/analytics",su="@firebase/app-check-compat",ou="@firebase/app-check",au="@firebase/auth",cu="@firebase/auth-compat",lu="@firebase/database",uu="@firebase/data-connect",hu="@firebase/database-compat",du="@firebase/functions",fu="@firebase/functions-compat",pu="@firebase/installations",gu="@firebase/installations-compat",mu="@firebase/messaging",yu="@firebase/messaging-compat",vu="@firebase/performance",wu="@firebase/performance-compat",Iu="@firebase/remote-config",_u="@firebase/remote-config-compat",Eu="@firebase/storage",Tu="@firebase/storage-compat",bu="@firebase/firestore",Su="@firebase/vertexai-preview",Au="@firebase/firestore-compat",ku="firebase",Pu="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi="[DEFAULT]",Cu={[$i]:"fire-core",[nu]:"fire-core-compat",[ru]:"fire-analytics",[iu]:"fire-analytics-compat",[ou]:"fire-app-check",[su]:"fire-app-check-compat",[au]:"fire-auth",[cu]:"fire-auth-compat",[lu]:"fire-rtdb",[uu]:"fire-data-connect",[hu]:"fire-rtdb-compat",[du]:"fire-fn",[fu]:"fire-fn-compat",[pu]:"fire-iid",[gu]:"fire-iid-compat",[mu]:"fire-fcm",[yu]:"fire-fcm-compat",[vu]:"fire-perf",[wu]:"fire-perf-compat",[Iu]:"fire-rc",[_u]:"fire-rc-compat",[Eu]:"fire-gcs",[Tu]:"fire-gcs-compat",[bu]:"fire-fst",[Au]:"fire-fst-compat",[Su]:"fire-vertex","fire-js":"fire-js",[ku]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn=new Map,Ru=new Map,Hi=new Map;function Ds(t,e){try{t.container.addComponent(e)}catch(n){Le.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function ae(t){const e=t.name;if(Hi.has(e))return Le.debug(`There were multiple attempts to register component ${e}.`),!1;Hi.set(e,t);for(const n of kn.values())Ds(n,t);for(const n of Ru.values())Ds(n,t);return!0}function nt(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function oe(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},He=new Ge("app","Firebase",Ou);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lu{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ne("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw He.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gt=Pu;function rr(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Vi,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw He.create("bad-app-name",{appName:String(s)});if(n||(n=Qo()),!n)throw He.create("no-options");const a=kn.get(s);if(a){if(An(n,a.options)&&An(r,a.config))return a;throw He.create("duplicate-app",{appName:s})}const l=new Bl(s);for(const g of Hi.values())l.addComponent(g);const h=new Lu(n,r,l);return kn.set(s,h),h}function Bn(t=Vi){const e=kn.get(t);if(!e&&t===Vi&&Qo())return rr();if(!e)throw He.create("no-app",{appName:t});return e}function W(t,e,n){var r;let s=(r=Cu[t])!==null&&r!==void 0?r:t;n&&(s+=`-${n}`);const a=s.match(/\s|\//),l=e.match(/\s|\//);if(a||l){const h=[`Unable to register library "${s}" with version "${e}":`];a&&h.push(`library name "${s}" contains illegal characters (whitespace or "/")`),a&&l&&h.push("and"),l&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Le.warn(h.join(" "));return}ae(new ne(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nu="firebase-heartbeat-database",Du=1,qt="firebase-heartbeat-store";let bi=null;function ra(){return bi||(bi=xn(Nu,Du,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(qt)}catch(n){console.warn(n)}}}}).catch(t=>{throw He.create("idb-open",{originalErrorMessage:t.message})})),bi}async function Mu(t){try{const n=(await ra()).transaction(qt),r=await n.objectStore(qt).get(sa(t));return await n.done,r}catch(e){if(e instanceof ve)Le.warn(e.message);else{const n=He.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Le.warn(n.message)}}}async function Ms(t,e){try{const r=(await ra()).transaction(qt,"readwrite");await r.objectStore(qt).put(e,sa(t)),await r.done}catch(n){if(n instanceof ve)Le.warn(n.message);else{const r=He.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Le.warn(r.message)}}}function sa(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uu=1024,Fu=30*24*60*60*1e3;class xu{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ju(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=Us();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(l=>l.date===a)?void 0:(this._heartbeatsCache.heartbeats.push({date:a,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(l=>{const h=new Date(l.date).valueOf();return Date.now()-h<=Fu}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Le.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Us(),{heartbeatsToSend:r,unsentEntries:s}=Bu(this._heartbeatsCache.heartbeats),a=Sn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(n){return Le.warn(n),""}}}function Us(){return new Date().toISOString().substring(0,10)}function Bu(t,e=Uu){const n=[];let r=t.slice();for(const s of t){const a=n.find(l=>l.agent===s.agent);if(a){if(a.dates.push(s.date),Fs(n)>e){a.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Fs(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class ju{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return tr()?nr().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Mu(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Ms(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Ms(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Fs(t){return Sn(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $u(t){ae(new ne("platform-logger",e=>new eu(e),"PRIVATE")),ae(new ne("heartbeat",e=>new xu(e),"PRIVATE")),W($i,Ns,t),W($i,Ns,"esm2017"),W("fire-js","")}$u("");var Vu="firebase",Hu="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */W(Vu,Hu,"app");function sr(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]]);return n}function oa(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Gu=oa,aa=new Ge("auth","Firebase",oa());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pn=new Fn("@firebase/auth");function Wu(t,...e){Pn.logLevel<=O.WARN&&Pn.warn(`Auth (${gt}): ${t}`,...e)}function _n(t,...e){Pn.logLevel<=O.ERROR&&Pn.error(`Auth (${gt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(t,...e){throw ar(t,...e)}function ee(t,...e){return ar(t,...e)}function or(t,e,n){const r=Object.assign(Object.assign({},Gu()),{[e]:n});return new Ge("auth","Firebase",r).create(e,{appName:t.name})}function ye(t){return or(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ku(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&he(t,"argument-error"),or(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ar(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return aa.create(t,...e)}function S(t,e,...n){if(!t)throw ar(e,...n)}function Pe(t){const e="INTERNAL ASSERTION FAILED: "+t;throw _n(e),new Error(e)}function Ne(t,e){t||Pe(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gi(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function ca(){return xs()==="http:"||xs()==="https:"}function xs(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qu(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ca()||ea()||"connection"in navigator)?navigator.onLine:!0}function zu(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(e,n){this.shortDelay=e,this.longDelay=n,Ne(n>e,"Short delay should be less than long delay!"),this.isMobile=_l()||Tl()}get(){return qu()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cr(t,e){Ne(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Pe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Pe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Pe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xu=new Qt(3e4,6e4);function ie(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function de(t,e,n,r,s={}){return ua(t,s,async()=>{let a={},l={};r&&(e==="GET"?l=r:a={body:JSON.stringify(r)});const h=pt(Object.assign({key:t.config.apiKey},l)).slice(1),g=await t._getAdditionalHeaders();g["Content-Type"]="application/json",t.languageCode&&(g["X-Firebase-Locale"]=t.languageCode);const E=Object.assign({method:e,headers:g},a);return El()||(E.referrerPolicy="no-referrer"),la.fetch()(ha(t,t.config.apiHost,n,h),E)})}async function ua(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},Ju),e);try{const s=new Qu(t),a=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const l=await a.json();if("needConfirmation"in l)throw xt(t,"account-exists-with-different-credential",l);if(a.ok&&!("errorMessage"in l))return l;{const h=a.ok?l.errorMessage:l.error.message,[g,E]=h.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw xt(t,"credential-already-in-use",l);if(g==="EMAIL_EXISTS")throw xt(t,"email-already-in-use",l);if(g==="USER_DISABLED")throw xt(t,"user-disabled",l);const T=r[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw or(t,T,E);he(t,T)}}catch(s){if(s instanceof ve)throw s;he(t,"network-request-failed",{message:String(s)})}}async function We(t,e,n,r,s={}){const a=await de(t,e,n,r,s);return"mfaPendingCredential"in a&&he(t,"multi-factor-auth-required",{_serverResponse:a}),a}function ha(t,e,n,r){const s=`${e}${n}?${r}`;return t.config.emulator?cr(t.config,s):`${t.config.apiScheme}://${s}`}function Yu(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Qu{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ee(this.auth,"network-request-failed")),Xu.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function xt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=ee(t,e,r);return s.customData._tokenResponse=n,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bs(t){return t!==void 0&&t.getResponse!==void 0}function js(t){return t!==void 0&&t.enterprise!==void 0}class Zu{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Yu(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eh(t){return(await de(t,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function th(t,e){return de(t,"GET","/v2/recaptchaConfig",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nh(t,e){return de(t,"POST","/v1/accounts:delete",e)}async function da(t,e){return de(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ih(t,e=!1){const n=ce(t),r=await n.getIdToken(e),s=lr(r);S(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const a=typeof s.firebase=="object"?s.firebase:void 0,l=a==null?void 0:a.sign_in_provider;return{claims:s,token:r,authTime:Bt(Si(s.auth_time)),issuedAtTime:Bt(Si(s.iat)),expirationTime:Bt(Si(s.exp)),signInProvider:l||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function Si(t){return Number(t)*1e3}function lr(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return _n("JWT malformed, contained fewer than 3 sections"),null;try{const s=Jo(n);return s?JSON.parse(s):(_n("Failed to decode base64 JWT payload"),null)}catch(s){return _n("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function $s(t){const e=lr(t);return S(e,"internal-error"),S(typeof e.exp<"u","internal-error"),S(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof ve&&rh(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function rh({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Bt(this.lastLoginAt),this.creationTime=Bt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cn(t){var e;const n=t.auth,r=await t.getIdToken(),s=await zt(t,da(n,{idToken:r}));S(s==null?void 0:s.users.length,n,"internal-error");const a=s.users[0];t._notifyReloadListener(a);const l=!((e=a.providerUserInfo)===null||e===void 0)&&e.length?fa(a.providerUserInfo):[],h=ah(t.providerData,l),g=t.isAnonymous,E=!(t.email&&a.passwordHash)&&!(h!=null&&h.length),T=g?E:!1,A={uid:a.localId,displayName:a.displayName||null,photoURL:a.photoUrl||null,email:a.email||null,emailVerified:a.emailVerified||!1,phoneNumber:a.phoneNumber||null,tenantId:a.tenantId||null,providerData:h,metadata:new Wi(a.createdAt,a.lastLoginAt),isAnonymous:T};Object.assign(t,A)}async function oh(t){const e=ce(t);await Cn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ah(t,e){return[...t.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function fa(t){return t.map(e=>{var{providerId:n}=e,r=sr(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ch(t,e){const n=await ua(t,{},async()=>{const r=pt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:a}=t.config,l=ha(t,s,"/v1/token",`key=${a}`),h=await t._getAdditionalHeaders();return h["Content-Type"]="application/x-www-form-urlencoded",la.fetch()(l,{method:"POST",headers:h,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function lh(t,e){return de(t,"POST","/v2/accounts:revokeToken",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){S(e.idToken,"internal-error"),S(typeof e.idToken<"u","internal-error"),S(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):$s(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){S(e.length!==0,"internal-error");const n=$s(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(S(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:s,expiresIn:a}=await ch(e,n);this.updateTokensAndExpiration(r,s,Number(a))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:s,expirationTime:a}=n,l=new ut;return r&&(S(typeof r=="string","internal-error",{appName:e}),l.refreshToken=r),s&&(S(typeof s=="string","internal-error",{appName:e}),l.accessToken=s),a&&(S(typeof a=="number","internal-error",{appName:e}),l.expirationTime=a),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ut,this.toJSON())}_performRefresh(){return Pe("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(t,e){S(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Ce{constructor(e){var{uid:n,auth:r,stsTokenManager:s}=e,a=sr(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new sh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=a.displayName||null,this.email=a.email||null,this.emailVerified=a.emailVerified||!1,this.phoneNumber=a.phoneNumber||null,this.photoURL=a.photoURL||null,this.isAnonymous=a.isAnonymous||!1,this.tenantId=a.tenantId||null,this.providerData=a.providerData?[...a.providerData]:[],this.metadata=new Wi(a.createdAt||void 0,a.lastLoginAt||void 0)}async getIdToken(e){const n=await zt(this,this.stsTokenManager.getToken(this.auth,e));return S(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return ih(this,e)}reload(){return oh(this)}_assign(e){this!==e&&(S(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Ce(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){S(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Cn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(oe(this.auth.app))return Promise.reject(ye(this.auth));const e=await this.getIdToken();return await zt(this,nh(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,s,a,l,h,g,E,T;const A=(r=n.displayName)!==null&&r!==void 0?r:void 0,k=(s=n.email)!==null&&s!==void 0?s:void 0,N=(a=n.phoneNumber)!==null&&a!==void 0?a:void 0,C=(l=n.photoURL)!==null&&l!==void 0?l:void 0,x=(h=n.tenantId)!==null&&h!==void 0?h:void 0,M=(g=n._redirectEventId)!==null&&g!==void 0?g:void 0,Te=(E=n.createdAt)!==null&&E!==void 0?E:void 0,se=(T=n.lastLoginAt)!==null&&T!==void 0?T:void 0,{uid:j,emailVerified:fe,isAnonymous:Ke,providerData:Y,stsTokenManager:v}=n;S(j&&v,e,"internal-error");const d=ut.fromJSON(this.name,v);S(typeof j=="string",e,"internal-error"),je(A,e.name),je(k,e.name),S(typeof fe=="boolean",e,"internal-error"),S(typeof Ke=="boolean",e,"internal-error"),je(N,e.name),je(C,e.name),je(x,e.name),je(M,e.name),je(Te,e.name),je(se,e.name);const p=new Ce({uid:j,auth:e,email:k,emailVerified:fe,displayName:A,isAnonymous:Ke,photoURL:C,phoneNumber:N,tenantId:x,stsTokenManager:d,createdAt:Te,lastLoginAt:se});return Y&&Array.isArray(Y)&&(p.providerData=Y.map(m=>Object.assign({},m))),M&&(p._redirectEventId=M),p}static async _fromIdTokenResponse(e,n,r=!1){const s=new ut;s.updateFromServerResponse(n);const a=new Ce({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Cn(a),a}static async _fromGetAccountInfoResponse(e,n,r){const s=n.users[0];S(s.localId!==void 0,"internal-error");const a=s.providerUserInfo!==void 0?fa(s.providerUserInfo):[],l=!(s.email&&s.passwordHash)&&!(a!=null&&a.length),h=new ut;h.updateFromIdToken(r);const g=new Ce({uid:s.localId,auth:e,stsTokenManager:h,isAnonymous:l}),E={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Wi(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(a!=null&&a.length)};return Object.assign(g,E),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vs=new Map;function Re(t){Ne(t instanceof Function,"Expected a class definition");let e=Vs.get(t);return e?(Ne(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Vs.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}pa.type="NONE";const Hs=pa;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(t,e,n){return`firebase:${t}:${e}:${n}`}class ht{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:s,name:a}=this.auth;this.fullUserKey=En(this.userKey,s.apiKey,a),this.fullPersistenceKey=En("persistence",s.apiKey,a),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ce._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new ht(Re(Hs),e,r);const s=(await Promise.all(n.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let a=s[0]||Re(Hs);const l=En(r,e.config.apiKey,e.name);let h=null;for(const E of n)try{const T=await E._get(l);if(T){const A=Ce._fromJSON(e,T);E!==a&&(h=A),a=E;break}}catch{}const g=s.filter(E=>E._shouldAllowMigration);return!a._shouldAllowMigration||!g.length?new ht(a,e,r):(a=g[0],h&&await a._set(l,h.toJSON()),await Promise.all(n.map(async E=>{if(E!==a)try{await E._remove(l)}catch{}})),new ht(a,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gs(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(va(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ga(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ia(e))return"Blackberry";if(_a(e))return"Webos";if(ma(e))return"Safari";if((e.includes("chrome/")||ya(e))&&!e.includes("edge/"))return"Chrome";if(wa(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function ga(t=X()){return/firefox\//i.test(t)}function ma(t=X()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ya(t=X()){return/crios\//i.test(t)}function va(t=X()){return/iemobile/i.test(t)}function wa(t=X()){return/android/i.test(t)}function Ia(t=X()){return/blackberry/i.test(t)}function _a(t=X()){return/webos/i.test(t)}function ur(t=X()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function uh(t=X()){var e;return ur(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function hh(){return bl()&&document.documentMode===10}function Ea(t=X()){return ur(t)||wa(t)||_a(t)||Ia(t)||/windows phone/i.test(t)||va(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ta(t,e=[]){let n;switch(t){case"Browser":n=Gs(X());break;case"Worker":n=`${Gs(X())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${gt}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=a=>new Promise((l,h)=>{try{const g=e(a);l(g)}catch(g){h(g)}});r.onAbort=n,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fh(t,e={}){return de(t,"GET","/v2/passwordPolicy",ie(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph=6;class gh{constructor(e){var n,r,s,a;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=l.minPasswordLength)!==null&&n!==void 0?n:ph,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(a=e.forceUpgradeOnSignin)!==null&&a!==void 0?a:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,s,a,l,h;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(n=g.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),g.isValid&&(g.isValid=(r=g.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),g.isValid&&(g.isValid=(s=g.containsLowercaseLetter)!==null&&s!==void 0?s:!0),g.isValid&&(g.isValid=(a=g.containsUppercaseLetter)!==null&&a!==void 0?a:!0),g.isValid&&(g.isValid=(l=g.containsNumericCharacter)!==null&&l!==void 0?l:!0),g.isValid&&(g.isValid=(h=g.containsNonAlphanumericCharacter)!==null&&h!==void 0?h:!0),g}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),s&&(n.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,s,a){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mh{constructor(e,n,r,s){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ws(this),this.idTokenSubscription=new Ws(this),this.beforeStateQueue=new dh(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=aa,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Re(n)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await ht.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await da(this,{idToken:e}),r=await Ce._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(oe(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(h=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(h,h))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,a=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,h=s==null?void 0:s._redirectEventId,g=await this.tryRedirectSignIn(e);(!l||l===h)&&(g!=null&&g.user)&&(s=g.user,a=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(a)try{await this.beforeStateQueue.runMiddleware(s)}catch(l){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return S(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Cn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=zu()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(oe(this.app))return Promise.reject(ye(this));const n=e?ce(e):null;return n&&S(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&S(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return oe(this.app)?Promise.reject(ye(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return oe(this.app)?Promise.reject(ye(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Re(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await fh(this),n=new gh(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ge("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await lh(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Re(e)||this._popupRedirectResolver;S(n,this,"argument-error"),this.redirectPersistenceManager=await ht.create(this,[Re(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,s){if(this._deleted)return()=>{};const a=typeof n=="function"?n:n.next.bind(n);let l=!1;const h=this._isInitialized?Promise.resolve():this._initializationPromise;if(S(h,this,"internal-error"),h.then(()=>{l||a(this.currentUser)}),typeof n=="function"){const g=e.addObserver(n,r,s);return()=>{l=!0,g()}}else{const g=e.addObserver(n);return()=>{l=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return S(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ta(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(n["X-Firebase-AppCheck"]=s),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Wu(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function we(t){return ce(t)}class Ws{constructor(e){this.auth=e,this.observer=null,this.addObserver=Cl(n=>this.observer=n)}get next(){return S(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zt={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function yh(t){Zt=t}function hr(t){return Zt.loadJS(t)}function vh(){return Zt.recaptchaV2Script}function wh(){return Zt.recaptchaEnterpriseScript}function Ih(){return Zt.gapiScript}function ba(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const _h="recaptcha-enterprise",Eh="NO_RECAPTCHA";class Th{constructor(e){this.type=_h,this.auth=we(e)}async verify(e="verify",n=!1){async function r(a){if(!n){if(a.tenantId==null&&a._agentRecaptchaConfig!=null)return a._agentRecaptchaConfig.siteKey;if(a.tenantId!=null&&a._tenantRecaptchaConfigs[a.tenantId]!==void 0)return a._tenantRecaptchaConfigs[a.tenantId].siteKey}return new Promise(async(l,h)=>{th(a,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)h(new Error("recaptcha Enterprise site key undefined"));else{const E=new Zu(g);return a.tenantId==null?a._agentRecaptchaConfig=E:a._tenantRecaptchaConfigs[a.tenantId]=E,l(E.siteKey)}}).catch(g=>{h(g)})})}function s(a,l,h){const g=window.grecaptcha;js(g)?g.enterprise.ready(()=>{g.enterprise.execute(a,{action:e}).then(E=>{l(E)}).catch(()=>{l(Eh)})}):h(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((a,l)=>{r(this.auth).then(h=>{if(!n&&js(window.grecaptcha))s(h,a,l);else{if(typeof window>"u"){l(new Error("RecaptchaVerifier is only supported in browser"));return}let g=wh();g.length!==0&&(g+=h),hr(g).then(()=>{s(h,a,l)}).catch(E=>{l(E)})}}).catch(h=>{l(h)})})}}async function Ks(t,e,n,r=!1){const s=new Th(t);let a;try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const l=Object.assign({},e);return r?Object.assign(l,{captchaResp:a}):Object.assign(l,{captchaResponse:a}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}async function Ki(t,e,n,r){var s;if(!((s=t._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Ks(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const l=await Ks(t,e,n,n==="getOobCode");return r(t,l)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bh(t,e){const n=nt(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),a=n.getOptions();if(An(a,e??{}))return s;he(s,"already-initialized")}return n.initialize({options:e})}function Sh(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Re);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Ah(t,e,n){const r=we(t);S(r._canInitEmulator,r,"emulator-config-failed"),S(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,a=Sa(e),{host:l,port:h}=kh(e),g=h===null?"":`:${h}`;r.config.emulator={url:`${a}//${l}${g}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:l,port:h,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:s})}),Ph()}function Sa(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function kh(t){const e=Sa(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const a=s[1];return{host:a,port:qs(r.substr(a.length+1))}}else{const[a,l]=r.split(":");return{host:a,port:qs(l)}}}function qs(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Ph(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Pe("not implemented")}_getIdTokenResponse(e){return Pe("not implemented")}_linkToIdToken(e,n){return Pe("not implemented")}_getReauthenticationResolver(e){return Pe("not implemented")}}async function Ch(t,e){return de(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rh(t,e){return We(t,"POST","/v1/accounts:signInWithPassword",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oh(t,e){return We(t,"POST","/v1/accounts:signInWithEmailLink",ie(t,e))}async function Lh(t,e){return We(t,"POST","/v1/accounts:signInWithEmailLink",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt extends jn{constructor(e,n,r,s=null){super("password",r),this._email=e,this._password=n,this._tenantId=s}static _fromEmailAndPassword(e,n){return new Jt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Jt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ki(e,n,"signInWithPassword",Rh);case"emailLink":return Oh(e,{email:this._email,oobCode:this._password});default:he(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ki(e,r,"signUpPassword",Ch);case"emailLink":return Lh(e,{idToken:n,email:this._email,oobCode:this._password});default:he(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dt(t,e){return We(t,"POST","/v1/accounts:signInWithIdp",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nh="http://localhost";class De extends jn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new De(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):he("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=n,a=sr(n,["providerId","signInMethod"]);if(!r||!s)return null;const l=new De(r,s);return l.idToken=a.idToken||void 0,l.accessToken=a.accessToken||void 0,l.secret=a.secret,l.nonce=a.nonce,l.pendingToken=a.pendingToken||null,l}_getIdTokenResponse(e){const n=this.buildRequest();return dt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,dt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,dt(e,n)}buildRequest(){const e={requestUri:Nh,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=pt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dh(t,e){return de(t,"POST","/v1/accounts:sendVerificationCode",ie(t,e))}async function Mh(t,e){return We(t,"POST","/v1/accounts:signInWithPhoneNumber",ie(t,e))}async function Uh(t,e){const n=await We(t,"POST","/v1/accounts:signInWithPhoneNumber",ie(t,e));if(n.temporaryProof)throw xt(t,"account-exists-with-different-credential",n);return n}const Fh={USER_NOT_FOUND:"user-not-found"};async function xh(t,e){const n=Object.assign(Object.assign({},e),{operation:"REAUTH"});return We(t,"POST","/v1/accounts:signInWithPhoneNumber",ie(t,n),Fh)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt extends jn{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,n){return new jt({verificationId:e,verificationCode:n})}static _fromTokenResponse(e,n){return new jt({phoneNumber:e,temporaryProof:n})}_getIdTokenResponse(e){return Mh(e,this._makeVerificationRequest())}_linkToIdToken(e,n){return Uh(e,Object.assign({idToken:n},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return xh(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:n,verificationId:r,verificationCode:s}=this.params;return e&&n?{temporaryProof:e,phoneNumber:n}:{sessionInfo:r,code:s}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:n,verificationCode:r,phoneNumber:s,temporaryProof:a}=e;return!r&&!n&&!s&&!a?null:new jt({verificationId:n,verificationCode:r,phoneNumber:s,temporaryProof:a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bh(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function jh(t){const e=Ut(Ft(t)).link,n=e?Ut(Ft(e)).deep_link_id:null,r=Ut(Ft(t)).deep_link_id;return(r?Ut(Ft(r)).link:null)||r||n||e||t}class dr{constructor(e){var n,r,s,a,l,h;const g=Ut(Ft(e)),E=(n=g.apiKey)!==null&&n!==void 0?n:null,T=(r=g.oobCode)!==null&&r!==void 0?r:null,A=Bh((s=g.mode)!==null&&s!==void 0?s:null);S(E&&T&&A,"argument-error"),this.apiKey=E,this.operation=A,this.code=T,this.continueUrl=(a=g.continueUrl)!==null&&a!==void 0?a:null,this.languageCode=(l=g.languageCode)!==null&&l!==void 0?l:null,this.tenantId=(h=g.tenantId)!==null&&h!==void 0?h:null}static parseLink(e){const n=jh(e);try{return new dr(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(){this.providerId=mt.PROVIDER_ID}static credential(e,n){return Jt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=dr.parseLink(n);return S(r,"argument-error"),Jt._fromEmailAndCode(e,r.code,r.tenantId)}}mt.PROVIDER_ID="password";mt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";mt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt extends fr{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class $t extends yt{static credentialFromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;return S("providerId"in n&&"signInMethod"in n,"argument-error"),De._fromParams(n)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return S(e.idToken||e.accessToken,"argument-error"),De._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return $t.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return $t.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r,oauthTokenSecret:s,pendingToken:a,nonce:l,providerId:h}=e;if(!r&&!s&&!n&&!a||!h)return null;try{return new $t(h)._credential({idToken:n,accessToken:r,nonce:l,pendingToken:a})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge extends yt{constructor(){super("facebook.com")}static credential(e){return De._fromParams({providerId:ge.PROVIDER_ID,signInMethod:ge.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ge.credentialFromTaggedObject(e)}static credentialFromError(e){return ge.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ge.credential(e.oauthAccessToken)}catch{return null}}}ge.FACEBOOK_SIGN_IN_METHOD="facebook.com";ge.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e extends yt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return De._fromParams({providerId:_e.PROVIDER_ID,signInMethod:_e.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return _e.credentialFromTaggedObject(e)}static credentialFromError(e){return _e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return _e.credential(n,r)}catch{return null}}}_e.GOOGLE_SIGN_IN_METHOD="google.com";_e.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee extends yt{constructor(){super("github.com")}static credential(e){return De._fromParams({providerId:Ee.PROVIDER_ID,signInMethod:Ee.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ee.credentialFromTaggedObject(e)}static credentialFromError(e){return Ee.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ee.credential(e.oauthAccessToken)}catch{return null}}}Ee.GITHUB_SIGN_IN_METHOD="github.com";Ee.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e extends yt{constructor(){super("twitter.com")}static credential(e,n){return De._fromParams({providerId:$e.PROVIDER_ID,signInMethod:$e.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return $e.credentialFromTaggedObject(e)}static credentialFromError(e){return $e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return $e.credential(n,r)}catch{return null}}}$e.TWITTER_SIGN_IN_METHOD="twitter.com";$e.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Aa(t,e){return We(t,"POST","/v1/accounts:signUp",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,s=!1){const a=await Ce._fromIdTokenResponse(e,r,s),l=zs(r);return new Me({user:a,providerId:l,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const s=zs(r);return new Me({user:e,providerId:s,_tokenResponse:r,operationType:n})}}function zs(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ka(t){var e;if(oe(t.app))return Promise.reject(ye(t));const n=we(t);if(await n._initializationPromise,!((e=n.currentUser)===null||e===void 0)&&e.isAnonymous)return new Me({user:n.currentUser,providerId:null,operationType:"signIn"});const r=await Aa(n,{returnSecureToken:!0}),s=await Me._fromIdTokenResponse(n,"signIn",r,!0);return await n._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn extends ve{constructor(e,n,r,s){var a;super(n.code,n.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Rn.prototype),this.customData={appName:e.name,tenantId:(a=e.tenantId)!==null&&a!==void 0?a:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,s){return new Rn(e,n,r,s)}}function Pa(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?Rn._fromErrorAndOperation(t,a,e,r):a})}async function $h(t,e,n=!1){const r=await zt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Me._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vh(t,e,n=!1){const{auth:r}=t;if(oe(r.app))return Promise.reject(ye(r));const s="reauthenticate";try{const a=await zt(t,Pa(r,s,e,t),n);S(a.idToken,r,"internal-error");const l=lr(a.idToken);S(l,r,"internal-error");const{sub:h}=l;return S(t.uid===h,r,"user-mismatch"),Me._forOperation(t,s,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&he(r,"user-mismatch"),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ca(t,e,n=!1){if(oe(t.app))return Promise.reject(ye(t));const r="signIn",s=await Pa(t,r,e),a=await Me._fromIdTokenResponse(t,r,s);return n||await t._updateCurrentUser(a.user),a}async function Ra(t,e){return Ca(we(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oa(t){const e=we(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Hh(t,e,n){if(oe(t.app))return Promise.reject(ye(t));const r=we(t),l=await Ki(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Aa).catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&Oa(t),g}),h=await Me._fromIdTokenResponse(r,"signIn",l);return await r._updateCurrentUser(h.user),h}function Gh(t,e,n){return oe(t.app)?Promise.reject(ye(t)):Ra(ce(t),mt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Oa(t),r})}function Wh(t,e,n,r){return ce(t).onIdTokenChanged(e,n,r)}function Kh(t,e,n){return ce(t).beforeAuthStateChanged(e,n)}function qh(t){return ce(t).signOut()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zh(t,e){return de(t,"POST","/v2/accounts/mfaEnrollment:start",ie(t,e))}const On="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(On,"1"),this.storage.removeItem(On),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jh=1e3,Xh=10;class Na extends La{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ea(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),s=this.localCache[n];r!==s&&e(n,s,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((l,h,g)=>{this.notifyListeners(l,g)});return}const r=e.key;n?this.detachListener():this.stopPolling();const s=()=>{const l=this.storage.getItem(r);!n&&this.localCache[r]===l||this.notifyListeners(r,l)},a=this.storage.getItem(r);hh()&&a!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Xh):s()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Jh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Na.type="LOCAL";const Yh=Na;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da extends La{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Da.type="SESSION";const Ma=Da;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qh(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const r=new $n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:s,data:a}=n.data,l=this.handlersMap[s];if(!(l!=null&&l.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const h=Array.from(l).map(async E=>E(n.origin,a)),g=await Qh(h);n.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:g})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}$n.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pr(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let a,l;return new Promise((h,g)=>{const E=pr("",20);s.port1.start();const T=setTimeout(()=>{g(new Error("unsupported_event"))},r);l={messageChannel:s,onMessage(A){const k=A;if(k.data.eventId===E)switch(k.data.status){case"ack":clearTimeout(T),a=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),h(k.data.response);break;default:clearTimeout(T),clearTimeout(a),g(new Error("invalid_response"));break}}},this.handlers.add(l),s.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:E,data:n},[s.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(){return window}function ed(t){F().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gr(){return typeof F().WorkerGlobalScope<"u"&&typeof F().importScripts=="function"}async function td(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function nd(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function id(){return gr()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ua="firebaseLocalStorageDb",rd=1,Ln="firebaseLocalStorage",Fa="fbase_key";class en{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Vn(t,e){return t.transaction([Ln],e?"readwrite":"readonly").objectStore(Ln)}function sd(){const t=indexedDB.deleteDatabase(Ua);return new en(t).toPromise()}function qi(){const t=indexedDB.open(Ua,rd);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Ln,{keyPath:Fa})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Ln)?e(r):(r.close(),await sd(),e(await qi()))})})}async function Js(t,e,n){const r=Vn(t,!0).put({[Fa]:e,value:n});return new en(r).toPromise()}async function od(t,e){const n=Vn(t,!1).get(e),r=await new en(n).toPromise();return r===void 0?null:r.value}function Xs(t,e){const n=Vn(t,!0).delete(e);return new en(n).toPromise()}const ad=800,cd=3;class xa{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await qi(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>cd)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return gr()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=$n._getInstance(id()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await td(),!this.activeServiceWorker)return;this.sender=new Zh(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||nd()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await qi();return await Js(e,On,"1"),await Xs(e,On),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Js(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>od(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Xs(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const a=Vn(s,!1).getAll();return new en(a).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:a}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(a)&&(this.notifyListeners(s,a),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),ad)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}xa.type="LOCAL";const ld=xa;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ud(t,e){return de(t,"POST","/v2/accounts/mfaSignIn:start",ie(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hd=500,dd=6e4,wn=1e12;class fd{constructor(e){this.auth=e,this.counter=wn,this._widgets=new Map}render(e,n){const r=this.counter;return this._widgets.set(r,new pd(e,this.auth.name,n||{})),this.counter++,r}reset(e){var n;const r=e||wn;(n=this._widgets.get(r))===null||n===void 0||n.delete(),this._widgets.delete(r)}getResponse(e){var n;const r=e||wn;return((n=this._widgets.get(r))===null||n===void 0?void 0:n.getResponse())||""}async execute(e){var n;const r=e||wn;return(n=this._widgets.get(r))===null||n===void 0||n.execute(),""}}class pd{constructor(e,n,r){this.params=r,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const s=typeof e=="string"?document.getElementById(e):e;S(s,"argument-error",{appName:n}),this.container=s,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=gd(50);const{callback:e,"expired-callback":n}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,n)try{n()}catch{}this.isVisible&&this.execute()},dd)},hd))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function gd(t){const e=[],n="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<t;r++)e.push(n.charAt(Math.floor(Math.random()*n.length)));return e.join("")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai=ba("rcb"),md=new Qt(3e4,6e4);class yd{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(!((e=F().grecaptcha)===null||e===void 0)&&e.render)}load(e,n=""){return S(vd(n),e,"argument-error"),this.shouldResolveImmediately(n)&&Bs(F().grecaptcha)?Promise.resolve(F().grecaptcha):new Promise((r,s)=>{const a=F().setTimeout(()=>{s(ee(e,"network-request-failed"))},md.get());F()[Ai]=()=>{F().clearTimeout(a),delete F()[Ai];const h=F().grecaptcha;if(!h||!Bs(h)){s(ee(e,"internal-error"));return}const g=h.render;h.render=(E,T)=>{const A=g(E,T);return this.counter++,A},this.hostLanguage=n,r(h)};const l=`${vh()}?${pt({onload:Ai,render:"explicit",hl:n})}`;hr(l).catch(()=>{clearTimeout(a),s(ee(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var n;return!!(!((n=F().grecaptcha)===null||n===void 0)&&n.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function vd(t){return t.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(t)}class wd{async load(e){return new fd(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ba="recaptcha",Id={theme:"light",type:"image"};class _d{constructor(e,n,r=Object.assign({},Id)){this.parameters=r,this.type=Ba,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=we(e),this.isInvisible=this.parameters.size==="invisible",S(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const s=typeof n=="string"?document.getElementById(n):n;S(s,this.auth,"argument-error"),this.container=s,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new wd:new yd,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),n=this.getAssertedRecaptcha(),r=n.getResponse(e);return r||new Promise(s=>{const a=l=>{l&&(this.tokenChangeListeners.delete(a),s(l))};this.tokenChangeListeners.add(a),this.isInvisible&&n.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){S(!this.parameters.sitekey,this.auth,"argument-error"),S(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),S(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return n=>{if(this.tokenChangeListeners.forEach(r=>r(n)),typeof e=="function")e(n);else if(typeof e=="string"){const r=F()[e];typeof r=="function"&&r(n)}}}assertNotDestroyed(){S(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const n=document.createElement("div");e.appendChild(n),e=n}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){S(ca()&&!gr(),this.auth,"internal-error"),await Ed(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await eh(this.auth);S(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return S(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function Ed(){let t=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}t=()=>e(),window.addEventListener("load",t)}).catch(e=>{throw t&&window.removeEventListener("load",t),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{constructor(e,n){this.verificationId=e,this.onConfirmation=n}confirm(e){const n=jt._fromVerification(this.verificationId,e);return this.onConfirmation(n)}}async function bd(t,e,n){if(oe(t.app))return Promise.reject(ye(t));const r=we(t),s=await Sd(r,e,ce(n));return new Td(s,a=>Ra(r,a))}async function Sd(t,e,n){var r;const s=await n.verify();try{S(typeof s=="string",t,"argument-error"),S(n.type===Ba,t,"argument-error");let a;if(typeof e=="string"?a={phoneNumber:e}:a=e,"session"in a){const l=a.session;if("phoneNumber"in a)return S(l.type==="enroll",t,"internal-error"),(await zh(t,{idToken:l.credential,phoneEnrollmentInfo:{phoneNumber:a.phoneNumber,recaptchaToken:s}})).phoneSessionInfo.sessionInfo;{S(l.type==="signin",t,"internal-error");const h=((r=a.multiFactorHint)===null||r===void 0?void 0:r.uid)||a.multiFactorUid;return S(h,t,"missing-multi-factor-info"),(await ud(t,{mfaPendingCredential:l.credential,mfaEnrollmentId:h,phoneSignInInfo:{recaptchaToken:s}})).phoneResponseInfo.sessionInfo}}else{const{sessionInfo:l}=await Dh(t,{phoneNumber:a.phoneNumber,recaptchaToken:s});return l}}finally{n._reset()}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ja(t,e){return e?Re(e):(S(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr extends jn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return dt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return dt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return dt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Ad(t){return Ca(t.auth,new mr(t),t.bypassAuthState)}function kd(t){const{auth:e,user:n}=t;return S(n,e,"internal-error"),Vh(n,new mr(t),t.bypassAuthState)}async function Pd(t){const{auth:e,user:n}=t;return S(n,e,"internal-error"),$h(n,new mr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(e,n,r,s,a=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:s,tenantId:a,error:l,type:h}=e;if(l){this.reject(l);return}const g={auth:this.auth,requestUri:n,sessionId:r,tenantId:a||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(h)(g))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ad;case"linkViaPopup":case"linkViaRedirect":return Pd;case"reauthViaPopup":case"reauthViaRedirect":return kd;default:he(this.auth,"internal-error")}}resolve(e){Ne(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ne(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cd=new Qt(2e3,1e4);async function vt(t,e,n){if(oe(t.app))return Promise.reject(ee(t,"operation-not-supported-in-this-environment"));const r=we(t);Ku(t,e,fr);const s=ja(r,n);return new Qe(r,"signInViaPopup",e,s).executeNotNull()}class Qe extends $a{constructor(e,n,r,s,a){super(e,n,s,a),this.provider=r,this.authWindow=null,this.pollId=null,Qe.currentPopupAction&&Qe.currentPopupAction.cancel(),Qe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return S(e,this.auth,"internal-error"),e}async onExecution(){Ne(this.filter.length===1,"Popup operations only handle one event");const e=pr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ee(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(ee(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Qe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ee(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Cd.get())};e()}}Qe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rd="pendingRedirect",Tn=new Map;class Od extends $a{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Tn.get(this.auth._key());if(!e){try{const r=await Ld(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Tn.set(this.auth._key(),e)}return this.bypassAuthState||Tn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ld(t,e){const n=Md(e),r=Dd(t);if(!await r._isAvailable())return!1;const s=await r._get(n)==="true";return await r._remove(n),s}function Nd(t,e){Tn.set(t._key(),e)}function Dd(t){return Re(t._redirectPersistence)}function Md(t){return En(Rd,t.config.apiKey,t.name)}async function Ud(t,e,n=!1){if(oe(t.app))return Promise.reject(ye(t));const r=we(t),s=ja(r,e),l=await new Od(r,s,n).execute();return l&&!n&&(delete l.user._redirectEventId,await r._persistUserIfCurrent(l.user),await r._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fd=10*60*1e3;class xd{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Bd(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Va(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(ee(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Fd&&this.cachedEventUids.clear(),this.cachedEventUids.has(Ys(e))}saveEventToCache(e){this.cachedEventUids.add(Ys(e)),this.lastProcessedEventTime=Date.now()}}function Ys(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Va({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Bd(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Va(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jd(t,e={}){return de(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Vd=/^https?/;async function Hd(t){if(t.config.emulator)return;const{authorizedDomains:e}=await jd(t);for(const n of e)try{if(Gd(n))return}catch{}he(t,"unauthorized-domain")}function Gd(t){const e=Gi(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const l=new URL(t);return l.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&l.hostname===r}if(!Vd.test(n))return!1;if($d.test(t))return r===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wd=new Qt(3e4,6e4);function Qs(){const t=F().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Kd(t){return new Promise((e,n)=>{var r,s,a;function l(){Qs(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Qs(),n(ee(t,"network-request-failed"))},timeout:Wd.get()})}if(!((s=(r=F().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((a=F().gapi)===null||a===void 0)&&a.load)l();else{const h=ba("iframefcb");return F()[h]=()=>{gapi.load?l():n(ee(t,"network-request-failed"))},hr(`${Ih()}?onload=${h}`).catch(g=>n(g))}}).catch(e=>{throw bn=null,e})}let bn=null;function qd(t){return bn=bn||Kd(t),bn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd=new Qt(5e3,15e3),Jd="__/auth/iframe",Xd="emulator/auth/iframe",Yd={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Qd=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Zd(t){const e=t.config;S(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?cr(e,Xd):`https://${t.config.authDomain}/${Jd}`,r={apiKey:e.apiKey,appName:t.name,v:gt},s=Qd.get(t.config.apiHost);s&&(r.eid=s);const a=t._getFrameworks();return a.length&&(r.fw=a.join(",")),`${n}?${pt(r).slice(1)}`}async function ef(t){const e=await qd(t),n=F().gapi;return S(n,t,"internal-error"),e.open({where:document.body,url:Zd(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Yd,dontclear:!0},r=>new Promise(async(s,a)=>{await r.restyle({setHideOnLeave:!1});const l=ee(t,"network-request-failed"),h=F().setTimeout(()=>{a(l)},zd.get());function g(){F().clearTimeout(h),s(r)}r.ping(g).then(g,()=>{a(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tf={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},nf=500,rf=600,sf="_blank",of="http://localhost";class Zs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function af(t,e,n,r=nf,s=rf){const a=Math.max((window.screen.availHeight-s)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let h="";const g=Object.assign(Object.assign({},tf),{width:r.toString(),height:s.toString(),top:a,left:l}),E=X().toLowerCase();n&&(h=ya(E)?sf:n),ga(E)&&(e=e||of,g.scrollbars="yes");const T=Object.entries(g).reduce((k,[N,C])=>`${k}${N}=${C},`,"");if(uh(E)&&h!=="_self")return cf(e||"",h),new Zs(null);const A=window.open(e||"",h,T);S(A,t,"popup-blocked");try{A.focus()}catch{}return new Zs(A)}function cf(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf="__/auth/handler",uf="emulator/auth/handler",hf=encodeURIComponent("fac");async function eo(t,e,n,r,s,a){S(t.config.authDomain,t,"auth-domain-config-required"),S(t.config.apiKey,t,"invalid-api-key");const l={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:gt,eventId:s};if(e instanceof fr){e.setDefaultLanguage(t.languageCode),l.providerId=e.providerId||"",Pl(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[T,A]of Object.entries({}))l[T]=A}if(e instanceof yt){const T=e.getScopes().filter(A=>A!=="");T.length>0&&(l.scopes=T.join(","))}t.tenantId&&(l.tid=t.tenantId);const h=l;for(const T of Object.keys(h))h[T]===void 0&&delete h[T];const g=await t._getAppCheckToken(),E=g?`#${hf}=${encodeURIComponent(g)}`:"";return`${df(t)}?${pt(h).slice(1)}${E}`}function df({config:t}){return t.emulator?cr(t,uf):`https://${t.authDomain}/${lf}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki="webStorageSupport";class ff{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ma,this._completeRedirectFn=Ud,this._overrideRedirectResult=Nd}async _openPopup(e,n,r,s){var a;Ne((a=this.eventManagers[e._key()])===null||a===void 0?void 0:a.manager,"_initialize() not called before _openPopup()");const l=await eo(e,n,r,Gi(),s);return af(e,l,pr())}async _openRedirect(e,n,r,s){await this._originValidation(e);const a=await eo(e,n,r,Gi(),s);return ed(a),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:a}=this.eventManagers[n];return s?Promise.resolve(s):(Ne(a,"If manager is not set, promise should be"),a)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await ef(e),r=new xd(e);return n.register("authEvent",s=>(S(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(ki,{type:ki},s=>{var a;const l=(a=s==null?void 0:s[0])===null||a===void 0?void 0:a[ki];l!==void 0&&n(!!l),he(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Hd(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ea()||ma()||ur()}}const pf=ff;var to="@firebase/auth",no="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gf{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){S(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mf(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function yf(t){ae(new ne("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),a=e.getProvider("app-check-internal"),{apiKey:l,authDomain:h}=r.options;S(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const g={apiKey:l,authDomain:h,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ta(t)},E=new mh(r,s,a,g);return Sh(E,n),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),ae(new ne("auth-internal",e=>{const n=we(e.getProvider("auth").getImmediate());return(r=>new gf(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),W(to,no,mf(t)),W(to,no,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vf=5*60,wf=Zo("authIdTokenMaxAge")||vf;let io=null;const If=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>wf)return;const s=n==null?void 0:n.token;io!==s&&(io=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Ha(t=Bn()){const e=nt(t,"auth");if(e.isInitialized())return e.getImmediate();const n=bh(t,{popupRedirectResolver:pf,persistence:[ld,Yh,Ma]}),r=Zo("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(r,location.origin);if(location.origin===a.origin){const l=If(a.toString());Kh(n,l,()=>l(n.currentUser)),Wh(n,h=>l(h))}}const s=Xo("auth");return s&&Ah(n,`http://${s}`),n}function _f(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}yh({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=s=>{const a=ee("internal-error");a.customData=s,n(a)},r.type="text/javascript",r.charset="UTF-8",_f().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});yf("Browser");const Ga="@firebase/installations",yr="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wa=1e4,Ka=`w:${yr}`,qa="FIS_v2",Ef="https://firebaseinstallations.googleapis.com/v1",Tf=60*60*1e3,bf="installations",Sf="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Af={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},et=new Ge(bf,Sf,Af);function za(t){return t instanceof ve&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja({projectId:t}){return`${Ef}/projects/${t}/installations`}function Xa(t){return{token:t.token,requestStatus:2,expiresIn:Pf(t.expiresIn),creationTime:Date.now()}}async function Ya(t,e){const r=(await e.json()).error;return et.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Qa({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function kf(t,{refreshToken:e}){const n=Qa(t);return n.append("Authorization",Cf(e)),n}async function Za(t){const e=await t();return e.status>=500&&e.status<600?t():e}function Pf(t){return Number(t.replace("s","000"))}function Cf(t){return`${qa} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rf({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=Ja(t),s=Qa(t),a=e.getImmediate({optional:!0});if(a){const E=await a.getHeartbeatsHeader();E&&s.append("x-firebase-client",E)}const l={fid:n,authVersion:qa,appId:t.appId,sdkVersion:Ka},h={method:"POST",headers:s,body:JSON.stringify(l)},g=await Za(()=>fetch(r,h));if(g.ok){const E=await g.json();return{fid:E.fid||n,registrationStatus:2,refreshToken:E.refreshToken,authToken:Xa(E.authToken)}}else throw await Ya("Create Installation",g)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Of(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lf=/^[cdef][\w-]{21}$/,zi="";function Nf(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=Df(t);return Lf.test(n)?n:zi}catch{return zi}}function Df(t){return Of(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hn(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=new Map;function nc(t,e){const n=Hn(t);ic(n,e),Mf(n,e)}function ic(t,e){const n=tc.get(t);if(n)for(const r of n)r(e)}function Mf(t,e){const n=Uf();n&&n.postMessage({key:t,fid:e}),Ff()}let Ze=null;function Uf(){return!Ze&&"BroadcastChannel"in self&&(Ze=new BroadcastChannel("[Firebase] FID Change"),Ze.onmessage=t=>{ic(t.data.key,t.data.fid)}),Ze}function Ff(){tc.size===0&&Ze&&(Ze.close(),Ze=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf="firebase-installations-database",Bf=1,tt="firebase-installations-store";let Pi=null;function vr(){return Pi||(Pi=xn(xf,Bf,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(tt)}}})),Pi}async function Nn(t,e){const n=Hn(t),s=(await vr()).transaction(tt,"readwrite"),a=s.objectStore(tt),l=await a.get(n);return await a.put(e,n),await s.done,(!l||l.fid!==e.fid)&&nc(t,e.fid),e}async function rc(t){const e=Hn(t),r=(await vr()).transaction(tt,"readwrite");await r.objectStore(tt).delete(e),await r.done}async function Gn(t,e){const n=Hn(t),s=(await vr()).transaction(tt,"readwrite"),a=s.objectStore(tt),l=await a.get(n),h=e(l);return h===void 0?await a.delete(n):await a.put(h,n),await s.done,h&&(!l||l.fid!==h.fid)&&nc(t,h.fid),h}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wr(t){let e;const n=await Gn(t.appConfig,r=>{const s=jf(r),a=$f(t,s);return e=a.registrationPromise,a.installationEntry});return n.fid===zi?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function jf(t){const e=t||{fid:Nf(),registrationStatus:0};return sc(e)}function $f(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(et.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Vf(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Hf(t)}:{installationEntry:e}}async function Vf(t,e){try{const n=await Rf(t,e);return Nn(t.appConfig,n)}catch(n){throw za(n)&&n.customData.serverCode===409?await rc(t.appConfig):await Nn(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function Hf(t){let e=await ro(t.appConfig);for(;e.registrationStatus===1;)await ec(100),e=await ro(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await wr(t);return r||n}return e}function ro(t){return Gn(t,e=>{if(!e)throw et.create("installation-not-found");return sc(e)})}function sc(t){return Gf(t)?{fid:t.fid,registrationStatus:0}:t}function Gf(t){return t.registrationStatus===1&&t.registrationTime+Wa<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wf({appConfig:t,heartbeatServiceProvider:e},n){const r=Kf(t,n),s=kf(t,n),a=e.getImmediate({optional:!0});if(a){const E=await a.getHeartbeatsHeader();E&&s.append("x-firebase-client",E)}const l={installation:{sdkVersion:Ka,appId:t.appId}},h={method:"POST",headers:s,body:JSON.stringify(l)},g=await Za(()=>fetch(r,h));if(g.ok){const E=await g.json();return Xa(E)}else throw await Ya("Generate Auth Token",g)}function Kf(t,{fid:e}){return`${Ja(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ir(t,e=!1){let n;const r=await Gn(t.appConfig,a=>{if(!oc(a))throw et.create("not-registered");const l=a.authToken;if(!e&&Jf(l))return a;if(l.requestStatus===1)return n=qf(t,e),a;{if(!navigator.onLine)throw et.create("app-offline");const h=Yf(a);return n=zf(t,h),h}});return n?await n:r.authToken}async function qf(t,e){let n=await so(t.appConfig);for(;n.authToken.requestStatus===1;)await ec(100),n=await so(t.appConfig);const r=n.authToken;return r.requestStatus===0?Ir(t,e):r}function so(t){return Gn(t,e=>{if(!oc(e))throw et.create("not-registered");const n=e.authToken;return Qf(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function zf(t,e){try{const n=await Wf(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await Nn(t.appConfig,r),n}catch(n){if(za(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await rc(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Nn(t.appConfig,r)}throw n}}function oc(t){return t!==void 0&&t.registrationStatus===2}function Jf(t){return t.requestStatus===2&&!Xf(t)}function Xf(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+Tf}function Yf(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function Qf(t){return t.requestStatus===1&&t.requestTime+Wa<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zf(t){const e=t,{installationEntry:n,registrationPromise:r}=await wr(e);return r?r.catch(console.error):Ir(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ep(t,e=!1){const n=t;return await tp(n),(await Ir(n,e)).token}async function tp(t){const{registrationPromise:e}=await wr(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function np(t){if(!t||!t.options)throw Ci("App Configuration");if(!t.name)throw Ci("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw Ci(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function Ci(t){return et.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ac="installations",ip="installations-internal",rp=t=>{const e=t.getProvider("app").getImmediate(),n=np(e),r=nt(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},sp=t=>{const e=t.getProvider("app").getImmediate(),n=nt(e,ac).getImmediate();return{getId:()=>Zf(n),getToken:s=>ep(n,s)}};function op(){ae(new ne(ac,rp,"PUBLIC")),ae(new ne(ip,sp,"PRIVATE"))}op();W(Ga,yr);W(Ga,yr,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ap="/firebase-messaging-sw.js",cp="/firebase-cloud-messaging-push-scope",cc="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",lp="https://fcmregistrations.googleapis.com/v1",lc="google.c.a.c_id",up="google.c.a.c_l",hp="google.c.a.ts",dp="google.c.a.e";var oo;(function(t){t[t.DATA_MESSAGE=1]="DATA_MESSAGE",t[t.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(oo||(oo={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var Xt;(function(t){t.PUSH_RECEIVED="push-received",t.NOTIFICATION_CLICKED="notification-clicked"})(Xt||(Xt={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(t){const e=new Uint8Array(t);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function fp(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),s=new Uint8Array(r.length);for(let a=0;a<r.length;++a)s[a]=r.charCodeAt(a);return s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ri="fcm_token_details_db",pp=5,ao="fcm_token_object_Store";async function gp(t){if("databases"in indexedDB&&!(await indexedDB.databases()).map(a=>a.name).includes(Ri))return null;let e=null;return(await xn(Ri,pp,{upgrade:async(r,s,a,l)=>{var h;if(s<2||!r.objectStoreNames.contains(ao))return;const g=l.objectStore(ao),E=await g.index("fcmSenderId").get(t);if(await g.clear(),!!E){if(s===2){const T=E;if(!T.auth||!T.p256dh||!T.endpoint)return;e={token:T.fcmToken,createTime:(h=T.createTime)!==null&&h!==void 0?h:Date.now(),subscriptionOptions:{auth:T.auth,p256dh:T.p256dh,endpoint:T.endpoint,swScope:T.swScope,vapidKey:typeof T.vapidKey=="string"?T.vapidKey:ke(T.vapidKey)}}}else if(s===3){const T=E;e={token:T.fcmToken,createTime:T.createTime,subscriptionOptions:{auth:ke(T.auth),p256dh:ke(T.p256dh),endpoint:T.endpoint,swScope:T.swScope,vapidKey:ke(T.vapidKey)}}}else if(s===4){const T=E;e={token:T.fcmToken,createTime:T.createTime,subscriptionOptions:{auth:ke(T.auth),p256dh:ke(T.p256dh),endpoint:T.endpoint,swScope:T.swScope,vapidKey:ke(T.vapidKey)}}}}}})).close(),await Ei(Ri),await Ei("fcm_vapid_details_db"),await Ei("undefined"),mp(e)?e:null}function mp(t){if(!t||!t.subscriptionOptions)return!1;const{subscriptionOptions:e}=t;return typeof t.createTime=="number"&&t.createTime>0&&typeof t.token=="string"&&t.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yp="firebase-messaging-database",vp=1,Yt="firebase-messaging-store";let Oi=null;function uc(){return Oi||(Oi=xn(yp,vp,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(Yt)}}})),Oi}async function wp(t){const e=hc(t),r=await(await uc()).transaction(Yt).objectStore(Yt).get(e);if(r)return r;{const s=await gp(t.appConfig.senderId);if(s)return await _r(t,s),s}}async function _r(t,e){const n=hc(t),s=(await uc()).transaction(Yt,"readwrite");return await s.objectStore(Yt).put(e,n),await s.done,e}function hc({appConfig:t}){return t.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ip={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},J=new Ge("messaging","Messaging",Ip);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _p(t,e){const n=await Tr(t),r=dc(e),s={method:"POST",headers:n,body:JSON.stringify(r)};let a;try{a=await(await fetch(Er(t.appConfig),s)).json()}catch(l){throw J.create("token-subscribe-failed",{errorInfo:l==null?void 0:l.toString()})}if(a.error){const l=a.error.message;throw J.create("token-subscribe-failed",{errorInfo:l})}if(!a.token)throw J.create("token-subscribe-no-token");return a.token}async function Ep(t,e){const n=await Tr(t),r=dc(e.subscriptionOptions),s={method:"PATCH",headers:n,body:JSON.stringify(r)};let a;try{a=await(await fetch(`${Er(t.appConfig)}/${e.token}`,s)).json()}catch(l){throw J.create("token-update-failed",{errorInfo:l==null?void 0:l.toString()})}if(a.error){const l=a.error.message;throw J.create("token-update-failed",{errorInfo:l})}if(!a.token)throw J.create("token-update-no-token");return a.token}async function Tp(t,e){const r={method:"DELETE",headers:await Tr(t)};try{const a=await(await fetch(`${Er(t.appConfig)}/${e}`,r)).json();if(a.error){const l=a.error.message;throw J.create("token-unsubscribe-failed",{errorInfo:l})}}catch(s){throw J.create("token-unsubscribe-failed",{errorInfo:s==null?void 0:s.toString()})}}function Er({projectId:t}){return`${lp}/projects/${t}/registrations`}async function Tr({appConfig:t,installations:e}){const n=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function dc({p256dh:t,auth:e,endpoint:n,vapidKey:r}){const s={web:{endpoint:n,auth:e,p256dh:t}};return r!==cc&&(s.web.applicationPubKey=r),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bp=7*24*60*60*1e3;async function Sp(t){const e=await kp(t.swRegistration,t.vapidKey),n={vapidKey:t.vapidKey,swScope:t.swRegistration.scope,endpoint:e.endpoint,auth:ke(e.getKey("auth")),p256dh:ke(e.getKey("p256dh"))},r=await wp(t.firebaseDependencies);if(r){if(Pp(r.subscriptionOptions,n))return Date.now()>=r.createTime+bp?Ap(t,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await Tp(t.firebaseDependencies,r.token)}catch(s){console.warn(s)}return co(t.firebaseDependencies,n)}else return co(t.firebaseDependencies,n)}async function Ap(t,e){try{const n=await Ep(t.firebaseDependencies,e),r=Object.assign(Object.assign({},e),{token:n,createTime:Date.now()});return await _r(t.firebaseDependencies,r),n}catch(n){throw n}}async function co(t,e){const r={token:await _p(t,e),createTime:Date.now(),subscriptionOptions:e};return await _r(t,r),r.token}async function kp(t,e){const n=await t.pushManager.getSubscription();return n||t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:fp(e)})}function Pp(t,e){const n=e.vapidKey===t.vapidKey,r=e.endpoint===t.endpoint,s=e.auth===t.auth,a=e.p256dh===t.p256dh;return n&&r&&s&&a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lo(t){const e={from:t.from,collapseKey:t.collapse_key,messageId:t.fcmMessageId};return Cp(e,t),Rp(e,t),Op(e,t),e}function Cp(t,e){if(!e.notification)return;t.notification={};const n=e.notification.title;n&&(t.notification.title=n);const r=e.notification.body;r&&(t.notification.body=r);const s=e.notification.image;s&&(t.notification.image=s);const a=e.notification.icon;a&&(t.notification.icon=a)}function Rp(t,e){e.data&&(t.data=e.data)}function Op(t,e){var n,r,s,a,l;if(!e.fcmOptions&&!(!((n=e.notification)===null||n===void 0)&&n.click_action))return;t.fcmOptions={};const h=(s=(r=e.fcmOptions)===null||r===void 0?void 0:r.link)!==null&&s!==void 0?s:(a=e.notification)===null||a===void 0?void 0:a.click_action;h&&(t.fcmOptions.link=h);const g=(l=e.fcmOptions)===null||l===void 0?void 0:l.analytics_label;g&&(t.fcmOptions.analyticsLabel=g)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lp(t){return typeof t=="object"&&!!t&&lc in t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Np(t){if(!t||!t.options)throw Li("App Configuration Object");if(!t.name)throw Li("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:n}=t;for(const r of e)if(!n[r])throw Li(r);return{appName:t.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function Li(t){return J.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const s=Np(e);this.firebaseDependencies={app:e,appConfig:s,installations:n,analyticsProvider:r}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mp(t){try{t.swRegistration=await navigator.serviceWorker.register(ap,{scope:cp}),t.swRegistration.update().catch(()=>{})}catch(e){throw J.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Up(t,e){if(!e&&!t.swRegistration&&await Mp(t),!(!e&&t.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw J.create("invalid-sw-registration");t.swRegistration=e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fp(t,e){e?t.vapidKey=e:t.vapidKey||(t.vapidKey=cc)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xp(t,e){if(!navigator)throw J.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw J.create("permission-blocked");return await Fp(t,e==null?void 0:e.vapidKey),await Up(t,e==null?void 0:e.serviceWorkerRegistration),Sp(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bp(t,e,n){const r=jp(e);(await t.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[lc],message_name:n[up],message_time:n[hp],message_device_time:Math.floor(Date.now()/1e3)})}function jp(t){switch(t){case Xt.NOTIFICATION_CLICKED:return"notification_open";case Xt.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $p(t,e){const n=e.data;if(!n.isFirebaseMessaging)return;t.onMessageHandler&&n.messageType===Xt.PUSH_RECEIVED&&(typeof t.onMessageHandler=="function"?t.onMessageHandler(lo(n)):t.onMessageHandler.next(lo(n)));const r=n.data;Lp(r)&&r[dp]==="1"&&await Bp(t,n.messageType,r)}const uo="@firebase/messaging",ho="0.12.12";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vp=t=>{const e=new Dp(t.getProvider("app").getImmediate(),t.getProvider("installations-internal").getImmediate(),t.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>$p(e,n)),e},Hp=t=>{const e=t.getProvider("messaging").getImmediate();return{getToken:r=>xp(e,r)}};function Gp(){ae(new ne("messaging",Vp,"PUBLIC")),ae(new ne("messaging-internal",Hp,"PRIVATE")),W(uo,ho),W(uo,ho,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wp(){try{await nr()}catch{return!1}return typeof window<"u"&&tr()&&ta()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kp(t=Bn()){return Wp().then(e=>{if(!e)throw J.create("unsupported-browser")},e=>{throw J.create("indexed-db-unsupported")}),nt(ce(t),"messaging").getImmediate()}Gp();/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(e,n,r){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||r.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){const n=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(e){const n=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(e);return{authToken:n,messagingToken:r,appCheckToken:s}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji="us-central1";class zp{constructor(e,n,r,s,a=Ji,l){this.app=e,this.fetchImpl=l,this.emulatorOrigin=null,this.contextProvider=new qp(n,r,s),this.cancelAllRequests=new Promise(h=>{this.deleteService=()=>Promise.resolve(h())});try{const h=new URL(a);this.customDomain=h.origin+(h.pathname==="/"?"":h.pathname),this.region=Ji}catch{this.customDomain=null,this.region=a}}_delete(){return this.deleteService()}_url(e){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${n}.cloudfunctions.net/${e}`}}function Jp(t,e,n){t.emulatorOrigin=`http://${e}:${n}`}const fo="@firebase/functions",po="0.11.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp="auth-internal",Yp="app-check-internal",Qp="messaging-internal";function Zp(t,e){const n=(r,{instanceIdentifier:s})=>{const a=r.getProvider("app").getImmediate(),l=r.getProvider(Xp),h=r.getProvider(Qp),g=r.getProvider(Yp);return new zp(a,l,h,g,s,t)};ae(new ne(fc,n,"PUBLIC").setMultipleInstances(!0)),W(fo,po,e),W(fo,po,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eg(t=Bn(),e=Ji){const r=nt(ce(t),fc).getImmediate({identifier:e}),s=Yo("functions");return s&&pc(r,...s),r}function pc(t,e,n){Jp(ce(t),e,n)}Zp(fetch.bind(self));var go=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gc;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(v,d){function p(){}p.prototype=d.prototype,v.D=d.prototype,v.prototype=new p,v.prototype.constructor=v,v.C=function(m,y,I){for(var f=Array(arguments.length-2),be=2;be<arguments.length;be++)f[be-2]=arguments[be];return d.prototype[y].apply(m,f)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(v,d,p){p||(p=0);var m=Array(16);if(typeof d=="string")for(var y=0;16>y;++y)m[y]=d.charCodeAt(p++)|d.charCodeAt(p++)<<8|d.charCodeAt(p++)<<16|d.charCodeAt(p++)<<24;else for(y=0;16>y;++y)m[y]=d[p++]|d[p++]<<8|d[p++]<<16|d[p++]<<24;d=v.g[0],p=v.g[1],y=v.g[2];var I=v.g[3],f=d+(I^p&(y^I))+m[0]+3614090360&4294967295;d=p+(f<<7&4294967295|f>>>25),f=I+(y^d&(p^y))+m[1]+3905402710&4294967295,I=d+(f<<12&4294967295|f>>>20),f=y+(p^I&(d^p))+m[2]+606105819&4294967295,y=I+(f<<17&4294967295|f>>>15),f=p+(d^y&(I^d))+m[3]+3250441966&4294967295,p=y+(f<<22&4294967295|f>>>10),f=d+(I^p&(y^I))+m[4]+4118548399&4294967295,d=p+(f<<7&4294967295|f>>>25),f=I+(y^d&(p^y))+m[5]+1200080426&4294967295,I=d+(f<<12&4294967295|f>>>20),f=y+(p^I&(d^p))+m[6]+2821735955&4294967295,y=I+(f<<17&4294967295|f>>>15),f=p+(d^y&(I^d))+m[7]+4249261313&4294967295,p=y+(f<<22&4294967295|f>>>10),f=d+(I^p&(y^I))+m[8]+1770035416&4294967295,d=p+(f<<7&4294967295|f>>>25),f=I+(y^d&(p^y))+m[9]+2336552879&4294967295,I=d+(f<<12&4294967295|f>>>20),f=y+(p^I&(d^p))+m[10]+4294925233&4294967295,y=I+(f<<17&4294967295|f>>>15),f=p+(d^y&(I^d))+m[11]+2304563134&4294967295,p=y+(f<<22&4294967295|f>>>10),f=d+(I^p&(y^I))+m[12]+1804603682&4294967295,d=p+(f<<7&4294967295|f>>>25),f=I+(y^d&(p^y))+m[13]+4254626195&4294967295,I=d+(f<<12&4294967295|f>>>20),f=y+(p^I&(d^p))+m[14]+2792965006&4294967295,y=I+(f<<17&4294967295|f>>>15),f=p+(d^y&(I^d))+m[15]+1236535329&4294967295,p=y+(f<<22&4294967295|f>>>10),f=d+(y^I&(p^y))+m[1]+4129170786&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^y&(d^p))+m[6]+3225465664&4294967295,I=d+(f<<9&4294967295|f>>>23),f=y+(d^p&(I^d))+m[11]+643717713&4294967295,y=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(y^I))+m[0]+3921069994&4294967295,p=y+(f<<20&4294967295|f>>>12),f=d+(y^I&(p^y))+m[5]+3593408605&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^y&(d^p))+m[10]+38016083&4294967295,I=d+(f<<9&4294967295|f>>>23),f=y+(d^p&(I^d))+m[15]+3634488961&4294967295,y=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(y^I))+m[4]+3889429448&4294967295,p=y+(f<<20&4294967295|f>>>12),f=d+(y^I&(p^y))+m[9]+568446438&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^y&(d^p))+m[14]+3275163606&4294967295,I=d+(f<<9&4294967295|f>>>23),f=y+(d^p&(I^d))+m[3]+4107603335&4294967295,y=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(y^I))+m[8]+1163531501&4294967295,p=y+(f<<20&4294967295|f>>>12),f=d+(y^I&(p^y))+m[13]+2850285829&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^y&(d^p))+m[2]+4243563512&4294967295,I=d+(f<<9&4294967295|f>>>23),f=y+(d^p&(I^d))+m[7]+1735328473&4294967295,y=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(y^I))+m[12]+2368359562&4294967295,p=y+(f<<20&4294967295|f>>>12),f=d+(p^y^I)+m[5]+4294588738&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^y)+m[8]+2272392833&4294967295,I=d+(f<<11&4294967295|f>>>21),f=y+(I^d^p)+m[11]+1839030562&4294967295,y=I+(f<<16&4294967295|f>>>16),f=p+(y^I^d)+m[14]+4259657740&4294967295,p=y+(f<<23&4294967295|f>>>9),f=d+(p^y^I)+m[1]+2763975236&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^y)+m[4]+1272893353&4294967295,I=d+(f<<11&4294967295|f>>>21),f=y+(I^d^p)+m[7]+4139469664&4294967295,y=I+(f<<16&4294967295|f>>>16),f=p+(y^I^d)+m[10]+3200236656&4294967295,p=y+(f<<23&4294967295|f>>>9),f=d+(p^y^I)+m[13]+681279174&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^y)+m[0]+3936430074&4294967295,I=d+(f<<11&4294967295|f>>>21),f=y+(I^d^p)+m[3]+3572445317&4294967295,y=I+(f<<16&4294967295|f>>>16),f=p+(y^I^d)+m[6]+76029189&4294967295,p=y+(f<<23&4294967295|f>>>9),f=d+(p^y^I)+m[9]+3654602809&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^y)+m[12]+3873151461&4294967295,I=d+(f<<11&4294967295|f>>>21),f=y+(I^d^p)+m[15]+530742520&4294967295,y=I+(f<<16&4294967295|f>>>16),f=p+(y^I^d)+m[2]+3299628645&4294967295,p=y+(f<<23&4294967295|f>>>9),f=d+(y^(p|~I))+m[0]+4096336452&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~y))+m[7]+1126891415&4294967295,I=d+(f<<10&4294967295|f>>>22),f=y+(d^(I|~p))+m[14]+2878612391&4294967295,y=I+(f<<15&4294967295|f>>>17),f=p+(I^(y|~d))+m[5]+4237533241&4294967295,p=y+(f<<21&4294967295|f>>>11),f=d+(y^(p|~I))+m[12]+1700485571&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~y))+m[3]+2399980690&4294967295,I=d+(f<<10&4294967295|f>>>22),f=y+(d^(I|~p))+m[10]+4293915773&4294967295,y=I+(f<<15&4294967295|f>>>17),f=p+(I^(y|~d))+m[1]+2240044497&4294967295,p=y+(f<<21&4294967295|f>>>11),f=d+(y^(p|~I))+m[8]+1873313359&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~y))+m[15]+4264355552&4294967295,I=d+(f<<10&4294967295|f>>>22),f=y+(d^(I|~p))+m[6]+2734768916&4294967295,y=I+(f<<15&4294967295|f>>>17),f=p+(I^(y|~d))+m[13]+1309151649&4294967295,p=y+(f<<21&4294967295|f>>>11),f=d+(y^(p|~I))+m[4]+4149444226&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~y))+m[11]+3174756917&4294967295,I=d+(f<<10&4294967295|f>>>22),f=y+(d^(I|~p))+m[2]+718787259&4294967295,y=I+(f<<15&4294967295|f>>>17),f=p+(I^(y|~d))+m[9]+3951481745&4294967295,v.g[0]=v.g[0]+d&4294967295,v.g[1]=v.g[1]+(y+(f<<21&4294967295|f>>>11))&4294967295,v.g[2]=v.g[2]+y&4294967295,v.g[3]=v.g[3]+I&4294967295}r.prototype.u=function(v,d){d===void 0&&(d=v.length);for(var p=d-this.blockSize,m=this.B,y=this.h,I=0;I<d;){if(y==0)for(;I<=p;)s(this,v,I),I+=this.blockSize;if(typeof v=="string"){for(;I<d;)if(m[y++]=v.charCodeAt(I++),y==this.blockSize){s(this,m),y=0;break}}else for(;I<d;)if(m[y++]=v[I++],y==this.blockSize){s(this,m),y=0;break}}this.h=y,this.o+=d},r.prototype.v=function(){var v=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);v[0]=128;for(var d=1;d<v.length-8;++d)v[d]=0;var p=8*this.o;for(d=v.length-8;d<v.length;++d)v[d]=p&255,p/=256;for(this.u(v),v=Array(16),d=p=0;4>d;++d)for(var m=0;32>m;m+=8)v[p++]=this.g[d]>>>m&255;return v};function a(v,d){var p=h;return Object.prototype.hasOwnProperty.call(p,v)?p[v]:p[v]=d(v)}function l(v,d){this.h=d;for(var p=[],m=!0,y=v.length-1;0<=y;y--){var I=v[y]|0;m&&I==d||(p[y]=I,m=!1)}this.g=p}var h={};function g(v){return-128<=v&&128>v?a(v,function(d){return new l([d|0],0>d?-1:0)}):new l([v|0],0>v?-1:0)}function E(v){if(isNaN(v)||!isFinite(v))return A;if(0>v)return M(E(-v));for(var d=[],p=1,m=0;v>=p;m++)d[m]=v/p|0,p*=4294967296;return new l(d,0)}function T(v,d){if(v.length==0)throw Error("number format error: empty string");if(d=d||10,2>d||36<d)throw Error("radix out of range: "+d);if(v.charAt(0)=="-")return M(T(v.substring(1),d));if(0<=v.indexOf("-"))throw Error('number format error: interior "-" character');for(var p=E(Math.pow(d,8)),m=A,y=0;y<v.length;y+=8){var I=Math.min(8,v.length-y),f=parseInt(v.substring(y,y+I),d);8>I?(I=E(Math.pow(d,I)),m=m.j(I).add(E(f))):(m=m.j(p),m=m.add(E(f)))}return m}var A=g(0),k=g(1),N=g(16777216);t=l.prototype,t.m=function(){if(x(this))return-M(this).m();for(var v=0,d=1,p=0;p<this.g.length;p++){var m=this.i(p);v+=(0<=m?m:4294967296+m)*d,d*=4294967296}return v},t.toString=function(v){if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(C(this))return"0";if(x(this))return"-"+M(this).toString(v);for(var d=E(Math.pow(v,6)),p=this,m="";;){var y=fe(p,d).g;p=Te(p,y.j(d));var I=((0<p.g.length?p.g[0]:p.h)>>>0).toString(v);if(p=y,C(p))return I+m;for(;6>I.length;)I="0"+I;m=I+m}},t.i=function(v){return 0>v?0:v<this.g.length?this.g[v]:this.h};function C(v){if(v.h!=0)return!1;for(var d=0;d<v.g.length;d++)if(v.g[d]!=0)return!1;return!0}function x(v){return v.h==-1}t.l=function(v){return v=Te(this,v),x(v)?-1:C(v)?0:1};function M(v){for(var d=v.g.length,p=[],m=0;m<d;m++)p[m]=~v.g[m];return new l(p,~v.h).add(k)}t.abs=function(){return x(this)?M(this):this},t.add=function(v){for(var d=Math.max(this.g.length,v.g.length),p=[],m=0,y=0;y<=d;y++){var I=m+(this.i(y)&65535)+(v.i(y)&65535),f=(I>>>16)+(this.i(y)>>>16)+(v.i(y)>>>16);m=f>>>16,I&=65535,f&=65535,p[y]=f<<16|I}return new l(p,p[p.length-1]&-2147483648?-1:0)};function Te(v,d){return v.add(M(d))}t.j=function(v){if(C(this)||C(v))return A;if(x(this))return x(v)?M(this).j(M(v)):M(M(this).j(v));if(x(v))return M(this.j(M(v)));if(0>this.l(N)&&0>v.l(N))return E(this.m()*v.m());for(var d=this.g.length+v.g.length,p=[],m=0;m<2*d;m++)p[m]=0;for(m=0;m<this.g.length;m++)for(var y=0;y<v.g.length;y++){var I=this.i(m)>>>16,f=this.i(m)&65535,be=v.i(y)>>>16,wt=v.i(y)&65535;p[2*m+2*y]+=f*wt,se(p,2*m+2*y),p[2*m+2*y+1]+=I*wt,se(p,2*m+2*y+1),p[2*m+2*y+1]+=f*be,se(p,2*m+2*y+1),p[2*m+2*y+2]+=I*be,se(p,2*m+2*y+2)}for(m=0;m<d;m++)p[m]=p[2*m+1]<<16|p[2*m];for(m=d;m<2*d;m++)p[m]=0;return new l(p,0)};function se(v,d){for(;(v[d]&65535)!=v[d];)v[d+1]+=v[d]>>>16,v[d]&=65535,d++}function j(v,d){this.g=v,this.h=d}function fe(v,d){if(C(d))throw Error("division by zero");if(C(v))return new j(A,A);if(x(v))return d=fe(M(v),d),new j(M(d.g),M(d.h));if(x(d))return d=fe(v,M(d)),new j(M(d.g),d.h);if(30<v.g.length){if(x(v)||x(d))throw Error("slowDivide_ only works with positive integers.");for(var p=k,m=d;0>=m.l(v);)p=Ke(p),m=Ke(m);var y=Y(p,1),I=Y(m,1);for(m=Y(m,2),p=Y(p,2);!C(m);){var f=I.add(m);0>=f.l(v)&&(y=y.add(p),I=f),m=Y(m,1),p=Y(p,1)}return d=Te(v,y.j(d)),new j(y,d)}for(y=A;0<=v.l(d);){for(p=Math.max(1,Math.floor(v.m()/d.m())),m=Math.ceil(Math.log(p)/Math.LN2),m=48>=m?1:Math.pow(2,m-48),I=E(p),f=I.j(d);x(f)||0<f.l(v);)p-=m,I=E(p),f=I.j(d);C(I)&&(I=k),y=y.add(I),v=Te(v,f)}return new j(y,v)}t.A=function(v){return fe(this,v).h},t.and=function(v){for(var d=Math.max(this.g.length,v.g.length),p=[],m=0;m<d;m++)p[m]=this.i(m)&v.i(m);return new l(p,this.h&v.h)},t.or=function(v){for(var d=Math.max(this.g.length,v.g.length),p=[],m=0;m<d;m++)p[m]=this.i(m)|v.i(m);return new l(p,this.h|v.h)},t.xor=function(v){for(var d=Math.max(this.g.length,v.g.length),p=[],m=0;m<d;m++)p[m]=this.i(m)^v.i(m);return new l(p,this.h^v.h)};function Ke(v){for(var d=v.g.length+1,p=[],m=0;m<d;m++)p[m]=v.i(m)<<1|v.i(m-1)>>>31;return new l(p,v.h)}function Y(v,d){var p=d>>5;d%=32;for(var m=v.g.length-p,y=[],I=0;I<m;I++)y[I]=0<d?v.i(I+p)>>>d|v.i(I+p+1)<<32-d:v.i(I+p);return new l(y,v.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=E,l.fromString=T,gc=l}).apply(typeof go<"u"?go:typeof self<"u"?self:typeof window<"u"?window:{});var In=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,o,c){return i==Array.prototype||i==Object.prototype||(i[o]=c.value),i};function n(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof In=="object"&&In];for(var o=0;o<i.length;++o){var c=i[o];if(c&&c.Math==Math)return c}throw Error("Cannot find global object")}var r=n(this);function s(i,o){if(o)e:{var c=r;i=i.split(".");for(var u=0;u<i.length-1;u++){var w=i[u];if(!(w in c))break e;c=c[w]}i=i[i.length-1],u=c[i],o=o(u),o!=u&&o!=null&&e(c,i,{configurable:!0,writable:!0,value:o})}}function a(i,o){i instanceof String&&(i+="");var c=0,u=!1,w={next:function(){if(!u&&c<i.length){var _=c++;return{value:o(_,i[_]),done:!1}}return u=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}s("Array.prototype.values",function(i){return i||function(){return a(this,function(o,c){return c})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},h=this||self;function g(i){var o=typeof i;return o=o!="object"?o:i?Array.isArray(i)?"array":o:"null",o=="array"||o=="object"&&typeof i.length=="number"}function E(i){var o=typeof i;return o=="object"&&i!=null||o=="function"}function T(i,o,c){return i.call.apply(i.bind,arguments)}function A(i,o,c){if(!i)throw Error();if(2<arguments.length){var u=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,u),i.apply(o,w)}}return function(){return i.apply(o,arguments)}}function k(i,o,c){return k=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?T:A,k.apply(null,arguments)}function N(i,o){var c=Array.prototype.slice.call(arguments,1);return function(){var u=c.slice();return u.push.apply(u,arguments),i.apply(this,u)}}function C(i,o){function c(){}c.prototype=o.prototype,i.aa=o.prototype,i.prototype=new c,i.prototype.constructor=i,i.Qb=function(u,w,_){for(var b=Array(arguments.length-2),L=2;L<arguments.length;L++)b[L-2]=arguments[L];return o.prototype[w].apply(u,b)}}function x(i){const o=i.length;if(0<o){const c=Array(o);for(let u=0;u<o;u++)c[u]=i[u];return c}return[]}function M(i,o){for(let c=1;c<arguments.length;c++){const u=arguments[c];if(g(u)){const w=i.length||0,_=u.length||0;i.length=w+_;for(let b=0;b<_;b++)i[w+b]=u[b]}else i.push(u)}}class Te{constructor(o,c){this.i=o,this.j=c,this.h=0,this.g=null}get(){let o;return 0<this.h?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function se(i){return/^[\s\xa0]*$/.test(i)}function j(){var i=h.navigator;return i&&(i=i.userAgent)?i:""}function fe(i){return fe[" "](i),i}fe[" "]=function(){};var Ke=j().indexOf("Gecko")!=-1&&!(j().toLowerCase().indexOf("webkit")!=-1&&j().indexOf("Edge")==-1)&&!(j().indexOf("Trident")!=-1||j().indexOf("MSIE")!=-1)&&j().indexOf("Edge")==-1;function Y(i,o,c){for(const u in i)o.call(c,i[u],u,i)}function v(i,o){for(const c in i)o.call(void 0,i[c],c,i)}function d(i){const o={};for(const c in i)o[c]=i[c];return o}const p="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function m(i,o){let c,u;for(let w=1;w<arguments.length;w++){u=arguments[w];for(c in u)i[c]=u[c];for(let _=0;_<p.length;_++)c=p[_],Object.prototype.hasOwnProperty.call(u,c)&&(i[c]=u[c])}}function y(i){var o=1;i=i.split(":");const c=[];for(;0<o&&i.length;)c.push(i.shift()),o--;return i.length&&c.push(i.join(":")),c}function I(i){h.setTimeout(()=>{throw i},0)}function f(){var i=qn;let o=null;return i.g&&(o=i.g,i.g=i.g.next,i.g||(i.h=null),o.next=null),o}class be{constructor(){this.h=this.g=null}add(o,c){const u=wt.get();u.set(o,c),this.h?this.h.next=u:this.g=u,this.h=u}}var wt=new Te(()=>new Cc,i=>i.reset());class Cc{constructor(){this.next=this.g=this.h=null}set(o,c){this.h=o,this.g=c,this.next=null}reset(){this.next=this.g=this.h=null}}let It,_t=!1,qn=new be,Cr=()=>{const i=h.Promise.resolve(void 0);It=()=>{i.then(Rc)}};var Rc=()=>{for(var i;i=f();){try{i.h.call(i.g)}catch(c){I(c)}var o=wt;o.j(i),100>o.h&&(o.h++,i.next=o.g,o.g=i)}_t=!1};function Ue(){this.s=this.s,this.C=this.C}Ue.prototype.s=!1,Ue.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ue.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function $(i,o){this.type=i,this.g=this.target=o,this.defaultPrevented=!1}$.prototype.h=function(){this.defaultPrevented=!0};var Oc=function(){if(!h.addEventListener||!Object.defineProperty)return!1;var i=!1,o=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const c=()=>{};h.addEventListener("test",c,o),h.removeEventListener("test",c,o)}catch{}return i}();function Et(i,o){if($.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var c=this.type=i.type,u=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=o,o=i.relatedTarget){if(Ke){e:{try{fe(o.nodeName);var w=!0;break e}catch{}w=!1}w||(o=null)}}else c=="mouseover"?o=i.fromElement:c=="mouseout"&&(o=i.toElement);this.relatedTarget=o,u?(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Lc[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&Et.aa.h.call(this)}}C(Et,$);var Lc={2:"touch",3:"pen",4:"mouse"};Et.prototype.h=function(){Et.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var nn="closure_listenable_"+(1e6*Math.random()|0),Nc=0;function Dc(i,o,c,u,w){this.listener=i,this.proxy=null,this.src=o,this.type=c,this.capture=!!u,this.ha=w,this.key=++Nc,this.da=this.fa=!1}function rn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function sn(i){this.src=i,this.g={},this.h=0}sn.prototype.add=function(i,o,c,u,w){var _=i.toString();i=this.g[_],i||(i=this.g[_]=[],this.h++);var b=Jn(i,o,u,w);return-1<b?(o=i[b],c||(o.fa=!1)):(o=new Dc(o,this.src,_,!!u,w),o.fa=c,i.push(o)),o};function zn(i,o){var c=o.type;if(c in i.g){var u=i.g[c],w=Array.prototype.indexOf.call(u,o,void 0),_;(_=0<=w)&&Array.prototype.splice.call(u,w,1),_&&(rn(o),i.g[c].length==0&&(delete i.g[c],i.h--))}}function Jn(i,o,c,u){for(var w=0;w<i.length;++w){var _=i[w];if(!_.da&&_.listener==o&&_.capture==!!c&&_.ha==u)return w}return-1}var Xn="closure_lm_"+(1e6*Math.random()|0),Yn={};function Rr(i,o,c,u,w){if(Array.isArray(o)){for(var _=0;_<o.length;_++)Rr(i,o[_],c,u,w);return null}return c=Nr(c),i&&i[nn]?i.K(o,c,E(u)?!!u.capture:!1,w):Mc(i,o,c,!1,u,w)}function Mc(i,o,c,u,w,_){if(!o)throw Error("Invalid event type");var b=E(w)?!!w.capture:!!w,L=Zn(i);if(L||(i[Xn]=L=new sn(i)),c=L.add(o,c,u,b,_),c.proxy)return c;if(u=Uc(),c.proxy=u,u.src=i,u.listener=c,i.addEventListener)Oc||(w=b),w===void 0&&(w=!1),i.addEventListener(o.toString(),u,w);else if(i.attachEvent)i.attachEvent(Lr(o.toString()),u);else if(i.addListener&&i.removeListener)i.addListener(u);else throw Error("addEventListener and attachEvent are unavailable.");return c}function Uc(){function i(c){return o.call(i.src,i.listener,c)}const o=Fc;return i}function Or(i,o,c,u,w){if(Array.isArray(o))for(var _=0;_<o.length;_++)Or(i,o[_],c,u,w);else u=E(u)?!!u.capture:!!u,c=Nr(c),i&&i[nn]?(i=i.i,o=String(o).toString(),o in i.g&&(_=i.g[o],c=Jn(_,c,u,w),-1<c&&(rn(_[c]),Array.prototype.splice.call(_,c,1),_.length==0&&(delete i.g[o],i.h--)))):i&&(i=Zn(i))&&(o=i.g[o.toString()],i=-1,o&&(i=Jn(o,c,u,w)),(c=-1<i?o[i]:null)&&Qn(c))}function Qn(i){if(typeof i!="number"&&i&&!i.da){var o=i.src;if(o&&o[nn])zn(o.i,i);else{var c=i.type,u=i.proxy;o.removeEventListener?o.removeEventListener(c,u,i.capture):o.detachEvent?o.detachEvent(Lr(c),u):o.addListener&&o.removeListener&&o.removeListener(u),(c=Zn(o))?(zn(c,i),c.h==0&&(c.src=null,o[Xn]=null)):rn(i)}}}function Lr(i){return i in Yn?Yn[i]:Yn[i]="on"+i}function Fc(i,o){if(i.da)i=!0;else{o=new Et(o,this);var c=i.listener,u=i.ha||i.src;i.fa&&Qn(i),i=c.call(u,o)}return i}function Zn(i){return i=i[Xn],i instanceof sn?i:null}var ei="__closure_events_fn_"+(1e9*Math.random()>>>0);function Nr(i){return typeof i=="function"?i:(i[ei]||(i[ei]=function(o){return i.handleEvent(o)}),i[ei])}function V(){Ue.call(this),this.i=new sn(this),this.M=this,this.F=null}C(V,Ue),V.prototype[nn]=!0,V.prototype.removeEventListener=function(i,o,c,u){Or(this,i,o,c,u)};function K(i,o){var c,u=i.F;if(u)for(c=[];u;u=u.F)c.push(u);if(i=i.M,u=o.type||o,typeof o=="string")o=new $(o,i);else if(o instanceof $)o.target=o.target||i;else{var w=o;o=new $(u,i),m(o,w)}if(w=!0,c)for(var _=c.length-1;0<=_;_--){var b=o.g=c[_];w=on(b,u,!0,o)&&w}if(b=o.g=i,w=on(b,u,!0,o)&&w,w=on(b,u,!1,o)&&w,c)for(_=0;_<c.length;_++)b=o.g=c[_],w=on(b,u,!1,o)&&w}V.prototype.N=function(){if(V.aa.N.call(this),this.i){var i=this.i,o;for(o in i.g){for(var c=i.g[o],u=0;u<c.length;u++)rn(c[u]);delete i.g[o],i.h--}}this.F=null},V.prototype.K=function(i,o,c,u){return this.i.add(String(i),o,!1,c,u)},V.prototype.L=function(i,o,c,u){return this.i.add(String(i),o,!0,c,u)};function on(i,o,c,u){if(o=i.i.g[String(o)],!o)return!0;o=o.concat();for(var w=!0,_=0;_<o.length;++_){var b=o[_];if(b&&!b.da&&b.capture==c){var L=b.listener,B=b.ha||b.src;b.fa&&zn(i.i,b),w=L.call(B,u)!==!1&&w}}return w&&!u.defaultPrevented}function Dr(i,o,c){if(typeof i=="function")c&&(i=k(i,c));else if(i&&typeof i.handleEvent=="function")i=k(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(o)?-1:h.setTimeout(i,o||0)}function Mr(i){i.g=Dr(()=>{i.g=null,i.i&&(i.i=!1,Mr(i))},i.l);const o=i.h;i.h=null,i.m.apply(null,o)}class xc extends Ue{constructor(o,c){super(),this.m=o,this.l=c,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:Mr(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Tt(i){Ue.call(this),this.h=i,this.g={}}C(Tt,Ue);var Ur=[];function Fr(i){Y(i.g,function(o,c){this.g.hasOwnProperty(c)&&Qn(o)},i),i.g={}}Tt.prototype.N=function(){Tt.aa.N.call(this),Fr(this)},Tt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ti=h.JSON.stringify,Bc=h.JSON.parse,jc=class{stringify(i){return h.JSON.stringify(i,void 0)}parse(i){return h.JSON.parse(i,void 0)}};function ni(){}ni.prototype.h=null;function xr(i){return i.h||(i.h=i.i())}function $c(){}var bt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ii(){$.call(this,"d")}C(ii,$);function ri(){$.call(this,"c")}C(ri,$);var it={},Br=null;function si(){return Br=Br||new V}it.La="serverreachability";function jr(i){$.call(this,it.La,i)}C(jr,$);function St(i){const o=si();K(o,new jr(o))}it.STAT_EVENT="statevent";function $r(i,o){$.call(this,it.STAT_EVENT,i),this.stat=o}C($r,$);function q(i){const o=si();K(o,new $r(o,i))}it.Ma="timingevent";function Vr(i,o){$.call(this,it.Ma,i),this.size=o}C(Vr,$);function At(i,o){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){i()},o)}function kt(){this.g=!0}kt.prototype.xa=function(){this.g=!1};function Vc(i,o,c,u,w,_){i.info(function(){if(i.g)if(_)for(var b="",L=_.split("&"),B=0;B<L.length;B++){var R=L[B].split("=");if(1<R.length){var H=R[0];R=R[1];var G=H.split("_");b=2<=G.length&&G[1]=="type"?b+(H+"="+R+"&"):b+(H+"=redacted&")}}else b=null;else b=_;return"XMLHTTP REQ ("+u+") [attempt "+w+"]: "+o+`
`+c+`
`+b})}function Hc(i,o,c,u,w,_,b){i.info(function(){return"XMLHTTP RESP ("+u+") [ attempt "+w+"]: "+o+`
`+c+`
`+_+" "+b})}function rt(i,o,c,u){i.info(function(){return"XMLHTTP TEXT ("+o+"): "+Wc(i,c)+(u?" "+u:"")})}function Gc(i,o){i.info(function(){return"TIMEOUT: "+o})}kt.prototype.info=function(){};function Wc(i,o){if(!i.g)return o;if(!o)return null;try{var c=JSON.parse(o);if(c){for(i=0;i<c.length;i++)if(Array.isArray(c[i])){var u=c[i];if(!(2>u.length)){var w=u[1];if(Array.isArray(w)&&!(1>w.length)){var _=w[0];if(_!="noop"&&_!="stop"&&_!="close")for(var b=1;b<w.length;b++)w[b]=""}}}}return ti(c)}catch{return o}}var oi={NO_ERROR:0,TIMEOUT:8},Kc={},ai;function an(){}C(an,ni),an.prototype.g=function(){return new XMLHttpRequest},an.prototype.i=function(){return{}},ai=new an;function Fe(i,o,c,u){this.j=i,this.i=o,this.l=c,this.R=u||1,this.U=new Tt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Hr}function Hr(){this.i=null,this.g="",this.h=!1}var Gr={},ci={};function li(i,o,c){i.L=1,i.v=hn(Se(o)),i.m=c,i.P=!0,Wr(i,null)}function Wr(i,o){i.F=Date.now(),cn(i),i.A=Se(i.v);var c=i.A,u=i.R;Array.isArray(u)||(u=[String(u)]),ss(c.i,"t",u),i.C=0,c=i.j.J,i.h=new Hr,i.g=Ts(i.j,c?o:null,!i.m),0<i.O&&(i.M=new xc(k(i.Y,i,i.g),i.O)),o=i.U,c=i.g,u=i.ca;var w="readystatechange";Array.isArray(w)||(w&&(Ur[0]=w.toString()),w=Ur);for(var _=0;_<w.length;_++){var b=Rr(c,w[_],u||o.handleEvent,!1,o.h||o);if(!b)break;o.g[b.key]=b}o=i.H?d(i.H):{},i.m?(i.u||(i.u="POST"),o["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,o)):(i.u="GET",i.g.ea(i.A,i.u,null,o)),St(),Vc(i.i,i.u,i.A,i.l,i.R,i.m)}Fe.prototype.ca=function(i){i=i.target;const o=this.M;o&&Ae(i)==3?o.j():this.Y(i)},Fe.prototype.Y=function(i){try{if(i==this.g)e:{const G=Ae(this.g);var o=this.g.Ba();const at=this.g.Z();if(!(3>G)&&(G!=3||this.g&&(this.h.h||this.g.oa()||ds(this.g)))){this.J||G!=4||o==7||(o==8||0>=at?St(3):St(2)),ui(this);var c=this.g.Z();this.X=c;t:if(Kr(this)){var u=ds(this.g);i="";var w=u.length,_=Ae(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){qe(this),Pt(this);var b="";break t}this.h.i=new h.TextDecoder}for(o=0;o<w;o++)this.h.h=!0,i+=this.h.i.decode(u[o],{stream:!(_&&o==w-1)});u.length=0,this.h.g+=i,this.C=0,b=this.h.g}else b=this.g.oa();if(this.o=c==200,Hc(this.i,this.u,this.A,this.l,this.R,G,c),this.o){if(this.T&&!this.K){t:{if(this.g){var L,B=this.g;if((L=B.g?B.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!se(L)){var R=L;break t}}R=null}if(c=R)rt(this.i,this.l,c,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,hi(this,c);else{this.o=!1,this.s=3,q(12),qe(this),Pt(this);break e}}if(this.P){c=!0;let pe;for(;!this.J&&this.C<b.length;)if(pe=qc(this,b),pe==ci){G==4&&(this.s=4,q(14),c=!1),rt(this.i,this.l,null,"[Incomplete Response]");break}else if(pe==Gr){this.s=4,q(15),rt(this.i,this.l,b,"[Invalid Chunk]"),c=!1;break}else rt(this.i,this.l,pe,null),hi(this,pe);if(Kr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),G!=4||b.length!=0||this.h.h||(this.s=1,q(16),c=!1),this.o=this.o&&c,!c)rt(this.i,this.l,b,"[Invalid Chunked Response]"),qe(this),Pt(this);else if(0<b.length&&!this.W){this.W=!0;var H=this.j;H.g==this&&H.ba&&!H.M&&(H.j.info("Great, no buffering proxy detected. Bytes received: "+b.length),yi(H),H.M=!0,q(11))}}else rt(this.i,this.l,b,null),hi(this,b);G==4&&qe(this),this.o&&!this.J&&(G==4?ws(this.j,this):(this.o=!1,cn(this)))}else ul(this.g),c==400&&0<b.indexOf("Unknown SID")?(this.s=3,q(12)):(this.s=0,q(13)),qe(this),Pt(this)}}}catch{}finally{}};function Kr(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function qc(i,o){var c=i.C,u=o.indexOf(`
`,c);return u==-1?ci:(c=Number(o.substring(c,u)),isNaN(c)?Gr:(u+=1,u+c>o.length?ci:(o=o.slice(u,u+c),i.C=u+c,o)))}Fe.prototype.cancel=function(){this.J=!0,qe(this)};function cn(i){i.S=Date.now()+i.I,qr(i,i.I)}function qr(i,o){if(i.B!=null)throw Error("WatchDog timer not null");i.B=At(k(i.ba,i),o)}function ui(i){i.B&&(h.clearTimeout(i.B),i.B=null)}Fe.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(Gc(this.i,this.A),this.L!=2&&(St(),q(17)),qe(this),this.s=2,Pt(this)):qr(this,this.S-i)};function Pt(i){i.j.G==0||i.J||ws(i.j,i)}function qe(i){ui(i);var o=i.M;o&&typeof o.ma=="function"&&o.ma(),i.M=null,Fr(i.U),i.g&&(o=i.g,i.g=null,o.abort(),o.ma())}function hi(i,o){try{var c=i.j;if(c.G!=0&&(c.g==i||di(c.h,i))){if(!i.K&&di(c.h,i)&&c.G==3){try{var u=c.Da.g.parse(o)}catch{u=null}if(Array.isArray(u)&&u.length==3){var w=u;if(w[0]==0){e:if(!c.u){if(c.g)if(c.g.F+3e3<i.F)yn(c),gn(c);else break e;mi(c),q(18)}}else c.za=w[1],0<c.za-c.T&&37500>w[2]&&c.F&&c.v==0&&!c.C&&(c.C=At(k(c.Za,c),6e3));if(1>=Xr(c.h)&&c.ca){try{c.ca()}catch{}c.ca=void 0}}else Je(c,11)}else if((i.K||c.g==i)&&yn(c),!se(o))for(w=c.Da.g.parse(o),o=0;o<w.length;o++){let R=w[o];if(c.T=R[0],R=R[1],c.G==2)if(R[0]=="c"){c.K=R[1],c.ia=R[2];const H=R[3];H!=null&&(c.la=H,c.j.info("VER="+c.la));const G=R[4];G!=null&&(c.Aa=G,c.j.info("SVER="+c.Aa));const at=R[5];at!=null&&typeof at=="number"&&0<at&&(u=1.5*at,c.L=u,c.j.info("backChannelRequestTimeoutMs_="+u)),u=c;const pe=i.g;if(pe){const vn=pe.g?pe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(vn){var _=u.h;_.g||vn.indexOf("spdy")==-1&&vn.indexOf("quic")==-1&&vn.indexOf("h2")==-1||(_.j=_.l,_.g=new Set,_.h&&(fi(_,_.h),_.h=null))}if(u.D){const vi=pe.g?pe.g.getResponseHeader("X-HTTP-Session-Id"):null;vi&&(u.ya=vi,D(u.I,u.D,vi))}}c.G=3,c.l&&c.l.ua(),c.ba&&(c.R=Date.now()-i.F,c.j.info("Handshake RTT: "+c.R+"ms")),u=c;var b=i;if(u.qa=Es(u,u.J?u.ia:null,u.W),b.K){Yr(u.h,b);var L=b,B=u.L;B&&(L.I=B),L.B&&(ui(L),cn(L)),u.g=b}else ys(u);0<c.i.length&&mn(c)}else R[0]!="stop"&&R[0]!="close"||Je(c,7);else c.G==3&&(R[0]=="stop"||R[0]=="close"?R[0]=="stop"?Je(c,7):gi(c):R[0]!="noop"&&c.l&&c.l.ta(R),c.v=0)}}St(4)}catch{}}var zc=class{constructor(i,o){this.g=i,this.map=o}};function zr(i){this.l=i||10,h.PerformanceNavigationTiming?(i=h.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Jr(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Xr(i){return i.h?1:i.g?i.g.size:0}function di(i,o){return i.h?i.h==o:i.g?i.g.has(o):!1}function fi(i,o){i.g?i.g.add(o):i.h=o}function Yr(i,o){i.h&&i.h==o?i.h=null:i.g&&i.g.has(o)&&i.g.delete(o)}zr.prototype.cancel=function(){if(this.i=Qr(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Qr(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let o=i.i;for(const c of i.g.values())o=o.concat(c.D);return o}return x(i.i)}function Jc(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(g(i)){for(var o=[],c=i.length,u=0;u<c;u++)o.push(i[u]);return o}o=[],c=0;for(u in i)o[c++]=i[u];return o}function Xc(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(g(i)||typeof i=="string"){var o=[];i=i.length;for(var c=0;c<i;c++)o.push(c);return o}o=[],c=0;for(const u in i)o[c++]=u;return o}}}function Zr(i,o){if(i.forEach&&typeof i.forEach=="function")i.forEach(o,void 0);else if(g(i)||typeof i=="string")Array.prototype.forEach.call(i,o,void 0);else for(var c=Xc(i),u=Jc(i),w=u.length,_=0;_<w;_++)o.call(void 0,u[_],c&&c[_],i)}var es=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Yc(i,o){if(i){i=i.split("&");for(var c=0;c<i.length;c++){var u=i[c].indexOf("="),w=null;if(0<=u){var _=i[c].substring(0,u);w=i[c].substring(u+1)}else _=i[c];o(_,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function ze(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof ze){this.h=i.h,ln(this,i.j),this.o=i.o,this.g=i.g,un(this,i.s),this.l=i.l;var o=i.i,c=new Ot;c.i=o.i,o.g&&(c.g=new Map(o.g),c.h=o.h),ts(this,c),this.m=i.m}else i&&(o=String(i).match(es))?(this.h=!1,ln(this,o[1]||"",!0),this.o=Ct(o[2]||""),this.g=Ct(o[3]||"",!0),un(this,o[4]),this.l=Ct(o[5]||"",!0),ts(this,o[6]||"",!0),this.m=Ct(o[7]||"")):(this.h=!1,this.i=new Ot(null,this.h))}ze.prototype.toString=function(){var i=[],o=this.j;o&&i.push(Rt(o,ns,!0),":");var c=this.g;return(c||o=="file")&&(i.push("//"),(o=this.o)&&i.push(Rt(o,ns,!0),"@"),i.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.s,c!=null&&i.push(":",String(c))),(c=this.l)&&(this.g&&c.charAt(0)!="/"&&i.push("/"),i.push(Rt(c,c.charAt(0)=="/"?el:Zc,!0))),(c=this.i.toString())&&i.push("?",c),(c=this.m)&&i.push("#",Rt(c,nl)),i.join("")};function Se(i){return new ze(i)}function ln(i,o,c){i.j=c?Ct(o,!0):o,i.j&&(i.j=i.j.replace(/:$/,""))}function un(i,o){if(o){if(o=Number(o),isNaN(o)||0>o)throw Error("Bad port number "+o);i.s=o}else i.s=null}function ts(i,o,c){o instanceof Ot?(i.i=o,il(i.i,i.h)):(c||(o=Rt(o,tl)),i.i=new Ot(o,i.h))}function D(i,o,c){i.i.set(o,c)}function hn(i){return D(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function Ct(i,o){return i?o?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function Rt(i,o,c){return typeof i=="string"?(i=encodeURI(i).replace(o,Qc),c&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function Qc(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var ns=/[#\/\?@]/g,Zc=/[#\?:]/g,el=/[#\?]/g,tl=/[#\?@]/g,nl=/#/g;function Ot(i,o){this.h=this.g=null,this.i=i||null,this.j=!!o}function xe(i){i.g||(i.g=new Map,i.h=0,i.i&&Yc(i.i,function(o,c){i.add(decodeURIComponent(o.replace(/\+/g," ")),c)}))}t=Ot.prototype,t.add=function(i,o){xe(this),this.i=null,i=st(this,i);var c=this.g.get(i);return c||this.g.set(i,c=[]),c.push(o),this.h+=1,this};function is(i,o){xe(i),o=st(i,o),i.g.has(o)&&(i.i=null,i.h-=i.g.get(o).length,i.g.delete(o))}function rs(i,o){return xe(i),o=st(i,o),i.g.has(o)}t.forEach=function(i,o){xe(this),this.g.forEach(function(c,u){c.forEach(function(w){i.call(o,w,u,this)},this)},this)},t.na=function(){xe(this);const i=Array.from(this.g.values()),o=Array.from(this.g.keys()),c=[];for(let u=0;u<o.length;u++){const w=i[u];for(let _=0;_<w.length;_++)c.push(o[u])}return c},t.V=function(i){xe(this);let o=[];if(typeof i=="string")rs(this,i)&&(o=o.concat(this.g.get(st(this,i))));else{i=Array.from(this.g.values());for(let c=0;c<i.length;c++)o=o.concat(i[c])}return o},t.set=function(i,o){return xe(this),this.i=null,i=st(this,i),rs(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[o]),this.h+=1,this},t.get=function(i,o){return i?(i=this.V(i),0<i.length?String(i[0]):o):o};function ss(i,o,c){is(i,o),0<c.length&&(i.i=null,i.g.set(st(i,o),x(c)),i.h+=c.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],o=Array.from(this.g.keys());for(var c=0;c<o.length;c++){var u=o[c];const _=encodeURIComponent(String(u)),b=this.V(u);for(u=0;u<b.length;u++){var w=_;b[u]!==""&&(w+="="+encodeURIComponent(String(b[u]))),i.push(w)}}return this.i=i.join("&")};function st(i,o){return o=String(o),i.j&&(o=o.toLowerCase()),o}function il(i,o){o&&!i.j&&(xe(i),i.i=null,i.g.forEach(function(c,u){var w=u.toLowerCase();u!=w&&(is(this,u),ss(this,w,c))},i)),i.j=o}function rl(i,o){const c=new kt;if(h.Image){const u=new Image;u.onload=N(Be,c,"TestLoadImage: loaded",!0,o,u),u.onerror=N(Be,c,"TestLoadImage: error",!1,o,u),u.onabort=N(Be,c,"TestLoadImage: abort",!1,o,u),u.ontimeout=N(Be,c,"TestLoadImage: timeout",!1,o,u),h.setTimeout(function(){u.ontimeout&&u.ontimeout()},1e4),u.src=i}else o(!1)}function sl(i,o){const c=new kt,u=new AbortController,w=setTimeout(()=>{u.abort(),Be(c,"TestPingServer: timeout",!1,o)},1e4);fetch(i,{signal:u.signal}).then(_=>{clearTimeout(w),_.ok?Be(c,"TestPingServer: ok",!0,o):Be(c,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(w),Be(c,"TestPingServer: error",!1,o)})}function Be(i,o,c,u,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),u(c)}catch{}}function ol(){this.g=new jc}function al(i,o,c){const u=c||"";try{Zr(i,function(w,_){let b=w;E(w)&&(b=ti(w)),o.push(u+_+"="+encodeURIComponent(b))})}catch(w){throw o.push(u+"type="+encodeURIComponent("_badmap")),w}}function dn(i){this.l=i.Ub||null,this.j=i.eb||!1}C(dn,ni),dn.prototype.g=function(){return new fn(this.l,this.j)},dn.prototype.i=function(i){return function(){return i}}({});function fn(i,o){V.call(this),this.D=i,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(fn,V),t=fn.prototype,t.open=function(i,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=o,this.readyState=1,Nt(this)},t.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const o={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(o.body=i),(this.D||h).fetch(new Request(this.A,o)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Lt(this)),this.readyState=0},t.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Nt(this)),this.g&&(this.readyState=3,Nt(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;os(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function os(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}t.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var o=i.value?i.value:new Uint8Array(0);(o=this.v.decode(o,{stream:!i.done}))&&(this.response=this.responseText+=o)}i.done?Lt(this):Nt(this),this.readyState==3&&os(this)}},t.Ra=function(i){this.g&&(this.response=this.responseText=i,Lt(this))},t.Qa=function(i){this.g&&(this.response=i,Lt(this))},t.ga=function(){this.g&&Lt(this)};function Lt(i){i.readyState=4,i.l=null,i.j=null,i.v=null,Nt(i)}t.setRequestHeader=function(i,o){this.u.append(i,o)},t.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],o=this.h.entries();for(var c=o.next();!c.done;)c=c.value,i.push(c[0]+": "+c[1]),c=o.next();return i.join(`\r
`)};function Nt(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(fn.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function as(i){let o="";return Y(i,function(c,u){o+=u,o+=":",o+=c,o+=`\r
`}),o}function pi(i,o,c){e:{for(u in c){var u=!1;break e}u=!0}u||(c=as(c),typeof i=="string"?c!=null&&encodeURIComponent(String(c)):D(i,o,c))}function U(i){V.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(U,V);var cl=/^https?$/i,ll=["POST","PUT"];t=U.prototype,t.Ha=function(i){this.J=i},t.ea=function(i,o,c,u){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);o=o?o.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ai.g(),this.v=this.o?xr(this.o):xr(ai),this.g.onreadystatechange=k(this.Ea,this);try{this.B=!0,this.g.open(o,String(i),!0),this.B=!1}catch(_){cs(this,_);return}if(i=c||"",c=new Map(this.headers),u)if(Object.getPrototypeOf(u)===Object.prototype)for(var w in u)c.set(w,u[w]);else if(typeof u.keys=="function"&&typeof u.get=="function")for(const _ of u.keys())c.set(_,u.get(_));else throw Error("Unknown input type for opt_headers: "+String(u));u=Array.from(c.keys()).find(_=>_.toLowerCase()=="content-type"),w=h.FormData&&i instanceof h.FormData,!(0<=Array.prototype.indexOf.call(ll,o,void 0))||u||w||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[_,b]of c)this.g.setRequestHeader(_,b);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{hs(this),this.u=!0,this.g.send(i),this.u=!1}catch(_){cs(this,_)}};function cs(i,o){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=o,i.m=5,ls(i),pn(i)}function ls(i){i.A||(i.A=!0,K(i,"complete"),K(i,"error"))}t.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,K(this,"complete"),K(this,"abort"),pn(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),pn(this,!0)),U.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?us(this):this.bb())},t.bb=function(){us(this)};function us(i){if(i.h&&typeof l<"u"&&(!i.v[1]||Ae(i)!=4||i.Z()!=2)){if(i.u&&Ae(i)==4)Dr(i.Ea,0,i);else if(K(i,"readystatechange"),Ae(i)==4){i.h=!1;try{const b=i.Z();e:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var c;if(!(c=o)){var u;if(u=b===0){var w=String(i.D).match(es)[1]||null;!w&&h.self&&h.self.location&&(w=h.self.location.protocol.slice(0,-1)),u=!cl.test(w?w.toLowerCase():"")}c=u}if(c)K(i,"complete"),K(i,"success");else{i.m=6;try{var _=2<Ae(i)?i.g.statusText:""}catch{_=""}i.l=_+" ["+i.Z()+"]",ls(i)}}finally{pn(i)}}}}function pn(i,o){if(i.g){hs(i);const c=i.g,u=i.v[0]?()=>{}:null;i.g=null,i.v=null,o||K(i,"ready");try{c.onreadystatechange=u}catch{}}}function hs(i){i.I&&(h.clearTimeout(i.I),i.I=null)}t.isActive=function(){return!!this.g};function Ae(i){return i.g?i.g.readyState:0}t.Z=function(){try{return 2<Ae(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(i){if(this.g){var o=this.g.responseText;return i&&o.indexOf(i)==0&&(o=o.substring(i.length)),Bc(o)}};function ds(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function ul(i){const o={};i=(i.g&&2<=Ae(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let u=0;u<i.length;u++){if(se(i[u]))continue;var c=y(i[u]);const w=c[0];if(c=c[1],typeof c!="string")continue;c=c.trim();const _=o[w]||[];o[w]=_,_.push(c)}v(o,function(u){return u.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Dt(i,o,c){return c&&c.internalChannelParams&&c.internalChannelParams[i]||o}function fs(i){this.Aa=0,this.i=[],this.j=new kt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Dt("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Dt("baseRetryDelayMs",5e3,i),this.cb=Dt("retryDelaySeedMs",1e4,i),this.Wa=Dt("forwardChannelMaxRetries",2,i),this.wa=Dt("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new zr(i&&i.concurrentRequestLimit),this.Da=new ol,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=fs.prototype,t.la=8,t.G=1,t.connect=function(i,o,c,u){q(0),this.W=i,this.H=o||{},c&&u!==void 0&&(this.H.OSID=c,this.H.OAID=u),this.F=this.X,this.I=Es(this,null,this.W),mn(this)};function gi(i){if(ps(i),i.G==3){var o=i.U++,c=Se(i.I);if(D(c,"SID",i.K),D(c,"RID",o),D(c,"TYPE","terminate"),Mt(i,c),o=new Fe(i,i.j,o),o.L=2,o.v=hn(Se(c)),c=!1,h.navigator&&h.navigator.sendBeacon)try{c=h.navigator.sendBeacon(o.v.toString(),"")}catch{}!c&&h.Image&&(new Image().src=o.v,c=!0),c||(o.g=Ts(o.j,null),o.g.ea(o.v)),o.F=Date.now(),cn(o)}_s(i)}function gn(i){i.g&&(yi(i),i.g.cancel(),i.g=null)}function ps(i){gn(i),i.u&&(h.clearTimeout(i.u),i.u=null),yn(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&h.clearTimeout(i.s),i.s=null)}function mn(i){if(!Jr(i.h)&&!i.s){i.s=!0;var o=i.Ga;It||Cr(),_t||(It(),_t=!0),qn.add(o,i),i.B=0}}function hl(i,o){return Xr(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=o.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=At(k(i.Ga,i,o),Is(i,i.B)),i.B++,!0)}t.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const w=new Fe(this,this.j,i);let _=this.o;if(this.S&&(_?(_=d(_),m(_,this.S)):_=this.S),this.m!==null||this.O||(w.H=_,_=null),this.P)e:{for(var o=0,c=0;c<this.i.length;c++){t:{var u=this.i[c];if("__data__"in u.map&&(u=u.map.__data__,typeof u=="string")){u=u.length;break t}u=void 0}if(u===void 0)break;if(o+=u,4096<o){o=c;break e}if(o===4096||c===this.i.length-1){o=c+1;break e}}o=1e3}else o=1e3;o=ms(this,w,o),c=Se(this.I),D(c,"RID",i),D(c,"CVER",22),this.D&&D(c,"X-HTTP-Session-Id",this.D),Mt(this,c),_&&(this.O?o="headers="+encodeURIComponent(String(as(_)))+"&"+o:this.m&&pi(c,this.m,_)),fi(this.h,w),this.Ua&&D(c,"TYPE","init"),this.P?(D(c,"$req",o),D(c,"SID","null"),w.T=!0,li(w,c,null)):li(w,c,o),this.G=2}}else this.G==3&&(i?gs(this,i):this.i.length==0||Jr(this.h)||gs(this))};function gs(i,o){var c;o?c=o.l:c=i.U++;const u=Se(i.I);D(u,"SID",i.K),D(u,"RID",c),D(u,"AID",i.T),Mt(i,u),i.m&&i.o&&pi(u,i.m,i.o),c=new Fe(i,i.j,c,i.B+1),i.m===null&&(c.H=i.o),o&&(i.i=o.D.concat(i.i)),o=ms(i,c,1e3),c.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),fi(i.h,c),li(c,u,o)}function Mt(i,o){i.H&&Y(i.H,function(c,u){D(o,u,c)}),i.l&&Zr({},function(c,u){D(o,u,c)})}function ms(i,o,c){c=Math.min(i.i.length,c);var u=i.l?k(i.l.Na,i.l,i):null;e:{var w=i.i;let _=-1;for(;;){const b=["count="+c];_==-1?0<c?(_=w[0].g,b.push("ofs="+_)):_=0:b.push("ofs="+_);let L=!0;for(let B=0;B<c;B++){let R=w[B].g;const H=w[B].map;if(R-=_,0>R)_=Math.max(0,w[B].g-100),L=!1;else try{al(H,b,"req"+R+"_")}catch{u&&u(H)}}if(L){u=b.join("&");break e}}}return i=i.i.splice(0,c),o.D=i,u}function ys(i){if(!i.g&&!i.u){i.Y=1;var o=i.Fa;It||Cr(),_t||(It(),_t=!0),qn.add(o,i),i.v=0}}function mi(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=At(k(i.Fa,i),Is(i,i.v)),i.v++,!0)}t.Fa=function(){if(this.u=null,vs(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=At(k(this.ab,this),i)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,q(10),gn(this),vs(this))};function yi(i){i.A!=null&&(h.clearTimeout(i.A),i.A=null)}function vs(i){i.g=new Fe(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var o=Se(i.qa);D(o,"RID","rpc"),D(o,"SID",i.K),D(o,"AID",i.T),D(o,"CI",i.F?"0":"1"),!i.F&&i.ja&&D(o,"TO",i.ja),D(o,"TYPE","xmlhttp"),Mt(i,o),i.m&&i.o&&pi(o,i.m,i.o),i.L&&(i.g.I=i.L);var c=i.g;i=i.ia,c.L=1,c.v=hn(Se(o)),c.m=null,c.P=!0,Wr(c,i)}t.Za=function(){this.C!=null&&(this.C=null,gn(this),mi(this),q(19))};function yn(i){i.C!=null&&(h.clearTimeout(i.C),i.C=null)}function ws(i,o){var c=null;if(i.g==o){yn(i),yi(i),i.g=null;var u=2}else if(di(i.h,o))c=o.D,Yr(i.h,o),u=1;else return;if(i.G!=0){if(o.o)if(u==1){c=o.m?o.m.length:0,o=Date.now()-o.F;var w=i.B;u=si(),K(u,new Vr(u,c)),mn(i)}else ys(i);else if(w=o.s,w==3||w==0&&0<o.X||!(u==1&&hl(i,o)||u==2&&mi(i)))switch(c&&0<c.length&&(o=i.h,o.i=o.i.concat(c)),w){case 1:Je(i,5);break;case 4:Je(i,10);break;case 3:Je(i,6);break;default:Je(i,2)}}}function Is(i,o){let c=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(c*=2),c*o}function Je(i,o){if(i.j.info("Error code "+o),o==2){var c=k(i.fb,i),u=i.Xa;const w=!u;u=new ze(u||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||ln(u,"https"),hn(u),w?rl(u.toString(),c):sl(u.toString(),c)}else q(2);i.G=0,i.l&&i.l.sa(o),_s(i),ps(i)}t.fb=function(i){i?(this.j.info("Successfully pinged google.com"),q(2)):(this.j.info("Failed to ping google.com"),q(1))};function _s(i){if(i.G=0,i.ka=[],i.l){const o=Qr(i.h);(o.length!=0||i.i.length!=0)&&(M(i.ka,o),M(i.ka,i.i),i.h.i.length=0,x(i.i),i.i.length=0),i.l.ra()}}function Es(i,o,c){var u=c instanceof ze?Se(c):new ze(c);if(u.g!="")o&&(u.g=o+"."+u.g),un(u,u.s);else{var w=h.location;u=w.protocol,o=o?o+"."+w.hostname:w.hostname,w=+w.port;var _=new ze(null);u&&ln(_,u),o&&(_.g=o),w&&un(_,w),c&&(_.l=c),u=_}return c=i.D,o=i.ya,c&&o&&D(u,c,o),D(u,"VER",i.la),Mt(i,u),u}function Ts(i,o,c){if(o&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return o=i.Ca&&!i.pa?new U(new dn({eb:c})):new U(i.pa),o.Ha(i.J),o}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function bs(){}t=bs.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function le(i,o){V.call(this),this.g=new fs(o),this.l=i,this.h=o&&o.messageUrlParams||null,i=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(i?i["X-WebChannel-Content-Type"]=o.messageContentType:i={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.va&&(i?i["X-WebChannel-Client-Profile"]=o.va:i={"X-WebChannel-Client-Profile":o.va}),this.g.S=i,(i=o&&o.Sb)&&!se(i)&&(this.g.m=i),this.v=o&&o.supportsCrossDomainXhr||!1,this.u=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!se(o)&&(this.g.D=o,i=this.h,i!==null&&o in i&&(i=this.h,o in i&&delete i[o])),this.j=new ot(this)}C(le,V),le.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},le.prototype.close=function(){gi(this.g)},le.prototype.o=function(i){var o=this.g;if(typeof i=="string"){var c={};c.__data__=i,i=c}else this.u&&(c={},c.__data__=ti(i),i=c);o.i.push(new zc(o.Ya++,i)),o.G==3&&mn(o)},le.prototype.N=function(){this.g.l=null,delete this.j,gi(this.g),delete this.g,le.aa.N.call(this)};function Ss(i){ii.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var o=i.__sm__;if(o){e:{for(const c in o){i=c;break e}i=void 0}(this.i=i)&&(i=this.i,o=o!==null&&i in o?o[i]:void 0),this.data=o}else this.data=i}C(Ss,ii);function As(){ri.call(this),this.status=1}C(As,ri);function ot(i){this.g=i}C(ot,bs),ot.prototype.ua=function(){K(this.g,"a")},ot.prototype.ta=function(i){K(this.g,new Ss(i))},ot.prototype.sa=function(i){K(this.g,new As)},ot.prototype.ra=function(){K(this.g,"b")},le.prototype.send=le.prototype.o,le.prototype.open=le.prototype.m,le.prototype.close=le.prototype.close,oi.NO_ERROR=0,oi.TIMEOUT=8,oi.HTTP_ERROR=6,Kc.COMPLETE="complete",$c.EventType=bt,bt.OPEN="a",bt.CLOSE="b",bt.ERROR="c",bt.MESSAGE="d",V.prototype.listen=V.prototype.K,U.prototype.listenOnce=U.prototype.L,U.prototype.getLastError=U.prototype.Ka,U.prototype.getLastErrorCode=U.prototype.Ba,U.prototype.getStatus=U.prototype.Z,U.prototype.getResponseJson=U.prototype.Oa,U.prototype.getResponseText=U.prototype.oa,U.prototype.send=U.prototype.ea,U.prototype.setWithCredentials=U.prototype.Ha}).apply(typeof In<"u"?In:typeof self<"u"?self:typeof window<"u"?window:{});const mo="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}z.UNAUTHENTICATED=new z(null),z.GOOGLE_CREDENTIALS=new z("google-credentials-uid"),z.FIRST_PARTY=new z("first-party-uid"),z.MOCK_USER=new z("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ft=new Fn("@firebase/firestore");function me(t,...e){if(ft.logLevel<=O.DEBUG){const n=e.map(br);ft.debug(`Firestore (${tn}): ${t}`,...n)}}function mc(t,...e){if(ft.logLevel<=O.ERROR){const n=e.map(br);ft.error(`Firestore (${tn}): ${t}`,...n)}}function tg(t,...e){if(ft.logLevel<=O.WARN){const n=e.map(br);ft.warn(`Firestore (${tn}): ${t}`,...n)}}function br(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sr(t="Unexpected state"){const e=`FIRESTORE (${tn}) INTERNAL ASSERTION FAILED: `+t;throw mc(e),new Error(e)}function Vt(t,e){t||Sr()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class Z extends ve{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ng{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(z.UNAUTHENTICATED))}shutdown(){}}class ig{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class rg{constructor(e){this.t=e,this.currentUser=z.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Vt(this.o===void 0);let r=this.i;const s=g=>this.i!==r?(r=this.i,n(g)):Promise.resolve();let a=new Ht;this.o=()=>{this.i++,this.currentUser=this.u(),a.resolve(),a=new Ht,e.enqueueRetryable(()=>s(this.currentUser))};const l=()=>{const g=a;e.enqueueRetryable(async()=>{await g.promise,await s(this.currentUser)})},h=g=>{me("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(g=>h(g)),setTimeout(()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?h(g):(me("FirebaseAuthCredentialsProvider","Auth not yet detected"),a.resolve(),a=new Ht)}},0),l()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(me("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Vt(typeof r.accessToken=="string"),new yc(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Vt(e===null||typeof e=="string"),new z(e)}}class sg{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=z.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class og{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new sg(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(z.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ag{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class cg{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Vt(this.o===void 0);const r=a=>{a.error!=null&&me("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${a.error.message}`);const l=a.token!==this.R;return this.R=a.token,me("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?n(a.token):Promise.resolve()};this.o=a=>{e.enqueueRetryable(()=>r(a))};const s=a=>{me("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=a,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(a=>s(a)),setTimeout(()=>{if(!this.appCheck){const a=this.A.getImmediate({optional:!0});a?s(a):me("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Vt(typeof n.token=="string"),this.R=n.token,new ag(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}function lg(t){return t.name==="IndexedDbTransactionError"}class Dn{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Dn("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Dn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yo,P;(P=yo||(yo={}))[P.OK=0]="OK",P[P.CANCELLED=1]="CANCELLED",P[P.UNKNOWN=2]="UNKNOWN",P[P.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",P[P.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",P[P.NOT_FOUND=5]="NOT_FOUND",P[P.ALREADY_EXISTS=6]="ALREADY_EXISTS",P[P.PERMISSION_DENIED=7]="PERMISSION_DENIED",P[P.UNAUTHENTICATED=16]="UNAUTHENTICATED",P[P.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",P[P.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",P[P.ABORTED=10]="ABORTED",P[P.OUT_OF_RANGE=11]="OUT_OF_RANGE",P[P.UNIMPLEMENTED=12]="UNIMPLEMENTED",P[P.INTERNAL=13]="INTERNAL",P[P.UNAVAILABLE=14]="UNAVAILABLE",P[P.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new gc([4294967295,4294967295],0);function Ni(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(e,n,r=1e3,s=1.5,a=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=s,this.Qo=a,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,n-r);s>0&&me("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{constructor(e,n,r,s,a){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=s,this.removalCallback=a,this.deferred=new Ht,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,s,a){const l=Date.now()+r,h=new Ar(e,n,l,s,a);return h.start(r),h}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new Z(Q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var vo,wo;(wo=vo||(vo={})).ea="default",wo.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hg(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Io=new Map;function dg(t,e,n,r){if(e===!0&&r===!0)throw new Z(Q.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function fg(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Sr()}function pg(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new Z(Q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=fg(t);throw new Z(Q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _o{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new Z(Q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new Z(Q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}dg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=hg((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(a){if(a.timeoutSeconds!==void 0){if(isNaN(a.timeoutSeconds))throw new Z(Q.INVALID_ARGUMENT,`invalid long polling timeout: ${a.timeoutSeconds} (must not be NaN)`);if(a.timeoutSeconds<5)throw new Z(Q.INVALID_ARGUMENT,`invalid long polling timeout: ${a.timeoutSeconds} (minimum allowed value is 5)`);if(a.timeoutSeconds>30)throw new Z(Q.INVALID_ARGUMENT,`invalid long polling timeout: ${a.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class vc{constructor(e,n,r,s){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _o({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Z(Q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new Z(Q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _o(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new ng;switch(r.type){case"firstParty":return new og(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new Z(Q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=Io.get(n);r&&(me("ComponentProvider","Removing Datastore"),Io.delete(n),r.terminate())}(this),Promise.resolve()}}function gg(t,e,n,r={}){var s;const a=(t=pg(t,vc))._getSettings(),l=`${e}:${n}`;if(a.host!=="firestore.googleapis.com"&&a.host!==l&&tg("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},a),{host:l,ssl:!1})),r.mockUserToken){let h,g;if(typeof r.mockUserToken=="string")h=r.mockUserToken,g=z.MOCK_USER;else{h=Il(r.mockUserToken,(s=t._app)===null||s===void 0?void 0:s.options.projectId);const E=r.mockUserToken.sub||r.mockUserToken.user_id;if(!E)throw new Z(Q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");g=new z(E)}t._authCredentials=new ig(new yc(h,g))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new ug(this,"async_queue_retry"),this.Vu=()=>{const r=Ni();r&&me("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=Ni();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Ni();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Ht;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!lg(e))throw e;me("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(l){let h=l.message||"";return l.stack&&(h=l.stack.includes(l.message)?l.stack:l.message+`
`+l.stack),h}(r);throw mc("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const s=Ar.createAndSchedule(this,e,n,r,a=>this.yu(a));return this.Tu.push(s),s}fu(){this.Eu&&Sr()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class mg extends vc{constructor(e,n,r,s){super(e,n,r,s),this.type="firestore",this._queue=new Eo,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Eo(e),this._firestoreClient=void 0,await e}}}function wc(t,e){const n=typeof t=="object"?t:Bn(),r=typeof t=="string"?t:"(default)",s=nt(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const a=Yo("firestore");a&&gg(s,...a)}return s}(function(e,n=!0){(function(s){tn=s})(gt),ae(new ne("firestore",(r,{instanceIdentifier:s,options:a})=>{const l=r.getProvider("app").getImmediate(),h=new mg(new rg(r.getProvider("auth-internal")),new cg(r.getProvider("app-check-internal")),function(E,T){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new Z(Q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Dn(E.options.projectId,T)}(l,s),l);return a=Object.assign({useFetchStreams:n},a),h._setSettings(a),h},"PUBLIC").setMultipleInstances(!0)),W(mo,"4.7.3",e),W(mo,"4.7.3","esm2017")})();const Xi={apiKey:void 0,authDomain:void 0,projectId:void 0,storageBucket:void 0,messagingSenderId:void 0,appId:void 0,measurementId:void 0},yg={adminEmail:void 0,environment:void 0,functionsRegion:"us-central1",functionsEmulatorHost:void 0,functionsEmulatorPort:void 0};console.log("[firebase-config] Using Firebase configuration from:","fallback/hardcoded values");console.log("[firebase-config] App configuration loaded from .env:",yg);(!Xi.apiKey||!Xi.projectId)&&console.error("[firebase-config] Invalid Firebase configuration - missing required fields");const Wn=rr(Xi),re=Ha(Wn);wc(Wn);Kp(Wn);const vg=eg(Wn,"us-central1");try{if(typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")){const t="localhost",e=parseInt("5001");pc(vg,t,e),console.log(`[firebase-config] Connected Functions emulator at http://${t}:${e}`)}}catch(t){console.warn("[firebase-config] Could not connect functions emulator:",t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To="analytics",wg="firebase_id",Ig="origin",_g=60*1e3,Eg="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",kr="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const te=new Fn("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tg={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},ue=new Ge("analytics","Analytics",Tg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bg(t){if(!t.startsWith(kr)){const e=ue.create("invalid-gtag-resource",{gtagURL:t});return te.warn(e.message),""}return t}function Ic(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function Sg(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function Ag(t,e){const n=Sg("firebase-js-sdk-policy",{createScriptURL:bg}),r=document.createElement("script"),s=`${kr}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function kg(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function Pg(t,e,n,r,s,a){const l=r[s];try{if(l)await e[l];else{const g=(await Ic(n)).find(E=>E.measurementId===s);g&&await e[g.appId]}}catch(h){te.error(h)}t("config",s,a)}async function Cg(t,e,n,r,s){try{let a=[];if(s&&s.send_to){let l=s.send_to;Array.isArray(l)||(l=[l]);const h=await Ic(n);for(const g of l){const E=h.find(A=>A.measurementId===g),T=E&&e[E.appId];if(T)a.push(T);else{a=[];break}}}a.length===0&&(a=Object.values(e)),await Promise.all(a),t("event",r,s||{})}catch(a){te.error(a)}}function Rg(t,e,n,r){async function s(a,...l){try{if(a==="event"){const[h,g]=l;await Cg(t,e,n,h,g)}else if(a==="config"){const[h,g]=l;await Pg(t,e,n,r,h,g)}else if(a==="consent"){const[h,g]=l;t("consent",h,g)}else if(a==="get"){const[h,g,E]=l;t("get",h,g,E)}else if(a==="set"){const[h]=l;t("set",h)}else t(a,...l)}catch(h){te.error(h)}}return s}function Og(t,e,n,r,s){let a=function(...l){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(a=window[s]),window[s]=Rg(a,t,e,n),{gtagCore:a,wrappedGtag:window[s]}}function Lg(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(kr)&&n.src.includes(t))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ng=30,Dg=1e3;class Mg{constructor(e={},n=Dg){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const _c=new Mg;function Ug(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function Fg(t){var e;const{appId:n,apiKey:r}=t,s={method:"GET",headers:Ug(r)},a=Eg.replace("{app-id}",n),l=await fetch(a,s);if(l.status!==200&&l.status!==304){let h="";try{const g=await l.json();!((e=g.error)===null||e===void 0)&&e.message&&(h=g.error.message)}catch{}throw ue.create("config-fetch-failed",{httpStatus:l.status,responseMessage:h})}return l.json()}async function xg(t,e=_c,n){const{appId:r,apiKey:s,measurementId:a}=t.options;if(!r)throw ue.create("no-app-id");if(!s){if(a)return{measurementId:a,appId:r};throw ue.create("no-api-key")}const l=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},h=new $g;return setTimeout(async()=>{h.abort()},_g),Ec({appId:r,apiKey:s,measurementId:a},l,h,e)}async function Ec(t,{throttleEndTimeMillis:e,backoffCount:n},r,s=_c){var a;const{appId:l,measurementId:h}=t;try{await Bg(r,e)}catch(g){if(h)return te.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${g==null?void 0:g.message}]`),{appId:l,measurementId:h};throw g}try{const g=await Fg(t);return s.deleteThrottleMetadata(l),g}catch(g){const E=g;if(!jg(E)){if(s.deleteThrottleMetadata(l),h)return te.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${E==null?void 0:E.message}]`),{appId:l,measurementId:h};throw g}const T=Number((a=E==null?void 0:E.customData)===null||a===void 0?void 0:a.httpStatus)===503?Cs(n,s.intervalMillis,Ng):Cs(n,s.intervalMillis),A={throttleEndTimeMillis:Date.now()+T,backoffCount:n+1};return s.setThrottleMetadata(l,A),te.debug(`Calling attemptFetch again in ${T} millis`),Ec(t,A,r,s)}}function Bg(t,e){return new Promise((n,r)=>{const s=Math.max(e-Date.now(),0),a=setTimeout(n,s);t.addEventListener(()=>{clearTimeout(a),r(ue.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function jg(t){if(!(t instanceof ve)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class $g{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Vg(t,e,n,r,s){if(s&&s.global){t("event",n,r);return}else{const a=await e,l=Object.assign(Object.assign({},r),{send_to:a});t("event",n,l)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hg(){if(tr())try{await nr()}catch(t){return te.warn(ue.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return te.warn(ue.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Gg(t,e,n,r,s,a,l){var h;const g=xg(t);g.then(N=>{n[N.measurementId]=N.appId,t.options.measurementId&&N.measurementId!==t.options.measurementId&&te.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${N.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(N=>te.error(N)),e.push(g);const E=Hg().then(N=>{if(N)return r.getId()}),[T,A]=await Promise.all([g,E]);Lg(a)||Ag(a,T.measurementId),s("js",new Date);const k=(h=l==null?void 0:l.config)!==null&&h!==void 0?h:{};return k[Ig]="firebase",k.update=!0,A!=null&&(k[wg]=A),s("config",T.measurementId,k),T.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(e){this.app=e}_delete(){return delete Gt[this.app.options.appId],Promise.resolve()}}let Gt={},bo=[];const So={};let Di="dataLayer",Kg="gtag",Ao,Tc,ko=!1;function qg(){const t=[];if(ea()&&t.push("This is a browser extension environment."),ta()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,s)=>`(${s+1}) ${r}`).join(" "),n=ue.create("invalid-analytics-context",{errorInfo:e});te.warn(n.message)}}function zg(t,e,n){qg();const r=t.options.appId;if(!r)throw ue.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)te.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw ue.create("no-api-key");if(Gt[r]!=null)throw ue.create("already-exists",{id:r});if(!ko){kg(Di);const{wrappedGtag:a,gtagCore:l}=Og(Gt,bo,So,Di,Kg);Tc=a,Ao=l,ko=!0}return Gt[r]=Gg(t,bo,So,e,Ao,Di,n),new Wg(t)}function Jg(t,e,n,r){t=ce(t),Vg(Tc,Gt[t.app.options.appId],e,n,r).catch(s=>te.error(s))}const Po="@firebase/analytics",Co="0.10.8";function Xg(){ae(new ne(To,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return zg(r,s,n)},"PUBLIC")),ae(new ne("analytics-internal",t,"PRIVATE")),W(Po,Co),W(Po,Co,"esm2017");function t(e){try{const n=e.getProvider(To).getImmediate();return{logEvent:(r,s,a)=>Jg(n,r,s,a)}}catch(n){throw ue.create("interop-component-reg-failed",{reason:n})}}}Xg();const bc={apiKey:void 0,authDomain:void 0,projectId:void 0,storageBucket:void 0,messagingSenderId:void 0,appId:void 0,measurementId:void 0},Yg={adminEmail:void 0,environment:void 0,functionsRegion:"us-central1",functionsEmulatorHost:void 0,functionsEmulatorPort:void 0};console.log("Firebase config loaded from .env:",bc);console.log("App config loaded from .env:",Yg);console.log("Firebase modules imported");let Qg=null,Zg=null,em=null,Ro=null,Oo=null,Wt=null;try{console.log("Initializing Firebase app");const t=rr(bc);console.log("Firebase app initialized:",t),Qg=Ha(t),Zg=wc(t),em=new _e,Ro=new Ee,Ro.addScope("user:email"),Oo=new ge,Oo.addScope("email"),Wt=new $t("yahoo.com"),Wt.addScope("profile"),Wt.addScope("email"),console.log("Firebase initialization complete")}catch(t){console.error("Firebase initialization error:",t)}function Yi(t){try{document.body.setAttribute("data-theme",t),localStorage.setItem("theme",t);const e=document.querySelectorAll(".theme-btn");e&&e.length&&e.forEach(s=>s.classList.toggle("active",s.dataset.theme===t)),tm(t);const n=document.querySelector("header");n&&(n.style.transition="all 0.3s ease");const r=document.getElementById("dynamicText");r&&(r.style.transition="color 0.3s ease")}catch(e){console.warn("[theme] setTheme error",e)}}function tm(t){try{const e=document.querySelectorAll(".fog");if(!e)return;e.forEach(n=>{n.style.background=`linear-gradient(90deg,             rgba(0, 255, 255, 0) 0%,
            var(--fog-color) 50%,
            rgba(0, 255, 255, 0) 100%)`})}catch(e){console.warn("[theme] updateFogColor error",e)}}function nm(t){const e=document.querySelectorAll(".theme-btn");e&&e.forEach(n=>n.classList.toggle("active",n.dataset.theme===t))}function Lo(t){try{document.body.setAttribute("data-view-mode",t),localStorage.setItem("viewMode",t);const e=document.querySelectorAll(".view-mode-btn");e&&e.length&&e.forEach(r=>r.classList.toggle("active",r.dataset.view===t));const n=document.getElementById("productsGrid");n&&(n.classList.remove("grid-view","list-view"),n.classList.add(t==="list"?"list-view":"grid-view"))}catch(e){console.warn("[theme] setViewMode error",e)}}function im(){const t=document.querySelectorAll(".theme-btn");t&&t.length&&t.forEach(r=>r.addEventListener("click",()=>Yi(r.dataset.theme))),Yi(localStorage.getItem("theme")||"dark");const e=document.querySelectorAll(".view-mode-btn");e&&e.length&&e.forEach(r=>r.addEventListener("click",()=>Lo(r.dataset.view))),Lo(localStorage.getItem("viewMode")||"grid");const n=document.querySelectorAll(".language-btn");n&&n.length&&n.forEach(r=>r.addEventListener("click",()=>Qi(r.dataset.language))),Qi(localStorage.getItem("language")||"ur")}function Qi(t){try{document.documentElement.lang=t,document.body.setAttribute("data-language",t),localStorage.setItem("language",t);const e=document.querySelectorAll(".language-btn");e&&e.length&&e.forEach(n=>n.classList.toggle("active",n.dataset.language===t)),t==="ur"?(document.documentElement.dir="rtl",document.body.style.direction="rtl"):(document.documentElement.dir="ltr",document.body.style.direction="ltr"),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}}))}catch(e){console.warn("[theme] setLanguage error",e)}}function Sc(t){const e=document.querySelectorAll(".language-btn");e&&e.forEach(n=>n.classList.toggle("active",n.dataset.language===t))}const No={en:{"nav.home":"Home","nav.about":"About Us","nav.products":"Products","nav.privacy":"Privacy","nav.contact":"Contact Us","nav.controlPanel":"Control Panel","head.contact":"AG | Contact Us","head.products":"AG | Products","head.about":"AG | About Us","head.home":"AG | Home","head.welcome":"Welcome Back!","login.email":"Email","login.password":"Password","login.submit":"Log In","login.noAccount":"Don't have an account?","login.signUp":"Sign Up","login.or":"or","login.createAccount":"Create Account","body.heading.home":"Welcome to AG Electronics Pvt. Ltd.","body.description.home":"Your trusted partner in softwares mainly.","body.heading.about":"Welcome to AG Electronics Pvt. Ltd.","body.description.about":"here information was goind to add after company was registered","auth.google":"Login with Google","auth.googleSignup":"Sign up with Google","auth.github":"Sign in with GitHub","auth.githubSignup":"Sign up with GitHub","auth.facebook":"Login with Facebook","auth.facebookSignup":"Sign up with Facebook","auth.yahoo":"Login with Yahoo","auth.yahooSignup":"Sign up with Yahoo","auth.phone":"Login with Phone","auth.phoneSignup":"Sign up with Phone","auth.guest":"Continue as Guest","auth.guestSignup":"Continue as Guest","phone.enterNumber":"Enter your phone number:","phone.sendOtp":"Send OTP","phone.enterCode":"Enter the 6-digit code sent to your phone:","phone.verifyLogin":"Verify & Login","phone.useNumber":"Use different number","modal.settings":"Settings","modal.phoneLogin":"Phone Number Login","modal.selectCategory":"Select Category","settings.theme":"Theme Settings","settings.themeLight":"Light","settings.themeDark":"Dark","settings.viewMode":"View Mode","settings.viewModeGrid":"🔲 Grid","settings.viewModeList":"☰ List","settings.language":"Language","settings.languageEn":"🇺🇸 English","settings.languageUr":"🇵🇰 اردو","settings.close":"Close Settings","settings.display":"Display Settings","settings.showEmail":"Show email in header","product.noProducts":"No products in this category","product.loadingProducts":"Loading products...","product.wheelHint":"🖱️ Mouse Wheel or Left Click to rotate | 🖱️ Right Click for all categories","product.viewDetails":"View Details","product.price":"Price","product.category":"Category","product.description":"Description","product.report":"Report Product","product.reportReason":"Reason for reporting","product.reportDetails":"Details (optional)","product.submitReport":"Submit Report","details.name":"Name","details.price":"Price","details.category":"Category","details.subcategory":"Sub Category","details.brand":"Brand","details.sku":"SKU","details.stock":"Stock","details.stockUnlimited":"Unlimited","details.stockUnits":"units","details.rating":"Rating","details.description":"Description","details.tags":"Tags","details.specs":"Specifications","details.edit":"✏️ Edit Product","details.visit":"🔗 Visit Product","details.download":"📥 Download","contact.getInTouch":"Get in Touch","contact.sendMessage":"Send us a Message","contact.name":"Name","contact.email":"Email","contact.message":"Message","contact.submitBtn":"Send Message","contact.phone":"+92-330-XXXXXXX","contact.location":"Karachi, Pakistan","contact.emailAddr":"ag.aliengamerz@gmail.com","btn.logout":"Logout","btn.submit":"Submit","btn.cancel":"Cancel","btn.close":"Close","btn.yes":"Yes","btn.no":"No","msg.loading":"Loading...","msg.error":"Error","msg.success":"Success","msg.welcome":"Welcome","msg.userId":"User ID","msg.haveAccount":"Already have an account?"},ur:{"nav.home":"ہوم","nav.about":"ہمارے بارے میں","nav.products":"مصنوعات","nav.privacy":"رازداری","nav.contact":"ہم سے رابطہ کریں","nav.controlPanel":"کنٹرول پینل","head.contact":"AG | ہم سے رابطہ کریں","head.privacy":"AG | رازداری کی پالیسی","head.products":"AG | مصنوعات","head.about":"AG | ہمارے بارے میں","head.home":"AG | ہوم","head.welcome":"خوش آمدید دوبارہ!","login.email":"ای میل","login.password":"پاس ورڈ","login.submit":"لاگ ان","login.noAccount":"اکاؤنٹ نہیں ہے؟","login.signUp":"سائن اپ کریں","login.or":"یا","login.createAccount":"اکاؤنٹ بنائیں","body.heading.home":"AG الیکٹرانکس پرائیویٹ لمیٹڈ میں خوش آمدید","body.description.home":"آپ کا قابل اعتماد شراکت دار، خاص طور پر سافٹ ویئر میں۔","body.heading.about":"AG الیکٹرانکس پرائیویٹ لمیٹڈ میں خوش آمدید","body.description.about":"کمپنی کے رجسٹر ہونے کے بعد یہاں معلومات شامل کی جا رہی تھی","auth.google":"Google کے ساتھ لاگ ان","auth.googleSignup":"Google کے ساتھ سائن اپ","auth.github":"GitHub کے ساتھ سائن ان","auth.githubSignup":"GitHub کے ساتھ سائن اپ","auth.facebook":"Facebook کے ساتھ لاگ ان","auth.facebookSignup":"Facebook کے ساتھ سائن اپ","auth.yahoo":"Yahoo کے ساتھ لاگ ان","auth.yahooSignup":"Yahoo کے ساتھ سائن اپ","auth.phone":"فون کے ساتھ لاگ ان","auth.phoneSignup":"فون کے ساتھ سائن اپ","auth.guest":"مہمان کے طور پر جاری رکھیں","auth.guestSignup":"مہمان کے طور پر جاری رکھیں","phone.enterNumber":"اپنا فون نمبر درج کریں:","phone.sendOtp":"OTP بھیجیں","phone.enterCode":"اپنے فون پر بھیجے گئے 6 ہندسے کوڈ درج کریں:","phone.verifyLogin":"تصدیق اور لاگ ان کریں","phone.useNumber":"مختلف نمبر استعمال کریں","modal.settings":"ترتیبات","modal.phoneLogin":"فون نمبر لاگ ان","modal.selectCategory":"زمرہ منتخب کریں","settings.theme":"تھیم سیٹنگز","settings.themeLight":"روشن","settings.themeDark":"تاریک","settings.viewMode":"دیکھنے کا موڈ","settings.viewModeGrid":"🔲 گرڈ","settings.viewModeList":"☰ فہرست","settings.language":"زبان","settings.languageEn":"🇺🇸 English","settings.languageUr":"🇵🇰 اردو","settings.close":"سیٹنگز بند کریں","settings.display":"نمائش کی ترتیبات","settings.showEmail":"ہیڈر میں ای میل دکھائیں","product.noProducts":"اس زمرے میں کوئی مصنوعات نہیں","product.loadingProducts":"مصنوعات لوڈ ہو رہی ہیں...","product.wheelHint":"🖱️ ماؤس وہیل یا بائیں کلک سے گھومائیں | 🖱️ تمام زمرہ جات کے لیے دائیں کلک کریں","product.viewDetails":"تفصیلات دیکھیں","product.price":"قیمت","product.category":"زمرہ","product.description":"تفصیل","product.report":"مصنوع کی اطلاع دیں","product.reportReason":"اطلاع دینے کی وجہ","product.reportDetails":"تفصیلات (اختیاری)","product.submitReport":"اطلاع جمع کریں","details.name":"نام","details.price":"قیمت","details.category":"زمرہ","details.subcategory":"ذیلی زمرہ","details.brand":"برانڈ","details.sku":"SKU","details.stock":"ذخیرہ","details.stockUnlimited":"غیر محدود","details.stockUnits":"اکائی","details.rating":"درجہ بندی","details.description":"تفصیل","details.tags":"ٹیگز","details.specs":"تفصیلات","details.edit":"✏️ مصنوع میں ترمیم کریں","details.visit":"🔗 مصنوع دیکھیں","details.download":"📥 ڈاؤن لوڈ کریں","contact.getInTouch":"ہم سے رابطہ کریں","contact.sendMessage":"ہمیں ایک پیغام بھیجیں","contact.name":"نام","contact.email":"ای میل","contact.message":"پیغام","contact.submitBtn":"پیغام بھیجیں","contact.phone":"+92-330-XXXXXXX","contact.location":"کراچی، پاکستان","contact.emailAddr":"ag.aliengamerz@gmail.com","btn.logout":"لاگ آؤٹ","btn.submit":"جمع کریں","btn.cancel":"منسوخ کریں","btn.close":"بند کریں","btn.yes":"جی ہاں","btn.no":"نہیں","msg.loading":"لوڈ ہو رہا ہے...","msg.error":"خرابی","msg.success":"کامیاب","msg.welcome":"خوش آمدید","msg.userId":"صارف کی شناخت","msg.haveAccount":"پہلے سے اکاؤنٹ ہے؟"}};let Mn=localStorage.getItem("language")||"ur";function rm(t,e=Mn){No[e]||(console.warn(`[i18n] Language '${e}' not found, falling back to 'en'`),e="en");const n=No[e][t];return n||(console.warn(`[i18n] Missing translation for key: '${t}' in language '${e}'`),t)}function Do(t=Mn){Mn=t,document.querySelectorAll("[data-i18n]").forEach(e=>{const n=e.getAttribute("data-i18n"),r=rm(n,t);e.tagName==="INPUT"||e.tagName==="TEXTAREA"?e.hasAttribute("data-i18n-placeholder")?e.placeholder=r:e.value=r:(e.tagName,e.textContent=r)}),t==="ur"?(document.documentElement.dir="rtl",document.body.style.direction="rtl"):(document.documentElement.dir="ltr",document.body.style.direction="ltr")}function sm(){Do(Mn),window.addEventListener("languageChanged",t=>{Do(t.detail.language)})}console.log("App.js loaded");const om=new _e,am=new Ee;let Un=null,Ye=null;const Mi=document.getElementById("login"),cm=document.getElementById("googleLogin"),lm=document.getElementById("githubLogin"),Mo=document.getElementById("facebookLogin"),Uo=document.getElementById("yahooLogin"),Fo=document.getElementById("phoneLogin"),xo=document.getElementById("guestLogin"),um=document.getElementById("logoutBtn");document.getElementById("googleSignup");document.getElementById("githubSignup");const Bo=document.getElementById("facebookSignup"),jo=document.getElementById("yahooSignup"),$o=document.getElementById("phoneSignup"),Vo=document.getElementById("guestSignup"),hm=document.getElementById("showSignup"),dm=document.getElementById("showLogin"),Ui=document.getElementById("signup"),Ve=document.getElementById("phoneLoginModal"),Ho=document.getElementById("closePhoneModal"),ct=document.getElementById("sendPhoneOTPBtn"),lt=document.getElementById("verifyPhoneOTPBtn"),Go=document.getElementById("backToPhoneBtn"),Ac=document.getElementById("phoneLoginStep1"),kc=document.getElementById("phoneLoginStep2"),Pc=document.getElementById("phoneNumber"),Zi=document.getElementById("otpCode"),Wo=document.getElementById("settingsBtn"),Kt=document.getElementById("settingsModal"),Ko=document.getElementById("closeSettings"),Fi=document.querySelectorAll(".theme-btn"),xi=document.querySelectorAll(".language-btn");try{im()}catch(t){console.warn("[app] initTheme failed",t)}try{sm()}catch(t){console.warn("[app] initLocalization failed",t)}Wo&&Wo.addEventListener("click",()=>{Kt.classList.remove("hidden");try{nm(document.body.getAttribute("data-theme"))}catch(t){console.warn(t)}try{const t=localStorage.getItem("language")||"en";Sc(t)}catch(t){console.warn(t)}});Ko&&Ko.addEventListener("click",()=>Kt.classList.add("hidden"));Fi&&Fi.forEach&&Fi.forEach(t=>t.addEventListener("click",()=>{try{Yi(t.getAttribute("data-theme"))}catch(e){console.warn(e)}}));xi&&xi.forEach&&xi.forEach(t=>t.addEventListener("click",()=>{try{const e=t.getAttribute("data-language");Qi(e),Sc(e)}catch(e){console.warn(e)}}));Kt.addEventListener("click",t=>{t.target===Kt&&Kt.classList.add("hidden")});function fm(){const t=document.getElementById("loginForm"),e=document.getElementById("signupForm");t.classList.add("slide-out-left"),e.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("slide-out-right")},10),setTimeout(()=>{t.classList.add("hidden")},500)}function pm(){const t=document.getElementById("loginForm"),e=document.getElementById("signupForm");e.classList.add("slide-out-right"),t.classList.remove("hidden"),setTimeout(()=>{t.classList.remove("slide-out-left")},10),setTimeout(()=>{e.classList.add("hidden")},500)}hm.addEventListener("click",fm);dm.addEventListener("click",pm);function Ie(){window.location.href="/home.html"}Mi.addEventListener("submit",async t=>{t.preventDefault();const e=Mi.querySelector('input[type="email"]').value,n=Mi.querySelector('input[type="password"]').value;try{await Gh(re,e,n);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(r){console.error("Login error:",r),alert("Login failed: "+r.message)}});Ui.addEventListener("submit",async t=>{t.preventDefault();const e=Ui.querySelector('input[type="email"]').value,n=Ui.querySelector('input[type="password"]').value;try{await Hh(re,e,n);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(r){console.error("Signup error:",r),alert("Signup failed: "+r.message)}});cm.addEventListener("click",async()=>{try{await vt(re,om);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Google login error:",t),alert("Google login failed: "+t.message)}});lm.addEventListener("click",async()=>{try{await vt(re,am);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("GitHub login error:",t),alert("GitHub login failed: "+t.message)}});Mo&&Mo.addEventListener("click",async()=>{try{const t=new ge;t.addScope("email"),t.setCustomParameters({display:"popup"}),await vt(re,t);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Facebook login error:",t),alert("Facebook login failed: "+t.message)}});Uo&&Uo.addEventListener("click",async()=>{try{await vt(re,Wt);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Yahoo login error:",t),alert("Yahoo login failed: "+t.message)}});Fo&&Fo.addEventListener("click",()=>{Ve.classList.remove("hidden"),Pr()});xo&&xo.addEventListener("click",async()=>{try{await ka(re);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Guest login error:",t),alert("Guest login failed: "+t.message)}});Bo&&Bo.addEventListener("click",async()=>{try{const t=new ge;t.addScope("email"),t.setCustomParameters({display:"popup"}),await vt(re,t);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Facebook signup error:",t),alert("Facebook signup failed: "+t.message)}});jo&&jo.addEventListener("click",async()=>{try{await vt(re,Wt);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Yahoo signup error:",t),alert("Yahoo signup failed: "+t.message)}});$o&&$o.addEventListener("click",()=>{Ve.classList.remove("hidden"),Pr()});Vo&&Vo.addEventListener("click",async()=>{try{await ka(re);try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(t){console.error("Guest signup error:",t),alert("Guest signup failed: "+t.message)}});um.addEventListener("click",async()=>{try{await qh(re),document.getElementById("loginForm").classList.remove("hidden"),document.getElementById("userDisplay").textContent="",document.getElementById("logoutBtn").classList.add("hidden")}catch(t){console.error("Logout error:",t),alert("Logout failed: "+t.message)}});re.onAuthStateChanged(t=>{t?(document.getElementById("loginForm").classList.add("hidden"),document.getElementById("userDisplay").textContent=t.email||t.uid,document.getElementById("logoutBtn").classList.remove("hidden")):(document.getElementById("loginForm").classList.remove("hidden"),document.getElementById("userDisplay").textContent="",document.getElementById("logoutBtn").classList.add("hidden"))});Ho&&Ho.addEventListener("click",()=>{Ve.classList.add("hidden"),Kn()});Ve&&Ve.addEventListener("click",t=>{t.target===Ve&&(Ve.classList.add("hidden"),Kn())});function Pr(){Ye||(Ye=new _d(re,"recaptcha-container",{size:"normal",callback:t=>{console.log("reCAPTCHA verified")},"expired-callback":()=>{console.log("reCAPTCHA expired")}}))}ct&&ct.addEventListener("click",async t=>{t.preventDefault();const e=Pc.value.trim();if(!e){alert("Please enter a phone number");return}try{ct.disabled=!0,ct.textContent="Sending...",Ye||Pr(),Un=await bd(re,e,Ye),Ac.classList.add("hidden"),kc.classList.remove("hidden"),alert("OTP sent to "+e)}catch(n){console.error("Error sending OTP:",n),n.code==="auth/invalid-phone-number"?alert("Invalid phone number. Please include country code (e.g., +1)"):n.code==="auth/too-many-requests"?alert("Too many requests. Please try again later."):alert("Error sending OTP: "+n.message),Ye&&(Ye.clear(),Ye=null)}finally{ct.disabled=!1,ct.textContent="Send OTP"}});lt&&lt.addEventListener("click",async t=>{t.preventDefault();const e=Zi.value.trim();if(!e||e.length!==6){alert("Please enter a valid 6-digit code");return}if(!Un){alert("OTP not sent. Please try again.");return}try{lt.disabled=!0,lt.textContent="Verifying...",await Un.confirm(e),Ve.classList.add("hidden"),Kn();try{sessionStorage.setItem("showLoader","1")}catch{}Ie()}catch(n){console.error("Error verifying OTP:",n),n.code==="auth/invalid-verification-code"?(alert("Invalid verification code. Please try again."),Zi.value=""):alert("Verification failed: "+n.message)}finally{lt.disabled=!1,lt.textContent="Verify & Login"}});Go&&Go.addEventListener("click",t=>{t.preventDefault(),Kn()});function Kn(){Ac.classList.remove("hidden"),kc.classList.add("hidden"),Pc.value="",Zi.value="",Un=null}
