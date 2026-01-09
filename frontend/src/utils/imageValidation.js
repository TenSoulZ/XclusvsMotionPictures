/**
 * Image validation utilities for file uploads
 */

/**
 * Validates image file type
 * @param {File} file - The file to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if file type is valid
 */
export const isValidImageType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']) => {
    if (!file) return false;
    return allowedTypes.includes(file.type.toLowerCase());
};

/**
 * Validates image file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in megabytes
 * @returns {boolean} True if file size is within limit
 */
export const isValidImageSize = (file, maxSizeMB = 5) => {
    if (!file) return false;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Validates image dimensions
 * @param {File} file - The image file
 * @param {Object} constraints - Dimension constraints
 * @param {number} constraints.minWidth - Minimum width in pixels
 * @param {number} constraints.minHeight - Minimum height in pixels
 * @param {number} constraints.maxWidth - Maximum width in pixels
 * @param {number} constraints.maxHeight - Maximum height in pixels
 * @returns {Promise<boolean>} Promise that resolves to true if dimensions are valid
 */
export const validateImageDimensions = (file, constraints = {}) => {
    return new Promise((resolve) => {
        if (!file) {
            resolve(false);
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const { minWidth = 0, minHeight = 0, maxWidth = Infinity, maxHeight = Infinity } = constraints;
            const isValid =
                img.width >= minWidth &&
                img.height >= minHeight &&
                img.width <= maxWidth &&
                img.height <= maxHeight;

            URL.revokeObjectURL(url);
            resolve(isValid);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(false);
        };

        img.src = url;
    });
};

/**
 * Comprehensive image validation
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSizeMB - Maximum file size in MB
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @param {Object} options.dimensions - Dimension constraints
 * @returns {Promise<{valid: boolean, errors: string[]}>} Validation result
 */
export const validateImage = async (file, options = {}) => {
    const {
        maxSizeMB = 5,
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        dimensions = null
    } = options;

    const errors = [];

    // Check if file exists
    if (!file) {
        errors.push('No file selected');
        return { valid: false, errors };
    }

    // Validate file type
    if (!isValidImageType(file, allowedTypes)) {
        errors.push(`Invalid file type. Allowed types: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`);
    }

    // Validate file size
    if (!isValidImageSize(file, maxSizeMB)) {
        errors.push(`File size exceeds ${maxSizeMB}MB limit (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Validate dimensions if constraints provided
    if (dimensions) {
        const dimensionsValid = await validateImageDimensions(file, dimensions);
        if (!dimensionsValid) {
            const { minWidth, minHeight, maxWidth, maxHeight } = dimensions;
            let dimError = 'Image dimensions do not meet requirements';
            if (minWidth || minHeight) {
                dimError += ` (min: ${minWidth || 0}x${minHeight || 0}px)`;
            }
            if (maxWidth || maxHeight) {
                dimError += ` (max: ${maxWidth || '∞'}x${maxHeight || '∞'}px)`;
            }
            errors.push(dimError);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Formats file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Creates a preview URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} Promise that resolves to preview URL
 */
export const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};
