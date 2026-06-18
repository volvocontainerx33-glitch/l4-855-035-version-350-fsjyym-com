(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        play();
      });
    });

    show(0);
    play();
  }

  function initSearch() {
    var input = document.querySelector("[data-search-input]");
    var select = document.querySelector("[data-filter-select]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    var empty = document.querySelector("[data-no-results]");
    if (!cards.length || (!input && !select)) {
      return;
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var filter = select ? select.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var searchText = (card.getAttribute("data-search") || "").toLowerCase();
        var region = card.getAttribute("data-region") || "";
        var kind = card.getAttribute("data-kind") || "";
        var keywordMatch = !keyword || searchText.indexOf(keyword) !== -1;
        var filterMatch = !filter || region.indexOf(filter) !== -1 || kind.indexOf(filter) !== -1 || searchText.indexOf(filter) !== -1;
        var match = keywordMatch && filterMatch;
        card.style.display = match ? "" : "none";
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (select) {
      select.addEventListener("change", apply);
    }
    apply();
  }

  function initPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll("[data-video-shell]"));
    shells.forEach(function (shell) {
      var video = shell.querySelector("video");
      var trigger = shell.querySelector("[data-play-trigger]");
      var stream = shell.getAttribute("data-stream") || "";
      var attached = false;

      function attach() {
        if (!video || attached || !stream) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          shell.hlsPlayer = hls;
        } else {
          video.src = stream;
        }
        attached = true;
      }

      function start() {
        attach();
        shell.classList.add("is-playing");
        if (video) {
          var promise = video.play();
          if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
          }
        }
      }

      if (trigger) {
        trigger.addEventListener("click", start);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            start();
          }
        });
        video.addEventListener("play", function () {
          shell.classList.add("is-playing");
        });
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initPlayers();
  });
})();
