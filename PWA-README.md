# 🎉 Gavelisten er nu en PWA!

## Hvad er blevet tilføjet?

### 1. **PWA Manifest** (`public/manifest.webmanifest`)
- App navn, beskrivelse og ikoner
- Tema farver der matcher juletemaet
- Genveje til at tilføje personer
- Support til både maskable og almindelige ikoner

### 2. **Service Worker** (`public/service-worker.js`)
- Cacher vigtige ressourcer for offline adgang
- Hurtigere indlæsning ved efterfølgende besøg
- Intelligent caching strategi der ikke påvirker Firebase

### 3. **PWA Service** (`src/app/services/pwa.service.ts`)
- Detekterer brugerens platform (iOS, Android, Desktop)
- Håndterer installations-prompts
- Tjekker om appen allerede er installeret
- Registrerer service worker automatisk

### 4. **Installations-prompt komponent** (`src/app/components/install-prompt/`)
- Vises automatisk for ikke-installerede brugere
- Platform-specifikke installationsvejledninger:
  - **iOS**: Guide til "Føj til hjemmeskærm" via Safari
  - **Android**: Guide til "Installer app" funktion
  - **Desktop**: Guide til browser installations-funktionen
- Kan lukkes og huskes via localStorage
- Flot design der matcher juletemaet

### 5. **App ikoner**
- Genereret i alle nødvendige størrelser (72-512px)
- Placeret i `public/icons/`
- Optimeret til både app launcher og splash screens

### 6. **HTML opdateringer**
- Tilføjet manifest link
- Apple touch ikoner
- Theme color meta tags
- PWA meta tags for mobil support

## Sådan virker det

### For brugere på Desktop (Chrome, Edge)
1. Besøg sitet
2. Se installations-prompt eller klik på installations-ikon i adresselinjen
3. Klik "Installer nu"
4. Appen åbnes i eget vindue uden browser UI

### For brugere på Android
1. Besøg sitet
2. Se installations-prompt
3. Klik "Installer nu" eller brug browser menuen
4. Appen tilføjes til hjemmeskærmen

### For brugere på iOS
1. Åbn sitet i Safari
2. Se vejledning i prompt
3. Tryk på del-ikonet
4. Vælg "Føj til hjemmeskærm"
5. Appen tilføjes til hjemmeskærmen

## Test det lokalt

```powershell
# Byg projektet
npm run build

# Installer http-server (hvis ikke allerede installeret)
npm install -g http-server

# Serve de byggede filer
http-server dist/gavelisten20/browser -p 8080

# Åbn i browser
# http://localhost:8080
```

## Deploy til Firebase

```powershell
# Byg først
npm run build

# Deploy
firebase deploy
```

Firebase Hosting er nu konfigureret med de rigtige headers for:
- Service worker (ingen cache)
- Manifest (korrekt content-type)

## Næste skridt

### For produktion bør du:

1. **Generer ordentlige ikoner** med korrekte størrelser:
   - Brug [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
   - Upload `public/logo.png`
   - Download og erstat ikoner i `public/icons/`

2. **Test PWA score**:
   - Åbn Chrome DevTools (F12)
   - Gå til "Lighthouse" tab
   - Kør "PWA" audit
   - Følg eventuelle anbefalinger

3. **Tilpas installationsprompt**:
   - Ændr hvornår det vises (lige nu vises det ved første besøg)
   - Tilpas styling i `install-prompt.scss`
   - Ændr tekster i `install-prompt.html`

## Funktioner der nu virker offline

- ✅ Visning af gavelister
- ✅ App shell og interface
- ✅ Statiske ressourcer (billeder, ikoner)
- ❌ Firebase operationer (kræver internet)

Service workeren er konfigureret til at ignorere Firebase requests, så app'en fungerer optimalt både online og offline.

## Se også

- `PWA-SETUP.md` - Detaljeret teknisk guide
- `generate-icons.ps1` - Script til at generere ikoner
