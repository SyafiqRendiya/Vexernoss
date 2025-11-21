/**
 * Vexernoss - Website Utama
 * Clean Version - View Only Portfolio
 */

// ==========================================
// ANIMATIONS & EFFECTS
// ==========================================

// Initialize floating animations
function initAnimations() {
    // App icons floating effect
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach((icon, index) => {
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 2;
        icon.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
    
    // Initialize particles
    initParticles();
}

// Create background particles
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
// PORTFOLIO DISPLAY (VIEW ONLY)
// ==========================================

// Load projects from database (Limited to 6 for homepage)
async function loadPortfolioProjects() {
    try {
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;
        
        const { data: projects, error } = await supabase
            .from('Portfolio')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6); // Limit to 6 projects for homepage
        
        if (error) throw error;
        
        portfolioGrid.innerHTML = '';
        
        if (projects && projects.length > 0) {
            projects.forEach(project => {
                const projectElement = createProjectElement(project);
                portfolioGrid.appendChild(projectElement);
            });
        } else {
            showEmptyState();
        }
        
    } catch (error) {
        console.error('Error loading portfolio:', error);
        showEmptyState();
    }
}

// Create project HTML element (View Only)
function createProjectElement(project) {
    const element = document.createElement('div');
    element.className = 'portfolio-item';
    element.innerHTML = `
        <div class="platform-badge">
            <i class="${project.platform_icon}"></i>
        </div>
        
        <div class="portfolio-img">
            <img src="${project.image_url}" alt="${project.title}" loading="lazy" 
                 onerror="this.src='https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop'">
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

// Show empty state
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

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Adjust for header height
                
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    loadPortfolioProjects();
    
    console.log('🚀 Vexernoss website loaded successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Refresh portfolio when page becomes visible
        loadPortfolioProjects();
    }
});
