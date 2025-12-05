# PWA Setup Guide

## 🎉 Your Gavelisten is now a Progressive Web App!

### What's New?
- ✅ **Install on any device** - Works like a native app
- ✅ **Offline support** - Access your gift lists even without internet
- ✅ **Fast loading** - Cached resources for instant access
- ✅ **Smart install prompts** - Platform-specific installation guides

## 📱 Installation Instructions

### The app now shows automatic installation prompts with instructions for:
- **iOS devices** (iPhone/iPad)
- **Android devices**
- **Desktop browsers** (Chrome, Edge, etc.)

### Testing Locally

1. **Build the project:**
   ```powershell
   npm run build
   ```

2. **Serve the built files** (service workers only work over HTTPS or localhost):
   ```powershell
   # Using Node's http-server (install if needed: npm install -g http-server)
   http-server dist/Gavelisten20 -p 8080
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

4. **Test PWA features:**
   - Open DevTools (F12)
   - Go to Application tab
   - Check Service Workers and Manifest

## 🔧 Icon Generation

The project includes placeholder icons. For production, you should generate properly sized icons:

### Option 1: Use ImageMagick (Automated)
```powershell
# Install ImageMagick
winget install ImageMagick.ImageMagick

# Run the generation script
.\generate-icons.ps1
```

### Option 2: Use Online Tool (Recommended)
1. Visit [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload your `public/logo.png`
3. Download the generated icons
4. Extract them to `public/icons/` folder

## 🚀 Deployment

### Firebase Hosting

The app is configured for Firebase Hosting. To deploy:

```powershell
firebase deploy
```

**Important:** Make sure your `firebase.json` includes the manifest and service worker:

```json
{
  "hosting": {
    "public": "dist/Gavelisten20",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "/manifest.webmanifest",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/manifest+json"
          }
        ]
      }
    ]
  }
}
```

## 🎨 Customization

### Manifest (`public/manifest.webmanifest`)
- Update app name, description, colors
- Add more shortcuts
- Customize display mode

### Service Worker (`public/service-worker.js`)
- Adjust caching strategy
- Add offline pages
- Customize cache names

### Install Prompt (`src/app/components/install-prompt/`)
- Customize appearance
- Change when prompt appears
- Add more detailed instructions

## 📊 Testing PWA Features

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Run **PWA** audit
4. Check for any issues

### PWA Requirements Checklist
- ✅ Served over HTTPS (or localhost)
- ✅ Has a web app manifest
- ✅ Has a service worker
- ✅ Has icons (various sizes)
- ✅ Works offline
- ✅ Fast and responsive

## 🐛 Troubleshooting

### Service Worker not registering
- Check browser console for errors
- Ensure serving over HTTPS or localhost
- Try clearing browser cache

### Install prompt not showing
- Only works on supported browsers (Chrome, Edge, etc.)
- Won't show if already installed
- Won't show if user dismissed it recently
- iOS users need to use Safari's "Add to Home Screen"

### Icons not loading
- Verify icons exist in `public/icons/`
- Check manifest.webmanifest paths
- Clear browser cache and rebuild

## 📚 Resources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox - Service Worker Libraries](https://developers.google.com/web/tools/workbox)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
