# 🎨 Pixlib - Pixel Art Graffiti Library

A lightweight, zero-dependency JavaScript library for converting images into pixel art with graffiti-style color palettes. Perfect for creating retro-styled graphics, game assets, or artistic effects in your web applications.

## 🌐 Live Demo

Try it out: **[Pixlib Demo on GitHub Pages](https://katamini.github.io/pixlib/)**

## ✨ Features

- **Zero Dependencies** - Pure vanilla JavaScript, no external libraries required
- **Multiple Palette Styles** - Choose from graffiti, bright, or auto color palettes
- **Customizable** - Control pixel size, color count, and output dimensions
- **Browser-Friendly** - Works directly in the browser with easy integration
- **Smart Color Quantization** - Uses median cut algorithm for optimal color reduction
- **Multiple Input Sources** - Load from images, URLs, or File objects

## 📦 Installation

### Via CDN (Recommended)

Include Pixlib directly from jsDelivr CDN:

```html

<!-- Latest version (github) -->
<script src="https://github.com/katamini/pixlib/releases/download/v1.0.0/pixlib.min.js"></script>

<!-- Latest version (minified) -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@latest/dist/pixlib.min.js"></script>

<!-- Specific version (recommended for production) -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@v1.0.0/dist/pixlib.min.js"></script>

<!-- Full version with comments -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@latest/dist/pixlib.js"></script>
```

### Via GitHub Releases

Download `pixlib.min.js` from the [latest release](https://github.com/katamini/pixlib/releases/latest) and include it locally:

```html
<script src="path/to/pixlib.min.js"></script>
```

### Direct from Repository

```html
<script src="pixlib.js"></script>
```

## 🚀 Quick Start

### Basic Usage

```html
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@latest/dist/pixlib.min.js"></script>
<script>
  // Convert an image element
  const img = document.getElementById('myImage');
  const pixelArt = Pixlib.convert(img, {
    pixelSize: 8,
    colors: 16,
    palette: 'graffiti'
  });
  
  document.body.appendChild(pixelArt);
</script>
```

### Load from File

```javascript
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const canvas = await Pixlib.fromFile(file, {
    pixelSize: 10,
    colors: 20,
    palette: 'bright'
  });
  
  document.body.appendChild(canvas);
});
```

### Load from URL

```javascript
const canvas = await Pixlib.fromUrl('path/to/image.jpg', {
  pixelSize: 12,
  colors: 16,
  palette: 'graffiti'
});

document.body.appendChild(canvas);
```

## 📖 API Reference

### `Pixlib.convert(source, options)`

Converts an image or canvas to pixel art.

**Parameters:**
- `source` (HTMLImageElement | HTMLCanvasElement) - Source image or canvas
- `options` (Object) - Configuration options
  - `pixelSize` (number, default: 8) - Size of each pixel block (1-32+)
  - `colors` (number, default: 16) - Number of colors in palette (2-256)
  - `palette` (string, default: 'graffiti') - Palette style: 'auto', 'graffiti', or 'bright'
  - `maxWidth` (number, optional) - Maximum output width in pixels
  - `maxHeight` (number, optional) - Maximum output height in pixels

**Returns:** `HTMLCanvasElement` - Canvas containing the pixel art

**Example:**
```javascript
const img = document.getElementById('photo');
const result = Pixlib.convert(img, {
  pixelSize: 8,
  colors: 16,
  palette: 'graffiti',
  maxWidth: 800
});
```

### `Pixlib.fromUrl(url, options)`

Loads an image from a URL and converts it to pixel art.

**Parameters:**
- `url` (string) - Image URL
- `options` (Object) - Same options as `convert()`

**Returns:** `Promise<HTMLCanvasElement>` - Promise resolving to canvas with pixel art

**Example:**
```javascript
try {
  const canvas = await Pixlib.fromUrl('image.jpg', {
    pixelSize: 10,
    colors: 20
  });
  document.body.appendChild(canvas);
} catch (err) {
  console.error('Failed to convert:', err);
}
```

### `Pixlib.fromFile(file, options)`

Converts an image file/blob to pixel art.

**Parameters:**
- `file` (File | Blob) - Image file or blob
- `options` (Object) - Same options as `convert()`

**Returns:** `Promise<HTMLCanvasElement>` - Promise resolving to canvas with pixel art

**Example:**
```javascript
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const canvas = await Pixlib.fromFile(e.target.files[0], {
    pixelSize: 6,
    colors: 32,
    palette: 'bright'
  });
  document.body.appendChild(canvas);
});
```

## 🎭 Palette Styles

### Graffiti (default)
Bold, saturated colors with high contrast - perfect for street art style.
```javascript
Pixlib.convert(img, { palette: 'graffiti' });
```

### Bright
Very saturated, vibrant colors with enhanced brightness.
```javascript
Pixlib.convert(img, { palette: 'bright' });
```

### Auto
Natural color palette without adjustments - maintains original color relationships.
```javascript
Pixlib.convert(img, { palette: 'auto' });
```

## 🎮 Live Demo

Open `example.html` in your browser to see an interactive demo with:
- File upload support
- Live parameter adjustment
- Multiple palette styles
- Test pattern generator
- Download functionality

## 💡 Usage Examples

### Create a Thumbnail Gallery

```javascript
async function createPixelArtGallery(imageUrls) {
  const gallery = document.getElementById('gallery');
  
  for (const url of imageUrls) {
    const canvas = await Pixlib.fromUrl(url, {
      pixelSize: 10,
      colors: 16,
      palette: 'graffiti',
      maxWidth: 200,
      maxHeight: 200
    });
    gallery.appendChild(canvas);
  }
}
```

### Apply to Canvas

```javascript
const sourceCanvas = document.getElementById('drawingCanvas');
const pixelated = Pixlib.convert(sourceCanvas, {
  pixelSize: 4,
  colors: 32,
  palette: 'bright'
});

// Replace original with pixelated version
sourceCanvas.getContext('2d').drawImage(pixelated, 0, 0);
```

### Save Result

```javascript
const canvas = await Pixlib.fromUrl('photo.jpg', {
  pixelSize: 8,
  colors: 16
});

// Download as PNG
const link = document.createElement('a');
link.download = 'pixel-art.png';
link.href = canvas.toDataURL('image/png');
link.click();
```

## 🔧 Technical Details

### Color Quantization
Pixlib uses the **median cut algorithm** for intelligent color reduction. This algorithm:
1. Groups similar colors together
2. Splits color space into buckets
3. Averages each bucket to create palette colors
4. Maps each pixel to the nearest palette color

### Downsampling
Images are downsampled by averaging pixel blocks, which:
- Reduces noise and artifacts
- Creates smoother color transitions
- Maintains important image features

### Palette Adjustments
- **Graffiti**: Boosts saturation by 30%, increases contrast by adjusting lightness
- **Bright**: Boosts saturation by 50%, increases overall brightness
- **Auto**: No adjustments, uses quantized colors directly

## 🌐 Browser Compatibility

Works in all modern browsers supporting:
- HTML5 Canvas API
- ES6 Classes
- Uint8ClampedArray

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Module Systems

Pixlib supports multiple module systems:

**Browser Global (CDN):**
```html
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@latest/dist/pixlib.min.js"></script>
<script>
  const canvas = Pixlib.convert(img, options);
</script>
```

**Browser Global (Local):**
```html
<script src="pixlib.js"></script>
<script>
  const canvas = Pixlib.convert(img, options);
</script>
```

**CommonJS:**
```javascript
const Pixlib = require('./pixlib');
```

**AMD:**
```javascript
define(['pixlib'], function(Pixlib) {
  // Use Pixlib
});
```

## ⚡ Performance Tips

1. **Limit input size** - Use `maxWidth`/`maxHeight` for large images
2. **Adjust pixel size** - Larger pixels = faster processing
3. **Reduce color count** - Fewer colors = faster quantization
4. **Process off-thread** - Consider using Web Workers for large batches

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🎨 Credits

Created with ❤️ for the pixel art community.

## 📝 Changelog

### v1.0.0
- Initial release
- Core pixel art conversion
- Multiple palette styles
- URL and File loading support
- Interactive demo page
