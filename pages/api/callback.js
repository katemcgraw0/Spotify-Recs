import axios from 'axios';
import querystring from 'querystring';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./auth/[...nextauth]";
import  { NextApiRequest, NextApiResponse } from "next"


const handleSpotifyCallback = async (authorizationCode,req,res) => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  const clientParameters = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const url = 'https://accounts.spotify.com/api/token';
  
  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'authorization_code');
  requestBody.append('code', authorizationCode);
  requestBody.append('redirect_uri', redirectUri);
  console.log('handling spotify callback')
  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Basic ${clientParameters}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;
    console.log(data)
    // Retrieve the session
    console.log('Retrieving the session:')
    const session = await getServerSession(req, res, authOptions)
    console.log('Logging session:')
    console.log(session)
    // Update the access token in the session
    session.accessToken = data.access_token;

    // Save the updated session
    await session.save();

    return data;
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    // Handle error appropriately
    throw error;
  }
};

export default async function callbackHandler(req, res) {
  const { code } = req.body;

  console.log(req)
  console.log(res)
  try {
    const tokenData = await handleSpotifyCallback(code,req,res);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process callback' });
  }
}