import { params, types } from 'typed-graphqlify'
import { OrganizationMembersArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick } from '../Utils'
import { UserKeys, UserResult, UserOption, buildUserQuery } from './Users'
import { UserProfileKeys } from './UserProfiles'

export const OrganizationMember = {
  id: types.string
}

export type OrganizationMemberType = typeof OrganizationMember
export type OrganizationMemberKeys = keyof OrganizationMemberType

export type OrganizationMemberResult<
  OM extends OrganizationMemberKeys | null, 
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null
> =
  ([OM] extends [OrganizationMemberKeys] ? Pick<OrganizationMemberType, OM> : {}) &
  ([U] extends [UserKeys] ? { user: UserResult<U, U_UP> } : {})

export type OrganizationMembersResult<
  OM extends OrganizationMemberKeys | null,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null
> = Connection<OrganizationMemberResult<OM, U, U_UP>>

export type OrganizationMembersOption<U, U_UP> = {
  user?: { fields: U[], with?: UserOption<U_UP> }
}

export const buildOrganizationMemberEdge = <T> (organizationMember: T) => ({
  node: organizationMember,
  cursor: types.string
})

export const buildOrganizationMembers = <T> (args: OrganizationMembersArgs | void, organizationMember: T) => {
  const roomMembers = {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildOrganizationMemberEdge(organizationMember)]
  }
  return args ? params(args as any, roomMembers) : roomMembers
}

export function buildOrganizationMembersQuery<
  OM extends OrganizationMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
>(
  args: OrganizationMembersArgs | void, fields: OM[], option: OrganizationMembersOption<U, U_UP> 
): OrganizationMembersResult<OM, U, U_UP> {
  const pickedField: any = pick(OrganizationMember, fields)
  if (option.user) {
    pickedField['user'] = buildUserQuery(option.user.fields as any, option.user.with || {})
  }
  return buildOrganizationMembers(args, pickedField as any)
}
