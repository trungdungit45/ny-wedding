// --- Responsive Nav ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}
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
const nameEl = document.getElementById('guestName');
const msgEl = document.getElementById('guestMessage');
const sendBtn = document.getElementById('sendMsg');
const listEl = document.getElementById('messagesList');

// THAY URL BẠN NHẬN ĐƯỢC TỪ GOOGLE APPS SCRIPT VÀO ĐÂY
const gg_ApiUrl = 'https://script.google.com/macros/s/AKfycbw7snxwwD80AoJbiK7ZFMfWPULh54TrPA6wNo-On44X-lPNJbkOS3VCSzUsZ91-AIm0xg/exec';

function esc(s) {
  return String(s).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

async function loadMessages() {
  if (!listEl || !gg_ApiUrl.startsWith('https')) return;
  try {
    listEl.innerHTML = '<p>Đang tải lời chúc...</p>';
    const response = await fetch(gg_ApiUrl);
    if (!response.ok) throw new Error('Failed to fetch messages');
    const messages = await response.json();

    if (messages.length === 0) {
      listEl.innerHTML = '<p>Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé! 💌</p>';
    } else {
      listEl.innerHTML = messages.map(m =>
        `<div class='msg-item'><strong>${esc(m.name || 'Khách')}</strong><p>${esc(m.text || '')}</p></div>`
      ).join('');
    }
  } catch (error) {
    console.error('Error loading messages:', error);
    listEl.innerHTML = '<p>Không thể tải lời chúc. Vui lòng thử lại sau.</p>';
  }
}

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const name = (nameEl.value || '').trim();
    const text = (msgEl.value || '').trim();
    if (text.length < 2) {ad
      alert('Viết đôi lời chúc trước khi gửi nhé 💌');
      return;
    }
    sendBtn.disabled = true;
    sendBtn.textContent = 'Đang gửi...';
    await fetch(gg_ApiUrl, { method: 'POST', body: JSON.stringify({ name, text }) });
    msgEl.value = '';
    sendBtn.disabled = false;
    sendBtn.textContent = 'Gửi lời chúc';
    await loadMessages();
  });
}

if (listEl) {
  loadMessages();
  // Tự động làm mới danh sách lời chúc mỗi 60 giây
  setInterval(loadMessages, 60000);
}


// --- Dynamic Gallery ---
const galleryContainer = document.getElementById('photo-gallery');

if (galleryContainer) {
  // Đây là danh sách TẤT CẢ các ảnh cưới của bạn.
  // Bạn có thể thêm bao nhiêu ảnh tùy thích vào danh sách này.
  // Đảm bảo các hình ảnh này nằm trong thư mục `assets/images/wedding_gallery/`
  const allImageFiles = [
  '002A7893.jpg',
  '002A7943.jpg',
  '002A8125.jpg',
  '002A8242.jpg',
  '002A8257.jpg',
  '002A8260.jpg',
  '002A8398.jpg',
  '002A8404.jpg',
  '002A8416.jpg',
  '002A8418.jpg',
  '002A8429.jpg',
  '002A8458.jpg',
  '002A8540.jpg',
  '002A8601.jpg',
  '002A8620.jpg',
  '002A8642.jpg',
  '002A8754.jpg',
  '002A8792.jpg',
  '002A8814.jpg',
  '002A8826.jpg',
  '002A8861.jpg',
  '002A8947.jpg'
  ];

  const galleryPath = 'assets/images/wedding_gallery/';

  // Hàm xáo trộn mảng (Fisher-Yates shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
    }
  }

  // Xáo trộn danh sách ảnh
  shuffleArray(allImageFiles);

  // Lấy 6 ảnh đầu tiên sau khi đã xáo trộn
  const selectedImages = allImageFiles.slice(0, 6);

  selectedImages.forEach(fileName => {
    const fullPath = galleryPath + fileName;
    // Tạo đường dẫn cho các kích thước ảnh khác nhau
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const smallPath = `${galleryPath}${baseName}${extension}`;
    const mediumPath = `${galleryPath}${baseName}${extension}`;

    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.dataset.photo = fullPath;

    const img = document.createElement('img');
    // Sử dụng ảnh nhỏ nhất làm ảnh mặc định
    img.src = smallPath;
    // Cung cấp các phiên bản ảnh khác nhau cho trình duyệt lựa chọn
    img.srcset = `${smallPath} 400w, ${mediumPath} 800w, ${fullPath} 1200w`;
    img.alt = 'Ảnh cưới của Trung Dũng và Thái Ninh';
    img.loading = 'lazy'; // Tải lười để tăng tốc độ trang

    anchor.appendChild(img);
    galleryContainer.appendChild(anchor);
  });
}

// ===== Lightbox functionality =====
const box = document.getElementById('lightbox');
const boxImg = document.getElementById('lightbox-img');
if (box && boxImg) {
  // Sử dụng event delegation để xử lý các mục được thêm động
  galleryContainer.addEventListener('click', (e) => {
    e.preventDefault();
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const url = anchor.getAttribute('data-photo');
    boxImg.src = url;
    box.showModal();
  });

  box.querySelector('.close-x').addEventListener('click', () => box.close());
  box.addEventListener('click', (e) => {
    if (e.target === box) box.close();
  });
  document.addEventListener('keydown', (e) => {
    if (box.open && e.key === 'Escape') {
      box.close();
    }
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