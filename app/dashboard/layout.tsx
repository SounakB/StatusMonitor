import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"
import { Sidebar } from "./components/sidebar"
import { OrganizationDropdown } from "./components/organization-dropdown"
import { OrganizationProvider } from "./context/organization-context"
import type React from "react" // Import React

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/api/auth/login")
  }

  return (
    <OrganizationProvider>
      <div className="flex h-screen">
        <Sidebar user={session.user} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm p-4">
            <OrganizationDropdown />
          </header>
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </OrganizationProvider>
  )
}

