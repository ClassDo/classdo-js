import { types } from 'typed-graphqlify'
import { RoomKeys, RoomOption, buildRoomsQuery, RoomsResult } from './Rooms'
import { RoomMemberKeys } from './RoomMembers'
import { OrganizationKeys } from './Organizations'
import { pick } from '../Utils'
import { ViewerRoomsArgs, OrganizationMembersArgs, OrganizationRolesArgs, ViewerBillingArgs } from '../generated/graphql'
import { UserKeys } from './Users'
import { UserProfileKeys } from './UserProfiles'
import { OrganizationMemberKeys, OrganizationMembersOption, buildOrganizationMembersQuery, OrganizationMembersResult } from './OrganizationMembers'
import { OrganizationMemberRoleKeys, buildOrganizationMemberRolesQuery, OrganizationMemberRolesResult } from './OrganizationMemberRoles'
import { EmailKeys } from './Emails'
import { BillingOption, BillingKeys, BillingResult, BillingRecordKeys, UsageLedgerKeys, buildBillingQuery } from './Billing'

const Viewer = {
  id: types.string,
  name: types.string,
  logoImageUrl: types.string
}

export type ViewerType = typeof Viewer
export type ViewerKeys = keyof typeof Viewer
export type ViewerOption<
  R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E,
  OM, OM_U, OM_U_UP, OM_U_UP_E, OM_OMR, OMR,
  B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL
> = {
  rooms?: {
    fields: R[],
    args?: ViewerRoomsArgs | undefined | null,
    with?: RoomOption<R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E>
  },
  members?: {
    fields: OM[],
    args?: OrganizationMembersArgs | undefined | null,
    with?: OrganizationMembersOption<OM_U, OM_U_UP, OM_U_UP_E, OM_OMR>
  },
  roles?: {
    fields: OMR[],
    args?: OrganizationRolesArgs | undefined | null
  },
  billing?: {
    fields: B[],
    args: ViewerBillingArgs,
    with?: BillingOption<BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL>
  }
}

export type ViewerResult<
  V extends ViewerKeys,
  R extends RoomKeys | null = null,
  R_O extends OrganizationKeys | null = null,
  R_M extends RoomMemberKeys | null = null,
  R_M_U extends UserKeys | null = null,
  R_M_U_UP extends UserProfileKeys | null = null,
  R_M_U_UP_E extends EmailKeys | null = null,
  OM extends OrganizationMemberKeys | null = null,
  OM_U extends UserKeys | null = null,
  OM_U_UP extends UserProfileKeys | null = null,
  OM_U_UP_E extends EmailKeys | null = null,
  OM_OMR extends OrganizationMemberRoleKeys | null = null,
  OMR extends OrganizationMemberRoleKeys | null = null,
  B extends BillingKeys | null = null,
  BR extends BillingRecordKeys | null = null,
  BR_UL extends UsageLedgerKeys | null = null,
  BR_UL_U extends UserKeys | null = null,
  BR_UL_U_P extends UserProfileKeys | null = null,
  BR_UL_U_P_E extends EmailKeys | null = null,
  BR_UL_R extends RoomKeys | null = null,
  BR_FUL extends UsageLedgerKeys | null = null,
  BR_TUL extends UsageLedgerKeys | null = null
> =
  Pick<ViewerType, V> &
  ([R] extends [RoomKeys] ? { rooms: RoomsResult<R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E> } : {}) &
  ([OM] extends [OrganizationMemberKeys] ? { members: OrganizationMembersResult<OM, OM_U, OM_U_UP, OM_U_UP_E, OM_OMR> } : {}) &
  ([OMR] extends [OrganizationMemberRoleKeys] ? { roles: OrganizationMemberRolesResult<OMR> } : {}) &
  ([B] extends [BillingKeys] ? { billing: BillingResult<B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL> } : {})

/**
 * @ignore
 */
export function buildViewerQuery <
  V extends ViewerKeys,
  R extends RoomKeys | null,
  R_O extends OrganizationKeys | null,
  R_M extends RoomMemberKeys | null,
  R_M_U extends UserKeys | null,
  R_M_U_UP extends UserProfileKeys | null,
  R_M_U_UP_E extends EmailKeys | null,
  OM extends OrganizationMemberKeys | null,
  OM_U extends UserKeys | null,
  OM_U_UP extends UserProfileKeys | null,
  OM_U_UP_E extends EmailKeys | null,
  OM_OMR extends OrganizationMemberRoleKeys | null,
  OMR extends OrganizationMemberRoleKeys | null,
  B extends BillingKeys | null,
  BR extends BillingRecordKeys | null,
  BR_UL extends UsageLedgerKeys | null,
  BR_UL_U extends UserKeys | null,
  BR_UL_U_P extends UserProfileKeys | null,
  BR_UL_U_P_E extends EmailKeys | null,
  BR_UL_R extends RoomKeys | null,
  BR_FUL extends UsageLedgerKeys | null,
  BR_TUL extends UsageLedgerKeys | null
> (fields: V[],
   option?: ViewerOption<
     R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E,
     OM, OM_U, OM_U_UP, OM_U_UP_E, OM_OMR,
     OMR,
     B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL
   >
  ): ViewerResult<
    V,
    R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E,
    OM, OM_U, OM_U_UP, OM_U_UP_E, OM_OMR,
    OMR,
    B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL
  > {
  const pickedFields: any = pick(Viewer, fields || [])
  if (option && option.rooms) {
    pickedFields['rooms'] = buildRoomsQuery(
      option.rooms.fields as any,
      option.rooms.args,
      option.rooms.with || {}
    )
  }
  if (option && option.members) {
    pickedFields['members'] = buildOrganizationMembersQuery(
      option.members.fields as any,
      option.members.args,
      option.members.with || {}
    )
  }
  if (option && option.roles) {
    pickedFields['roles'] = buildOrganizationMemberRolesQuery(
      option.roles.fields as any,
      option.roles.args
    )
  }
  if (option && option.billing) {
    pickedFields['billing'] = buildBillingQuery(
      option.billing.fields as any,
      option.billing.args,
      option.billing.with
    )
  }
  return pickedFields
}