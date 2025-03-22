// src/utils/fileHelpers.js

/**
 * Validates if a file is an acceptable type for the application
 * @param {File} file - The file to validate
 * @returns {boolean} Whether the file is a valid type
 */
export const isValidFileType = (file) => {
    if (!file) return false;
    return file.name.endsWith('.pdf') || file.name.endsWith('.txt');
  };
  
  /**
   * Formats the file size in a human-readable format
   * @param {number} bytes - The file size in bytes
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Extracts the filename without extension
   * @param {string} filename - The full filename
   * @returns {string} Filename without extension
   */
  export const getBaseFilename = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
  };