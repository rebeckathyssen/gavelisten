import { Component, signal } from '@angular/core';
import { Overview } from "./pages/overview/overview";

@Component({
  selector: 'app-root',
  imports: [Overview],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Gavelisten20');
}
