import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div style="text-align: center; margin-top: 40px;">
      <h1>Frontend Angular connecté 🚀</h1>
      <h2>{{ message }}</h2>
    </div>
  `,
})
export class AppComponent implements OnInit {
  message = 'Chargement...';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getHello().subscribe({
      next: (res) => this.message = res,
      error: (err) => {
        console.error('Erreur API:', err);
        this.message = 'Erreur de connexion au backend';
      }
    });
  }
}
