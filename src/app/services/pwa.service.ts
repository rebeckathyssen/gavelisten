import { Injectable, signal, computed, effect } from '@angular/core';

export type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

export interface InstallInstructions {
  platform: Platform;
  steps: string[];
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private deferredPrompt = signal<any>(null);
  isInstallable = computed(() => this.deferredPrompt() !== null);
  isInstalled = signal(false);
  isStandalone = signal(false);
  platform = signal<Platform>('unknown');

  constructor() {
    this.detectPlatform();
    this.checkIfInstalled();
    this.listenForInstallPrompt();
    this.registerServiceWorker();
  }

  private detectPlatform() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid;

    if (isIOS) {
      this.platform.set('ios');
    } else if (isAndroid) {
      this.platform.set('android');
    } else if (!isMobile) {
      this.platform.set('desktop');
    } else {
      this.platform.set('unknown');
    }
  }

  private checkIfInstalled() {
    // Check if running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    this.isStandalone.set(isStandalone);
    this.isInstalled.set(isStandalone);
  }

  private listenForInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt.set(e);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.deferredPrompt.set(null);
    });
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async promptInstall(): Promise<boolean> {
    const prompt = this.deferredPrompt();
    if (!prompt) {
      return false;
    }

    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    
    if (outcome === 'accepted') {
      this.deferredPrompt.set(null);
      return true;
    }
    
    return false;
  }

  getInstallInstructions(): InstallInstructions {
    const platform = this.platform();

    switch (platform) {
      case 'ios':
        return {
          platform: 'ios',
          steps: [
            'Tryk på del-ikonet <i class="fa-solid fa-arrow-up-from-bracket"></i> nederst på skærmen',
            'Scroll ned og vælg "Føj til hjemmeskærm" <i class="fa-solid fa-plus-square"></i>',
            'Tryk på "Tilføj" i øverste højre hjørne',
            'Gavelisten er nu tilgængelig fra din hjemmeskærm! 🎉'
          ]
        };

      case 'android':
        return {
          platform: 'android',
          steps: [
            'Tryk på menu-ikonet <i class="fa-solid fa-ellipsis-vertical"></i> øverst til højre',
            'Vælg "Installer app" eller "Føj til startskærm"',
            'Følg instruktionerne for at installere',
            'Gavelisten er nu tilgængelig fra din startskærm! 🎉'
          ]
        };

      case 'desktop':
        return {
          platform: 'desktop',
          steps: [
            'Se efter et installations-ikon <i class="fa-solid fa-download"></i> i adresselinjen',
            'Klik på ikonet for at installere appen',
            'Alternativt: Åbn browsermenuen og vælg "Installer Gavelisten"',
            'Gavelisten kan nu åbnes som en selvstændig app! 🎉'
          ]
        };

      default:
        return {
          platform: 'unknown',
          steps: [
            'Se efter en "Installer app" eller "Føj til startskærm" mulighed i din browser',
            'Følg instruktionerne fra din browser',
            'Gavelisten vil være tilgængelig som en app! 🎉'
          ]
        };
    }
  }
}
