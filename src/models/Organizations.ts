import { types } from 'typed-graphqlify'

export const Organization = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type OrganizationType = typeof Organization
export type OrganizationKeys = keyof OrganizationType