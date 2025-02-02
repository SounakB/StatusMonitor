import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { title, description, status, affectedServices } = body

  try {
    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        status,
        organizationId: "your-organization-id", // You'll need to implement organization selection
        services: {
          connect: affectedServices.map((id) => ({ id })),
        },
      },
      include: {
        services: true,
      },
    })
    return NextResponse.json(incident)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 })
  }
}

