// file: project/app/transactions/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of transactions.

"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { getCategoryTitle } from "@/lib/utils"
import { AddButtons } from "@/components/AddButtons"
import { EditTransactionModal } from "@/components/EditTransactionModal"
import { DeleteConfirm } from "@/components/DeleteConfirm"
import { Button } from "@/components/ui/button"

export default function TransactionsPage() {
  const { transactions, categories, accounts, fetchAll } = useDashboardData()
  const [editing, setEditing] = useState<any>(null)
  const [editingOpen, setEditingOpen] = useState(false)
  const [deleting, setDeleting] = useState<any>(null)
  const [deletingOpen, setDeletingOpen] = useState(false)

  // Get account name by id
  function getAccountName(id: number | string) {
    const acc = accounts.find(a => a.id === id)
    if (!acc) return id
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium leading-none">{acc.name}</span>
        <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full leading-none">
          {acc.type}
        </span>
      </div>
    )
  }

  // Sort transactions by date descending
  const sortedTransactions = transactions.slice().sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })

  async function handleDelete(id: number|string) {
    const token = localStorage.getItem("access"); if (!token) return
    await fetch(`http://127.0.0.1:8000/project/api/transaction/${id}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Transactions</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left py-2 px-2 text-sm font-semibold">Date</th>
              <th className="text-left py-2 px-2 text-sm font-semibold">Category</th>
              <th className="text-left py-2 px-2 text-sm font-semibold">Account</th>
              <th className="text-left py-2 px-2 text-sm font-semibold">Amount</th>
              <th className="text-left py-2 px-2 text-sm font-semibold">Description</th>
              <th className="text-right py-2 px-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-2 text-muted-foreground">No transactions found.</td>
              </tr>
            ) : (
              sortedTransactions.map(tx => (
                <tr key={tx.id} className="border-b last:border-b-0">
                  <td className="py-1 px-2 text-sm">{tx.date ? tx.date.split("T")[0] : ""}</td>
                  <td className="py-1 px-2 text-sm">{getCategoryTitle(categories, tx.category)}</td>
                  <td className="py-1 px-2 text-sm">{getAccountName(tx.account)}</td>
                  <td className="py-1 px-2 text-sm">${parseFloat(tx.amount).toFixed(2)}</td>
                  <td className="py-1 px-2 text-sm">{tx.description}</td>
                  <td className="py-1 px-2 text-sm text-right">
                    <div className="inline-flex gap-2">
                      <Button className="bg-slate-100 text-slate-800 hover:bg-slate-200" onClick={() => { setEditing(tx); setEditingOpen(true) }}>
                        Edit
                      </Button>
                      <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => { setDeleting(tx); setDeletingOpen(true) }}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <EditTransactionModal
        open={editingOpen}
        onOpenChange={setEditingOpen}
        transaction={editing}
        categories={categories}
        accounts={accounts}
        onSuccess={fetchAll}
      />
      <DeleteConfirm
        open={deletingOpen}
        onOpenChange={setDeletingOpen}
        title="Delete Transaction"
        message={`Delete transaction "${deleting?.description ?? deleting?.id}"?`}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />

      <AddButtons />
    </div>
  )
}