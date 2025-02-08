import { getTeamMembers } from "@/lib/api-client"
import { TeamManagement } from "./components/team-management"

export default async function TeamPage({ params }: { params: { orgId: string } }) {
  const teamMembers = await getTeamMembers(params.orgId)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Team Management</h1>
      <TeamManagement orgId={params.orgId} initialTeamMembers={teamMembers} />
    </div>
  )
}

