import { ClassDoAPIClient, Result } from '.'
import { RoomKeys, RoomOption, RoomsResult, RoomResult, buildCreateRoomMutation, buildDeleteRoomMutation } from '../models/Rooms'
import { OrganizationKeys } from '../models/Organizations'
import { RoomMemberKeys } from '../models/RoomMembers'
import { UserKeys } from '../models/Users'
import { UserProfileKeys } from '../models/UserProfiles'
import { ViewerRoomsArgs, MutationCreateRoomArgs, MutationDeleteRoomArgs } from '../generated/graphql'
import { buildViewerQuery } from '../models/Viewer'
import { EmailKeys } from '../models/Emails'

/** Client to call Rooms schema and mutation for rooms */
export class RoomsClient {
  /** @ignore */
  constructor(private client: ClassDoAPIClient) {}

  /**
   * Get a room.
   * 
   * ```typescript
   * client.rooms.get(['id'], 'xxxxxxxxxxxx').then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[Room]] key names. Returns specified fields as result.
   * @param id Room id.
   * @param option 
   */
  async get<
    R extends RoomKeys,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
    R_M_U_UP_E extends EmailKeys | null,
  >(fields: R[],
    id: string,
    option?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E>
  ): Promise<Result<RoomResult<R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E>>> {
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

  /**
   * Get list of rooms.
   * 
   * ```typescript
   * client.rooms.list(['id']).then(v => {
   *   console.log(result)
   * })
   * ```
   * 
   * @param fields Array of [[Room]] key names. Returns specified fields as result.
   * @param args 
   * @param option 
   */
  async list<
    R extends RoomKeys,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
    R_M_U_UP_E extends EmailKeys | null,
  >(fields: R[],
    args?: ViewerRoomsArgs | undefined | null,
    option?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E>
  ): Promise<Result<RoomsResult<R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E>>> {
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

  /**
   * Create new room.
   * 
   * ```typescript
   * client.rooms.create(['id'], { data: {
   *   name: 'newRoom',
   *   description: 'description'
   * }}).then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * If you want to change "exit room" link url to be along with your own application, you can update it by `exitRoomLink`.
   *
   * ```typescript
   * client.rooms.create(['id'], {
   *   data: {
   *     name: 'newRoom',
   *     description: 'description',
   *     exitRoomLink: 'https://yourown.application.com'
   *   }
   * })
   * ```
   * 
   * @param fields Array of [[Room]] key names. Returns specified fields as result.
   * @param args 
   * @param option 
   */
  async create<
    R extends RoomKeys,
    O extends OrganizationKeys | null,
    RM extends RoomMemberKeys | null,
    RM_U extends UserKeys | null,
    RM_U_UP extends UserProfileKeys | null,
    RM_U_UP_E extends EmailKeys | null,
  >(
    fields: R[],
    args: MutationCreateRoomArgs,
    option?: RoomOption<O, RM, RM_U, RM_U_UP, RM_U_UP_E>
  ): Promise<Result<RoomResult<R, O, RM, RM_U, RM_U_UP, RM_U_UP_E>>> {
    const result = await this.client.mutate(buildCreateRoomMutation(fields, args, option))
    return {
      errors: result.errors,
      data: result.errors ? null : result.data?.createRoom || null
    }
  }

  /**
   * Delete a room.
   * 
   * ```typescript
   * client.rooms.delete(['id'], { id: 'xxxxxxxxxxxx' }).then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[Room]] key names. Returns specified fields as result.
   * @param args 
   */
  async delete<R extends RoomKeys>(fields: R[], args: MutationDeleteRoomArgs) {
    const result = await this.client.mutate(buildDeleteRoomMutation(fields, args))
    return {
      errors: result.errors,
      data: result.errors ? null : result.data?.deleteRoom || null
    }
  }
}