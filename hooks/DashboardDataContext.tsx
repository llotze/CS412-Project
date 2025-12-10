// file: project/hooks/DashboardDataContext.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Context provider for dashboard data (accounts, categories, goals, transactions).

"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Account, Category, Goal, Transaction } from "../types"
import { API_BASE } from "@/lib/api"

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
  const [transactions, setTransactions] = useState<any[]>([])
  const router = useRouter()

  /**
   * fetchAll
   * Fetch arrays from API endpoints and update local state.
   * If no token or 401 returned, redirect to login.
   */
  async function fetchAll() {
    const token = localStorage.getItem("access")
    if (!token) {
      router.push("/login")
      return
    }
    const headers = { "Authorization": `Bearer ${token}` }

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

    fetchArray(`${API_BASE}/project/api/accounts/`, setAccounts)
    fetchArray(`${API_BASE}/project/api/categories/`, setCategories)
    fetchArray(`${API_BASE}/project/api/goals/`, setGoals)
    fetchArray(`${API_BASE}/project/api/transactions/?limit=5`, setTransactions)
  }

  // fetch transactions from backend with optional category filter
  async function fetchTransactions(categoryId?: string | number | null) {
    const token = localStorage.getItem("access")
    if (!token) return
    const headers = { "Authorization": `Bearer ${token}` }
    let url = `${API_BASE}/project/api/transactions/`
    if (categoryId !== undefined && categoryId !== null && String(categoryId).length > 0) {
      url += `?category=${encodeURIComponent(String(categoryId))}`
    }
    const res = await fetch(url, { headers })
    if (!res.ok) {
      return
    }
    const data = await res.json().catch(() => null)
    if (!data) return
    // normalize paginated and non-paginated responses to aray
    const txs = Array.isArray(data) ? data : (data.results ?? data)
    setTransactions(txs)
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

  const value = {
    accounts,
    categories,
    goals,
    transactions,
    fetchAll,
    fetchTransactions,
  }

  return (
    <DashboardDataContext.Provider value={value}>
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