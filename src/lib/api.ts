import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
};

export default api;
