import { ClassDoAPIClient, Result } from '.';
import { ViewerKeys, ViewerOption, ViewerResult, buildViewerQuery } from '../models/Viewer';
import { RoomKeys } from '../models/Rooms';
import { OrganizationKeys } from '../models/Organizations';
import { RoomMemberKeys } from '../models/RoomMembers';
import { UserKeys } from '../models/Users';
import { UserProfileKeys } from '../models/UserProfiles';
import { OrganizationMemberKeys } from '../models/OrganizationMembers';
import { OrganizationMemberRoleKeys } from '../models/OrganizationMemberRoles';
import { EmailKeys } from '../models/Emails';
import { BillingKeys, BillingRecordKeys, UsageLedgerKeys } from '../models/Billing';

 /** Client to call Viewer schema */
export class ViewerClient {
  /** @ignore */
  constructor(private client: ClassDoAPIClient) {}

  /**
   * Get viewer.
   * 
   * ```typescript
   * client.viewer.get(['id'], { rooms: { fields: ['id', 'name'] }}).then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[Viewer]] key names. Returns specified fields as result.
   * @param option 
   */
  async get<
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
  >(fields: V[], option?: ViewerOption<
    R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E,
    OM, OM_U, OM_U_UP, OM_U_UP_E, OM_OMR,
    OMR,
    B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL
  >):
    Promise<Result<
      ViewerResult<
        V, R, R_O, R_M, R_M_U, R_M_U_UP, R_M_U_UP_E, OM, OM_U, OM_U_UP, OM_U_UP_E, OM_OMR, OMR,
        B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL
      >
    >> {
    const result = await this.client.query({ viewer: buildViewerQuery(fields, option) })
    return {
      errors: result.errors,
      data: result.errors ? null : result.data.viewer
    }
  }
}