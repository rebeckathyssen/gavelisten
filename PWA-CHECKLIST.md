# PWA Deployment Checklist

## Before deploying to production:

### 1. Icons ✓ (needs optimization)
- [ ] Generate proper icon sizes using [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [ ] Replace placeholder icons in `public/icons/`
- [ ] Verify all sizes are present: 72, 96, 128, 144, 152, 192, 384, 512

### 2. Manifest ✓
- [x] manifest.webmanifest is in public folder
- [x] Correct app name and description
- [x] Theme colors match your branding
- [x] Icons paths are correct
- [x] start_url is correct

### 3. Service Worker ✓
- [x] service-worker.js is in public folder
- [x] Caching strategy configured
- [x] Firebase URLs excluded from cache
- [x] Version number for cache updates

### 4. HTML Meta Tags ✓
- [x] Manifest link added
- [x] Theme color meta tag
- [x] Apple touch icons
- [x] Mobile web app meta tags

### 5. Firebase Configuration ✓
- [x] Headers for service-worker.js (no-cache)
- [x] Headers for manifest.webmanifest (correct content-type)
- [x] Correct output directory in firebase.json

### 6. Testing
- [ ] Test on Chrome Desktop (install prompt works)
- [ ] Test on Android Chrome (install works)
- [ ] Test on iOS Safari (manual install works)
- [ ] Test offline functionality
- [ ] Run Lighthouse PWA audit (should score 100)

### 7. Build and Deploy
```powershell
# 1. Build the project
npm run build

# 2. Test locally first
http-server dist/gavelisten20/browser -p 8080

# 3. Test PWA features at http://localhost:8080

# 4. If all looks good, deploy
firebase deploy
```

### 8. Post-Deployment Verification
- [ ] Visit live site
- [ ] Check browser console for errors
- [ ] Verify service worker registered (DevTools > Application > Service Workers)
- [ ] Verify manifest loads (DevTools > Application > Manifest)
- [ ] Test install prompt appears
- [ ] Actually install the app and test

## Quick Commands

```powershell
# Build
npm run build

# Test locally
http-server dist/gavelisten20/browser -p 8080

# Deploy
firebase deploy

# Check deployment
firebase hosting:sites:list
```

## Troubleshooting

### Service worker not updating
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Update CACHE_NAME in service-worker.js
- Redeploy

### Install prompt not showing
- Only shows once per site
- Clear site data in DevTools > Application > Storage
- Check if already installed
- iOS requires Safari and manual installation

### Icons not loading
- Check browser console
- Verify paths in manifest.webmanifest
- Check firebase deploy output
- Ensure icons are in dist folder after build

## Resources
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [PWA Builder](https://www.pwabuilder.com/)
