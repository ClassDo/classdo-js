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
import { RoomsClient } from './Rooms'
import { RolesClient } from './Roles'
import { ViewerClient } from './Viewer'
import { OrganizationMembersClient } from './OrganizationMembers'
import { RoomMembersClient } from './RoomMembers'
import { InvitatationsClient } from './Invitations'

/** @ignore */
const url = process.env.CLASSDO_API_URL || 'https://api.classdo.com/graphql'

/**
 * @ignore
 */
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

/**
 * @ignore
 */
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

/**
 * The ClassDoAPIClient class encapsulates all logics to call ClassDo APIs from client side.
 */
export class ClassDoAPIClient {
  private client: ApolloClient<NormalizedCacheObject>
  /** Client to call Viewer schema */
  public organization: ViewerClient 
  /** Client to call Rooms schema and mutation for rooms */
  public rooms: RoomsClient
  /** Client to call Roles schema */
  public roles: RolesClient
  /** Client to call OrganizatoinMembers schema */
  public organizationMembers: OrganizationMembersClient
  /** Client to call RoomMembers schema */
  public roomMembers: RoomMembersClient
  /** Client to call mutation for invitations */
  public invitatoins: InvitatationsClient

  /**
   * The ClassDoAPIClient constructor
   * 
   * ```typescript
   * const client = new ClassDoAPIClient({ apiKey: 'xxxxxxxxxxxx' })
   * client.viewer.get(['id'], { rooms: { fields: ['id', 'name'] }}).then(v => {
   *   console.log(v)
   * }) 
   * ```
   * 
   * @param params apiKey: API Key to call ClassDo public API.
   */
  constructor(params: { apiKey: string }) {
    this.client = createClient(params.apiKey)
    this.organization = new ViewerClient(this)
    this.rooms = new RoomsClient(this)
    this.roles = new RolesClient(this)
    this.organizationMembers = new OrganizationMembersClient(this)
    this.roomMembers = new RoomMembersClient(this)
    this.invitatoins = new InvitatationsClient(this)
  }

  /**
  * Alias for [[organization]] property.
  */
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
