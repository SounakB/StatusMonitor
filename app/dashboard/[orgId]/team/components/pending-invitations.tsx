"use client"

import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

import { getPendingInvitations, acceptInvitation } from "@/lib/api-client"

type Invitation = {
    id: string
    organization: {
        id: string
        name: string
    }
}

export function PendingInvitations() {
    const { user, isLoading } = useUser()

    const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([])

    useEffect(() => {
        const loadPendingInvitations = async () => {
            try {
                const invitations = await getPendingInvitations()
                setPendingInvitations(invitations)
            } catch (error) {
                console.error("Error loading pending invitations:", error)
                toast({
                    title: "Error",
                    description: "Failed to load pending invitations",
                    variant: "destructive",
                })
            }
        }

        if (user) {
            loadPendingInvitations()
        }
    }, [user])


    const handleAcceptInvitation = async (invitationId: string) => {
        try {
            await acceptInvitation(invitationId)
            setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitationId))
            toast({
                title: "Success",
                description: "Invitation accepted successfully",
            })
        } catch (error) {
            console.error("Error accepting invitation:", error)
            toast({
                title: "Error",
                description: "Failed to accept invitation",
                variant: "destructive",
            })
        }
    }

    return (pendingInvitations.length > 0 && (
        <Card className="w-100">
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingInvitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                                <TableCell>{invitation.organization.name}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleAcceptInvitation(invitation.id)}
                                        size="sm"
                                    >
                                        Accept
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    ))
}
