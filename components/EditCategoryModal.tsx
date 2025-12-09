// file: project/components/EditCategoryModal.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/09/2025
// Description: Component for editing an existing category.

"use client"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onSuccess
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  category: { id: number|string, title: string } | null
  onSuccess: () => void
}) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(category?.title ?? "")
  }, [category])

  if (!category) return null

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
    const res = await fetch(`http://127.0.0.1:8000/project/api/category/${category.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    })
    if (res.ok) {
      setLoading(false)
      onOpenChange(false)
      onSuccess()
    } else {
      const data = await res.json().catch(()=>({detail:"Failed"}))
      setError(data.detail || "Failed to update category.")
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
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