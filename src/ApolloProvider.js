import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import App from './App';

const httpLink = createHttpLink({ uri: 'https://afternoon-hamlet-76374.herokuapp.com/' });

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
