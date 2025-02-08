"use client"

import { useState, useEffect } from "react"
import { createIncident, getServices } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

type CreateIncidentFormProps = {
  onIncidentCreated: (incident: any) => void
}

export function CreateIncidentForm({ onIncidentCreated }: CreateIncidentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("investigating")
  const [affectedServices, setAffectedServices] = useState([])
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        const fetchedServices = await getServices(token)
        setServices(fetchedServices)
      }
    }
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const newIncident = await createIncident(token, { title, description, status, affectedServices })
        onIncidentCreated(newIncident)
      }
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
          <div key={service.id} className="flex items-center space-x-2">
            <Checkbox
              id={`service-${service.id}`}
              checked={affectedServices.includes(service.id)}
              onCheckedChange={(checked) => {
                setAffectedServices(
                  checked ? [...affectedServices, service.id] : affectedServices.filter((id) => id !== service.id),
                )
              }}
            />
            <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
          </div>
        ))}
      </div>
      <Button type="submit">Create Incident</Button>
    </form>
  )
}

