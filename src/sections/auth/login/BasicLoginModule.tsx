import React, { useState, FormEvent } from 'react';
import { TextField, Button } from '@mui/material';

import keycloakService from "../keycloakService"

const BasicLoginModule = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLoggedIn = await keycloakService.login(email, password);
  
    if (isLoggedIn) {
      // Handle successful login
    } else {
      // Handle failed login
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Lets goooo
      </Button>
    </form>
  );
};

export default BasicLoginModule;
