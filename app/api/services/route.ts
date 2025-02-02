import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, status } = body

  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        status,
        organizationId: "your-organization-id", // You'll need to implement organization selection
      },
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

