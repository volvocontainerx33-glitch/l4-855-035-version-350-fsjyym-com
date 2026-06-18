(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById('movieVideo');
    var button = document.getElementById('moviePlayButton');
    if (!video || !button || !source) return;

    var ready = false;
    var hlsInstance = null;

    function loadScript(callback) {
      if (window.Hls) {
        callback();
        return;
      }
      var current = document.querySelector('script[data-hls-loader]');
      if (current) {
        current.addEventListener('load', callback);
        current.addEventListener('error', callback);
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
      script.async = true;
      script.setAttribute('data-hls-loader', '1');
      script.addEventListener('load', callback);
      script.addEventListener('error', callback);
      document.head.appendChild(script);
    }

    function attach(callback) {
      if (ready) {
        callback();
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        callback();
        return;
      }
      loadScript(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, callback);
          window.setTimeout(callback, 900);
        } else {
          video.src = source;
          callback();
        }
      });
    }

    function play() {
      button.classList.add('is-hidden');
      attach(function () {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            button.classList.remove('is-hidden');
          });
        }
      });
    }

    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) play();
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) button.classList.remove('is-hidden');
    });
    video.addEventListener('ended', function () {
      button.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) hlsInstance.destroy();
    });
  };
})();
