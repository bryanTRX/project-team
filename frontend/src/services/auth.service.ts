import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  _id?: string;
  id?: string;
  username: string;
  name: string;
  totalDonated: number;
  goal: number;
  
  email: string;
  profileImage?: string;
  hasRecurringDonation?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'shield_of_athena_user';
  private readonly apiBase = 'http://localhost:3000';
  private readonly knownSeedEmails = [
    'admin@shieldofathena.org',
    'facebook@shieldofathena.org',
    'google@shieldofathena.org',
  ];

  // Reactive public user stream so UI can update immediately when user changes
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(
    this._loadUserFromStorage(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private languageService: LanguageService) {}

  private persistUser(profile: UserProfile): void {
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
    // emit the new profile for any subscribers
    this.currentUserSubject.next(profile);
  }

  private _loadUserFromStorage(): UserProfile | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? (JSON.parse(stored) as UserProfile) : null;
  }

  async sendDonationReceipt(amount: number): Promise<any> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to request donation receipt.');
    }
    const identifier: any = {};
    if (user.username) {
      identifier.username = user.username;
    } else if (user.email) {
      identifier.email = user.email;
    }
    try {
  const url = `${this.apiBase}/donations`;
  const body = { ...identifier, amount, lang: this.languageService.getCurrentLanguage() };
      const resp = await firstValueFrom(this.http.post<any>(url, body));
      return resp;
    } catch (err) {
      console.error('Failed to send donation receipt request', err);
      throw err;
    }
  }

  private getStoredUserId(user: UserProfile | null): string | null {
    if (!user) {
      return null;
    }
    return user._id || user.id || null;
  }

  async signup(
    email: string,
    name: string,
    password: string,
    username?: string,
  ): Promise<UserProfile | null> {
    try {
      const url = `${this.apiBase}/auth/signup`;
      const body = { email: email.toLowerCase().trim(), name, password, username };
      const profile = await firstValueFrom(this.http.post<UserProfile>(url, body));
      if (profile) {
        this.persistUser(profile);
        return profile;
      }
      return null;
    } catch (err: any) {
      console.error('Signup failed', err);
      throw err;
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const url = `${this.apiBase}/auth/login`;
      const body = { username, password };
      const profile = await firstValueFrom(this.http.post<UserProfile>(url, body));
      if (profile) {
        this.persistUser(profile);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  }

  async loginWithFacebook(): Promise<boolean> {
    return this.login('facebook', 'facebook');
  }

  async loginWithGoogle(): Promise<boolean> {
    return this.login('google', 'google');
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.getValue();
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  async recordDonation(amount: number): Promise<UserProfile | null> {
    const user = this.getCurrentUser();
    const userId = this.getStoredUserId(user);
    if (!user || !userId) {
      throw new Error('User must be logged in to record a donation.');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Donation amount must be greater than zero.');
    }

    try {
      const url = `${this.apiBase}/users/${userId}/donations`;
      const body = { amount };
      const updated = await firstValueFrom(this.http.post<UserProfile>(url, body));
      if (updated) {
        console.log('Donation recorded - Updated user:', {
          totalDonated: updated.totalDonated,
        });
        this.persistUser(updated);
        return updated;
      }
      return null;
    } catch (err) {
      console.error('Failed to record donation', err);
      throw err;
    }
  }

  emailHasAccount(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      return false;
    }

    const current = this.getCurrentUser();
    if (current?.email?.toLowerCase() === normalized) {
      return true;
    }

    return this.knownSeedEmails.includes(normalized);
  }
}
