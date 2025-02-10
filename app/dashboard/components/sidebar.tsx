"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, BarChart, Bell, Settings, LogOut, PlusCircle } from "lucide-react"
import { useOrganization } from "@/app/dashboard/context/organization-context"
import { useEffect, useState } from "react"

type SidebarProps = {
  user: {
    name?: string
    email?: string
  }
}

const defaultNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/create-organization", label: "Create Organization", icon: PlusCircle },
]


export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { currentOrganization } = useOrganization()

  const [navItems, setNavItems] = useState(defaultNavItems)

  useEffect(() => {
    if (currentOrganization) {
      setNavItems([...defaultNavItems, 
        { href: `/dashboard/${currentOrganization}/services`, label: "Services", icon: BarChart }, 
        { href: `/dashboard/${currentOrganization}/incidents`, label: "Incidents", icon: Bell }, 
        { href: `/dashboard/${currentOrganization}/settings`, label: "Settings", icon: Settings }
      ])
    }
  }, [currentOrganization])

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col h-full">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-8">Status Page</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto">
        <p className="text-sm mb-2">{user.name || user.email}</p>
        <Link href="/api/auth/logout">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}

