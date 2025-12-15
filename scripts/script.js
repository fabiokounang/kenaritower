const defaultConfig = {
  hotel_name: "Kenari Tower Hotel",
  hero_headline: "Welcome to Kenari Tower Hotel",
  hero_tagline: "Your Home Away From Home in Makassar",
  about_title: "About Us",
  about_description: "Kenari Tower Hotel is a premier destination for travelers seeking comfort, elegance, and exceptional hospitality in the heart of Makassar. Located in the vibrant center of the city, we offer modern facilities combined with warm Indonesian service.",
  contact_phone: "+62 411 123 4567",
  contact_email: "info@kenaritower.com",
  hotel_address: "Jl. Sultan Hasanuddin No. 10, Makassar, South Sulawesi 90111, Indonesia"
};

async function onConfigChange(config) {
  const hotelName = config.hotel_name || defaultConfig.hotel_name;
  const heroHeadline = config.hero_headline || defaultConfig.hero_headline;
  const heroTagline = config.hero_tagline || defaultConfig.hero_tagline;
  const aboutTitle = config.about_title || defaultConfig.about_title;
  const aboutDescription = config.about_description || defaultConfig.about_description;
  const contactPhone = config.contact_phone || defaultConfig.contact_phone;
  const contactEmail = config.contact_email || defaultConfig.contact_email;
  const hotelAddress = config.hotel_address || defaultConfig.hotel_address;

  document.getElementById('hotelNameNav').textContent = hotelName;
  document.getElementById('heroHeadline').textContent = heroHeadline;
  document.getElementById('heroTagline').textContent = heroTagline;
  document.getElementById('aboutTitle').textContent = aboutTitle;
  document.getElementById('aboutDescription').textContent = aboutDescription;
  document.getElementById('contactPhone').textContent = contactPhone;
  document.getElementById('contactEmail').textContent = contactEmail;
  document.getElementById('hotelAddress').textContent = hotelAddress;
  document.getElementById('footerHotelName').textContent = hotelName;
  document.getElementById('footerPhone').textContent = `Phone: ${contactPhone}`;
  document.getElementById('footerEmail').textContent = `Email: ${contactEmail}`;

  const addressLines = hotelAddress.split(',');
  document.getElementById('footerAddress').innerHTML = addressLines.slice(0, 2).join(',') + '<br>' + addressLines
    .slice(2).join(',');
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig: defaultConfig,
    onConfigChange: onConfigChange,
    mapToCapabilities: (config) => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) => new Map([
      ["hotel_name", config.hotel_name || defaultConfig.hotel_name],
      ["hero_headline", config.hero_headline || defaultConfig.hero_headline],
      ["hero_tagline", config.hero_tagline || defaultConfig.hero_tagline],
      ["about_title", config.about_title || defaultConfig.about_title],
      ["about_description", config.about_description || defaultConfig.about_description],
      ["contact_phone", config.contact_phone || defaultConfig.contact_phone],
      ["contact_email", config.contact_email || defaultConfig.contact_email],
      ["hotel_address", config.hotel_address || defaultConfig.hotel_address]
    ])
  });
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const dotsContainer = document.getElementById('carouselDots');
let autoSlideInterval;

// Create dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === index) {
      dot.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
  resetAutoSlide();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 5000);
}

// Navigation buttons
document.getElementById('prevBtn').addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

// Auto slide
autoSlideInterval = setInterval(nextSlide, 5000);

// Scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe about section
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
  observer.observe(aboutContent);
}

// Observe service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
  observer.observe(card);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Create success message
  const successMsg = document.createElement('div');
  successMsg.style.cssText =
    'background: #4CAF50; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;';
  successMsg.textContent = 'Thank you for your message! We will get back to you soon.';

  contactForm.appendChild(successMsg);
  contactForm.reset();

  setTimeout(() => {
    successMsg.remove();
  }, 5000);
});

// Scroll functions (nav)
function scrollToHome() {
  document.getElementById('home').scrollIntoView({
    behavior: 'smooth'
  });
}

function scrollToAbout() {
  document.getElementById('about').scrollIntoView({
    behavior: 'smooth'
  });
}

function scrollToGallery() {
  document.getElementById('gallery').scrollIntoView({
    behavior: 'smooth'
  });
}

function scrollToFacilities() {
  document.getElementById('facilities').scrollIntoView({
    behavior: 'smooth'
  });
}

function scrollToServices() {
  document.getElementById('services').scrollIntoView({
    behavior: 'smooth'
  });
}

function scrollToLocation() {
  document.getElementById('location').scrollIntoView({
    behavior: 'smooth'
  });
}

function scrollToContact() {
  document.getElementById('contact').scrollIntoView({
    behavior: 'smooth'
  });
}

(function () {
      function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
          var d = b.createElement('script');
          d.innerHTML =
            "window.__CF$cv$params={r:'9adcbed8545fa081',t:'MTc2NTcwNTI4Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
          b.getElementsByTagName('head')[0].appendChild(d)
        }
      }
      if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
          var e = document.onreadystatechange || function () {};
          document.onreadystatechange = function (b) {
            e(b);
            'loading' !== document.readyState && (document.onreadystatechange = e, c())
          }
        }
      }
    })();