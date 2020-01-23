import { params, types } from 'typed-graphqlify'
import { OrganizationRolesArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick, preprocessArgs } from '../Utils'

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

const buildOrganizationMemberRoleEdge = <T> (role: T) => ({
  node: role,
  cursor: types.string
})

const buildOrganizationMemberRoles = <T> (args: OrganizationRolesArgs | undefined | null, role: T) => {
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
  return args ? params(preprocessArgs(args), roomMembers) : roomMembers
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
  fields: OMR[], args?: OrganizationRolesArgs | null | undefined
): OrganizationMemberRolesResult<OMR> {
  const pickedField: any = pick(OrganizationMemberRole, fields)
  return buildOrganizationMemberRoles(args, pickedField as any)
}
