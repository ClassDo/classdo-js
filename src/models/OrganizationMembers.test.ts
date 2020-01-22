import { buildOrganizationMembersQuery } from './OrganizationMembers'
import { compareGraphqlQuery } from '../TestUtils'
import { query } from 'typed-graphqlify'

describe('buildOrganizationMembersQuery', () => {
  it('should build a query', () => {
    const result = buildOrganizationMembersQuery(['id'])
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
          }
          cursor
        }
      }
    `)
  })

  it('should build a query with args', () => {
    const result = buildOrganizationMembersQuery(
      ['id'], {
        input: {
          where: { user: { profile: { firstName: 'testUser' } } }
        }
      }
    )
    compareGraphqlQuery(query(result), `
      query(input: { where: { user: { profile: { firstName: "testUser" } } } }) {
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
          }
          cursor
        }
      }
    `)
  })

  it('should build a query with option', () => {
    const result = buildOrganizationMembersQuery(
      ['id'], null, { user: { fields: ['id'] } }
    )
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
            user {
              id
            }
          }
          cursor
        }
      }
    `)
  })
})
