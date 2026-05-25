class NotifyService {
  constructor() {
    this.listeners = [];
    this.notifications = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  notify(type, message) {
    const notification = {
      id: Date.now(),
      type,
      message,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    this.listeners.forEach((listener) => listener(notification));

    return notification;
  }

  success(message) {
    return this.notify("success", message);
  }

  error(message) {
    return this.notify("error", message);
  }

  info(message) {
    return this.notify("info", message);
  }

  getAll() {
    return [...this.notifications];
  }

  clear() {
    this.notifications = [];
  }
}

export const notifyService = new NotifyService();
export default NotifyService;
