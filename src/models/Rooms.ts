import { params, types, query } from 'typed-graphqlify'
import { Client } from '../Client'
import { RoomsInput } from '../generated/graphql'
import { Organization, OrganizationType } from './Organizations'
import gql from 'graphql-tag'
import { RoomMember, RoomMembers, RoomMemberType, RoomMeberKeys, buildRoomMembers } from './RoomMembers'

export const Room = {
  id: types.string,
  name: types.string,
  description: types.string,
  organization: Organization,
  members: RoomMembers
}

type RoomType = typeof Room
type RoomKeys = keyof RoomType

export const buildRoomEdge = <T> (room: T) => ({
  node: room,
  cursor: types.string
})

export const buildRooms = <T> (args: any, room: T) => (
  params(args, {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildRoomEdge(room)]
   }
 )
)

type QueryResult<R, O, RM> = {
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
        node: Omit<R, 'organization' | 'members'>
          & (O extends {} ? { organization: O } : {})
          & (RM extends {} ? { members: RM } : {})
      }[]
    }
  }
}

type Option<O, M> = {
  organization?: { fields: O[] },
  members?: { fields: M[] }
}

function pick <M extends Object, F extends keyof M> (model: M, fields: F[]) {
  return fields.reduce((p, c) => {
    p[c] = model[c]
    return p
  }, {} as Pick<M, F>)
}

function createQuery
  <T extends RoomKeys,
   O extends keyof OrganizationType,
   RM extends RoomMeberKeys
  >
  (args: { input: RoomsInput }, fields: T[], option: Option<O, RM>):
  QueryResult<
    Pick<RoomType, T>,
    O extends keyof OrganizationType ? Pick<OrganizationType, O > : null,
    Pick<RoomMemberType, RM>
  > {
  const pickedFields: any = pick(Room, fields)
  if (option.organization) {
    pickedFields['organization'] = pick(Organization, option.organization.fields)
  }
  if (option.members) {
    pickedFields['members'] = buildRoomMembers(pick(RoomMember, option.members.fields))
  }
  const query = {
    viewer: {
      rooms: buildRooms(args, pickedFields)
    }
  }
  return query
}


export const FULL_FIELDS = ['id', 'name', 'description', 'organization'] as const

type Params<R extends RoomKeys, O extends keyof OrganizationType | void, RM extends RoomMeberKeys> = {
  fields: R[],
  with?: Option<O, RM>
}
export function get<R extends RoomKeys, O extends keyof OrganizationType, RM extends RoomMeberKeys >
  (id: string, params: Params<R, O, RM>) {
  return createQuery(
    { input: { where: { id } } },
    params.fields || [],
    params.with || {}
  )
}

const client = new Client({ apiKey: 'u6SlsOP2Va2iaW5NjBm1I9c1XeLhhJiW36euYc2h' })
const src = get('"ck56jgshb02hg0726ox49by9v"', {
  fields: ['id', 'name'],
  with: {
    organization: { fields: ['name'] },
    members: { fields: ['id'] }
  }
})

console.log(query(src))
const result = client.getClient().query({ query: gql(query(src))})
result.then(v => {
  console.log(JSON.stringify(v.data))
})
