import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const services = await prisma.service.findMany()

    for (const service of services) {
      // In a real-world scenario, you would check the actual status of the service here
      // For this example, we'll just use a random boolean
      const isUp = Math.random() < 0.95 // 95% chance of being up

      await prisma.uptimeEntry.create({
        data: {
          serviceId: service.id,
          isUp,
        },
      })
    }

    res.status(200).json({ message: "Uptime updated successfully" })
  } catch (error) {
    console.error("Error updating uptime:", error)
    res.status(500).json({ message: "Error updating uptime" })
  }
}

