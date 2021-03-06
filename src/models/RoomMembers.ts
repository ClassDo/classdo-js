import { params, types } from 'typed-graphqlify'
import { RoomMembersArgs, MutationAddRoomMembersArgs, MutationDeleteRoomMemberArgs } from '../generated/graphql'
import { Connection } from './Connection'
import { pick, preprocessArgs } from '../Utils'
import { UserKeys, UserResult, UserOption, buildUserQuery } from './Users'
import { UserProfileKeys } from './UserProfiles'
import { EmailKeys } from './Emails'

export const RoomMember = {
  id: types.string
}

export type RoomMemberType = typeof RoomMember
export type RoomMemberKeys = keyof RoomMemberType

export type RoomMemberResult<
  RM extends RoomMemberKeys,
  U extends UserKeys | null = null,
  U_UP extends UserProfileKeys | null = null,
  U_UP_E extends EmailKeys | null = null
> =
  Pick<RoomMemberType, RM> &
  ([U] extends [UserKeys] ? { user: UserResult<U, U_UP, U_UP_E> } : {})

export type RoomMembersResult<
  RM extends RoomMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null,
> = Connection<RoomMemberResult<RM, U, U_UP, U_UP_E>>

export type RoomMembersOption<U, U_UP, U_UP_E> = {
  user?: { fields: U[], with?: UserOption<U_UP, U_UP_E> }
}

/**
 * @ignore
 */
const buildRoomMemberEdge = <T> (roomMember: T) => ({
  node: roomMember,
  cursor: types.string
})

/**
 * @ignore
 */
const buildRoomMembers = <T> (args: RoomMembersArgs | undefined | null, roomMember: T) => {
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
  return args ? params(preprocessArgs(args), roomMembers) : roomMembers
}

/**
 * @ignore
 */
function resolveOption<
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null
>(option: RoomMembersOption<U, U_UP, U_UP_E>) {
  const user = option.user ? { user: buildUserQuery(option.user.fields as any, option.user.with || {}) } : {}
  return { ...user }
}

/**
 * @ignore
 */
export function buildRoomMembersQuery<
  RM extends RoomMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null
>(
  fields: RM[],
  args?: RoomMembersArgs | undefined | null,
  option?: RoomMembersOption<U, U_UP, U_UP_E>
): RoomMembersResult<RM, U, U_UP, U_UP_E> {
  const pickedField: any = pick(RoomMember, fields)
  if (option && option.user) {
    pickedField['user'] = buildUserQuery(option.user.fields as any, option.user.with || {})
  }
  return buildRoomMembers(args, pickedField as any)
}

/**
 * @ignore
 */
export function buildAddRoomMembersMutation<
  RM extends RoomMemberKeys,
  U extends UserKeys | null,
  U_UP extends UserProfileKeys | null,
  U_UP_E extends EmailKeys | null,
> (
  fields: RM[],
  args: MutationAddRoomMembersArgs,
  option?: RoomMembersOption<U, U_UP, U_UP_E>
): { addRoomMembers: RoomMemberResult<RM, U, U_UP, U_UP_E>[] } {
  const pickedFields: any = pick(RoomMember, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return {
     addRoomMembers: params(preprocessArgs(args), { ...pickedFields, ...resolvedOption })
  }
}

/**
 * @ignore
 */
export function buildDeleteRoomMemberMutation<
  RM extends RoomMemberKeys
> (
  fields: RM[],
  args: MutationDeleteRoomMemberArgs
): { deleteRoomMember: RoomMemberResult<RM> } {
  const pickedFields: any = pick(RoomMember, fields)
  return {
     deleteRoomMember: params(preprocessArgs(args), { ...pickedFields })
  }
}
