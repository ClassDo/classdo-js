import { buildUserQuery } from './Users'
import { compareGraphqlQuery } from '../TestUtils'
import { query } from 'typed-graphqlify'

describe('buildUserQuery', () => {
  it('should build a query', () => {
    const result = buildUserQuery(['id'])
    compareGraphqlQuery(query(result), `
      query {
        id
      }
    `)
  })


  it('should build a query with option', () => {
    const result = buildUserQuery(['id'], {
      profile: { fields: ['firstName'] }
    })
    compareGraphqlQuery(query(result), `
      query {
        id
        profile {
          firstName
        }
      }
    `)
  })
})