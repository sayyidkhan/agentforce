import axios from 'axios';
import type { DuelResponse, DuelStatusResponse, StartDuelRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const duelApi = {
  startDuel: async (request: StartDuelRequest): Promise<{ id: string; status: string }> => {
    const response = await api.post<{ id: string; status: string }>('/api/duel/start', request);
    return response.data;
  },

  getDuel: async (id: string): Promise<DuelResponse> => {
    const response = await api.get<DuelResponse>(`/api/duel/${id}`);
    return response.data;
  },

  getDuelStatus: async (id: string): Promise<DuelStatusResponse> => {
    const response = await api.get<DuelStatusResponse>(`/api/duel/${id}/status`);
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default duelApi;
