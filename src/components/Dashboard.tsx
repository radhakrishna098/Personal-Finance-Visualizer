
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ExpenseChart from "./ExpenseChart";
import CategoryChart from "./CategoryChart";
import { Transaction } from "@/types";

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard = ({ transactions }: DashboardProps) => {
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Get category breakdown
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by amount
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5); // Top 5 categories

  // Get most recent transaction
  const mostRecentTransaction = transactions.length > 0 
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-800',
      'Utilities': 'bg-blue-100 text-blue-800',
      'Rent': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-green-100 text-green-800',
      'Transportation': 'bg-yellow-100 text-yellow-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Others': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['Others'];
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatAmount(totalExpenses)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {transactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Top Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedCategories.length > 0 ? (
              <>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {formatAmount(sortedCategories[0][1])}
                </div>
                <Badge className={getCategoryColor(sortedCategories[0][0])}>
                  {sortedCategories[0][0]}
                </Badge>
              </>
            ) : (
              <div className="text-gray-500">No data</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Latest Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostRecentTransaction ? (
              <>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatAmount(mostRecentTransaction.amount)}
                </div>
                <Badge className={getCategoryColor(mostRecentTransaction.category)}>
                  {mostRecentTransaction.category}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(mostRecentTransaction.date)}
                </p>
              </>
            ) : (
              <div className="text-gray-500">No transactions</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Monthly Trends
            </CardTitle>
            <CardDescription>
              Your spending over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Category Breakdown
            </CardTitle>
            <CardDescription>
              Where your money goes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      {/* Category Details */}
      {sortedCategories.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Top Categories
            </CardTitle>
            <CardDescription>
              Your highest spending categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                  </div>
                  <div className="font-semibold text-gray-800">
                    {formatAmount(amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
