// file: project/app/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/01/2025
// Description: Screen for displaying Overview.

"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { getCategoryTitle } from "@/lib/utils"
import { AddButtons } from "@/components/AddButtons"

/**
 * OverviewPage
 * - Shows summary cards: overall spending, budget progress, and goals progress.
 * - Uses shared dashboard data from DashboardDataProvider.
 */
export default function OverviewPage() {
  const { accounts, categories, goals, transactions } = useDashboardData()

  // Sort goals by deadline for consistent display
  const sortedGoals = goals.slice().sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))
  // Sum all transaction amounts 
  const overallSpending = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall spending */}
        <Card className="bg-card text-card-foreground p-3 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Overall Spending</h2>
          <div className="text-xl font-bold">
            ${overallSpending.toFixed(2)}
          </div>
        </Card>

        {/* Budget progress per goal (budget_amount vs spent) */}
        <Card className="bg-card text-card-foreground p-3 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Budget Progress</h2>
          <div className="space-y-2">
            {sortedGoals.map(goal => {
              // total spent for this goal's category
              const spent = transactions
                .filter(tx => tx.category === goal.category)
                .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
              return (
                <div key={goal.id} className="mb-1">
                  <div className="flex justify-between text-xs">
                    <span>{getCategoryTitle(categories, goal.category)}</span>
                    <span>
                      ${spent.toFixed(2)}
                      <span className="mx-1 font-bold text-foreground">/</span>
                      ${goal.budget_amount}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (spent / Number(goal.budget_amount)) * 100
                    )}
                    className="bg-muted h-2"
                  />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Goal target progress (target_amount vs spent) */}
        <Card className="bg-card text-card-foreground p-3 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Goals</h2>
          <div className="space-y-2">
            {sortedGoals.map(goal => {
              const spent = transactions
                .filter(tx => tx.category === goal.category)
                .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
              return (
                <div key={goal.id} className="mb-1">
                  <div className="flex justify-between text-xs">
                    <span>{getCategoryTitle(categories, goal.category)}</span>
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
                    className="bg-accent h-2"
                  />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      {/* Add controls */}
      <AddButtons />
    </div>
  )
}
