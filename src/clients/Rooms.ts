import { Client, Result } from '.'
import { RoomKeys, RoomOption, RoomsResult, RoomResult, buildCreateRoomMutation, buildDeleteRoomMutation } from '../models/Rooms'
import { OrganizationKeys } from '../models/Organizations'
import { RoomMemberKeys } from '../models/RoomMembers'
import { UserKeys } from '../models/Users'
import { UserProfileKeys } from '../models/UserProfiles'
import { ViewerRoomsArgs, MutationCreateRoomArgs, MutationDeleteRoomArgs } from '../generated/graphql'
import { buildViewerQuery } from '../models/Viewer'

export class RoomsClient {
  constructor(private client: Client) {}

  async get<
    R extends RoomKeys,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
  >(fields: R[],
    id: string,
    option?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP>
  ): Promise<Result<RoomResult<R, R_O, R_M, R_M_U, R_M_U_UP>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        rooms: { fields: fields, args: { input: { where: { id } } }, with: option }
      })
    })
    const data = (result.data.viewer as any).rooms?.edges[0]?.node || null
    if (!data) {
      throw new Error(`not found room: ${id}`)
    }
    return { errors: result.errors, data }
  }

  async list<
    R extends RoomKeys,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
  >(fields: R[],
    args?: ViewerRoomsArgs | undefined | null,
    option?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP>
  ): Promise<Result<RoomsResult<R, R_O, R_M, R_M_U, R_M_U_UP>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        rooms: { fields: fields, args: args, with: option }
      })
    })
    return {
      errors: result.errors,
      data: result.errors ? null : (result.data.viewer as any).rooms
    }
  }

  async create<
    R extends RoomKeys,
    O extends OrganizationKeys | null,
    RM extends RoomMemberKeys | null,
    RM_U extends UserKeys | null,
    RM_U_UP extends UserProfileKeys | null,
  >(
    fields: R[],
    args: MutationCreateRoomArgs,
    option?: RoomOption<O, RM, RM_U, RM_U_UP>
  ): Promise<Result<RoomResult<R, O, RM, RM_U, RM_U_UP>>> {
    const result = await this.client.mutate(buildCreateRoomMutation(fields, args, option))
    return {
      errors: result.errors,
      data: result.errors ? null : result.data?.createRoom || null
    }
  }

  async delete<R extends RoomKeys>(fields: R[], args: MutationDeleteRoomArgs) {
    const result = await this.client.mutate(buildDeleteRoomMutation(fields, args))
    return {
      errors: result.errors,
      data: result.errors ? null : result.data?.deleteRoom || null
    }
  }
}