export function initBookingWidget() {
  const checkInInput = document.getElementById('bookCheckIn');
  const checkOutInput = document.getElementById('bookCheckOut');
  const roomSelect = document.getElementById('bookRoom');
  const guestsSelect = document.getElementById('bookGuests');

  const basePriceEl = document.getElementById('quoteBase');
  const nightsCountEl = document.getElementById('quoteNights');
  const cleaningFeeEl = document.getElementById('quoteCleaning');
  const discountRowEl = document.getElementById('quoteDiscountRow');
  const discountValEl = document.getElementById('quoteDiscountVal');
  const taxValEl = document.getElementById('quoteTax');
  const totalValEl = document.getElementById('quoteTotal');

  const btnKakao = document.getElementById('btnKakaoBook');
  const btnCard = document.getElementById('btnCardBook');

  // Set default dates (tomorrow and +5 days)
  const today = new Date();
  const defaultIn = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const defaultOut = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);

  if (checkInInput && checkOutInput) {
    checkInInput.value = defaultIn.toISOString().split('T')[0];
    checkOutInput.value = defaultOut.toISOString().split('T')[0];
    checkInInput.min = today.toISOString().split('T')[0];
    checkOutInput.min = defaultIn.toISOString().split('T')[0];

    checkInInput.addEventListener('change', () => {
      const dIn = new Date(checkInInput.value);
      const minOut = new Date(dIn.getTime() + 24 * 60 * 60 * 1000);
      checkOutInput.min = minOut.toISOString().split('T')[0];
      if (new Date(checkOutInput.value) <= dIn) {
        checkOutInput.value = minOut.toISOString().split('T')[0];
      }
      calculateQuote();
    });

    checkOutInput.addEventListener('change', calculateQuote);
  }

  if (roomSelect) roomSelect.addEventListener('change', calculateQuote);
  if (guestsSelect) guestsSelect.addEventListener('change', calculateQuote);

  let currentQuote = {
    nights: 5,
    roomName: '타워 2 #3205호 (32층 마운틴 뷰)',
    guests: 2,
    total: 0,
    checkIn: '',
    checkOut: ''
  };

  function calculateQuote() {
    if (!checkInInput || !checkOutInput) return;

    const dIn = new Date(checkInInput.value);
    const dOut = new Date(checkOutInput.value);
    const diffTime = dOut.getTime() - dIn.getTime();
    const nights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    const guests = guestsSelect ? guestsSelect.value : 2;
    const roomName = roomSelect ? roomSelect.options[roomSelect.selectedIndex].text : '타워 2 #3205호';

    // Base nightly rate
    const baseNightly = 249;
    let roomSubtotal = baseNightly * nights;

    // Cleaning fee: $250 for 1-2 nights, $0 waived for 3+ nights
    const cleaningFee = nights >= 3 ? 0 : 250;

    // Tiered discounts
    let discountPercent = 0;
    if (nights >= 30) discountPercent = 0.30;
    else if (nights >= 20) discountPercent = 0.20;
    else if (nights >= 10) discountPercent = 0.10;
    else if (nights >= 5) discountPercent = 0.05;

    const discountAmount = Math.round(roomSubtotal * discountPercent);
    const discountedRoomTotal = roomSubtotal - discountAmount;

    // Hawaii taxes: 18.5% (GET 4.5% + TAT 11% + OTAT 3%)
    const taxes = Math.round(discountedRoomTotal * 0.185);
    const total = discountedRoomTotal + cleaningFee + taxes;

    currentQuote = {
      nights,
      roomName,
      guests,
      total,
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      discountAmount,
      cleaningFee
    };

    // Update DOM
    if (basePriceEl) basePriceEl.textContent = `$${roomSubtotal.toLocaleString()}`;
    if (nightsCountEl) nightsCountEl.textContent = `${nights}박 기준`;
    
    if (cleaningFeeEl) {
      if (cleaningFee === 0) {
        cleaningFeeEl.innerHTML = '<span style="color:var(--color-success); font-weight:700;">$0 (3박 이상 무료 면제!)</span>';
      } else {
        cleaningFeeEl.textContent = `$${cleaningFee}`;
      }
    }

    if (discountRowEl && discountValEl) {
      if (discountAmount > 0) {
        discountRowEl.style.display = 'flex';
        discountValEl.textContent = `-$${discountAmount.toLocaleString()} (${discountPercent * 100}% 할인)`;
      } else {
        discountRowEl.style.display = 'none';
      }
    }

    if (taxValEl) taxValEl.textContent = `$${taxes.toLocaleString()}`;
    if (totalValEl) totalValEl.textContent = `$${total.toLocaleString()}`;
  }

  // KakaoTalk inquiry button click
  if (btnKakao) {
    btnKakao.addEventListener('click', () => {
      const msg = `[와이키키 반얀 직예약 문의]\n- 객실: ${currentQuote.roomName}\n- 일정: ${currentQuote.checkIn} ~ ${currentQuote.checkOut} (${currentQuote.nights}박)\n- 인원: ${currentQuote.guests}명\n- 예상 견적: $${currentQuote.total.toLocaleString()} (주차비 $0, 리조트피 $0 포함)\n\n예약 가능 여부와 계좌이체/카드 결제 안내 부탁드립니다!`;
      
      // Fallback: copy to clipboard and open KakaoTalk channel
      navigator.clipboard.writeText(msg).then(() => {
        alert('문의 내용이 복사되었습니다! 카카오톡 상담 채널로 연결됩니다.\n\n' + msg);
        window.open('https://pf.kakao.com', '_blank');
      }).catch(() => {
        window.open('https://pf.kakao.com', '_blank');
      });
    });
  }

  if (btnCard) {
    btnCard.addEventListener('click', () => {
      alert(`[직예약 안내]\n선택하신 일정: ${currentQuote.checkIn} ~ ${currentQuote.checkOut} (${currentQuote.nights}박)\n예상 총 결제금액: $${currentQuote.total.toLocaleString()}\n\n에어비앤비 대비 수수료가 절약된 다이렉트 예약 페이지로 연결됩니다.`);
      window.open('https://plumeriavacationrentals.com/#/rentals', '_blank');
    });
  }

  calculateQuote();
}
