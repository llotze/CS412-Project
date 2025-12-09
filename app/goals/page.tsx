// file: project/app/goals/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of goals.

"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { getCategoryTitle } from "@/lib/utils"
import { AddButtons } from "@/components/AddButtons"
import { EditGoalModal } from "@/components/EditGoalModal"
import { DeleteConfirm } from "@/components/DeleteConfirm"
import { Button } from "@/components/ui/button"

export default function GoalsPage() {
  const { goals, transactions, categories, fetchAll } = useDashboardData()
  const [editing, setEditing] = useState<any>(null)
  const [editingOpen, setEditingOpen] = useState(false)
  const [deleting, setDeleting] = useState<any>(null)
  const [deletingOpen, setDeletingOpen] = useState(false)

  const sortedGoals = goals.slice().sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))

  async function handleDelete(id: number|string) {
    const token = localStorage.getItem("access"); if (!token) return
    await fetch(`http://127.0.0.1:8000/project/api/goal/${id}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Goals</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Category</th>
              <th className="text-left w-1/6 py-2 px-2 text-sm font-semibold">Budget</th>
              <th className="text-left w-1/6 py-2 px-2 text-sm font-semibold">Target</th>
              <th className="text-left w-1/6 py-2 px-2 text-sm font-semibold">Deadline</th>
              <th className="text-left w-2/5 py-2 px-2 text-sm font-semibold">Progress</th>
              <th className="text-right py-2 px-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedGoals.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-2 text-muted-foreground">No goals found.</td>
              </tr>
            ) : (
              sortedGoals.map(goal => {
                const spent = transactions
                  .filter(tx => tx.category === goal.category)
                  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                return (
                  <tr key={goal.id} className="border-b last:border-b-0">
                    <td className="py-1 px-2 text-sm">{getCategoryTitle(categories, goal.category)}</td>
                    <td className="py-1 px-2 text-sm">${goal.budget_amount}</td>
                    <td className="py-1 px-2 text-sm">${goal.target_amount}</td>
                    <td className="py-1 px-2 text-sm">{goal.deadline ? goal.deadline.split("T")[0] : ""}</td>
                    <td className="py-1 px-2 text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>${spent.toFixed(2)} <span className="mx-1 font-bold">/</span> ${goal.target_amount}</span>
                        </div>
                        <Progress value={Math.min(100,(spent / Number(goal.target_amount)) * 100)} className="bg-accent h-3" />
                      </div>
                    </td>
                    <td className="py-1 px-2 text-sm text-right">
                      <div className="inline-flex gap-2">
                        <Button className="bg-slate-100 text-slate-800 hover:bg-slate-200" onClick={() => { setEditing(goal); setEditingOpen(true) }}>
                          Edit
                        </Button>
                        <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => { setDeleting(goal); setDeletingOpen(true) }}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
      </Card>

      <EditGoalModal
        open={editingOpen}
        onOpenChange={setEditingOpen}
        goal={editing}
        categories={categories}
        onSuccess={fetchAll}
      />
      <DeleteConfirm
        open={deletingOpen}
        onOpenChange={setDeletingOpen}
        title="Delete Goal"
        message={`Delete goal for "${getCategoryTitle(categories, deleting?.category)}"?`}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />

      <AddButtons />
    </div>
  )
}