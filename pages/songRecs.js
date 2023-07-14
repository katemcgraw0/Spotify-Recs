import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';



const songRecs = () => {
   
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <Head>
          <title>Recommendations</title>
        </Head>
    
        <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
    This page is still in development.
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