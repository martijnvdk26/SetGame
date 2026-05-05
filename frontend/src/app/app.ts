import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // <-- Toegevoegd

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // <-- OnInit toegevoegd
  protected readonly title = signal('frontend');

  // Ons nieuwe signaal voor de test
  public backendBericht = signal('Verbinding testen...');

  // HttpClient injecteren
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5160/api/games/ping').subscribe({
      next: (response) => {
        console.log('Succes!', response);
        this.backendBericht.set('✅ Verbinding met SetGameAPI is geslaagd!');
      },
      error: (error) => {
        console.error('Fout bij verbinden:', error);
        this.backendBericht.set('❌ Verbinding mislukt. Check de Console (F12).');
      }
    });
  }
}
