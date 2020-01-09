import { ApolloClient } from 'apollo-client'
import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import Log from 'loglevel'

const url = 'https://api.classdo.localhost:9001/graphql'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function createLink(
  endpoint: string,
  getTokenCb: () => string | null
) {
  const httpLink = new HttpLink({ uri: endpoint, fetch: fetch as any })
  const authMiddleware = setContext((_operation, { headers }) => {
    return { headers: { ...headers, 'x-api-key': getTokenCb() } }
  })
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        const errlog = `[GraphQL error: ${endpoint}]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
        Log.error(errlog)
      })
    }
    if (networkError) {
      const errlog = `[Network error]: ${networkError}`
      Log.error(errlog)
    }
  })
  return from([authMiddleware, errorLink, httpLink])
}

function createClient(apiKey: string): ApolloClient<NormalizedCacheObject> {
  const capellaLink = createLink(
    url,
    () => apiKey
  )
  const capellaCache = new InMemoryCache()
  const capellaClient = new ApolloClient({
    link: capellaLink,
    cache: capellaCache,
    connectToDevTools: true
  })
  return capellaClient
}

export class Client {
  private client: ApolloClient<NormalizedCacheObject>

  constructor(params: { apiKey: string }) {
    this.client = createClient(params.apiKey)
  }
  getClient() {
    return this.client
  }
}
