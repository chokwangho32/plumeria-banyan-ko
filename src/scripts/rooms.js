export const roomPhotos = [
  { url: 'images/properties/wb-3205-t2/unit-3205-01.webp', caption: '통창 너머 산 전망이 펼쳐지는 거실과 오픈 키친' },
  { url: 'images/properties/wb-3205-t2/unit-3205-02.webp', caption: '그레이 소파와 옐로 포인트 체어, 라나이로 이어지는 통유리창' },
  { url: 'images/properties/wb-3205-t2/unit-3205-03.webp', caption: '거실과 3인 바 테이블, 라나이로 나가는 문' },
  { url: 'images/properties/wb-3205-t2/unit-3205-04.webp', caption: '아일랜드 조리대가 있는 오픈 키친과 스테인리스 냉장고' },
  { url: 'images/properties/wb-3205-t2/unit-3205-05.webp', caption: '전자레인지·토스터·쿡탑과 넓은 조리대가 있는 주방' },
  { url: 'images/properties/wb-3205-t2/unit-3205-06.webp', caption: '풀사이즈 냉장고와 넉넉한 수납장' },
  { url: 'images/properties/wb-3205-t2/unit-3205-07.webp', caption: '바 스툴 3개 아일랜드 식탁과 벽걸이 TV' },
  { url: 'images/properties/wb-3205-t2/unit-3205-08.webp', caption: '대형 거울이 있는 세면대 공간' },
  { url: 'images/properties/wb-3205-t2/unit-3205-09.webp', caption: '넉넉한 수납장이 있는 복도와 욕실 입구' },
  { url: 'images/properties/wb-3205-t2/unit-3205-10.webp', caption: '유리 샤워 부스' },
  { url: 'images/properties/wb-3205-t2/unit-3205-11.webp', caption: '샤워 부스와 침실로 이어지는 욕실' },
  { url: 'images/properties/wb-3205-t2/unit-3205-12.webp', caption: '대형 거울이 달린 욕실 세면대' },
  { url: 'images/properties/wb-3205-t2/unit-3205-13.webp', caption: '통창으로 햇살이 드는 침실' },
  { url: 'images/properties/wb-3205-t2/unit-3205-14.webp', caption: '산 전망 창가의 침실' },
  { url: 'images/properties/wb-3205-t2/unit-3205-15.webp', caption: '의자와 테이블이 놓인 프라이빗 라나이' },
  { url: 'images/properties/wb-3205-t2/unit-3205-16.webp', caption: '32층 라나이에서 내려다본 풍경' },
  { url: 'images/properties/wb-3205-t2/unit-3205-17.webp', caption: '32층에서 바라본 골프장과 코올라우 산맥' },
  { url: 'images/properties/wb-3205-t2/unit-3205-18.webp', caption: '32층 라나이에서 바라본 산맥 전망' },
  { url: 'images/properties/wb-3205-t2/unit-3205-19.webp', caption: '32층에서 바라본 호놀룰루 시내와 산' },
  { url: 'images/properties/wb-3205-t2/unit-3205-20.webp', caption: '라나이 전망 – 맑은 하와이 하늘' },
  { url: 'images/properties/wb-3205-t2/unit-3205-21.webp', caption: '32층에서 바라본 와이키키 시티 뷰' },
  { url: 'images/properties/wb-3205-t2/unit-3205-22.webp', caption: '라나이 체어와 탁 트인 시티·산 전망' },
  { url: 'images/properties/wb-3205-t2/unit-3205-23.webp', caption: '화분과 의자가 놓인 라나이' },
  { url: 'images/properties/wb-3205-t2/unit-3205-24.webp', caption: '현관에서 바라본 거실과 주방' }
];

export function initRoomGallery() {
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const triggerBtn = document.getElementById('btnOpenGallery');
  const roomPreview = document.getElementById('roomPreviewImg');

  let currentIndex = 0;

  function showPhoto(idx) {
    currentIndex = (idx + roomPhotos.length) % roomPhotos.length;
    const photo = roomPhotos[currentIndex];
    imgEl.src = photo.url;
    captionEl.textContent = `${currentIndex + 1} / ${roomPhotos.length} - ${photo.caption}`;
  }

  function openModal(idx = 0) {
    showPhoto(idx);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (triggerBtn) triggerBtn.addEventListener('click', () => openModal(0));
  if (roomPreview) roomPreview.addEventListener('click', () => openModal(0));

  // Top-of-page photo mosaic
  document.querySelectorAll('[data-photo-index]').forEach((el) => {
    el.addEventListener('click', () => openModal(Number(el.dataset.photoIndex)));
  });
  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelector(el.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhoto(currentIndex - 1);
  });

  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhoto(currentIndex + 1);
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
}
