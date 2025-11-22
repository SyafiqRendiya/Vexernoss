// THUMBNAIL SYSTEM - FIXED: Ambil thumbnail asli dari YouTube
let thumbnailUrl = project.image_url;

// Jika ini YouTube, coba ambil thumbnail asli
if (project.platform === 'YouTube') {
    const videoId = extractYouTubeId(project.url);
    if (videoId) {
        // Gunakan thumbnail asli dari YouTube
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
}
