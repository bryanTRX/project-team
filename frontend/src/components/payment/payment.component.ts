commit e6c9803f390ccb40f13611761f24754d66518254
Author: sarahaitaliyahia <143891694+sarahaitaliyahia@users.noreply.github.com>
Date:   Sat Nov 15 13:09:50 2025 -0500

    Updated Donation Page + Changed Sign Up

diff --git a/frontend/src/components/payment/payment.component.ts b/frontend/src/components/payment/payment.component.ts
index 4c53dd6..1d3ad4d 100644
--- a/frontend/src/components/payment/payment.component.ts
+++ b/frontend/src/components/payment/payment.component.ts
@@ -1,8 +1,9 @@
-import { Component, OnInit, OnDestroy } from '@angular/core';
+import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { Router } from '@angular/router';
 import { LanguageService } from '../../services/language.service';
+import { AuthService } from '../../services/auth.service';
 import { Subscription } from 'rxjs';
 
 @Component({
@@ -10,15 +11,17 @@ import { Subscription } from 'rxjs';
   standalone: true,
   imports: [CommonModule, FormsModule],
   templateUrl: './payment.component.html',
-  styleUrl: './payment.component.scss'
+  styleUrl: './payment.component.scss',
+  encapsulation: ViewEncapsulation.None
 })
 export class PaymentComponent implements OnInit, OnDestroy {
-  donationOptions: number[] = [10, 25, 50, 100, 250];
-  donationAmount: number = this.donationOptions[2];
+  donationOptions: number[] = [25, 50, 100, 250, 500];
+  donationAmount: number = this.donationOptions[1];
   customAmount: string = '';
   recurringOption: string = 'one-time';
   currentLanguage: string = 'en';
   private languageSubscription?: Subscription;
+  isAuthenticated = false;
 
   get frequencyOptions() {
     return [
@@ -31,9 +34,9 @@ export class PaymentComponent implements OnInit, OnDestroy {
 
   get paymentMethods() {
     return [
-      { value: 'card', label: this.languageService.getTranslation('credit_debit_card'), icon: 'far fa-credit-card', badges: ['Visa', 'Mastercard', 'Amex', 'Discover'] },
-      { value: 'paypal', label: 'PayPal', icon: 'fab fa-paypal', badges: ['PayPal'] },
-      { value: 'venmo', label: 'Venmo', icon: 'fab fa-vimeo-v', badges: ['Venmo'] }
+      { value: 'card', label: this.languageService.getTranslation('credit_debit_card'), icon: 'far fa-credit-card', badges: [] },
+      { value: 'paypal', label: 'PayPal', icon: 'fab fa-paypal', badges: [] },
+      { value: 'phone', label: this.languageService.getTranslation('paying_by_phone'), icon: 'fas fa-mobile-alt', badges: [] }
     ];
   }
 
@@ -52,6 +55,11 @@ export class PaymentComponent implements OnInit, OnDestroy {
   expiryDate: string = '';
   cvv: string = '';
   email: string = '';
+  emailMode: 'idle' | 'existing' | 'new' = 'idle';
+  loginPassword = '';
+  newUsername = '';
+  newPassword = '';
+  emailSectionInvalid = false;
   showSuccess = false;
   showAccessibilityPanel = false;
   simpleMode = false;
@@ -59,7 +67,8 @@ export class PaymentComponent implements OnInit, OnDestroy {
 
   constructor(
     private router: Router,
-    public languageService: LanguageService
+    public languageService: LanguageService,
+    private authService: AuthService
   ) {}
 
   ngOnInit(): void {
@@ -76,11 +85,23 @@ export class PaymentComponent implements OnInit, OnDestroy {
       this.donationAmount = parseFloat(savedAmount);
       if (!this.donationOptions.includes(this.donationAmount)) {
         this.customAmount = savedAmount;
+      } else {
+        this.customAmount = '';
       }
+    } else {
+      this.customAmount = this.donationAmount.toString();
     }
     if (savedRecurring) {
       this.recurringOption = savedRecurring;
     }
+
+    this.isAuthenticated = this.authService.isAuthenticated();
+    if (this.isAuthenticated) {
+      const user = this.authService.getCurrentUser();
+      if (user?.email) {
+        this.email = user.email;
+      }
+    }
   }
 
   ngOnDestroy(): void {
@@ -133,6 +154,7 @@ export class PaymentComponent implements OnInit, OnDestroy {
   }
 
   validateForm(): boolean {
+    this.emailSectionInvalid = false;
     if (!this.donationAmount || this.donationAmount <= 0) {
       alert(this.languageService.getTranslation('alert_select_amount'));
       return false;
@@ -155,8 +177,28 @@ export class PaymentComponent implements OnInit, OnDestroy {
     }
     if (!this.email || !this.email.includes('@')) {
       alert(this.languageService.getTranslation('email_address') + ' - ' + this.languageService.getTranslation('invalid_credentials').replace('username or password', ''));
+      this.emailSectionInvalid = true;
       return false;
     }
+    if (!this.isAuthenticated) {
+      if (this.emailMode === 'existing' && !this.loginPassword) {
+        alert(this.languageService.getTranslation('existing_account_password_label') + ' - ' + this.languageService.getTranslation('invalid_credentials').replace('username or password', ''));
+        this.emailSectionInvalid = true;
+        return false;
+      }
+      if (this.emailMode === 'new') {
+        if (!this.newUsername) {
+          alert(this.languageService.getTranslation('create_username_label') + ' - ' + this.languageService.getTranslation('invalid_credentials').replace('username or password', ''));
+          this.emailSectionInvalid = true;
+          return false;
+        }
+        if (!this.newPassword) {
+          alert(this.languageService.getTranslation('create_password_label') + ' - ' + this.languageService.getTranslation('invalid_credentials').replace('username or password', ''));
+          this.emailSectionInvalid = true;
+          return false;
+        }
+      }
+    }
     return true;
   }
 
@@ -164,11 +206,6 @@ export class PaymentComponent implements OnInit, OnDestroy {
     return this.languageService.getTranslation(this.recurringOption.replace('-', '_') as any) || this.recurringOption;
   }
 
-  selectDonationAmount(amount: number): void {
-    this.donationAmount = amount;
-    this.customAmount = '';
-  }
-
   onCustomAmountChange(): void {
     const parsedAmount = parseFloat(this.customAmount);
     if (!isNaN(parsedAmount) && parsedAmount > 0) {
@@ -178,6 +215,31 @@ export class PaymentComponent implements OnInit, OnDestroy {
     }
   }
 
+  handleEmailInput(): void {
+    const trimmed = this.email.trim();
+    if (!trimmed || !trimmed.includes('@')) {
+      this.emailMode = 'idle';
+      this.loginPassword = '';
+      this.newUsername = '';
+      this.newPassword = '';
+      return;
+    }
+    if (this.authService.emailHasAccount(trimmed)) {
+      this.emailMode = 'existing';
+      this.loginPassword = '';
+      this.newUsername = '';
+      this.newPassword = '';
+    } else {
+      this.emailMode = 'new';
+      this.loginPassword = '';
+    }
+  }
+
+  selectDonationAmount(amount: number): void {
+    this.donationAmount = amount;
+    this.customAmount = amount.toString();
+  }
+
   selectFrequency(value: string): void {
     this.recurringOption = value;
     localStorage.setItem('recurringOption', value);
