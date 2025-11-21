/**
 * Vexernoss - Static Portfolio Data
 * Untuk Halaman Portfolio
 */

const staticPortfolioData = [
    {
        id: 1,
        title: "Gaming Montage Epic",
        description: "Montage gameplay dengan efek visual dan audio yang memukau",
        url: "https://youtube.com/watch?v=contoh1",
        image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=500&fit=crop",
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

// Load static portfolio data
function loadPortfolioProjects() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = '';
    
    if (staticPortfolioData.length > 0) {
        // Update stats
        updateStats(staticPortfolioData);
        
        // Add projects to grid
        staticPortfolioData.forEach(project => {
            const projectElement = createProjectElement(project);
            portfolioGrid.appendChild(projectElement);
        });
    } else {
        showEmptyState();
    }
}

// Update statistics
function updateStats(projects) {
    const total = projects.length;
    const youtube = projects.filter(p => p.platform === 'YouTube').length;
    const tiktok = projects.filter(p => p.platform === 'TikTok').length;
    const instagram = projects.filter(p => p.platform === 'Instagram').length;
    
    document.getElementById('totalProjects').textContent = total;
    document.getElementById('youtubeProjects').textContent = youtube;
    document.getElementById('tiktokProjects').textContent = tiktok;
    document.getElementById('instagramProjects').textContent = instagram;
}

// Create project HTML element (View Only - No actions)
function createProjectElement(project) {
    const element = document.createElement('div');
    element.className = 'portfolio-item-admin';
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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md);">
                <a href="${project.url}" target="_blank" class="portfolio-link">
                    <i class="${project.platform_icon}"></i> View on ${project.platform}
                </a>
                <small style="opacity: 0.7;">${formatDate(project.created_at)}</small>
            </div>
        </div>
    `;
    return element;
}

// Show empty state
function showEmptyState() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-film"></i>
            <h3>Portfolio Coming Soon</h3>
            <p>We're preparing amazing projects to showcase here.</p>
        </div>
    `;
    
    // Reset stats
    document.getElementById('totalProjects').textContent = '0';
    document.getElementById('youtubeProjects').textContent = '0';
    document.getElementById('tiktokProjects').textContent = '0';
    document.getElementById('instagramProjects').textContent = '0';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioProjects();
    console.log('🚀 Static Portfolio loaded successfully!');
});
