import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private testAccount: nodemailer.TestAccount | null = null;
  private readonly logger = new Logger(MailService.name);

  async onModuleInit() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser) {
      // Use provided SMTP config
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Using configured SMTP transporter');
    } else {
      // Create Ethereal test account for demo
      this.testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass,
        },
      });
      this.logger.log(`Ethereal test account created: ${this.testAccount.user}`);
    }
  }

  async sendDonationReceipt(
    toEmail: string,
    userName: string,
    amount: number,
    totalDonated?: number,
    lives_touched?: number,
    lang?: string,
  ) {
    const locale = lang || 'en';

    const translations: { [key: string]: { [lang: string]: string } } = {
      subject: {
        en: `Thank you for your donation, ${userName}`,
        fr: `Merci pour votre don, ${userName}`,
        es: `Gracias por su donación, ${userName}`,
      },
      subtitle: {
        en: 'Your generosity protects families in need',
        fr: 'Votre générosité protège les familles dans le besoin',
        es: 'Su generosidad protege a las familias necesitadas',
      },
      greeting: {
        en: `Hi ${userName},`,
        fr: `Bonjour ${userName},`,
        es: `Hola ${userName},`,
      },
      received: {
        en: `We’ve received your donation of $${amount}. Your gift supports emergency shelter and culturally adapted services for women and children affected by family violence.`,
        fr: `Nous avons reçu votre don de $${amount}. Votre contribution soutient les services d'urgence et les services culturellement adaptés pour les femmes et les enfants touchés par la violence familiale.`,
        es: `Hemos recibido su donación de $${amount}. Su donación apoya refugios de emergencia y servicios culturalmente adaptados para mujeres y niños afectados por la violencia familiar.`,
      },
      totalDonatedLabel: { en: 'Total donated', fr: 'Total donné', es: 'Total donado' },
      peopleHelpedLabel: { en: 'People helped', fr: 'Personnes aidées', es: 'Personas ayudadas' },
      distribution: {
        en: 'Your donation will be distributed shortly to accommodate immediate shelter, professional social work, and community outreach. We prioritize timely support for families in crisis.',
        fr: 'Votre don sera distribué sous peu afin de fournir un abri immédiat, un accompagnement social professionnel et des actions communautaires. Nous priorisons le soutien rapide aux familles en crise.',
        es: 'Su donación será distribuida en breve para proporcionar refugio inmediato, trabajo social profesional y alcance comunitario. Priorizamos el apoyo oportuno a las familias en crisis.',
      },
      nextStepsTitle: { en: 'Next steps', fr: 'Étapes suivantes', es: 'Próximos pasos' },
      dashboardUpdate: {
        en: 'Your dashboard will update shortly with your new total',
        fr: 'Votre tableau de bord sera mis à jour sous peu avec votre nouveau total',
        es: 'Su panel se actualizará en breve con su nuevo total',
      },
      programUpdates: {
        en: "We’ll publish program updates and stories about how donations are used.",
        fr: "Nous publierons des mises à jour du programme et des histoires sur l'utilisation des dons.",
        es: 'Publicaremos actualizaciones del programa e historias sobre cómo se usan las donaciones.',
      },
      receiptAvailable: {
        en: 'Your official receipt (if applicable) will be available in your dashboard.',
        fr: 'Votre reçu officiel (le cas échéant) sera disponible dans votre tableau de bord.',
        es: 'Su recibo oficial (si corresponde) estará disponible en su panel.',
      },
      progressTowardBadge: { en: 'Progress toward next badge', fr: 'Progression vers le prochain badge', es: 'Progreso hacia la siguiente insignia' },
      progressPercentLabel: { en: '% toward the next badge', fr: '% vers le prochain badge', es: '% hacia la siguiente insignia' },
      visit_dashboard: { en: 'Visit your dashboard to see detailed badge progress.', fr: 'Visitez votre tableau de bord pour voir la progression détaillée des badges.', es: 'Visite su panel para ver el progreso detallado de las insignias.' },
      signature: { en: 'With gratitude,\nShield of Athena Team', fr: 'Avec gratitude,\nL’équipe Shield of Athena', es: 'Con gratitud,\nEquipo Shield of Athena' },
    };

    const t = (key: string) => {
      const entry = translations[key];
      if (!entry) return '';
      return entry[locale] || entry['en'] || '';
    };

    const subject = t('subject');
    const text = `${t('greeting')}\n\n${t('received')}\n\n— Shield of Athena Team`;

    // Resolve asset paths (relative to repo). Use the favicon logo in assets/logos
    const logoPath = path.resolve(__dirname, '..', '..', '..', 'frontend', 'src', 'assets', 'images', 'logos', 'favicon.jpg');

  const formattedTotal = typeof totalDonated === 'number' ? `$${totalDonated.toLocaleString()}` : '—';
  const formattedLives = typeof lives_touched === 'number' ? `${lives_touched}` : '—';
    // Compute progress toward next badge using internal tier thresholds so
    // we don't depend on a per-user `donationsRequiredForTier` field.
    const tiers = [1000, 5000];
    let progressPercent: number | null = null;
    if (typeof totalDonated === 'number') {
      const nextTier = tiers.find((t) => totalDonated < t) || null;
      if (nextTier) {
        progressPercent = Math.min(100, Math.round((totalDonated / nextTier) * 100));
      } else {
        progressPercent = null; // already at or above highest tier
      }
    }

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #2a2540;">
        <div style="max-width: 680px; margin:0 auto; border-radius:10px; overflow:hidden; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="background: linear-gradient(90deg,#f3e8ff,#e6d6ff); padding:20px; color:#2a2540; display:flex; align-items:center; gap:12px;">
            <img src="cid:logo" alt="Shield of Athena" style="width:56px;height:56px;border-radius:8px;object-fit:cover;" />
            <div>
              <h1 style="margin:0;font-size:20px;color:#4b2c83;">${t('subject')}</h1>
              <div style="opacity:0.9;font-size:13px;color:#6b4fa3">${t('subtitle')}</div>
            </div>
          </div>
          <div style="padding:22px; background:#fff;">
            <p style="font-size:16px; color:#2a2540;">${t('received')}</p>

            <div style="display:flex; gap:12px; margin-top:18px;">
              <div style="flex:1; padding:14px; border:1px solid #f0eaff; border-radius:8px; text-align:center; background:#fbf7ff;">
                <div style="font-size:12px; color:#6b4fa3;">${t('totalDonatedLabel')}</div>
                <div style="font-weight:700; font-size:20px; margin-top:8px; color:#4b2c83;">${formattedTotal}</div>
              </div>
              <div style="flex:1; padding:14px; border:1px solid #f0eaff; border-radius:8px; text-align:center; background:#fbf7ff;">
                <div style="font-size:12px; color:#6b4fa3;">${t('peopleHelpedLabel')}</div>
                <div style="font-weight:700; font-size:20px; margin-top:8px; color:#4b2c83;">${formattedLives}</div>
              </div>
            </div>

            <div style="margin-top:18px; padding:14px; background:linear-gradient(180deg, #faf5ff, #fff); border-radius:8px;">
              <p style="margin:0; color:#3b2b56;">${t('distribution')}</p>
            </div>

            <div style="margin-top:18px; color:#2a2540;">
              <p style="margin:0 0 8px 0; font-weight:700; color:#4b2c83;">${t('nextStepsTitle')}</p>
              <ul style="margin:0 0 0 18px; padding:0; color:#4b2c83;">
                <li>${t('dashboardUpdate')}: <strong>${formattedTotal}</strong>.</li>
                <li>${t('programUpdates')}</li>
                <li>${t('receiptAvailable')}</li>
              </ul>
            </div>

            <div style="margin-top:16px;">
              <p style="margin:0 0 6px 0; font-weight:700; color:#4b2c83;">${t('progressTowardBadge')}</p>
              ${progressPercent !== null ? `
                <div style="width:100%; background:#eee; border-radius:8px; height:12px; overflow:hidden;">
                  <div style="width:${progressPercent}%; height:12px; background:linear-gradient(90deg,#d6bbff,#b695ff);"></div>
                </div>
                <div style="font-size:12px; color:#6b4fa3; margin-top:6px;">${progressPercent}${t('progressPercentLabel')}</div>
              ` : `<div style="font-size:13px; color:#6b4fa3;">${t('visit_dashboard') || 'Visit your dashboard to see detailed badge progress.'}</div>`}

            </div>

            <p style="margin-top:20px; color:#2a2540;">${t('signature').replace('\n', '<br/>')}</p>
          </div>
        </div>
      </div>
    `;

    const info = await this.transporter.sendMail({
      from: '"Shield of Athena" <no-reply@shieldofathena.org>',
      to: toEmail,
      subject,
      text,
      html,
      attachments: [{ filename: 'logo.jpg', path: logoPath, cid: 'logo' }],
    });

    const preview = nodemailer.getTestMessageUrl(info) || null;
    this.logger.log(`Email queued: ${info.messageId}`);
    if (preview) {
      this.logger.log(`Preview URL: ${preview}`);
    }
    return { messageId: info.messageId, previewUrl: preview };
  }
}
