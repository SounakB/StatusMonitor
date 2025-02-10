"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { usePathname } from "next/navigation"
import { getOrganizations } from "@/lib/api-client"

type OrganizationContextType = {
  currentOrganization: string | null
  setCurrentOrganization: (orgId: string) => void
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const orgIdFromPath = pathname.split("/")[2]
    if (orgIdFromPath) {
      
      fetchOrganizations().then((orgs) => {
        setCurrentOrganization(orgs.find((org) => org.id === orgIdFromPath)?.id || null)
      })
    }
  }, [pathname])

  const fetchOrganizations = async () => {
    const orgs = await getOrganizations()
    return orgs;
  }

  return (
    <OrganizationContext.Provider value={{ currentOrganization, setCurrentOrganization }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}

