import { types } from 'typed-graphqlify'
import { RoomType, RoomsResult, RoomKeys, buildRoomsQuery, BuildRoomsQueryParams } from './Rooms'
import { RoomMemberKeys, RoomMemberType } from './RoomMembers'
import { OrganizationKeys, OrganizationType } from './Organizations'
import { pick } from './Core'

const Viewer = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type ViewerType = typeof Viewer
export type ViewerKeys = keyof typeof Viewer
export type ViewerOption<R, R_O, R_M> = {
  rooms?: BuildRoomsQueryParams<R, R_O, R_M>
}

export type ViewerResult<V, R> =
  V & (R extends {} ? { rooms: R } : {})

export type BuildViewerParams<V, R, R_O, R_M> = {
  fields: V[], with: ViewerOption<R, R_O, R_M>
}

export function buildViewerQuery <
  V extends ViewerKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_M extends RoomMemberKeys | null,
> (params: BuildViewerParams<V, R, R_O, R_M>):
  { viewer:
    ViewerResult<V,
      RoomsResult<
        R extends RoomKeys ? Pick<RoomType, R> : null,
        R_O extends OrganizationKeys ? Pick<OrganizationType, R_O> : null,
        R_M extends RoomMemberKeys ? Pick<RoomMemberType, R_M> : null
      >
    >
  } {
  const pickedFields: any = pick(Viewer, params.fields || [])
  if (params.with.rooms) {
    pickedFields['rooms'] = buildRoomsQuery(params.with.rooms)
  }
  return { viewer: pickedFields }
}
