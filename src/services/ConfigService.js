class ConfigService {
  constructor() {
    this.config = {
      appName: "ExamApp Mock React",
      version: "1.0.0",
      storagePrefix: "examapp_mock_react",
      defaultRole: "student"
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
