// file: project/app/transactions/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/04/2025
// Description: Screen for displaying the list of transactions.

"use client"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { getCategoryTitle } from "@/lib/utils"
import { AddButtons } from "@/components/AddButtons"

export default function TransactionsPage() {
  const { transactions, categories, accounts } = useDashboardData()

  // Get account name by id
  function getAccountName(id: number | string) {
    const acc = accounts.find(a => a.id === id)
    return acc ? acc.name : id
  }

  // Sort transactions by date descending
  const sortedTransactions = transactions.slice().sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Transactions</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Date</th>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Category</th>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Account</th>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Amount</th>
              <th className="text-left w-1/5 py-2 px-2 text-sm font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-2 text-muted-foreground">No transactions found.</td>
              </tr>
            ) : (
              sortedTransactions.map(tx => (
                <tr key={tx.id} className="border-b last:border-b-0">
                  <td className="text-left w-1/5 py-1 px-2 text-sm">
                    {tx.date ? tx.date.split("T")[0] : ""}
                  </td>
                  <td className="text-left w-1/5 py-1 px-2 text-sm">
                    {getCategoryTitle(categories, tx.category)}
                  </td>
                  <td className="text-left w-1/5 py-1 px-2 text-sm">
                    {getAccountName(tx.account)}
                  </td>
                  <td className="text-left w-1/5 py-1 px-2 text-sm">${parseFloat(tx.amount).toFixed(2)}</td>
                  <td className="text-left w-1/5 py-1 px-2 text-sm">{tx.description}</td>
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