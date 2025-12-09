// file: project/app/goals/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of goals.

"use client"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { getCategoryTitle } from "@/lib/utils"
import { AddButtons } from "@/components/AddButtons"

export default function GoalsPage() {
  const { goals, transactions, categories } = useDashboardData()

  const sortedGoals = goals.slice().sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Goals</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Category</th>
              <th className="text-left w-1/6 py-2 px-2 text-sm font-semibold">Budget Amount</th>
              <th className="text-left w-1/6 py-2 px-2 text-sm font-semibold">Target Amount</th>
              <th className="text-left w-1/6 py-2 px-2 text-sm font-semibold">Deadline</th>
              <th className="text-left w-2/5 py-2 px-2 text-sm font-semibold">Progress</th>
            </tr>
          </thead>
          <tbody>
            {sortedGoals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-2 text-muted-foreground">No goals found.</td>
              </tr>
            ) : (
              sortedGoals.map(goal => {
                const spent = transactions
                  .filter(tx => tx.category === goal.category)
                  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                return (
                  <tr key={goal.id} className="border-b last:border-b-0">
                    <td className="text-left w-1/5 py-1 px-2 text-sm">
                      {getCategoryTitle(categories, goal.category)}
                    </td>
                    <td className="text-left w-1/6 py-1 px-2 text-sm">${goal.budget_amount}</td>
                    <td className="text-left w-1/6 py-1 px-2 text-sm">${goal.target_amount}</td>
                    <td className="text-left w-1/6 py-1 px-2 text-sm">
                      {goal.deadline ? goal.deadline.split("T")[0] : ""}
                    </td>
                    <td className="text-left w-2/5 py-1 px-2 text-sm align-middle">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>
                            ${spent.toFixed(2)}
                            <span className="mx-1 font-bold text-foreground">/</span>
                            ${goal.target_amount}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            (spent / Number(goal.target_amount)) * 100
                          )}
                          className="bg-accent h-3"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
      </Card>
      <AddButtons />
    </div>
  )
}