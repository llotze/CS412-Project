// file: project/components/DeleteConfirm.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/09/2025
// Description: Component for displaying delete confirmation.

"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function DeleteConfirm({
  open,
  onOpenChange,
  title = "Confirm Delete",
  message = "Are you sure?",
  onConfirm
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title?: string
  message?: string
  onConfirm: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Center inner content by making SheetContent a flex container and constrain the inner panel width */}
      <SheetContent className="flex items-center justify-center">
        <div className="w-full max-w-md bg-transparent">
          <SheetHeader>
            <SheetTitle className="text-center">{title}</SheetTitle>
          </SheetHeader>
          <div className="py-4 text-center">
            <p className="mb-6">{message}</p>
            <div className="flex justify-center gap-3">
              <Button
                className="bg-rose-600 text-white hover:bg-rose-700"
                onClick={() => {
                  onConfirm()
                  onOpenChange(false)
                }}
              >
                Delete
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}