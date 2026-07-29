// 실제 작업물로 교체 시: 영상은 H.264 mp4, 1080px 넘는 변 기준 8-15Mbps 이하로
// 압축 후 등록할 것 (현재 플레이스홀더 video-01.mp4는 약 10MB로 과도하게 큼).
(() => {
  const isCoarsePointer = window.matchMedia('(hover: none)').matches;

  /* ---------------------------------------------------------------------
     Background autoplay videos (Hero, Gen-Window Showcase) — explicit
     play() fallback. The autoplay attribute alone doesn't reliably fire
     in every environment, so kick it off manually too (muted autoplay is
     always allowed, no gesture needed). No-op if already playing.
     --------------------------------------------------------------------- */
  const autoplayVideos = document.querySelectorAll('.hero-photo video, .gen-window-body video');
  if (autoplayVideos.length) {
    const tryPlayAll = () => autoplayVideos.forEach((v) => v.play().catch(() => {}));
    tryPlayAll();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlayAll();
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const siteNav = document.getElementById('site-nav');

  if (hamburger && siteNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', '메뉴 열기');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero gen-windows — draggable on desktop only (§2.4)
     --------------------------------------------------------------------- */
  if (!isCoarsePointer) {
    const heroLayer = document.querySelector('.hero-gen-windows');
    const draggables = document.querySelectorAll('.gen-window[data-draggable]');

    draggables.forEach((el) => {
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      el.addEventListener('pointerdown', (e) => {
        if (!heroLayer) return;
        dragging = true;
        el.classList.add('is-dragging');
        // Stacking order is fixed via CSS z-index (baddie-4 on top, baddie-1
        // on bottom) and must not change on drag/click — no z-index bump here.
        el.setPointerCapture(e.pointerId);

        const layerRect = heroLayer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        offsetX = e.clientX - elRect.left;
        offsetY = e.clientY - elRect.top;

        // Freeze current visual position as explicit left/top, dropping the
        // original rotation transform so dragging feels direct.
        el.style.left = `${elRect.left - layerRect.left}px`;
        el.style.top = `${elRect.top - layerRect.top}px`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      });

      el.addEventListener('pointermove', (e) => {
        if (!dragging || !heroLayer) return;
        const layerRect = heroLayer.getBoundingClientRect();
        let newLeft = e.clientX - layerRect.left - offsetX;
        let newTop = e.clientY - layerRect.top - offsetY;

        // Keep the window mostly within the hero bounds.
        const maxLeft = layerRect.width - el.offsetWidth;
        const maxTop = layerRect.height - el.offsetHeight;
        newLeft = Math.min(Math.max(newLeft, -el.offsetWidth * 0.3), maxLeft + el.offsetWidth * 0.3);
        newTop = Math.min(Math.max(newTop, -el.offsetHeight * 0.3), maxTop + el.offsetHeight * 0.3);

        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
      });

      const stopDragging = (e) => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('is-dragging');
        try { el.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
      };

      el.addEventListener('pointerup', stopDragging);
      el.addEventListener('pointercancel', stopDragging);
    });
  }

  /* ---------------------------------------------------------------------
     Interactive photo section — hotspot click swaps the right panel (§3.1)
     --------------------------------------------------------------------- */
  (() => {
    const ipIdxLabel = { bag: '04', magazine: '03', cocktail: '02', phone: '01' };
    const ipSpots = document.querySelectorAll('.ip-spot');
    const ipPages = document.querySelectorAll('.ip-page');

    ipSpots.forEach((s) => s.addEventListener('click', () => {
      const item = s.dataset.item;
      ipSpots.forEach((x) => x.classList.toggle('active', x === s));
      ipPages.forEach((p) => p.classList.remove('on'));
      const pg = document.getElementById('ip-page-' + item);
      pg.classList.remove('on'); void pg.offsetWidth; // 애니메이션 재시작
      pg.classList.add('on');
      document.getElementById('ip-idx').textContent = ipIdxLabel[item];
    }));
  })();

  /* ---------------------------------------------------------------------
     Work gallery — render from works.json (no markup edits needed, §4)
     --------------------------------------------------------------------- */
  const grid = document.getElementById('work-grid');

  function createWorkCard(work, index) {
    const article = document.createElement('article');
    article.className = 'work-card grain';
    article.dataset.featured = String(!!work.featured);
    article.dataset.type = work.type;
    article.dataset.orientation = work.orientation || 'landscape';

    const media = document.createElement('div');
    media.className = 'media';

    if (work.type === 'video') {
      const video = document.createElement('video');
      video.src = work.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-label', work.alt || work.title);
      if (work.poster) video.poster = work.poster;

      if (isCoarsePointer) {
        video.preload = 'metadata';
        const playBtn = document.createElement('button');
        playBtn.className = 'play-affordance';
        playBtn.setAttribute('aria-label', '영상 재생');
        playBtn.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            article.classList.add('is-playing');
          } else {
            video.pause();
            article.classList.remove('is-playing');
          }
        });
        media.append(video, playBtn);
      } else {
        video.autoplay = true;
        media.append(video);
      }
    } else {
      const img = document.createElement('img');
      img.src = work.src;
      img.alt = work.alt || work.title || '';
      img.loading = 'lazy';
      media.append(img);
    }

    const meta = document.createElement('div');
    meta.className = 'meta';

    const category = document.createElement('span');
    category.className = 'category';
    const num = (work.id.match(/(\d+)$/) || [, index + 1])[1];
    category.textContent = String(num).padStart(2, '0');

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = work.title;

    meta.append(category, title);

    // works.json에 "link"가 있으면 이미지를 클릭 가능한 링크로 감싼다
    // (예: work-01 → PDF 포트폴리오를 새 탭에서 연다, cursor:pointer는 <a>의 기본값).
    if (work.link) {
      const mediaLink = document.createElement('a');
      mediaLink.className = 'media-link';
      mediaLink.href = work.link;
      mediaLink.target = '_blank';
      mediaLink.rel = 'noopener noreferrer';
      mediaLink.setAttribute('aria-label', `${work.title || work.alt} — 포트폴리오 새 탭에서 열기`);
      mediaLink.append(media);
      article.append(mediaLink, meta);
    } else {
      article.append(media, meta);
    }
    return article;
  }

  function renderWorks(works) {
    if (!grid) return;
    grid.innerHTML = '';
    works.forEach((work, index) => {
      grid.append(createWorkCard(work, index));
    });
    if (!isCoarsePointer) observeVideos();
  }

  fetch('assets/work/works.json')
    .then((res) => res.json())
    .then(renderWorks)
    .catch((err) => {
      console.error('works.json 로드 실패:', err);
      if (grid) grid.innerHTML = '<p class="mono-label">작업물을 불러오지 못했습니다.</p>';
    });

  /* ---------------------------------------------------------------------
     Desktop: autoplay videos only while in viewport
     --------------------------------------------------------------------- */
  function observeVideos() {
    const videos = grid.querySelectorAll('video');
    if (!videos.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach((video) => observer.observe(video));
  }

  /* ---------------------------------------------------------------------
     Contact section — email/phone click-to-copy (§3 Contact)
     --------------------------------------------------------------------- */
  document.querySelectorAll('.contact-info[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy).catch(() => {});
      btn.classList.remove('is-copied');
      void btn.offsetWidth; // 연속 클릭 시 애니메이션 재시작
      btn.classList.add('is-copied');
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(() => btn.classList.remove('is-copied'), 1400);
    });
  });

  /* ---------------------------------------------------------------------
     Desktop custom cursor
     --------------------------------------------------------------------- */
  if (!isCoarsePointer) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.append(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseover', (e) => {
      cursor.classList.toggle('is-active', !!e.target.closest('.work-card, a'));
    });
  }
})();
