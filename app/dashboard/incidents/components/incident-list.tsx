import type { Incident, Service } from "@prisma/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type IncidentWithServices = Incident & { services: Service[] }

type IncidentListProps = {
  incidents: IncidentWithServices[]
}

export function IncidentList({ incidents }: IncidentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Affected Services</TableHead>
          <TableHead>Created At</TableHead>
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
                <Badge key={service.id} variant="outline" className="mr-1">
                  {service.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>{new Date(incident.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

