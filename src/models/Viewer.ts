import { types } from 'typed-graphqlify'
import { RoomsResult, RoomKeys, RoomOption, buildRoomsQuery } from './Rooms'
import { RoomMemberKeys } from './RoomMembers'
import { OrganizationKeys } from './Organizations'
import { pick } from '../Utils'
import { ViewerRoomsArgs, OrganizationMembersArgs } from '../generated/graphql'
import { UserKeys } from './Users'
import { UserProfileKeys } from './UserProfiles'
import { OrganizationMemberKeys, OrganizationMembersResult, OrganizationMembersOption, buildOrganizationMembersQuery } from './OrganizationMembers'

const Viewer = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type ViewerType = typeof Viewer
export type ViewerKeys = keyof typeof Viewer
export type ViewerOption<R, R_O, R_M, R_M_U, R_M_U_UP, OM, OM_U, OM_U_UP> = {
  rooms?: {
    fields: R[],
    args?: ViewerRoomsArgs,
    with?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP>
  },
  members?: {
    fields: OM[],
    args?: OrganizationMembersArgs,
    with?: OrganizationMembersOption<OM_U, OM_U_UP>
  }
}

export type ViewerResult<V extends ViewerKeys, R, OM> =
  Pick<ViewerType, V> &
  (R extends {} ? { rooms: R } : {}) &
  (OM extends {} ? { members: OM } : {})

export function buildViewerQuery <
  V extends ViewerKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_M extends RoomMemberKeys | null,
  R_M_U extends UserKeys | null,
  R_M_U_UP extends UserProfileKeys | null,
  OM extends OrganizationMemberKeys | null,
  OM_U extends UserKeys | null,
  OM_U_UP extends UserProfileKeys | null
> (fields: V[], option: ViewerOption<R, R_O, R_M, R_M_U, R_M_U_UP, OM, OM_U, OM_U_UP>):
  { viewer:
    ViewerResult<V, RoomsResult<R, R_O, R_M, R_M_U, R_M_U_UP>, OrganizationMembersResult<OM, OM_U, OM_U_UP>>
  } {
  const pickedFields: any = pick(Viewer, fields || [])
  if (option.rooms) {
    pickedFields['rooms'] = buildRoomsQuery(
      option.rooms.args,
      option.rooms.fields as any,
      option.rooms.with || {}
    )
    if (option.members) {
      pickedFields['members'] = buildOrganizationMembersQuery(
        option.members.args,
        option.members.fields as any,
        option.members.with || {}
      )
    }
  }
  return { viewer: pickedFields }
}