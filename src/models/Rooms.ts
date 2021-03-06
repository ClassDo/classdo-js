import { params, types } from 'typed-graphqlify'
import { ViewerRoomsArgs, MutationCreateRoomArgs, MutationDeleteRoomArgs } from '../generated/graphql'
import { OrganizationType, OrganizationKeys, buildOrganizationQuery } from './Organizations'
import { RoomMemberKeys, buildRoomMembersQuery, RoomMembersResult, RoomMembersOption } from './RoomMembers'
import { pick, preprocessArgs } from '../Utils'
import { Connection } from './Connection'
import { RoomMembersArgs } from '../generated/graphql'
import { UserKeys } from './Users'
import { UserProfileKeys } from './UserProfiles'
import { EmailKeys } from './Emails'

export const Room = {
  id: types.string,
  name: types.string,
  description: types.string
}

export type RoomType = typeof Room
export type RoomKeys = keyof RoomType
export type RoomResult<
  R extends RoomKeys,
  O extends OrganizationKeys | null = null,
  RM extends RoomMemberKeys | null = null,
  RM_U extends UserKeys | null = null,
  RM_U_UP extends UserProfileKeys | null = null,
  RM_U_UP_E extends EmailKeys | null = null,
> =
  Pick<RoomType, R> &
  ([O] extends [OrganizationKeys] ? { organization: Pick<OrganizationType, O> } : {}) &
  ([RM] extends [RoomMemberKeys] ? { members: RoomMembersResult<RM, RM_U, RM_U_UP, RM_U_UP_E> } : {})

export type RoomsResult<
  R extends RoomKeys,
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null,
  RM_U extends UserKeys | null,
  RM_U_UP extends UserProfileKeys | null,
  RM_U_UP_E extends EmailKeys | null,
> = Connection<RoomResult<R, O, RM, RM_U, RM_U_UP, RM_U_UP_E>>

export type RoomOption<O, RM, RM_U, RM_U_UP, RM_U_UP_E> = {
  organization?: { fields: O[] },
  members?: { args?: RoomMembersArgs, fields: RM[], with?: RoomMembersOption<RM_U, RM_U_UP, RM_U_UP_E> }
}

/**
 * @ignore
 */
const buildRoomEdge = <T> (room: T) => ({
  node: room,
  cursor: types.string
})

/**
 * @ignore
 */
const buildRooms = <T> (args: ViewerRoomsArgs | undefined | null, room: T) => {
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
  return args ? params(preprocessArgs(args), rooms) : rooms
}

/**
 * @ignore
 */
function resolveOption<
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null,
  RM_U extends UserKeys | null,
  RM_U_UP extends UserProfileKeys | null,
  RM_U_UP_E extends EmailKeys | null
>(option: RoomOption<O, RM, RM_U, RM_U_UP, RM_U_UP_E>) {
  const org = option.organization
    ? { organization: buildOrganizationQuery(option.organization.fields as any) }
    : {}
  const members = option.members
    ? {
        members: buildRoomMembersQuery(
          option.members.fields as any,
          option.members.args,
          option.members.with || {}
        )
      }
    : {}
  return {...org, ...members }
}

/**
 * @ignore
 */
export function buildRoomQuery
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null,
   RM_U_UP_E extends EmailKeys | null
  >(
    fields: R[],
    option?: RoomOption<O, RM, RM_U, RM_U_UP, RM_U_UP_E>
  ): RoomResult<R, O, RM, RM_U, RM_U_UP> {
  const pickedFields = pick(Room, fields)
  const resolvedOption = option ? resolveOption(option) : {} as any
  return { ...pickedFields, ...resolvedOption }
}

/**
 * @ignore
 */
export function buildRoomsQuery
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null,
   RM_U_UP_E extends EmailKeys | null,
  >(
    fields: R[],
    args?: ViewerRoomsArgs | undefined | null,
    option?: RoomOption<O, RM, RM_U, RM_U_UP, RM_U_UP_E>
  ): RoomsResult<R, O, RM, RM_U, RM_U_UP, RM_U_UP_E> {
  const pickedFields: any = pick(Room, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return buildRooms(args, { ...pickedFields, ...resolvedOption })
}

/**
 * @ignore
 */
export function buildCreateRoomMutation
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null,
   RM_U_UP_E extends EmailKeys | null,
  >(
    fields: R[],
    args: MutationCreateRoomArgs,
    option?: RoomOption<O, RM, RM_U, RM_U_UP, RM_U_UP_E>
  ): { createRoom: RoomResult<R, O, RM, RM_U, RM_U_UP, RM_U_UP_E> } {
  const pickedFields: any = pick(Room, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return {
     createRoom: params(preprocessArgs(args), { ...pickedFields, ...resolvedOption })
  }
}

/**
 * @ignore
 */
export function buildDeleteRoomMutation
  <R extends RoomKeys>(
    fields: R[],
    args: MutationDeleteRoomArgs,
  ): { deleteRoom: RoomResult<R> } {
  const pickedFields: any = pick(Room, fields)
  return {
     deleteRoom: params(preprocessArgs(args), { ...pickedFields })
  }
}
