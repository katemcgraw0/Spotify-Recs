import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);

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
        <h1 className="text-3xl font-bold mb-4">Your Favorite Artists</h1>

        {artists.length > 0 ? (
          <ul>
            {artists.map((artist) => (
              <li key={artist.id}>
                <img src={artist.images[0].url} alt={artist.name} width={300} height={300} />
                <p>{artist.name}</p>
                <p>{artist.genres.join(', ')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite artists found.</p>
        )}
      </main>
    </div>
  );
};

export default ArtistsPage;