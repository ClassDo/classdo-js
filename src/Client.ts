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
import { ViewerKeys, buildViewerQuery, ViewerOption, ViewerResult } from './models/Viewer'
import { RoomKeys, RoomOption, RoomsResult } from './models/Rooms'
import { OrganizationKeys } from './models/Organizations'
import { RoomMemberKeys } from './models/RoomMembers'
import { UserKeys } from './models/Users'
import { UserProfileKeys } from './models/UserProfiles'
import { OrganizationMemberKeys, OrganizationMembersResult, OrganizationMembersOption } from './models/OrganizationMembers'
import { OrganizationMemberRoleKeys, OrganizationMemberRolesResult } from './models/OrganizationMemberRoles'
import { ViewerRoomsArgs, OrganizationRolesArgs, OrganizationMembersArgs } from './generated/graphql'
import { GraphQLError } from 'graphql'

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

type Result<R> = { errors: readonly GraphQLError[] | undefined, data: R | null }
export class Client {
  private client: ApolloClient<NormalizedCacheObject>

  constructor(params: { apiKey: string }) {
    this.client = createClient(params.apiKey)
  }

  getClient() {
    return this.client
  }

  query<R>(src: R): Promise<ApolloQueryResult<R>> {
    return this.getClient().query({ query: gql(query(src)) })
  }

  mutate<R>(src: R): Promise<FetchResult<R>> {
    return this.getClient().mutate({ mutation: gql(mutation(src)) })
  }


  viewer = this.organization.bind(this)
  async organization<
    V extends ViewerKeys,
    R extends RoomKeys | null,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
    OM extends OrganizationMemberKeys | null,
    OM_U extends UserKeys | null,
    OM_U_UP extends UserProfileKeys | null,
    OM_OMR extends OrganizationMemberRoleKeys | null,
    OMR extends OrganizationMemberRoleKeys | null,
  >(fields: V[], option?: ViewerOption<
    R, R_O, R_M, R_M_U, R_M_U_UP,
    OM, OM_U, OM_U_UP, OM_OMR,
    OMR
  >):
    Promise<Result<
      ViewerResult<
        V, R, R_O, R_M, R_M_U, R_M_U_UP, OM, OM_U, OM_U_UP, OM_OMR, OMR
      >
    >> {
    const result = await this.query({ viewer: buildViewerQuery(fields, option) })
    return {
      errors: result.errors,
      data: result.errors ? null : result.data.viewer
    }
  }

  async rooms<
    R extends RoomKeys,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
  >(fields: R[],
    args?: ViewerRoomsArgs | undefined | null,
    option?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP>
  ): Promise<Result<RoomsResult<R, R_O, R_M, R_M_U, R_M_U_UP>>> {
    const result = await this.query({
      viewer: buildViewerQuery(['id'], {
        rooms: { fields: fields, args: args, with: option }
      })
    })
    return {
      errors: result.errors,
      data: result.errors ? null : (result.data.viewer as any).rooms
    }
  }

  async roles<OMR extends OrganizationMemberRoleKeys | null>(
    fields: OMR[],
    args?: OrganizationRolesArgs | null | undefined
  ): Promise<Result<OrganizationMemberRolesResult<OMR>>> {
    const result = await this.query({
      viewer: buildViewerQuery(['id'], { roles: { fields: fields, args: args } })
    })
    return {
      errors: result.errors,
      data: result.errors ? null : (result.data.viewer as any).roles
    }
  }

  async organizationMembers<
    OM extends OrganizationMemberKeys | null,
    OM_U extends UserKeys | null,
    OM_U_UP extends UserProfileKeys | null,
    OM_OMR extends OrganizationMemberRoleKeys | null,
  >(
    fields: OM[],
    args?: OrganizationMembersArgs | null | undefined,
    option?: OrganizationMembersOption<OM_U, OM_U_UP, OM_OMR>
  ): Promise<Result<OrganizationMembersResult<OM, OM_U, OM_U_UP, OM_OMR>>> {
    const result = await this.query({
      viewer: buildViewerQuery(['id'], {
        members: { fields: fields, args: args, with: option }
      })
    })
    return {
      errors: result.errors,
      data: result.errors ? null : (result.data.viewer as any).members
    }
  }
}
