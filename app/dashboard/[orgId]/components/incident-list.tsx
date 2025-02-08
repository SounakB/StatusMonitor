import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Incident = {
  id: string
  title: string
  status: string
  createdAt: string
}

type IncidentListProps = {
  incidents: Incident[]
}

export function IncidentList({ incidents }: IncidentListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell>{new Date(incident.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

