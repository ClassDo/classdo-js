import {
  buildRoomQuery,
  buildRoomsQuery,
  buildCreateRoomMutation,
  buildDeleteRoomMutation
} from './Rooms'
import { compareGraphqlQuery } from '../TestUtils'
import { query, mutation } from 'typed-graphqlify'

describe('buildRoomQuery', () => {
  it('should build a query', () => {
    const result = buildRoomQuery(['id', 'name'])
    compareGraphqlQuery(query(result), `
      query {
        id
        name
      }
    `)
  })

  it('should build a query with option', () => {
    const result = buildRoomQuery(['id', 'name'], { organization: { fields: ['id'] } })
    compareGraphqlQuery(query(result), `
      query {
        id
        name
        organization {
          id
        }
      }
    `)
  })
})

describe('buildRoomsQuery', () => {
  it('should build a query', () => {
    const result = buildRoomsQuery(['id'])
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
    const result = buildRoomsQuery(['id'], {
      input: { where: { name: 'testRoom' } }
    })
    compareGraphqlQuery(query(result), `
      query(input: { where: { name: "testRoom" } }) {
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
    const result = buildRoomsQuery(['id'], null, {
      organization: { fields: ['name'] }
    })
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
            organization {
              name
            }
          }
          cursor
        }  
      }
    `)
  })
})

describe('buildCreateRoomMutation', () => {
  const result = buildCreateRoomMutation(['id'], {
    data: { name: 'testRoom', description: 'testDescription' }
  })
  compareGraphqlQuery(mutation(result), `
    mutation {
      createRoom(data: { name: "testRoom", description: "testDescription" }) {
        id
      }
    }
  `)
})

describe('buildDeleteRoomMutation', () => {
  const result = buildDeleteRoomMutation(['id'], { id: 'testRoomId' })
  compareGraphqlQuery(mutation(result), `
    mutation {
      deleteRoom(id: "testRoomId") {
        id
      }
    }
  `)
})