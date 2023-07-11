import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import querystring from 'querystring';

const handleSpotifyCallback = async (authorizationCode) => {
  try {
    
    const response = await axios.post('/api/callback', { code: authorizationCode });
    const data = response.data;
    console.log(data); // Process the response data here

    // Store access_token securely

    // Redirect the user to the desired page
    window.location.href = '/artists'
  } catch (error) {
    console.error('Error:', error);
    // Handle error appropriately
  }
};

export default function Callback() {
  const router = useRouter();
  
  




  useEffect(() => {
    const authorizationCode = router.query.code;

    if (authorizationCode) {
      handleSpotifyCallback(authorizationCode);
    }
  }, [router]);

  return <div>Processing...</div>;

}

