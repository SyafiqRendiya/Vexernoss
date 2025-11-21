/**
 * Vexernoss Portfolio - Public Version
 * UPGRADED: Video Modal + Read More + Smaller Images
 */

// Global variables
let currentProjects = [];

// Load projects from database
async function loadPortfolioProjects() {
    try {
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;
        
        if (typeof supabase === 'undefined') {
            setTimeout(loadPortfolioProjects, 1000);
            return;
        }
        
        const { data: projects, error } = await supabase
            .from('Portfolio')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        portfolioGrid.innerHTML = '';
        currentProjects = projects || [];
        
        if (currentProjects.length > 0) {
            updateStats(currentProjects);
            currentProjects.forEach((project, index) => {
                const projectElement = createProjectElement(project, index);
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

// Create project HTML element - UPGRADED VERSION
function createProjectElement(project, index) {
    const element = document.createElement('div');
    element.className = 'portfolio-item';
    element.innerHTML = `
        <div class="platform-badge">
            <i class="${project.platform_icon}"></i>
        </div>
        
        <div class="portfolio-img" onclick="openVideoModal(${index})">
            <img src="${project.image_url}" alt="${project.title}" loading="lazy">
            <div class="play-overlay">
                <div class="play-icon">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        </div>
        
        <div class="portfolio-content">
            <h3>${project.title}</h3>
            <div class="portfolio-description">
                <div class="description-text" id="desc-${index}">
                    ${project.description}
                </div>
                <button class="read-more" onclick="toggleReadMore(${index})" id="readMore-${index}" style="display: none;">
                    Baca selengkapnya
                </button>
            </div>
            <div class="portfolio-footer">
                <a href="${project.url}" target="_blank" class="portfolio-link" onclick="event.stopPropagation()">
                    <i class="${project.platform_icon}"></i> View on ${project.platform}
                </a>
                <small>${formatDate(project.created_at)}</small>
            </div>
        </div>
    `;
    
    // Check if description needs "Read More"
    setTimeout(() => checkDescriptionHeight(index), 100);
    
    return element;
}

// Check if description needs "Read More" button
function checkDescriptionHeight(index) {
    const descElement = document.getElementById(`desc-${index}`);
    const readMoreBtn = document.getElementById(`readMore-${index}`);
    
    if (descElement.scrollHeight > descElement.clientHeight) {
        readMoreBtn.style.display = 'block';
    }
}

// Toggle Read More
function toggleReadMore(index) {
    const descElement = document.getElementById(`desc-${index}`);
    const readMoreBtn = document.getElementById(`readMore-${index}`);
    
    if (descElement.style.webkitLineClamp) {
        // Expand
        descElement.style.webkitLineClamp = 'unset';
        readMoreBtn.textContent = 'Sembunyikan';
    } else {
        // Collapse
        descElement.style.webkitLineClamp = '3';
        readMoreBtn.textContent = 'Baca selengkapnya';
    }
}

// Extract YouTube ID from URL
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/,
        /youtube\.com\/embed\/([^&?#]+)/,
        /youtube\.com\/v\/([^&?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Extract TikTok ID from URL
function extractTikTokId(url) {
    const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
    return match ? match[1] : null;
}

// Open Video Modal
function openVideoModal(index) {
    const project = currentProjects[index];
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    videoTitle.textContent = project.title;
    videoDescription.textContent = project.description;
    
    let videoEmbed = '';
    
    if (project.platform === 'YouTube') {
        const videoId = extractYouTubeId(project.url);
        if (videoId) {
            videoEmbed = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
            `;
        }
    } else if (project.platform === 'TikTok') {
        const videoId = extractTikTokId(project.url);
        if (videoId) {
            videoEmbed = `
                <iframe 
                    src="https://www.tiktok.com/embed/v2/${videoId}" 
                    allow="autoplay" 
                    allowfullscreen>
                </iframe>
            `;
        }
    }
    
    if (videoEmbed) {
        videoContainer.innerHTML = videoEmbed;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        // Fallback: open in new tab
        window.open(project.url, '_blank');
    }
}

// Close Video Modal
function closeVideo() {
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    
    modal.classList.remove('active');
    videoContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
    
    // Close modal with ESC key
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('videoModal');
    if (e.target === modal) {
        closeVideo();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideo();
    }
});

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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioProjects();
});
