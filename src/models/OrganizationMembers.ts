import { params, types } from 'typed-graphqlify'
import { OrganizationMembersArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick, preprocessArgs } from '../Utils'
import { UserKeys, UserResult, UserOption, buildUserQuery } from './Users'
import { UserProfileKeys } from './UserProfiles'
import { OrganizationMemberRoleKeys, OrganizationMemberRoleResult,  buildOrganizationMemberRoleQuery } from './OrganizationMemberRoles'
import { EmailKeys } from './Emails'

export const OrganizationMember = {
  id: types.string
}

export type OrganizationMemberType = typeof OrganizationMember
export type OrganizationMemberKeys = keyof OrganizationMemberType

export type OrganizationMemberResult<
  OM extends OrganizationMemberKeys | null, 
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null,
  OMR extends OrganizationMemberRoleKeys | null
> =
  ([OM] extends [OrganizationMemberKeys] ? Pick<OrganizationMemberType, OM> : {}) &
  ([U] extends [UserKeys] ? { user: UserResult<U, U_UP, U_UP_E> } : {}) &
  ([OMR] extends [OrganizationMemberRoleKeys] ? { role: OrganizationMemberRoleResult<OMR> } : {})

export type OrganizationMembersResult<
  OM extends OrganizationMemberKeys | null,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null,
  OMR extends OrganizationMemberRoleKeys | null
> = Connection<OrganizationMemberResult<OM, U, U_UP, U_UP_E, OMR>>

export type OrganizationMembersOption<U, U_UP, U_UP_E, OMR> = {
  user?: { fields: U[], with?: UserOption<U_UP, U_UP_E> },
  role?: { fields: OMR[] }
}

/**
 * @ignore
 */
const buildOrganizationMemberEdge = <T> (organizationMember: T) => ({
  node: organizationMember,
  cursor: types.string
})

/**
 * @ignore
 */
const buildOrganizationMembers = <T> (
  args: OrganizationMembersArgs | undefined | null,
  organizationMember: T) => {
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

/**
 * @ignore
 */
export function buildOrganizationMembersQuery<
  OM extends OrganizationMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null,
  OMR extends OrganizationMemberRoleKeys | null
>(
  fields: OM[],
  args?: OrganizationMembersArgs | undefined | null,
  option?: OrganizationMembersOption<U, U_UP, U_UP_E, OMR>
): OrganizationMembersResult<OM, U, U_UP, U_UP_E, OMR> {
  const pickedField: any = pick(OrganizationMember, fields)
  if (option && option.user) {
    pickedField['user'] = buildUserQuery(option.user.fields as any, option.user.with || {})
  }
  if (option && option.role) {
    pickedField['role'] = buildOrganizationMemberRoleQuery(option.role.fields as any)
  }
  return buildOrganizationMembers(args, pickedField as any)
}
