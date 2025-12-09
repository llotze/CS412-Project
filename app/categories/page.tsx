// file: project/app/categories/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/09/2025
// Description: Screen for displaying the list of categories.

"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { AddButtons } from "@/components/AddButtons"
import { EditCategoryModal } from "@/components/EditCategoryModal"
import { DeleteConfirm } from "@/components/DeleteConfirm"
import { Button } from "@/components/ui/button"

/**
 * CategoriesPage
 * - Lists categories with edit/delete actions.
 * - Edits open a modal that PATCHes the title; delete uses DeleteConfirm.
 */
export default function CategoriesPage() {
  const { categories, fetchAll } = useDashboardData()
  const [editing, setEditing] = useState<any>(null)
  const [editingOpen, setEditingOpen] = useState(false)
  const [deleting, setDeleting] = useState<any>(null)
  const [deletingOpen, setDeletingOpen] = useState(false)

  async function handleDelete(id: number|string) {
    const token = localStorage.getItem("access"); if (!token) return
    await fetch(`http://127.0.0.1:8000/project/api/category/${id}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <Card className="bg-card text-card-foreground p-3 shadow-sm">
        <Table>
          <thead>
            <tr>
              <th className="text-left py-2 px-2 text-sm font-semibold">Title</th>
              <th className="text-right py-2 px-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-2 text-muted-foreground">No categories found.</td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="border-b last:border-b-0">
                  <td className="py-1 px-2 text-sm">{cat.title}</td>
                  <td className="py-1 px-2 text-sm text-right">
                    <div className="inline-flex gap-2">
                      <Button className="bg-slate-100 text-slate-800 hover:bg-slate-200" onClick={() => { setEditing(cat); setEditingOpen(true) }}>
                        Edit
                      </Button>
                      <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => { setDeleting(cat); setDeletingOpen(true) }}>
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

      <EditCategoryModal
        open={editingOpen}
        onOpenChange={setEditingOpen}
        category={editing}
        onSuccess={fetchAll}
      />
      <DeleteConfirm
        open={deletingOpen}
        onOpenChange={setDeletingOpen}
        title="Delete Category"
        message={`Delete category "${deleting?.title}"?`}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />

      <AddButtons />
    </div>
  )
}