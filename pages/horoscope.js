import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import {makePrompt} from '/lib/makePrompt.js'

let hasError = false;

const HoroscopePage = () => {
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [generatedText, setGeneratedText] = useState('');
    const [generatedSign, setGeneratedSign] = useState('');
    const [generatedList, setGeneratedList] = useState('');

    const generateHoroscope = async () => {
        try {
          const prompt = makePrompt(artists.map((artist) => artist.name), genres);
          const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          });

          const data = await response.json();
          setGeneratedText(data.result);

        } 
        catch (error) {
          console.error('Error generating horoscope:', error);
          hasError = true;
          // Handle error appropriately
        }
      };

    
    useEffect(() => {

      const getFavoriteArtists = async () => {
        const session = await getSession();
        const accessToken = session?.accessToken;
  
        if (!accessToken) {
          // Handle case when access token is not available
          return;
        }
  
        try {
          const artistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          });
          const artistsData = artistsResponse.data.items;
  
          const genresResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          });
          const genresData = genresResponse.data.items.reduce((allGenres, artist) => {
            return [...allGenres, ...artist.genres];
          }, []);
  
          setArtists(artistsData);
          setGenres(genresData);
          

        } catch (error) {
          console.error('Error retrieving favorite artists and genres:', error);
          // Handle error appropriately
        }
      };
  
      getFavoriteArtists();
    }, []);
    

    useEffect(() => {
        if (artists.length > 0 && genres.length > 0 && !hasError) {
          generateHoroscope();
          
        }
      }, [artists, genres]);

      useEffect(() => {
        if (generatedText) {
          setGeneratedSign(generatedText.match(/Sign:\s*\[(.*?)\]/)[1]);
          setGeneratedList(generatedText.split('.\n').slice(1).filter(reason => reason.trim() !== ''));
        }
      }, [generatedText]);


      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
          <Head>
            <title>We'll guess your horoscope</title>
          </Head>

          <main className="text-center">
            <div className="text-4xl font-bold">Horoscope Page</div>
            {generatedText && (
              <div className="mt-4">
                <p className="text-2xl font-bold">Our Guess:</p>
                <div className="text-3xl font-semibold">{generatedSign}</div>
                {generatedList.length > 0 && (
                  <div className="mt-4">
                    <p className="text-2xl font-bold">Reasons:</p>
                    <ul className="list-disc list-inside">
                      {generatedList.map((reason, index) => (
                        <li key={index} className="text-lg">{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      );
  };
  
  export default HoroscopePage;