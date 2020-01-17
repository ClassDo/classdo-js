import { params, types } from 'typed-graphqlify'
import { ViewerRoomsArgs } from '../generated/graphql'
import { Organization, OrganizationType, OrganizationKeys } from './Organizations'
import { RoomMember, RoomMemberKeys, buildRoomMembers, RoomMembersResult } from './RoomMembers'
import { pick } from '../Utils'
import { Connection } from './Connection'
import { RoomMembersArgs } from '../generated/graphql'

export const Room = {
  id: types.string,
  name: types.string,
  description: types.string
}

export type RoomType = typeof Room
export type RoomKeys = keyof RoomType
export type RoomResult<
  R extends RoomKeys | null,
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null
> =
  ([R] extends [RoomKeys] ? Pick<RoomType, R> : {}) &
  ([O] extends [OrganizationKeys] ? { organization: Pick<OrganizationType, O> } : {}) &
  ([RM] extends [RoomMemberKeys] ? { members: RoomMembersResult<RM> } : {})

export type RoomsResult<
  R extends RoomKeys | null,
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null
> = Connection<RoomResult<R, O, RM>>
export type RoomOption<O, M> = {
  organization?: { fields: O[] },
  members?: { args?: RoomMembersArgs, fields: M[] }
}

const buildRoomEdge = <T> (room: T) => ({
  node: room,
  cursor: types.string
})

const buildRooms = <T> (args: ViewerRoomsArgs | void, room: T) => {
  const rooms = {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildRoomEdge(room)]
  }
  return args ? params(args as any, rooms) : rooms
}

export function buildRoomsQuery
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null
  >(
    args: ViewerRoomsArgs | void,
    fields: R[],
    option: RoomOption<O, RM>
  ): RoomsResult<R, O, RM> {
  const pickedFields: any = pick(Room, fields)
  if (option.organization) {
    pickedFields['organization'] = pick(Organization, option.organization.fields as any)
  }
  if (option.members) {
    pickedFields['members'] = buildRoomMembers(option.members.args, pick(RoomMember, option.members.fields as any))
  }
  return buildRooms(args, pickedFields)
}
