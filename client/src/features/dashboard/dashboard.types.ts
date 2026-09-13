export interface DashboardSummary {
  activeCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  overdueCount: number;
  upcomingAmount: number;
}


export interface DashboardSummaryResponse {
  success: boolean;
  message: string;

  data: {
    summary: DashboardSummary;
  };
}

export interface UpcomingObligation {
  _id: string;
  title: string;
  type: string;
  amount: number;
  currency: string;
  nextDueDate: string;
}

export interface UpcomingObligationsResponse {
  success: boolean;
  message: string;

  data: {
    obligations: UpcomingObligation[];
  };
}

export interface OverdueObligation {
  _id: string;
  title: string;
  type: string;
  amount: number;
  currency: string;
  nextDueDate: string;
}

export interface OverdueObligationsResponse {
  success: boolean;
  message: string;

  data: {
    obligations: OverdueObligation[];
  };
}