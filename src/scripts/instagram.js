export const instagramPosts = [
  {
    id: 'post-1',
    img: 'images/properties/wb-3205-t2/unit-3205-15.webp',
    caption: '32층 라나이에서 맞이하는 하와이의 아침 🌺 코올라우 산맥과 다이아몬드헤드가 선사하는 파노라마 뷰! 하루 $50 상당 무료 주차 포함 🚗✨',
    tags: ['#와이키키반얀', '#하와이콘도', '#하와이숙소', '#plumeriavacationrentals'],
    likes: 428,
    comments: 34,
    link: 'https://www.instagram.com/plumeriavacationrentals/'
  },
  {
    id: 'post-2',
    img: 'images/banyan/banyan-amenity-10.webp',
    caption: '1에이커(1,200평) 대형 리조트 덱에서 즐기는 따뜻한 온수 수영장과 2개의 자쿠지 💦 와이키키 호텔 부럽지 않은 부대시설을 $0 리조트피로 즐기세요!',
    tags: ['#와이키키수영장', '#하와이가족여행', '#하와이리조트피', '#와이키키비치'],
    likes: 512,
    comments: 48,
    link: 'https://www.instagram.com/plumeriavacationrentals/'
  },
  {
    id: 'post-3',
    img: 'images/properties/wb-3205-t2/unit-3205-05.webp',
    caption: '한국인 투숙객분들을 위해 전기밥솥과 조리도구 완비 🍚 월마트/코스트코에서 사 온 소고기와 파인애플로 든든한 아침을 만들어보세요!',
    tags: ['#하와이취사', '#하와이마트장보기', '#와이키키맛집', '#콘도요리'],
    likes: 389,
    comments: 29,
    link: 'https://www.instagram.com/plumeriavacationrentals/'
  },
  {
    id: 'post-4',
    img: 'assets/entrance_ramp-CwSmKCxk.webp',
    caption: '와이키키 호텔 주차비 하루 8만원? 😱 저희는 전 일정 100% 무료 전용 실내 주차장 제공! 렌터카 여행의 필수 선택지 🚘',
    tags: ['#와이키키주차', '#하와이렌터카', '#하와이주차팁', '#알뜰하와이'],
    likes: 673,
    comments: 82,
    link: 'https://www.instagram.com/plumeriavacationrentals/'
  }
];

export function renderInstagramFeed() {
  const container = document.getElementById('instaGrid');
  if (!container) return;

  container.innerHTML = instagramPosts.map(p => `
    <article class="insta-card">
      <div class="insta-img-wrap">
        <img src="${p.img}" alt="Instagram post" loading="lazy" />
        <span class="insta-tag-badge">Instagram</span>
      </div>
      <div class="insta-body">
        <p class="insta-caption">${p.caption}</p>
        <div class="insta-footer">
          <span>❤️ ${p.likes} · 💬 ${p.comments}</span>
          <a href="${p.link}" target="_blank" rel="noopener noreferrer" style="color: var(--color-turquoise); font-weight:700;">@plumeriavacationrentals</a>
        </div>
      </div>
    </article>
  `).join('');
}
