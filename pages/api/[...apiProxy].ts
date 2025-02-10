import { serverFetchAPI } from '@/lib/api-client'
import { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'
import { withApiAuthRequired, getSession, getAccessToken } from '@auth0/nextjs-auth0'
import {jwtDecode} from "jwt-decode";


export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('serverFetchAPI');
    //const cookieStore = await cookies();

    //console.log('cookieStore', cookieStore);
    //return;
    const { method, query, body } = req
    const endpoint = '/api/' + (query.apiProxy as string[]).join('/')

    // Get the session from the request
    // const session = await getSession(req, res);
    // const token = session?.accessToken;
    // console.log('token', token);
    // console.log('token', jwtDecode(token));

    const { accessToken } = await getAccessToken(req, res);


    console.log('accessToken', accessToken);


    console.log('accessToken', jwtDecode(accessToken));
    
    const response = await serverFetchAPI(endpoint, {
      method,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      }
    })

    res.status(200).json(response)
  } catch (error) {
    console.error('Error in handler:', error)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}) 