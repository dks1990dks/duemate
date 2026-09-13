import api from "../lib/api";

export interface HealthResponse {
  success: boolean;
  message: string;
  data: {
    environment: string;
  };
}

export const getApiHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>("/health");
  return response.data;
};