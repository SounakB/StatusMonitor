import type { Incident } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

type IncidentListProps = {
  incidents: Incident[]
}

export function IncidentList({ incidents }: IncidentListProps) {
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div key={incident.id} className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">{incident.title}</h3>
            <Badge variant={incident.status === "resolved" ? "success" : "destructive"}>{incident.status}</Badge>
          </div>
          <p className="text-gray-600">{incident.description}</p>
          <p className="text-sm text-gray-500 mt-2">{new Date(incident.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

