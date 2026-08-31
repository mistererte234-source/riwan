/**
 * RIWAN ARCHITECTURE & CONSTRUCTION (CV RIWAN SEJAHTERA ABADI)
 * Interactive Application Core Script
 * Crafted with Precision by Lody
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initEstimator();
  initPortfolio();
  initScrollEffects();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('rsa-theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('rsa-theme', isDark ? 'dark' : 'light');
      updateThemeIcons();
    });
  });

  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const sunIcons = document.querySelectorAll('.theme-icon-sun');
  const moonIcons = document.querySelectorAll('.theme-icon-moon');

  sunIcons.forEach(icon => {
    icon.style.display = isDark ? 'inline-block' : 'none';
  });
  moonIcons.forEach(icon => {
    icon.style.display = isDark ? 'none' : 'inline-block';
  });
}

/* ==========================================================================
   2. Navigation & Glass Drawer
   ========================================================================== */
function initNavigation() {
  const navDrawer = document.getElementById('nav-drawer');
  const openMenuBtn = document.getElementById('open-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const topBar = document.getElementById('top-bar');

  function openDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.remove('translate-x-full');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.add('translate-x-full');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openMenuBtn) openMenuBtn.addEventListener('click', openDrawer);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer && !navDrawer.classList.contains('translate-x-full')) {
      closeDrawer();
    }
  });

  window.addEventListener('scroll', () => {
    if (!topBar) return;
    if (window.scrollY > 30) {
      topBar.classList.add('shadow-md', 'backdrop-blur-xl', 'bg-surface/95', 'dark:bg-surface-dim/95');
      topBar.classList.remove('bg-surface/80', 'dark:bg-surface-dim/80');
    } else {
      topBar.classList.remove('shadow-md');
      topBar.classList.add('bg-surface/80', 'dark:bg-surface-dim/80');
    }
  });
}

/* ==========================================================================
   3. Interactive Architectural Estimator (RAB Calculator)
   ========================================================================== */
function initEstimator() {
  const form = document.getElementById('estimator-form');
  if (!form) return;

  const areaSlider = document.getElementById('area-slider');
  const areaDisplay = document.getElementById('area-display');
  const estimateResult = document.getElementById('estimate-result');
  const breakdownStruktur = document.getElementById('breakdown-struktur');
  const breakdownFinishing = document.getElementById('breakdown-finishing');
  const breakdownMep = document.getElementById('breakdown-mep');
  const waConsultBtn = document.getElementById('wa-consult-btn');

  // Rates in IDR / m2
  const rates = {
    new: {
      basic: 3800000,
      standard: 5500000,
      premium: 8000000,
      luxury: 12000000
    },
    reno: {
      basic: 2300000,
      standard: 3300000,
      premium: 4800000,
      luxury: 7200000
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  function updateEstimate() {
    let area = 250;
    if (areaSlider && areaSlider.value) {
      area = parseInt(areaSlider.value, 10);
      if (isNaN(area) || area < 50) area = 250;
    }

    const projTypeInput = document.querySelector('input[name="proj_type"]:checked');
    const finishLevelInput = document.querySelector('input[name="finish_level"]:checked');
    const floorsInput = document.querySelector('input[name="floors"]:checked');

    const projType = (projTypeInput && projTypeInput.value) ? projTypeInput.value : 'new';
    const finishLevel = (finishLevelInput && finishLevelInput.value) ? finishLevelInput.value : 'premium';
    const floors = (floorsInput && floorsInput.value) ? parseInt(floorsInput.value, 10) : 2;

    if (areaDisplay) {
      areaDisplay.textContent = `${area} m²`;
    }

    const typeRates = rates[projType] || rates.new;
    const baseRate = typeRates[finishLevel] || typeRates.premium || 8000000;
    const structuralMultiplier = 1 + (Math.max(0, floors - 1) * 0.10);
    const exactEstimate = area * baseRate * structuralMultiplier;

    const lowerBound = exactEstimate * 0.92;
    const upperBound = exactEstimate * 1.15;

    const costStruktur = exactEstimate * 0.38;
    const costFinishing = exactEstimate * 0.42;
    const costMep = exactEstimate * 0.20;

    if (estimateResult) {
      estimateResult.textContent = `${formatRupiah(lowerBound)} - ${formatRupiah(upperBound)}`;
      estimateResult.style.opacity = '1';
    }

    if (breakdownStruktur) {
      breakdownStruktur.textContent = formatRupiah(costStruktur);
    }
    if (breakdownFinishing) {
      breakdownFinishing.textContent = formatRupiah(costFinishing);
    }
    if (breakdownMep) {
      breakdownMep.textContent = formatRupiah(costMep);
    }

    if (waConsultBtn) {
      const typeLabel = projType === 'new' ? 'Bangun Baru (Design & Build)' : 'Renovasi Total';
      const finishLabels = {
        basic: 'Ekonomis (Smart Budget & Fungsional)',
        standard: 'Standard (Editorial Clean)',
        premium: 'Premium (Architectural Grade)',
        luxury: 'Luxury (Bespoke High-End)'
      };
      const finishLabel = finishLabels[finishLevel] || 'Premium (Architectural Grade)';
      const messageText = `Halo Tim CV Riwan Sejahtera Abadi (RSA),

Saya ingin konsultasi proyek konstruksi berdasarkan simulasi estimasi kalkulator website:
• Luas Bangunan: ${area} m²
• Tipe Proyek: ${typeLabel}
• Standar Finishing: ${finishLabel}
• Jumlah Lantai: ${floors} Lantai
• Estimasi Range Budget: ${formatRupiah(lowerBound)} s/d ${formatRupiah(upperBound)}

Mohon informasi jadwal temu konsultasi desain arsitektur & survei lokasi. Terima kasih!`;
      
      const phone = '6281288880199';
      waConsultBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
    }
  }

  if (areaSlider) {
    areaSlider.addEventListener('input', updateEstimate);
    areaSlider.addEventListener('change', updateEstimate);
  }

  if (form) {
    form.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', updateEstimate);
      input.addEventListener('click', updateEstimate);
    });
  }

  updateEstimate();
}

/* ==========================================================================
   4. Portfolio Projects Data & Lightbox Modal
   ========================================================================== */
const projectsData = [
  {
    id: 1,
    title: 'Villa Orama',
    category: 'villa',
    categoryName: 'Residential Villa',
    location: 'Uluwatu, Bali',
    year: '2023',
    area: '480 m²',
    floors: '2 Lantai',
    scope: 'Architectural Design & Turnkey Construction',
    materials: 'Exposed Concrete, Balinese Lava Stone, Teak Wood, Low-E Glass',
    description: 'Vila modern tropis dengan konsep kantilever masif di tebing Uluwatu. Mengutamakan bukaan panoramik menghadap Samudera Hindia dengan perpaduan beton ekspos presisi dan kayu jati solid tahan cuaca ekstrem pesisir.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecw6GJZg1KL3b6xjMfSphb5CZBhr2wIl9T4pTTEoJjAX7hn2NJPG8gFr4O6cBc26Xx4YOrqDpHvarFePgxgGdecf0uHVsInzfNFDVqH3t3Kvyao7WiuZgPd86a-NFWkPmp5x1oh3p5SX0eBf1qcaydqqHf2YsSxy30857n0h7JfgkNXHMiQJnWkiddtSFfarjL0lohKVywK9_GrjyZeKcW9Tot1uT6eBnum6C-HNWSB5eEaUpfWh43A'
  },
  {
    id: 2,
    title: 'The Monolith Gallery',
    category: 'commercial',
    categoryName: 'Art Space & Commercial',
    location: 'Senopati, Jakarta',
    year: '2024',
    area: '650 m²',
    floors: '3 Lantai',
    scope: 'Structural Overhaul, Facade & Interior Fit-Out',
    materials: 'Brutalist Cast Concrete, Matte Black Steel, Microcement Flooring',
    description: 'Galeri seni kontemporer dan creative hub di pusat distrik premium Jakarta. Desain arsitektur menonjolkan monolitik geometri tajam tanpa ornamen berlebih, memaksimalkan pencahayaan natural diffused pada atrium utama.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCACVkL5OUISCQ9E7shqs9xEpxWsOw8NHl11xGZ3aszoKKcHeCElpNStzQX0hT838ZGSo6KsOdeCaqdRts0somBgkBsA-IirFVL02zIvn8_Abz5JWmNNr5b1bbc7sKhXHJ5QRFCt7sOT4SYpWVSwTI82u19EvZZAONsJ5buWN2sp8D4q6CiejWBg7sruJdDmkkYSKBpD41iS-5F-L9Sc7TZ2roxVS9InyIdyCcOzEF44-ePDOqcqXnE1g'
  },
  {
    id: 3,
    title: 'Menteng Minimalist Residence',
    category: 'residential',
    categoryName: 'Luxury Residence',
    location: 'Menteng, Jakarta Pusat',
    year: '2023',
    area: '520 m²',
    floors: '3 Lantai + Basement',
    scope: 'Comprehensive Architecture & Construction Execution',
    materials: 'Travertine Stone, Structural Steel Frame, Double Glazed Curtain Wall',
    description: 'Hunian privat dengan privasi tingkat tinggi di kawasan prestisius Menteng. Menggunakan inner courtyard dengan tata ruang cross-ventilation dan sistem drainase basement berteknologi kedap air tercanggih.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn-UYfYiqMmL0a__sMwZsZgLm13gnUkfkUBKqvOe1KUONj9yRjzBHQ7J-0TP6Ugrz5Ph9alRr0RAuquIdQ061GVuTSUZFMWaUzf-vSkQpLLt_iGBtHhK7sXeDgirl6gMJlTKrG39kb7Tvmri5M_RkZkMucI-cJDqO4Bm6VOPxIVj-JzEP9mWcWcndocTJEIkr3YN_rQ_a2TdgQ-hqv469zIM23CSxEToRkKj7hGYfdgUfdD1iAEpff_w'
  },
  {
    id: 4,
    title: 'Canggu Tropical Sanctuary',
    category: 'villa',
    categoryName: 'Boutique Villa Resort',
    location: 'Canggu, Bali',
    year: '2022',
    area: '720 m²',
    floors: '2 Lantai',
    scope: 'Masterplan, Architectural DED & Turnkey Build',
    materials: 'Batu Sukabumi, Bengkirai Hardwood, Terrazzo, Textured Plaster',
    description: 'Kompleks vila butik berkonsep biophilic sanctuary. Menyatukan material alami lokal dengan struktur beton kedap air berstandar industri tinggi untuk daya tahan jangka panjang di iklim tropis lembap.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv1TvHKd3DqH13wIjhagz1SV7_06m06oVxKYPh3Vx33AhDSaCBd3YUlQwfKSlqYyyU8w_-gl58FrJfHK523XiCDU7QnjKXFBoTxTEkghy5uX7wvWeoMV5MHt2qD6gESqsYRF2hDAKO1mioiIJ1-ITf9BYHTCspfpNsVXYqb2_BhisQNc2fxRQFYRBgIBxmyNXplMIECy4oiQ3fpXpASn7atP4Z8mOGsFV8UzyAt7YF8L_jvt3vnEfi7w'
  },
  {
    id: 5,
    title: 'The Brutalist Atelier',
    category: 'commercial',
    categoryName: 'Studio & Headquarters',
    location: 'PIK, Jakarta Utara',
    year: '2024',
    area: '430 m²',
    floors: '3 Lantai',
    scope: 'Structural Reinforcement & Bespoke Interior Fit-Out',
    materials: 'Architectural Board-Formed Concrete, Anodized Aluminum, Smoked Glass',
    description: 'Studio arsitektur dan kantor kreatif dengan tampilan fasad monolitik raw concrete. Ruang interior didesain terbuka bebas kolom dengan bentang balok pratekan untuk fleksibilitas kerja maksimal.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcgC8nxAcDkYX-tAMdRbvfrAl58m2jZCW2NIm0CTggo0ECzoS0O6KRJQLx4RU9mBz4VJmQfRaaXMCiPeT4SpJSE0DEZrQ0hgiH6dhiS7wOJf-Y4SqKrj8_xfLiU6LI0YCzFSjSPjj4wGcfz85tGq9Uykfd7f5D7-Qm9nElcOxb1R1hxvhBwsUvnvI9FxHxGydZB8VP0OMLcPMgueHnq1PDuUKX1t5KKv1L93_qa2wEcSi2hmyeUFcF5w'
  },
  {
    id: 6,
    title: 'Zenith Penthouse Lounge',
    category: 'interior',
    categoryName: 'Luxury Interior',
    location: 'SCBD, Jakarta Selatan',
    year: '2023',
    area: '340 m²',
    floors: '1 Lantai',
    scope: 'Full Interior Architecture & Custom Millwork',
    materials: 'Nero Marquina Marble, Fluted Walnut Wood, Brushed Brass, Acoustic Paneling',
    description: 'Interior penthouse mewah berstandar hospitality bintang lima. Dilengkapi panel akustik tersembunyi, smart lighting automation terintegrasi, dan pengerjaan cabinetry custom millwork dengan toleransi presisi milimeter.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUTOMi6QgedKe493qEysNJhPp3yzL0yliUiRbdf_23a7MvripUgCEnAFB0NjY79bggIVWKiO4K5CdG1ocWCCBB_20cLcFuraaknDhb7xoWGHYnsnrIpzQSXKU0dKco0upFIjtKK80AeZPNmuTNB-bavEyuqsrwPrVxK0Bqy1eGS_bajjW35tkwk1iDor583UXoyE3Hzr4X6z3OidE7m-zv2Q-1bHAuHBFaCfLXwG1nZwzcE5Fx58Bwkw'
  }
];

function initPortfolio() {
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-item-card');
  const modal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-project-modal');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'font-bold', 'dark:bg-brand-amber', 'dark:text-black');
        b.classList.add('bg-transparent', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary', 'font-bold', 'dark:bg-brand-amber', 'dark:text-black');
      btn.classList.remove('bg-transparent', 'text-on-surface-variant');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'), 10);
      const project = projectsData.find(p => p.id === id);
      if (project) {
        openProjectModal(project);
      }
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeProjectModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const imgEl = document.getElementById('modal-img');
  const titleEl = document.getElementById('modal-title');
  const categoryEl = document.getElementById('modal-category');
  const locationEl = document.getElementById('modal-location');
  const yearEl = document.getElementById('modal-year');
  const areaEl = document.getElementById('modal-area');
  const floorsEl = document.getElementById('modal-floors');
  const scopeEl = document.getElementById('modal-scope');
  const materialsEl = document.getElementById('modal-materials');
  const descEl = document.getElementById('modal-description');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  if (imgEl) imgEl.src = project.image;
  if (titleEl) titleEl.textContent = project.title;
  if (categoryEl) categoryEl.textContent = project.categoryName;
  if (locationEl) locationEl.textContent = project.location;
  if (yearEl) yearEl.textContent = project.year;
  if (areaEl) areaEl.textContent = project.area;
  if (floorsEl) floorsEl.textContent = project.floors;
  if (scopeEl) scopeEl.textContent = project.scope;
  if (materialsEl) materialsEl.textContent = project.materials;
  if (descEl) descEl.textContent = project.description;

  if (modalWaBtn) {
    const waText = `Halo Tim RSA, saya sangat tertarik dengan portofolio *${project.title}* (${project.location}). Mohon info konsultasi arsitektur & estimasi bangun untuk proyek serupa.`;
    modalWaBtn.href = `https://wa.me/6281288880199?text=${encodeURIComponent(waText)}`;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

/* ==========================================================================
   5. Scroll Effects & Intersection Observer
   ========================================================================== */
function initScrollEffects() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}