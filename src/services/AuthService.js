// שירות התחברות והרשמה.
// השירות אחראי על login, register, logout ושמירת המשתמש המחובר.

import { mockDbService } from "./MockDbService";
import { storageService } from "./StorageService";
import { loggerService } from "./LoggerService";
import { notifyService } from "./NotifyService";

class AuthService {
  constructor() {
    this.currentUserKey = "current_user";
  }

  login(email, password) {
    const user = mockDbService.findUserByEmail(email);

    if (!user || user.password !== password) {
      loggerService.warn("Login failed", { email });
      notifyService.error("Invalid email or password");
      return null;
    }

    const safeUser = this.removePassword(user);
    storageService.set(this.currentUserKey, safeUser);

    loggerService.info("User logged in", safeUser);
    notifyService.success("Login successful");

    return safeUser;
  }

  register(userData) {
    const existingUser = mockDbService.findUserByEmail(userData.email);

    if (existingUser) {
      notifyService.error("Email already exists");
      return null;
    }

    const newUser = mockDbService.addUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "student"
    });

    const safeUser = this.removePassword(newUser);
    storageService.set(this.currentUserKey, safeUser);

    loggerService.info("User registered", safeUser);
    notifyService.success("Register successful");

    return safeUser;
  }

  logout() {
    storageService.remove(this.currentUserKey);
    loggerService.info("User logged out");
    notifyService.info("Logged out");
  }

  getCurrentUser() {
    return storageService.get(this.currentUserKey, null);
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  removePassword(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
export default AuthService;
