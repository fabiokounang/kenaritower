(() => {
  const API_BASE = "https://cms.kenaritower.com";
  const ENDPOINT = `${API_BASE}/api/site-content`;

  const resolveAssetUrl = (u) => {
    if (!u) return "";
    // already absolute
    if (/^https?:\/\//i.test(u)) return u;

    // if starts with /uploads... or uploads...
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${API_BASE}${path}`;
  };

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const setTextById = (id, value) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[render] missing element id="${id}"`);
      return;
    }
    el.textContent = value ?? "";
  };

  const setText = (el, value) => {
    if (!el) return;
    el.textContent = value ?? "";
  };

  const safeSetImg = (imgEl, url, alt) => {
    const urlApi = resolveAssetUrl(url);
    if (!imgEl) return;
    if (!url) {
      imgEl.src = "";
      imgEl.alt = "Image failed to load";
      imgEl.style.display = "none";
      return;
    }
    imgEl.style.display = "";
    imgEl.src = urlApi;
    imgEl.alt = alt || "";
    imgEl.onerror = () => {
      imgEl.src = "";
      imgEl.alt = "Image failed to load";
      imgEl.style.display = "none";
    };
  };

  const setMapIframeSrc = (src) => {
    const iframe = $("#location .map-container iframe");
    if (!iframe) return;
    if (src) iframe.src = src;
  };

  const setWhatsAppLink = (whatsappNumber) => {
    const wa = $(".whatsapp-btn");
    if (!wa) return;
    if (!whatsappNumber) return;
    wa.href = `https://wa.me/${String(whatsappNumber).replace(/\D/g, "")}`;
  };

  // ---------- renderers ----------
  const renderHero = (hero, home) => {
    if (!hero) return;
    if (!home) return;
    setTextById("heroHeadline", home.heroTitle);
    setTextById("heroTagline", home.heroSubtitle);

    // Update carousel images (reuse existing slides)
    const slides = $$(".hero-section .carousel .carousel-slide img");
    const imgs = Array.isArray(hero.images) ? hero.images : [];

    slides.forEach((imgEl, idx) => {
      const item = imgs[idx];
      safeSetImg(imgEl, item?.imageUrl, item?.alt);
    });

    // If backend gives more images than existing slides, optionally append (still same design/classes)
    const carousel = $(".hero-section .carousel");
    if (carousel && imgs.length > slides.length) {
      for (let i = slides.length; i < imgs.length; i++) {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        const img = document.createElement("img");
        safeSetImg(img, imgs[i]?.imageUrl, imgs[i]?.alt);
        slide.appendChild(img);
        carousel.appendChild(slide);
      }
    }
  };

  const renderAbout = (about) => {
    if (!about) return;

    // heading: ".about-text h3" (no id in your HTML)
    const h3 = $("#about .about-text h3");
    if (h3 && about.heading) setText(h3, about.heading);

    // paragraphs: ".about-text p" (first one already has id=aboutDescription)
    const ps = $$("#about .about-text p");
    const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];

    if (paragraphs.length && ps.length) {
      // keep number of <p> same; just fill as much as we can
      for (let i = 0; i < ps.length; i++) {
        if (paragraphs[i] != null) ps[i].textContent = paragraphs[i];
      }
    } else if (about.description) {
      // fallback
      setTextById("aboutDescription", about.description);
    }

    // about image
    const imgEl = $("#about .about-image img");
    safeSetImg(imgEl, about?.imageUrl, about?.alt);
  };

  const renderGallery = (items) => {
    if (!Array.isArray(items)) return;

    const grid = $("#gallery .gallery-grid");
    if (!grid) return;

    grid.innerHTML = "";

    for (const it of items) {
      const wrap = document.createElement("div");
      wrap.className = "gallery-item";

      const fullUrl = resolveAssetUrl(it?.imageUrl);

      const a = document.createElement("a");
      a.href = fullUrl;
      a.setAttribute("data-lightbox", "hotel-gallery");
      a.setAttribute(
        "data-title",
        `<strong>${it?.title ?? ""}</strong><br>${it?.description ?? ""}`
      );

      const img = document.createElement("img");
      safeSetImg(img, fullUrl, it?.alt);

      const overlay = document.createElement("div");
      overlay.className = "gallery-overlay";
      overlay.textContent = it?.title ?? "";

      a.appendChild(img);
      wrap.appendChild(a);
      wrap.appendChild(overlay);
      grid.appendChild(wrap);
    }

    if (window.lightbox?.init) window.lightbox.init();
  };

  const renderFacilities = (items) => {
    if (!Array.isArray(items)) return;
    const grid = $("#facilities .facilities-grid");
    if (!grid) return;

    grid.innerHTML = "";

    for (const it of items) {
      const card = document.createElement("div");
      card.className = "facility-card";

      const icon = document.createElement("div");
      icon.className = "facility-icon";
      icon.textContent = it?.icon ?? "";

      const h3 = document.createElement("h3");
      h3.textContent = it?.title ?? "";

      const p = document.createElement("p");
      p.textContent = it?.subtitle ?? "";

      card.appendChild(icon);
      card.appendChild(h3);
      card.appendChild(p);
      grid.appendChild(card);
    }
  };

  const renderServices = (items) => {
    const grid = document.querySelector("#services .services-grid");

    if (!grid) return;

    const arr = Array.isArray(items) ? items : [];
    grid.innerHTML = "";

    for (const it of arr) {
      const card = document.createElement("div");
      card.className = "service-card";

      const h3 = document.createElement("h3");
      h3.textContent = it?.title ?? "";

      const p = document.createElement("p");
      p.textContent = it?.description ?? "";

      card.appendChild(h3);
      card.appendChild(p);
      grid.appendChild(card);
    }

    requestAnimationFrame(() => {
      grid.querySelectorAll(".service-card").forEach((el) => el.classList.add("visible"));
    });
  };

  const renderLocation = (loc) => {
    if (!loc) return;

    // heading h3
    const h3 = $("#location .location-info h3");
    if (h3 && loc.tagline) h3.textContent = loc.tagline;

    // address id exists
    if (loc.address) setTextById("hotelAddress", loc.address);

    // description title/desc (they are plain <p><strong>... and <p>... without ids)
    const info = $("#location .location-info");
    if (info) {
      const p = document.getElementsByClassName("strategic");
      p[0].innerHTML = "";
      p[0].textContent = loc.footerAbout;
    }

    setMapIframeSrc(loc.mapsEmbedUrl);
  };

  const renderContact = (c) => {
    if (!c) return;

    // section title h2
    const h2 = $("#contact .section-title");
    if (h2 && c.title) h2.textContent = c.title;

    // heading h3
    const h3 = $("#contact .contact-info h3");
    if (h3 && c.heading) h3.textContent = c.heading;

    if (c.phone) setTextById("contactPhone", c.phone);
    if (c.email) setTextById("contactEmail", c.email);

    // Front desk hours: third contact-item is hardcoded "24 Hours Daily"
    if (c.frontDeskHours) {
      const hoursP = $$("#contact .contact-item p").find(p => p.textContent.trim() === "24 Hours Daily");
      if (hoursP) hoursP.textContent = c.frontDeskHours;
    }

    // blurb paragraph (the long paragraph at bottom)
    if (c.blurb) {
      const blurbP = $("#contact .contact-info p[style*='margin-top']");
      if (blurbP) blurbP.textContent = c.blurb;
    }

    setWhatsAppLink(c.whatsappNumber);
  };

  const renderFooter = (data) => {
    if (!data) return;

    // // hotel name in nav + footer
    // if (data.hotelName) {
    //   setTextById("hotelNameNav", data.hotelName);
    //   setTextById("footerHotelName", data.hotelName);
    // }

    // // footer about text (first footer-section paragraph)
    // const footerAboutP = $("footer .footer-section p");
    // if (footerAboutP && data.footer?.aboutText) footerAboutP.textContent = data.footer.aboutText;

    // if (data.footer?.phone) setTextById("footerPhone", `Phone: ${data.footer.phone}`);
    // if (data.footer?.email) setTextById("footerEmail", `Email: ${data.footer.email}`);

    // address lines -> keep <br> formatting (no CSS change)
    const addrEl = document.getElementById("footerAddress");
    if (addrEl && data.address) {
      addrEl.innerHTML = ""; // controlled insert
      const span = document.createElement("span");
      addrEl.appendChild(span);
      addrEl.appendChild(document.createElement("br"));
      span.textContent = data.address;
    }

    // copyright
    // const copyP = $("footer .footer-bottom p");
    // if (copyP && data.footer?.copyright) copyP.textContent = data.footer.copyright;
  };

  // ---------- main fetch ----------
  async function loadContent() {
    try {
      const res = await fetch(ENDPOINT, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data } = await res.json();

      // render sections
      renderHero(data.hero, data.home);
      renderAbout(data.about);
      renderGallery(data.gallery);
      renderFacilities(data.facilities);
      renderServices(data.services);
      renderLocation(data.site);
      renderContact(data.contact);
      renderFooter(data.site);

      // If your carousel logic depends on slides count, re-init it here if needed:
      // if (typeof window.initCarousel === "function") window.initCarousel();

    } catch (err) {
      console.error("[loadContent] failed:", err);
      // Optional: show fallback UI without breaking design
    }
  }

  document.addEventListener("DOMContentLoaded", loadContent);
})();
