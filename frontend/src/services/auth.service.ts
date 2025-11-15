import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  username: string;
  name: string;
  donorTier: string;
  totalDonated: number;
  familiesHelped: number;
  goal: number;
  donationsRequiredForTier: number;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'shield_of_athena_user';
  // Point API calls to the backend server during development
  private readonly apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const url = `${this.apiBase}/auth/login`;
      const body = { username, password };
      const profile = await firstValueFrom(this.http.post<UserProfile>(url, body));
      if (profile) {
        localStorage.setItem(this.storageKey, JSON.stringify(profile));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  }

  async loginWithFacebook(): Promise<boolean> {
    // Credentials must match the seeded social account in the DB
    return this.login('facebook', 'facebook');
  }

  async loginWithGoogle(): Promise<boolean> {
    return this.login('google', 'google');
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getCurrentUser(): UserProfile | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? (JSON.parse(stored) as UserProfile) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  emailHasAccount(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return normalized === this.mockUser.email.toLowerCase();
  }
}
