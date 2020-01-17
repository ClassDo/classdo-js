import { params, types } from 'typed-graphqlify'
import { RoomMemberWhereInput } from '../generated/graphql'
import { pick } from '../Utils'

export const RoomMember = {
  id: types.string
}

export type RoomMemberType = typeof RoomMember
export type RoomMemberKeys = keyof RoomMemberType

export const buildRoomMemberEdge = <T extends RoomMemberKeys> (roomMember: Pick<RoomMemberType, T>) => ({
  node: roomMember,
  cursor: types.string
})

export const buildRoomMembers = <T extends RoomMemberKeys> (roomMember: Pick<RoomMemberType, T>) => ({
  totalCount: types.number,
  pageInfo: {
    hasNextPage: types.boolean,
    hasPreviousPage: types.boolean,
    startCursor: types.optional.string,
    endCursor: types.optional.string
  },
  edges: [buildRoomMemberEdge(roomMember)]
})

export function buildRoomMemberQuery<T extends keyof RoomMemberType>(args: RoomMemberWhereInput, fields: T[]) {
  const pickedField = pick(RoomMember, fields)
  return params(args as any, buildRoomMembers(pickedField))
}

export const RoomMembers = buildRoomMemberQuery(RoomMember, [])
