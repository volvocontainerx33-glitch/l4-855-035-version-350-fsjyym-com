(function () {
  const video = document.getElementById('moviePlayer');
  const overlay = document.getElementById('playOverlay');
  const message = document.getElementById('playerMessage');
  const configNode = document.getElementById('playerConfig');

  if (!video || !overlay || !configNode) {
    return;
  }

  let config = {};
  try {
    config = JSON.parse(configNode.textContent || '{}');
  } catch (error) {
    config = {};
  }

  const url = config.url || '';
  let prepared = false;
  let hls = null;

  const setMessage = function (text) {
    if (message) {
      message.textContent = text || '';
    }
  };

  const prepare = function () {
    if (prepared || !url) {
      return Promise.resolve();
    }

    prepared = true;

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          setMessage('网络连接异常，正在重新加载');
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          setMessage('视频加载异常，正在恢复');
          hls.recoverMediaError();
        } else {
          setMessage('视频暂时无法播放');
        }
      });
      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return Promise.resolve();
    }

    setMessage('当前环境暂时无法播放该视频');
    return Promise.resolve();
  };

  const play = function () {
    setMessage('');
    prepare().then(function () {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setMessage('点击播放按钮继续观看');
        });
      }
    });
  };

  overlay.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (!prepared || video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    overlay.classList.add('hidden');
  });
  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      overlay.classList.remove('hidden');
    }
  });
  video.addEventListener('ended', function () {
    overlay.classList.remove('hidden');
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
