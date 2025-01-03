import { getSession } from "next-auth/react";
import axios from "axios";

export default async function handler(req, res) {
  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession({ req });

  // Ensure the session and access token are available
  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { type, time_range, offset, limit } = req.query;

  if (!type || !time_range || offset === undefined || limit === undefined) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    const SPOTIFY_API_URL = `https://api.spotify.com/v1/me/top/${type}`;

    console.log("Received query parameters:", { type, time_range, offset, limit });
    console.log("Access Token:", session.accessToken);

    // Make a request to the Spotify API
    const response = await axios.get(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      params: {
        time_range,
        offset,
        limit,
      },
    });

    // Forward the Spotify API response to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Spotify API Error:", error.message);

    if (error.response) {
      if (error.response.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        console.warn(`Rate limited. Retry after ${retryAfter} seconds.`);
        return res.status(429).json({ 
          error: "Rate limit exceeded. Please try again later.", 
          retryAfter 
        });
      }

      // Forward Spotify API error
      return res.status(error.response.status).json(error.response.data);
    }

    // Handle unexpected errors
    return res.status(500).json({ 
      error: "An unexpected error occurred. Please try again later.", 
      details: error.message 
    });
  }
}
