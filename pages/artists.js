import React, { useState } from "react";
import { useRouter } from "next/router";
import Slider from "@mui/material/Slider";
import axios from "axios";
import Link from 'next/link'
/**
 * For screen-reader accessibility,
 * returns a descriptive string of the slider value:
 */
function valuetext(value) {
  return `${value}`;
}

// Minimum and maximum gap constraints
const MIN_GAP = 1;
const MAX_GAP = 50;

export default function SpotifyTester() {
  const router = useRouter();

  // Slider range: [startIndex, endIndex]
  const [range, setRange] = useState([0, 1]); // default gap = 1

  // Dropdown fields
  const [type, setType] = useState("artists"); // "artists" or "tracks"
  const [timeRange, setTimeRange] = useState("medium_term"); // "long_term" | "medium_term" | "short_term"

  // States for request/response
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [submittedOffset, setSubmittedOffset] = useState(null);
  const [submittedType, setSubmittedType] = useState(null);
  /**
   * Handle changes to the two-handle slider,
   * enforcing min/max gap constraints.
   */
  const handleSliderChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;

    let [start, end] = newValue;
    
    // Ensure start <= end
    if (start > end) {
      [start, end] = [end, start];
    }

    const diff = end - start;

    // Enforce min gap
    if (diff < MIN_GAP) {
      if (activeThumb === 0) {
        start = end - MIN_GAP;
      } else {
        end = start + MIN_GAP;
      }
    }
    // Enforce max gap
    else if (diff > MAX_GAP) {
      if (activeThumb === 0) {
        start = end - MAX_GAP;
      } else {
        end = start + MAX_GAP;
      }
    }

    // Clamp both to [0, 50]
    start = Math.max(0, Math.min(start, 200));
    end = Math.max(0, Math.min(end, 200));

    setRange([start, end]);
  };

  /**
   * Handle form submission:
   * offset = startIndex, limit = endIndex - startIndex
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    const [startIndex, endIndex] = range;
    const offset = startIndex;
    const limit = endIndex - startIndex;

    try {
      const response = await axios.get("/api/spotify/top", {
        params: {
          type,
          time_range: timeRange,
          offset,
          limit,
        },
      });
      setSubmittedOffset(offset);
      setSubmittedType(type);
      setResponseData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to /rawdata with the entire response as a query param
   */
  const handleViewRawData = () => {
    if (!responseData) return;
    // Encode the JSON in the URL
    const encodedData = encodeURIComponent(JSON.stringify(responseData));
    router.push(`/rawdata?data=${encodedData}`);
  };

/**
 * Render the list of items (tracks or artists), with numbers starting at `offset + 1`.
 */
const renderItemsList = () => {
  if (!responseData?.items) return null;

  // Offset value from the slider
  const [startIndex] = range; // Slider startIndex is used as offset
  const offset = startIndex;

  // 'items' will be an array of either tracks or artists
  return (
    <ol className="list-decimal list-inside" start={submittedOffset + 1}>
      {responseData.items.map((item, index) => {
        // If the user selected 'artists'
        if (submittedType === "artists") {
          return (
            <li key={item.id} className="py-1">
              {item.name}
            </li>
          );
        } else {
          // If type === 'tracks'
          const trackName = item.name;
          const artistNames = item.artists.map((artist) => artist.name).join(", ");
          return (
            <li key={item.id} className="py-1">
              {trackName} by {artistNames}
            </li>
          );
        }
      })}
    </ol>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-blue-200 flex items-center justify-center py-8 px-4 text-black">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg max-w-xl w-full p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Listening Insights!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TYPE SELECT */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-semibold mb-1 text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="artists">Artists</option>
              <option value="tracks">Tracks</option>
            </select>
          </div>

          {/* TIME RANGE SELECT */}
          <div>
            <label
              htmlFor="timeRange"
              className="block text-sm font-semibold mb-1 text-gray-700"
            >
              Time Range
            </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="long_term">long_term (≈1 year)</option>
              <option value="medium_term">medium_term (≈6 months)</option>
              <option value="short_term">short_term (≈4 weeks)</option>
            </select>
          </div>

          {/* RANGE SLIDER */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Range: {range[0]} – {range[1]}
              <span className="ml-2 text-xs text-gray-500">
                (diff: {range[1] - range[0]})
              </span>
            </label>
            <Slider
              value={range}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              disableSwap
              min={0}
              max={200}
              sx={{
                color: "#1976d2", // Tailwind "blue-600" equivalent
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Min gap: {MIN_GAP}, Max gap: {MAX_GAP}
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
          >
            {isLoading ? "Pinging..." : "Submit"}
          </button>
        </form>

        {/* ERROR SECTION */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 text-red-600 p-3 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* RESPONSE SECTION */}
        {responseData && (
          <div className="mt-4 bg-green-100 border border-green-300 text-green-800 p-3 rounded space-y-4">
            <p className="font-semibold">Response Items:</p>

            {/* List of Artists or Tracks */}
            <ul className="list-decimal list-inside">{renderItemsList()}</ul>


          </div>
        )}
      </div>
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
  );
}
