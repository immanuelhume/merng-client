import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

const HeaderMenu = () => {
  const pathname = window.location.pathname;
  const slug = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(slug);

  const { auth, logout } = useContext(AuthContext);

  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        className="hover-teal"
        name="home"
        active={activeItem === 'home'}
        onClick={() => {
          setActiveItem('home');
        }}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        {auth ? (
          <>
            <Menu.Item>{`Welcome, ${auth.username}`}</Menu.Item>
            <Menu.Item
              className="hover-teal"
              name="sign out"
              onClick={logout}
              as={Link}
              to={'/login'}
            />
          </>
        ) : (
          <>
            <Menu.Item
              className="hover-teal"
              name="login"
              active={activeItem === 'login'}
              onClick={() => {
                setActiveItem('login');
              }}
              as={Link}
              to="/login"
            />
            <Menu.Item
              className="hover-teal"
              name="sign up"
              active={activeItem === 'signup'}
              onClick={() => {
                setActiveItem('signup');
              }}
              as={Link}
              to="/signup"
            />
          </>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default HeaderMenu;
