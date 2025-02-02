"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPublicStatus, initializeSocket, joinOrganization, leaveOrganization } from "@/lib/api-client"
import { ServiceStatus } from "./components/service-status"
import { IncidentList } from "./components/incident-list"

export default function StatusPage() {
  const [organization, setOrganization] = useState(null)
  const params = useParams()
  const orgId = params.orgId as string

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await getPublicStatus(orgId)
      setOrganization(data)
    }

    fetchStatus()

    const socket = initializeSocket()
    joinOrganization(orgId)

    socket.on("serviceCreated", (newService) => {
      setOrganization((prevOrg) => ({
        ...prevOrg,
        services: [...prevOrg.services, newService],
      }))
    })

    socket.on("incidentCreated", (newIncident) => {
      setOrganization((prevOrg) => ({
        ...prevOrg,
        incidents: [newIncident, ...prevOrg.incidents.slice(0, 4)],
      }))
    })

    return () => {
      leaveOrganization(orgId)
      socket.off("serviceCreated")
      socket.off("incidentCreated")
    }
  }, [orgId])

  if (!organization) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{organization.name} Status</h1>
      <ServiceStatus services={organization.services} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Current Incidents</h2>
      <IncidentList incidents={organization.incidents} />
    </div>
  )
}

