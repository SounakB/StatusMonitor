"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getIncidents, initializeSocket, joinOrganization, leaveOrganization } from "@/lib/api-client"
import { IncidentList } from "./components/incident-list"
import { Button } from "@/components/ui/button"
import { CreateIncidentForm } from "./components/create-incident-form"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([])
  const [isCreatingIncident, setIsCreatingIncident] = useState(false)
  const params = useParams()
  const orgId = params?.orgId as string

  useEffect(() => {
    const fetchIncidents = async () => {
      const fetchedIncidents = await getIncidents(orgId)
      setIncidents(fetchedIncidents)
    }

    fetchIncidents()

    const socket = initializeSocket()
    joinOrganization(orgId)

    socket.on("incidentCreated", (newIncident) => {
      setIncidents((prevIncidents) => [newIncident, ...prevIncidents])
    })

    return () => {
      leaveOrganization(orgId)
      socket.off("incidentCreated")
    }
  }, [orgId])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <Button onClick={() => setIsCreatingIncident(!isCreatingIncident)}>
          {isCreatingIncident ? "Cancel" : "Create Incident"}
        </Button>
      </div>
      {isCreatingIncident && (
        <CreateIncidentForm
          orgId={orgId}
          onIncidentCreated={(newIncident) => {
            setIncidents([newIncident, ...incidents])
            setIsCreatingIncident(false)
          }}
        />
      )}
      <IncidentList incidents={incidents} orgId={orgId} onIncidentSelect={() => null}/>
    </div>
  )
}

