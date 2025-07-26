document.addEventListener('DOMContentLoaded', () => {
  const svgNS = "http://www.w3.org/2000/svg";

  function createSunSVG() {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("viewBox", "0 0 24 24");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "5");
    svg.appendChild(circle);

    [[12,1,12,3],[12,21,12,23],[4.22,4.22,5.64,5.64],[18.36,18.36,19.78,19.78],[1,12,3,12],[21,12,23,12],[4.22,19.78,5.64,18.36],[18.36,5.64,19.78,4.22]].forEach(coords => {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", coords[0]);
      line.setAttribute("y1", coords[1]);
      line.setAttribute("x2", coords[2]);
      line.setAttribute("y2", coords[3]);
      svg.appendChild(line);
    });

    return svg;
  }

  function createMoonSVG() {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("viewBox", "0 0 24 24");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M21 12.79A9 9 0 0111.21 3 7 7 0 0012 21a9 9 0 009-8.21z");
    svg.appendChild(path);

    return svg;
  }

  const themeToggle = document.getElementById('theme-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTopButton = document.getElementById('back-to-top');
  const loader = document.getElementById('loader');
  const contactForm = document.getElementById('contact-form');

  function setThemeIcon(btn, iconSvg) {
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    btn.appendChild(iconSvg);
  }

  // Initialize theme and icon
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  setThemeIcon(themeToggle, currentTheme === 'dark' ? createMoonSVG() : createSunSVG());

  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setThemeIcon(themeToggle, createMoonSVG());
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setThemeIcon(themeToggle, createSunSVG());
      localStorage.setItem('theme', 'light');
    }
  });

  window.addEventListener('load', () => {
    if (loader) loader.classList.add('hidden');
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('stats-container')) {
          document.querySelectorAll('.stat-number').forEach(counter => animateCounter(counter));
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.1 });
  animatedElements.forEach(el => observer.observe(el));

  function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      counter.innerText = current;
      if (current >= target) clearInterval(timer);
    }, stepTime);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      const statusDiv = document.getElementById('form-status');
      this.querySelectorAll('.error-message').forEach(el => (el.style.display = 'none'));
      statusDiv.textContent = '';

      const name = this.querySelector('#name');
      if (name.value.trim() === '') {
        showError(name, 'Name is required.');
        isValid = false;
      }

      const email = this.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      const message = this.querySelector('#message');
      if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters long.');
        isValid = false;
      }

      if (isValid) {
        statusDiv.textContent = 'Thank you! Your message has been sent.';
        statusDiv.style.color = 'green';
        this.reset();
      } else {
        statusDiv.textContent = 'Please correct the errors above.';
        statusDiv.style.color = '#e53e3e';
      }
    });

    function showError(input, message) {
      const errorElement = input.nextElementSibling;
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  const rates = { rs1: 11200, ss1: 11340, ms: 11380, coldmix: 12480, wasteplastic: 71000 };
  const productNameMap = {
    rs1: 'RS-1 (Rapid Setting)',
    ss1: 'SS-1 (Slow Setting)',
    ms: 'MS (Medium Setting)',
    coldmix: 'ColdMix',
    wasteplastic: 'Waste Plastic Modified Bitumen'
  };
  const pathToProductKey = { 'rs1.html': 'rs1', 'ss1.html': 'ss1', 'ms.html': 'ms', 'coldmix.html': 'coldmix', 'wasteplastic.html': 'wasteplastic' };
  const path = window.location.pathname.split('/').pop();
  const productKey = pathToProductKey[path];
  const rateInfoElement = document.getElementById('rate-info');

  if (productKey && rateInfoElement) {
  const today = new Date();
  const formatDate = date => 
    date.getDate().toString().padStart(2, '0') + '/' + 
    (date.getMonth() + 1).toString().padStart(2, '0') + '/' + 
    date.getFullYear();
  const formattedDate = formatDate(today);

  if (productKey === 'wasteplastic') {
    rateInfoElement.textContent = `The rate of ${productNameMap[productKey]} as of ${formattedDate} is ₹${rates[productKey]}/MT.`;
  } else 
    rateInfoElement.textContent = `The rate of ${productNameMap[productKey]} as of ${formattedDate} is ₹${rates[productKey]}/Drum.`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });
  }

  // Mobile Products dropdown toggle
  const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
  const mobileDropdownMenu = document.getElementById('mobile-products-submenu');

  if (mobileDropdownToggle && mobileDropdownMenu) {
    mobileDropdownToggle.addEventListener('click', () => {
      const expanded = mobileDropdownToggle.getAttribute('aria-expanded') === 'true';
      mobileDropdownToggle.setAttribute('aria-expanded', String(!expanded));
      mobileDropdownMenu.classList.toggle('open');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Fade in the page on load
  requestAnimationFrame(() => {
    body.classList.add('visible');
  });

  // Animate fade-out on navigation link click in nav
  document.querySelectorAll('nav a').forEach(link => {
    // Only animate for internal links, avoid external or hash links
    if (link.hostname === window.location.hostname && link.pathname !== window.location.pathname) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.href;

        body.classList.remove('visible');
        body.classList.add('fade-out');
        requestAnimationFrame(() => {
          body.classList.add('hidden');
        });

        body.addEventListener('transitionend', () => {
          window.location.href = href;
        }, { once: true });
      });
    }
  });
});
function createPremiumHamburgerIcon() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "40");
  svg.setAttribute("height", "40");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");

  // Gradient definition for line stroke
  const defs = document.createElementNS(svgNS, "defs");
  const linearGrad = document.createElementNS(svgNS, "linearGradient");
  linearGrad.setAttribute("id", "menuGrad");
  linearGrad.setAttribute("x1", "0%");
  linearGrad.setAttribute("y1", "0%");
  linearGrad.setAttribute("x2", "100%");
  linearGrad.setAttribute("y2", "0%");

  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#4fa2e7");
  stop1.setAttribute("stop-opacity", "0.6");
  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#e3b448");
  stop2.setAttribute("stop-opacity", "0.6");

  linearGrad.appendChild(stop1);
  linearGrad.appendChild(stop2);
  defs.appendChild(linearGrad);
  svg.appendChild(defs);

  // Create three premium lines
  [7, 12, 17].forEach((y, i) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", 3);
    line.setAttribute("y1", y);
    line.setAttribute("x2", 21);
    line.setAttribute("y2", y);

    line.setAttribute("stroke", "url(#menuGrad)");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("opacity", "0.9");

    // Animation on hover: expand/thin/thicken/opacity/translate
    line.addEventListener("mouseenter", () => {
      line.setAttribute("stroke-width", "5");
      line.setAttribute("opacity", "1");
      if (i === 1) line.setAttribute("x1", 1); // slightly expand middle line
    });
    line.addEventListener("mouseleave", () => {
      line.setAttribute("stroke-width", "3");
      line.setAttribute("opacity", "0.9");
      if (i === 1) line.setAttribute("x1", 3);
    });
    line.style.transition = "all 0.3s cubic-bezier(.4,0,.2,1)";

    svg.appendChild(line);
  });

  return svg;
}

// Usage after dom loaded:
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger');
  if(hamburgerBtn) {
    hamburgerBtn.innerHTML = '';
    hamburgerBtn.appendChild(createPremiumHamburgerIcon());
  }
});