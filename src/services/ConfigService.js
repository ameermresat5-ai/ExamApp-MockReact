class ConfigService {
  constructor() {
    const requestedMode =
      import.meta.env.VITE_DATA_MODE || "client";

    const supportedModes = ["client", "server"];

    this.config = {
      appName: "ExamApp Mock React",
      version: "1.0.0",
      storagePrefix: "examapp_mock_react",
      defaultRole: "student",

      dataMode: supportedModes.includes(requestedMode)
        ? requestedMode
        : "client",

      apiBaseUrl:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:5000/api"
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
