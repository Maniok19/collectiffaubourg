(async function(){
  const container = document.getElementById('events-dynamic');
  if (!container) return;

  function formatDateISO(d) {
    // Input YYYY-MM-DD -> readable FR
    const [y,m,day] = d.split('-');
    const date = new Date(`${y}-${m}-${day}T00:00:00`);
    return date.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  }

  try {
    const res = await fetch('/api/events', { credentials:'include' });
    if (!res.ok) throw new Error('Erreur chargement');
    const events = await res.json();
    if (!events.length) {
      container.innerHTML = '<p>Aucun événement programmé pour le moment.</p>';
      return;
    }
    container.innerHTML = events.map(ev => {
      const dateObj = new Date(ev.date + 'T' + ev.heure);
      const month = dateObj.toLocaleDateString('fr-FR',{ month:'short' }).toUpperCase();
      const day = String(dateObj.getDate()).padStart(2,'0');
      const year = dateObj.getFullYear();
      return `
        <div class="event-card">
          <div class="event-date">
            <span class="month">${month}</span>
            <span class="day">${day}</span>
            <span class="year">${year}</span>
          </div>
          <div class="event-content">
            <h4 class="event-title">${escapeHtml(ev.titre)}</h4>
            ${ev.adresse ? `<p class="event-venue">${escapeHtml(ev.adresse)}</p>` : ''}
            <p class="event-time">${escapeHtml(ev.heure)}</p>
            ${ev.description ? `<p class="event-description">${escapeHtml(ev.description)}</p>` : ''}
            <a href="contact.html" class="event-booking">Infos / Contact</a>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<p style="color:#c00;">${err.message}</p>`;
  }

  function escapeHtml(str='') {
    return str.replace(/[&<>"'`]/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'
    }[c]));
  }
})();