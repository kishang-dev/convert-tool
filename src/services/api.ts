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

  let token = null;
  let guestId = null;

  if (typeof window !== 'undefined') {
    const storageStr = localStorage.getItem('auth-storage');
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
  generateAIChart: async (data: { title: string; prompt: string; platform: string; apiKey: string; chartType?: string }) => {
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

export const authApi = {
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgotpassword", { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
  },
  updateProfile: async (data: FormData) => {
    const response = await api.put("/auth/update", data, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  },
  googleLogin: async (credential: string) => {
    const response = await api.post("/auth/google", { credential });
    return response.data;
  },
};

export const supportApi = {
  contact: async (data: { name: string; email: string; subject: string; message: string }) => {
    const response = await api.post("/support/contact", data);
    return response.data;
  },
};

export const conversionApi = {
  pdfToPptx: async (fileId: string) => (await api.post("/conversion/pdf-to-pptx", { fileId })).data,
  excelToPdf: async (fileId: string) => (await api.post("/conversion/excel-to-pdf", { fileId })).data,
  pptToPdf: async (fileId: string) => (await api.post("/conversion/ppt-to-pdf", { fileId })).data,
  htmlToPdf: async (fileId: string) => (await api.post("/conversion/html-to-pdf", { fileId })).data,
  pdfToText: async (fileId: string) => (await api.post("/conversion/pdf-to-text", { fileId })).data,
  pdfToHtml: async (fileId: string) => (await api.post("/conversion/pdf-to-html", { fileId })).data,

  // Extra Conversions
  wordToPdf: async (fileId: string) => (await api.post("/conversion/word-to-pdf", { fileId })).data,
  textToPdf: async (fileId: string) => (await api.post("/conversion/text-to-pdf", { fileId })).data,
  csvToPdf: async (fileId: string) => (await api.post("/conversion/csv-to-pdf", { fileId })).data,
  pdfToCsv: async (fileId: string) => (await api.post("/conversion/pdf-to-csv", { fileId })).data,
  pdfToSpeech: async (fileId: string) => (await api.post("/conversion/pdf-to-speech", { fileId })).data,
  videoToPdf: async (fileId: string) => (await api.post("/conversion/video-to-pdf", { fileId })).data,
  audioToPdf: async (fileId: string) => (await api.post("/conversion/audio-to-pdf", { fileId })).data,
  transcribeFile: async (fileId: string) => (await api.post("/conversion/transcribe-file", { fileId })).data,
  transcribeChunk: async (formData: FormData) => (await api.post("/conversion/transcribe-chunk", formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  imageConvert: async (fileId: string, targetFormat: string) => (await api.post("/conversion/image-convert", { fileId, targetFormat })).data,
  
  // Data Converters
  yamlToJson: async (yaml: string) => (await api.post("/yaml-to-json", { yaml })).data,
  jsonToYaml: async (json: string) => (await api.post("/json-to-yaml", { json })).data,
  csvToJson: async (csv: string) => (await api.post("/csv-to-json", { csv })).data,
  jsonToCsv: async (json: string | any[]) => (await api.post("/json-to-csv", { json })).data,
  convertHeic: async (fileId: string) => (await api.post("/heic-to-jpg", { fileId })).data,
  svgToImage: async (fileId: string, targetFormat: string, density?: number) => (await api.post("/conversion/svg-to-image", { fileId, targetFormat, density })).data,
  watermarkImage: async (fileId: string, options: { text: string; color?: string; opacity?: number; fontSize?: number }) => (await api.post("/conversion/image-watermark", { fileId, ...options })).data,
};

export const pdfToolsApi = {
  watermark: async (fileId: string, options: { text: string; opacity?: number; size?: number; rotation?: number; color?: string }) => (await api.post("/files/watermark", { fileId, ...options })).data,
  addPageNumbers: async (fileId: string, options: { position?: string; startNumber?: number; fontSize?: number; format?: string }) => (await api.post("/files/add-numbers", { fileId, ...options })).data,
};

export const devToolsApi = {
  generateHashes: async (text: string) => (await api.post("/devtools/hash/generate", { text })).data,
  processUrl: async (url: string) => (await api.post("/devtools/url/process", { url })).data,
  jsonToXml: async (json: string | object) => (await api.post("/devtools/xml/from-json", { json })).data,
};


export const blogApi = {
  getAllBlogs: async () => (await api.get("/blogs")).data,
  getBlogById: async (idOrSlug: string) => (await api.get(`/blogs/${idOrSlug}`)).data,
  createBlog: async (data: any) => (await api.post("/blogs", data)).data,
  updateBlog: async (id: string, data: any) => (await api.put(`/blogs/${id}`, data)).data,
  deleteBlog: async (id: string) => (await api.delete(`/blogs/${id}`)).data,
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/blogs/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default api;
