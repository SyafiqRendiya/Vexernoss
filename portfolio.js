/**
 * Vexernoss Portfolio - Public Version
 * FINAL: YouTube Shorts support + Better thumbnails
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

// Create project HTML element
function createProjectElement(project, index) {
    const element = document.createElement('div');
    element.className = 'portfolio-item';
    
    // TENTUKAN BEHAVIOR BERDASARKAN PLATFORM & JENIS CONTENT
    let clickAction = '';
    let overlayIcon = 'fa-external-link-alt';
    let linkText = 'View on ' + project.platform;
    
    if (project.platform === 'YouTube') {
        const isShort = project.url.includes('/shorts/');
        if (isShort) {
            // YouTube Shorts: Buka di tab baru
            clickAction = `openExternalLink('${project.url}')`;
            overlayIcon = 'fa-external-link-alt';
            linkText = 'Watch Short';
        } else {
            // YouTube biasa: Buka di modal
            clickAction = `openVideoModal(${index})`;
            overlayIcon = 'fa-play';
            linkText = 'Watch Video';
        }
    } else if (project.platform === 'TikTok') {
        // TikTok: Buka di modal
        clickAction = `openVideoModal(${index})`;
        overlayIcon = 'fa-play';
        linkText = 'Watch Video';
    } else {
        // Instagram & lainnya: Buka di tab baru
        clickAction = `openExternalLink('${project.url}')`;
        overlayIcon = 'fa-external-link-alt';
        linkText = 'View on ' + project.platform;
    }
    
    // THUMBNAIL SYSTEM - Fix untuk YouTube Shorts
    let thumbnailUrl = project.image_url;
    
    // Jika thumbnail dari YouTube gagal, pake fallback berdasarkan platform
    if (!thumbnailUrl || thumbnailUrl.includes('img.youtube.com')) {
        if (project.platform === 'YouTube') {
            const isShort = project.url.includes('/shorts/');
            if (isShort) {
                // Custom thumbnail untuk YouTube Shorts
                thumbnailUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=500&fit=crop';
            } else {
                // Custom thumbnail untuk YouTube biasa
                thumbnailUrl = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=500&fit=crop';
            }
        } else if (project.platform === 'TikTok') {
            thumbnailUrl = 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=500&fit=crop';
        } else if (project.platform === 'Instagram') {
            thumbnailUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=500&fit=crop';
        }
    }
    
    element.innerHTML = `
        <div class="platform-badge">
            <i class="${project.platform_icon}"></i>
        </div>
        
        <div class="portfolio-img" onclick="${clickAction}">
            <img src="${thumbnailUrl}" alt="${project.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop'">
            <div class="play-overlay">
                <div class="play-icon">
                    <i class="fas ${overlayIcon}"></i>
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
                    <i class="${project.platform_icon}"></i> ${linkText}
                </a>
                <small>${formatDate(project.created_at)}</small>
            </div>
        </div>
    `;
    
    setTimeout(() => checkDescriptionHeight(index), 100);
    return element;
}

// Open external link (for Instagram, YouTube Shorts, etc)
function openExternalLink(url) {
    window.open(url, '_blank');
}

// Check if description needs "Read More" button
function checkDescriptionHeight(index) {
    const descElement = document.getElementById(`desc-${index}`);
    const readMoreBtn = document.getElementById(`readMore-${index}`);
    
    if (descElement && descElement.scrollHeight > descElement.clientHeight) {
        readMoreBtn.style.display = 'block';
    }
}

// Toggle Read More
function toggleReadMore(index) {
    const descElement = document.getElementById(`desc-${index}`);
    const readMoreBtn = document.getElementById(`readMore-${index}`);
    
    if (!descElement) return;
    
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
        /youtube\.com\/v\/([^&?#]+)/,
        /youtube\.com\/shorts\/([^&?#]+)/  // Support YouTube Shorts
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

// Open Video Modal (YouTube regular & TikTok only)
function openVideoModal(index) {
    const project = currentProjects[index];
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    
    let videoEmbed = '';
    
    if (project.platform === 'YouTube') {
        const videoId = extractYouTubeId(project.url);
        if (videoId) {
            videoEmbed = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    class="youtube-iframe"
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
                    class="tiktok-iframe"
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
