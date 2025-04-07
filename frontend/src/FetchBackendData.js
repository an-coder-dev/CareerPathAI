import React, { useState, useEffect } from 'react';

function FetchBackendData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Make a GET request to your backend
    fetch(`${process.env.REACT_APP_API_URL}/ping`) // This is the backend route
      .then((response) => response.json())
      .then((data) => setData(data)) // Store the data in state
      .catch((error) => console.error('Error:', error));
  }, []); // Empty dependency array means this runs only once (on component mount)

  return (
    <div>
      {data ? <h1>{data}</h1> : <h1>Loading...</h1>} {/* Display data or loading message */}
    </div>
  );
}

export default FetchBackendData;
