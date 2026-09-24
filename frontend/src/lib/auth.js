const TOKEN_KEY = "edumotion_resources_token";

export function getAuthToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  sessionStorage.removeItem(TOKEN_KEY);
}
