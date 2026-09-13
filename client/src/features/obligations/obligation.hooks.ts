import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  archiveObligation,
  createObligation,
  getObligationById,
  getObligations,
  markObligationAsPaid,
  pauseObligation,
  resumeObligation,
  updateObligation,
} from "./obligation.api";

import type {
  CreateObligationData,
  UpdateObligationData,
} from "./obligation.types";

import { dashboardKeys } from "../dashboard/dashboard.hooks";
import { reminderKeys } from "../reminders/reminder.hooks";

const invalidateObligationAndDashboardQueries = async (
  queryClient: QueryClient,
  obligationId?: string,
) => {
  await queryClient.invalidateQueries({
    queryKey: obligationKeys.lists(),
  });

  if (obligationId) {
    await queryClient.invalidateQueries({
      queryKey: obligationKeys.detail(obligationId),
    });
  }

  await queryClient.invalidateQueries({
    queryKey: dashboardKeys.all,
  });

  await queryClient.invalidateQueries({
    queryKey: reminderKeys.all,
  });
};

export const obligationKeys = {
  all: ["obligations"] as const,

  lists: () => [...obligationKeys.all, "list"] as const,

  list: () => [...obligationKeys.lists()] as const,

  details: () => [...obligationKeys.all, "detail"] as const,

  detail: (id: string) => [...obligationKeys.details(), id] as const,
};

// =========================
// Queries
// =========================

export const useObligations = () => {
  return useQuery({
    queryKey: obligationKeys.list(),
    queryFn: getObligations,
  });
};

export const useObligation = (id: string) => {
  return useQuery({
    queryKey: obligationKeys.detail(id),
    queryFn: () => getObligationById(id),
    enabled: Boolean(id),
  });
};

// =========================
// Create
// =========================

export const useCreateObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObligationData) => createObligation(data),

    onSuccess: async () => {
      await invalidateObligationAndDashboardQueries(queryClient);
    },
  });
};

// =========================
// Update
// =========================

export const useUpdateObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateObligationData }) =>
      updateObligation({
        id,
        data,
      }),

    onSuccess: async (_response, variables) => {
      await invalidateObligationAndDashboardQueries(queryClient, variables.id);
    },
  });
};

// =========================
// Mark as Paid
// =========================

export const useMarkObligationAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markObligationAsPaid(id),

    onSuccess: async (_response, id) => {
      await invalidateObligationAndDashboardQueries(queryClient, id);
    },
  });
};

// =========================
// Pause
// =========================

export const usePauseObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pauseObligation(id),

    onSuccess: async (_response, id) => {
      await invalidateObligationAndDashboardQueries(queryClient, id);
    },
  });
};

// =========================
// Resume
// =========================

export const useResumeObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeObligation(id),

    onSuccess: async (_response, id) => {
      await invalidateObligationAndDashboardQueries(queryClient, id);
    },
  });
};

// =========================
// Archive
// =========================

export const useArchiveObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveObligation(id),

    onSuccess: async (_response, id) => {
      await invalidateObligationAndDashboardQueries(queryClient, id);
    },
  });
};
