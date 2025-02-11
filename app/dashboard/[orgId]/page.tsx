"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getServices, getIncidents, initializeSocket, joinOrganization, leaveOrganization } from "@/lib/api-client"
import { ServiceList } from "./services/components/service-list"
import { IncidentList } from "./incidents/components/incident-list"

export default function DashboardPage() {
  const [services, setServices] = useState([])
  const [incidents, setIncidents] = useState([])
  const params = useParams()
  const orgId = params.orgId as string

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedServices, fetchedIncidents] = await Promise.all([getServices(orgId), getIncidents(orgId)])
      setServices(fetchedServices)
      setIncidents(fetchedIncidents)
    }

    fetchData()

    const socket = initializeSocket()
    joinOrganization(orgId)

    socket.on("serviceCreated", (newService) => {
      setServices((prevServices) => [...prevServices, newService])
    })

    socket.on("incidentCreated", (newIncident) => {
      setIncidents((prevIncidents) => [...prevIncidents, newIncident])
    })

    return () => {
      leaveOrganization(orgId)
      socket.off("serviceCreated")
      socket.off("incidentCreated")
    }
  }, [orgId])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <ServiceList orgId={orgId} services={services} />
      <IncidentList incidents={incidents} orgId={orgId} />
    </div>
  )
}

