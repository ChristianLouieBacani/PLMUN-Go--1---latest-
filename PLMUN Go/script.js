document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // NAVBAR GLASS EFFECT (all pages)
  // ==========================================
  const topNav = document.querySelector('.top-nav');
  if (topNav) {
    const handleScroll = () => {
      topNav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // ==========================================
  // MOBILE NAV TOGGLE (all pages)
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ==========================================
  // OFFICE DIRECTORY (accordion + search)
  // ==========================================
  const buildingCards = document.querySelectorAll('.building-card');
  const dirSearch = document.getElementById('directory-search');
  const dirClear = document.getElementById('directory-clear');
  const dirEmpty = document.getElementById('directory-empty');

  if (buildingCards.length > 0) {

    const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

    // Text that belongs to an element itself (not its children)
    const ownText = (el) =>
      Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join(' ');

    const setCardOpen = (card, open) => {
      card.classList.toggle('active', open);
      const header = card.querySelector('.building-header');
      if (header) header.setAttribute('aria-expanded', String(open));
    };

    // ---- Setup: counts, closed floors, click handlers ----
    buildingCards.forEach((card) => {
      const header = card.querySelector('.building-header');
      if (!header) return;

      // Count places (only items with no nested list)
      let count = 0;
      card.querySelectorAll('.building-content li').forEach((li) => {
        if (!li.querySelector('li')) count++;
      });

      const badge = document.createElement('span');
      badge.className = 'building-count';
      badge.textContent = count + ' places';
      header.insertBefore(badge, header.querySelector('.building-icon'));

      header.setAttribute('aria-expanded', 'false');
      card.querySelectorAll('.building-content details').forEach((d) => {
        d.open = false;
      });

      header.addEventListener('click', () => {
        const isOpen = card.classList.contains('active');
        const searching = dirSearch && norm(dirSearch.value) !== '';

        if (searching) {
          // While searching, each card toggles on its own
          setCardOpen(card, !isOpen);
          return;
        }

        buildingCards.forEach((c) => setCardOpen(c, false));

        if (!isOpen) {
          setCardOpen(card, true);
          const firstFloor = card.querySelector('.building-content details');
          if (firstFloor) firstFloor.open = true;
        }
      });
    });

    // ---- Search ----
    const filterItem = (li, q, parentMatched) => {
      const nested = li.querySelector(':scope > ul');
      const selfMatch = norm(ownText(li)).includes(q);

      if (!nested) {
        const show = selfMatch || parentMatched;
        li.classList.toggle('dir-hidden', !show);
        return show;
      }

      let any = false;
      nested.querySelectorAll(':scope > li').forEach((child) => {
        if (filterItem(child, q, parentMatched || selfMatch)) any = true;
      });

      const show = selfMatch || any;
      li.classList.toggle('dir-hidden', !show);
      return show;
    };

    const resetDirectory = () => {
      document.querySelectorAll('.dir-hidden').forEach((el) => {
        el.classList.remove('dir-hidden');
      });
      buildingCards.forEach((card) => {
        setCardOpen(card, false);
        card.querySelectorAll('.building-content details').forEach((d) => {
          d.open = false;
        });
      });
      if (dirEmpty) dirEmpty.hidden = true;
    };

    const runDirectorySearch = () => {
      const q = norm(dirSearch.value);

      if (dirClear) dirClear.hidden = q === '';

      if (q === '') {
        resetDirectory();
        return;
      }

      let matchedBuildings = 0;

      buildingCards.forEach((card) => {
        const header = card.querySelector('.building-header');
        const buildingMatched = header ? norm(ownText(header)).includes(q) : false;
        let cardHasMatch = false;

        card.querySelectorAll('.building-content details').forEach((floor) => {
          const summary = floor.querySelector('summary');
          const floorMatched =
            buildingMatched || (summary ? norm(summary.textContent).includes(q) : false);

          let any = false;
          floor.querySelectorAll(':scope > ul > li').forEach((li) => {
            if (filterItem(li, q, floorMatched)) any = true;
          });

          floor.classList.toggle('dir-hidden', !any);
          if (any) {
            floor.open = true;
            cardHasMatch = true;
          }
        });

        card.classList.toggle('dir-hidden', !cardHasMatch);
        setCardOpen(card, cardHasMatch);
        if (cardHasMatch) matchedBuildings++;
      });

      if (dirEmpty) dirEmpty.hidden = matchedBuildings > 0;
    };

    if (dirSearch) {
      dirSearch.addEventListener('input', runDirectorySearch);
      dirSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dirSearch.value = '';
          runDirectorySearch();
        }
      });
    }

    if (dirClear) {
      dirClear.addEventListener('click', () => {
        dirSearch.value = '';
        runDirectorySearch();
        dirSearch.focus();
      });
    }
  }

  // ==========================================
  // CONTACT FORM
  // ==========================================
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const response = await fetch('https://formspree.io/f/mwpygpbd', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      formStatus.style.display = 'block';
      if (response.ok) {
        form.reset();
      } else {
        formStatus.style.color = 'red';
        formStatus.textContent = 'Oops! Something went wrong. Try again.';
      }
    });
  }

});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('singleSlider');
  if (!container) return;

  const slides = container.querySelectorAll('.single-slide');
  const dots = container.querySelectorAll('.dot');
  const totalRealDots = dots.length; // 5 dots
  let currentIndex = 0;
  let slideInterval;

  function nextSlide() {
    // Remove all classes first
    slides.forEach((slide) => {
      slide.classList.remove('active', 'prev');
    });

    // Mark current as previous (sliding out left)
    const prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % slides.length;

    slides[prevIndex].classList.add('prev');
    slides[currentIndex].classList.add('active');

    // Update dots (using modulo so duplicate slide maps back to dot 0 cleanly)
    const activeDotIndex = currentIndex % totalRealDots;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });
  }

  // Auto-slide every 2 seconds (adjust here if you want it faster/slower)
  function startSlider() {
    slideInterval = setInterval(nextSlide, 2000);
  }

  // Pause on hover, resume on leave
  container.addEventListener('mouseenter', () => clearInterval(slideInterval));
  container.addEventListener('mouseleave', () => startSlider());

  // Initialize
  startSlider();
});