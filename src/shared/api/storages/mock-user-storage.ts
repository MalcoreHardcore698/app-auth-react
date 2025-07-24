import type { TUser } from "@/shared/types";
import type {
  ILoginCredentials,
  IRegisterCredentials,
} from "@/services/auth/types";

const USERS_STORAGE_KEY = "mock_users";
const INIT_FLAG_KEY = "mock_storage_initialized";

interface IStoredUser extends TUser {
  password: string;
}

class MockUserStorage {
  private static getUsers(): IStoredUser[] {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);

      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.warn("Failed to get users from localStorage:", error);
      return [];
    }
  }

  private static saveUsers(users: IStoredUser[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage:", error);
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static findUserByEmail(email: string): IStoredUser | null {
    const users = this.getUsers();

    return users.find((user) => user.email === email) || null;
  }

  static findUserById(id: string): TUser | null {
    const users = this.getUsers();

    const user = users.find((user) => user.id === id);

    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }

    return null;
  }

  static createUser(credentials: IRegisterCredentials): TUser {
    const users = this.getUsers();

    if (this.findUserByEmail(credentials.email)) {
      throw new Error("User with this email already exists");
    }

    const newUser: IStoredUser = {
      id: this.generateId(),
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
    };

    users.push(newUser);

    this.saveUsers(users);

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }

  static authenticateUser(credentials: ILoginCredentials): TUser {
    const user = this.findUserByEmail(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  static getAllUsers(): TUser[] {
    const users = this.getUsers();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
    }));
  }

  static deleteUser(userId: string): boolean {
    const users = this.getUsers();

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) return false;

    users.splice(userIndex, 1);

    this.saveUsers(users);

    return true;
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(USERS_STORAGE_KEY);
      localStorage.removeItem(INIT_FLAG_KEY);
    } catch (error) {
      console.error("Failed to clear mock storage:", error);
    }
  }

  static initTestData(): void {
    try {
      const isInitialized = localStorage.getItem(INIT_FLAG_KEY);

      if (isInitialized) return;

      const users = this.getUsers();

      if (!this.findUserByEmail("test@example.com")) {
        const testUser: IStoredUser = {
          id: "test_user_1",
          email: "test@example.com",
          name: "Test User",
          password: "password",
        };

        users.push(testUser);

        this.saveUsers(users);
      }

      localStorage.setItem(INIT_FLAG_KEY, "true");
    } catch (error) {
      console.error("Failed to initialize test data:", error);
    }
  }
}

export default MockUserStorage;
