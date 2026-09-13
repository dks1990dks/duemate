import api from "@/lib/api";

import type {
  CreateObligationData,
  ObligationResponse,
  ObligationsResponse,
  UpdateObligationData,
} from "./obligation.types";


export const getObligations = async () => {
  const response = await api.get<ObligationsResponse>(
    "/obligations",
  );

  return response.data;
};


export const getObligationById = async (
  id: string,
) => {
  const response = await api.get<ObligationResponse>(
    `/obligations/${id}`,
  );

  return response.data.data.obligation;
};


export const createObligation = async (
  data: CreateObligationData,
) => {
  const response = await api.post<ObligationResponse>(
    "/obligations",
    data,
  );

  return response.data;
};


export const updateObligation = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateObligationData;
}) => {
  const response = await api.patch<ObligationResponse>(
    `/obligations/${id}`,
    data,
  );

  return response.data.data.obligation;
};


export const markObligationAsPaid = async (
  id: string,
) => {
  const response = await api.post<ObligationResponse>(
    `/obligations/${id}/mark-paid`,
  );

  return response.data.data.obligation;
};


export const pauseObligation = async (
  id: string,
) => {
  const response = await api.post<ObligationResponse>(
    `/obligations/${id}/pause`,
  );

  return response.data;
};


export const resumeObligation = async (
  id: string,
) => {
  const response = await api.post<ObligationResponse>(
    `/obligations/${id}/resume`,
  );

  return response.data;
};


export const archiveObligation = async (
  id: string,
) => {
  const response = await api.delete<ObligationResponse>(
    `/obligations/${id}`,
  );

   return response.data.data.obligation;
};