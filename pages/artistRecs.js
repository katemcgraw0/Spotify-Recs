import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import {makePrompt} from '/lib/makePrompt.js'
import { makePromptArtistRecs } from '@/lib/makePrompt';
/* TODO:
-fetch users top artists
-ask open ai for 5 artist recs based on this
-search for spotify artist ID with spotify search api
-display artist and image of artist*/
const artistRecs = () => {
  const [artists, setArtists] = useState([]);
  const [recs, setRecs] = useState('');
  let generatingFuncCalled = useRef(false);

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


        setArtists(artistsData);
      } catch (error) {
        console.error('Error retrieving favorite artists and genres:', error);
        // Handle error appropriately
      }
    };

    if (artists.length === 0) {
      fetchData();
    }
  }, []); 



  useEffect(() => {
        
    const generateRecs = async () => {

       

      console.log('generatingRecs...');
      try {
        const prompt = makePromptArtistRecs(
          artists.map((artist) => artist.name)
        );
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        setRecs(data.result);
        


      } catch (error) {
        console.error('Error generating recommendations:', error);
        // Handle error appropriately
      }
    };


    if (artists.length > 0  &&recs === '') {
        if (!generatingFuncCalled.current) { // access the current value of the ref using .current
            generatingFuncCalled.current = true;
            generateRecs();
        }
    }
  }, [artists]);




    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <Head>
          <title>Recommendations</title>
        </Head>
    
        <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="text-4xl font-bold text-black">
            {recs ? (
            <span></span>
            ) : (
            <span>Getting artist recommendations...</span>
            )}
        </div>
        {recs && (
            <div className="mt-4">
            <p className="text-2xl text-black font-bold">Our Recommendations:</p>
            <div className="bg-purple-500 rounded-lg p-4 mt-2 inline-block">
                <h1 className="text-3xl font-semibold text-white">{recs}</h1>
            </div>
            </div>
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
  export default artistRecs;