"use client"

import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user, isLoading } = useUser()

  console.log("user", user);

  if (isLoading) return <div>Loading...</div>

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Status Page App</h1>
      <div className="flex space-x-4">
        {user ? (
          <>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
            <Link href="/api/auth/logout">
              <Button variant="outline">Logout</Button>
            </Link>
          </>
        ) : (
          <Link href="/api/auth/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </main>
  )
}

