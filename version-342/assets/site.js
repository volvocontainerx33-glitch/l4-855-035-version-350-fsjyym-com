(function () {
  var root = document.body.getAttribute("data-root") || "./";
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("is-open");
    });
  }

  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var active = 0;
    var showSlide = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  var resolvePath = function (path) {
    return root + String(path || "").replace(/^\.\//, "");
  };

  var catalog = window.searchCatalog || [];
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-site-search]"));
  searchInputs.forEach(function (input) {
    var panel = input.parentElement.querySelector("[data-search-results]");
    var currentResults = [];

    var render = function (items) {
      currentResults = items;
      if (!panel) {
        return;
      }
      if (!items.length) {
        panel.classList.remove("is-open");
        panel.innerHTML = "";
        return;
      }
      panel.innerHTML = items.map(function (item) {
        return '<a class="search-result-item" href="' + resolvePath(item.path) + '">' +
          '<img src="' + resolvePath(item.image) + '" alt="' + item.title.replace(/"/g, "&quot;") + '">' +
          '<span><strong>' + item.title + '</strong><span>' + item.meta + '</span></span>' +
          '</a>';
      }).join("");
      panel.classList.add("is-open");
    };

    input.addEventListener("input", function () {
      var keyword = input.value.trim().toLowerCase();
      if (!keyword) {
        render([]);
        return;
      }
      var items = catalog.filter(function (item) {
        return item.words.toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 9);
      render(items);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && currentResults[0]) {
        window.location.href = resolvePath(currentResults[0].path);
      }
    });

    document.addEventListener("click", function (event) {
      if (!input.parentElement.contains(event.target) && panel) {
        panel.classList.remove("is-open");
      }
    });
  });
})();
