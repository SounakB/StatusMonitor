"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { acceptInvitation } from "@/lib/api-client"

type Invitation = {
  id: string
  organization: {
    name: string
  }
}

type InvitationAcceptanceProps = {
  invitation: Invitation
}

export function InvitationAcceptance({ invitation }: InvitationAcceptanceProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)

  const handleAcceptInvitation = async () => {
    setIsAccepting(true)
    try {
      await acceptInvitation(invitation.id)
      toast({
        title: "Success",
        description: "Invitation accepted successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error accepting invitation:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to accept invitation",
        variant: "destructive",
      })
    } finally {
      setIsAccepting(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (!user) {
    return <div>Please log in to accept the invitation.</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Invitation to Join Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You've been invited to join {invitation.organization.name} on Status Page App.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAcceptInvitation} className="w-full" disabled={isAccepting}>
            {isAccepting ? "Accepting..." : "Accept Invitation"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

