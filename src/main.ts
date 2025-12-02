import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';

const app = initializeApp(environment.firebase);
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    await signInAnonymously(auth);
  }
  // Når vi er (anonymt) logget ind, booter vi Angular
  bootstrapApplication(App, appConfig).catch(console.error);
});