import { Client, Result } from '.'
import { InvitationKeys, buildSendInvitationMutation, InvitationOption, InvitationResult } from '../models/Invitations';
import { RoomKeys } from '../models/Rooms';
import { OrganizationKeys } from '../models/Organizations';
import { RoomMemberKeys } from '../models/RoomMembers';
import { UserKeys } from '../models/Users';
import { UserProfileKeys } from '../models/UserProfiles';
import { MutationSendInvitationArgs } from '../generated/graphql';

export class InvitatationsClient {
  constructor(private client: Client) {}

  async send<
    I extends InvitationKeys,
    R extends RoomKeys | null,
    R_O extends OrganizationKeys | null,
    R_RM extends RoomMemberKeys | null,
    R_RM_U extends UserKeys | null,
    R_RM_U_UP extends UserProfileKeys | null,
    O extends OrganizationKeys | null
  >(
    fields: I[],
    args: MutationSendInvitationArgs,
    option?: InvitationOption<R, R_O, R_RM, R_RM_U, R_RM_U_UP, O>
  ): Promise<Result<InvitationResult<I, R, R_O, R_RM, R_RM_U, R_RM_U_UP, O>>> {
    const result = await this.client.mutate(
      buildSendInvitationMutation(fields, args, option)
    )
    return { errors: result.errors, data: result.data?.sendInvitation || null }
  }
}