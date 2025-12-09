// file: project/components/AddAccountModal.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Component for adding a new account.

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

const ACCOUNT_TYPES = [
  { value: "bank", label: "Bank Account" },
  { value: "debit", label: "Debit Card" },
  { value: "credit", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "venmo", label: "Venmo" },
  { value: "paypal", label: "PayPal" },
  { value: "cashapp", label: "Cash App" },
  { value: "zelle", label: "Zelle" },
  { value: "transfer", label: "Direct Transfer" },
  { value: "other", label: "Other" },
]

/**
 * AddAccountModal
 * Simple form to create an account object. Calls onSuccess() after creation.
 */
export function AddAccountModal({ open, onOpenChange, onSuccess }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
}) {
  const [form, setForm] = useState({ name: "", type: ACCOUNT_TYPES[0].value })
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
    const res = await fetch("http://127.0.0.1:8000/project/api/accounts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: "", type: ACCOUNT_TYPES[0].value })
      setLoading(false)
      onOpenChange(false)
      onSuccess()
    } else {
      const data = await res.json()
      setError(data.detail || "Failed to add account.")
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Account</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Account Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <select
            className="bg-input text-foreground w-full rounded-md border px-3 py-2"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            required
          >
            {ACCOUNT_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {error && <Alert variant="destructive">{error}</Alert>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            {loading ? "Adding..." : "Add Account"}
          </Button>
        </form>
        <SheetClose asChild>
          <Button variant="outline" className="mt-4 w-full">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}