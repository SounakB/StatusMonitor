"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateService } from "@/lib/api-client"

type Service = {
  id: string
  name: string
  description: string
  status: string
}

type EditServiceFormProps = {
  service: Service
  orgId: string
  onUpdate: (updatedService: Service) => void
  onCancel: () => void
}

export function EditServiceForm({ service, orgId, onUpdate, onCancel }: EditServiceFormProps) {
  const [name, setName] = useState(service.name)
  const [description, setDescription] = useState(service.description)
  const [status, setStatus] = useState(service.status)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedService = await updateService(orgId, service.id, { name, description, status })
      onUpdate(updatedService)
    } catch (error) {
      console.error("Error updating service:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="outage">Outage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Service</Button>
      </div>
    </form>
  )
}

