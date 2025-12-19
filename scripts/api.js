(() => {
  const API_BASE = window.CMS_API_BASE || ''; 
  // contoh kalau beda domain:
  // window.CMS_API_BASE = 'https://cms.kenaritower.com';

  async function getJSON(url) {
    const res = await fetch(API_BASE + url, { method: 'GET' });
    if (!res.ok) throw new Error('Failed fetch ' + url);
    return res.json();
  }

  async function loadSettings() {
    const s = await getJSON('/api/public/settings');

    // navbar / footer
    setText('hotelNameNav', s.hotelName);
    setText('footerHotelName', s.hotelName);

    setText('contactPhone', s.phone);
    setText('footerPhone', `Phone: ${s.phone}`);

    setText('contactEmail', s.email);
    setText('footerEmail', `Email: ${s.email}`);

    setText('hotelAddress', s.address);
    setText('footerAddress', s.address);

    // whatsapp button
    const wa = document.querySelector('.whatsapp-btn');
    if (wa && s.whatsapp) {
      wa.href = `https://wa.me/${s.whatsapp}`;
    }

    // map
    const iframe = document.querySelector('#location iframe');
    if (iframe && s.mapsEmbedUrl) {
      iframe.src = s.mapsEmbedUrl;
    }
  }

  async function loadContent(lang = 'en') {
    const c = await getJSON(`/api/public/content?lang=${lang}`);

    // HERO
    setText('heroHeadline', c?.hero?.headline);
    setText('heroTagline', c?.hero?.tagline);

    // ABOUT
    setText('aboutTitle', c?.about?.title);
    setText('aboutDescription', c?.about?.description);
  }

  // helpers
  function setText(id, value) {
    if (!value) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // expose for language switch
  window.KenariCMS = {
    load: async (lang) => {
      await loadSettings();
      await loadContent(lang);
    }
  };

  // default load
  document.addEventListener('DOMContentLoaded', () => {
    window.KenariCMS.load('en');
  });

})();