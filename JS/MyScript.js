
/* ========= ========= ========= Sidebar Toggle ========= ========= ========= */
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


/* ========= ========= ========= Smooth Scroll ========= ========= ========= */

/*document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Section Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});*/

/* ========= ========= ========= Form Submission ========= ========= ========= */

document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    e.target.reset();
  });

/* ========= ========= ========= Window resize handler ========= ========= ========= */
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('active');
        backdrop.classList.remove('active');
        mobileMenu.querySelector('i').classList.remove('fa-times');
    }
});

/* ========= ========= ========= Modal Details ========= ========= ========= */
/* ===== Global Modal Variables ===== */
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');

/* ===== Carousel Variables ===== */
const carouselSlider = document.getElementById('carouselSlider');
const carouselDots = document.getElementById('carouselDots');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
let slideUrls = [];
let currentSlideIndex = 0;

/* ===== Detail Sections Container ===== */
const detailSections = document.getElementById('detailSections');
const projectInfoContainer = document.getElementById('projectInfo');

/* ===== Event Listeners for Project Cards ===== */
document.querySelectorAll('.project-card').forEach(card => {
    card.querySelector('.view-details-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(card);
    });
});

/* ===== Open Modal Function ===== */
function openModal(card) {
    // Read basic data
    const title = card.dataset.title;
    const description = card.dataset.description;
    const info = JSON.parse(card.dataset.info); // expects an object with keys (Date, Category, Tech, etc.)
    const templateSections = JSON.parse(card.dataset.template); // array of objects with title & content
    slideUrls = JSON.parse(card.dataset.images); // array of image URLs

    // Populate Project Info Sidebar
    projectInfoContainer.innerHTML = `
        <p><strong>Date:</strong> ${info.Date || 'N/A'}</p>
        <p><strong>Category:</strong> ${info.Category || 'N/A'}</p>
        <p><strong>Technology:</strong> ${info.Tech || 'N/A'}</p>`;

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

    // Populate Dynamic Detail Sections using the provided template
    detailSections.innerHTML = '';
    templateSections.forEach(section => {
        const secDiv = document.createElement('div');
        secDiv.className = 'detail-section';
        secDiv.innerHTML = `
        <h3 class="detail-title">${section.title}</h3>
        <div class="detail-content">${section.content}</div>`;
        detailSections.appendChild(secDiv);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}