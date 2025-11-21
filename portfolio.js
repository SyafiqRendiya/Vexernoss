/**
 * Vexernoss - Website Utama
 * Static Version for GitHub Pages
 */

// ==========================================
// STATIC PORTFOLIO DATA (SAMA DENGAN PORTFOLIO.JS)
// ==========================================

const staticPortfolioData = [
    {
        id: 1,
        title: "Gaming Montage Epic",
        description: "Montage gameplay dengan efek visual dan audio yang memukau",
        url: "https://youtube.com/watch?v=contoh1",
        image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=500&fit=crop", // UBAH KE PORTRAIT
        platform: "YouTube",
        platform_icon: "fab fa-youtube",
        created_at: "2024-01-15"
    },
    {
        id: 2,
        title: "TikTok Viral Challenge",
        description: "Video pendek dengan trend terbaru yang viral di TikTok",
        url: "https://tiktok.com/@user/video/12345",
        image_url: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=500&fit=crop",
        platform: "TikTok", 
        platform_icon: "fab fa-tiktok",
        created_at: "2024-01-10"
    },
    {
        id: 3,
        title: "Instagram Reels Tutorial",
        description: "Tutorial editing video untuk Instagram Reels",
        url: "https://instagram.com/p/CONTOH123",
        image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=500&fit=crop",
        platform: "Instagram",
        platform_icon: "fab fa-instagram", 
        created_at: "2024-01-05"
    }
];

// ==========================================
// ANIMATIONS & EFFECTS
// ==========================================

function initAnimations() {
    // App icons floating effect
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach((icon, index) => {
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 2;
        icon.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
    
    initParticles();
}

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 25;
    let particlesHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.2 + 0.1;
        const delay = Math.random() * 15;
        
        particlesHTML += `
            <div class="particle" style="
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${opacity};
                animation-delay: ${delay}s;
            "></div>
        `;
    }
    
    container.innerHTML = particlesHTML;
}

// ==========================================
// PORTFOLIO DISPLAY (STATIC - PORTRAIT)
// ==========================================

function loadPortfolioProjects() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = '';
    
    // Ambil 3 project pertama untuk homepage
    const homeProjects = staticPortfolioData.slice(0, 3);
    
    if (homeProjects.length > 0) {
        homeProjects.forEach(project => {
            const projectElement = createProjectElement(project);
            portfolioGrid.appendChild(projectElement);
        });
    } else {
        showEmptyState();
    }
}

function createProjectElement(project) {
    const element = document.createElement('div');
    element.className = 'portfolio-item';
    element.innerHTML = `
        <div class="platform-badge">
            <i class="${project.platform_icon}"></i>
        </div>
        
        <div class="portfolio-img">
            <img src="${project.image_url}" alt="${project.title}" loading="lazy">
        </div>
        
        <div class="portfolio-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.url}" target="_blank" class="portfolio-link">
                <i class="${project.platform_icon}"></i> Tonton di ${project.platform}
            </a>
        </div>
    `;
    return element;
}

function showEmptyState() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = `
        <div class="portfolio-item" style="text-align: center; padding: var(--space-xxl); opacity: 0.7;">
            <i class="fas fa-film" style="font-size: 3rem; margin-bottom: var(--space-md); opacity: 0.5;"></i>
            <h3>Portfolio Sedang Dipersiapkan</h3>
            <p>Kami sedang menyiapkan karya terbaik untuk ditampilkan di sini.</p>
        </div>
    `;
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    loadPortfolioProjects();
    console.log('🚀 Vexernoss website loaded successfully!');
});
