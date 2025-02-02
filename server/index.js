const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
const { expressjwt: jwt } = require("express-jwt")
const jwksRsa = require("jwks-rsa")
const nodemailer = require("nodemailer")

const prisma = new PrismaClient()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// Auth0 middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
})

// Helper function to get or create user
async function getOrCreateUser(auth0Id, email, name) {
  let user = await prisma.user.findUnique({ where: { auth0Id } })
  if (!user) {
    user = await prisma.user.create({
      data: { auth0Id, email, name },
    })
  }
  return user
}

// Organization routes
app.post("/api/organizations", checkJwt, async (req, res) => {
  try {
    const { name } = req.body
    const auth0Id = req.auth.sub
    const user = await getOrCreateUser(auth0Id, req.auth.email, req.auth.name)

    const organization = await prisma.organization.create({
      data: {
        name,
        members: {
          create: {
            userId: user.id,
            role: "admin",
          },
        },
      },
    })

    res.json(organization)
  } catch (error) {
    res.status(500).json({ error: "Error creating organization" })
  }
})

app.get("/api/organizations", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.sub
    const user = await getOrCreateUser(auth0Id, req.auth.email, req.auth.name)

    const organizations = await prisma.organizationMember.findMany({
      where: { userId: user.id },
      include: { organization: true },
    })

    res.json(organizations.map((om) => om.organization))
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizations" })
  }
})

// Service routes
app.post("/api/organizations/:orgId/services", checkJwt, async (req, res) => {
  try {
    const { name, description, status } = req.body
    const { orgId } = req.params

    const service = await prisma.service.create({
      data: {
        name,
        description,
        status,
        organizationId: orgId,
      },
    })

    // Emit WebSocket event for service creation
    io.to(orgId).emit("serviceCreated", service)

    res.json(service)
  } catch (error) {
    res.status(500).json({ error: "Error creating service" })
  }
})

app.get("/api/organizations/:orgId/services", checkJwt, async (req, res) => {
  try {
    const { orgId } = req.params
    const services = await prisma.service.findMany({
      where: { organizationId: orgId },
    })
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: "Error fetching services" })
  }
})

// Incident routes
app.post("/api/organizations/:orgId/incidents", checkJwt, async (req, res) => {
  try {
    const { title, description, status, affectedServices } = req.body
    const { orgId } = req.params

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        status,
        organizationId: orgId,
        services: {
          connect: affectedServices.map((id) => ({ id })),
        },
      },
      include: {
        services: true,
      },
    })

    // Emit WebSocket event for incident creation
    io.to(orgId).emit("incidentCreated", incident)

    res.json(incident)
  } catch (error) {
    res.status(500).json({ error: "Error creating incident" })
  }
})

app.get("/api/organizations/:orgId/incidents", checkJwt, async (req, res) => {
  try {
    const { orgId } = req.params
    const incidents = await prisma.incident.findMany({
      where: { organizationId: orgId },
      include: { services: true },
    })
    res.json(incidents)
  } catch (error) {
    res.status(500).json({ error: "Error fetching incidents" })
  }
})

// Public status page route
app.get("/api/status/:orgId", async (req, res) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.params.orgId },
      include: {
        services: true,
        incidents: {
          where: {
            status: { not: "resolved" },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    })

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" })
    }

    res.json(organization)
  } catch (error) {
    res.status(500).json({ error: "Error fetching status page data" })
  }
})

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your email service here
  // For example, using Gmail:
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Invite team member
app.post("/api/organizations/:orgId/invite", checkJwt, async (req, res) => {
  try {
    const { orgId } = req.params
    const { email } = req.body
    const auth0Id = req.auth.sub

    const user = await getOrCreateUser(auth0Id, req.auth.email, req.auth.name)
    const organization = await prisma.organization.findUnique({ where: { id: orgId } })

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" })
    }

    // Check if the user is a member of the organization
    const isMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: orgId,
        },
      },
    })

    if (!isMember) {
      return res.status(403).json({ error: "You are not a member of this organization" })
    }

    // Create the invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        organizationId: orgId,
        invitedById: user.id,
        status: "pending",
      },
    })

    // Send invitation email
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${invitation.id}`
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Invitation to join ${organization.name} on Status Page App`,
      html: `
        <p>You've been invited to join ${organization.name} on Status Page App.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteUrl}">${inviteUrl}</a>
      `,
    })

    res.json({ message: "Invitation sent successfully" })
  } catch (error) {
    console.error("Error sending invitation:", error)
    res.status(500).json({ error: "Error sending invitation" })
  }
})

// Accept invitation
app.post("/api/invitations/:invitationId/accept", checkJwt, async (req, res) => {
  try {
    const { invitationId } = req.params
    const auth0Id = req.auth.sub

    const user = await getOrCreateUser(auth0Id, req.auth.email, req.auth.name)
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { organization: true },
    })

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" })
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ error: "Invitation has already been processed" })
    }

    if (invitation.email !== user.email) {
      return res.status(403).json({ error: "This invitation is not for you" })
    }

    // Accept the invitation
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "accepted" },
    })

    // Add the user to the organization
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        role: "member",
      },
    })

    res.json({ message: "Invitation accepted successfully" })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    res.status(500).json({ error: "Error accepting invitation" })
  }
})

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("A user connected")

  socket.on("joinOrganization", (orgId) => {
    socket.join(orgId)
    console.log(`User joined organization: ${orgId}`)
  })

  socket.on("leaveOrganization", (orgId) => {
    socket.leave(orgId)
    console.log(`User left organization: ${orgId}`)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

