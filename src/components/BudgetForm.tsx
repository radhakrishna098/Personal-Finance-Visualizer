
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Budget } from "@/types";
import { CATEGORIES } from "@/types";

interface BudgetFormProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, "id">) => void;
  onUpdateBudget: (id: string, budget: Omit<Budget, "id">) => void;
  onDeleteBudget: (id: string) => void;
  loading?: boolean;
}

const BudgetForm = ({ budgets, onAddBudget, onUpdateBudget, onDeleteBudget, loading }: BudgetFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Generate month options (current month and next 11 months)
  const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const displayString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      months.push({ value: monthString, label: displayString });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  // Set current month as default
  useEffect(() => {
    if (!selectedMonth && monthOptions.length > 0) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [selectedMonth, monthOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !selectedMonth || !budgetAmount) {
      return;
    }

    const budgetData = {
      category: selectedCategory,
      month: selectedMonth,
      budgetAmount: parseFloat(budgetAmount),
    };

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData);
      setEditingBudget(null);
    } else {
      onAddBudget(budgetData);
    }

    // Reset form
    setSelectedCategory("");
    setBudgetAmount("");
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setSelectedCategory(budget.category);
    setSelectedMonth(budget.month);
    setBudgetAmount(budget.budgetAmount.toString());
  };

  const handleCancel = () => {
    setEditingBudget(null);
    setSelectedCategory("");
    setBudgetAmount("");
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      {/* Budget Form */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
          </CardTitle>
          <CardDescription>
            Set spending limits for each category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading || !selectedCategory || !selectedMonth || !budgetAmount}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {editingBudget ? 'Update Budget' : 'Set Budget'}
              </Button>
              
              {editingBudget && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Budget List */}
      {budgets.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Current Budgets
            </CardTitle>
            <CardDescription>
              Manage your monthly spending limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {budget.category}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {formatMonth(budget.month)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">
                      {formatAmount(budget.budgetAmount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBudget(budget.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
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

export default BudgetForm;
