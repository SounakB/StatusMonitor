"use client"

import { useState } from "react"
import { createService } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useOrganization } from "@/app/dashboard/context/organization-context"

type AddServiceFormProps = {
  onServiceAdded: (service: any) => void,
  orgId: string
}

export function AddServiceForm({ onServiceAdded, orgId }: AddServiceFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("operational")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        const newService = await createService(orgId,{ name, description, status })
        onServiceAdded(newService)
    } catch (error) {
      console.error("Error adding service:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="outage">Outage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Service</Button>
    </form>
  )
}

