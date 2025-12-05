import { Component, inject, signal } from '@angular/core';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-install-prompt',
  imports: [],
  templateUrl: './install-prompt.html',
  styleUrl: './install-prompt.scss',
})
export class InstallPrompt {
  private pwaService = inject(PwaService);

  isVisible = signal(true);
  isInstallable = this.pwaService.isInstallable;
  isInstalled = this.pwaService.isInstalled;
  isStandalone = this.pwaService.isStandalone;
  showInstructions = signal(false);
  instructions = this.pwaService.getInstallInstructions();

  async installApp() {
    const success = await this.pwaService.promptInstall();
    if (success) {
      this.isVisible.set(false);
    }
  }

  showManualInstructions() {
    this.showInstructions.set(true);
  }

  dismiss() {
    this.isVisible.set(false);
    // Remember dismissal in localStorage
    localStorage.setItem('installPromptDismissed', 'true');
  }

  shouldShow(): boolean {
    // Don't show if already installed or dismissed
    if (this.isInstalled() || this.isStandalone()) {
      return false;
    }

    const dismissed = localStorage.getItem('installPromptDismissed');
    return !dismissed && this.isVisible();
  }
}
