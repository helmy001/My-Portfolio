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

// Open Modal Function
function openModal(card) {
    const title = card.dataset.title;
    const description = card.dataset.description;
    let info, templateSections;
    try {
        info = JSON.parse(card.dataset.info);
        templateSections = JSON.parse(card.dataset.template);
        slideUrls = JSON.parse(card.dataset.images);
    } catch (err) {
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
        slideDiv.innerHTML = `<img src="${url}" alt="Slide ${index + 1}" class="slide-image">`;
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
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateCarousel();
}

prevSlideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlideIndex = (currentSlideIndex - 1 + slideUrls.length) % slideUrls.length;
    updateCarousel();
});

nextSlideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlideIndex = (currentSlideIndex + 1) % slideUrls.length;
    updateCarousel();
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
        const allImages = [...mainImages, ...extras.map(e => `${folder}/${e}`)];
        
        card.dataset.images = JSON.stringify(allImages);
    });
});