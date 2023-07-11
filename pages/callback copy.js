import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import querystring from 'querystring';


export default function Callback() {
  const router = useRouter();
  const handleSpotifyCallback = async (code) => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    console.log(process.env.SPOTIFY_CLIENT_SECRET)
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = 'http://localhost:3000/callback';
    console.log('clientSecret stored:', clientSecret)
    const clientParameters = btoa(`${clientId}:${clientSecret}`);
    const url = 'https://accounts.spotify.com/api/token';
  
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'authorization_code');
    requestBody.append('code', code);
    requestBody.append('redirect_uri', redirectUri);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${clientParameters}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody
      });
  
      const data = await response.json();
      console.log(data); // Process the response data here
  
      // Store access_token and refresh_token in a secure way (e.g., server-side session)
  
      // Redirect the user to the desired page
      router.push('/artists');
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };




  useEffect(() => {
    const authorizationCode = router.query.code;

    if (authorizationCode) {
      handleSpotifyCallback(authorizationCode);
    }
  }, [router]);

  return <div>Processing...</div>;

}

