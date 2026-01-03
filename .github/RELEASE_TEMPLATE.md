# Release Notes Template

Use this template when creating a new release on GitHub.

## Release Title
```
Release v1.0.0
```

## Release Notes Body

```markdown
## 📦 Installation via CDN

You can include Pixlib directly from GitHub:

### Using jsDelivr CDN (Recommended)
```html
<!-- Minified version -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@v1.0.0/dist/pixlib.min.js"></script>

<!-- Or full version -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@v1.0.0/dist/pixlib.js"></script>
```

### Using GitHub Raw URLs
```html
<!-- Minified version -->
<script src="https://raw.githubusercontent.com/katamini/pixlib/v1.0.0/dist/pixlib.min.js"></script>

<!-- Or full version -->
<script src="https://raw.githubusercontent.com/katamini/pixlib/v1.0.0/dist/pixlib.js"></script>
```

## 📥 Distribution Files

This release includes:
- `pixlib.js` - Full source with comments (for development)
- `pixlib.min.js` - Minified for production (~5.6KB)
- `pixlib.min.js.map` - Source map for debugging

## 🚀 Usage

```javascript
// Convert an image to pixel art
const canvas = Pixlib.convert(imageElement, {
  pixelSize: 8,
  colors: 16,
  palette: 'graffiti'
});
```

## 📖 Documentation

See the [README](https://github.com/katamini/pixlib/blob/main/README.md) for full documentation.

## 🔄 What's Changed

<!-- Add your specific changes here -->
- Initial release
- Core pixel art conversion functionality
- Support for multiple palette styles (graffiti, bright, auto)
- URL and File loading support

---

**Full Changelog**: https://github.com/katamini/pixlib/commits/v1.0.0
```

## Notes

- Replace `v1.0.0` with your actual version number throughout
- Update the "What's Changed" section with actual changes
- The distribution files are automatically uploaded by the GitHub Action workflow
