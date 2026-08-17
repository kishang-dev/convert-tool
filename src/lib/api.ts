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

export interface PdfPageSelection {
  fileId: string;
  pageIndex: number;
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

  getActiveFiles: async (): Promise<{ success: boolean; files: FileData[] }> => {
    try {
      const response = await api.get("/files?activeOnly=true");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch active files (offline or unauthorized)", error);
      return { success: false, files: [] };
    }
  },

  // Hide file
  hideFile: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/files/${id}/hide`);
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
    pageOrder?: PdfPageSelection[],
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
    downloadUrl: string;
  }> => {
    const response = await api.post("/files/merge", { fileIds, pageOrder });
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

  unlockPDF: async (
    fileId: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    file: FileData;
  }> => {
    const response = await api.post("/files/unlock", { fileId, password });
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
  getDownloadUrl: (fileOrFilename: string | FileData | { filename: string, operation?: string }): string => {
    if (typeof fileOrFilename === 'string') {
      return `${process.env.NEXT_PUBLIC_ASSETS_URL}/outputs/${fileOrFilename}`;
    }
    const isUpload = fileOrFilename.operation === 'upload' || fileOrFilename.operation === 'UPLOAD';
    const folder = isUpload ? 'uploads' : 'outputs';
    return `${process.env.NEXT_PUBLIC_ASSETS_URL}/${folder}/${fileOrFilename.filename}`;
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
  pdfToHtml: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/pdf-to-html", { fileId });
    return response.data;
  },

  // ---- Extra Conversions ----
  wordToPdf: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/word-to-pdf", { fileId });
    return response.data;
  },

  textToPdf: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/text-to-pdf", { fileId });
    return response.data;
  },

  csvToPdf: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/csv-to-pdf", { fileId });
    return response.data;
  },

  pdfToCsv: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/pdf-to-csv", { fileId });
    return response.data;
  },

  pdfToSpeech: async (fileId: string): Promise<{ success: boolean; message: string; audioUrls: string[] }> => {
    const response = await api.post("/pdf-to-speech", { fileId });
    return response.data;
  },

  videoToPdf: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/video-to-pdf", { fileId });
    return response.data;
  },

  audioToPdf: async (fileId: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/audio-to-pdf", { fileId });
    return response.data;
  },

  imageConvert: async (fileId: string, targetFormat: string): Promise<{ success: boolean; message: string; file: FileData; }> => {
    const response = await api.post("/image-convert", { fileId, targetFormat });
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
    photo?: string;
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
  references?: Array<{
    name: string;
    position: string;
    company: string;
    contact: string;
  }>;
  publications?: Array<{
    title: string;
    publisher: string;
    date: string;
    url?: string;
  }>;
  volunteer?: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
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
    lineHeight?: number;
    margins?: 'compact' | 'normal' | 'spacious';
    pageSize?: 'A4' | 'LETTER';
  };
  softSkills?: string[];
  coursework?: string[];
  patents?: Array<{ title: string; date: string; url?: string; description: string; }>;
  speakingEngagements?: Array<{ title: string; event: string; date: string; url?: string; }>;
  testimonials?: Array<{ name: string; quote: string; position: string; }>;
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
    try {
      const response = await api.get("/resumes");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch resumes (offline or unauthorized)", error);
      return { success: false, data: [] };
    }
  },
  getResumeById: async (id: string): Promise<{ success: boolean; data: ResumeData }> => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  updateResume: async (id: string, data: ResumeData): Promise<{ success: boolean; data: ResumeData }> => {
    const response = await api.put(`/resumes/${id}`, data);
    return response.data;
  },
  deleteResume: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
  exportResume: async (id: string, html: string, resumeData?: ResumeData): Promise<{ success: boolean; downloadUrl: string }> => {
    const response = await api.post(`/resumes/${id}/export`, { html, resumeData });
    return response.data;
  },
};

export const devToolsAPI = {
  // Base64
  base64Encode: async (text: string) => (await api.post("/devtools/base64/encode", { text })).data,
  base64Decode: async (text: string) => (await api.post("/devtools/base64/decode", { text })).data,

  // JSON
  formatJson: async (json: string, indent?: number) => (await api.post("/devtools/json/format", { json, indent })).data,
  minifyJson: async (json: string) => (await api.post("/devtools/json/minify", { json })).data,
  validateJson: async (json: string) => (await api.post("/devtools/json/validate", { json })).data,

  // XML
  xmlToJson: async (xml: string) => (await api.post("/devtools/xml/to-json", { xml })).data,
  jsonToXml: async (json: string) => (await api.post("/devtools/xml/from-json", { json })).data,

  // SQL
  formatSql: async (sql: string) => (await api.post("/devtools/sql/format", { sql })).data,

  // Code Minifier
  minifyCode: async (code: string, type: string) => (await api.post("/devtools/code/minify", { code, type })).data,
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

export const conversionApi = {
  svgToImage: async (fileId: string, targetFormat: string, density?: number) => (await api.post("/conversion/svg-to-image", { fileId, targetFormat, density })).data,
  watermarkImage: async (fileId: string, options: { text: string; color?: string; opacity?: number; fontSize?: number }) => (await api.post("/conversion/image-watermark", { fileId, ...options })).data,
};

export default api;

