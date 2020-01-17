import { params, types } from 'typed-graphqlify'
import { RoomMembersArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick } from '../Utils'
import { User, UserKeys, UserType } from './Users'

export const RoomMember = {
  id: types.string
}

export type RoomMemberType = typeof RoomMember
export type RoomMemberKeys = keyof RoomMemberType

export type RoomMemberResult<
  RM extends RoomMemberKeys,
  U extends UserKeys | null
> =
  Pick<RoomMemberType, RM> &
  ([U] extends [UserKeys] ? { user: Pick<UserType, U> } : {})

export type RoomMembersResult<
  RM extends RoomMemberKeys,
  U extends UserKeys | null
> = Connection<RoomMemberResult<RM, U>>

export type RoomMembersOption<U> = {
  user?: { fields: U[] }
}

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

export function buildRoomMemberQuery<
  RM extends RoomMemberKeys,
  U extends UserKeys | null
>(
  args: RoomMembersArgs | void, fields: RM[], option: RoomMembersOption<U> 
): RoomMembersResult<RM, U> {
  const pickedField: any = pick(RoomMember, fields)
  if (option.user) {
    pickedField['user'] = pick(User, option.user.fields as any)
  }
  return buildRoomMembers(args, pickedField as any)
}
