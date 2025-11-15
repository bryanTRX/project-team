import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  messages: Message[] = [];
  userInput: string = '';
  isTyping: boolean = false;
  private languageSubscription?: Subscription;
  currentLanguage: string = 'en';

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    
    // Message de bienvenue initial
    this.addBotMessage(this.getWelcomeMessage());
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

    // Simuler la frappe du bot
    this.isTyping = true;
    setTimeout(() => {
      const response = this.generateResponse(userMessage);
      this.addBotMessage(response);
      this.isTyping = false;
    }, 800);
  }

  addUserMessage(text: string): void {
    this.messages.push({
      text,
      isUser: true,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  addBotMessage(text: string): void {
    this.messages.push({
      text,
      isUser: false,
      timestamp: new Date()
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

  generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    const lang = this.currentLanguage;

    // Réponses basées sur des mots-clés
    if (this.containsKeywords(message, ['don', 'donate', 'donation', 'donner', 'donación'])) {
      return this.getTranslation('chat_donation_info', lang);
    }

    if (this.containsKeywords(message, ['help', 'aide', 'ayuda', 'help', 'assistance'])) {
      return this.getTranslation('chat_help_info', lang);
    }

    if (this.containsKeywords(message, ['contact', 'contacter', 'contacto', 'email', 'phone', 'téléphone'])) {
      return this.getTranslation('chat_contact_info', lang);
    }

    if (this.containsKeywords(message, ['impact', 'impacto', 'effet', 'result'])) {
      return this.getTranslation('chat_impact_info', lang);
    }

    if (this.containsKeywords(message, ['shelter', 'refuge', 'albergue', 'abri'])) {
      return this.getTranslation('chat_shelter_info', lang);
    }

    if (this.containsKeywords(message, ['hello', 'hi', 'bonjour', 'salut', 'hola', 'hey'])) {
      return this.getTranslation('chat_greeting', lang);
    }

    if (this.containsKeywords(message, ['thank', 'merci', 'gracias', 'thanks'])) {
      return this.getTranslation('chat_thanks', lang);
    }

    // Réponse par défaut
    return this.getTranslation('chat_default', lang);
  }

  containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  getWelcomeMessage(): string {
    return this.getTranslation('chat_welcome', this.currentLanguage);
  }

  getTranslation(key: string, lang: string): string {
    return this.languageService.getTranslation(key) || this.getDefaultTranslation(key, lang);
  }

  getDefaultTranslation(key: string, lang: string): string {
    const translations: { [key: string]: { [lang: string]: string } } = {
      'chat_welcome': {
        'en': 'Hello! I\'m here to help you. How can I assist you today?',
        'fr': 'Bonjour! Je suis là pour vous aider. Comment puis-je vous assister aujourd\'hui?',
        'es': '¡Hola! Estoy aquí para ayudarte. ¿Cómo puedo asistirte hoy?'
      },
      'chat_donation_info': {
        'en': 'You can make a donation by clicking the "Donate Now" button or selecting a donation tier. We accept monthly recurring donations starting at $25. Your contribution helps provide shelter, counseling, and support services.',
        'fr': 'Vous pouvez faire un don en cliquant sur le bouton "Faire un don" ou en sélectionnant un palier de don. Nous acceptons les dons mensuels récurrents à partir de 25$. Votre contribution aide à fournir un refuge, des services de counseling et de soutien.',
        'es': 'Puedes hacer una donación haciendo clic en el botón "Donar ahora" o seleccionando un nivel de donación. Aceptamos donaciones mensuales recurrentes a partir de $25. Tu contribución ayuda a proporcionar refugio, asesoramiento y servicios de apoyo.'
      },
      'chat_help_info': {
        'en': 'If you need immediate help, please call our 24/7 helpline at 1-888-HELP-NOW. For non-emergency inquiries, you can email us at help@shieldathena.org. We\'re here to support you.',
        'fr': 'Si vous avez besoin d\'aide immédiate, veuillez appeler notre ligne d\'assistance 24/7 au 1-888-HELP-NOW. Pour les demandes non urgentes, vous pouvez nous envoyer un courriel à help@shieldathena.org. Nous sommes là pour vous soutenir.',
        'es': 'Si necesitas ayuda inmediata, llama a nuestra línea de ayuda 24/7 al 1-888-HELP-NOW. Para consultas no urgentes, puedes enviarnos un correo electrónico a help@shieldathena.org. Estamos aquí para apoyarte.'
      },
      'chat_contact_info': {
        'en': 'You can reach us at:\n📞 Phone: 1-888-HELP-NOW\n📧 Email: help@shieldathena.org\n📍 Location: Montreal, QC\nWe\'re available 24/7 for emergencies.',
        'fr': 'Vous pouvez nous joindre à:\n📞 Téléphone: 1-888-HELP-NOW\n📧 Courriel: help@shieldathena.org\n📍 Lieu: Montréal, QC\nNous sommes disponibles 24/7 pour les urgences.',
        'es': 'Puedes contactarnos en:\n📞 Teléfono: 1-888-HELP-NOW\n📧 Correo: help@shieldathena.org\n📍 Ubicación: Montreal, QC\nEstamos disponibles 24/7 para emergencias.'
      },
      'chat_impact_info': {
        'en': 'In 2024, we\'ve helped over 2,500 individuals, provided 15,000+ nights of shelter, and supported 500+ families. Your donations directly fund these life-changing services.',
        'fr': 'En 2024, nous avons aidé plus de 2 500 personnes, fourni plus de 15 000 nuits d\'hébergement et soutenu plus de 500 familles. Vos dons financent directement ces services qui changent des vies.',
        'es': 'En 2024, hemos ayudado a más de 2,500 personas, proporcionado más de 15,000 noches de refugio y apoyado a más de 500 familias. Tus donaciones financian directamente estos servicios que cambian vidas.'
      },
      'chat_shelter_info': {
        'en': 'We provide safe, confidential shelter for women and children. Our facilities offer counseling, legal support, and resources to help rebuild lives. Contact us at 1-888-HELP-NOW for immediate assistance.',
        'fr': 'Nous fournissons un refuge sûr et confidentiel pour les femmes et les enfants. Nos installations offrent du counseling, un soutien juridique et des ressources pour aider à reconstruire des vies. Contactez-nous au 1-888-HELP-NOW pour une assistance immédiate.',
        'es': 'Proporcionamos refugio seguro y confidencial para mujeres y niños. Nuestras instalaciones ofrecen asesoramiento, apoyo legal y recursos para ayudar a reconstruir vidas. Contáctanos al 1-888-HELP-NOW para asistencia inmediata.'
      },
      'chat_greeting': {
        'en': 'Hello! How can I help you today?',
        'fr': 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
        'es': '¡Hola! ¿Cómo puedo ayudarte hoy?'
      },
      'chat_thanks': {
        'en': 'You\'re welcome! Is there anything else I can help you with?',
        'fr': 'De rien! Y a-t-il autre chose avec laquelle je peux vous aider?',
        'es': '¡De nada! ¿Hay algo más en lo que pueda ayudarte?'
      },
      'chat_default': {
        'en': 'I understand you\'re looking for information. Could you tell me more about what you need? You can ask about donations, getting help, our services, or contact information.',
        'fr': 'Je comprends que vous cherchez des informations. Pourriez-vous me dire plus sur ce dont vous avez besoin? Vous pouvez poser des questions sur les dons, obtenir de l\'aide, nos services ou les informations de contact.',
        'es': 'Entiendo que estás buscando información. ¿Podrías contarme más sobre lo que necesitas? Puedes preguntar sobre donaciones, obtener ayuda, nuestros servicios o información de contacto.'
      }
    };

    return translations[key]?.[lang] || translations[key]?.['en'] || 'I\'m here to help!';
  }
}

