const AUTH_TOKEN_COOKIE = "auth_token";

class CookieStorage {
  private static getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue || null;
    }

    return null;
  }

  private static setCookie(
    name: string,
    value: string,
    days: number = 7
  ): void {
    if (typeof document === "undefined") return;

    const expires = new Date();

    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  private static deleteCookie(name: string): void {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  static getToken(): string | null {
    try {
      return this.getCookie(AUTH_TOKEN_COOKIE);
    } catch (error) {
      console.warn("Failed to get token from cookies:", error);
      return null;
    }
  }

  static setToken(token: string, days: number = 7): void {
    try {
      this.setCookie(AUTH_TOKEN_COOKIE, token, days);
    } catch (error) {
      console.error("Failed to save token to cookies:", error);
    }
  }

  static removeToken(): void {
    try {
      this.deleteCookie(AUTH_TOKEN_COOKIE);
    } catch (error) {
      console.error("Failed to remove token from cookies:", error);
    }
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }

  static clear(): void {
    this.removeToken();
  }
}

export default CookieStorage;
