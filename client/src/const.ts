export const COOKIE_NAME = "auth-session";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Generate login URL for Google OAuth
export const getLoginUrl = () => {
  return `${window.location.origin}/api/oauth/login`;
};
