import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { BrowserRouter } from 'react-router-dom'

import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Connect ApolloClient with GraphQL server running at port 4000
const httpLink = createHttpLink({
	uri: 'http://localhost:4000'
})

// This middleware will be invoked every time ApolloClient sends a request to the server. 
// Apollo Links allow you to create middlewares that let you modify requests before they are sent to the server.
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem(AUTH_TOKEN)
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

// Create a new WebSocketLink that represents the WebSocket connection and knows the subscriptions endpoint.
// The subscriptions endpoint in this case is similar to the HTTP endpoint, except that it uses the ws instead of http protocol.
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN), //authenticate the websocket connection with the user’s token retrieved from localStorage
    }
  }
})

// Use split for proper “routing” of the requests and update the constructor call of ApolloClient
//
// split is used to “route” a request to a specific middleware link. It takes three arguments, the first one is a test function which returns a boolean. 
// The remaining two arguments are again of type ApolloLink. If test returns true, the request will be forwarded to the link passed as the second argument. 
// If false, to the third one
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

// Instantiate ApolloClient by passing in the link and a new instance of an InMemoryCache
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>,
	document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
