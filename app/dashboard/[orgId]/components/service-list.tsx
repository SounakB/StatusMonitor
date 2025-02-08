import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Service = {
  id: string
  name: string
  description: string
  status: string
}

type ServiceListProps = {
  services: Service[]
}

export function ServiceList({ services }: ServiceListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                <Badge variant={service.status === "operational" ? "success" : "destructive"}>{service.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

