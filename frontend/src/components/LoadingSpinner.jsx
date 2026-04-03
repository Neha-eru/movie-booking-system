import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="spinner-container">
    <div className="spinner-ring">
      <div></div><div></div><div></div><div></div>
    </div>
    <p className="spinner-text">{message}</p>
  </div>
);

export default LoadingSpinner;