import { params, types } from 'typed-graphqlify'
import { OrganizationRolesArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick } from '../Utils'

export const OrganizationMemberRole = {
  id: types.string,
  name: types.string
}

export type OrganizationMemberRoleType = typeof OrganizationMemberRole
export type OrganizationMemberRoleKeys = keyof OrganizationMemberRoleType

export type OrganizationMemberRoleResult<
  OMR extends OrganizationMemberRoleKeys | null
> =
  ([OMR] extends [OrganizationMemberRoleKeys] ? Pick<OrganizationMemberRoleType, OMR> : {})

export type OrganizationMemberRolesResult<
  OMR extends OrganizationMemberRoleKeys | null
> = Connection<OrganizationMemberRoleResult<OMR>>

export const buildOrganizationMemberRoleEdge = <T> (role: T) => ({
  node: role,
  cursor: types.string
})

export const buildOrganizationMemberRoles = <T> (args: OrganizationRolesArgs | void, role: T) => {
  const roomMembers = {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildOrganizationMemberRoleEdge(role)]
  }
  return args ? params(args as any, roomMembers) : roomMembers
}

export function buildOrganizationMemberRoleQuery<
  OMR extends OrganizationMemberRoleKeys
>(
  fields: OMR[]
): OrganizationMemberRolesResult<OMR> {
  const pickedField: any = pick(OrganizationMemberRole, fields)
  return pickedField
}

export function buildOrganizationMemberRolesQuery<
  OMR extends OrganizationMemberRoleKeys
>(
  args: OrganizationRolesArgs | void, fields: OMR[]
): OrganizationMemberRolesResult<OMR> {
  const pickedField: any = pick(OrganizationMemberRole, fields)
  return buildOrganizationMemberRoles(args, pickedField as any)
}
