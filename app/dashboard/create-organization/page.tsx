"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { createOrganization } from "@/lib/api-client"

export default function CreateOrganizationPage() {
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const org = await createOrganization(name)
      router.push(`/dashboard/${org.id}`)
    } catch (error) {
      console.error("Error creating organization:", error)
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create New Organization</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Organization Name</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Organization
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

