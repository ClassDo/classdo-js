import { params, types } from 'typed-graphqlify'
import { OrganizationMembersArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick, preprocessArgs } from '../Utils'
import { UserKeys, UserResult, UserOption, buildUserQuery } from './Users'
import { UserProfileKeys } from './UserProfiles'
import { OrganizationMemberRoleKeys, OrganizationMemberRoleResult,  buildOrganizationMemberRoleQuery } from './OrganizationMemberRoles'

export const OrganizationMember = {
  id: types.string
}

export type OrganizationMemberType = typeof OrganizationMember
export type OrganizationMemberKeys = keyof OrganizationMemberType

export type OrganizationMemberResult<
  OM extends OrganizationMemberKeys | null, 
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  OMR extends OrganizationMemberRoleKeys | null
> =
  ([OM] extends [OrganizationMemberKeys] ? Pick<OrganizationMemberType, OM> : {}) &
  ([U] extends [UserKeys] ? { user: UserResult<U, U_UP> } : {}) &
  ([OMR] extends [OrganizationMemberRoleKeys] ? { role: OrganizationMemberRoleResult<OMR> } : {})

export type OrganizationMembersResult<
  OM extends OrganizationMemberKeys | null,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  OMR extends OrganizationMemberRoleKeys | null
> = Connection<OrganizationMemberResult<OM, U, U_UP, OMR>>

export type OrganizationMembersOption<U, U_UP, OMR> = {
  user?: { fields: U[], with?: UserOption<U_UP> },
  role?: { fields: OMR[] }
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
  return args ? params(preprocessArgs(args), roomMembers) : roomMembers
}

export function buildOrganizationMembersQuery<
  OM extends OrganizationMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  OMR extends OrganizationMemberRoleKeys | null
>(
  args: OrganizationMembersArgs | void, fields: OM[], option: OrganizationMembersOption<U, U_UP, OMR> 
): OrganizationMembersResult<OM, U, U_UP, OMR> {
  const pickedField: any = pick(OrganizationMember, fields)
  if (option.user) {
    pickedField['user'] = buildUserQuery(option.user.fields as any, option.user.with || {})
  }
  if (option.role) {
    pickedField['role'] = buildOrganizationMemberRoleQuery(option.role.fields as any)
  }
  return buildOrganizationMembers(args, pickedField as any)
}
