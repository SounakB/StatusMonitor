import { getSession } from "@auth0/nextjs-auth0"
import io from "socket.io-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

let socket: any

export function initializeSocket() {
  if (!socket) {
    socket = io(API_URL)
  }
  return socket
}

export function joinOrganization(orgId: string) {
  if (socket) {
    socket.emit("joinOrganization", orgId)
  }
}

export function leaveOrganization(orgId: string) {
  if (socket) {
    socket.emit("leaveOrganization", orgId)
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const session = await getSession()
  const token = session?.accessToken

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("API request failed")
  }

  return res.json()
}

export async function createOrganization(name: string) {
  return fetchAPI("/api/organizations", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export async function getOrganizations() {
  return fetchAPI("/api/organizations")
}

export async function getServices(orgId: string) {
  return fetchAPI(`/api/organizations/${orgId}/services`)
}

export async function createService(orgId: string, serviceData: any) {
  return fetchAPI(`/api/organizations/${orgId}/services`, {
    method: "POST",
    body: JSON.stringify(serviceData),
  })
}

export async function getIncidents(orgId: string) {
  return fetchAPI(`/api/organizations/${orgId}/incidents`)
}

export async function createIncident(orgId: string, incidentData: any) {
  return fetchAPI(`/api/organizations/${orgId}/incidents`, {
    method: "POST",
    body: JSON.stringify(incidentData),
  })
}

export async function getPublicStatus(orgId: string) {
  return fetchAPI(`/api/status/${orgId}`)
}

export async function inviteTeamMember(orgId: string, email: string) {
  return fetchAPI(`/api/organizations/${orgId}/invite`, {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function getTeamMembers(orgId: string) {
  return fetchAPI(`/api/organizations/${orgId}/members`)
}

export async function getInvitation(invitationId: string) {
  return fetchAPI(`/api/invitations/${invitationId}`)
}

export async function acceptInvitation(invitationId: string) {
  return fetchAPI(`/api/invitations/${invitationId}/accept`, {
    method: "POST",
  })
}

