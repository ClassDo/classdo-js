import { params, types } from 'typed-graphqlify'
import { RoomMembersArgs, MutationAddRoomMembersArgs, MutationDeleteRoomMemberArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick, preprocessArgs } from '../Utils'
import { UserKeys, UserResult, UserOption, buildUserQuery } from './Users'
import { UserProfileKeys } from './UserProfiles'

export const RoomMember = {
  id: types.string
}

export type RoomMemberType = typeof RoomMember
export type RoomMemberKeys = keyof RoomMemberType

export type RoomMemberResult<
  RM extends RoomMemberKeys,
  U extends UserKeys | null = null,
  U_UP extends UserProfileKeys | null = null
> =
  Pick<RoomMemberType, RM> &
  ([U] extends [UserKeys] ? { user: UserResult<U, U_UP> } : {})

export type RoomMembersResult<
  RM extends RoomMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null
> = Connection<RoomMemberResult<RM, U, U_UP>>

export type RoomMembersOption<U, U_UP> = {
  user?: { fields: U[], with?: UserOption<U_UP> }
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

function resolveOption<
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
>(option: RoomMembersOption<U, U_UP>) {
  const user = option.user ? { user: buildUserQuery(option.user.fields as any, option.user.with || {}) } : {}
  return { ...user }
}

export function buildRoomMembersQuery<
  RM extends RoomMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
>(
  args: RoomMembersArgs | void, fields: RM[], option: RoomMembersOption<U, U_UP> 
): RoomMembersResult<RM, U, U_UP> {
  const pickedField: any = pick(RoomMember, fields)
  if (option.user) {
    pickedField['user'] = buildUserQuery(option.user.fields as any, option.user.with || {})
  }
  return buildRoomMembers(args, pickedField as any)
}

export function buildAddRoomMembersMutation<
  RM extends RoomMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
> (
  args: MutationAddRoomMembersArgs, fields: RM[], option?: RoomMembersOption<U, U_UP>
): { addRoomMembers: RoomMemberResult<RM, U, U_UP> } {
  const pickedFields: any = pick(RoomMember, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  console.log(preprocessArgs(args))
  return {
     addRoomMembers: params(preprocessArgs(args), { ...pickedFields, ...resolvedOption })
  }
}

export function buildDeleteRoomMemberMutation<
  RM extends RoomMemberKeys
> (
  args: MutationDeleteRoomMemberArgs, fields: RM[]
): { deleteRoomMember: RoomMemberResult<RM> } {
  const pickedFields: any = pick(RoomMember, fields)
  return {
     deleteRoomMember: params(args, { ...pickedFields })
  }
}
