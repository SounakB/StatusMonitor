"use client"

import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { inviteTeamMember } from "@/lib/api-client"

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
}

type TeamManagementProps = {
  orgId: string
  initialTeamMembers: TeamMember[]
}

export function TeamManagement({ orgId, initialTeamMembers }: TeamManagementProps) {
  const { user, isLoading } = useUser()
  const [email, setEmail] = useState("")
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await inviteTeamMember(orgId, email)
      setEmail("")
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      })
    } catch (error) {
      console.error("Error inviting team member:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (!user) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <Button type="submit">Send Invite</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

