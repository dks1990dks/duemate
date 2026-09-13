import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const notifyAuthExpired = () => {
  window.dispatchEvent(
    new CustomEvent("auth:expired")
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const skipRefreshUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/logout",
      "/auth/refresh",
       "/auth/me",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
      "/auth/resend-verification",
    ];

    const shouldSkipRefresh = skipRefreshUrls.some((url) =>
      originalRequest?.url?.includes(url)
    );

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      shouldSkipRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      notifyAuthExpired();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;