import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { makePromptSongRecs } from '@/lib/makePrompt'

const SongRecs = () => {
  const [genres, setGenres] = useState([])
  const [artists, setArtists] = useState([])
  const [songRecs, setSongRecs] = useState('')
  let generatingFuncCalled = useRef(false)
  const [songs, setSongs] = useState([])
  const [artistsofSongs, setArtistsofSongs] = useState([])
  const [albumCovers, setAlbumCovers] = useState([])

  useEffect(() => {
    //fetches users top artists on spotify
    const fetchData = async () => {
      const session = await getSession()
      const accessToken = session?.accessToken

      if (!accessToken) {
        // Handle case when access token is not available
        return
      }
      try {
        const artistsResponse = await axios.get(
          'https://api.spotify.com/v1/me/top/artists',
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        )
        const artistsData = artistsResponse.data.items

        const genresData = artistsResponse.data.items.reduce(
          (allGenres, artist) => {
            return [...allGenres, ...artist.genres]
          },
          []
        )
        setArtists(artistsData)
        setGenres(genresData)
      } catch (error) {
        console.error('Error retrieving favorite artists and genres:', error)
        // Handle error appropriately
      }
    }

    if (genres.length === 0 && artists.length === 0) {
      fetchData()
    }
  }, [])

  useEffect(() => {
    //generates song recommendations by making open ai api call
    const generateRecs = async () => {
      try {
        const prompt = makePromptSongRecs(
          artists.map(artist => artist.name),
          genres
        )
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt })
        })
        const data = await response.json()
        setSongRecs(data.result)
        // Split the string based on the delimiter "."
        const songTitles = data.result
          .match(/\d+\. ([^\n]+) by/g)
          .map(match => match.replace(/\d+\. | by/g, '').trim())
        const artistNames = data.result
          .match(/by ([^\n]+)/g)
          .map(match => match.replace(/by /g, '').trim())
        setSongs(songTitles)
        setArtistsofSongs(artistNames)
      } catch (error) {
        console.error('Error generating recommendations:', error)
        // Handle error appropriately
      }
    }

    if (artists.length > 0 && genres.length > 0 && songRecs === '') {
      if (!generatingFuncCalled.current) {
        // access the current value of the ref using .current
        generatingFuncCalled.current = true
        generateRecs()
      }
    }
  }, [artists])

  useEffect(() => {
    //gets the album covers by spotify api call
    const getAlbumImages = async () => {
      const session = await getSession()
      const artistPicsArray = []

      for (let i = 0; i < songs.length; i++) {
        const songName = songs[i]
        const artistName = artistsofSongs[i]

        const searchResponse = await axios.get(
          'https://api.spotify.com/v1/search',
          {
            params: {
              q: `${songName} ${artistName}`,
              type: 'track'
            },
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        )

        const { tracks } = searchResponse.data
        console.log(searchResponse.data)
        if (
          tracks.items.length > 0 &&
          tracks.items[0].album.images.length > 0
        ) {
          const artistPicURL = tracks.items[0].album.images[0].url
          const songURL = tracks.items[0].external_urls.spotify
          artistPicsArray.push({
            songName,
            artistName,
            artistPicURL,
            songURL
          })
        }
      }

      setAlbumCovers(artistPicsArray)
    }

    if (artistsofSongs.length > 0) {
      getAlbumImages()
    }
  }, [artistsofSongs])

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 text-black'>
      <Head>
        <title>Recommendations</title>
      </Head>

      <main className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <div className='text-4xl font-bold text-black text-center'>
          {albumCovers.length > 0 ? (
            <span></span>
          ) : (
            <span>Analyzing your music taste and generating song recs...</span>
          )}
        </div>

        {albumCovers.length > 0 && (
          <div className='flex flex-col items-center justify-center text-black'>
            <h2 className='text-2xl font-bold text-center mb-12'>
              You Should Check out These Songs on Spotify!
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              {albumCovers.map((cover, index) => (
                <div key={index} className='flex flex-col items-center'>
                  {/* Anchor tag wrapping the img element */}
                  <a
                    href={cover.songURL}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      src={cover.artistPicURL}
                      alt={`${cover.songName} - ${cover.artistName}`}
                      className='w-48 h-48 mb-2'
                    />
                  </a>
                  <p className='text-lg text-center'>
                    {cover.songName} by {cover.artistName}
                  </p>
                </div>
              ))}
            </div>
            <div className='flex justify-center items-center mt-8'>
              <img
                src='SpotifyLogo.png'
                alt='Spotify Logo'
                className='w-32 h-auto'
              />
            </div>
          </div>
        )}
      </main>

      <footer className='fixed bottom-0 left-0 right-0 bg-gray-200 py-2'>
        <div className='flex justify-center'>
          <Link legacyBehavior href='/'>
            <a className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Return to Main Menu
            </a>
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default SongRecs
