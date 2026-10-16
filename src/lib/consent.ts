// Google Analytics 4 runs only after the visitor accepts the cookie banner; the choice lives in localStorage.
export const GA_ID = 'G-G5S0867EFV';
export const GA_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

export type Consent = 'granted' | 'denied' | null;

/** localStorage is visitor-editable: anything but the two known values means "not asked yet". */
export const readConsent = (v: unknown): Consent => (v === 'granted' || v === 'denied' ? v : null);

/** GA's first-party cookies (_ga, _ga_<id>) in a document.cookie string, so a withdrawal can delete them. */
export const gaCookies = (cookie: string) =>
  cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n === '_ga' || n.startsWith('_ga_'));
