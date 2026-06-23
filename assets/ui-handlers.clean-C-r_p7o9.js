import{_ as e,a as t,c as n,d as r,h as i,l as a,t as o,u as s,v as c}from"./firebase-config-CLpyZLYP.js";import{n as l,r as u,t as d}from"./role-manager-C3PXP2q0.js";var f=e();function p(){m(),h(),S(),g()}function m(){let e=document.getElementById(`addModeratorForm`);e&&e.addEventListener(`submit`,async e=>{e.preventDefault();try{let e=document.getElementById(`moderatorEmail`);if(!e)throw Error(`Moderator email input not found`);let t=e.value.trim().toLowerCase();if(!t||!t.includes(`@`))throw Error(`Please enter a valid email address`);await u.assignRole(o.currentUser,t,l.MODERATOR),e.value=``,window.closeAddModeratorModal?.(),alert(`Moderator added successfully`),await Promise.all([window.loadModerators?.(),window.loadModeratorList?.(),window.loadUsers?.()])}catch(e){console.error(`Error adding moderator:`,e),alert(e.message||`Failed to add moderator`)}})}function h(){let e=document.getElementById(`addSuperAdminForm`);e&&e.addEventListener(`submit`,async e=>{e.preventDefault();try{let e=document.getElementById(`superAdminEmail`);if(!e)throw Error(`Email input not found`);let t=e.value.trim().toLowerCase();if(!t||!t.includes(`@`))throw Error(`Please enter a valid email address`);await u.assignRole(o.currentUser,t,l.SUPER_ADMIN),e.value=``,window.closeAddSuperAdminModal?.(),alert(`Super Admin added successfully`),await Promise.all([window.loadSuperAdmins?.(),window.loadUsers?.()])}catch(e){console.error(`Error adding super admin:`,e),alert(e.message||`Failed to add super admin`)}})}function g(){document.getElementById(`addModeratorModal`)?.addEventListener(`click`,e=>{e.target.id===`addModeratorModal`&&window.closeAddModeratorModal?.()}),document.getElementById(`addSuperAdminModal`)?.addEventListener(`click`,e=>{e.target.id===`addSuperAdminModal`&&window.closeAddSuperAdminModal?.()})}function _(){document.querySelectorAll(`.nav-link`).forEach(e=>{e.addEventListener(`click`,t=>{if(e.getAttribute(`href`)?.startsWith(`#`)){t.preventDefault();let n=e.getAttribute(`data-section`);n&&v(n)}})})}function v(e){document.querySelectorAll(`.content-section`).forEach(e=>{e.classList.remove(`active`),e.classList.add(`hidden`)}),document.querySelectorAll(`.nav-link`).forEach(e=>e.classList.remove(`active`));let t=document.getElementById(`${e}-section`),n=document.querySelector(`[data-section="${e}"]`);t&&(t.classList.remove(`hidden`),t.classList.add(`active`),setTimeout(()=>{switch(e){case`admin-management`:case`admins`:window.loadAdmins?.();break;case`moderator-management`:case`moderators`:window.loadModerators?.();break;case`super-admin`:window.loadSuperAdmins?.();break;case`messages`:window.loadMessages?.();break;case`manage-all-ranks`:y();break;case`chats`:x();break;case`product-management`:window.loadControlPanelProducts?.();break;case`product-reports`:window.loadReports?.();break;case`product-reports`:window.loadReports?.();break}},100)),n&&n.classList.add(`active`);try{history.replaceState(null,``,`#${e}`)}catch{}}async function y(){let e=document.getElementById(`usersList`),t=document.getElementById(`ownersList`),a=document.getElementById(`adminsListAll`),s=document.getElementById(`superAdminsListAll`),c=document.getElementById(`moderatorsListAll`);if(!(!e&&!t&&!a&&!c))try{let[p,m,h]=await Promise.all([n(r(i(f,`users`))),n(r(i(f,`admins`))),n(r(i(f,`moderators`)))]),g=p.docs.map(e=>({id:e.id,...e.data()})),_=m.docs.map(e=>({id:e.id,...e.data()})),v=h.docs.map(e=>({id:e.id,...e.data()}));for(let e of d){let t=String(e).toLowerCase();g.find(e=>String(e.email||``).toLowerCase()===t)||g.push({id:`owner-${t}`,email:t,role:l.OWNER,createdAt:null})}let y=new Set(d.map(e=>String(e).toLowerCase())),b=new Set(_.map(e=>String(e.email||``).toLowerCase())),x=new Set(v.map(e=>String(e.email||``).toLowerCase())),S=[],C=[];for(let e of g){let t=String(e.email||``).toLowerCase();t&&(y.has(t)||(e.role||``).toUpperCase()===l.OWNER?S.push(e):b.has(t)||x.has(t)||C.push(e))}t&&(t.innerHTML=``);for(let e of S){let n=e.email;t&&(t.innerHTML+=`
                <div class="owner-item">
                    <div class="Owner-info">
                        <div class="Owner-email">👑 ${n}</div>
                        <div class="Owner-meta">
                            <span class="owner">👑 Owner</span>
                            <span class="Owner-Add">Added by: System</span>
                            <span class="Owner-Add">Joined: From Start</span>
                            <span class="Owner-RN">Name: Muhammad Hamza Sabir</span>
                        </div>
                        <div class="Owner-actions">
                            <span class="protected-label">
                            Protected
                            </span>
                        </div>
                </div>`)}let w=_.filter(e=>e.isSuperAdmin),T=_.filter(e=>!e.isSuperAdmin);s&&(s.innerHTML=``);for(let e of w){let t=e.email,n=e.addedAt||e.createdAt||null,r=(window.formatDate||(e=>`N/A`))(n);s&&(s.innerHTML+=`
                <div class="super-admin-item">
                    <div class="super-admin-info">
                        <div class="super-admin-email">${t}</div>
                        <div class="super-admin-meta">
                        <span class="super-admin-type">
                            Super Admin
                        </span>
                            <span class="admin-date">Added: ${r}</span>
                            <span class="admin-by">by: ${e.addedBy||`N/A`}</span>
                        </div>
                    </div>
                    <div class="super-admin-actions">
                        <button onclick="showRolePicker('${e.id}','${t}','SUPER_ADMIN', this)" class="demote-btn">Change Role</button>
                        <button onclick="removeSuperAdmin('${e.id}')" class="remove-btn">Remove</button>
                    </div>
                </div>`)}a&&(a.innerHTML=``);for(let e of T){let t=e.email,n=e.addedAt||e.createdAt||null,r=(window.formatDate||(e=>`N/A`))(n);a&&(a.innerHTML+=`
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${t}</div>
                        <div class="admin-meta">
                            <span class="admin-type regular">Admin</span>
                            <span class="admin-date">Added: ${r}</span>
                            <span class="admin-by">by: ${e.addedBy||`N/A`}</span>
                        </div>
                    </div>
                    <div class="admin-actions">
                        <button onclick="showRolePicker('${e.id}','${t}','ADMIN', this)" class="role-btn">Change Role</button>
                        <button onclick="removeAdmin('${e.id}')" class="remove-btn">Remove</button>
                    </div>
                </div>`)}c&&(c.innerHTML=``);for(let e of v){let t=e.email,n=e.addedAt||e.createdAt||null;c&&(c.innerHTML+=`
                <div class="moderator-item">
                    <div class="moderator-info">
                        <div class="moderator-email">${t}</div>
                        <div class="moderator-meta">
                            <span class="moderator-type">Moderator</span>
                            <span class="moderator-date">Added: ${(window.formatDate||(e=>`N/A`))(n)}</span>
                            <span class="moderator-by">by: ${e.addedBy||`N/A`}
                        </div>
                    </div>
                    <div class="moderator-actions">
                    <button onclick="showRolePicker('${e.id||e.email}', '${t}', 'MODERATOR', this)" class="promote-btn">Change Role</button>
                        <button onclick="removeModerator('${e.id||e.email}')" class="remove-btn">Remove</button>
                    </div>
                </div>`)}e&&(e.innerHTML=``);for(let t of C){let n=(t.role||l.USER).toUpperCase(),r=`user-item`;switch(n){case l.SUPER_ADMIN:r=`super-admin-item`;break;case l.ADMIN:r=`admin-item`;break;case l.MODERATOR:r=`moderator-item`;break;default:r=`user-item`}let i=await u.checkPermission(o.currentUser,`manage`,n);e&&(e.innerHTML+=`
                <div class="${r}">
                    <div class="user-info">
                        <div class="user-email">${t.email}</div>
                        <div class="user-meta">
                            <span class="user-role ${n.toLowerCase()}">${n}</span>
                            <span class="user-date">Joined: ${(window.formatDate||(e=>`N/A`))(t.createdAt)}</span>
                        </div>
                    </div>
                    ${i?`
                        <div class="user-actions">
                            <button onclick="showRolePicker('${t.id}','${t.email}','${n}', this)" class="change-role-btn">Change Role</button>
                            <button onclick="deleteUser('${t.id}')" class="delete-btn">Delete</button>
                        </div>`:``}
                </div>`)}}catch(n){console.error(`Error loading users:`,n),t&&(t.innerHTML=``),e&&(e.innerHTML=`<p class="error">Error loading users</p>`),a&&(a.innerHTML=`<p class="error">Error loading admins</p>`),c&&(c.innerHTML=`<p class="error">Error loading moderators</p>`)}}var b=null;async function x(){let e=document.getElementById(`chatsList`);if(e){b&&=(b(),null);try{b=a(r(i(f,`global_chat`),s(`timestamp`,`asc`)),t=>{if(e.innerHTML=``,t.empty){e.innerHTML=`<p class="no-messages">No messages yet</p>`;return}t.forEach(t=>{let n=t.data(),r=(window.formatDate||(e=>`N/A`))(n.timestamp),i=n.senderName||n.senderEmail||`Anonymous`,a=n.text||``,o=document.createElement(`div`);o.className=`chat-message`,o.innerHTML=`
                    <div class="chat-meta"><strong class="chat-sender">${i}</strong> <span class="chat-time">${r}</span></div>
                    <div class="chat-text">${C(a)}</div>
                `,e.appendChild(o)}),e.scrollTop=e.scrollHeight},t=>{console.error(`Error loading chats:`,t),e.innerHTML=`<p class="error">Error loading chat messages</p>`})}catch(e){console.error(`Error in loadChats:`,e)}}}function S(){let e=document.getElementById(`chatForm`),n=document.getElementById(`chatInput`);!e||!n||e.addEventListener(`submit`,async e=>{e.preventDefault();let r=n.value.trim();if(r){if(!o.currentUser){alert(`You must be signed in to chat`);return}try{await t(i(f,`global_chat`),{text:r,senderId:o.currentUser.uid,senderName:o.currentUser.email,timestamp:c()}),n.value=``}catch(e){console.error(`Error sending chat message:`,e),alert(e.message||`Failed to send message`)}}})}function C(e){return String(e).replace(/[&<>"'`]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`,"`":`&#96;`})[e])}async function w(e,t,n,r){try{document.querySelectorAll(`.role-picker`).forEach(e=>e.remove());let i=document.createElement(`div`);i.className=`role-picker`,i.style.position=`absolute`,i.style.zIndex=1e4,i.style.background=`var(--container-bg, #fff)`,i.style.border=`1px solid var(--border-color, #ddd)`,i.style.padding=`8px`,i.style.borderRadius=`6px`,i.style.boxShadow=`0 4px 12px rgba(0,0,0,0.12)`;let a=document.createElement(`select`);a.setAttribute(`aria-label`,`Change role for ${t}`);let s=[l.OWNER,l.SUPER_ADMIN,l.ADMIN,l.MODERATOR,l.USER],c=await Promise.all(s.map(e=>u.checkPermission(o.currentUser,`manage`,e).then(Boolean).catch(()=>!1))),f=o.currentUser?.email?.toLowerCase(),p=f&&d.map(e=>e.toLowerCase()).includes(f),m=d.map(e=>e.toLowerCase()).includes(String(t||``).toLowerCase());s.forEach((e,t)=>{let r=document.createElement(`option`);r.value=e,r.textContent=e.replace(`_`,` `),e===n&&(r.selected=!0);let i=c[t];e===l.OWNER&&!p&&(i=!1),(m||n===l.SUPER_ADMIN)&&!p&&(i=!1),i||(r.disabled=!0),a.appendChild(r)});let h=document.createElement(`button`);h.textContent=`Set`,h.className=`confirm-role-btn`,h.style.marginLeft=`8px`;let g=document.createElement(`button`);g.textContent=`Cancel`,g.className=`cancel-role-btn`,g.style.marginLeft=`6px`,i.appendChild(a),i.appendChild(h),i.appendChild(g),document.body.appendChild(i);let _=r.getBoundingClientRect();i.style.top=`${_.bottom+window.scrollY+6}px`,i.style.left=`${_.left+window.scrollX}px`,h.addEventListener(`click`,async()=>{let n=a.value;try{if(!await u.checkPermission(o.currentUser,`manage`,n)&&!p){alert(`You do not have permission to assign this role`);return}if((n===l.OWNER||n===l.SUPER_ADMIN)&&!p){alert(`Only owners can assign Owner or Super Admin roles`);return}await window.setUserRole(e,t,n),i.remove()}catch(e){console.error(`Error changing role via picker:`,e),alert(e.message||`Failed to change role`)}}),g.addEventListener(`click`,()=>i.remove());let v=e=>{!i.contains(e.target)&&e.target!==r&&(i.remove(),document.removeEventListener(`click`,v))};return setTimeout(()=>document.addEventListener(`click`,v)),window._lastRolePicker=i,i}catch(e){console.error(`Error showing role picker:`,e)}}window.showRolePicker=w;export{y as loadUsers,p as setupFormHandlers,_ as setupNavigationHandlers,v as showSection};