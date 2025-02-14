import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditIncidentForm } from "./edit-incident-form"

type Service = {
  id: string
  name: string
  status: string
}

type IncidentMessage = {
  id: string
  content: string
  status: string
  createdAt: string
}

type Incident = {
  id: string
  title: string
  status: string
  createdAt: string
  services: {
    service: Service
    status: string
  }[]
  messages: IncidentMessage[]
}

type IncidentListProps = {
  incidents: Incident[]
  orgId: string
  allServices: { id: string; name: string }[]
}

export function IncidentList({ incidents, orgId }: IncidentListProps) {
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)

  const handleUpdate = (updatedIncident: Incident) => {
    // Update the incident in the list
    const updatedIncidents = incidents.map((incident) =>
      incident.id === updatedIncident.id ? updatedIncident : incident,
    )
    // You might want to update the parent component's state here
    setEditingIncident(null)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Affected Services</TableHead>
            <TableHead>Latest Update</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>{incident.title}</TableCell>
              <TableCell>
                <Badge variant={incident.status === "resolved" ? "success" : "destructive"}>{incident.status}</Badge>
              </TableCell>
              <TableCell>
                {incident.services.map((service) => (
                  <div key={service.service.id} className="flex items-center space-x-2 mb-1">
                    <span>{service.service.name}:</span>
                    <Badge variant={service.status === "operational" ? "success" : "destructive"}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {incident.messages.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">{new Date(incident.messages[0].createdAt).toLocaleString()}</p>
                    <p className="truncate">{incident.messages[0].content}</p>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => onIncidentSelect(incident)}>View Timeline</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <EditIncidentForm
              incident={editingIncident}
              orgId={orgId}
              onUpdate={handleUpdate}
              onCancel={() => setEditingIncident(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

