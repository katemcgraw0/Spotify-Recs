import Link from 'next/link';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Zodiacify</title>
      </Head>
  
      <main className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-custom text-black">
        <img src="/pinkspotify.png" alt="Zodiacify Logo" className="inline-block h-8 mr-2 " />
          Zodiacify</h1>
       
  
        {!session && (
          <div>
            <h1 className="text-2xl text-black mb-4 font-custom">Login with Spotify and we will guess your zodiac sign based on your music taste.</h1>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={signIn}>
              Sign in
            </button>
          </div>
        )}
  
        {session && (
          <div className="red">
            <p className="mb-4 text-black">Signed in as {session.user.name}. You can now do any of the following.</p>
            
            <div className="flex flex-col space-y-4">
            <Link legacyBehavior href="/horoscope">
                <a className="common-button-style bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">Zodiacify</a>
            </Link>

            <Link legacyBehavior href="/artists">
                <a className="common-button-style bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">View Favorite Artists</a>
            </Link>

            <Link legacyBehavior href="/recs">
                <a className="common-button-style bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Get Music Recommendations</a>
            </Link>

            <button className="common-button-style bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={signOut}>
                Sign out
            </button>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}