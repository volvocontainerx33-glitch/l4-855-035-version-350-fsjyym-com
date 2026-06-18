(function () {
  var video = document.querySelector("[data-player]");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-play-trigger]"));
  var overlay = document.querySelector(".player-cover[data-play-trigger]");
  if (!video) {
    return;
  }

  var source = video.getAttribute("data-source") || "";
  var hlsInstance = null;

  var hideOverlay = function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  };

  var showOverlay = function () {
    if (overlay) {
      overlay.classList.remove("is-hidden");
    }
  };

  var loadSource = function () {
    if (!source || video.getAttribute("data-loaded") === "true") {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.setAttribute("data-loaded", "true");
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      video.setAttribute("data-loaded", "true");
    }
  };

  var playVideo = function () {
    loadSource();
    var playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(hideOverlay).catch(function () {});
    } else {
      hideOverlay();
    }
  };

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", playVideo);
  });

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener("play", hideOverlay);

  video.addEventListener("pause", function () {
    if (video.currentTime === 0) {
      showOverlay();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
