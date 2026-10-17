// USD → KRW estimate using today's exchange rate.
// Any element with data-krw-usd="<amount>" gets a KRW estimate as its text.
// If no rate can be loaded, KRW text stays empty (hidden) rather than showing a guess.

const RATE_SOURCES = [
  {
    url: 'https://open.er-api.com/v6/latest/USD',
    pick: (d) => (d.result === 'success' ? d.rates?.KRW : null),
  },
  {
    url: 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW',
    pick: (d) => d.rates?.KRW,
  },
];

const CACHE_KEY = 'pvr_usdkrw';

let rate = null;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.day === todayKey() && cached.rate > 0) return cached.rate;
  } catch (e) {
    // storage unavailable — fetch instead
  }
  return null;
}

function writeCache(value) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ day: todayKey(), rate: value }));
  } catch (e) {
    // storage unavailable — fine, we just refetch next time
  }
}

async function fetchRate() {
  for (const source of RATE_SOURCES) {
    try {
      const res = await fetch(source.url);
      if (!res.ok) continue;
      const value = Number(source.pick(await res.json()));
      if (value > 0) return value;
    } catch (e) {
      // try the next source
    }
  }
  return null;
}

function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'ko';
}

export function formatKrw(usd) {
  if (!rate || !Number.isFinite(usd)) return '';
  const krw = usd * rate;
  if (currentLang() === 'en') {
    return `≈ ₩${(Math.round(krw / 1000) * 1000).toLocaleString('en-US')}`;
  }
  if (krw >= 10000) {
    return `약 ${Math.round(krw / 10000).toLocaleString('ko-KR')}만원`;
  }
  return `약 ${(Math.round(krw / 100) * 100).toLocaleString('ko-KR')}원`;
}

export function renderKrw() {
  document.querySelectorAll('[data-krw-usd]').forEach((el) => {
    const text = formatKrw(Number(el.dataset.krwUsd));
    el.textContent = text ? text + (el.dataset.krwSuffix || '') : '';
  });

  const note = document.getElementById('krwRateNote');
  if (note) {
    note.textContent = rate
      ? currentLang() === 'en'
        ? `Today's rate: $1 = ₩${Math.round(rate).toLocaleString('en-US')} · Your card issuer's rate applies at payment`
        : `오늘 환율 1달러 = ${Math.round(rate).toLocaleString('ko-KR')}원 기준 · 실제 결제 금액은 카드사 환율에 따라 달라요`
      : '';
  }
}

// Update one element's USD amount and re-render its KRW text
export function setKrwAmount(el, usd) {
  if (!el) return;
  el.dataset.krwUsd = String(usd);
  el.textContent = formatKrw(usd);
}

export async function initCurrency() {
  rate = readCache();
  if (!rate) {
    rate = await fetchRate();
    if (rate) writeCache(rate);
  }
  renderKrw();
  document.addEventListener('langchange', renderKrw);
}
