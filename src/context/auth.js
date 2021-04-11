import jwtDecode from 'jwt-decode';
import React, { createContext, useReducer } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const initialState = localStorage.getItem('jwtToken')
    ? jwtDecode(localStorage.getItem('jwtToken'))
    : null;

  function authReducer(state, action) {
    console.log(action);
    switch (action.type) {
      case 'LOGIN':
        return { ...action.payload };
      case 'LOGOUT':
        return null;
      default:
        return state;
    }
  }

  const [auth, dispatchAuth] = useReducer(authReducer, initialState);

  function login(loginData) {
    localStorage.setItem('jwtToken', loginData.token);
    dispatchAuth({ payload: loginData, type: 'LOGIN' });
  }
  function logout() {
    localStorage.removeItem('jwtToken');
    dispatchAuth({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
