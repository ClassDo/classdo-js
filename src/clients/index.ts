import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { from, FetchResult } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import Log from 'loglevel'
import gql from 'graphql-tag'
import { query, mutation } from 'typed-graphqlify'
import { GraphQLError } from 'graphql'
import { RoomsClient } from './rooms'
import { RolesClient } from './Roles'
import { ViewerClient } from './Viewer'
import { OrganizationMembersClient } from './OrganizationMembers'
import { RoomMembersClient } from './RoomMembers'
import { InvitatationsClient } from './Invitations'

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

export type Result<R> = { errors: readonly GraphQLError[] | undefined, data: R | null }
export class Client {
  private client: ApolloClient<NormalizedCacheObject>
  public organization: ViewerClient 
  public rooms: RoomsClient
  public roles: RolesClient
  public organizationMembers: OrganizationMembersClient
  public roomMembers: RoomMembersClient
  public invitatoins: InvitatationsClient

  constructor(params: { apiKey: string }) {
    this.client = createClient(params.apiKey)
    this.organization = new ViewerClient(this)
    this.rooms = new RoomsClient(this)
    this.roles = new RolesClient(this)
    this.organizationMembers = new OrganizationMembersClient(this)
    this.roomMembers = new RoomMembersClient(this)
    this.invitatoins = new InvitatationsClient(this)
  }

  get viewer() { return this.organization }

  getClient() {
    return this.client
  }

  query<R>(src: R): Promise<ApolloQueryResult<R>> {
    return this.getClient().query({ query: gql(query(src)) })
  }

  mutate<R>(src: R): Promise<FetchResult<R>> {
    return this.getClient().mutate({ mutation: gql(mutation(src)) })
  }
}
