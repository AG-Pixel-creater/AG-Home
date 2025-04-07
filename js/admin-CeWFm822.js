import{a as S,q as u,k as g,n as p,h as o,p as y,r as l,u as E,t as h,v as L,w as M,x as D,y as $,z as b,A as k}from"./firebase-config-2YIhq72v.js";/* empty css                 */const d=S();document.getElementById("messagesList");async function B(){try{if(await Notification.requestPermission()==="granted"){const a=await D($,{vapidKey:"BOanVJq4Mf-4H8MXPLg-5GnuUwORDbxsvFxjXOEQEYJSIIu2sJCh85L-69I-GRPcwgALivkh_k2XH1eQfKu-bTo"});await h(l(d,"adminTokens",o.currentUser.uid),{token:a,email:o.currentUser.email,lastUpdated:new Date})}}catch(e){console.error("Error setting up notifications:",e)}}async function z(e){if(!e)return!1;if(e.email==="ag.aliengamerz@gmail.com")return!0;try{if(e.email==="hamza.datashare@gmail.com")return!0;const a=u(g(d,"admins"),M("email","==",e.email.toLowerCase()));return!(await p(a)).empty}catch(a){return console.error("Error checking admin status:",a),!1}}function I(){const e=u(g(d,"messages"),b("timestamp","desc")),a=document.getElementById("messagesList");if(!a){console.error("Messages list element not found");return}try{const n=k(e,i=>{if(a.innerHTML="",i.empty){a.innerHTML='<p class="no-messages">No messages yet</p>';return}i.forEach(t=>{var r,c;const s=t.data(),m=(c=(r=s.timestamp)==null?void 0:r.toDate)!=null&&c.call(r)?s.timestamp.toDate().toLocaleString():"No date";a.innerHTML+=`
                    <div class="message-card" id="${t.id}">
                        <div class="message-header">
                            <h3>${s.name||"Anonymous"}</h3>
                            <span class="message-date">${m}</span>
                        </div>
                        <div class="message-email">
                            <a href="mailto:${s.email}">${s.email}</a>
                        </div>
                        <p class="message-content">${s.message}</p>
                        <div class="message-actions">
                            <button onclick="deleteMessage('${t.id}')" class="delete-btn">
                                Delete
                            </button>
                            <button onclick="replyToEmail('${s.email}')" class="reply-btn">
                                Reply
                            </button>
                        </div>
                    </div>
                `})},i=>{console.error("Error loading messages:",i),a.innerHTML='<p class="error-message">Error loading messages. Please refresh the page.</p>'});window.addEventListener("unload",()=>n())}catch(n){console.error("Error setting up message listener:",n)}}document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",a=>{if(e.getAttribute("href").startsWith("#")){a.preventDefault();const n=e.getAttribute("data-section");U(n)}})});function U(e){document.querySelectorAll(".content-section").forEach(i=>{i.classList.remove("active")}),document.querySelectorAll(".nav-link").forEach(i=>{i.classList.remove("active")});const a=document.getElementById(`${e}-section`),n=document.querySelector(`[data-section="${e}"]`);a&&(a.classList.add("active"),(e==="admin-management"||e==="admins")&&(f(),A())),n&&n.classList.add("active")}async function f(){const e=document.getElementById("adminList");if(!e){console.error("Admin list element not found");return}try{const a=u(g(d,"admins")),n=await p(a);if(console.log("Found admins:",n.size),e.innerHTML="",n.empty){e.innerHTML="<p>No admins found</p>";return}n.forEach(i=>{var r,c;const t=i.data();console.log("Admin:",t);const s=t.email==="ag.aliengamerz@gmail.com"||t.isSuperAdmin,m=((r=o.currentUser)==null?void 0:r.email)==="ag.aliengamerz@gmail.com";e.innerHTML+=`
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${t.email}</div>
                        <div class="admin-meta">
                            <span class="admin-type ${s?"super":"regular"}">
                                ${s?"Super Admin":"Admin"}
                            </span>
                            <span class="admin-date">
                                Added: ${((c=t.addedAt)==null?void 0:c.toDate().toLocaleDateString())||"N/A"}
                            </span>
                        </div>
                    </div>
                    ${m&&t.email!=="ag.aliengamerz@gmail.com"?`
                        <div class="admin-actions">
                            <button onclick="toggleAdminRole('${t.email}')" class="role-btn">
                                ${t.isSuperAdmin?"Make Admin":"Make Super Admin"}
                            </button>
                            <button onclick="removeAdmin('${t.email}')" class="delete-btn">
                                Remove
                            </button>
                        </div>
                    `:""}
                </div>
            `})}catch(a){console.error("Error loading admins:",a),e.innerHTML='<p class="error">Error loading admins. Please try again.</p>'}}async function A(){const e=document.getElementById("adminsList");if(console.log("Loading admin list... Element found:",!!e),!e)return;const a=u(g(d,"admins"));try{console.log("Fetching admin list data...");const n=await p(a);console.log("Admin list entries found:",n.size),e.innerHTML="",n.forEach(i=>{var r;const t=i.data();console.log("Admin list entry:",t);const s=t.isSuperAdmin||t.email==="ag.aliengamerz@gmail.com",m=((r=o.currentUser)==null?void 0:r.email)==="ag.aliengamerz@gmail.com";e.innerHTML+=`
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${t.email}</div>
                        <div class="admin-meta">
                            <span class="admin-type ${s?"super":"regular"}">
                                ${s?"Super Admin":"Admin"}
                            </span>
                            <span class="admin-date">
                                Added: ${t.addedAt.toDate().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    ${m&&t.email!=="ag.aliengamerz@gmail.com"?`
                        <div class="admin-actions">
                            <button onclick="toggleAdminRole('${i.id}')" 
                                class="role-btn" title="Toggle Role">
                                ${t.isSuperAdmin?"Make Admin":"Make Super Admin"}
                            </button>
                            <button onclick="removeAdmin('${i.id}')" 
                                class="delete-btn" title="Remove Admin">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                        </div>
                    `:""}
                </div>
            `})}catch(n){console.error("Error in loadAdminList:",n)}}function w(){document.getElementById("adminModal").classList.add("hidden")}window.openAddAdminModal=function(){document.getElementById("addAdminModal").classList.remove("hidden"),document.getElementById("adminEmail").focus()};window.closeAddAdminModal=function(){document.getElementById("addAdminModal").classList.add("hidden"),document.getElementById("addAdminForm").reset()};window.changeAdminRole=async e=>{try{const n=(await y(l(d,"admins",e))).data(),i=n.isSuperAdmin?"admin":"super admin";confirm(`Change ${n.email}'s role to ${i}?`)&&(await E(l(d,"admins",e),{isSuperAdmin:!n.isSuperAdmin,roleChangedBy:o.currentUser.email,roleChangedAt:new Date}),alert("Admin role updated successfully"))}catch(a){console.error("Error changing admin role:",a),alert("Failed to change admin role")}};window.addAdmin=async()=>{var e,a;try{if(((e=o.currentUser)==null?void 0:e.email)!=="ag.aliengamerz@gmail.com")throw new Error("Only super admin can add new admins");const n=(a=prompt("Enter new admin email:"))==null?void 0:a.toLowerCase().trim();if(!n)return;const i=l(d,"admins",n);if((await y(i)).exists())throw new Error("This email is already an admin");await h(i,{email:n,addedBy:o.currentUser.email,addedAt:new Date,isSuperAdmin:!1}),alert("Admin added successfully"),await f()}catch(n){console.error("Error adding admin:",n),alert(n.message)}};document.addEventListener("DOMContentLoaded",()=>{document.getElementById("closeAdminModal").addEventListener("click",w),document.getElementById("adminModal").addEventListener("click",a=>{a.target.id==="adminModal"&&w()}),document.getElementById("addAdminModal").addEventListener("click",a=>{a.target.id==="addAdminModal"&&closeAddAdminModal()});const e=document.getElementById("addAdminForm");e&&e.addEventListener("submit",async a=>{var m;a.preventDefault();const n=document.getElementById("adminEmail"),i=document.getElementById("isSuperAdmin");if(!n)return;const t=n.value.trim().toLowerCase(),s=(i==null?void 0:i.checked)||!1;try{if(((m=o.currentUser)==null?void 0:m.email)!=="ag.aliengamerz@gmail.com")throw new Error("Only super admin can add new admins");const r=l(d,"admins",t);if((await y(r)).exists())throw new Error("This email is already an admin");await h(r,{email:t,isSuperAdmin:s,addedBy:o.currentUser.email,addedAt:new Date}),closeAddAdminModal(),alert("Admin added successfully"),A(),f()}catch(r){console.error("Error adding admin:",r),alert(r.message)}})});window.removeAdmin=async e=>{try{if(o.currentUser.email!=="ag.aliengamerz@gmail.com")throw new Error("Only super admin can remove admins");confirm("Are you sure you want to remove this admin?")&&(await L(l(d,"admins",e)),alert("Admin removed successfully"))}catch(a){console.error("Error removing admin:",a),alert(a.message)}};window.promoteToSuperAdmin=async()=>{const e=prompt("Enter email of admin to promote to super admin:");if(e)try{const a=o.currentUser;if(a.email!=="ag.aliengamerz@gmail.com")throw new Error("Only the original super admin can promote others");const n=await p(u(g(d,"admins"),M("email","==",e)));if(n.empty)throw new Error("User is not an admin");await E(n.docs[0].ref,{isSuperAdmin:!0,promotedBy:a.email,promotedAt:new Date}),alert("Admin promoted to super admin successfully")}catch(a){console.error("Error promoting admin:",a),alert(a.message)}};let v=!1;o.onAuthStateChanged(async e=>{if(!v){if(v=!0,!e){window.location.href="index.html";return}try{if(!await z(e)){window.location.href="index.html";return}const n=e.email==="ag.aliengamerz@gmail.com";await T(e,n)}catch(a){console.error("Error checking admin status:",a),window.location.href="index.html"}}});async function T(e,a){var n;try{const i=document.getElementById("userDisplay");if(i&&(i.textContent=e.email),a||e.email==="hamza.datashare@gmail.com"){const t=document.getElementById("superAdminLinks");t&&t.classList.remove("hidden"),(n=document.querySelectorAll(".admin-controls"))==null||n.forEach(s=>s.classList.remove("hidden"))}await B(),I(),await f(),await A()}catch(i){console.error("Error setting up UI:",i)}}window.deleteMessage=async e=>{if(confirm("Are you sure you want to delete this message?"))try{await L(l(d,"messages",e)),console.log("Message deleted successfully")}catch(a){console.error("Error deleting message:",a),alert("Failed to delete message")}};window.replyToEmail=e=>{window.location.href=`mailto:${e}`};
//# sourceMappingURL=admin-CeWFm822.js.map
