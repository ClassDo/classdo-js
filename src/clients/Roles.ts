import { ClassDoAPIClient, Result } from '.';
import { OrganizationMemberRoleKeys, OrganizationMemberRolesResult } from 'src/models/OrganizationMemberRoles';
import { OrganizationRolesArgs } from '../generated/graphql';
import { buildViewerQuery } from '../models/Viewer';


/** Client to call OrganizationMemberRoles schema */
export class RolesClient {
  constructor(private client: ClassDoAPIClient) {}

  /**
   * Get list of OrganizationMemberRoles.
   * 
   * ```
   * const rolesResult = client.roles.list(['id', 'name']).then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[OrganizationMemberRole]] key names. Returns specified fields as result.
   * @param args 
   */
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

  /**
   * Get a role.
   * 
   * ```
   * client.roles.get(['id'], 'xxxxxxxxxxx').then(v => {
   *   console.log(v)
   * })
   * ```
   * 
   * @param fields Array of [[OrganizationMemberRole]] key names. Returns specified fields as result.
   * @param id OrganizationMemberRole id.
   */
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
