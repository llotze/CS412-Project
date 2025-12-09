// file: project/components/AddTransactionModal.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Component for adding a new transaction.

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Account, Category } from "../types"

type AddTransactionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  accounts: Account[] 
  onSuccess: () => void
}

export function AddTransactionModal({
  open,
  onOpenChange,
  categories,
  accounts,
  onSuccess
}: AddTransactionModalProps) {
  const [form, setForm] = useState({ amount: "", category: "", account: "", description: "", date: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    // Ensure date is a valid ISO datetime string
    const payload = {
      ...form,
      date: form.date ? form.date + "T00:00:00" : "",
    }
    const res = await fetch("http://127.0.0.1:8000/project/api/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setForm({ amount: "", category: "", account: "", description: "", date: "" })
      setLoading(false)
      onOpenChange(false)
      onSuccess()
    } else {
      const data = await res.json()
      setError(data.detail || "Failed to add transaction.")
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
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
                {acc.name} ({acc.type.charAt(0).toUpperCase() + acc.type.slice(1)})
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
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
        <SheetClose asChild>
          <Button variant="outline" className="mt-4 w-full">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}