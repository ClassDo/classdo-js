import { buildOrganizationMemberRolesQuery, buildOrganizationMemberRoleQuery } from './OrganizationMemberRoles'
import { compareGraphqlQuery } from '../TestUtils'
import { query } from 'typed-graphqlify'

describe('buildOrganizationMemberRoleQuery', () => {
  it('should build a query', () => {
    const result = buildOrganizationMemberRoleQuery(['id', 'name'])
    compareGraphqlQuery(query(result), `
      query {
        id
        name
      }
    `)
  })
})

describe('buildOrganizationMemberRolesQuery', () => {
  it('should build a query', () => {
    const result = buildOrganizationMemberRolesQuery(['id', 'name'])
    compareGraphqlQuery(query(result), `
      query {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            name
          }
          cursor
        }
      }
    `)
  })

  it('should build a query with args', () => {
    const result = buildOrganizationMemberRolesQuery(
      ['id', 'name'],
      { input: { where: { name: 'Admin' } } }
    )
    compareGraphqlQuery(query(result), `
      query(input: { where: { name: "Admin" } }) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            name
          }
          cursor
        }
      }
    `)
  })
})
