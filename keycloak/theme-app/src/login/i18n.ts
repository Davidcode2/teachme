import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";
import type { KcContext } from "./KcContext";

const { useI18n: useBaseI18n, ofTypeI18n } = i18nBuilder.withThemeName<ThemeName>().build();

// The realm has internationalization disabled, so the server sends English
// messages. "x-keycloakify" messages win over every other translation source
// (bundled default set, custom translations), so injecting German here makes
// every page render German deterministically - including validation errors
// resolved inside useUserProfileForm.
const GERMAN_MESSAGES: Record<string, string> = {
  // Field labels
  username: "Benutzername",
  email: "E-Mail",
  firstName: "Vorname",
  lastName: "Nachname",
  password: "Passwort",
  "password-confirm": "Passwort bestätigen",
  passwordConfirm: "Passwort bestätigen",
  passwordNew: "Neues Passwort",

  // Buttons
  doLogIn: "Anmelden",
  doRegister: "Registrieren",
  doSubmit: "Absenden",
  doCancel: "Abbrechen",
  doForgotPassword: "Passwort vergessen?",
  doContinue: "Weiter",
  doLogout: "Abmelden",

  // Links and page titles
  backToLogin: "« Zurück zur Anmeldung",
  backToApplication: "« Zurück zur Applikation",
  registerTitle: "Registrierung",
  loginAccountTitle: "Bei Ihrem Konto anmelden",
  loginProfileTitle: "Profil aktualisieren",
  updatePasswordTitle: "Passwort aktualisieren",
  emailForgotTitle: "Passwort vergessen?",
  emailInstruction:
    "Geben Sie Ihren Benutzernamen oder Ihre E-Mail Adresse ein und klicken Sie auf Absenden. Danach werden wir Ihnen eine E-Mail mit weiteren Anweisungen zusenden.",
  emailInstructionUsername:
    "Geben Sie Ihren Benutzernamen ein und klicken Sie auf Absenden. Danach werden wir Ihnen eine E-Mail mit weiteren Anweisungen zusenden.",
  rememberMe: "Angemeldet bleiben",
  acceptTerms: "Ich stimme den Bedingungen und Konditionen zu",

  // Logout
  logoutConfirmTitle: "Abmelden",
  logoutConfirmHeader: "Wollen Sie sich abmelden?",
  logoutOtherSessions: "Von anderen Geräten abmelden",
  "frontchannel-logout.title": "Abmelden",
  "frontchannel-logout.message": "Sie melden sich von folgenden Anwendungen ab",
  successLogout: "Sie sind abgemeldet.",

  // Validation errors
  invalidEmailMessage: "Ungültige E-Mail-Adresse.",
  "error-invalid-email": "Ungültige E-Mail-Adresse.",
  "error-non-ascii-local-part-email":
    "Der lokale Teil der E-Mail-Adresse darf nur ASCII-Zeichen enthalten.",
  "error-username-invalid-character": "Der Benutzername enthält ungültige Zeichen.",
  "error-user-attribute-required": "Bitte füllen Sie dieses Feld aus.",
  "error-invalid-length": "Länge muss zwischen {1} und {2} Zeichen liegen.",
  "error-invalid-length-too-short": "Minimale Länge ist {1}.",
  "error-invalid-length-too-long": "Maximale Länge ist {2}.",
  "error-pattern-no-match": "Ungültiger Wert.",
  invalidPasswordConfirmMessage: "Die Passwortbestätigung ist nicht identisch.",
  invalidPasswordMinLengthMessage: "Ungültiges Passwort: Es muss mindestens {0} Zeichen lang sein.",
  invalidPasswordMinSpecialCharsMessage:
    "Ungültiges Passwort: Es muss mindestens {0} Sonderzeichen beinhalten.",
  invalidPasswordMinDigitsMessage: "Ungültiges Passwort: Es muss mindestens {0} Zahl(en) beinhalten.",
  invalidPasswordMinUpperCaseCharsMessage:
    "Ungültiges Passwort: Es muss mindestens {0} Großbuchstaben beinhalten.",
  invalidPasswordMinLowerCaseCharsMessage:
    "Ungültiges Passwort: Es muss mindestens {0} Kleinbuchstaben beinhalten.",
  invalidPasswordNotUsernameMessage:
    "Ungültiges Passwort: Es darf nicht gleich sein wie der Benutzername.",
  invalidPasswordNotEmailMessage:
    "Ungültiges Passwort: darf nicht identisch mit der E-Mail-Adresse sein.",
  invalidPasswordMaxLengthMessage: "Ungültiges Passwort: Es darf höchstens {0} Zeichen lang sein.",
  "error-invalid-multivalued-size": "Attribut {0} muss zwischen {1} und {2} Werte haben.",
  "error-number-out-of-range-too-big": "Nummer muss einen maximalen Wert von {2} haben.",
  "error-number-out-of-range-too-small": "Nummer muss einen minimalen Wert von {1} haben.",
  missingPasswordMessage: "Bitte geben Sie ein Passwort ein.",
  missingFirstNameMessage: "Bitte geben Sie einen Vornamen ein.",
  missingLastNameMessage: "Bitte geben Sie einen Nachnamen ein.",
  missingUsernameMessage: "Bitte geben Sie einen Benutzernamen ein.",
  missingEmailMessage: "Bitte geben Sie eine E-Mail-Adresse ein."
};

function forceGermanMessages(kcContext: KcContext): void {
  Object.assign(kcContext["x-keycloakify"].messages, GERMAN_MESSAGES);
}

function useI18n(params: { kcContext: KcContext }) {
  forceGermanMessages(params.kcContext);

  const result = useBaseI18n(params);

  document.documentElement.lang = "de";

  return result;
}

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
