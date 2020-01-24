import { Client, Result } from '.';
import { OrganizationMemberKeys, OrganizationMembersOption, OrganizationMembersResult, OrganizationMemberResult } from '../models/OrganizationMembers';
import { UserKeys } from '../models/Users';
import { UserProfileKeys } from '../models/UserProfiles';
import { OrganizationMemberRoleKeys } from '../models/OrganizationMemberRoles';
import { OrganizationMembersArgs } from '../generated/graphql';
import { buildViewerQuery } from '../models/Viewer';

export class OrganizationMembersClient {
  constructor(private client: Client) {}

  async list<
    OM extends OrganizationMemberKeys | null,
    OM_U extends UserKeys | null,
    OM_U_UP extends UserProfileKeys | null,
    OM_OMR extends OrganizationMemberRoleKeys | null,
  >(
    fields: OM[],
    args?: OrganizationMembersArgs | null | undefined,
    option?: OrganizationMembersOption<OM_U, OM_U_UP, OM_OMR>
  ): Promise<Result<OrganizationMembersResult<OM, OM_U, OM_U_UP, OM_OMR>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        members: { fields: fields, args: args, with: option }
      })
    })
    return {
      errors: result.errors,
      data: result.errors ? null : (result.data.viewer as any).members
    }
  }

  async get<
    OM extends OrganizationMemberKeys | null,
    OM_U extends UserKeys | null,
    OM_U_UP extends UserProfileKeys | null,
    OM_OMR extends OrganizationMemberRoleKeys | null,
  >(
    fields: OM[],
    id: string,
    option?: OrganizationMembersOption<OM_U, OM_U_UP, OM_OMR>
  ): Promise<Result<OrganizationMemberResult<OM, OM_U, OM_U_UP, OM_OMR>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        members: { fields: fields, args: { input: { where: { id: id } } }, with: option }
      })
    })
    const data = (result.data.viewer as any).members?.edges[0]?.node || null
    if (!data) {
      throw new Error(`not found organization member: ${id}`)
    }
    return { errors: result.errors, data }
  }
}
