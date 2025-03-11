
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

