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
    },
    'quick_donation_title': {
      'en': 'Your Gift in Action',
      'fr': 'Votre don en action',
      'es': 'Tu regalo en acción',
      'ar': 'هديتك قيد التنفيذ',
      'zh': '您的礼物在行动',
      'hi': 'आपका उपहार कार्रवाई में',
      'ru': 'Ваш подарок в действии',
      'pt': 'Seu presente em ação',
      'it': 'Il tuo regalo in azione',
      'de': 'Ihr Geschenk in Aktion'
    },
    'quick_donation_subtitle': {
      'en': 'Every donation directly impacts a life. See how your generosity becomes someone\'s lifeline.',
      'fr': 'Chaque don a un impact direct sur une vie. Voyez comment votre générosité devient une bouée de sauvetage pour quelqu\'un.',
      'es': 'Cada donación impacta directamente una vida. Ve cómo tu generosidad se convierte en la salvación de alguien.',
      'ar': 'كل تبرع يؤثر مباشرة على حياة. شاهد كيف تصبح كرمك شريان حياة لشخص ما.',
      'zh': '每一笔捐款都直接影响一条生命。看看您的慷慨如何成为某人的生命线。',
      'hi': 'प्रत्येक दान सीधे एक जीवन को प्रभावित करता है। देखें कि आपकी उदारता किसी के लिए जीवन रेखा कैसे बन जाती है।',
      'ru': 'Каждое пожертвование напрямую влияет на жизнь. Посмотрите, как ваша щедрость становится спасением для кого-то.',
      'pt': 'Cada doação impacta diretamente uma vida. Veja como sua generosidade se torna a salvação de alguém.',
      'it': 'Ogni donazione ha un impatto diretto su una vita. Vedi come la tua generosità diventa una via di fuga per qualcuno.',
      'de': 'Jede Spende wirkt sich direkt auf ein Leben aus. Sehen Sie, wie Ihre Großzügigkeit zur Rettungsleine für jemanden wird.'
    },
    'impact_message': {
      'en': 'Real people. Real impact. Your support matters.',
      'fr': 'De vraies personnes. Un vrai impact. Votre soutien compte.',
      'es': 'Personas reales. Impacto real. Tu apoyo importa.',
      'ar': 'أشخاص حقيقيون. تأثير حقيقي. دعمك مهم.',
      'zh': '真实的人。真实的影响。您的支持很重要。',
      'hi': 'असली लोग। असली प्रभाव। आपका समर्थन मायने रखता है।',
      'ru': 'Настоящие люди. Настоящее влияние. Ваша поддержка имеет значение.',
      'pt': 'Pessoas reais. Impacto real. Seu apoio importa.',
      'it': 'Persone reali. Impatto reale. Il tuo supporto conta.',
      'de': 'Echte Menschen. Echte Wirkung. Ihre Unterstützung zählt.'
    },
    'impact_count_more': {
      'en': '+2,446 more lives changed',
      'fr': '+2 446 autres vies changées',
      'es': '+2,446 vidas más cambiadas',
      'ar': '+2,446 حياة أخرى تغيرت',
      'zh': '+2,446 个生命被改变',
      'hi': '+2,446 और जीवन बदले',
      'ru': '+2,446 жизней изменено',
      'pt': '+2.446 vidas mais mudadas',
      'it': '+2.446 vite cambiate in più',
      'de': '+2.446 weitere Leben verändert'
    },
    'amount_25_description': {
      'en': 'Weekly meals for 5 children',
      'fr': 'Repas hebdomadaires pour 5 enfants',
      'es': 'Comidas semanales para 5 niños',
      'ar': 'وجبات أسبوعية لـ 5 أطفال',
      'zh': '5个孩子一周的膳食',
      'hi': '5 बच्चों के लिए साप्ताहिक भोजन',
      'ru': 'Недельное питание для 5 детей',
      'pt': 'Refeições semanais para 5 crianças',
      'it': 'Pasti settimanali per 5 bambini',
      'de': 'Wöchentliche Mahlzeiten für 5 Kinder'
    },
    'amount_50_description': {
      'en': '1 night of safe shelter',
      'fr': '1 nuit d\'abri sûr',
      'es': '1 noche de refugio seguro',
      'ar': 'ليلة واحدة من المأوى الآمن',
      'zh': '1晚安全住所',
      'hi': 'सुरक्षित आश्रय की 1 रात',
      'ru': '1 ночь безопасного убежища',
      'pt': '1 noite de abrigo seguro',
      'it': '1 notte di rifugio sicuro',
      'de': '1 Nacht sicherer Unterkunft'
    },
    'amount_100_description': {
      'en': '5 hours of translation services',
      'fr': '5 heures de services de traduction',
      'es': '5 horas de servicios de traducción',
      'ar': '5 ساعات من خدمات الترجمة',
      'zh': '5小时翻译服务',
      'hi': '5 घंटे अनुवाद सेवाएं',
      'ru': '5 часов услуг перевода',
      'pt': '5 horas de serviços de tradução',
      'it': '5 ore di servizi di traduzione',
      'de': '5 Stunden Übersetzungsdienst'
    },
    'amount_200_description': {
      'en': '1 week of counseling support',
      'fr': '1 semaine de soutien en conseil',
      'es': '1 semana de apoyo de asesoramiento',
      'ar': 'أسبوع واحد من الدعم الاستشاري',
      'zh': '1周咨询服务',
      'hi': '1 सप्ताह परामर्श समर्थन',
      'ru': '1 неделя консультационной поддержки',
      'pt': '1 semana de apoio de aconselhamento',
      'it': '1 settimana di supporto di consulenza',
      'de': '1 Woche Beratungsunterstützung'
    },
    'other_amount': {
      'en': 'Other',
      'fr': 'Autre',
      'es': 'Otro',
      'ar': 'أخرى',
      'zh': '其他',
      'hi': 'अन्य',
      'ru': 'Другое',
      'pt': 'Outro',
      'it': 'Altro',
      'de': 'Andere'
    },
    'enter_custom_amount': {
      'en': 'Enter custom amount',
      'fr': 'Entrer un montant personnalisé',
      'es': 'Ingresar cantidad personalizada',
      'ar': 'أدخل مبلغًا مخصصًا',
      'zh': '输入自定义金额',
      'hi': 'कस्टम राशि दर्ज करें',
      'ru': 'Введите свою сумму',
      'pt': 'Digite o valor personalizado',
      'it': 'Inserisci importo personalizzato',
      'de': 'Eigenen Betrag eingeben'
    },
    'enter_amount': {
      'en': 'Enter Amount',
      'fr': 'Entrer le montant',
      'es': 'Ingresar cantidad',
      'ar': 'أدخل المبلغ',
      'zh': '输入金额',
      'hi': 'राशि दर्ज करें',
      'ru': 'Введите сумму',
      'pt': 'Digite o valor',
      'it': 'Inserisci importo',
      'de': 'Betrag eingeben'
    },
    'recurring_donation': {
      'en': 'Recurring Donation',
      'fr': 'Don récurrent',
      'es': 'Donación recurrente',
      'ar': 'تبرع متكرر',
      'zh': '定期捐赠',
      'hi': 'आवर्ती दान',
      'ru': 'Регулярное пожертвование',
      'pt': 'Doação recorrente',
      'it': 'Donazione ricorrente',
      'de': 'Wiederkehrende Spende'
    },
    'one_time': {
      'en': 'One-Time',
      'fr': 'Unique',
      'es': 'Una vez',
      'ar': 'مرة واحدة',
      'zh': '一次性',
      'hi': 'एक बार',
      'ru': 'Одноразово',
      'pt': 'Única',
      'it': 'Una tantum',
      'de': 'Einmalig'
    },
    'monthly': {
      'en': 'Monthly',
      'fr': 'Mensuel',
      'es': 'Mensual',
      'ar': 'شهري',
      'zh': '每月',
      'hi': 'मासिक',
      'ru': 'Ежемесячно',
      'pt': 'Mensal',
      'it': 'Mensile',
      'de': 'Monatlich'
    },
    'quarterly': {
      'en': 'Quarterly',
      'fr': 'Trimestriel',
      'es': 'Trimestral',
      'ar': 'ربع سنوي',
      'zh': '每季度',
      'hi': 'त्रैमासिक',
      'ru': 'Ежеквартально',
      'pt': 'Trimestral',
      'it': 'Trimestrale',
      'de': 'Vierteljährlich'
    },
    'yearly': {
      'en': 'Yearly',
      'fr': 'Annuel',
      'es': 'Anual',
      'ar': 'سنوي',
      'zh': '每年',
      'hi': 'वार्षिक',
      'ru': 'Ежегодно',
      'pt': 'Anual',
      'it': 'Annuale',
      'de': 'Jährlich'
    },
    'continue_to_payment': {
      'en': 'Continue to Payment',
      'fr': 'Continuer vers le paiement',
      'es': 'Continuar al pago',
      'ar': 'المتابعة إلى الدفع',
      'zh': '继续付款',
      'hi': 'भुगतान पर जारी रखें',
      'ru': 'Перейти к оплате',
      'pt': 'Continuar para o pagamento',
      'it': 'Continua al pagamento',
      'de': 'Zur Zahlung fortfahren'
    },
    'payment_info': {
      'en': 'No account needed • Secure payment • 10-language support',
      'fr': 'Aucun compte requis • Paiement sécurisé • Support en 10 langues',
      'es': 'No se necesita cuenta • Pago seguro • Soporte en 10 idiomas',
      'ar': 'لا حاجة لحساب • دفع آمن • دعم 10 لغات',
      'zh': '无需账户 • 安全支付 • 支持10种语言',
      'hi': 'कोई खाता आवश्यक नहीं • सुरक्षित भुगतान • 10-भाषा समर्थन',
      'ru': 'Аккаунт не требуется • Безопасная оплата • Поддержка 10 языков',
      'pt': 'Nenhuma conta necessária • Pagamento seguro • Suporte para 10 idiomas',
      'it': 'Nessun account necessario • Pagamento sicuro • Supporto per 10 lingue',
      'de': 'Kein Konto erforderlich • Sichere Zahlung • Unterstützung für 10 Sprachen'
    },
    'alert_select_amount': {
      'en': 'Please select or enter a donation amount',
      'fr': 'Veuillez sélectionner ou entrer un montant de don',
      'es': 'Por favor selecciona o ingresa un monto de donación',
      'ar': 'يرجى اختيار أو إدخال مبلغ التبرع',
      'zh': '请选择或输入捐赠金额',
      'hi': 'कृपया दान राशि चुनें या दर्ज करें',
      'ru': 'Пожалуйста, выберите или введите сумму пожертвования',
      'pt': 'Por favor, selecione ou insira um valor de doação',
      'it': 'Si prega di selezionare o inserire un importo di donazione',
      'de': 'Bitte wählen Sie einen Spendenbetrag aus oder geben Sie ihn ein'
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

