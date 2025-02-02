import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { validateAccessToken } from "@/lib/auth"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Validate the access token
    const token = authorization.split(" ")[1]
    // const payload = await validateAccessToken(token)

    // if (!payload) {
    //   return res.status(401).json({ error: "Invalid token" })
    // }

    const { sub, email, name, picture } = req.body

    const user = await prisma.user.create({
      data: {
        auth0Id: sub,
        email,
        name,
        picture,
      },
    })

    res.status(201).json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

