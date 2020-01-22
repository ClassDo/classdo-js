import { buildUserProfileQuery } from './UserProfiles'
import { compareGraphqlQuery } from '../TestUtils'
import { query } from 'typed-graphqlify'

describe('buildUserProfileQuery', () => {
  it('should build a query', () => {
    const result = buildUserProfileQuery(['id', 'firstName'])
    compareGraphqlQuery(query(result), `
      query {
        id
        firstName
      }
    `)
  })
})
