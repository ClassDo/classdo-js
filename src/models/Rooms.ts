import { params, types } from 'typed-graphqlify'
import { RoomsInput } from '../generated/graphql'
import { Organization, OrganizationType, OrganizationKeys } from './Organizations'
import { RoomMember, RoomMemberType, RoomMemberKeys, buildRoomMembers } from './RoomMembers'
import { pick } from './Core'

export const Room = {
  id: types.string,
  name: types.string,
  description: types.string
}

export type RoomType = typeof Room
export type RoomKeys = keyof RoomType
export type RoomOption<O, M> = {
  organization?: { fields: O[] },
  members?: { fields: M[] }
}

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

export type RoomResult<R, O, RM> =
  R & (O extends {} ? { organization: O } : {})
    & (RM extends {} ? { members: RM } : {})

export type RoomsResult<R, O, RM> = {
  totalCount: number,
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor: string | undefined,
    endCursor: string | undefined
  },
  edges: {
    cursor: string
    node: RoomResult<R, O, RM>
  }[]
}

export function buildRoomsQuery
  <R extends RoomKeys,
   O extends (OrganizationKeys | null),
   RM extends (RoomMemberKeys | null)
  >(
    args: RoomsInput | undefined,
    fields: R[],
    option: RoomOption<O, RM>
  ): RoomsResult<
    Pick<RoomType, R>,
    O extends OrganizationKeys ? Pick<OrganizationType, O> : null,
    RM extends RoomMemberKeys ? Pick<RoomMemberType, RM> : null
  > {
  const pickedFields: any = pick(Room, fields)
  if (option.organization) {
    pickedFields['organization'] = pick(Organization, option.organization.fields as any)
  }
  if (option.members) {
    pickedFields['members'] = buildRoomMembers(pick(RoomMember, option.members.fields as any))
  }
  return buildRooms(args || { input: {}}, pickedFields)
}

const rooms = buildRoomsQuery(undefined, ['id'], { organization: { fields: ['id']}})
rooms.edges[0].node.organization.id