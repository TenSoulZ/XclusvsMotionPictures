/**
 * Utility to generate optimized ImageKit URLs dynamically.
 * 
 * @param {string} url - Original image URL
 * @param {number} width - Desired width (optional)
 * @param {number} height - Desired height (optional) 
 * @param {number} quality - Image quality 1-100 (default 80)
 * @returns {string} - Optimized URL with transformation parameters
 */
export const optimizeImage = (url, width = null, height = null, quality = 80) => {
    if (!url) return url;
    
    // Check if it's an ImageKit URL
    if (url.includes('ik.imagekit.io')) {
        let transformStr = `tr=q-${quality},f-auto`;
        if (width) transformStr += `,w-${width}`;
        if (height) transformStr += `,h-${height}`;
        
        // Prevent duplicate transformations if already present
        if (url.includes('tr=')) return url;

        // Append query parameters
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${transformStr}`;
    }
    
    return url;
};
