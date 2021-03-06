import { ClassDoAPIClient, Result } from '.'
import { BillingKeys, BillingOption, BillingRecordKeys, UsageLedgerKeys, BillingResult } from '../models/Billing'
import { UserKeys } from '../models/Users'
import { UserProfileKeys } from '../models/UserProfiles'
import { EmailKeys } from '../models/Emails'
import { RoomKeys } from '../models/Rooms'
import { ViewerBillingArgs } from '../generated/graphql'
import { buildViewerQuery } from '../models/Viewer'


/** Client to call Billing schema */
export class BillingClient {
  /** @ignore */
  constructor(private client: ClassDoAPIClient) {}

 /**
  * Get billing information.
  * 
  * ```typescript
  * client.billing.get(
  *   ['id', 'month', 'year'],
  *   { input: { year: Number(req.query.year), month: Number(req.query.month) } },
  *   {
  *     records: {
  *       fields: ['id', 'date'],
  *       with: {
  *         usages: {
  *           fields: ['paidSec', 'amount', 'ledgerType'],
  *           with: {
  *             user: {
  *               fields: ['id'], with: { profile: { fields: ['firstName'] } }
  *             },
  *             room: { fields: ['name'] }
  *           }
  *         },
  *         freeCredits: { fields: ['paidSec', 'amount', 'ledgerType']},
  *         topups: { fields: ['paidSec', 'amount', 'ledgerType']},
  *       }
  *     }
  *   }
  * )
  * ```
  * 
  * @param fields Array of [[Billing]] key names. Returns specified fields as result.
  * @param args 
  * @param option 
  */
 async get<
    B extends BillingKeys,
    BR extends BillingRecordKeys | null,
    BR_UL extends UsageLedgerKeys | null,
    BR_UL_U extends UserKeys | null,
    BR_UL_U_P extends UserProfileKeys | null,
    BR_UL_U_P_E extends EmailKeys | null,
    BR_UL_R extends RoomKeys | null,
    BR_FUL extends UsageLedgerKeys | null,
    BR_TUL extends UsageLedgerKeys | null
  >(
    fields: B[],
    args: ViewerBillingArgs,
    option: BillingOption<BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL>
  ): Promise<Result<BillingResult<B, BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL>>> {
    const result = await this.client.query({
      viewer: buildViewerQuery(['id'], {
        billing: { fields, args, with: option }
      })
    })
    const data = (result.data.viewer as any).billing
    return { errors: result.errors, data }
  }
}
