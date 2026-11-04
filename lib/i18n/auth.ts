import type { Locale } from './dictionaries'

export interface AuthStrings {
  signIn: string; createAccount: string
  titleCreate: string; subCreate: string; titleSignIn: string; subSignIn: string
  name: string; country: string; email: string; password: string
  google: string; or: string; forgot: string; wait: string
  submitCreate: string; submitSignIn: string
  verifyTitle: string; verifyBody: string
  resetSent: string; resetPrompt: string
  errFields: string; errPassword: string; errCredentials: string; errGeneric: string; errExists: string
  privacy: string; lockCta: string
  myAccount: string; signOut: string; signedInAs: string
  accountTitle: string; profile: string; save: string; saved: string
  security: string; newPassword: string; updatePassword: string; passwordUpdated: string
  assessments: string; assessmentsSoon: string; addCountry: string
  needSignIn: string; memberSince: string
}

export const authStrings: Record<Locale, AuthStrings> = {
  en: {
    signIn: 'Sign in', createAccount: 'Create account',
    titleCreate: 'Create your VoltSage account', subCreate: 'Free. Unlock every assessment tool and your PDF reports.',
    titleSignIn: 'Welcome back', subSignIn: 'Sign in to open your results and reports.',
    name: 'Full name', country: 'Country', email: 'Email address', password: 'Password',
    google: 'Continue with Google', or: 'or', forgot: 'Forgot password?', wait: 'Please wait…',
    submitCreate: 'Create account', submitSignIn: 'Sign in',
    verifyTitle: 'Check your email', verifyBody: 'We sent a confirmation link to {email}. Open it and this page will unlock automatically.',
    resetSent: 'Password reset link sent. Check your inbox.', resetPrompt: 'Enter your email above first, then tap “Forgot password?”.',
    errFields: 'Please fill in all fields with a valid email.', errPassword: 'Password must be at least 8 characters.',
    errCredentials: 'Incorrect email or password.', errGeneric: 'Something went wrong. Please try again.', errExists: 'An account with this email already exists. Please sign in.',
    privacy: 'We only use your details for your account and to follow up on your solar sizing — no spam.',
    lockCta: 'Sign in to view results',
    myAccount: 'My account', signOut: 'Sign out', signedInAs: 'Signed in as',
    accountTitle: 'My account', profile: 'Profile', save: 'Save changes', saved: 'Saved.',
    security: 'Password', newPassword: 'New password', updatePassword: 'Update password', passwordUpdated: 'Password updated.',
    assessments: 'My assessments', assessmentsSoon: 'Saved assessments and report history are coming soon.', addCountry: 'Add your country',
    needSignIn: 'Sign in to view your account.', memberSince: 'Member since',
  },
  es: {
    signIn: 'Iniciar sesión', createAccount: 'Crear cuenta',
    titleCreate: 'Crea tu cuenta VoltSage', subCreate: 'Gratis. Desbloquea todas las herramientas y tus informes PDF.',
    titleSignIn: 'Bienvenido de nuevo', subSignIn: 'Inicia sesión para abrir tus resultados e informes.',
    name: 'Nombre completo', country: 'País', email: 'Correo electrónico', password: 'Contraseña',
    google: 'Continuar con Google', or: 'o', forgot: '¿Olvidaste tu contraseña?', wait: 'Espera…',
    submitCreate: 'Crear cuenta', submitSignIn: 'Iniciar sesión',
    verifyTitle: 'Revisa tu correo', verifyBody: 'Enviamos un enlace de confirmación a {email}. Ábrelo y esta página se desbloqueará sola.',
    resetSent: 'Enlace de restablecimiento enviado. Revisa tu bandeja.', resetPrompt: 'Escribe primero tu correo y luego toca «¿Olvidaste tu contraseña?».',
    errFields: 'Completa todos los campos con un correo válido.', errPassword: 'La contraseña debe tener al menos 8 caracteres.',
    errCredentials: 'Correo o contraseña incorrectos.', errGeneric: 'Algo salió mal. Inténtalo de nuevo.', errExists: 'Ya existe una cuenta con este correo. Inicia sesión.',
    privacy: 'Solo usamos tus datos para tu cuenta y para dar seguimiento a tu dimensionamiento solar — sin spam.',
    lockCta: 'Inicia sesión para ver los resultados',
    myAccount: 'Mi cuenta', signOut: 'Cerrar sesión', signedInAs: 'Sesión iniciada como',
    accountTitle: 'Mi cuenta', profile: 'Perfil', save: 'Guardar cambios', saved: 'Guardado.',
    security: 'Contraseña', newPassword: 'Nueva contraseña', updatePassword: 'Actualizar contraseña', passwordUpdated: 'Contraseña actualizada.',
    assessments: 'Mis evaluaciones', assessmentsSoon: 'Las evaluaciones guardadas y el historial de informes llegarán pronto.', addCountry: 'Añade tu país',
    needSignIn: 'Inicia sesión para ver tu cuenta.', memberSince: 'Miembro desde',
  },
  pt: {
    signIn: 'Entrar', createAccount: 'Criar conta',
    titleCreate: 'Crie sua conta VoltSage', subCreate: 'Grátis. Libere todas as ferramentas e seus relatórios em PDF.',
    titleSignIn: 'Bem-vindo de volta', subSignIn: 'Entre para abrir seus resultados e relatórios.',
    name: 'Nome completo', country: 'País', email: 'Endereço de e-mail', password: 'Senha',
    google: 'Continuar com o Google', or: 'ou', forgot: 'Esqueceu a senha?', wait: 'Aguarde…',
    submitCreate: 'Criar conta', submitSignIn: 'Entrar',
    verifyTitle: 'Verifique seu e-mail', verifyBody: 'Enviamos um link de confirmação para {email}. Abra-o e esta página será liberada automaticamente.',
    resetSent: 'Link de redefinição enviado. Verifique sua caixa de entrada.', resetPrompt: 'Digite seu e-mail acima e toque em “Esqueceu a senha?”.',
    errFields: 'Preencha todos os campos com um e-mail válido.', errPassword: 'A senha deve ter pelo menos 8 caracteres.',
    errCredentials: 'E-mail ou senha incorretos.', errGeneric: 'Algo deu errado. Tente novamente.', errExists: 'Já existe uma conta com este e-mail. Entre.',
    privacy: 'Usamos seus dados apenas para sua conta e para acompanhar seu dimensionamento solar — sem spam.',
    lockCta: 'Entre para ver os resultados',
    myAccount: 'Minha conta', signOut: 'Sair', signedInAs: 'Conectado como',
    accountTitle: 'Minha conta', profile: 'Perfil', save: 'Salvar alterações', saved: 'Salvo.',
    security: 'Senha', newPassword: 'Nova senha', updatePassword: 'Atualizar senha', passwordUpdated: 'Senha atualizada.',
    assessments: 'Minhas avaliações', assessmentsSoon: 'Avaliações salvas e histórico de relatórios chegam em breve.', addCountry: 'Adicione seu país',
    needSignIn: 'Entre para ver sua conta.', memberSince: 'Membro desde',
  },
  fr: {
    signIn: 'Se connecter', createAccount: 'Créer un compte',
    titleCreate: 'Créez votre compte VoltSage', subCreate: 'Gratuit. Débloquez tous les outils et vos rapports PDF.',
    titleSignIn: 'Bon retour', subSignIn: 'Connectez-vous pour ouvrir vos résultats et rapports.',
    name: 'Nom complet', country: 'Pays', email: 'Adresse e-mail', password: 'Mot de passe',
    google: 'Continuer avec Google', or: 'ou', forgot: 'Mot de passe oublié ?', wait: 'Veuillez patienter…',
    submitCreate: 'Créer un compte', submitSignIn: 'Se connecter',
    verifyTitle: 'Vérifiez votre e-mail', verifyBody: 'Nous avons envoyé un lien de confirmation à {email}. Ouvrez-le et cette page se débloquera automatiquement.',
    resetSent: 'Lien de réinitialisation envoyé. Consultez votre boîte de réception.', resetPrompt: 'Saisissez d’abord votre e-mail, puis touchez « Mot de passe oublié ? ».',
    errFields: 'Remplissez tous les champs avec un e-mail valide.', errPassword: 'Le mot de passe doit contenir au moins 8 caractères.',
    errCredentials: 'E-mail ou mot de passe incorrect.', errGeneric: 'Une erreur est survenue. Réessayez.', errExists: 'Un compte existe déjà avec cet e-mail. Connectez-vous.',
    privacy: 'Nous utilisons vos données uniquement pour votre compte et le suivi de votre dimensionnement solaire — pas de spam.',
    lockCta: 'Connectez-vous pour voir les résultats',
    myAccount: 'Mon compte', signOut: 'Se déconnecter', signedInAs: 'Connecté en tant que',
    accountTitle: 'Mon compte', profile: 'Profil', save: 'Enregistrer', saved: 'Enregistré.',
    security: 'Mot de passe', newPassword: 'Nouveau mot de passe', updatePassword: 'Mettre à jour', passwordUpdated: 'Mot de passe mis à jour.',
    assessments: 'Mes évaluations', assessmentsSoon: 'Les évaluations enregistrées et l’historique des rapports arrivent bientôt.', addCountry: 'Ajoutez votre pays',
    needSignIn: 'Connectez-vous pour voir votre compte.', memberSince: 'Membre depuis',
  },
  de: {
    signIn: 'Anmelden', createAccount: 'Konto erstellen',
    titleCreate: 'VoltSage-Konto erstellen', subCreate: 'Kostenlos. Schalte alle Tools und deine PDF-Berichte frei.',
    titleSignIn: 'Willkommen zurück', subSignIn: 'Melde dich an, um Ergebnisse und Berichte zu öffnen.',
    name: 'Vollständiger Name', country: 'Land', email: 'E-Mail-Adresse', password: 'Passwort',
    google: 'Weiter mit Google', or: 'oder', forgot: 'Passwort vergessen?', wait: 'Bitte warten…',
    submitCreate: 'Konto erstellen', submitSignIn: 'Anmelden',
    verifyTitle: 'E-Mail prüfen', verifyBody: 'Wir haben einen Bestätigungslink an {email} gesendet. Öffne ihn, dann wird diese Seite automatisch freigeschaltet.',
    resetSent: 'Link zum Zurücksetzen gesendet. Prüfe dein Postfach.', resetPrompt: 'Gib oben zuerst deine E-Mail ein und tippe dann auf „Passwort vergessen?“.',
    errFields: 'Bitte alle Felder mit gültiger E-Mail ausfüllen.', errPassword: 'Das Passwort muss mindestens 8 Zeichen haben.',
    errCredentials: 'E-Mail oder Passwort falsch.', errGeneric: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.', errExists: 'Für diese E-Mail existiert bereits ein Konto. Bitte anmelden.',
    privacy: 'Wir verwenden deine Daten nur für dein Konto und die Nachverfolgung deiner Solarplanung — kein Spam.',
    lockCta: 'Anmelden, um Ergebnisse zu sehen',
    myAccount: 'Mein Konto', signOut: 'Abmelden', signedInAs: 'Angemeldet als',
    accountTitle: 'Mein Konto', profile: 'Profil', save: 'Änderungen speichern', saved: 'Gespeichert.',
    security: 'Passwort', newPassword: 'Neues Passwort', updatePassword: 'Passwort aktualisieren', passwordUpdated: 'Passwort aktualisiert.',
    assessments: 'Meine Auswertungen', assessmentsSoon: 'Gespeicherte Auswertungen und Berichtsverlauf folgen bald.', addCountry: 'Land hinzufügen',
    needSignIn: 'Melde dich an, um dein Konto zu sehen.', memberSince: 'Mitglied seit',
  },
}
