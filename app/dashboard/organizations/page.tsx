"use client"

import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { getOrganizations, createOrganization } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function OrganizationsPage() {
  const { user, isLoading } = useUser()
  const [organizations, setOrganizations] = useState([])
  const [newOrgName, setNewOrgName] = useState("")

  useEffect(() => {
    if (user) {
      fetchOrganizations()
    }
  }, [user])

  const fetchOrganizations = async () => {
    try {
      const orgs = await getOrganizations()
      setOrganizations(orgs)
    } catch (error) {
      console.error("Error fetching organizations:", error)
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createOrganization(newOrgName)
      setNewOrgName("")
      fetchOrganizations()
    } catch (error) {
      console.error("Error creating organization:", error)
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (!user) {
    return <div>Please log in to view your organizations.</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Organizations</h1>
      <div className="grid gap-4 mb-4">
        {organizations.map((org: any) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href={`/dashboard/${org.id}`}>Manage</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrganization} className="flex gap-2">
            <Input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Organization Name"
              required
            />
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

