import { configService } from "./ConfigService";

class ApiService {
  getBaseUrl() {
    return configService.get("apiBaseUrl");
  }

  async request(path, options = {}) {
    const method = options.method || "GET";
    const url = `${this.getBaseUrl()}${path}`;

    console.log(`[CLIENT API] ${method} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  }

  get(path) {
    return this.request(path);
  }

  post(path, data) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  put(path, data) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  delete(path) {
    return this.request(path, {
      method: "DELETE"
    });
  }
}

export const apiService = new ApiService();
export default ApiService;
