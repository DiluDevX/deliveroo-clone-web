export interface FinanceRecord {
  id: string;
  period: string;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  totalRevenue: number;
  platformCommission: number;
  commissionPercentage: number;
  amountDue: number;
  amountPaid: number;
  pendingAmount: number;
  payoutHistory: {
    amount: number;
    date: string;
    status: "pending" | "paid" | "failed";
  }[];
  lastPayoutDate: string;
  nextPayoutDate: string;
  status: "pending" | "paid";
}
