(function () {
  function qs(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = qs('[data-hero-slide]', slider);
    var dots = qs('[data-hero-dot]', slider);
    var index = 0;
    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function applyMovieSearch(input, forcedValue) {
    var value = (forcedValue || input.value || '').trim().toLowerCase();
    var cards = qs('[data-movie-card]');
    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-tags') || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      var visible = !value || value === '全部' || haystack.indexOf(value) !== -1;
      card.classList.toggle('is-filtered-out', !visible);
    });
  }

  qs('[data-search-cards]').forEach(function (input) {
    input.addEventListener('input', function () {
      applyMovieSearch(input);
    });
  });

  qs('[data-filter-button]').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter-button') || '';
      var input = document.querySelector('[data-search-cards]');
      if (input) input.value = value === '全部' ? '' : value;
      applyMovieSearch(input || { value: '' }, value);
    });
  });

  qs('[data-search-categories]').forEach(function (input) {
    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      qs('[data-category-card]').forEach(function (card) {
        var haystack = (card.getAttribute('data-title') || card.textContent || '').toLowerCase();
        card.classList.toggle('is-filtered-out', value && haystack.indexOf(value) === -1);
      });
    });
  });
})();
