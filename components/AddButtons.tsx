// file: project/components/AddButtons.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Component for adding buttons to add new items.

"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddTransactionModal } from "@/components/AddTransactionModal"
import { AddCategoryModal } from "@/components/AddCategoryModal"
import { AddGoalModal } from "@/components/AddGoalModal"
import { AddAccountModal } from "@/components/AddAccountModal"
import { useDashboardData } from "@/hooks/DashboardDataContext"

export function AddButtons() {
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  const { categories, accounts, fetchAll } = useDashboardData()

  const handleSuccess = () => {
    fetchAll()
  }

  return (
    <>
      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          className="bg-primary text-primary-foreground"
          onClick={() => setShowAccountModal(true)}
        >
          Add Account
        </Button>
        <Button
          variant="outline"
          className="bg-primary text-primary-foreground"
          onClick={() => setShowCategoryModal(true)}
        >
          Add Category
        </Button>
        <Button
          variant="outline"
          className="bg-primary text-primary-foreground"
          onClick={() => setShowGoalModal(true)}
        >
          Add Goal
        </Button>
        <Button
          variant="outline"
          className="bg-primary text-primary-foreground"
          onClick={() => setShowTransactionModal(true)}
        >
          Add Transaction
        </Button>
      </div>
      <AddTransactionModal
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
        categories={categories}
        accounts={accounts}
        onSuccess={handleSuccess}
      />
      <AddCategoryModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        onSuccess={handleSuccess}
      />
      <AddGoalModal
        open={showGoalModal}
        onOpenChange={setShowGoalModal}
        categories={categories}
        onSuccess={handleSuccess}
      />
      <AddAccountModal
        open={showAccountModal}
        onOpenChange={setShowAccountModal}
        onSuccess={handleSuccess}
      />
    </>
  )
}