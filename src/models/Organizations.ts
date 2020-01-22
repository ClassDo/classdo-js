import { types } from 'typed-graphqlify'
import { pick } from '../Utils'

export const Organization = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type OrganizationType = typeof Organization
export type OrganizationKeys = keyof OrganizationType

export function buildOrganizationQuery<
  O extends OrganizationKeys
>(fields: O[]) {
  const pickedField = pick(Organization, fields)
  return pickedField
}