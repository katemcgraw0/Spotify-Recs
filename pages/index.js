import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Head>
        <title>Spotify Favorites App</title>
      </Head>
      <nav className="py-4">
        <Link legacyBehavior href="/login">
          <a className="mr-4 text-blue-500 hover:text-blue-700">Login</a>
        </Link>
        <Link legacyBehavior href="/artists" passHref>
          <a className="text-blue-500 hover:text-blue-700">Artists</a>
        </Link>
      </nav>
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">my spotify app</h1>
      </main>
    </div>
  );
}

