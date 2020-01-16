import { Client } from '../Client'
import { types, query } from 'typed-graphqlify'
import { RoomType, RoomsResult, RoomKeys, RoomOption, buildRoomsQuery } from './Rooms'
import { RoomMemberKeys, RoomMemberType } from './RoomMembers'
import { OrganizationKeys, OrganizationType } from './Organizations'
import { pick } from './Core'
import { RoomsInput } from '../generated/graphql'
import gql from 'graphql-tag'

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
    args?: RoomsInput,
    with?: RoomOption<R_O, R_M>
  }
}

export type ViewerResult<V, R> =
  V & (R extends {} ? { rooms: R } : {})

export function buildViewerQuery <
  V extends ViewerKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_M extends RoomMemberKeys | null,
> (fields: V[], option: ViewerOption<R, R_O, R_M>):
  { viewer:
    ViewerResult<V,
      RoomsResult<
        R extends RoomKeys ? Pick<RoomType, R> : null,
        R_O extends OrganizationKeys ? Pick<OrganizationType, R_O> : null,
        R_M extends RoomMemberKeys ? Pick<RoomMemberType, R_M> : null
      >
    >
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

const client = new Client({ apiKey: 'u6SlsOP2Va2iaW5NjBm1I9c1XeLhhJiW36euYc2h' })
const src = buildViewerQuery(['id'], {
  rooms: {
    fields: ['id', 'name'],
    with: {
      organization: { fields: ['id'] },
      members: { fields: ['id'] },
    }
  }
})
src.viewer.rooms.edges[0].node.organization.id
src.viewer.rooms.edges[0].node.members.id
const result = client.getClient().query({ query: gql(query(src))})
console.log(result)
result.then(v => {
  console.log(v)
})