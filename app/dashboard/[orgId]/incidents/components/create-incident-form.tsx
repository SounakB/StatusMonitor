"use client"

import { useState, useEffect } from "react"
import { createIncident, getServices } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

type Service = {
  id: string
  name: string
  status: string
}

type CreateIncidentFormProps = {
  orgId: string
  onIncidentCreated: (incident: any) => void
}

export function CreateIncidentForm({ orgId, onIncidentCreated }: CreateIncidentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("investigating")
  const [services, setServices] = useState<Service[]>([])
  const [affectedServices, setAffectedServices] = useState<{ [key: string]: { affected: boolean; status: string } }>({})

  useEffect(() => {
    const fetchServices = async () => {
      const fetchedServices = await getServices(orgId)
      setServices(fetchedServices)
      const initialAffectedServices = fetchedServices.reduce((acc, service) => {
        acc[service.id] = { affected: false, status: service.status }
        return acc
      }, {})
      setAffectedServices(initialAffectedServices)
    }
    fetchServices()
  }, [orgId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const affectedServiceData = Object.entries(affectedServices)
        .filter(([_, data]) => data.affected)
        .map(([id, data]) => ({ id, status: data.status }))

      const newIncident = await createIncident(orgId, {
        title,
        description,
        status,
        affectedServices: affectedServiceData,
      })
      onIncidentCreated(newIncident)
      // Reset form
      setTitle("")
      setDescription("")
      setStatus("investigating")
      setAffectedServices(
        services.reduce((acc, service) => {
          acc[service.id] = { affected: false, status: service.status }
          return acc
        }, {}),
      )
    } catch (error) {
      console.error("Error creating incident:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="identified">Identified</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Affected Services</Label>
        {services.map((service) => (
          <div key={service.id} className="flex items-center space-x-2 mt-2">
            <Checkbox
              id={`service-${service.id}`}
              checked={affectedServices[service.id]?.affected}
              onCheckedChange={(checked) => {
                setAffectedServices((prev) => ({
                  ...prev,
                  [service.id]: { ...prev[service.id], affected: checked as boolean },
                }))
              }}
            />
            <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
            <Select
              value={affectedServices[service.id]?.status}
              onValueChange={(value) => {
                setAffectedServices((prev) => ({
                  ...prev,
                  [service.id]: { ...prev[service.id], status: value },
                }))
              }}
              disabled={!affectedServices[service.id]?.affected}
            >
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
        ))}
      </div>
      <Button type="submit">Create Incident</Button>
    </form>
  )
}

