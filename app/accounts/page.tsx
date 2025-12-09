// file: project/app/accounts/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of accounts.

"use client"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { AddButtons } from "@/components/AddButtons"

export default function AccountsPage() {
  const { accounts } = useDashboardData()

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Accounts</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left w-1/2 py-2 px-2 text-sm font-semibold">Name</th>
              <th className="text-left w-1/2 py-2 px-2 text-sm font-semibold">Type</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-2 text-muted-foreground">No accounts found.</td>
              </tr>
            ) : (
              accounts.map(acc => (
                <tr key={acc.id} className="border-b last:border-b-0">
                  <td className="text-left w-1/2 py-1 px-2 text-sm">{acc.name}</td>
                  <td className="text-left w-1/2 py-1 px-2 text-sm">{acc.type}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
      <AddButtons />
    </div>
  )
}