import { params, types } from 'typed-graphqlify'
import { RoomKeys, RoomOption, RoomResult, buildRoomQuery } from './Rooms'
import { OrganizationKeys, OrganizationType, buildOrganizationQuery } from './Organizations'
import { pick, preprocessArgs } from '../Utils'
import { ContactType, InvitationStatus, MutationSendInvitationArgs } from '../generated/graphql'
import { RoomMemberKeys } from './RoomMembers'
import { UserKeys } from './Users'
import { UserProfileKeys } from './UserProfiles'

export const Invitation = {
  id: types.string,
  contactType: types.oneOf(ContactType),
  contactInfo: types.string,
  contactFullName: types.string,
  status: types.oneOf(InvitationStatus)
}

export type InvitationType = typeof Invitation
export type InvitationKeys = keyof InvitationType
export type InvitationResult<
  I extends InvitationKeys | null,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_RM extends RoomMemberKeys | null,
  R_RM_U extends UserKeys | null,
  R_RM_U_UP extends UserProfileKeys | null,
  O extends OrganizationKeys | null,
> =
  ([I] extends [InvitationKeys] ? Pick<InvitationType, I> : {}) &
  ([R] extends [RoomKeys] ? { room: RoomResult<R, R_O, R_RM, R_RM_U, R_RM_U_UP> } : {}) &
  ([O] extends [OrganizationKeys] ? { profile: Pick<OrganizationType, O> } : {})

export type InvitationOption<R, R_O, RM, RM_U, RM_U_UP, O> = {
  room?: { fields: R[], with: RoomOption<R_O, RM, RM_U, RM_U_UP> },
  organization?: { fields: O[] }
}

function resolveOption<
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_RM extends RoomMemberKeys | null,
  R_RM_U extends UserKeys | null,
  R_RM_U_UP extends UserProfileKeys | null,
  O extends OrganizationKeys | null
>(option: InvitationOption<R, R_O, R_RM, R_RM_U, R_RM_U_UP, O>) {
  const org = option.organization ?
    { organization: buildOrganizationQuery(option.organization.fields as any) } : {}
  const room = option.room ?
    { room: buildRoomQuery(option.room.fields as any, option.room.with) } : {}
  return { ...org, ...room }
}

export function buildInvitationQuery<
  I extends InvitationKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_RM extends RoomMemberKeys | null,
  R_RM_U extends UserKeys | null,
  R_RM_U_UP extends UserProfileKeys | null,
  O extends OrganizationKeys | null
>(
  fields: I[],
  option?: InvitationOption<R, R_O, R_RM, R_RM_U, R_RM_U_UP, O>
): InvitationResult<I, R, R_O, R_RM, R_RM_U, R_RM_U_UP, O> {
  const pickedField: any = pick(Invitation, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return { ...pickedField, ...resolvedOption }
}

export function buildSendInvitationMutation<
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
): { sendInvitation: InvitationResult<I, R, R_O, R_RM, R_RM_U, R_RM_U_UP, O> } {
  const pickedFields: any = pick(Invitation, fields)
  const resolvedOption = option ? resolveOption(option) : {}
  return {
     sendInvitation: params(preprocessArgs(args), { ...pickedFields, ...resolvedOption })
  }
}