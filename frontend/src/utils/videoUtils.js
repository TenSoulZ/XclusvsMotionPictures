/**
 * Video utility functions for handling video URLs and embed codes
 */

/**
 * Extracts and converts video URLs to embeddable format
 * Supports YouTube and Vimeo URLs
 * 
 * @param {string} url - The video URL (YouTube or Vimeo)
 * @returns {string} The embed URL ready for iframe src
 * 
 * @example
 * // YouTube
 * getEmbedUrl('https://youtube.com/watch?v=abc123')
 * // Returns: 'https://youtube.com/embed/abc123'
 * 
 * @example
 * // Vimeo
 * getEmbedUrl('https://vimeo.com/123456789')
 * // Returns: 'https://player.vimeo.com/video/123456789'
 */
export const getEmbedUrl = (url) => {
    if (!url) return '';
    let embedUrl = url;

    // Normalize URL
    url = url.trim();

    // YouTube URL conversion
    if (url.includes('youtube.com/watch?v=')) {
        embedUrl = url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
    } else if (url.includes('youtube.com/live/')) {
        embedUrl = url.replace('youtube.com/live/', 'youtube.com/embed/');
    }

    // Handle parameters (like t= or autoplay)
    if (embedUrl.includes('youtube.com/embed/')) {
        // Remove existing query params if they aren't embed-friendly
        const parts = embedUrl.split('?');
        embedUrl = parts[0];
    }

    // Facebook URL conversion
    else if (url.includes('facebook.com') || url.includes('fb.watch')) {
        // Facebook embeds require the full post URL
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    }

    // Twitch URL conversion
    else if (url.includes('twitch.tv')) {
        const channel = url.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
        if (channel) {
            // Twitch embedding requires a parent domain in some contexts, but for general use:
            // We'll assume the current domain is valid or use a wildcard approach if possible, 
            // but Twitch strictness usually requires 'parent' param matching the hosting site.
            // For localhost dev, 'localhost' is needed. For production, the actual domain.

            // Note: In a real production environment, you need to append &parent=yourdomain.com
            // We will add logic to handle common environments dynamically if possible, or defaulting to a safe fallback.
            const origin = window.location.hostname;
            embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${origin}`;
        }
    }

    return embedUrl;
};

/**
 * Extracts video ID from YouTube or Vimeo URL
 * 
 * @param {string} url - The video URL
 * @returns {string|null} The video ID or null if not found
 */
export const getVideoId = (url) => {
    if (!url) return null;

    // YouTube ID extraction
    if (url.includes('youtube.com/watch?v=')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        return url.split('youtube.com/embed/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/live/')) {
        return url.split('youtube.com/live/')[1]?.split('?')[0];
    }

    // Vimeo ID extraction
    if (url.includes('vimeo.com/')) {
        return url.split('vimeo.com/')[1]?.split('/')[0];
    }

    return null;
};

/**
 * Gets thumbnail URL for a video
 * 
 * @param {string} url - The video URL
 * @param {string} quality - Thumbnail quality ('default', 'medium', 'high', 'maxres')
 * @returns {string} The thumbnail URL
 */
export const getVideoThumbnail = (url, quality = 'maxresdefault') => {
    const videoId = getVideoId(url);

    if (!videoId) return '';

    // YouTube thumbnail
    if (url.includes('youtube') || url.includes('youtu.be')) {
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    }

    // Vimeo requires API call, return placeholder
    if (url.includes('vimeo')) {
        // In production, you'd want to use Vimeo API to get actual thumbnail
        return `https://vumbnail.com/${videoId}.jpg`;
    }

    return '';
};

/**
 * Validates if a URL is a valid video URL
 * 
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid video URL
 */
export const isValidVideoUrl = (url) => {
    if (!url) return false;

    const youtubePattern = /(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)/;
    const vimeoPattern = /vimeo\.com\/\d+/;
    const facebookPattern = /(facebook\.com\/|fb\.watch\/)/;
    const twitchPattern = /twitch\.tv\//;

    return youtubePattern.test(url) || vimeoPattern.test(url) || facebookPattern.test(url) || twitchPattern.test(url);
};
