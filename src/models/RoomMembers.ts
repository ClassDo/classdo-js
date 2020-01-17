import { params, types } from 'typed-graphqlify'
import { RoomMembersArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick } from '../Utils'

export const RoomMember = {
  id: types.string
}

export type RoomMemberType = typeof RoomMember
export type RoomMemberKeys = keyof RoomMemberType
export type RoomMemberResult<RM extends RoomMemberKeys> = Pick<RoomMemberType, RM>
export type RoomMembersResult<RM extends RoomMemberKeys> = Connection<RoomMemberResult<RM>>

export const buildRoomMemberEdge = <T> (roomMember: T) => ({
  node: roomMember,
  cursor: types.string
})

export const buildRoomMembers = <T> (args: RoomMembersArgs | void, roomMember: T) => {
  const roomMembers = {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildRoomMemberEdge(roomMember)]
  }
  return args ? params(args as any, roomMembers) : roomMembers
}


export function buildRoomMemberQuery<RM extends RoomMemberKeys>(
  args: RoomMembersArgs | void, fields: RM[]
): RoomMembersResult<RM> {
  const pickedField = pick(RoomMember, fields)
  return buildRoomMembers(args, pickedField as any)
}
