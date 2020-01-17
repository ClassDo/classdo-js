import { types } from 'typed-graphqlify'
import { RoomsResult, RoomKeys, RoomOption, buildRoomsQuery } from './Rooms'
import { RoomMemberKeys } from './RoomMembers'
import { OrganizationKeys } from './Organizations'
import { pick } from '../Utils'
import { ViewerRoomsArgs } from '../generated/graphql'

const Viewer = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type ViewerType = typeof Viewer
export type ViewerKeys = keyof typeof Viewer
export type ViewerOption<R, R_O, R_M> = {
  rooms?: {
    fields: R[],
    args?: ViewerRoomsArgs,
    with?: RoomOption<R_O, R_M>
  }
}

export type ViewerResult<V extends ViewerKeys, R> =
  Pick<ViewerType, V> & (R extends {} ? { rooms: R } : {})

export function buildViewerQuery <
  V extends ViewerKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_M extends RoomMemberKeys | null,
> (fields: V[], option: ViewerOption<R, R_O, R_M>):
  { viewer:
    ViewerResult<V, RoomsResult<R, R_O, R_M>>
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