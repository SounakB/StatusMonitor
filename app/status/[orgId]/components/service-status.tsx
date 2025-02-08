import type { Service } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

type ServiceStatusProps = {
  services: Service[]
}

export function ServiceStatus({ services }: ServiceStatusProps) {
  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <div key={service.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <span className="font-medium">{service.name}</span>
          <Badge variant={service.status === "operational" ? "success" : "destructive"}>{service.status}</Badge>
        </div>
      ))}
    </div>
  )
}

