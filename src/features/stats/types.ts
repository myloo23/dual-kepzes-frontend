export interface SystemStats {
  totals: {
    users: number;
    companies: number;
    positions: number;
    applications: number;
    activePartnerships: number;
    news: number;
    archivedNews: number;
  };
  usersByRole: Array<{ role: string; count: number }>;
}

export interface ApplicationStats {
  byStatus: Array<{ status: string; count: number }>;
  conversionRate: number;
  averagePerPosition: number;
  lastMonthCount: number;
}

export interface PartnershipStats {
  byStatus: Array<{ status: string; count: number }>;
  bySemester: Array<{ semester: string; count: number }>;
  averageDurationDays: number;
}

export interface PositionStats {
  expiringIn7Days: number;
  withNoApplications: number;
  // bySector removed as it is not present in the response
}

export interface TrendStats {
  registrationsPerMonth: Array<{ month: string; count: number }>;
  applicationsPerMonth: Array<{ month: string; count: number }>;
  partnershipsPerMonth: Array<{ month: string; count: number }>;
}
