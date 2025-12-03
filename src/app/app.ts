import { Component, signal } from '@angular/core';
import { Overview } from "./pages/overview/overview";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Gavelisten20');
}
