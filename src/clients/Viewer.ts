import { Client, Result } from '.';
import { ViewerKeys, ViewerOption, ViewerResult, buildViewerQuery } from '../models/Viewer';
import { RoomKeys } from '../models/Rooms';
import { OrganizationKeys } from '../models/Organizations';
import { RoomMemberKeys } from '../models/RoomMembers';
import { UserKeys } from '../models/Users';
import { UserProfileKeys } from '../models/UserProfiles';
import { OrganizationMemberKeys } from '../models/OrganizationMembers';
import { OrganizationMemberRoleKeys } from '../models/OrganizationMemberRoles';

export class ViewerClient {
  constructor(private client: Client) {}

  async get<
    V extends ViewerKeys,
    R extends RoomKeys | null,
    R_O extends OrganizationKeys | null,
    R_M extends RoomMemberKeys | null,
    R_M_U extends UserKeys | null,
    R_M_U_UP extends UserProfileKeys | null,
    OM extends OrganizationMemberKeys | null,
    OM_U extends UserKeys | null,
    OM_U_UP extends UserProfileKeys | null,
    OM_OMR extends OrganizationMemberRoleKeys | null,
    OMR extends OrganizationMemberRoleKeys | null,
  >(fields: V[], option?: ViewerOption<
    R, R_O, R_M, R_M_U, R_M_U_UP,
    OM, OM_U, OM_U_UP, OM_OMR,
    OMR
  >):
    Promise<Result<
      ViewerResult<
        V, R, R_O, R_M, R_M_U, R_M_U_UP, OM, OM_U, OM_U_UP, OM_OMR, OMR
      >
    >> {
    const result = await this.client.query({ viewer: buildViewerQuery(fields, option) })
    return {
      errors: result.errors,
      data: result.errors ? null : result.data.viewer
    }
  }
}