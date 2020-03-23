import { query } from 'typed-graphqlify'
import { compareGraphqlQuery } from '../TestUtils'
import { buildBillingQuery } from './Billing'

describe('buildBillingQuery', () => {
  it('should build a query', () => {
    const result = buildBillingQuery(
      ['id', 'year', 'month'],
      { input: { year: 2020, month: 3 } },
      {
        records: {
          fields: ['id', 'date'],
          with: {
            usages: {
              fields: ['paidSec', 'amount'],
              with: {
                user: {
                  fields: ['id'], with: { profile: { fields: ['firstName'] } }
                },
                room: { fields: ['name'] }
              }
            },
            freeCredits: { fields: ['paidSec', 'amount']},
            topups: { fields: ['paidSec', 'amount']},
          }
        }
      }
    )
    compareGraphqlQuery(query(result),`
      query(input: { year: 2020, month: 3 }) {
        id
        year
        month
        records {
          id
          date
          usages {
            paidSec
            amount
            user {
              id
              profile {
                firstName
              }
            }
            room {
              name
            }
          }
          freeCredits {
            paidSec
            amount
          }
          topups {
            paidSec
            amount
          }
        }
      }
    `)
  })
})
