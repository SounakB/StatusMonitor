"use client"

import { useEffect, useState } from "react"
import { getIncidents } from "@/lib/api-client"
import { IncidentList } from "./components/incident-list"
import { Button } from "@/components/ui/button"
import { CreateIncidentForm } from "./components/create-incident-form"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([])
  const [isCreatingIncident, setIsCreatingIncident] = useState(false)

  useEffect(() => {
    const fetchIncidents = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        const fetchedIncidents = await getIncidents(token)
        setIncidents(fetchedIncidents)
      }
    }
    fetchIncidents()
  }, [])

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
          onIncidentCreated={(newIncident) => {
            setIncidents([newIncident, ...incidents])
            setIsCreatingIncident(false)
          }}
        />
      )}
      <IncidentList incidents={incidents} />
    </div>
  )
}

