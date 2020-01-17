import { types } from 'typed-graphqlify'
import { RoomsResult, RoomKeys, RoomOption, buildRoomsQuery } from './Rooms'
import { RoomMemberKeys } from './RoomMembers'
import { OrganizationKeys } from './Organizations'
import { pick } from '../Utils'
import { ViewerRoomsArgs } from '../generated/graphql'
import { UserKeys } from './Users'
import { UserProfileKeys } from './UserProfiles'

const Viewer = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type ViewerType = typeof Viewer
export type ViewerKeys = keyof typeof Viewer
export type ViewerOption<R, R_O, R_M, R_M_U, R_M_U_UP> = {
  rooms?: {
    fields: R[],
    args?: ViewerRoomsArgs,
    with?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP>
  }
}

export type ViewerResult<V extends ViewerKeys, R> =
  Pick<ViewerType, V> & (R extends {} ? { rooms: R } : {})

export function buildViewerQuery <
  V extends ViewerKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_M extends RoomMemberKeys | null,
  R_M_U extends UserKeys | null,
  R_M_U_UP extends UserProfileKeys | null
> (fields: V[], option: ViewerOption<R, R_O, R_M, R_M_U, R_M_U_UP>):
  { viewer:
    ViewerResult<V, RoomsResult<R, R_O, R_M, R_M_U, R_M_U_UP>>
  } {
  const pickedFields: any = pick(Viewer, fields || [])
  if (option.rooms) {
    pickedFields['rooms'] = buildRoomsQuery(
      option.rooms.args,
      option.rooms.fields as any,
      option.rooms.with || {}
    )
  }
  return { viewer: pickedFields }
}