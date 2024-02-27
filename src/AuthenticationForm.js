// src/AuthenticationForm.js

import React, { useState } from 'react';

const AuthenticationForm = ({ onAuthenticate }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate(code);
    setCode('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Authentication Code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>
      <button type="submit">Verify</button>
    </form>
  );
};

export default AuthenticationForm;
