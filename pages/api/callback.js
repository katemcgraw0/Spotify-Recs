import axios from 'axios';
import querystring from 'querystring';

const handleSpotifyCallback = async (authorizationCode) => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  const clientParameters = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const url = 'https://accounts.spotify.com/api/token';

  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'authorization_code');
  requestBody.append('code', authorizationCode);
  requestBody.append('redirect_uri', redirectUri);

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Basic ${clientParameters}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;
    console.log(data)
    // Process the response data here and store access_token securely

    return data;
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    // Handle error appropriately
    throw error;
  }
};

export default async function callbackHandler(req, res) {
  const { code } = req.body;

  try {
    const tokenData = await handleSpotifyCallback(code);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process callback' });
  }
}