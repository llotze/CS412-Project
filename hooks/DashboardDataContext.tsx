// file: project/hooks/DashboardDataContext.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Context provider for dashboard data (accounts, categories, goals, transactions).

"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Account, Category, Goal, Transaction } from "../types"

type DashboardDataContextType = {
  accounts: Account[]
  categories: Category[]
  goals: Goal[]
  transactions: Transaction[]
  fetchAll: () => void
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined)

/**
 * DashboardDataProvider
 * Provide shared dashboard state and a fetchAll() helper to reload data from the API.
 * - Automatically fetches once on mount.
 * - Consumers call fetchAll() after mutations (add/edit/delete).
 */
export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const router = useRouter()

  /**
   * fetchAll
   * Fetch arrays from API endpoints and update local state.
   * If no token or 401 returned, redirect to login.
   */
  function fetchAll() {
    const token = localStorage.getItem("access")
    if (!token) {
      router.push("/login")
      return
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }

    function fetchArray(url: string, setter: (data: any[]) => void) {
      fetch(url, { headers })
        .then(res => {
          if (res.status === 401) {
            localStorage.removeItem("access")
            router.push("/login")
            return Promise.reject("Unauthorized")
          }
          return res.json()
        })
        .then(data => setter(data.results ?? []))
        .catch(() => setter([]))
    }

    fetchArray("http://127.0.0.1:8000/project/api/accounts/", setAccounts)
    fetchArray("http://127.0.0.1:8000/project/api/categories/", setCategories)
    fetchArray("http://127.0.0.1:8000/project/api/goals/", setGoals)
    fetchArray("http://127.0.0.1:8000/project/api/transactions/?limit=5", setTransactions)
  }

  useEffect(() => {
    fetchAll()
    /**
     * Listen for cross-tab 'storage' and same-tab 'login' events so provider
     * refreshes immediately when user logs in/out.
     */
    const onStorage = () => {
      if (localStorage.getItem("access")) fetchAll()
    }
    const onLogin = () => fetchAll()

    window.addEventListener("storage", onStorage)
    window.addEventListener("login", onLogin)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("login", onLogin)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <DashboardDataContext.Provider value={{
      accounts, categories, goals, transactions, fetchAll
    }}>
      {children}
    </DashboardDataContext.Provider>
  )
}

/**
 * useDashboardData
 * Hook to consume dashboard context. Throws if used outside provider.
 */
export function useDashboardData() {
  const ctx = useContext(DashboardDataContext)
  if (!ctx) throw new Error("useDashboardData must be used within DashboardDataProvider")
  return ctx
}