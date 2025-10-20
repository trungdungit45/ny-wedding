// --- Animation on Scroll ---
const intersectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        intersectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach(element => {
  intersectionObserver.observe(element);
});

// --- Countdown Timer ---
const d = document.getElementById('d'),
  h = document.getElementById('h'),
  m = document.getElementById('m'),
  s = document.getElementById('s');

const targetTime = new Date('2025-12-13T00:00:00+07:00').getTime();

function tick() {
  const now = Date.now();
  let diff = Math.max(0, targetTime - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);

  d.textContent = days;
  h.textContent = String(hours).padStart(2, '0');
  m.textContent = String(minutes).padStart(2, '0');
  s.textContent = String(seconds).padStart(2, '0');
}

if (d && h && m && s) {
  tick();
  setInterval(tick, 1000);
}

// --- Guest Messages ---
// This part for guest messages remains the same as it's quite specific.
// For a real application, you'd use a backend service instead of localStorage.
const KEY = 'wedding_messages'; const nameEl = document.getElementById('guestName'); const msgEl = document.getElementById('guestMessage'); const sendBtn = document.getElementById('sendMsg'); const listEl = document.getElementById('messagesList'); function load() { let a = []; try { a = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { a = []; } if (a.length === 0) { a = [{ name: 'Bạn thân', text: 'Chúc hai bạn trăm năm hạnh phúc! 💖' }, { name: 'Colleague', text: 'Chúc mừng hạnh phúc! Hẹn gặp tại White Palace!' }, { name: 'Gia đình', text: 'Luôn yêu thương và đồng hành cùng nhau nhé! 💍' }]; localStorage.setItem(KEY, JSON.stringify(a)); } return a; } function rnd(a, n) { const c = [...a]; const r = []; while (c.length && r.length < n) { const i = Math.floor(Math.random() * c.length); r.push(c.splice(i, 1)[0]); } return r; } function esc(s) { return String(s).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[s])); } function render() { const a = load(); const p = rnd(a, 3); listEl.innerHTML = p.map(m => `<div class='msg-item'><strong>${esc(m.name || 'Khách')}</strong><p>${esc(m.text || '')}</p></div>`).join(''); } if (listEl) { render(); setInterval(render, 10000); } if (sendBtn) { sendBtn.addEventListener('click', () => { const n = (nameEl.value || '').trim(); const t = (msgEl.value || '').trim(); if (t.length < 2) { alert('Viết đôi lời chúc trước khi gửi nhé 💌'); return; } const a = load(); a.push({ name: n || 'Khách', text: t, time: new Date().toISOString() }); localStorage.setItem(KEY, JSON.stringify(a)); msgEl.value = ''; render(); }); }

// ===== Lightbox functionality =====
  const box = document.getElementById('lightbox');
  const boxImg = document.getElementById('lightbox-img');
  if (box && boxImg) {
    document.querySelectorAll('#gallery .grid a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const url = a.getAttribute('data-photo');
        boxImg.src = url;
        box.showModal();
      });
    });
    box.querySelector('.close-x').addEventListener('click', () => box.close());
    box.addEventListener('click', (e) => {
      if (e.target === box) box.close();
    });
  }


// --- Background Music ---
const audio = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

if (musicBtn && audio) {
  musicBtn.addEventListener('click', async () => {
    try {
      if (!isPlaying) {
        await audio.play();
        isPlaying = true;
        musicBtn.textContent = '♫ Đang phát';
      } else {
        audio.pause();
        isPlaying = false;
        musicBtn.textContent = '♫ Nhạc: Tắt/Bật';
      }
    } catch (error) {
      // Autoplay might be blocked. A user interaction is needed.
      console.warn("Audio playback failed. User interaction might be required.", error);
      alert('Nhấn lại để bật nhạc nhé ♫');
    }
  });
}