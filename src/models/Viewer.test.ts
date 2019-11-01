import { buildViewerQuery } from './Viewer'
import { compareGraphqlQuery } from '../TestUtils'
import { query } from 'typed-graphqlify'

describe('buildViewerQuery', () => {
  it('should build a query', () => {
    const result = buildViewerQuery(['id'])
    compareGraphqlQuery(query(result), `
      query {
        id
      }
    `)
  })

  it('should build a query with option', () => {
    const result = buildViewerQuery(['id'], {
      rooms: { fields: ['id'] }
    })
    compareGraphqlQuery(query(result), `
      query {
        id
        rooms {
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
      }
    `)
  })
})