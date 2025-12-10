"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { useDashboardData } from "@/hooks/DashboardDataContext"

/**
 * Register page
 * - POST to backend /project/api/register/
 * - On success stores access token, dispatches 'login', calls fetchAll and routes to "/"
 */
export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { fetchAll } = useDashboardData()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    const res = await fetch("http://127.0.0.1:8000/project/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json().catch(() => ({ detail: "Invalid response" }))
    if (res.ok && data.access) {
      localStorage.setItem("access", data.access)
      window.dispatchEvent(new Event("login"))
      try {
        fetchAll()
      } catch {}
      router.push("/")
    } else {
      setError(data.detail || "Registration failed.")
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-6 bg-card text-card-foreground">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister}>
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
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="bg-input text-foreground"
            />
            {error && <Alert variant="destructive">{error}</Alert>}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register & Sign In"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}