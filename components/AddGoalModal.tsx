// file: project/components/AddGoalModal.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Component for adding a new goal.

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Category } from "../types"
import { API_BASE } from "@/lib/api"


/**
 * AddGoalModal
 * Form to create a goal. Requires category, budget_amount, target_amount, deadline.
 */
export function AddGoalModal({ open, onOpenChange, categories, onSuccess }: {
  open: boolean,
  onOpenChange: (v: boolean) => void,
  categories: Category[],
  onSuccess: () => void
}) {
  const [form, setForm] = useState({ category: "", budget_amount: "", target_amount: "", deadline: "" })
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
    const res = await fetch(`${API_BASE}/project/api/goals/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ category: "", budget_amount: "", target_amount: "", deadline: "" })
      setLoading(false)
      onOpenChange(false)
      onSuccess()
    } else {
      const data = await res.json()
      setError(data.detail || "Failed to add goal.")
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Goal</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Input
            type="number"
            placeholder="Budget Amount"
            value={form.budget_amount}
            onChange={e => setForm(f => ({ ...f, budget_amount: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Target Amount"
            value={form.target_amount}
            onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))}
            required
          />
          <Input
            type="date"
            placeholder="Deadline"
            value={form.deadline}
            onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
            required
          />
          {error && <Alert variant="destructive">{error}</Alert>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            {loading ? "Adding..." : "Add Goal"}
          </Button>
        </form>
        <SheetClose asChild>
          <Button variant="outline" className="mt-4 w-full">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}