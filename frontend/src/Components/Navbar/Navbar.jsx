

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PublicNavbar from './PublicNavbar';
import UserNavbar from './UserNavbar';

const Navbar = () => {
  const { user } = useAuth();

  // Render appropriate navbar based on user authentication status
  return user ? <UserNavbar /> : <PublicNavbar />;
};

export default Navbar;
