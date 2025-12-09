"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ClientNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem("access"))
    check()

    const onStorage = () => check() 
    const onLogin = () => setIsLoggedIn(true) 
    const onLogout = () => setIsLoggedIn(false) 

    window.addEventListener("storage", onStorage)
    window.addEventListener("login", onLogin)
    window.addEventListener("logout", onLogout)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("login", onLogin)
      window.removeEventListener("logout", onLogout)
    }
  }, [])

  if (!isLoggedIn) return null

  return (
    <nav className="flex items-center justify-between mb-6">
      <div className="flex gap-4">
        <Link href="/"><Button variant="ghost">Overview</Button></Link>
        <Link href="/accounts"><Button variant="ghost">Accounts</Button></Link>
        <Link href="/goals"><Button variant="ghost">Goals</Button></Link>
        <Link href="/transactions"><Button variant="ghost">Transactions</Button></Link>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          localStorage.removeItem("access")
          window.dispatchEvent(new Event("logout"))
          window.location.href = "/login"
        }}
      >
        Logout
      </Button>
    </nav>
  )
}