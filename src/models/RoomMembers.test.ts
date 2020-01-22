import {
  buildRoomMembersQuery,
  buildAddRoomMembersMutation,
  buildDeleteRoomMemberMutation
} from './RoomMembers'
import { compareGraphqlQuery } from '../TestUtils'
import { query, mutation } from 'typed-graphqlify'

describe('buildRoomMembersQuery', () => {
  it('should build a query', () => {
    const result = buildRoomMembersQuery(['id'])
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
    const result = buildRoomMembersQuery(['id'], {
      input: { where: { user: { profile: { firstName: 'testUser' } } } }
    })
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
})

describe('buildAddRoomMembersMutation', () => {
  it('should build a query', () => {
    const result = buildAddRoomMembersMutation(['id'], {
      data: { roomId: 'roomId', userIds: ['testUserId']}
    })
    compareGraphqlQuery(mutation(result), `
      mutation {
        addRoomMembers(data: { roomId: "roomId", userIds: ["testUserId"] }) {
          id
        }
      }
    `)
  })
})

describe('buildDeleteRoomMemberQuery', () => {
  it('should build a query', () => {
    const result = buildDeleteRoomMemberMutation(['id'], { id: 'roomMemberId' })
    compareGraphqlQuery(mutation(result), `
      mutation {
        deleteRoomMember(id: "roomMemberId") {
          id
        }
      }
    `)
  })
})
