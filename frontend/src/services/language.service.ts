commit e6c9803f390ccb40f13611761f24754d66518254
Author: sarahaitaliyahia <143891694+sarahaitaliyahia@users.noreply.github.com>
Date:   Sat Nov 15 13:09:50 2025 -0500

    Updated Donation Page + Changed Sign Up

diff --git a/frontend/src/services/language.service.ts b/frontend/src/services/language.service.ts
index 11627c2..0310bf7 100644
--- a/frontend/src/services/language.service.ts
+++ b/frontend/src/services/language.service.ts
@@ -702,29 +702,77 @@ export class LanguageService {
       'it': 'Indirizzo email',
       'de': 'E-Mail-Adresse'
     },
-    'we_use_email_for_receipt': {
-      'en': 'We\'ll use this to send you a donation receipt and optional updates.',
-      'fr': 'Nous l\'utiliserons pour vous envoyer un reçu de don et des mises à jour optionnelles.',
-      'es': 'Lo usaremos para enviarte un recibo de donación y actualizaciones opcionales.',
-      'ar': 'سنستخدم هذا لإرسال إيصال تبرع وتحديثات اختيارية لك.',
-      'zh': '我们将使用此地址向您发送捐赠收据和可选的更新。',
-      'hi': 'हम इसका उपयोग आपको दान रसीद और वैकल्पिक अपडेट भेजने के लिए करेंगे।',
-      'ru': 'Мы будем использовать его для отправки вам квитанции о пожертвовании и необязательных обновлений.',
-      'pt': 'Usaremos isso para enviar um recibo de doação e atualizações opcionais.',
-      'it': 'Lo useremo per inviarti una ricevuta di donazione e aggiornamenti opzionali.',
-      'de': 'Wir verwenden dies, um Ihnen eine Spendenquittung und optionale Updates zu senden.'
-    },
-    'try_email_examples': {
-      'en': 'Try: user@existing.com (has account) or user@new.com (new donor)',
-      'fr': 'Essayez: user@existing.com (a un compte) ou user@new.com (nouveau donateur)',
-      'es': 'Prueba: user@existing.com (tiene cuenta) o user@new.com (nuevo donante)',
-      'ar': 'جرب: user@existing.com (لديه حساب) أو user@new.com (متبرع جديد)',
-      'zh': '试试：user@existing.com（有账户）或 user@new.com（新捐赠者）',
-      'hi': 'कोशिश करें: user@existing.com (खाता है) या user@new.com (नया दाता)',
-      'ru': 'Попробуйте: user@existing.com (есть аккаунт) или user@new.com (новый донор)',
-      'pt': 'Tente: user@existing.com (tem conta) ou user@new.com (novo doador)',
-      'it': 'Prova: user@existing.com (ha un account) o user@new.com (nuovo donatore)',
-      'de': 'Versuchen Sie: user@existing.com (hat Konto) oder user@new.com (neuer Spender)'
+    'email_account_notice': {
+      'en': 'Enter your email to check for an existing profile. We\'ll guide you to log in or set up a new account in seconds.',
+      'fr': 'Saisissez votre e-mail pour vérifier si un profil existe déjà. Nous vous guiderons pour vous connecter ou créer un compte en quelques secondes.',
+      'es': 'Ingresa tu correo para verificar si ya existe un perfil. Te guiaremos para iniciar sesión o crear una cuenta en segundos.',
+      'ar': 'أدخل بريدك الإلكتروني للتحقق مما إذا كان لديك ملف موجود. سنرشدك لتسجيل الدخول أو إنشاء حساب جديد خلال ثوانٍ.',
+      'zh': '输入邮箱即可检查是否已有个人档案。我们会引导您快速登录或创建新账户。',
+      'hi': 'अपना ईमेल दर्ज करें ताकि हम मौजूदा प्रोफ़ाइल की जाँच कर सकें। हम आपको लॉग इन या नया खाता बनाने की प्रक्रिया तुरंत बताएंगे।',
+      'ru': 'Введите email, чтобы проверить, есть ли профиль. Мы подскажем, как войти или создать новый аккаунт за пару секунд.',
+      'pt': 'Digite seu e-mail para verificar se já existe um perfil. Vamos guiá-lo para entrar ou criar uma nova conta em segundos.',
+      'it': 'Inserisci la tua email per verificare se esiste già un profilo. Ti guideremo per accedere o creare un nuovo account in pochi secondi.',
+      'de': 'Geben Sie Ihre E-Mail ein, um ein vorhandenes Profil zu prüfen. Wir führen Sie in Sekundenschnelle durchs Anmelden oder Anlegen eines neuen Kontos.'
+    },
+    'existing_account_prompt': {
+      'en': 'We found an existing account, please enter your password to continue.',
+      'fr': 'Nous avons trouvé un compte existant, veuillez saisir votre mot de passe pour continuer.',
+      'es': 'Encontramos una cuenta existente, ingresa tu contraseña para continuar.',
+      'ar': 'وجدنا حساباً موجوداً، يرجى إدخال كلمة المرور للمتابعة.',
+      'zh': '检测到已有账号，请输入密码继续。',
+      'hi': 'हमें एक मौजूदा खाता मिला, कृपया आगे बढ़ने के लिए पासवर्ड दर्ज करें।',
+      'ru': 'Мы нашли существующий аккаунт, введите пароль, чтобы продолжить.',
+      'pt': 'Encontramos uma conta existente, digite sua senha para continuar.',
+      'it': 'Abbiamo trovato un account esistente, inserisci la password per continuare.',
+      'de': 'Wir haben ein bestehendes Konto gefunden, bitte geben Sie Ihr Passwort ein, um fortzufahren.'
+    },
+    'existing_account_password_label': {
+      'en': 'Account Password',
+      'fr': 'Mot de passe du compte',
+      'es': 'Contraseña de la cuenta',
+      'ar': 'كلمة مرور الحساب',
+      'zh': '账户密码',
+      'hi': 'खाते का पासवर्ड',
+      'ru': 'Пароль аккаунта',
+      'pt': 'Senha da conta',
+      'it': 'Password dell\'account',
+      'de': 'Kontopasswort'
+    },
+    'new_account_prompt': {
+      'en': 'No account found, create your login details below so we can personalize your experience.',
+      'fr': 'Aucun compte trouvé, créez vos identifiants ci-dessous pour que nous puissions personnaliser votre expérience.',
+      'es': 'No encontramos una cuenta, crea tus datos de acceso abajo para que podamos personalizar tu experiencia.',
+      'ar': 'لم نعثر على حساب، أنشئ بيانات تسجيل الدخول أدناه حتى نتمكن من تخصيص تجربتك.',
+      'zh': '未找到账户，请在下方创建登录信息，以便我们为您个性化体验。',
+      'hi': 'कोई खाता नहीं मिला, नीचे अपने लॉगिन विवरण बनाएँ ताकि हम आपके अनुभव को व्यक्तिगत बना सकें।',
+      'ru': 'Аккаунт не найден, создайте учетные данные ниже, чтобы мы персонализировали ваш опыт.',
+      'pt': 'Nenhuma conta encontrada, crie seus dados de acesso abaixo para personalizarmos sua experiência.',
+      'it': 'Nessun account trovato, crea le tue credenziali qui sotto così potremo personalizzare la tua esperienza.',
+      'de': 'Kein Konto gefunden, erstellen Sie unten Ihre Zugangsdaten, damit wir Ihre Erfahrung personalisieren können.'
+    },
+    'create_username_label': {
+      'en': 'Choose a Username',
+      'fr': 'Choisissez un nom d\'utilisateur',
+      'es': 'Elige un nombre de usuario',
+      'ar': 'اختر اسم مستخدم',
+      'zh': '选择用户名',
+      'hi': 'उपयोगकर्ता नाम चुनें',
+      'ru': 'Выберите имя пользователя',
+      'pt': 'Escolha um nome de usuário',
+      'it': 'Scegli un nome utente',
+      'de': 'Wählen Sie einen Benutzernamen'
+    },
+    'create_password_label': {
+      'en': 'Create a Password',
+      'fr': 'Créez un mot de passe',
+      'es': 'Crea una contraseña',
+      'ar': 'أنشئ كلمة مرور',
+      'zh': '创建密码',
+      'hi': 'पासवर्ड बनाएँ',
+      'ru': 'Создайте пароль',
+      'pt': 'Crie uma senha',
+      'it': 'Crea una password',
+      'de': 'Erstellen Sie ein Passwort'
     },
     'choose_donation_amount': {
       'en': 'Choose Your Donation Amount',
@@ -930,6 +978,18 @@ export class LanguageService {
       'it': 'Carta di credito/debito',
       'de': 'Kredit-/Debitkarte'
     },
+    'paying_by_phone': {
+      'en': 'Paying by phone',
+      'fr': 'Paiement par téléphone',
+      'es': 'Pago por teléfono',
+      'ar': 'الدفع عبر الهاتف',
+      'zh': '电话支付',
+      'hi': 'फोन से भुगतान',
+      'ru': 'Оплата по телефону',
+      'pt': 'Pagamento por telefone',
+      'it': 'Pagamento telefonico',
+      'de': 'Bezahlung per Telefon'
+    },
     'payment_information': {
       'en': 'Payment Information',
       'fr': 'Informations de paiement',
@@ -991,16 +1051,16 @@ export class LanguageService {
       'de': 'CVV'
     },
     'donation_secure_tax_deductible': {
-      'en': 'Your donation is secure and tax-deductible. EIN: XX-XXXXXXX',
-      'fr': 'Votre don est sécurisé et déductible d\'impôt. EIN: XX-XXXXXXX',
-      'es': 'Tu donación es segura y deducible de impuestos. EIN: XX-XXXXXXX',
-      'ar': 'تبرعك آمن ويمكن خصمه من الضرائب. EIN: XX-XXXXXXX',
-      'zh': '您的捐赠是安全的，可以抵税。EIN: XX-XXXXXXX',
-      'hi': 'आपका दान सुरक्षित और कर-कटौती योग्य है। EIN: XX-XXXXXXX',
-      'ru': 'Ваше пожертвование защищено и подлежит налоговому вычету. EIN: XX-XXXXXXX',
-      'pt': 'Sua doação é segura e dedutível de impostos. EIN: XX-XXXXXXX',
-      'it': 'La tua donazione è sicura e deducibile dalle tasse. EIN: XX-XXXXXXX',
-      'de': 'Ihre Spende ist sicher und steuerlich absetzbar. EIN: XX-XXXXXXX'
+      'en': 'Your donation is tax-deductible. Details will be provided in your confirmation email.',
+      'fr': 'Votre don est déductible d\'impôt. Les détails seront fournis dans votre courriel de confirmation.',
+      'es': 'Tu donación es deducible de impuestos. Los detalles llegarán en tu correo de confirmación.',
+      'ar': 'تبرعك قابل للخصم الضريبي. سيتم تزويدك بالتفاصيل في رسالة التأكيد الإلكترونية.',
+      'zh': '您的捐赠可抵税。详细信息将通过确认邮件发送给您。',
+      'hi': 'आपका दान कर-कटौती योग्य है। विवरण आपको पुष्टि ईमेल में भेजे जाएंगे।',
+      'ru': 'Ваше пожертвование подлежит налоговому вычету. Детали придут в письме-подтверждении.',
+      'pt': 'Sua doação é dedutível de impostos. Os detalhes serão enviados no e-mail de confirmação.',
+      'it': 'La tua donazione è deducibile dalle tasse. I dettagli saranno inviati nella mail di conferma.',
+      'de': 'Ihre Spende ist steuerlich absetzbar. Details erhalten Sie in der Bestätigungs-E-Mail.'
     },
     'all_info_confidential': {
       'en': 'All information is kept confidential and secure.',
