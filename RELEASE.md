# Release Process

This document explains how to create a new release of Pixlib with distribution files.

## Creating a Release

### Method 1: Using Git Tags (Recommended)

1. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The GitHub Action will automatically:
   - Minify the library
   - Create a GitHub Release
   - Upload distribution files (pixlib.js, pixlib.min.js, pixlib.min.js.map)
   - Generate release notes with CDN usage instructions

### Method 2: Manual Workflow Dispatch

1. Go to [Actions](https://github.com/katamini/pixlib/actions/workflows/release.yml) in the repository
2. Click "Run workflow"
3. Enter the version number (e.g., v1.0.1)
4. Click "Run workflow"

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

### unpkg
```html
<script src="https://unpkg.com/katamini/pixlib@v1.0.0/dist/pixlib.min.js"></script>
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
