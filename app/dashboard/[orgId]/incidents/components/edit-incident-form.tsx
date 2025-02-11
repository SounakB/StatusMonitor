"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getServices, updateIncident } from "@/lib/api-client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Incident = {
  id: string
  title: string
  description: string
  status: string
  services: { id: string; name: string }[]
}

type EditIncidentFormProps = {
  incident: Incident
  orgId: string
  allServices: { id: string; name: string }[]
  onUpdate: (updatedIncident: Incident) => void
  onCancel: () => void
}

export function EditIncidentForm({ incident, orgId, allServices, onUpdate, onCancel }: EditIncidentFormProps) {
  const [title, setTitle] = useState(incident.title)
  const [description, setDescription] = useState(incident.description)
  const [status, setStatus] = useState(incident.status)
  const [services, setServices] = useState([])
  const [affectedServices, setAffectedServices] = useState(incident.services.map((s) => ({id: s.id, status: services.find((service) => service.id === s.id)?.status})))

  useEffect(() => {
    const fetchServices = async () => {
        const fetchedServices = await getServices(orgId)
        setServices(fetchedServices)
    }
    fetchServices()
  }, [orgId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedIncident = await updateIncident(orgId, incident.id, { title, description, status, affectedServices })
      onUpdate(updatedIncident)
    } catch (error) {
      console.error("Error updating incident:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
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
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="identified">Identified</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Affected Services</label>
        {/* {services.map((service) => (
          <div key={service.id} className="flex items-center">
            <input
              type="checkbox"
              id={`service-${service.id}`}
              checked={affectedServices.includes(service.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setAffectedServices([...affectedServices, service.id])
                } else {
                  setAffectedServices(affectedServices.filter((id) => id !== service.id))
                }
              }}
              className="mr-2"
            />
            <label htmlFor={`service-${service.id}`}>{service.name}</label>
          </div>
        ))} */}
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
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Incident</Button>
      </div>
    </form>
  )
}

