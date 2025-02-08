import { getInvitation } from "@/lib/api-client"
import { InvitationAcceptance } from "./components/invitation-acceptance"

export default async function InvitationPage({ params }: { params: { invitationId: string } }) {
  const invitation = await getInvitation(params.invitationId)

  return <InvitationAcceptance invitation={invitation} />
}

