import galleryItems from './app.js';

const refs = {
  galleryListEl: document.querySelector('ul.gallery'),
  modalContainerEl: document.querySelector('div.lightbox'),
  lightboxOverlayEl: document.querySelector('div.lightbox__overlay'),
  modalImgEl: document.querySelector('img.lightbox__image'),
  modalCloseBtnEl: document.querySelector('[data-action="close-lightbox"]'),
};

const galleryMarkup = createGalleryMarkup(galleryItems);
refs.galleryListEl.insertAdjacentHTML('beforeend', galleryMarkup);
refs.galleryListEl.addEventListener('click', onGalleryItemClick);
refs.modalCloseBtnEl.addEventListener('click', closeModal);
refs.lightboxOverlayEl.addEventListener('click', closeModal); //Закрытие модального окна по клику на div.lightbox__overlay.

// 1. Создание и рендер разметки по массиву данных galleryItems из app.js и предоставленному шаблону.
function createGalleryMarkup(galleryItems) {
  return galleryItems
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
                    <a class="gallery__link" href="${original}">
                        <img class="gallery__image" src="${preview}" data-source="${original}" alt="${description}"/>
                    </a>
                </li>`;
    })
    .join('');
}

// 2. Реализация делегирования на галерее ul.js - gallery и получение url большого изображения.
function onGalleryItemClick(event) {
  event.preventDefault();

  // 3. Открытие модального окна по клику на элементе галереи.
  const isGalleryImageEl = event.target.classList.contains('gallery__image');
  if (!isGalleryImageEl) {
    return;
  }
  refs.modalContainerEl.classList.add('is-open');

  // 4. Подмена значения атрибута src элемента img.lightbox__image.
  refs.modalImgEl.src = event.target.dataset.source;
  refs.modalImgEl.alt = event.target.getAttribute('alt');

  document.addEventListener('keydown', onEscPress);
  document.addEventListener('keydown', onArrowPress);
}

// 5. Закрытие модального окна по клику на кнопку button[data - action= "close-lightbox"].
function closeModal() {
  refs.modalContainerEl.classList.remove('is-open');

  // 6. Очистка значения атрибута src элемента img.lightbox__image.
  refs.modalImgEl.src = '';
  refs.modalImgEl.alt = '';

  document.removeEventListener('keydown', onEscPress);
  document.removeEventListener('keydown', onArrowPress);
}

// Закрытие модального окна по нажатию клавиши ESC.
function onEscPress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
const turnRight = currentIndex => {
  if (currentIndex === galleryItems.length - 1) return;
  const nextImgSourse = galleryItems[currentIndex + 1].original;
  refs.modalImgEl.setAttribute('src', nextImgSourse);
};

const turnfLeft = currentIndex => {
  if (currentIndex === 0) return;
  const previousImgSourse = galleryItems[currentIndex - 1].original;
  refs.modalImgEl.setAttribute('src', previousImgSourse);
};

function onArrowPress(event) {
  if (refs.modalContainerEl.classList.contains('is-open')) {
    const currentImgSourse = refs.modalImgEl.getAttribute('src');
    const currentIndex = galleryItems.indexOf(
      galleryItems.find(item => item.original === currentImgSourse),
    );
    if (event.code === 'ArrowRight') turnRight(currentIndex);
    if (event.code === 'ArrowLeft') turnfLeft(currentIndex);
  }
}
