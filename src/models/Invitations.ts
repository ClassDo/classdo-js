import { types } from 'typed-graphqlify'
import { RoomKeys, RoomOption, RoomResult, buildRoomQuery } from './Rooms'
import { OrganizationKeys, OrganizationType, Organization } from './Organizations'
import { pick } from '../Utils'
import { ContactType, InvitationStatus } from '../generated/graphql'
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

export type InvitationOption<R, O, RM, RM_U, RM_U_UP> = {
  room?: { fields: R[], with: RoomOption<O, RM, RM_U, RM_U_UP> },
  organization?: { fields: O[] }
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
  option: InvitationOption<R, R_O, R_RM, R_RM_U, R_RM_U_UP>
): InvitationResult<I, R, R_O, R_RM, R_RM_U, R_RM_U_UP, O> {
  const pickedField: any = pick(Invitation, fields)
  if (option.organization) {
    pickedField['organization'] = pick(Organization, option.organization.fields as any)
  }
  if (option.room) {
    pickedField['room'] = buildRoomQuery(option.room.fields as any, option.room.with)
  }
  return pickedField
}