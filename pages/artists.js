import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);


  //gets users favorite artists and sets artists ^ to them
  useEffect(() => {

    const getFavoriteArtists = async () => {
      const session = await getSession();
      const accessToken = session?.accessToken;

      if (!accessToken) {
        // Handle case when access token is not available
        return;
      }
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        
        const { items } = response.data;
        console.log(items)
        setArtists(items);
      } catch (error) {
        console.error('Error retrieving favorite artists:', error);
        // Handle error appropriately
      }
    };

    getFavoriteArtists();
  }, []);


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Head>
        <title>Spotify Favorites App - Artists</title>
      </Head>
  
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-10 text-black">Your Favorite Artists Lately</h1>
  
        {artists.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {artists.map((artist) => (
              <div key={artist.id} className="flex flex-col items-center mb-5">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"  
                  rel="noopener noreferrer"
                >
                  <p className="text-2xl text-black font-bold mb-2">{artist.name}</p>
                  <img src={artist.images[0].url} alt={artist.name} width={300} height={300} className="mx-auto" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite artists found. Try signing out and signing back in.</p>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-200 py-2">
        <div className="flex justify-center">
          <Link legacyBehavior href="/">
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Return to Main Menu
            </a>
          </Link>
        </div>
      </footer>
    </div>
  );
};
export default ArtistsPage;