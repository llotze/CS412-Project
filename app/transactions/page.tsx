// file: project/app/transactions/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of transactions.
"use client"
import { useEffect, useState } from "react"    // added useEffect
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { getCategoryTitle } from "@/lib/utils"
import { AddButtons } from "@/components/AddButtons"
import { EditTransactionModal } from "@/components/EditTransactionModal"
import { DeleteConfirm } from "@/components/DeleteConfirm"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"

/**
 * TransactionsPage
 * Show recent transactions, allow edit/delete via modals.
 * category filter 
 */
export default function TransactionsPage() {
  const { transactions, categories, accounts, fetchAll, fetchTransactions } = useDashboardData()
  const [editing, setEditing] = useState<any>(null)
  const [editingOpen, setEditingOpen] = useState(false)
  const [deleting, setDeleting] = useState<any>(null)
  const [deletingOpen, setDeletingOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // request server-side filtered transactions when category changes 
  useEffect(() => {
    // pass empty string/null to fetch all
    const cat = selectedCategory || undefined
    fetchTransactions ? fetchTransactions(cat) : fetchAll()
  }, [selectedCategory, fetchTransactions, fetchAll])

  // keep sorting in UI consistent
  const sortedTransactions = (transactions || []).slice().sort((a, b) => {
    if (!a?.date) return 1
    if (!b?.date) return -1
    return b.date.localeCompare(a.date)
  })

  async function handleDelete(id: number|string) {
    const token = localStorage.getItem("access"); if (!token) return
    await fetch(`${API_BASE}/project/api/transaction/${id}/`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } })
    // refresh full listing after delete
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Transactions</h1>

      <Card className="bg-card text-card-foreground p-3 shadow-sm mb-4">
        {/* Category filter control */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Filter by category:</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-input text-foreground rounded-md border px-3 py-1"
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>{cat.title}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => { setSelectedCategory("") }}>Clear</Button>
        </div>
      </Card>

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
              <tr><td colSpan={6} className="text-center py-2 text-muted-foreground">No transactions found.</td></tr>
            ) : (
              sortedTransactions.map(tx => (
                <tr key={tx.id} className="border-b last:border-b-0">
                  <td className="py-1 px-2 text-sm">{tx.date ? tx.date.split("T")[0] : ""}</td>
                  <td className="py-1 px-2 text-sm">{getCategoryTitle(categories, tx.category)}</td>
                  <td className="py-1 px-2 text-sm">{accounts.find(a=>a.id===tx.account)?.name ?? tx.account}</td>
                  <td className="py-1 px-2 text-sm">${parseFloat(tx.amount).toFixed(2)}</td>
                  <td className="py-1 px-2 text-sm">{tx.description}</td>
                  <td className="py-1 px-2 text-sm text-right">
                    <div className="inline-flex gap-2">
                      <Button className="bg-slate-100 text-slate-800 hover:bg-slate-200" onClick={() => { setEditing(tx); setEditingOpen(true) }}>Edit</Button>
                      <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => { setDeleting(tx); setDeletingOpen(true) }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <EditTransactionModal open={editingOpen} onOpenChange={setEditingOpen} transaction={editing} categories={categories} accounts={accounts} onSuccess={fetchAll} />
      <DeleteConfirm open={deletingOpen} onOpenChange={setDeletingOpen} title="Delete Transaction" message={`Delete transaction "${deleting?.description ?? deleting?.id}"?`} onConfirm={() => deleting && handleDelete(deleting.id)} />

      <AddButtons />
    </div>
  )
}