import { create } from "zustand";
import { chartApi } from "../services/api";

interface ChartState {
    charts: any[];
    currentChart: any | null;
    loading: boolean;
    error: string | null;

    fetchCharts: () => Promise<void>;
    fetchChartById: (id: string) => Promise<void>;
    createChart: (data: any) => Promise<any>;
    updateChart: (id: string, data: any) => Promise<void>;
    deleteChart: (id: string) => Promise<void>;
    generateAIChart: (data: { title: string; prompt: string; platform: string; apiKey: string }) => Promise<any>;
    setCurrentChart: (chart: any | null) => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
    charts: [],
    currentChart: null,
    loading: false,
    error: null,

    fetchCharts: async () => {
        set({ loading: true, error: null });
        try {
            const data = await chartApi.getCharts();
            set({ charts: data.charts || [], loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to load charts" });
        }
    },

    fetchChartById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const data = await chartApi.getChartById(id);
            set({ currentChart: data.chart, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to load chart" });
        }
    },

    createChart: async (data: any) => {
        set({ loading: true, error: null });
        try {
            const response = await chartApi.createChart(data);
            const newChart = response.chart;
            set((state) => ({
                charts: [newChart, ...state.charts],
                loading: false
            }));
            return newChart;
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to create chart" });
            throw error;
        }
    },

    updateChart: async (id: string, data: any) => {
        set({ loading: true, error: null });
        try {
            const response = await chartApi.updateChart(id, data);
            const updatedChart = response.chart;
            set((state) => ({
                charts: state.charts.map((c) => (c._id === id ? updatedChart : c)),
                currentChart: state.currentChart?._id === id ? updatedChart : state.currentChart,
                loading: false,
            }));
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to update chart" });
            throw error;
        }
    },

    deleteChart: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await chartApi.deleteChart(id);
            set((state) => ({
                charts: state.charts.filter((c) => c._id !== id),
                currentChart: state.currentChart?._id === id ? null : state.currentChart,
                loading: false,
            }));
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to delete chart" });
            throw error;
        }
    },

    generateAIChart: async (data: any) => {
        set({ loading: true, error: null });
        try {
            const response = await chartApi.generateAIChart(data);
            const newChart = response.chart;
            set((state) => ({
                charts: [newChart, ...state.charts],
                loading: false
            }));
            return newChart;
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to generate AI chart" });
            throw error;
        }
    },

    setCurrentChart: (chart: any | null) => {
        set({ currentChart: chart });
    },
}));
