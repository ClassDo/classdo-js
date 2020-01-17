import { params, types } from 'typed-graphqlify'
import { ViewerRoomsArgs } from '../generated/graphql'
import { Organization, OrganizationType, OrganizationKeys } from './Organizations'
import { RoomMemberKeys, buildRoomMembersQuery, RoomMembersResult, RoomMembersOption } from './RoomMembers'
import { pick } from '../Utils'
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
  O extends OrganizationKeys | null,
  RM extends RoomMemberKeys | null,
  RM_U extends UserKeys | null,
  RM_U_UP extends UserProfileKeys | null,
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
   RM extends RoomMemberKeys | null,
   RM_U extends UserKeys | null,
   RM_U_UP extends UserProfileKeys | null,
  >(
    args: ViewerRoomsArgs | void,
    fields: R[],
    option: RoomOption<O, RM, RM_U, RM_U_UP>
  ): RoomsResult<R, O, RM, RM_U, RM_U_UP> {
  const pickedFields: any = pick(Room, fields)
  if (option.organization) {
    pickedFields['organization'] = pick(Organization, option.organization.fields as any)
  }
  if (option.members) {
    pickedFields['members'] = buildRoomMembersQuery(
      option.members.args,
      option.members.fields as any,
      option.members.with || {}
    )
  }
  return buildRooms(args, pickedFields)
}
