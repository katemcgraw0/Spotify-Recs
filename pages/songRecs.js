import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { makePromptSongRecs } from '@/lib/makePrompt';



const songRecs = () => {
    const [genres, setGenres] = useState([]);
    const [artists, setArtists] = useState([]);
    const [songRecs,setSongRecs] = useState('');
    let generatingFuncCalled = useRef(false);
    const [songs,setSongs] = useState([]);
    const [artistsofSongs,setArtistsofSongs] = useState([]);
    const [albumCovers,setAlbumCovers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const session = await getSession();
          const accessToken = session?.accessToken;
    
          if (!accessToken) {
            // Handle case when access token is not available
            return;
          }
          try {
            const artistsResponse = await axios.get(
              'https://api.spotify.com/v1/me/top/artists',
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
              }
            );
            const artistsData = artistsResponse.data.items;
    
            const genresData = artistsResponse.data.items.reduce(
              (allGenres, artist) => {
                return [...allGenres, ...artist.genres];
              },
              []
            );
            setArtists(artistsData);
            setGenres(genresData);
          } catch (error) {
            console.error('Error retrieving favorite artists and genres:', error);
            // Handle error appropriately
          }
        };
    
        if (genres.length === 0 && artists.length === 0) {
          fetchData();
        }
      }, []);




    useEffect(() => {   
        const generateRecs = async () => {
          console.log('generatingRecs...');
          try {
            const prompt = makePromptSongRecs(
              artists.map((artist) => artist.name), genres);
            const response = await fetch('/api/openai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            setSongRecs(data.result);
            // Split the string based on the delimiter "."
            console.log(data.result);
            const songTitles = data.result.match(/\d+\. ([^\n]+) by/g).map((match) => match.replace(/\d+\. | by/g, '').trim());
            const artistNames = data.result.match(/by ([^\n]+)/g).map((match) => match.replace(/by /g, '').trim());
            setSongs(songTitles);
            console.log(songTitles);
            setArtistsofSongs(artistNames);
            console.log(artistNames);
          } catch (error) {
            console.error('Error generating recommendations:', error);
            // Handle error appropriately
          }
        };
    
        if (artists.length > 0  && genres.length > 0 && songRecs === '') {
            if (!generatingFuncCalled.current) { // access the current value of the ref using .current
                generatingFuncCalled.current = true;
                generateRecs();
            }
        }
      }, [artists]);



      useEffect(() => {
        const getAlbumImages = async () => {
          console.log('gettingArtistsImages...');
          const session = await getSession();
          const artistPicsArray = [];
    
          for (let i = 0; i < songs.length; i++) {
            const songName = songs[i];
            const artistName = artistsofSongs[i];
      
            const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
              params: {
                q: `${songName} ${artistName}`,
                type: 'track',
              },
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            });
      
            const { tracks } = searchResponse.data;
            console.log(searchResponse.data)
            if (tracks.items.length > 0 && tracks.items[0].album.images.length > 0) {
              const artistPicURL =  tracks.items[0].album.images[0].url;
              artistPicsArray.push(artistPicURL);
            }
        }

          setAlbumCovers(artistPicsArray);
        }
    
        if (!artistsofSongs == 0){

          
            getAlbumImages();
    
        }
      }, [artistsofSongs]);




    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <Head>
          <title>Recommendations</title>
        </Head>
    
        <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
        {albumCovers.length > 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Song Recommendations</h1>
            <ul>
              {albumCovers.map((cover, index) => (
                <li key={index} className="flex flex-col items-center mb-4">
                  <img src={cover} alt={`${cover.songName} - ${cover.artistName}`} className="w-32 h-32 object-cover rounded-full" />
                  <p className="mt-2 text-center">{cover.songName}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xl text-center">
            Analyzing your music taste and generating song recs...
          </p>
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
  export default songRecs;