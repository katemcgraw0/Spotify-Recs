import { useRouter } from "next/router";
import React from "react";

// Optionally, you could use Prettier if you want advanced formatting:
// import prettier from "prettier/standalone";
// import babelParser from "prettier/parser-babel";

export default function RawDataPage() {
  const router = useRouter();
  const { data } = router.query;

  // Attempt to decode and parse JSON
  let parsedData = null;
  try {
    if (data) {
      const decodedData = decodeURIComponent(data);
      parsedData = JSON.parse(decodedData);
    }
  } catch (error) {
    console.error("Error parsing data:", error);
  }

  // let formattedData = "";
  // if (parsedData) {
  //   formattedData = prettier.format(JSON.stringify(parsedData), {
  //     parser: "json",
  //     plugins: [babelParser]
  //   });
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Raw Data View</h1>
      {parsedData ? (
        <pre className="bg-white p-4 rounded shadow text-sm overflow-auto">
          {JSON.stringify(parsedData, null, 2)}
          {/* Or if using Prettier's advanced formatting: {formattedData} */}
        </pre>
      ) : (
        <p>No data to display.</p>
      )}

      {/* Simple 'Back' button */}
      <button
        onClick={() => router.back()}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Go Back
      </button>
    </div>
  );
}
