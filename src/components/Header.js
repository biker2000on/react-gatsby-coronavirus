import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <p>Coronavirus Dashboard</p>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/table/">Table</Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
