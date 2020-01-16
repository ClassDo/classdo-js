import { params, types } from 'typed-graphqlify'
import { RoomsInput } from '../generated/graphql'
import { Organization, OrganizationType, OrganizationKeys } from './Organizations'
import { RoomMember, RoomMemberType, RoomMemberKeys, buildRoomMembers } from './RoomMembers'
import { pick } from './Core'

export const Room = {
  id: types.string,
  name: types.string,
  description: types.string
}

export type RoomType = typeof Room
export type RoomKeys = keyof RoomType
export type RoomOption<O, M> = {
  organization?: { fields: O[] },
  members?: { fields: M[] }
}

export const buildRoomEdge = <T> (room: T) => ({
  node: room,
  cursor: types.string
})

export const buildRooms = <T> (args: any, room: T) => (
  params(args, {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildRoomEdge(room)]
   }
 )
)

export type RoomResult<R, O, RM> =
  R & (O extends {} ? { organization: O } : {})
    & (RM extends {} ? { members: RM } : {})

export type RoomsResult<R, O, RM> = {
  totalCount: number,
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor: string | undefined,
    endCursor: string | undefined
  },
  edges: {
    cursor: string
    node: RoomResult<R, O, RM>
  }[]
}

export type BuildRoomsQueryParams<R, O, RM> = {
  args?: RoomsInput,
  fields: R[],
  with?: RoomOption<O, RM>
}
export function buildRoomsQuery
  <R extends (RoomKeys | null),
   O extends (OrganizationKeys | null),
   RM extends (RoomMemberKeys | null)
  >(
    params: BuildRoomsQueryParams<R, O, RM>
  ): RoomsResult<
    R extends RoomKeys ? Pick<RoomType, R> : null,
    O extends OrganizationKeys ? Pick<OrganizationType, O> : null,
    RM extends RoomMemberKeys ? Pick<RoomMemberType, RM> : null
  > {
  const pickedFields: any = pick(Room, params.fields as any || [])
  if (params.with && params.with.organization) {
    pickedFields['organization'] = pick(Organization, params.with.organization.fields as any)
  }
  if (params.with && params.with.members) {
    pickedFields['members'] = buildRoomMembers(pick(RoomMember, params.with.members.fields as any))
  }
  return buildRooms(params.args || { input: {}}, pickedFields)
}
