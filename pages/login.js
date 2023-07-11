import axios from 'axios';
import querystring from 'querystring';

export default function Login() {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scopes = ['user-top-read']; // Additional scopes can be added as needed
    console.log(clientId)
    console.log(redirectUri)
    console.log(process.env.SPOTIFY_CLIENT_ID)

    const authorizeUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scopes.join(' '),
        redirect_uri: redirectUri,
      })}`;
  
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow">
            <a
              href={authorizeUrl}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold"
            >
              Log in with Spotify
            </a>
          </div>
        </div>
      );
    }