import CookieStorage from "./cookie-storage";

const TOKEN_MAPPING_KEY = "token_mappings";

interface ITokenData {
  userId: string;
  expiresAt: number;
}

class TokenStorage {
  private static generateToken(userId: string): string {
    return `mock_token_${userId}_${Date.now()}_${Math.random().toString(36)}`;
  }

  private static getTokenMappings(): Record<string, ITokenData> {
    try {
      const mappings = localStorage.getItem(TOKEN_MAPPING_KEY);

      return mappings ? JSON.parse(mappings) : {};
    } catch (error) {
      console.warn("Failed to get token mappings from localStorage:", error);
      return {};
    }
  }

  private static saveTokenMappings(mappings: Record<string, ITokenData>): void {
    try {
      localStorage.setItem(TOKEN_MAPPING_KEY, JSON.stringify(mappings));
    } catch (error) {
      console.error("Failed to save token mappings to localStorage:", error);
    }
  }

  static getToken(): string | null {
    return CookieStorage.getToken();
  }

  static getUserIdByToken(token: string): string | null {
    const mappings = this.getTokenMappings();

    const tokenData = mappings[token];

    if (!tokenData) {
      return null;
    }

    if (Date.now() > tokenData.expiresAt) {
      delete mappings[token];

      this.saveTokenMappings(mappings);

      return null;
    }

    return tokenData.userId;
  }

  static setToken(token: string, days: number = 7): void {
    CookieStorage.setToken(token, days);
  }

  static createToken(userId: string, days: number = 7): string {
    const token = this.generateToken(userId);

    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;

    this.setToken(token, days);

    const mappings = this.getTokenMappings();

    for (const [existingToken, data] of Object.entries(mappings)) {
      if (data.userId === userId) {
        delete mappings[existingToken];
      }
    }

    mappings[token] = { userId, expiresAt };

    this.saveTokenMappings(mappings);

    return token;
  }

  static removeToken(): void {
    CookieStorage.removeToken();
  }

  static removeTokenUserLink(token: string): void {
    const mappings = this.getTokenMappings();

    delete mappings[token];

    this.saveTokenMappings(mappings);
  }

  static isTokenValid(token: string): boolean {
    const mappings = this.getTokenMappings();

    const tokenData = mappings[token];

    if (!tokenData) return false;

    if (Date.now() > tokenData.expiresAt) {
      delete mappings[token];

      this.saveTokenMappings(mappings);

      return false;
    }

    return true;
  }

  static hasToken(): boolean {
    return CookieStorage.hasToken();
  }

  static clear(): void {
    CookieStorage.clear();
  }

  static clearAll(): void {
    this.clear();

    try {
      localStorage.removeItem(TOKEN_MAPPING_KEY);
    } catch (error) {
      console.error("Failed to clear token mappings:", error);
    }
  }
}

export default TokenStorage;
