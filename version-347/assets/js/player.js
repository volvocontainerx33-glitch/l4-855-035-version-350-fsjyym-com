function startMoviePlayer(videoId, overlayId, url) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var ready = false;
    var hls = null;

    function loadAndPlay() {
        if (!video) {
            return;
        }

        if (!ready) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
            ready = true;
        }

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.controls = true;
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', loadAndPlay);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!ready || video.paused) {
                loadAndPlay();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }
}
