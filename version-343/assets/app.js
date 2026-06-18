(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", panel.classList.contains("is-open") ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        activate(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        activate(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        activate(current + 1);
        restart();
      });
    }

    activate(0);
    restart();
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var empty = document.querySelector("[data-empty]");
    var activeFilter = "all";

    if (!cards.length) {
      return;
    }

    function getQuery() {
      var field = inputs.find(function (input) {
        return input.value.trim().length > 0;
      });
      return field ? field.value.trim().toLowerCase() : "";
    }

    function applyFilters() {
      var query = getQuery();
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-year"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-region")
        ].join(" ").toLowerCase();
        var filterText = card.getAttribute("data-tags") || "";
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchFilter = activeFilter === "all" || filterText.indexOf(activeFilter) !== -1 || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
        var show = matchQuery && matchFilter;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", applyFilters);
      var form = input.closest("form");
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          applyFilters();
        });
      }
    });

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeFilter = chip.getAttribute("data-filter") || "all";
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });
        applyFilters();
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
