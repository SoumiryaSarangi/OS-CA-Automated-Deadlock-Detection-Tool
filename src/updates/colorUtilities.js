/**
 * Color Utilities Module
 * 
 * Purpose: Standalone utility functions for color manipulation and conversion.
 * Provides helpers for:
 * - Converting between color formats (HEX, RGB, HSL)
 * - Generating color palettes
 * - Calculating color brightness and contrast
 * - Creating color gradients
 * 
 * This module is independent and does not connect to the main application.
 * Integrate manually if needed for future UI enhancements.
 */

/**
 * Convert HEX color to RGB object
 * @param {string} hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns {{r: number, g: number, b: number}} RGB color object
 */
export function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Convert RGB to HEX color string
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string with # prefix
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate relative luminance of a color (WCAG standard)
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Relative luminance (0-1)
 */
export function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG standard)
 * @param {string} hex1 - First color in hex format
 * @param {string} hex2 - Second color in hex format
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text color has sufficient contrast against background (WCAG AA)
 * @param {string} textColor - Text color in hex
 * @param {string} bgColor - Background color in hex
 * @returns {boolean} True if contrast ratio >= 4.5:1
 */
export function hasGoodContrast(textColor, bgColor) {
  return getContrastRatio(textColor, bgColor) >= 4.5;
}

/**
 * Lighten a color by a percentage
 * @param {string} hex - Color in hex format
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened color in hex format
 */
export function lighten(hex, percent) {
  const rgb = hexToRgb(hex);
  const factor = percent / 100;
  
  const r = rgb.r + (255 - rgb.r) * factor;
  const g = rgb.g + (255 - rgb.g) * factor;
  const b = rgb.b + (255 - rgb.b) * factor;
  
  return rgbToHex(r, g, b);
}

/**
 * Darken a color by a percentage
 * @param {string} hex - Color in hex format
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened color in hex format
 */
export function darken(hex, percent) {
  const rgb = hexToRgb(hex);
  const factor = 1 - (percent / 100);
  
  const r = rgb.r * factor;
  const g = rgb.g * factor;
  const b = rgb.b * factor;
  
  return rgbToHex(r, g, b);
}

/**
 * Generate a gradient between two colors
 * @param {string} startHex - Starting color in hex
 * @param {string} endHex - Ending color in hex
 * @param {number} steps - Number of gradient steps
 * @returns {string[]} Array of hex colors forming gradient
 */
export function generateGradient(startHex, endHex, steps) {
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  const gradient = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = start.r + (end.r - start.r) * ratio;
    const g = start.g + (end.g - start.g) * ratio;
    const b = start.b + (end.b - start.b) * ratio;
    gradient.push(rgbToHex(r, g, b));
  }
  
  return gradient;
}

/**
 * Generate complementary color (opposite on color wheel)
 * @param {string} hex - Color in hex format
 * @returns {string} Complementary color in hex format
 */
export function getComplementary(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

/**
 * Generate a random hex color
 * @returns {string} Random hex color
 */
export function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

/**
 * Generate a color palette with n colors evenly distributed on color wheel
 * @param {number} count - Number of colors in palette
 * @param {number} saturation - Saturation percentage (0-100)
 * @param {number} lightness - Lightness percentage (0-100)
 * @returns {string[]} Array of hex colors
 */
export function generatePalette(count, saturation = 70, lightness = 50) {
  const palette = [];
  const step = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = i * step;
    const color = hslToHex(hue, saturation, lightness);
    palette.push(color);
  }
  
  return palette;
}

/**
 * Convert HSL to HEX
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color string
 */
export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
