import { H as Hls } from './hls-dru42stk.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function initMenu() {
  const button = $('[data-menu-toggle]');
  const nav = $('[data-main-nav]');
  if (!button || !nav) {
    return;
  }
  button.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function initHero() {
  const slider = $('[data-hero-slider]');
  if (!slider) {
    return;
  }
  const slides = $$('[data-hero-slide]', slider);
  const dots = $$('[data-hero-dot]', slider);
  let active = 0;
  let timer = null;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === active));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(active + 1), 5200);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index);
      start();
    });
  });

  show(0);
  start();
}

function initCatalog() {
  const containers = $$('[data-card-container]');
  containers.forEach((container) => {
    const scope = container.closest('[data-catalog-scope]') || document;
    const input = $('[data-search-input]', scope);
    const select = $('[data-sort-select]', scope);
    const count = $('[data-result-count]', scope);
    const filters = $$('[data-filter]', scope);
    const cards = $$('[data-card]', container);
    let activeFilter = '全部';

    const normalize = (value) => (value || '').toString().trim().toLowerCase();

    const apply = () => {
      const keyword = normalize(input ? input.value : '');
      const filter = normalize(activeFilter);
      let visible = [];

      cards.forEach((card) => {
        const haystack = normalize(card.dataset.search + ' ' + card.dataset.title);
        const passKeyword = !keyword || haystack.includes(keyword);
        const passFilter = filter === '全部' || !filter || haystack.includes(filter);
        const ok = passKeyword && passFilter;
        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible.push(card);
        }
      });

      const order = select ? select.value : 'hot';
      visible
        .sort((a, b) => {
          if (order === 'year') {
            return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
          }
          if (order === 'rating') {
            return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
          }
          if (order === 'title') {
            return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
          }
          return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
        })
        .forEach((card) => container.appendChild(card));

      if (count) {
        count.textContent = `显示 ${visible.length} 部 / 共 ${cards.length} 部`;
      }
      const empty = $('.empty-state', scope);
      if (empty) {
        empty.classList.toggle('show', visible.length === 0);
      }
    };

    filters.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter || '全部';
        filters.forEach((item) => item.classList.toggle('active', item === button));
        apply();
      });
    });

    if (filters[0]) {
      filters[0].classList.add('active');
    }
    if (input) {
      input.addEventListener('input', apply);
    }
    if (select) {
      select.addEventListener('change', apply);
    }
    apply();
  });
}

function initPlayers() {
  const players = $$('[data-player]');
  players.forEach((player) => {
    const video = $('video', player);
    const button = $('[data-play-button]', player);
    const source = player.dataset.video;
    if (!video || !source) {
      return;
    }

    let hls = null;
    let ready = false;

    const prepare = () => new Promise((resolve, reject) => {
      if (ready) {
        resolve();
        return;
      }

      const done = () => {
        ready = true;
        resolve();
      };

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', done, { once: true });
        window.setTimeout(done, 900);
        return;
      }

      if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, done);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data && data.fatal) {
            reject(new Error('播放准备失败'));
          }
        });
        window.setTimeout(done, 1400);
        return;
      }

      reject(new Error('播放准备失败'));
    });

    const start = async () => {
      try {
        await prepare();
        video.controls = true;
        player.classList.add('is-playing');
        await video.play();
      } catch (error) {
        player.classList.remove('is-playing');
        const note = player.parentElement ? player.parentElement.querySelector('[data-player-note]') : null;
        if (note) {
          note.textContent = '播放准备失败，请刷新页面后重试。';
        }
      }
    };

    if (button) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }

    player.addEventListener('click', () => {
      if (!ready) {
        start();
      }
    });

    video.addEventListener('play', () => player.classList.add('is-playing'));
    video.addEventListener('pause', () => {
      if (video.currentTime === 0 || video.ended) {
        player.classList.remove('is-playing');
      }
    });

    window.addEventListener('beforeunload', () => {
      if (hls) {
        hls.destroy();
      }
    });
  });
}

function initImageState() {
  document.addEventListener('error', (event) => {
    const target = event.target;
    if (target && target.tagName === 'IMG') {
      target.classList.add('image-missing');
    }
  }, true);
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initHero();
  initCatalog();
  initPlayers();
  initImageState();
});
