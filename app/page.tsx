"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Account, Category, Goal, Transaction } from "../types"

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  function fetchArray(url: string, setter: (data: any[]) => void, headers: HeadersInit) {
    fetch(url, { headers })
      .then(res => res.json())
      .then(data => setter(data.results ?? []))
      .catch(() => setter([]))
  }

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };

    fetchArray("http://127.0.0.1:8000/project/api/accounts/", setAccounts, headers)
    fetchArray("http://127.0.0.1:8000/project/api/categories/", setCategories, headers)
    fetchArray("http://127.0.0.1:8000/project/api/goals/", setGoals, headers)
    fetchArray("http://127.0.0.1:8000/project/api/transactions/?limit=5", setTransactions, headers)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card text-card-foreground p-4">
              <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
              <div className="text-2xl font-bold">
                ${accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0).toFixed(2)}
              </div>
            </Card>
            <Card className="bg-card text-card-foreground p-4">
              <h2 className="text-xl font-semibold mb-2">Budget Progress</h2>
              {categories.map(cat => (
                <div key={cat.id} className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span>{cat.title}</span>
                    <span>
                      ${cat.budget_amount}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (transactions
                        .filter(tx => tx.category === cat.id)
                        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0) /
                        cat.budget_amount) * 100
                    )}
                    className="bg-muted"
                  />
                </div>
              ))}
            </Card>
            <Card className="bg-card text-card-foreground p-4">
              <h2 className="text-xl font-semibold mb-2">Goals</h2>
              {goals.map(goal => (
                <div key={goal.id} className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span>{goal.category_title || goal.category}</span>
                    <span>
                      ${goal.target_amount}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (transactions
                        .filter(tx => tx.category === goal.category)
                        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0) /
                        goal.target_amount) * 100
                    )}
                    className="bg-accent"
                  />
                </div>
              ))}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="accounts">
          <Table>
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Type</th>
                <th className="text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id}>
                  <td className="text-left">{acc.name}</td>
                  <td className="text-left">{acc.type}</td>
                  <td className="text-left">${parseFloat(acc.balance).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabsContent>
        <TabsContent value="goals">
          <Table>
            <thead>
              <tr>
                <th className="text-left">Category</th>
                <th className="text-left">Target Amount</th>
                <th className="text-left">Deadline</th>
                <th className="text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {goals.map(goal => (
                <tr key={goal.id}>
                  <td className="text-left">{goal.category_title || goal.category}</td>
                  <td className="text-left">${goal.target_amount}</td>
                  <td className="text-left">{goal.deadline}</td>
                  <td>
                    <Progress
                      value={Math.min(
                        100,
                        (transactions
                          .filter(tx => tx.category === goal.category)
                          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0) /
                          goal.target_amount) * 100
                      )}
                      className="bg-accent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabsContent>
        <TabsContent value="transactions">
          <Table>
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Category</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td className="text-left">{tx.date}</td>
                  <td className="text-left">{tx.category_title || tx.category}</td>
                  <td className="text-left">${parseFloat(tx.amount).toFixed(2)}</td>
                  <td className="text-left">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabsContent>
      </Tabs>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" className="bg-primary text-primary-foreground">
          Add Transaction
        </Button>
        <Button variant="outline" className="bg-primary text-primary-foreground">
          Add Category
        </Button>
        <Button variant="outline" className="bg-primary text-primary-foreground">
          Add Goal
        </Button>
      </div>
    </div>
  )
}
