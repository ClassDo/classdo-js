import { Client, Result } from '.';
import { OrganizationMemberRoleKeys, OrganizationMemberRolesResult } from 'src/models/OrganizationMemberRoles';
import { OrganizationRolesArgs } from '../generated/graphql';
import { buildViewerQuery } from '../models/Viewer';

export class RolesClient {
  constructor(private client: Client) {}

  async list<OMR extends OrganizationMemberRoleKeys | null>(
    fields: OMR[],
    args?: OrganizationRolesArgs | null | undefined
  ): Promise<Result<OrganizationMemberRolesResult<OMR>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], { roles: { fields: fields, args: args } })
    })
    return {
      errors: result.errors,
      data: result.errors ? null : (result.data.viewer as any).roles
    }
  }

  async get<OMR extends OrganizationMemberRoleKeys | null>(
    fields: OMR[],
    id: string
  ): Promise<Result<OrganizationMemberRolesResult<OMR>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], { roles: { fields: fields } })
    })
    const data = (result.data.viewer as any).roles?.edges[0]?.node || null
    if (!data) {
      throw new Error(`not found role: ${id}`)
    }
    return { errors: result.errors, data }
  }
}
