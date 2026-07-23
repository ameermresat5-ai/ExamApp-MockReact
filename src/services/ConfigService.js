class ConfigService {
  constructor() {
    this.config = {
      appName: "ExamApp Mock React",
      version: "1.0.0",
      storagePrefix: "examapp_mock_react",
      defaultRole: "student",

      // Change this value:
      // "client" = localStorage only
      // "server" = localStorage + Express API sync
      dataMode: "server",

      apiBaseUrl: "http://localhost:5000/api"
    };
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
  }

  getAll() {
    return { ...this.config };
  }
}

export const configService = new ConfigService();
export default ConfigService;
