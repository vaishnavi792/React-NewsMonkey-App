// src/EnvTest.js
import React from 'react';

const EnvTest = () => {
  const apiKey = process.env.REACT_APP_NEWS_API;
  console.log("TEST API KEY:", apiKey);
  return (
    <div>
      <h2>API Key from .env:</h2>
      <p>{apiKey ? apiKey : "API Key not found 😓"}</p>
    </div>
  );
};

export default EnvTest;
