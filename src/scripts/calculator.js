export function initCalculator() {
  const nightsSlider = document.getElementById('calcNights');
  const travelersSlider = document.getElementById('calcTravelers');
  const nightsVal = document.getElementById('calcNightsVal');
  const travelersVal = document.getElementById('calcTravelersVal');
  
  const savingAmountEl = document.getElementById('calcTotalSavings');
  const hotelTotalEl = document.getElementById('calcHotelTotal');
  const condoTotalEl = document.getElementById('calcCondoTotal');

  const bResortEl = document.getElementById('bResort');
  const bParkingEl = document.getElementById('bParking');
  const bDiningEl = document.getElementById('bDining');
  const bRoomEl = document.getElementById('bRoom');

  if (!nightsSlider || !travelersSlider) return;

  function recalculate() {
    const nights = parseInt(nightsSlider.value, 10);
    const travelers = parseInt(travelersSlider.value, 10);

    nightsVal.textContent = `${nights}박`;
    travelersVal.textContent = `${travelers}명`;

    // 1. Hotel Calculations
    const hotelBase = 420 * nights;
    const hotelResort = 45 * 1.185 * nights;
    const hotelParking = 50 * nights;
    const hotelDining = 45 * travelers * nights;
    const hotelTotal = Math.round(hotelBase + hotelResort + hotelParking + hotelDining);

    // 2. Our Condo Calculations
    // 3+ nights: cleaning fee waived
    let condoNightly = 249;
    if (nights >= 30) condoNightly *= 0.70;
    else if (nights >= 20) condoNightly *= 0.80;
    else if (nights >= 10) condoNightly *= 0.90;
    else if (nights >= 5) condoNightly *= 0.95;

    const condoRoomSubtotal = condoNightly * nights;
    const condoTaxes = condoRoomSubtotal * 0.185; // Hawaii GET + TAT + OTAT
    const condoResort = 0;
    const condoParking = 0;
    const condoDining = 15 * travelers * nights; // Groceries & coffee at home
    const condoTotal = Math.round(condoRoomSubtotal + condoTaxes + condoResort + condoParking + condoDining);

    // 3. Savings
    const totalSavings = hotelTotal - condoTotal;
    const resortSavings = Math.round(hotelResort);
    const parkingSavings = Math.round(hotelParking);
    const diningSavings = Math.round(hotelDining - condoDining);
    const roomSavings = Math.round(hotelBase - (condoRoomSubtotal + condoTaxes));

    // Update Elements
    savingAmountEl.textContent = `$${totalSavings.toLocaleString()}`;
    hotelTotalEl.textContent = `$${hotelTotal.toLocaleString()}`;
    condoTotalEl.textContent = `$${condoTotal.toLocaleString()}`;

    bResortEl.textContent = `+$${resortSavings.toLocaleString()}`;
    bParkingEl.textContent = `+$${parkingSavings.toLocaleString()}`;
    bDiningEl.textContent = `+$${diningSavings.toLocaleString()}`;
    bRoomEl.textContent = `+$${roomSavings.toLocaleString()}`;
  }

  nightsSlider.addEventListener('input', recalculate);
  travelersSlider.addEventListener('input', recalculate);
  recalculate();
}
