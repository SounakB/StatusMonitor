"use client"

import { useEffect, useState } from "react"
import { getServices } from "@/lib/api-client"
import { ServiceList } from "./components/service-list"
import { Button } from "@/components/ui/button"
import { AddServiceForm } from "./components/add-service-form"

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [isAddingService, setIsAddingService] = useState(false)

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => setIsAddingService(!isAddingService)}>
          {isAddingService ? "Cancel" : "Add Service"}
        </Button>
      </div>
      {isAddingService && (
        <AddServiceForm
          onServiceAdded={(newService) => {
            setServices([...services, newService])
            setIsAddingService(false)
          }}
        />
      )}
      <ServiceList services={services} />
    </div>
  )
}

