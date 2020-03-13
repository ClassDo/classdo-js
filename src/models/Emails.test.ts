import { query } from 'typed-graphqlify'
import { compareGraphqlQuery } from '../TestUtils'
import { buildEmailsQuery } from './Emails'

describe('buildEmailsQuery', () => {
  it('should build a query', () => {
    const result = buildEmailsQuery(['id', 'value'])
    compareGraphqlQuery(query(result),`
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
            value
          }
          cursor
        }
      }
    `)
  })
})
