(function () {
  window.initMoviePlayer = function (streamUrl, playerId) {
    var root = document.getElementById(playerId);

    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var layer = root.querySelector("[data-play-layer]");
    var buttons = root.querySelectorAll("[data-player-button]");
    var hlsInstance = null;

    if (!video) {
      return;
    }

    function attachStream() {
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else {
        video.src = streamUrl;
      }
    }

    function startPlayback() {
      if (layer) {
        layer.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        startPlayback();
      });
    });

    video.addEventListener("play", function () {
      if (layer) {
        layer.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", function () {
      if (layer && video.currentTime === 0) {
        layer.classList.remove("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });

    attachStream();
  };
})();
