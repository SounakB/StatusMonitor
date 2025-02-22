import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditServiceForm } from "./edit-service-form"

type Service = {
  id: string
  name: string
  description: string
  status: string
}

type ServiceListProps = {
  services: Service[]
  orgId: string
}

export function ServiceList({ services, orgId }: ServiceListProps) {
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleUpdate = (updatedService: Service) => {
    // Update the service in the list
    const updatedServices = services.map((service) => (service.id === updatedService.id ? updatedService : service))
    // You might want to update the parent component's state here
    setEditingService(null)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <Button onClick={() => setEditingService(service)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg">
            <EditServiceForm
              service={editingService}
              orgId={orgId}
              onUpdate={handleUpdate}
              onCancel={() => setEditingService(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

