// file: project/components/AddCategoryModal.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Component for adding a new category.

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

/**
 * AddCategoryModal
 * Simple title form; on success calls onSuccess() to refresh data.
 */
export function AddCategoryModal({ open, onOpenChange, onSuccess }: {
  open: boolean,
  onOpenChange: (v: boolean) => void,
  onSuccess: () => void
}) {
  const [form, setForm] = useState({ title: "" })
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
    const res = await fetch("http://127.0.0.1:8000/project/api/categories/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: "" })
      setLoading(false)
      onOpenChange(false)
      onSuccess()
    } else {
      const data = await res.json()
      setError(data.detail || "Failed to add category.")
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Category</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          {error && <Alert variant="destructive">{error}</Alert>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
        <SheetClose asChild>
          <Button variant="outline" className="mt-4 w-full">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}