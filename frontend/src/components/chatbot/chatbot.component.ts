import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  messages: Message[] = [];
  userInput: string = '';
  isTyping: boolean = false;
  private languageSubscription?: Subscription;
  currentLanguage: string = 'en';
  showQuickActions: boolean = true;

  // Text-to-Speech properties
  speechSynthesis: SpeechSynthesis | null = null;
  currentUtterance: SpeechSynthesisUtterance | null = null;
  speakingMessageIndex: number | null = null;
  private isPausedState: boolean = false;
  private voicesLoaded: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor(
    public languageService: LanguageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();

    // Initialize Text-to-Speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;

      // Load voices (some browsers need this)
      this.loadVoices();

      // Some browsers load voices asynchronously
      if (this.speechSynthesis.onvoiceschanged !== undefined) {
        this.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }

      // Fallback: try loading voices after a short delay (for browsers that don't fire onvoiceschanged)
      setTimeout(() => {
        if (!this.voicesLoaded && this.speechSynthesis) {
          this.loadVoices();
        }
      }, 100);
    }

    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      const previousLang = this.currentLanguage;
      this.currentLanguage = lang;

      // Stop any ongoing speech when language changes
      this.stopSpeech();

      // If language changed, update all existing messages
      if (previousLang !== lang) {
        this.updateMessagesForNewLanguage();
      }
    });

    // Welcome message with quick actions
    this.addBotMessage(this.getWelcomeMessage(), this.getWelcomeQuickActions());
  }

  updateMessagesForNewLanguage(): void {
    // Store user messages to regenerate bot responses
    const userMessages: string[] = [];
    const updatedMessages: Message[] = [];

    // Collect all user messages and update bot messages
    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];

      if (msg.isUser) {
        userMessages.push(msg.text);
        updatedMessages.push(msg);
      } else {
        // For bot messages, we'll regenerate them based on the conversation context
        // Skip bot messages for now, we'll regenerate them
      }
    }

    // Clear messages and regenerate conversation in new language
    this.messages = [];

    // If we have user messages, regenerate the conversation
    if (userMessages.length > 0) {
      // Add welcome message in new language
      this.addBotMessage(this.getWelcomeMessage(), this.getWelcomeQuickActions());

      // Regenerate responses for each user message
      userMessages.forEach((userText) => {
        this.addUserMessage(userText);
        const response = this.generateResponse(userText);
        this.addBotMessage(response.text, response.quickActions);
      });
    } else {
      // Just update welcome message
      this.addBotMessage(this.getWelcomeMessage(), this.getWelcomeQuickActions());
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.showQuickActions = false;

    // Simulate bot typing
    this.isTyping = true;
    setTimeout(() => {
      const response = this.generateResponse(userMessage);
      this.addBotMessage(response.text, response.quickActions);
      this.isTyping = false;
    }, 800);
  }

  handleQuickAction(action: string): void {
    this.showQuickActions = false;
    this.addUserMessage(action);
    this.isTyping = true;

    setTimeout(() => {
      const response = this.generateResponse(action);
      this.addBotMessage(response.text, response.quickActions);
      this.isTyping = false;
    }, 600);
  }

  addUserMessage(text: string): void {
    this.messages.push({
      text,
      isUser: true,
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  addBotMessage(text: string, quickActions?: QuickAction[]): void {
    this.messages.push({
      text,
      isUser: false,
      timestamp: new Date(),
      quickActions: quickActions,
    });
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  shareConversation(): void {
    if (this.messages.length === 0) {
      return;
    }

    // Generate conversation summary
    const conversationText = this.messages
      .map((msg) => {
        const sender = msg.isUser ? 'You' : 'Athena';
        return `${sender}: ${msg.text}`;
      })
      .join('\n\n');

    const shareText = `Chat with Shield of Athena:\n\n${conversationText}\n\n---\nShield of Athena - Supporting women and children`;

    // Use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: 'Chat with Shield of Athena',
          text: shareText,
        })
        .catch((err) => {
          console.log('Error sharing:', err);
        });
    } else {
      // If Web Share API is not available, show a message
      alert(this.getTranslation('share_not_available', this.currentLanguage));
    }
  }

  // Text-to-Speech methods
  speakMessage(text: string, messageIndex: number): void {
    if (!this.speechSynthesis) return;

    // Stop any current speech
    this.stopSpeech();

    // Clean text (remove emojis and special formatting for better speech)
    const cleanText = text
      .replace(/[👋🛡️💙📚🌍⚖️🏠💬⚔️🌟📞📧📍]/g, '')
      .replace(/\n/g, '. ')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Set language based on current language - get fresh value
      const currentLang = this.languageService.getCurrentLanguage();
      const langMap: { [key: string]: string } = {
        en: 'en-US',
        fr: 'fr-FR',
        es: 'es-ES',
        ar: 'ar-SA',
        zh: 'zh-CN',
        hi: 'hi-IN',
        ru: 'ru-RU',
        pt: 'pt-BR',
        it: 'it-IT',
        de: 'de-DE',
      };
      const langCode = langMap[currentLang] || langMap['en'] || 'en-US';
      utterance.lang = langCode;

      // Select a voice that matches the language
      const voice = this.getVoiceForLanguage(langCode);
      if (voice) {
        utterance.voice = voice;
        // Also set lang to match voice for better compatibility
        utterance.lang = voice.lang;
      } else {
        // If no voice found, still set the language code
        // The browser will try to use its default voice for that language
        utterance.lang = langCode;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onend = () => {
        this.speakingMessageIndex = null;
        this.currentUtterance = null;
        this.isPausedState = false;
        this.cdr.detectChanges();
      };

      utterance.onerror = (error) => {
        console.warn('Speech synthesis error:', error);
        this.speakingMessageIndex = null;
        this.currentUtterance = null;
        this.isPausedState = false;
        this.cdr.detectChanges();
      };

      this.currentUtterance = utterance;
      this.speakingMessageIndex = messageIndex;
      this.isPausedState = false;
      this.cdr.detectChanges();

      // Attempt to speak - will work even if no perfect voice match is found
      this.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speakMessage:', error);
      // Reset state on error
      this.speakingMessageIndex = null;
      this.currentUtterance = null;
      this.isPausedState = false;
      this.cdr.detectChanges();
    }
  }

  loadVoices(): void {
    if (!this.speechSynthesis) return;

    try {
      const voices = this.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        this.availableVoices = voices;
        this.voicesLoaded = true;
      }
    } catch (error) {
      console.warn('Error loading voices:', error);
      this.voicesLoaded = false;
    }
  }

  getVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    if (!this.speechSynthesis) return null;

    // Ensure voices are loaded
    if (!this.voicesLoaded || this.availableVoices.length === 0) {
      this.loadVoices();
    }

    const voices =
      this.availableVoices.length > 0 ? this.availableVoices : this.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) {
      // No voices available on this device
      return null;
    }

    // Try to find a voice that matches the language exactly
    let voice = voices.find((v) => v.lang === langCode);

    // If exact match not found, try to find a voice with the same language prefix
    if (!voice) {
      const langPrefix = langCode.split('-')[0];
      voice = voices.find((v) => v.lang.startsWith(langPrefix));
    }

    // If still not found, try to find any voice with similar language
    if (!voice) {
      const langMap: { [key: string]: string[] } = {
        en: ['en-US', 'en-GB', 'en-AU', 'en-CA'],
        fr: ['fr-FR', 'fr-CA', 'fr-BE'],
        es: ['es-ES', 'es-MX', 'es-AR'],
        ar: ['ar-SA', 'ar-EG', 'ar-AE'],
        zh: ['zh-CN', 'zh-TW', 'zh-HK'],
        hi: ['hi-IN'],
        ru: ['ru-RU'],
        pt: ['pt-BR', 'pt-PT'],
        it: ['it-IT'],
        de: ['de-DE', 'de-AT', 'de-CH'],
      };

      const langPrefix = langCode.split('-')[0];
      const possibleLangs = langMap[langPrefix] || [];
      for (const possibleLang of possibleLangs) {
        voice = voices.find((v) => v.lang === possibleLang);
        if (voice) break;
      }
    }

    // Fallback: prefer a default voice, but if none available, use first voice
    // Some devices may not have voices for all languages, so we gracefully degrade
    return voice || voices.find((v) => v.default) || voices[0] || null;
  }

  toggleSpeech(messageIndex: number, text: string): void {
    if (!this.speechSynthesis) return;

    // Check if this message is currently being spoken
    if (this.speakingMessageIndex === messageIndex) {
      // Currently speaking this message - pause/resume
      if (this.speechSynthesis.speaking && !this.isPausedState) {
        // Pause
        this.speechSynthesis.pause();
        this.isPausedState = true;
        // Use setTimeout to ensure state is updated after browser processes pause
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      } else if (this.isPausedState) {
        // Resume
        this.speechSynthesis.resume();
        this.isPausedState = false;
        // Use setTimeout to ensure state is updated after browser processes resume
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      } else {
        // Not speaking but index matches - stop
        this.stopSpeech();
      }
    } else {
      // Start speaking this message (stops any current speech)
      this.isPausedState = false;
      this.speakMessage(text, messageIndex);
    }
  }

  stopSpeech(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    this.speakingMessageIndex = null;
    this.currentUtterance = null;
    this.isPausedState = false;
    this.cdr.detectChanges();
  }

  isSpeaking(messageIndex: number): boolean {
    if (!this.speechSynthesis) return false;
    return (
      this.speakingMessageIndex === messageIndex &&
      (this.speechSynthesis.speaking || this.speechSynthesis.paused)
    );
  }

  isPaused(messageIndex: number): boolean {
    if (!this.speechSynthesis) return false;
    return this.speakingMessageIndex === messageIndex && this.isPausedState;
  }

  generateResponse(userMessage: string): { text: string; quickActions?: QuickAction[] } {
    const message = userMessage.toLowerCase();
    const lang = this.currentLanguage;

    // Donation-related queries
    if (
      this.containsKeywords(message, [
        'don',
        'donate',
        'donation',
        'donner',
        'donación',
        'give',
        'contribute',
        'support',
        'pay',
        'payment',
      ])
    ) {
      const quickActions = [
        { label: this.getTranslation('quick_donate_25', lang), action: 'donate_25' },
        { label: this.getTranslation('quick_donate_50', lang), action: 'donate_50' },
        { label: this.getTranslation('quick_donate_100', lang), action: 'donate_100' },
        { label: this.getTranslation('quick_custom', lang), action: 'donate_custom' },
      ];
      return {
        text: this.getTranslation('chat_donation_info', lang),
        quickActions: quickActions,
      };
    }

    // Help/Assistance queries
    if (
      this.containsKeywords(message, ['help', 'aide', 'ayuda', 'assistance', 'emergency', 'urgent'])
    ) {
      const quickActions = [
        { label: this.getTranslation('quick_helpline', lang), action: 'helpline' },
        { label: this.getTranslation('quick_shelter', lang), action: 'shelter' },
        { label: this.getTranslation('quick_resources', lang), action: 'resources' },
      ];
      return {
        text: this.getTranslation('chat_help_info', lang),
        quickActions: quickActions,
      };
    }

    // Contact information
    if (
      this.containsKeywords(message, [
        'contact',
        'contacter',
        'contacto',
        'email',
        'phone',
        'téléphone',
        'address',
        'location',
      ])
    ) {
      return {
        text: this.getTranslation('chat_contact_info', lang),
        quickActions: [
          { label: this.getTranslation('quick_call', lang), action: 'call' },
          { label: this.getTranslation('quick_email', lang), action: 'email' },
        ],
      };
    }

    // Impact/Results queries
    if (
      this.containsKeywords(message, [
        'impact',
        'impacto',
        'effet',
        'result',
        'statistics',
        'numbers',
      ])
    ) {
      return {
        text: this.getTranslation('chat_impact_info', lang),
        quickActions: [
          { label: this.getTranslation('quick_stories', lang), action: 'stories' },
          { label: this.getTranslation('quick_dashboard', lang), action: 'dashboard' },
        ],
      };
    }

    // Shelter queries
    if (
      this.containsKeywords(message, ['shelter', 'refuge', 'albergue', 'abri', 'housing', 'safe'])
    ) {
      return {
        text: this.getTranslation('chat_shelter_info', lang),
        quickActions: [
          { label: this.getTranslation('quick_helpline', lang), action: 'helpline' },
          { label: this.getTranslation('quick_donate', lang), action: 'donate' },
        ],
      };
    }

    // Tier/Badge queries
    if (
      this.containsKeywords(message, [
        'tier',
        'badge',
        'level',
        'demeter',
        'artemis',
        'athena',
        'benefits',
        'perks',
      ])
    ) {
      return {
        text: this.getTierInfo(lang),
        quickActions: [
          { label: this.getTranslation('quick_view_tiers', lang), action: 'tiers' },
          { label: this.getTranslation('quick_donate', lang), action: 'donate' },
        ],
      };
    }

    // Organization/About queries
    if (
      this.containsKeywords(message, [
        'organization',
        'organisation',
        'organización',
        'منظمة',
        '组织',
        'संगठन',
        'организация',
        'organização',
        'organizzazione',
        'Organisation',
        'about',
        'à propos',
        'acerca',
        'حول',
        '关于',
        'के बारे में',
        'о',
        'sobre',
        'su',
        'über',
        'qui êtes-vous',
        'who are you',
        'quién eres',
        'من أنت',
        '你是谁',
        'आप कौन हैं',
        'кто вы',
        'quem é você',
        'chi sei',
        'wer sind Sie',
        'shield of athena',
        "bouclier d'athéna",
        'escudo de atenea',
        'درع أثينا',
        '雅典娜之盾',
        'एथेना का ढाल',
        'щит афины',
        'escudo de atena',
        'scudo di atena',
        'schild der athena',
        'mission',
        'مهمة',
        '使命',
        'मिशन',
        'миссия',
        'missão',
        'missione',
        'Mission',
        'vision',
        'رؤية',
        '愿景',
        'दृष्टि',
        'видение',
        'visão',
        'visione',
        'Vision',
        'histoire',
        'history',
        'historia',
        'تاريخ',
        '历史',
        'इतिहास',
        'история',
        'história',
        'storia',
        'Geschichte',
      ])
    ) {
      return {
        text: this.getOrganizationInfo(lang),
        quickActions: [
          { label: this.getTranslation('quick_donate', lang), action: 'donate' },
          { label: this.getTranslation('quick_learn_more', lang), action: 'programs' },
          { label: this.getTranslation('quick_contact', lang), action: 'contact' },
        ],
      };
    }

    // Programs/Services queries
    if (
      this.containsKeywords(message, [
        'program',
        'service',
        'programme',
        'servicio',
        'counseling',
        'education',
        'legal',
      ])
    ) {
      return {
        text: this.getProgramsInfo(lang),
        quickActions: [
          { label: this.getTranslation('quick_learn_more', lang), action: 'programs' },
          { label: this.getTranslation('quick_donate', lang), action: 'donate' },
        ],
      };
    }

    // Greetings
    if (
      this.containsKeywords(message, [
        'hello',
        'hi',
        'bonjour',
        'salut',
        'hola',
        'hey',
        'good morning',
        'good afternoon',
        'مرحبا',
        '你好',
        'नमस्ते',
        'привет',
        'olá',
        'ciao',
        'hallo',
        'صباح الخير',
        '早上好',
        'सुप्रभात',
        'доброе утро',
        'bom dia',
        'buongiorno',
        'guten morgen',
      ])
    ) {
      return {
        text: this.getTranslation('chat_greeting', lang),
        quickActions: this.getWelcomeQuickActions(),
      };
    }

    // Thanks
    if (this.containsKeywords(message, ['thank', 'merci', 'gracias', 'thanks', 'appreciate'])) {
      return {
        text: this.getTranslation('chat_thanks', lang),
        quickActions: [
          { label: this.getTranslation('quick_donate', lang), action: 'donate' },
          { label: this.getTranslation('quick_learn_more', lang), action: 'learn' },
        ],
      };
    }

    // Default response
    return {
      text: this.getTranslation('chat_default', lang),
      quickActions: this.getWelcomeQuickActions(),
    };
  }

  getWelcomeQuickActions(): QuickAction[] {
    const lang = this.currentLanguage;
    return [
      { label: this.getTranslation('quick_donate', lang), action: 'donate', icon: 'heart' },
      { label: this.getTranslation('quick_learn', lang), action: 'learn', icon: 'info' },
      { label: this.getTranslation('quick_help', lang), action: 'help', icon: 'hand' },
      { label: this.getTranslation('quick_contact', lang), action: 'contact', icon: 'envelope' },
    ];
  }

  getTierInfo(lang: string): string {
    const translations: { [key: string]: string } = {
      en: "Oh, great question! We have three donation tiers that recognize our amazing supporters:\n\n🌟 Demeter (Nurture Tier): $0-$999\n   You'll get thank you emails, our newsletter, and community updates\n\n🛡️ Artemis (Protector Tier): $1,000-$4,999\n   Everything from Demeter, plus recognition on our donor wall and VIP event access\n\n⚔️ Athena (Guardian Tier): $5,000+\n   All Artemis benefits, plus you can attend board meetings and even name programs!\n\nPretty cool, right? Want to know more?",
      fr: 'Oh, excellente question! On a trois niveaux de don qui reconnaissent nos super supporters:\n\n🌟 Demeter (Niveau Nurture): 0$-999$\n   Tu recevras des emails de remerciement, notre newsletter, et des mises à jour communautaires\n\n🛡️ Artemis (Niveau Protecteur): 1,000$-4,999$\n   Tout de Demeter, plus reconnaissance sur notre mur des donateurs et accès aux événements VIP\n\n⚔️ Athena (Niveau Gardien): 5,000$+\n   Tous les avantages Artemis, plus tu peux assister aux réunions du conseil et même nommer des programmes!\n\nPlutôt cool, non? Tu veux en savoir plus?',
      es: '¡Oh, excelente pregunta! Tenemos tres niveles de donación que reconocen a nuestros increíbles seguidores:\n\n🌟 Demeter (Nivel Nutrir): $0-$999\n   Recibirás emails de agradecimiento, nuestro boletín y actualizaciones comunitarias\n\n🛡️ Artemis (Nivel Protector): $1,000-$4,999\n   Todo de Demeter, más reconocimiento en nuestro muro de donantes y acceso a eventos VIP\n\n⚔️ Athena (Nivel Guardián): $5,000+\n   ¡Todos los beneficios de Artemis, más puedes asistir a reuniones de junta e incluso nombrar programas!\n\n¡Bastante genial, ¿verdad? ¿Quieres saber más?',
      ar: 'أوه، سؤال رائع! لدينا ثلاثة مستويات تبرع تعترف بداعمينا الرائعين:\n\n🌟 ديميتر (مستوى الرعاية): 0$-999$\n   ستحصل على رسائل شكر، نشرتنا الإخبارية، وتحديثات المجتمع\n\n🛡️ أرتميس (مستوى الحماية): 1,000$-4,999$\n   كل شيء من ديميتر، بالإضافة إلى الاعتراف على جدار المتبرعين والوصول إلى فعاليات VIP\n\n⚔️ أثينا (مستوى الحارس): 5,000$+\n   جميع فوائد أرتميس، بالإضافة إلى أنه يمكنك حضور اجتماعات المجلس وحتى تسمية البرامج!\n\nرائع جداً، أليس كذلك؟ تريد معرفة المزيد؟',
      zh: '哦，好问题！我们有三个捐赠等级来认可我们出色的支持者：\n\n🌟 得墨忒耳（培育等级）：$0-$999\n   您将收到感谢邮件、我们的通讯和社区更新\n\n🛡️ 阿尔忒弥斯（保护者等级）：$1,000-$4,999\n   得墨忒耳的所有福利，加上在我们的捐赠墙上获得认可和VIP活动访问权限\n\n⚔️ 雅典娜（守护者等级）：$5,000+\n   阿尔忒弥斯的所有福利，加上您可以参加董事会会议甚至命名项目！\n\n很酷，对吧？想了解更多吗？',
      hi: 'ओह, बढ़िया सवाल! हमारे पास तीन दान स्तर हैं जो हमारे अद्भुत समर्थकों को पहचानते हैं:\n\n🌟 डेमेटर (पोषण स्तर): $0-$999\n   आपको धन्यवाद ईमेल, हमारा न्यूज़लेटर, और सामुदायिक अपडेट मिलेंगे\n\n🛡️ आर्टेमिस (संरक्षक स्तर): $1,000-$4,999\n   डेमेटर से सब कुछ, साथ ही हमारी दानदाता दीवार पर मान्यता और VIP इवेंट एक्सेस\n\n⚔️ एथेना (संरक्षक स्तर): $5,000+\n   सभी आर्टेमिस लाभ, साथ ही आप बोर्ड मीटिंग में भाग ले सकते हैं और यहां तक कि कार्यक्रमों का नाम भी दे सकते हैं!\n\nबहुत अच्छा, है ना? और जानना चाहेंगे?',
      ru: 'О, отличный вопрос! У нас есть три уровня пожертвований, которые признают наших удивительных сторонников:\n\n🌟 Деметра (Уровень заботы): $0-$999\n   Вы получите благодарственные письма, нашу рассылку и обновления сообщества\n\n🛡️ Артемида (Уровень защитника): $1,000-$4,999\n   Все от Деметры, плюс признание на нашей стене доноров и доступ к VIP-мероприятиям\n\n⚔️ Афина (Уровень хранителя): $5,000+\n   Все преимущества Артемиды, плюс вы можете посещать заседания совета и даже называть программы!\n\nДовольно круто, правда? Хотите узнать больше?',
      pt: 'Oh, ótima pergunta! Temos três níveis de doação que reconhecem nossos incríveis apoiadores:\n\n🌟 Deméter (Nível Nutrir): $0-$999\n   Você receberá emails de agradecimento, nosso boletim informativo e atualizações da comunidade\n\n🛡️ Ártemis (Nível Protetor): $1,000-$4,999\n   Tudo do Deméter, mais reconhecimento em nosso mural de doadores e acesso a eventos VIP\n\n⚔️ Atena (Nível Guardião): $5,000+\n   Todos os benefícios de Ártemis, mais você pode participar de reuniões do conselho e até mesmo nomear programas!\n\nMuito legal, certo? Quer saber mais?',
      it: 'Oh, ottima domanda! Abbiamo tre livelli di donazione che riconoscono i nostri fantastici sostenitori:\n\n🌟 Demetra (Livello Nutrire): $0-$999\n   Riceverai email di ringraziamento, la nostra newsletter e aggiornamenti della comunità\n\n🛡️ Artemide (Livello Protettore): $1,000-$4,999\n   Tutto da Demetra, più riconoscimento sul nostro muro dei donatori e accesso a eventi VIP\n\n⚔️ Atena (Livello Guardiano): $5,000+\n   Tutti i benefici di Artemide, più puoi partecipare alle riunioni del consiglio e persino nominare programmi!\n\nPiuttosto figo, vero? Vuoi saperne di più?',
      de: 'Oh, großartige Frage! Wir haben drei Spendenstufen, die unsere großartigen Unterstützer anerkennen:\n\n🌟 Demeter (Pflegestufe): $0-$999\n   Sie erhalten Dankes-E-Mails, unseren Newsletter und Community-Updates\n\n🛡️ Artemis (Beschützerstufe): $1,000-$4,999\n   Alles von Demeter, plus Anerkennung an unserer Spenderwand und Zugang zu VIP-Veranstaltungen\n\n⚔️ Athena (Wächterstufe): $5,000+\n   Alle Artemis-Vorteile, plus Sie können an Vorstandssitzungen teilnehmen und sogar Programme benennen!\n\nZiemlich cool, oder? Möchten Sie mehr erfahren?',
    };
    return translations[lang] || translations['en'];
  }

  getOrganizationInfo(lang: string): string {
    const translations: { [key: string]: string } = {
      en: "I'm so happy you asked! Shield of Athena is a nonprofit organization based in Montreal, Quebec. We've been helping women and children who experience domestic violence since 1991.\n\nOur mission is to provide:\n\n🛡️ Protection - Safe shelter and emergency services for women and children fleeing domestic violence\n💙 Support - Counseling and emotional support to help survivors heal and rebuild their lives\n📚 Education - Prevention programs and skills training to break the cycle of violence\n🌍 Multilingual Services - We speak 10+ languages to serve diverse communities in Montreal\n⚖️ Legal Aid - Help navigating the legal system and accessing resources\n\nWe're here 24/7 to help women and children escape domestic violence and start new lives. Every donation helps us continue this critical work. Want to learn more about how you can help?",
      fr: "Je suis tellement contente que tu demandes! Le Bouclier d'Athéna est un organisme à but non lucratif basé à Montréal, Québec. On aide les femmes et les enfants qui subissent de la violence conjugale depuis 1991.\n\nNotre mission est de fournir:\n\n🛡️ Protection - Refuge sûr et services d'urgence pour les femmes et les enfants qui fuient la violence conjugale\n💙 Soutien - Counseling et soutien émotionnel pour aider les survivantes à guérir et reconstruire leur vie\n📚 Éducation - Programmes de prévention et formation pour briser le cycle de la violence\n🌍 Services multilingues - On parle 10+ langues pour servir les communautés diverses à Montréal\n⚖️ Aide juridique - Aide pour naviguer le système juridique et accéder aux ressources\n\nOn est là 24/7 pour aider les femmes et les enfants à échapper à la violence conjugale et recommencer leur vie. Chaque don nous aide à continuer ce travail essentiel. Tu veux en savoir plus sur comment tu peux aider?",
      es: '¡Me alegra que preguntes! Escudo de Atenea es una organización sin fines de lucro con sede en Montreal, Quebec. Hemos estado ayudando a mujeres y niños que experimentan violencia doméstica desde 1991.\n\nNuestra misión es proporcionar:\n\n🛡️ Protección - Refugio seguro y servicios de emergencia para mujeres y niños que huyen de la violencia doméstica\n💙 Apoyo - Servicios de consejería y apoyo emocional para ayudar a las sobrevivientes a sanar y reconstruir sus vidas\n📚 Educación - Programas de prevención y capacitación para romper el ciclo de violencia\n🌍 Servicios Multilingües - Hablamos 10+ idiomas para servir a comunidades diversas en Montreal\n⚖️ Ayuda Legal - Ayuda para navegar el sistema legal y acceder a recursos\n\nEstamos aquí 24/7 para ayudar a mujeres y niños a escapar de la violencia doméstica y comenzar nuevas vidas. Cada donación nos ayuda a continuar este trabajo crítico. ¿Quieres saber más sobre cómo puedes ayudar?',
      ar: 'أنا سعيدة جداً أنك سألت! درع أثينا هو منظمة غير ربحية مقرها مونتريال، كيبيك. نساعد النساء والأطفال الذين يعانون من العنف المنزلي منذ عام 1991.\n\nمهمتنا هي توفير:\n\n🛡️ الحماية - مأوى آمن وخدمات طوارئ للنساء والأطفال الذين يفرون من العنف المنزلي\n💙 الدعم - الاستشارة والدعم العاطفي لمساعدة الناجيات على الشفاء وإعادة بناء حياتهن\n📚 التعليم - برامج الوقاية والتدريب على المهارات لكسر دائرة العنف\n🌍 الخدمات متعددة اللغات - نتحدث 10+ لغة لخدمة المجتمعات المتنوعة في مونتريال\n⚖️ المساعدة القانونية - المساعدة في التنقل في النظام القانوني والوصول إلى الموارد\n\nنحن هنا على مدار الساعة لمساعدة النساء والأطفال على الهروب من العنف المنزلي وبدء حياة جديدة. كل تبرع يساعدنا على مواصلة هذا العمل الحاسم. تريد معرفة المزيد عن كيفية المساعدة؟',
      zh: '我很高兴您问这个问题！雅典娜之盾是一个位于魁北克省蒙特利尔的非营利组织。自1991年以来，我们一直在帮助遭受家庭暴力的妇女和儿童。\n\n我们的使命是提供：\n\n🛡️ 保护 - 为逃离家庭暴力的妇女和儿童提供安全住所和紧急服务\n💙 支持 - 咨询和情感支持，帮助幸存者治愈并重建生活\n📚 教育 - 预防项目和技能培训，打破暴力循环\n🌍 多语言服务 - 我们讲10多种语言，为蒙特利尔的多元化社区服务\n⚖️ 法律援助 - 帮助导航法律系统并获取资源\n\n我们24/7在这里帮助妇女和儿童逃离家庭暴力并开始新生活。每一笔捐款都帮助我们继续这项重要的工作。想了解更多关于如何帮助的信息吗？',
      hi: 'मुझे बहुत खुशी है कि आपने पूछा! शील्ड ऑफ एथेना मॉन्ट्रियल, क्यूबेक में स्थित एक गैर-लाभकारी संगठन है। हम 1991 से घरेलू हिंसा का अनुभव करने वाली महिलाओं और बच्चों की मदद कर रहे हैं।\n\nहमारा मिशन प्रदान करना है:\n\n🛡️ सुरक्षा - घरेलू हिंसा से भागने वाली महिलाओं और बच्चों के लिए सुरक्षित आश्रय और आपातकालीन सेवाएं\n💙 समर्थन - बचे लोगों को ठीक होने और अपने जीवन को फिर से बनाने में मदद करने के लिए परामर्श और भावनात्मक समर्थन\n📚 शिक्षा - हिंसा के चक्र को तोड़ने के लिए रोकथाम कार्यक्रम और कौशल प्रशिक्षण\n🌍 बहुभाषी सेवाएं - हम मॉन्ट्रियल में विविध समुदायों की सेवा के लिए 10+ भाषाएं बोलते हैं\n⚖️ कानूनी सहायता - कानूनी प्रणाली में नेविगेट करने और संसाधनों तक पहुंचने में मदद\n\nहम 24/7 यहां हैं ताकि महिलाओं और बच्चों को घरेलू हिंसा से बचने और नया जीवन शुरू करने में मदद कर सकें। हर दान हमें इस महत्वपूर्ण काम को जारी रखने में मदद करता है। आप कैसे मदद कर सकते हैं, इसके बारे में और जानना चाहेंगे?',
      ru: 'Я так рада, что вы спросили! Щит Афины - это некоммерческая организация, базирующаяся в Монреале, Квебек. Мы помогаем женщинам и детям, переживающим домашнее насилие, с 1991 года.\n\nНаша миссия - предоставлять:\n\n🛡️ Защита - Безопасное убежище и экстренные услуги для женщин и детей, спасающихся от домашнего насилия\n💙 Поддержка - Консультирование и эмоциональная поддержка, чтобы помочь выжившим исцелиться и восстановить свою жизнь\n📚 Образование - Программы профилактики и обучение навыкам, чтобы разорвать цикл насилия\n🌍 Многоязычные услуги - Мы говорим на 10+ языках, чтобы обслуживать разнообразные сообщества в Монреале\n⚖️ Юридическая помощь - Помощь в навигации по правовой системе и доступе к ресурсам\n\nМы здесь 24/7, чтобы помочь женщинам и детям избежать домашнего насилия и начать новую жизнь. Каждое пожертвование помогает нам продолжать эту критически важную работу. Хотите узнать больше о том, как вы можете помочь?',
      pt: 'Estou tão feliz que você perguntou! Escudo de Atena é uma organização sem fins lucrativos com sede em Montreal, Quebec. Temos ajudado mulheres e crianças que sofrem violência doméstica desde 1991.\n\nNossa missão é fornecer:\n\n🛡️ Proteção - Abrigo seguro e serviços de emergência para mulheres e crianças que fogem da violência doméstica\n💙 Apoio - Aconselhamento e apoio emocional para ajudar sobreviventes a curar e reconstruir suas vidas\n📚 Educação - Programas de prevenção e treinamento de habilidades para quebrar o ciclo de violência\n🌍 Serviços Multilíngues - Falamos 10+ idiomas para servir comunidades diversas em Montreal\n⚖️ Ajuda Legal - Ajuda para navegar no sistema legal e acessar recursos\n\nEstamos aqui 24/7 para ajudar mulheres e crianças a escapar da violência doméstica e começar novas vidas. Cada doação nos ajuda a continuar este trabalho crítico. Quer saber mais sobre como você pode ajudar?',
      it: "Sono così felice che tu abbia chiesto! Scudo di Atena è un'organizzazione senza scopo di lucro con sede a Montreal, Quebec. Aiutiamo donne e bambini che subiscono violenza domestica dal 1991.\n\nLa nostra missione è fornire:\n\n🛡️ Protezione - Rifugio sicuro e servizi di emergenza per donne e bambini che fuggono dalla violenza domestica\n💙 Supporto - Consulenza e supporto emotivo per aiutare i sopravvissuti a guarire e ricostruire le loro vite\n📚 Educazione - Programmi di prevenzione e formazione per rompere il ciclo della violenza\n🌍 Servizi Multilingue - Parliamo 10+ lingue per servire comunità diverse a Montreal\n⚖️ Assistenza Legale - Aiuto per navigare nel sistema legale e accedere alle risorse\n\nSiamo qui 24/7 per aiutare donne e bambini a fuggire dalla violenza domestica e iniziare nuove vite. Ogni donazione ci aiuta a continuare questo lavoro critico. Vuoi saperne di più su come puoi aiutare?",
      de: 'Ich bin so glücklich, dass Sie gefragt haben! Schild der Athena ist eine gemeinnützige Organisation mit Sitz in Montreal, Quebec. Wir helfen seit 1991 Frauen und Kindern, die häusliche Gewalt erleben.\n\nUnsere Mission ist es, bereitzustellen:\n\n🛡️ Schutz - Sichere Unterkünfte und Notdienste für Frauen und Kinder, die vor häuslicher Gewalt fliehen\n💙 Unterstützung - Beratung und emotionale Unterstützung, um Überlebenden zu helfen, zu heilen und ihr Leben wieder aufzubauen\n📚 Bildung - Präventionsprogramme und Kompetenztraining, um den Kreislauf der Gewalt zu durchbrechen\n🌍 Mehrsprachige Dienste - Wir sprechen 10+ Sprachen, um vielfältige Gemeinschaften in Montreal zu bedienen\n⚖️ Rechtshilfe - Hilfe bei der Navigation im Rechtssystem und beim Zugang zu Ressourcen\n\nWir sind 24/7 hier, um Frauen und Kindern zu helfen, häuslicher Gewalt zu entkommen und neue Leben zu beginnen. Jede Spende hilft uns, diese kritische Arbeit fortzusetzen. Möchten Sie mehr darüber erfahren, wie Sie helfen können?',
    };
    return translations[lang] || translations['en'];
  }

  getProgramsInfo(lang: string): string {
    const translations: { [key: string]: string } = {
      en: "I'm so excited to tell you about what we do! We offer:\n\n🏠 Emergency Shelter - A safe place for women and children when they need it most\n💬 Counseling Services - One-on-one and group therapy to help people heal\n📚 Education Programs - Skills training and workshops to help rebuild lives\n⚖️ Legal Support - Help navigating the legal system\n🌍 Multilingual Services - We speak 10+ languages so everyone feels heard\n\nAnd guess what? All of this is possible because of amazing donors like you!",
      fr: "Je suis tellement excitée de te parler de ce qu'on fait! On offre:\n\n🏠 Refuge d'urgence - Un endroit sûr pour les femmes et les enfants quand ils en ont le plus besoin\n💬 Services de counseling - Thérapie individuelle et de groupe pour aider les gens à guérir\n📚 Programmes d'éducation - Formation et ateliers pour aider à reconstruire des vies\n⚖️ Soutien juridique - Aide pour naviguer le système juridique\n🌍 Services multilingues - On parle 10+ langues pour que tout le monde se sente entendu\n\nEt devine quoi? Tout ça est possible grâce à des donateurs géniaux comme toi!",
      es: '¡Estoy tan emocionada de contarte lo que hacemos! Ofrecemos:\n\n🏠 Refugio de Emergencia - Un lugar seguro para mujeres y niños cuando más lo necesitan\n💬 Servicios de Consejería - Terapia individual y grupal para ayudar a las personas a sanar\n📚 Programas Educativos - Capacitación y talleres para ayudar a reconstruir vidas\n⚖️ Apoyo Legal - Ayuda para navegar el sistema legal\n🌍 Servicios Multilingües - Hablamos 10+ idiomas para que todos se sientan escuchados\n\n¿Y adivina qué? ¡Todo esto es posible gracias a donantes increíbles como tú!',
      ar: 'أنا متحمسة جداً لأخبرك بما نقوم به! نقدم:\n\n🏠 مأوى الطوارئ - مكان آمن للنساء والأطفال عندما يحتاجونه أكثر\n💬 خدمات الاستشارة - العلاج الفردي والجماعي لمساعدة الناس على الشفاء\n📚 برامج التعليم - التدريب على المهارات وورش العمل لمساعدة إعادة بناء الحياة\n⚖️ الدعم القانوني - المساعدة في التنقل في النظام القانوني\n🌍 الخدمات متعددة اللغات - نتحدث 10+ لغة حتى يشعر الجميع بأنهم مسموعون\n\nوتخمين ماذا؟ كل هذا ممكن بفضل المتبرعين الرائعين مثلك!',
      zh: '我很兴奋地告诉您我们做什么！我们提供：\n\n🏠 紧急庇护所 - 当妇女和儿童最需要时的安全场所\n💬 咨询服务 - 一对一和团体治疗，帮助人们治愈\n📚 教育项目 - 技能培训和研讨会，帮助重建生活\n⚖️ 法律支持 - 帮助导航法律系统\n🌍 多语言服务 - 我们讲10多种语言，让每个人都感到被倾听\n\n猜猜看？所有这些都是因为像您这样出色的捐赠者而成为可能！',
      hi: 'मैं आपको बताने के लिए बहुत उत्साहित हूं कि हम क्या करते हैं! हम प्रदान करते हैं:\n\n🏠 आपातकालीन आश्रय - महिलाओं और बच्चों के लिए एक सुरक्षित स्थान जब उन्हें इसकी सबसे अधिक आवश्यकता हो\n💬 परामर्श सेवाएं - लोगों को ठीक होने में मदद करने के लिए एक-से-एक और समूह चिकित्सा\n📚 शिक्षा कार्यक्रम - जीवन को फिर से बनाने में मदद करने के लिए कौशल प्रशिक्षण और कार्यशालाएं\n⚖️ कानूनी सहायता - कानूनी प्रणाली में नेविगेट करने में मदद\n🌍 बहुभाषी सेवाएं - हम 10+ भाषाएं बोलते हैं ताकि हर कोई सुना हुआ महसूस करे\n\nऔर अंदाज़ा लगाओ? यह सब आप जैसे अद्भुत दानदाताओं के कारण संभव है!',
      ru: 'Я так рада рассказать вам о том, что мы делаем! Мы предлагаем:\n\n🏠 Экстренное убежище - Безопасное место для женщин и детей, когда они больше всего в этом нуждаются\n💬 Консультационные услуги - Индивидуальная и групповая терапия, чтобы помочь людям исцелиться\n📚 Образовательные программы - Обучение навыкам и мастер-классы, чтобы помочь восстановить жизнь\n⚖️ Юридическая поддержка - Помощь в навигации по правовой системе\n🌍 Многоязычные услуги - Мы говорим на 10+ языках, чтобы каждый чувствовал себя услышанным\n\nИ знаете что? Все это возможно благодаря таким удивительным донорам, как вы!',
      pt: 'Estou tão animada para contar o que fazemos! Oferecemos:\n\n🏠 Abrigo de Emergência - Um lugar seguro para mulheres e crianças quando mais precisam\n💬 Serviços de Aconselhamento - Terapia individual e em grupo para ajudar as pessoas a curar\n📚 Programas Educacionais - Treinamento de habilidades e workshops para ajudar a reconstruir vidas\n⚖️ Apoio Legal - Ajuda para navegar no sistema legal\n🌍 Serviços Multilíngues - Falamos 10+ idiomas para que todos se sintam ouvidos\n\nE adivinhe? Tudo isso é possível graças a doadores incríveis como você!',
      it: 'Sono così entusiasta di raccontarti cosa facciamo! Offriamo:\n\n🏠 Rifugio di Emergenza - Un posto sicuro per donne e bambini quando ne hanno più bisogno\n💬 Servizi di Consulenza - Terapia individuale e di gruppo per aiutare le persone a guarire\n📚 Programmi Educativi - Formazione e workshop per aiutare a ricostruire vite\n⚖️ Supporto Legale - Aiuto per navigare nel sistema legale\n🌍 Servizi Multilingue - Parliamo 10+ lingue così tutti si sentono ascoltati\n\nE indovina? Tutto questo è possibile grazie a donatori fantastici come te!',
      de: 'Ich bin so aufgeregt, Ihnen zu erzählen, was wir tun! Wir bieten:\n\n🏠 Notunterkunft - Ein sicherer Ort für Frauen und Kinder, wenn sie ihn am meisten brauchen\n💬 Beratungsdienste - Einzel- und Gruppentherapie, um Menschen beim Heilen zu helfen\n📚 Bildungsprogramme - Kompetenztraining und Workshops, um beim Wiederaufbau von Leben zu helfen\n⚖️ Rechtliche Unterstützung - Hilfe bei der Navigation im Rechtssystem\n🌍 Mehrsprachige Dienste - Wir sprechen 10+ Sprachen, damit sich jeder gehört fühlt\n\nUnd raten Sie mal? All dies ist möglich dank großartiger Spender wie Ihnen!',
    };
    return translations[lang] || translations['en'];
  }

  containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }

  getWelcomeMessage(): string {
    return this.getTranslation('chat_welcome', this.currentLanguage);
  }

  executeAction(action: string): void {
    switch (action) {
      case 'donate':
      case 'donate_25':
        localStorage.setItem('donationAmount', '25');
        localStorage.setItem('recurringOption', 'monthly');
        this.router.navigate(['/payment']);
        break;
      case 'donate_50':
        localStorage.setItem('donationAmount', '50');
        localStorage.setItem('recurringOption', 'monthly');
        this.router.navigate(['/payment']);
        break;
      case 'donate_100':
        localStorage.setItem('donationAmount', '100');
        localStorage.setItem('recurringOption', 'monthly');
        this.router.navigate(['/payment']);
        break;
      case 'donate_custom':
        this.router.navigate(['/payment']);
        break;
      case 'helpline':
        window.open('tel:1-888-HELP-NOW', '_self');
        break;
      case 'call':
        window.open('tel:1-888-HELP-NOW', '_self');
        break;
      case 'email':
        window.location.href = 'mailto:help@shieldathena.org';
        break;
      case 'stories':
        window.location.href = '/#stories';
        this.isOpen = false;
        break;
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        this.isOpen = false;
        break;
      case 'tiers':
        window.location.href = '/#donation-tiers';
        this.isOpen = false;
        break;
      case 'programs':
        window.location.href = '/#impact';
        this.isOpen = false;
        break;
      case 'learn':
        this.handleQuickAction(this.getLocalizedQuestion('learn'));
        break;
      case 'help':
        this.handleQuickAction(this.getLocalizedQuestion('help'));
        break;
      case 'contact':
        this.handleQuickAction(this.getLocalizedQuestion('contact'));
        break;
      case 'resources':
        this.handleQuickAction(this.getLocalizedQuestion('resources'));
        break;
      default:
        this.handleQuickAction(action);
    }
  }

  getLocalizedQuestion(type: 'learn' | 'help' | 'contact' | 'resources'): string {
    const questions: { [key: string]: { [lang: string]: string } } = {
      learn: {
        en: 'tell me about your organization',
        fr: 'parle-moi de votre organisation',
        es: 'cuéntame sobre tu organización',
        ar: 'أخبرني عن منظمتك',
        zh: '告诉我关于您的组织',
        hi: 'मुझे अपने संगठन के बारे में बताएं',
        ru: 'расскажите мне о вашей организации',
        pt: 'fale-me sobre sua organização',
        it: 'parlami della tua organizzazione',
        de: 'erzählen Sie mir von Ihrer Organisation',
      },
      help: {
        en: 'I need help',
        fr: "j'ai besoin d'aide",
        es: 'necesito ayuda',
        ar: 'أحتاج مساعدة',
        zh: '我需要帮助',
        hi: 'मुझे मदद चाहिए',
        ru: 'мне нужна помощь',
        pt: 'preciso de ajuda',
        it: 'ho bisogno di aiuto',
        de: 'ich brauche Hilfe',
      },
      contact: {
        en: 'how can I contact you',
        fr: 'comment puis-je vous contacter',
        es: 'cómo puedo contactarte',
        ar: 'كيف يمكنني الاتصال بك',
        zh: '我如何联系您',
        hi: 'मैं आपसे कैसे संपर्क कर सकता हूं',
        ru: 'как я могу с вами связаться',
        pt: 'como posso entrar em contato',
        it: 'come posso contattarti',
        de: 'wie kann ich Sie kontaktieren',
      },
      resources: {
        en: 'what resources do you offer',
        fr: 'quelles ressources offrez-vous',
        es: 'qué recursos ofrecen',
        ar: 'ما هي الموارد التي تقدمونها',
        zh: '您提供什么资源',
        hi: 'आप कौन से संसाधन प्रदान करते हैं',
        ru: 'какие ресурсы вы предлагаете',
        pt: 'quais recursos você oferece',
        it: 'quali risorse offrite',
        de: 'welche Ressourcen bieten Sie an',
      },
    };
    return questions[type][this.currentLanguage] || questions[type]['en'];
  }

  getTranslation(key: string, lang: string): string {
    const translation = this.languageService.getTranslation(key);
    // If translation service returns the key itself or null, use default translation
    if (!translation || translation === key) {
      return this.getDefaultTranslation(key, lang);
    }
    return translation;
  }

  getDefaultTranslation(key: string, lang: string): string {
    const translations: { [key: string]: { [lang: string]: string } } = {
      chat_welcome: {
        en: "Hi there! 👋 I'm Athena. I'm here to help you with anything about Shield of Athena - whether you want to donate, learn about our work, or need assistance. What can I help you with?",
        fr: "Salut! 👋 Je suis Athéna. Je suis là pour t'aider avec tout ce qui concerne le Bouclier d'Athéna - que tu veuilles faire un don, en apprendre plus sur notre travail, ou avoir besoin d'aide. Comment puis-je t'aider?",
        es: '¡Hola! 👋 Soy Atenea. Estoy aquí para ayudarte con todo lo relacionado con Escudo de Atenea - si quieres donar, conocer nuestro trabajo, o necesitas ayuda. ¿En qué puedo ayudarte?',
        ar: 'مرحباً! 👋 أنا أثينا. أنا هنا لمساعدتك في أي شيء يتعلق بدرع أثينا - سواء كنت تريد التبرع أو معرفة المزيد عن عملنا أو تحتاج إلى مساعدة. كيف يمكنني مساعدتك؟',
        zh: '你好！👋 我是雅典娜。我在这里帮助您了解雅典娜之盾的任何事情 - 无论您想捐款、了解我们的工作，还是需要帮助。我能为您做些什么？',
        hi: 'नमस्ते! 👋 मैं एथेना हूं। मैं यहां शील्ड ऑफ एथेना के बारे में किसी भी चीज़ में आपकी मदद करने के लिए हूं - चाहे आप दान करना चाहते हों, हमारे काम के बारे में जानना चाहते हों, या सहायता की आवश्यकता हो। मैं आपकी कैसे मदद कर सकती हूं?',
        ru: 'Привет! 👋 Я Афина. Я здесь, чтобы помочь вам с чем угодно, связанным со Щитом Афины - хотите ли вы сделать пожертвование, узнать о нашей работе или нужна помощь. Чем я могу вам помочь?',
        pt: 'Olá! 👋 Eu sou Atena. Estou aqui para ajudá-lo com qualquer coisa sobre o Escudo de Atena - se você quer doar, saber mais sobre nosso trabalho ou precisa de ajuda. Como posso ajudá-lo?',
        it: 'Ciao! 👋 Sono Atena. Sono qui per aiutarti con qualsiasi cosa riguardi lo Scudo di Atena - se vuoi donare, saperne di più sul nostro lavoro o hai bisogno di assistenza. Come posso aiutarti?',
        de: 'Hallo! 👋 Ich bin Athena. Ich bin hier, um Ihnen bei allem zu helfen, was mit dem Schild der Athena zu tun hat - ob Sie spenden möchten, mehr über unsere Arbeit erfahren oder Hilfe benötigen. Womit kann ich Ihnen helfen?',
      },
      quick_donate: {
        en: 'Make a Donation',
        fr: 'Faire un don',
        es: 'Hacer una donación',
        ar: 'التبرع',
        zh: '捐款',
        hi: 'दान करें',
        ru: 'Сделать пожертвование',
        pt: 'Fazer uma doação',
        it: 'Fai una donazione',
        de: 'Spenden',
      },
      quick_learn: {
        en: 'Learn About Us',
        fr: 'En savoir plus',
        es: 'Conocer más',
        ar: 'تعرف علينا',
        zh: '了解我们',
        hi: 'हमारे बारे में जानें',
        ru: 'Узнать о нас',
        pt: 'Saiba mais',
        it: 'Scopri di più',
        de: 'Mehr erfahren',
      },
      quick_help: {
        en: 'Get Help',
        fr: "Obtenir de l'aide",
        es: 'Obtener ayuda',
        ar: 'الحصول على المساعدة',
        zh: '获得帮助',
        hi: 'मदद प्राप्त करें',
        ru: 'Получить помощь',
        pt: 'Obter ajuda',
        it: 'Ottieni aiuto',
        de: 'Hilfe erhalten',
      },
      quick_contact: {
        en: 'Contact Us',
        fr: 'Nous contacter',
        es: 'Contáctanos',
        ar: 'اتصل بنا',
        zh: '联系我们',
        hi: 'हमसे संपर्क करें',
        ru: 'Связаться с нами',
        pt: 'Entre em contato',
        it: 'Contattaci',
        de: 'Kontaktieren Sie uns',
      },
      quick_donate_25: {
        en: '$25/month',
        fr: '25$/mois',
        es: '$25/mes',
        ar: '25 دولار/شهر',
        zh: '$25/月',
        hi: '$25/महीना',
        ru: '$25/месяц',
        pt: '$25/mês',
        it: '$25/mese',
        de: '$25/Monat',
      },
      quick_donate_50: {
        en: '$50/month',
        fr: '50$/mois',
        es: '$50/mes',
        ar: '50 دولار/شهر',
        zh: '$50/月',
        hi: '$50/महीना',
        ru: '$50/месяц',
        pt: '$50/mês',
        it: '$50/mese',
        de: '$50/Monat',
      },
      quick_donate_100: {
        en: '$100/month',
        fr: '100$/mois',
        es: '$100/mes',
        ar: '100 دولار/شهر',
        zh: '$100/月',
        hi: '$100/महीना',
        ru: '$100/месяц',
        pt: '$100/mês',
        it: '$100/mese',
        de: '$100/Monat',
      },
      quick_custom: {
        en: 'Custom Amount',
        fr: 'Montant personnalisé',
        es: 'Cantidad personalizada',
        ar: 'مبلغ مخصص',
        zh: '自定义金额',
        hi: 'कस्टम राशि',
        ru: 'Произвольная сумма',
        pt: 'Valor personalizado',
        it: 'Importo personalizzato',
        de: 'Individueller Betrag',
      },
      quick_helpline: {
        en: 'Call 24/7 Helpline',
        fr: 'Appeler la ligne 24/7',
        es: 'Llamar línea 24/7',
        ar: 'اتصل بخط المساعدة 24/7',
        zh: '拨打24/7求助热线',
        hi: '24/7 हेल्पलाइन पर कॉल करें',
        ru: 'Позвонить на круглосуточную линию помощи',
        pt: 'Ligar linha de ajuda 24/7',
        it: 'Chiama linea di supporto 24/7',
        de: '24/7-Hotline anrufen',
      },
      quick_shelter: {
        en: 'Find Shelter',
        fr: 'Trouver un refuge',
        es: 'Encontrar refugio',
        ar: 'العثور على مأوى',
        zh: '寻找庇护所',
        hi: 'आश्रय खोजें',
        ru: 'Найти убежище',
        pt: 'Encontrar abrigo',
        it: 'Trova rifugio',
        de: 'Unterschlupf finden',
      },
      quick_resources: {
        en: 'Resources',
        fr: 'Ressources',
        es: 'Recursos',
        ar: 'الموارد',
        zh: '资源',
        hi: 'संसाधन',
        ru: 'Ресурсы',
        pt: 'Recursos',
        it: 'Risorse',
        de: 'Ressourcen',
      },
      quick_call: {
        en: 'Call Now',
        fr: 'Appeler maintenant',
        es: 'Llamar ahora',
        ar: 'اتصل الآن',
        zh: '立即致电',
        hi: 'अभी कॉल करें',
        ru: 'Позвонить сейчас',
        pt: 'Ligar agora',
        it: 'Chiama ora',
        de: 'Jetzt anrufen',
      },
      quick_email: {
        en: 'Send Email',
        fr: 'Envoyer un email',
        es: 'Enviar correo',
        ar: 'إرسال بريد إلكتروني',
        zh: '发送电子邮件',
        hi: 'ईमेल भेजें',
        ru: 'Отправить email',
        pt: 'Enviar email',
        it: 'Invia email',
        de: 'E-Mail senden',
      },
      quick_stories: {
        en: 'Read Stories',
        fr: 'Lire les histoires',
        es: 'Leer historias',
        ar: 'اقرأ القصص',
        zh: '阅读故事',
        hi: 'कहानियां पढ़ें',
        ru: 'Читать истории',
        pt: 'Ler histórias',
        it: 'Leggi storie',
        de: 'Geschichten lesen',
      },
      quick_dashboard: {
        en: 'View Dashboard',
        fr: 'Voir le tableau de bord',
        es: 'Ver panel',
        ar: 'عرض لوحة التحكم',
        zh: '查看仪表板',
        hi: 'डैशबोर्ड देखें',
        ru: 'Просмотреть панель',
        pt: 'Ver painel',
        it: 'Visualizza dashboard',
        de: 'Dashboard anzeigen',
      },
      quick_view_tiers: {
        en: 'View Tiers',
        fr: 'Voir les niveaux',
        es: 'Ver niveles',
        ar: 'عرض المستويات',
        zh: '查看等级',
        hi: 'टियर देखें',
        ru: 'Просмотреть уровни',
        pt: 'Ver níveis',
        it: 'Visualizza livelli',
        de: 'Stufen anzeigen',
      },
      quick_learn_more: {
        en: 'Learn More',
        fr: 'En savoir plus',
        es: 'Saber más',
        ar: 'اعرف المزيد',
        zh: '了解更多',
        hi: 'और जानें',
        ru: 'Узнать больше',
        pt: 'Saiba mais',
        it: 'Scopri di più',
        de: 'Mehr erfahren',
      },
      chatbot_placeholder: {
        en: 'Type your message...',
        fr: 'Tapez votre message...',
        es: 'Escribe tu mensaje...',
        ar: 'اكتب رسالتك...',
        zh: '输入您的消息...',
        hi: 'अपना संदेश टाइप करें...',
        ru: 'Введите ваше сообщение...',
        pt: 'Digite sua mensagem...',
        it: 'Digita il tuo messaggio...',
        de: 'Geben Sie Ihre Nachricht ein...',
      },
      chat_donation_info: {
        en: "Great! I'd love to help you make a donation. You can give monthly starting at just $25 - that's less than a dollar a day! Your donation helps us provide safe shelter, counseling, and support to women and children. Which amount would you like to give?",
        fr: "Super! Je serais ravie de t'aider à faire un don. Tu peux donner mensuellement à partir de seulement 25$ - c'est moins d'un dollar par jour! Ton don nous aide à fournir un refuge sûr, du counseling et du soutien aux femmes et aux enfants. Quel montant aimerais-tu donner?",
        es: '¡Genial! Me encantaría ayudarte a hacer una donación. Puedes dar mensualmente desde solo $25 - ¡eso es menos de un dólar al día! Tu donación nos ayuda a proporcionar refugio seguro, asesoramiento y apoyo a mujeres y niños. ¿Qué cantidad te gustaría dar?',
        ar: 'رائع! سأكون سعيدة لمساعدتك في التبرع. يمكنك التبرع شهرياً بدءاً من 25 دولاراً فقط - هذا أقل من دولار في اليوم! تبرعك يساعدنا في توفير مأوى آمن واستشارات ودعم للنساء والأطفال. ما المبلغ الذي ترغب في التبرع به؟',
        zh: '太好了！我很乐意帮助您捐款。您可以从每月25美元开始捐款 - 这还不到每天一美元！您的捐款帮助我们为妇女和儿童提供安全的住所、咨询和支持。您想捐多少？',
        hi: 'बढ़िया! मैं आपकी दान में मदद करने के लिए खुश हूं। आप केवल $25 से शुरू करके मासिक दान कर सकते हैं - यह दिन में एक डॉलर से भी कम है! आपका दान हमें महिलाओं और बच्चों को सुरक्षित आश्रय, परामर्श और समर्थन प्रदान करने में मदद करता है। आप कितनी राशि देना चाहेंगे?',
        ru: 'Отлично! Я буду рада помочь вам сделать пожертвование. Вы можете давать ежемесячно, начиная всего с $25 - это меньше доллара в день! Ваше пожертвование помогает нам предоставлять безопасное убежище, консультирование и поддержку женщинам и детям. Какую сумму вы хотели бы пожертвовать?',
        pt: 'Ótimo! Adoraria ajudá-lo a fazer uma doação. Você pode doar mensalmente a partir de apenas $25 - isso é menos de um dólar por dia! Sua doação nos ajuda a fornecer abrigo seguro, aconselhamento e apoio a mulheres e crianças. Qual valor você gostaria de doar?',
        it: 'Fantastico! Sarei felice di aiutarti a fare una donazione. Puoi donare mensilmente a partire da soli $25 - è meno di un dollaro al giorno! La tua donazione ci aiuta a fornire rifugio sicuro, consulenza e supporto a donne e bambini. Quale importo vorresti donare?',
        de: 'Großartig! Ich helfe Ihnen gerne bei einer Spende. Sie können monatlich ab nur $25 spenden - das sind weniger als ein Dollar pro Tag! Ihre Spende hilft uns, sichere Unterkünfte, Beratung und Unterstützung für Frauen und Kinder bereitzustellen. Welchen Betrag möchten Sie spenden?',
      },
      chat_help_info: {
        en: "I'm here to help! If you need immediate assistance, please call our 24/7 helpline at 1-888-HELP-NOW - someone is always available. For questions or non-urgent matters, you can email us at help@shieldathena.org. We're here for you, okay?",
        fr: "Je suis là pour t'aider! Si tu as besoin d'aide immédiate, appelle notre ligne d'assistance 24/7 au 1-888-HELP-NOW - quelqu'un est toujours disponible. Pour des questions ou des demandes non urgentes, tu peux nous envoyer un courriel à help@shieldathena.org. On est là pour toi, d'accord?",
        es: '¡Estoy aquí para ayudarte! Si necesitas ayuda inmediata, llama a nuestra línea de ayuda 24/7 al 1-888-HELP-NOW - siempre hay alguien disponible. Para preguntas o asuntos no urgentes, puedes enviarnos un correo a help@shieldathena.org. Estamos aquí para ti, ¿de acuerdo?',
        ar: 'أنا هنا لمساعدتك! إذا كنت بحاجة إلى مساعدة فورية، يرجى الاتصال بخط المساعدة على مدار الساعة 1-888-HELP-NOW - يوجد شخص متاح دائماً. للأسئلة أو الأمور غير العاجلة، يمكنك مراسلتنا على help@shieldathena.org. نحن هنا من أجلك، حسناً؟',
        zh: '我在这里帮助您！如果您需要立即帮助，请拨打我们的24/7求助热线 1-888-HELP-NOW - 总是有人可以接听。对于问题或非紧急事项，您可以发送电子邮件至 help@shieldathena.org。我们在这里为您服务，好吗？',
        hi: 'मैं मदद के लिए यहां हूं! यदि आपको तत्काल सहायता की आवश्यकता है, कृपया हमारी 24/7 हेल्पलाइन 1-888-HELP-NOW पर कॉल करें - कोई न कोई हमेशा उपलब्ध रहता है। प्रश्नों या गैर-जरूरी मामलों के लिए, आप हमें help@shieldathena.org पर ईमेल कर सकते हैं। हम आपके लिए यहां हैं, ठीक है?',
        ru: 'Я здесь, чтобы помочь! Если вам нужна немедленная помощь, пожалуйста, позвоните на нашу круглосуточную линию помощи 1-888-HELP-NOW - кто-то всегда доступен. По вопросам или не срочным делам вы можете написать нам на help@shieldathena.org. Мы здесь для вас, хорошо?',
        pt: 'Estou aqui para ajudar! Se você precisar de assistência imediata, ligue para nossa linha de ajuda 24/7 no 1-888-HELP-NOW - sempre há alguém disponível. Para perguntas ou assuntos não urgentes, você pode nos enviar um e-mail para help@shieldathena.org. Estamos aqui para você, ok?',
        it: "Sono qui per aiutarti! Se hai bisogno di assistenza immediata, chiama la nostra linea di supporto 24/7 al 1-888-HELP-NOW - c'è sempre qualcuno disponibile. Per domande o questioni non urgenti, puoi inviarci un'email a help@shieldathena.org. Siamo qui per te, ok?",
        de: 'Ich bin hier, um zu helfen! Wenn Sie sofortige Hilfe benötigen, rufen Sie bitte unsere 24/7-Hotline unter 1-888-HELP-NOW an - jemand ist immer verfügbar. Für Fragen oder nicht dringende Angelegenheiten können Sie uns eine E-Mail an help@shieldathena.org senden. Wir sind für Sie da, okay?',
      },
      chat_contact_info: {
        en: "Sure! Here's how you can reach us:\n\n📞 Phone: 1-888-HELP-NOW (24/7)\n📧 Email: help@shieldathena.org\n📍 We're in Montreal, QC\n\nWe're always here if you need us, especially for emergencies!",
        fr: 'Bien sûr! Voici comment nous joindre:\n\n📞 Téléphone: 1-888-HELP-NOW (24/7)\n📧 Courriel: help@shieldathena.org\n📍 On est à Montréal, QC\n\nOn est toujours là si tu as besoin, surtout pour les urgences!',
        es: '¡Por supuesto! Así puedes contactarnos:\n\n📞 Teléfono: 1-888-HELP-NOW (24/7)\n📧 Correo: help@shieldathena.org\n📍 Estamos en Montreal, QC\n\n¡Siempre estamos aquí si nos necesitas, especialmente para emergencias!',
        ar: 'بالتأكيد! إليك كيف يمكنك التواصل معنا:\n\n📞 الهاتف: 1-888-HELP-NOW (24/7)\n📧 البريد الإلكتروني: help@shieldathena.org\n📍 نحن في مونتريال، كيبيك\n\nنحن دائماً هنا إذا كنت بحاجة إلينا، خاصة في حالات الطوارئ!',
        zh: '当然！以下是如何联系我们：\n\n📞 电话：1-888-HELP-NOW (24/7)\n📧 电子邮件：help@shieldathena.org\n📍 我们在魁北克省蒙特利尔\n\n如果您需要我们，我们总是在这里，特别是在紧急情况下！',
        hi: 'बिल्कुल! यहां बताया गया है कि आप हमसे कैसे संपर्क कर सकते हैं:\n\n📞 फोन: 1-888-HELP-NOW (24/7)\n📧 ईमेल: help@shieldathena.org\n📍 हम मॉन्ट्रियल, QC में हैं\n\nयदि आपको हमारी आवश्यकता है, तो हम हमेशा यहां हैं, विशेष रूप से आपात स्थितियों के लिए!',
        ru: 'Конечно! Вот как вы можете с нами связаться:\n\n📞 Телефон: 1-888-HELP-NOW (24/7)\n📧 Email: help@shieldathena.org\n📍 Мы в Монреале, Квебек\n\nМы всегда здесь, если мы вам нужны, особенно в экстренных случаях!',
        pt: 'Claro! Aqui está como você pode nos contatar:\n\n📞 Telefone: 1-888-HELP-NOW (24/7)\n📧 Email: help@shieldathena.org\n📍 Estamos em Montreal, QC\n\nEstamos sempre aqui se você precisar de nós, especialmente para emergências!',
        it: 'Certamente! Ecco come puoi contattarci:\n\n📞 Telefono: 1-888-HELP-NOW (24/7)\n📧 Email: help@shieldathena.org\n📍 Siamo a Montreal, QC\n\nSiamo sempre qui se hai bisogno di noi, soprattutto per le emergenze!',
        de: 'Sicher! So können Sie uns erreichen:\n\n📞 Telefon: 1-888-HELP-NOW (24/7)\n📧 E-Mail: help@shieldathena.org\n📍 Wir sind in Montreal, QC\n\nWir sind immer da, wenn Sie uns brauchen, besonders für Notfälle!',
      },
      chat_impact_info: {
        en: "I'm so proud to share this with you! Last year, we helped over 2,500 people, provided safe shelter for 15,000+ nights, and supported more than 500 families. Every donation makes a real difference - you're literally changing lives!",
        fr: "Je suis tellement fière de partager ça avec toi! L'année dernière, on a aidé plus de 2 500 personnes, fourni un refuge sûr pour plus de 15 000 nuits, et soutenu plus de 500 familles. Chaque don fait une vraie différence - tu changes littéralement des vies!",
        es: '¡Estoy tan orgullosa de compartir esto contigo! El año pasado, ayudamos a más de 2,500 personas, proporcionamos refugio seguro por más de 15,000 noches, y apoyamos a más de 500 familias. ¡Cada donación marca una verdadera diferencia - literalmente estás cambiando vidas!',
        ar: 'أنا فخورة جداً بمشاركة هذا معك! العام الماضي، ساعدنا أكثر من 2500 شخص، ووفرنا مأوى آمناً لأكثر من 15000 ليلة، ودعمنا أكثر من 500 عائلة. كل تبرع يحدث فرقاً حقيقياً - أنت تغير حرفياً حياة الناس!',
        zh: '我很自豪与您分享这些！去年，我们帮助了2500多人，提供了15000多晚的安全住所，并支持了500多个家庭。每一笔捐款都产生真正的影响 - 您正在真正改变生活！',
        hi: 'मुझे आपके साथ यह साझा करने पर बहुत गर्व है! पिछले साल, हमने 2,500 से अधिक लोगों की मदद की, 15,000 से अधिक रातों के लिए सुरक्षित आश्रय प्रदान किया, और 500 से अधिक परिवारों का समर्थन किया। हर दान एक वास्तविक अंतर बनाता है - आप सचमुच जीवन बदल रहे हैं!',
        ru: 'Я так горжусь тем, что делюсь этим с вами! В прошлом году мы помогли более 2500 людям, предоставили безопасное убежище на более чем 15000 ночей и поддержали более 500 семей. Каждое пожертвование имеет реальное значение - вы буквально меняете жизни!',
        pt: 'Estou tão orgulhosa de compartilhar isso com você! No ano passado, ajudamos mais de 2.500 pessoas, fornecemos abrigo seguro por mais de 15.000 noites e apoiamos mais de 500 famílias. Cada doação faz uma diferença real - você está literalmente mudando vidas!',
        it: "Sono così orgogliosa di condividere questo con te! L'anno scorso abbiamo aiutato più di 2.500 persone, fornito rifugio sicuro per più di 15.000 notti e sostenuto più di 500 famiglie. Ogni donazione fa una vera differenza - stai letteralmente cambiando vite!",
        de: 'Ich bin so stolz, dies mit Ihnen zu teilen! Im letzten Jahr haben wir über 2.500 Menschen geholfen, sichere Unterkünfte für über 15.000 Nächte bereitgestellt und mehr als 500 Familien unterstützt. Jede Spende macht einen echten Unterschied - Sie verändern buchstäblich Leben!',
      },
      chat_shelter_info: {
        en: "We provide safe, confidential shelter for women and children who need it. Our shelters aren't just a place to stay - we offer counseling, legal support, and resources to help people rebuild their lives. If you or someone you know needs help right now, call 1-888-HELP-NOW.",
        fr: "On fournit un refuge sûr et confidentiel pour les femmes et les enfants qui en ont besoin. Nos refuges ne sont pas juste un endroit où dormir - on offre du counseling, un soutien juridique et des ressources pour aider les gens à reconstruire leur vie. Si toi ou quelqu'un que tu connais a besoin d'aide maintenant, appelle le 1-888-HELP-NOW.",
        es: 'Proporcionamos refugio seguro y confidencial para mujeres y niños que lo necesitan. Nuestros refugios no son solo un lugar para quedarse - ofrecemos asesoramiento, apoyo legal y recursos para ayudar a las personas a reconstruir sus vidas. Si tú o alguien que conoces necesita ayuda ahora, llama al 1-888-HELP-NOW.',
        ar: 'نوفر مأوى آمناً وسرياً للنساء والأطفال الذين يحتاجونه. ملاجئنا ليست مجرد مكان للإقامة - نقدم الاستشارة والدعم القانوني والموارد لمساعدة الناس على إعادة بناء حياتهم. إذا كنت أنت أو شخص تعرفه بحاجة إلى مساعدة الآن، اتصل بـ 1-888-HELP-NOW.',
        zh: '我们为需要帮助的妇女和儿童提供安全、保密的住所。我们的庇护所不仅仅是住宿的地方 - 我们提供咨询、法律支持和资源，帮助人们重建生活。如果您或您认识的人现在需要帮助，请拨打 1-888-HELP-NOW。',
        hi: 'हम उन महिलाओं और बच्चों के लिए सुरक्षित, गोपनीय आश्रय प्रदान करते हैं जिन्हें इसकी आवश्यकता है। हमारे आश्रय केवल रहने की जगह नहीं हैं - हम परामर्श, कानूनी सहायता और संसाधन प्रदान करते हैं ताकि लोग अपने जीवन को फिर से बना सकें। यदि आपको या आपके जानने वाले किसी व्यक्ति को अभी मदद की आवश्यकता है, तो 1-888-HELP-NOW पर कॉल करें।',
        ru: 'Мы предоставляем безопасное, конфиденциальное убежище для женщин и детей, которые в нем нуждаются. Наши убежища - это не просто место для проживания - мы предлагаем консультирование, юридическую поддержку и ресурсы, чтобы помочь людям восстановить свою жизнь. Если вам или кому-то, кого вы знаете, нужна помощь прямо сейчас, позвоните по номеру 1-888-HELP-NOW.',
        pt: 'Fornecemos abrigo seguro e confidencial para mulheres e crianças que precisam. Nossos abrigos não são apenas um lugar para ficar - oferecemos aconselhamento, apoio jurídico e recursos para ajudar as pessoas a reconstruir suas vidas. Se você ou alguém que você conhece precisa de ajuda agora, ligue para 1-888-HELP-NOW.',
        it: 'Forniamo rifugio sicuro e confidenziale per donne e bambini che ne hanno bisogno. I nostri rifugi non sono solo un posto dove stare - offriamo consulenza, supporto legale e risorse per aiutare le persone a ricostruire le loro vite. Se tu o qualcuno che conosci ha bisogno di aiuto ora, chiama 1-888-HELP-NOW.',
        de: 'Wir bieten sichere, vertrauliche Unterkünfte für Frauen und Kinder, die sie brauchen. Unsere Unterkünfte sind nicht nur ein Ort zum Übernachten - wir bieten Beratung, rechtliche Unterstützung und Ressourcen, um Menschen zu helfen, ihr Leben wieder aufzubauen. Wenn Sie oder jemand, den Sie kennen, jetzt Hilfe braucht, rufen Sie 1-888-HELP-NOW an.',
      },
      chat_greeting: {
        en: 'Hey! Good to see you again. What can I help you with?',
        fr: "Salut! Content de te revoir. Comment puis-je t'aider?",
        es: '¡Hola! Me alegra verte de nuevo. ¿En qué puedo ayudarte?',
        ar: 'مرحباً! من الجيد رؤيتك مرة أخرى. كيف يمكنني مساعدتك؟',
        zh: '嘿！很高兴再次见到您。我能为您做些什么？',
        hi: 'अरे! आपको फिर से देखकर अच्छा लगा। मैं आपकी कैसे मदद कर सकती हूं?',
        ru: 'Привет! Рада снова вас видеть. Чем я могу вам помочь?',
        pt: 'Oi! Que bom te ver novamente. Como posso ajudá-lo?',
        it: 'Ciao! Che bello rivederti. Come posso aiutarti?',
        de: 'Hallo! Schön, Sie wiederzusehen. Womit kann ich Ihnen helfen?',
      },
      chat_thanks: {
        en: "You're so welcome! 😊 Is there anything else you'd like to know? I'm here to help!",
        fr: "De rien! 😊 Y a-t-il autre chose que tu aimerais savoir? Je suis là pour t'aider!",
        es: '¡De nada! 😊 ¿Hay algo más que te gustaría saber? ¡Estoy aquí para ayudarte!',
        ar: 'على الرحب والسعة! 😊 هل هناك أي شيء آخر تريد معرفته؟ أنا هنا للمساعدة!',
        zh: '不客气！😊 还有其他想了解的吗？我在这里帮助您！',
        hi: 'आपका स्वागत है! 😊 क्या आप कुछ और जानना चाहेंगे? मैं मदद के लिए यहां हूं!',
        ru: 'Пожалуйста! 😊 Есть ли что-то еще, что вы хотели бы узнать? Я здесь, чтобы помочь!',
        pt: 'De nada! 😊 Há mais alguma coisa que você gostaria de saber? Estou aqui para ajudar!',
        it: "Prego! 😊 C'è qualcos'altro che vorresti sapere? Sono qui per aiutare!",
        de: 'Bitte sehr! 😊 Gibt es noch etwas, das Sie wissen möchten? Ich bin hier, um zu helfen!',
      },
      chat_default: {
        en: "Hmm, I'm not quite sure what you're asking about. Could you tell me a bit more? I can help you with donations, our programs, getting help, or just answer questions about what we do. What would you like to know?",
        fr: "Hmm, je ne suis pas tout à fait sûre de ce que tu demandes. Pourrais-tu m'en dire un peu plus? Je peux t'aider avec les dons, nos programmes, obtenir de l'aide, ou juste répondre à des questions sur ce qu'on fait. Qu'aimerais-tu savoir?",
        es: 'Hmm, no estoy muy segura de lo que preguntas. ¿Podrías contarme un poco más? Puedo ayudarte con donaciones, nuestros programas, obtener ayuda, o simplemente responder preguntas sobre lo que hacemos. ¿Qué te gustaría saber?',
        ar: 'حسناً، لست متأكدة تماماً مما تسأل عنه. هل يمكنك أن تخبرني أكثر قليلاً؟ يمكنني مساعدتك في التبرعات وبرامجنا والحصول على المساعدة، أو فقط الإجابة على الأسئلة حول ما نقوم به. ماذا تريد أن تعرف؟',
        zh: '嗯，我不太确定您在问什么。您能告诉我更多一点吗？我可以帮助您处理捐款、我们的项目、获得帮助，或者只是回答关于我们工作的问题。您想了解什么？',
        hi: 'हम्म, मुझे पूरी तरह से यकीन नहीं है कि आप किस बारे में पूछ रहे हैं। क्या आप मुझे थोड़ा और बता सकते हैं? मैं आपकी दान, हमारे कार्यक्रमों, मदद प्राप्त करने, या बस हम क्या करते हैं के बारे में प्रश्नों का उत्तर देने में मदद कर सकती हूं। आप क्या जानना चाहेंगे?',
        ru: 'Хм, я не совсем уверена, о чем вы спрашиваете. Не могли бы вы рассказать мне немного больше? Я могу помочь вам с пожертвованиями, нашими программами, получением помощи или просто ответить на вопросы о том, что мы делаем. Что бы вы хотели узнать?',
        pt: 'Hmm, não tenho certeza do que você está perguntando. Você poderia me contar um pouco mais? Posso ajudá-lo com doações, nossos programas, obter ajuda ou apenas responder perguntas sobre o que fazemos. O que você gostaria de saber?',
        it: "Hmm, non sono del tutto sicura di cosa stai chiedendo. Potresti dirmi un po' di più? Posso aiutarti con donazioni, i nostri programmi, ottenere aiuto o semplicemente rispondere a domande su ciò che facciamo. Cosa vorresti sapere?",
        de: 'Hmm, ich bin mir nicht ganz sicher, wonach Sie fragen. Könnten Sie mir ein bisschen mehr erzählen? Ich kann Ihnen bei Spenden, unseren Programmen, Hilfe erhalten oder einfach Fragen zu dem beantworten, was wir tun. Was möchten Sie wissen?',
      },
      share_conversation: {
        en: 'Share conversation',
        fr: 'Partager la conversation',
        es: 'Compartir conversación',
        ar: 'مشاركة المحادثة',
        zh: '分享对话',
        hi: 'बातचीत साझा करें',
        ru: 'Поделиться разговором',
        pt: 'Compartilhar conversa',
        it: 'Condividi conversazione',
        de: 'Unterhaltung teilen',
      },
      share_not_available: {
        en: 'Sharing is not available on this device. Please use the native share feature of your browser.',
        fr: "Le partage n'est pas disponible sur cet appareil. Veuillez utiliser la fonction de partage native de votre navigateur.",
        es: 'Compartir no está disponible en este dispositivo. Por favor, use la función de compartir nativa de su navegador.',
        ar: 'المشاركة غير متاحة على هذا الجهاز. يرجى استخدام ميزة المشاركة الأصلية لمتصفحك.',
        zh: '此设备上不可用分享功能。请使用浏览器的原生分享功能。',
        hi: 'इस डिवाइस पर साझाकरण उपलब्ध नहीं है। कृपया अपने ब्राउज़र की मूल साझाकरण सुविधा का उपयोग करें।',
        ru: 'Обмен недоступен на этом устройстве. Пожалуйста, используйте встроенную функцию обмена вашего браузера.',
        pt: 'Compartilhamento não está disponível neste dispositivo. Por favor, use o recurso de compartilhamento nativo do seu navegador.',
        it: 'La condivisione non è disponibile su questo dispositivo. Si prega di utilizzare la funzione di condivisione nativa del browser.',
        de: 'Teilen ist auf diesem Gerät nicht verfügbar. Bitte verwenden Sie die native Teilen-Funktion Ihres Browsers.',
      },
    };

    // Try to get translation for current language, fallback to English, then to key itself
    if (translations[key]) {
      return translations[key][lang] || translations[key]['en'] || key;
    }
    // If key doesn't exist in translations, return a friendly message
    return key;
  }
}
