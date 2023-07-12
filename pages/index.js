import Link from 'next/link';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Spotify Favorites App</title>
      </Head>
  
      <main className="text-center">
        <h1 className="text-3xl font-bold mb-4">my spotify app</h1>
  
        {!session && (
          <div>
            <p className="mb-4">Not signed in</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={signIn}>
              Sign in
            </button>
          </div>
        )}
  
        {session && (
          <div className="red">
            <p className="mb-4">Signed in as {session.user.name}. You can now do any of the following.</p>
            
            <div className="flex flex-col space-y-4">
              <Link legacyBehavior href="/horoscope">
                <a className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">Guess Your Horoscope</a>
              </Link>
              
              <Link legacyBehavior href="/artists">
                <a className="text-white bg-purple-500 hover:bg-purple-600 font-bold text-lg py-3 px-6 rounded">
                  View Favorite Artists
                </a>
              </Link>
              
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={signOut}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}