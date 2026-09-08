// Слайдер сертификатов (главная и каталог): переключение стрелками
document.querySelectorAll('[data-cert-slider]').forEach((cards) => {
  const items = Array.from(cards.querySelectorAll('img'));
  if (items.length < 3) return;
  const base = items[0].classList[0];
  const wrap = cards.closest('.cert-slider');
  const prevBtn = wrap?.querySelector('.cert-slider__arrow--prev');
  const nextBtn = wrap?.querySelector('.cert-slider__arrow--next');
  let activeIndex = Math.floor(items.length / 2); // средний документ — как в макете

  function render() {
    items.forEach((item, i) => {
      item.classList.remove(`${base}--main`, `${base}--prev`, `${base}--next`);
      const pos = (i - activeIndex + items.length) % items.length;
      if (pos === 0) item.classList.add(`${base}--main`);
      else if (pos === 1) item.classList.add(`${base}--next`);
      else if (pos === items.length - 1) item.classList.add(`${base}--prev`);
    });
  }
  render();

  prevBtn?.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    render();
  });
  nextBtn?.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % items.length;
    render();
  });
});

// FAQ: переключение табов
document.querySelectorAll('.faq__tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.faq__tab').forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});

// FAQ: аккордеон
document.querySelectorAll('.accordion__head').forEach((head) => {
  head.addEventListener('click', () => {
    const item = head.closest('.accordion__item');
    const wasOpen = item.classList.contains('is-open');
    item.parentElement.querySelectorAll('.accordion__item').forEach((i) => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// Разворачивание усечённого текста (SEO-блоки)
document.querySelectorAll('.seo__toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const wrap = toggle.closest('.js-expand');
    const expanded = wrap.classList.toggle('is-expanded');
    toggle.firstChild.textContent = expanded ? 'Свернуть ' : 'Развернуть ';
  });
});

// Карточка товара: табы (Описание/Детали/Оплата/Доставка)
document.querySelectorAll('.tabs').forEach((tabs) => {
  const buttons = tabs.querySelectorAll('.tabs__tab');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      tabs.querySelectorAll('.tabs__panel').forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      tabs.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('is-active');
    });
  });
});

// Карточка товара: подставляем данные нужной фракции по product.html?id=...
const productMainImg = document.getElementById('productMainImg');
if (productMainImg && typeof PRODUCTS !== 'undefined') {
  const id = new URLSearchParams(location.search).get('id');
  const data = PRODUCTS[id] || PRODUCTS['0.10-0.63'];

  document.title = `${data.title} — купить | ТехноКварц`;
  document.getElementById('productTitle').textContent = data.title;
  document.getElementById('breadcrumbFraction').textContent = data.fraction;
  document.getElementById('breadcrumbTitle').textContent = data.title;
  document.getElementById('priceMF').textContent = data.priceMF;
  document.getElementById('priceMKR').textContent = data.priceMKR;
  productMainImg.src = data.main;
  productMainImg.alt = data.title;

  const thumbsWrap = document.querySelector('.product__thumbs');
  thumbsWrap.innerHTML = data.thumbs.map((src, i) => `
    <button class="product__thumb${i === 0 ? ' is-active' : ''}" data-img="${src}"><img src="${src}" alt=""></button>
  `).join('');
}

// Карточка товара: переключение главного фото по миниатюрам
if (productMainImg) {
  document.querySelectorAll('.product__thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.product__thumb').forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      productMainImg.src = thumb.dataset.img;
    });
  });
  const thumbs = Array.from(document.querySelectorAll('.product__thumb'));
  const step = (dir) => {
    const activeIndex = thumbs.findIndex((t) => t.classList.contains('is-active'));
    const next = (activeIndex + dir + thumbs.length) % thumbs.length;
    thumbs[next].click();
  };
  document.querySelector('.product__arrow--prev')?.addEventListener('click', () => step(-1));
  document.querySelector('.product__arrow--next')?.addEventListener('click', () => step(1));
}

// Футер: карта с отметками адресов (офис в Мытищах и завод в Воронеже)
const mapEl = document.getElementById('footerMap');
if (mapEl && typeof L !== 'undefined') {
  const office = [56.077935, 37.517159];
  const factory = [51.652141, 38.891640];

  const map = L.map(mapEl, { scrollWheelZoom: false }).fitBounds([office, factory], {
    paddingTopLeft: [40, 40],
    paddingBottomRight: [40, 190],
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 18,
  }).addTo(map);

  const icon = L.divIcon({
    className: 'map-pin',
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });

  L.marker(office, { icon })
    .addTo(map)
    .bindPopup('<b>Московский офис</b><br>Мытищенский район, деревня Сухарево д.140, стр. 14');

  L.marker(factory, { icon })
    .addTo(map)
    .bindPopup('<b>Завод</b><br>г. Воронеж, рабочий поселок Латная, ул. Строителей 8');
}

// Маска телефона: только цифры, автоформат +7 (___) ___-__-__
function formatPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let result = '+7';
  if (digits.length) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ')';
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}
document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = formatPhone(input.value);
  });
  input.addEventListener('focus', () => {
    if (!input.value) input.value = '+7 (';
  });
  input.addEventListener('blur', () => {
    if (input.value === '+7' || input.value === '+7 (') input.value = '';
  });
});

// Прокрутка горизонтальных треков мышью/пальцем (drag), на случай если
// браузер/устройство не подхватывает нативный touch-scroll
function enableDragScroll(el) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  const start = (clientX) => {
    isDown = true;
    moved = false;
    startX = clientX;
    startScroll = el.scrollLeft;
    el.classList.add('is-dragging');
    el.style.scrollBehavior = 'auto'; // инлайн — применяется сразу, без ожидания пересчёта стилей
  };
  const move = (clientX) => {
    if (!isDown) return;
    const dx = clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    el.scrollLeft = startScroll - dx;
  };
  const stop = () => {
    isDown = false;
    el.classList.remove('is-dragging');
    el.style.scrollBehavior = '';
  };

  // мышь (в т.ч. трекпад-драг в devtools) — слушаем move/up на document,
  // чтобы драг не срывался, если курсор выходит за пределы трека
  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    start(e.clientX);
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => move(e.clientX));
  document.addEventListener('mouseup', stop);

  // touch — на случай, если браузер не подхватывает нативный touch-scroll
  el.addEventListener(
    'touchstart',
    (e) => start(e.touches[0].clientX),
    { passive: true }
  );
  el.addEventListener('touchmove', (e) => move(e.touches[0].clientX), {
    passive: true,
  });
  el.addEventListener('touchend', stop);
  el.addEventListener('touchcancel', stop);

  // не даём клику по ссылке/кнопке сработать сразу после перетаскивания
  el.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
}

// Слайдер карточек (напр. «Лидеры продаж»): бесконечная прокрутка стрелками
document.querySelectorAll('[data-slider-track]').forEach((track) => {
  enableDragScroll(track);
  const section = track.closest('section');
  const prev = section?.querySelector('[data-slider-prev]');
  const next = section?.querySelector('[data-slider-next]');
  const originalCards = Array.from(track.children);
  const setSize = originalCards.length;
  if (setSize < 2) return;

  // дублируем набор карточек трижды, чтобы прокрутка выглядела бесконечной
  const cloneSet = () => originalCards.map((c) => c.cloneNode(true));
  track.append(...cloneSet());
  track.append(...cloneSet());

  const cardStep = () => track.children[0].offsetWidth + 20;
  const setWidth = () => cardStep() * setSize;

  const jumpTo = (left) => {
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = left;
    track.offsetHeight; // reflow перед возвратом плавной прокрутки
    track.style.scrollBehavior = 'smooth';
  };
  jumpTo(setWidth());

  let settleTimer = null;
  track.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const sw = setWidth();
      if (track.scrollLeft <= 1) jumpTo(track.scrollLeft + sw);
      else if (track.scrollLeft >= sw * 2 - 1) jumpTo(track.scrollLeft - sw);
    }, 120);
  });

  prev?.addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: 'smooth' }));
});

// Галерея фото: бесконечная прокрутка стрелками (набор фото зациклен)
document.querySelectorAll('.gallery').forEach((gallery) => {
  const track = gallery.querySelector('.gallery__track');
  enableDragScroll(track);
  const prev = gallery.querySelector('.gallery__arrow--prev');
  const next = gallery.querySelector('.gallery__arrow--next');
  const imgs = track.querySelectorAll('img');
  const setSize = parseInt(gallery.dataset.setSize, 10) || 0;
  const gap = 20;

  if (!setSize || imgs.length % setSize !== 0 || imgs.length / setSize < 3) {
    // недостаточно повторов для зацикливания — обычная прокрутка
    const step = () => imgs[0].offsetWidth + gap;
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    return;
  }

  const itemWidth = imgs[0].offsetWidth + gap;
  const setWidth = itemWidth * setSize;

  const jumpTo = (left) => {
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = left;
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight; // force reflow before re-enabling smooth scroll
    track.style.scrollBehavior = 'smooth';
  };

  jumpTo(setWidth);

  let settleTimer = null;
  track.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      if (track.scrollLeft <= 1) {
        jumpTo(track.scrollLeft + setWidth);
      } else if (track.scrollLeft >= setWidth * 2 - 1) {
        jumpTo(track.scrollLeft - setWidth);
      }
    }, 120);
  });

  prev?.addEventListener('click', () => track.scrollBy({ left: -itemWidth, behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: itemWidth, behavior: 'smooth' }));
});
