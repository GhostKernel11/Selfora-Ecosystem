(function () {
  const ACCOUNT_CSS = `
    .account-button{border:1px solid var(--border,#ddd);background:var(--surface,#fff);padding:9px 13px;border-radius:10px;font-weight:700;cursor:pointer}
    .auth-panel{max-width:430px;margin:auto}.auth-tabs{display:flex;gap:8px;margin-bottom:18px}.auth-tab{flex:1;padding:10px;border:1px solid var(--border,#ddd);background:transparent;border-radius:9px;cursor:pointer;font-weight:700}.auth-tab.active{background:#111;color:#fff}.auth-form{display:grid;gap:12px}.auth-form label{font-size:13px;font-weight:700}.auth-form input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid var(--border,#ddd);border-radius:9px}.auth-message{font-size:13px;margin-top:10px}.auth-message.error{color:#b42318}.auth-message.success{color:#067647}.account-card{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px;border:1px solid var(--border,#ddd);border-radius:12px;margin-bottom:15px}.account-card small{display:block;opacity:.7}.account-actions{display:flex;gap:8px;flex-wrap:wrap}
  `;
  const style = document.createElement('style'); style.textContent = ACCOUNT_CSS; document.head.appendChild(style);

  let currentUser = null;
  let serverSync = false;
  let syncTimer = null;
  let csrfToken = null;

  async function ensureCsrf() {
    if (csrfToken) return csrfToken;
    const response = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.csrfToken) csrfToken = data.csrfToken;
    return csrfToken;
  }

  async function api(url, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (['POST','PUT','PATCH','DELETE'].includes(method)) {
      const token = await ensureCsrf();
      if (token) headers['X-CSRF-Token'] = token;
    }
    const response = await fetch(url, { credentials: 'same-origin', headers, ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }

  function accountButtonText() {
    const b = document.getElementById('accountButton');
    if (b) b.textContent = currentUser ? currentUser.name : 'Account';
  }

  window.syncAcademicState = function (state) {
    if (!serverSync) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      try { await api('/api/state', { method: 'PUT', body: JSON.stringify({ state }) }); }
      catch (error) { console.warn('Academic state sync failed:', error.message); }
    }, 350);
  };

  function openAccountModal() {
    const modal = document.getElementById('modal');
    const backdrop = document.getElementById('modalBackdrop');
    if (!modal || !backdrop) return;
    modal.innerHTML = currentUser ? `
      <div class="modal-header"><div><p class="eyebrow">ACCOUNT</p><h2>Academic Account</h2></div><button class="icon-button" data-auth-close>×</button></div>
      <div class="account-card"><div><strong>${escapeText(currentUser.name)}</strong><small>${escapeText(currentUser.email)}</small></div><span>☁ Synced</span></div>
      <p class="muted">Your academic state is now stored on the server for this account instead of only in this browser.</p>
      <div class="account-actions"><button class="secondary-button" data-auth-export>Download Local Backup</button><button class="danger-button" data-auth-logout>Log Out</button></div>
    ` : authForm('login');
    backdrop.classList.add('show');
    bindAccountModal();
  }

  function authForm(mode) {
    return `
      <div class="modal-header"><div><p class="eyebrow">${mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</p><h2>${mode === 'login' ? 'Sign in' : 'Create your account'}</h2></div><button class="icon-button" data-auth-close>×</button></div>
      <div class="auth-panel">
        <div class="auth-tabs"><button class="auth-tab ${mode==='login'?'active':''}" data-auth-mode="login">Sign in</button><button class="auth-tab ${mode==='register'?'active':''}" data-auth-mode="register">Register</button></div>
        <form class="auth-form" id="authForm">
          ${mode === 'register' ? '<label>Name<input name="name" required minlength="2" autocomplete="name"></label>' : ''}
          <label>Email<input name="email" type="email" required autocomplete="email"></label>
          <label>Password<input name="password" type="password" required minlength="8" autocomplete="current-password"></label>
          <button class="primary-button" type="submit">${mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div class="auth-message" id="authMessage">${serverSync ? 'Connected to the Academic Ecosystem server.' : 'You can continue using local browser data until you sign in.'}</div>
      </div>`;
  }

  function bindAccountModal() {
    document.querySelectorAll('[data-auth-close]').forEach(b => b.onclick = closeModal);
    document.querySelectorAll('[data-auth-mode]').forEach(b => b.onclick = () => { document.getElementById('modal').innerHTML = authForm(b.dataset.authMode); bindAccountModal(); });
    const form = document.getElementById('authForm');
    if (form) form.onsubmit = handleAuth;
    const logout = document.querySelector('[data-auth-logout]');
    if (logout) logout.onclick = async () => {
      await api('/api/auth/logout', { method: 'POST' });
      currentUser = null; serverSync = false; csrfToken = null; accountButtonText(); closeModal(); if (window.toast) window.toast('Logged out. Local browser data remains available.');
    };
    const exportBtn = document.querySelector('[data-auth-export]');
    if (exportBtn) exportBtn.onclick = () => {
      const data = localStorage.getItem('academic_ecosystem_v7') || localStorage.getItem('academic_ecosystem_v6');
      const blob = new Blob([data || '{}'], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='academic-ecosystem-backup.json'; a.click(); URL.revokeObjectURL(a.href);
    };
  }

  async function handleAuth(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const mode = event.target.querySelector('[name="name"]') ? 'register' : 'login';
    const payload = Object.fromEntries(form.entries());
    const message = document.getElementById('authMessage');
    try {
      const result = await api(`/api/auth/${mode}`, { method:'POST', body:JSON.stringify(payload) });
      currentUser = result.user; serverSync = true; csrfToken = null; await ensureCsrf(); accountButtonText();
      if (mode === 'register') {
        await api('/api/state', { method:'PUT', body:JSON.stringify({state:window.__getAcademicState ? window.__getAcademicState() : {}}) });
      } else if (result.hasState) {
        const remote = await api('/api/state');
        if (remote.state && window.__replaceAcademicState) window.__replaceAcademicState(remote.state);
      } else if (window.__getAcademicState) {
        await api('/api/state', { method:'PUT', body:JSON.stringify({state:window.__getAcademicState()}) });
      }
      closeModal(); if (window.updateShell) window.updateShell(); if (window.toast) window.toast(`Signed in as ${currentUser.name}. Your data is synced.`);
    } catch (error) {
      message.textContent = error.message; message.className = 'auth-message error';
    }
  }

  function escapeText(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  window.academicApi = api;
  window.reportClientError = function(error, context={}){
    const message=error?.message || String(error || 'Unknown client error');
    fetch('/api/client-errors',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({message:message.slice(0,500),source:String(context.source||'client').slice(0,160),page:location.pathname.slice(0,160),stack:String(error?.stack||'').slice(0,2000)})}).catch(()=>{});
  };
  window.addEventListener('error', event => { if(event.error) window.reportClientError(event.error,{source:'window.error'}); });
  window.addEventListener('unhandledrejection', event => { window.reportClientError(event.reason,{source:'unhandledrejection'}); });

  function closeModal(){const b=document.getElementById('modalBackdrop');if(b)b.classList.remove('show');}


  function startRealtime(){
    if(!serverSync || !window.EventSource) return;
    try{
      const stream=new EventSource('/api/realtime/stream');
      stream.addEventListener('notification.created',e=>{const d=JSON.parse(e.data); if(window.toast) window.toast(d.payload?.title || 'New notification'); window.dispatchEvent(new CustomEvent('academic:notification',{detail:d}));});
      stream.addEventListener('community.post.created',e=>window.dispatchEvent(new CustomEvent('academic:community-update',{detail:JSON.parse(e.data)})));
      stream.addEventListener('community.question.created',e=>window.dispatchEvent(new CustomEvent('academic:community-update',{detail:JSON.parse(e.data)})));
      stream.addEventListener('community.answer.created',e=>window.dispatchEvent(new CustomEvent('academic:community-update',{detail:JSON.parse(e.data)})));
      stream.addEventListener('academic.state.updated',e=>{const d=JSON.parse(e.data); if(d.payload?.userId!==currentUser?.id) return; window.dispatchEvent(new CustomEvent('academic:state-update',{detail:d}));});
      window.__academicEventSource=stream;
    }catch{}
  }
  window.getNotifications = async function(){ return api('/api/notifications'); };
  window.markNotificationRead = async function(id){ return api('/api/notifications/'+id+'/read',{method:'PATCH'}); };
  window.joinRoomPresence = async function(roomId){ return api('/api/presence/rooms/'+roomId,{method:'POST'}); };
  window.leaveRoomPresence = async function(roomId){ return api('/api/presence/rooms/'+roomId,{method:'DELETE'}); };
  window.getRoomPresence = async function(roomId){ return api('/api/presence/rooms/'+roomId); };
  window.getCommunityFeed = async function(){ return api('/api/community/feed'); };

  window.addEventListener('DOMContentLoaded', async () => {
    const account = document.getElementById('accountButton'); if (account) account.onclick = openAccountModal;
    try {
      const result = await api('/api/auth/me');
      currentUser = result.user; serverSync = true; csrfToken = null; await ensureCsrf(); accountButtonText();
      startRealtime();
      if (result.hasState) {
        const remote = await api('/api/state');
        if (remote.state && window.__replaceAcademicState) window.__replaceAcademicState(remote.state);
      } else if (window.__getAcademicState) {
        await api('/api/state', { method:'PUT', body:JSON.stringify({state:window.__getAcademicState()}) });
      }
    } catch { accountButtonText(); }
  });
})();
