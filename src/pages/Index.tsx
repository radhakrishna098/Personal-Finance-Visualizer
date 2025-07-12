
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PieChart, BarChart3, Target, TrendingUp } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import CategoryChart from "@/components/CategoryChart";
import Dashboard from "@/components/Dashboard";
import BudgetForm from "@/components/BudgetForm";
import BudgetChart from "@/components/BudgetChart";
import SpendingInsights from "@/components/SpendingInsights";
import { useToast } from "@/hooks/use-toast";
import { Transaction, Budget, CATEGORIES } from "@/types";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'budgets' | 'insights'>('dashboard');
  const { toast } = useToast();

  // Mock data for demonstration (in real app, this would come from MongoDB)
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      { id: "1", amount: 1200, date: "2024-01-15", description: "Rent payment", category: "Rent" },
      { id: "2", amount: 85, date: "2024-01-10", description: "Groceries", category: "Food" },
      { id: "3", amount: 45, date: "2024-02-05", description: "Gas station", category: "Transportation" },
      { id: "4", amount: 120, date: "2024-02-12", description: "Utilities", category: "Utilities" },
      { id: "5", amount: 200, date: "2024-03-01", description: "Insurance", category: "Healthcare" },
      { id: "6", amount: 75, date: "2024-03-05", description: "Restaurant", category: "Food" },
      { id: "7", amount: 150, date: "2024-03-10", description: "Shopping", category: "Shopping" },
      // Add some current month transactions for better demo
      { id: "8", amount: 300, date: "2025-01-05", description: "Groceries", category: "Food" },
      { id: "9", amount: 1200, date: "2025-01-01", description: "Rent", category: "Rent" },
      { id: "10", amount: 150, date: "2025-01-03", description: "Utilities", category: "Utilities" },
    ];
    
    const mockBudgets: Budget[] = [
      { id: "1", category: "Food", month: "2025-01", budgetAmount: 400 },
      { id: "2", category: "Rent", month: "2025-01", budgetAmount: 1200 },
      { id: "3", category: "Utilities", month: "2025-01", budgetAmount: 200 },
      { id: "4", category: "Shopping", month: "2025-01", budgetAmount: 300 },
      { id: "5", category: "Entertainment", month: "2025-01", budgetAmount: 150 },
    ];
    
    setTransactions(mockTransactions);
    setBudgets(mockBudgets);
  }, []);

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setShowForm(false);
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transactionData: Omit<Transaction, "id">) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...transactionData, id } : t))
      );
      
      setEditingTransaction(null);
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budgetData: Omit<Budget, "id">) => {
    setLoading(true);
    try {
      // Check if budget already exists for this category and month
      const existingBudget = budgets.find(
        b => b.category === budgetData.category && b.month === budgetData.month
      );
      
      if (existingBudget) {
        toast({
          title: "Budget Already Exists",
          description: "A budget for this category and month already exists. Edit it instead.",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBudget: Budget = {
        ...budgetData,
        id: Date.now().toString(),
      };
      
      setBudgets(prev => [...prev, newBudget]);
      
      toast({
        title: "Success",
        description: "Budget set successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (id: string, budgetData: Omit<Budget, "id">) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBudgets(prev =>
        prev.map(b => (b.id === id ? { ...budgetData, id } : b))
      );
      
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setBudgets(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track expenses, set budgets, and gain spending insights
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-2 flex-wrap">
          <Button
            onClick={() => setActiveView('dashboard')}
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <PieChart className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveView('transactions')}
            variant={activeView === 'transactions' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Transactions
          </Button>
          <Button
            onClick={() => setActiveView('budgets')}
            variant={activeView === 'budgets' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Budgets
          </Button>
          <Button
            onClick={() => setActiveView('insights')}
            variant={activeView === 'insights' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Insights
          </Button>
        </div>

        {/* Add Transaction Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            disabled={loading}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={editingTransaction ? 
              (data) => updateTransaction(editingTransaction.id, data) : 
              addTransaction
            }
            onCancel={handleCloseForm}
            loading={loading}
          />
        )}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <Dashboard transactions={transactions} />
        )}

        {/* Transactions View */}
        {activeView === 'transactions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Expenses Chart */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">
                    Monthly Expenses
                  </CardTitle>
                  <CardDescription>
                    Your spending trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseChart transactions={transactions} />
                </CardContent>
              </Card>

              {/* Category Chart */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">
                    Spending by Category
                  </CardTitle>
                  <CardDescription>
                    Your expenses breakdown by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            {/* Transaction List */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Manage your financial records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={deleteTransaction}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budgets View */}
        {activeView === 'budgets' && (
          <div className="space-y-6">
            <BudgetForm
              budgets={budgets}
              onAddBudget={addBudget}
              onUpdateBudget={updateBudget}
              onDeleteBudget={deleteBudget}
              loading={loading}
            />
            
            {budgets.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">
                    Budget vs Actual
                  </CardTitle>
                  <CardDescription>
                    Compare your budgets with actual spending
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetChart transactions={transactions} budgets={budgets} />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Insights View */}
        {activeView === 'insights' && (
          <SpendingInsights transactions={transactions} budgets={budgets} />
        )}
      </div>
    </div>
  );
};

export default Index;
