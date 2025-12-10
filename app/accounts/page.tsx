// file: project/app/accounts/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of accounts.

"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { AddButtons } from "@/components/AddButtons"
import { DeleteConfirm } from "@/components/DeleteConfirm"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"

/**
 * AccountsPage
 * - Lists accounts with type.
 * - Allows deleting an account (Edit removed intentionally).
 * - Calls fetchAll() after delete to refresh shared state.
 */
export default function AccountsPage() {
  const { accounts, fetchAll } = useDashboardData()
  const [deleting, setDeleting] = useState<any>(null)
  const [deletingOpen, setDeletingOpen] = useState(false)

  /**
   * handleDelete
   * - Sends DELETE to account detail endpoint.
   * - On success, triggers fetchAll to refresh context state.
   */
  async function handleDelete(id: number|string) {
    const token = localStorage.getItem("access")
    if (!token) return
    await fetch(`${API_BASE}/project/api/account/${id}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    // refresh the provider data
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Accounts</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left w-1/3 py-2 px-2 text-sm font-semibold">Name</th>
              <th className="text-left w-1/3 py-2 px-2 text-sm font-semibold">Type</th>
              <th className="text-right w-1/3 py-2 px-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-2 text-muted-foreground">No accounts found.</td>
              </tr>
            ) : (
              accounts.map(acc => (
                <tr key={acc.id} className="border-b last:border-b-0">
                  <td className="py-1 px-2 text-sm">{acc.name}</td>
                  <td className="py-1 px-2 text-sm">{acc.type}</td>
                  <td className="py-1 px-2 text-sm text-right">
                    <div className="inline-flex gap-2">
                      {/* Delete only — modern neutral styles applied */}
                      <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => { setDeleting(acc); setDeletingOpen(true) }}>
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

      {/* Reusable centered confirmation modal */}
      <DeleteConfirm
        open={deletingOpen}
        onOpenChange={setDeletingOpen}
        title="Delete Account"
        message={`Delete account "${deleting?.name}"? This cannot be undone.`}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />

      <AddButtons />
    </div>
  )
}