/**
 * Vexernoss Portfolio Manager
 * Advanced Version with Real Thumbnails
 */

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentEditingId = null;

// ==========================================
// MODAL MANAGEMENT
// ==========================================

function showAddForm() {
    const modal = document.getElementById('addProjectModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }, 10);
}

function hideAddForm() {
    const modal = document.getElementById('addProjectModal');
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }, 300);
}

function showEditForm(project) {
    currentEditingId = project.id;
    
    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editProjectTitle').value = project.title;
    document.getElementById('editProjectDescription').value = project.description;
    document.getElementById('editProjectUrl').value = project.url;
    
    const modal = document.getElementById('editProjectModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }, 10);
}

function hideEditForm() {
    const modal = document.getElementById('editProjectModal');
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentEditingId = null;
    }, 300);
}

function resetForm() {
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectUrl').value = '';
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.id === 'addProjectModal') hideAddForm();
    if (e.target.id === 'editProjectModal') hideEditForm();
});

// Close modals with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideAddForm();
        hideEditForm();
    }
});

// ==========================================
// REAL THUMBNAIL FUNCTIONS
// ==========================================

// TikTok Thumbnail - Using oEmbed
async function getTikTokThumbnail(url) {
    try {
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.thumbnail_url || null;
    } catch (error) {
        console.log('TikTok thumbnail failed, using default');
        return 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=500&fit=crop';
    }
}

// Instagram Thumbnail - Using Microlink API
async function getInstagramThumbnail(url) {
    try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.data?.image?.url || null;
    } catch (error) {
        console.log('Instagram thumbnail failed, using default');
        return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=500&fit=crop';
    }
}

// Facebook Thumbnail - Basic fallback
async function getFacebookThumbnail(url) {
    return 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?w=400&h=300&fit=crop';
}

// Twitter Thumbnail - Basic fallback  
async function getTwitterThumbnail(url) {
    return 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop';
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

// Detect platform and get REAL thumbnail
async function detectPlatform(url) {
    // YouTube - REAL Thumbnail
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        return {
            name: 'YouTube',
            icon: 'fab fa-youtube',
            thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop'
        };
    }
    
    // Instagram - REAL Thumbnail
    if (url.includes('instagram.com') || url.includes('instagr.am')) {
        const thumbnail = await getInstagramThumbnail(url);
        return {
            name: 'Instagram',
            icon: 'fab fa-instagram',
            thumbnail: thumbnail
        };
    }
    
    // TikTok - REAL Thumbnail
    if (url.includes('tiktok.com')) {
        const thumbnail = await getTikTokThumbnail(url);
        return {
            name: 'TikTok',
            icon: 'fab fa-tiktok',
            thumbnail: thumbnail
        };
    }
    
    // Facebook
    if (url.includes('facebook.com') || url.includes('fb.com')) {
        const thumbnail = await getFacebookThumbnail(url);
        return {
            name: 'Facebook',
            icon: 'fab fa-facebook',
            thumbnail: thumbnail
        };
    }
    
    // Twitter
    if (url.includes('twitter.com') || url.includes('x.com')) {
        const thumbnail = await getTwitterThumbnail(url);
        return {
            name: 'Twitter',
            icon: 'fab fa-twitter',
            thumbnail: thumbnail
        };
    }
    
    // Default/Unknown
    return {
        name: 'Website',
        icon: 'fas fa-globe',
        thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop'
    };
}

// ==========================================
// SUPABASE CRUD OPERATIONS
// ==========================================

// Save project to database with REAL thumbnails
async function saveProject() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const url = document.getElementById('projectUrl').value.trim();
    
    // Validation
    if (!title || !description || !url) {
        alert('Harap isi semua field!');
        return;
    }
    
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.innerHTML;
    
    // Show loading state
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengambil Thumbnail...';
    saveBtn.disabled = true;
    
    try {
        // Detect platform and get REAL thumbnail
        const platformInfo = await detectPlatform(url);
        let imageUrl = platformInfo.thumbnail;
        
        console.log('🖼️ Thumbnail URL:', imageUrl);
        
        // Save to Supabase
        const { data, error } = await supabase
            .from('Portfolio')
            .insert([
                { 
                    title: title,
                    description: description, 
                    url: url,
                    image_url: imageUrl,
                    platform: platformInfo.name,
                    platform_icon: platformInfo.icon,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        
        // Success
        hideAddForm();
        alert(`✅ Project berhasil ditambahkan dari ${platformInfo.name}!`);
        loadPortfolioProjects();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Gagal menambah project: ' + error.message);
    } finally {
        // Reset button state
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// Update project
async function updateProject() {
    const id = document.getElementById('editProjectId').value;
    const title = document.getElementById('editProjectTitle').value.trim();
    const description = document.getElementById('editProjectDescription').value.trim();
    const url = document.getElementById('editProjectUrl').value.trim();
    
    if (!title || !description || !url) {
        alert('Harap isi semua field!');
        return;
    }
    
    const updateBtn = document.getElementById('updateBtn');
    const originalText = updateBtn.innerHTML;
    
    updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    updateBtn.disabled = true;
    
    try {
        // Get new platform info if URL changed
        const platformInfo = await detectPlatform(url);
        
        const { data, error } = await supabase
            .from('Portfolio')
            .update({
                title: title,
                description: description,
                url: url,
                image_url: platformInfo.thumbnail,
                platform: platformInfo.name,
                platform_icon: platformInfo.icon,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
        
        if (error) throw error;
        
        hideEditForm();
        alert('✅ Project berhasil diupdate!');
        loadPortfolioProjects();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Gagal update project: ' + error.message);
    } finally {
        updateBtn.innerHTML = originalText;
        updateBtn.disabled = false;
    }
}

// Delete project
async function deleteProject(id, title) {
    if (!confirm(`Yakin hapus project "${title}"?`)) return;
    
    try {
        const { error } = await supabase
            .from('Portfolio')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        alert('✅ Project berhasil dihapus!');
        loadPortfolioProjects();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Gagal menghapus project: ' + error.message);
    }
}

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

// Update statistics - SUPER FIXED VERSION
function updateStats(projects) {
    console.log('🔄 FORCE UPDATING STATS...');
    
    // PAKAI CARA MANUAL - lebih reliable
    setTimeout(() => {
        try {
            const total = projects.length;
            const youtube = projects.filter(p => p.platform && p.platform === 'YouTube').length;
            const tiktok = projects.filter(p => p.platform && p.platform === 'TikTok').length;
            const instagram = projects.filter(p => p.platform && p.platform === 'Instagram').length;
            
            console.log('📊 FINAL STATS:', { 
                total, 
                youtube, 
                tiktok, 
                instagram,
                allPlatforms: projects.map(p => p.platform) // Debug platforms
            });
            
            // FORCE UPDATE - tanpa safety check
            const totalEl = document.getElementById('totalProjects');
            const youtubeEl = document.getElementById('youtubeProjects');
            const tiktokEl = document.getElementById('tiktokProjects');
            const instagramEl = document.getElementById('instagramProjects');
            
            if (totalEl) {
                totalEl.textContent = total;
                console.log('✅ TOTAL UPDATED:', total);
            }
            
            if (youtubeEl) {
                youtubeEl.textContent = youtube;
                console.log('✅ YOUTUBE UPDATED:', youtube);
            }
            
            if (tiktokEl) {
                tiktokEl.textContent = tiktok;
                console.log('✅ TIKTOK UPDATED:', tiktok);
            }
            
            if (instagramEl) {
                instagramEl.textContent = instagram;
                console.log('✅ INSTAGRAM UPDATED:', instagram);
            }
            
            // EMERGENCY: Coba update lagi setelah 1 detik
            setTimeout(() => {
                document.getElementById('totalProjects').textContent = total;
                document.getElementById('youtubeProjects').textContent = youtube;
                document.getElementById('tiktokProjects').textContent = tiktok;
                document.getElementById('instagramProjects').textContent = instagram;
                console.log('🔄 EMERGENCY STATS UPDATE DONE');
            }, 1000);
            
        } catch (error) {
            console.error('❌ CRITICAL ERROR in updateStats:', error);
        }
    }, 300);
}

// Create project HTML element with action buttons
function createProjectElement(project) {
    const element = document.createElement('div');
    element.className = 'portfolio-item-admin';
    element.innerHTML = `
        <div class="platform-badge">
            <i class="${project.platform_icon}"></i>
        </div>
        
        <div class="item-actions">
            <button class="btn btn-warning btn-sm" onclick="showEditForm(${JSON.stringify(project).replace(/"/g, '&quot;')})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id}, '${project.title.replace(/'/g, "\\'")}')">
                <i class="fas fa-trash"></i>
            </button>
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
            <h3>Belum Ada Project</h3>
            <p>Klik tombol "Tambah Project Baru" untuk menambah project pertama Anda.</p>
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
    console.log('🚀 Portfolio Manager loaded successfully!');
});
