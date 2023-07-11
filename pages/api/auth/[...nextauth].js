import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';


export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-currently-playing,user-read-recently-played,user-top-read,user-read-email",
    })

  ],
  callbacks: {

    async jwt({ token, account }) {
          // Store the access token in the token object
        if (account?.access_token) {
            token.accessToken = account.access_token;
        }
      
        return token;
        },
    async session({session,token,user}){
    //session.accessToken = token?.account.access_token || null;
    if (!session) {
        session = { user: {} };
      }
    // Store the access token in the session
    session.accessToken = token.accessToken;
   


    // Store access token in the session
    return session;
}
  }
  
}

export default NextAuth(authOptions)

