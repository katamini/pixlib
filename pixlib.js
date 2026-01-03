/**
 * Pixlib - A lightweight JavaScript library for converting images to pixel art
 * with graffiti-style color palettes.
 * 
 * No dependencies - pure vanilla JavaScript for browser use.
 */

(function(global) {
  'use strict';

  /**
   * Main Pixlib class
   */
  class Pixlib {
    /**
     * Convert an image to pixel art
     * @param {HTMLImageElement|HTMLCanvasElement} source - Source image or canvas
     * @param {Object} options - Configuration options
     * @param {number} options.pixelSize - Size of each pixel block (default: 8)
     * @param {number} options.colors - Number of colors in palette (default: 16)
     * @param {string} options.palette - Palette type: 'auto', 'graffiti', 'bright' (default: 'graffiti')
     * @param {number} options.maxWidth - Maximum output width (optional)
     * @param {number} options.maxHeight - Maximum output height (optional)
     * @returns {HTMLCanvasElement} Canvas containing the pixel art
     */
    static convert(source, options = {}) {
      const opts = {
        pixelSize: options.pixelSize ?? 8,
        colors: options.colors ?? 16,
        palette: options.palette ?? 'graffiti',
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight
      };

      // Validate options
      if (opts.pixelSize < 1) {
        throw new Error('pixelSize must be at least 1');
      }
      if (opts.colors < 2 || opts.colors > 256) {
        throw new Error('colors must be between 2 and 256');
      }
      const validPalettes = ['auto', 'graffiti', 'bright'];
      if (validPalettes.indexOf(opts.palette) === -1) {
        throw new Error("palette must be one of 'auto', 'graffiti', or 'bright'");
      }

      // Create source canvas
      const sourceCanvas = this._getSourceCanvas(source);
      
      // Calculate dimensions
      let width = sourceCanvas.width;
      let height = sourceCanvas.height;
      
      if (opts.maxWidth && width > opts.maxWidth) {
        height = Math.floor(height * opts.maxWidth / width);
        width = opts.maxWidth;
      }
      if (opts.maxHeight && height > opts.maxHeight) {
        width = Math.floor(width * opts.maxHeight / height);
        height = opts.maxHeight;
      }

      // Prepare a working canvas that matches the adjusted dimensions
      let workingCanvas = sourceCanvas;
      if (width !== sourceCanvas.width || height !== sourceCanvas.height) {
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = width;
        resizedCanvas.height = height;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(sourceCanvas, 0, 0, width, height);
        workingCanvas = resizedCanvas;
      }

      // Calculate downsampled dimensions
      const downsampledWidth = Math.ceil(width / opts.pixelSize);
      const downsampledHeight = Math.ceil(height / opts.pixelSize);

      // Get downsampled image data
      const downsampledData = this._downsample(
        workingCanvas, 
        downsampledWidth, 
        downsampledHeight
      );

      // Apply color quantization
      const quantizedData = this._quantizeColors(
        downsampledData, 
        opts.colors,
        opts.palette
      );

      // Create output canvas
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = downsampledWidth * opts.pixelSize;
      outputCanvas.height = downsampledHeight * opts.pixelSize;
      const ctx = outputCanvas.getContext('2d');

      // Draw pixelated image
      for (let y = 0; y < downsampledHeight; y++) {
        for (let x = 0; x < downsampledWidth; x++) {
          const idx = (y * downsampledWidth + x) * 4;
          const r = quantizedData[idx];
          const g = quantizedData[idx + 1];
          const b = quantizedData[idx + 2];
          const a = quantizedData[idx + 3];

          ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
          ctx.fillRect(
            x * opts.pixelSize,
            y * opts.pixelSize,
            opts.pixelSize,
            opts.pixelSize
          );
        }
      }

      return outputCanvas;
    }

    /**
     * Convert source to canvas
     * @private
     */
    static _getSourceCanvas(source) {
      // Validate source parameter
      if (!source) {
        throw new Error('source parameter is required');
      }
      
      if (source instanceof HTMLCanvasElement) {
        return source;
      }

      // Check if source is an HTMLImageElement or has image-like properties
      if (!(source instanceof HTMLImageElement) && 
          (!source.width && !source.naturalWidth)) {
        throw new Error('source must be an HTMLImageElement or HTMLCanvasElement');
      }

      const canvas = document.createElement('canvas');
      canvas.width = source.width || source.naturalWidth;
      canvas.height = source.height || source.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(source, 0, 0);
      return canvas;
    }

    /**
     * Downsample image by averaging pixel blocks
     * @private
     */
    static _downsample(sourceCanvas, targetWidth, targetHeight) {
      const srcCtx = sourceCanvas.getContext('2d');
      const srcData = srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
      const pixels = srcData.data;

      const result = new Uint8ClampedArray(targetWidth * targetHeight * 4);
      const blockWidth = sourceCanvas.width / targetWidth;
      const blockHeight = sourceCanvas.height / targetHeight;

      for (let ty = 0; ty < targetHeight; ty++) {
        for (let tx = 0; tx < targetWidth; tx++) {
          let r = 0, g = 0, b = 0, a = 0;
          let count = 0;

          // Average the block
          const startX = Math.floor(tx * blockWidth);
          const startY = Math.floor(ty * blockHeight);
          const endX = Math.floor((tx + 1) * blockWidth);
          const endY = Math.floor((ty + 1) * blockHeight);

          for (let sy = startY; sy < endY; sy++) {
            for (let sx = startX; sx < endX; sx++) {
              if (sx < sourceCanvas.width && sy < sourceCanvas.height) {
                const idx = (sy * sourceCanvas.width + sx) * 4;
                r += pixels[idx];
                g += pixels[idx + 1];
                b += pixels[idx + 2];
                a += pixels[idx + 3];
                count++;
              }
            }
          }

          const resultIdx = (ty * targetWidth + tx) * 4;
          if (count > 0) {
            result[resultIdx] = Math.round(r / count);
            result[resultIdx + 1] = Math.round(g / count);
            result[resultIdx + 2] = Math.round(b / count);
            result[resultIdx + 3] = Math.round(a / count);
          } else {
            // Handle edge case with transparent pixel
            result[resultIdx] = 0;
            result[resultIdx + 1] = 0;
            result[resultIdx + 2] = 0;
            result[resultIdx + 3] = 0;
          }
        }
      }

      return result;
    }

    /**
     * Quantize colors using median cut algorithm
     * @private
     */
    static _quantizeColors(imageData, numColors, paletteType) {
      // Extract unique colors
      const colorMap = new Map();
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        const key = `${r},${g},${b},${a}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Convert to array of colors with counts
      const colors = Array.from(colorMap.entries()).map(([key, count]) => {
        const [r, g, b, a] = key.split(',').map(Number);
        return { r, g, b, a, count };
      });

      // If we already have fewer colors, just return
      if (colors.length <= numColors) {
        return imageData;
      }

      // Build palette using median cut
      const palette = this._medianCut(colors, numColors);

      // Apply palette adjustments based on type
      if (paletteType === 'graffiti') {
        this._adjustGraffitiPalette(palette);
      } else if (paletteType === 'bright') {
        this._adjustBrightPalette(palette);
      }

      // Map each pixel to nearest palette color
      const result = new Uint8ClampedArray(imageData.length);
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        const nearest = this._findNearestColor(palette, r, g, b, a);
        result[i] = nearest.r;
        result[i + 1] = nearest.g;
        result[i + 2] = nearest.b;
        result[i + 3] = nearest.a;
      }

      return result;
    }

    /**
     * Median cut algorithm for palette generation
     * @private
     */
    static _medianCut(colors, numColors) {
      if (colors.length <= numColors) {
        return colors.map(c => ({ r: c.r, g: c.g, b: c.b, a: c.a }));
      }

      const buckets = [colors];

      while (buckets.length < numColors) {
        // Find bucket with greatest range
        let maxRange = -1;
        let maxBucketIdx = 0;
        let maxChannel = 'r';

        buckets.forEach((bucket, idx) => {
          if (bucket.length <= 1) return;

          const ranges = {
            r: this._getRange(bucket, 'r'),
            g: this._getRange(bucket, 'g'),
            b: this._getRange(bucket, 'b')
          };

          const maxRangeInBucket = Math.max(ranges.r, ranges.g, ranges.b);
          if (maxRangeInBucket > maxRange) {
            maxRange = maxRangeInBucket;
            maxBucketIdx = idx;
            maxChannel = ranges.r >= ranges.g && ranges.r >= ranges.b ? 'r' :
                        ranges.g >= ranges.b ? 'g' : 'b';
          }
        });

        if (maxRange <= 0) break;

        // Split bucket
        const bucket = buckets[maxBucketIdx];
        bucket.sort((a, b) => a[maxChannel] - b[maxChannel]);
        const medianIdx = Math.floor(bucket.length / 2);
        
        buckets.splice(maxBucketIdx, 1,
          bucket.slice(0, medianIdx),
          bucket.slice(medianIdx)
        );
      }

      // Average each bucket to get palette
      return buckets.map(bucket => {
        if (bucket.length === 0) {
          return { r: 0, g: 0, b: 0, a: 255 };
        }
        const totalWeight = bucket.reduce((sum, c) => sum + c.count, 0);
        if (totalWeight === 0) {
          return { r: 0, g: 0, b: 0, a: 255 };
        }
        const r = bucket.reduce((sum, c) => sum + c.r * c.count, 0) / totalWeight;
        const g = bucket.reduce((sum, c) => sum + c.g * c.count, 0) / totalWeight;
        const b = bucket.reduce((sum, c) => sum + c.b * c.count, 0) / totalWeight;
        const a = bucket.reduce((sum, c) => sum + c.a * c.count, 0) / totalWeight;
        return {
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b),
          a: Math.round(a)
        };
      });
    }

    /**
     * Get range of channel values in bucket
     * @private
     */
    static _getRange(bucket, channel) {
      if (bucket.length === 0) return 0;
      const values = bucket.map(c => c[channel]);
      return Math.max(...values) - Math.min(...values);
    }

    /**
     * Apply graffiti-style palette adjustments (boost saturation and contrast)
     * @private
     */
    static _adjustGraffitiPalette(palette) {
      palette.forEach(color => {
        // Convert to HSL
        const hsl = this._rgbToHsl(color.r, color.g, color.b);
        
        // Boost saturation
        hsl.s = Math.min(1, hsl.s * 1.3);
        
        // Increase contrast (push towards extremes)
        if (hsl.l < 0.5) {
          hsl.l = Math.max(0, hsl.l * 0.85);
        } else {
          hsl.l = Math.min(1, hsl.l * 1.1);
        }

        // Convert back to RGB
        const rgb = this._hslToRgb(hsl.h, hsl.s, hsl.l);
        color.r = rgb.r;
        color.g = rgb.g;
        color.b = rgb.b;
      });
    }

    /**
     * Apply bright palette adjustments
     * @private
     */
    static _adjustBrightPalette(palette) {
      palette.forEach(color => {
        const hsl = this._rgbToHsl(color.r, color.g, color.b);
        hsl.s = Math.min(1, hsl.s * 1.5);
        hsl.l = Math.min(1, Math.max(0.3, hsl.l * 1.2));
        const rgb = this._hslToRgb(hsl.h, hsl.s, hsl.l);
        color.r = rgb.r;
        color.g = rgb.g;
        color.b = rgb.b;
      });
    }

    /**
     * RGB to HSL conversion
     * @private
     */
    static _rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      let h = 0;
      let s = 0;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      return { h, s, l };
    }

    /**
     * HSL to RGB conversion
     * @private
     */
    static _hslToRgb(h, s, l) {
      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    }

    /**
     * Find nearest color in palette
     * @private
     */
    static _findNearestColor(palette, r, g, b, a) {
      if (palette.length === 0) {
        return { r: 0, g: 0, b: 0, a: 255 };
      }
      
      let minDist = Infinity;
      let nearest = palette[0];

      for (const color of palette) {
        // Euclidean distance in RGBA space
        const dr = r - color.r;
        const dg = g - color.g;
        const db = b - color.b;
        const da = a - color.a;
        const dist = dr * dr + dg * dg + db * db + da * da;

        if (dist < minDist) {
          minDist = dist;
          nearest = color;
        }
      }

      return nearest;
    }

    /**
     * Convert image from URL to pixel art
     * @param {string} url - Image URL
     * @param {Object} options - Configuration options (same as convert())
     * @returns {Promise<HTMLCanvasElement>} Promise resolving to canvas with pixel art
     */
    static fromUrl(url, options = {}) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = () => {
          try {
            const canvas = this.convert(img, options);
            resolve(canvas);
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image from URL'));
        };
        
        img.src = url;
      });
    }

    /**
     * Convert image from File/Blob to pixel art
     * @param {File|Blob} file - Image file
     * @param {Object} options - Configuration options (same as convert())
     * @returns {Promise<HTMLCanvasElement>} Promise resolving to canvas with pixel art
     */
    static fromFile(file, options = {}) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          this.fromUrl(e.target.result, options)
            .then(resolve)
            .catch(reject);
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
      });
    }
  }

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pixlib;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => Pixlib);
  } else {
    global.Pixlib = Pixlib;
  }

})(typeof window !== 'undefined' ? window : this);
