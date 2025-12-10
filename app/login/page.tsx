// file: project/app/login/page.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/02/2025
// Description: Screen for user login.

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { useDashboardData } from "@/hooks/DashboardDataContext"
import { API_BASE } from "@/lib/api"

/**
 * Login page component.
 * On success: store token, dispatch 'login' event, call fetchAll() and navigate to "/".
 */
export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { fetchAll } = useDashboardData()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch(`${API_BASE}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (res.ok && data.access) {
      localStorage.setItem("access", data.access)
      // notify same-tab listeners and refresh provider
      window.dispatchEvent(new Event("login"))
      try { fetchAll() } catch (e) { /* provider may not be mounted */ }
      router.push("/")
    } else {
      setError(data.detail || "Invalid username or password.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-6 bg-card text-card-foreground">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="bg-input text-foreground"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-input text-foreground"
            />
            <Button type="submit" className="w-full bg-primary text-primary-foreground">
              Login
            </Button>
            <div className="text-center text-sm mt-2">
              <Link href="/register" className="underline text-secondary-foreground">
                Register here
              </Link>
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}
          </div>
        </form>
      </Card>
    </div>
  )
}