import { Injectable } from '@angular/core';

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

  private readonly mockUser: UserProfile & { password: string } = {
    username: 'admin',
    password: 'admin',
    name: 'Zeus Donor',
    donorTier: 'Zeus',
    totalDonated: 3750,
    familiesHelped: 12,
    goal: 5000,
    donationsRequiredForTier: 5000,
    email: 'admin@shieldofathena.org',
  };

  login(username: string, password: string): boolean {
    const normalized = username.trim().toLowerCase();
    if (normalized === this.mockUser.username && password === this.mockUser.password) {
      const { password: _password, ...userProfile } = this.mockUser;
      localStorage.setItem(this.storageKey, JSON.stringify(userProfile));
      return true;
    }
    return false;
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
