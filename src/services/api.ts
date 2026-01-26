import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const api_root = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: api_root,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;
