const API_BASE = ''; // same origin
async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  });
  if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.error || res.statusText);
  return res.json().catch(()=> ({}));
}

const loginView = document.getElementById('login-view');
const adminView = document.getElementById('admin-view');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const passwordInput = document.getElementById('admin-password');
const loginStatus = document.getElementById('login-status');
const createForm = document.getElementById('create-form');
const tableBody = document.querySelector('#events-table tbody');

async function refreshEvents() {
  tableBody.innerHTML = '<tr><td colspan="4">Chargement...</td></tr>';
  try {
    const events = await api('/api/events', { method: 'GET' });
    if (!events.length) {
      tableBody.innerHTML = '<tr><td colspan="4">Aucun événement</td></tr>';
      return;
    }
    tableBody.innerHTML = events.map(e => `
      <tr data-id="${e.id}">
        <td><span class="badge-date">${e.date}<br>${e.heure}</span></td>
        <td><strong>${escapeHtml(e.titre)}</strong></td>
        <td style="max-width:260px;">
          ${e.description ? `<div>${escapeHtml(e.description)}</div>` : '<em style="opacity:.6">—</em>'}
          ${e.adresse ? `<div style="margin-top:.4rem; font-size:.7rem; color:#555;">${escapeHtml(e.adresse)}</div>` : ''}
        </td>
        <td><button class="danger-btn" data-del>Supprimer</button></td>
      </tr>
    `).join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="4" style="color:#c00;">Erreur: ${err.message}</td></tr>`;
  }
}

function escapeHtml(str='') {
  return str.replace(/[&<>"'`]/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'
  }[c]));
}

loginBtn.addEventListener('click', async () => {
  loginStatus.textContent = '';
  try {
    await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password: passwordInput.value })
    });
    passwordInput.value = '';
    showAdmin();
  } catch (err) {
    loginStatus.textContent = err.message || 'Échec connexion';
  }
});

logoutBtn.addEventListener('click', async () => {
  try { await api('/api/logout', { method:'POST' }); } catch {}
  showLogin();
});

createForm.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(createForm);
  const data = Object.fromEntries(fd.entries());
  try {
    await api('/api/events', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    createForm.reset();
    refreshEvents();
  } catch (err) {
    alert('Erreur: ' + err.message);
  }
});

tableBody.addEventListener('click', async e => {
  if (e.target.matches('[data-del]')) {
    const tr = e.target.closest('tr');
    const id = tr.dataset.id;
    if (confirm('Supprimer cet événement ?')) {
      try {
        await api('/api/events/' + id, { method: 'DELETE' });
        tr.remove();
        if (!tableBody.children.length) refreshEvents();
      } catch (err) {
        alert('Erreur suppression: ' + err.message);
      }
    }
  }
});

function showLogin() {
  loginView.hidden = false;
  adminView.hidden = true;
}
function showAdmin() {
  loginView.hidden = true;
  adminView.hidden = false;
  refreshEvents();
}

// On load: try to load events (if session still valid)
(async () => {
  try {
    await refreshEvents();
    showAdmin();
  } catch {
    showLogin();
  }
})();