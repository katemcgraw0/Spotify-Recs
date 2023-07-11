import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            Authorization: ``,
          },
        });

        setArtists(response.data.items);
      } catch (error) {
        console.error('Error fetching favorite artists:', error);
        // Handle error appropriately
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Your Favorite Artists</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}