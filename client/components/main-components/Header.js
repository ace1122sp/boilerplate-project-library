import React from 'react';
import { Link } from 'react-router-dom';

import '../../css/Header.scss';

const Header = () => 
  <header className='header'>
    <Link to="/">Library fCC</Link>
  </header>

export default Header;