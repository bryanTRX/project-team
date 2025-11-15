import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
  ];

  translations: { [key: string]: { [lang: string]: string } } = {
    'home': {
      'en': 'Home',
      'fr': 'Accueil',
      'es': 'Inicio',
      'ar': 'الرئيسية',
      'zh': '首页',
      'hi': 'होम',
      'ru': 'Главная',
      'pt': 'Início',
      'it': 'Home',
      'de': 'Startseite'
    },
    'donate_now': {
      'en': 'Donate Now',
      'fr': 'Faire un don',
      'es': 'Donar ahora',
      'ar': 'تبرع الآن',
      'zh': '立即捐赠',
      'hi': 'अभी दान करें',
      'ru': 'Пожертвовать',
      'pt': 'Doar agora',
      'it': 'Dona ora',
      'de': 'Jetzt spenden'
    },
    'hero_title': {
      'en': 'Your Support Changes Lives',
      'fr': 'Votre soutien change des vies',
      'es': 'Tu apoyo cambia vidas',
      'ar': 'دعمك يغير الأرواح',
      'zh': '您的支持改变生活',
      'hi': 'आपका समर्थन जीवन बदलता है',
      'ru': 'Ваша поддержка меняет жизни',
      'pt': 'Seu apoio muda vidas',
      'it': 'Il tuo supporto cambia vite',
      'de': 'Ihre Unterstützung verändert Leben'
    },
    'hero_subtitle': {
      'en': 'Every donation helps provide shelter, support, and hope to women and children affected by domestic violence',
      'fr': 'Chaque don aide à fournir un abri, un soutien et de l\'espoir aux femmes et aux enfants touchés par la violence conjugale',
      'es': 'Cada donación ayuda a proporcionar refugio, apoyo y esperanza a mujeres y niños afectados por la violencia doméstica',
      'ar': 'كل تبرع يساعد في توفير المأوى والدعم والأمل للنساء والأطفال المتأثرين بالعنف المنزلي',
      'zh': '每一笔捐款都有助于为受家庭暴力影响的妇女和儿童提供住所、支持和希望',
      'hi': 'प्रत्येक दान घरेलू हिंसा से प्रभावित महिलाओं और बच्चों को आश्रय, समर्थन और आशा प्रदान करने में मदद करता है',
      'ru': 'Каждое пожертвование помогает предоставить убежище, поддержку и надежду женщинам и детям, пострадавшим от домашнего насилия',
      'pt': 'Cada doação ajuda a fornecer abrigo, apoio e esperança para mulheres e crianças afetadas pela violência doméstica',
      'it': 'Ogni donazione aiuta a fornire riparo, supporto e speranza alle donne e ai bambini colpiti dalla violenza domestica',
      'de': 'Jede Spende hilft, Unterkunft, Unterstützung und Hoffnung für von häuslicher Gewalt betroffene Frauen und Kinder zu bieten'
    },
    'one_time_donation': {
      'en': 'Make a One-Time Donation',
      'fr': 'Faire un don unique',
      'es': 'Hacer una donación única',
      'ar': 'تقديم تبرع لمرة واحدة',
      'zh': '进行一次性捐赠',
      'hi': 'एक बार का दान करें',
      'ru': 'Сделать разовое пожертвование',
      'pt': 'Fazer uma doação única',
      'it': 'Fai una donazione una tantum',
      'de': 'Einmalige Spende'
    },
    'monthly_giving': {
      'en': 'Start Monthly Giving',
      'fr': 'Commencer le don mensuel',
      'es': 'Iniciar donación mensual',
      'ar': 'ابدأ التبرع الشهري',
      'zh': '开始每月捐赠',
      'hi': 'मासिक दान शुरू करें',
      'ru': 'Начать ежемесячные пожертвования',
      'pt': 'Iniciar doação mensal',
      'it': 'Inizia la donazione mensile',
      'de': 'Monatliche Spende starten'
    }
  };

  setLanguage(languageCode: string): void {
    this.currentLanguageSubject.next(languageCode);
    localStorage.setItem('language', languageCode);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getTranslation(key: string): string {
    const lang = this.getCurrentLanguage();
    return this.translations[key]?.[lang] || this.translations[key]?.['en'] || key;
  }

  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.setLanguage(savedLanguage);
  }
}

