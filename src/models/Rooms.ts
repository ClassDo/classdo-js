import { params, types, query } from 'typed-graphqlify'
import { Client } from '../Client'
import gql from 'graphql-tag'
import { RoomsInput } from '../generated/graphql'

const Room = {
  id: types.number,
  name: types.string,
  description: types.string
}

type QueryResult<T> = {
  viewer: {
    rooms: {
      totalCount: number,
      pageInfo: {
        hasNextPage: boolean,
        hasPreviousPage: boolean,
        startCursor: string | undefined,
        endCursor: string | undefined
      },
      edges: {
        cursor: string
        node: T
      }[]
    }
  }
}

type RoomType = typeof Room


function createQuery<T extends keyof RoomType>(args: any, fields: readonly T[]): QueryResult<Pick<RoomType, T>> {
  const pickedFields =  fields.reduce((p, c) => {
    p[c] = Room[c]
    return p
  }, {} as Pick<RoomType, T>)
  const query = {
    viewer: {
      rooms: params(args, {
        totalCount: types.number,
        pageInfo: {
          hasNextPage: types.boolean,
          hasPreviousPage: types.boolean,
          startCursor: types.optional.string,
          endCursor: types.optional.string
        },
        edges: [{
          cursor: types.string,
          node: {
            ...pickedFields
          }
        }]
      })
    }
  }
  return query
}

export const FULL_FIELDS = ['id', 'name', 'description'] as const

export function get<T extends keyof RoomType>(id: string, fields: T[] | null) {
return createQuery({ input: { where: { id } } }, fields || FULL_FIELDS)
}

export function list<T extends keyof RoomType>(input: RoomsInput = {}, fields: T[] = []) {
  return createQuery({ input }, fields)
}

const client = new Client({ apiKey: 'SSQFGSs4I3Qtb7Ko8wqA29ownTcjed53YBSWFl1j' })
const result = client.getClient().query({ query: gql(query(get('"ck56jgshb02hg0726ox49by9v"', ['id']) ))})
result.then(v => {
  console.log(v.data)
})
