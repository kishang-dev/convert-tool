import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Auth Token and Guest ID
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storageStr = localStorage.getItem('auth-storage');
    let token = null;
    let guestId = null;

    if (storageStr) {
      try {
        const storage = JSON.parse(storageStr);
        if (storage.state) {
          if (storage.state.user && storage.state.user.token) {
            token = storage.state.user.token;
          }
          if (storage.state.guestId) {
            guestId = storage.state.guestId;
          }
        }
      } catch (e) {
        console.error("Failed to parse auth storage", e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (guestId) {
      config.headers['X-Guest-ID'] = guestId;
    }
  }
  return config;
});

// Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      if (error.response.data && error.response.data.requiresLogin) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=Free trial expired. Please login or register to continue.';
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface FileData {
  _id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  operation: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const fileAPI = {
  // Upload files
  uploadFiles: async (
    files: File[],
  ): Promise<{ success: boolean; files: FileData[] }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all files
  getAllFiles: async (): Promise<{ success: boolean; files: FileData[] }> => {
    const response = await api.get("/files");
    return response.data;
  },

  // Get file by ID
  getFileById: async (
    id: string,
  ): Promise<{ success: boolean; file: FileData }> => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  // Get preview images
  getPreviewImages: async (
    id: string,
  ): Promise<{ success: boolean; images: string[] }> => {
    const response = await api.get(`/files/${id}/previews`);
    return response.data;
  },

  // Get Page Text
  getPageText: async (
    id: string,
    pageIndex: number,
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/files/${id}/page/${pageIndex}/text`);
    return response.data;
  },

  // Save Page Content
  savePageContent: async (
    id: string,
    pageIndex: number,
    modifications: any[],
  ): Promise<{ success: boolean; file: FileData; downloadUrl: string }> => {
    const response = await api.post(`/files/${id}/page/${pageIndex}/save`, {
      modifications,
    });
    return response.data;
  },

  // Merge PDFs
  mergePDFs: async (
    fileIds: string[],
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
    downloadUrl: string;
  }> => {
    const response = await api.post("/files/merge", { fileIds });
    return response.data;
  },

  // Split PDF
  splitPDF: async (
    fileId: string,
    ranges?: Array<{ start: number; end: number }>,
  ): Promise<{
    success: boolean;
    message: string;
    files: FileData[];
  }> => {
    const response = await api.post("/files/split", { fileId, ranges });
    return response.data;
  },

  // Rotate PDF
  rotatePDF: async (
    fileId: string,
    degrees: number = 90,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/files/rotate", { fileId, degrees });
    return response.data;
  },

  // Compress PDF
  compressPDF: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/files/compress", { fileId });
    return response.data;
  },

  // Convert to Image
  convertToImage: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    files: FileData[];
  }> => {
    const response = await api.post("/files/to-image", { fileId });
    return response.data;
  },

  // Protect PDF
  protectPDF: async (
    fileId: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/files/protect", { fileId, password });
    return response.data;
  },

  // Convert to Word
  convertToWord: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/files/to-word", { fileId });
    return response.data;
  },

  // Convert to Excel
  convertToExcel: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/files/to-excel", { fileId });
    return response.data;
  },

  // Delete file
  deleteFile: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },

  // Get download URL
  getDownloadUrl: (filename: string): string => {
    return `${API_BASE_URL.replace("/api", "")}/outputs/${filename}`;
  },

  // Edit PDF (Rotate, Delete, Reorder pages)
  editPDF: async (
    fileId: string,
    pages: Array<{ index: number; rotation: number }>,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
    downloadUrl: string;
  }> => {
    const response = await api.post("/files/edit", { fileId, pages });
    return response.data;
  },

  // Add Blank Page
  addPage: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    file: FileData;
  }> => {
    const response = await api.post(`/files/${fileId}/add-page`);
    return response.data;
  },
  // PDF to PPTX
  pdfToPptx: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/pdf-to-pptx", { fileId });
    return response.data;
  },

  // Excel to PDF
  excelToPdf: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/excel-to-pdf", { fileId });
    return response.data;
  },

  // PowerPoint to PDF
  pptToPdf: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/ppt-to-pdf", { fileId });
    return response.data;
  },

  // HTML to PDF
  htmlToPdf: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/html-to-pdf", { fileId });
    return response.data;
  },

  // PDF to Text
  pdfToText: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
    textPreview?: string;
  }> => {
    const response = await api.post("/pdf-to-text", { fileId });
    return response.data;
  },

  // PDF to HTML
  pdfToHtml: async (
    fileId: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/pdf-to-html", { fileId });
    return response.data;
  },
};

export interface ResumeData {
  _id?: string;
  title?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    link?: string;
    technologies: string[];
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
  }>;
  interests?: string[];
  template: string;
  color: string;
  font: string;
  styling?: {
    fontSize: {
      name: number;
      headings: number;
      body: number;
    };
    sectionFonts: {
      name: string;
      headings: string;
      body: string;
    };
  };
}

export const resumeAPI = {
  parseResume: async (file: File): Promise<{ success: boolean; data: ResumeData }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/resumes/parse", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  saveResume: async (data: ResumeData): Promise<{ success: boolean; data: ResumeData }> => {
    const response = await api.post("/resumes", data);
    return response.data;
  },
  getUserResumes: async (): Promise<{ success: boolean; data: ResumeData[] }> => {
    const response = await api.get("/resumes");
    return response.data;
  },
  exportResume: async (id: string, html: string): Promise<{ success: boolean; downloadUrl: string }> => {
    const response = await api.post(`/resumes/${id}/export`, { html });
    return response.data;
  },
};

export default api;
