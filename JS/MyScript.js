/* ================== Sidebar Toggle ================= */
const mobileMenu = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
const backdrop = document.querySelector('.sidebar-backdrop');

const toggleSidebar = () => {
    sidebar.classList.toggle('active');
    backdrop.classList.toggle('active');
    mobileMenu.querySelector('i').classList.toggle('fa-times');
};

mobileMenu.addEventListener('click', toggleSidebar);
backdrop.addEventListener('click', toggleSidebar);

// Close sidebar on navigation click (mobile)
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 1024) toggleSidebar();
    });
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && 
        !mobileMenu.contains(e.target) && 
        sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

/* ================= Form Submission =============== */
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    e.target.reset();
});

/* ================== Window Resize Handler =================== */
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('active');
        backdrop.classList.remove('active');
        mobileMenu.querySelector('i').classList.remove('fa-times');
    }
});

/* =================== Modal Details & Carousel ================ */
// Global Modal Variables
let autoSlideInterval;
let isHovering = false;
let isMouseDown = false;

const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');

// Carousel Variables
const carouselSlider = document.getElementById('carouselSlider');
const carouselDots = document.getElementById('carouselDots');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
let slideUrls = [];
let currentSlideIndex = 0;

// Detail Sections Container & Project Info Container
const detailSections = document.getElementById('detailSections');
const projectInfoContainer = document.getElementById('projectInfo');

// Event Listeners for Project Cards
document.querySelectorAll('.project-card').forEach(card => {
    const detailsBtn = card.querySelector('.view-details-btn');
    if(detailsBtn){
        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(card);
        });
    }
});

/* =================== Auto slide ================ */
// Function to start auto slide
function startAutoSlide() {
    if (!isMouseDown) {
        // Clear any existing timeout
        if (autoSlideInterval) clearTimeout(autoSlideInterval);
        
        // Determine current slide type and set delay
        const currentSlideUrl = slideUrls[currentSlideIndex];
        if (!currentSlideUrl) return;
        
        const isGif = currentSlideUrl.toLowerCase().endsWith('.gif');
        const isWebp = currentSlideUrl.toLowerCase().endsWith('.webp');
        const delay = (isGif||isWebp) ? 9000 : 2000; // 5s for GIFs, 2s for images
        
        autoSlideInterval = setTimeout(() => {
            nextSlideBtn.click();
        }, delay);
    }
}

// Mouse hold detection
carouselSlider.addEventListener('mousedown', () => {
    isMouseDown = true;
    clearInterval(autoSlideInterval);
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
    startAutoSlide();
});

// Touch device support
carouselSlider.addEventListener('touchstart', () => {
    isMouseDown = true;
    clearInterval(autoSlideInterval);
});

document.addEventListener('touchend', () => {
    isMouseDown = false;
    startAutoSlide();
});

/* =================== Open Modal Function ================ */

function openModal(card) {
    const title = card.dataset.title;
    const description = card.dataset.description;

    let info, templateSections,ImgDesc;
    try {
        info = JSON.parse(card.dataset.info);
        templateSections = JSON.parse(card.dataset.template);
        slideUrls = JSON.parse(card.dataset.images);
        ImgDesc = JSON.parse(card.dataset.imagedesc || '[]');
        // Ensure ImgDesc matches slide count
        if (!Array.isArray(ImgDesc)) ImgDesc = [];
        ImgDesc = [...ImgDesc, ...Array(Math.max(slideUrls.length - ImgDesc.length, 0)).fill('')];

        }catch (err) {
            console.error('Error parsing JSON data from card:', err);
            return;
        }   

    // Populate Project Info
    projectInfoContainer.innerHTML = `
        <p><strong>Date:</strong> ${info.Date || 'N/A'}</p>
        <p><strong>Category:</strong> ${info.Category || 'N/A'}</p>
        <p><strong>Technology:</strong> ${info.Tech || 'N/A'}</p>
    `;

    // Populate Carousel
    currentSlideIndex = 0;
    carouselSlider.innerHTML = '';
    carouselDots.innerHTML = '';
    slideUrls.forEach((url, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        slideDiv.innerHTML = `
        <img src="${url}" alt="Slide ${index + 1}" class="slide-image">
        <div class="image-description">
            <span class="description-number">${(index + 1).toString().padStart(2, '0')}</span>
            <span class="description-text">${ImgDesc[index]}</span>
        </div>
        `;
        carouselSlider.appendChild(slideDiv);

        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
    updateCarousel();
    // Populate Detail Sections using template
    detailSections.innerHTML = '';
    templateSections.forEach(section => {
        const secDiv = document.createElement('div');
        secDiv.className = 'detail-section';
        secDiv.innerHTML = `
            <h3 class="detail-title">${section.title}</h3>
            <div class="detail-content">${section.content}</div>
        `;
        detailSections.appendChild(secDiv);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Carousel Functions
function updateCarousel() {
    carouselSlider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    Array.from(carouselDots.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
    });
    // Restart auto-slide when slide changes
    startAutoSlide();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateCarousel();
    // Reset auto-slide timing for new slide
    if (autoSlideInterval) clearTimeout(autoSlideInterval);
    startAutoSlide();
}

prevSlideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlideIndex = (currentSlideIndex - 1 + slideUrls.length) % slideUrls.length;
    updateCarousel();
    if (autoSlideInterval) clearTimeout(autoSlideInterval);
    startAutoSlide();
});

nextSlideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlideIndex = (currentSlideIndex + 1) % slideUrls.length;
    updateCarousel();
    if (autoSlideInterval) clearTimeout(autoSlideInterval);
    startAutoSlide();
});

/* ============= Modal Close ============== */
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if(e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
    if(modalOverlay.classList.contains('active') && e.key === 'Escape') closeModal();
});

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    currentSlideIndex = 0; // Reset to first slide
}

/* ============= Projects Images Query ============== */

document.addEventListener('DOMContentLoaded', () => {
    const generatePaths = (folder, count, ext = 'png') => 
        Array.from({length: count}, (_, i) => `${folder}/${i+1}.${ext}`);

    document.querySelectorAll('[data-image-generate]').forEach(card => {
        const folder = card.dataset.folder;
        const count = parseInt(card.dataset.count);
        const ext = card.dataset.ext || 'png';
        const extras = JSON.parse(card.dataset.extras || '[]');
        
        // Generate main numbered images
        const mainImages = generatePaths(folder, count, ext);
        
        // Add explicit extra files
        const allImages = [ ...extras.map(e => `${folder}/${e}`) , ...mainImages];
        
        card.dataset.images = JSON.stringify(allImages);
    });
});

/* ============= Projects 3d Tilt Effect============== */
// Add to script.js
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.transform = `
        perspective(1000px)
        rotateX(${(y - rect.height/2) * -0.02}deg)
        rotateY(${(x - rect.width/2) * 0.04}deg)
      `;
    });
  
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});




// JavaScript to handle individual hover images
document.querySelectorAll('.card-image').forEach(card => {
    const hoverImage = card.dataset.hoverImage;
    if(hoverImage) {
      // Preload hover image
      const img = new Image();
      img.src = hoverImage;
      
      // Set CSS variable when loaded
      img.onload = () => {
        card.style.setProperty('--hover-image', `url('${hoverImage}')`);
      };
    }
  });