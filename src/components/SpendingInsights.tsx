import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction, Budget } from "@/types";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const SpendingInsights = ({ transactions, budgets }: SpendingInsightsProps) => {
  // Get current month
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Calculate actual spending for current month by category
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionMonth = transaction.date.slice(0, 7);
    return transactionMonth === currentMonth;
  });

  const actualSpending = currentMonthTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Get budgets for current month
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);

  // Generate insights
  const insights = currentMonthBudgets.map(budget => {
    const actual = actualSpending[budget.category] || 0;
    const difference = budget.budgetAmount - actual;
    const percentUsed = (actual / budget.budgetAmount) * 100;
    
    let status: 'success' | 'warning' | 'danger' = 'success';
    let message = '';
    let icon = CheckCircle;
    
    if (percentUsed > 100) {
      status = 'danger';
      message = `You have exceeded your ${budget.category} budget by ${formatAmount(Math.abs(difference))}.`;
      icon = AlertCircle;
    } else if (percentUsed > 80) {
      status = 'warning';
      message = `You are close to your ${budget.category} budget limit. ${formatAmount(difference)} remaining.`;
      icon = TrendingUp;
    } else {
      status = 'success';
      message = `You are within your ${budget.category} budget. ${formatAmount(difference)} remaining.`;
      icon = CheckCircle;
    }
    
    return {
      category: budget.category,
      status,
      message,
      percentUsed: Math.round(percentUsed),
      icon,
      actual,
      budget: budget.budgetAmount
    };
  });

  // Calculate previous month comparison
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const prevMonthString = previousMonth.toISOString().slice(0, 7);

  const previousMonthTransactions = transactions.filter(transaction => {
    const transactionMonth = transaction.date.slice(0, 7);
    return transactionMonth === prevMonthString;
  });

  const currentTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const previousTotal = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyChange = currentTotal - previousTotal;
  const monthlyChangePercent = previousTotal > 0 ? ((monthlyChange / previousTotal) * 100) : 0;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Monthly Overview
          </CardTitle>
          <CardDescription>
            {formatMonth(currentMonth)} spending summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Total Spending This Month</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(currentTotal)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">vs Last Month</div>
              <div className={`text-2xl font-bold flex items-center gap-2 ${
                monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {monthlyChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {formatAmount(Math.abs(monthlyChange))}
                <span className="text-sm">
                  ({Math.abs(monthlyChangePercent).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Insights */}
      {insights.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Budget Insights
            </CardTitle>
            <CardDescription>
              How you're doing against your budgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div 
                    key={insight.category} 
                    className={`p-4 rounded-lg border ${getStatusColor(insight.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-white/70">
                            {insight.category}
                          </Badge>
                          <span className="text-sm font-medium">
                            {insight.percentUsed}% used
                          </span>
                        </div>
                        <p className="text-sm">{insight.message}</p>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Spent: {formatAmount(insight.actual)}</span>
                          <span>Budget: {formatAmount(insight.budget)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Tips */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 Review your spending patterns weekly to stay on track with your budgets.
              </p>
            </div>
            
            {monthlyChange > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ Your spending has increased by {formatAmount(monthlyChange)} compared to last month. Consider reviewing your expenses.
                </p>
              </div>
            )}
            
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✅ Set realistic budgets for each category to maintain healthy spending habits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingInsights;
