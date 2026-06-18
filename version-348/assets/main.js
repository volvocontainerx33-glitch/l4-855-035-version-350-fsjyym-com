(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    const show = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };

    const start = function () {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    };

    const stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  const scopes = document.querySelectorAll('[data-filter-scope]');
  scopes.forEach(function (scope) {
    const input = scope.querySelector('[data-card-search]');
    const region = scope.querySelector('[data-filter-region]');
    const type = scope.querySelector('[data-filter-type]');
    const year = scope.querySelector('[data-filter-year]');
    const list = document.querySelector('[data-card-list]');
    const cards = list ? Array.from(list.querySelectorAll('.movie-card')) : [];

    const filter = function () {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const regionValue = region ? region.value : '';
      const typeValue = type ? type.value : '';
      const yearValue = year ? year.value : '';

      cards.forEach(function (card) {
        const text = card.dataset.search || '';
        const okKeyword = !keyword || text.includes(keyword);
        const okRegion = !regionValue || card.dataset.region === regionValue;
        const okType = !typeValue || card.dataset.type === typeValue;
        const okYear = !yearValue || card.dataset.year === yearValue;
        card.style.display = okKeyword && okRegion && okType && okYear ? '' : 'none';
      });
    };

    [input, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filter);
        control.addEventListener('change', filter);
      }
    });
  });
})();
