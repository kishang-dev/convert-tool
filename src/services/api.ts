import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const api_root = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: api_root,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Auth Token and Guest ID
api.interceptors.request.use((config) => {
  // Get store state (reading directly from localStorage for persistence if Zustand not yet hydrated, 
  // but Zustand persist writes to localStorage 'auth-storage')

  const storageStr = localStorage.getItem('auth-storage');
  let token = null;
  let guestId = null;

  if (storageStr) {
    const storage = JSON.parse(storageStr);
    if (storage.state) {
      if (storage.state.user && storage.state.user.token) {
        token = storage.state.user.token;
      }
      if (storage.state.guestId) {
        guestId = storage.state.guestId;
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (guestId) {
    config.headers['X-Guest-ID'] = guestId;
  }

  return config;
});

// Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // If the error requires login (free trial expired)
      if (error.response.data && error.response.data.requiresLogin) {
        // Ideally, we should redirect or show a modal. 
        // Since we are in a service, we can't easily use hooks.
        // We can dispatch a custom event or let the component handle it.
        // For now, let's allow the component to handle the specific error message, 
        // but we could also force a redirect if we wanted to be aggressive.
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=Free trial expired. Please login.';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const svgApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/upload-svg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  updateColors: async (
    filename: string,
    newColors: string[],
    useGradients: boolean = false
  ) => {
    const response = await api.post("/update-svg-colors", {
      filename,
      newColors,
      useGradients,
    });

    return response.data;
  },

  getSvgUrl: (svgUrl: string) => {
    if (svgUrl.startsWith("http")) return svgUrl;
    return `${API_BASE_URL}${svgUrl}`;
  },
};

export const ocrApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/upload-and-ocr", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getOcrData: async (imageId: string) => {
    const response = await api.get(`/ocr-data/${imageId}`);
    return response.data;
  },
};

export const chartApi = {
  createChart: async (data: any) => {
    const response = await api.post("/charts", data);
    return response.data;
  },
  getCharts: async () => {
    const response = await api.get("/charts");
    return response.data;
  },
  getChartById: async (id: string) => {
    const response = await api.get(`/charts/${id}`);
    return response.data;
  },
  updateChart: async (id: string, data: any) => {
    const response = await api.put(`/charts/${id}`, data);
    return response.data;
  },
  deleteChart: async (id: string) => {
    const response = await api.delete(`/charts/${id}`);
    return response.data;
  },
  generateAIChart: async (data: { title: string; prompt: string; platform: string; apiKey: string }) => {
    const response = await api.post("/charts/generate-ai", data);
    return response.data;
  },
  exportFlowchart: async (id: string) => {
    const response = await api.get(`/charts/${id}/export`, {
      responseType: "blob",
    });
    return response;
  },
};

export default api;
