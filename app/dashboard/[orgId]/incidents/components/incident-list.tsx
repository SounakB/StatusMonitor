import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditIncidentForm } from "./edit-incident-form"

type Incident = {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  services: { id: string; name: string }[]
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
            <TableHead>Created At</TableHead>
            <TableHead>Last Updated At</TableHead>
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
              <TableCell>{new Date(incident.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(incident.updatedAt).toLocaleString()}</TableCell>

              <TableCell>
                <Button onClick={() => setEditingIncident(incident)}>Edit</Button>
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

