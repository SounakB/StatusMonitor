export const auth0Config = {
  authorizationParams: {
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`,
}

