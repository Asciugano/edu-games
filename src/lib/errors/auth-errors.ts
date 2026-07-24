export function getAuthErrorMessage(code?: string, fallback?: string): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
      return "Esiste gia' un account con questa email, prova a cambiare email o fai il sign in";

    case "INVALID_EMAIL":
      return "Perfavore inserisci una email valida";

    case "INVALID_PASSWORD":
      return "La password non e' valida";

    case "EMAIL_NOT_VERIFIED":
      return "Perfacore verifica la tue email prima di continuare";

    case "TOO_MANY_REQUESTS":
      return "Troppi tentativi, riprova piu' tardi";

    case "NETWORK_ERROR":
      return "Impossibile connettersi. Controlla la tua connessione internet";

    default:
      return fallback ?? "Ops... Qualcosa e' andato storto";
  }
}
