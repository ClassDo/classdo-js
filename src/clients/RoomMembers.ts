import { ClassDoAPIClient, Result } from '.'
import {
  RoomMemberKeys,
  RoomMembersOption,
  RoomMemberResult,
  buildAddRoomMembersMutation,
  buildDeleteRoomMemberMutation,
  RoomMembersResult
} from '../models/RoomMembers';
import { UserKeys } from '../models/Users';
import { UserProfileKeys } from '../models/UserProfiles';
import { MutationAddRoomMembersArgs, MutationDeleteRoomMemberArgs, RoomMembersArgs } from '../generated/graphql';
import { buildViewerQuery } from '../models/Viewer';

/** Client to call RoomMembers schema */
export class RoomMembersClient {
  /** @ignore */
  constructor(private client: ClassDoAPIClient) {}
  
  /**
   * Get a room member.
   * 
   * ```typescript
   * client.roomMembers.get(['id'], 'xxxxxxxxxxxx').then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[RoomMember]] key names. Returns specified fields as result.
   * @param id 
   * @param option 
   */
  async get<
    RM extends RoomMemberKeys,
    U extends UserKeys | null,
    U_UP extends UserProfileKeys | null
  >(
    fields: RM[],
    id: string,
    option?: RoomMembersOption<U, U_UP>
  ): Promise<Result<RoomMembersResult<RM, U, U_UP>>> {
    
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        rooms: {
          fields: ['id'],
          args: { input: { where: { members_some: { id } } } },
          with: {
            members: {
              fields,
              args: { input: { where: { id } } },
              with: option
            }
          }
        }
      })
    })
    const data = (result.data.viewer as any).rooms?.edges[0]?.node?.members.edges[0]?.node || null
    if (!data) {
      throw new Error(`not found room member: ${id}`)
    }
    return {
      errors: result.errors,
      data: (result.data.viewer.rooms.edges[0].node as any).members.edges[0]?.node
    }
  }

  /**
   * Get list of room members.
   * 
   * ```typescript
   * client.roomMembers.list(['id'], 'xxxxxxxxxxxx').then(v => {
   *   console.log(v)
   * })
   * ```
   * @param fields Array of [[RoomMember]] key names. Returns specified fields as result.
   * @param roomId Room id.
   * @param args 
   * @param option 
   */
  async list<
    RM extends RoomMemberKeys,
    U extends UserKeys | null,
    U_UP extends UserProfileKeys | null
  >(
    fields: RM[],
    roomId: string,
    args?: RoomMembersArgs,
    option?: RoomMembersOption<U, U_UP>
  ): Promise<Result<RoomMembersResult<RM, U, U_UP>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        rooms: {
          fields: ['id'],
          args: { input: { where: { id: roomId } } },
          with: {
            members: {
              fields,
              args,
              with: option
            }
          }
        }
      })
    })
    if (!(result.data.viewer as any).rooms?.edges[0]?.node) {
      throw new Error(`not found room: ${roomId}`)
    }
    return {
      errors: result.errors,
      data: (result.data.viewer.rooms.edges[0].node as any).members
    }
  }

  /**
   * Add new room member into the room.
   * 
   * ```typescript
   * client.roomMembers.create(['id'], { data: { roomId: 'xxxxxxxxxxxx', userIds: ['xxxxxxxxxxxx'] }}).then(v => {
   *   console.log(result)
   * })
   * ```
   * 
   * @param fields Array of [[RoomMember]] key names. Returns specified fields as result.
   * @param args 
   * @param option 
   */
  async create<
    RM extends RoomMemberKeys,
    U extends UserKeys | null,
    U_UP extends UserProfileKeys | null,
  > (
    fields: RM[],
    args: MutationAddRoomMembersArgs,
    option?: RoomMembersOption<U, U_UP>
  ): Promise<Result<RoomMemberResult<RM, U, U_UP>[]>> {
    const result = await this.client.mutate(
      buildAddRoomMembersMutation(fields, args, option)
    )
    return {
      errors: result.errors,
      data: result.data?.addRoomMembers || null
    }
  }

  /**
   * Remove a room member.
   * 
   * ```typescript
   * client.roomMembers.delete(['id'], { id: 'xxxxxxxxxxxx' }).then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[RoomMember]] key names. Returns specified fields as result.
   * @param args 
   */
  async delete<RM extends RoomMemberKeys>(
    fields: RM[],
    args: MutationDeleteRoomMemberArgs
  ): Promise<Result<RoomMemberResult<RM>>> {
    const result = await this.client.mutate(
      buildDeleteRoomMemberMutation(fields, args)
    )
    return {
      errors: result.errors,
      data: result.data?.deleteRoomMember || null
    }
  }
}
