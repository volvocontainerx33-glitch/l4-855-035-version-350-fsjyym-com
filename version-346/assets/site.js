(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    restart();
  }

  function initFilters() {
    var input = document.querySelector('[data-search-input]');
    var year = document.querySelector('[data-year-filter]');
    var list = document.querySelector('[data-filter-list]');
    var empty = document.querySelector('[data-empty-state]');
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function apply() {
      var query = normalize(input ? input.value : '');
      var selectedYear = normalize(year ? year.value : '');
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year')
        ].join(' '));
        var yearValue = normalize(card.getAttribute('data-year'));
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchYear = !selectedYear || yearValue === selectedYear;
        var show = matchQuery && matchYear;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', apply);
    }
    if (year) {
      year.addEventListener('change', apply);
    }
    apply();
  }

  function initPlayer() {
    var holder = document.querySelector('[data-player]');
    var streamNode = document.getElementById('player-stream');
    if (!holder || !streamNode) {
      return;
    }
    var video = holder.querySelector('video');
    var button = holder.querySelector('[data-play-button]');
    var stream = '';
    var hlsInstance = null;
    var assigned = false;

    try {
      stream = JSON.parse(streamNode.textContent || '{}').stream || '';
    } catch (error) {
      stream = '';
    }

    function assign() {
      if (!video || !stream || assigned) {
        return;
      }
      assigned = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return;
      }
      video.src = stream;
    }

    function play() {
      assign();
      if (button) {
        button.classList.add('is-hidden');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (hlsInstance && typeof hlsInstance.stopLoad === 'function') {
          hlsInstance.stopLoad();
        }
      });
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
