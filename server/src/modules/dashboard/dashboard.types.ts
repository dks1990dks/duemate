export interface DashboardSummary {
  activeCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  overdueCount: number;
  upcomingAmount: number;
}

export interface UpcomingObligation {
  _id: string;
  title: string;
  type: string;
  amount: number;
  currency: string;
  nextDueDate: Date;
}

export interface OverdueObligation {
  _id: string;
  title: string;
  type: string;
  amount: number;
  currency: string;
  nextDueDate: Date;
}