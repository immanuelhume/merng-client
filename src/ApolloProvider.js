import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import App from './App';

const httpLink = createHttpLink({ uri: 'http://localhost:4000' });

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  console.log(token);
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

console.log(authLink.concat(httpLink));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
