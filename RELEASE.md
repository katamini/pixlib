# Release Process

This document explains how to create a new release of Pixlib with distribution files.

## Creating a Release

### Process Overview

1. **Create a GitHub Release** through the GitHub UI or API
2. **The GitHub Action automatically**:
   - Builds and minifies the library
   - Uploads distribution files to the release (pixlib.js, pixlib.min.js, pixlib.min.js.map)

### Step-by-Step Instructions

1. Go to the [Releases page](https://github.com/katamini/pixlib/releases) in the repository
2. Click **"Draft a new release"**
3. Click **"Choose a tag"** and create a new tag (e.g., `v1.0.0`)
4. Enter a release title (e.g., `Release v1.0.0`)
5. Add release notes describing the changes
6. Click **"Publish release"**
7. The GitHub Action will automatically:
   - Trigger when the release is published
   - Minify the library using terser
   - Upload the distribution files to the release

### Alternative: Using Git CLI

You can also create a release using the GitHub CLI:

```bash
# Create and push a tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Then create a release on GitHub (requires gh CLI)
gh release create v1.0.0 --title "Release v1.0.0" --notes "Release notes here"
```

The workflow will trigger automatically when the release is published.

## Distribution Files

Each release includes:

- **pixlib.js** - Full source code with comments (for development)
- **pixlib.min.js** - Minified version (for production)
- **pixlib.min.js.map** - Source map for debugging

## CDN Usage

Once released, users can include Pixlib via CDN:

### jsDelivr (Recommended)
```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@latest/dist/pixlib.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/gh/katamini/pixlib@v1.0.0/dist/pixlib.min.js"></script>
```

### GitHub Raw URLs
```html
<script src="https://raw.githubusercontent.com/katamini/pixlib/v1.0.0/dist/pixlib.min.js"></script>
```

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version (v2.0.0) - Incompatible API changes
- **MINOR** version (v1.1.0) - New functionality, backwards compatible
- **PATCH** version (v1.0.1) - Bug fixes, backwards compatible

## Checklist for Releases

Before creating a release:
- [ ] Update version number if needed in documentation
- [ ] Test the library functionality
- [ ] Update CHANGELOG if you have one
- [ ] Ensure all tests pass
- [ ] Review and merge any pending PRs
- [ ] Create and push the version tag

## Troubleshooting

### Release workflow failed
- Check the [Actions tab](https://github.com/katamini/pixlib/actions) for error details
- Ensure the version tag doesn't already exist
- Verify the workflow file syntax is correct

### CDN not updating
- jsDelivr may cache files for up to 24 hours
- Force refresh: Add `?v=version` query parameter
- Use specific version tags instead of `@latest` for production

## Notes

- GitHub releases are immutable - you cannot edit the attached files
- To fix a release, create a new patch version
- The `dist/` directory is gitignored but files are included in releases
- CDN URLs work immediately after release creation
