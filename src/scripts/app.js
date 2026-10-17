import { initI18n } from './i18n.js';
import { initCalculator } from './calculator.js';
import { initRoomGallery } from './rooms.js';
import { renderInstagramFeed } from './instagram.js';
import { initBlog } from './blog.js';
import { initBookingWidget } from './booking.js';
import { initCurrency } from './currency.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Internationalization
  initI18n();

  // 2. Initialize Cost Savings Calculator
  initCalculator();

  // 3. Initialize Rooms and Lightbox Gallery
  initRoomGallery();
  initCurrency();

  // 4. Render Instagram Feed
  renderInstagramFeed();

  // 5. Initialize Travel Blog
  initBlog();

  // 6. Initialize Booking Widget
  initBookingWidget();

  // 7. Setup FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      if (parent) {
        parent.classList.toggle('active');
      }
    });
  });

  // 8. Smooth Scroll for Nav Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  console.log('🌺 Plumeria & Waikiki Banyan Vacation Rentals App Initialized Successfully!');
});
