import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { makePrompt } from '/lib/makePrompt.js'
import Link from 'next/link'

const HoroscopePage = () => {
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [generatedSign, setGeneratedSign] = useState('')
  const [generatedList, setGeneratedList] = useState('')
  const [horoscopeGenerated, setHoroscopeGenerated] = useState(false)
  let generatingFuncCalled = useRef(false)

  useEffect(() => {
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
    } //fetchData()

    if (genres.length === 0 && artists.length === 0) {
      fetchData()
    }
  }, []) //useEffect

  useEffect(() => {
    const generateHoroscope = async () => {
      try {
        const prompt = makePrompt(
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
        setHoroscopeGenerated(true)
        const data = await response.json()

        const colonIndex = data.result.indexOf(':')
        const signEndIndex = data.result.indexOf('1')
        console.log(data.result)
        if (colonIndex !== -1) {
          const substring = data.result
            .substring(colonIndex + 1, signEndIndex)
            .trim()
          const sign = substring.split(' ')[0]
          setGeneratedSign(sign)
        } else {
          const sign = 'fake sign debug'
          setGeneratedSign(sign)
        }
        const reasonsStartIndex = data.result.indexOf('1.')
        const reasonsString = data.result.substring(reasonsStartIndex)
        const reasons = reasonsString
          .split('\n')
          .map(reason => reason.trim())
          .filter(reason => reason !== '')
        setGeneratedList(reasons)
        setHoroscopeGenerated(true)
      } catch (error) {
        console.error('Error generating horoscope:', error)
        // Handle error appropriately
      }
    } //generateHoroscope

    if (
      artists.length > 0 &&
      genres.length > 0 &&
      !horoscopeGenerated &&
      generatedSign === ''
    ) {
      if (!generatingFuncCalled.current) {
        // access the current value of the ref using .current
        generatingFuncCalled.current = true
        generateHoroscope()
      }
    }
  }, [genres]) //useEffect

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100'>
      <Head>
        <title>Horoscope Guesser</title>
      </Head>

      <main className='text-center'>
        <div className='text-4xl font-bold text-black'>
          {generatedSign ? (
            <span></span>
          ) : (
            <span>
              Analyzing your music taste to determine your zodiac sign...
            </span>
          )}
        </div>
        {generatedSign && (
          <div className='mt-4'>
            <p className='text-2xl text-black font-bold'>Our Guess:</p>
            <div className='bg-purple-500 rounded-lg p-4 mt-2 inline-block'>
              <h1 className='text-3xl font-semibold text-white'>
                {generatedSign}
              </h1>
            </div>
            {generatedList.length > 0 && (
              <div className='mt-4'>
                <p className='text-2xl text-black font-bold'>Reasons:</p>
                <div className='bg-blue-800 p-4 rounded-lg mt-2 inline-block'>
                  <ul className='list-none'>
                    {generatedList.map((reason, index) => (
                      <li key={index} className='text-lg text-left text-white'>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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

export default HoroscopePage
