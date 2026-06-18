document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var heroSearch = document.querySelector("[data-hero-search]");

  if (heroSearch) {
    heroSearch.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = heroSearch.querySelector("input");
      var query = input ? input.value.trim() : "";
      var target = query ? "./movies.html?q=" + encodeURIComponent(query) : "./movies.html";
      window.location.href = target;
    });
  }

  var urlParams = new URLSearchParams(window.location.search);
  var queryFromUrl = urlParams.get("q") || "";

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-filter-input]");
    var category = scope.querySelector("[data-filter-category]");
    var year = scope.querySelector("[data-filter-year]");
    var clear = scope.querySelector("[data-filter-clear]");
    var empty = scope.querySelector("[data-empty-state]");

    if (input && queryFromUrl) {
      input.value = queryFromUrl;
    }

    function applyFilter() {
      var text = input ? input.value.trim().toLowerCase() : "";
      var selectedCategory = category ? category.value : "";
      var selectedYear = year ? year.value : "";
      var visible = 0;

      scope.querySelectorAll("[data-card]").forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();
        var matchesText = !text || haystack.indexOf(text) !== -1;
        var matchesCategory = !selectedCategory || card.getAttribute("data-category") === selectedCategory;
        var matchesYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
        var show = matchesText && matchesCategory && matchesYear;

        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, category, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    if (clear) {
      clear.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (category) {
          category.value = "";
        }
        if (year) {
          year.value = "";
        }
        applyFilter();
      });
    }

    applyFilter();
  });
});
