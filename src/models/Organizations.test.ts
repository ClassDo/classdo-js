import { buildOrganizationQuery } from './Organizations'
import { compareGraphqlQuery } from '../TestUtils'
import { query } from 'typed-graphqlify'

describe('buildOrganizationQuery', () => {
  it('should build a query', () => {
    const result = buildOrganizationQuery(['id', 'name'])
    compareGraphqlQuery(query(result), `
      query {
        id
        name
      }
    `)
  })
})