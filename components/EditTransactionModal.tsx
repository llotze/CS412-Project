// file: project/components/EditTransactionModal.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/09/2025
// Description: Component for editing an existing transaction.

"use client"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Account, Category } from "../types"
import { API_BASE } from "@/lib/api"

/**
 * EditTransactionModal
 * Populate form from `transaction` prop and PATCH on submit.
 * Calls onSuccess() to refresh shared data on success.
 */
export function EditTransactionModal({
  open,
  onOpenChange,
  transaction,
  categories,
  accounts,
  onSuccess
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  transaction: { id: number|string, amount: string, category: number|string, account: number|string, description: string, date: string } | null
  categories: Category[]
  accounts: Account[]
  onSuccess: () => void
}) {
  const [form, setForm] = useState({ amount: "", category: "", account: "", description: "", date: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: String(transaction.amount ?? ""),
        category: String(transaction.category ?? ""),
        account: String(transaction.account ?? ""),
        description: transaction.description ?? "",
        date: transaction.date ? transaction.date.split("T")[0] : ""
      })
    }
  }, [transaction])

  if (!transaction) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const token = localStorage.getItem("access")
    if (!token) {
      setError("You must be logged in.")
      setLoading(false)
      return
    }
    const payload = {
      ...form,
      date: form.date ? form.date + "T00:00:00" : "",
    }
    const res = await fetch(`${API_BASE}/project/api/transaction/${transaction.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setLoading(false)
      onOpenChange(false)
      onSuccess()
    } else {
      const data = await res.json().catch(()=>({detail:"Failed"}))
      setError(data.detail || "Failed to update transaction.")
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            required
          />
          <select
            className="bg-input text-foreground w-full rounded-md border px-3 py-2"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
          <select
            className="bg-input text-foreground w-full rounded-md border px-3 py-2"
            value={form.account}
            onChange={e => setForm(f => ({ ...f, account: e.target.value }))}
            required
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <Input
            type="date"
            placeholder="Date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            required
          />
          {error && <Alert variant="destructive">{error}</Alert>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
        <SheetClose asChild>
          <Button variant="outline" className="mt-4 w-full">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}