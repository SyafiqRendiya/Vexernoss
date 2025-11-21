/**
 * Vexernoss Portfolio Manager
 * Clean Public Version - No Admin Features
 */

// ==========================================
// PORTFOLIO DISPLAY FUNCTIONS
// ==========================================

// Load projects from database
async function loadPortfolioProjects() {
    try {
        console.log('🔍 Loading portfolio projects...');
        
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) {
            console.error('❌ portfolioGrid element not found!');
            return;
        }
        
        // Safety check for Supabase
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase not loaded yet');
            setTimeout(loadPortfolioProjects, 1000);
            return;
        }
        
        const { data: projects, error } = await supabase
            .from('Portfolio')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log('📦 Projects loaded from Supabase:', projects);
        
        portfolioGrid.innerHTML = '';
        
        if (projects && projects.length > 0) {
            // Update stats
            updateStats(projects);
            
            // Add projects to grid
            projects.forEach(project => {
                const projectElement = createProjectElement(project);
                portfolioGrid.appendChild(projectElement);
            });
            
            console.log('✅ Portfolio loaded successfully');
        } else {
            console.log('ℹ️ No projects found, showing empty state');
            showEmptyState();
        }
        
    } catch (error) {
        console.error('❌ Error loading portfolio:', error);
        showEmptyState();
    }
}

// Update statistics - SIMPLE VERSION
function updateStats(projects) {
    try {
        const total = projects.length;
        const youtube = projects.filter(p => p.platform === 'YouTube').length;
        const tiktok = projects.filter(p => p.platform === 'TikTok').length;
        const instagram = projects.filter(p => p.platform === 'Instagram').length;
        
        console.log('📊 Stats calculated:', { total, youtube, tiktok, instagram });
        
        // Direct update with safety check
        setTimeout(() => {
            if (document.getElementById('totalProjects')) {
                document.getElementById('totalProjects').textContent = total;
                document.getElementById('youtubeProjects').textContent = youtube;
                document.getElementById('tiktokProjects').textContent = tiktok;
                document.getElementById('instagramProjects').textContent = instagram;
                console.log('✅ Stats updated successfully');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error in updateStats:', error);
    }
}

// Create project HTML element - CLEAN PUBLIC VERSION (NO ADMIN BUTTONS)
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
    console.log('🚀 Portfolio Manager initialized!');
});
