import { params, types } from 'typed-graphqlify'
import { ViewerRoomsArgs, MutationCreateRoomArgs, MutationDeleteRoomArgs } from '../generated/graphql'
import { OrganizationType, OrganizationKeys, buildOrganizationQuery } from './Organizations'
import { RoomMemberKeys, buildRoomMembersQuery, RoomMembersResult, RoomMembersOption } from './RoomMembers'
import { pick, preprocessArgs } from '../Utils'
import { Connection } from './Connection'
import { RoomMembersArgs } from '../generated/graphql'
import { UserKeys } from './Users'
import { UserProfileKeys } from './UserProfiles'

export const Room = {
  id: types.string,
  name: types.string,
  description: types.string
}

export type RoomType = typeof Room
export type RoomKeys = keyof RoomType
export type RoomResult<
  R extends RoomKeys | null,
  O extends OrganizationKeys | null = null,
  RM extends RoomMemberKeys | null = null,
  RM_U extends UserKeys | null = null,
  RM_U_UP extends UserProfileKeys | null = null,
> =
  ([R] extends [RoomKeys] ? Pick<RoomType, R> : {}) &
  ([O] extends [OrganizationKeys] ? { organization: Pick<OrganizationType, O> } : {}) &
  ([RM] extends [RoomMemberKeys] ? { members: RoomMembersResult<RM, RM_U, RM_U_UP> } : {})

export type RoomsResult<
  R extends RoomKeys | null,
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null,
  RM_U extends UserKeys | null,
  RM_U_UP extends UserProfileKeys | null,
> = Connection<RoomResult<R, O, RM, RM_U, RM_U_UP>>

export type RoomOption<O, RM, RM_U, RM_U_UP> = {
  organization?: { fields: O[] },
  members?: { args?: RoomMembersArgs, fields: RM[], with?: RoomMembersOption<RM_U, RM_U_UP> }
}

const buildRoomEdge = <T> (room: T) => ({
  node: room,
  cursor: types.string
})

const buildRooms = <T> (args: ViewerRoomsArgs | void | null, room: T) => {
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

function resolveOption<
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null,
  RM_U extends UserKeys | null,
  RM_U_UP extends UserProfileKeys | null
>(option: RoomOption<O, RM, RM_U, RM_U_UP>) {
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

export function buildRoomQuery
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null  
  >(
    fields: R[],
    option?: RoomOption<O, RM, RM_U, RM_U_UP>
  ): RoomResult<R, O, RM, RM_U, RM_U_UP> {
  const pickedFields = pick(Room, fields)
  const resolvedOption = option ? resolveOption(option) : {} as any
  return { ...pickedFields, ...resolvedOption }
}

export function buildRoomsQuery
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null,
  >(
    fields: R[],
    args?: ViewerRoomsArgs | void | null,
    option?: RoomOption<O, RM, RM_U, RM_U_UP>
  ): RoomsResult<R, O, RM, RM_U, RM_U_UP> {
  const pickedFields: any = pick(Room, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return buildRooms(args, { ...pickedFields, ...resolvedOption })
}

export function buildCreateRoomMutation
  <R extends RoomKeys,
   O extends OrganizationKeys | null,
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null,
  >(
    fields: R[],
    args: MutationCreateRoomArgs,
    option?: RoomOption<O, RM, RM_U, RM_U_UP>
  ): { createRoom: RoomResult<R, O, RM, RM_U, RM_U_UP> } {
  const pickedFields: any = pick(Room, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return {
     createRoom: params(preprocessArgs(args), { ...pickedFields, ...resolvedOption })
  }
}

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
