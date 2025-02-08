"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrganizations } from "@/lib/api-client"
import { useOrganization } from "../context/organization-context"

type Organization = {
  id: string
  name: string
}

export function OrganizationDropdown() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const { currentOrganization, setCurrentOrganization } = useOrganization()
  const router = useRouter()

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await getOrganizations()
      setOrganizations(orgs)
      if (orgs.length > 0 && !currentOrganization) {
        setCurrentOrganization(orgs[0].id)
      }
    }
    fetchOrganizations()
  }, [currentOrganization, setCurrentOrganization])

  const handleOrgChange = (orgId: string) => {
    setCurrentOrganization(orgId)
    router.push(`/dashboard/${orgId}`)
  }

  return (
    <Select value={currentOrganization || undefined} onValueChange={handleOrgChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

